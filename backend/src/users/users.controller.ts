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

@ApiTags('users')
@Controller('users')
// @UseGuards(JwtAuthGuard) <-- REMOVA A PROTEÇÃO GLOBAL DAQUI
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Esta rota agora é PÚBLICA, permitindo o registro de novos usuários.
  @ApiOperation({ summary: 'Create user (Public)' })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // As rotas abaixo continuarão protegidas.
  @ApiOperation({ summary: 'Find all users (Protected)' })
  @UseGuards(JwtAuthGuard) // <-- APLIQUE A PROTEÇÃO INDIVIDUALMENTE
  @ApiBearerAuth()
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Find user by id (Protected)' })
  @UseGuards(JwtAuthGuard) // <-- APLIQUE A PROTEÇÃO INDIVIDUALMENTE
  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update user (Protected)' })
  @UseGuards(JwtAuthGuard) // <-- APLIQUE A PROTEÇÃO INDIVIDUALMENTE
  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiOperation({ summary: 'Remove user (Protected)' })
  @UseGuards(JwtAuthGuard) // <-- APLIQUE A PROTEÇÃO INDIVIDUALMENTE
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}