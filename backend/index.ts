import express, { Router } from 'express'
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
  }

  private config() {
    this.app.use(cors())
    this.app.use(express.json())
  }

  private async dbConfig() {
    try {
      console.log('\nConnecting to the database...')
      this.dbInstance = await dbConnect()

      const connectionCheck = await this.dbInstance.connect()
      if (connectionCheck) {
        console.log('Connected to the database successfully 🤖')
        connectionCheck.release()
        this.routerConfig()
      }
    } catch (error) {
      console.error('Error connecting to the database:', error)
    }
  }

  private routerConfig() {
    if (!this.dbInstance) {
      console.error(
        'Database instance is not available, skipping router configuration.'
      )
      return
    }
    this.app.use('/', serverRouter(this.dbInstance))
  }

  public async start(port: number) {
    await this.dbConfig()
    this.app.listen(port, () => {
      console.log(`Listening on port: ${port} 😎`)
    })
  }
}

export default Server
