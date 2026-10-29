<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAdminPending } from '@/composables/useAdminPending'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import AdminMobileNav from '@/components/admin/AdminMobileNav.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const { pending, refreshPending } = useAdminPending()

const userName = computed(() => userStore.user?.name || userStore.user?.email || 'Mayumy')

function logout() {
  userStore.clear()
  router.push({ name: 'Login' })
}

onMounted(refreshPending)
// Cada vez que el dueño vuelve a la lista de pedidos o al panel, el badge se pone al día.
watch(
  () => route.name,
  (name) => {
    if (name === 'AdminOrders' || name === 'AdminDashboard') refreshPending()
  },
)
</script>

<template>
  <div class="admin">
    <a href="#admin-main" class="admin__skip">Saltar al contenido</a>
    <AdminSidebar class="admin__sidebar" :pending="pending" :user-name="userName" @logout="logout" />
    <div class="admin__body">
      <AdminMobileNav :pending="pending" @logout="logout" />
      <main id="admin-main" class="admin__main" tabindex="-1">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss">
.admin {
  @include flex(row, stretch, flex-start, 0);
  min-height: 100vh;
  background: $quartz;

  &__skip {
    position: absolute;
    left: 1rem;
    top: -4rem;
    z-index: 100;
    padding: 0.6rem 1rem;
    background: $basalt;
    color: $frost;
    border-radius: $radius-sm;

    &:focus {
      top: 1rem;
    }
  }

  &__sidebar {
    display: none !important;

    @include from('lg') {
      display: flex !important;
    }
  }

  &__body {
    @include flex(column, stretch, flex-start, 0);
    flex: 1;
    min-width: 0;
  }

  &__main {
    flex: 1;
    width: 100%;
    max-width: 1240px;
    margin-inline: auto;
    padding: 1.25rem 1rem calc(5.5rem + env(safe-area-inset-bottom));
    outline: none;

    @include from('md') {
      padding: 1.75rem 1.75rem 6rem;
    }

    @include from('lg') {
      padding: 2.4rem 2.5rem 3rem;
    }
  }
}

@media print {
  :global(body) {
    background: #fff;
  }

  .admin__sidebar {
    display: none !important;
  }

  .admin,
  .admin__main {
    background: #fff;
    padding: 0;
  }
}
</style>
