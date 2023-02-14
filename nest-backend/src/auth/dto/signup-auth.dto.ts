import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignUpAuthDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsString()
  password: string;
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
}
