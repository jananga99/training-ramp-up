import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { EventsGateway } from '../events/events.gateway';
import { AuthGuard } from '@nestjs/passport';
import { Student } from './entities/student.entity';
import { IdStudentDto } from './dto/id-student.dto';

@Controller('students')
export class StudentsController {
  constructor(
    private readonly studentsService: StudentsService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  @Post()
  // @UseGuards(AuthGuard('jwt-admin'))
  async create(@Body() createStudentDto: CreateStudentDto): Promise<Student> {
    const student: Student = await this.studentsService.create(
      createStudentDto,
    );
    this.eventsGateway.sendNotification('create', student.id, student);
    return student;
  }

  @Get()
  // @UseGuards(AuthGuard('jwt'))
  findAll(): Promise<Student[]> {
    return this.studentsService.findAll();
  }

  @Patch(':id')
  // @UseGuards(AuthGuard('jwt-admin'))
  async update(
    @Param() idStudentDto: IdStudentDto,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
    const student: Student = await this.studentsService.update(
      idStudentDto.id,
      updateStudentDto,
    );
    this.eventsGateway.sendNotification(
      'update',
      student.id as number,
      student,
    );
    return student;
  }

  @Delete(':id')
  // @UseGuards(AuthGuard('jwt-admin'))
  async remove(@Param() idStudentDto: IdStudentDto): Promise<number> {
    console.log(idStudentDto);
    await this.studentsService.remove(idStudentDto.id);
    this.eventsGateway.sendNotification('delete', idStudentDto.id, null);
    return idStudentDto.id;
  }
}
