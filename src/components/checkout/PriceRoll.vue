<script setup lang="ts">
// Un monto que cambia rueda hacia arriba: el ojo nota el cambio sin sobresalto.
defineProps<{ value: string }>()
</script>

<template>
  <span class="roll">
    <Transition name="roll" mode="out-in">
      <span :key="value" class="roll__value">{{ value }}</span>
    </Transition>
  </span>
</template>

<style scoped lang="scss">
.roll {
  display: inline-flex;
  overflow: hidden;
  vertical-align: bottom;
  font-variant-numeric: tabular-nums;

  &__value {
    display: inline-block;
  }
}

.roll-enter-active {
  transition:
    transform 0.45s $ease,
    opacity 0.45s $ease;
}

.roll-leave-active {
  transition:
    transform 0.2s ease-in,
    opacity 0.2s ease-in;
}

.roll-enter-from {
  transform: translateY(70%);
  opacity: 0;
}

.roll-leave-to {
  transform: translateY(-70%);
  opacity: 0;
}
</style>
