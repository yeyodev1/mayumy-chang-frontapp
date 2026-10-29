<script setup lang="ts">
import { site } from '@/config/site'

defineProps<{ tone?: 'dark' | 'light' }>()
</script>

<template>
  <ol class="bsteps" :class="`bsteps--${tone ?? 'dark'}`">
    <li v-for="(step, i) in site.bespoke.steps" :key="step.title" class="bsteps__item" data-reveal>
      <span class="bsteps__num">{{ String(i + 1).padStart(2, '0') }}</span>
      <div>
        <p class="bsteps__title">{{ step.title }}</p>
        <p class="bsteps__text">{{ step.text }}</p>
      </div>
    </li>
  </ol>
</template>

<style scoped lang="scss">
.bsteps {
  list-style: none;
  @include flex(column, stretch);

  &__item {
    @include flex(row, flex-start, flex-start, 1.2rem);
    padding-block: 1.1rem;
    border-top: 1px solid rgba($quartz, 0.18);
  }

  &--light &__item {
    border-top-color: $line;
  }

  &__num {
    font-family: $font-mono;
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    padding-top: 0.35rem;
    opacity: 0.7;
  }

  &__title {
    font-family: $font-serif;
    font-size: $text-xl;
    line-height: 1.15;
    margin-bottom: 0.25rem;
  }

  &__text {
    font-size: $text-sm;
    opacity: 0.75;
    max-width: 36ch;
  }
}
</style>
