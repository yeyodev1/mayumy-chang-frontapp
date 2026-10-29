<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useAdminPending } from '@/composables/useAdminPending'
import { firstName } from '@/components/admin/adminFormat'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminState from '@/components/admin/AdminState.vue'
import AdminCard from '@/components/admin/AdminCard.vue'
import KpiTiles from '@/components/admin/KpiTiles.vue'
import SalesChart from '@/components/admin/SalesChart.vue'
import DashboardBreakdowns from '@/components/admin/DashboardBreakdowns.vue'
import DashboardSkeleton from '@/components/admin/DashboardSkeleton.vue'

const userStore = useUserStore()
const { stats, refreshPending } = useAdminPending()
const loading = ref(!stats.value)
const error = ref('')

async function load() {
  loading.value = !stats.value
  error.value = ''
  const result = await refreshPending()
  if (!result && !stats.value) error.value = 'No se pudieron cargar las cifras del panel.'
  loading.value = false
}

const greeting = computed(() => {
  const h = Number(new Date().toLocaleString('en-US', { hour: 'numeric', hour12: false, timeZone: 'America/Guayaquil' }))
  const name = firstName(userStore.user?.name || '')
  const hello = h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches'
  return name ? `${hello}, ${name}` : hello
})

const today = new Intl.DateTimeFormat('es-EC', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: 'America/Guayaquil',
}).format(new Date())

// TODO coordinador: mover a site.ts (copy del panel admin)
const QUICK = [
  { to: { name: 'AdminOrders', query: { status: 'paid' } }, label: 'Pedidos por preparar', icon: 'fa-solid fa-box-open' },
  { to: { name: 'AdminProductNew' }, label: 'Nueva pieza', icon: 'fa-solid fa-plus' },
  { to: { name: 'AdminLeads' }, label: 'Ver solicitudes', icon: 'fa-solid fa-envelope-open-text' },
  { to: { name: 'AdminSettings' }, label: 'Envíos y citas', icon: 'fa-solid fa-sliders' },
]

onMounted(load)
</script>

<template>
  <section class="dash">
    <AdminPageHeader :eyebrow="today" :title="greeting" />

    <DashboardSkeleton v-if="loading" />
    <AdminState v-else :error="error" @retry="load" />

    <template v-if="stats && !loading">
      <KpiTiles :stats="stats" />

      <AdminCard class="dash__chart">
        <SalesChart :days="stats.salesLast30 ?? []" />
      </AdminCard>

      <DashboardBreakdowns :stats="stats" />

      <nav class="dash__quick" aria-label="Accesos rápidos">
        <RouterLink v-for="q in QUICK" :key="q.label" :to="q.to" class="dash__quick-link">
          <i :class="q.icon" aria-hidden="true"></i>
          {{ q.label }}
        </RouterLink>
      </nav>
    </template>
  </section>
</template>

<style scoped lang="scss">
.dash {
  @include flex(column, stretch, flex-start, 1rem);

  :deep(.page-head) {
    margin-bottom: 0.4rem;
  }

  &__quick {
    @include flex-cards(200px, 0.6rem);
  }

  &__quick-link {
    @include flex(row, center, flex-start, 0.7rem);
    min-height: 3.2rem;
    padding: 0 1.1rem;
    border-radius: $radius-md;
    border: 1px solid $line;
    background: $frost;
    font-size: 0.92rem;
    color: $ink;
    transition: border-color 0.2s ease;
    @include focus-ring;

    i {
      color: $ink-muted;
    }

    &:hover {
      border-color: $basalt;
    }
  }
}
</style>
