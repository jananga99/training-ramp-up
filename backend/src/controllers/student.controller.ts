import { Request, Response, NextFunction } from 'express'
import {
  getMultiple,
  create,
  update,
  remove,
} from '../services/student.service'

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
    res.status(201).json(await create(req.body.student))
  } catch (err: any) {
    console.error(`Error while creating student`, err.message)
    next(err)
  }
}

async function updateStudent(req: Request, res: Response, next: NextFunction) {
  try {
    res
      .status(200)
      .json(await update(parseInt(req.params.dbId), req.body.student))
  } catch (err: any) {
    console.error(`Error while updating student`, err.message)
    next(err)
  }
}

async function removeStudent(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(await remove(parseInt(req.params.dbId)))
  } catch (err: any) {
    console.error(`Error while deleting student`, err.message)
    next(err)
  }
}

export { getStudents, createStudent, updateStudent, removeStudent }
