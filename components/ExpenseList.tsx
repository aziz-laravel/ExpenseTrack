import { colors } from '@/constants/Colors';
import { Expense } from '@/types';
import { formatDate } from '@/utils/date-utils';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { ExpenseCard } from './ExpenseCard';


interface ExpenseListProps {
  expenses: Expense[];
  isLoading: boolean;
  onExpensePress: (expense: Expense) => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  isLoading,
  onExpensePress,
}) => {
  // Group expenses by date
  const groupedExpenses = expenses.reduce<Record<string, Expense[]>>((acc, expense) => {
    const date = expense.date.split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(expense);
    return acc;
  }, {});

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedExpenses).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (expenses.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No expenses yet</Text>
        <Text style={styles.emptySubtext}>
          Add your first expense by tapping the + button
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={sortedDates}
      keyExtractor={(date) => date}
      renderItem={({ item: date }) => (
        <View style={styles.dateGroup}>
          <Text style={styles.dateHeader}>{formatDate(date)}</Text>
          {groupedExpenses[date].map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              onPress={onExpensePress}
            />
          ))}
        </View>
      )}
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  listContent: {
    padding: 16,
  },
  dateGroup: {
    marginBottom: 20,
  },
  dateHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
});