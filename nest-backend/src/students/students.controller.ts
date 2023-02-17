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
import { RolesGuard } from './utils/students.roles.guard';
import { Roles } from './utils/students.roles.decorator';
import { Role } from './utils/const';
import { PassportStrategyName } from '../auth/utils/jwt.const';
import { EventTypeName } from '../events/events.const';
import { UpdateResult } from 'typeorm';

@Controller('students')
@UseGuards(AuthGuard(PassportStrategyName.JWT_ACCESS), RolesGuard)
export class StudentsController {
  constructor(
    private readonly studentsService: StudentsService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  @Post()
  @Roles(Role.ADMIN)
  async create(@Body() createStudentDto: CreateStudentDto): Promise<Student> {
    const student: Student = await this.studentsService.create(
      createStudentDto,
    );
    this.eventsGateway.sendNotification(
      EventTypeName.CREATE,
      student.id,
      student,
    );
    return student;
  }

  @Get()
  @Roles(Role.NON_ADMIN, Role.ADMIN)
  async findAll(): Promise<Student[]> {
    return this.studentsService.findAll();
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  async update(
    @Param() idStudentDto: IdStudentDto,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<UpdateStudentDto> {
    await this.studentsService.update(idStudentDto.id, updateStudentDto);
    this.eventsGateway.sendNotification(
      EventTypeName.UPDATE,
      idStudentDto.id,
      updateStudentDto,
    );
    return updateStudentDto;
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async remove(@Param() idStudentDto: IdStudentDto): Promise<number> {
    await this.studentsService.remove(idStudentDto.id);
    this.eventsGateway.sendNotification(
      EventTypeName.DELETE,
      idStudentDto.id,
      null,
    );
    return idStudentDto.id;
  }
}
