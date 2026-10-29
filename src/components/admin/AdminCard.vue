<script setup lang="ts">
defineProps<{ title?: string; icon?: string }>()
</script>

<template>
  <section class="acard">
    <header v-if="title || $slots.head" class="acard__head">
      <h2 class="acard__title">
        <i v-if="icon" :class="icon" aria-hidden="true"></i>
        {{ title }}
      </h2>
      <slot name="head" />
    </header>
    <slot />
  </section>
</template>

<style scoped lang="scss">
.acard {
  background: $surface;
  border: 1px solid $line;
  border-radius: $radius-md;
  padding: 1.15rem 1.1rem;
  min-width: 0;

  @include from('md') {
    padding: 1.4rem 1.5rem;
  }

  &__head {
    @include flex(row, center, space-between, 0.8rem);
    margin-bottom: 1rem;
  }

  &__title {
    @include flex(row, baseline, flex-start, 0.6rem);
    font-family: $font-serif;
    font-weight: 400;
    font-size: 1.4rem;
    line-height: 1.1;
    color: $ink;

    i {
      color: $silver;
      font-size: 0.85rem;
    }
  }

  @media print {
    border: 1px solid #bbb;
    break-inside: avoid;
    padding: 0.8rem 1rem;
  }
}
</style>
