import { createConnection, DataSource } from 'typeorm'
import { Student } from '../models/student.model'
import dotenv from 'dotenv'
import { User } from '../models/user.model'
dotenv.config()

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string) | 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: [Student, User],
  subscribers: [],
  migrations: [],
})

AppDataSource.initialize()
  .then(() => {
    console.log(
      `Connected to ${process.env.DB_DATABASE}  database running at ${process.env.DB_HOST} on port ${process.env.DB_PORT}`
    )
  })
  .catch(error => console.log(error))
