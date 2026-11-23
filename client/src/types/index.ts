export type TransactionType = "income" | "expense";
export type TypeFilter = 'all' | TransactionType
export type Budgets = Record<string, number>

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
}
