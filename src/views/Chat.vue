<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Чат з {{ contactUsername }}</v-card-title>
          <v-card-text>
            <v-list class="message-list" style="max-height: 400px; overflow-y: auto;">
              <v-list-item v-for="message in messages" :key="message.id">
                <v-list-item-content>
                  <v-list-item-title>
                    {{ message.senderId === authStore.userId ? 'Ви' : contactUsername }}:
                    {{ message.content }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ new Date(message.sent_at).toLocaleTimeString() }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-textarea
              v-model="newMessage"
              label="Напишіть повідомлення"
              rows="2"
              append-icon="mdi-send"
              @click:append="sendMessage"
              @keyup.enter="sendMessage"
            ></v-textarea>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import api from '../api';
import { io, Socket } from 'socket.io-client';

const route = useRoute();
const authStore = useAuthStore();

const contactId = ref(Number(route.params.contactId));
const contactUsername = ref('');
const messages = ref<{ id: number; senderId: number; content: string; sent_at: string }[]>([]);
const newMessage = ref('');
let socket: Socket;

const fetchMessages = async () => {
  try {
    const response = await api.get(`/messages/${contactId.value}`);
    messages.value = response.data.messages;
  } catch (error) {
    console.error('Failed to fetch messages:', error);
  }
};

const fetchContact = async () => {
  try {
    const response = await api.get('/contacts');
    const contact = response.data.contacts.find((c: any) => c.id === contactId.value);
    if (contact) {
      contactUsername.value = contact.username;
    }
  } catch (error) {
    console.error('Failed to fetch contact:', error);
  }
};

const sendMessage = () => {
  if (!newMessage.value.trim()) return;
  const messageData = {
    receiverId: contactId.value,
    content: newMessage.value,
  };
  socket.emit('send_message', messageData);
  messages.value.push({
    id: Date.now(), // Тимчасовий ID, реальний прийде з бекенду
    senderId: authStore.userId!,
    content: newMessage.value,
    sent_at: new Date().toISOString(),
  });
  newMessage.value = '';
};

const setupSocket = () => {
  socket = io('http://localhost:3000', {
    auth: { token: authStore.token },
  });

  socket.on('connect', () => {
    console.log('Connected to WebSocket');
  });

  socket.on('message_received', (message: { senderId: number; content: string; sent_at: string }) => {
    if (message.senderId === contactId.value) {
      messages.value.push({
        id: Date.now(), // Тимчасовий ID
        senderId: message.senderId,
        content: message.content,
        sent_at: message.sent_at,
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket');
  });
};

onMounted(() => {
  fetchContact();
  fetchMessages();
  setupSocket();
});

onUnmounted(() => {
  if (socket) {
    socket.disconnect();
  }
});
</script>

<style scoped>
.message-list {
  background-color: #f5f5f5;
  padding: 10px;
}
</style>