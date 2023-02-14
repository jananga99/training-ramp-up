import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.findOne(createUserDto.email as string);
    if (existingUser) {
      throw new Error('Duplicate email');
    }
    return this.usersRepository.save(createUserDto);
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(email: string) {
    return this.usersRepository.findOneBy({ email });
  }

  async update(email: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.findOne(email);
    if (existingUser) {
      return this.usersRepository.save({ ...updateUserDto, email });
    }
    throw new Error('There is no existing User for this id');
  }

  async remove(email: string) {
    const existingUser = await this.findOne(email);
    if (existingUser) {
      return this.usersRepository.delete(email);
    }
    throw new Error('There is no existing User for this id');
  }
}
