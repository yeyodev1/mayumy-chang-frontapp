<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { site } from '@/config/site'
import { prefersReducedMotion } from '@/composables/useReveal'
import BrandLogo from '@/components/brand/BrandLogo.vue'

const root = ref<HTMLElement | null>(null)
const panels = [
  { video: 'zafiro', color: '#1d2a8c' },
  { video: 'citrino', color: '#d99f0a' },
  { video: 'esmeralda', color: '#0a7350' },
]

let ctx: gsap.Context | null = null

onMounted(() => {
  const el = root.value
  if (!el) return
  // Los videos arrancan solos solo si el navegador lo permite (ahorro de datos, etc.).
  el.querySelectorAll('video').forEach((v) => v.play().catch(() => {}))
  if (prefersReducedMotion()) return

  ctx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
    tl.from('.hero__logo', { yPercent: 105, duration: 1.5 })
      .from('.hero__panel', { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut', stagger: 0.12 }, 0.15)
      .from('.hero__panel video', { scale: 1.25, duration: 2.2, stagger: 0.12 }, 0.15)
      .from('[data-hero-fade]', { y: 24, opacity: 0, duration: 1, stagger: 0.08 }, 0.9)

    // Al bajar, el nombre se queda atrás y el panel central se adelanta: profundidad sin efectos.
    gsap.to('.hero__word', {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
    })
    gsap.utils.toArray<HTMLElement>('.hero__panel').forEach((panel, i) => {
      gsap.to(panel, {
        yPercent: i === 1 ? -14 : -6,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      })
    })
  }, el)
})

onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <section ref="root" class="hero" aria-labelledby="hero-title">
    <h1 id="hero-title" class="hero__word">
      <BrandLogo class="hero__logo" variant="wordmark" :label="site.name" />
    </h1>

    <div class="hero__stage">
      <div class="hero__panels">
        <figure v-for="(p, i) in panels" :key="p.video" class="hero__panel" :style="{ '--c': p.color }">
          <video
            :src="`/video/${p.video}.mp4`"
            :poster="`/video/${p.video}.webp`"
            muted
            loop
            playsinline
            autoplay
            preload="metadata"
            aria-hidden="true"
          ></video>
          <figcaption class="hero__caption">[ {{ site.home.hero.captions[i] }} ]</figcaption>
        </figure>
      </div>

      <div class="hero__foot">
        <p class="hero__eyebrow" data-hero-fade>[ {{ site.home.hero.eyebrow }} ]</p>
        <p class="hero__lede" data-hero-fade>{{ site.home.hero.lede }}</p>
        <div class="hero__ctas" data-hero-fade>
          <RouterLink to="/tienda" class="btn btn--primary">
            {{ site.home.hero.primary }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </RouterLink>
          <RouterLink to="/a-medida" class="btn btn--ghost">{{ site.home.hero.secondary }}</RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero {
  position: relative;
  padding: calc(var(--header-h) + 2.6rem) 1.25rem $space-lg;
  overflow: hidden;

  @include from('md') {
    padding-inline: 2rem;
  }

  // El nombre es el logo real a todo lo ancho; el h1 recorta para que entre desde abajo.
  &__word {
    overflow: hidden;
    color: $basalt;
    margin-bottom: 1.2rem;

    // En pantallas anchas los paneles se montan sobre el nombre, como en una revista.
    @include from('md') {
      margin-bottom: clamp(-6rem, -5vw, -1.5rem);
    }
    position: relative;
    z-index: 0;
  }

  &__logo {
    width: 100%;
  }

  // Móvil: carrusel con snap. Desktop: tres columnas, la del medio más baja.
  &__panels {
    position: relative;
    z-index: 1;
    @include flex(row, flex-start, flex-start, 0.6rem);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    margin-inline: -1.25rem;
    padding-inline: 1.25rem;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    @include from('md') {
      overflow: visible;
      margin-inline: 0;
      padding-inline: 0;
      gap: clamp(0.75rem, 1.5vw, 1.5rem);
    }
  }

  &__panel {
    position: relative;
    flex: 0 0 78%;
    scroll-snap-align: center;
    aspect-ratio: 3 / 4;
    overflow: hidden;
    background: $quartz-deep;
    border-radius: $radius-sm;
    will-change: transform;

    @include from('md') {
      flex: 1 1 0;
      aspect-ratio: 4 / 5;

      &:nth-child(2) {
        margin-top: clamp(2rem, 7vw, 7rem);
      }
    }

    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__caption {
    position: absolute;
    left: 0.8rem;
    bottom: 0.8rem;
    font-family: $font-mono;
    font-size: 0.64rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 0.35rem 0.55rem;
    background: rgba($frost, 0.85);
    backdrop-filter: blur(6px);
    color: $ink;
    border-left: 2px solid var(--c);
  }

  &__stage {
    @include flex(column, stretch, flex-start, $space-lg);

    @include from('lg') {
      flex-direction: row-reverse;
      align-items: flex-end;
      gap: clamp(1.5rem, 3vw, 3rem);
    }
  }

  &__panels {
    @include from('lg') {
      flex: 1 1 auto;
    }
  }

  &__foot {
    position: relative;
    z-index: 2;
    @include flex(column, flex-start, flex-start, 1.1rem);

    @include from('lg') {
      flex: 0 0 clamp(17rem, 24vw, 22rem);
      padding-bottom: 0.4rem;
    }
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__lede {
    font-family: $font-serif;
    font-size: clamp(1.35rem, 1.1rem + 0.9vw, 1.75rem);
    line-height: 1.2;
    text-wrap: balance;
  }

  &__ctas {
    @include flex(row, center, flex-start, 0.6rem);
    flex-wrap: wrap;
  }
}
</style>
