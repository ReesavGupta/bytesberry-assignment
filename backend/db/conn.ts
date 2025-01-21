import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

export default async function dbConnect() {
  return new Pool({
    max: 20,
    host: process.env.POSTGRES_HOST || 'localhost',
    port: Number(process.env.POSTGRES_PORT) || 5432,
    database: process.env.POSTGRES_DB || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'mypassword',
    user: process.env.POSTGRES_USER || 'postgres',
    idleTimeoutMillis: 30000,
  })
}
