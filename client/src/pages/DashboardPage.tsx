import { Link } from 'react-router'
import StatCard from '../components/StatCard'
import TransactionList from '../components/TransactionList'
import { getBudgetRows } from '../utils/budget'
import type { Budgets, Transaction } from '../types'
import { formatINR } from '../utils/format'

interface DashboardPageProps {
  transactions: Transaction[]
  budgets: Budgets
  onDelete: (id: string) => void
}

export default function DashboardPage({ transactions, budgets, onDelete }: DashboardPageProps) {
  const income = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const expenses = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

  const recent = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)

    const alerts = getBudgetRows(transactions, budgets).filter((r) => r.status !== 'ok')
  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Dashboard</h1>
      {alerts.length > 0 && (
        <div role="status" className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-900">
            <p className="font-semibold">Budget alerts this month</p>
            <ul className="mt-1 list-disc pl-5 text-sm">
            {alerts.map((a) => (
                <li key={a.category}>
                {a.category}:{' '}
                {a.status === 'over'
                    ? `over by ${formatINR(a.spent - a.limit)}`
                    : `${Math.round((a.spent / a.limit) * 100)}% of ${formatINR(a.limit)} used`}
                </li>
            ))}
            </ul>
            <Link to="/budgets" className="mt-2 inline-block text-sm underline">
            Manage budgets
            </Link>
        </div>
        )}
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