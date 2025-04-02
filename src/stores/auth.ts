import { defineStore } from 'pinia';
import { ref } from 'vue';

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

  return { userId, username, token, setUser, clearUser };
});