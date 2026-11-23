import { NavLink } from 'react-router'
import { navItems } from '../navigation'
import NavIcon from './NavIcon'

export default function Sidebar() {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-slate-200 bg-white p-4 md:block">
      <p className="mb-6 text-xl font-bold text-indigo-600">FinTrack</p>
      <nav aria-label="Main" className="flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 ${
                isActive ? 'bg-indigo-50 font-medium text-indigo-700' : 'text-slate-700 hover:bg-slate-100'
              }`
            }
          >
            <NavIcon d={item.icon} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}