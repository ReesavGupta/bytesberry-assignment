import { Home, Inbox, Calendar, Tag, Plus, Search } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-white border-r p-4 flex flex-col">
      <button className="flex items-center gap-2 text-white bg-blue-600 px-4 py-2 rounded-md mb-6">
        <Plus size={20} />
        Add task
      </button>

      <nav className="space-y-1">
        <Link
          to="/search"
          className="flex items-center gap-2 text-gray-600 p-2 hover:bg-gray-100 rounded-md"
        >
          <span className="material-icons">
            <Search size={20} />
          </span>
          Search
        </Link>

        <Link
          to="/inbox"
          className="flex items-center gap-2 text-gray-600 p-2 hover:bg-gray-100 rounded-md"
        >
          <Inbox size={20} />
          <span>Inbox</span>
          <span className="ml-auto text-gray-400">5</span>
        </Link>

        <Link
          to="/today"
          className="flex items-center gap-2 text-gray-600 p-2 hover:bg-gray-100 rounded-md"
        >
          <Calendar size={20} />
          <span>Today</span>
          <span className="ml-auto text-gray-400">3</span>
        </Link>

        <div className="pt-6">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">
            My Projects
          </h3>
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-600 p-2 hover:bg-gray-100 rounded-md"
          >
            <Home size={20} />
            <span>Home</span>
            <span className="ml-auto text-gray-400">5</span>
          </Link>
        </div>

        <div className="pt-6">
          <Link
            to="/filters"
            className="flex items-center gap-2 text-gray-600 p-2 hover:bg-gray-100 rounded-md"
          >
            <Tag size={20} />
            <span>Filters & Labels</span>
          </Link>
        </div>
      </nav>
    </aside>
  )
}
