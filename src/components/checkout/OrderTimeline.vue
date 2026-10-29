<script setup lang="ts">
import { computed } from 'vue'
import { ORDER_STATUS } from '@/utils/orderStatus'
import type { OrderStatus, PaymentMethod } from '@/types'

const props = defineProps<{ status: OrderStatus; method?: 'delivery' | 'pickup'; payment?: PaymentMethod }>()

// Con transferencia no hay "Pago recibido" automático: el primer paso es el pedido por aprobar.
const flow = computed<OrderStatus[]>(() =>
  props.payment === 'transfer' ? ['review', 'preparing', 'shipped', 'delivered'] : ['paid', 'preparing', 'shipped', 'delivered'],
)
const current = computed(() => flow.value.indexOf(props.status))
// Esperando el pago (tarjeta), cancelado o fallido: no hay línea de tiempo que mostrar.
const offFlow = computed(() => current.value === -1)

function label(s: OrderStatus) {
  if (s === 'preparing') return 'En el taller'
  if (props.method === 'pickup' && s === 'shipped') return 'Lista para retirar'
  if (props.method === 'pickup' && s === 'delivered') return 'Retirada'
  if (s === 'shipped') return 'Con Servientrega'
  return ORDER_STATUS[s].customerLabel
}
</script>

<template>
  <p v-if="offFlow" class="otl__banner" :class="`otl__banner--${status}`">
    <i :class="ORDER_STATUS[status].icon" aria-hidden="true"></i>
    {{ ORDER_STATUS[status].customerLabel }}
  </p>
  <ol v-else class="otl" aria-label="Estado del pedido">
    <li
      v-for="(s, i) in flow"
      :key="s"
      class="otl__step"
      :class="{ 'is-done': i < current, 'is-current': i === current }"
      :style="{ '--i': i }"
      :aria-current="i === current ? 'step' : undefined"
    >
      <span class="otl__dot" aria-hidden="true"></span>
      <span class="otl__num">0{{ i + 1 }}</span>
      <span class="otl__label">{{ label(s) }}</span>
    </li>
  </ol>
</template>

<style scoped lang="scss">
.otl {
  @include flex(column, stretch, flex-start, 0);
  list-style: none;

  @include from('md') {
    flex-direction: row;
  }

  &__step {
    position: relative;
    @include flex(row, baseline, flex-start, 0.9rem);
    flex: 1;
    padding: 0 0 1.4rem 1.8rem;
    color: $ink-muted;
    animation: otl-in 0.8s $ease both;
    animation-delay: calc(var(--i) * 0.1s);

    @include from('md') {
      flex-direction: column;
      gap: 0.3rem;
      padding: 1.8rem 1rem 0 0;
    }

    // Hilo que une los pasos: se "llena" en basalto hasta el paso actual.
    &:not(:last-child)::before {
      content: '';
      position: absolute;
      left: 5px;
      top: 14px;
      bottom: -2px;
      width: 1px;
      background: $line;

      @include from('md') {
        left: 14px;
        right: 0;
        top: 5px;
        bottom: auto;
        width: auto;
        height: 1px;
      }
    }

    &.is-done::before {
      background: $basalt;
    }

    &.is-done,
    &.is-current {
      color: $ink;
    }
  }

  &__dot {
    position: absolute;
    left: 0;
    top: 4px;
    width: 11px;
    height: 11px;
    transform: rotate(45deg);
    box-shadow: inset 0 0 0 1px $silver;
    background: $frost;

    @include from('md') {
      top: 0;
    }
  }

  .is-done &__dot {
    background: $basalt;
    box-shadow: none;
  }

  .is-current &__dot {
    background: var(--stone);
    box-shadow: 0 0 0 5px color-mix(in srgb, var(--stone) 18%, transparent);
  }

  &__num {
    @include eyebrow;
    color: inherit;
    opacity: 0.7;
  }

  &__label {
    font-family: $font-serif;
    font-size: $text-xl;
    line-height: 1.1;
  }

  &__banner {
    @include flex(row, center, flex-start, 0.7rem);
    padding: 1rem 1.1rem;
    border-left: 2px solid $silver;
    background: $quartz-deep;
    font-family: $font-serif;
    font-size: $text-xl;

    i {
      font-size: 1rem;
      color: $ink-soft;
    }

    &--failed,
    &--canceled {
      border-color: $danger;
    }
  }
}

@keyframes otl-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
}
</style>
