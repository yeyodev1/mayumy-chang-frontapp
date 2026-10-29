<script setup lang="ts">
import { computed } from 'vue'
import type { OrderStatus } from '@/types'
import { ORDER_STATUS, ORDER_STATUS_ORDER } from '@/utils/orderStatus'

const model = defineModel<string>({ required: true })
const props = defineProps<{ counts?: Partial<Record<OrderStatus, number>> | null }>()

const allCount = computed(() =>
  props.counts ? Object.values(props.counts).reduce((a, b) => a + (b || 0), 0) : null,
)
</script>

<template>
  <div class="chips" role="group" aria-label="Filtrar por estado">
    <button
      type="button"
      class="chips__chip"
      :class="{ 'chips__chip--on': !model }"
      :aria-pressed="!model"
      @click="model = ''"
    >
      Todos
      <span v-if="allCount !== null" class="chips__count">{{ allCount }}</span>
    </button>
    <button
      v-for="status in ORDER_STATUS_ORDER"
      :key="status"
      type="button"
      class="chips__chip"
      :class="{ 'chips__chip--on': model === status }"
      :aria-pressed="model === status"
      @click="model = model === status ? '' : status"
    >
      <span class="chips__dot" :style="{ background: ORDER_STATUS[status].solid }" aria-hidden="true"></span>
      {{ ORDER_STATUS[status].label }}
      <span v-if="counts" class="chips__count">{{ counts[status] ?? 0 }}</span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.chips {
  @include flex(row, center, flex-start, 0.45rem);
  overflow-x: auto;
  scrollbar-width: none;
  margin-inline: -1rem;
  padding: 0.2rem 1rem 0.4rem;

  &::-webkit-scrollbar {
    display: none;
  }

  @include from('md') {
    flex-wrap: wrap;
    overflow: visible;
    margin-inline: 0;
    padding-inline: 0;
  }

  &__chip {
    @include flex(row, center, center, 0.45rem);
    flex-shrink: 0;
    min-height: 2.5rem;
    padding: 0 0.95rem;
    border-radius: $radius-pill;
    border: 1px solid $line;
    background: $surface;
    font-size: 0.85rem;
    font-weight: 600;
    color: $ink-soft;
    white-space: nowrap;
    transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
    @include focus-ring;

    &:hover {
      border-color: $basalt;
      color: $basalt;
    }

    &--on {
      background: $basalt;
      border-color: $basalt;
      color: $frost;

      &:hover {
        color: $frost;
      }

      .chips__count {
        background: rgba($frost, 0.16);
        color: $frost;
      }
    }
  }

  &__dot {
    width: 0.55rem;
    height: 0.55rem;
    border-radius: 50%;
  }

  &__count {
    min-width: 1.4rem;
    padding: 0 0.35rem;
    border-radius: $radius-pill;
    background: $quartz;
    color: $ink;
    font-size: 0.72rem;
    font-weight: 800;
    line-height: 1.35rem;
    text-align: center;
    font-variant-numeric: tabular-nums;
  }
}
</style>
