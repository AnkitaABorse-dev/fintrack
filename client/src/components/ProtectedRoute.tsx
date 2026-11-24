import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return <p role="status" className="p-6 text-slate-600">Loading…</p>
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />
}