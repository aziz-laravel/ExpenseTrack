import { Button } from '@/components/Button';
import { colors } from '@/constants/Colors';

import { useAuthStore } from '@/store/auth-store';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function WelcomeScreen() {
  const { user } = useAuthStore();
  
  useEffect(() => {
    // If user is already logged in, redirect to main app
    if (user) {
      router.replace('/(tabs)');
    }
  }, [user]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>ExpenseTrack</Text>
        
        <Text style={styles.title}>Track Your Expenses</Text>
        <Text style={styles.subtitle}>
          Keep track of your spending, set budgets, and save receipts all in one place.
        </Text>
        
        <View style={styles.features}>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureEmoji}>📊</Text>
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Track Expenses</Text>
              <Text style={styles.featureDescription}>
                Log your expenses and categorize them
              </Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureEmoji}>📷</Text>
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Scan Receipts</Text>
              <Text style={styles.featureDescription}>
                Take photos of receipts and extract data
              </Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureEmoji}>💰</Text>
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Budget Alerts</Text>
              <Text style={styles.featureDescription}>
                Set budgets and get notified when you exceed them
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.buttons}>
        <Button
          title="Sign In"
          onPress={() => router.push('/(auth)/login')}
          variant="primary"
          style={styles.button}
        />
        <Button
          title="Create Account"
          onPress={() => router.push('/(auth)/register')}
          variant="outline"
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'space-between',
    padding: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 40,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 24,
  },
  features: {
    marginTop: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  buttons: {
    marginTop: 40,
  },
  button: {
    marginBottom: 12,
  },
});