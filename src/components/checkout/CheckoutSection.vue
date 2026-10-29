<script setup lang="ts">
// Bloque numerado del checkout: la clienta ve de un vistazo cuánto falta.
defineProps<{ num: string; title: string }>()
</script>

<template>
  <fieldset class="csec">
    <legend class="csec__legend">
      <span class="csec__num">{{ num }}</span>
      <span class="csec__title">{{ title }}</span>
    </legend>
    <div class="csec__body">
      <slot />
    </div>
  </fieldset>
</template>

<style scoped lang="scss">
.csec {
  border: 0;
  min-width: 0;
  padding-top: 1.6rem;
  border-top: 1px solid $line;

  &__legend {
    @include flex(row, baseline, flex-start, 0.9rem);
    float: left;
    width: 100%;
    margin-bottom: 1.4rem;
  }

  &__num {
    @include eyebrow;
    color: $ink-muted;
  }

  &__title {
    @include display($text-xl);
  }

  &__body {
    clear: both;
    @include flex(column, stretch, flex-start, 1.1rem);
  }

  // Filas de dos campos desde tablet.
  :deep(.csec__row) {
    @include flex(column, stretch, flex-start, 1.1rem);

    > * {
      flex: 1 1 0;
    }

    @include from('md') {
      flex-direction: row;
    }
  }
}
</style>
