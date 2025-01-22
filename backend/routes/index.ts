import { Router } from 'express'
import { Pool } from 'pg'
import userRouterHandler from './user/user.routes'
import todoRouterHandler from './todo/todo.routes'

export default function serverRouter(db: Pool) {
  const router: Router = Router()

  router.use('/user', userRouterHandler(db))
  router.use('/todo', todoRouterHandler(db))

  return router
}
