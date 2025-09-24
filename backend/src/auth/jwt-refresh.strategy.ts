// src/auth/jwt-refresh.strategy.ts

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('JWT_REFRESH_SECRET');

    // Garante que o segredo existe antes de continuar
    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET não foi definido nas variáveis de ambiente');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret, // Agora 'secret' é garantidamente uma string
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    const authorizationHeader = req.get('authorization');
    if (!authorizationHeader) {
      throw new UnauthorizedException('Cabeçalho de autorização não encontrado.');
    }
    const refreshToken = authorizationHeader.replace('Bearer', '').trim();
    return { ...payload, refreshToken };
  }
}