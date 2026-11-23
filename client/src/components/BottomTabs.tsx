import { NavLink } from 'react-router'
import { navItems } from '../navigation'
import NavIcon from './NavIcon'

export default function BottomTabs() {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-slate-200 bg-white md:hidden"
    >
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-2 text-xs ${
              isActive ? 'font-medium text-indigo-700' : 'text-slate-600'
            }`
          }
        >
          <NavIcon d={item.icon} />
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}