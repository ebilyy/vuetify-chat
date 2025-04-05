<template>

<v-list-item title="My Application" subtitle="Vuetify"></v-list-item>
<v-divider></v-divider>
<v-list-item link title="Rooms" to="/rooms"></v-list-item>
<v-list-item link title="List Item 2"></v-list-item>
<v-list-item link title="List Item 3"></v-list-item>
</template>
<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import api from '../api';

const router = useRouter();
const authStore = useAuthStore();

const rooms = ref([]);
const loading = ref(false);

const fetchRooms = async () => {
  loading.value = true;
  try {
    const response = await api.get('/rooms');
    rooms.value = response.data;
    console.log('Rooms:', rooms.value);
  } catch (error) {
    console.error('Error fetching rooms:', error);
  } finally {
    loading.value = false;
  }
};

onBeforeMount(async () => {
  await fetchRooms();
});
// const openRoom = (roomId: number) => {
//   router.push({ name: 'Room', params: { roomId } });
// };



</script>