<script setup lang="ts">
defineProps<{ id: string; label: string; error?: string; hint?: string; optional?: boolean }>()
</script>

<template>
  <div class="cfield" :class="{ 'has-error': error }">
    <label :for="id" class="cfield__label">
      {{ label }} <span v-if="optional" class="cfield__opt">· opcional</span>
    </label>
    <slot :describedby="error ? `${id}-error` : hint ? `${id}-hint` : undefined" :invalid="Boolean(error)" />
    <Transition name="cfield-msg" mode="out-in">
      <p v-if="error" :id="`${id}-error`" key="e" class="cfield__error">{{ error }}</p>
      <p v-else-if="hint" :id="`${id}-hint`" key="h" class="cfield__hint">{{ hint }}</p>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.cfield {
  @include flex(column, stretch, flex-start, 0);
  min-width: 0;

  &__label {
    margin-bottom: 0.45rem;
  }

  &__opt {
    text-transform: none;
    letter-spacing: 0;
    color: $ink-muted;
  }

  :deep(input),
  :deep(select),
  :deep(textarea) {
    min-height: 50px;
    background: $frost;
    border-color: $line;
  }

  :deep(textarea) {
    resize: vertical;
    min-height: 88px;
  }

  &.has-error :deep(input),
  &.has-error :deep(select),
  &.has-error :deep(textarea) {
    border-color: $danger;
    box-shadow: inset 2px 0 0 $danger;
  }

  &__error,
  &__hint {
    margin-top: 0.4rem;
    font-size: $text-sm;
    line-height: 1.4;
  }

  &__error {
    color: $danger;
  }

  &__hint {
    color: $ink-muted;
  }
}

.cfield-msg-enter-active,
.cfield-msg-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.3s $ease;
}

.cfield-msg-enter-from,
.cfield-msg-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
