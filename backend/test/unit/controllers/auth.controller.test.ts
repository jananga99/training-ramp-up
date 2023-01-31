import { NextFunction, Request, Response } from 'express'
import { User } from '../../../src/models/user.model'
import {
  refreshToken,
  signIn,
  signOut,
  signUp,
} from '../../../src/controllers/auth.controller'
import * as authService from '../../../src/services/auth.service'
import {
  generateAccessToken,
  validateSignIn,
} from '../../../src/services/auth.service'

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

const sampleAccessToken = 'sample-token'
const sampleRefreshToken = 'sample-refresh-token'

jest.mock('../../../src/services/auth.service', () => ({
  validateSignIn: jest.fn(),
  generateAccessToken: jest.fn(),
  generateRefreshToken: jest.fn(),
  signUpUser: jest.fn(),
  getOneUser: jest.fn(),
}))

describe('signs up a new user', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })
  const getRequest = () =>
    ({
      body: newUser,
    } as unknown as Request)
  const getResponse = () =>
    ({
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response)
  const getNext = () => jest.fn() as NextFunction
  test('signs up the non admin user', async () => {
    const createdUser = {
      ...newUser,
      password: 'decoded',
      isAdmin: false,
      timestamp: Date.now(),
    }
    const spy = jest
      .spyOn(authService, 'signUpUser')
      .mockResolvedValue(createdUser)
    const req = getRequest()
    const res = getResponse()
    const next = getNext()
    await signUp(req, res, next)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(createdUser)
    expect(res.json).toHaveBeenCalledTimes(1)
    spy.mockRestore()
  })
  test('signs up the admin user', async () => {
    const createdUser = {
      ...newAdminUser,
      password: 'decoded',
      isAdmin: true,
      timestamp: Date.now(),
    }
    const spy = jest
      .spyOn(authService, 'signUpUser')
      .mockResolvedValue(createdUser)
    const req = getRequest()
    const res = getResponse()
    const next = getNext()
    await signUp(req, res, next)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(createdUser)
    expect(res.json).toHaveBeenCalledTimes(1)
    spy.mockRestore()
  })
  test('signs up fails due to duplicated email', async () => {
    const spy = jest.spyOn(authService, 'signUpUser').mockResolvedValue(null)
    const req = getRequest()
    const res = getResponse()
    const next = getNext()
    await signUp(req, res, next)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ message: 'Duplicated email.' })
    expect(res.json).toHaveBeenCalledTimes(1)
    spy.mockRestore()
  })

  test('sign up fails due to error', async () => {
    const err = new Error('error in signUpUser')
    const spy = jest.spyOn(authService, 'signUpUser').mockRejectedValue(err)
    const req = getRequest()
    const res = getResponse()
    const next = getNext()
    await signUp(req, res, next)
    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(err)
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
    spy.mockRestore()
  })
})

describe('signs in a user', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })
  const getRequest = () =>
    ({
      body: {
        email: sampleUser.email,
        password: sampleUser.password,
      },
    } as unknown as Request)
  const getResponse = () =>
    ({
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
    } as unknown as Response)
  const getNext = () => jest.fn() as NextFunction
  test('signs in the user', async () => {
    const spy = jest
      .spyOn(authService, 'validateSignIn')
      .mockResolvedValue(sampleUser)
    const spyAccessToken = jest
      .spyOn(authService, 'generateAccessToken')
      .mockReturnValue(sampleAccessToken)
    const spyRefreshToken = jest
      .spyOn(authService, 'generateRefreshToken')
      .mockReturnValue(sampleRefreshToken)
    const req = getRequest()
    const res = getResponse()
    const next = getNext()
    await signIn(req, res, next)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      accessToken: sampleAccessToken,
      isAdmin: false,
    })
    expect(res.json).toHaveBeenCalledTimes(1)
    expect(res.cookie).toHaveBeenCalledTimes(1)
    spy.mockRestore()
    spyAccessToken.mockRestore()
    spyRefreshToken.mockRestore()
  })

  test('sign in fails due to invalid email or password', async () => {
    const spy = jest
      .spyOn(authService, 'validateSignIn')
      .mockResolvedValue(null)
    const req = getRequest()
    const res = getResponse()
    const next = getNext()
    await signIn(req, res, next)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Invalid email or password',
    })
    expect(res.json).toHaveBeenCalledTimes(1)
    expect(res.cookie).not.toHaveBeenCalled()
    spy.mockRestore()
  })

  test('sign in fails due to error', async () => {
    const err = new Error('error in validateSignIn')
    const spy = jest.spyOn(authService, 'validateSignIn').mockRejectedValue(err)
    const req = getRequest()
    const res = getResponse()
    const next = getNext()
    await signIn(req, res, next)
    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(err)
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
    expect(res.cookie).not.toHaveBeenCalled()
    spy.mockRestore()
  })
})

describe('signs out a user', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })
  const getRequest = () => ({} as Request)
  const getResponse = () =>
    ({
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
    } as unknown as Response)
  const getNext = () => jest.fn() as NextFunction
  test('signs out the user', async () => {
    const req = getRequest()
    const res = getResponse()
    const next = getNext()
    await signOut(req, res, next)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ success: true })
    expect(res.json).toHaveBeenCalledTimes(1)
    expect(res.clearCookie).toHaveBeenCalledTimes(1)
  })
  test('sign out fails due to error', async () => {
    const err = new Error('error in clearCookie')
    const res = getResponse()
    const spy = jest.spyOn(res, 'clearCookie').mockImplementation(() => {
      throw err
    })
    const req = getRequest()
    const next = getNext()
    await signOut(req, res, next)
    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(err)
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
    spy.mockRestore()
  })
})

describe('refreshes user', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })
  const getRequest = () =>
    ({
      user: sampleUser,
    } as unknown as Request)
  const getResponse = () =>
    ({
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response)
  const getNext = () => jest.fn() as NextFunction
  test('refreshes the user', async () => {
    const spy = jest
      .spyOn(authService, 'generateAccessToken')
      .mockReturnValue(sampleAccessToken)
    const req = getRequest()
    const res = getResponse()
    const next = getNext()
    await refreshToken(req, res, next)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      accessToken: sampleAccessToken,
    })
    expect(res.json).toHaveBeenCalledTimes(1)
    spy.mockRestore()
  })

  test('refresh fails due to error', async () => {
    const err = new Error('error in generateAccessToken')
    const spy = jest
      .spyOn(authService, 'generateAccessToken')
      .mockImplementation(() => {
        throw err
      })
    const req = getRequest()
    const res = getResponse()
    const next = getNext()
    await refreshToken(req, res, next)
    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(err)
    expect(res.json).not.toHaveBeenCalled()
    spy.mockRestore()
  })
})
