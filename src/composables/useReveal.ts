import { onBeforeUnmount, onMounted, nextTick, type Ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Parte un texto en palabras envueltas en una máscara para revelarlas línea a
 * línea. Se guarda el texto original en aria-label: el lector de pantalla lee la
 * frase entera, no palabra por palabra.
 */
export function splitWords(el: HTMLElement) {
  if (el.dataset.splitDone) return el.querySelectorAll<HTMLElement>('.sw__in')
  const text = el.textContent ?? ''
  el.setAttribute('aria-label', text.trim())
  el.innerHTML = text
    .trim()
    .split(/\s+/)
    .map((w) => `<span class="sw" aria-hidden="true"><span class="sw__in">${w}</span></span>`)
    .join(' ')
  el.dataset.splitDone = '1'
  return el.querySelectorAll<HTMLElement>('.sw__in')
}

/**
 * Animaciones de scroll declarativas dentro de `root`:
 * - data-reveal: sube y aparece.
 * - data-reveal-mask: la imagen se descubre de abajo hacia arriba (clip-path).
 * - data-split: el texto entra palabra por palabra desde una máscara.
 * - data-parallax="0.15": se desplaza más lento que el scroll.
 * Todo se limpia al desmontar (ctx.revert) y no corre con reduced-motion.
 */
export function useReveal(root: Ref<HTMLElement | null>, extra?: (ctx: gsap.Context) => void) {
  let ctx: gsap.Context | null = null

  function setup() {
    const el = root.value
    if (!el || prefersReducedMotion()) return
    ctx?.revert()
    ctx = gsap.context(() => {
      el.querySelectorAll<HTMLElement>('[data-split]').forEach((node) => {
        const words = splitWords(node)
        gsap.from(words, {
          yPercent: 110,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.045,
          scrollTrigger: { trigger: node, start: 'top 88%' },
        })
      })

      // Primero el estado inicial: si el elemento ya está en pantalla, el batch lo anima enseguida.
      gsap.set(el.querySelectorAll('[data-reveal]'), { opacity: 0 })
      ScrollTrigger.batch(el.querySelectorAll('[data-reveal]'), {
        start: 'top 90%',
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'expo.out', stagger: 0.08, overwrite: true },
          ),
      })
      el.querySelectorAll<HTMLElement>('[data-reveal-mask]').forEach((node) => {
        gsap.fromTo(
          node,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.4,
            ease: 'expo.inOut',
            scrollTrigger: { trigger: node, start: 'top 85%' },
          },
        )
      })

      el.querySelectorAll<HTMLElement>('[data-parallax]').forEach((node) => {
        const speed = Number(node.dataset.parallax) || 0.12
        gsap.fromTo(
          node,
          { yPercent: -speed * 100 },
          {
            yPercent: speed * 100,
            ease: 'none',
            scrollTrigger: { trigger: node.parentElement ?? node, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })

      extra?.(ctx as gsap.Context)
    }, el)
  }

  onMounted(() => nextTick(setup))
  onBeforeUnmount(() => ctx?.revert())

  // Para contenido que llega del API después de montar.
  return { refresh: () => nextTick(() => { setup(); ScrollTrigger.refresh() }) }
}
