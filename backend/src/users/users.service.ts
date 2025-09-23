import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
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
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    const user = await this.usersRepository.findOneBy({
      email: 'user@example.com',
    });
    if (!user) {
      const defaultUser: CreateUserDto = {
        email: 'user@example.com',
        name: 'John Doe',
        password: 'password123',
      };
      console.log('Criando utilizador padrão...');
      await this.create(defaultUser);
    }
  }

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    try {
      const savedUser = await this.usersRepository.save(user);
      const { password, ...result } = savedUser;
      return result;
    } catch (error) {
      // Verifica se o erro é uma violação de constraint única (código 23505 para Postgres, SQLITE_CONSTRAINT para SQLite)
      if (error.code === 'SQLITE_CONSTRAINT') {
        throw new ConflictException('Este e-mail já está em uso.');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.usersRepository.find();
    return users.map(({ password, ...user }) => user);
  }

  async findOne(id: number): Promise<Omit<User, 'password'>> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const { password, ...result } = user;
    return result;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOneBy({ email });
    return user || undefined;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    Object.assign(user, updateUserDto);

    const updatedUser = await this.usersRepository.save(user);
    const { password, ...result } = updatedUser;
    return result;
  }

  async remove(id: number) {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return { message: `User with ID ${id} successfully deleted.` };
  }
}