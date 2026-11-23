import { useState } from 'react'
import TransactionFilters from '../components/TransactionFilters'
import TransactionForm from '../components/TransactionForm'
import TransactionList from '../components/TransactionList'
import type { Transaction, TypeFilter } from '../types'

interface TransactionsPageProps {
  transactions: Transaction[]
  onAdd: (t: Omit<Transaction, 'id'>) => void
  onDelete: (id: string) => void
}

export default function TransactionsPage({ transactions, onAdd, onDelete }: TransactionsPageProps) {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [search, setSearch] = useState('')

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
    <>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Transactions</h1>
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <TransactionForm onAdd={onAdd} />
        <div>
          <TransactionFilters
            type={typeFilter}
            search={search}
            onTypeChange={setTypeFilter}
            onSearchChange={setSearch}
          />
          <TransactionList
            transactions={visibleTransactions}
            onDelete={onDelete}
            emptyMessage={
              transactions.length > 0 ? 'No transactions match your filters.' : undefined
            }
          />
        </div>
      </div>
    </>
  )
}