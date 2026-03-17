export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  createdAt: string;
  updatedAt: string;
}

export interface Summary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface CategoryStat {
  category: string;
  total: number;
  type: "income" | "expense";
  [key: string]: any;
}

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export interface CreateTransactionDTO {
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
}

export interface CreateCategoryDTO {
  name: string;
  type: "income" | "expense";
}
