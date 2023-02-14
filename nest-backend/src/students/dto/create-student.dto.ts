import {
  IsDataURI,
  IsDate,
  IsEnum,
  IsInt,
  isInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  isPositive,
  IsString,
  Min,
} from 'class-validator';
import { Gender } from '../entities/student.entity';

export class CreateStudentDto {
  @IsNotEmpty()
  @IsString()
  address: string;
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @IsPositive()
  @Min(18)
  age: number;
  @IsNotEmpty()
  birthday: Date;
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: string;
  @IsNotEmpty()
  @IsString()
  mobileNo: string;
  @IsNotEmpty()
  @IsString()
  name: string;
}
