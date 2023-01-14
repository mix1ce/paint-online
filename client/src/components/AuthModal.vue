<template>
  <v-dialog
    :model-value="isShow"
    @update:model-value.stop=""
  >
    <v-card
      class="mx-auto px-4 py-3"
      width="300"
    >
      <v-card-text class="pa-0">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="username"
                hide-details="auto"
                label="Введите ваше имя"
                variant="underlined"
                @keydown.enter="login"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn
          block
          color="primary"
          @click="login"
        >
          Войти
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useCanvasStore } from '@/stores/CanvasStore'
import { ref } from 'vue'

const canvasStore = useCanvasStore()

const isShow = ref(true)
const username = ref()

const login = () => {
  if (username.value) {
    canvasStore.setUsername(username.value)

    isShow.value = false
  }
}
</script>
