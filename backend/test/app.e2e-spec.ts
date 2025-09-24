import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Response } from 'supertest';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { AppModule } from './../src/app.module'; // Importamos para obter os controllers/providers
import { AuthModule } from './../src/auth/auth.module'; // Módulo de autenticação
import { UsersModule } from './../src/users/users.module'; // Módulo de usuários
import { User } from './../src/users/entities/user.entity'; // Entidade de usuário

// Descrevemos o grupo de testes para o AuthController
describe('AuthController (e2e)', () => {
  let app: INestApplication; // Variável para armazenar a aplicação NestJS

  // Antes de todos os testes, configuramos o ambiente de teste
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      // Em vez de importar o AppModule, recriamos a sua estrutura aqui
      // para podermos injetar a configuração de teste da base de dados.
      imports: [
        ConfigModule.forRoot({
          isGlobal: true, // Configuração global para o módulo de configuração
        }),
        // Usamos uma base de dados SQLite em memória para os testes
        TypeOrmModule.forRoot({
          type: 'sqlite', // Tipo de banco de dados: SQLite
          database: ':memory:', // Banco de dados em memória
          entities: [User], // Entidades utilizadas
          synchronize: true, // `synchronize: true` é seguro para testes
        }),
        UsersModule, // Módulo de usuários
        AuthModule, // Módulo de autenticação
        ThrottlerModule.forRoot([
          {
            ttl: 60000, // Tempo de vida (TTL) de 1 minuto para o teste
            limit: 5, // Limite de 5 requisições
          },
        ]),
      ],
      providers: [
        {
          provide: APP_GUARD, // Provedor para o guard de throttling
          useClass: ThrottlerGuard, // Classe do guard de throttling
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication(); // Criamos a aplicação NestJS
    await app.init(); // Inicializamos a aplicação
  });

  // Teste para verificar se ataques de força bruta são bloqueados na rota /auth/login
  it('should block brute force attacks on /auth/login (POST)', async () => {
    // É preciso criar o utilizador de teste na base de dados em memória
    await request(app.getHttpServer())
      .post('/users') // Rota para criar um novo usuário
      .send({
        email: 'test@example.com', // Email do usuário
        name: 'Test User', // Nome do usuário
        password: 'password123', // Senha do usuário
      });
      
    const loginDto = {
      email: 'test@example.com', // Email para login
      password: 'wrongpassword', // Senha incorreta para simular falha
    };

    const promises: Promise<Response>[] = [];
    for (let i = 0; i < 5; i++) {
      // Enviamos 5 requisições de login com credenciais incorretas
      promises.push(
        request(app.getHttpServer()).post('/auth/login').send(loginDto),
      );
    }

    const responses = await Promise.all(promises); // Aguardamos todas as requisições serem concluídas

    for (const response of responses) {
      expect(response.status).toBe(401); // Todas as 5 requisições devem retornar 401 (não autorizado)
    }

    // A 6ª tentativa deve ser bloqueada com 429 (too many requests)
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(429);
  }, 15000); // Aumentar o timeout do teste para dar tempo às 6 requisições

  // Após todos os testes, fechamos a aplicação
  afterAll(async () => {
    await app.close();
  });
});