import { Router } from 'express'
import userRouter from './user/user.routes'
import todoRouter from './user/user.routes'

const router: Router = Router()

router.use('/user', userRouter)
router.use('/todo', todoRouter)

export default router
