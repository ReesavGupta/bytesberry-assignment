import { create } from 'zustand'

interface User {
  username: string
  _id: string
}

const useAuthStore = create<{
  user: User | null
  login: (userData: User) => void
  logout: () => void
}>((set) => ({
  user: null,
  login: (userData: User) => set({ user: userData }),
  logout: () => set({ user: null }),
}))

const useAuth = () => {
  const { user, login, logout } = useAuthStore()
  return { user, login, logout }
}

export default useAuth
