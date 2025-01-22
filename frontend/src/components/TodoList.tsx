import { useState, useEffect } from 'react'
import { ChevronDown, Plus } from 'lucide-react'
import { AddTodoDialog } from './AddTodoDialog'
import { todoApi } from '../api/todoapi'

interface Todo {
  id: number
  title: string
  progress: number
  subtodos: Subtodo[]
}

interface Subtodo {
  id: number
  title: string
  is_completed: boolean
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTodos = async () => {
    try {
      const data = await todoApi.getTodos(1) // userId = 1 for demo
      console.log(data)
      // setTodos(data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch todos:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Home 🏠</h1>
      </div>

      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <ChevronDown
            size={20}
            className="text-gray-400"
          />
          <h2 className="text-lg font-medium">Routines</h2>
          <span className="text-sm text-gray-500">{todos.length}</span>
        </div>

        <div className="space-y-2">
          {loading ? (
            <div className="text-gray-500">Loading...</div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className="bg-white rounded-lg border p-4"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded-full border-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="flex-grow">{todo.title}</span>
                  <div className="text-sm text-gray-500">{todo.progress}%</div>
                </div>

                {todo.subtodos && todo.subtodos.length > 0 && (
                  <div className="ml-8 mt-2 space-y-2">
                    {todo.subtodos.map((subtodo) => (
                      <div
                        key={subtodo.id}
                        className="flex items-center gap-3"
                      >
                        <input
                          type="checkbox"
                          checked={subtodo.is_completed}
                          onChange={() => {
                            /* Implement subtodo completion logic */
                          }}
                          className="w-4 h-4 rounded-full border-2 text-blue-600 focus:ring-blue-500"
                        />
                        <span
                          className={
                            subtodo.is_completed
                              ? 'line-through text-gray-400'
                              : ''
                          }
                        >
                          {subtodo.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <AddTodoDialog
          userId={1}
          onTodoAdded={fetchTodos}
        />
      </section>
    </div>
  )
}
