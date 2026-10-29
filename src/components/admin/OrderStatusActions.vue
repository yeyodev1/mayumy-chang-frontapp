<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Order, OrderStatus } from '@/types'
import { ORDER_STATUS, canCancelOrder, nextOrderStatus } from '@/utils/orderStatus'
import BaseModal from '@/components/ui/BaseModal.vue'
import OrderStatusPill from './OrderStatusPill.vue'

const props = defineProps<{ order: Order; busy: boolean }>()
const emit = defineEmits<{ change: [status: OrderStatus] }>()

// TODO coordinador: mover a site.ts (copy del panel admin)
const ACTION_COPY: Partial<Record<OrderStatus, { label: string; icon: string; confirm: string }>> = {
  preparing: {
    label: 'Empezar a preparar',
    icon: 'fa-solid fa-box-open',
    confirm: 'El pedido pasa a "En preparación".',
  },
  shipped: {
    label: 'Marcar como enviado',
    icon: 'fa-solid fa-truck-fast',
    confirm: 'Le enviaremos un correo a la clienta avisando que su pedido va en camino.',
  },
  delivered: {
    label: 'Marcar como entregado',
    icon: 'fa-solid fa-circle-check',
    confirm: 'Le enviaremos un correo a la clienta confirmando la entrega.',
  },
}

// Aprobar una transferencia también la pasa a "En preparación", pero se nombra distinto.
const APPROVE_COPY = {
  label: 'Aprobar pedido',
  icon: 'fa-solid fa-clipboard-check',
  confirm: 'Confírmalo solo si ya viste la transferencia en la cuenta. Le enviaremos un correo a la clienta confirmando su pedido.',
}

const next = computed(() => nextOrderStatus(props.order.status))
const nextCopy = computed(() => {
  if (props.order.status === 'review') return APPROVE_COPY
  return next.value ? ACTION_COPY[next.value] : undefined
})
const cancellable = computed(() => canCancelOrder(props.order.status))

const pendingChange = ref<OrderStatus | null>(null)
const modalTitle = computed(() => {
  if (pendingChange.value === 'canceled') return `¿Cancelar el pedido ${props.order.code}?`
  return pendingChange.value ? `¿${nextCopy.value?.label}?` : ''
})
const modalMessage = computed(() => {
  if (pendingChange.value === 'canceled') {
    return props.order.paidAt
      ? 'Este pedido ya está pagado: la devolución del dinero se hace aparte, desde Payphone.'
      : 'El pedido quedará cancelado y no se podrá despachar.'
  }
  return pendingChange.value ? nextCopy.value?.confirm : ''
})

function confirm() {
  if (pendingChange.value) emit('change', pendingChange.value)
  pendingChange.value = null
}
</script>

<template>
  <section class="flow" aria-label="Estado del pedido">
    <div class="flow__now">
      <span class="flow__label">Estado</span>
      <OrderStatusPill :status="order.status" large />
    </div>

    <p v-if="order.status === 'pending'" class="flow__hint">
      Esperando que la clienta complete el pago en Payphone.
    </p>
    <p v-else-if="order.status === 'review'" class="flow__hint">
      Transferencia: revisa que el dinero llegó a la cuenta y apruébalo para prepararlo.
    </p>

    <div class="flow__actions">
      <button
        v-if="next && nextCopy"
        type="button"
        class="btn btn--primary flow__main"
        :disabled="busy"
        @click="pendingChange = next"
      >
        <i :class="nextCopy.icon" aria-hidden="true"></i>
        {{ busy ? 'Guardando…' : nextCopy.label }}
      </button>
      <button
        v-if="cancellable"
        type="button"
        class="flow__cancel"
        :disabled="busy"
        @click="pendingChange = 'canceled'"
      >
        Cancelar pedido
      </button>
    </div>

    <BaseModal
      :open="Boolean(pendingChange)"
      :title="modalTitle"
      :message="modalMessage"
      :danger="pendingChange === 'canceled'"
      :confirm-label="pendingChange === 'canceled' ? 'Sí, cancelar' : 'Confirmar'"
      cancel-label="Volver"
      @confirm="confirm"
      @cancel="pendingChange = null"
    >
      <p v-if="pendingChange && pendingChange !== 'canceled'" class="flow__to">
        Nuevo estado: <strong>{{ ORDER_STATUS[pendingChange].label }}</strong>
      </p>
    </BaseModal>
  </section>
</template>

<style scoped lang="scss">
.flow {
  @include flex(column, stretch, flex-start, 0.8rem);
  padding: 1.1rem;
  border-radius: $radius-md;
  background: $basalt;
  color: $frost;

  @include from('md') {
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    padding: 1.1rem 1.4rem;
  }

  &__now {
    @include flex(row, center, flex-start, 0.7rem);
  }

  &__label {
    @include eyebrow;
    color: $silver;
  }

  &__hint {
    font-size: 0.88rem;
    color: rgba($frost, 0.78);
  }

  &__actions {
    @include flex(row, center, flex-start, 0.6rem);
    flex-wrap: wrap;

    @include from('md') {
      margin-left: auto;
    }
  }

  &__main {
    flex: 1 1 auto;
    background: $frost;
    color: $basalt;

    &:hover {
      background: $quartz;
    }
  }

  &__cancel {
    min-height: 2.75rem;
    padding: 0 1rem;
    border-radius: $radius-pill;
    font-size: 0.85rem;
    color: rgba($frost, 0.8);
    text-decoration: underline;
    text-underline-offset: 3px;
    @include focus-ring($silver);

    &:disabled {
      opacity: 0.5;
    }
  }

  &__to {
    color: $ink-soft;
  }

  @media print {
    display: none;
  }
}
</style>
