import axios from 'axios';

// Base URL support for both Next.js and Vite env variables, falling back to local port
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || process.env.VITE_API_URL || 'http://localhost:3000/api',
});

api.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
