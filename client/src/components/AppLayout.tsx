import { Outlet } from 'react-router'
import Sidebar from './Sidebar'
import BottomTabs from './BottomTabs'
import { useAuth } from '../hooks/useAuth'

export default function AppLayout() {
  const {user, logout} = useAuth()

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
        <Outlet />
      </main>
      <BottomTabs />
    </div>
  )
}