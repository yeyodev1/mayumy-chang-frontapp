import { computed, ref } from 'vue'
import { adminService } from '@/services/admin.service'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import type { AdminUser, ApiError } from '@/types'

export function useAdminUsers() {
  const toast = useToastStore()
  const userStore = useUserStore()

  const users = ref<AdminUser[]>([])
  const loading = ref(false)
  const error = ref<ApiError | null>(null)
  const busyId = ref<string | null>(null)
  const sendingTest = ref(false)

  const meId = computed(() => userStore.user?.id ?? '')
  const notifiedCount = computed(() => users.value.filter((u) => u.isActive && u.notifyOrders).length)

  async function load() {
    loading.value = true
    error.value = null
    try {
      users.value = await adminService.users()
    } catch (e) {
      error.value = e as ApiError
    } finally {
      loading.value = false
    }
  }

  function replace(updated: AdminUser) {
    users.value = users.value.map((u) => (u.id === updated.id ? updated : u))
  }

  async function update(user: AdminUser, patch: Partial<Pick<AdminUser, 'notifyOrders' | 'isActive'>>) {
    busyId.value = user.id
    try {
      replace(await adminService.updateUser(user.id, patch))
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      busyId.value = null
    }
  }

  async function create(payload: { name: string; email: string; password: string; notifyOrders: boolean }) {
    const created = await adminService.createUser(payload)
    users.value = [...users.value, created]
    toast.success(`${created.name} ya tiene acceso al panel`)
  }

  async function remove(user: AdminUser) {
    busyId.value = user.id
    try {
      await adminService.removeUser(user.id)
      users.value = users.value.filter((u) => u.id !== user.id)
      toast.success(`Se quitó el acceso a ${user.name || user.email}`)
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      busyId.value = null
    }
  }

  async function sendTest() {
    sendingTest.value = true
    try {
      const { sent, failed } = await adminService.sendTestSaleEmail()
      if (sent.length) toast.success(`Correo de prueba enviado a ${sent.length} ${sent.length === 1 ? 'persona' : 'personas'}`)
      if (failed.length) toast.error(`No se pudo enviar a: ${failed.join(', ')}`)
      if (!sent.length && !failed.length) toast.error('No hay nadie con el aviso de ventas activo')
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      sendingTest.value = false
    }
  }

  return { users, loading, error, busyId, sendingTest, meId, notifiedCount, load, update, create, remove, sendTest }
}
