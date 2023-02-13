import { User } from '../models/user.model'
import { AppDataSource } from '../configs/postgre.config'

const repository = AppDataSource.getRepository(User)

async function getMultiple(): Promise<User[]> {
  return repository.find()
}

async function getOne(email: string): Promise<User | null> {
  return repository.findOneBy({ email: email })
}

async function create(user: User): Promise<User> {
  return repository.save(user)
}

async function update(email: string, user: User): Promise<User | null> {
  const existingUser = await getOne(email)
  if (existingUser) {
    user.email = email
    return repository.save(user)
  } else {
    return null
  }
}

async function remove(email: string): Promise<User | null> {
  const existingUser = await getOne(email)
  if (existingUser) {
    return repository.remove(existingUser)
  } else {
    return null
  }
}

export { getMultiple, create, update, remove, getOne }
