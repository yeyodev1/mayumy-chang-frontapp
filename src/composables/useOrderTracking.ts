import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { orderService } from '@/services/order.service'
import { trackingCopy } from '@/components/tracking/trackingCopy'
import { LAST_ORDER_KEY } from './useCheckout'
import type { ApiError, Order } from '@/types'

/** Seguimiento sin login: código en la URL + correo (del query o del último pedido en este dispositivo). */
export function useOrderTracking() {
  const route = useRoute()

  const code = String(route.params.code ?? '').toUpperCase()
  const email = ref(typeof route.query.email === 'string' ? route.query.email : '')
  const order = ref<Order | null>(null)
  // Arranca cargando si ya hay correo: así el primer cuadro es el skeleton, no el formulario.
  const loading = ref(Boolean(email.value))
  const error = ref('')

  async function lookup() {
    if (!email.value.trim()) return
    loading.value = true
    error.value = ''
    try {
      order.value = await orderService.byCode(code, email.value.trim().toLowerCase())
    } catch (e) {
      const err = e as ApiError
      error.value = err.status === 404 ? trackingCopy.notFound : err.message
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    if (!email.value) {
      try {
        const saved = JSON.parse(sessionStorage.getItem(LAST_ORDER_KEY) || 'null') as { code?: string; email?: string } | null
        if (saved?.code === code && saved.email) email.value = saved.email
      } catch {
        /* sin sessionStorage */
      }
    }
    if (email.value) lookup()
  })

  return { code, email, order, loading, error, lookup }
}
