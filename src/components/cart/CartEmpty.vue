<script setup lang="ts">
import HeptagonMark from '@/components/brand/HeptagonMark.vue'
import { site } from '@/config/site'

const emit = defineEmits<{ navigate: [] }>()
const copy = site.bag
</script>

<template>
  <div class="bempty">
    <HeptagonMark class="bempty__mark" size="64px" :stroke="1.2" />
    <h3 class="bempty__title">{{ copy.empty }}</h3>
    <p class="bempty__text">{{ copy.emptyText }}</p>
    <RouterLink :to="{ name: 'Shop' }" class="btn btn--primary" @click="emit('navigate')">{{ copy.emptyCta }}</RouterLink>
  </div>
</template>

<style scoped lang="scss">
.bempty {
  @include flex(column, center, center, 0.8rem);
  flex: 1;
  text-align: center;
  padding: 3rem 1.5rem;

  &__mark {
    color: $silver;
    margin-bottom: 0.6rem;
  }

  &__title {
    @include display($display-sm);
  }

  &__text {
    max-width: 22rem;
    color: $ink-soft;
    margin-bottom: 0.6rem;
  }
}
</style>
