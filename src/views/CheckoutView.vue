<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import CheckoutContact from '@/components/checkout/CheckoutContact.vue'
import CheckoutDelivery from '@/components/checkout/CheckoutDelivery.vue'
import CheckoutGift from '@/components/checkout/CheckoutGift.vue'
import CheckoutPayment from '@/components/checkout/CheckoutPayment.vue'
import CheckoutSummary from '@/components/checkout/CheckoutSummary.vue'
import PayphonePanel from '@/components/checkout/PayphonePanel.vue'
import OrderPlaced from '@/components/checkout/OrderPlaced.vue'
import CartEmpty from '@/components/cart/CartEmpty.vue'
import { checkoutCopy } from '@/components/checkout/checkoutCopy'
import { useCheckout } from '@/composables/useCheckout'
import { useStoreConfig } from '@/composables/useStoreConfig'
import { formatCents } from '@/utils/format'
import { site } from '@/config/site'

const {
  form, errors, phase, submitting, formError, cardDown, order, secondsLeft, cart, config, box,
  cityPending, shippingCents, shippingLabel, adjustment, adjustmentCents, totalCents, enabledMethods,
  prefill, blur, submit, retry, backToForm, useTransfer, removeLine,
} = useCheckout()
const { shippingCopy } = useStoreConfig()
const payCopy = site.checkout.payment

onMounted(prefill)

const submitLabel = computed(() => {
  if (submitting.value) return checkoutCopy.submitting
  const total = formatCents(totalCents.value)
  return form.payment === 'card' ? `Pagar ${total}` : `${payCopy.submitTransfer} · ${total}`
})
const canTransfer = computed(() => enabledMethods.value.includes('transfer'))

// Al cambiar de fase (pago, confirmación) lo nuevo queda arriba, no bajo el pliegue.
const top = ref<HTMLElement | null>(null)
watch(phase, () => {
  const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const y = (top.value?.getBoundingClientRect().top ?? 0) + window.scrollY - 24
  window.scrollTo({ top: Math.max(0, y), behavior: smooth ? 'smooth' : 'auto' })
})
</script>

<template>
  <section ref="top" class="checkout">
    <header v-if="phase !== 'placed'" class="checkout__head">
      <RouterLink :to="{ name: 'Shop' }" class="checkout__back link-line">
        <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> {{ checkoutCopy.back }}
      </RouterLink>
      <p class="checkout__eyebrow"><i class="fa-solid fa-lock" aria-hidden="true"></i> {{ checkoutCopy.secure }}</p>
      <h1 class="checkout__title">{{ site.checkout.title }}</h1>
    </header>

    <OrderPlaced v-if="phase === 'placed' && order" :order="order" :accounts="config.bankAccounts" />

    <div v-else-if="cart.isEmpty && phase === 'form'" class="checkout__empty">
      <CartEmpty />
    </div>

    <div v-else class="checkout__layout">
      <div v-if="phase === 'form'" class="checkout__side">
        <CheckoutSummary
          :shipping-cents="shippingCents"
          :shipping-label="shippingLabel"
          :city-pending="cityPending"
          :is-pickup="form.method === 'pickup'"
          :total-cents="totalCents"
          :adjustment-cents="adjustmentCents"
          :adjustment-label="adjustment?.label"
          @remove="removeLine"
        />
      </div>

      <div class="checkout__main">
        <Transition name="rise" mode="out-in">
          <form v-if="phase === 'form'" key="form" class="checkout__form" novalidate @submit.prevent="submit">
            <CheckoutContact :form="form" :errors="errors" @blur="blur" />
            <CheckoutDelivery :form="form" :errors="errors" :shipping="config.shipping" :rates="shippingCopy" @blur="blur" />
            <CheckoutGift :form="form" :errors="errors" @blur="blur" />
            <CheckoutPayment :form="form" :methods="enabledMethods" :payments="config.payments" :accounts="config.bankAccounts" />

            <Transition name="rise">
              <div v-if="formError" class="checkout__error" role="alert">
                <p>{{ formError }}</p>
                <button v-if="cardDown && canTransfer" type="button" class="btn btn--ghost" @click="useTransfer">
                  {{ checkoutCopy.useTransfer }}
                </button>
              </div>
            </Transition>

            <button type="submit" class="btn btn--primary btn--block checkout__submit" :disabled="submitting || !enabledMethods.length">
              {{ submitLabel }}
            </button>
          </form>

          <PayphonePanel
            v-else
            key="pay"
            :expired="phase === 'expired'"
            :loading="box.loading.value"
            :error="box.error.value"
            :seconds-left="secondsLeft"
            :code="order?.code ?? ''"
            :total-cents="order?.totalCents ?? totalCents"
            :can-switch="canTransfer"
            @retry="retry"
            @back="backToForm"
            @switch="useTransfer"
          />
        </Transition>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.checkout {
  @include container(1180px);
  @include flex(column, stretch, flex-start, 1.8rem);
  padding-top: calc(var(--header-h) + 1.6rem);
  padding-bottom: $space-xl;

  @include from('lg') {
    padding-top: calc(var(--header-h) + 2.6rem);
  }

  &__head {
    @include flex(column, flex-start, flex-start, 0.5rem);
  }

  &__back {
    @include flex(row, center, flex-start, 0.45rem);
    font-size: $text-sm;
    color: $ink-soft;
    margin-bottom: 0.8rem;
  }

  &__eyebrow {
    @include eyebrow;
    @include flex(row, center, flex-start, 0.45rem);
  }

  &__title {
    @include display($display-md);
  }

  &__empty {
    padding-block: $space-lg;
  }

  &__layout {
    @include flex(column, stretch, flex-start, 1.6rem);

    @include from('lg') {
      flex-direction: row-reverse;
      align-items: flex-start;
      gap: clamp(2.5rem, 5vw, 5rem);
    }
  }

  &__main {
    flex: 1;
    min-width: 0;
  }

  // En el celular el resumen va primero (plegado); en escritorio, pegado a la derecha.
  &__side {
    @include from('lg') {
      flex: 0 0 380px;
      position: sticky;
      top: calc(var(--header-h) + 1.5rem);
    }
  }

  &__form {
    @include flex(column, stretch, flex-start, 2.2rem);
  }

  &__error {
    @include flex(column, flex-start, flex-start, 0.8rem);
    padding: 1rem 1.1rem;
    border-left: 2px solid $danger;
    background: $danger-bg;
    color: $danger;
    font-size: $text-sm;
  }

  &__submit {
    min-height: 60px;
    font-size: 0.85rem;
  }
}
</style>
