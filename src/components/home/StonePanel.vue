<script setup lang="ts">
import { computed } from 'vue'
import { site, fill } from '@/config/site'
import { formatCents } from '@/utils/format'
import { cldUrl } from '@/utils/cloudinary'
import type { Product, Stone } from '@/types'

const props = defineProps<{
  stone: { id: Stone; name: string; color: string; video: string; line: string }
  products: Product[]
  index: number
}>()

const picks = computed(() => props.products.slice(0, 3))
</script>

<template>
  <article class="spanel" :style="{ '--c': stone.color }" :aria-labelledby="`stone-${stone.id}`">
    <div class="spanel__media">
      <video
        :src="`/video/${stone.video}.mp4`"
        :poster="`/video/${stone.video}.webp`"
        muted
        loop
        playsinline
        preload="none"
        aria-hidden="true"
        data-stone-video
      ></video>
      <span class="spanel__index">{{ index + 1 }} / {{ site.stones.length }}</span>
    </div>

    <div class="spanel__copy">
      <h3 :id="`stone-${stone.id}`" class="spanel__name">{{ stone.name }}</h3>
      <p class="spanel__line">{{ stone.line }}</p>

      <ul v-if="picks.length" class="spanel__picks">
        <li v-for="p in picks" :key="p._id">
          <RouterLink :to="{ name: 'Product', params: { slug: p.slug } }" class="spanel__pick">
            <img :src="cldUrl(p.images[0]?.url, { w: 160 })" :alt="p.name" loading="lazy" width="64" height="80" />
            <span class="spanel__pick-name">{{ p.name }}</span>
            <span class="spanel__pick-price">{{ p.isAvailable ? formatCents(p.priceFromCents) : site.shop.soldOut }}</span>
          </RouterLink>
        </li>
      </ul>

      <RouterLink :to="`/tienda?piedra=${stone.id}`" class="btn btn--stone spanel__cta">
        {{ fill(site.home.stones.cta, { stone: stone.name.toLowerCase() }) }}
        <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </RouterLink>
    </div>
  </article>
</template>

<style scoped lang="scss">
// Cada piedra ocupa una pantalla completa: así el scroll horizontal pasa de una a otra.
.spanel {
  flex: 0 0 100vw;
  width: 100vw;
  height: 100%;
  scroll-snap-align: start;
  @include flex(column, flex-start, center, 0.9rem);
  padding: calc(var(--header-h) + 4.6rem) 1.25rem 2.4rem;

  @include from('lg') {
    flex-direction: row;
    align-items: center;
    gap: clamp(2rem, 5vw, 6rem);
    padding: calc(var(--header-h) + 2.5rem) clamp(2rem, 6vw, 7rem) 2.5rem;
  }

  &__media {
    position: relative;
    flex: 0 0 auto;
    height: 36svh;
    aspect-ratio: 3 / 4;
    overflow: hidden;
    background: $quartz-deep;

    @include from('lg') {
      height: min(70vh, 52rem);
    }

    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__index {
    position: absolute;
    top: 0.8rem;
    left: 0.8rem;
    font-family: $font-mono;
    font-size: 0.66rem;
    letter-spacing: 0.12em;
    padding: 0.3rem 0.5rem;
    background: var(--c);
    color: $frost;
  }

  &__copy {
    flex: 1;
    @include flex(column, flex-start, flex-start, 0.8rem);
    min-width: 0;
    width: 100%;

    @include from('lg') {
      flex: 1;
      justify-content: center;
      gap: 1.2rem;
    }
  }

  &__name {
    @include caps(clamp(5rem, 3rem + 14vw, 20rem));
    color: var(--c);
    line-height: 0.76;
  }

  &__line {
    font-family: $font-serif;
    font-size: clamp(1.15rem, 1rem + 1vw, 2.1rem);
    line-height: 1.15;
    max-width: 24ch;
  }

  &__picks {
    list-style: none;
    width: 100%;
    max-width: 30rem;
    border-top: 1px solid rgba($basalt, 0.12);

    // En el celular solo dos: la pantalla fija no da para más.
    li:nth-child(n + 3) {
      @include until('lg') {
        display: none;
      }
    }
  }

  &__pick {
    @include flex(row, center, flex-start, 0.9rem);
    padding-block: 0.5rem;
    border-bottom: 1px solid rgba($basalt, 0.12);
    transition: padding 0.4s $ease;

    &:hover {
      padding-left: 0.5rem;
    }

    img {
      width: 40px;
      height: 50px;
      object-fit: cover;
      flex-shrink: 0;

      @include from('lg') {
        width: 48px;
        height: 60px;
      }
    }
  }

  &__pick-name {
    flex: 1;
    font-family: $font-serif;
    font-size: 1.05rem;
  }

  &__pick-price {
    font-family: $font-mono;
    font-size: 0.72rem;
  }

  &__cta {
    background: var(--c);
    margin-top: 0.2rem;
  }
}
</style>
