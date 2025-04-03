<template>
  <v-app>
    <v-main>
      <v-app-bar :elevation="2" v-if="authStore.token">
        <template v-slot:prepend>
          <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        </template>

        <v-app-bar-title>Chat app</v-app-bar-title>
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
  import SidebarMenu from '@/components/SideBarMenuItems.vue';
  import { useAuthStore } from '@/stores/auth'

  const authStore = useAuthStore();
  const drawer = ref(false)
</script>
