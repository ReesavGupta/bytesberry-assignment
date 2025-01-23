import { Home, User2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../store/authStore'

export function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/signin')
  }

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

        <div className="pt-6">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Navigate</h3>

          {user ? (
            <div
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 p-2 hover:bg-gray-100 rounded-md cursor-pointer"
            >
              <User2 size={20} />
              <span>Logout</span>
            </div>
          ) : (
            <Link
              to="/signup"
              className="flex items-center gap-2 text-gray-600 p-2 hover:bg-gray-100 rounded-md"
            >
              <User2 size={20} />
              <span>Sign Up</span>
            </Link>
          )}
        </div>
      </nav>
    </aside>
  )
}
