import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { orderService } from '@/services/order.service'
import { useCartStore } from '@/stores/cart'
import { dropBagSnapshot, takeBagSnapshot } from '@/components/cart/bagAlerts'
import { LAST_ORDER_KEY } from './useCheckout'
import type { ApiError, Order } from '@/types'

export type ResponseState = 'confirming' | 'approved' | 'rejected' | 'error'

/**
 * Payphone reversa el cobro si no se confirma en 5 minutos: la confirmación
 * sale apenas monta la página, sin esperar ningún clic.
 */
export function usePaymentResponse() {
  const route = useRoute()
  const cart = useCartStore()

  const state = ref<ResponseState>('confirming')
  const order = ref<Order | null>(null)
  const message = ref('')
  const email = ref('')

  try {
    const saved = JSON.parse(sessionStorage.getItem(LAST_ORDER_KEY) || 'null') as { email?: string } | null
    email.value = saved?.email ?? ''
  } catch {
    /* sin sessionStorage */
  }

  /** El pago no pasó: la bolsa vuelve tal como estaba antes de pagar. */
  function restoreBag() {
    const lines = takeBagSnapshot()
    if (lines.length && cart.isEmpty) {
      cart.$patch({ lines })
      cart.persist()
    }
  }

  async function confirm() {
    const id = String(route.query.id ?? '')
    const clientTransactionId = String(route.query.clientTransactionId ?? '')
    if (!id || !clientTransactionId) {
      state.value = 'error'
      message.value = 'Este enlace no trae los datos del pago. Si pagaste, revisa tu correo o escríbenos.'
      return
    }
    state.value = 'confirming'
    try {
      const res = await orderService.confirm(id, clientTransactionId)
      order.value = res.order
      message.value = res.message
      email.value = res.order.customer.email || email.value
      if (res.approved) {
        state.value = 'approved'
        cart.clear()
        dropBagSnapshot()
      } else {
        state.value = 'rejected'
        restoreBag()
      }
    } catch (e) {
      state.value = 'error'
      message.value = (e as ApiError).message
    }
  }

  onMounted(confirm)

  return { state, order, message, email, confirm }
}
