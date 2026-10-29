<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import PriceRoll from './PriceRoll.vue'
import FreeShippingBar from '@/components/cart/FreeShippingBar.vue'
import { soldOutKeys } from '@/components/cart/bagAlerts'
import { checkoutCopy } from './checkoutCopy'
import { useCartStore } from '@/stores/cart'
import { formatCents } from '@/utils/format'
import { signedCents } from '@/utils/payments'
import { cldUrl } from '@/utils/cloudinary'
import { site } from '@/config/site'

const props = defineProps<{
  shippingCents: number
  shippingLabel: string
  cityPending: boolean
  isPickup: boolean
  totalCents: number
  adjustmentCents?: number
  adjustmentLabel?: string
}>()
const emit = defineEmits<{ remove: [key: string] }>()
const cart = useCartStore()
// En el celular el resumen arranca cerrado: el total siempre se ve arriba.
const open = ref(false)
// Si una pieza se agotó, se abre solo: la clienta tiene que ver cuál fue.
watch(() => soldOutKeys.value.length, (n) => { if (n) open.value = true })

const shippingValue = computed(() => {
  if (props.cityPending) return checkoutCopy.shipPending
  return props.shippingCents ? formatCents(props.shippingCents) : checkoutCopy.pickupFree
})
</script>

<template>
  <aside class="csum" :class="{ 'is-open': open }" aria-labelledby="csum-title">
    <button type="button" class="csum__toggle" :aria-expanded="open" aria-controls="csum-body" @click="open = !open">
      <span class="csum__toggle-label">
        {{ open ? checkoutCopy.summaryHide : checkoutCopy.summaryToggle }} ({{ cart.count }})
        <i class="fa-solid fa-chevron-down csum__chev" aria-hidden="true"></i>
      </span>
      <strong class="csum__toggle-total"><PriceRoll :value="formatCents(totalCents)" /></strong>
    </button>

    <div id="csum-body" class="csum__body">
      <h2 id="csum-title" class="csum__title">{{ site.checkout.summary }}</h2>
      <ul class="csum__lines">
        <li v-for="l in cart.lines" :key="l.key" class="csum__line" :class="{ 'is-out': soldOutKeys.includes(l.key) }">
          <span class="csum__thumb">
            <img v-if="l.image" :src="cldUrl(l.image, { w: 128 })" alt="" width="56" height="70" loading="lazy" />
            <span v-if="l.quantity > 1" class="csum__qty">{{ l.quantity }}</span>
          </span>
          <span class="csum__info">
            <span class="csum__name">{{ l.name }}</span>
            <span class="csum__variant">{{ l.maxQuantity <= 1 ? site.bag.uniqueNote : l.variantLabel }}</span>
            <span v-if="soldOutKeys.includes(l.key)" class="csum__out" role="alert">
              {{ site.bag.soldOut }}
              <button type="button" class="csum__remove" @click="emit('remove', l.key)">{{ checkoutCopy.soldOutRemove }}</button>
            </span>
          </span>
          <span class="csum__price">{{ formatCents(l.unitPriceCents * l.quantity) }}</span>
        </li>
      </ul>
      <FreeShippingBar v-if="!isPickup" :subtotal-cents="cart.subtotalCents" />
      <dl class="csum__totals">
        <div><dt>{{ site.bag.subtotal }}</dt><dd>{{ formatCents(cart.subtotalCents) }}</dd></div>
        <div>
          <dt><PriceRoll :value="shippingLabel" /></dt>
          <dd :class="{ 'is-pending': cityPending }"><PriceRoll :value="shippingValue" /></dd>
        </div>
        <div v-if="adjustmentCents"><dt>{{ adjustmentLabel }}</dt><dd>{{ signedCents(adjustmentCents) }}</dd></div>
        <div class="csum__total">
          <dt>{{ site.checkout.total }}</dt>
          <dd><PriceRoll :value="formatCents(totalCents)" /></dd>
        </div>
      </dl>
      <p class="csum__note">{{ site.checkout.frozenNote }}</p>
    </div>
  </aside>
