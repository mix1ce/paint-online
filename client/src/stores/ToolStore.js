import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToolStore = defineStore('toolStore', () => {
  let tool = ref({})
  const lineWidth = ref(1)
  const strokeStyle = ref('#000000')
  const fillStyle = ref('#000000')

  const setTool = (value) => tool.value = value

  return { tool, lineWidth, strokeStyle, fillStyle, setTool }
})
