import { budgetCategories } from '../constants'
import type { Budgets, Transaction } from '../types'
import { getBudgetStatus, getSpentByCategory } from '../utils/budget'
import type { BudgetStatus } from '../utils/budget'
import { formatINR } from '../utils/format'

interface BudgetsPageProps {
  transactions: Transaction[]
  budgets: Budgets
  onSetLimit: (category: string, limit: number | null) => void
}

const barColor: Record<BudgetStatus, string> = {
  ok: 'bg-indigo-600',
  warning: 'bg-amber-500',
  over: 'bg-red-600',
}

export default function BudgetsPage({ transactions, budgets, onSetLimit }: BudgetsPageProps) {
  const spent = getSpentByCategory(transactions)

  return (
    <>
      <h1 className="mb-2 text-2xl font-semibold text-slate-900">Budgets</h1>
      <p className="mb-6 text-slate-600">Set a monthly limit for each category. Progress shows this month’s spending.</p>

      <ul className="space-y-4">
        {budgetCategories.map((category) => {
          const limit = budgets[category]
          const amountSpent = spent.get(category) ?? 0
          const status = limit ? getBudgetStatus(amountSpent, limit) : 'ok'
          const percent = limit ? Math.min(100, Math.round((amountSpent / limit) * 100)) : 0

          return (
            <li key={category} className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-semibold text-slate-900">{category}</h2>
                <div className="flex items-center gap-2">
                  <label htmlFor={`limit-${category}`} className="text-sm text-slate-600">
                    Monthly limit (₹)
                  </label>
                  <input
                    id={`limit-${category}`}
                    type="number"
                    min="0"
                    className="w-32 rounded-lg border border-slate-300 px-3 py-2"
                    value={limit ?? ''}
                    onChange={(e) =>
                      onSetLimit(category, e.target.value === '' ? null : Number(e.target.value))
                    }
                  />
                </div>
              </div>

              {limit ? (
                <>
                  <div
                    role="progressbar"
                    aria-label={`${category} budget used`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={percent}
                    className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100"
                  >
                    <div className={`h-full ${barColor[status]}`} style={{ width: `${percent}%` }} />
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    {formatINR(amountSpent)} of {formatINR(limit)} spent ·{' '}
                    {status === 'over'
                      ? `${formatINR(amountSpent - limit)} over budget`
                      : `${formatINR(limit - amountSpent)} left`}
                  </p>
                  {status === 'over' && (
                    <p className="mt-1 text-sm font-medium text-red-700">⚠ Over budget</p>
                  )}
                  {status === 'warning' && (
                    <p className="mt-1 text-sm font-medium text-amber-800">⚠ Close to your limit</p>
                  )}
                </>
              ) : (
                <p className="mt-3 text-sm text-slate-500">
                  No limit set. Spent this month: {formatINR(amountSpent)}.
                </p>
              )}
            </li>
          )
        })}
      </ul>
    </>
  )
}