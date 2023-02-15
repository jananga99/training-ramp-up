import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Matches,
  Min,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Gender } from '../entities/student.entity';
import { getAge } from '../utils/helpers';
import { Type } from 'class-transformer';

@ValidatorConstraint({ name: 'ageCompatibility', async: false })
export class CustomAgeValidation implements ValidatorConstraintInterface {
  validate(age: number, args: ValidationArguments) {
    return getAge((args.object as CreateStudentDto).birthday) === age;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Age is not compatible with the birthday';
  }
}

export class CreateStudentDto {
  @IsNotEmpty()
  @IsString()
  address: string;
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  birthday: Date;
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @IsPositive()
  @Min(18)
  @Validate(CustomAgeValidation, {
    message: 'Age is not compatible with the birthday',
  })
  age: number;
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: string;
  @IsNotEmpty()
  @IsString()
  @Matches(/^(\+\d{2}|0)\d{9}$/, {
    message:
      'MobileNo must be a nine number prefixed by country code or 0 (e.g. 0123456789 or +94123456789',
  })
  mobileNo: string;
  @IsNotEmpty()
  @IsString()
  name: string;
}
