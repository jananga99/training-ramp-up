import { io } from '../../index'
import { Student } from '../models/student.model'

const sendNotification = (type: string, dbId: number, student: Student) => {
  io.emit(
    'notification',
    type,
    dbId,
    `Student with database id ${dbId} was ${type}d.`,
    student
  )
}

export { sendNotification }
