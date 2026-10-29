<script setup lang="ts">
const props = defineProps<{ page: number; pages: number; total: number; noun?: string; nounOne?: string }>()
const one = () => props.nounOne || (props.noun || 'resultados').replace(/s$/, '')
const emit = defineEmits<{ go: [page: number] }>()
</script>

<template>
  <nav v-if="total > 0" class="pager" aria-label="Paginación">
    <p class="pager__info">
      {{ total }} {{ total === 1 ? one() : noun || 'resultados' }}
      <span v-if="pages > 1">· página {{ page }} de {{ pages }}</span>
    </p>
    <div v-if="pages > 1" class="pager__buttons">
      <button type="button" class="pager__btn" :disabled="page <= 1" @click="emit('go', page - 1)">
        <i class="fa-solid fa-chevron-left" aria-hidden="true"></i> Anterior
      </button>
      <button type="button" class="pager__btn" :disabled="page >= pages" @click="emit('go', page + 1)">
        Siguiente <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
      </button>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.pager {
  @include flex(row, center, space-between, 0.8rem);
  flex-wrap: wrap;
  margin-top: 1.2rem;

  &__info {
    font-size: $text-sm;
    color: $ink-soft;
    font-variant-numeric: tabular-nums;
  }

  &__buttons {
    @include flex(row, center, flex-end, 0.5rem);
  }

  &__btn {
    @include flex(row, center, center, 0.45rem);
    min-height: 2.75rem;
    padding: 0 1.1rem;
    border-radius: $radius-pill;
    border: 1px solid $line;
    background: $surface;
    font-size: 0.85rem;
    font-weight: 600;
    @include focus-ring;

    &:hover:not(:disabled) {
      border-color: $basalt;
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }
}
</style>
