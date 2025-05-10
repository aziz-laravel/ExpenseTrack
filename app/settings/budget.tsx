import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { colors } from '@/constants/Colors';

import { useBudgetStore } from '@/store/budget-store';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View
} from 'react-native';

export default function BudgetSettingsScreen() {
  const { budget, setBudget } = useBudgetStore();
  
  const [monthlyLimit, setMonthlyLimit] = useState(budget.monthlyLimit.toString());
  const [notifyOnExceed, setNotifyOnExceed] = useState(budget.notifyOnExceed);
  const [monthlyLimitError, setMonthlyLimitError] = useState('');

  const validateForm = () => {
    let isValid = true;
    
    // Validate monthly limit
    if (!monthlyLimit) {
      setMonthlyLimitError('Monthly limit is required');
      isValid = false;
    } else if (isNaN(parseFloat(monthlyLimit)) || parseFloat(monthlyLimit) <= 0) {
      setMonthlyLimitError('Monthly limit must be a positive number');
      isValid = false;
    } else {
      setMonthlyLimitError('');
    }
    
    return isValid;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    
    setBudget({
      monthlyLimit: parseFloat(monthlyLimit),
      notifyOnExceed,
    });
    
    router.back();
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Budget Settings',
          headerRight: () => (
            <Text 
              style={styles.saveButton}
              onPress={handleSave}
            >
              Save
            </Text>
          ),
        }} 
      />
      
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Monthly Budget</Text>
            <Text style={styles.sectionDescription}>
              Set your monthly spending limit. You'll receive alerts when you exceed this amount.
            </Text>
            
            <Input
              label="Monthly Limit"
              placeholder="Enter amount"
              value={monthlyLimit}
              onChangeText={setMonthlyLimit}
              keyboardType="decimal-pad"
              error={monthlyLimitError}
            />
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <Text style={styles.sectionDescription}>
              Configure how you want to be notified about your budget.
            </Text>
            
            <View style={styles.settingItem}>
              <View>
                <Text style={styles.settingTitle}>Budget Alerts</Text>
                <Text style={styles.settingDescription}>
                  Receive notifications when you exceed your budget
                </Text>
              </View>
              <Switch
                value={notifyOnExceed}
                onValueChange={setNotifyOnExceed}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={Platform.OS === 'ios' ? 'white' : notifyOnExceed ? colors.primary : colors.border}
              />
            </View>
          </View>
          
          <Button
            title="Save Changes"
            onPress={handleSave}
            style={styles.saveChangesButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
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
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingTitle: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    maxWidth: '80%',
  },
  saveChangesButton: {
    marginTop: 16,
  },
});