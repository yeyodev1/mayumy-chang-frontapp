<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { site } from '@/config/site'
import { useStoreConfig } from '@/composables/useStoreConfig'
import { prefersReducedMotion, useReveal } from '@/composables/useReveal'
import CollabForm from './CollabForm.vue'

const { config } = useStoreConfig()
const collab = computed(() => config.value.collab)
const root = ref<HTMLElement | null>(null)
const panel = ref<HTMLElement | null>(null)
const video = ref<HTMLVideoElement | null>(null)
useReveal(panel)

let ctx: gsap.Context | null = null
let io: IntersectionObserver | null = null

onMounted(() => {
  const el = root.value
  if (!el) return
  // El video solo corre mientras se ve: ahorra batería y datos en el celular.
  io = new IntersectionObserver(([entry]) => {
    if (entry?.isIntersecting) video.value?.play().catch(() => {})
    else video.value?.pause()
  })
  if (video.value) io.observe(video.value)
  if (prefersReducedMotion()) return

  ctx = gsap.context(() => {
    // La sección queda fija (sticky) y el scroll abre la ventana al archipiélago.
    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
    })
    tl.fromTo('.gala__media', { clipPath: 'inset(24% 34% 24% 34%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' }, 0)
      .fromTo('.gala__media video', { scale: 1.35 }, { scale: 1, ease: 'none' }, 0)
      .fromTo('.gala__title', { scale: 0.42, opacity: 0.2 }, { scale: 1, opacity: 1, ease: 'none' }, 0)
      .fromTo('.gala__eyebrow', { y: 30, opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.55)
  }, el)
})

onBeforeUnmount(() => {
  ctx?.revert()
  io?.disconnect()
})
</script>

<template>
  <section v-if="collab.enabled" class="gala" aria-labelledby="gala-title">
    <div ref="root" class="gala__scroll">
      <div class="gala__sticky">
        <div class="gala__media">
          <video
            ref="video"
            src="/video/galapagos.mp4"
            poster="/video/galapagos.webp"
            muted
            loop
            playsinline
            preload="metadata"
            aria-hidden="true"
          ></video>
        </div>
        <p class="gala__eyebrow">[ {{ collab.eyebrow }} ]</p>
        <h2 id="gala-title" class="gala__title">{{ collab.title }}</h2>
        <p class="gala__release">{{ collab.release }}</p>
      </div>
    </div>

    <div ref="panel" class="gala__panel">
      <p class="gala__subtitle" data-split>{{ collab.subtitle }}</p>
      <div class="gala__form" data-reveal>
        <p class="gala__form-title">{{ site.home.collab.formTitle }}</p>
        <p class="gala__form-text">{{ site.home.collab.formText }}</p>
        <CollabForm />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.gala {
  background: $basalt;
  color: $quartz;

  &__scroll {
    height: 230vh;
  }

  &__sticky {
    position: sticky;
    top: 0;
    height: 100vh;
    height: 100svh;
    overflow: hidden;
    @include flex(column, center, center);
  }

  &__media {
    position: absolute;
    inset: 0;
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba($basalt, 0.35), rgba($basalt, 0.15) 40%, rgba($basalt, 0.7));
    }

    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__eyebrow {
    position: relative;
    @include eyebrow;
    color: $quartz;
    margin-bottom: 1rem;
  }

  &__title {
    position: relative;
    @include caps(clamp(7rem, 34vw, 36rem));
    font-family: $font-display;
    font-weight: 400;
    line-height: 0.78;
    white-space: nowrap;
    will-change: transform;
  }

  &__release {
    position: relative;
    font-family: $font-mono;
    font-size: 0.78rem;
    letter-spacing: 0.3em;
    margin-top: 1rem;
  }

  &__panel {
    @include flex(column, stretch, flex-start, $space-xl);
    padding: $space-section 1.25rem;

    @include from('md') {
      padding-inline: 2rem;
    }

    @include from('lg') {
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;
    }
  }

  &__subtitle {
    font-family: $font-serif;
    font-size: clamp(2rem, 1.3rem + 3vw, 4.4rem);
    line-height: 1.02;
    letter-spacing: -0.015em;
    max-width: 16ch;
  }

  &__form {
    @include flex(column, flex-start, flex-start, 0.8rem);
    max-width: 34rem;
    width: 100%;
  }

  &__form-title {
    @include eyebrow;
    color: $quartz;
  }

  &__form-text {
    color: rgba($quartz, 0.7);
    margin-bottom: 0.6rem;
  }
}
</style>
