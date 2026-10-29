<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { site } from '@/config/site'
import { useCatalog } from '@/composables/useCatalog'
import { prefersReducedMotion } from '@/composables/useReveal'
import { refreshScroll } from '@/composables/useSmoothScroll'
import { cldUrl } from '@/utils/cloudinary'

gsap.registerPlugin(ScrollTrigger)

const { items } = useCatalog()
const root = ref<HTMLElement | null>(null)

// Una foto por pieza, de preferencia la puesta (la segunda): el lookbook es piel y luz.
const shots = computed(() =>
  items.value
    .map((p) => ({ slug: p.slug, name: p.name, url: cldUrl((p.images[1] ?? p.images[0])?.url, { w: 640 }) }))
    .filter((s) => s.url)
    .slice(0, 12),
)
const phrase = site.home.lookbook.phrase
const sub = site.home.lookbook.sub

let ctx: gsap.Context | null = null
function setup() {
  const el = root.value
  if (!el || prefersReducedMotion()) return
  ctx?.revert()
  ctx = gsap.context(() => {
    const scrub = { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 }
    // Tres capas a distinta velocidad y sentido: el ojo lee profundidad.
    gsap.fromTo('.look__phrase', { xPercent: 0 }, { xPercent: -38, ease: 'none', scrollTrigger: scrub })
    gsap.fromTo('.look__shots', { xPercent: -30 }, { xPercent: 0, ease: 'none', scrollTrigger: scrub })
    gsap.fromTo('.look__sub', { xPercent: -10 }, { xPercent: -45, ease: 'none', scrollTrigger: scrub })
  }, el)
}

onMounted(() => nextTick(setup))
watch(shots, () => nextTick(() => { setup(); refreshScroll() }))
onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <section ref="root" class="look" aria-label="Lookbook">
    <p class="look__phrase" aria-hidden="true">
      <span v-for="n in 3" :key="n">{{ phrase }}&nbsp;</span>
    </p>

    <div class="look__shots">
      <RouterLink
        v-for="(s, i) in [...shots, ...shots]"
        :key="`${s.slug}-${i}`"
        :to="{ name: 'Product', params: { slug: s.slug } }"
        class="look__shot"
        :class="`look__shot--${i % 3}`"
        :tabindex="i >= shots.length ? -1 : 0"
        :aria-hidden="i >= shots.length"
      >
        <img :src="s.url" :alt="s.name" loading="lazy" decoding="async" />
      </RouterLink>
      <template v-if="!shots.length">
        <span v-for="n in 8" :key="n" class="look__shot skeleton" :class="`look__shot--${n % 3}`"></span>
      </template>
    </div>

    <p class="look__sub" aria-hidden="true">
      <span v-for="n in 4" :key="n">{{ sub }}&nbsp;</span>
    </p>
  </section>
</template>

<style scoped lang="scss">
.look {
  overflow: hidden;
  padding-block: $space-xl;
  border-top: 1px solid $line;

  &__phrase,
  &__sub {
    white-space: nowrap;
    will-change: transform;
  }

  &__phrase {
    @include caps(clamp(6rem, 3rem + 14vw, 17rem));
    color: $basalt;
    line-height: 0.8;
  }

  &__sub {
    font-family: $font-serif;
    font-style: italic;
    font-size: clamp(1.6rem, 1.2rem + 2vw, 3.2rem);
    color: var(--stone);
    margin-top: $space-md;
    transition: color 0.8s ease;
  }

  &__shots {
    @include flex(row, flex-start, flex-start, clamp(0.6rem, 1.2vw, 1.2rem));
    width: max-content;
    margin-top: clamp(-3rem, -3vw, -1rem);
    position: relative;
    will-change: transform;
  }

  // Tres tamaños y alturas alternadas: un muro de revista, no una grilla.
  &__shot {
    display: block;
    overflow: hidden;
    background: $quartz-deep;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 1.2s $ease;
    }

    &:hover img {
      transform: scale(1.06);
    }

    &--0 {
      width: clamp(9rem, 18vw, 17rem);
      aspect-ratio: 3 / 4;
    }

    &--1 {
      width: clamp(7rem, 13vw, 12rem);
      aspect-ratio: 4 / 5;
      margin-top: clamp(2rem, 5vw, 5rem);
    }

    &--2 {
      width: clamp(10rem, 22vw, 21rem);
      aspect-ratio: 4 / 5;
      margin-top: clamp(0.5rem, 1.5vw, 1.5rem);
    }
  }
}
</style>
