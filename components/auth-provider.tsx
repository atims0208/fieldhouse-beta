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
      
      setIsLoading(false);
    };
    
    initializeAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<User> => {
    try {
      console.log('Attempting login for email:', email);
      const response = await authAPI.login(email, password);
      console.log('Login response:', {
        id: response.id,
        username: response.username,
        isAdmin: response.isAdmin,
        isStreamer: response.isStreamer
      });
      
      // Save token and user data
      localStorage.setItem('token', response.token);
      console.log('Token saved to localStorage');
      
      // Fetch fresh user data to ensure we have latest permissions
      console.log('Fetching fresh user data after login...');
      const userData = await authAPI.getCurrentUser();
      console.log('Fresh user data:', {
        id: userData.id,
        username: userData.username,
        isAdmin: userData.isAdmin,
        isStreamer: userData.isStreamer
      });
      
      setUser(userData);
      return userData;
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
        description = error.message;
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
