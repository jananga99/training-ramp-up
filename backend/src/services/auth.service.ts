import bcrypt from 'bcrypt'
import { User } from '../models/user.model'
import { AppDataSource } from '../configs/postgre.config'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const repository = AppDataSource.getRepository(User)

async function getOneUser(email: string): Promise<User | null> {
  return await repository.findOneBy({ email: email })
}

async function signUpUser(user: User): Promise<User | null> {
  const existingUser = await getOneUser(user.email as string)
  if (existingUser) {
    return null
  } else {
    user.timestamp = Date.now()
    const saltRounds = 10
    user.password = await bcrypt.hash(user.password as string, saltRounds)
    user.isAdmin = user.email === 'admin@gmail.com'
    return await repository.save(user)
  }
}

async function validateSignIn(
  email: string,
  password: string
): Promise<User | null> {
  const existingUser = await getOneUser(email)
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
      expiresIn: '1h',
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

export {
  validateSignIn,
  generateAccessToken,
  generateRefreshToken,
  signUpUser,
  getOneUser,
}
