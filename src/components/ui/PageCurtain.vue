<script setup lang="ts">
import { ref } from 'vue'
import { gsap } from 'gsap'
import BrandMark from '@/components/brand/BrandMark.vue'
import { site } from '@/config/site'

/**
 * Cortina entre páginas: sube un velo de basalto, el diamante de Luminous se
 * llena de luz de abajo hacia arriba y el velo se retira. Dura menos de un
 * segundo: es un gesto de marca, no una pantalla de carga.
 */
const root = ref<HTMLElement | null>(null)
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function cover(): Promise<void> {
  const el = root.value
  if (!el || reduced()) return Promise.resolve()
  const lit = el.querySelector('.curtain__lit')
  return new Promise((resolve) => {
    gsap
      .timeline({ onComplete: resolve })
      .set(el, { visibility: 'visible', yPercent: 100 })
      .set(lit, { clipPath: 'inset(100% 0% 0% 0%)' })
      .set(el.querySelector('.curtain__name'), { opacity: 0, y: 12 })
      .to(el, { yPercent: 0, duration: 0.55, ease: 'expo.inOut' })
      .to(lit, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.4, ease: 'power2.out' }, '-=0.2')
      .to(el.querySelector('.curtain__name'), { opacity: 1, y: 0, duration: 0.3 }, '<')
  })
}

function reveal(): Promise<void> {
  const el = root.value
  if (!el || reduced()) return Promise.resolve()
  return new Promise((resolve) => {
    gsap
      .timeline({ onComplete: resolve })
      .to(el, { yPercent: -100, duration: 0.7, ease: 'expo.inOut', delay: 0.05 })
      .set(el, { visibility: 'hidden' })
  })
}

defineExpose({ cover, reveal })
</script>

<template>
  <div ref="root" class="curtain" aria-hidden="true">
    <div class="curtain__mark">
      <BrandMark class="curtain__dim" size="64px" />
      <BrandMark class="curtain__lit" size="64px" />
    </div>
    <p class="curtain__name">{{ site.name }}</p>
  </div>
</template>

<style scoped lang="scss">
.curtain {
  position: fixed;
  inset: 0;
  z-index: 200;
  visibility: hidden;
  background: $basalt;
  color: $quartz;
  @include flex(column, center, center, 1.2rem);

  &__mark {
    position: relative;
  }

  &__dim {
    color: rgba($quartz, 0.16);
  }

  &__lit {
    position: absolute;
    inset: 0;
    color: $gold;
  }

  &__name {
    font-family: $font-mono;
    font-size: $text-xs;
    letter-spacing: 0.32em;
    text-transform: uppercase;
  }
}
</style>
