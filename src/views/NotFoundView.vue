<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import gsap from 'gsap'
import BrandMark from '@/components/brand/BrandMark.vue'
import { site } from '@/config/site'

const copy = site.notFound
const root = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null

// El número sube desde una máscara, como una pieza que asoma del estuche.
onMounted(() => {
  if (!root.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  ctx = gsap.context(() => {
    gsap
      .timeline({ delay: 0.15 })
      .from('.nf__digit', { yPercent: 105, duration: 1.3, ease: 'expo.out', stagger: 0.09 })
      .from('.nf__mark', { opacity: 0, rotate: -40, scale: 0.8, duration: 1.4, ease: 'expo.out' }, 0.2)
      .from('.nf__in', { opacity: 0, y: 14, duration: 0.9, ease: 'expo.out', stagger: 0.07 }, 0.45)
  }, root.value)
})
onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <section ref="root" class="nf">
    <div class="nf__number" aria-hidden="true">
      <span class="nf__mask"><span class="nf__digit">4</span></span>
      <span class="nf__mask nf__mask--mark"><BrandMark class="nf__mark" size="100%" /></span>
      <span class="nf__mask"><span class="nf__digit">4</span></span>
    </div>
    <div class="nf__content">
      <p class="nf__eyebrow nf__in">[ {{ copy.eyebrow }} ]</p>
      <h1 class="nf__title nf__in">{{ copy.title }}</h1>
      <p class="nf__text nf__in">{{ copy.text }}</p>
      <div class="nf__actions nf__in">
        <RouterLink :to="{ name: 'Shop' }" class="btn btn--primary">{{ copy.shop }}</RouterLink>
        <RouterLink to="/" class="btn btn--ghost">{{ copy.home }}</RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.nf {
  @include container(1180px);
  @include flex(column, center, center, 1.6rem);
  flex: 1;
  min-height: 82vh;
  padding-top: calc(var(--header-h) + 3rem);
  padding-bottom: $space-xl;
  text-align: center;

  &__number {
    @include flex(row, center, center, clamp(0.4rem, 2vw, 1.6rem));
    @include caps($caps-lg);
  }

  &__mask {
    display: inline-flex;
    overflow: hidden;
    padding-top: 0.04em;

    &--mark {
      width: 0.42em;
      height: 0.42em;
      overflow: visible;
    }
  }

  &__digit {
    display: inline-block;
  }

  // El cero es el diamante de Luminous, como la O del logo.
  &__mark {
    color: var(--stone);
  }

  &__content {
    @include flex(column, center, flex-start, 0.8rem);
    max-width: 34rem;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-sm);
  }

  &__text {
    color: $ink-soft;
  }

  &__actions {
    @include flex(row, center, center, 0.8rem);
    flex-wrap: wrap;
    margin-top: 0.8rem;
  }
}
</style>
