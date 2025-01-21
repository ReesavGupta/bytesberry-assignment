import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { Pool } from 'pg'
dotenv.config()
import serverRouter from './routes'
import dbConnect from './db/conn'

class Server {
  public app
  private dbInstance: Pool | undefined

  constructor() {
    this.app = express()
    this.config()
    this.dbConfig()
    this.routerConfig()
  }

  private config() {
    this.app.use(cors())
    this.app.use(express.json())
  }

  private async dbConfig() {
    try {
      console.log('connecting to the db...')
      this.dbInstance = await dbConnect()
      const connectionCheck = await this.dbInstance.connect()

      connectionCheck
        ? console.log(`Connected to the database successfully 🤖`)
        : console.log(`Something went wrong while connecting to the db ☹`)
      connectionCheck.release()
    } catch (error) {
      console.error(`Error connecting to the database:`, error as any)
    }
  }

  private routerConfig() {
    if (!this.dbInstance) {
      return
    }
    this.app.use('/', serverRouter(this.dbInstance))
  }

  public start(port: Number) {
    this.app.listen(port, () => {
      console.log(`listening on port: ${port} 😎`)
    })
  }
}

export default Server
