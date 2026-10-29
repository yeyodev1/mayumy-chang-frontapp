<script setup lang="ts">
import { computed } from 'vue'
import { site, segmentLabel, stoneMeta, fill } from '@/config/site'
import { useCartStore } from '@/stores/cart'
import { formatCents } from '@/utils/format'
import { cldUrl } from '@/utils/cloudinary'
import type { Product } from '@/types'

const props = withDefaults(defineProps<{ product: Product; eager?: boolean; size?: 'md' | 'lg' }>(), {
  eager: false,
  size: 'md',
})

const cart = useCartStore()

const cover = computed(() => cldUrl(props.product.images[0]?.url, { w: 720 }))
const worn = computed(() => cldUrl(props.product.images[1]?.url, { w: 720 }))
const stone = computed(() => stoneMeta(props.product.stone))
const inBag = computed(() => cart.has(props.product._id))

// "Pieza única" vende: la clienta pidió que se note que se agotan rápido.
const tag = computed(() => {
  if (!props.product.isAvailable) return site.shop.soldOut
  if (props.product.stockTotal === 1) return site.shop.unique
  if (props.product.stockTotal <= 3) return fill(site.shop.lastOnes, { n: props.product.stockTotal })
  return ''
})

function quickAdd() {
  // La bolsa se abre sola: ese es el aviso.
  cart.add(props.product)
}
</script>

<template>
  <article class="pcard" :class="[`pcard--${size}`, { 'pcard--out': !product.isAvailable }]">
    <RouterLink :to="{ name: 'Product', params: { slug: product.slug } }" class="pcard__media" :aria-label="product.name">
      <img
        :src="cover"
        :alt="product.name"
        class="pcard__img"
        :loading="eager ? 'eager' : 'lazy'"
        decoding="async"
        width="720"
        height="900"
      />
      <img v-if="worn" :src="worn" alt="" class="pcard__img pcard__img--alt" loading="lazy" decoding="async" aria-hidden="true" />
      <span v-if="tag" class="pcard__tag" :class="{ 'pcard__tag--out': !product.isAvailable }">{{ tag }}</span>
    </RouterLink>

    <button
      v-if="product.isAvailable"
      type="button"
      class="pcard__add"
      :class="{ 'pcard__add--in': inBag }"
      :aria-label="inBag ? `${product.name} ya está en tu bolsa` : `Añadir ${product.name} a la bolsa`"
      :disabled="inBag && product.stockTotal === 1"
      @click="quickAdd"
    >
      <i :class="inBag ? 'fa-solid fa-check' : 'fa-solid fa-plus'" aria-hidden="true"></i>
      <span>{{ inBag ? site.shop.added : site.shop.quickAdd }}</span>
    </button>

    <div class="pcard__body">
      <p class="pcard__meta">
        <span v-if="stone" class="pcard__dot" :style="{ background: stone.color }" aria-hidden="true"></span>
        {{ [segmentLabel(product.segment), stone?.name].filter(Boolean).join(' · ') }}
      </p>
      <h3 class="pcard__name">
        <RouterLink :to="{ name: 'Product', params: { slug: product.slug } }">{{ product.name }}</RouterLink>
      </h3>
      <p class="pcard__price">
        <span>{{ formatCents(product.priceFromCents) }}</span>
        <s v-if="product.compareAtPriceCents > product.priceFromCents">{{ formatCents(product.compareAtPriceCents) }}</s>
      </p>
    </div>
  </article>
</template>

<style scoped lang="scss">
.pcard {
  position: relative;
  @include flex(column, stretch, flex-start, 0.9rem);

  &__media {
    position: relative;
    display: block;
    aspect-ratio: 4 / 5;
    overflow: hidden;
    background: $quartz-deep;
    border-radius: $radius-sm;
  }

  &__img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 1.2s $ease, clip-path 0.9s $ease-in-out;

    // La foto puesta se descubre de abajo hacia arriba, como una cortina.
    &--alt {
      clip-path: inset(100% 0 0 0);
    }
  }

  @media (hover: hover) {
    &__media:hover &__img {
      transform: scale(1.04);
    }
    &__media:hover &__img--alt {
      clip-path: inset(0 0 0 0);
    }
  }

  &__tag {
    position: absolute;
    top: 0.75rem;
    left: 0.75rem;
    z-index: 2;
    font-family: $font-mono;
    font-size: 0.64rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 0.35rem 0.55rem;
    background: rgba($frost, 0.88);
    backdrop-filter: blur(6px);
    color: $ink;

    &--out {
      background: $basalt;
      color: $quartz;
    }
  }

  &__add {
    position: absolute;
    right: 0.75rem;
    // Encima de la foto: alto de la foto menos el margen.
    top: calc((100% - 0.9rem) * 0 + 0.75rem);
    z-index: 3;
    @include flex(row, center, center, 0.45rem);
    min-height: 40px;
    padding: 0 0.85rem;
    background: $basalt;
    color: $frost;
    font-family: $font-mono;
    font-size: 0.66rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    border-radius: $radius-sm;
    transition: opacity 0.4s $ease, transform 0.4s $ease, background-color 0.3s ease;

    span {
      display: none;
    }

    &--in {
      background: var(--stone);
    }

    @media (hover: hover) {
      opacity: 0;
      transform: translateY(-6px);

      span {
        display: inline;
      }
    }

    &:focus-visible {
      opacity: 1;
      transform: none;
    }
  }

  @media (hover: hover) {
    &:hover &__add {
      opacity: 1;
      transform: none;
    }
  }

  &__body {
    @include flex(column, flex-start, flex-start, 0.3rem);
  }

  &__meta {
    @include eyebrow;
    @include flex(row, center, flex-start, 0.45rem);
    font-size: 0.64rem;
  }

  &__dot {
    width: 0.55rem;
    height: 0.55rem;
    border-radius: 50%;
    box-shadow: inset 0 0 0 1px rgba(#000, 0.12);
  }

  &__name {
    font-family: $font-serif;
    font-size: clamp(1.15rem, 1rem + 0.5vw, 1.4rem);
    line-height: 1.1;

    a {
      background: linear-gradient(currentColor, currentColor) 0 100% / 0 1px no-repeat;
      transition: background-size 0.5s $ease;
    }
  }

  &:hover &__name a {
    background-size: 100% 1px;
  }

  &--lg &__name {
    font-size: clamp(1.4rem, 1.1rem + 1vw, 2rem);
  }

  &__price {
    @include flex(row, baseline, flex-start, 0.6rem);
    font-family: $font-mono;
    font-size: 0.82rem;

    s {
      color: $ink-muted;
    }
  }

  &--out &__img {
    filter: grayscale(0.35);
    opacity: 0.85;
  }
}
</style>
