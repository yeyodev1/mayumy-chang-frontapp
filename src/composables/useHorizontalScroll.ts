import { nextTick, onBeforeUnmount, onMounted, ref, type Ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { refreshScroll } from './useSmoothScroll'

gsap.registerPlugin(ScrollTrigger)
// En el celular la barra del navegador cambia el alto al hacer scroll: sin esto
// cada cambio recalcularía los pines y la página daría saltos.
ScrollTrigger.config({ ignoreMobileResize: true })

/**
 * Sección fija que, al bajar, corre su contenido en horizontal. El recorrido
 * vertical es igual al ancho que sobra del track, así el ritmo se siente natural.
 * Con reduced-motion no se fija nada: el track queda como fila que se desliza
 * con el dedo (la clase `is-horizontal` solo existe cuando hay animación).
 */
export function useHorizontalScroll(
  section: Ref<HTMLElement | null>,
  track: Ref<HTMLElement | null>,
  onProgress?: (progress: number) => void,
) {
  const active = ref(false)
  const progress = ref(0)
  let mm: gsap.MatchMedia | null = null

  function setup() {
    const el = section.value
    const row = track.value
    if (!el || !row) return
    mm?.revert()
    mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      el.classList.add('is-horizontal')
      active.value = true
      const distance = () => Math.max(0, row.scrollWidth - row.clientWidth)
      const tween = gsap.to(row, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: () => `+=${distance()}`,
          scrub: 0.7,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            progress.value = self.progress
            onProgress?.(self.progress)
          },
        },
      })
      return () => {
        tween.scrollTrigger?.kill()
        tween.kill()
        gsap.set(row, { clearProps: 'transform' })
        el.classList.remove('is-horizontal')
        active.value = false
      }
    })
  }

  onMounted(() => nextTick(setup))
  onBeforeUnmount(() => mm?.revert())

  // Cuando llegan los productos cambia el ancho del track: se recalcula todo.
  return { active, progress, refresh: () => nextTick(() => { setup(); refreshScroll() }) }
}
