<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/types'
import { PRODUCT_STATE, productState } from '../adminCatalog'

const props = defineProps<{ product: Pick<Product, 'isPublished' | 'isAvailable' | 'keepVisibleWhenSoldOut'> }>()
const meta = computed(() => PRODUCT_STATE[productState(props.product)])
</script>

<template>
  <span class="ptag" :class="`ptag--${meta.tone}`" :title="meta.hint">
    <span class="ptag__dot" aria-hidden="true"></span>
    {{ meta.label }}
  </span>
</template>

<style scoped lang="scss">
.ptag {
  @include flex(row, center, flex-start, 0.45rem);
  display: inline-flex;
  font-size: 0.82rem;
  white-space: nowrap;
  color: $ink-soft;

  &__dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: $silver;
  }

  &--live {
    color: $ink;

    .ptag__dot {
      background: $esmeralda;
    }
  }

  &--warn .ptag__dot {
    background: $citrino;
  }

  &--muted .ptag__dot {
    background: transparent;
    border: 1px solid $ink-muted;
  }
}
</style>
