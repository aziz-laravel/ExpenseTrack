
import { colors } from '@/constants/Colors';
import { categories } from '@/mocks/categories';
import { Expense } from '@/types';
import { formatCurrency } from '@/utils/date-utils';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

interface ExpenseChartProps {
  expenses: Expense[];
  title: string;
}

export const ExpenseChart: React.FC<ExpenseChartProps> = ({ expenses, title }) => {
  // Group expenses by category
  const expensesByCategory = expenses.reduce<Record<string, number>>((acc, expense) => {
    const { category, amount } = expense;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += amount;
    return acc;
  }, {});

  // Calculate total expenses
  const totalExpenses = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0);

  // Sort categories by amount (descending)
  const sortedCategories = Object.keys(expensesByCategory).sort(
    (a, b) => expensesByCategory[b] - expensesByCategory[a]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.totalAmount}>{formatCurrency(totalExpenses)}</Text>

      <ScrollView style={styles.chartContainer}>
        {sortedCategories.map((categoryId) => {
          const amount = expensesByCategory[categoryId];
          const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
          const category = categories.find((c) => c.id === categoryId);
          
          return (
            <View key={categoryId} style={styles.categoryRow}>
              <View style={styles.categoryInfo}>
                <View 
                  style={[
                    styles.categoryDot, 
                    { backgroundColor: category?.color || colors.textSecondary }
                  ]} 
                />
                <Text style={styles.categoryName}>{category?.name || 'Other'}</Text>
              </View>
              
              <View style={styles.barContainer}>
                <View 
                  style={[
                    styles.bar, 
                    { 
                      width: `${percentage}%`,
                      backgroundColor: category?.color || colors.textSecondary
                    }
                  ]} 
                />
              </View>
              
              <View style={styles.amountContainer}>
                <Text style={styles.amount}>{formatCurrency(amount)}</Text>
                <Text style={styles.percentage}>{percentage.toFixed(1)}%</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  chartContainer: {
    maxHeight: 300,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 14,
    color: colors.text,
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: colors.inputBackground,
    borderRadius: 4,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  bar: {
    height: '100%',
    borderRadius: 4,
  },
  amountContainer: {
    width: 80,
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  percentage: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});