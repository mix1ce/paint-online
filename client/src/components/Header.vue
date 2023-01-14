<template>
  <v-toolbar height="auto">
    <v-container>
      <app-toolbar />
      <v-divider />
      <app-settings-bar />
    </v-container>
  </v-toolbar>
</template>

<script setup>
import AppSettingsBar from '@/components/SettingsBar.vue'
import AppToolbar from '@/components/Toolbar.vue'
</script>
