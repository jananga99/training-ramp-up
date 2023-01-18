import { io } from '../../index'

const sendNotification = (type: string, dbId: number) => {
  io.emit('notification', `Student with database id ${dbId} was ${type}d.`)
}

export { sendNotification }
