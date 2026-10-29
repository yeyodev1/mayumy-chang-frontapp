<script setup lang="ts">
import { computed, nextTick, watch } from 'vue'
import { site, stoneMeta } from '@/config/site'
import { useProduct } from '@/composables/useProduct'
import { refreshScroll } from '@/composables/useSmoothScroll'
import ProductGallery from '@/components/product/ProductGallery.vue'
import ProductInfo from '@/components/product/ProductInfo.vue'
import ProductCard from '@/components/product/ProductCard.vue'

const { product, related, loading, error, variantId, inBag, addToBag } = useProduct()
const accent = computed(() => stoneMeta(product.value?.stone)?.color)

watch(loading, (now) => {
  if (!now) nextTick(refreshScroll)
})
</script>

<template>
  <div class="pview" :style="accent ? { '--stone': accent } : undefined">
    <div v-if="loading" class="pview__layout" aria-hidden="true">
      <div class="pview__gallery"><div class="skeleton pview__skel-img"></div></div>
      <div class="pview__info pview__skel-info">
        <div class="skeleton" style="height: 0.7rem; width: 30%"></div>
        <div class="skeleton" style="height: 3.4rem; width: 85%"></div>
        <div class="skeleton" style="height: 1rem; width: 60%"></div>
        <div class="skeleton" style="height: 2.2rem; width: 30%"></div>
        <div class="skeleton" style="height: 3.5rem; width: 100%"></div>
      </div>
    </div>

    <div v-else-if="error || !product" class="pview__missing">
      <p class="pview__missing-title">{{ site.notFound.title }}</p>
      <p>{{ site.notFound.text }}</p>
      <RouterLink to="/tienda" class="btn btn--primary">{{ site.notFound.shop }}</RouterLink>
    </div>

    <template v-else>
      <div class="pview__layout">
        <ProductGallery class="pview__gallery" :images="product.images" :name="product.name" />
        <div class="pview__info">
          <ProductInfo v-model:variant-id="variantId" :product="product" :in-bag="inBag" @add="addToBag" />
        </div>
      </div>

      <section v-if="related.length" class="pview__related" aria-labelledby="related-title">
        <h2 id="related-title" class="pview__related-title">{{ site.product.related }}</h2>
        <div class="pview__related-grid">
          <ProductCard v-for="p in related" :key="p._id" :product="p" />
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped lang="scss">
.pview {
  padding-top: calc(var(--header-h) + 1.9rem);

  &__layout {
    @include flex(column, stretch);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
      gap: clamp(2rem, 4vw, 5rem);
      padding: 1.5rem 2rem 0;
    }
  }

  &__gallery {
    @include from('lg') {
      flex: 0 0 56%;
    }
  }

  // La información acompaña mientras se recorren las fotos.
  &__info {
    padding: 1.8rem 1.25rem 0;

    @include from('lg') {
      flex: 1;
      position: sticky;
      top: calc(var(--header-h) + 2.5rem);
      padding: 0;
      max-width: 32rem;
    }
  }

  &__skel-img {
    aspect-ratio: 4 / 5;
    border-radius: 0;
  }

  &__skel-info {
    @include flex(column, stretch, flex-start, 1.1rem);
  }

  &__missing {
    @include flex(column, flex-start, flex-start, 1rem);
    padding: $space-xl 1.25rem;
    max-width: 36rem;

    @include from('md') {
      padding-inline: 2rem;
    }
  }

  &__missing-title {
    @include display($display-md);
  }

  &__related {
    padding: $space-section 1.25rem;

    @include from('md') {
      padding-inline: 2rem;
    }
  }

  &__related-title {
    @include caps($caps-md);
    color: var(--stone);
    margin-bottom: $space-lg;
  }

  &__related-grid {
    @include flex-cards(220px, 1.2rem);

    > * {
      flex-basis: calc(50% - 0.6rem);
      max-width: calc(50% - 0.6rem);

      @include from('lg') {
        flex-basis: calc(25% - 0.9rem);
        max-width: calc(25% - 0.9rem);
      }
    }
  }
}
</style>
