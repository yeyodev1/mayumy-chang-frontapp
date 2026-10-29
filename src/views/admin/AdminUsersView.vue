<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { AdminUser } from '@/types'
import { useAdminUsers } from '@/composables/useAdminUsers'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminCard from '@/components/admin/AdminCard.vue'
import AdminState from '@/components/admin/AdminState.vue'
import AdminUserForm from '@/components/admin/users/AdminUserForm.vue'
import AdminUserCard from '@/components/admin/users/AdminUserCard.vue'
import BaseModal from '@/components/ui/BaseModal.vue'

const { users, loading, error, busyId, sendingTest, meId, notifiedCount, load, update, create, remove, sendTest } =
  useAdminUsers()

const toRemove = ref<AdminUser | null>(null)

function confirmRemove() {
  const user = toRemove.value
  toRemove.value = null
  if (user) remove(user)
}

onMounted(load)
</script>

<template>
  <section class="users">
    <AdminPageHeader
      eyebrow="Equipo"
      title="Usuarios del panel"
      subtitle="Quién puede entrar a administrar la tienda y quién recibe un correo con cada venta pagada."
    >
      <button type="button" class="btn btn--ghost" :disabled="sendingTest || !notifiedCount" @click="sendTest">
        <i class="fa-solid fa-paper-plane" aria-hidden="true"></i>
        {{ sendingTest ? 'Enviando…' : 'Enviar correo de prueba' }}
      </button>
    </AdminPageHeader>

    <AdminCard title="Dar acceso a alguien" icon="fa-solid fa-user-plus" class="users__add">
      <AdminUserForm :submit="create" />
    </AdminCard>

    <p v-if="users.length" class="users__summary">
      <i class="fa-solid fa-bell" aria-hidden="true"></i>
      {{ notifiedCount }} {{ notifiedCount === 1 ? 'persona recibe' : 'personas reciben' }} el correo de cada venta pagada.
    </p>

    <AdminState
      :loading="loading && !users.length"
      :error="error?.message"
      :empty="!users.length"
      empty-icon="fa-solid fa-user-shield"
      empty-text="Todavía no hay usuarios."
      @retry="load"
    />

    <ul v-if="users.length" class="users__list">
      <li v-for="user in users" :key="user.id">
        <AdminUserCard
          :user="user"
          :is-me="user.id === meId"
          :busy="busyId === user.id"
          @notify="update(user, { notifyOrders: $event })"
          @active="update(user, { isActive: $event })"
          @remove="toRemove = user"
        />
      </li>
    </ul>

    <BaseModal
      :open="Boolean(toRemove)"
      title="¿Quitar el acceso?"
      :message="toRemove ? `${toRemove.name || toRemove.email} ya no podrá entrar al panel ni recibirá correos de ventas.` : ''"
      confirm-label="Quitar acceso"
      danger
      @confirm="confirmRemove"
      @cancel="toRemove = null"
    />
  </section>
</template>

<style scoped lang="scss">
.users {
  &__add {
    margin-bottom: 1.4rem;
  }

  &__summary {
    @include flex(row, center, flex-start, 0.5rem);
    color: $ink-soft;
    font-size: $text-sm;
    margin-bottom: 0.9rem;

    i {
      color: $ink-muted;
    }
  }

  &__list {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.8rem);
  }
}
</style>
