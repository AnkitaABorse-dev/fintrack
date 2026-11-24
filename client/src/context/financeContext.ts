import { createContext } from 'react'
import type { Budgets, Transaction } from '../types'

export interface FinanceContextValue {
  transactions: Transaction[]
  budgets: Budgets
  loading: boolean
  error: string
  reload: () => void
  addTransaction: (t: Omit<Transaction, 'id'>) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>
  setBudget: (category: string, limit: number | null) => Promise<void>
}

export const FinanceContext = createContext<FinanceContextValue | null>(null)