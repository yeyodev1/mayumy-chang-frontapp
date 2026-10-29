<script setup lang="ts">
import { computed } from 'vue'
import type { AdminStats } from '@/types'
import { ORDER_STATUS, ORDER_STATUS_ORDER } from '@/utils/orderStatus'
import { formatCents } from '@/utils/format'
import AdminCard from './AdminCard.vue'

const props = defineProps<{ stats: AdminStats }>()

const statuses = computed(() => {
  const by = props.stats.ordersByStatus || {}
  const max = Math.max(1, ...ORDER_STATUS_ORDER.map((s) => by[s] ?? 0))
  return ORDER_STATUS_ORDER.map((s) => ({ status: s, meta: ORDER_STATUS[s], count: by[s] ?? 0, pct: ((by[s] ?? 0) / max) * 100 }))
})

const top = computed(() => {
  const list = (props.stats.topProducts ?? []).slice(0, 5)
  const max = Math.max(1, ...list.map((p) => p.revenueCents))
  return list.map((p) => ({ ...p, pct: (p.revenueCents / max) * 100 }))
})

const LOW_MAX = 6
const low = computed(() => props.stats.lowStock ?? [])
const lowShown = computed(() => low.value.slice(0, LOW_MAX))
</script>

<template>
  <div class="breakdowns">
    <AdminCard title="Top piezas" icon="fa-solid fa-ranking-star">
      <p v-if="!top.length" class="breakdowns__empty">Cuando haya ventas pagadas verás aquí las piezas que más salen.</p>
      <ol v-else class="bars">
        <li v-for="p in top" :key="p.name" class="bars__row bars__row--static">
          <span class="bars__label bars__label--wide">
            <span class="bars__name">{{ p.name }}</span>
            <small>{{ p.quantity }} {{ p.quantity === 1 ? 'vendida' : 'vendidas' }}</small>
          </span>
          <span class="bars__track" aria-hidden="true">
            <span class="bars__fill" :style="{ width: `${p.pct}%` }"></span>
          </span>
          <span class="bars__value">{{ formatCents(p.revenueCents) }}</span>
        </li>
      </ol>
    </AdminCard>

    <AdminCard title="Por agotarse" icon="fa-regular fa-gem">
      <p v-if="!low.length" class="breakdowns__empty">Todas las piezas publicadas tienen más de una unidad.</p>
      <ul v-else class="low">
        <li v-for="p in lowShown" :key="p._id" class="low__row">
          <span class="low__name">{{ p.name }}</span>
          <span class="low__stock" :class="{ 'low__stock--out': p.stockTotal === 0 }">
            {{ p.stockTotal === 0 ? 'Agotada' : `Queda ${p.stockTotal}` }}
          </span>
          <RouterLink :to="{ name: 'AdminProductEdit', params: { id: p._id } }" class="low__edit" :aria-label="`Editar ${p.name}`">
            Editar
          </RouterLink>
        </li>
      </ul>
      <RouterLink v-if="low.length > LOW_MAX" :to="{ name: 'AdminProducts' }" class="low__more">
        Y {{ low.length - LOW_MAX }} más · ver en Productos
      </RouterLink>
    </AdminCard>

    <AdminCard title="Pedidos por estado" icon="fa-solid fa-layer-group">
      <ul class="bars">
        <li v-for="s in statuses" :key="s.status">
          <RouterLink :to="{ name: 'AdminOrders', query: { status: s.status } }" class="bars__row">
            <span class="bars__label">
              <i :class="s.meta.icon" :style="{ color: s.meta.solid }" aria-hidden="true"></i>
              {{ s.meta.label }}
            </span>
            <span class="bars__track" aria-hidden="true">
              <span class="bars__fill" :style="{ width: `${s.pct}%`, background: s.meta.solid }"></span>
            </span>
            <span class="bars__value">{{ s.count }}</span>
          </RouterLink>
        </li>
      </ul>
    </AdminCard>
  </div>
</template>

<style scoped lang="scss">
.breakdowns {
  @include flex-cards(300px, 1rem);
  align-items: flex-start;

  &__empty {
    color: $ink-soft;
    font-size: 0.9rem;
  }
}

.low {
  list-style: none;

  &__more {
    display: inline-block;
    margin-top: 0.8rem;
    font-size: 0.85rem;
    text-decoration: underline;
    text-underline-offset: 3px;
    color: $ink-soft;
    @include focus-ring;
  }

  &__row {
    @include flex(row, center, flex-start, 0.6rem);
    min-height: 3rem;
    border-bottom: 1px solid $line;

    &:last-child {
      border-bottom: 0;
    }
  }

  &__name {
    flex: 1;
    min-width: 0;
    font-family: $font-serif;
    font-size: 1.1rem;
    line-height: 1.2;
  }

  &__stock {
    @include eyebrow;
    flex-shrink: 0;
    color: $ink-soft;

    &--out {
      color: $danger;
    }
  }

  &__edit {
    flex-shrink: 0;
    padding: 0.5rem 0.7rem;
    border: 1px solid $line;
    border-radius: $radius-sm;
    font-size: 0.82rem;
    @include focus-ring;

    &:hover {
      border-color: $basalt;
    }
  }
}

.bars {
  list-style: none;
  @include flex(column, stretch, flex-start, 0.15rem);

  &__row {
    @include flex(row, center, flex-start, 0.4rem 0.8rem);
    flex-wrap: wrap;
    padding: 0.5rem 0.4rem;
    border-radius: $radius-sm;
    @include focus-ring;

    &:not(&--static):hover {
      background: $quartz;
    }
  }

  &__label {
    @include flex(row, center, flex-start, 0.5rem);
    flex: 0 0 9rem;
    font-size: 0.88rem;
    color: $ink;

    i {
      width: 1rem;
      text-align: center;
      font-size: 0.78rem;
    }

    &--wide {
      flex: 1 1 100%;
      flex-direction: column;
      align-items: flex-start;
      gap: 0;

      small {
        font-size: 0.78rem;
        color: $ink-muted;
      }
    }
  }

  &__name {
    font-family: $font-serif;
    font-size: 1.1rem;
    line-height: 1.2;
  }

  &__track {
    flex: 1;
    min-width: 3rem;
    height: 0.35rem;
    border-radius: $radius-pill;
    background: $quartz-deep;
    overflow: hidden;
  }

  &__fill {
    display: block;
    height: 100%;
    border-radius: $radius-pill;
    background: $basalt;
  }

  &__value {
    flex: 0 0 auto;
    min-width: 2rem;
    text-align: right;
    font-family: $font-mono;
    font-size: 0.85rem;
    font-variant-numeric: tabular-nums;
  }
}
</style>
