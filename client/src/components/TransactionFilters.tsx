import type { TypeFilter } from '../types'

interface TransactionFiltersProps {
  type: TypeFilter
  search: string
  onTypeChange: (value: TypeFilter) => void
  onSearchChange: (value: string) => void
}

export default function TransactionFilters({
  type,
  search,
  onTypeChange,
  onSearchChange,
}: TransactionFiltersProps) {
  const field = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2'

  return (
    <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_180px]">
      <div>
        <label htmlFor="search" className="mb-1 block text-sm text-slate-600">
          Search by title or category
        </label>
        <input
          id="search"
          type="search"
          className={field}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="typeFilter" className="mb-1 block text-sm text-slate-600">
          Show
        </label>
        <select
          id="typeFilter"
          className={field}
          value={type}
          onChange={(e) => onTypeChange(e.target.value as TypeFilter)}
        >
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expenses</option>
        </select>
      </div>
    </div>
  )
}