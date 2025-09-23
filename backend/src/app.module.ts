import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { ConfigModule } from '@nestjs/config';

/**
 * Módulo principal da aplicação.
 * 
 * Este módulo configura e integra os principais módulos e serviços da aplicação,
 * incluindo o gerenciamento de configurações, conexão com o banco de dados,
 * autenticação, controle de usuários e proteção contra ataques de força bruta.
 * 
 * Configurações:
 * - `ConfigModule`: Torna o módulo de configuração disponível globalmente.
 * - `TypeOrmModule`: Configura o TypeORM para usar um banco de dados SQLite,
 *   sincronizando automaticamente as entidades com o banco de dados.
 * - `UsersModule`: Módulo responsável pelo gerenciamento de usuários.
 * - `AuthModule`: Módulo responsável pela autenticação.
 * - `ThrottlerModule`: Configura o Throttler para limitar o número de requisições
 *   por um período de tempo, protegendo contra ataques de força bruta.
 * 
 * Provedores:
 * - `APP_GUARD`: Define o `ThrottlerGuard` como o guard global para aplicar
 *   as regras de limitação de requisições.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Torna o ConfigModule disponível globalmente
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    ThrottlerModule.forRoot([
      {
        ttl: 300000,
        limit: 5,
      },
    ]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}