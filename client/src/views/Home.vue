<template>
  <v-app class="h-screen overflow-hidden">
    <app-header />

    <v-main>
      <app-canvas class="flex-grow-1" />
    </v-main>
  </v-app>
</template>

<script setup>
import AppCanvas from '@/components/Canvas.vue'
import AppHeader from '@/components/Header.vue'
</script>

