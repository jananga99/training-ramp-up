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

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @UsePipes(new CreateStudentValidationPipe())
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  findAll() {
    return this.studentsService.findAll();
  }

  @Patch(':id')
  @UsePipes(new UpdateStudentValidationPipe())
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(+id, updateStudentDto);
  }

  @Delete(':id')
  @UsePipes(new DeleteStudentValidationPipe())
  remove(@Param('id') id: string) {
    return this.studentsService.remove(+id);
  }
}
