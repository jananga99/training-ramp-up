import { AppDataSource } from '../../../src/configs/postgre.config'
import { create, getMultiple, remove, update } from '../../../src/services/user.service'
import { User } from '../../../src/models/user.model'
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
let users: User[]
const user1 = {
  email: 'jesse1@gmail.com',
  firstName: 'Jesse',
  isAdmin: false,
  lastName: 'Wells',
  password: 'Jesse1@gmail.com',
  timestamp: Date.now(),
}
const user2 = {
  email: 'jesse2@gmail.com',
  firstName: 'Jesse',
  isAdmin: false,
  lastName: 'Wells',
  password: 'Jesse1@gmail.com',
  timestamp: Date.now(),
}
users = [user1, user2]
const updateuser = {
  email: 'jesse@gmail.com',
  firstName: 'Jesse',
  isAdmin: false,
  lastName: 'Wellhjgjs',
  password: 'Jesse1@gmail.com',
  timestamp: Date.now(),
}
const removeuser = {
  email: 'jesse@gmail.com',
  firstName: 'Jesse',
  isAdmin: false,
  lastName: 'Wellhjgjs',
  password: 'Jesse1@gmail.com',
  timestamp: Date.now(),
}

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

describe('user Getting', () => {
  test('get all the users', async () => {
    jest.spyOn(AppDataSource.getRepository(User), 'find').mockResolvedValue(users)
    const result = await getMultiple()
    expect(result).toHaveLength(2)
    expect(result).toContainEqual(user1)
    expect(result).toContainEqual(user2)
    expect(result).toEqual(users)
  })
  test('error in find', async () => {
    jest.spyOn(AppDataSource.getRepository(User), 'find').mockRejectedValue(new Error('find error'))
    await expect(getMultiple()).rejects.toThrowError('find error')
  })
})

describe('user Creating', () => {
  test('creates the user', async () => {
    const createduser = { ...newUser }
    jest.spyOn(AppDataSource.getRepository(User), 'save').mockResolvedValue(createduser)
    const result = await create(newUser)
    expect(result).toEqual(createduser)
  })
  test('error in save', async () => {
    jest.spyOn(AppDataSource.getRepository(User), 'save').mockRejectedValue(new Error('save error'))
    await expect(create(newUser)).rejects.toThrowError('save error')
  })
})

describe('user Updating', () => {
  test('updates the user', async () => {
    jest.spyOn(AppDataSource.getRepository(User), 'findOneBy').mockResolvedValue(user2)
    jest.spyOn(AppDataSource.getRepository(User), 'save').mockResolvedValue(updateuser)
    const result = await update(updateuser.email, updateuser)
    expect(result).toEqual(updateuser)
  })
  test('no user with given email to update', async () => {
    jest.spyOn(AppDataSource.getRepository(User), 'findOneBy').mockResolvedValue(null)
    const result = await update(updateuser.email, updateuser)
    expect(result).toEqual(null)
  })
  test('error in save', async () => {
    jest.spyOn(AppDataSource.getRepository(User), 'findOneBy').mockResolvedValue(updateuser)
    jest.spyOn(AppDataSource.getRepository(User), 'save').mockRejectedValue(new Error('save error'))
    await expect(update(updateuser.email, updateuser)).rejects.toThrowError('save error')
  })
})

describe('user Removing', () => {
  test('removes the user', async () => {
    jest.spyOn(AppDataSource.getRepository(User), 'findOneBy').mockResolvedValue(removeuser)
    jest.spyOn(AppDataSource.getRepository(User), 'remove').mockResolvedValue(removeuser)
    const result = await remove(removeuser.email)
    expect(result).toEqual(removeuser)
  })
  test('no user with given email to remove', async () => {
    jest.spyOn(AppDataSource.getRepository(User), 'findOneBy').mockResolvedValue(null)
    const result = await remove(removeuser.email)
    expect(result).toEqual(null)
  })
  test('error in remove', async () => {
    jest.spyOn(AppDataSource.getRepository(User), 'findOneBy').mockResolvedValue(removeuser)
    jest
      .spyOn(AppDataSource.getRepository(User), 'remove')
      .mockRejectedValue(new Error('remove error'))
    await expect(remove(removeuser.email)).rejects.toThrowError('remove error')
  })
})
