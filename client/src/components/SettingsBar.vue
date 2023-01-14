<template>
  <v-container>
    <v-row>
      <v-col
        cols="4"
        lg="1"
        md="2"
      >
        <v-text-field
          v-model="toolStore.lineWidth"
          :max="50"
          :min="1"
          bg-color="none"
          hide-details="auto"
          label="Толщина линии"
          type="number"
          variant="underlined"
        />
      </v-col>
      <v-col
        v-show="toolStore.tool.name === 'rect' || toolStore.tool.name === 'circle'"
        cols="4"
        lg="1"
        md="2"
      >
        <v-text-field
          v-model="toolStore.fillStyle"
          bg-color="none"
          hide-details="auto"
          label="Цвет заливки"
          type="color"
          variant="underlined"
        />
      </v-col>
      <v-col
        cols="4"
        lg="1"
        md="2"
      >
        <v-text-field
          v-model="toolStore.strokeStyle"
          bg-color="none"
          hide-details="auto"
          label="Цвет обводки"
          type="color"
          variant="underlined"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useToolStore } from '@/stores/ToolStore.js'

const toolStore = useToolStore()
</script>

