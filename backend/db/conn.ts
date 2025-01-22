import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

export default async function dbConnect(): Promise<Pool> {
  const pool: Pool = new Pool({
    max: 20,
    host: process.env.POSTGRES_HOST || 'localhost',
    port: Number(process.env.POSTGRES_PORT) || 5432,
    database: process.env.POSTGRES_DB || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'mypassword',
    user: process.env.POSTGRES_USER || 'postgres',
    idleTimeoutMillis: 30000,
  })

  ;(async () => {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `)

      await pool.query(`
        CREATE TABLE IF NOT EXISTS todos (
          id SERIAL PRIMARY KEY,
          user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          progress DECIMAL(5, 2) DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `)

      await pool.query(`
        CREATE TABLE IF NOT EXISTS subtodos (
          id SERIAL PRIMARY KEY,
          todo_id INT NOT NULL REFERENCES todos(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          is_completed BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `)
      console.log('Tables created successfully')
    } catch (error) {
      console.log(
        `something went wrong while creating tables: ${error as any}😫`
      )
    }
  })()

  return pool
}
