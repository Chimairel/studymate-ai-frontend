"use client";

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authService, User } from '../services/authService';

const enrichUser = (userData: any): User => {
  if (!userData) return userData;
  const name = userData.firstName && userData.lastName ? `${userData.firstName} ${userData.lastName}` : userData.name || userData.email?.split('@')[0] || 'User';
  return {
    ...userData,
    name
  };
};

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: any) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
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
    
    // Proactively apply dark mode class instantly on mount before the state resolves to prevent flashes!
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.preferences?.darkMode) {
          document.documentElement.classList.add('dark');
        }
      } catch (e) {}
    }
    
    setTimeout(() => {
      if (storedToken && storedUser) {
        setToken(storedToken);
        try {
          setUser(enrichUser(JSON.parse(storedUser)));
        } catch (e) {
          console.error('Failed to parse stored user', e);
        }
      }
      setIsLoading(false);
    }, 0);
  }, []);

  useEffect(() => {
    if (isLoading) return; // Prevent overwriting theme classes during loading resolution tick
    if (user && user.preferences && user.preferences.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [user, isLoading]);

  const login = async (credentials: any) => {
    setIsLoading(true);
    try {
      let response;
      try {
        response = await authService.login(credentials);
      } catch (apiError: any) {
        if (apiError.response) {
          throw apiError;
        }
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
      const enrichedUser = enrichUser(userData);
      
      setToken(authToken);
      setUser(enrichedUser);
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(enrichedUser));
    } catch (error) {
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
      } catch (apiError: any) {
        if (apiError.response) {
          throw apiError;
        }
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
      const enrichedUser = enrichUser(userObj);

      setToken(authToken);
      setUser(enrichedUser);
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(enrichedUser));
    } catch (error) {
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

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    try {
      await authService.updateMe(updates);
      const updatedUser = enrichUser({ ...user, ...updates });
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (e) {
      console.error('Failed to update user', e);
      throw e;
    }
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
