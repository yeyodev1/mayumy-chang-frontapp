<script setup lang="ts">
import { computed } from 'vue'
import type { Order } from '@/types'
import { site } from '@/config/site'
import { firstName, whatsappTo } from './adminFormat'
import AdminCard from './AdminCard.vue'

const props = defineProps<{ order: Order }>()

const wa = computed(() =>
  whatsappTo(
    props.order.customer.phone,
    `Hola ${firstName(props.order.customer.name)}, te escribimos de ${site.name} por tu pedido ${props.order.code}.`,
  ),
)
const isPickup = computed(() => props.order.delivery.method === 'pickup')
const place = computed(() => [props.order.delivery.city, props.order.delivery.province].filter(Boolean).join(', '))
</script>

<template>
  <AdminCard title="Clienta" icon="fa-solid fa-user">
    <p class="who__name">{{ order.customer.name }}</p>
    <p v-if="order.customer.documentId" class="who__doc">CI/RUC {{ order.customer.documentId }}</p>
    <div class="who__contact">
      <a v-if="order.customer.phone" :href="`tel:${order.customer.phone}`" class="who__link">
        <i class="fa-solid fa-phone" aria-hidden="true"></i>{{ order.customer.phone }}
      </a>
      <a :href="`mailto:${order.customer.email}`" class="who__link">
        <i class="fa-solid fa-envelope" aria-hidden="true"></i>{{ order.customer.email }}
      </a>
      <a v-if="wa" :href="wa" target="_blank" rel="noopener" class="who__wa">
        <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Escribir por WhatsApp
      </a>
    </div>
  </AdminCard>

  <AdminCard
    :title="isPickup ? 'Retiro en taller' : 'Envío Servientrega'"
    :icon="isPickup ? 'fa-solid fa-store' : 'fa-solid fa-truck-fast'"
  >
    <template #head>
      <span v-if="order.isGift" class="who__gift"><i class="fa-solid fa-gift" aria-hidden="true"></i> Regalo</span>
    </template>
    <dl class="who__list">
      <div v-if="place">
        <dt>Ciudad</dt>
        <dd>{{ place }}</dd>
      </div>
      <div v-if="order.delivery.address">
        <dt>Dirección</dt>
        <dd>{{ order.delivery.address }}</dd>
      </div>
      <div v-if="order.delivery.reference">
        <dt>Referencia</dt>
        <dd>{{ order.delivery.reference }}</dd>
      </div>
      <div v-if="order.isGift">
        <dt>Empaque de regalo</dt>
        <dd class="who__note">{{ order.delivery.giftNote || 'Sin nota: solo el empaque.' }}</dd>
      </div>
      <div v-if="order.notes">
        <dt>Notas de la clienta</dt>
        <dd class="who__note">{{ order.notes }}</dd>
      </div>
    </dl>
  </AdminCard>
</template>

<style scoped lang="scss">
.who {
  &__name {
    font-family: $font-serif;
    font-size: 1.5rem;
    line-height: 1.15;
  }

  &__doc {
    font-family: $font-mono;
    font-size: 0.8rem;
    color: $ink-soft;
  }

  &__contact {
    @include flex(column, flex-start, flex-start, 0.3rem);
    margin-top: 0.8rem;
  }

  &__link {
    @include flex(row, center, flex-start, 0.6rem);
    min-height: 2.5rem;
    overflow-wrap: anywhere;
    @include focus-ring;

    i {
      width: 1rem;
      color: $ink-muted;
    }

    &:hover {
      text-decoration: underline;
    }
  }

  &__wa {
    @include flex(row, center, center, 0.5rem);
    margin-top: 0.4rem;
    min-height: 2.75rem;
    padding: 0 1.2rem;
    border-radius: $radius-sm;
    border: 1px solid $basalt;
    font-size: 0.9rem;
    @include focus-ring;

    &:hover {
      background: $basalt;
      color: $frost;
    }

    @media print {
      display: none;
    }
  }

  &__gift {
    @include flex(row, center, flex-start, 0.4rem);
    @include eyebrow;
    padding: 0.25rem 0.6rem;
    border-radius: $radius-sm;
    background: $info-bg;
    color: $zafiro;
  }

  &__list {
    @include flex(column, stretch, flex-start, 0.75rem);

    dt {
      @include eyebrow;
      color: $ink-muted;
    }

    dd {
      color: $ink;
    }
  }

  &__note {
    padding: 0.6rem 0.8rem;
    border-radius: $radius-sm;
    background: $quartz;
    font-style: italic;
  }
}
</style>
