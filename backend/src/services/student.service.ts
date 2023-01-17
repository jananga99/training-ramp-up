import { Gender, Student } from '../models/student.model'

async function getMultiple(): Promise<Map<string, Student>> {
  const data: Map<string, Student> = new Map()
  return new Promise((resolve, reject) => {
    // Get data from the database
    // Sample data until database connected
    data.set('key-1', {
      address: 'Gotham',
      age: 40,
      birthday: new Date('1989-11-13'),
      dbId: 'key-1',
      gender: Gender.MALE,
      id: 3,
      mobileNo: '0112345678',
      name: 'Bruce Wayne',
    })
    data.set('key-2', {
      address: 'Valeria',
      age: 19,
      birthday: new Date('1989-11-13'),
      dbId: 'key-2',
      gender: Gender.MALE,
      id: 10,
      mobileNo: '0112345678',
      name: 'Aemond Targaryen',
    })
    data.set('key-3', {
      address: 'Kattegat',
      age: 33,
      birthday: new Date('1989-11-13'),
      dbId: 'key-3',
      gender: Gender.MALE,
      id: 25,
      mobileNo: '0112345678',
      name: 'Ivar Lothbrok',
    })
    resolve(data)
  })
}

async function create(student: Student): Promise<Student> {
  return new Promise((resolve, reject) => {
    // Create student and set dbId of the student
    // Sample data creation until database connected
    student.dbId = 'key-45'
    resolve(student)
  })
}

async function update(dbId: string, student: Student): Promise<Student> {
  return new Promise((resolve, reject) => {
    // Update student and set dbId of the student
    resolve(student)
  })
}

async function remove(dbId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Delete the student
    resolve()
  })
}

export { getMultiple, create, update, remove }
