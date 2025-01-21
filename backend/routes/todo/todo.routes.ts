import { Router } from 'express'
import { Pool } from 'pg'

export default function todoRouterHandler(db: Pool) {
  const router = Router()

  router.get('/get-todos')

  return router
}
