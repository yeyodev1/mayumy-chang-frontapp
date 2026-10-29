<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { site } from '@/config/site'
import { useCatalog } from '@/composables/useCatalog'
import { prefersReducedMotion, useReveal } from '@/composables/useReveal'
import StonePanel from './StonePanel.vue'

gsap.registerPlugin(ScrollTrigger)

const { byStone } = useCatalog()
const root = ref<HTMLElement | null>(null)
const intro = ref<HTMLElement | null>(null)
const active = ref(0)
useReveal(intro)

let mm: gsap.MatchMedia | null = null
let io: IntersectionObserver | null = null

// El acento de toda la página toma el color de la piedra en pantalla.
function setStone(i: number) {
  active.value = i
  const stone = site.stones[i]
  if (stone) document.documentElement.style.setProperty('--stone', stone.color)
}

onMounted(() => {
  const el = root.value
  if (!el) return

  // Cada video corre solo mientras su panel se ve.
  io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        const v = e.target as HTMLVideoElement
        if (e.isIntersecting) v.play().catch(() => {})
        else v.pause()
      }),
    { threshold: 0.25 },
  )
  el.querySelectorAll<HTMLVideoElement>('[data-stone-video]').forEach((v) => io?.observe(v))

  if (prefersReducedMotion()) return
  mm = gsap.matchMedia()
  // Desktop: los cinco paneles corren en horizontal mientras la sección está fija.
  mm.add('(min-width: 1024px)', () => {
    const track = el.querySelector<HTMLElement>('.stones__track')
    if (!track) return
    gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top top',
        end: () => `+=${track.scrollWidth - window.innerWidth}`,
        scrub: 0.8,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const i = Math.min(site.stones.length - 1, Math.round(self.progress * (site.stones.length - 1)))
          if (i !== active.value) setStone(i)
        },
        onLeaveBack: () => setStone(0),
      },
    })
  })
  // Móvil: cada panel cambia el acento al entrar.
  mm.add('(max-width: 1023px)', () => {
    el.querySelectorAll<HTMLElement>('.spanel').forEach((panel, i) => {
      ScrollTrigger.create({ trigger: panel, start: 'top 60%', end: 'bottom 40%', onToggle: (s) => s.isActive && setStone(i) })
    })
  })
})

onBeforeUnmount(() => {
  mm?.revert()
  io?.disconnect()
  document.documentElement.style.removeProperty('--stone')
})
</script>

<template>
  <section class="stones" aria-labelledby="stones-title">
    <header ref="intro" class="stones__intro">
      <p class="stones__eyebrow" data-reveal>[ {{ site.home.stones.eyebrow }} ]</p>
      <h2 id="stones-title" class="stones__title" data-split>{{ site.home.stones.title }}</h2>
      <ol class="stones__legend" data-reveal>
        <li v-for="(s, i) in site.stones" :key="s.id" :class="{ 'is-active': i === active }" :style="{ '--c': s.color }">
          <span class="stones__swatch" aria-hidden="true"></span>{{ s.name }}
        </li>
      </ol>
    </header>

    <div ref="root" class="stones__pin">
      <div class="stones__track">
        <StonePanel v-for="(s, i) in site.stones" :key="s.id" :stone="s" :index="i" :products="byStone(s.id)" />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.stones {
  // Un velo del color de la piedra activa tiñe el fondo, apenas.
  background: color-mix(in srgb, var(--stone) 7%, #{$quartz});
  transition: background-color 0.8s ease;
  border-top: 1px solid $line;

  &__intro {
    padding: $space-section 1.25rem $space-lg;

    @include from('md') {
      padding-inline: 2rem;
    }
  }

  &__eyebrow {
    @include eyebrow;
    margin-bottom: 0.8rem;
  }

  &__title {
    @include display($display-lg);
  }

  &__legend {
    list-style: none;
    @include flex(row, center, flex-start, 0.4rem 1.2rem);
    flex-wrap: wrap;
    margin-top: 1.4rem;

    li {
      @include flex(row, center, flex-start, 0.45rem);
      font-family: $font-mono;
      font-size: 0.72rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      opacity: 0.45;
      transition: opacity 0.4s ease;

      &.is-active {
        opacity: 1;
      }
    }
  }

  &__swatch {
    width: 0.7rem;
    height: 0.7rem;
    border-radius: 50%;
    background: var(--c);
  }

  &__pin {
    overflow: hidden;

    @include from('lg') {
      height: 100vh;
    }
  }

  &__track {
    @include flex(column, stretch);

    @include from('lg') {
      flex-direction: row;
      height: 100%;
      width: max-content;
      will-change: transform;
    }
  }
}
</style>
