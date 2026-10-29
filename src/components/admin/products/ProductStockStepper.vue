<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/types'

const props = defineProps<{ product: Product; busy: boolean }>()
const emit = defineEmits<{ change: [delta: 1 | -1] }>()

// Con varias variantes el stock se ajusta por variante dentro de la pieza.
const single = computed(() => props.product.variants.length === 1)
const stock = computed(() => (single.value ? props.product.variants[0]!.stock : props.product.stockTotal))
</script>

<template>
  <span v-if="single" class="stepper" :class="{ 'stepper--out': stock === 0, 'is-busy': busy }">
    <button
      type="button"
      class="stepper__btn"
      :disabled="busy || stock <= 0"
      :aria-label="`Restar una unidad a ${product.name}`"
      @click="emit('change', -1)"
    >
      <i class="fa-solid fa-minus" aria-hidden="true"></i>
    </button>
    <span class="stepper__value" aria-live="polite">
      {{ stock }}<span class="visually-hidden"> en stock</span>
    </span>
    <button
      type="button"
      class="stepper__btn"
      :disabled="busy"
      :aria-label="`Sumar una unidad a ${product.name}`"
      @click="emit('change', 1)"
    >
      <i class="fa-solid fa-plus" aria-hidden="true"></i>
    </button>
  </span>
  <RouterLink v-else :to="{ name: 'AdminProductEdit', params: { id: product._id } }" class="stepper-multi">
    {{ stock }} en {{ product.variants.length }} variantes
  </RouterLink>
</template>

<style scoped lang="scss">
.stepper {
  @include flex(row, center, flex-start, 0);
  position: relative;
  z-index: 2;
  border: 1px solid $line;
  border-radius: $radius-sm;
  background: $frost;

  &.is-busy {
    opacity: 0.55;
  }

  &__btn {
    @include flex(row, center, center);
    width: 2.5rem;
    height: 2.5rem;
    color: $ink-soft;
    font-size: 0.75rem;
    @include focus-ring;

    &:hover:not(:disabled) {
      background: $quartz;
      color: $ink;
    }

    &:disabled {
      opacity: 0.35;
      cursor: default;
    }
  }

  &__value {
    min-width: 2rem;
    text-align: center;
    font-family: $font-mono;
    font-size: 0.95rem;
    font-variant-numeric: tabular-nums;
  }

  &--out &__value {
    color: $danger;
  }
}

.stepper-multi {
  position: relative;
  z-index: 2;
  font-size: 0.82rem;
  text-decoration: underline;
  text-underline-offset: 3px;
  color: $ink-soft;
}
</style>
