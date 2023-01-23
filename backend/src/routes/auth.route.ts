import express from 'express'
import { refreshToken, signIn } from '../controllers/auth.controller'
import passport from 'passport'

const router = express.Router()
router.post('/', signIn)
router.post(
  '/refresh',
  passport.authenticate('refresh', { session: false }),
  refreshToken
)

export default router
