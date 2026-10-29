import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Un solo Lenis para toda la tienda, sincronizado con el ticker de GSAP para que
 * ScrollTrigger y el scroll suave nunca se desfasen. Con reduced-motion no se crea:
 * el scroll nativo es lo correcto ahí.
 */
let lenis: Lenis | null = null

export function startSmoothScroll() {
  if (lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis?.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
}

export function scrollToTop(immediate = true) {
  if (lenis) lenis.scrollTo(0, { immediate, force: true })
  else window.scrollTo({ top: 0 })
}

export function scrollToEl(target: string | HTMLElement, offset = -80) {
  if (lenis) lenis.scrollTo(target, { offset, duration: 1.4 })
  else {
    const el = typeof target === 'string' ? document.querySelector(target) : target
    el?.scrollIntoView({ behavior: 'smooth' })
  }
}

/** Los modales y la bolsa congelan el fondo mientras están abiertos. */
export function lockScroll(locked: boolean) {
  if (!lenis) return
  if (locked) lenis.stop()
  else lenis.start()
}

export function refreshScroll() {
  // Los pines se crean en desorden (algunos esperan al catálogo): se recalculan
  // en el orden en que aparecen en la página para que no se desfasen.
  ScrollTrigger.sort()
  ScrollTrigger.refresh()
}
