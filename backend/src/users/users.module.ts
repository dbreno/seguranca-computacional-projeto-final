// Importa o decorator Module do NestJS, que é usado para definir um módulo
import { Module } from '@nestjs/common';

// Importa o serviço de usuários, que contém a lógica de negócios relacionada aos usuários
import { UsersService } from './users.service';

// Importa o controlador de usuários, que gerencia as rotas relacionadas aos usuários
import { UsersController } from './users.controller';

// Importa o módulo TypeOrmModule, que é usado para integrar o TypeORM ao NestJS
import { TypeOrmModule } from '@nestjs/typeorm';

// Importa a entidade User, que representa a tabela de usuários no banco de dados
import { User } from './entities/user.entity';

@Module({
  // Define os módulos que este módulo importa, neste caso, o TypeOrmModule configurado para a entidade User
  imports: [TypeOrmModule.forFeature([User])],

  // Define os controladores que fazem parte deste módulo
  controllers: [UsersController],

  // Define os provedores (services) que fazem parte deste módulo
  providers: [UsersService],

  // Exporta os provedores para que possam ser usados em outros módulos
  exports: [UsersService],
})
// Define a classe UsersModule como um módulo do NestJS
export class UsersModule {}