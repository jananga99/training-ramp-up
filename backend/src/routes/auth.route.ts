import express from 'express'
import {
  refreshToken,
  signIn,
  signUp,
  signOut,
} from '../controllers/auth.controller'
import passport from 'passport'

const router = express.Router()
router.post('/signUp', signUp)
router.post('/', signIn)
router.post('/signOut', signOut)
router.post(
  '/refresh',
  passport.authenticate('refresh', { session: false }),
  refreshToken
)

export default router
