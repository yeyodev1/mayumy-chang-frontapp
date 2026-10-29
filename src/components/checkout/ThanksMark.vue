<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import gsap from 'gsap'
import HeptagonMark from '@/components/brand/HeptagonMark.vue'

/**
 * El momento de "gracias": el heptágono se enciende baguette por baguette,
 * como una pieza que se termina de engastar. Debajo queda el contorno apagado
 * en plata para que el gesto se lea aunque la animación no corra.
 */
withDefaults(defineProps<{ size?: string }>(), { size: '112px' })
const root = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null

onMounted(() => {
  if (!root.value) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ctx = gsap.context(() => {
    const stones = '.thanks__lit .hepta__stone'
    const prongs = '.thanks__lit .hepta__prong'
    if (reduce) {
      gsap.set([stones, prongs, '.thanks__halo'], { opacity: 1 })
      return
    }
    gsap
      .timeline({ delay: 0.25 })
      .from('.thanks__mark', { scale: 0.9, rotate: -8, duration: 1.6, ease: 'expo.out', transformOrigin: '50% 50%' }, 0)
      .fromTo(
        stones,
        { opacity: 0, scale: 0.6, transformOrigin: '50% 50%' },
        { opacity: 1, scale: 1, duration: 0.7, ease: 'expo.out', stagger: 0.11 },
        0.1,
      )
      .fromTo(prongs, { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.11 }, 0.25)
      .fromTo('.thanks__halo', { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 1.4, ease: 'expo.out' }, 0.9)
  }, root.value)
})

onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <div ref="root" class="thanks" :style="{ width: size, height: size }" aria-hidden="true">
    <span class="thanks__halo"></span>
    <div class="thanks__mark">
      <HeptagonMark class="thanks__base" :size="size" :stroke="1.2" />
      <HeptagonMark class="thanks__lit" :size="size" :stroke="1.6" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.thanks {
  position: relative;
  flex-shrink: 0;

  &__mark {
    position: relative;
    width: 100%;
    height: 100%;
  }

  &__base,
  &__lit {
    position: absolute;
    inset: 0;
  }

  &__base {
    color: $silver;
    opacity: 0.45;
  }

  &__lit {
    color: var(--stone);
  }

  // Un brillo frío detrás, apenas perceptible: luz sobre la piedra.
  &__halo {
    position: absolute;
    inset: -30%;
    border-radius: 50%;
    background: radial-gradient(circle, color-mix(in srgb, var(--stone) 16%, transparent) 0%, transparent 62%);
    opacity: 0;
  }
}
</style>
