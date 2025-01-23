import React, { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { todoApi } from '../api/todoapi'

interface AddTodoDialogProps {
  userId: number
  onTodoAdded: () => void
}

export function AddTodoDialog({ userId, onTodoAdded }: AddTodoDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [subtodos, setSubtodos] = useState<string[]>([''])

  const handleAddSubtodo = () => {
    setSubtodos([...subtodos, ''])
  }

  const handleRemoveSubtodo = (index: number) => {
    setSubtodos(subtodos.filter((_, i) => i !== index))
  }

  const handleSubtodoChange = (index: number, value: string) => {
    const newSubtodos = [...subtodos]
    newSubtodos[index] = value
    setSubtodos(newSubtodos)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const filteredSubtodos = subtodos.filter((st) => st.trim() !== '')
      await todoApi.createTodo(userId, title, filteredSubtodos)
      onTodoAdded()
      setIsOpen(false)
      setTitle('')
      setSubtodos([''])
    } catch (error) {
      console.error('Failed to create todo:', error)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-white bg-gray-300 px-4 py-1 rounded-md hover:bg-gray-700 transition-colors"
      >
        <Plus size={20} />
        Add task
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter task title"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subtasks
                </label>
                <div className="space-y-2">
                  {subtodos.map((subtodo, index) => (
                    <div
                      key={index}
                      className="flex gap-2"
                    >
                      <input
                        type="text"
                        value={subtodo}
                        onChange={(e) =>
                          handleSubtodoChange(index, e.target.value)
                        }
                        placeholder="Enter subtask"
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {subtodos.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSubtodo(index)}
                          className="p-2 text-gray-500 hover:text-gray-700"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleAddSubtodo}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <Plus size={16} />
                  Add subtask
                </button>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
