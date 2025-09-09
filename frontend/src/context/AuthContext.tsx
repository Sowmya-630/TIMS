// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string;
  role: 'Admin' | 'Manager' | 'Staff';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (fullName: string, email: string, password: string, role: User['role']) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check localStorage for existing token/user on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        const loggedUser: User = { email, role: data.role }; // adjust role based on backend
        setUser(loggedUser);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(loggedUser));
        return true;
      } else {
        console.error('Login failed:', data.message);
        return false;
      }
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const signup = async (
    fullName: string,
    email: string,
    password: string,
    role: User['role']
  ): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, email, password, role }),
      });

      const data = await response.json();
      if (response.ok) {
        const newUser: User = { email, role };
        setUser(newUser);
        localStorage.setItem('token', data.token || ''); // if backend returns token
        localStorage.setItem('user', JSON.stringify(newUser));
        return true;
      } else {
        console.error('Signup failed:', data.message);
        return false;
      }
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
