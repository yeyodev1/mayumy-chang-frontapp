import { onBeforeUnmount, ref, watch, type Ref } from 'vue'
import { gsap } from 'gsap'
import { prefersReducedMotion } from './useReveal'

/** Número que sube desde 0 hasta el valor con una curva que frena al final. */
export function useCountUp(target: Ref<number | null>, duration = 1.6) {
  const display = ref(0)
  let tween: gsap.core.Tween | null = null

  watch(
    target,
    (value) => {
      tween?.kill()
      if (value === null) return
      if (prefersReducedMotion()) {
        display.value = value
        return
      }
      const counter = { n: 0 }
      tween = gsap.to(counter, {
        n: value,
        duration,
        ease: 'expo.out',
        onUpdate: () => {
          display.value = Math.round(counter.n)
        },
      })
    },
    { immediate: true },
  )

  onBeforeUnmount(() => tween?.kill())
  return display
}
