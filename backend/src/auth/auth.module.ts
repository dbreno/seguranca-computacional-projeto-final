// Importa o decorator Module do NestJS, que é usado para definir um módulo
import { Module } from '@nestjs/common';
// Importa o serviço de autenticação
import { AuthService } from './auth.service';
// Importa o controlador de autenticação
import { AuthController } from './auth.controller';
// Importa o módulo de usuários, que provavelmente gerencia os dados dos usuários
import { UsersModule } from '../users/users.module';
// Importa a estratégia JWT para autenticação
import { JwtStrategy } from './jwt.strategy';
// Importa o módulo Passport, que é usado para autenticação
import { PassportModule } from '@nestjs/passport';
// Importa o módulo JWT para lidar com tokens JWT
import { JwtModule } from '@nestjs/jwt';
// Importa o módulo de configuração para acessar variáveis de ambiente
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  // Define os módulos que serão importados por este módulo
  imports: [
    UsersModule, // Módulo de usuários
    PassportModule, // Módulo para autenticação com Passport
    JwtModule.registerAsync({
      // Configuração assíncrona do módulo JWT
      imports: [ConfigModule], // Importa o módulo de configuração para acessar variáveis de ambiente
      inject: [ConfigService], // Injeta o serviço de configuração
      useFactory: async (configService: ConfigService) => ({
        // Define a configuração do JWT
        secret: configService.get<string>('JWT_SECRET'), // Obtém a chave secreta do JWT das variáveis de ambiente
        signOptions: { expiresIn: '60s' }, // Define o tempo de expiração do token JWT
      }),
    }),
  ],
  // Define os controladores deste módulo
  controllers: [AuthController], // Controlador responsável pelas rotas de autenticação
  // Define os provedores (serviços) deste módulo
  providers: [AuthService, JwtStrategy], // Serviço de autenticação e estratégia JWT
})
// Exporta a classe do módulo de autenticação
export class AuthModule {}