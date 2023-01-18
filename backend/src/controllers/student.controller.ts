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
      sendNotification('create', student.dbId as number, student)
    }
    res.status(201).json(student)
  } catch (err: any) {
    console.error(`Error while creating student`, err.message)
    next(err)
  }
}

async function updateStudent(req: Request, res: Response, next: NextFunction) {
  try {
    const student = await update(parseInt(req.params.dbId), req.body.student)
    if (student) {
      sendNotification('update', student.dbId as number, student)
    }
    res.status(200).json(student)
  } catch (err: any) {
    console.error(`Error while updating student`, err.message)
    next(err)
  }
}

async function removeStudent(req: Request, res: Response, next: NextFunction) {
  try {
    const student = await remove(parseInt(req.params.dbId))
    if (student) {
      student.dbId = parseInt(req.params.dbId)
      sendNotification('delete', parseInt(req.params.dbId), student)
    }
    res.status(200).json(student)
  } catch (err: any) {
    console.error(`Error while deleting student`, err.message)
    next(err)
  }
}

export { getStudents, createStudent, updateStudent, removeStudent }
