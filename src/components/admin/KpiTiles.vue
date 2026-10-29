<script setup lang="ts">
import { computed } from 'vue'
import type { AdminStats } from '@/types'
import { formatCents } from '@/utils/format'

const props = defineProps<{ stats: AdminStats }>()

const tiles = computed(() => [
  {
    key: 'month',
    label: 'Ventas del mes',
    value: formatCents(props.stats.revenueMonthCents),
    icon: 'fa-solid fa-chart-line',
  },
  {
    key: 'pending',
    label: 'Pedidos por atender',
    value: String(props.stats.ordersPendingFulfillment),
    icon: 'fa-solid fa-box-open',
    // Si hay transferencias por aprobar, son lo primero que hay que mirar.
    to: { name: 'AdminOrders', query: { status: props.stats.ordersByStatus?.review ? 'review' : 'paid' } },
    alert: props.stats.ordersPendingFulfillment > 0,
  },
  {
    key: 'leads',
    label: 'Solicitudes del mes',
    value: String(props.stats.leadsThisMonth),
    icon: 'fa-solid fa-envelope-open-text',
    to: { name: 'AdminLeads' },
  },
  {
    key: 'low',
    label: 'Piezas por agotarse',
    value: String(props.stats.lowStock?.length ?? 0),
    icon: 'fa-regular fa-gem',
  },
])
</script>

<template>
  <div class="kpis">
    <div class="kpis__hero">
      <p class="kpis__hero-label">[ Ventas de hoy ]</p>
      <p class="kpis__hero-value">{{ formatCents(stats.revenueTodayCents) }}</p>
      <p class="kpis__hero-note">{{ stats.ordersToday }} {{ stats.ordersToday === 1 ? 'pedido' : 'pedidos' }} hoy</p>
    </div>
    <ul class="kpis__list">
      <li v-for="t in tiles" :key="t.key" class="kpis__tile" :class="{ 'kpis__tile--alert': t.alert }">
        <component :is="t.to ? 'RouterLink' : 'div'" v-bind="t.to ? { to: t.to } : {}" class="kpis__inner">
          <span class="kpis__icon" aria-hidden="true"><i :class="t.icon"></i></span>
          <span class="kpis__value">{{ t.value }}</span>
          <span class="kpis__label">{{ t.label }}</span>
          <i v-if="t.to" class="fa-solid fa-arrow-right kpis__go" aria-hidden="true"></i>
        </component>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.kpis {
  @include flex(column, stretch, flex-start, 0.8rem);

  @include from('xl') {
    flex-direction: row;
  }

  &__hero {
    @include flex(column, flex-start, flex-end, 0.3rem);
    padding: 1.3rem 1.4rem;
    border-radius: $radius-md;
    background: $basalt;
    color: $frost;
    min-height: 9rem;

    @include from('xl') {
      flex: 0 0 300px;
    }
  }

  &__hero-label {
    @include eyebrow;
    color: $silver;
  }

  &__hero-value {
    font-family: $font-serif;
    font-size: clamp(2.4rem, 1.8rem + 2.5vw, 3.4rem);
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }

  &__hero-note {
    font-size: 0.88rem;
    color: rgba($frost, 0.7);
  }

  // Siempre 2 × 2: se lee igual en el celular y junto a la cifra grande.
  &__list {
    list-style: none;
    @include flex(row, stretch, flex-start, 0.8rem);
    flex-wrap: wrap;
    flex: 1;
  }

  &__tile {
    @include flex(column, stretch, flex-start, 0);
    flex: 1 1 calc(50% - 0.4rem);
    min-width: 0;
  }

  &__inner {
    position: relative;
    @include flex(column, flex-start, flex-end, 0.15rem);
    flex: 1;
    min-height: 8rem;
    padding: 1rem 1.1rem;
    border-radius: $radius-md;
    background: $frost;
    border: 1px solid $line;
    transition: border-color 0.2s ease, transform 0.3s $ease;
    @include focus-ring;
  }

  a.kpis__inner:hover {
    border-color: $basalt;
    transform: translateY(-2px);
  }

  &__icon {
    position: absolute;
    top: 0.95rem;
    left: 1.1rem;
    font-size: 0.85rem;
    color: $ink-muted;
  }

  &__value {
    font-family: $font-serif;
    font-size: 1.9rem;
    line-height: 1.05;
    color: $ink;
    font-variant-numeric: tabular-nums;
  }

  &__label {
    font-size: 0.82rem;
    color: $ink-soft;
    line-height: 1.3;
  }

  &__go {
    position: absolute;
    top: 1.05rem;
    right: 1.1rem;
    font-size: 0.75rem;
    color: $ink-muted;
  }

  &__tile--alert &__inner {
    background: $warning-bg;
    border-color: $citrino;
  }

  &__tile--alert &__icon {
    color: #6b4d00;
  }
}
</style>
