// Meldet die Mausbewegung seit dem letzten Event, bis die Maustaste losgelassen wird.
export function startDrag(event: PointerEvent, onMove: (dx: number, dy: number) => void) {
  let lastX = event.clientX
  let lastY = event.clientY

  const move = (e: PointerEvent) => {
    onMove(e.clientX - lastX, e.clientY - lastY)
    lastX = e.clientX
    lastY = e.clientY
  }
  const stop = () => {
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', stop)
  }

  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', stop)
}
