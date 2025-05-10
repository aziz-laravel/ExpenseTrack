import { Budget, BudgetState } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface BudgetStore extends BudgetState {
  setBudget: (budget: Budget) => void;
  checkBudgetExceeded: (totalExpenses: number) => boolean;
}

export const useBudgetStore = create<BudgetStore>()(
  persist(
    (set, get) => ({
      budget: {
        monthlyLimit: 2000,
        notifyOnExceed: true,
      },
      isLoading: false,
      error: null,
      
      setBudget: (budget) => {
        set({ budget });
      },
      
      checkBudgetExceeded: (totalExpenses) => {
        const { monthlyLimit } = get().budget;
        return totalExpenses > monthlyLimit;
      },
    }),
    {
      name: 'budget-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);