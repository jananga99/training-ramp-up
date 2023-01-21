import { User } from '../models/user.model'
import { AppDataSource } from '../configs/postgre.config'
import bcrypt from 'bcrypt'

const repository = AppDataSource.getRepository(User)

async function getOne(email: string): Promise<User | null> {
  return await repository.findOneBy({ email: email })
}

async function create(user: User): Promise<User | null> {
  const existingUser = await getOne(user.email as string)
  if (existingUser) {
    return null
  } else {
    user.timestamp = Date.now()
    const saltRounds = 10
    user.password = await bcrypt.hash(user.password as string, saltRounds)
    return await repository.save(user)
  }
}

export { create, getOne }
