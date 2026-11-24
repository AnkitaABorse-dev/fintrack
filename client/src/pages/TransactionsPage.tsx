import { useState } from 'react'
import TransactionFilters from '../components/TransactionFilters'
import TransactionForm from '../components/TransactionForm'
import TransactionList from '../components/TransactionList'
import type { TypeFilter } from '../types'
import { useFinance } from '../hooks/useFinance'

export default function TransactionsPage() {
  const { transactions, addTransaction, deleteTransaction } = useFinance()
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
              transactions.length > 0 ? 'No transactions match your filters.' : undefined
            }
          />
        </div>
      </div>
    </>
  )
}