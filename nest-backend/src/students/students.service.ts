import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  create(createStudentDto: CreateStudentDto) {
    return createStudentDto;
  }

  findAll() {
    return [];
  }

  findOne(id: number) {
    return `This action returns a #${id} student`;
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    return updateStudentDto;
  }

  remove(id: number) {
    return id;
  }
}
