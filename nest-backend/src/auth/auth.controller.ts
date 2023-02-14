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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  signUp(@Body() createAuthDto: SignUpAuthDto) {
    return this.authService.signUp(createAuthDto);
  }

  @Post()
  @HttpCode(200)
  async signIn(
    @Body() signInAuthDto: SignInAuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.signIn(
      signInAuthDto.email,
      signInAuthDto.password,
    );
    if (user) {
      response
        .cookie(
          'jwt-access',
          this.authService.generateAccessToken(signInAuthDto.email),
          {
            httpOnly: true,
            sameSite: 'strict',
            secure: true,
            maxAge: 10 * 60 * 1000,
          },
        )
        .cookie(
          'jwt-refresh',
          this.authService.generateRefreshToken(signInAuthDto.email),
          {
            httpOnly: true,
            sameSite: 'strict',
            secure: true,
            maxAge: 6 * 60 * 60 * 1000,
          },
        );
      return { isAdmin: user.isAdmin };
    } else {
      response
        .status(401)
        .json({ success: true, message: 'Invalid email or password' });
    }
  }

  @Post('signOut')
  @HttpCode(200)
  async signOut(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt-access');
    response.clearCookie('jwt-refresh');
    return { success: true };
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  async refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    response.cookie(
      'jwt-access',
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
