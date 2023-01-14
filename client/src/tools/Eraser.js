import Brush from '@/tools/Brush.js'

export default class Eraser extends Brush {
  constructor(canvas, socket, id) {
    super(canvas, socket, id)
  }

  mouseMoveHandler(e) {
    if (this.mouseDown) {
      this.socket.send(JSON.stringify({
        method: 'draw',
        id: this.id,
        figure: {
          type: this.name,
          x: e.pageX - e.target.offsetLeft,
          y: e.pageY - e.target.offsetTop,
          lineWidth: this.toolStore.lineWidth,
        },
      }))
    }
  }

  static draw(ctx, x, y, lineWidth) {
    ctx.strokeStyle = 'white'
    ctx.lineWidth = lineWidth
    ctx.lineTo(x, y)
    ctx.stroke()
  }
}
