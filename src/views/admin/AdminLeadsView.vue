<script setup lang="ts">
import { computed } from 'vue'
import { useAdminLeads } from '@/composables/useAdminLeads'
import { LEAD_KINDS, LEAD_STATUS, LEAD_STATUS_ORDER } from '@/components/admin/adminCatalog'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminSearch from '@/components/admin/AdminSearch.vue'
import AdminPagination from '@/components/admin/AdminPagination.vue'
import AdminState from '@/components/admin/AdminState.vue'
import LeadCard from '@/components/admin/LeadCard.vue'

const { search, page, filters, items, total, pages, loading, error, load, goTo, kind, busyId, setStatus } =
  useAdminLeads()

// TODO coordinador: mover a site.ts (copy del panel admin)
const INTRO = {
  bespoke: 'Personas que pidieron una cita o un diseño a medida (anillos de compromiso y piezas especiales).',
  waitlist: 'Personas que se anotaron para enterarse primero de la colección Galápagos.',
}
const emptyText = computed(() =>
  search.value || filters.status
    ? 'Ninguna solicitud coincide con ese filtro.'
    : kind.value === 'bespoke'
      ? 'Todavía no hay solicitudes de diseño a medida.'
      : 'Todavía nadie se anotó en la lista de Galápagos.',
)
</script>

<template>
  <section>
    <AdminPageHeader eyebrow="Clientas" title="Solicitudes" :subtitle="INTRO[kind]" />

    <div class="leads__tabs" role="tablist" aria-label="Tipo de solicitud">
      <button
        v-for="k in LEAD_KINDS"
        :key="k.id"
        type="button"
        role="tab"
        class="leads__tab"
        :class="{ 'is-on': kind === k.id }"
        :aria-selected="kind === k.id"
        @click="kind = k.id"
      >
        <i :class="k.icon" aria-hidden="true"></i> {{ k.label }}
      </button>
    </div>

    <div class="leads__tools">
      <AdminSearch v-model="search" label="Buscar solicitudes" placeholder="Nombre, correo, teléfono o mensaje" />
      <label for="lead-status" class="visually-hidden">Estado</label>
      <select id="lead-status" v-model="filters.status" class="leads__status">
        <option value="">Todos los estados</option>
        <option v-for="s in LEAD_STATUS_ORDER" :key="s" :value="s">{{ LEAD_STATUS[s].label }}</option>
      </select>
    </div>

    <AdminState
      :loading="loading && !items.length"
      :error="error"
      :empty="!items.length"
      shape="cards"
      :rows="3"
      empty-icon="fa-regular fa-envelope-open"
      :empty-text="emptyText"
      @retry="load"
    />

    <ul v-if="items.length" class="leads__list" :class="{ 'is-stale': loading }">
      <li v-for="lead in items" :key="lead._id">
        <LeadCard :lead="lead" :busy="busyId === lead._id" @status="setStatus(lead, $event)" />
      </li>
    </ul>

    <AdminPagination :page="page" :pages="pages" :total="total" noun="solicitudes" noun-one="solicitud" @go="goTo" />
  </section>
</template>

<style scoped lang="scss">
.leads {
  &__tabs {
    @include flex(row, stretch, flex-start, 0);
    margin-bottom: 1rem;
    border-bottom: 1px solid $line;
  }

  &__tab {
    @include flex(row, center, center, 0.5rem);
    flex: 1 1 0;
    min-height: 3rem;
    padding: 0 1rem;
    margin-bottom: -1px;
    border-bottom: 2px solid transparent;
    font-size: 0.95rem;
    color: $ink-soft;
    @include focus-ring;

    @include from('md') {
      flex: 0 0 auto;
    }

    &.is-on {
      border-bottom-color: $basalt;
      color: $ink;
    }
  }

  &__tools {
    @include flex(row, center, flex-start, 0.6rem);
    flex-wrap: wrap;
    margin-bottom: 1.2rem;
  }

  &__status {
    flex: 1 1 200px;
    min-height: 2.9rem;

    @include from('md') {
      flex: 0 0 220px;
    }
  }

  &__list {
    list-style: none;
    @include flex-cards(300px, 0.9rem);

    @include from('md') {
      > li {
        max-width: calc((100% - 0.9rem) / 2);
      }
    }

    @include from('xl') {
      > li {
        max-width: calc((100% - 1.8rem) / 3);
      }
    }
  }
}

.is-stale {
  opacity: 0.55;
}
</style>
