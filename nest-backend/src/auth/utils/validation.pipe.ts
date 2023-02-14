import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { SignUpAuthDto } from '../dto/signup-auth.dto';
import {
  SignInValidationSchema,
  SignUpValidationSchema,
} from './validation.schema';
import { SignInAuthDto } from '../dto/signin-auth.dto';

const validator = (schema: any, value: any) => {
  const { error }: any = schema.validateSync(value);
  if (error) {
    let message = 'Validation failed';
    if (error.message) {
      message = error.message;
    }
    throw new BadRequestException(message);
  }
  return value;
};

@Injectable()
export class SignInValidationPipe implements PipeTransform<SignInAuthDto> {
  transform(value: SignUpAuthDto): SignUpAuthDto {
    return validator(SignInValidationSchema, value);
  }
}

@Injectable()
export class SignUpValidationPipe implements PipeTransform<SignUpAuthDto> {
  transform(value: SignUpAuthDto): SignUpAuthDto {
    return validator(SignUpValidationSchema, value);
  }
}
