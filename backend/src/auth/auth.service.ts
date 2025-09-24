import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {

  // Logger para registrar informações e eventos relacionados à autenticação
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService, // Serviço para manipulação de usuários
    private jwtService: JwtService, // Serviço para geração e verificação de tokens JWT
    private configService: ConfigService, // Serviço para acessar variáveis de configuração
  ) { }

  // Método para realizar login
  async login(
    email: string,
    pass: string,
  ): Promise<{ accessToken: string}> {
    // Busca o usuário pelo email
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // Caso o usuário não seja encontrado, registra um aviso e lança uma exceção
      // this.logger.warn(`Tentativa de login falhou para o email: ${email} (usuário não encontrado)`);
      throw new UnauthorizedException('Usuário não encontrado');
    }

    // Verifica se a senha fornecida corresponde à senha armazenada
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      // Caso a senha esteja incorreta, registra um aviso e lança uma exceção
      // this.logger.warn(`Tentativa de login falhou para o email: ${email} (senha incorreta)`);
      throw new UnauthorizedException('Senha inválida');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.setCurrentRefreshToken(tokens.refreshToken, user.id);
    return tokens;
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.update(userId, {
      currentHashedRefreshToken,
    });
  }

  async getTokens(userId: number, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '15m', // Access token de curta duração
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME'), // Refresh token de longa duração (ex: '7d')
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findOne(userId);
    if (!user || !user.currentHashedRefreshToken) {
      throw new ForbiddenException('Acesso Negado');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (!refreshTokenMatches) {
      this.logger.warn(`Tentativa de refresh com token inválido para o usuário ID: ${userId}`);
      throw new ForbiddenException('Acesso Negado');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.setCurrentRefreshToken(tokens.refreshToken, user.id);
    return tokens;
  }

  async logout(userId: number) {
    // Invalida o refresh token no banco de dados
    await this.usersService.update(userId, { currentHashedRefreshToken: null });
    this.logger.log(`Usuário ID: ${userId} deslogado com sucesso.`);
    return { message: 'Logout realizado com sucesso.' };
  }
}