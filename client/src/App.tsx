import { useState } from 'react'
import Sidebar from './components/Sidebar'
import StatCard from './components/StatCard'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'
import TransactionFilters from './components/TransactionFilters'
import { useLocalStorage } from './hooks/useLocalStorage'
import type { Transaction, TypeFilter } from './types'
import { formatINR } from './utils/format'

const initialTransactions: Transaction[] = [
  { id: '1', title: 'Salary', amount: 60000, type: 'income', category: 'Job', date: '2026-11-01' },
  { id: '2', title: 'Rent', amount: 15000, type: 'expense', category: 'Housing', date: '2026-11-03' },
  { id: '3', title: 'Groceries', amount: 4200, type: 'expense', category: 'Food', date: '2026-11-08' },
  { id: '4', title: 'Freelance', amount: 12000, type: 'income', category: 'Side work', date: '2026-11-12' },
]

export default function App() {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>(
  'fintrack:transactions',
  initialTransactions,
)
const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
const [search, setSearch] = useState('')

  function addTransaction(t: Omit<Transaction, 'id'>) {
    setTransactions((prev) => [{ ...t, id: crypto.randomUUID() }, ...prev])
  }

  function deleteTransaction(id: string) {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

    const visibleTransactions = transactions.filter((t) => {
  const matchesType = typeFilter === 'all' || t.type === typeFilter
  const query = search.trim().toLowerCase()
  const matchesSearch =
    query === '' ||
    t.title.toLowerCase().includes(query) ||
    t.category.toLowerCase().includes(query)
  return matchesType && matchesSearch
})

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <h2 className="mb-6 text-2xl font-semibold text-slate-900">Dashboard</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Income" value={formatINR(income)} />
          <StatCard label="Expenses" value={formatINR(expenses)} />
          <StatCard label="Balance" value={formatINR(income - expenses)} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]">
          <TransactionForm onAdd={addTransaction} />
          <div>
  <TransactionFilters
    type={typeFilter}
    search={search}
    onTypeChange={setTypeFilter}
    onSearchChange={setSearch}
  />
  <TransactionList
    transactions={visibleTransactions}
    onDelete={deleteTransaction}
    emptyMessage={
      transactions.length > 0
        ? 'No transactions match your filters.'
        : undefined
    }
  />
</div>
        </div>
      </main>
    </div>
  )
}