import { Button } from '@/components/Button';
import { colors } from '@/constants/Colors';

import { useExpenseStore } from '@/store/expense-store';
import { exportToCSV } from '@/utils/export-utils';
import { Stack } from 'expo-router';
import { Calendar, FileText } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function ExportDataScreen() {
  const { expenses } = useExpenseStore();
  const [isExporting, setIsExporting] = useState(false);
  const [timeFrame, setTimeFrame] = useState<'all' | 'month' | 'year'>('all');

  const getFilteredExpenses = () => {
    if (timeFrame === 'all') {
      return expenses;
    }
    
    const now = new Date();
    
    if (timeFrame === 'month') {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      return expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= monthStart && expenseDate <= monthEnd;
      });
    } else {
      // Year timeframe
      const yearStart = new Date(now.getFullYear(), 0, 1);
      const yearEnd = new Date(now.getFullYear(), 11, 31);
      
      return expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= yearStart && expenseDate <= yearEnd;
      });
    }
  };

  const handleExport = async () => {
    if (expenses.length === 0) {
      Alert.alert('No Data', 'There are no expenses to export.');
      return;
    }
    
    setIsExporting(true);
    
    try {
      const filteredExpenses = getFilteredExpenses();
      const success = await exportToCSV(filteredExpenses);
      
      if (success) {
        Alert.alert('Success', 'Your expenses have been exported successfully.');
      } else {
        Alert.alert('Error', 'Failed to export expenses.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while exporting expenses.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Export Data' }} />
      
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <FileText size={40} color={colors.primary} />
            <Text style={styles.title}>Export Your Expenses</Text>
            <Text style={styles.subtitle}>
              Download your expense data as a CSV file that you can open in Excel or other spreadsheet applications.
            </Text>
          </View>
          
          <View style={styles.timeFrameSection}>
            <Text style={styles.sectionTitle}>Select Time Frame</Text>
            
            <View style={styles.timeFrameOptions}>
              <TouchableOpacity
                style={[
                  styles.timeFrameOption,
                  timeFrame === 'month' && styles.selectedTimeFrame,
                ]}
                onPress={() => setTimeFrame('month')}
              >
                <Calendar size={20} color={timeFrame === 'month' ? colors.primary : colors.textSecondary} />
                <Text 
                  style={[
                    styles.timeFrameText,
                    timeFrame === 'month' && styles.selectedTimeFrameText,
                  ]}
                >
                  This Month
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.timeFrameOption,
                  timeFrame === 'year' && styles.selectedTimeFrame,
                ]}
                onPress={() => setTimeFrame('year')}
              >
                <Calendar size={20} color={timeFrame === 'year' ? colors.primary : colors.textSecondary} />
                <Text 
                  style={[
                    styles.timeFrameText,
                    timeFrame === 'year' && styles.selectedTimeFrameText,
                  ]}
                >
                  This Year
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.timeFrameOption,
                  timeFrame === 'all' && styles.selectedTimeFrame,
                ]}
                onPress={() => setTimeFrame('all')}
              >
                <Calendar size={20} color={timeFrame === 'all' ? colors.primary : colors.textSecondary} />
                <Text 
                  style={[
                    styles.timeFrameText,
                    timeFrame === 'all' && styles.selectedTimeFrameText,
                  ]}
                >
                  All Time
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.exportSection}>
            <Text style={styles.exportInfo}>
              {getFilteredExpenses().length} expenses will be exported
            </Text>
            
            <Button
              title="Export as CSV"
              onPress={handleExport}
              isLoading={isExporting}
              disabled={expenses.length === 0}
              style={styles.exportButton}
            />
          </View>
          
          <View style={styles.noteSection}>
            <Text style={styles.noteTitle}>Note:</Text>
            <Text style={styles.noteText}>
              The exported file will include date, amount, category, and notes for each expense.
            </Text>
          </View>
        </View>
      </View>
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
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  timeFrameSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  timeFrameOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeFrameOption: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedTimeFrame: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  timeFrameText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
  selectedTimeFrameText: {
    color: colors.primary,
    fontWeight: '600',
  },
  exportSection: {
    marginBottom: 24,
  },
  exportInfo: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    textAlign: 'center',
  },
  exportButton: {
    marginBottom: 16,
  },
  noteSection: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  noteText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});