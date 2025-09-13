import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'user' | 'admin';
}

export interface Subscription {
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
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, fullName: string, role: 'user' | 'admin') => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  addSubscription: (subscription: Omit<Subscription, 'id'>) => void;
  updateSubscription: (id: string, updates: Partial<Subscription>) => void;
  cancelSubscription: (id: string) => void;
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

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedSubscriptions = localStorage.getItem('subscriptions');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (savedSubscriptions) {
      setSubscriptions(JSON.parse(savedSubscriptions));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: '1',
      email,
      fullName: email === 'admin@example.com' ? 'Admin User' : 'John Doe',
      role: email === 'admin@example.com' ? 'admin' : 'user',
    };
    
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    // Load mock subscriptions for user
    if (mockUser.role === 'user') {
      const mockSubscriptions: Subscription[] = [
        {
          id: '1',
          planId: 'basic',
          planName: 'Basic Plan',
          status: 'active',
          startDate: '2024-01-15',
          endDate: '2024-02-15',
          price: 9.99,
          features: ['Feature 1', 'Feature 2']
        }
      ];
      setSubscriptions(mockSubscriptions);
      localStorage.setItem('subscriptions', JSON.stringify(mockSubscriptions));
    }
    
    return true;
  };

  const signup = async (email: string, password: string, fullName: string, role: 'user' | 'admin'): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      email,
      fullName,
      role,
    };
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    setSubscriptions([]);
    localStorage.removeItem('user');
    localStorage.removeItem('subscriptions');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const addSubscription = (subscription: Omit<Subscription, 'id'>) => {
    const newSubscription: Subscription = {
      ...subscription,
      id: Date.now().toString(),
    };
    const updated = [...subscriptions, newSubscription];
    setSubscriptions(updated);
    localStorage.setItem('subscriptions', JSON.stringify(updated));
  };

  const updateSubscription = (id: string, updates: Partial<Subscription>) => {
    const updated = subscriptions.map(sub =>
      sub.id === id ? { ...sub, ...updates } : sub
    );
    setSubscriptions(updated);
    localStorage.setItem('subscriptions', JSON.stringify(updated));
  };

  const cancelSubscription = (id: string) => {
    const updated = subscriptions.map(sub =>
      sub.id === id ? { ...sub, status: 'cancelled' as const } : sub
    );
    setSubscriptions(updated);
    localStorage.setItem('subscriptions', JSON.stringify(updated));
  };

  const value: AuthContextType = {
    user,
    subscriptions,
    login,
    signup,
    logout,
    updateProfile,
    addSubscription,
    updateSubscription,
    cancelSubscription,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};