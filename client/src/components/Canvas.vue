<template>
  <v-container class="pa-8 h-100">
    <div
      ref="containerRef"
      class="w-100 h-100 text-center"
    >
      <canvas
        ref="canvasRef"
        :height="canvasSize.height"
        :width="canvasSize.width"
        class="border flex-grow-1"
        @mouseup="mouseupHandler"
      />
    </div>
  </v-container>

  <v-snackbar
    v-model="isShowSnackbar"
    :timeout="2000"
    location="right bottom"
  >
    Пользователь {{ snackbarName }} присоединился
  </v-snackbar>

  <app-auth-modal />
</template>

<script setup>
import AppAuthModal from '@/components/AuthModal.vue'
import { useImageGenerator } from '@/composables/useImageGenerator.js'
import useResource from '@/composables/useResource.js'
import { WSUrl } from '@/constants/api.js'
import { useCanvasStore } from '@/stores/CanvasStore.js'
import { useToolStore } from '@/stores/ToolStore.js'
import Brush from '@/tools/Brush.js'
import Circle from '@/tools/Circle.js'
import Eraser from '@/tools/Eraser.js'
import Line from '@/tools/Line.js'
import Rect from '@/tools/Rect.js'
import { debounce } from '@/utils/debounce.js'
import { onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const canvasStore = useCanvasStore()
const toolStore = useToolStore()
const { send: sendImage, get: getImage } = useResource()
const { create: createImage } = useImageGenerator()

const canvasRef = ref(null)

const drawHandler = (msg) => {
  const figure = msg.figure
  const ctx = canvasRef.value.getContext('2d')

  switch (figure.type) {
    case 'brush':
      Brush.draw(ctx, figure.x, figure.y, figure.lineWidth, figure.strokeStyle)
      break
    case 'rect':
      Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.lineWidth, figure.fillStyle, figure.strokeStyle)
      break
    case 'circle':
      Circle.staticDraw(ctx, figure.x, figure.y, figure.r, figure.lineWidth, figure.fillStyle, figure.strokeStyle)
      break
    case 'eraser':
      Eraser.draw(ctx, figure.x, figure.y, figure.lineWidth)
      break
    case 'line':
      Line.staticDraw(ctx, figure.startX, figure.startY, figure.endX, figure.endY, figure.lineWidth, figure.strokeStyle)
      break
    case 'finish':
      ctx.beginPath()
      break
  }
}

const mouseupHandler = () => {
  if (toolStore.tool?.name) {
    const dataUrl = canvasRef.value.toDataURL()

    canvasStore.pushToUndo(dataUrl)
    sendImage(route.params.id, dataUrl)
  }
}

const getImageFromServer = () => getImage(route.params.id).then(response => {
  createImage(response.data, canvasRef.value)
  return response
})

const containerRef = ref(null)
const canvasSize = ref({ width: 0, height: 0 })

const calculateCanvasSize = () => {
  const containerHeight = containerRef.value?.clientHeight

  let width = containerRef.value?.clientWidth
  let height = width * 9 / 16

  if (height > containerHeight) {
    width = containerHeight * 16 / 9
    height = containerHeight
  }

  canvasSize.value = { width, height }
}

const renderCanvas = debounce(() => {
  calculateCanvasSize()
  getImageFromServer()
}, 500)

const isShowSnackbar = ref(false)
const snackbarName = ref()

watchEffect(() => {
  if (canvasStore.username) {
    const socket = new WebSocket(WSUrl)

    canvasStore.setSocket(socket)
    canvasStore.setSessionID(route.params.id)

    socket.onopen = () => {
      socket.send(JSON.stringify({
        id: route.params.id,
        username: canvasStore.username,
        method: 'connection',
      }))
    }

    socket.onmessage = async (event) => {
      let msg = JSON.parse(event.data)
      switch (msg.method) {
        case 'connection':
          if (msg.username === canvasStore.username) return

          isShowSnackbar.value = true
          snackbarName.value = msg.username
          break
        case 'update':
          await getImageFromServer()
          break
        case 'draw':
          drawHandler(msg)
          break
      }
    }
  }
})

onMounted(() => {
  canvasStore.setCanvas(canvasRef.value)
  calculateCanvasSize()
  getImageFromServer().then(({ data }) => canvasStore.setInitDraw(data))
  window.addEventListener('resize', renderCanvas)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', renderCanvas)
})
</script>
