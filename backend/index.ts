import express, { Express, Request, Response } from 'express'
import studentRouter from './src/routes/student.route'

const app: Express = express()
const port = process.env.PORT

app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  })
)

//fds
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'ok' })
})

app.use('/students', studentRouter)

app.use((err: any, req: Request, res: Response) => {
  const statusCode = err.statusCode || 500
  console.error(err.message, err.stack)
  res.status(statusCode).json({ message: err.message })
  return
})

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
