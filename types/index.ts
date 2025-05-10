export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string; // ISO string
  notes?: string;
  receiptUrl?: string;
  createdAt: string; // ISO string
  userId: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Budget {
  monthlyLimit: number;
  notifyOnExceed: boolean;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface ExpenseState {
  expenses: Expense[];
  isLoading: boolean;
  error: string | null;
}

export interface BudgetState {
  budget: Budget;
  isLoading: boolean;
  error: string | null;
}

export interface OCRResult {
  amount?: number;
  date?: string;
  merchantName?: string;
  text: string;
}