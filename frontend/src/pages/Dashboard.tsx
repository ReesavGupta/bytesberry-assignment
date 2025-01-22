import { Sidebar } from '../components/Sidebar'
import { TodoList } from '../components/TodoList'

const Dashboard = () => {
  return (
    <div>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <TodoList />
        </main>
      </div>
    </div>
  )
}

export default Dashboard
