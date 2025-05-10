import { ExpenseChart } from '@/components/ExpenseChart';
import { MonthlyTrendChart } from '@/components/MonthlyTrendChart';
import { colors } from '@/constants/Colors';

import { useAuthStore } from '@/store/auth-store';
import { useExpenseStore } from '@/store/expense-store';
import { getMonthStartEnd } from '@/utils/date-utils';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function StatisticsScreen() {
  const { user } = useAuthStore();
  const { expenses, fetchExpenses, isLoading } = useExpenseStore();
  const [timeFrame, setTimeFrame] = useState<'month' | 'year'>('month');
  const [filteredExpenses, setFilteredExpenses] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchExpenses(user.id);
    }
  }, [user]);

  useEffect(() => {
    filterExpensesByTimeFrame();
  }, [expenses, timeFrame]);

  const filterExpensesByTimeFrame = () => {
    if (expenses.length === 0) return;

    const now = new Date();
    
    if (timeFrame === 'month') {
      const { start, end } = getMonthStartEnd();
      
      const monthlyExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= start && expenseDate <= end;
      });
      
      setFilteredExpenses(monthlyExpenses);
    } else {
      // Year timeframe
      const yearStart = new Date(now.getFullYear(), 0, 1);
      const yearEnd = new Date(now.getFullYear(), 11, 31);
      
      const yearlyExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= yearStart && expenseDate <= yearEnd;
      });
      
      setFilteredExpenses(yearlyExpenses);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Expense Statistics</Text>
        
        <View style={styles.timeFrameSelector}>
          <TouchableOpacity
            style={[
              styles.timeFrameButton,
              timeFrame === 'month' && styles.activeTimeFrameButton,
            ]}
            onPress={() => setTimeFrame('month')}
          >
            <Text
              style={[
                styles.timeFrameText,
                timeFrame === 'month' && styles.activeTimeFrameText,
              ]}
            >
              This Month
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.timeFrameButton,
              timeFrame === 'year' && styles.activeTimeFrameButton,
            ]}
            onPress={() => setTimeFrame('year')}
          >
            <Text
              style={[
                styles.timeFrameText,
                timeFrame === 'year' && styles.activeTimeFrameText,
              ]}
            >
              This Year
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading statistics...</Text>
          </View>
        ) : filteredExpenses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No expenses for this period</Text>
            <Text style={styles.emptySubtext}>
              Add some expenses to see your statistics
            </Text>
          </View>
        ) : (
          <>
            <ExpenseChart
              expenses={filteredExpenses}
              title={timeFrame === 'month' ? 'Monthly Breakdown' : 'Yearly Breakdown'}
            />
            
            <MonthlyTrendChart expenses={expenses} />
            
            <View style={styles.insightsContainer}>
              <Text style={styles.insightsTitle}>Spending Insights</Text>
              
              {/* Top spending category */}
              {getTopSpendingCategory(filteredExpenses) && (
                <View style={styles.insightCard}>
                  <Text style={styles.insightLabel}>Top Spending Category</Text>
                  <Text style={styles.insightValue}>
                    {getTopSpendingCategory(filteredExpenses)}
                  </Text>
                </View>
              )}
              
              {/* Average expense */}
              {getAverageExpense(filteredExpenses) > 0 && (
                <View style={styles.insightCard}>
                  <Text style={styles.insightLabel}>Average Expense</Text>
                  <Text style={styles.insightValue}>
                    ${getAverageExpense(filteredExpenses).toFixed(2)}
                  </Text>
                </View>
              )}
              
              {/* Highest expense */}
              {getHighestExpense(filteredExpenses) && (
                <View style={styles.insightCard}>
                  <Text style={styles.insightLabel}>Highest Expense</Text>
                  <Text style={styles.insightValue}>
                    ${getHighestExpense(filteredExpenses).toFixed(2)}
                  </Text>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

// Helper functions for insights
const getTopSpendingCategory = (expenses: any[]) => {
  if (expenses.length === 0) return null;
  
  const categoryTotals = expenses.reduce((acc, expense) => {
    const { category, amount } = expense;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += amount;
    return acc;
  }, {});
  
  const topCategory = Object.keys(categoryTotals).reduce((a, b) => 
    categoryTotals[a] > categoryTotals[b] ? a : b
  );
  
  // Get the category name from the category ID
  const categoryName = topCategory.charAt(0).toUpperCase() + topCategory.slice(1);
  
  return categoryName;
};

const getAverageExpense = (expenses: any[]) => {
  if (expenses.length === 0) return 0;
  
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  return total / expenses.length;
};

const getHighestExpense = (expenses: any[]) => {
  if (expenses.length === 0) return 0;
  
  return Math.max(...expenses.map(expense => expense.amount));
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  timeFrameSelector: {
    flexDirection: 'row',
    backgroundColor: colors.inputBackground,
    borderRadius: 8,
    padding: 4,
  },
  timeFrameButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTimeFrameButton: {
    backgroundColor: colors.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  timeFrameText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  activeTimeFrameText: {
    color: colors.text,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  insightsContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  insightCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  insightLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  insightValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
});