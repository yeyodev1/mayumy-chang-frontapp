<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import gsap from 'gsap'
import BrandMark from '@/components/brand/BrandMark.vue'

/**
 * El momento de "gracias": el diamante se llena de luz de abajo hacia arriba,
 * como una piedra que recibe el sol. Debajo queda el contorno apagado
 * en plata para que el gesto se lea aunque la animación no corra.
 */
withDefaults(defineProps<{ size?: string }>(), { size: '112px' })
const root = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null

onMounted(() => {
  if (!root.value) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ctx = gsap.context(() => {
    if (reduce) {
      gsap.set('.thanks__halo', { opacity: 1 })
      return
    }
    gsap
      .timeline({ delay: 0.25 })
      .from('.thanks__mark', { scale: 0.9, rotate: -8, duration: 1.6, ease: 'expo.out', transformOrigin: '50% 50%' }, 0)
      .fromTo(
        '.thanks__lit',
        { clipPath: 'inset(100% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power3.inOut' },
        0.15,
      )
      .fromTo('.thanks__halo', { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 1.4, ease: 'expo.out' }, 0.9)
  }, root.value)
})

onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <div ref="root" class="thanks" :style="{ width: size, height: size }" aria-hidden="true">
    <span class="thanks__halo"></span>
    <div class="thanks__mark">
      <BrandMark class="thanks__base" :size="size" />
      <BrandMark class="thanks__lit" :size="size" />
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
