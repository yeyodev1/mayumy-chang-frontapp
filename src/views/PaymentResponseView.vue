<script setup lang="ts">
import { computed } from 'vue'
import OrderPlaced from '@/components/checkout/OrderPlaced.vue'
import HeptagonMark from '@/components/brand/HeptagonMark.vue'
import { checkoutCopy } from '@/components/checkout/checkoutCopy'
import { usePaymentResponse } from '@/composables/usePaymentResponse'
import { useStoreConfig } from '@/composables/useStoreConfig'
import { TRANSFER_QUERY } from '@/composables/useCheckout'
import { fill, whatsappLink } from '@/config/site'

const { state, order, message, confirm } = usePaymentResponse()
const { config } = useStoreConfig()
const t = checkoutCopy.response
const canTransfer = computed(() => config.value.payments.transfer?.enabled)
const helpUrl = computed(() => whatsappLink(fill(t.helpMsg, { code: order.value?.code ?? '' }), config.value.contact.whatsapp))
</script>

<template>
  <section class="presp" aria-live="polite">
    <Transition name="rise" mode="out-in">
      <!-- Mientras confirma: la forma de lo que viene, sin ruedas girando. -->
      <div v-if="state === 'confirming'" key="wait" class="presp__wait">
        <HeptagonMark class="presp__mark" size="72px" :stroke="1.2" />
        <h1 class="presp__title">{{ t.confirming }}</h1>
        <p class="presp__text">{{ t.confirmingText }}</p>
        <div class="presp__sk" aria-hidden="true">
          <span class="skeleton presp__sk-code"></span>
          <span class="skeleton presp__sk-line"></span>
          <span class="skeleton presp__sk-line"></span>
          <span class="skeleton presp__sk-line presp__sk-line--short"></span>
        </div>
      </div>

      <OrderPlaced v-else-if="state === 'approved' && order" key="ok" :order="order" :accounts="config.bankAccounts" />

      <div v-else-if="state === 'rejected'" key="no" class="presp__card">
        <p class="presp__eyebrow">[ {{ order?.code ?? 'Pago' }} ]</p>
        <h1 class="presp__title">{{ t.rejectedTitle }}</h1>
        <p v-if="message" class="presp__text">{{ message }}</p>
        <p class="presp__text">{{ t.rejectedText }}</p>
        <div class="presp__actions">
          <RouterLink :to="{ name: 'Checkout' }" class="btn btn--primary">{{ t.retry }}</RouterLink>
          <RouterLink v-if="canTransfer" :to="{ name: 'Checkout', query: { pago: TRANSFER_QUERY } }" class="btn btn--ghost">
            {{ t.transfer }}
          </RouterLink>
          <a class="presp__help link-line" :href="helpUrl" target="_blank" rel="noopener">
            <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ t.help }}
          </a>
        </div>
      </div>

      <div v-else key="err" class="presp__card">
        <p class="presp__eyebrow">[ Pago ]</p>
        <h1 class="presp__title">{{ t.errorTitle }}</h1>
        <p class="presp__text">{{ message }}</p>
        <div class="presp__actions">
          <button type="button" class="btn btn--primary" @click="confirm">{{ t.retryConfirm }}</button>
          <a class="presp__help link-line" :href="helpUrl" target="_blank" rel="noopener">
            <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ t.help }}
          </a>
        </div>
      </div>
    </Transition>
  </section>
</template>

<style scoped lang="scss">
.presp {
  @include container(1080px);
  flex: 1;
  padding-top: calc(var(--header-h) + 2rem);
  padding-bottom: $space-xl;

  &__wait,
  &__card {
    @include flex(column, center, flex-start, 0.8rem);
    max-width: 36rem;
    margin-inline: auto;
    text-align: center;
    padding-top: 2rem;
  }

  &__mark {
    color: $silver;
    margin-bottom: 0.6rem;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-md);
  }

  &__text {
    color: $ink-soft;
  }

  &__sk {
    @include flex(column, center, flex-start, 0.6rem);
    width: 100%;
    margin-top: 1.4rem;
  }

  &__sk-code {
    width: 12rem;
    height: 3.6rem;
    margin-bottom: 0.8rem;
  }

  &__sk-line {
    width: 100%;
    height: 3.2rem;

    &--short {
      width: 60%;
    }
  }

  &__actions {
    @include flex(row, center, center, 0.8rem 1.2rem);
    flex-wrap: wrap;
    margin-top: 0.8rem;
  }

  &__help {
    @include flex(row, center, center, 0.4rem);
    font-size: $text-sm;
    padding: 0.4rem 0;
  }
}
</style>
