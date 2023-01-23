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
router.post('/', createStudent)

/* PUT student */
router.put('/:id', updateStudent)

/* DELETE student */
router.delete('/:id', removeStudent)

export default router
