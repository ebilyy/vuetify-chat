<template>
  <v-app>
    <v-main>
      <v-app-bar :elevation="2" v-if="authStore.token" class="px-6">
        <template v-slot:prepend>
          <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        </template>

        <v-app-bar-title>Chat app</v-app-bar-title>
        <v-splitter></v-splitter>
        <div class="mr-2">
          {{ authStore.username }}
        </div>
        <v-btn @click="logout" icon>
          <v-icon class="mr-2" >mdi-logout</v-icon>
        </v-btn>
      </v-app-bar>
      <v-navigation-drawer v-model="drawer" :location="$vuetify.display.mobile ? 'bottom' : undefined">
        <SidebarMenu></SidebarMenu>
      </v-navigation-drawer>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import SidebarMenu from '@/components/SideBarMenuItems.vue';
  import { useAuthStore } from '@/stores/auth'


  const drawer = ref(false)
  const router = useRouter();
  const authStore = useAuthStore();
  function logout() {
    authStore.clearUser();
    router.push('/');
  }
</script>
