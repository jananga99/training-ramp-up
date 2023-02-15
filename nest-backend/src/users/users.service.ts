import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { DUPLICATE_EMAIL_MESSAGE, USER_NOT_FOUND_MESSAGE } from './utils/const';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser: User = await this.findOne(
      createUserDto.email as string,
    );
    if (existingUser) {
      throw new ConflictException(DUPLICATE_EMAIL_MESSAGE);
    }
    return this.usersRepository.save(createUserDto);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(email: string): Promise<User> {
    return this.usersRepository.findOneBy({ email });
  }

  async update(
    email: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserDto> {
    const existingUser: User = await this.findOne(email);
    if (existingUser) {
      return this.usersRepository.save({ ...updateUserDto, email });
    }
    throw new NotFoundException(USER_NOT_FOUND_MESSAGE);
  }

  async remove(email: string): Promise<User> {
    const existingUser: User = await this.findOne(email);
    if (existingUser) {
      return this.usersRepository.remove(existingUser);
    }
    throw new NotFoundException(USER_NOT_FOUND_MESSAGE);
  }
}
