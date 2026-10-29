<script setup lang="ts">
// Estados de una lista o vista: cargando (skeleton), error con reintento, o vacío.
withDefaults(
  defineProps<{
    loading?: boolean
    error?: string
    empty?: boolean
    emptyText?: string
    emptyIcon?: string
    /** Forma del skeleton: filas de lista, tarjetas o un formulario. */
    shape?: 'rows' | 'cards' | 'form'
    rows?: number
  }>(),
  { shape: 'rows', rows: 5 },
)
const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <div v-if="loading" class="state-skel" :class="`state-skel--${shape}`" role="status" aria-live="polite">
    <span class="visually-hidden">Cargando…</span>
    <template v-if="shape === 'form'">
      <div class="state-skel__block">
        <span class="skeleton state-skel__title"></span>
        <span v-for="n in 4" :key="n" class="skeleton state-skel__field"></span>
      </div>
      <div class="state-skel__block state-skel__block--side">
        <span class="skeleton state-skel__title"></span>
        <span class="skeleton state-skel__media"></span>
      </div>
    </template>
    <template v-else>
      <div v-for="n in rows" :key="n" class="state-skel__item" aria-hidden="true">
        <span class="skeleton state-skel__thumb"></span>
        <span class="state-skel__lines">
          <span class="skeleton state-skel__line"></span>
          <span class="skeleton state-skel__line state-skel__line--short"></span>
        </span>
      </div>
    </template>
  </div>
  <div v-else-if="error" class="state state--error" role="alert">
    <i class="fa-solid fa-plug-circle-xmark state__icon" aria-hidden="true"></i>
    <p>{{ error }}</p>
    <button type="button" class="btn btn--ghost" @click="emit('retry')">Reintentar</button>
  </div>
  <div v-else-if="empty" class="state">
    <i :class="emptyIcon || 'fa-regular fa-gem'" class="state__icon" aria-hidden="true"></i>
    <p>{{ emptyText || 'No hay nada por aquí todavía.' }}</p>
    <slot />
  </div>
</template>

<style scoped lang="scss">
.state {
  @include flex(column, center, center, 0.7rem);
  padding: 3rem 1.25rem;
  text-align: center;
  color: $ink-soft;
  background: $surface;
  border: 1px dashed $line;
  border-radius: $radius-md;

  &__icon {
    font-size: 1.5rem;
    color: $silver;
  }

  &--error &__icon {
    color: $danger;
  }
}

.state-skel {
  @include flex(column, stretch, flex-start, 0.6rem);

  &--cards {
    @include flex-cards(280px, 0.8rem);
    flex-direction: row;

    .state-skel__item {
      min-height: 9rem;
      align-items: flex-start;
    }
  }

  &--form {
    flex-direction: column;

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
    }
  }

  &__item {
    @include flex(row, center, flex-start, 0.9rem);
    padding: 0.9rem 1rem;
    background: $surface;
    border: 1px solid $line;
    border-radius: $radius-md;
  }

  &__thumb {
    width: 3rem;
    height: 3rem;
    flex-shrink: 0;
  }

  &__lines {
    @include flex(column, stretch, flex-start, 0.45rem);
    flex: 1;
  }

  &__line {
    height: 0.8rem;
    width: 70%;

    &--short {
      width: 40%;
    }
  }

  &__block {
    @include flex(column, stretch, flex-start, 0.9rem);
    flex: 1.6 1 0;
    padding: 1.4rem;
    background: $surface;
    border: 1px solid $line;
    border-radius: $radius-md;

    &--side {
      flex: 1 1 0;
    }
  }

  &__title {
    height: 1.4rem;
    width: 40%;
  }

  &__field {
    height: 3rem;
  }

  &__media {
    aspect-ratio: 1;
    max-height: 14rem;
  }
}
</style>
