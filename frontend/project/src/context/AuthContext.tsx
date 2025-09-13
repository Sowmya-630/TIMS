import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authService } from '../services/authService';
import { subscriptionService } from '../services/subscriptionService';
import { User, Subscription, LoginRequest, RegisterRequest } from '../types';

// Legacy interface for backward compatibility
export interface LegacyUser {
  id: string;
  email: string;
  fullName: string;
  role: 'user' | 'admin';
}

export interface LegacySubscription {
  id: string;
  planId: string;
  planName: string;
  status: 'active' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string;
  price: number;
  features: string[];
}

interface AuthContextType {
  user: User | null;
  subscriptions: Subscription[];
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, fullName: string, role?: 'Admin' | 'EndUser') => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  refreshSubscriptions: () => Promise<void>;
  cancelSubscription: (id: string, reason?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      if (authService.isAuthenticated()) {
        const userData = await authService.getProfile();
        setUser(userData);
        await loadUserSubscriptions(userData.id);
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      authService.logout();
    } finally {
      setLoading(false);
    }
  };

  const loadUserSubscriptions = async (userId: string) => {
    try {
      const userSubscriptions = await subscriptionService.getUserSubscriptions(userId);
      setSubscriptions(userSubscriptions);
    } catch (error) {
      console.error('Failed to load subscriptions:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await authService.login({ email, password });
      setUser(response.user);
      await loadUserSubscriptions(response.user.id);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, fullName: string, role: 'Admin' | 'EndUser' = 'EndUser'): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await authService.register({ email, password, fullName, role });
      setUser(response.user);
      await loadUserSubscriptions(response.user.id);
      return true;
    } catch (error) {
      console.error('Signup failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setSubscriptions([]);
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      const updatedUser = await authService.updateProfile(updates);
      setUser(updatedUser);
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  };

  const refreshSubscriptions = async () => {
    if (user) {
      await loadUserSubscriptions(user.id);
    }
  };

  const cancelSubscription = async (id: string, reason?: string) => {
    try {
      await subscriptionService.cancelSubscription(id, reason);
      await refreshSubscriptions();
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    subscriptions,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    refreshSubscriptions,
    cancelSubscription,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};