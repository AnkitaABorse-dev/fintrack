import { Outlet } from 'react-router'
import Sidebar from './Sidebar'
import BottomTabs from './BottomTabs'

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="min-w-0 flex-1 p-6 pb-24 md:pb-6">
        <Outlet />
      </main>
      <BottomTabs />
    </div>
  )
}