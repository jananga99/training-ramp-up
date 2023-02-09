import { Request, Response, NextFunction } from 'express'
import {
  generateAccessToken,
  generateRefreshToken,
  validateSignIn,
  signUpUser,
} from '../services/auth.service'
import { User } from '../models/user.model'

async function signUp(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await signUpUser(req.body)
    if (user) {
      delete user?.password
      res.status(201).json(user)
    } else {
      res.status(200).json({ message: 'Duplicated email.' })
    }
  } catch (err: any) {
    next(err)
  }
}

async function signIn(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await validateSignIn(req.body.email, req.body.password)
    if (result) {
      res
        .cookie('jwt-access', generateAccessToken(req.body.email), {
          httpOnly: true,
          sameSite: 'strict',
          secure: true,
          maxAge: 10 * 60 * 1000,
        })
        .cookie('jwt-refresh', generateRefreshToken(req.body.email), {
          httpOnly: true,
          sameSite: 'strict',
          secure: true,
          maxAge: 2 * 24 * 60 * 60 * 1000,
        })
        .status(200)
        .json({
          isAdmin: result.isAdmin,
        })
    } else {
      res.status(401).json({ success: true, message: 'Invalid email or password' })
    }
  } catch (err: any) {
    next(err)
  }
}

async function signOut(req: Request, res: Response, next: NextFunction) {
  try {
    res.clearCookie('jwt-access')
    res.clearCookie('jwt-refresh')
    res.status(200).json({ success: true })
  } catch (err) {
    next(err)
  }
}

async function refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res
      .cookie('jwt-access', generateAccessToken((req.user as User).email as string), {
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
        maxAge: 60 * 10 * 1000,
      })
      .status(200)
      .json({
        isAdmin: (req.user as User).isAdmin,
      })
  } catch (err: any) {
    next(err)
  }
}

export { signIn, refreshToken, signUp, signOut }
