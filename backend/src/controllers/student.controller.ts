import { Request, Response, NextFunction } from 'express'
import { getMultiple, create, update, remove } from '../services/student.service'
import { sendNotification } from '../services/notification.service'

async function getStudents(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const students = await getMultiple()
    res.status(200).json(students)
  } catch (err: any) {
    next(err)
  }
}

async function createStudent(req: Request, res: Response, next: NextFunction) {
  try {
    const student = await create(req.body)
    sendNotification('create', student.id as number, student)
    res.status(201).json(student)
  } catch (err: any) {
    next(err)
  }
}

async function updateStudent(req: Request, res: Response, next: NextFunction) {
  try {
    const student = await update(parseInt(req.params.id), req.body)
    if (student) {
      sendNotification('update', student.id as number, student)
      res.status(200).json(student)
    } else {
      next(new Error('There is no existing student for this id'))
    }
  } catch (err: any) {
    next(err)
  }
}

async function removeStudent(req: Request, res: Response, next: NextFunction) {
  try {
    const student = await remove(parseInt(req.params.id))
    if (student) {
      student.id = parseInt(req.params.id)
      sendNotification('delete', parseInt(req.params.id), student)
      res.status(200).json(req.params.id)
    } else {
      next(new Error('There is no existing student for this id'))
    }
  } catch (err: any) {
    next(err)
  }
}

export { getStudents, createStudent, updateStudent, removeStudent }
