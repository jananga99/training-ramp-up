import { Request, Response, NextFunction } from 'express'
import {
  idValidationSchema,
  requiredStudentValidationSchema,
  signInUserValidationSchema,
  studentValidationSchema,
  userValidationSchema,
} from '../utils/validation'

type bodyValidationSchemaType =
  | typeof requiredStudentValidationSchema
  | typeof studentValidationSchema
  | typeof userValidationSchema
  | typeof signInUserValidationSchema

type paramValidationSchemaType = typeof idValidationSchema

export const validateBody =
  (schema: bodyValidationSchemaType) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.validateSync(req.body, { abortEarly: false })
      next()
    } catch (err: any) {
      next(err.errors)
    }
  }

export const validateParams =
  (schema: paramValidationSchemaType) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.validateSync(req.params, { abortEarly: false })
      next()
    } catch (err: any) {
      next(err.errors)
    }
  }
