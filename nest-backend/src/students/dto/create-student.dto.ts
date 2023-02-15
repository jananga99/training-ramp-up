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
import {
  INCOMPATIBLE_AGE_BIRTHDAY_MESSAGE,
  INVALID_MOBILE_NO_MESSAGE,
} from '../utils/const';

@ValidatorConstraint({ name: 'ageCompatibility', async: false })
export class CustomAgeValidation implements ValidatorConstraintInterface {
  validate(age: number, args: ValidationArguments) {
    return getAge((args.object as CreateStudentDto).birthday) === age;
  }

  defaultMessage(args: ValidationArguments) {
    return INCOMPATIBLE_AGE_BIRTHDAY_MESSAGE;
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
    message: INCOMPATIBLE_AGE_BIRTHDAY_MESSAGE,
  })
  age: number;
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: string;
  @IsNotEmpty()
  @IsString()
  @Matches(/^(\+\d{2}|0)\d{9}$/, {
    message: INVALID_MOBILE_NO_MESSAGE,
  })
  mobileNo: string;
  @IsNotEmpty()
  @IsString()
  name: string;
}
