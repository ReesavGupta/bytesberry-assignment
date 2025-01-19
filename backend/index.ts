import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { Pool } from 'pg'
dotenv.config()
import serverRouter from './routes'

class Server {
  public app
  private pool: Pool | undefined

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
      this.pool = new Pool()
      const dbInstance = await this.pool.connect()

      dbInstance
        ? console.log(`Connected to the database successfully 🤖`)
        : console.log(`Something went wrong while connecting to the db ☹`)
      dbInstance.release()
    } catch (error) {
      console.error(`Error connecting to the database:`, (error as any).message)
    }
  }

  private routerConfig() {
    this.app.use('/', serverRouter)
  }

  public start(port: Number) {
    this.app.listen(port, () => {
      console.log(`listening on port: ${port} 😎`)
    })
  }
}

export default Server
