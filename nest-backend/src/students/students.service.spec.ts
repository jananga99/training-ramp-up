import { Test, TestingModule } from '@nestjs/testing';
import { StudentsService } from './students.service';
import { Gender, Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
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
const updateStudent: UpdateStudentDto = {
  address: 'Hiroshima',
  age: 23,
  birthday: new Date('2022/1/1'),
  gender: Gender.MALE,
  mobileNo: '0123456789',
  name: 'Jack',
};
const updatedStudent: Student = {
  id: 3,
  address: 'Hiroshima',
  age: 23,
  birthday: new Date('2022/1/1'),
  gender: Gender.MALE,
  mobileNo: '0123456789',
  name: 'Jack',
};
const removeStudent: Student = {
  id: 2,
  address: 'Hiroshima',
  age: 23,
  birthday: new Date('2022/1/1'),
  gender: Gender.MALE,
  mobileNo: '0123456789',
  name: 'Jack',
};

describe('StudentsService', () => {
  let service: StudentsService;
  let repositoryMock: Repository<Student>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        {
          provide: getRepositoryToken(Student),
          useFactory: jest.fn(() => ({
            find: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            findOneBy: jest.fn(),
          })),
        },
      ],
    }).compile();

    service = module.get<StudentsService>(StudentsService);
    repositoryMock = module.get(getRepositoryToken(Student));
  });
  describe('Student Getting', () => {
    it('get all the students', async () => {
      jest.spyOn(repositoryMock, 'find').mockResolvedValue(students);
      const result = await service.findAll();
      expect(result).toHaveLength(2);
      expect(result).toContainEqual(student1);
      expect(result).toContainEqual(student2);
      expect(result).toEqual(students);
    });
    it('error in find', async () => {
      jest
        .spyOn(repositoryMock, 'find')
        .mockRejectedValue(new Error('find error'));
      await expect(service.findAll()).rejects.toThrowError('find error');
    });
  });
  describe('Student Creating', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('creates the student', async () => {
      const createdStudent: Student = { ...newStudent, id: 3 };
      jest.spyOn(repositoryMock, 'save').mockResolvedValue(createdStudent);
      const result = await service.create(newStudent);
      expect(result).toEqual(createdStudent);
    });
    it('error in save', async () => {
      jest
        .spyOn(repositoryMock, 'save')
        .mockRejectedValue(new Error('save error'));
      await expect(service.create(newStudent)).rejects.toThrowError(
        'save error',
      );
    });
  });

  describe('Student Updating', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('updates the student', async () => {
      jest.spyOn(repositoryMock, 'findOneBy').mockResolvedValue(updatedStudent);
      jest.spyOn(repositoryMock, 'save').mockResolvedValue(updatedStudent);
      const result = await service.update(updatedStudent.id, updateStudent);
      expect(result).toEqual(updatedStudent);
    });
    it('no student with given id to update', async () => {
      jest.spyOn(repositoryMock, 'findOneBy').mockResolvedValue(null);
      await expect(
        service.update(updatedStudent.id, updateStudent),
      ).rejects.toThrowError('There is no existing student for this id');
    });
    it('error in save', async () => {
      jest.spyOn(repositoryMock, 'findOneBy').mockResolvedValue(updatedStudent);
      jest
        .spyOn(repositoryMock, 'save')
        .mockRejectedValue(new Error('save error'));
      await expect(
        service.update(updatedStudent.id, updateStudent),
      ).rejects.toThrowError('save error');
    });
  });

  describe('Student Removing', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('removes the student', async () => {
      jest.spyOn(repositoryMock, 'findOneBy').mockResolvedValue(removeStudent);
      jest.spyOn(repositoryMock, 'remove').mockResolvedValue(removeStudent);
      const result: Student = await service.remove(removeStudent.id);
      expect(result).toEqual(removeStudent);
    });
    it('no student with given id to remove', async () => {
      jest.spyOn(repositoryMock, 'findOneBy').mockResolvedValue(null);
      await expect(service.remove(removeStudent.id)).rejects.toThrowError(
        'There is no existing student for this id',
      );
    });
    it('error in remove', async () => {
      jest.spyOn(repositoryMock, 'findOneBy').mockResolvedValue(removeStudent);
      jest
        .spyOn(repositoryMock, 'remove')
        .mockRejectedValue(new Error('remove error'));
      await expect(service.remove(removeStudent.id)).rejects.toThrowError(
        'remove error',
      );
    });
  });
});
