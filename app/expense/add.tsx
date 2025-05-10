import { Button } from '@/components/Button';
import { CameraView } from '@/components/CameraView';
import { CategoryPicker } from '@/components/CategoryPicker';
import { Input } from '@/components/Input';
import { colors } from '@/constants/Colors';

import { useAuthStore } from '@/store/auth-store';
import { useExpenseStore } from '@/store/expense-store';
import { performOCR } from '@/utils/ocr-utils';
import { Image as ExpoImage } from 'expo-image';
import { Stack, router } from 'expo-router';
import { Camera, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function AddExpenseScreen() {
  const { user } = useAuthStore();
  const { addExpense, isLoading } = useExpenseStore();
  
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [receiptUrl, setReceiptUrl] = useState('');
  
  const [showCamera, setShowCamera] = useState(false);
  const [processingImage, setProcessingImage] = useState(false);
  
  const [amountError, setAmountError] = useState('');
  const [dateError, setDateError] = useState('');

  const validateForm = () => {
    let isValid = true;
    
    // Validate amount
    if (!amount) {
      setAmountError('Amount is required');
      isValid = false;
    } else if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setAmountError('Amount must be a positive number');
      isValid = false;
    } else {
      setAmountError('');
    }
    
    // Validate date
    if (!date) {
      setDateError('Date is required');
      isValid = false;
    } else {
      setDateError('');
    }
    
    return isValid;
  };

  const handleAddExpense = async () => {
    if (!validateForm()) return;
    
    if (!user) {
      Alert.alert('Error', 'You must be logged in to add an expense');
      return;
    }
    
    try {
      await addExpense({
        amount: parseFloat(amount),
        category,
        date,
        notes,
        receiptUrl,
        userId: user.id,
      });
      
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to add expense');
    }
  };

  const handleCapture = async (uri: string) => {
    setShowCamera(false);
    setReceiptUrl(uri);
    
    // Process the image with OCR
    setProcessingImage(true);
    try {
      const result = await performOCR(uri);
      
      if (result.amount) {
        setAmount(result.amount.toString());
      }
      
      if (result.date) {
        setDate(result.date);
      }
      
      if (result.merchantName) {
        setNotes(result.merchantName);
      }
    } catch (error) {
      console.error('OCR processing failed:', error);
    } finally {
      setProcessingImage(false);
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Add Expense',
          headerRight: () => (
            <TouchableOpacity 
              onPress={handleAddExpense}
              disabled={isLoading}
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          ),
        }} 
      />
      
      {showCamera ? (
        <CameraView
          onCapture={handleCapture}
          onClose={() => setShowCamera(false)}
        />
      ) : (
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.receiptSection}>
              {receiptUrl ? (
                <View style={styles.receiptContainer}>
                  <ExpoImage
                    source={{ uri: receiptUrl }}
                    style={styles.receiptImage}
                    contentFit="cover"
                  />
                  <TouchableOpacity 
                    style={styles.removeReceiptButton}
                    onPress={() => setReceiptUrl('')}
                  >
                    <X size={20} color="white" />
                  </TouchableOpacity>
                  
                  {processingImage && (
                    <View style={styles.processingOverlay}>
                      <Text style={styles.processingText}>Processing receipt...</Text>
                    </View>
                  )}
                </View>
              ) : (
                <TouchableOpacity 
                  style={styles.addReceiptButton}
                  onPress={() => setShowCamera(true)}
                >
                  <Camera size={24} color={colors.primary} />
                  <Text style={styles.addReceiptText}>Add Receipt</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <Input
              label="Amount"
              placeholder="0.00"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              error={amountError}
            />
            
            <CategoryPicker
              selectedCategory={category}
              onSelectCategory={setCategory}
            />
            
            <Input
              label="Date"
              placeholder="YYYY-MM-DD"
              value={date}
              onChangeText={setDate}
              error={dateError}
            />
            
            <Input
              label="Notes"
              placeholder="Add notes about this expense"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              style={styles.notesInput}
            />
            
            <Button
              title="Save Expense"
              onPress={handleAddExpense}
              isLoading={isLoading}
              style={styles.submitButton}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      )}
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
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  receiptSection: {
    marginBottom: 20,
  },
  addReceiptButton: {
    backgroundColor: colors.card,
    borderRadius: 12,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  addReceiptText: {
    color: colors.primary,
    marginTop: 8,
    fontWeight: '500',
  },
  receiptContainer: {
    position: 'relative',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
  },
  receiptImage: {
    width: '100%',
    height: '100%',
  },
  removeReceiptButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  notesInput: {
    height: 100,
    paddingTop: 12,
  },
  submitButton: {
    marginTop: 20,
  },
});