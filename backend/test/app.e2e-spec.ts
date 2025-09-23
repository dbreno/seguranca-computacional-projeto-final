import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Response } from 'supertest';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { AppModule } from './../src/app.module'; // Importamos para obter os controllers/providers
import { AuthModule } from './../src/auth/auth.module';
import { UsersModule } from './../src/users/users.module';
import { User } from './../src/users/entities/user.entity';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      // Em vez de importar o AppModule, recriamos a sua estrutura aqui
      // para podermos injetar a configuração de teste da base de dados.
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        // Usamos uma base de dados SQLite em memória para os testes
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User],
          synchronize: true, // `synchronize: true` é seguro para testes
        }),
        UsersModule,
        AuthModule,
        ThrottlerModule.forRoot([
          {
            ttl: 60000, // 1 minuto para o teste
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
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should block brute force attacks on /auth/login (POST)', async () => {
    // É preciso criar o utilizador de teste na base de dados em memória
    await request(app.getHttpServer())
      .post('/users')
      .send({
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      });
      
    const loginDto = {
      email: 'test@example.com',
      password: 'wrongpassword',
    };

    const promises: Promise<Response>[] = [];
    for (let i = 0; i < 5; i++) {
      promises.push(
        request(app.getHttpServer()).post('/auth/login').send(loginDto),
      );
    }

    const responses = await Promise.all(promises);

    for (const response of responses) {
      expect(response.status).toBe(401);
    }

    // A 6ª tentativa deve ser bloqueada com 429
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(429);
  }, 15000); // Aumentar o timeout do teste para dar tempo às 6 requisições

  afterAll(async () => {
    await app.close();
  });
});