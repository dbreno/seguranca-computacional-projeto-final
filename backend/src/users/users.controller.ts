import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

// Define a tag para o grupo de rotas relacionadas a "users" na documentação do Swagger
@ApiTags('users')
@Controller('users')
// @UseGuards(JwtAuthGuard) <-- REMOVA A PROTEÇÃO GLOBAL DAQUI
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Rota pública para criar um novo usuário
  // Essa rota não exige autenticação, permitindo o registro de novos usuários
  @ApiOperation({ summary: 'Create user (Public)' }) // Descrição da operação na documentação do Swagger
  @Post() // Define o método HTTP como POST
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto); // Chama o serviço para criar um novo usuário
  }

  // Rota protegida para listar todos os usuários
  @ApiOperation({ summary: 'Find all users (Protected)' }) // Descrição da operação na documentação do Swagger
  @UseGuards(JwtAuthGuard) // Aplica o guard de autenticação JWT para proteger a rota
  @ApiBearerAuth() // Indica que a autenticação Bearer é necessária na documentação do Swagger
  @Get() // Define o método HTTP como GET
  findAll() {
    return this.usersService.findAll(); // Chama o serviço para listar todos os usuários
  }

  // Rota protegida para buscar um usuário pelo ID
  @ApiOperation({ summary: 'Find user by id (Protected)' }) // Descrição da operação na documentação do Swagger
  @UseGuards(JwtAuthGuard) // Aplica o guard de autenticação JWT para proteger a rota
  @ApiBearerAuth() // Indica que a autenticação Bearer é necessária na documentação do Swagger
  @Get(':id') // Define o método HTTP como GET e aceita um parâmetro de rota "id"
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id); // Chama o serviço para buscar um usuário pelo ID
  }

  // Rota protegida para atualizar um usuário
  @ApiOperation({ summary: 'Update user (Protected)' }) // Descrição da operação na documentação do Swagger
  @UseGuards(JwtAuthGuard) // Aplica o guard de autenticação JWT para proteger a rota
  @ApiBearerAuth() // Indica que a autenticação Bearer é necessária na documentação do Swagger
  @Patch(':id') // Define o método HTTP como PATCH e aceita um parâmetro de rota "id"
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto); // Chama o serviço para atualizar o usuário
  }

  // Rota protegida para remover um usuário
  @ApiOperation({ summary: 'Remove user (Protected)' }) // Descrição da operação na documentação do Swagger
  @UseGuards(JwtAuthGuard) // Aplica o guard de autenticação JWT para proteger a rota
  @ApiBearerAuth() // Indica que a autenticação Bearer é necessária na documentação do Swagger
  @Delete(':id') // Define o método HTTP como DELETE e aceita um parâmetro de rota "id"
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id); // Chama o serviço para remover o usuário
  }
}