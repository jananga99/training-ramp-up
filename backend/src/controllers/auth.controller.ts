import { Request, Response, NextFunction } from 'express'
import {
  generateAccessToken,
  generateRefreshToken,
  validateSignIn,
  signUpUser,
} from '../services/auth.service'

async function signUp(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await signUpUser(req.body)
    if (user) {
      delete user?.password
      res.status(201).json(user)
      new Error()
    } else {
      res.status(200).json({ message: 'Duplicated email.' })
    }
  } catch (err: any) {
    console.error(`Error while creating user`, err.message)
    next(err)
  }
}

async function signIn(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await validateSignIn(req.body.email, req.body.password)
    if (result) {
      res
        .cookie('jwt', generateRefreshToken(req.body.email), {
          httpOnly: true,
          sameSite: 'strict',
          secure: true,
          maxAge: 3 * 24 * 60 * 60 * 1000,
        })
        .status(200)
        .json({
          accessToken: generateAccessToken(req.body.email),
        })
    } else {
      res
        .status(401)
        .json({ success: true, message: 'Invalid email or password' })
    }
  } catch (err: any) {
    console.error(`Error while signing in the user`, err.message)
    next(err)
  }
}

async function signOut(req: Request, res: Response, next: NextFunction) {
  try {
    res.clearCookie('jwt')
    res.status(200).json({ success: true })
  } catch (err) {
    console.log('Error in clearing the cookie')
    next(err)
  }
}

async function refreshToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    console.log('Access token was refreshed.')
    res.status(200).json({
      accessToken: generateAccessToken(req.body.email),
    })
  } catch (err: any) {
    console.error(`Access token generation failed`, err.message)
    next(err)
  }
}

export { signIn, refreshToken, signUp, signOut }
