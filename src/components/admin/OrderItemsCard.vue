<script setup lang="ts">
import type { Order } from '@/types'
import { formatCents } from '@/utils/format'
import { signedCents } from '@/utils/payments'
import { cldUrl } from '@/utils/cloudinary'
import AdminCard from './AdminCard.vue'

defineProps<{ order: Order }>()

const thumb = (url: string) => cldUrl(url, { w: 120 })

// TODO coordinador: mover a site.ts (copy del panel admin)
const ZONE: Record<Order['shippingZone'], string> = {
  local: 'Envío local',
  national: 'Envío nacional',
  pickup: 'Retiro en taller',
  free: 'Envío gratis',
}
</script>

<template>
  <AdminCard title="Piezas" icon="fa-regular fa-gem">
    <ul class="items">
      <li v-for="item in order.items" :key="item.variantId" class="items__row">
        <span class="items__qty" :aria-label="`${item.quantity} unidades`">{{ item.quantity }}×</span>
        <img v-if="item.image" :src="thumb(item.image)" :alt="item.name" class="items__img" loading="lazy" />
        <div class="items__info">
          <p class="items__name">{{ item.name }}</p>
          <p class="items__variant">{{ item.variantLabel }} · {{ formatCents(item.unitPriceCents) }} c/u</p>
        </div>
        <span class="items__total">{{ formatCents(item.lineTotalCents) }}</span>
      </li>
    </ul>

    <dl class="totals">
      <div>
        <dt>Subtotal</dt>
        <dd>{{ formatCents(order.subtotalCents) }}</dd>
      </div>
      <div>
        <dt>{{ ZONE[order.shippingZone] ?? 'Envío' }}</dt>
        <dd>{{ order.shippingCents ? formatCents(order.shippingCents) : 'Sin costo' }}</dd>
      </div>
      <div v-if="order.paymentAdjustmentCents">
        <dt>{{ order.paymentAdjustmentLabel }}</dt>
        <dd>{{ signedCents(order.paymentAdjustmentCents) }}</dd>
      </div>
      <div class="totals__grand">
        <dt>Total</dt>
        <dd>{{ formatCents(order.totalCents) }}</dd>
      </div>
    </dl>
  </AdminCard>
</template>

<style scoped lang="scss">
.items {
  list-style: none;
  @include flex(column, stretch, flex-start, 0);

  &__row {
    @include flex(row, flex-start, flex-start, 0.75rem);
    padding: 0.85rem 0;
    border-bottom: 1px solid $line;

    &:first-child {
      padding-top: 0;
    }
  }

  &__qty {
    flex-shrink: 0;
    min-width: 2rem;
    font-family: $font-mono;
    font-size: 0.9rem;
    color: $ink-soft;
    line-height: 1.9;
  }

  &__img {
    width: 3rem;
    height: 3rem;
    flex-shrink: 0;
    object-fit: cover;
    border-radius: $radius-sm;
    background: $quartz;

    @media print {
      display: none;
    }
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__name {
    font-family: $font-serif;
    font-size: 1.15rem;
    line-height: 1.2;
  }

  &__variant {
    font-size: 0.85rem;
    color: $ink-soft;
  }

  &__total {
    font-family: $font-mono;
    font-size: 0.9rem;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
}

.totals {
  @include flex(column, stretch, flex-start, 0.35rem);
  margin-top: 1rem;

  div {
    @include flex(row, baseline, space-between, 1rem);
  }

  dt {
    color: $ink-soft;
  }

  dd {
    font-variant-numeric: tabular-nums;
  }

  &__grand {
    margin-top: 0.4rem;
    padding-top: 0.6rem;
    border-top: 1px solid $basalt;

    dt,
    dd {
      font-family: $font-serif;
      font-size: 1.5rem;
      color: $ink;
    }
  }
}
</style>
