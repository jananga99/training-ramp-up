import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository, UpdateResult } from 'typeorm';
import { STUDENT_NOT_FOUND_MESSAGE } from './utils/const';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}
  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    return this.studentRepository.save(createStudentDto);
  }

  async findAll(): Promise<Student[]> {
    return this.studentRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Student> {
    return this.studentRepository.findOneBy({ id });
  }

  async update(
    id: number,
    updateStudentDto: UpdateStudentDto,
  ): Promise<UpdateResult> {
    const existingStudent: Student = await this.findOne(id);
    if (existingStudent) {
      return this.studentRepository.update(id, { ...updateStudentDto, id: id });
    } else {
      throw new NotFoundException(STUDENT_NOT_FOUND_MESSAGE);
    }
  }

  async remove(id: number): Promise<Student> {
    id = parseInt(String(id));
    const existingStudent: Student = await this.findOne(id);
    if (existingStudent) {
      return this.studentRepository.remove(existingStudent);
    }
    throw new NotFoundException(STUDENT_NOT_FOUND_MESSAGE);
  }
}
