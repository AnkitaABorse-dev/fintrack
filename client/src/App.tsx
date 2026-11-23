import { Route, Routes } from 'react-router'
import AppLayout from './components/AppLayout'
import DashboardPage from './pages/DashboardPage'
import TransactionsPage from './pages/TransactionsPage'
import PlaceholderPage from './pages/PlaceholderPage'
import NotFoundPage from './pages/NotFoundPage'
import { useLocalStorage } from './hooks/useLocalStorage'
import type { Transaction } from './types'

const initialTransactions: Transaction[] = [
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
          element={<DashboardPage transactions={transactions} onDelete={deleteTransaction} />}
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
        <Route path="budgets" element={<PlaceholderPage title="Budgets" />} />
        <Route path="reports" element={<PlaceholderPage title="Reports" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}