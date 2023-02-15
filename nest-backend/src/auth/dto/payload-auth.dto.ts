import { IsEmail, IsNotEmpty } from 'class-validator';

export class PayloadAuthDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
