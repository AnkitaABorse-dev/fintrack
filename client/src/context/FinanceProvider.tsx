import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { api, ApiError } from '../api'
import type { Budgets, Transaction } from '../types'
import { FinanceContext } from './financeContext'

export default function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [budgets, setBudgets] = useState<Budgets>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      const [t, b] = await Promise.all([
        api<{ transactions: Transaction[] }>('/transactions'),
        api<{ budgets: Budgets }>('/budgets'),
      ])
      setTransactions(t.transactions)
      setBudgets(b.budgets)
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not load your data.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  function reload() {
    setError('')
    setLoading(true)
    void load()
  }

  async function addTransaction(t: Omit<Transaction, 'id'>) {
    const created = await api<Transaction>('/transactions', { method: 'POST', body: t })
    setTransactions((prev) => [created, ...prev].sort((a, b) => b.date.localeCompare(a.date)))
  }

  async function deleteTransaction(id: string) {
    await api<void>(`/transactions/${id}`, { method: 'DELETE' })
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  async function setBudget(category: string, limit: number | null) {
    const path = `/budgets/${encodeURIComponent(category)}`
    if (limit === null) {
      await api<void>(path, { method: 'DELETE' })
      setBudgets((prev) => {
        const next = { ...prev }
        delete next[category]
        return next
      })
    } else {
      await api(path, { method: 'PUT', body: { limit } })
      setBudgets((prev) => ({ ...prev, [category]: limit }))
    }
  }

  return (
    <FinanceContext.Provider
      value={{ transactions, budgets, loading, error, reload, addTransaction, deleteTransaction, setBudget }}
    >
      {children}
    </FinanceContext.Provider>
  )
}