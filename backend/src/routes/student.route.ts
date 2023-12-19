import express from 'express'
import {
  getStudents,
  createStudent,
  updateStudent,
  removeStudent,
} from '../controllers/student.controller'
import passport from 'passport'
import { validateBody, validateParams } from '../middlewares/validate'
import {
  idValidationSchema,
  requiredStudentValidationSchema,
  studentValidationSchema,
} from '../utils/validation'

const router = express.Router()

/* GET students. */
router.get('/', passport.authenticate('jwt', { session: false }), getStudents)

/* POST student */
router.post(
  '/',
  passport.authenticate('jwt-admin', { session: false }),
  validateBody(requiredStudentValidationSchema),
  validateBody(studentValidationSchema),
  createStudent
)

/* PUT student */
router.patch(
  '/:id',
  passport.authenticate('jwt-admin', { session: false }),
  validateParams(idValidationSchema),
  validateBody(studentValidationSchema),
  updateStudent
)

/* DELETE student */
router.delete(
  '/:id',
  passport.authenticate('jwt-admin', { session: false }),
  validateParams(idValidationSchema),
  removeStudent
)

export default router
