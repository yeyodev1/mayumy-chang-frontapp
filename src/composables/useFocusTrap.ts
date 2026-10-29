import { nextTick, onBeforeUnmount, watch, type Ref } from 'vue'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Mantiene el Tab dentro de `container` mientras `active` sea true, cierra con
 * Escape y, al cerrar, devuelve el foco al elemento que lo tenía antes de abrir.
 */
export function useFocusTrap(
  container: Ref<HTMLElement | null>,
  active: Ref<boolean>,
  onEscape: () => void,
) {
  let previous: HTMLElement | null = null

  function onKey(e: KeyboardEvent) {
    if (!active.value || !container.value) return
    if (e.key === 'Escape') {
      e.preventDefault()
      onEscape()
      return
    }
    if (e.key !== 'Tab') return
    const items = Array.from(container.value.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null,
    )
    if (!items.length) return
    const first = items[0]!
    const last = items[items.length - 1]!
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  watch(active, async (open) => {
    if (open) {
      previous = document.activeElement as HTMLElement | null
      document.addEventListener('keydown', onKey)
      await nextTick()
      const target =
        container.value?.querySelector<HTMLElement>('[data-autofocus]') ??
        container.value?.querySelector<HTMLElement>(FOCUSABLE)
      target?.focus({ preventScroll: true })
    } else {
      document.removeEventListener('keydown', onKey)
      previous?.focus({ preventScroll: true })
      previous = null
    }
  })

  onBeforeUnmount(() => document.removeEventListener('keydown', onKey))
}
