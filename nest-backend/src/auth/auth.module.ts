import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import {
  JwtAdminStrategy,
  JwtRefreshStrategy,
  JwtStrategy,
} from './utils/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [UsersModule, PassportModule, JwtModule],
  exports: [JwtAdminStrategy, JwtStrategy],
  controllers: [AuthController],
  providers: [AuthService, JwtRefreshStrategy, JwtAdminStrategy, JwtStrategy],
})
export class AuthModule {}
