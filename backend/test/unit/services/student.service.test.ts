import { Gender, Student } from '../../../src/models/student.model'
import { AppDataSource } from '../../../src/configs/postgre.config'
import {
  create,
  getMultiple,
  remove,
  update,
} from '../../../src/services/student.service'

let students: Student[]
const student1 = {
  id: 1,
  address: 'London',
  age: 23,
  birthday: new Date('2022/1/1'),
  gender: Gender.MALE,
  mobileNo: '0123456789',
  name: 'John',
}
const student2 = {
  id: 2,
  address: 'Tokyo',
  age: 23,
  birthday: new Date('2022/1/1'),
  gender: Gender.MALE,
  mobileNo: '0123456789',
  name: 'Jack',
}
students = [student1, student2]
const newStudent = {
  id: undefined,
  address: 'New York',
  age: 23,
  birthday: new Date('2022/1/1'),
  gender: Gender.MALE,
  mobileNo: '0123456789',
  name: 'Jason',
}
const updateStudent = {
  id: 2,
  address: 'Hiroshima',
  age: 23,
  birthday: new Date('2022/1/1'),
  gender: Gender.MALE,
  mobileNo: '0123456789',
  name: 'Jack',
}
const removeStudent = {
  id: 2,
  address: 'Hiroshima',
  age: 23,
  birthday: new Date('2022/1/1'),
  gender: Gender.MALE,
  mobileNo: '0123456789',
  name: 'Jack',
}

afterEach(() => {
  jest.restoreAllMocks()
})

describe('Student Getting', () => {
  test('get all the students', async () => {
    jest
      .spyOn(AppDataSource.getRepository(Student), 'find')
      .mockResolvedValue(students)
    const result = await getMultiple()
    expect(result).toHaveLength(2)
    expect(result).toContainEqual(student1)
    expect(result).toContainEqual(student2)
    expect(result).toEqual(students)
  })
  test('error in find', async () => {
    jest
      .spyOn(AppDataSource.getRepository(Student), 'find')
      .mockRejectedValue(new Error('find error'))
    await expect(getMultiple()).rejects.toThrowError('find error')
  })
})

describe('Student Creating', () => {
  test('creates the student', async () => {
    const createdStudent = { ...newStudent, id: 3 }
    jest
      .spyOn(AppDataSource.getRepository(Student), 'save')
      .mockResolvedValue(createdStudent)
    const result = await create(newStudent)
    expect(result).toEqual(createdStudent)
  })
  test('error in save', async () => {
    jest
      .spyOn(AppDataSource.getRepository(Student), 'save')
      .mockRejectedValue(new Error('save error'))
    await expect(create(newStudent)).rejects.toThrowError('save error')
  })
})

describe('Student Updating', () => {
  test('updates the student', async () => {
    jest
      .spyOn(AppDataSource.getRepository(Student), 'findOneBy')
      .mockResolvedValue(updateStudent)
    jest
      .spyOn(AppDataSource.getRepository(Student), 'save')
      .mockResolvedValue(updateStudent)
    const result = await update(updateStudent.id, updateStudent)
    expect(result).toEqual(updateStudent)
  })
  test('no student with given id to update', async () => {
    jest
      .spyOn(AppDataSource.getRepository(Student), 'findOneBy')
      .mockResolvedValue(null)
    const result = await update(updateStudent.id, updateStudent)
    expect(result).toEqual(null)
  })
  test('error in save', async () => {
    jest
      .spyOn(AppDataSource.getRepository(Student), 'findOneBy')
      .mockResolvedValue(updateStudent)
    jest
      .spyOn(AppDataSource.getRepository(Student), 'save')
      .mockRejectedValue(new Error('save error'))
    await expect(update(updateStudent.id, updateStudent)).rejects.toThrowError(
      'save error'
    )
  })
})

describe('Student Removing', () => {
  test('removes the student', async () => {
    jest
      .spyOn(AppDataSource.getRepository(Student), 'findOneBy')
      .mockResolvedValue(removeStudent)
    jest
      .spyOn(AppDataSource.getRepository(Student), 'remove')
      .mockResolvedValue(removeStudent)
    const result = await remove(removeStudent.id)
    expect(result).toEqual(removeStudent)
  })
  test('no student with given id to remove', async () => {
    jest
      .spyOn(AppDataSource.getRepository(Student), 'findOneBy')
      .mockResolvedValue(null)
    const result = await remove(removeStudent.id)
    expect(result).toEqual(null)
  })
  test('error in remove', async () => {
    jest
      .spyOn(AppDataSource.getRepository(Student), 'findOneBy')
      .mockResolvedValue(removeStudent)
    jest
      .spyOn(AppDataSource.getRepository(Student), 'remove')
      .mockRejectedValue(new Error('remove error'))
    await expect(remove(removeStudent.id)).rejects.toThrowError('remove error')
  })
})
