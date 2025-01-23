import { Navigate } from 'react-router-dom'
import useAuth from './store/authStore'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/signin" />
  }

  return <>{children}</>
}

export default ProtectedRoute
