<script setup lang="ts">
import type { Stone } from '@/types'
import { STONES } from '../adminCatalog'

const model = defineModel<Stone>({ required: true })
</script>

<template>
  <fieldset class="stones">
    <legend>Piedra</legend>
    <div class="stones__list" role="radiogroup" aria-label="Piedra">
      <button
        v-for="s in STONES"
        :key="s.id"
        type="button"
        role="radio"
        class="stones__item"
        :class="{ 'is-on': model === s.id }"
        :aria-checked="model === s.id"
        @click="model = s.id"
      >
        <span
          class="stones__swatch"
          :class="{ 'stones__swatch--none': s.id === 'ninguna' }"
          :style="{ background: s.color }"
          aria-hidden="true"
        ></span>
        {{ s.name }}
      </button>
    </div>
  </fieldset>
</template>

<style scoped lang="scss">
.stones {
  border: 0;
  min-width: 0;

  legend {
    @include eyebrow;
    margin-bottom: 0.4rem;
  }

  &__list {
    @include flex(row, center, flex-start, 0.4rem);
    flex-wrap: wrap;
  }

  &__item {
    @include flex(row, center, flex-start, 0.5rem);
    min-height: 2.6rem;
    padding: 0 0.85rem 0 0.55rem;
    border: 1px solid $line;
    border-radius: $radius-pill;
    background: $frost;
    font-size: 0.88rem;
    color: $ink-soft;
    @include focus-ring;

    &:hover {
      border-color: $basalt;
    }

    &.is-on {
      border-color: $basalt;
      color: $ink;
      box-shadow: inset 0 0 0 1px $basalt;
    }
  }

  &__swatch {
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 50%;
    box-shadow: inset 0 0 0 1px rgba($basalt, 0.15);

    &--none {
      border: 1px dashed $ink-muted;
      box-shadow: none;
    }
  }
}
</style>
