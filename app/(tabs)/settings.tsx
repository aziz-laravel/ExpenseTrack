
import { colors } from '@/constants/Colors';
import { useAuthStore } from '@/store/auth-store';
import { useBudgetStore } from '@/store/budget-store';
import { formatCurrency } from '@/utils/date-utils';
import { router } from 'expo-router';
import {
  Bell,
  ChevronRight,
  DollarSign,
  FileText,
  HelpCircle,
  LogOut,
  Moon
} from 'lucide-react-native';
import React from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const { user, logout } = useAuthStore();
  const { budget, setBudget } = useBudgetStore();
  
  const [darkMode, setDarkMode] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);
  
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            logout();
            router.replace('/(auth)');
          },
          style: 'destructive',
        },
      ]
    );
  };
  
  const toggleBudgetNotifications = () => {
    setBudget({
      ...budget,
      notifyOnExceed: !budget.notifyOnExceed,
    });
  };
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real app, this would update a theme context/store
    Alert.alert(
      'Feature Not Implemented',
      'Dark mode would be implemented in a production app.',
      [{ text: 'OK' }]
    );
  };
  
  const toggleNotifications = () => {
    setNotifications(!notifications);
    // In a real app, this would register/unregister for notifications
    Alert.alert(
      'Feature Not Implemented',
      'Notification settings would be implemented in a production app.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.userSection}>
          <View style={styles.userInfo}>
            <View style={styles.userAvatar}>
              <Text style={styles.userInitial}>
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </Text>
            </View>
            <View>
              <Text style={styles.userName}>{user?.name || 'User'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => router.push('/settings/budget')}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(74, 111, 165, 0.1)' }]}>
                <DollarSign size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.settingTitle}>Monthly Budget</Text>
                <Text style={styles.settingValue}>{formatCurrency(budget.monthlyLimit)}</Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(71, 184, 129, 0.1)' }]}>
                <Bell size={20} color={colors.secondary} />
              </View>
              <View>
                <Text style={styles.settingTitle}>Budget Alerts</Text>
                <Text style={styles.settingValue}>
                  {budget.notifyOnExceed ? 'Enabled' : 'Disabled'}
                </Text>
              </View>
            </View>
            <Switch
              value={budget.notifyOnExceed}
              onValueChange={toggleBudgetNotifications}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={Platform.OS === 'ios' ? 'white' : budget.notifyOnExceed ? colors.primary : colors.border}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(159, 122, 234, 0.1)' }]}>
                <Moon size={20} color="#9F7AEA" />
              </View>
              <View>
                <Text style={styles.settingTitle}>Dark Mode</Text>
                <Text style={styles.settingValue}>
                  {darkMode ? 'Enabled' : 'Disabled'}
                </Text>
              </View>
            </View>
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={Platform.OS === 'ios' ? 'white' : darkMode ? colors.primary : colors.border}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(237, 137, 54, 0.1)' }]}>
                <Bell size={20} color="#ED8936" />
              </View>
              <View>
                <Text style={styles.settingTitle}>Notifications</Text>
                <Text style={styles.settingValue}>
                  {notifications ? 'Enabled' : 'Disabled'}
                </Text>
              </View>
            </View>
            <Switch
              value={notifications}
              onValueChange={toggleNotifications}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={Platform.OS === 'ios' ? 'white' : notifications ? colors.primary : colors.border}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => router.push('/settings/export')}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(66, 153, 225, 0.1)' }]}>
                <FileText size={20} color="#4299E1" />
              </View>
              <Text style={styles.settingTitle}>Export Data</Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => {
              Alert.alert(
                'Help & Support',
                'This would open a help screen in a production app.',
                [{ text: 'OK' }]
              );
            }}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(160, 174, 192, 0.1)' }]}>
                <HelpCircle size={20} color="#A0AEC0" />
              </View>
              <Text style={styles.settingTitle}>Help & Support</Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.settingItem, styles.logoutItem]}
            onPress={handleLogout}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(229, 62, 62, 0.1)' }]}>
                <LogOut size={20} color={colors.danger} />
              </View>
              <Text style={[styles.settingTitle, { color: colors.danger }]}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
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
  userSection: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userInitial: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
    marginLeft: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    color: colors.text,
  },
  settingValue: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  logoutItem: {
    borderColor: colors.danger,
  },
});