<script setup lang="ts">
import OrderTimeline from '@/components/checkout/OrderTimeline.vue'
import OrderLines from '@/components/checkout/OrderLines.vue'
import TransferInstructions from '@/components/checkout/TransferInstructions.vue'
import CheckoutField from '@/components/checkout/CheckoutField.vue'
import OrderDeliveryCard from '@/components/tracking/OrderDeliveryCard.vue'
import TrackingSkeleton from '@/components/tracking/TrackingSkeleton.vue'
import { trackingCopy as t } from '@/components/tracking/trackingCopy'
import { useStoreConfig } from '@/composables/useStoreConfig'
import { useOrderTracking } from '@/composables/useOrderTracking'
import { formatDate } from '@/utils/format'
import { fill } from '@/config/site'

const { code, email, order, loading, error, lookup } = useOrderTracking()
// Mientras la transferencia no se aprueba, la clienta vuelve acá a buscar la cuenta.
const { config } = useStoreConfig()
</script>

<template>
  <section class="track">
    <header class="track__head">
      <p class="track__eyebrow">[ {{ t.orderEyebrow }} ]</p>
      <h1 class="track__code">{{ code }}</h1>
      <p v-if="order" class="track__date">{{ fill(t.placedOn, { date: formatDate(order.createdAt) }) }}</p>
    </header>

    <Transition name="fade" mode="out-in">
      <TrackingSkeleton v-if="loading" key="sk" />

      <div v-else-if="order" key="order" class="track__body">
        <div class="track__card">
          <h2 class="track__sub">{{ t.status }}</h2>
          <OrderTimeline :status="order.status" :method="order.delivery.method" :payment="order.paymentMethod" />
        </div>

        <TransferInstructions
          v-if="order.paymentMethod === 'transfer' && order.status === 'review'"
          :order="order"
          :accounts="config.bankAccounts"
        />

        <div class="track__cols">
          <div class="track__card track__card--lines">
            <h2 class="track__sub">{{ t.pieces }}</h2>
            <OrderLines :order="order" />
          </div>
          <div class="track__card track__card--side">
            <OrderDeliveryCard :order="order" />
          </div>
        </div>

        <RouterLink :to="{ name: 'TrackOrder' }" class="track__another link-line">{{ t.another }}</RouterLink>
      </div>

      <form v-else key="form" class="track__form" novalidate @submit.prevent="lookup">
        <h2 class="track__formtitle">{{ t.lookupTitle }}</h2>
        <p class="track__lead">{{ fill(t.lookupText, { code }) }}</p>
        <CheckoutField id="track-email" :label="t.emailLabel" :error="error" v-slot="{ describedby, invalid }">
          <input id="track-email" v-model="email" type="email" inputmode="email" autocomplete="email" required :aria-invalid="invalid" :aria-describedby="describedby" />
        </CheckoutField>
        <button type="submit" class="btn btn--primary btn--block" :disabled="loading">{{ t.submit }}</button>
      </form>
    </Transition>
  </section>
</template>

<style scoped lang="scss">
.track {
  @include container(1080px);
  @include flex(column, stretch, flex-start, 2rem);
  flex: 1;
  padding-top: calc(var(--header-h) + 4rem);
  padding-bottom: $space-xl;

  &__head {
    @include flex(column, flex-start, flex-start, 0.5rem);
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__code {
    font-family: $font-mono;
    font-weight: 400;
    font-size: clamp(2rem, 1.4rem + 3vw, 3.6rem);
    letter-spacing: 0.06em;
    line-height: 1;
    overflow-wrap: anywhere;
  }

  &__date {
    color: $ink-soft;
  }

  &__body {
    @include flex(column, stretch, flex-start, 1.4rem);
  }

  &__card {
    @include flex(column, stretch, flex-start, 1rem);
    padding: clamp(1.2rem, 3vw, 1.8rem);
    background: $frost;
    box-shadow: inset 0 0 0 1px $line;
    min-width: 0;

    &--lines {
      flex: 1.4 1 0;
    }

    &--side {
      flex: 1 1 0;
    }
  }

  &__sub {
    @include eyebrow;
    color: $ink;
  }

  &__cols {
    @include flex(column, stretch, flex-start, 1.4rem);

    @include from('md') {
      flex-direction: row;
      align-items: flex-start;
    }
  }

  &__another {
    align-self: flex-start;
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__form {
    @include flex(column, stretch, flex-start, 1rem);
    max-width: 30rem;
    padding: clamp(1.4rem, 4vw, 2rem);
    background: $frost;
    box-shadow: inset 0 0 0 1px $line;
  }

  &__formtitle {
    @include display($display-sm);
  }

  &__lead {
    color: $ink-soft;
  }
}
</style>
