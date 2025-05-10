
import { categoryColors, colors } from '@/constants/Colors';
import { categories } from '@/mocks/categories';
import { useExpenseStore } from '@/store/expense-store';
import { Expense } from '@/types';
import { formatCurrency, formatDate } from '@/utils/date-utils';
import { Image as ExpoImage } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function ExpenseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { expenses, deleteExpense, isLoading } = useExpenseStore();
  const [expense, setExpense] = useState<Expense | null>(null);
  
  useEffect(() => {
    if (id && expenses.length > 0) {
      const foundExpense = expenses.find(e => e.id === id);
      if (foundExpense) {
        setExpense(foundExpense);
      } else {
        // Expense not found, go back
        Alert.alert('Error', 'Expense not found');
        router.back();
      }
    }
  }, [id, expenses]);

  const handleDelete = () => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            if (expense) {
              await deleteExpense(expense.id);
              router.back();
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleEdit = () => {
    // In a real app, this would navigate to an edit screen
    Alert.alert(
      'Edit Expense',
      'This would navigate to an edit screen in a real app.',
      [{ text: 'OK' }]
    );
  };

  if (!expense) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading expense details...</Text>
      </View>
    );
  }

  const category = categories.find(c => c.id === expense.category);

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Expense Details',
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                onPress={handleEdit}
                style={styles.headerButton}
              >
                <Edit2 size={20} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleDelete}
                style={styles.headerButton}
              >
                <Trash2 size={20} color={colors.danger} />
              </TouchableOpacity>
            </View>
          ),
        }} 
      />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Amount</Text>
          <Text style={styles.amount}>{formatCurrency(expense.amount)}</Text>
        </View>
        
        {expense.receiptUrl && (
          <View style={styles.receiptContainer}>
            <ExpoImage
              source={{ uri: expense.receiptUrl }}
              style={styles.receiptImage}
              contentFit="cover"
            />
          </View>
        )}
        
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Category</Text>
            <View style={styles.categoryContainer}>
              <View 
                style={[
                  styles.categoryDot, 
                  { backgroundColor: category?.color || categoryColors.other }
                ]} 
              />
              <Text style={styles.detailValue}>{category?.name || 'Other'}</Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{formatDate(expense.date)}</Text>
          </View>
          
          {expense.notes && (
            <View style={styles.notesContainer}>
              <Text style={styles.detailLabel}>Notes</Text>
              <Text style={styles.notes}>{expense.notes}</Text>
            </View>
          )}
          
          <View style={styles.metaContainer}>
            <Text style={styles.metaText}>
              Added on {formatDate(expense.createdAt)}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color={colors.primary} />
          <Text style={styles.backButtonText}>Back to Expenses</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 16,
  },
  amountContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  amountLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
  },
  receiptContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    height: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  receiptImage: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
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
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  notesContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  notes: {
    fontSize: 16,
    color: colors.text,
    marginTop: 8,
    lineHeight: 22,
  },
  metaContainer: {
    paddingTop: 12,
  },
  metaText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});