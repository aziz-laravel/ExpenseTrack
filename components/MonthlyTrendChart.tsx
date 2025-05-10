import { colors } from '@/constants/Colors';
import { Expense } from '@/types';
import { formatCurrency } from '@/utils/date-utils';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MonthlyTrendChartProps {
  expenses: Expense[];
}

export const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({ expenses }) => {
  // Group expenses by month
  const expensesByMonth = expenses.reduce<Record<string, number>>((acc, expense) => {
    const date = new Date(expense.date);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = 0;
    }
    
    acc[monthYear] += expense.amount;
    return acc;
  }, {});

  // Get last 6 months
  const today = new Date();
  const last6Months: string[] = [];
  const monthNames: string[] = [];
  
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthYear = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    last6Months.push(monthYear);
    
    // Get month name (e.g., "Jan", "Feb")
    monthNames.push(d.toLocaleDateString('en-US', { month: 'short' }));
  }

  // Get expenses for each of the last 6 months
  const monthlyData = last6Months.map(month => expensesByMonth[month] || 0);
  
  // Find the maximum value for scaling
  const maxExpense = Math.max(...monthlyData, 1); // Ensure at least 1 to avoid division by zero

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monthly Trend</Text>
      
      <View style={styles.chartContainer}>
        {monthlyData.map((amount, index) => {
          const barHeight = (amount / maxExpense) * 150; // Scale to max height of 150
          
          return (
            <View key={index} style={styles.barWrapper}>
              <Text style={styles.barValue}>
                {amount > 0 ? formatCurrency(amount) : ''}
              </Text>
              <View style={styles.barContainer}>
                <View 
                  style={[
                    styles.bar, 
                    { height: Math.max(barHeight, 4) }, // Minimum height for visibility
                    index === monthlyData.length - 1 && styles.currentMonthBar // Highlight current month
                  ]} 
                />
              </View>
              <Text style={styles.monthLabel}>{monthNames[index]}</Text>
            </View>
          );
        })}
      </View>
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
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 200,
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  barValue: {
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: 4,
    height: 30,
    textAlign: 'center',
  },
  barContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 150,
  },
  bar: {
    width: 20,
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  currentMonthBar: {
    backgroundColor: colors.secondary,
  },
  monthLabel: {
    fontSize: 12,
    color: colors.text,
    marginTop: 8,
  },
});