</template>

<style scoped lang="scss">
.csum {
  background: $frost;
  box-shadow: inset 0 0 0 1px $line;
  border-radius: $radius-sm;

  &__toggle {
    @include flex(row, center, space-between, 1rem);
    width: 100%;
    min-height: 56px;
    padding: 0.8rem 1.1rem;
    @include focus-ring($ink);

    @include from('lg') {
      display: none;
    }
  }

  &__toggle-label {
    @include eyebrow;
    @include flex(row, center, flex-start, 0.5rem);
    color: $ink;
  }

  &__chev {
    font-size: 0.7rem;
    transition: transform 0.4s $ease;
  }

  &.is-open &__chev {
    transform: rotate(180deg);
  }

  &__toggle-total {
    font-family: $font-serif;
    font-weight: 400;
    font-size: $text-xl;
  }

  &__body {
    display: none;
    flex-direction: column;
    gap: 1.1rem;
    padding: 0.2rem 1.1rem 1.3rem;

    @include from('lg') {
      display: flex;
      padding: 1.5rem;
    }
  }

  &.is-open &__body {
    display: flex;
    animation: csum-open 0.5s $ease;
  }

  &__title {
    display: none;
    @include eyebrow;

    @include from('lg') {
      display: block;
    }
  }

  &__lines {
    @include flex(column, stretch, flex-start, 0.9rem);
    list-style: none;
  }

  &__line {
    @include flex(row, flex-start, flex-start, 0.85rem);
    transition: opacity 0.3s ease;

    &.is-out .csum__thumb,
    &.is-out .csum__price {
      opacity: 0.45;
    }
  }

  &__thumb {
    position: relative;
    flex: 0 0 56px;
    aspect-ratio: 4 / 5;
    background: $quartz-deep;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__qty {
    position: absolute;
    top: -0.4rem;
    right: -0.4rem;
    @include flex(row, center, center);
    min-width: 1.25rem;
    height: 1.25rem;
    border-radius: $radius-pill;
    background: $basalt;
    color: $frost;
    font-family: $font-mono;
    font-size: 0.68rem;
  }

  &__info {
    @include flex(column, flex-start, flex-start, 0.15rem);
    flex: 1;
    min-width: 0;
  }

  &__name {
    font-family: $font-serif;
    font-size: $text-lg;
    line-height: 1.1;
  }

  &__variant {
    @include eyebrow;
    color: $ink-muted;
  }

  &__out {
    @include flex(row, baseline, flex-start, 0.2rem 0.6rem);
    flex-wrap: wrap;
    margin-top: 0.2rem;
    font-size: $text-sm;
    color: $danger;
  }

  &__remove {
    font-size: $text-sm;
    text-decoration: underline;
    text-underline-offset: 3px;
    color: $ink;
  }

  &__price {
    font-family: $font-serif;
    font-size: $text-lg;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  &__totals {
    @include flex(column, stretch, flex-start, 0.45rem);
    padding-top: 1rem;
    border-top: 1px solid $line;

    > div {
      @include flex(row, baseline, space-between, 1rem);
      font-size: $text-sm;
      color: $ink-soft;
    }

    dd {
      color: $ink;
      font-variant-numeric: tabular-nums;

      &.is-pending {
        color: $ink-muted;
      }
    }
  }

  &__total {
    margin-top: 0.4rem;
    padding-top: 0.7rem;
    border-top: 1px solid $line;

    dt {
      @include eyebrow;
      color: $ink;
    }

    dd {
      font-family: $font-serif;
      font-size: $display-sm;
      line-height: 1;
    }
  }

  &__note {
    font-size: $text-xs;
    color: $ink-muted;
  }
}

@keyframes csum-open {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
}
</style>
