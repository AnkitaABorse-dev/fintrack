import type { Transaction } from '../types'
import { formatINR } from '../utils/format'

interface TransactionListProps {
  transactions: Transaction[]
  onDelete: (id: string) => void
}

export default function TransactionList({ transactions, onDelete }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <p className="rounded-xl border border-slate-200 bg-white p-5 text-slate-500">
        No transactions yet. Add your first one using the form.
      </p>
    )
  }

  return (
    <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
      {transactions.map((t) => (
        <li key={t.id} className="flex items-center justify-between gap-4 p-4">
          <div>
            <p className="font-medium text-slate-900">{t.title}</p>
            <p className="text-sm text-slate-500">{t.category} · {t.date}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className={t.type === 'income' ? 'font-semibold text-green-700' : 'font-semibold text-red-700'}>
              {t.type === 'income' ? '+' : '−'}{formatINR(t.amount)}
            </span>
            <button
              onClick={() => onDelete(t.id)}
              aria-label={`Delete ${t.title}`}
              className="rounded-lg border border-slate-300 px-3 py-1 text-sm hover:bg-slate-100"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}