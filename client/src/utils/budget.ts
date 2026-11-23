import type { Budgets, Transaction } from '../types'
import { getCategoryTotals } from './reports'

export type BudgetStatus = 'ok' | 'warning' | 'over'

export interface BudgetRow {
  category: string
  limit: number
  spent: number
  status: BudgetStatus
}

export const currentMonth = () => new Date().toLocaleDateString('en-CA').slice(0, 7)

export function getBudgetStatus(spent: number, limit: number): BudgetStatus {
  if (limit <= 0) return 'ok'
  const ratio = spent / limit
  if (ratio > 1) return 'over'
  if (ratio >= 0.8) return 'warning'
  return 'ok'
}

export function getSpentByCategory(transactions: Transaction[]): Map<string, number> {
  return new Map(
    getCategoryTotals(transactions, currentMonth()).map((c): [string, number] => [c.name, c.value]),
  )
}

export function getBudgetRows(transactions: Transaction[], budgets: Budgets): BudgetRow[] {
  const spent = getSpentByCategory(transactions)
  return Object.entries(budgets).map(([category, limit]) => {
    const amount = spent.get(category) ?? 0
    return { category, limit, spent: amount, status: getBudgetStatus(amount, limit) }
  })
}