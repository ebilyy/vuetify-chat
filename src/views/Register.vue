<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card>
          <v-card-title class="headline">Реєстрація</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="register">
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                :rules="[rules.required, rules.email]"
                required
              ></v-text-field>
              <v-text-field
                v-model="username"
                label="Ім'я користувача"
                :rules="[rules.required, rules.minLength]"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Пароль"
                type="password"
                :rules="[rules.required, rules.minLength]"
                required
              ></v-text-field>
              <v-text-field
                v-model="confirmPassword"
                label="Підтвердження пароля"
                type="password"
                :rules="[rules.required, rules.matchPassword]"
                required
              ></v-text-field>
              <v-btn type="submit" color="primary" block>Зареєструватися</v-btn>
            </v-form>
            <p class="mt-2">
              Вже маєте акаунт? <router-link to="/">Увійдіть</router-link>
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

const router = useRouter();

const email = ref('');
const username = ref('');
const password = ref('');
const confirmPassword = ref('');

const rules = {
  required: (value: string) => !!value || "Поле обов'язкове",
  email: (value: string) => /.+@.+\..+/.test(value) || 'Невірний email',
  minLength: (value: string) => value.length >= 6 || 'Мінімум 6 символів',
  matchPassword: (value: string) => value === password.value || 'Паролі не збігаються',
};

const register = () => {
  console.log('Register attempt:', {
    email: email.value,
    username: username.value,
    password: password.value,
    confirmPassword: confirmPassword.value,
  });
  // Тут буде інтеграція з API пізніше
  router.push('/');
};
</script>

<style scoped>
.headline {
  text-align: center;
}
</style>