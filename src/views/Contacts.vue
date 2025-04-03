<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Список контактів</v-card-title>
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
            <v-text-field
              v-model="newContact"
              label="Додати контакт за ім'ям"
              append-icon="mdi-plus"
              @click:append="addContact"
              @keyup.enter="addContact"
            ></v-text-field>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api';

const router = useRouter();
const contacts = ref<{ id: number; username: string; online: boolean }[]>([]);
const newContact = ref('');

const fetchContacts = async () => {
  try {
    const response = await api.get('/contacts');
    contacts.value = response.data.contacts;
  } catch (error) {
    console.error('Failed to fetch contacts:', error);
  }
};

const addContact = async () => {
  if (!newContact.value) return;
  try {
    const response = await api.post('/contacts', { username: newContact.value });
    contacts.value.push({
      id: response.data.contactId,
      username: newContact.value,
      online: false, // Default to offline
    });
    newContact.value = '';
  } catch (error) {
    console.error('Failed to add contact:', error);
  }
};

const openChat = (contactId: number) => {
  router.push(`/chat/${contactId}`);
};

onMounted(() => {
  fetchContacts();
});
</script>