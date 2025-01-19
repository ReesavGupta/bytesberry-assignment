import { Pool } from 'pg'

export default new Pool({
  max: 20,
  host: 'localhost',
  port: 5432,
  database: 'postgres',
  password: 'mypassword',
  user: 'postgres',
  idleTimeoutMillis: 30000,
})
