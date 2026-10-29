<script setup lang="ts">
import { computed } from 'vue'
import { checkoutCopy } from './checkoutCopy'
import { fill, site } from '@/config/site'
import { formatCents } from '@/utils/format'

const props = defineProps<{
  expired: boolean
  loading: boolean
  error: string
  secondsLeft: number
  code: string
  totalCents: number
  /** La transferencia está activa: plan B si la tarjeta falla. */
  canSwitch: boolean
}>()
const emit = defineEmits<{ retry: []; back: []; switch: [] }>()
const t = checkoutCopy.payphone

const clock = computed(() => {
  const m = Math.floor(props.secondsLeft / 60)
  const s = String(props.secondsLeft % 60).padStart(2, '0')
  return `${m}:${s}`
})
</script>

<template>
  <section class="ppanel" aria-labelledby="ppanel-title">
    <header class="ppanel__head">
      <div>
        <p class="ppanel__eyebrow">[ {{ t.eyebrow }} ]</p>
        <h2 id="ppanel-title" class="ppanel__title">{{ expired ? t.expiredTitle : t.title }}</h2>
        <p class="ppanel__meta">{{ fill(t.order, { code, total: formatCents(totalCents) }) }}</p>
      </div>
      <p v-if="!expired" class="ppanel__clock" :class="{ 'is-low': secondsLeft < 90 }" aria-live="off">{{ clock }}</p>
    </header>

    <div v-if="expired" class="ppanel__state">
      <p>{{ t.expiredText }}</p>
      <button type="button" class="btn btn--primary" @click="emit('retry')">{{ t.newAttempt }}</button>
    </div>

    <template v-else>
      <div v-if="loading" class="ppanel__skeleton" aria-live="polite" aria-label="Preparando el pago seguro">
        <span class="skeleton ppanel__sk ppanel__sk--lg"></span>
        <span class="skeleton ppanel__sk"></span>
        <span class="skeleton ppanel__sk"></span>
        <span class="skeleton ppanel__sk ppanel__sk--btn"></span>
      </div>
      <div v-if="error" class="ppanel__state ppanel__state--error" role="alert">
        <p>{{ error }}</p>
        <button type="button" class="btn btn--primary" @click="emit('retry')">{{ t.retry }}</button>
      </div>
      <div id="pp-button" class="ppanel__box"></div>
      <p class="ppanel__secure"><i class="fa-solid fa-lock" aria-hidden="true"></i> {{ site.checkout.paymentNote }}</p>
    </template>

    <div class="ppanel__foot">
      <button v-if="canSwitch" type="button" class="btn btn--ghost" @click="emit('switch')">
        {{ site.checkout.payment.switchPayment }}
      </button>
      <button type="button" class="ppanel__back link-line" @click="emit('back')">{{ t.back }}</button>
    </div>
  </section>
</template>

<style scoped lang="scss">
.ppanel {
  @include flex(column, stretch, flex-start, 1.4rem);
  padding: 1.5rem;
  background: $frost;
  box-shadow: inset 0 0 0 1px $line;

  &__head {
    @include flex(row, flex-start, space-between, 1rem);
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-sm);
    margin: 0.4rem 0 0.3rem;
  }

  &__meta {
    font-family: $font-mono;
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__clock {
    flex-shrink: 0;
    padding: 0.35rem 0.7rem;
    font-family: $font-mono;
    font-size: $text-sm;
    font-variant-numeric: tabular-nums;
    box-shadow: inset 0 0 0 1px $line;

    &.is-low {
      color: $danger;
      box-shadow: inset 0 0 0 1px $danger;
    }
  }

  &__state {
    @include flex(column, flex-start, flex-start, 0.9rem);
    color: $ink-soft;

    &--error {
      padding: 1rem 1.1rem;
      color: $danger;
      background: $danger-bg;
    }
  }

  &__skeleton {
    @include flex(column, stretch, flex-start, 0.7rem);
  }

  &__sk {
    height: 48px;

    &--lg {
      height: 72px;
    }

    &--btn {
      height: 52px;
      background: color-mix(in srgb, #{$basalt} 14%, #{$quartz-deep});
    }
  }

  &__box {
    width: 100%;
    min-height: 1px;
  }

  &__secure {
    font-size: $text-xs;
    color: $ink-muted;

    i {
      margin-right: 0.3rem;
    }
  }

  &__foot {
    @include flex(column, stretch, flex-start, 0.8rem);
    padding-top: 1.2rem;
    border-top: 1px solid $line;
  }

  &__back {
    align-self: center;
    min-height: 40px;
    font-size: $text-sm;
    color: $ink-soft;
  }
}
</style>
