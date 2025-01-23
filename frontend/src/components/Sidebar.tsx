import { Home, User2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import useAuth from '../store/authStore'

export function Sidebar() {
  const { user, logout } = useAuth()
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

        {/* <Link
          to="/inbox"
          className="flex items-center gap-2 text-gray-600 p-2 hover:bg-gray-100 rounded-md"
        >
          <Calendar size={20} />
          <span>My </span>
          <span className="ml-auto text-gray-400">5</span>
        </Link> */}

        <div className="pt-6">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Navigate</h3>

          {user ? (
            <div className="flex items-center gap-2 text-gray-600 p-2 hover:bg-gray-100 rounded-md">
              <User2 size={20} />
              <span>{user ? 'Logout' : 'Sign Up'}</span>
            </div>
          ) : (
            <Link
              to="/signup"
              className="flex items-center gap-2 text-gray-600 p-2 hover:bg-gray-100 rounded-md"
            >
              <User2 size={20} />
              <span>
                <button onClick={() => logout()}>{'Sign Up'}</button>
              </span>
            </Link>
          )}
        </div>
      </nav>
    </aside>
  )
}
