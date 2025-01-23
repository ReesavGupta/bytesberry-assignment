import { useState, useEffect } from 'react'
import { ChevronRight } from 'lucide-react'
import { AddTodoDialog } from './AddTodoDialog'
import { todoApi } from '../api/todoapi'
import useAuth from '../store/authStore'

interface Todo {
  id: number
  title: string
  progress: number
  user_id: string | ''
  createdAt: Date
  subtodos: Subtodo[]
}

interface Subtodo {
  id: number
  title: string
  is_completed: boolean
  todo_id: number
  createdAt: Date
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const [queue, setQueue] = useState<number[]>([])

  const fetchTodos = async () => {
    try {
      const data = await todoApi.getTodos(Number(user?.id))
      setTodos(data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch todos:', error)
      setLoading(false)
    }
  }

  const editTodo = async (todoId: number, title: string) => {
    try {
      await todoApi.updateTodo(todoId, title)
      fetchTodos()
    } catch (error) {
      console.error('Failed to edit todo:', error)
    }
  }

  const deleteTodo = async (todoId: number) => {
    try {
      await todoApi.deleteTodo(todoId)
      fetchTodos()
    } catch (error) {
      console.error('Failed to delete todo:', error)
    }
  }

  const calculateProgress = (todo: Todo): number => {
    const total = todo.subtodos.length
    const completed = todo.subtodos.filter(
      (subtodo) => subtodo.is_completed
    ).length
    return total > 0 ? Math.round((completed / total) * 100) : 0
  }

  const handleSubtodoChange = (
    todoId: number,
    subtodoId: number,
    isCompleted: boolean
  ) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => {
        if (todo.id === todoId) {
          const updatedSubtodos = todo.subtodos.map((subtodo) =>
            subtodo.id === subtodoId
              ? { ...subtodo, is_completed: isCompleted }
              : subtodo
          )
          const updatedProgress = calculateProgress({
            ...todo,
            subtodos: updatedSubtodos,
          })
          return {
            ...todo,
            subtodos: updatedSubtodos,
            progress: updatedProgress,
          }
        }
        return todo
      })
    )

    if (!queue.includes(todoId)) {
      setQueue((prevQueue) => [...prevQueue, todoId])
    }
  }

  useEffect(() => {
    if (queue.length > 0) {
      const timer = setTimeout(async () => {
        try {
          for (const queueTodoId of queue) {
            const todo = todos.find((todo) => queueTodoId === todo.id)
            if (todo) {
              for (const subtodo of todo.subtodos) {
                if (subtodo.is_completed) {
                  await todoApi.completeSubtodo(subtodo.id)
                }
              }
            }
          }
          setQueue([])
        } catch (error) {
          console.error('Failed to update todos:', error)
        }
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [queue, todos])

  useEffect(() => {
    if (user) {
      fetchTodos()
    }
  }, [])

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Home 🏠</h1>
      </div>

      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <ChevronRight
            size={20}
            className="text-gray-400"
          />
          <h2 className="text-lg font-medium">Routines -</h2>
          <span className="text-md font-semibold text-red-600">
            {todos.length}
          </span>
          <div>
            <AddTodoDialog
              userId={Number(user?.id)}
              onTodoAdded={fetchTodos}
            />
          </div>
        </div>

        <div className="space-y-2">
          {loading ? (
            <div className="text-gray-500">Loading...</div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className={`rounded-lg border p-4 ${
                  todo.progress === 100 ? 'bg-green-200' : 'bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`ml-4 flex-grow font-semibold ${
                      todo.progress === 100 ? 'line-through' : ''
                    }`}
                  >
                    {todo.title}
                  </span>
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => {
                      const newTitle = prompt('Edit Todo', todo.title)
                      if (newTitle) editTodo(todo.id, newTitle)
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    Delete
                  </button>
                  <div className="text-sm font-semibold text-gray-500">
                    {todo.progress}%
                  </div>
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
                          onChange={(e) =>
                            handleSubtodoChange(
                              todo.id,
                              subtodo.id,
                              e.target.checked
                            )
                          }
                          className="w-4 h-4 rounded-full border-2 text-blue-600 focus:ring-blue-500 hover:cursor-pointer"
                        />
                        <span
                          className={`${
                            subtodo.is_completed
                              ? 'line-through text-gray-400'
                              : ''
                          }`}
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
      </section>
    </div>
  )
}
