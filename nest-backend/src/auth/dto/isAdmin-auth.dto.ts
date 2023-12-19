import { IsBoolean, IsNotEmpty } from 'class-validator';

export class IsAdminAuthDto {
  @IsNotEmpty()
  @IsBoolean()
  isAdmin: boolean;
}
