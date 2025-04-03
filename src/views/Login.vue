<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card>
          <v-card-title class="headline">Вхід</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleLogin">
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                :rules="[rules.required, rules.email]"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Пароль"
                type="password"
                :rules="[rules.required, rules.minLength]"
                required
              ></v-text-field>
              <v-btn type="submit" color="primary" block :loading="loading">Увійти</v-btn>
            </v-form>
            <p class="mt-2">
              Немає акаунта? <router-link to="/register">Зареєструйтесь</router-link>
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const loading = ref(false);

const rules = {
  required: (value: string) => !!value || "Поле обов'язкове",
  email: (value: string) => /.+@.+\..+/.test(value) || 'Невірний email',
  minLength: (value: string) => value.length >= 6 || 'Мінімум 6 символів',
};

const handleLogin = async () => {
  loading.value = true;
  const success = await authStore.login(email.value, password.value);
  loading.value = false;
  if (success) {
    router.push('/contacts'); // redirect to contacts page
  } else {
    alert('Вхід не вдався. Перевірте дані.');
  }
};
</script>

<style scoped>
.headline {
  text-align: center;
}
</style>