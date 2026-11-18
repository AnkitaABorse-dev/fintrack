import Sidebar from "./components/Sidebar";
import StatCard from "./components/StatCard";
import type { Transaction } from "./types";

const transactions: Transaction[] = [
  {
    id: "1",
    title: "Salary",
    amount: 60000,
    type: "income",
    category: "Job",
    date: "2026-11-01",
  },
  {
    id: "2",
    title: "Rent",
    amount: 15000,
    type: "expense",
    category: "Housing",
    date: "2026-11-03",
  },
  {
    id: "3",
    title: "Groceries",
    amount: 4200,
    type: "expense",
    category: "Food",
    date: "2026-11-08",
  },
  {
    id: "4",
    title: "Freelance",
    amount: 12000,
    type: "income",
    category: "Side work",
    date: "2026-11-12",
  },
];

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export default function App() {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <h2 className="mb-6 text-2xl font-semibold text-slate-900">
          Dashboard
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Income" value={formatINR(income)} />
          <StatCard label="Expenses" value={formatINR(expenses)} />
          <StatCard label="Balance" value={formatINR(income - expenses)} />
        </div>
      </main>
    </div>
  );
}
