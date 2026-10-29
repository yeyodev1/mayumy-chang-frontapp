<script setup lang="ts">
import type { AdminCategory } from '@/types'
import AdminSwitch from '@/components/admin/AdminSwitch.vue'

defineProps<{ category: AdminCategory; busy: boolean; first: boolean; last: boolean; position: number }>()
const emit = defineEmits<{ up: []; down: []; edit: []; remove: []; visible: [value: boolean] }>()
</script>

<template>
  <article class="crow" :class="{ 'crow--hidden': !category.isVisible }">
    <div class="crow__order">
      <button type="button" class="crow__icon" :disabled="first || busy" :aria-label="`Subir ${category.name}`" @click="emit('up')">
        <i class="fa-solid fa-chevron-up" aria-hidden="true"></i>
      </button>
      <span class="crow__pos" aria-hidden="true">{{ String(position).padStart(2, '0') }}</span>
      <button type="button" class="crow__icon" :disabled="last || busy" :aria-label="`Bajar ${category.name}`" @click="emit('down')">
        <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
      </button>
    </div>

    <div class="crow__text">
      <strong class="crow__name">{{ category.name }}</strong>
      <span class="crow__meta">
        {{ category.slug }} · {{ category.productCount }} {{ category.productCount === 1 ? 'pieza' : 'piezas' }}
      </span>
      <span v-if="category.blurb" class="crow__blurb">{{ category.blurb }}</span>
    </div>

    <div class="crow__actions">
      <AdminSwitch
        :model-value="category.isVisible"
        :label="category.isVisible ? 'Visible' : 'Oculta'"
        :busy="busy"
        show-label
        @update:model-value="emit('visible', $event)"
      />
      <button type="button" class="crow__btn" :disabled="busy" @click="emit('edit')">
        <i class="fa-solid fa-pen" aria-hidden="true"></i> Editar
      </button>
      <button type="button" class="crow__icon crow__icon--danger" :disabled="busy" :aria-label="`Eliminar ${category.name}`" @click="emit('remove')">
        <i class="fa-solid fa-trash-can" aria-hidden="true"></i>
      </button>
    </div>
  </article>
</template>

<style scoped lang="scss">
.crow {
  @include flex(row, center, flex-start, 0.9rem);
  flex-wrap: wrap;
  padding: 0.8rem 1rem;
  background: $frost;
  border: 1px solid $line;
  border-radius: $radius-md;

  &--hidden {
    background: $quartz;

    .crow__name {
      color: $ink-muted;
    }
  }

  &__order {
    @include flex(column, center, center, 0);
  }

  &__pos {
    font-family: $font-mono;
    font-size: 0.7rem;
    color: $ink-muted;
  }

  &__icon {
    @include flex(row, center, center);
    width: 2.4rem;
    height: 2rem;
    border-radius: $radius-sm;
    color: $ink-soft;
    @include focus-ring;

    &:disabled {
      opacity: 0.25;
      cursor: default;
    }

    &:not(:disabled):hover {
      background: $quartz;
    }

    &--danger {
      height: 2.75rem;
      width: 2.75rem;
      color: $danger;
    }
  }

  &__text {
    @include flex(column, flex-start, flex-start, 0.15rem);
    flex: 1 1 12rem;
    min-width: 0;
  }

  &__name {
    font-family: $font-serif;
    font-weight: 400;
    font-size: 1.35rem;
    line-height: 1.1;
  }

  &__meta {
    font-family: $font-mono;
    font-size: 0.72rem;
    color: $ink-muted;
  }

  &__blurb {
    color: $ink-soft;
    font-size: $text-sm;
  }

  &__actions {
    @include flex(row, center, flex-end, 0.4rem);
    margin-left: auto;
  }

  &__btn {
    @include flex(row, center, center, 0.45rem);
    min-height: 2.75rem;
    padding: 0 0.9rem;
    border: 1px solid $line;
    border-radius: $radius-sm;
    font-size: 0.86rem;
    @include focus-ring;

    &:hover:not(:disabled) {
      border-color: $basalt;
    }
  }
}
</style>
