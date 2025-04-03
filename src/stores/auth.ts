import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../api';

export const useAuthStore = defineStore('auth', () => {
  const userId = ref<number | null>(null);
  const username = ref<string | null>(null);
  const token = ref<string | null>(null);

  const setUser = (data: { userId: number; username: string; token: string }) => {
    userId.value = data.userId;
    username.value = data.username;
    token.value = data.token;
  };

  const clearUser = () => {
    userId.value = null;
    username.value = null;
    token.value = null;
  };

  const register = async (email: string, username: string, password: string) => {
    try {
      const response = await api.post('/auth/register', { email, username, password });
      const { userId, username: registeredUsername } = response.data;
      // Токен поки не повертається з /register за ТЗ, але ми можемо додати його в майбутньому
      setUser({ userId, username: registeredUsername, token: '' });
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { userId, token } = response.data;
      setUser({ userId, username: email.split('@')[0], token });
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  return { userId, username, token, setUser, clearUser, register, login };
});