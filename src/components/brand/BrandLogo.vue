<script setup lang="ts">
import { computed } from 'vue'

/**
 * El logo de Luminous Jewelers, vectorizado del original. `lockup` lleva
 * LUMINOUS + JEWELERS; `wordmark` solo LUMINOUS, para tamaños enormes donde
 * la segunda línea sobra. El ancho lo pone quien lo usa; el alto sale solo.
 */
const props = withDefaults(defineProps<{ variant?: 'lockup' | 'wordmark'; label?: string }>(), {
  variant: 'lockup',
})

// Proporciones del trazado (ancho / alto del viewBox de cada SVG).
const ratios = { lockup: 6389 / 1303, wordmark: 6389 / 839 }

const style = computed(() => {
  const url = `url('/brand/luminous-${props.variant}.svg')`
  return { aspectRatio: String(ratios[props.variant]), WebkitMaskImage: url, maskImage: url }
})
</script>

<template>
  <span
    class="blogo"
    :style="style"
    :role="label ? 'img' : undefined"
    :aria-label="label"
    :aria-hidden="label ? undefined : 'true'"
  ></span>
</template>

<style scoped lang="scss">
.blogo {
  display: block;
  background: currentColor;
  -webkit-mask-position: center;
  mask-position: center;
  -webkit-mask-size: contain;
  mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
}
</style>
