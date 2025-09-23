import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtRefreshGuard } from './jwt-refresh-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Request } from 'express';

// Define a tag para o grupo de endpoints relacionados à autenticação
@ApiTags('auth')
@Controller('auth') // Define o prefixo 'auth' para os endpoints deste controlador
export class AuthController {
  constructor(private readonly authService: AuthService) {} // Injeta o serviço de autenticação

  // Define a operação de login do usuário
  @ApiOperation({ summary: 'User Login' }) // Descreve a operação na documentação Swagger
  @HttpCode(HttpStatus.OK) // Define o código de status HTTP como 200 (OK)
  @Post('login') // Define o endpoint POST em 'auth/login'
  login(@Body() loginAuthDto: LoginAuthDto) {
    // Chama o método login do serviço de autenticação, passando email e senha
    return this.authService.login(loginAuthDto.email, loginAuthDto.password);
  }

  // Define a operação de logout do usuário
  @UseGuards(JwtAuthGuard) // Aplica o guard de autenticação JWT para proteger o endpoint
  @Post('logout') // Define o endpoint POST em 'auth/logout'
  @HttpCode(HttpStatus.OK) // Define o código de status HTTP como 200 (OK)
  logout(@Req() req: Request) {
    // Obtém o ID do usuário autenticado a partir do objeto de requisição
    const user = req.user as { userId: number };
    // Chama o método logout do serviço de autenticação, passando o ID do usuário
    return this.authService.logout(user.userId);
  }

  // Define a operação de atualização dos tokens de autenticação
  @UseGuards(JwtRefreshGuard) // Aplica o guard de refresh token para proteger o endpoint
  @Post('refresh') // Define o endpoint POST em 'auth/refresh'
  @HttpCode(HttpStatus.OK) // Define o código de status HTTP como 200 (OK)
  refreshTokens(@Req() req: Request) {
    // Obtém o ID do usuário e o refresh token a partir do objeto de requisição
    const user = req.user as { sub: number; refreshToken: string };
    // Chama o método refreshTokens do serviço de autenticação, passando o ID do usuário e o refresh token
    return this.authService.refreshTokens(user.sub, user.refreshToken);
  }
}