import { Request, Response } from 'express'
import { Pool, PoolClient } from 'pg'

interface Todo {
  id: number
  user_id: number
  title: string
  progress: number
  created_at: string
}

interface Subtodo {
  id: number
  todo_id: number
  title: string
  is_completed: boolean
  created_at: string
}

export default class TodoController {
  private dbConnection: Pool

  constructor(db: Pool) {
    this.dbConnection = db
  }

  public getTodos = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params
    try {
      const result = await this.dbConnection.query<Todo>(
        `SELECT * FROM todos WHERE user_id = $1`,
        [userId]
      )
      res.status(200).json(result.rows)
    } catch (error) {
      console.error('Error fetching todos:', error)
      res.status(500).json({ error: 'Failed to fetch todos' })
    }
  }

  public getTodoById = async (req: Request, res: Response): Promise<void> => {
    const { todoId } = req.params
    try {
      const todoResult = await this.dbConnection.query<Todo>(
        `SELECT * FROM todos WHERE id = $1`,
        [todoId]
      )
      const subtodoResult = await this.dbConnection.query<Subtodo>(
        `SELECT * FROM subtodos WHERE todo_id = $1`,
        [todoId]
      )

      if (todoResult.rows.length === 0) {
        res.status(404).json({ error: 'Todo not found' })
      } else {
        res.status(200).json({
          todo: todoResult.rows[0],
          subtodos: subtodoResult.rows,
        })
      }
    } catch (error) {
      console.error('Error fetching todo:', error)
      res.status(500).json({ error: 'Failed to fetch todo' })
    }
  }

  public createTodo = async (req: Request, res: Response): Promise<void> => {
    const {
      userId,
      title,
      subtodos,
    }: { userId: number; title: string; subtodos?: string[] } = req.body

    const client: PoolClient = await this.dbConnection.connect()

    try {
      await client.query('BEGIN')

      const todoResult = await client.query<Todo>(
        `INSERT INTO todos (user_id, title) VALUES ($1, $2) RETURNING *`,
        [userId, title]
      )
      const todo = todoResult.rows[0]

      const subtodoPromises = (subtodos || []).map((subtodoTitle: string) => {
        return client.query<Subtodo>(
          `INSERT INTO subtodos (todo_id, title) VALUES ($1, $2) RETURNING *`,
          [todo.id, subtodoTitle]
        )
      })

      const subtodoResults = await Promise.all(subtodoPromises)
      const createdSubtodos = subtodoResults.map((result) => result.rows[0])

      await client.query('COMMIT')

      res.status(201).json({
        todo,
        subtodos: createdSubtodos,
      })
    } catch (error) {
      await client.query('ROLLBACK')
      console.error('Error creating todo with subtodos:', error)
      res.status(500).json({ error: 'Failed to create todo with subtodos' })
    } finally {
      client.release()
    }
  }

  public updateTodo = async (req: Request, res: Response): Promise<void> => {
    const { todoId } = req.params
    const { title }: { title: string } = req.body
    try {
      const result = await this.dbConnection.query<Todo>(
        `UPDATE todos SET title = $1 WHERE id = $2 RETURNING *`,
        [title, todoId]
      )
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Todo not found' })
      } else {
        res.status(200).json(result.rows[0])
      }
    } catch (error) {
      console.error('Error updating todo:', error)
      res.status(500).json({ error: 'Failed to update todo' })
    }
  }

  public deleteTodo = async (req: Request, res: Response): Promise<void> => {
    const { todoId } = req.params
    try {
      await this.dbConnection.query(`DELETE FROM subtodos WHERE todo_id = $1`, [
        todoId,
      ])
      const result = await this.dbConnection.query<Todo>(
        `DELETE FROM todos WHERE id = $1 RETURNING *`,
        [todoId]
      )
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Todo not found' })
      } else {
        res.status(200).json({ message: 'Todo deleted successfully' })
      }
    } catch (error) {
      console.error('Error deleting todo:', error)
      res.status(500).json({ error: 'Failed to delete todo' })
    }
  }

  public addSubtodo = async (req: Request, res: Response): Promise<void> => {
    const { todoId, title }: { todoId: number; title: string } = req.body
    try {
      const result = await this.dbConnection.query<Subtodo>(
        `INSERT INTO subtodos (todo_id, title) VALUES ($1, $2) RETURNING *`,
        [todoId, title]
      )
      res.status(201).json(result.rows[0])
    } catch (error) {
      console.error('Error adding subtodo:', error)
      res.status(500).json({ error: 'Failed to add subtodo' })
    }
  }

  public completeSubtodo = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { subtodoId } = req.params
    try {
      const result = await this.dbConnection.query<Subtodo>(
        `UPDATE subtodos SET is_completed = TRUE WHERE id = $1 RETURNING *`,
        [subtodoId]
      )
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Subtodo not found' })
      } else {
        res.status(200).json(result.rows[0])
      }
    } catch (error) {
      console.error('Error completing subtodo:', error)
      res.status(500).json({ error: 'Failed to complete subtodo' })
    }
  }

  public recalculateProgress = async (todoId: number): Promise<void> => {
    try {
      const progressResult = await this.dbConnection.query<{
        progress: number
      }>(
        `
        SELECT
          (COUNT(*) FILTER (WHERE is_completed) * 100.0 / NULLIF(COUNT(*), 0)) AS progress
        FROM subtodos
        WHERE todo_id = $1
        `,
        [todoId]
      )
      const progress = progressResult.rows[0]?.progress || 0
      await this.dbConnection.query(
        `UPDATE todos SET progress = $1 WHERE id = $2`,
        [progress, todoId]
      )
    } catch (error) {
      console.error('Error recalculating progress:', error)
    }
  }
}
