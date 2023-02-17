import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsBoolean,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  password: string;
  @IsNotEmpty()
  @IsString()
  firstName: string;
  @IsNotEmpty()
  @IsString()
  lastName: string;
  @IsNumber()
  timestamp: number;
  @IsBoolean()
  isAdmin: boolean;
}
