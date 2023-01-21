import { Request, Response, NextFunction } from 'express'
import { create, getOne } from '../services/user.service'

async function getUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await getOne(req.body.email)
    if (user) {
      delete user?.password
      res.status(200).json(user)
    } else {
      res.status(200).json(null)
    }
  } catch (err: any) {
    console.error(`Error while getting the user`, err.message)
    next(err)
  }
}

async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await create(req.body)
    if (user) {
      delete user?.password
      res.status(201).json(user)
    } else {
      res.status(200).json('Duplicated email.')
    }
  } catch (err: any) {
    console.error(`Error while creating user`, err.message)
    next(err)
  }
}

export { createUser, getUser }
