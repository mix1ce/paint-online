import Tool from './Tool'

export default class Circle extends Tool {
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
        type: 'circle',
        x: this.startX,
        y: this.startY,
        r: this.radius,
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
      const currentX = e.pageX - e.target.offsetLeft
      const currentY = e.pageY - e.target.offsetTop
      const width = currentX - this.startX
      const height = currentY - this.startY
      this.radius = Math.sqrt(width ** 2 + height ** 2)

      this.draw(this.startX, this.startY, this.radius)
    }
  }

  draw(x, y, r) {
    this.ctx.lineWidth = this.toolStore.lineWidth
    this.ctx.strokeStyle = this.toolStore.strokeStyle
    this.ctx.fillStyle = this.toolStore.fillStyle

    const img = new Image()
    img.src = this.saved
    img.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
      this.ctx.beginPath()
      this.ctx.arc(x, y, r, 0, 2 * Math.PI)
      this.ctx.fill()
      this.ctx.stroke()
    }
  }

  static staticDraw(ctx, x, y, r, lineWidth, fillStyle, strokeStyle) {
    ctx.strokeStyle = strokeStyle
    ctx.fillStyle = fillStyle
    ctx.lineWidth = lineWidth
    ctx.beginPath()
    ctx.arc(x, y, r, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
  }
}
