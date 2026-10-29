<script setup lang="ts">
import { computed, ref } from 'vue'
import { cldUrl } from '@/utils/cloudinary'
import type { ProductImage } from '@/types'

const props = defineProps<{ images: ProductImage[]; name: string }>()
const track = ref<HTMLElement | null>(null)
const current = ref(0)

const urls = computed(() => props.images.map((img) => cldUrl(img.url, { w: 1200 })))

function onScroll() {
  const el = track.value
  if (!el) return
  current.value = Math.round(el.scrollLeft / el.clientWidth)
}

function go(i: number) {
  track.value?.scrollTo({ left: i * (track.value?.clientWidth ?? 0), behavior: 'smooth' })
}
</script>

<template>
  <div class="pgal">
    <div ref="track" class="pgal__track" @scroll.passive="onScroll">
      <figure v-for="(url, i) in urls" :key="url" class="pgal__item">
        <img
          :src="url"
          :alt="i === 0 ? name : `${name}, foto ${i + 1}`"
          :loading="i === 0 ? 'eager' : 'lazy'"
          :fetchpriority="i === 0 ? 'high' : 'auto'"
          decoding="async"
          width="1200"
          height="1500"
        />
      </figure>
    </div>
    <div v-if="urls.length > 1" class="pgal__dots" role="tablist" aria-label="Fotos">
      <button
        v-for="(_, i) in urls"
        :key="i"
        type="button"
        role="tab"
        class="pgal__dot"
        :class="{ 'is-on': i === current }"
        :aria-selected="i === current"
        :aria-label="`Foto ${i + 1}`"
        @click="go(i)"
      ></button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pgal {
  position: relative;

  // Móvil: carrusel a todo el ancho con snap. Desktop: fotos apiladas que se recorren con el scroll.
  &__track {
    @include flex(row, stretch);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    @include from('lg') {
      flex-direction: column;
      gap: 0.6rem;
      overflow: visible;
    }
  }

  &__item {
    flex: 0 0 100%;
    scroll-snap-align: center;
    aspect-ratio: 4 / 5;
    overflow: hidden;
    background: $quartz-deep;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__dots {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 1rem;
    @include flex(row, center, center, 0.4rem);

    @include from('lg') {
      display: none;
    }
  }

  &__dot {
    width: 22px;
    height: 3px;
    background: rgba($frost, 0.6);
    transition: background-color 0.3s ease, width 0.4s $ease;
    // Área táctil cómoda sin agrandar la raya.
    position: relative;

    &::after {
      content: '';
      position: absolute;
      inset: -14px -4px;
    }

    &.is-on {
      width: 36px;
      background: $frost;
    }
  }
}
</style>
