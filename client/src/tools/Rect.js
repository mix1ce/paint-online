import Tool from './Tool'

export default class Rect extends Tool {
  constructor(canvas, socket, id) {
    super(canvas, socket, id)
    this.listen()
  }

  listen() {
    this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
    this.canvas.onmousedown = this.mouseDownHandler.bind(this)
    this.canvas.onmouseup = this.mouseUpHandler.bind(this)
  }

  mouseUpHandler() {
    this.mouseDown = false

    this.socket.send(JSON.stringify({
      method: 'draw',
      id: this.id,
      figure: {
        type: 'rect',
        x: this.startX,
        y: this.startY,
        width: this.width,
        height: this.height,
        lineWidth: this.toolStore.lineWidth,
        strokeStyle: this.toolStore.strokeStyle,
        fillStyle: this.toolStore.fillStyle,
      },
    }))

    this.socket.send(JSON.stringify({
      method: 'draw',
      id: this.id,
      figure: {
        type: 'finish',
      },
    }))
  }

  mouseDownHandler(e) {
    this.mouseDown = true
    this.ctx.beginPath()
    this.startX = e.pageX - e.target.offsetLeft
    this.startY = e.pageY - e.target.offsetTop
    this.saved = this.canvas.toDataURL()
  }

  mouseMoveHandler(e) {
    if (this.mouseDown) {
      let currentX = e.pageX - e.target.offsetLeft
      let currentY = e.pageY - e.target.offsetTop
      this.width = currentX - this.startX
      this.height = currentY - this.startY
      this.draw(this.startX, this.startY, this.width, this.height)
    }
  }

  draw(x, y, w, h) {
    this.ctx.lineWidth = this.toolStore.lineWidth
    this.ctx.strokeStyle = this.toolStore.strokeStyle
    this.ctx.fillStyle = this.toolStore.fillStyle

    const img = new Image()
    img.src = this.saved
    img.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
      this.ctx.beginPath()
      this.ctx.rect(x, y, w, h)
      this.ctx.fill()
      this.ctx.stroke()
    }
  }

  static staticDraw(ctx, x, y, w, h, lineWidth, fillStyle, strokeStyle) {
    ctx.strokeStyle = strokeStyle
    ctx.fillStyle = fillStyle
    ctx.lineWidth = lineWidth
    ctx.beginPath()
    ctx.rect(x, y, w, h)
    ctx.fill()
    ctx.stroke()
  }
}
