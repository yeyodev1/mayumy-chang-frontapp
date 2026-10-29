<script setup lang="ts">
const model = defineModel<string>({ required: true })
defineProps<{ label: string; placeholder?: string }>()
const id = `search-${Math.random().toString(36).slice(2, 8)}`
</script>

<template>
  <div class="search" role="search">
    <label :for="id" class="visually-hidden">{{ label }}</label>
    <i class="fa-solid fa-magnifying-glass search__icon" aria-hidden="true"></i>
    <input :id="id" v-model="model" type="search" class="search__input" :placeholder="placeholder || label" autocomplete="off" />
    <button v-if="model" type="button" class="search__clear" aria-label="Borrar búsqueda" @click="model = ''">
      <i class="fa-solid fa-xmark" aria-hidden="true"></i>
    </button>
  </div>
</template>

<style scoped lang="scss">
.search {
  position: relative;
  flex: 1 1 260px;
  min-width: 0;

  &__icon {
    position: absolute;
    left: 0.95rem;
    top: 50%;
    transform: translateY(-50%);
    color: $ink-muted;
    font-size: 0.9rem;
    pointer-events: none;
  }

  &__input {
    padding-left: 2.6rem;
    padding-right: 2.6rem;
    min-height: 2.9rem;
    border-radius: $radius-sm;

    &::-webkit-search-cancel-button {
      appearance: none;
    }
  }

  &__clear {
    position: absolute;
    right: 0.3rem;
    top: 50%;
    transform: translateY(-50%);
    @include flex(row, center, center);
    width: 2.3rem;
    height: 2.3rem;
    border-radius: 50%;
    color: $ink-soft;
    @include focus-ring;

    &:hover {
      background: $quartz;
    }
  }
}
</style>
