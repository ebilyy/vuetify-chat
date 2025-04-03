import axios, { AxiosInstance } from 'axios';
import { useAuthStore } from '../stores/auth';

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // TODO: Change this to your API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
api.interceptors.request.use((config) => {
  const { token } = useAuthStore();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;