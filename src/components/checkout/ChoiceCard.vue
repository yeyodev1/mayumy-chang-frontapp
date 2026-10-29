<script setup lang="ts" generic="T extends string">
// Tarjeta-opción (entrega, pago): un radio real con toda la tarjeta como blanco.
defineProps<{ name: string; value: T; icon: string; title: string; text?: string; meta?: string }>()
const model = defineModel<T>({ required: true })
</script>

<template>
  <label class="choice" :class="{ 'is-active': model === value }">
    <input v-model="model" class="visually-hidden" type="radio" :name="name" :value="value" />
    <span class="choice__top">
      <i :class="icon" class="choice__icon" aria-hidden="true"></i>
      <span class="choice__dot" aria-hidden="true"></span>
    </span>
    <span class="choice__title">{{ title }}</span>
    <span v-if="text" class="choice__text">{{ text }}</span>
    <span v-if="meta" class="choice__meta">{{ meta }}</span>
  </label>
</template>

<style scoped lang="scss">
.choice {
  @include flex(column, flex-start, flex-start, 0.2rem);
  position: relative;
  margin: 0;
  padding: 1rem 1.1rem 1.1rem;
  border-radius: $radius-sm;
  background: $frost;
  box-shadow: inset 0 0 0 1px $line;
  font-family: $font-principal;
  font-size: inherit;
  letter-spacing: 0;
  text-transform: none;
  color: $ink;
  cursor: pointer;
  transition:
    box-shadow 0.35s $ease,
    background-color 0.35s $ease;

  &:hover {
    box-shadow: inset 0 0 0 1px $silver;
  }

  &:has(input:focus-visible) {
    outline: 2px solid $ink;
    outline-offset: 3px;
  }

  &.is-active {
    box-shadow: inset 0 0 0 1.5px $basalt;
    background: $surface;
  }

  &__top {
    @include flex(row, center, space-between);
    align-self: stretch;
    margin-bottom: 0.6rem;
  }

  &__icon {
    font-size: 1.05rem;
    color: $ink-soft;
  }

  &__dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    box-shadow: inset 0 0 0 1px $silver;
    transition: box-shadow 0.35s $ease;
  }

  &.is-active &__dot {
    box-shadow: inset 0 0 0 5px $basalt;
  }

  &__title {
    font-family: $font-serif;
    font-size: $text-lg;
    line-height: 1.1;
  }

  &__text {
    font-size: $text-sm;
    color: $ink-soft;
    line-height: 1.35;
  }

  &__meta {
    @include eyebrow;
    margin-top: 0.5rem;
    color: $ink;
  }
}
</style>
