<script setup lang="ts">
import { computed } from 'vue'
import type { OrderStatus } from '@/types'
import { ORDER_STATUS } from '@/utils/orderStatus'

const props = defineProps<{ status: OrderStatus; large?: boolean }>()
const meta = computed(() => ORDER_STATUS[props.status])
</script>

<template>
  <span
    class="pill"
    :class="{ 'pill--large': large }"
    :style="{ background: meta?.bg, color: meta?.fg }"
  >
    <i :class="meta?.icon" aria-hidden="true"></i>
    {{ meta?.label || status }}
  </span>
</template>

<style scoped lang="scss">
.pill {
  @include flex(row, center, flex-start, 0.4rem);
  display: inline-flex;
  padding: 0.25rem 0.7rem;
  border-radius: $radius-pill;
  font-size: 0.78rem;
  font-weight: 700;
  white-space: nowrap;
  line-height: 1.4;

  i {
    font-size: 0.72rem;
  }

  &--large {
    padding: 0.45rem 1rem;
    font-size: 0.9rem;

    i {
      font-size: 0.85rem;
    }
  }

  @media print {
    border: 1px solid currentColor;
  }
}
</style>
