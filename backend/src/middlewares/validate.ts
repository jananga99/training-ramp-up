import { ObjectSchema } from 'yup'
import { Request, Response, NextFunction } from 'express'

export const validateBody =
  (schema: ObjectSchema<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.validateSync(req.body, { abortEarly: false })
      next()
    } catch (err: any) {
      next(err.errors)
    }
  }

export const validateParams =
  (schema: ObjectSchema<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.validateSync(req.params, { abortEarly: false })
      next()
    } catch (err: any) {
      next(err.errors)
    }
  }
