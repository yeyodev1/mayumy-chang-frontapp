<script setup lang="ts">
import { SEGMENTS } from '../adminCatalog'
import type { AdminCategory } from '@/types'

defineProps<{ filters: { segment: string; stock: string; category: string }; categories: AdminCategory[] }>()
</script>

<template>
  <div class="pfilters">
    <div class="pfilters__segments" role="group" aria-label="Filtrar por segmento">
      <button
        type="button"
        class="pfilters__chip"
        :class="{ 'is-on': !filters.segment }"
        :aria-pressed="!filters.segment"
        @click="filters.segment = ''"
      >
        Todos
      </button>
      <button
        v-for="s in SEGMENTS"
        :key="s.id"
        type="button"
        class="pfilters__chip"
        :class="{ 'is-on': filters.segment === s.id }"
        :aria-pressed="filters.segment === s.id"
        @click="filters.segment = filters.segment === s.id ? '' : s.id"
      >
        {{ s.label }}
      </button>
    </div>
    <div class="pfilters__selects">
      <label for="pf-stock" class="visually-hidden">Stock</label>
      <select id="pf-stock" v-model="filters.stock">
        <option value="">Con y sin stock</option>
        <option value="in">Con stock</option>
        <option value="out">Sin stock (agotadas)</option>
      </select>
      <label for="pf-cat" class="visually-hidden">Categoría</label>
      <select id="pf-cat" v-model="filters.category">
        <option value="">Todas las categorías</option>
        <option v-for="c in categories" :key="c.slug" :value="c.slug">{{ c.name }}</option>
      </select>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pfilters {
  @include flex(row, center, flex-start, 0.7rem);
  flex-wrap: wrap;

  &__segments {
    @include flex(row, center, flex-start, 0.4rem);
    overflow-x: auto;
    scrollbar-width: none;
    max-width: 100%;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__chip {
    flex-shrink: 0;
    min-height: 2.6rem;
    padding: 0 1rem;
    border: 1px solid $line;
    border-radius: $radius-pill;
    background: $frost;
    font-size: 0.86rem;
    color: $ink-soft;
    white-space: nowrap;
    @include focus-ring;

    &:hover {
      border-color: $basalt;
      color: $ink;
    }

    &.is-on {
      background: $basalt;
      border-color: $basalt;
      color: $frost;
    }
  }

  &__selects {
    @include flex(row, center, flex-start, 0.5rem);
    flex: 1 1 100%;

    @include from('md') {
      flex: 0 1 auto;
      margin-left: auto;
    }

    select {
      flex: 1 1 0;
      min-width: 0;
      min-height: 2.6rem;
      padding-block: 0.4rem;

      @include from('md') {
        width: 13rem;
      }
    }
  }
}
</style>
