import express from 'express'
import {
  refreshToken,
  signIn,
  signUp,
  signOut,
} from '../controllers/auth.controller'
import passport from 'passport'
import { validateBody } from '../middlewares/validate'
import {
  signInUserValidationSchema,
  userValidationSchema,
} from '../utils/validation'

const router = express.Router()
router.post('/signUp', validateBody(userValidationSchema), signUp)
router.post('/', validateBody(signInUserValidationSchema), signIn)
router.post('/signOut', signOut)
router.post(
  '/refresh',
  passport.authenticate('refresh', { session: false }),
  refreshToken
)

export default router
