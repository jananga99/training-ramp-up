import express from 'express'
import {
  getStudents,
  createStudent,
  updateStudent,
  removeStudent,
} from '../controllers/student.controller'
import passport from 'passport'

const router = express.Router()

/* GET students. */
router.get('/', passport.authenticate('jwt', { session: false }), getStudents)

/* POST student */
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  createStudent
)

/* PUT student */
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  updateStudent
)

/* DELETE student */
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  removeStudent
)

export default router
