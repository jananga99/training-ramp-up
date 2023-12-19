import {
  Controller,
  Post,
  Body,
  HttpCode,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { SignUpAuthDto } from './dto/signup-auth.dto';
import { SignInAuthDto } from './dto/signin-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../users/entities/user.entity';
import { SuccessAuthDto } from './dto/success-auth.dto';
import { IsAdminAuthDto } from './dto/isAdmin-auth.dto';
import { CookieName, PassportStrategyName } from './utils/jwt.const';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  signUp(@Body() createAuthDto: SignUpAuthDto): Promise<User> {
    return this.authService.signUp(createAuthDto);
  }

  @Post()
  @HttpCode(200)
  async signIn(
    @Body() signInAuthDto: SignInAuthDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IsAdminAuthDto> {
    const user: User = await this.authService.signIn(
      signInAuthDto.email,
      signInAuthDto.password,
    );
    response
      .cookie(
        CookieName.JWT_ACCESS,
        this.authService.generateAccessToken(signInAuthDto.email),
        {
          httpOnly: true,
          sameSite: 'strict',
          secure: true,
          maxAge: 10 * 60 * 1000,
        },
      )
      .cookie(
        CookieName.JWT_REFRESH,
        this.authService.generateRefreshToken(signInAuthDto.email),
        {
          httpOnly: true,
          sameSite: 'strict',
          secure: true,
          maxAge: 6 * 60 * 60 * 1000,
        },
      );
    return { isAdmin: user.isAdmin };
  }

  @Post('signOut')
  @HttpCode(200)
  signOut(@Res({ passthrough: true }) response: Response): SuccessAuthDto {
    response.clearCookie(CookieName.JWT_ACCESS);
    response.clearCookie(CookieName.JWT_REFRESH);
    return { success: true };
  }

  @Post('refresh')
  @UseGuards(AuthGuard(PassportStrategyName.JWT_REFRESH))
  refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): SuccessAuthDto {
    response.cookie(
      CookieName.JWT_ACCESS,
      this.authService.generateAccessToken((request.user as User).email),
      {
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
        maxAge: 10 * 60 * 1000,
      },
    );
    return { success: true };
  }
}
