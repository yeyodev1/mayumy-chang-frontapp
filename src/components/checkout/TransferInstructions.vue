<script setup lang="ts">
import { computed } from 'vue'
import BankAccountCard from './BankAccountCard.vue'
import { checkoutCopy } from './checkoutCopy'
import { fill, site, whatsappLink } from '@/config/site'
import { useStoreConfig } from '@/composables/useStoreConfig'
import { formatCents } from '@/utils/format'
import type { BankAccount, Order } from '@/types'

const props = defineProps<{ order: Order; accounts: Omit<BankAccount, 'isActive'>[] }>()
const copy = site.checkout.placed
const none = checkoutCopy.placed
const { config } = useStoreConfig()

const values = computed(() => ({ code: props.order.code, total: formatCents(props.order.totalCents) }))
const hasAccounts = computed(() => props.accounts.length > 0)
const email = computed(() => props.accounts.find((a) => a.email)?.email ?? config.value.contact.email)
const steps = computed(() => fill(email.value ? copy.transferSteps : copy.transferStepsNoEmail, { ...values.value, email: email.value }))
// Sin cuentas activas en el panel: el equipo manda los datos por WhatsApp o correo.
const whatsappUrl = computed(() =>
  whatsappLink(fill(hasAccounts.value ? copy.transferWhatsappMsg : none.noAccountsMsg, values.value), config.value.contact.whatsapp),
)
</script>

<template>
  <section class="transfer" aria-labelledby="transfer-title">
    <p class="transfer__eyebrow">[ {{ site.checkout.payment.transferTitle }} ]</p>
    <h3 id="transfer-title" class="transfer__title">
      {{ hasAccounts ? fill(copy.transferTitle, values) : none.noAccountsTitle }}
    </h3>
    <template v-if="hasAccounts">
      <BankAccountCard v-for="a in accounts" :key="a.id" :account="a" />
      <p class="transfer__text">{{ steps }}</p>
    </template>
    <p v-else class="transfer__text">{{ fill(none.noAccountsText, values) }}</p>
    <p class="transfer__text transfer__text--soft">{{ copy.reserveNote }}</p>
    <a class="btn btn--primary transfer__wa" :href="whatsappUrl" target="_blank" rel="noopener">
      <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
      {{ hasAccounts ? copy.transferWhatsapp : none.noAccountsWhatsapp }}
    </a>
  </section>
</template>

<style scoped lang="scss">
.transfer {
  @include flex(column, stretch, flex-start, 0.8rem);
  width: 100%;
  padding: 1.4rem 1.3rem;
  background: $quartz-deep;
  text-align: left;

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($text-xl);
  }

  &__text {
    font-size: $text-sm;
    color: $ink-soft;

    &--soft {
      color: $ink-muted;
    }
  }

  &__wa {
    align-self: flex-start;
    margin-top: 0.3rem;
  }
}
</style>
