import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import api from '../lib/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (fullName: string, email: string, password: string, role: 'Admin' | 'Manager' | 'Staff') => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('tims_token');
    if (!token) { setIsLoading(false); return; }
    (async () => {
      try {
        const res = await api.get('/auth/profile');
        setUser(res.data.user);
      } catch (_) {
        localStorage.removeItem('tims_token');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('tims_token', res.data.token);
      setUser(res.data.user);
      return true;
    } catch (_) {
      return false;
    }
  };

  const signup = async (fullName: string, email: string, password: string, role: 'Admin' | 'Manager' | 'Staff'): Promise<boolean> => {
    try {
      const res = await api.post('/auth/register', { fullName, email, password, role });
      localStorage.setItem('tims_token', res.data.token);
      setUser(res.data.user);
      return true;
    } catch (_) {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tims_token');
  };

  const updateProfile = (userData: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    // Optionally call backend PUT /auth/profile here if needed
  };

  const value = {
    user,
    login,
    signup,
    logout,
    updateProfile,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};