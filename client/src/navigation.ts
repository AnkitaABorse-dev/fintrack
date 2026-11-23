export interface NavItem {
  to: string
  label: string
  icon: string
}

export const navItems: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: 'M3 12l9-9 9 9M5 10v10h14V10' },
  { to: '/transactions', label: 'Transactions', icon: 'M7 7h13M7 7l3-3M7 7l3 3M17 17H4m13 0l-3-3m3 3l-3 3' },
  { to: '/budgets', label: 'Budgets', icon: 'M12 3v9h9a9 9 0 11-9-9z' },
  { to: '/reports', label: 'Reports', icon: 'M4 20V10M10 20V4M16 20v-8M22 20H2' },
]