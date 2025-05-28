"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface User {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  isStreamer: boolean;
  isAdmin: boolean;
  coins: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
  becomeStreamer: () => Promise<void>;
  purchaseCoins: (amount: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (err) {
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post('/api/auth/login', {
        email,
        password,
      });

      const { token, ...userData } = response.data;
      localStorage.setItem('token', token);
      setUser(userData);
      router.push('/browse');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string, displayName?: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post('/api/auth/register', {
        username,
        email,
        password,
        displayName,
      });

      const { token, ...userData } = response.data;
      localStorage.setItem('token', token);
      setUser(userData);
      router.push('/browse');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await axios.post('/api/auth/logout');
      localStorage.removeItem('token');
      setUser(null);
      router.push('/');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  const becomeStreamer = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/users/become-streamer',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser((prev) => prev ? { ...prev, isStreamer: true } : null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to become a streamer');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const purchaseCoins = async (amount: number) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/donations/purchase-coins',
        { amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser((prev) => prev ? { ...prev, coins: response.data.coins } : null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to purchase coins');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    becomeStreamer,
    purchaseCoins,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
