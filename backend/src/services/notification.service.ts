import { io } from '../../index'
import { Student } from '../models/student.model'

const sendNotification = (type: string, id: number, student: Student) => {
  io.emit(
    'notification',
    type,
    id,
    `Student with database id ${id} was ${type}d.`,
    student
  )
}

export { sendNotification }
