<script setup lang="ts">
import { onMounted } from 'vue'
import { adminService } from '@/services/admin.service'
import type { Order, OrderStatus } from '@/types'
import { useAdminList } from '@/composables/useAdminList'
import { useAdminPending } from '@/composables/useAdminPending'
import { formatCents } from '@/utils/format'
import { formatWhen } from '@/components/admin/adminFormat'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminSearch from '@/components/admin/AdminSearch.vue'
import AdminTable from '@/components/admin/AdminTable.vue'
import AdminPagination from '@/components/admin/AdminPagination.vue'
import AdminState from '@/components/admin/AdminState.vue'
import OrderStatusFilter from '@/components/admin/OrderStatusFilter.vue'
import OrderStatusPill from '@/components/admin/OrderStatusPill.vue'

const { search, page, filters, items, total, pages, loading, error, load, goTo } = useAdminList<Order, 'status'>(
  (q) => adminService.orders({ ...q, status: q.status as OrderStatus | '' }),
  ['status'],
)

// Los conteos de los chips salen de /admin/stats (el mismo que alimenta el badge).
const { stats, refreshPending } = useAdminPending()
onMounted(() => {
  if (!stats.value) refreshPending()
})
</script>

<template>
  <section class="orders">
    <AdminPageHeader eyebrow="Ventas" title="Pedidos" subtitle="Los pagados esperan que los prepares y despaches. Las transferencias quedan por aprobar hasta que veas el dinero." />

    <div class="orders__tools">
      <AdminSearch v-model="search" label="Buscar pedidos" placeholder="Código, email o nombre" />
      <OrderStatusFilter v-model="filters.status" :counts="stats?.ordersByStatus" />
    </div>

    <AdminState
      :loading="loading && !items.length"
      :error="error"
      :empty="!items.length"
      empty-icon="fa-solid fa-receipt"
      :empty-text="search || filters.status ? 'Ningún pedido coincide con ese filtro.' : 'Aún no hay pedidos. Cuando alguien compre en la tienda aparecerá aquí.'"
      @retry="load"
    />

    <AdminTable v-if="items.length" caption="Pedidos" :class="{ 'is-stale': loading }">
      <thead>
        <tr>
          <th scope="col">Código</th>
          <th scope="col">Fecha</th>
          <th scope="col">Cliente</th>
          <th scope="col">Entrega</th>
          <th scope="col" class="is-num">Total</th>
          <th scope="col">Estado</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in items" :key="order._id">
          <td class="is-primary">
            <RouterLink :to="{ name: 'AdminOrderDetail', params: { id: order._id } }" class="row-link orders__code">
              {{ order.code }}
            </RouterLink>
            <OrderStatusPill class="orders__pill-mobile" :status="order.status" />
          </td>
          <td data-label="Fecha" class="orders__muted">{{ formatWhen(order.createdAt) }}</td>
          <td data-label="Cliente">
            <span class="orders__customer">
              <strong>{{ order.customer.name }}</strong>
              <small>{{ order.customer.email }}</small>
            </span>
          </td>
          <td data-label="Entrega">
            <span class="orders__delivery">
              <i
                :class="order.delivery.method === 'pickup' ? 'fa-solid fa-store' : 'fa-solid fa-truck-fast'"
                aria-hidden="true"
              ></i>
              {{ order.delivery.method === 'pickup' ? 'Retiro en taller' : order.delivery.city }}
              <span v-if="order.isGift" class="orders__gift">Regalo</span>
            </span>
          </td>
          <td data-label="Total" class="is-num orders__total">{{ formatCents(order.totalCents) }}</td>
          <td data-label="Estado" class="orders__pill-desk"><OrderStatusPill :status="order.status" /></td>
        </tr>
      </tbody>
    </AdminTable>

    <AdminPagination :page="page" :pages="pages" :total="total" noun="pedidos" @go="goTo" />
  </section>
</template>

<style scoped lang="scss">
.orders {
  &__tools {
    @include flex(row, center, flex-start, 0.8rem);
    flex-wrap: wrap;
    margin-bottom: 1.2rem;

    > * {
      flex: 1 1 100%;
    }
  }

  &__code {
    font-family: $font-mono;
    font-size: 0.95rem;
    letter-spacing: 0.04em;
    color: $ink;
  }

  &__muted {
    color: $ink-soft;
    white-space: nowrap;
  }

  &__customer {
    @include flex(column, flex-end, center, 0);
    min-width: 0;
    text-align: right;

    strong {
      font-weight: 500;
    }

    small {
      color: $ink-muted;
      font-size: 0.8rem;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 220px;
      white-space: nowrap;
    }

    @media (min-width: 900px) {
      align-items: flex-start;
      text-align: left;
    }
  }

  &__delivery {
    @include flex(row, center, flex-start, 0.45rem);
    white-space: nowrap;

    i {
      color: $ink-muted;
      font-size: 0.85rem;
    }
  }

  &__total {
    font-family: $font-mono;
    font-size: 0.9rem;
  }

  &__gift {
    @include eyebrow;
    padding: 0.05rem 0.4rem;
    border-radius: $radius-sm;
    background: $info-bg;
    color: $zafiro;
    font-size: 0.62rem;
  }

  // En móvil el estado va en la cabecera de la tarjeta; en escritorio en su columna.
  &__pill-desk {
    display: none !important;

    @media (min-width: 900px) {
      display: table-cell !important;
    }
  }

  &__pill-mobile {
    @media (min-width: 900px) {
      display: none !important;
    }
  }
}

.is-stale {
  opacity: 0.55;
  transition: opacity 0.2s ease;
}
</style>
