export function debounce(f, ms) {
  let isCoolDown = false

  return function () {
    if (isCoolDown) return
    f.apply(this, arguments)
    isCoolDown = true
    setTimeout(() => isCoolDown = false, ms)
  }
}
