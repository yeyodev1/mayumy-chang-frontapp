<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { site } from '@/config/site'
import { useCatalog } from '@/composables/useCatalog'
import { useHorizontalScroll } from '@/composables/useHorizontalScroll'
import { useReveal } from '@/composables/useReveal'
import StonePanel from './StonePanel.vue'

const { byStone } = useCatalog()
const root = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)
const intro = ref<HTMLElement | null>(null)
const active = ref(0)
useReveal(intro)

// El acento de toda la página toma el color de la piedra en pantalla.
function setStone(i: number) {
  active.value = i
  const stone = site.stones[i]
  if (stone) document.documentElement.style.setProperty('--stone', stone.color)
}

// En celular y computador: al bajar, las cinco piedras pasan en horizontal.
const { progress } = useHorizontalScroll(root, track, (p) => {
  const i = Math.min(site.stones.length - 1, Math.round(p * (site.stones.length - 1)))
  if (i !== active.value) setStone(i)
})

let io: IntersectionObserver | null = null
onMounted(() => {
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
  root.value?.querySelectorAll<HTMLVideoElement>('[data-stone-video]').forEach((v) => io?.observe(v))
})

onBeforeUnmount(() => {
  io?.disconnect()
  document.documentElement.style.removeProperty('--stone')
})
</script>

<template>
  <section class="stones" aria-labelledby="stones-title">
    <header ref="intro" class="stones__intro">
      <p class="stones__eyebrow" data-reveal>[ {{ site.home.stones.eyebrow }} ]</p>
      <h2 id="stones-title" class="stones__title" data-split>{{ site.home.stones.title }}</h2>
    </header>

    <div ref="root" class="stones__pin">
      <ol class="stones__legend">
        <li v-for="(s, i) in site.stones" :key="s.id" :class="{ 'is-active': i === active }" :style="{ '--c': s.color }">
          <span class="stones__swatch" aria-hidden="true"></span>{{ s.name }}
        </li>
      </ol>
      <div ref="track" class="stones__track">
        <StonePanel v-for="(s, i) in site.stones" :key="s.id" :stone="s" :index="i" :products="byStone(s.id)" />
      </div>
      <div class="stones__progress" aria-hidden="true">
        <span :style="{ transform: `scaleX(${progress})` }"></span>
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
    padding: $space-section 1.25rem $space-md;

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

  &__pin {
    position: relative;
    overflow: hidden;

    &.is-horizontal {
      height: 100vh;
      height: 100svh;
    }
  }

  &__legend {
    position: absolute;
    z-index: 2;
    left: 1.25rem;
    right: 1.25rem;
    top: calc(var(--header-h) + 0.6rem);
    list-style: none;
    @include flex(row, center, flex-start, 0.4rem 1rem);
    flex-wrap: wrap;

    @include from('md') {
      left: 2rem;
    }

    li {
      @include flex(row, center, flex-start, 0.4rem);
      font-family: $font-mono;
      font-size: 0.66rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      opacity: 0.4;
      transition: opacity 0.4s ease;

      &.is-active {
        opacity: 1;
      }
    }
  }

  &__swatch {
    width: 0.65rem;
    height: 0.65rem;
    border-radius: 50%;
    background: var(--c);
  }

  // Sin animación (reduced-motion): fila horizontal que se desliza con el dedo.
  &__track {
    @include flex(row, stretch);
    height: 100%;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__pin.is-horizontal &__track {
    overflow: visible;
    scroll-snap-type: none;
    will-change: transform;
  }

  &__progress {
    position: absolute;
    left: 1.25rem;
    right: 1.25rem;
    bottom: 1rem;
    height: 1px;
    background: rgba($basalt, 0.15);
    overflow: hidden;

    @include from('md') {
      left: 2rem;
      right: 2rem;
    }

    span {
      display: block;
      height: 100%;
      background: var(--stone);
      transform-origin: left;
      transform: scaleX(0);
    }
  }
}
</style>
