import type { Transaction } from '../types'

export interface MonthlyTotal {
  month: string
  label: string
  income: number
  expenses: number
}

export interface CategoryTotal {
  name: string
  value: number
}

export function monthLabel(month: string, long = false): string {
  return new Date(`${month}-01T00:00:00`).toLocaleDateString('en-IN', {
    month: long ? 'long' : 'short',
    year: long ? 'numeric' : '2-digit',
  })
}

export function getMonthlyTotals(transactions: Transaction[], limit = 6): MonthlyTotal[] {
  const byMonth = new Map<string, MonthlyTotal>()
  for (const t of transactions) {
    const month = t.date.slice(0, 7)
    const entry = byMonth.get(month) ?? { month, label: monthLabel(month), income: 0, expenses: 0 }
    if (t.type === 'income') entry.income += t.amount
    else entry.expenses += t.amount
    byMonth.set(month, entry)
  }
  return [...byMonth.values()]
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-limit)
}

export function getMonths(transactions: Transaction[]): string[] {
  return [...new Set(transactions.map((t) => t.date.slice(0, 7)))].sort().reverse()
}

export function getCategoryTotals(transactions: Transaction[], month: string): CategoryTotal[] {
  const totals = new Map<string, number>()
  for (const t of transactions) {
    if (t.type !== 'expense') continue
    if (month !== 'all' && t.date.slice(0, 7) !== month) continue
    totals.set(t.category, (totals.get(t.category) ?? 0) + t.amount)
  }
  return [...totals]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}