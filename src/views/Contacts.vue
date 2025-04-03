<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            Мої контакти
            <v-spacer></v-spacer>
            <v-btn color="red" @click="logout">Вийти</v-btn>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-for="contact in contacts" :key="contact.id">
                <v-list-item-content>
                  <v-list-item-title>{{ contact.username }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ contact.online ? 'Онлайн' : 'Офлайн' }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon @click="openChat(contact.id)">
                    <v-icon>mdi-message</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Доступні користувачі</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-for="user in availableUsers" :key="user.id">
                <v-list-item-content>
                  <v-list-item-title>{{ user.username }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ user.online ? 'Онлайн' : 'Офлайн' }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon @click="addContact(user.username)" :disabled="isContact(user.id)">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import api from '../api';

const router = useRouter();
const authStore = useAuthStore();

const contacts = ref<{ id: number; username: string; online: boolean }[]>([]);
const availableUsers = ref<{ id: number; username: string; online: boolean }[]>([]);

const fetchContacts = async () => {
  try {
    const response = await api.get('/contacts');
    contacts.value = response.data.contacts;
  } catch (error) {
    console.error('Failed to fetch contacts:', error);
  }
};

const fetchAvailableUsers = async () => {
  try {
    const response = await api.get('/users');
    console.log('Available users:', response.data);
    availableUsers.value = response.data.filter(
      (user: any) =>
        user.id !== authStore.userId &&
        !contacts.value.some((contact) => contact.id === user.id)
    );
  } catch (error) {
    console.error('Failed to fetch available users:', error);
  }
};

const addContact = async (username: string) => {
  try {
    const response = await api.post('/contacts', { username });
    const newContact = {
      id: response.data.contactId,
      username,
      online: availableUsers.value.find((u) => u.username === username)?.online || false,
    };
    contacts.value.push(newContact);
    availableUsers.value = availableUsers.value.filter((u) => u.username !== username);
  } catch (error) {
    console.error('Failed to add contact:', error);
  }
};

const openChat = (contactId: number) => {
  router.push(`/chat/${contactId}`);
};

const logout = () => {
  authStore.clearUser();
  router.push('/');
};

const isContact = (userId: number) => {
  return contacts.value.some((contact) => contact.id === userId);
};

onMounted(() => {
  fetchContacts();
  fetchAvailableUsers();
});
</script>