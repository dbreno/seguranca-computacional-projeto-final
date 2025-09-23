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
  
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(
    email: string,
    pass: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      this.logger.warn(`Tentativa de login falhou para o email: ${email} (usuário não encontrado)`);
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      this.logger.warn(`Tentativa de login falhou para o email: ${email} (senha incorreta)`);
      throw new UnauthorizedException('Credenciais inválidas');
    }

    this.logger.log(`Usuário ${email} logado com sucesso.`);

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
          expiresIn: '15m', // Access token de 15 minutos
        },
      ),
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

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findOne(userId);
    if (!user || !user.currentHashedRefreshToken) {
      this.logger.warn(`Tentativa de refresh de token falhou para o usuário ID: ${userId} (sem refresh token)`);
      throw new ForbiddenException('Acesso Negado');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (!refreshTokenMatches) {
      this.logger.warn(`Tentativa de refresh de token falhou para o usuário ID: ${userId} (token inválido)`);
      throw new ForbiddenException('Acesso Negado');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.setCurrentRefreshToken(tokens.refreshToken, user.id);
    return tokens;
  }

  async logout(userId: number) {
    return this.usersService.update(userId, {
      currentHashedRefreshToken: null,
    });
  }
}