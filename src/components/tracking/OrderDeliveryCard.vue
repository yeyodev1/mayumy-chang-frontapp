<script setup lang="ts">
import { computed } from 'vue'
import { trackingCopy as t } from './trackingCopy'
import { fill, whatsappLink } from '@/config/site'
import { useStoreConfig } from '@/composables/useStoreConfig'
import type { Order } from '@/types'

const props = defineProps<{ order: Order }>()
const { config } = useStoreConfig()
const d = computed(() => props.order.delivery)
const isPickup = computed(() => d.value.method === 'pickup')
const helpUrl = computed(() => whatsappLink(fill(t.orderHelpMsg, { code: props.order.code }), config.value.contact.whatsapp))
</script>

<template>
  <div class="odel">
    <section class="odel__block">
      <h2 class="odel__sub">{{ isPickup ? t.pickup : t.delivery }}</h2>
      <p class="odel__name">{{ order.customer.name }}</p>
      <template v-if="isPickup">
        <p>{{ config.shipping.pickup.name }}</p>
        <p class="odel__muted">{{ config.shipping.pickup.address }} · {{ config.shipping.pickup.hours }}</p>
      </template>
      <template v-else>
        <p>{{ d.address }}</p>
        <p class="odel__muted">{{ [d.city, d.province].filter(Boolean).join(', ') }}</p>
        <p v-if="d.reference" class="odel__muted">{{ d.reference }}</p>
      </template>
    </section>

    <section v-if="order.isGift" class="odel__block">
      <h2 class="odel__sub">{{ t.gift }}</h2>
      <p v-if="d.giftNote" class="odel__note">“{{ d.giftNote }}”</p>
    </section>

    <section class="odel__block">
      <h2 class="odel__sub">{{ t.payment }}</h2>
      <p>
        {{ order.paymentMethod === 'card' ? t.payCard : t.payTransfer }}
        <span v-if="order.payphone?.lastDigits" class="odel__muted">· {{ order.payphone.cardBrand }} ···· {{ order.payphone.lastDigits }}</span>
      </p>
    </section>

    <a class="btn btn--ghost odel__help" :href="helpUrl" target="_blank" rel="noopener">
      <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ t.ask }}
    </a>
  </div>
</template>

<style scoped lang="scss">
.odel {
  @include flex(column, stretch, flex-start, 1.3rem);

  &__block {
    @include flex(column, flex-start, flex-start, 0.15rem);
    padding-bottom: 1.2rem;
    border-bottom: 1px solid $line;
  }

  &__sub {
    @include eyebrow;
    margin-bottom: 0.4rem;
  }

  &__name {
    font-family: $font-serif;
    font-size: $text-xl;
    line-height: 1.1;
  }

  &__muted {
    color: $ink-soft;
    font-size: $text-sm;
  }

  &__note {
    font-family: $font-serif;
    font-style: italic;
    font-size: $text-lg;
  }

  &__help {
    align-self: flex-start;
  }
}
</style>
