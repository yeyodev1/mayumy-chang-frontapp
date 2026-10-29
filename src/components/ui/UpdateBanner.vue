<script setup lang="ts">
import { site } from '@/config/site'
import { useAppUpdate } from '@/composables/useAppUpdate'

const { updateAvailable, reload } = useAppUpdate()
</script>

<template>
  <Transition name="update">
    <div v-if="updateAvailable" class="update" role="status">
      <span class="update__text">{{ site.update.text }}</span>
      <button type="button" class="update__btn" @click="reload">{{ site.update.action }}</button>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.update {
  @include flex(row, center, flex-start, 1rem);
  position: fixed;
  top: 1rem;
  left: 50%;
  z-index: 400;
  transform: translateX(-50%);
  width: max-content;
  max-width: calc(100vw - 2rem);
  padding: 0.5rem 0.5rem 0.5rem 1.1rem;
  background: $basalt;
  color: $quartz;
  font-size: $text-sm;
  box-shadow: $shadow-md;

  &__text {
    min-width: 0;
  }

  &__btn {
    @include eyebrow;
    flex-shrink: 0;
    min-height: 40px;
    padding: 0 1rem;
    background: $quartz;
    color: $basalt;
    @include focus-ring($quartz);
  }
}

.update-enter-active,
.update-leave-active {
  transition:
    opacity 0.4s ease,
    transform 0.6s $ease;
}

.update-enter-from,
.update-leave-to {
  opacity: 0;
  transform: translate(-50%, -0.8rem);
}
</style>
