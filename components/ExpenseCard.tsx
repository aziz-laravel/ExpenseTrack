
import { categoryColors, colors } from '@/constants/Colors';
import { categories } from '@/mocks/categories';
import { Expense } from '@/types';
import { formatCurrency, formatDate } from '@/utils/date-utils';
import { Image as ExpoImage } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ExpenseCardProps {
  expense: Expense;
  onPress: (expense: Expense) => void;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, onPress }) => {
  const category = categories.find(c => c.id === expense.category);
  
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onPress(expense)}
      activeOpacity={0.7}
    >
      <View style={styles.leftContent}>
        <View 
          style={[
            styles.categoryIndicator, 
            { backgroundColor: category?.color || categoryColors.other }
          ]} 
        />
        <View style={styles.details}>
          <Text style={styles.category}>{category?.name || 'Other'}</Text>
          <Text style={styles.date}>{formatDate(expense.date)}</Text>
          {expense.notes && (
            <Text style={styles.notes} numberOfLines={1}>
              {expense.notes}
            </Text>
          )}
        </View>
      </View>
      
      <View style={styles.rightContent}>
        <Text style={styles.amount}>{formatCurrency(expense.amount)}</Text>
        {expense.receiptUrl && (
          <ExpoImage
            source={{ uri: expense.receiptUrl }}
            style={styles.receiptThumbnail}
            contentFit="cover"
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIndicator: {
    width: 12,
    height: 40,
    borderRadius: 6,
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  category: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  notes: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  receiptThumbnail: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: colors.inputBackground,
  },
});