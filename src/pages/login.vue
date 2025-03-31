<template>
  <div>Login page</div>
  <v-container>
    <v-form max-width="400px">
      <v-text-field label="First name" variant="underlined"></v-text-field>
      <v-text-field label="Last name" variant="underlined"></v-text-field>
      <v-text-field label="Email" variant="underlined" type="email"></v-text-field>
      <v-text-field label="Login" variant="underlined"></v-text-field>
      <v-text-field label="Password" type="password"  variant="underlined"></v-text-field>
      <v-btn class="mt-2" type="submit" block>Submit</v-btn>
    </v-form>
  </v-container>
</template>

<script lang="ts" setup>

</script>