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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const todoApi = {
  async getTodos(userId: number): Promise<Todo[]> {
    const response = await fetch(`${API_URL}/todo/get-todos/${userId}`)
    if (!response.ok) throw new Error('Failed to fetch todos')
    const result = await response.json()
    return result
  },

  async createTodo(
    userId: number,
    title: string,
    subtodos?: string[]
  ): Promise<{ todo: Todo; subtodos: Subtodo[] }> {
    console.log(`in todo api --> going good 👍`)
    const response = await fetch(`${API_URL}/todo/create-todo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, title, subtodos }),
    })
    if (!response.ok) throw new Error('Failed to create todo')
    const result = await response.json()
    console.log(result)
    return result
  },

  async updateTodo(todoId: number, title: string): Promise<Todo> {
    const response = await fetch(`${API_URL}/todo/update-todo/${todoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    })
    if (!response.ok) throw new Error('Failed to update todo')
    const result = await response.json()
    return result
  },

  async deleteTodo(todoId: number): Promise<void> {
    const response = await fetch(`${API_URL}/todo/delete-todo/${todoId}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete todo')
  },

  async completeSubtodo(subtodoId: number): Promise<Subtodo> {
    const response = await fetch(
      `${API_URL}/todo/complete-subtodo/${subtodoId}`,
      {
        method: 'PATCH',
      }
    )
    if (!response.ok) throw new Error('Failed to complete subtodo')
    const result = await response.json()
    return result
  },
}
