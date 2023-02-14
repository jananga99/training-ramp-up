import { HttpException, Injectable } from '@nestjs/common';
import { SignUpAuthDto } from './dto/signup-auth.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async signUp(signUpAuthDto: SignUpAuthDto) {
    const user: User = {
      ...signUpAuthDto,
      timestamp: Date.now(),
      isAdmin: signUpAuthDto.email === 'admin@gmail.com',
    };
    const saltRounds = 10;
    user.password = await bcrypt.hash(user.password as string, saltRounds);
    const createdUser = await this.userService.create(user);
    return { ...createdUser, password: '' };
  }

  async signIn(email: string, password: string): Promise<User | null> {
    const existingUser = await this.userService.findOne(email);
    if (existingUser && existingUser.password) {
      const result = await bcrypt.compare(password, existingUser.password);
      if (result) {
        return existingUser;
      }
    }
    throw new HttpException('Invalid Email or Password', 401);
  }

  generateAccessToken(email: string): string {
    return jwt.sign(
      {
        email: email,
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: '10m',
      },
    );
  }

  generateRefreshToken(email: string): string {
    return jwt.sign(
      {
        email: email,
      },
      process.env.REFRESH_TOKEN_SECRET as string,
      {
        expiresIn: '6h',
      },
    );
  }
}
