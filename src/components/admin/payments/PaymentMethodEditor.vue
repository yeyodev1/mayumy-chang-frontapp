<script setup lang="ts">
import { computed } from 'vue'
import AdminSwitch from '../AdminSwitch.vue'
import { formatCents } from '@/utils/format'
import { adjustmentFor, signedCents } from '@/utils/payments'
import type { PaymentMethod, PaymentMethodSettings } from '@/types'

const props = defineProps<{
  method: PaymentMethod
  settings: PaymentMethodSettings
  warning?: string
  /** Avisar aunque el método esté apagado. */
  alwaysWarn?: boolean
}>()

// TODO coordinador: mover a site.ts (copy del panel admin)
const META: Record<
  PaymentMethod,
  { title: string; text: string; icon: string; placeholder: string }
> = {
  card: {
    title: 'Tarjeta (Payphone)',
    text: 'Débito o crédito en línea. El pedido entra pagado.',
    icon: 'fa-solid fa-credit-card',
    placeholder: 'Comisión por pago con tarjeta',
  },
  transfer: {
    title: 'Transferencia',
    text: 'La clienta transfiere a tus cuentas y el pedido queda por aprobar hasta que veas el dinero.',
    icon: 'fa-solid fa-building-columns',
    placeholder: 'Descuento por transferencia',
  },
}
const meta = computed(() => META[props.method])
const adj = computed(() => props.settings.adjustment)
const id = (field: string) => `pay-${props.method}-${field}`

// Ejemplo en vivo para que se entienda qué ve la clienta con un pedido típico.
const EXAMPLE_CENTS = 5000
const example = computed(() => {
  const a = adj.value
  const value = Number(a.value) || 0
  if (a.kind === 'none' || value <= 0) return ''
  const cents = adjustmentFor(
    { ...a, value: a.unit === 'fixed' ? Math.round(value * 100) : value },
    EXAMPLE_CENTS,
  )
  return `En un pedido de ${formatCents(EXAMPLE_CENTS)}: ${signedCents(cents)} → total ${formatCents(EXAMPLE_CENTS + cents)}`
})
</script>

<template>
  <article class="pm" :class="{ 'pm--off': !settings.enabled }">
    <header class="pm__head">
      <i :class="meta.icon" class="pm__icon" aria-hidden="true"></i>
      <div class="pm__info">
        <h3 class="pm__title">{{ meta.title }}</h3>
        <p class="pm__text">{{ meta.text }}</p>
      </div>
      <AdminSwitch v-model="settings.enabled" :label="`Aceptar ${meta.title}`" />
    </header>

    <p v-if="warning && (settings.enabled || alwaysWarn)" class="pm__warn" role="status">
      <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i> {{ warning }}
    </p>

    <div v-if="settings.enabled" class="pm__adj">
      <div class="pm__field">
        <label :for="id('title')">Nombre en el checkout</label>
        <input :id="id('title')" v-model="settings.title" type="text" maxlength="40" required />
      </div>
      <div class="pm__field pm__field--label">
        <label :for="id('desc')">Descripción</label>
        <input :id="id('desc')" v-model="settings.description" type="text" maxlength="120" />
      </div>
    </div>

    <div v-if="settings.enabled" class="pm__adj">
      <div class="pm__field">
        <label :for="id('kind')">Valor especial</label>
        <select :id="id('kind')" v-model="adj.kind">
          <option value="none">Sin valor especial</option>
          <option value="surcharge">Recargo (+)</option>
          <option value="discount">Descuento (−)</option>
        </select>
      </div>
      <template v-if="adj.kind !== 'none'">
        <div class="pm__field pm__field--amount">
          <label :for="id('value')">{{
            adj.unit === 'percent' ? 'Porcentaje' : 'Monto en dólares'
          }}</label>
          <div class="pm__amount">
            <input
              :id="id('value')"
              v-model.number="adj.value"
              type="number"
              inputmode="decimal"
              min="0"
              :step="0.01"
              :max="adj.unit === 'percent' ? 50 : 1000"
              required
            />
            <select v-model="adj.unit" aria-label="Unidad">
              <option value="percent">%</option>
              <option value="fixed">$</option>
            </select>
          </div>
        </div>
        <div class="pm__field pm__field--label">
          <label :for="id('label')">Cómo lo ve la clienta</label>
          <input
            :id="id('label')"
            v-model="adj.label"
            type="text"
            maxlength="60"
            :placeholder="meta.placeholder"
          />
        </div>
        <p v-if="example" class="pm__example">{{ example }}</p>
      </template>
    </div>
  </article>
</template>

<style scoped lang="scss">
.pm {
  @include flex(column, stretch, flex-start, 0.9rem);
  padding: 1rem 0;
  border-top: 1px solid $line;

  &:first-child {
    border-top: 0;
    padding-top: 0;
  }

  &__head {
    @include flex(row, flex-start, flex-start, 0.8rem);
  }

  &__icon {
    flex: 0 0 auto;
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 50%;
    background: $quartz;
    color: $ink-soft;
    @include flex(row, center, center);
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__title {
    font-family: $font-serif;
    font-weight: 400;
    font-size: 1.3rem;
    line-height: 1.15;
  }

  &__text {
    font-size: 0.85rem;
    color: $ink-soft;
  }

  &--off &__title,
  &--off &__icon {
    opacity: 0.55;
  }

  &__warn {
    @include flex(row, baseline, flex-start, 0.5rem);
    padding: 0.6rem 0.8rem;
    border-radius: $radius-sm;
    background: $warning-bg;
    color: #6b4d00;
    font-size: 0.85rem;
  }

  &__adj {
    @include flex-cards(11rem, 0.8rem);
    padding-left: 3.2rem;

    @include until('sm') {
      padding-left: 0;
    }
  }

  &__field {
    @include flex(column, stretch, flex-start, 0);

    &--label {
      flex-basis: 16rem;
    }
  }

  &__amount {
    @include flex(row, stretch, flex-start, 0.4rem);

    input {
      flex: 1;
      min-width: 0;
    }

    select {
      flex: 0 0 4.2rem;
    }
  }

  &__example {
    flex-basis: 100%;
    font-size: 0.82rem;
    color: $ink-soft;
  }
}
</style>
