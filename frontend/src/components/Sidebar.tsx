import { Home, Calendar, User2, Search } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-white border-r p-4 flex flex-col">
      <nav className="space-y-1">
        <Link
          to="/search"
          className="flex items-center gap-2 text-gray-600 p-2 bg-gray-100 rounded-md"
        >
          <span className="material-icons text-blue-500 font-bold">
            <Home size={25} />
          </span>
          Twodwoooss App
        </Link>

        <Link
          to="/inbox"
          className="flex items-center gap-2 text-gray-600 p-2 hover:bg-gray-100 rounded-md"
        >
          <Calendar size={20} />
          <span>My todos</span>
          <span className="ml-auto text-gray-400">5</span>
        </Link>

        <div className="pt-6">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Navigate</h3>

          <Link
            to="/filters"
            className="flex items-center gap-2 text-gray-600 p-2 hover:bg-gray-100 rounded-md"
          >
            <User2 size={20} />
            <span>Sign Up</span>
          </Link>
        </div>
      </nav>
    </aside>
  )
}
