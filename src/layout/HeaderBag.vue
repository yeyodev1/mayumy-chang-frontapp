<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()
const bump = ref(false)

// El contador destella con el color de la piedra cada vez que entra una pieza.
let bumpTimer: number | undefined
watch(
  () => cart.lastAddedAt,
  () => {
    bump.value = false
    window.clearTimeout(bumpTimer)
    requestAnimationFrame(() => {
      bump.value = true
      bumpTimer = window.setTimeout(() => (bump.value = false), 700)
    })
  },
)
onBeforeUnmount(() => window.clearTimeout(bumpTimer))
</script>

<template>
  <button type="button" class="hbag" :class="{ 'hbag--bump': bump }" @click="cart.open()">
    <span>Bolsa</span>
    <span class="hbag__count" :aria-label="`${cart.count} piezas en tu bolsa`">{{ cart.count }}</span>
  </button>
</template>

<style scoped lang="scss">
.hbag {
  @include flex(row, center, center, 0.55rem);
  font-family: $font-mono;
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  min-height: 44px;

  &__count {
    @include flex(row, center, center);
    min-width: 1.6rem;
    height: 1.6rem;
    padding-inline: 0.35rem;
    border: 1px solid currentColor;
    border-radius: $radius-pill;
    font-size: 0.7rem;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  &--bump &__count {
    animation: bag-bump 0.7s $ease;
    background: var(--stone);
    border-color: var(--stone);
    color: $frost;
  }
}

@keyframes bag-bump {
  30% {
    transform: scale(1.35);
  }
  100% {
    transform: scale(1);
  }
}
</style>
