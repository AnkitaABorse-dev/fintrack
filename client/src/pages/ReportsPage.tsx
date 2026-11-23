import { useState } from 'react'
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import type { Transaction } from '../types'
import { formatINR } from '../utils/format'
import { getCategoryTotals, getMonthlyTotals, getMonths, monthLabel } from '../utils/reports'

interface ReportsPageProps {
  transactions: Transaction[]
}

const COLORS = ['#4f46e5', '#f59e0b', '#0d9488', '#db2777', '#64748b', '#0ea5e9']

export default function ReportsPage({ transactions }: ReportsPageProps) {
  const [period, setPeriod] = useState('all')

  const monthly = getMonthlyTotals(transactions)
  const months = getMonths(transactions)
  const categories = getCategoryTotals(transactions, period)
  const totalSpent = categories.reduce((sum, c) => sum + c.value, 0)

  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Reports</h1>

      <section aria-labelledby="monthly-heading" className="mb-6 rounded-xl border border-slate-200 bg-white p-5">
        <h2 id="monthly-heading" className="mb-4 text-lg font-semibold text-slate-900">
          Income vs expenses
        </h2>
        {monthly.length === 0 ? (
          <p className="text-slate-500">Add some transactions to see this chart.</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" />
              <YAxis width={56} tickFormatter={(v: number) => `₹${v / 1000}k`} />
              <Tooltip formatter={(value) => formatINR(Number(value))} />
              <Legend />
              <Bar dataKey="income" name="Income" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </section>

      <section aria-labelledby="category-heading" className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 id="category-heading" className="text-lg font-semibold text-slate-900">
            Where your money goes
          </h2>
          <div className="flex items-center gap-2">
            <label htmlFor="period" className="text-sm text-slate-600">Period</label>
            <select
              id="period"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2"
            >
              <option value="all">All time</option>
              {months.map((m) => (
                <option key={m} value={m}>{monthLabel(m, true)}</option>
              ))}
            </select>
          </div>
        </div>

        {categories.length === 0 ? (
          <p className="text-slate-500">No expenses in this period.</p>
        ) : (
          <div className="grid items-center gap-6 md:grid-cols-2">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={categories} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                  {categories.map((c, i) => (
                    <Cell key={c.name} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatINR(Number(value))} />
              </PieChart>
            </ResponsiveContainer>

            <ul className="space-y-2">
              {categories.map((c, i) => (
                <li key={c.name} className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2">
                    <span
                      className="inline-block h-3 w-3 rounded-full"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      aria-hidden="true"
                    />
                    {c.name}
                  </span>
                  <span className="whitespace-nowrap text-slate-600">
                    {formatINR(c.value)} · {Math.round((c.value / totalSpent) * 100)}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </>
  )
}