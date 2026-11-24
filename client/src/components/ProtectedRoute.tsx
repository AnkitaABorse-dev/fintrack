import { Navigate, Outlet } from 'react-router'
import FinanceProvider from '../context/FinanceProvider'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute() {
  const { user, loading, error, retry } = useAuth()

  if (loading) {
    return <p role="status" className="p-6 text-slate-600">Loading…</p>
  }

  if (error) {
    return (
      <div role="alert" className="m-6 max-w-md rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
        <p className="mb-2">{error}</p>
        <button onClick={retry} className="rounded-lg border border-red-300 bg-white px-3 py-1 hover:bg-red-100">
          Try again
        </button>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <FinanceProvider key={user.id}>
      <Outlet />
    </FinanceProvider>
  )
}