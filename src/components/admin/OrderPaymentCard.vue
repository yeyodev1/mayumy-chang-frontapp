<script setup lang="ts">
import type { Order } from '@/types'
import { formatCents } from '@/utils/format'
import { formatDateTime } from './adminFormat'
import AdminCard from './AdminCard.vue'

defineProps<{ order: Order }>()
</script>

<template>
  <AdminCard v-if="order.paymentMethod === 'transfer'" title="Transferencia bancaria" icon="fa-solid fa-building-columns" class="pay">
    <p v-if="!order.paidAt" class="pay__none">
      Revisa que llegó la transferencia a la cuenta antes de aprobar. La clienta debe enviarte el comprobante con el código {{ order.code }}.
    </p>
    <dl class="pay__list">
      <div>
        <dt>{{ order.paidAt ? 'Transferido' : 'Por transferir' }}</dt>
        <dd>{{ formatCents(order.totalCents) }}</dd>
      </div>
      <div v-if="order.paidAt">
        <dt>Aprobado</dt>
        <dd>{{ formatDateTime(order.paidAt) }}</dd>
      </div>
    </dl>
  </AdminCard>
  <AdminCard v-else title="Pago con Payphone" icon="fa-solid fa-credit-card" class="pay">
    <p v-if="!order.paidAt && !order.payphone.authorizationCode" class="pay__none">
      Este pedido todavía no tiene un pago aprobado.
    </p>
    <dl class="pay__list">
      <div v-if="order.paidAt">
        <dt>Pagado</dt>
        <dd>{{ formatDateTime(order.paidAt) }}</dd>
      </div>
      <div v-if="order.payphone.authorizationCode">
        <dt>Autorización</dt>
        <dd class="pay__mono">{{ order.payphone.authorizationCode }}</dd>
      </div>
      <div v-if="order.payphone.cardBrand || order.payphone.lastDigits">
        <dt>Tarjeta</dt>
        <dd>
          {{ order.payphone.cardBrand || 'Tarjeta' }}
          <span v-if="order.payphone.lastDigits" class="pay__mono">•••• {{ order.payphone.lastDigits }}</span>
        </dd>
      </div>
      <div v-if="order.payphone.transactionId">
        <dt>Transacción Payphone</dt>
        <dd class="pay__mono">{{ order.payphone.transactionId }}</dd>
      </div>
      <div>
        <dt>Referencia interna</dt>
        <dd class="pay__mono pay__small">{{ order.clientTransactionId || '—' }}</dd>
      </div>
    </dl>
  </AdminCard>
</template>

<style scoped lang="scss">
.pay {
  &__none {
    margin-bottom: 0.8rem;
    padding: 0.6rem 0.8rem;
    border-radius: $radius-sm;
    background: $quartz;
    color: $ink-soft;
    font-size: 0.88rem;
  }

  &__list {
    @include flex(column, stretch, flex-start, 0.55rem);

    div {
      @include flex(row, baseline, space-between, 1rem);
      flex-wrap: wrap;
    }

    dt {
      font-size: 0.85rem;
      color: $ink-soft;
    }

    dd {
      font-weight: 600;
      text-align: right;
      overflow-wrap: anywhere;
    }
  }

  &__mono {
    font-family: $font-mono;
    font-weight: 400;
    font-variant-numeric: tabular-nums;
  }

  &__small {
    font-size: 0.78rem;
    font-weight: 500;
    color: $ink-soft;
  }
}
</style>
