import bcrypt from 'bcrypt'
import { getOne } from './user.service'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

async function validateSignIn(
  email: string,
  password: string
): Promise<boolean> {
  const existingUser = await getOne(email)
  if (existingUser && existingUser.password) {
    return await bcrypt.compare(password, existingUser.password)
  } else {
    return false
  }
}

function generateAccessToken(email: string): string {
  return jwt.sign(
    {
      email: email,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: '30m',
    }
  )
}

function generateRefreshToken(email: string): string {
  return jwt.sign(
    {
      email: email,
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: '2d',
    }
  )
}

export { validateSignIn, generateAccessToken, generateRefreshToken }
