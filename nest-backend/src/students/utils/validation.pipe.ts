import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';
import {
  IdValidationSchema,
  StudentValidationSchema,
} from './validation.schema';
import { UpdateStudentDto } from '../dto/update-student.dto';
import { CreateStudentDto } from '../dto/create-student.dto';

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
export class UpdateStudentValidationPipe
  implements PipeTransform<UpdateStudentDto | string>
{
  transform(
    value: UpdateStudentDto | string,
    metadata: ArgumentMetadata,
  ): UpdateStudentDto | number {
    switch (metadata.type) {
      case 'body':
        return validator(StudentValidationSchema, value);
      case 'param':
        const val = validator(IdValidationSchema, {
          id: parseFloat(value as string),
        });
        return parseInt(String(val.id));
    }
  }
}

@Injectable()
export class CreateStudentValidationPipe
  implements PipeTransform<UpdateStudentDto>
{
  transform(value: CreateStudentDto): CreateStudentDto {
    return validator(StudentValidationSchema, value);
  }
}

@Injectable()
export class DeleteStudentValidationPipe implements PipeTransform<string> {
  transform(value: string): number {
    const val = validator(IdValidationSchema, { id: parseFloat(value) });
    return parseInt(String(val.id));
  }
}
