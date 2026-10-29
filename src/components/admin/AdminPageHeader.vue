<script setup lang="ts">
defineProps<{ title: string; eyebrow?: string; subtitle?: string; back?: string }>()
</script>

<template>
  <header class="page-head">
    <div class="page-head__text">
      <RouterLink v-if="back" :to="back" class="page-head__back">
        <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Volver
      </RouterLink>
      <p v-if="eyebrow" class="page-head__eyebrow">{{ eyebrow }}</p>
      <h1 class="page-head__title">{{ title }}</h1>
      <p v-if="subtitle" class="page-head__sub">{{ subtitle }}</p>
    </div>
    <div v-if="$slots.default" class="page-head__actions">
      <slot />
    </div>
  </header>
</template>

<style scoped lang="scss">
.page-head {
  @include flex(row, flex-end, space-between, 1rem);
  flex-wrap: wrap;
  margin-bottom: 1.4rem;

  &__text {
    @include flex(column, flex-start, flex-start, 0.3rem);
    min-width: 0;
  }

  &__back {
    @include flex(row, center, flex-start, 0.4rem);
    margin-bottom: 0.4rem;
    font-family: $font-mono;
    font-size: $text-xs;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: $ink-soft;
    @include focus-ring;

    &:hover {
      color: $ink;
    }
  }

  &__eyebrow {
    @include eyebrow;
    color: $ink-muted;
  }

  &__title {
    @include display($display-sm);
    color: $ink;
    overflow-wrap: anywhere;
  }

  &__sub {
    max-width: 46rem;
    color: $ink-soft;
    font-size: $text-sm;
  }

  &__actions {
    @include flex(row, center, flex-end, 0.6rem);
    flex-wrap: wrap;
  }
}

@media print {
  .page-head__back,
  .page-head__actions {
    display: none;
  }
}
</style>
