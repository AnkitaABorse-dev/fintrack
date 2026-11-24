import { Outlet } from 'react-router'
import Sidebar from './Sidebar'
import BottomTabs from './BottomTabs'
import { useAuth } from '../hooks/useAuth'
import { useFinance } from '../hooks/useFinance'

export default function AppLayout() {
  const {user, logout} = useAuth()
  const { loading, error, reload } = useFinance()

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="min-w-0 flex-1 p-6 pb-24 md:pb-6">
        <div className="mb-4 flex items-center justify-end gap-3 text-sm">
          <span className="text-slate-600">{user?.name}</span>
          <button
            onClick={logout}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1 hover:bg-slate-100"
          >
            Log out
          </button>
        </div>
        {loading ? (
          <p role="status" className="text-slate-600">Loading your data…</p>
        ) : error ? (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
            <p className="mb-2">{error}</p>
            <button onClick={reload} className="rounded-lg border border-red-300 bg-white px-3 py-1 hover:bg-red-100">
              Try again
            </button>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
      <BottomTabs />
    </div>
  )
}