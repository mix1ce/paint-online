export const useImageGenerator = () => {
  const create = (url, canvas) => {
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.src = url
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    }
  }

  return { create }
}
