<script setup lang="ts">
/**
 * La firma visual de la marca: siete baguettes formando un heptágono abierto,
 * como la línea Heptágono. Cada baguette es un <rect> para poder encenderlas
 * una por una (cortina de página, hero, separadores).
 */
withDefaults(defineProps<{ size?: string; color?: string; stroke?: number }>(), {
  size: '48px',
  color: 'currentColor',
  stroke: 1,
})

const R = 40
// Ángulo central de cada lado y su punto medio, empezando arriba.
const sides = Array.from({ length: 7 }, (_, i) => {
  const a1 = (-90 + (360 / 7) * i) * (Math.PI / 180)
  const a2 = (-90 + (360 / 7) * (i + 1)) * (Math.PI / 180)
  const x1 = 50 + R * Math.cos(a1)
  const y1 = 50 + R * Math.sin(a1)
  const x2 = 50 + R * Math.cos(a2)
  const y2 = 50 + R * Math.sin(a2)
  const cx = (x1 + x2) / 2
  const cy = (y1 + y2) / 2
  const len = Math.hypot(x2 - x1, y2 - y1)
  const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI
  return { cx, cy, len, angle, x1, y1 }
})
</script>

<template>
  <svg class="hepta" :style="{ width: size, height: size }" viewBox="0 0 100 100" aria-hidden="true">
    <g :stroke="color" :stroke-width="stroke" fill="none">
      <rect
        v-for="(s, i) in sides"
        :key="i"
        class="hepta__stone"
        :x="s.cx - s.len * 0.36"
        :y="s.cy - 4.2"
        :width="s.len * 0.72"
        height="8.4"
        rx="0.6"
        :transform="`rotate(${s.angle} ${s.cx} ${s.cy})`"
      />
    </g>
    <g :fill="color">
      <circle v-for="(s, i) in sides" :key="'p' + i" class="hepta__prong" :cx="s.x1" :cy="s.y1" r="1.6" />
    </g>
  </svg>
</template>

<style scoped lang="scss">
.hepta {
  display: block;
  overflow: visible;
}
</style>
