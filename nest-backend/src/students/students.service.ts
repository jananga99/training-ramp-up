import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}
  create(createStudentDto: CreateStudentDto) {
    return this.studentRepository.save(createStudentDto);
  }

  findAll() {
    return this.studentRepository.find();
  }

  findOne(id: number) {
    return this.studentRepository.findOneBy({ id });
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    const existingStudent = await this.findOne(id);
    if (existingStudent) {
      return this.studentRepository.save({ ...updateStudentDto, id: id });
    } else {
      throw new Error('There is no existing student for this id');
    }
  }

  async remove(id: number) {
    id = parseInt(String(id));
    const existingStudent = await this.findOne(id);
    if (existingStudent) {
      return this.studentRepository.remove(existingStudent);
    } else {
      throw new Error('There is no existing student for this id');
    }
  }
}
