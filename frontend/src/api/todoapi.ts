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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const todoApi = {
  async getTodos(userId: number): Promise<Todo[]> {
    const response = await fetch(`${API_URL}/todos/${userId}`)
    if (!response.ok) throw new Error('Failed to fetch todos')
    return response.json()
  },

  async createTodo(
    userId: number,
    title: string,
    subtodos?: string[]
  ): Promise<{ todo: Todo; subtodos: Subtodo[] }> {
    const response = await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, title, subtodos }),
    })
    if (!response.ok) throw new Error('Failed to create todo')
    return response.json()
  },

  async updateTodo(todoId: number, title: string): Promise<Todo> {
    const response = await fetch(`${API_URL}/todos/${todoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    })
    if (!response.ok) throw new Error('Failed to update todo')
    return response.json()
  },

  async deleteTodo(todoId: number): Promise<void> {
    const response = await fetch(`${API_URL}/todos/${todoId}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete todo')
  },

  async completeSubtodo(subtodoId: number): Promise<Subtodo> {
    const response = await fetch(`${API_URL}/subtodos/${subtodoId}/complete`, {
      method: 'PUT',
    })
    if (!response.ok) throw new Error('Failed to complete subtodo')
    return response.json()
  },
}
