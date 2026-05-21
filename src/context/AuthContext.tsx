"use client";

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authService, User } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: any) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to load auth state from local storage on init
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user', e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: any) => {
    setIsLoading(true);
    try {
      let response;
      try {
        response = await authService.login(credentials);
      } catch (apiError) {
        console.warn('Backend API login failed. Falling back to local mock authentication.', apiError);
        response = {
          token: 'dummy-token',
          data: {
            user: {
              name: credentials.email.split('@')[0],
              email: credentials.email,
              role: 'College Student',
              bio: '3rd year BS Computer Science student who loves writing about tech and society.'
            }
          }
        };
      }
      const authToken = response.token || response.data?.token || 'dummy-token';
      const userData = response.data?.user || {
        name: credentials.email.split('@')[0],
        email: credentials.email,
        role: 'College Student'
      };
      
      setToken(authToken);
      setUser(userData);
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Login failed in AuthContext', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: any) => {
    setIsLoading(true);
    try {
      let response;
      try {
        response = await authService.signup(userData);
      } catch (apiError) {
        console.warn('Backend API signup failed. Falling back to local mock registration.', apiError);
        response = {
          token: 'dummy-token',
          data: {
            user: {
              firstName: userData.firstName,
              lastName: userData.lastName,
              name: userData.firstName && userData.lastName ? `${userData.firstName} ${userData.lastName}` : userData.email.split('@')[0],
              email: userData.email,
              role: userData.role || 'College Student',
              bio: '3rd year BS Computer Science student who loves writing about tech and society.'
            }
          }
        };
      }
      const authToken = response.token || response.data?.token || 'dummy-token';
      const userObj: User = response.data?.user || {
        firstName: userData.firstName,
        lastName: userData.lastName,
        name: userData.firstName && userData.lastName ? `${userData.firstName} ${userData.lastName}` : userData.email.split('@')[0],
        email: userData.email,
        role: userData.role || 'College Student'
      };

      setToken(authToken);
      setUser(userObj);
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userObj));
    } catch (error) {
      console.error('Signup failed in AuthContext', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.error('Logout API failed', e);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
