<script setup lang="ts">
defineProps<{ modelValue: boolean; label: string; busy?: boolean; showLabel?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>

<template>
  <button
    type="button"
    role="switch"
    class="switch"
    :class="{ 'switch--on': modelValue, 'switch--busy': busy }"
    :aria-checked="modelValue"
    :aria-label="showLabel ? undefined : label"
    :disabled="busy"
    @click="emit('update:modelValue', !modelValue)"
  >
    <span class="switch__track" aria-hidden="true"><span class="switch__thumb"></span></span>
    <span v-if="showLabel" class="switch__label">{{ label }}</span>
  </button>
</template>

<style scoped lang="scss">
.switch {
  @include flex(row, center, flex-start, 0.6rem);
  min-height: 2.75rem;
  border-radius: $radius-sm;
  position: relative;
  z-index: 2;
  @include focus-ring;

  &__track {
    @include flex(row, center, flex-start);
    width: 2.75rem;
    height: 1.55rem;
    padding: 0.15rem;
    border-radius: $radius-pill;
    background: $quartz-deep;
    box-shadow: inset 0 0 0 1px $line;
    transition: background-color 0.2s ease;
  }

  &__thumb {
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    background: $surface;
    box-shadow: 0 1px 3px rgba($basalt, 0.3);
    transition: transform 0.22s $ease;
  }

  &--on &__track {
    background: $basalt;
    box-shadow: none;
  }

  &--on &__thumb {
    transform: translateX(1.2rem);
  }

  &--busy {
    opacity: 0.6;
    cursor: progress;
  }

  &__label {
    font-size: 0.92rem;
    font-weight: 500;
    color: $ink;
    text-align: left;
  }
}
</style>
