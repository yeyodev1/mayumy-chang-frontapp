<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { site } from '@/config/site'
import { useCatalog } from '@/composables/useCatalog'
import { useDragScroll } from '@/composables/useDragScroll'
import { useReveal } from '@/composables/useReveal'
import ProductCard from '@/components/product/ProductCard.vue'
import ProductCardSkeleton from '@/components/product/ProductCardSkeleton.vue'

const { bestSellers, loading } = useCatalog()
const root = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)
const { canPrev, canNext, step, update } = useDragScroll(track)
useReveal(root)
watch(bestSellers, () => nextTick(update))
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
        <div class="best__arrows">
          <button type="button" class="best__arrow" :disabled="!canPrev" aria-label="Piezas anteriores" @click="step(-1)">
            <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
          </button>
          <button type="button" class="best__arrow" :disabled="!canNext" aria-label="Más piezas" @click="step(1)">
            <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </header>

    <div ref="track" class="best__track" tabindex="0" aria-label="Lo más vendido, desliza para ver más">
      <template v-if="loading && !bestSellers.length">
        <ProductCardSkeleton v-for="n in 5" :key="n" class="best__item" />
      </template>
      <ProductCard v-for="p in bestSellers" v-else :key="p._id" :product="p" class="best__item" />
    </div>

    <RouterLink to="/tienda" class="best__all link-line" data-reveal>
      {{ site.home.bestSellers.cta }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
    </RouterLink>
  </section>
</template>

<style scoped lang="scss">
.best {
  padding-block: $space-section;
  border-top: 1px solid $line;

  &__head {
    @include flex(column, flex-start, space-between, 1.5rem);
    padding-inline: 1.25rem;
    margin-bottom: $space-lg;

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
    @include display($display-lg);
    max-width: 12ch;
  }

  &__side {
    @include flex(column, flex-start, flex-start, 1rem);
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

  &__arrows {
    display: none;
    gap: 0.5rem;

    @include from('md') {
      display: flex;
    }
  }

  &__arrow {
    width: 48px;
    height: 48px;
    border: 1px solid $ink;
    border-radius: 50%;
    @include flex(row, center, center);
    transition: background-color 0.3s ease, color 0.3s ease, opacity 0.3s ease;

    &:hover:not(:disabled) {
      background: $ink;
      color: $frost;
    }

    &:disabled {
      opacity: 0.25;
      cursor: default;
    }
  }

  &__track {
    @include flex(row, flex-start, flex-start, clamp(0.8rem, 1.5vw, 1.4rem));
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: 1.25rem;
    padding-inline: 1.25rem;
    padding-bottom: 0.5rem;
    scrollbar-width: none;
    cursor: grab;
    user-select: none;

    &::-webkit-scrollbar {
      display: none;
    }

    &:active {
      cursor: grabbing;
    }

    @include from('md') {
      scroll-padding-inline: 2rem;
      padding-inline: 2rem;
    }

    :deep(img) {
      -webkit-user-drag: none;
      pointer-events: none;
    }
  }

  &__item {
    flex: 0 0 72%;
    scroll-snap-align: start;

    @include from('sm') {
      flex-basis: 44%;
    }

    @include from('lg') {
      flex-basis: 23.5%;
    }
  }

  &__all {
    @include flex(row, center, flex-start, 0.6rem);
    width: max-content;
    margin: $space-lg 1.25rem 0;
    font-family: $font-mono;
    font-size: 0.74rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;

    @include from('md') {
      margin-inline: 2rem;
    }
  }
}
</style>
