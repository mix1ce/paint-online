import { useToolStore } from '@/stores/ToolStore.js'

export default class Tool {
  constructor(canvas, socket, id) {
    this.name = this.constructor.name.toLowerCase()
    this.canvas = canvas
    this.socket = socket
    this.id = id
    this.ctx = canvas.getContext('2d')
    this.toolStore = useToolStore()
    this.destroyEvents()
  }

  destroyEvents() {
    this.canvas.onmousemove = null
    this.canvas.onmousedown = null
    this.canvas.onmouseup = null
  }
}
