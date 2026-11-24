import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { Link, Navigate } from 'react-router'
import { ApiError } from '../api'
import { useAuth } from '../hooks/useAuth'

interface AuthPageProps {
  mode: 'login' | 'register'
}

export default function AuthPage({ mode }: AuthPageProps) {
  const { user, login, register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  const isLogin = mode === 'login'

  if (user) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrors([])
    setSubmitting(true)
    try {
      if (isLogin) {
        await login(email, password)
      } else {
        await register(name, email, password)
      }
    } catch (error) {
      setErrors(error instanceof ApiError ? error.errors : ['Could not reach the server. Please try again.'])
    } finally {
      setSubmitting(false)
    }
  }

  const field = 'w-full rounded-lg border border-slate-300 px-3 py-2'

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6">
        <p className="mb-1 text-xl font-bold text-indigo-600">FinTrack</p>
        <h1 className="mb-6 text-2xl font-semibold text-slate-900">
          {isLogin ? 'Log in' : 'Create your account'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="mb-1 block text-sm text-slate-600">Name</label>
              <input id="name" className={field} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-1 block text-sm text-slate-600">Email</label>
            <input id="email" type="email" className={field} autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm text-slate-600">Password</label>
            <input
              id="password"
              type="password"
              className={field}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {!isLogin && <p className="mt-1 text-xs text-slate-500">At least 8 characters.</p>}
          </div>

          {errors.length > 0 && (
            <ul role="alert" className="list-disc pl-5 text-sm text-red-700">
              {errors.map((message) => <li key={message}>{message}</li>)}
            </ul>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {submitting ? 'Please wait…' : isLogin ? 'Log in' : 'Create account'}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-600">
          {isLogin ? 'New here? ' : 'Already have an account? '}
          <Link to={isLogin ? '/register' : '/login'} className="text-indigo-700 underline">
            {isLogin ? 'Create an account' : 'Log in'}
          </Link>
        </p>
      </div>
    </main>
  )
}