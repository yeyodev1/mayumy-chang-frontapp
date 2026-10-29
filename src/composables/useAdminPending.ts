import { ref } from 'vue'
import { adminService } from '@/services/admin.service'
import type { AdminStats } from '@/types'

// Estado de módulo: el badge del menú y el panel comparten la misma cifra,
// y cambiar un pedido de estado la refresca en todos lados.
const pending = ref(0)
const stats = ref<AdminStats | null>(null)

export function useAdminPending() {
  async function refreshPending(): Promise<AdminStats | null> {
    try {
      stats.value = await adminService.stats()
      pending.value = stats.value.ordersPendingFulfillment
      return stats.value
    } catch {
      // El badge no es crítico: si falla, se queda con el último valor.
      return null
    }
  }

  return { pending, stats, refreshPending }
}
