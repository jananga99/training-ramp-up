import { Request, Response, NextFunction } from 'express'
import {
  generateAccessToken,
  generateRefreshToken,
  validateSignIn,
} from '../services/auth.service'

async function signIn(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await validateSignIn(req.body.email, req.body.password)
    if (result) {
      res.cookie('jwt', generateRefreshToken(req.body.email), {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 3 * 24 * 60 * 60 * 1000,
      })
      res.status(200).json({
        accessToken: generateAccessToken(req.body.email),
      })
    } else {
      res
        .status(401)
        .json({ success: false, message: 'Invalid email or password' })
    }
  } catch (err: any) {
    console.error(`Error while signing in the user`, err.message)
    next(err)
  }
}

export { signIn }
