import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { orderService } from '@/services/order.service'
import { trackingCopy } from '@/components/tracking/trackingCopy'
import { LAST_ORDER_KEY } from './useCheckout'
import type { ApiError } from '@/types'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * "mc 7f3k2a" o "#MC-7F3K2A" → "MC-7F3K2A": se acepta como lo pegue la clienta.
 * Otro formato (autorización o número de transacción de Payphone) pasa tal cual:
 * el server también lo busca por ahí.
 */
export function normalizeOrderCode(raw: string): string {
  const trimmed = raw.trim().replace(/^#/, '')
  const clean = trimmed.toUpperCase().replace(/[^A-Z0-9]/g, '')
  return /^MC[A-Z0-9]{6}$/.test(clean) ? `MC-${clean.slice(2)}` : trimmed
}

/** Seguimiento sin cuenta: código del pedido + correo → detalle del pedido. */
export function useTrackLookup() {
  const route = useRoute()
  const router = useRouter()

  const code = ref('')
  const email = ref('')
  const loading = ref(false)
  const error = ref('')
  const errors = reactive<{ code?: string; email?: string }>({})

  function validate(): boolean {
    errors.code = normalizeOrderCode(code.value).length < 4 ? trackingCopy.errors.code : undefined
    errors.email = EMAIL.test(email.value.trim()) ? undefined : trackingCopy.errors.email
    const first = errors.code ? 'trk-code' : errors.email ? 'trk-email' : ''
    if (first) document.getElementById(first)?.focus()
    return !first
  }

  async function submit() {
    error.value = ''
    if (!validate()) return
    const clean = normalizeOrderCode(code.value)
    const mail = email.value.trim().toLowerCase()
    loading.value = true
    try {
      // Se verifica antes de navegar: el error se ve acá, junto al formulario.
      const order = await orderService.byCode(clean, mail)
      router.push({ name: 'OrderTracking', params: { code: order.code }, query: { email: mail } })
    } catch (e) {
      const err = e as ApiError
      error.value = err.status === 404 ? trackingCopy.notFound : err.message
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    const q = route.query
    if (typeof q.code === 'string') code.value = q.code
    if (typeof q.email === 'string') email.value = q.email
    if (code.value && email.value) return
    try {
      const last = JSON.parse(sessionStorage.getItem(LAST_ORDER_KEY) || 'null') as { code?: string; email?: string } | null
      const saved = JSON.parse(localStorage.getItem('mayumy_customer') || 'null') as { email?: string } | null
      code.value ||= last?.code ?? ''
      email.value ||= last?.email || saved?.email || ''
    } catch {
      /* sin almacenamiento */
    }
  })

  return { code, email, loading, error, errors, submit }
}
