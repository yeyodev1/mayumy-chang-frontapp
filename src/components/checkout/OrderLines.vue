<script setup lang="ts">
import { formatCents } from '@/utils/format'
import { signedCents } from '@/utils/payments'
import { cldUrl } from '@/utils/cloudinary'
import { site } from '@/config/site'
import type { Order } from '@/types'

defineProps<{ order: Order }>()

function shippingLabel(order: Order) {
  if (order.delivery.method === 'pickup') return site.checkout.shippingPickup
  if (order.shippingZone === 'free') return site.checkout.shippingFree
  if (order.shippingZone === 'local') return site.checkout.shippingLocal.replace('{city}', order.delivery.city)
  return site.checkout.shippingNational
}
</script>

<template>
  <div class="olines">
    <ul class="olines__list">
      <li v-for="it in order.items" :key="`${it.product}-${it.variantId}`" class="olines__item">
        <span class="olines__thumb">
          <img v-if="it.image" :src="cldUrl(it.image, { w: 112 })" alt="" width="48" height="60" loading="lazy" />
        </span>
        <span class="olines__name">
          {{ it.name }}
          <small>{{ it.quantity > 1 ? `${it.quantity} × ` : '' }}{{ it.variantLabel === 'Única' ? site.bag.uniqueNote : it.variantLabel }}</small>
        </span>
        <span class="olines__price">{{ formatCents(it.lineTotalCents) }}</span>
      </li>
    </ul>
    <dl class="olines__totals">
      <div><dt>{{ site.bag.subtotal }}</dt><dd>{{ formatCents(order.subtotalCents) }}</dd></div>
      <div>
        <dt>{{ shippingLabel(order) }}</dt>
        <dd>{{ order.shippingCents ? formatCents(order.shippingCents) : 'Sin costo' }}</dd>
      </div>
      <div v-if="order.paymentAdjustmentCents">
        <dt>{{ order.paymentAdjustmentLabel }}</dt>
        <dd>{{ signedCents(order.paymentAdjustmentCents) }}</dd>
      </div>
      <div class="olines__total"><dt>{{ site.checkout.total }}</dt><dd>{{ formatCents(order.totalCents) }}</dd></div>
    </dl>
  </div>
</template>

<style scoped lang="scss">
.olines {
  @include flex(column, stretch, flex-start, 1rem);
  text-align: left;

  &__list {
    @include flex(column, stretch, flex-start, 0.8rem);
    list-style: none;
  }

  &__item {
    @include flex(row, center, flex-start, 0.85rem);
  }

  &__thumb {
    flex: 0 0 48px;
    aspect-ratio: 4 / 5;
    background: $quartz-deep;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__name {
    @include flex(column, flex-start, flex-start, 0.1rem);
    flex: 1;
    min-width: 0;
    font-family: $font-serif;
    font-size: $text-lg;
    line-height: 1.1;

    small {
      @include eyebrow;
      color: $ink-muted;
    }
  }

  &__price {
    font-family: $font-serif;
    font-size: $text-lg;
    white-space: nowrap;
  }

  &__totals {
    @include flex(column, stretch, flex-start, 0.4rem);
    padding-top: 0.9rem;
    border-top: 1px solid $line;

    > div {
      @include flex(row, baseline, space-between, 1rem);
      font-size: $text-sm;
      color: $ink-soft;
    }

    dd {
      color: $ink;
    }
  }

  &__total {
    margin-top: 0.3rem;

    dt {
      @include eyebrow;
      color: $ink;
    }

    dd {
      font-family: $font-serif;
      font-size: $text-xl;
    }
  }
}
</style>
