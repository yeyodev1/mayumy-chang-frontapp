<script setup lang="ts">
import { computed } from 'vue'
import CheckoutSection from './CheckoutSection.vue'
import CheckoutField from './CheckoutField.vue'
import ChoiceCard from './ChoiceCard.vue'
import { citiesByProvince } from './ecuadorCities'
import { checkoutCopy } from './checkoutCopy'
import { fill, provinces, site } from '@/config/site'
import type { CheckoutErrors, CheckoutForm } from '@/composables/useCheckout'
import type { ShippingSettings } from '@/types'

const props = defineProps<{ form: CheckoutForm; errors: CheckoutErrors; shipping: ShippingSettings; rates: { local: string; national: string; city: string } }>()
const emit = defineEmits<{ blur: [key: keyof CheckoutForm] }>()
const f = props.form
const c = site.checkout
const t = checkoutCopy.fields

// Sin provincia elegida se sugieren las ciudades grandes de todo el país.
const cities = computed(() =>
  f.province ? citiesByProvince[f.province] ?? [] : ['Guayaquil', 'Quito', 'Cuenca', 'Manta', 'Machala', 'Ambato', 'Loja', 'Salinas'],
)
const shipText = computed(() => fill(checkoutCopy.shipFrom, props.rates).replace('Servientrega · ', ''))
</script>

<template>
  <CheckoutSection num="02" :title="c.delivery">
    <div class="cdel__methods" role="radiogroup" :aria-label="c.delivery">
      <ChoiceCard v-model="f.method" name="method" value="delivery" icon="fa-solid fa-truck-fast" :title="c.deliveryShip" :text="shipText" />
      <ChoiceCard
        v-if="shipping.pickupEnabled"
        v-model="f.method"
        name="method"
        value="pickup"
        icon="fa-solid fa-gem"
        :title="c.deliveryPickup"
        :text="`${shipping.pickup.name} · ${shipping.pickup.hours}`"
        :meta="checkoutCopy.pickupFree"
      />
    </div>

    <Transition name="rise" mode="out-in">
      <div v-if="f.method === 'delivery'" key="ship" class="cdel__fields">
        <div class="csec__row">
          <CheckoutField id="co-province" :label="c.province" :error="errors.province" v-slot="{ describedby, invalid }">
            <select id="co-province" v-model="f.province" autocomplete="address-level1" :aria-invalid="invalid" :aria-describedby="describedby" @blur="emit('blur', 'province')">
              <option value="" disabled>{{ t.provincePick }}</option>
              <option v-for="p in provinces" :key="p" :value="p">{{ p }}</option>
            </select>
          </CheckoutField>
          <CheckoutField id="co-city" :label="c.city" :error="errors.city" v-slot="{ describedby, invalid }">
            <input id="co-city" v-model="f.city" type="text" list="co-city-list" autocomplete="address-level2" :placeholder="t.cityPlaceholder" :aria-invalid="invalid" :aria-describedby="describedby" @blur="emit('blur', 'city')" @change="emit('blur', 'city')" />
            <datalist id="co-city-list">
              <option v-for="city in cities" :key="city" :value="city" />
            </datalist>
          </CheckoutField>
        </div>
        <CheckoutField id="co-address" :label="c.address" :error="errors.address" v-slot="{ describedby, invalid }">
          <input id="co-address" v-model="f.address" type="text" autocomplete="street-address" :placeholder="t.addressPlaceholder" :aria-invalid="invalid" :aria-describedby="describedby" @blur="emit('blur', 'address')" />
        </CheckoutField>
        <CheckoutField id="co-reference" :label="c.reference" optional>
          <input id="co-reference" v-model="f.reference" type="text" :placeholder="t.referencePlaceholder" />
        </CheckoutField>
        <p class="cdel__note">{{ c.sameDayNote }}</p>
      </div>

      <div v-else key="pickup" class="cdel__pickup">
        <p class="cdel__eyebrow">[ {{ shipping.pickup.city }} ]</p>
        <p class="cdel__pname">{{ shipping.pickup.name }}</p>
        <p>{{ shipping.pickup.address }}</p>
        <p class="cdel__hours">{{ shipping.pickup.hours }}</p>
        <p class="cdel__note">{{ checkoutCopy.pickupNote }}</p>
      </div>
    </Transition>
  </CheckoutSection>
</template>

<style scoped lang="scss">
.cdel {
  &__methods {
    @include flex-cards(12rem, 0.75rem);
  }

  &__fields {
    @include flex(column, stretch, flex-start, 1.1rem);
  }

  &__note {
    font-size: $text-sm;
    color: $ink-muted;
  }

  &__pickup {
    @include flex(column, flex-start, flex-start, 0.2rem);
    padding: 1.1rem 1.2rem;
    border-left: 1px solid $basalt;
    background: $quartz-deep;
    color: $ink-soft;
    font-size: $text-sm;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__pname {
    font-family: $font-serif;
    font-size: $text-lg;
    color: $ink;
  }

  &__hours {
    @include eyebrow;
    margin-top: 0.3rem;
  }
}
</style>
