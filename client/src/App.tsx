import { Route, Routes } from 'react-router'
import AppLayout from './components/AppLayout'
import DashboardPage from './pages/DashboardPage'
import TransactionsPage from './pages/TransactionsPage'
import PlaceholderPage from './pages/PlaceholderPage'
import NotFoundPage from './pages/NotFoundPage'
import { useLocalStorage } from './hooks/useLocalStorage'
import BudgetsPage from './pages/BudgetsPage'
import type { Budgets, Transaction } from './types'
import ReportsPage from './pages/ReportsPage'

const initialTransactions: Transaction[] = [
  { id: 's1', title: 'Salary', amount: 60000, type: 'income', category: 'Job', date: '2026-09-01' },
  { id: 's2', title: 'Rent', amount: 15000, type: 'expense', category: 'Housing', date: '2026-09-03' },
  { id: 's3', title: 'Groceries', amount: 3800, type: 'expense', category: 'Food', date: '2026-09-10' },
  { id: 's4', title: 'Train tickets', amount: 6500, type: 'expense', category: 'Travel', date: '2026-09-18' },
  { id: 's5', title: 'Freelance', amount: 8000, type: 'income', category: 'Side work', date: '2026-09-22' },
  { id: 's6', title: 'Salary', amount: 60000, type: 'income', category: 'Job', date: '2026-10-01' },
  { id: 's7', title: 'Rent', amount: 15000, type: 'expense', category: 'Housing', date: '2026-10-03' },
  { id: 's8', title: 'Groceries', amount: 4500, type: 'expense', category: 'Food', date: '2026-10-09' },
  { id: 's9', title: 'Phone recharge', amount: 799, type: 'expense', category: 'Other', date: '2026-10-12' },
  { id: 's10', title: 'Bus pass', amount: 3200, type: 'expense', category: 'Travel', date: '2026-10-20' },
  { id: 's11', title: 'Freelance', amount: 15000, type: 'income', category: 'Side work', date: '2026-10-25' },
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
  const [budgets, setBudgets] = useLocalStorage<Budgets>('fintrack:budgets', {})

function setBudget(category: string, limit: number | null) {
  setBudgets((prev) => {
    const next = { ...prev }
    if (limit === null || limit <= 0) delete next[category]
    else next[category] = limit
    return next
  })
}

  function addTransaction(t: Omit<Transaction, 'id'>) {
    setTransactions((prev) => [{ ...t, id: crypto.randomUUID() }, ...prev])
  }

  function deleteTransaction(id: string) {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route
          index
          element={<DashboardPage transactions={transactions} budgets={budgets} onDelete={deleteTransaction} />}
        />
        <Route
          path="transactions"
          element={
            <TransactionsPage
              transactions={transactions}
              onAdd={addTransaction}
              onDelete={deleteTransaction}
            />
          }
        />
        <Route
          path="budgets"
          element={<BudgetsPage transactions={transactions} budgets={budgets} onSetLimit={setBudget} />}
        />
        <Route path="reports" element={<ReportsPage transactions={transactions} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}