import { AuthState, User } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be a Firebase Auth call
          // For now, we'll simulate a successful login with mock data
          if (email && password) {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const user: User = {
              id: 'user1',
              email,
              name: email.split('@')[0],
            };
            
            set({ user, isLoading: false });
          } else {
            throw new Error('Email and password are required');
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to login', 
            isLoading: false 
          });
        }
      },
      
      register: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be a Firebase Auth call
          // For now, we'll simulate a successful registration with mock data
          if (email && password && name) {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const user: User = {
              id: 'user1',
              email,
              name,
            };
            
            set({ user, isLoading: false });
          } else {
            throw new Error('Email, password, and name are required');
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to register', 
            isLoading: false 
          });
        }
      },
      
      logout: () => {
        set({ user: null, error: null });
      },
      
      setUser: (user) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);