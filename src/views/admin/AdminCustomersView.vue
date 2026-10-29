<script setup lang="ts">
import { adminService } from '@/services/admin.service'
import type { AdminCustomer } from '@/types'
import { useAdminList } from '@/composables/useAdminList'
import { formatCents, formatDate } from '@/utils/format'
import { firstName, whatsappTo } from '@/components/admin/adminFormat'
import { site } from '@/config/site'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminSearch from '@/components/admin/AdminSearch.vue'
import AdminTable from '@/components/admin/AdminTable.vue'
import AdminPagination from '@/components/admin/AdminPagination.vue'
import AdminState from '@/components/admin/AdminState.vue'

const { search, page, items, total, pages, loading, error, load, goTo } = useAdminList<AdminCustomer>((q) =>
  adminService.customers(q),
)

const wa = (c: AdminCustomer) =>
  whatsappTo(c.phone, `Hola ${firstName(c.name)}, te saludamos de ${site.name}.`)
</script>

<template>
  <section>
    <AdminPageHeader eyebrow="Ventas" title="Clientes" subtitle="Quiénes compran, cuánto y cuándo fue la última vez." />

    <div class="customers__tools">
      <AdminSearch v-model="search" label="Buscar clientes" placeholder="Nombre, email o teléfono" />
    </div>

    <AdminState
      :loading="loading && !items.length"
      :error="error"
      :empty="!items.length"
      empty-icon="fa-solid fa-user-group"
      :empty-text="search ? 'Ningún cliente coincide con esa búsqueda.' : 'Todavía no hay clientes registrados.'"
      @retry="load"
    />

    <AdminTable v-if="items.length" caption="Clientes" :class="{ 'is-stale': loading }">
      <thead>
        <tr>
          <th scope="col">Cliente</th>
          <th scope="col">Contacto</th>
          <th scope="col" class="is-num">Pedidos</th>
          <th scope="col" class="is-num">Total gastado</th>
          <th scope="col">Último pedido</th>
          <th scope="col"><span class="visually-hidden">Acciones</span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in items" :key="c._id">
          <td class="is-primary">
            <span class="customers__who">
              <span class="customers__avatar" aria-hidden="true">{{ c.name.charAt(0) || '?' }}</span>
              <span>
                <strong>{{ c.name || 'Sin nombre' }}</strong>
                <small>Desde {{ formatDate(c.createdAt) }}</small>
              </span>
            </span>
          </td>
          <td data-label="Contacto">
            <span class="customers__contact">
              <a :href="`mailto:${c.email}`">{{ c.email }}</a>
              <a v-if="c.phone" :href="`tel:${c.phone}`">{{ c.phone }}</a>
            </span>
          </td>
          <td data-label="Pedidos" class="is-num">{{ c.ordersCount }}</td>
          <td data-label="Total gastado" class="is-num customers__spent">{{ formatCents(c.totalSpentCents) }}</td>
          <td data-label="Último pedido">{{ c.lastOrderAt ? formatDate(c.lastOrderAt) : 'Sin pedidos' }}</td>
          <td class="is-actions">
            <a
              v-if="wa(c)"
              :href="wa(c)"
              target="_blank"
              rel="noopener"
              class="customers__wa"
              :aria-label="`Escribir a ${c.name} por WhatsApp`"
            >
              <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
              <span>WhatsApp</span>
            </a>
          </td>
        </tr>
      </tbody>
    </AdminTable>

    <AdminPagination :page="page" :pages="pages" :total="total" noun="clientes" @go="goTo" />
  </section>
</template>

<style scoped lang="scss">
.customers {
  &__tools {
    @include flex(row, center, flex-start, 0.8rem);
    margin-bottom: 1.2rem;
  }

  &__who {
    @include flex(row, center, flex-start, 0.7rem);

    > span:last-child {
      @include flex(column, flex-start, center, 0);
    }

    small {
      font-weight: 400;
      font-size: 0.78rem;
      color: $ink-muted;
    }
  }

  &__avatar {
    @include flex(row, center, center);
    width: 2.3rem;
    height: 2.3rem;
    flex-shrink: 0;
    border-radius: 50%;
    border: 1px solid $line;
    background: $quartz;
    font-family: $font-serif;
    font-size: 1.1rem;
    text-transform: uppercase;
  }

  &__contact {
    @include flex(column, flex-end, center, 0);
    min-width: 0;
    font-size: 0.88rem;

    a {
      overflow-wrap: anywhere;
      text-align: right;

      &:hover {
        text-decoration: underline;
      }
    }

    @media (min-width: 900px) {
      align-items: flex-start;

      a {
        text-align: left;
      }
    }
  }

  &__spent {
    font-family: $font-mono;
    font-size: 0.9rem;
  }

  &__wa {
    @include flex(row, center, center, 0.45rem);
    min-height: 2.5rem;
    padding: 0 1rem;
    border-radius: $radius-sm;
    border: 1px solid $basalt;
    font-size: 0.84rem;
    @include focus-ring;

    &:hover {
      background: $basalt;
      color: $frost;
    }
  }
}

.is-stale {
  opacity: 0.55;
}
</style>
