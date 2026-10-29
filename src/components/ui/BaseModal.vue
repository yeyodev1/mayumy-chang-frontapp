<script setup lang="ts">
import { ref, toRef } from 'vue'
import { useBodyScroll } from '@/composables/useBodyScroll'
import { useFocusTrap } from '@/composables/useFocusTrap'

const props = defineProps<{
  open: boolean
  title: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
}>()

const emit = defineEmits<{ confirm: []; cancel: [] }>()
const box = ref<HTMLElement | null>(null)
const open = toRef(props, 'open')

useBodyScroll(open)
useFocusTrap(box, open, () => emit('cancel'))
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal" @click.self="emit('cancel')">
        <div ref="box" class="modal__box" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <p class="modal__eyebrow" :class="{ 'modal__eyebrow--danger': danger }">[ {{ danger ? 'Atención' : 'Confirmar' }} ]</p>
          <h3 id="modal-title" class="modal__title">{{ title }}</h3>
          <p v-if="message" class="modal__message">{{ message }}</p>
          <slot />
          <div class="modal__actions">
            <button type="button" class="btn btn--ghost" data-autofocus @click="emit('cancel')">
              {{ cancelLabel || 'Cancelar' }}
            </button>
            <button type="button" class="btn" :class="danger ? 'btn--danger' : 'btn--primary'" @click="emit('confirm')">
              {{ confirmLabel || 'Confirmar' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.modal {
  position: fixed;
  inset: 0;
  z-index: 200;
  @include flex(row, center, center);
  padding: 1rem;
  background: rgba($basalt, 0.45);
  backdrop-filter: blur(4px);

  &__box {
    @include flex(column, flex-start, flex-start, 0.7rem);
    width: 100%;
    max-width: 440px;
    padding: 2rem 1.8rem 1.6rem;
    background: $quartz;
    box-shadow: $shadow-lg;
  }

  &__eyebrow {
    @include eyebrow;

    &--danger {
      color: $danger;
    }
  }

  &__title {
    @include display($display-sm);
  }

  &__message {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__actions {
    @include flex(row, center, flex-end, 0.6rem);
    flex-wrap: wrap;
    align-self: stretch;
    margin-top: 1rem;
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.35s ease;

  .modal__box {
    transition: transform 0.6s $ease;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .modal__box {
    transform: translateY(16px);
  }
}
</style>
