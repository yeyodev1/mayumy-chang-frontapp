<script setup lang="ts">
import CheckoutSection from './CheckoutSection.vue'
import ChoiceCard from './ChoiceCard.vue'
import BankAccountCard from './BankAccountCard.vue'
import { checkoutCopy } from './checkoutCopy'
import { site, whatsappLink } from '@/config/site'
import { adjustmentBadge } from '@/utils/payments'
import type { CheckoutForm } from '@/composables/useCheckout'
import type { BankAccount, PaymentMethod, PaymentsSettings } from '@/types'

const props = defineProps<{
  form: CheckoutForm
  methods: PaymentMethod[]
  payments: PaymentsSettings
  accounts: Omit<BankAccount, 'isActive'>[]
}>()
const f = props.form
const copy = site.checkout.payment

const ICONS: Record<PaymentMethod, string> = {
  card: 'fa-regular fa-credit-card',
  transfer: 'fa-solid fa-building-columns',
}

// Lo que se escribe en el panel manda; el copy de site.ts queda de respaldo.
function title(m: PaymentMethod) {
  return props.payments[m]?.title || (m === 'card' ? copy.cardTitle : copy.transferTitle)
}

function text(m: PaymentMethod) {
  return props.payments[m]?.description || (m === 'card' ? copy.cardText : copy.transferText)
}

function meta(m: PaymentMethod) {
  const badge = adjustmentBadge(props.payments[m]?.adjustment)
  return badge ? `${badge} · ${props.payments[m].adjustment.label}` : ''
}
</script>

<template>
  <CheckoutSection num="04" :title="copy.legend">
    <div v-if="methods.length" class="cpay__methods" role="radiogroup" :aria-label="copy.legend">
      <ChoiceCard
        v-for="m in methods"
        :key="m"
        v-model="f.payment"
        name="payment"
        :value="m"
        :icon="ICONS[m]"
        :title="title(m)"
        :text="text(m)"
        :meta="meta(m)"
      />
    </div>
    <p v-else class="cpay__note">
      {{ checkoutCopy.noMethods }}
      <a :href="whatsappLink()" target="_blank" rel="noopener" class="link-line">WhatsApp</a>
    </p>

    <Transition name="rise" mode="out-in">
      <div v-if="f.payment === 'transfer' && methods.includes('transfer')" key="t" class="cpay__detail">
        <p class="cpay__note">{{ copy.transferNote }}</p>
        <BankAccountCard v-for="a in accounts" :key="a.id" :account="a" />
      </div>
      <p v-else-if="f.payment === 'card'" key="c" class="cpay__note">
        <i class="fa-solid fa-lock" aria-hidden="true"></i> {{ site.checkout.paymentNote }}
      </p>
    </Transition>
  </CheckoutSection>
</template>

<style scoped lang="scss">
.cpay {
  &__methods {
    @include flex-cards(12rem, 0.75rem);
  }

  &__detail {
    @include flex(column, stretch, flex-start, 0.75rem);
  }

  &__note {
    font-size: $text-sm;
    color: $ink-soft;
    line-height: 1.5;

    i {
      margin-right: 0.3rem;
      color: $ink-muted;
    }
  }
}
</style>
