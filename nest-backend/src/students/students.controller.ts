import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import {
  CreateStudentValidationPipe,
  DeleteStudentValidationPipe,
  UpdateStudentValidationPipe,
} from './utils/validation.pipe';
import { EventsGateway } from '../events/events.gateway';

@Controller('students')
export class StudentsController {
  constructor(
    private readonly studentsService: StudentsService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  @Post()
  @UsePipes(new CreateStudentValidationPipe())
  async create(@Body() createStudentDto: CreateStudentDto) {
    const student = await this.studentsService.create(createStudentDto);
    this.eventsGateway.sendNotification('create', student.id, student);
    return student;
  }

  @Get()
  findAll() {
    return this.studentsService.findAll();
  }

  @Patch(':id')
  @UsePipes(new UpdateStudentValidationPipe())
  async update(
    @Param('id') id: number,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    const student = await this.studentsService.update(+id, updateStudentDto);
    this.eventsGateway.sendNotification(
      'update',
      student.id as number,
      student,
    );
    return student;
  }

  @Delete(':id')
  @UsePipes(new DeleteStudentValidationPipe())
  async remove(@Param('id') id: number) {
    await this.studentsService.remove(id);
    this.eventsGateway.sendNotification('delete', id, null);
  }
}
