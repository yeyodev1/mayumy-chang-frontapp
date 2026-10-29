<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { gsap } from 'gsap'
import { site, segmentLabel, stoneMeta } from '@/config/site'
import { useShop } from '@/composables/useShop'
import { useCategoriesStore } from '@/stores/categories'
import { prefersReducedMotion } from '@/composables/useReveal'
import { refreshScroll } from '@/composables/useSmoothScroll'
import ShopFilters from '@/components/shop/ShopFilters.vue'
import ProductCard from '@/components/product/ProductCard.vue'
import ProductCardSkeleton from '@/components/product/ProductCardSkeleton.vue'

const { products, loading, error, segment, category, stone, sort, hasFilters, setFilter, reset } = useShop()
const categories = useCategoriesStore()
const grid = ref<HTMLElement | null>(null)

// El título dice lo que estás viendo: "Plata 925", "Aretes", "Zafiro"…
const title = computed(() => {
  const cat = categories.bySlug(category.value)?.name
  return [segmentLabel(segment.value), cat, stoneMeta(stone.value)?.name].filter(Boolean).join(' · ') || site.shop.title
})
const accent = computed(() => stoneMeta(stone.value)?.color)

// Las tarjetas entran escalonadas cada vez que cambia el filtro.
watch(loading, async (now) => {
  if (now) return
  await nextTick()
  refreshScroll()
  if (!grid.value || prefersReducedMotion()) return
  gsap.fromTo(
    grid.value.querySelectorAll('.pcard'),
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.05, clearProps: 'transform,opacity' },
  )
})
</script>

<template>
  <div class="shop" :style="accent ? { '--stone': accent } : undefined">
    <header class="shop__head">
      <p class="shop__eyebrow">[ {{ site.shop.eyebrow }} ]</p>
      <Transition name="fade" mode="out-in">
        <h1 :key="title" class="shop__title">{{ title }}</h1>
      </Transition>
    </header>

    <ShopFilters
      class="shop__filters"
      :segment="segment"
      :category="category"
      :stone="stone"
      :sort="sort"
      :count="products.length"
      :loading="loading"
      @set="setFilter"
    />

    <div v-if="loading" class="shop__grid" aria-hidden="true">
      <ProductCardSkeleton v-for="n in 8" :key="n" />
    </div>

    <div v-else-if="error" class="shop__empty" role="alert">
      <p class="shop__empty-title">{{ error }}</p>
      <button type="button" class="btn btn--ghost" @click="reset">{{ site.shop.empty.reset }}</button>
    </div>

    <div v-else-if="!products.length" class="shop__empty">
      <p class="shop__empty-title">{{ site.shop.empty.title }}</p>
      <p class="shop__empty-text">{{ site.shop.empty.text }}</p>
      <div class="shop__empty-ctas">
        <button v-if="hasFilters" type="button" class="btn btn--primary" @click="reset">{{ site.shop.empty.reset }}</button>
        <RouterLink to="/a-medida" class="btn btn--ghost">{{ site.shop.empty.bespoke }}</RouterLink>
      </div>
    </div>

    <div v-else ref="grid" class="shop__grid">
      <ProductCard v-for="(p, i) in products" :key="p._id" :product="p" :eager="i < 4" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.shop {
  padding: calc(var(--header-h) + 3.5rem) 1.25rem $space-section;

  @include from('md') {
    padding-inline: 2rem;
  }

  &__head {
    margin-bottom: $space-lg;
  }

  &__eyebrow {
    @include eyebrow;
    margin-bottom: 0.6rem;
  }

  &__title {
    @include caps(clamp(5rem, 2.5rem + 12vw, 15rem));
    color: var(--stone);
    transition: color 0.6s ease;
  }

  &__filters {
    margin-bottom: $space-lg;
  }

  &__grid {
    @include flex-cards(240px, clamp(1rem, 2vw, 1.8rem) clamp(0.8rem, 1.5vw, 1.4rem));
    row-gap: clamp(2rem, 4vw, 3.2rem);

    // En móvil, dos columnas: así se compara rápido.
    > * {
      flex-basis: calc(50% - 0.5rem);
      max-width: calc(50% - 0.4rem);

      @include from('md') {
        flex-basis: 30%;
        max-width: calc(33.333% - 1rem);
      }

      @include from('xl') {
        flex-basis: 22%;
        max-width: calc(25% - 1.1rem);
      }
    }
  }

  &__empty {
    @include flex(column, flex-start, flex-start, 1rem);
    padding-block: $space-xl;
    border-top: 1px solid $line;
    max-width: 38rem;
  }

  &__empty-title {
    @include display($display-md);
  }

  &__empty-text {
    color: $ink-soft;
  }

  &__empty-ctas {
    @include flex(row, center, flex-start, 0.6rem);
    flex-wrap: wrap;
  }
}
</style>
