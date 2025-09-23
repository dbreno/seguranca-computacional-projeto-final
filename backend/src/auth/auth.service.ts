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
  ) {}

  // Método para realizar login
  async login(
    email: string,
    pass: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // Busca o usuário pelo email
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // Caso o usuário não seja encontrado, registra um aviso e lança uma exceção
      this.logger.warn(`Tentativa de login falhou para o email: ${email} (usuário não encontrado)`);
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Verifica se a senha fornecida corresponde à senha armazenada
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      // Caso a senha esteja incorreta, registra um aviso e lança uma exceção
      this.logger.warn(`Tentativa de login falhou para o email: ${email} (senha incorreta)`);
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Registra o sucesso do login
    this.logger.log(`Usuário ${email} logado com sucesso.`);

    // Gera os tokens de acesso e refresh
    const tokens = await this.getTokens(user.id, user.email);
    // Armazena o refresh token no banco de dados
    await this.setCurrentRefreshToken(tokens.refreshToken, user.id);
    return tokens;
  }

  // Método para armazenar o refresh token atual no banco de dados
  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    // Hash do refresh token para armazenamento seguro
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    // Atualiza o usuário com o hash do refresh token
    await this.usersService.update(userId, {
      currentHashedRefreshToken,
    });
  }

  // Método para gerar tokens de acesso e refresh
  async getTokens(userId: number, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      // Gera o token de acesso com validade de 15 minutos
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '15m',
        },
      ),
      // Gera o token de refresh com validade configurável
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>(
            'JWT_REFRESH_EXPIRATION_TIME',
          ),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  // Método para renovar os tokens de acesso e refresh
  async refreshTokens(userId: number, refreshToken: string) {
    // Busca o usuário pelo ID
    const user = await this.usersService.findOne(userId);
    if (!user || !user.currentHashedRefreshToken) {
      // Caso o usuário não tenha um refresh token armazenado, lança uma exceção
      this.logger.warn(`Tentativa de refresh de token falhou para o usuário ID: ${userId} (sem refresh token)`);
      throw new ForbiddenException('Acesso Negado');
    }

    // Verifica se o refresh token fornecido corresponde ao armazenado
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (!refreshTokenMatches) {
      // Caso o refresh token seja inválido, lança uma exceção
      this.logger.warn(`Tentativa de refresh de token falhou para o usuário ID: ${userId} (token inválido)`);
      throw new ForbiddenException('Acesso Negado');
    }

    // Gera novos tokens e atualiza o refresh token armazenado
    const tokens = await this.getTokens(user.id, user.email);
    await this.setCurrentRefreshToken(tokens.refreshToken, user.id);
    return tokens;
  }

  // Método para realizar logout
  async logout(userId: number) {
    // Remove o refresh token armazenado do usuário
    return this.usersService.update(userId, {
      currentHashedRefreshToken: null,
    });
  }
}