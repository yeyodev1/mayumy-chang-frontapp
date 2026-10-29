<script setup lang="ts">
import { ref, watch } from 'vue'
import { site } from '@/config/site'
import { useCatalog } from '@/composables/useCatalog'
import { useHorizontalScroll } from '@/composables/useHorizontalScroll'
import { useReveal } from '@/composables/useReveal'
import ProductCard from '@/components/product/ProductCard.vue'
import ProductCardSkeleton from '@/components/product/ProductCardSkeleton.vue'

const { bestSellers, loading } = useCatalog()
const root = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)
// Al bajar, la sección se queda fija y las piezas desfilan de derecha a izquierda.
const { progress, refresh } = useHorizontalScroll(root, track)
useReveal(root)
watch(bestSellers, () => refresh())
</script>

<template>
  <section ref="root" class="best" aria-labelledby="best-title">
    <header class="best__head">
      <div>
        <p class="best__eyebrow" data-reveal>[ {{ site.home.bestSellers.eyebrow }} ]</p>
        <h2 id="best-title" class="best__title" data-split>{{ site.home.bestSellers.title }}</h2>
      </div>
      <div class="best__side" data-reveal>
        <p class="best__note">{{ site.home.bestSellers.note }}</p>
        <RouterLink to="/tienda" class="best__all link-line">
          {{ site.home.bestSellers.cta }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </RouterLink>
      </div>
    </header>

    <div ref="track" class="best__track" tabindex="0" aria-label="Lo más vendido, desliza para ver más">
      <template v-if="loading && !bestSellers.length">
        <ProductCardSkeleton v-for="n in 6" :key="n" class="best__item" />
      </template>
      <ProductCard v-for="p in bestSellers" v-else :key="p._id" :product="p" class="best__item" />
      <RouterLink to="/tienda" class="best__item best__more">
        <span class="best__more-label">{{ site.home.bestSellers.cta }}</span>
        <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </RouterLink>
    </div>

    <div class="best__progress" aria-hidden="true">
      <span :style="{ transform: `scaleX(${progress})` }"></span>
    </div>
  </section>
</template>

<style scoped lang="scss">
.best {
  padding-block: $space-section;
  border-top: 1px solid $line;
  overflow: hidden;

  // Fijada: ocupa la pantalla y reparte el alto entre título y piezas.
  &.is-horizontal {
    height: 100vh;
    height: 100svh;
    @include flex(column, stretch, center);
    padding-block: calc(var(--header-h) + 1rem) 1.5rem;
  }

  &__head {
    @include flex(column, flex-start, space-between, 1rem);
    padding-inline: 1.25rem;
    margin-bottom: clamp(1.2rem, 3vh, 2.5rem);

    @include from('md') {
      flex-direction: row;
      align-items: flex-end;
      padding-inline: 2rem;
    }
  }

  &__eyebrow {
    @include eyebrow;
    margin-bottom: 0.8rem;
  }

  &__title {
    @include display(clamp(2.4rem, 1.4rem + 4vw, 6rem));
    max-width: 12ch;
  }

  &__side {
    @include flex(column, flex-start, flex-start, 0.8rem);
    max-width: 22rem;

    @include from('md') {
      align-items: flex-end;
      text-align: right;
    }
  }

  &__note {
    color: $ink-soft;
    font-size: $text-sm;
  }

  &__all {
    @include flex(row, center, flex-start, 0.6rem);
    font-family: $font-mono;
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  // Sin animación (reduced-motion): fila que se desliza con el dedo.
  &__track {
    @include flex(row, flex-start, flex-start, clamp(0.8rem, 1.5vw, 1.4rem));
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding-inline: 1.25rem;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    @include from('md') {
      padding-inline: 2rem;
    }
  }

  &.is-horizontal &__track {
    overflow: visible;
    scroll-snap-type: none;
    will-change: transform;
  }

  &__item {
    flex: 0 0 64vw;
    scroll-snap-align: start;

    @include from('sm') {
      flex-basis: 40vw;
    }

    @include from('lg') {
      flex-basis: 22vw;
    }
  }

  // En pantalla fija la tarjeta no puede pasar del alto disponible.
  &.is-horizontal &__item {
    @include until('lg') {
      flex-basis: min(64vw, 44svh);
    }
  }

  &__more {
    align-self: stretch;
    aspect-ratio: 4 / 5;
    height: auto;
    @include flex(column, flex-start, flex-end, 1rem);
    padding: 1.4rem;
    background: $basalt;
    color: $quartz;
    transition: background-color 0.4s ease;

    &:hover {
      background: var(--stone);
    }
  }

  &__more-label {
    @include caps(clamp(3rem, 2rem + 4vw, 6rem));
  }

  &__progress {
    height: 1px;
    margin: clamp(1.2rem, 3vh, 2.2rem) 1.25rem 0;
    background: $line;
    overflow: hidden;

    @include from('md') {
      margin-inline: 2rem;
    }

    span {
      display: block;
      height: 100%;
      background: $ink;
      transform-origin: left;
      transform: scaleX(0);
    }
  }
}
</style>
