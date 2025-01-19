import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()

const app = express()
app.use(cors())

const port = process.env.PORT
app.listen(port, () => {
  console.log(`server's listening on port: ${port} 😎`)
})
