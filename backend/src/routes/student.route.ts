import express from 'express'
import {
  getStudents,
  createStudent,
  updateStudent,
  removeStudent,
} from '../controllers/student.controller'

const router = express.Router()

/* GET students. */
router.get('/', getStudents)

/* POST student */
router.post('/', createStudent)

/* PUT student */
router.put('/:dbId', updateStudent)

/* DELETE student */
router.delete('/:dbId', removeStudent)

export default router
