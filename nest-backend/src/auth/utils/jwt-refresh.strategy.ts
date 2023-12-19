import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { CookieName, PassportStrategyName } from './jwt.const';
import { UsersService } from '../../users/users.service';
import { Request } from 'express';
import { PayloadAuthDto } from '../dto/payload-auth.dto';
import { User } from '../../users/entities/user.entity';
import { USER_NOT_FOUND_MESSAGE } from '../../users/utils/const';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  PassportStrategyName.JWT_REFRESH,
) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: (req: Request) => {
        let token = null;
        if (req && req.cookies) {
          token = req.cookies[CookieName.JWT_REFRESH];
        }
        return token;
      },
      ignoreExpiration: false,
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
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
