import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { EventsGateway } from '../events/events.gateway';
import { AuthGuard } from '@nestjs/passport';
import {
  CreateStudentValidationPipe,
  DeleteStudentValidationPipe,
  UpdateStudentValidationPipe,
} from './utils/validation.pipe';

@Controller('students')
export class StudentsController {
  constructor(
    private readonly studentsService: StudentsService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt-admin'))
  @UsePipes(new CreateStudentValidationPipe())
  async create(@Body() createStudentDto: CreateStudentDto) {
    const student = await this.studentsService.create(createStudentDto);
    this.eventsGateway.sendNotification('create', student.id, student);
    return student;
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.studentsService.findAll();
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt-admin'))
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
  @UseGuards(AuthGuard('jwt-admin'))
  @UsePipes(new DeleteStudentValidationPipe())
  async remove(@Param('id') id: number) {
    await this.studentsService.remove(id);
    this.eventsGateway.sendNotification('delete', id, null);
    return id;
  }
}
