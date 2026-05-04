'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse } from '@/types';
import * as api from '@/lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  token: string | null;
  register: (email: string, password: string, name?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load token and user from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    if (savedToken) {
      setToken(savedToken);
      // Try to fetch current user
      api
        .getCurrentUser()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('auth_token');
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const register = async (email: string, password: string, name?: string) => {
    const response: AuthResponse = await api.register(email, password, name);
    localStorage.setItem('auth_token', response.token);
    setToken(response.token);
    setUser(response.user);
  };

  const login = async (email: string, password: string) => {
    const response: AuthResponse = await api.login(email, password);
    localStorage.setItem('auth_token', response.token);
    setToken(response.token);
    setUser(response.user);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        register,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
