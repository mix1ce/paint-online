export const useImageLoader = () => {
  const save = (url, name) => {
    const a = document.createElement('a')
    a.href = url
    a.download = `${ name }.jpg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return { save }
}
