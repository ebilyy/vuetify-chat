<template>
  <v-container fluid class="fill-height pa-0">
    <v-row no-gutters class="fill-height">
      <v-col>
        <v-card class="d-flex flex-column" height="100%">
          <v-card-title class="primary white--text">
            Чат з {{ contactUsername }}
          </v-card-title>
          <v-card-text class="flex-grow-1 overflow-y-auto message-container pa-4">
            <div v-for="message in messages" :key="message.id" class="message-item mb-2">
              <v-chip
                :color="message.senderId === authStore.userId ? 'blue lighten-4' : 'grey lighten-3'"
                class="pa-3"
                :class="{ 'ml-auto': message.senderId === authStore.userId }"
                style="max-width: 70%; word-break: break-word;"
              >
                <span class="message-content">
                  {{ message.content }}
                </span>
              </v-chip>
              <div
                :class="{
                  'text-right': message.senderId === authStore.userId,
                  'text-left': message.senderId !== authStore.userId,
                }"
                class="caption grey--text"
              >
                {{ new Date(message.sent_at).toLocaleTimeString() }}
              </div>
            </div>
          </v-card-text>
          <v-card-actions class="pa-4">
            <v-textarea
              v-model="newMessage"
              label="Напишіть повідомлення"
              rows="1"
              auto-grow
              append-icon="mdi-send"
              @click:append="sendMessage"
              @keyup.enter="sendMessage"
              class="flex-grow-1"
              outlined
              dense
            ></v-textarea>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
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
    scrollToBottom();
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
    id: Date.now(), // Тимчасовий ID
    senderId: authStore.userId!,
    content: newMessage.value,
    sent_at: new Date().toISOString(),
  });
  newMessage.value = '';
  nextTick(() => scrollToBottom());
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
      nextTick(() => scrollToBottom());
    }
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket');
  });
};

const scrollToBottom = () => {
  const container = document.querySelector('.message-container');
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
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
.fill-height {
  height: 100vh;
}
.message-container {
  background-color: #fafafa;
}
.message-item {
  display: flex;
  flex-direction: column;
}
.message-content {
  font-size: 1rem;
  color: #333;
}
</style>