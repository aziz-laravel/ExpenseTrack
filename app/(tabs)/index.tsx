import { ExpenseList } from '@/components/ExpenseList';
import { colors } from '@/constants/Colors';

import { useAuthStore } from '@/store/auth-store';
import { useBudgetStore } from '@/store/budget-store';
import { useExpenseStore } from '@/store/expense-store';
import { Expense } from '@/types';
import { formatCurrency, getCurrentMonth, getMonthStartEnd } from '@/utils/date-utils';
import { router } from 'expo-router';
import { AlertTriangle, Plus } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const { user } = useAuthStore();
  const { expenses, fetchExpenses, isLoading } = useExpenseStore();
  const { budget, checkBudgetExceeded } = useBudgetStore();
  const [refreshing, setRefreshing] = useState(false);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [isBudgetExceeded, setIsBudgetExceeded] = useState(false);

  useEffect(() => {
    if (user) {
      fetchExpenses(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (expenses.length > 0) {
      calculateMonthlyTotal();
    }
  }, [expenses]);

  const calculateMonthlyTotal = () => {
    const { start, end } = getMonthStartEnd();
    
    const monthlyExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= start && expenseDate <= end;
    });
    
    const total = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    setMonthlyTotal(total);
    
    // Check if budget is exceeded
    setIsBudgetExceeded(checkBudgetExceeded(total));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (user) {
      await fetchExpenses(user.id);
    }
    setRefreshing(false);
  };

  const handleExpensePress = (expense: Expense) => {
    router.push(`/expense/${expense.id}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {user?.name || 'User'}</Text>
          <Text style={styles.currentMonth}>{getCurrentMonth()}</Text>
        </View>
        
        <View style={styles.budgetCard}>
          <View style={styles.budgetInfo}>
            <Text style={styles.budgetLabel}>Monthly Budget</Text>
            <Text style={styles.budgetAmount}>{formatCurrency(budget.monthlyLimit)}</Text>
            
            <View style={styles.spentContainer}>
              <Text style={styles.spentLabel}>Spent</Text>
              <Text 
                style={[
                  styles.spentAmount,
                  isBudgetExceeded && styles.exceededAmount
                ]}
              >
                {formatCurrency(monthlyTotal)}
              </Text>
            </View>
            
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar,
                  {
                    width: `${Math.min((monthlyTotal / budget.monthlyLimit) * 100, 100)}%`,
                    backgroundColor: isBudgetExceeded ? colors.danger : colors.secondary,
                  }
                ]}
              />
            </View>
            
            <Text style={styles.remainingLabel}>
              {isBudgetExceeded 
                ? `Exceeded by ${formatCurrency(monthlyTotal - budget.monthlyLimit)}`
                : `Remaining: ${formatCurrency(budget.monthlyLimit - monthlyTotal)}`
              }
            </Text>
          </View>
          
          {isBudgetExceeded && (
            <View style={styles.budgetAlert}>
              <AlertTriangle size={20} color={colors.danger} />
              <Text style={styles.budgetAlertText}>
                You've exceeded your monthly budget
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.expensesContainer}>
          <View style={styles.expensesHeader}>
            <Text style={styles.expensesTitle}>Recent Expenses</Text>
            <TouchableOpacity 
              onPress={() => router.push('/expense/add')}
              style={styles.addButton}
            >
              <Text style={styles.addButtonText}>Add New</Text>
              <Plus size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <ExpenseList
            expenses={expenses.slice(0, 10)} // Show only the 10 most recent expenses
            isLoading={isLoading}
            onExpensePress={handleExpensePress}
          />
        </View>
      </ScrollView>
      
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push('/expense/add')}
      >
        <Plus size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  currentMonth: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  budgetCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  budgetInfo: {
    marginBottom: 16,
  },
  budgetLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  budgetAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  spentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  spentLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  spentAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  exceededAmount: {
    color: colors.danger,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.inputBackground,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  remainingLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  budgetAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(229, 62, 62, 0.1)',
    padding: 12,
    borderRadius: 8,
  },
  budgetAlertText: {
    marginLeft: 8,
    color: colors.danger,
    fontSize: 14,
    fontWeight: '500',
  },
  expensesContainer: {
    flex: 1,
  },
  expensesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  expensesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    color: colors.primary,
    marginRight: 4,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});