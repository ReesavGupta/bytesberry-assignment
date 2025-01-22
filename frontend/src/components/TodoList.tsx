import { useState, useEffect } from 'react'
import { ChevronDown, Plus } from 'lucide-react'

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

  useEffect(() => {
    // Replace with your actual API endpoint
    fetch('/api/todos/1') // userId = 1 for demo
      .then((res) => res.json())
      .then((data) => {
        setTodos(data)
        setLoading(false)
      })
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
          <span className="text-sm text-gray-500">2</span>
        </div>

        <div className="space-y-2">
          {loading ? (
            <div>Loading...</div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className="bg-white rounded-lg border p-4"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded-full border-2"
                  />
                  <span>{todo.title}</span>
                  <div className="ml-auto text-sm text-gray-500">
                    {todo.progress}%
                  </div>
                </div>

                {todo.subtodos && (
                  <div className="ml-8 mt-2 space-y-2">
                    {todo.subtodos.map((subtodo) => (
                      <div
                        key={subtodo.id}
                        className="flex items-center gap-3"
                      >
                        <input
                          type="checkbox"
                          checked={subtodo.is_completed}
                          className="w-4 h-4 rounded-full border-2"
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

        <button className="flex items-center gap-2 text-gray-500 mt-4 p-2 hover:bg-gray-100 rounded-md">
          <Plus size={20} />
          Add task
        </button>
      </section>
    </div>
  )
}
