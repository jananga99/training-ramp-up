import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { CookieName, PassportStrategyName } from './jwt.const';
import { UsersService } from '../../users/users.service';
import { Request } from 'express';
import { PayloadAuthDto } from '../dto/payload-auth.dto';
import { User } from '../../users/entities/user.entity';

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

  validate(payload: PayloadAuthDto): Promise<User> {
    return this.usersService.findOne(payload.email);
  }
}
