import bcrypt from 'bcrypt'
import { User } from '../models/user.model'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { create, getOne } from './user.service'
dotenv.config()

async function signUpUser(user: User): Promise<User | null> {
  const existingUser = await getOne(user.email as string)
  if (existingUser) {
    return null
  } else {
    user.timestamp = Date.now()
    const saltRounds = 10
    user.password = await bcrypt.hash(user.password as string, saltRounds)
    user.isAdmin = user.email === 'admin@gmail.com'
    return create(user)
  }
}

async function validateSignIn(email: string, password: string): Promise<User | null> {
  const existingUser = await getOne(email)
  if (existingUser && existingUser.password) {
    const result = await bcrypt.compare(password, existingUser.password)
    if (result) {
      return existingUser
    } else {
      return null
    }
  } else {
    return null
  }
}

function generateAccessToken(email: string): string {
  return jwt.sign(
    {
      email: email,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: '10m',
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

export { validateSignIn, generateAccessToken, generateRefreshToken, signUpUser }
