<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { site, segmentLabel, stoneMeta } from '@/config/site'
import { useCatalog } from '@/composables/useCatalog'
import { useReveal } from '@/composables/useReveal'
import { useCartStore } from '@/stores/cart'
import { formatCents } from '@/utils/format'
import { cldUrl } from '@/utils/cloudinary'

const { pieceOfMonth: piece, loading } = useCatalog()
const cart = useCartStore()
const root = ref<HTMLElement | null>(null)
const { refresh } = useReveal(root)
watch(piece, () => refresh())

const stone = computed(() => stoneMeta(piece.value?.stone))
const images = computed(() => (piece.value?.images ?? []).slice(0, 3).map((img) => cldUrl(img.url, { w: 1100 })))
// El nombre de la pieza se parte en dos líneas gigantes, como un titular de revista.
const nameLines = computed(() => {
  const words = (piece.value?.name ?? '').split(' ')
  const cut = Math.ceil(words.length / 2)
  return [words.slice(0, cut).join(' '), words.slice(cut).join(' ')].filter(Boolean)
})

function add() {
  if (piece.value) cart.add(piece.value)
}
</script>

<template>
  <section ref="root" class="month" :style="{ '--c': stone?.color }" aria-labelledby="month-title">
    <div v-if="loading || !piece" class="month__skel" aria-hidden="true">
      <div class="skeleton month__skel-title"></div>
      <div class="month__skel-row">
        <div class="skeleton month__skel-img"></div>
        <div class="skeleton month__skel-img"></div>
      </div>
    </div>

    <template v-else>
      <p class="month__eyebrow" data-reveal>[ {{ site.home.month.eyebrow }} ]</p>
      <h2 id="month-title" class="month__title">
        <span v-for="line in nameLines" :key="line" class="month__line" data-split>{{ line }}</span>
      </h2>

      <div class="month__body">
        <RouterLink :to="{ name: 'Product', params: { slug: piece.slug } }" class="month__main" data-reveal-mask>
          <img :src="images[0]" :alt="piece.name" loading="lazy" data-parallax="0.08" />
        </RouterLink>

        <div class="month__info">
          <img v-if="images[1]" :src="images[1]" alt="" class="month__second" loading="lazy" data-reveal-mask />
          <p class="month__meta" data-reveal>
            <span class="month__dot" aria-hidden="true"></span>
            {{ [segmentLabel(piece.segment), stone?.name, piece.line].filter(Boolean).join(' · ') }}
          </p>
          <p class="month__desc" data-reveal>{{ piece.description || piece.shortDescription }}</p>
          <ul class="month__specs" data-reveal>
            <li v-for="d in piece.details" :key="d">{{ d }}</li>
          </ul>
          <div class="month__buy" data-reveal>
            <span class="month__price">{{ formatCents(piece.priceFromCents) }}</span>
            <button v-if="piece.isAvailable" type="button" class="btn btn--primary" @click="add">
              {{ site.home.month.cta }}
            </button>
            <span v-else class="month__out">{{ site.shop.soldOut }}</span>
          </div>
          <RouterLink :to="{ name: 'Product', params: { slug: piece.slug } }" class="month__link link-line" data-reveal>
            {{ site.home.month.view }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </RouterLink>
        </div>
      </div>
    </template>
  </section>
</template>

<style scoped lang="scss">
.month {
  padding: $space-section 1.25rem;

  @include from('md') {
    padding-inline: 2rem;
  }

  &__eyebrow {
    @include eyebrow;
    margin-bottom: 1rem;
  }

  &__title {
    @include caps(clamp(5.5rem, 2rem + 16vw, 18rem));
    @include flex(column, flex-start);
    margin-bottom: $space-lg;
  }

  &__line:last-child {
    align-self: flex-end;
    color: var(--c, $zafiro);
  }

  &__body {
    @include flex(column, stretch, flex-start, $space-lg);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
    }
  }

  &__main {
    position: relative;
    display: block;
    aspect-ratio: 4 / 5;
    overflow: hidden;
    background: $quartz-deep;

    @include from('lg') {
      flex: 0 0 52%;
    }

    img {
      width: 100%;
      height: 118%;
      object-fit: cover;
      margin-top: -9%;
    }
  }

  &__info {
    flex: 1;
    @include flex(column, flex-start, flex-start, 1.3rem);

    @include from('lg') {
      padding-top: 18%;
      max-width: 30rem;
    }
  }

  &__second {
    width: 58%;
    aspect-ratio: 4 / 5;
    object-fit: cover;
    margin-bottom: 1rem;
  }

  &__meta {
    @include eyebrow;
    @include flex(row, center, flex-start, 0.5rem);
    color: $ink;
  }

  &__dot {
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 50%;
    background: var(--c, $zafiro);
  }

  &__desc {
    font-size: $text-lg;
    color: $ink-soft;
    line-height: 1.5;
  }

  &__specs {
    list-style: none;
    @include flex(column, flex-start, flex-start, 0.25rem);

    li {
      font-family: $font-mono;
      font-size: 0.7rem;
      letter-spacing: 0.08em;
      background: $basalt;
      color: $quartz;
      padding: 0.15rem 0.45rem;
    }
  }

  &__buy {
    @include flex(row, center, flex-start, 1.2rem);
    flex-wrap: wrap;
    margin-top: 0.5rem;
  }

  &__price {
    font-family: $font-serif;
    font-size: $display-sm;
  }

  &__out {
    @include eyebrow;
    color: $ink;
  }

  &__link {
    font-family: $font-mono;
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    @include flex(row, center, flex-start, 0.5rem);
  }

  &__skel {
    @include flex(column, stretch, flex-start, 1.5rem);
  }

  &__skel-title {
    height: clamp(5rem, 14vw, 14rem);
    width: 70%;
  }

  &__skel-row {
    @include flex(row, stretch, flex-start, 1.5rem);
  }

  &__skel-img {
    flex: 1;
    aspect-ratio: 4 / 5;
  }
}
</style>
