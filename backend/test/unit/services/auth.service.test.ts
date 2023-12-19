import { AppDataSource } from '../../../src/configs/postgre.config'
import { User } from '../../../src/models/user.model'
import {
  generateAccessToken,
  generateRefreshToken,
  signUpUser,
  validateSignIn,
} from '../../../src/services/auth.service'
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'

jest.mock('../../../src/configs/postgre.config', () => ({
  AppDataSource: {
    getRepository: jest.fn().mockReturnValue({
      findOneBy: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    }),
  },
}))

const newUser: User = {
  email: 'john@gmail.com',
  firstName: 'John',
  isAdmin: undefined,
  lastName: 'Morrison',
  password: 'John1@gmail.com',
  timestamp: undefined,
}
const newAdminUser: User = {
  email: 'admin@gmail.com',
  firstName: 'Admin',
  isAdmin: undefined,
  lastName: 'Admin',
  password: 'Admin1@gmail.com',
  timestamp: undefined,
}
const sampleUser: User = {
  email: 'jesse@gmail.com',
  firstName: 'Jesse',
  isAdmin: false,
  lastName: 'Wells',
  password: 'Jesse1@gmail.com',
  timestamp: Date.now(),
}

// describe('Gets the a to given email', () => {
//   test('Gets the a', async () => {
//     jest.spyOn(AppDataSource.getRepository(User), 'findOneBy').mockResolvedValue(sampleUser)
//     const result = await getOneUser(sampleUser.email as string)
//     expect(result).toEqual(sampleUser)
//   })
//   test('No a for given email', async () => {
//     jest.spyOn(AppDataSource.getRepository(User), 'findOneBy').mockResolvedValue(null)
//     const result = await getOneUser('wrong@gmail.com')
//     expect(result).toEqual(null)
//   })
//   test('Get a fails due to error relating to findOneBy', async () => {
//     jest
//       .spyOn(AppDataSource.getRepository(User), 'findOneBy')
//       .mockRejectedValue(new Error('findOneBy error'))
//     await expect(getOneUser(sampleUser.email as string)).rejects.toThrowError('findOneBy error')
//   })
// })

describe('Signing Up User', () => {
  test('Sign up the new non admin a', async () => {
    const createdUser = { ...newUser, isAdmin: false, timestamp: Date.now() }
    jest.spyOn(AppDataSource.getRepository(User), 'findOneBy').mockResolvedValue(null)
    jest.spyOn(AppDataSource.getRepository(User), 'save').mockResolvedValue(createdUser)
    const result = await signUpUser(newUser)
    expect(result).toEqual(createdUser)
  })
  test('Sign up the new admin a', async () => {
    const createdUser = {
      ...newAdminUser,
      isAdmin: true,
      timestamp: Date.now(),
    }
    jest.spyOn(AppDataSource.getRepository(User), 'findOneBy').mockResolvedValue(null)
    jest.spyOn(AppDataSource.getRepository(User), 'save').mockResolvedValue(createdUser)
    const result = await signUpUser(newAdminUser)
    expect(result).toEqual(createdUser)
  })
  test('Sign up fails due to duplicate email', async () => {
    const existingUser = { ...newUser, isAdmin: false, timestamp: Date.now() }
    jest.spyOn(AppDataSource.getRepository(User), 'findOneBy').mockResolvedValue(existingUser)
    const result = await signUpUser(newUser)
    expect(result).toEqual(null)
  })
  test('Sign up fails due to error relating to findOneBy', async () => {
    jest
      .spyOn(AppDataSource.getRepository(User), 'findOneBy')
      .mockRejectedValue(new Error('findOneBy error'))
    await expect(signUpUser(newUser)).rejects.toThrowError('findOneBy error')
  })
  test('Sign up fails due to error relating to save', async () => {
    jest.spyOn(AppDataSource.getRepository(User), 'findOneBy').mockResolvedValue(null)
    jest.spyOn(AppDataSource.getRepository(User), 'save').mockRejectedValue(new Error('save error'))
    await expect(signUpUser(newUser)).rejects.toThrowError('save error')
  })
})

describe('Validating the sign in of User', () => {
  test('Sign in success', async () => {
    const saltRounds = 10
    const hashed = await bcrypt.hash(sampleUser.password as string, saltRounds)
    const existingUser = { ...sampleUser, password: hashed }
    jest.spyOn(AppDataSource.getRepository(User), 'findOneBy').mockResolvedValue(existingUser)
    const result = await validateSignIn(sampleUser.email as string, sampleUser.password as string)
    expect(result).toEqual(existingUser)
  })
  test('Sign in fails due to wrong email', async () => {
    jest.spyOn(AppDataSource.getRepository(User), 'findOneBy').mockResolvedValue(null)
    const result = await validateSignIn(sampleUser.email as string, sampleUser.password as string)
    expect(result).toEqual(null)
  })
  test('Sign in fails due to wrong password', async () => {
    const saltRounds = 10
    const hashed = await bcrypt.hash(sampleUser.password as string, saltRounds)
    sampleUser.password = hashed
    const existingUser = { ...sampleUser, password: hashed }
    jest.spyOn(AppDataSource.getRepository(User), 'findOneBy').mockResolvedValue(existingUser)
    const result = await validateSignIn(sampleUser.email as string, 'wrong')
    expect(result).toEqual(null)
  })
  test('Sign in fails due to error relating to findOneBy', async () => {
    jest
      .spyOn(AppDataSource.getRepository(User), 'findOneBy')
      .mockRejectedValue(new Error('findOneBy error'))
    await expect(
      validateSignIn(sampleUser.email as string, sampleUser.password as string)
    ).rejects.toThrowError('findOneBy error')
  })
})

describe('Generates an access token', () => {
  test('token generates', async () => {
    const secret = process.env.ACCESS_TOKEN_SECRET as string
    const result = generateAccessToken(sampleUser.email as string)
    const decode: JwtPayload = jwt.verify(result, secret) as JwtPayload
    expect(decode.email).toEqual(sampleUser.email)
  })
  test('token generates for wrong email', async () => {
    const secret = process.env.ACCESS_TOKEN_SECRET as string
    const result = generateAccessToken('wrong')
    const decode: JwtPayload = jwt.verify(result, secret) as JwtPayload
    expect(decode.email).not.toEqual(sampleUser.email)
  })
})

describe('Generates a refresh token', () => {
  test('token generates', async () => {
    const secret = process.env.REFRESH_TOKEN_SECRET as string
    const result = generateRefreshToken(sampleUser.email as string)
    const decode: JwtPayload = jwt.verify(result, secret) as JwtPayload
    expect(decode.email).toEqual(sampleUser.email)
  })
  test('token generates for wrong email', async () => {
    const secret = process.env.REFRESH_TOKEN_SECRET as string
    const result = generateRefreshToken('wrong')
    const decode: JwtPayload = jwt.verify(result, secret) as JwtPayload
    expect(decode.email).not.toEqual(sampleUser.email)
  })
})
