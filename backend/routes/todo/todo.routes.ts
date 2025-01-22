import { Router } from 'express'
import { Pool } from 'pg'
import TodoController from '../../controllers/todo.controller'

export default function todoRouterHandler(db: Pool) {
  const router = Router()
  const todoController = new TodoController(db)

  router.get('/get-todos/:userId', todoController.getTodos)

  router.get('/get-todo/:todoId', todoController.getTodoById)

  router.post('/create-todo', todoController.createTodo)

  router.put('/update-todo/:todoId', todoController.updateTodo)

  router.delete('/delete-todo/:todoId', todoController.deleteTodo)

  router.post('/add-subtodo', todoController.addSubtodo)

  router.patch('/complete-subtodo/:subtodoId', todoController.completeSubtodo)

  return router
}
