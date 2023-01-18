import { Student } from '../models/student.model'
import { AppDataSource } from '../configs/postgre.config'

const repository = AppDataSource.getRepository(Student)

async function getMultiple(): Promise<Student[]> {
  return await repository.find()
}

async function getOne(dbId: number): Promise<Student | null> {
  return await repository.findOneBy({ dbId: dbId })
}

async function create(student: Student): Promise<Student> {
  return await repository.save(student)
}

async function update(dbId: number, student: Student): Promise<Student | null> {
  const existingStudent = await getOne(dbId)
  if (existingStudent) {
    student.dbId = dbId
    return await repository.save(student)
  } else {
    return null
  }
}

async function remove(dbId: number): Promise<Student | null> {
  const existingStudent = await getOne(dbId)
  if (existingStudent) {
    return await repository.remove(existingStudent)
  } else {
    return null
  }
}

export { getMultiple, create, update, remove }
