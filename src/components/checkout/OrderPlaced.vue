<script setup lang="ts">
import { computed } from 'vue'
import ThanksMark from './ThanksMark.vue'
import OrderLines from './OrderLines.vue'
import TransferInstructions from './TransferInstructions.vue'
import { checkoutCopy } from './checkoutCopy'
import { fill, site, whatsappLink } from '@/config/site'
import { useStoreConfig } from '@/composables/useStoreConfig'
import type { BankAccount, Order } from '@/types'

const props = defineProps<{ order: Order; accounts: Omit<BankAccount, 'isActive'>[] }>()
const copy = site.checkout.placed
const more = checkoutCopy.placed
const { config } = useStoreConfig()

const isTransfer = computed(() => props.order.paymentMethod === 'transfer')
const text = computed(() =>
  fill(isTransfer.value && props.accounts.length ? copy.transferText : copy.text, {
    code: props.order.code,
    email: props.order.customer.email,
  }),
)
const steps = computed(() => {
  const list: string[] = [...(isTransfer.value ? more.nextTransfer : more.nextCard)]
  if (props.order.delivery.method === 'pickup') list[list.length - 1] = more.nextPickup
  return list
})
const trackTo = computed(() => ({
  name: 'OrderTracking',
  params: { code: props.order.code },
  query: { email: props.order.customer.email },
}))
const helpUrl = computed(() => whatsappLink(fill(more.helpMsg, { code: props.order.code }), config.value.contact.whatsapp))
</script>

<template>
  <section class="placed" aria-labelledby="placed-title" aria-live="polite">
    <header class="placed__hero">
      <ThanksMark size="104px" />
      <h2 id="placed-title" class="placed__title placed__in" style="--d: 1">{{ copy.hand }}</h2>
      <p class="placed__lead placed__in" style="--d: 2">{{ copy.title }}</p>
      <p class="placed__text placed__in" style="--d: 3">{{ text }}</p>
      <div class="placed__code placed__in" style="--d: 4">
        <span class="placed__code-label">{{ more.code }}</span>
        <strong class="placed__code-value">{{ order.code }}</strong>
      </div>
    </header>

    <div class="placed__grid">
      <div class="placed__col placed__in" style="--d: 5">
        <TransferInstructions v-if="isTransfer" :order="order" :accounts="accounts" />
        <div class="placed__next">
          <h3 class="placed__sub">{{ more.nextTitle }}</h3>
          <ol class="placed__steps">
            <li v-for="(s, i) in steps" :key="i">
              <span class="placed__num">0{{ i + 1 }}</span>
              <span>{{ s }}</span>
            </li>
          </ol>
        </div>
      </div>
      <div class="placed__col placed__card placed__in" style="--d: 6">
        <OrderLines :order="order" />
      </div>
    </div>

    <div class="placed__actions placed__in" style="--d: 7">
      <RouterLink :to="trackTo" class="btn btn--primary">{{ copy.track }}</RouterLink>
      <RouterLink :to="{ name: 'Shop' }" class="btn btn--ghost">{{ copy.shop }}</RouterLink>
      <a :href="helpUrl" target="_blank" rel="noopener" class="placed__help link-line">
        <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ more.help }}
      </a>
    </div>
  </section>
</template>

<style scoped lang="scss">
.placed {
  @include flex(column, stretch, flex-start, 2.4rem);

  &__hero {
    @include flex(column, center, flex-start, 0.7rem);
    text-align: center;
    padding-top: 1rem;
  }

  &__title {
    @include display(clamp(4rem, 2.6rem + 7vw, 8rem));
    margin-top: 0.8rem;
    font-style: italic;
  }

  &__lead {
    @include eyebrow;
    color: $ink;
  }

  &__text {
    max-width: 32rem;
    color: $ink-soft;
  }

  &__code {
    @include flex(column, center, center, 0.2rem);
    margin-top: 0.6rem;
    padding: 0.8rem 1.6rem;
    box-shadow: inset 0 0 0 1px $line;
    background: $frost;
  }

  &__code-label {
    @include eyebrow;
    color: $ink-muted;
  }

  &__code-value {
    font-family: $font-mono;
    font-weight: 500;
    font-size: $text-xl;
    letter-spacing: 0.12em;
    user-select: all;
  }

  &__grid {
    @include flex(column, stretch, flex-start, 1.4rem);

    @include from('md') {
      flex-direction: row;
      align-items: flex-start;
    }
  }

  &__col {
    @include flex(column, stretch, flex-start, 1.4rem);
    flex: 1 1 0;
    min-width: 0;
  }

  &__card {
    padding: 1.4rem;
    background: $frost;
    box-shadow: inset 0 0 0 1px $line;
  }

  &__sub {
    @include eyebrow;
    color: $ink;
    margin-bottom: 0.8rem;
  }

  &__steps {
    @include flex(column, stretch, flex-start, 0.75rem);
    list-style: none;

    li {
      @include flex(row, baseline, flex-start, 0.9rem);
      color: $ink-soft;
      font-size: $text-sm;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid $line;
    }
  }

  &__num {
    font-family: $font-mono;
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__actions {
    @include flex(row, center, center, 0.8rem 1.2rem);
    flex-wrap: wrap;
  }

  &__help {
    @include flex(row, center, center, 0.4rem);
    font-size: $text-sm;
    padding: 0.4rem 0;
  }

  // Todo lo que no es el heptágono entra después de que se enciende.
  &__in {
    animation: placed-in 0.9s $ease both;
    animation-delay: calc(0.55s + var(--d, 0) * 0.09s);
  }
}

@keyframes placed-in {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
}
</style>
