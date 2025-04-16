"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, createApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

// User type
export interface User {
  id: string;
  username: string;
  email: string;
  isStreamer: boolean;
  avatarUrl?: string;
  bio?: string;
  streamKey?: string;
  isAdmin?: boolean;
  token: string;
}

// Auth context type
interface AuthContextType {
  user: User | null;
  api: ReturnType<typeof createApi>;
  login: (email: string, password: string) => Promise<User>;
  register: (username: string, email: string, password: string, dateOfBirth: Date, idDocumentUrl?: string, isStreamer?: boolean) => Promise<User>;
  logout: () => void;
  loading: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const api = createApi(user?.token);
  const router = useRouter();
  const { toast } = useToast();

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('Initializing auth state...');
      const token = localStorage.getItem('token');
      console.log('Stored token exists:', !!token);
      
      if (token) {
        try {
          console.log('Fetching current user data...');
          const userData = await authAPI.getCurrentUser();
          console.log('Current user data:', {
            id: userData.id,
            username: userData.username,
            isAdmin: userData.isAdmin,
            isStreamer: userData.isStreamer
          });
          setUser(userData);
        } catch (error) {
          console.error('Failed to get user data:', error);
          localStorage.removeItem('token');
        }
      } else {
        console.log('No token found, user is not authenticated');
      }
      
      setLoading(false);
    };
    
    initializeAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      const userData = { ...response, token: response.token };
      setUser(userData);
      return userData;
    } catch (error) {
      toast({
        title: "Error",
        description: "Login failed. Please check your credentials.",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Register function
  const register = async (username: string, email: string, password: string, dateOfBirth: Date, idDocumentUrl?: string, isStreamer?: boolean) => {
    try {
      const response = await authAPI.register(
        username,
        email,
        password,
        isStreamer,
        dateOfBirth,
        idDocumentUrl
      );
      const userData = { ...response, token: response.token };
      setUser(userData);
      return userData;
    } catch (error) {
      toast({
        title: "Error",
        description: "Registration failed. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  // Context value
  const value = {
    user,
    api,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
