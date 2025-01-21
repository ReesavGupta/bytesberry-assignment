import { Router } from 'express'
import UserController from '../../controllers/user.controller'
import { Pool } from 'pg'

export default function userRouterHandler(db: Pool) {
  const router: Router = Router()
  const userController = new UserController(db)
  router.post('/signUp', userController.userSignUp)
  router.post('/signIn', userController.userSignIn)

  return router
}
