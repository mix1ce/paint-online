import { useImageGenerator } from '@/composables/useImageGenerator.js'
import useResource from '@/composables/useResource.js'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const { send } = useResource()
const { create: createImage } = useImageGenerator()

const sendImage = (socket, id, url) => {
  send(id, url).then(() => socket.send(JSON.stringify({ method: 'update', id })))
}

export const useCanvasStore = defineStore('canvasStore', () => {
  const canvas = ref(null)
  const socket = ref(null)
  const sessionID = ref(null)
  const username = ref('')
  const initDraw = ref()
  const undoList = ref([])
  const redoList = ref([])

  const setUsername = name => username.value = name
  const setCanvas = value => canvas.value = value
  const setSocket = value => socket.value = value
  const setSessionID = id => sessionID.value = id
  const setInitDraw = value => initDraw.value = value
  const pushToUndo = data => undoList.value.push(data)
  const pushToRedo = data => redoList.value.push(data)

  const undo = () => {
    if (!undoList.value.length) return

    if (undoList.value.length > 1) {
      redoList.value.push(undoList.value.pop())
      const dataUrl = undoList.value[undoList.value.length - 1]

      createImage(dataUrl, canvas.value)
      sendImage(socket.value, sessionID.value, dataUrl)
    } else {
      redoList.value.push(undoList.value.pop())
      createImage(initDraw.value, canvas.value)
      sendImage(socket.value, sessionID.value, initDraw.value)
    }
  }

  const redo = () => {
    if (redoList.value.length > 0) {
      const dataUrl = redoList.value.pop()

      undoList.value.push(dataUrl)
      createImage(dataUrl, canvas.value)
      sendImage(socket.value, sessionID.value, dataUrl)
    }
  }

  const clear = () => {
    const ctx = canvas.value.getContext('2d')
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)

    const dataUrl = canvas.value.toDataURL()
    undoList.value.push(dataUrl)
    sendImage(socket.value, sessionID.value, dataUrl)
  }

  return {
    canvas,
    socket,
    sessionID,
    username,
    setUsername,
    undoList,
    redoList,
    initDraw,
    undo,
    redo,
    setSessionID,
    setSocket,
    setCanvas,
    pushToRedo,
    pushToUndo,
    setInitDraw,
    clear,
  }
})
