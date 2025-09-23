import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService implements OnModuleInit {
  
  // Logger para registrar mensagens no console
  private readonly logger = new Logger(UsersService.name);
  
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>, // Repositório para interagir com a entidade User no banco de dados
  ) {}

  // Método executado automaticamente quando o módulo é inicializado
  async onModuleInit() {
    const user = await this.usersRepository.findOneBy({
      email: 'user@example.com', // Verifica se já existe um usuário padrão no banco de dados
    });
    if (!user) {
      const defaultUser: CreateUserDto = {
        email: 'user@example.com',
        name: 'John Doe',
        password: 'password123',
      };
      this.logger.log('Banco de dados vazio. Criando usuário padrão...');
      await this.create(defaultUser); // Cria um usuário padrão caso não exista
    }
  }

  // Método para criar um novo usuário
  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const saltRounds = 10; // Número de rounds para o hash da senha
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds, // Gera o hash da senha
    );

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword, // Substitui a senha pela versão hash
    });

    try {
      const savedUser = await this.usersRepository.save(user); // Salva o usuário no banco de dados

      this.logger.log(`Novo usuário criado: ${savedUser.email} (ID: ${savedUser.id})`);

      const { password, ...result } = savedUser; // Remove a senha do retorno
      return result;
    } catch (error) {
      // Verifica se o erro é uma violação de constraint única (e-mail duplicado)
      if (error.code === 'SQLITE_CONSTRAINT') {
        throw new ConflictException('Este e-mail já está em uso.');
      } else {
        this.logger.error('Erro inesperado ao criar usuário', error.stack);
        throw new InternalServerErrorException(); // Lança uma exceção genérica para erros inesperados
      }
    }
  }

  // Método para buscar todos os usuários
  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.usersRepository.find(); // Busca todos os usuários no banco
    return users.map(({ password, ...user }) => user); // Remove a senha de cada usuário antes de retornar
  }

  // Método para buscar um usuário pelo ID
  async findOne(id: number): Promise<Omit<User, 'password'>> {
    const user = await this.usersRepository.findOneBy({ id }); // Busca o usuário pelo ID
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`); // Lança exceção se o usuário não for encontrado
    }

    const { password, ...result } = user; // Remove a senha do retorno
    return result;
  }

  // Método para buscar um usuário pelo e-mail
  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOneBy({ email }); // Busca o usuário pelo e-mail
    return user || undefined; // Retorna o usuário ou undefined se não encontrado
  }

  // Método para atualizar um usuário
  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.usersRepository.findOneBy({ id }); // Busca o usuário pelo ID
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`); // Lança exceção se o usuário não for encontrado
    }

    Object.assign(user, updateUserDto); // Atualiza os campos do usuário com os dados fornecidos

    const updatedUser = await this.usersRepository.save(user); // Salva as alterações no banco
    const { password, ...result } = updatedUser; // Remove a senha do retorno
    return result;
  }

  // Método para remover um usuário
  async remove(id: number) {
    const result = await this.usersRepository.delete(id); // Remove o usuário pelo ID
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`); // Lança exceção se o usuário não for encontrado
    }
    return { message: `User with ID ${id} successfully deleted.` }; // Retorna uma mensagem de sucesso
  }
}