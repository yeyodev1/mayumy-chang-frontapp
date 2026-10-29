<script setup lang="ts">
/**
 * El diamante de Luminous (la "O" del logo). Se pinta como máscara sobre
 * currentColor: hereda el color del contexto igual que un icono, y el SVG
 * queda en caché en vez de viajar dentro del JS.
 */
// Sin `color`, el inline no lo fija y una clase del padre puede pintarlo.
withDefaults(defineProps<{ size?: string; color?: string }>(), { size: '48px' })
</script>

<template>
  <span class="bmark" :style="{ width: size, height: size, color }" aria-hidden="true"></span>
</template>

<style scoped lang="scss">
.bmark {
  display: block;
  flex-shrink: 0;
  background: currentColor;
  -webkit-mask: url('/brand/luminous-mark.svg') center / contain no-repeat;
  mask: url('/brand/luminous-mark.svg') center / contain no-repeat;
}
</style>
