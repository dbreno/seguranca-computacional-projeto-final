// Importa o decorator Injectable do NestJS, que marca a classe como um provedor que pode ser injetado em outros lugares.
import { Injectable } from '@nestjs/common';

// Importa a classe AuthGuard do pacote @nestjs/passport, que fornece uma implementação base para guardas de autenticação.
import { AuthGuard } from '@nestjs/passport';

// Define a classe JwtAuthGuard como um provedor injetável no NestJS.
@Injectable()
// A classe JwtAuthGuard estende a classe AuthGuard, utilizando a estratégia 'jwt' para autenticação.
// Isso significa que este guard será responsável por proteger rotas usando a estratégia JWT.
export class JwtAuthGuard extends AuthGuard('jwt') {}
