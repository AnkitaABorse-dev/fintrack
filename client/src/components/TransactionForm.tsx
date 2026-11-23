import { useState } from 'react'
import type { SubmitEvent  } from 'react'
import type { Transaction, TransactionType } from '../types'

interface TransactionFormProps {
  onAdd: (t: Omit<Transaction, 'id'>) => void
}

const categories = ['Food', 'Housing', 'Travel', 'Job', 'Side work', 'Other']

export default function TransactionForm({ onAdd }: TransactionFormProps) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<TransactionType>('expense')
  const [category, setCategory] = useState(categories[0])
  const [error, setError] = useState('')
  const [date, setDate] = useState(() => new Date().toLocaleDateString('en-CA'))

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    const value = Number(amount)
    if (!title.trim() || !value || value <= 0 || !date) {
      setError('Enter a title, a date and an amount greater than 0.')
      return
    }
    onAdd({
      title: title.trim(),
      amount: value,
      type,
      category,
      date,
    })
    setTitle('')
    setAmount('')
    setError('')
  }

  const field = 'w-full rounded-lg border border-slate-300 px-3 py-2'

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="font-semibold text-slate-900">Add a transaction</h3>

      <div>
        <label htmlFor="title" className="mb-1 block text-sm text-slate-600">Title</label>
        <input id="title" className={field} value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div>
        <label htmlFor="amount" className="mb-1 block text-sm text-slate-600">Amount (₹)</label>
        <input id="amount" type="number" className={field} value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>

      <div>
        <label htmlFor="date" className="mb-1 block text-sm text-slate-600">Date</label>
        <input id="date" type="date" className={field} value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="type" className="mb-1 block text-sm text-slate-600">Type</label>
          <select id="type" className={field} value={type} onChange={(e) => setType(e.target.value as TransactionType)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div>
          <label htmlFor="category" className="mb-1 block text-sm text-slate-600">Category</label>
          <select id="category" className={field} value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

      <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700">
        Add transaction
      </button>
    </form>
  )
}