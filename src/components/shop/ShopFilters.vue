<script setup lang="ts">
import { site } from '@/config/site'
import { useCategoriesStore } from '@/stores/categories'
import type { ProductSort, Segment, Stone } from '@/types'

defineProps<{ segment?: Segment; category?: string; stone?: Stone; sort: ProductSort; count: number; loading: boolean }>()
const emit = defineEmits<{ set: [key: 'segmento' | 'categoria' | 'piedra' | 'orden', value: string | null] }>()
const categories = useCategoriesStore()
</script>

<template>
  <div class="sfil">
    <div class="sfil__segments" role="group" aria-label="Metal">
      <button type="button" class="sfil__seg" :class="{ 'is-on': !segment }" :aria-pressed="!segment" @click="emit('set', 'segmento', null)">
        {{ site.shop.allSegments }}
      </button>
      <button
        v-for="s in site.segments"
        :key="s.id"
        type="button"
        class="sfil__seg"
        :class="{ 'is-on': segment === s.id }"
        :aria-pressed="segment === s.id"
        @click="emit('set', 'segmento', s.id)"
      >
        {{ s.label }}
      </button>
    </div>

    <div class="sfil__bar">
      <div class="sfil__chips" role="group" aria-label="Categoría">
        <button type="button" class="sfil__chip" :class="{ 'is-on': !category }" :aria-pressed="!category" @click="emit('set', 'categoria', null)">
          {{ site.shop.all }}
        </button>
        <button
          v-for="c in categories.items"
          :key="c.slug"
          type="button"
          class="sfil__chip"
          :class="{ 'is-on': category === c.slug }"
          :aria-pressed="category === c.slug"
          @click="emit('set', 'categoria', category === c.slug ? null : c.slug)"
        >
          {{ c.name }}
        </button>
      </div>

      <div class="sfil__right">
        <div class="sfil__stones" role="group" :aria-label="site.shop.stoneFilter">
          <button
            v-for="s in site.stones"
            :key="s.id"
            type="button"
            class="sfil__stone"
            :class="{ 'is-on': stone === s.id }"
            :style="{ '--c': s.color }"
            :aria-pressed="stone === s.id"
            :aria-label="s.name"
            :title="s.name"
            @click="emit('set', 'piedra', stone === s.id ? null : s.id)"
          ></button>
        </div>
        <label class="sfil__sort">
          <span class="visually-hidden">{{ site.shop.sortLabel }}</span>
          <select :value="sort" @change="emit('set', 'orden', ($event.target as HTMLSelectElement).value)">
            <option v-for="o in site.shop.sorts" :key="o.id" :value="o.id">{{ o.label }}</option>
          </select>
        </label>
        <span class="sfil__count" aria-live="polite">
          <span v-if="loading" class="skeleton sfil__count-skel"></span>
          <template v-else>{{ count === 1 ? site.shop.countOne : site.shop.count.replace('{n}', String(count)) }}</template>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sfil {
  @include flex(column, stretch, flex-start, 1.2rem);

  &__segments {
    @include flex(row, center, flex-start, 0.4rem 1.6rem);
    flex-wrap: wrap;
    border-bottom: 1px solid $ink;
    padding-bottom: 0.8rem;
  }

  &__seg {
    font-family: $font-serif;
    font-size: clamp(1.4rem, 1.1rem + 1.2vw, 2.2rem);
    color: $ink-muted;
    transition: color 0.3s ease;
    min-height: 44px;

    &.is-on,
    &:hover {
      color: $ink;
    }

    &.is-on {
      font-style: italic;
    }
  }

  &__bar {
    @include flex(column, stretch, flex-start, 1rem);

    @include from('lg') {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  &__chips {
    @include flex(row, center, flex-start, 0.4rem);
    overflow-x: auto;
    scrollbar-width: none;
    margin-inline: -1.25rem;
    padding-inline: 1.25rem;

    &::-webkit-scrollbar {
      display: none;
    }

    @include from('lg') {
      flex-wrap: wrap;
      overflow: visible;
      margin: 0;
      padding: 0;
    }
  }

  &__chip {
    flex-shrink: 0;
    font-family: $font-mono;
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 0.55rem 0.9rem;
    min-height: 40px;
    border: 1px solid $line;
    border-radius: $radius-pill;
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;

    &:hover {
      border-color: $ink;
    }

    &.is-on {
      background: $basalt;
      border-color: $basalt;
      color: $frost;
    }
  }

  &__right {
    @include flex(row, center, space-between, 1rem);
    flex-wrap: wrap;
  }

  &__stones {
    @include flex(row, center, flex-start, 0.5rem);
  }

  &__stone {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--c);
    box-shadow: 0 0 0 0 $frost, 0 0 0 0 var(--c);
    transition: box-shadow 0.35s $ease, transform 0.35s $ease;

    &:hover {
      transform: scale(1.1);
    }

    &.is-on {
      box-shadow: 0 0 0 3px $quartz, 0 0 0 4px var(--c);
    }
  }

  &__sort select {
    width: auto;
    font-family: $font-mono;
    font-size: 0.75rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 0.55rem 2rem 0.55rem 0.8rem;
    background: transparent;
  }

  &__count {
    @include eyebrow;
    min-width: 5rem;
    text-align: right;
  }

  &__count-skel {
    display: inline-block;
    width: 4rem;
    height: 0.7rem;
  }
}
</style>
