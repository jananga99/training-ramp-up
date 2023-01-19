import { Request, Response, NextFunction } from 'express'
import {
  getMultiple,
  create,
  update,
  remove,
} from '../services/student.service'
import { sendNotification } from '../services/notification.service'

async function getStudents(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const students = await getMultiple()
    res.status(200).json(students)
  } catch (err: any) {
    console.error(`Error while getting students`, err.message)
    next(err)
  }
}

async function createStudent(req: Request, res: Response, next: NextFunction) {
  try {
    const student = await create(req.body.student)
    if (student) {
      sendNotification('create', student.id as number)
    }
    res.status(201).json(student)
  } catch (err: any) {
    console.error(`Error while creating student`, err.message)
    next(err)
  }
}

async function updateStudent(req: Request, res: Response, next: NextFunction) {
  try {
    const student = await update(parseInt(req.params.id), req.body.student)
    if (student) {
      sendNotification('update', student.id as number)
    }
    res.status(200).json(student)
  } catch (err: any) {
    console.error(`Error while updating student`, err.message)
    next(err)
  }
}

async function removeStudent(req: Request, res: Response, next: NextFunction) {
  try {
    const student = await remove(parseInt(req.params.id))
    if (student) {
      student.id = parseInt(req.params.id)
      sendNotification('delete', parseInt(req.params.id))
    }
    res.status(200).json(student)
  } catch (err: any) {
    console.error(`Error while deleting student`, err.message)
    next(err)
  }
}

export { getStudents, createStudent, updateStudent, removeStudent }
