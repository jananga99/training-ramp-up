import { Gender, Student } from '../../../src/models/student.model'
import { NextFunction, Request, Response } from 'express'
import {
  createStudent,
  getStudents,
  removeStudent,
  updateStudent,
} from '../../../src/controllers/student.controller'
import * as studentService from '../../../src/services/student.service'

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
const students: Student[] = [student1, student2]
const newStudent = {
  id: undefined,
  address: 'New York',
  age: 23,
  birthday: new Date('2022/1/1'),
  gender: Gender.MALE,
  mobileNo: '0123456789',
  name: 'Jason',
}
const updateStudentData = {
  id: 2,
  address: 'Hiroshima',
  age: 23,
  birthday: new Date('2022/1/1'),
  gender: Gender.MALE,
  mobileNo: '0123456789',
  name: 'Jack',
}
const removeStudentData = {
  id: 2,
  address: 'Hiroshima',
  age: 23,
  birthday: new Date('2022/1/1'),
  gender: Gender.MALE,
  mobileNo: '0123456789',
  name: 'Jack',
}
jest.mock('../../../src/services/student.service', () => ({
  getMultiple: jest.fn(),
  create: jest.fn(),
  remove: jest.fn(),
  update: jest.fn(),
}))

jest.mock('../../../src/services/notification.service', () => ({
  sendNotification: jest.fn().mockReturnValue(true),
}))

describe('get all students', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })
  const getResponse = () =>
    ({
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response)
  test('gets all students', async () => {
    const spy = jest
      .spyOn(studentService, 'getMultiple')
      .mockResolvedValue(students)
    const req = {} as Request
    const res = getResponse()
    const next = jest.fn() as NextFunction
    await getStudents(req, res, next)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(students)
    expect(res.json).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledTimes(1)
    spy.mockRestore()
  })
  test('gets all students fails', async () => {
    const err = new Error('error in find')
    jest.spyOn(studentService, 'getMultiple').mockRejectedValue(err)
    const req = {} as Request
    const res = getResponse()
    const next = jest.fn() as NextFunction
    await getStudents(req, res, next)
    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(err)
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
  })
})

describe('create the student', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })
  const getRequest = () =>
    ({
      body: {
        student: createStudent,
      },
    } as unknown as Request)
  const getResponse = () =>
    ({
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response)
  test('creates student', async () => {
    const createdStudent = { ...newStudent, id: 10 }
    const spy = jest
      .spyOn(studentService, 'create')
      .mockResolvedValue(createdStudent)
    const req = getRequest()
    const res = getResponse()
    const next = jest.fn() as NextFunction
    await createStudent(req, res, next)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(createdStudent)
    expect(res.json).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledTimes(1)
    spy.mockRestore()
  })
  test('creates student fails due to save error', async () => {
    const err = new Error('error in save')
    const spy = jest.spyOn(studentService, 'create').mockRejectedValue(err)
    const req = {
      body: {
        student: createStudent,
      },
    } as Request
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response
    const next = jest.fn() as NextFunction
    await createStudent(req, res, next)
    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(err)
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
    spy.mockRestore()
  })
})

describe('update the student', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })
  const getRequest = () =>
    ({
      body: {
        student: updateStudentData,
      },
      params: {
        id: updateStudentData.id,
      },
    } as unknown as Request)
  const getResponse = () =>
    ({
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response)
  test('updates student', async () => {
    const updatedStudent = updateStudentData
    const spy = jest
      .spyOn(studentService, 'update')
      .mockResolvedValue(updatedStudent)
    const req = getRequest()
    const res = getResponse()
    const next = jest.fn() as NextFunction
    await updateStudent(req, res, next)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(updatedStudent)
    expect(res.json).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledTimes(1)
    spy.mockRestore()
  })
  test('updates student fails due to save error', async () => {
    const err = new Error('error in save')
    const spy = jest.spyOn(studentService, 'update').mockRejectedValue(err)
    const req = getRequest()
    const res = getResponse()
    const next = jest.fn() as NextFunction
    await updateStudent(req, res, next)
    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(err)
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
    spy.mockRestore()
  })
  test('updates student fails due to no existing student', async () => {
    const spy = jest.spyOn(studentService, 'update').mockResolvedValue(null)
    const req = getRequest()
    const res = getResponse()
    const next = jest.fn() as NextFunction
    await updateStudent(req, res, next)
    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(
      new Error('There is no existing student for this id')
    )
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
    spy.mockRestore()
  })
})

describe('remove the student', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })
  const getRequest = () =>
    ({
      body: {
        student: removeStudentData,
      },
      params: {
        id: removeStudentData.id,
      },
    } as unknown as Request)
  const getResponse = () =>
    ({
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response)

  test('removes student', async () => {
    const spy = jest
      .spyOn(studentService, 'remove')
      .mockResolvedValue(removeStudentData)
    const req = getRequest()
    const res = getResponse()
    const next = jest.fn() as NextFunction
    await removeStudent(req, res, next)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(204)
    expect(res.json).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledTimes(1)
    spy.mockRestore()
  })
  test('removes student fails due to save error', async () => {
    const err = new Error('error in save')
    const spy = jest.spyOn(studentService, 'remove').mockRejectedValue(err)
    const req = getRequest()
    const res = getResponse()
    const next = jest.fn() as NextFunction
    await removeStudent(req, res, next)
    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(err)
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
    spy.mockRestore()
  })
  test('removes student fails due to save error', async () => {
    const spy = jest.spyOn(studentService, 'remove').mockResolvedValue(null)
    const req = getRequest()
    const res = getResponse()
    const next = jest.fn() as NextFunction
    await removeStudent(req, res, next)
    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(
      new Error('There is no existing student for this id')
    )
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
    spy.mockRestore()
  })
})
