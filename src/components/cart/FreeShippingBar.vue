<script setup lang="ts">
import { computed } from 'vue'
import { useStoreConfig } from '@/composables/useStoreConfig'
import { formatCents } from '@/utils/format'
import { fill } from '@/config/site'

// TODO coordinador: mover a site.bag.
const copy = { missing: 'Te faltan {amount} para el envío gratis', done: 'Tu envío es gratis' }

// Solo existe si el panel define un monto de envío gratis (freeFromCents > 0).
const props = defineProps<{ subtotalCents: number }>()
const { config } = useStoreConfig()
const goal = computed(() => config.value.shipping.freeFromCents)
const missing = computed(() => Math.max(0, goal.value - props.subtotalCents))
const pct = computed(() => Math.min(100, (props.subtotalCents / Math.max(1, goal.value)) * 100))
</script>

<template>
  <div v-if="goal > 0" class="fship" :class="{ 'is-done': missing === 0 }">
    <p class="fship__text" aria-live="polite">
      {{ missing > 0 ? fill(copy.missing, { amount: formatCents(missing) }) : copy.done }}
    </p>
    <div class="fship__track" role="progressbar" :aria-valuenow="Math.round(pct)" aria-valuemin="0" aria-valuemax="100" :aria-label="copy.done">
      <span class="fship__fill" :style="{ transform: `scaleX(${pct / 100})` }"></span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.fship {
  @include flex(column, stretch, flex-start, 0.5rem);

  &__text {
    @include eyebrow;
  }

  &__track {
    position: relative;
    height: 2px;
    background: $line;
    overflow: hidden;
  }

  &__fill {
    position: absolute;
    inset: 0;
    background: $basalt;
    transform-origin: left center;
    transition: transform 0.9s $ease;
  }

  &.is-done &__fill {
    background: var(--stone);
  }
}
</style>
