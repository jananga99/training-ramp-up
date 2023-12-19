import { IsBoolean, IsNotEmpty } from 'class-validator';

export class SuccessAuthDto {
  @IsNotEmpty()
  @IsBoolean()
  success: boolean;
}
