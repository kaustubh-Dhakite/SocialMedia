import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored token and user data
    const token = localStorage.getItem('access_token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchCurrentUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get('/api/auth/users/me/')
      setUser(response.data)
    } catch (error) {
      // Token expired or invalid
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      delete axios.defaults.headers.common['Authorization']
    } finally {
      setLoading(false)
    }
  }

  const login = async (username, password) => {
    const response = await axios.post('/api/auth/login/', { username, password })
    const { user, tokens } = response.data

    localStorage.setItem('access_token', tokens.access)
    localStorage.setItem('refresh_token', tokens.refresh)
    axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`

    setUser(user)
    return user
  }

  const register = async (userData) => {
    const response = await axios.post('/api/auth/', userData)
    const { user, tokens } = response.data

    localStorage.setItem('access_token', tokens.access)
    localStorage.setItem('refresh_token', tokens.refresh)
    axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`

    setUser(user)
    return user
  }

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      if (refreshToken) {
        await axios.post('/api/auth/logout/', { refresh_token: refreshToken })
      }
    } catch (error) {
      // Ignore logout errors
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      delete axios.defaults.headers.common['Authorization']
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
