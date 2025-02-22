import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import { Signin } from './pages/Signin'
import { Signup } from './pages/Signup'
import ProtectedRoute from './provider'

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/signin"
          element={<Signin />}
        />
        <Route
          path="/signup"
          element={<Signup />}
        />
      </Routes>
    </Router>
  )
}

export default App
