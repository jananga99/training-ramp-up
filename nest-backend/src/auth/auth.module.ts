import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtAccessStrategy } from './utils/jwt-access.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtRefreshStrategy } from './utils/jwt-refresh.strategy';

@Module({
  imports: [UsersModule, PassportModule, JwtModule],
  exports: [JwtAccessStrategy],
  controllers: [AuthController],
  providers: [AuthService, JwtRefreshStrategy, JwtAccessStrategy],
})
export class AuthModule {}
