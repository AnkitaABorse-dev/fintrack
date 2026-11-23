import { Link } from 'react-router'
import StatCard from '../components/StatCard'
import TransactionList from '../components/TransactionList'
import type { Transaction } from '../types'
import { formatINR } from '../utils/format'

interface DashboardPageProps {
  transactions: Transaction[]
  onDelete: (id: string) => void
}

export default function DashboardPage({ transactions, onDelete }: DashboardPageProps) {
  const income = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const expenses = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

  const recent = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)

  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Income" value={formatINR(income)} />
        <StatCard label="Expenses" value={formatINR(expenses)} />
        <StatCard label="Balance" value={formatINR(income - expenses)} />
      </div>

      <div className="mt-8 mb-3 flex items-baseline justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Recent transactions</h2>
        <Link to="/transactions" className="text-sm text-indigo-700 hover:underline">
          View all
        </Link>
      </div>
      <TransactionList transactions={recent} onDelete={onDelete} />
    </>
  )
}