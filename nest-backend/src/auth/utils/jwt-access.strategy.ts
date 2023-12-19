import { Strategy } from 'passport-jwt';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/entities/user.entity';
import { PayloadAuthDto } from '../dto/payload-auth.dto';
import { PassportStrategy } from '@nestjs/passport';
import { CookieName, PassportStrategyName } from './jwt.const';
import { USER_NOT_FOUND_MESSAGE } from '../../users/utils/const';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  PassportStrategyName.JWT_ACCESS,
) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: (req: Request) => {
        let token = null;
        if (req && req.cookies) {
          token = req.cookies[CookieName.JWT_ACCESS];
        }
        return token;
      },
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: PayloadAuthDto): Promise<User> {
    const existingUser = await this.usersService.findOne(payload.email);
    if (existingUser) {
      return existingUser;
    }
    throw new NotFoundException(USER_NOT_FOUND_MESSAGE);
  }
}
