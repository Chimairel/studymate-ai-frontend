import api from './api';

export interface User {
  id?: string;
  firstName?: string;
  lastName?: string;
  name: string;
  email: string;
  role: string;
  bio?: string;
  preferences?: {
    realTimeFeedback?: boolean;
    grammarHighlights?: boolean;
    weeklyReport?: boolean;
    darkMode?: boolean;
    defaultEssayMode?: string;
  };
  streak?: number;
  createdAt?: string;
}

export interface AuthResponse {
  code: number;
  status: string;
  message?: string;
  token?: string;
  data?: {
    user: User;
    token?: string;
  };
}

export const authService = {
  login: async (credentials: any): Promise<AuthResponse> => {
    const response = await api.post('/auth/v1/login', credentials);
    return response.data;
  },

  signup: async (userData: any): Promise<AuthResponse> => {
    const response = await api.post('/auth/v1/signup', userData);
    return response.data;
  },

  logout: async (): Promise<void> => {
    // Backend may not have an active logout endpoint, but we call it if it does
    try {
      await api.post('/auth/v1/logout');
    } catch (e) {
      console.warn('Backend logout not implemented, clearing local storage only.');
    }
  },

  getMe: async (): Promise<{ user: User }> => {
    const response = await api.get('/auth/v1/me');
    return response.data;
  },

  updateMe: async (updates: Partial<User>): Promise<{ user: User }> => {
    const response = await api.put('/auth/v1/me', updates);
    return response.data.data;
  }
};
