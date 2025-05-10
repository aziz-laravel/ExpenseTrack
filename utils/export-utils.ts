import { Expense } from '@/types';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { formatDate } from './date-utils';

// Generate CSV content from expenses
export const generateCSV = (expenses: Expense[]): string => {
  // CSV header
  let csv = 'Date,Amount,Category,Notes\n';
  
  // Add each expense as a row
  expenses.forEach(expense => {
    const date = formatDate(expense.date);
    const amount = expense.amount.toString();
    const category = expense.category;
    // Escape notes to handle commas and quotes
    const notes = expense.notes ? `"${expense.notes.replace(/"/g, '""')}"` : '';
    
    csv += `${date},${amount},${category},${notes}\n`;
  });
  
  return csv;
};

// Export expenses as CSV file
export const exportToCSV = async (expenses: Expense[]): Promise<boolean> => {
  try {
    if (Platform.OS === 'web') {
      // For web, create a download link
      const csv = generateCSV(expenses);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      return true;
    } else {
      // For mobile, save file and share
      const csv = generateCSV(expenses);
      const fileName = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;
      
      await FileSystem.writeAsStringAsync(filePath, csv);
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath);
        return true;
      } else {
        throw new Error('Sharing is not available on this device');
      }
    }
  } catch (error) {
    console.error('Export failed:', error);
    return false;
  }
};