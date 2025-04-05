<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            Rooms managment
            <v-spacer></v-spacer>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-for="room in rooms" :key="room.id">
                <v-list-item-content>
                  <v-list-item-title>{{ room.name }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ room.type }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon @click="openChat(room.id)" size="small">
                    <v-icon size="small">mdi-message-text</v-icon>
                  </v-btn>
                  <v-btn icon @click="deleteRoom(room.id)" size="small">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="createRoom()" color="primary">Створити кімнату</v-btn>
          </v-card-actions>
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

const rooms = ref<any[]>([]);
const availableUsers = ref<{ id: number; username: string; online: boolean }[]>([]);

const fetchRooms = async () => {
  try {
    const response = await api.get('/rooms');
    rooms.value = response.data.rooms;
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

const deleteRoom = async (roomId: number) => {
  try {
    await api.delete(`/rooms/${roomId}`);
    rooms.value = rooms.value.filter((room) => room.id !== roomId);
  } catch (error) {
    console.error('Failed to delete room:', error);
  }
};

const openChat = (contactId: number) => {
  router.push(`/chat/${contactId}`);
};

const createRoom = async () => {
  try {
    const response = await api.post('/rooms', { name: 'New Room', type: 'private' });
    rooms.value.push(response.data.room);
  } catch (error) {
    console.error('Failed to create room:', error);
  }
};

onMounted(() => {
  fetchRooms();
  fetchAvailableUsers();
});
</script>