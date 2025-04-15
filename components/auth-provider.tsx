"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';
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
}

// Auth context type
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (username: string, email: string, password: string, dateOfBirth: Date, idDocumentUrl?: string, isStreamer?: boolean) => Promise<User>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const { toast } = useToast();

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const userData = await authAPI.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Failed to get user data:', error);
          localStorage.removeItem('token');
        }
      }
      
      setIsLoading(false);
    };
    
    initializeAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<User> => {
    try {
      const response = await authAPI.login(email, password);
      
      // Save token and user data
      localStorage.setItem('token', response.token);
      setUser(response);
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login Failed',
        description: 'Invalid email or password',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Register function
  const register = async (
    username: string, 
    email: string, 
    password: string, 
    dateOfBirth: Date, 
    idDocumentUrl?: string,
    isStreamer = false
  ): Promise<User> => {
    try {
      const response = await authAPI.register(
        username, 
        email, 
        password, 
        isStreamer, 
        dateOfBirth, 
        idDocumentUrl
      );
      
      // Save token and user data
      localStorage.setItem('token', response.token);
      setUser(response);
      
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      let description = 'An unexpected error occurred during registration.';
      if (error instanceof Error) {
          try {
              const errorData = JSON.parse(error.message);
              description = errorData.message || description;
          } catch (parseError) {
              description = error.message;
          }
      }
      toast({
        title: 'Registration Failed',
        description: description,
        variant: 'destructive',
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

  // Update user data
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  // Context value
  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
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
