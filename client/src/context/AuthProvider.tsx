import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { api, ApiError, tokenStore } from '../api'
import type { User } from '../types'
import { AuthContext } from './authContext'

interface AuthResponse {
  token: string
  user: User
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(() => tokenStore.get() !== null)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)

  // On page load, ask the server who the saved token belongs to
  useEffect(() => {
  if (!tokenStore.get()) return
  let cancelled = false

  api<{ user: User }>('/auth/me')
    .then((data) => {
      if (!cancelled) setUser(data.user)
    })
    .catch((e) => {
      if (cancelled) return
      // 401 means the token is invalid. api() already cleared it, so we simply stay logged out.
      if (!(e instanceof ApiError && e.status === 401)) {
        setError('Could not reach the server. Please check your connection and try again.')
      }
    })
    .finally(() => {
      if (!cancelled) setLoading(false)
    })

  return () => {
    cancelled = true
  }
}, [attempt])

function retry() {
  setError('')
  setLoading(true)
  setAttempt((n) => n + 1)
}

  // Log out automatically if the API says our token is no longer valid
  useEffect(() => {
    const onUnauthorized = () => setUser(null)
    window.addEventListener('fintrack:unauthorized', onUnauthorized)
    return () => window.removeEventListener('fintrack:unauthorized', onUnauthorized)
  }, [])

  async function login(email: string, password: string) {
    const data = await api<AuthResponse>('/auth/login', { method: 'POST', body: { email, password } })
    tokenStore.set(data.token)
    setUser(data.user)
  }

  async function register(name: string, email: string, password: string) {
    const data = await api<AuthResponse>('/auth/register', {
      method: 'POST',
      body: { name, email, password },
    })
    tokenStore.set(data.token)
    setUser(data.user)
  }

  function logout() {
    tokenStore.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, retry, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}