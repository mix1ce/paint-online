<template>
  <v-container class="d-flex flex-wrap justify-center justify-sm-space-between">
    <div class="d-flex flex-wrap justify-center">
      <v-btn
        v-for="btn in buttonsLeft"
        :key="btn.id"
        :active="toolStore.tool.name === btn.id"
        :class="btn.id"
        class="my-1 my-sm-0"
        @click="btn.action"
      />
    </div>
    <div class="d-flex flex-wrap justify-center">
      <v-spacer class="d-none d-sm-flex" />
      <v-btn
        v-for="btn in buttonsRight"
        :key="btn.id"
        :class="btn.id"
        :disabled="btn.disabled"
        @click="btn.action"
      />
    </div>
  </v-container>
</template>

<script setup>
import { useImageLoader } from '@/composables/useImageLoader.js'
import { useCanvasStore } from '@/stores/CanvasStore.js'
import { useToolStore } from '@/stores/ToolStore.js'
import Brush from '@/tools/Brush.js'
import Circle from '@/tools/Circle.js'
import Eraser from '@/tools/Eraser.js'
import Line from '@/tools/Line.js'
import Rect from '@/tools/Rect.js'
import { computed, ref, toRefs } from 'vue'

const canvasStore = useCanvasStore()
const toolStore = useToolStore()
const { canvas, socket, sessionID } = toRefs(canvasStore)
const { save } = useImageLoader()

const buttonsLeft = [
  { id: 'brush', action: () => toolStore.setTool(new Brush(canvas.value, socket.value, sessionID.value)) },
  { id: 'rect', action: () => toolStore.setTool(new Rect(canvas.value, socket.value, sessionID.value)) },
  { id: 'circle', action: () => toolStore.setTool(new Circle(canvas.value, socket.value, sessionID.value)) },
  { id: 'eraser', action: () => toolStore.setTool(new Eraser(canvas.value, socket.value, sessionID.value)) },
  { id: 'line', action: () => toolStore.setTool(new Line(canvas.value, socket.value, sessionID.value)) },
  { id: 'bin', action: canvasStore.clear },
]
const buttonsRight = ref([
  { id: 'undo', action: canvasStore.undo, disabled: computed(() => !canvasStore.undoList.length) },
  { id: 'redo', action: canvasStore.redo, disabled: computed(() => !canvasStore.redoList.length) },
  { id: 'save', action: () => save(canvas.value.toDataURL(), sessionID.value) },
])
</script>

<style scoped>
.brush {
  background: url('../assets/image/brush.png') no-repeat center center;
}

.rect {
  background: url('../assets/image/rect.png') no-repeat center center;
}

.circle {
  background: url('../assets/image/circle.png') no-repeat center center;
}

.eraser {
  background: url('../assets/image/eraser.png') no-repeat center center;
}

.line {
  background: url('../assets/image/line.png') no-repeat center center;
}

.bin {
  background: url('../assets/image/bin.png') no-repeat center center;
}

.undo {
  background: url('../assets/image/undo.png') no-repeat center center;
}

.redo {
  background: url('../assets/image/redo.png') no-repeat center center;
}

.save {
  background: url('../assets/image/save.png') no-repeat center center;
}

</style>
