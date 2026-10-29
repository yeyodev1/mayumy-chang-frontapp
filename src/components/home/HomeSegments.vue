<script setup lang="ts">
import { computed } from 'vue'
import { site, fill } from '@/config/site'
import { useCatalog } from '@/composables/useCatalog'

const { items, loading } = useCatalog()

// La clienta organiza su catálogo por metal: es la primera decisión de compra.
const rows = computed(() =>
  site.segments.map((s) => {
    const n = items.value.filter((p) => p.segment === s.id).length
    return { ...s, n, countLabel: n === 1 ? site.shop.countOne : n ? fill(site.shop.count, { n }) : site.home.categories.empty }
  }),
)
</script>

<template>
  <nav class="segs" aria-label="Comprar por metal">
    <RouterLink
      v-for="row in rows"
      :key="row.id"
      :to="`/tienda?segmento=${row.id}`"
      class="segs__row"
      data-reveal
    >
      <span class="segs__note">[ {{ row.note }} ]</span>
      <span class="segs__label">{{ row.label }}</span>
      <span class="segs__count">
        <span v-if="loading" class="skeleton segs__skel"></span>
        <template v-else>{{ row.countLabel }}</template>
        <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </span>
    </RouterLink>
  </nav>
</template>

<style scoped lang="scss">
.segs {
  @include flex(column, stretch);
  border-top: 1px solid $line;
  margin-top: $space-xl;

  @include from('lg') {
    flex-direction: row;
  }

  &__row {
    position: relative;
    @include flex(row, center, space-between, 1rem);
    flex-wrap: wrap;
    padding: 1.6rem 1.25rem;
    border-bottom: 1px solid $line;
    overflow: hidden;
    isolation: isolate;
    transition: color 0.6s $ease;

    @include from('md') {
      padding-inline: 2rem;
    }

    @include from('lg') {
      // Tres columnas iguales solo en fila: en columna, flex-basis 0 colapsa la altura.
      flex: 1 1 0;
      flex-direction: column;
      align-items: flex-start;
      gap: 2.5rem;
      padding-block: 2.2rem;
      border-bottom: 0;

      & + & {
        border-left: 1px solid $line;
      }
    }

    // El fondo de basalto sube desde abajo al pasar el cursor.
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: -1;
      background: $basalt;
      transform: scaleY(0);
      transform-origin: bottom;
      transition: transform 0.7s $ease;
    }

    &:hover,
    &:focus-visible {
      color: $quartz;

      &::before {
        transform: scaleY(1);
      }

      .segs__count i {
        transform: translateX(6px);
      }
    }
  }

  &__note {
    @include eyebrow;
    color: inherit;
    opacity: 0.7;
    order: 3;
    width: 100%;

    @include from('lg') {
      order: 0;
    }
  }

  &__label {
    font-family: $font-serif;
    font-size: clamp(2.4rem, 1.6rem + 3.5vw, 4.8rem);
    line-height: 0.95;
    letter-spacing: -0.02em;
  }

  &__count {
    @include flex(row, center, flex-end, 0.8rem);
    font-family: $font-mono;
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;

    i {
      transition: transform 0.5s $ease;
    }
  }

  &__skel {
    display: inline-block;
    width: 4.5rem;
    height: 0.75rem;
  }
}
</style>
