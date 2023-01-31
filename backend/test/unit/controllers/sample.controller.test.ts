import { Request, Response, NextFunction } from 'express'
import { getSamples } from '../../../src/controllers/sample.controller'
import { getStudents } from '../../../src/controllers/student.controller'
import { getMultiple } from '../../../src/services/student.service'
import { Gender, Student } from '../../../src/models/student.model'
import { sendNotification } from '../../../src/services/notification.service'

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

jest.mock('../../../src/services/student.service', () => ({
  getMultiple: jest.fn().mockResolvedValue([
    {
      id: 1,
      address: 'London',
      age: 23,
      birthday: new Date('2022/1/1'),
      gender: 'male',
      mobileNo: '0123456789',
      name: 'John',
    },
    {
      id: 2,
      address: 'Tokyo',
      age: 23,
      birthday: new Date('2022/1/1'),
      gender: 'male',
      mobileNo: '0123456789',
      name: 'Jack',
    },
  ]),
  create: jest
    .fn()
    .mockImplementation((student: Student) =>
      Promise.resolve({ ...student, id: 1 })
    ),
  update: jest.fn().mockImplementation((id: number, student: Student) => {
    const existingStudents = students
    existingStudents.forEach(val => {
      if (val.id === id) {
        student.id = id
        return new Promise(resolve => {
          resolve(student)
        })
      }
    })
    return null
  }),
  remove: jest.fn().mockImplementation((id: number, student: Student) => {
    const existingStudents = students
    existingStudents.forEach(val => {
      if (val.id === id) {
        student.id = id
        return new Promise(resolve => {
          resolve(student)
        })
      }
    })
    return null
  }),
}))

jest.mock('../../../src/services/notification.service', () => ({
  sendNotification: jest.fn().mockReturnValue(true),
}))

describe('sample Controller', () => {
  const response = () => {
    const res = {} as Response
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    res.send = jest.fn().mockReturnValue(res)
    return res
  }
  test('Sample test GET', async () => {
    const req = {} as Request
    const res = response()
    const next = jest.fn() as NextFunction
    await getSamples(req, res, next)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(['John', 'Jesse'])
  })
})

describe('Student Controller', () => {
  const response = () => {
    const res = {} as Response
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    res.send = jest.fn().mockReturnValue(res)
    return res
  }
  test('Sample student GET', async () => {
    const req = {} as Request
    const res = response()
    const next = jest.fn() as NextFunction
    await getStudents(req, res, next)
    expect(res.status).toHaveBeenCalledWith(200)
    // expect(res.json).toHaveBeenCalledWith(['John', 'Jesse'])
  })
})
