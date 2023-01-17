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
    const mapData = await getMultiple()
    res.status(200).json(Object.fromEntries(mapData.entries()))
  } catch (err: any) {
    console.error(`Error while getting students`, err.message)
    next(err)
  }
}

async function createStudent(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(201).json(await create(req.body.student))
  } catch (err: any) {
    err.console.error(`Error while creating student`, err.message)
    next(err)
  }
}

async function updateStudent(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(await update(req.params.dbId, req.body.student))
  } catch (err: any) {
    console.error(`Error while updating student`, err.message)
    next(err)
  }
}

async function removeStudent(req: Request, res: Response, next: NextFunction) {
  try {
    await remove(req.params.dbId)
    res.status(204).json()
  } catch (err: any) {
    console.error(`Error while deleting student`, err.message)
    next(err)
  }
}

export { getStudents, createStudent, updateStudent, removeStudent }
