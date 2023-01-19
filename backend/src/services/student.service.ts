import { Student } from '../models/student.model'
import { AppDataSource } from '../configs/postgre.config'

const repository = AppDataSource.getRepository(Student)

async function getMultiple(): Promise<Student[]> {
  return await repository.find()
}

async function getOne(id: number): Promise<Student | null> {
  return await repository.findOneBy({ id: id })
}

async function create(student: Student): Promise<Student> {
  return await repository.save(student)
}

async function update(id: number, student: Student): Promise<Student | null> {
  const existingStudent = await getOne(id)
  if (existingStudent) {
    student.id = id
    return await repository.save(student)
  } else {
    return null
  }
}

async function remove(id: number): Promise<Student | null> {
  const existingStudent = await getOne(id)
  if (existingStudent) {
    return await repository.remove(existingStudent)
  } else {
    return null
  }
}

export { getMultiple, create, update, remove }
