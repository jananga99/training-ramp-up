import { io } from '../../index'
import { Student } from '../models/student.model'

const sendNotification = (type: string, id: number, student: Student) => {
  if (type === 'create' || type === 'update' || type === 'delete') {
    io.emit(
      'notification',
      type,
      id,
      `Student with database id ${id} was ${type}d.`,
      student
    )
  }
}

export { sendNotification }
