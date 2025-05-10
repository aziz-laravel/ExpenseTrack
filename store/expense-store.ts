import { mockExpenses } from '@/mocks/expenses';
import { Expense, ExpenseState } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ExpenseStore extends ExpenseState {
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => Promise<void>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  fetchExpenses: (userId: string) => Promise<void>;
}

export const useExpenseStore = create<ExpenseStore>()(
  persist(
    (set, get) => ({
      expenses: [],
      isLoading: false,
      error: null,
      
      addExpense: async (expense) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be a Firebase Firestore call
          // For now, we'll simulate adding to local state
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const newExpense: Expense = {
            ...expense,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
          };
          
          set(state => ({
            expenses: [...state.expenses, newExpense],
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add expense', 
            isLoading: false 
          });
        }
      },
      
      updateExpense: async (id, updatedExpense) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be a Firebase Firestore call
          // For now, we'll simulate updating local state
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            expenses: state.expenses.map(expense => 
              expense.id === id ? { ...expense, ...updatedExpense } : expense
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update expense', 
            isLoading: false 
          });
        }
      },
      
      deleteExpense: async (id) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be a Firebase Firestore call
          // For now, we'll simulate deleting from local state
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            expenses: state.expenses.filter(expense => expense.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete expense', 
            isLoading: false 
          });
        }
      },
      
      fetchExpenses: async (userId) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be a Firebase Firestore call
          // For now, we'll load mock data
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Filter expenses for the current user
          const userExpenses = mockExpenses.filter(expense => expense.userId === userId);
          
          set({ expenses: userExpenses, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch expenses', 
            isLoading: false 
          });
        }
      },
    }),
    {
      name: 'expense-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);