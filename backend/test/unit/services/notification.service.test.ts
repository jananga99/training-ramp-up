import { Gender, Student } from '../../../src/models/student.model'
import { io } from '../../../index'
import { sendNotification } from '../../../src/services/notification.service'

jest.mock('../../../index', () => ({
  io: {
    emit: jest.fn().mockReturnValue(true),
  },
}))

describe('Notifications', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })
  test('notification sends', async () => {
    const type = 'update'
    const id = 2
    const student: Student = {
      id: 2,
      address: 'Tokyo',
      age: 23,
      birthday: new Date('2022/1/1'),
      gender: Gender.MALE,
      mobileNo: '0123456789',
      name: 'Jack',
    }
    const spy = jest.spyOn(io, 'emit')
    sendNotification(type, id, student)
    expect(spy).toHaveBeenCalledWith(
      'notification',
      type,
      id,
      `Student with database id ${id} was ${type}d.`,
      student
    )
  })
  test('notification fails due to invalid type', async () => {
    const type = 'invalid'
    const id = 2
    const student: Student = {
      id: 2,
      address: 'Tokyo',
      age: 23,
      birthday: new Date('2022/1/1'),
      gender: Gender.MALE,
      mobileNo: '0123456789',
      name: 'Jack',
    }
    const spy = jest.spyOn(io, 'emit')
    spy.mockReset()
    sendNotification(type, id, student)
    expect(spy).not.toHaveBeenCalled()
  })
})
