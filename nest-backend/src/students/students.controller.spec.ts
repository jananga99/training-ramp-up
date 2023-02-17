import { Test, TestingModule } from '@nestjs/testing';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { Gender, Student } from './entities/student.entity';
import { EventsGateway } from '../events/events.gateway';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
const student1: Student = {
  id: 1,
  address: 'London',
  age: 23,
  birthday: new Date('2022/1/1'),
  gender: Gender.MALE,
  mobileNo: '0123456789',
  name: 'John',
};
const student2: Student = {
  id: 2,
  address: 'Tokyo',
  age: 23,
  birthday: new Date('2022/1/1'),
  gender: Gender.MALE,
  mobileNo: '0123456789',
  name: 'Jack',
};
const students: Student[] = [student1, student2];
const newStudent: CreateStudentDto = {
  address: 'New York',
  age: 23,
  birthday: new Date('2022/1/1'),
  gender: Gender.MALE,
  mobileNo: '0123456789',
  name: 'Jason',
};
const updateStudentData: UpdateStudentDto = {
  address: 'Hiroshima',
  age: 23,
  birthday: new Date('2022/1/1'),
  gender: Gender.MALE,
  mobileNo: '0123456789',
  name: 'Jack',
};
const updatedStudentData: Student = {
  id: 10,
  address: 'Hiroshima',
  age: 23,
  birthday: new Date('2022/1/1'),
  gender: Gender.MALE,
  mobileNo: '0123456789',
  name: 'Jack',
};
const removeStudentData: Student = {
  id: 2,
  address: 'Hiroshima',
  age: 23,
  birthday: new Date('2022/1/1'),
  gender: Gender.MALE,
  mobileNo: '0123456789',
  name: 'Jack',
};
describe('StudentsController', () => {
  let controller: StudentsController;
  let mockService: StudentsService;
  let gateway: EventsGateway;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentsController],
      providers: [
        {
          provide: EventsGateway,
          useFactory: jest.fn(() => ({
            sendNotification: jest.fn(),
          })),
        },
        {
          provide: StudentsService,
          useFactory: jest.fn(() => ({
            findAll: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            update: jest.fn(),
          })),
        },
      ],
    }).compile();
    controller = module.get<StudentsController>(StudentsController);
    mockService = module.get<StudentsService>(StudentsService);
    gateway = module.get<EventsGateway>(EventsGateway);
  });

  describe('get all students', () => {
    it('gets all students', async () => {
      jest.spyOn(mockService, 'findAll').mockResolvedValue(students);
      expect(await controller.findAll()).toBe(students);
    });
    it('gets all students fails', async () => {
      jest
        .spyOn(mockService, 'findAll')
        .mockRejectedValue(new Error('error in find'));
      await expect(controller.findAll()).rejects.toThrowError('error in find');
    });
  });

  describe('create the student', () => {
    it('creates student', async () => {
      const createdStudent = { ...newStudent, id: 10 };
      jest.spyOn(mockService, 'create').mockResolvedValue(createdStudent);
      expect(await controller.create(newStudent)).toBe(createdStudent);
    });
    it('creates student fails due to create error', async () => {
      jest
        .spyOn(mockService, 'create')
        .mockRejectedValue(new Error('error in create'));
      await expect(controller.create(newStudent)).rejects.toThrowError(
        'error in create',
      );
    });
  });

  describe('update the student', () => {
    it('updates student', async () => {
      jest
        .spyOn(mockService, 'update')
        .mockResolvedValue({ affected: 1, raw: null, generatedMaps: null });
      expect(
        await controller.update(
          { id: updatedStudentData.id },
          updateStudentData,
        ),
      ).toBe(updateStudentData);
    });
    it('updates student fails due to save error', async () => {
      jest
        .spyOn(mockService, 'update')
        .mockRejectedValue(new Error('error in save'));
      await expect(
        controller.update({ id: updatedStudentData.id }, updateStudentData),
      ).rejects.toThrowError('error in save');
    });
    it('updates student fails due to no existing student', async () => {
      jest
        .spyOn(mockService, 'update')
        .mockRejectedValue(
          new Error('There is no existing student for this id'),
        );
      await expect(
        controller.update({ id: updatedStudentData.id }, updateStudentData),
      ).rejects.toThrowError('There is no existing student for this id');
    });
  });

  describe('remove the student', () => {
    it('removes student', async () => {
      jest.spyOn(mockService, 'remove').mockResolvedValue(removeStudentData);
      expect(await controller.remove({ id: removeStudentData.id })).toBe(
        removeStudentData.id,
      );
    });
    it('removes student fails due to save error', async () => {
      jest
        .spyOn(mockService, 'remove')
        .mockRejectedValue(new Error('error in save'));
      await expect(
        controller.remove({ id: removeStudentData.id }),
      ).rejects.toThrowError('error in save');
    });
    it('removes student fails due to save error', async () => {
      jest
        .spyOn(mockService, 'remove')
        .mockRejectedValue(
          new Error('There is no existing student for this id'),
        );
      await expect(
        controller.remove({ id: removeStudentData.id }),
      ).rejects.toThrowError('There is no existing student for this id');
    });
  });
});
