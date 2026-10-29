<script setup lang="ts">
// Campo del panel: label, el control (slot), una ayuda corta y el error si lo hay.
defineProps<{ id: string; label: string; hint?: string; error?: string; wide?: boolean }>()
</script>

<template>
  <div class="afield" :class="{ 'afield--wide': wide, 'afield--error': error }">
    <label :for="id">{{ label }}</label>
    <slot />
    <small v-if="error" class="afield__error" role="alert">{{ error }}</small>
    <small v-else-if="hint" class="afield__hint">{{ hint }}</small>
  </div>
</template>

<style scoped lang="scss">
.afield {
  @include flex(column, stretch, flex-start, 0);
  flex: 1 1 13rem;
  min-width: 0;

  &--wide {
    flex-basis: 100%;
  }

  &__hint,
  &__error {
    margin-top: 0.3rem;
    font-size: 0.78rem;
    line-height: 1.4;
    color: $ink-muted;
  }

  &__error {
    color: $danger;
  }

  &--error :deep(input),
  &--error :deep(select) {
    border-color: $danger;
  }
}
</style>
