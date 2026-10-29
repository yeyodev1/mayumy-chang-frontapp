<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { site } from '@/config/site'
import { useCatalog } from '@/composables/useCatalog'
import { useCategoriesStore } from '@/stores/categories'
import { useReveal } from '@/composables/useReveal'
import { cldUrl } from '@/utils/cloudinary'

const categories = useCategoriesStore()
const { coverFor } = useCatalog()
const root = ref<HTMLElement | null>(null)
const preview = ref<HTMLElement | null>(null)
const hovered = ref('')
useReveal(root)

const rows = computed(() =>
  categories.items.map((c) => {
    const total = Object.values(c.counts ?? {}).reduce((a, b) => a + (b ?? 0), 0)
    const bySegment = site.segments
      .map((s) => ({ label: s.short, n: c.counts?.[s.id] ?? 0 }))
      .filter((s) => s.n > 0)
    return { ...c, total, bySegment, cover: cldUrl(coverFor(c.slug), { w: 480 }) }
  }),
)
const hoveredCover = computed(() => rows.value.find((r) => r.slug === hovered.value)?.cover ?? '')

// La foto flota detrás del cursor con un poco de inercia (solo con mouse).
let xTo: ((v: number) => void) | null = null
let yTo: ((v: number) => void) | null = null
function onMove(e: PointerEvent) {
  if (e.pointerType !== 'mouse' || !xTo || !yTo || !root.value) return
  const box = root.value.getBoundingClientRect()
  xTo(e.clientX - box.left)
  yTo(e.clientY - box.top)
}

onMounted(() => {
  if (!preview.value) return
  xTo = gsap.quickTo(preview.value, 'x', { duration: 0.6, ease: 'power3' })
  yTo = gsap.quickTo(preview.value, 'y', { duration: 0.6, ease: 'power3' })
})
onBeforeUnmount(() => gsap.killTweensOf(preview.value))
</script>

<template>
  <section ref="root" class="cats" aria-labelledby="cats-title" @pointermove="onMove" @pointerleave="hovered = ''">
    <header class="cats__head">
      <p class="cats__eyebrow" data-reveal>[ {{ site.home.categories.eyebrow }} ]</p>
      <h2 id="cats-title" class="cats__title" data-split>{{ site.home.categories.title }}</h2>
    </header>

    <ul class="cats__list">
      <template v-if="!categories.loaded">
        <li v-for="n in 4" :key="n" class="cats__skel"><span class="skeleton"></span></li>
      </template>
      <li v-for="row in rows" v-else :key="row.slug" data-reveal>
        <RouterLink
          :to="`/tienda?categoria=${row.slug}`"
          class="cats__row"
          :class="{ 'cats__row--empty': !row.total }"
          @pointerenter="hovered = row.cover ? row.slug : ''"
          @focus="hovered = ''"
        >
          <span class="cats__name">{{ row.name }}</span>
          <span class="cats__blurb">{{ row.blurb }}</span>
          <span class="cats__counts">
            <template v-if="row.total">
              <span v-for="s in row.bySegment" :key="s.label">{{ s.label }} {{ s.n }}</span>
            </template>
            <span v-else>{{ site.home.categories.empty }}</span>
          </span>
        </RouterLink>
      </li>
    </ul>

    <div ref="preview" class="cats__preview" :class="{ 'is-on': hoveredCover }" aria-hidden="true">
      <img v-if="hoveredCover" :key="hoveredCover" :src="hoveredCover" alt="" />
    </div>
  </section>
</template>

<style scoped lang="scss">
.cats {
  position: relative;
  padding: $space-section 1.25rem;

  @include from('md') {
    padding-inline: 2rem;
  }

  &__head {
    margin-bottom: $space-lg;
  }

  &__eyebrow {
    @include eyebrow;
    margin-bottom: 0.8rem;
  }

  &__title {
    @include display($display-lg);
    max-width: 14ch;
  }

  &__list {
    list-style: none;
    border-top: 1px solid $ink;
  }

  &__row {
    position: relative;
    z-index: 2;
    @include flex(row, baseline, space-between, 0.4rem 1.5rem);
    flex-wrap: wrap;
    padding-block: 1.3rem;
    border-bottom: 1px solid $line;
    transition: padding 0.5s $ease, color 0.4s ease;

    @include from('md') {
      flex-wrap: nowrap;
    }

    &:hover {
      padding-left: 1rem;
    }

    &--empty {
      color: $ink-muted;
    }
  }

  &__name {
    font-family: $font-serif;
    font-size: clamp(2rem, 1.4rem + 2.6vw, 3.8rem);
    line-height: 1;
    flex: 0 0 auto;

    @include from('md') {
      flex-basis: 40%;
    }
  }

  &__blurb {
    display: none;
    flex: 1;
    color: $ink-soft;

    @include from('md') {
      display: block;
    }
  }

  &__counts {
    @include flex(row, center, flex-end, 0.9rem);
    font-family: $font-mono;
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  &__skel {
    padding-block: 1.3rem;
    border-bottom: 1px solid $line;

    span {
      display: block;
      height: 2.6rem;
      width: 40%;
    }
  }

  &__preview {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 15rem;
    aspect-ratio: 4 / 5;
    margin: -9.4rem 0 0 -7.5rem;
    pointer-events: none;
    overflow: hidden;
    opacity: 0;
    transition: opacity 0.35s ease, scale 0.5s $ease;
    scale: 0.85;

    &.is-on {
      opacity: 1;
      scale: 1;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    @media (hover: none) {
      display: none;
    }
  }
}
</style>
