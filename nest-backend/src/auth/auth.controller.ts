import {
  Controller,
  Post,
  Body,
  HttpCode,
  Res,
  UsePipes,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignUpAuthDto } from './dto/signup-auth.dto';
import { SignInAuthDto } from './dto/signin-auth.dto';
import {
  SignInValidationPipe,
  SignUpValidationPipe,
} from './utils/validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  @UsePipes(new SignUpValidationPipe())
  signUp(@Body() createAuthDto: SignUpAuthDto) {
    return this.authService.signUp(createAuthDto);
  }

  @Post()
  @HttpCode(200)
  @UsePipes(new SignInValidationPipe())
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
            // sameSite: 'strict',
            // secure: true,
            sameSite: 'none',
            secure: false,
            maxAge: 10 * 60 * 1000,
          },
        )
        .cookie(
          'jwt-refresh',
          this.authService.generateRefreshToken(signInAuthDto.email),
          {
            httpOnly: true,
            // sameSite: 'strict',
            // secure: true,
            sameSite: 'none',
            secure: false,
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
}
