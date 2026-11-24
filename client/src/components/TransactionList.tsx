import { useState } from 'react'
import type { Transaction } from '../types'
import { formatINR } from '../utils/format'

interface TransactionListProps {
  transactions: Transaction[]
  onDelete: (id: string) => Promise<void>
  emptyMessage?: string
}

export default function TransactionList({
  transactions,
  onDelete,
  emptyMessage = 'No transactions yet. Add your first one using the form.',
}: TransactionListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function handleDelete(id: string) {
    setError('')
    setDeletingId(id)
    try {
      await onDelete(id)
    } catch {
      setError('Could not delete the transaction. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  if (transactions.length === 0) {
    return (
      <p className="rounded-xl border border-slate-200 bg-white p-5 text-slate-500">{emptyMessage}</p>
    )
  }

  return (
    <>
      {error && (
        <p role="alert" className="mb-2 text-sm text-red-700">{error}</p>
      )}
      <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
        {transactions.map((t) => (
          <li key={t.id} className="flex items-center justify-between gap-4 p-4">
            <div className="min-w-0">
              <p className="font-medium text-slate-900">{t.title}</p>
              <p className="text-sm text-slate-500">
                {t.category} · <span className="whitespace-nowrap">{t.date}</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`whitespace-nowrap font-semibold ${t.type === 'income' ? 'text-green-700' : 'text-red-700'}`}>
                {t.type === 'income' ? '+' : '−'}{formatINR(t.amount)}
              </span>
              <button
                onClick={() => handleDelete(t.id)}
                disabled={deletingId === t.id}
                aria-label={`Delete ${t.title}`}
                className="rounded-lg border border-slate-300 px-3 py-1 text-sm hover:bg-slate-100 disabled:opacity-60"
              >
                {deletingId === t.id ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}