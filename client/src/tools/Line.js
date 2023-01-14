import Tool from './Tool'

export default class Line extends Tool {
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
        type: 'line',
        startX: this.startX,
        startY: this.startY,
        endX: this.endX,
        endY: this.endY,
        lineWidth: this.toolStore.lineWidth,
        strokeStyle: this.toolStore.strokeStyle,
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
      this.endX = e.pageX - e.target.offsetLeft
      this.endY = e.pageY - e.target.offsetTop

      this.draw(this.endX, this.endY)
    }
  }

  draw(x, y) {
    this.ctx.lineWidth = this.toolStore.lineWidth
    this.ctx.strokeStyle = this.toolStore.strokeStyle

    const img = new Image()
    img.src = this.saved
    img.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
      this.ctx.beginPath()
      this.ctx.moveTo(this.startX, this.startY)
      this.ctx.lineTo(x, y)
      this.ctx.stroke()
    }
  }

  static staticDraw(ctx, startX, startY, endX, endY, lineWidth, strokeStyle) {
    ctx.strokeStyle = strokeStyle
    ctx.lineWidth = lineWidth
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)
    ctx.stroke()
  }
}
