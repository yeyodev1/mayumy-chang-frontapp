import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

/**
 * Fila horizontal que se puede arrastrar con el mouse (en táctil ya es nativo)
 * y avanzar con flechas. Un arrastre de más de 6 px anula el clic, para no abrir
 * una pieza sin querer al soltar.
 */
export function useDragScroll(track: Ref<HTMLElement | null>) {
  const canPrev = ref(false)
  const canNext = ref(true)
  let down = false
  let moved = 0
  let startX = 0
  let startLeft = 0

  function update() {
    const el = track.value
    if (!el) return
    canPrev.value = el.scrollLeft > 4
    canNext.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 4
  }

  function onDown(e: PointerEvent) {
    if (e.pointerType !== 'mouse' || !track.value) return
    down = true
    moved = 0
    startX = e.clientX
    startLeft = track.value.scrollLeft
    track.value.style.scrollSnapType = 'none'
  }

  function onMove(e: PointerEvent) {
    if (!down || !track.value) return
    const dx = e.clientX - startX
    moved = Math.max(moved, Math.abs(dx))
    track.value.scrollLeft = startLeft - dx
  }

  function onUp() {
    if (!down || !track.value) return
    down = false
    track.value.style.scrollSnapType = ''
  }

  function onClickCapture(e: MouseEvent) {
    if (moved > 6) {
      e.preventDefault()
      e.stopPropagation()
      moved = 0
    }
  }

  function step(dir: 1 | -1) {
    const el = track.value
    if (!el) return
    const card = el.firstElementChild as HTMLElement | null
    const amount = card ? card.offsetWidth * 2 : el.clientWidth * 0.8
    el.scrollBy({ left: amount * dir, behavior: 'smooth' })
  }

  onMounted(() => {
    const el = track.value
    if (!el) return
    el.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    el.addEventListener('click', onClickCapture, true)
    el.addEventListener('scroll', update, { passive: true })
    update()
  })

  onBeforeUnmount(() => {
    const el = track.value
    el?.removeEventListener('pointerdown', onDown)
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', onUp)
    el?.removeEventListener('click', onClickCapture, true)
    el?.removeEventListener('scroll', update)
  })

  return { canPrev, canNext, step, update }
}
