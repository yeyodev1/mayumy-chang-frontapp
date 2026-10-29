<script setup lang="ts">
import { useToastStore } from '@/stores/toast'
import { useCartStore } from '@/stores/cart'

const toastStore = useToastStore()
// Con la bolsa abierta los avisos se apartan: nunca tapan el botón de compra.
const cart = useCartStore()

// TODO coordinador: mover a site.ts si se quiere editar.
const labels: Record<string, string> = {
  success: 'Listo',
  error: 'Atención',
  info: 'Aviso',
}
</script>

<template>
  <Teleport to="body">
    <div class="toasts" :class="{ 'toasts--bag': cart.isOpen }" aria-live="polite">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toastStore.toasts"
          :key="toast.id"
          class="toasts__item"
          :class="`toasts__item--${toast.type}`"
          :role="toast.type === 'error' ? 'alert' : 'status'"
        >
          <span class="toasts__label">[ {{ labels[toast.type] }} ]</span>
          <span class="toasts__msg">{{ toast.message }}</span>
          <button type="button" class="toasts__close" aria-label="Cerrar aviso" @click="toastStore.dismiss(toast.id)">
            <i class="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.toasts {
  position: fixed;
  left: 1rem;
  right: 1rem;
  bottom: calc(1rem + env(safe-area-inset-bottom));
  z-index: 300;
  @include flex(column, stretch, flex-end, 0.6rem);
  pointer-events: none;

  @include from('md') {
    left: auto;
    right: 1.5rem;
    bottom: 1.5rem;
    width: 380px;
  }

  &--bag {
    @include until('lg') {
      top: calc(5.6rem + env(safe-area-inset-top));
      bottom: auto;
    }

    @include from('lg') {
      right: calc(460px + 1.5rem);
    }
  }

  &__item {
    @include flex(row, flex-start, flex-start, 0.4rem 0.8rem);
    flex-wrap: wrap;
    position: relative;
    padding: 0.95rem 2.8rem 1rem 1.1rem;
    background: $basalt;
    color: $quartz;
    box-shadow: $shadow-md;
    pointer-events: auto;

    // Filo de color a la izquierda, como el canto de una piedra.
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 2px;
      background: $silver;
    }

    &--success::before {
      background: $esmeralda;
    }

    &--error::before {
      background: #e0634d;
    }
  }

  &__label {
    @include eyebrow;
    flex-basis: 100%;
    color: $silver;
  }

  &__msg {
    font-size: $text-sm;
    line-height: 1.45;
  }

  &__close {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    @include flex(row, center, center);
    width: 32px;
    height: 32px;
    color: $silver;
    @include focus-ring($quartz);

    &:hover {
      color: $quartz;
    }
  }
}

.toast-enter-active {
  transition:
    opacity 0.5s $ease,
    transform 0.7s $ease;
}

.toast-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.4s $ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(16px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(24px);
}

.toast-move {
  transition: transform 0.5s $ease;
}
</style>
