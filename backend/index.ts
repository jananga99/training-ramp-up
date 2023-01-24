import express, { Express, Request, Response } from 'express'
import studentRouter from './src/routes/student.route'
import userRouter from './src/routes/user.route'
import authRouter from './src/routes/auth.route'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import './src/configs/passport.config'
import passport from 'passport'
import cookieParser from 'cookie-parser'

const app: Express = express()
app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  })
)
app.use(cookieParser())

const httpServer = createServer(app)
export const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
})

app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  })
)

app.use(passport.initialize())

//fds
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'ok' })
})

app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/students', studentRouter)

app.use((err: any, req: Request, res: Response) => {
  const statusCode = err.statusCode || 500
  console.error(err.message, err.stack)
  res.status(statusCode).json({ message: err.message })
  return
})

httpServer.listen(process.env.PORT, () => {
  console.log(`Https server is running at http://localhost:${process.env.PORT}`)
})
