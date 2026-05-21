import axios from 'axios';

// Base URL support for both Next.js and Vite env variables, falling back to local port
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || process.env.VITE_API_URL || 'http://localhost:3000/api',
});

api.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 15)}...` : null
    });
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, error => {
  console.error('[API Request Error]', error);
  return Promise.reject(error);
});

api.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response) {
    if (error.response.status >= 500) {
      console.error(`[API Response Error] ${error.config?.method?.toUpperCase()} ${error.config?.url} failed with ${error.response.status}:`, error.response.data);
    }
    if (error.response.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/auth')) {
        window.location.href = '/auth';
      }
    }
  } else {
    console.error(`[API Network/Unknown Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}:`, error.message);
  }
  return Promise.reject(error);
});

export default api;

