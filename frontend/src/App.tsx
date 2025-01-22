import { BrowserRouter as Router } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { TodoList } from './components/TodoList'

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <TodoList />
        </main>
      </div>
    </Router>
  )
}

export default App
