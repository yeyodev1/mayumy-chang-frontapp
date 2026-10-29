import { computed, nextTick, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { orderService } from '@/services/order.service'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import { fill, site } from '@/config/site'
import { PAYMENT_METHODS, adjustmentFor } from '@/utils/payments'
import { shippingFor, useStoreConfig } from './useStoreConfig'
import { PAYPHONE_TTL_MS, usePayphoneBox } from './usePayphoneBox'
import { checkoutCopy } from '@/components/checkout/checkoutCopy'
import { provinceOf } from '@/components/checkout/ecuadorCities'
import {
  clearSoldOut, dropBagSnapshot, lineFromSoldOutMessage, markSoldOut, saveBagSnapshot, takeBagSnapshot,
} from '@/components/cart/bagAlerts'
import type { ApiError, CreateOrderPayload, DeliveryMethod, Order, PaymentMethod } from '@/types'

export type CheckoutPhase = 'form' | 'paying' | 'expired' | 'placed'
export type CheckoutForm = ReturnType<typeof emptyForm>
export type CheckoutErrors = Partial<Record<keyof CheckoutForm, string>>
export const LAST_ORDER_KEY = 'mayumy_last_order'
// Sin cuentas de cliente: los datos se recuerdan en el dispositivo para que la
// siguiente compra sea casi de un toque.
const SAVED_CUSTOMER_KEY = 'mayumy_customer'
const REMEMBERED = ['name', 'email', 'phone', 'documentId', 'method', 'province', 'city', 'address', 'reference'] as const
// Desde el pago rechazado se llega con ?pago=transferencia.
export const TRANSFER_QUERY = 'transferencia'
// Orden en que se revisan y enfocan los errores al enviar.
const FIELD_ORDER = ['name', 'email', 'phone', 'documentId', 'province', 'city', 'address', 'giftNote'] as const

function emptyForm() {
  return {
    name: '',
    email: '',
    phone: '',
    documentId: '',
    method: 'delivery' as DeliveryMethod,
    province: '',
    city: '',
    address: '',
    reference: '',
    isGift: false,
    giftNote: '',
    notes: '',
    payment: 'card' as PaymentMethod,
  }
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const digits = (s: string) => s.replace(/\D/g, '')

export function useCheckout() {
  const cart = useCartStore()
  const route = useRoute()
  const toast = useToastStore()
  const { config } = useStoreConfig()
  const box = usePayphoneBox()
  const pickup = computed(() => config.value.shipping.pickup)
  const err = checkoutCopy.errors

  const form = reactive(emptyForm())
  const errors = reactive<CheckoutErrors>({})
  const touched = new Set<string>()
  const phase = ref<CheckoutPhase>('form')
  const submitting = ref(false)
  const formError = ref('')
  const cardDown = ref(false)
  const order = ref<Order | null>(null)
  const secondsLeft = ref(0)

  // ─── Envío y totales, en vivo con la ciudad ─────────────────────────
  const cityPending = computed(() => form.method === 'delivery' && !form.city.trim())
  const shipping = computed(() => shippingFor(cart.subtotalCents, form.method, form.city, config.value))
  const shippingCents = computed(() => (cityPending.value ? 0 : shipping.value.cents))
  const shippingLabel = computed(() => {
    const c = site.checkout
    if (form.method === 'pickup') return c.shippingPickup
    if (cityPending.value) return 'Envío'
    if (shipping.value.zone === 'free') return c.shippingFree
    if (shipping.value.zone === 'local') return fill(c.shippingLocal, { city: config.value.shipping.baseCity })
    return c.shippingNational
  })
  const enabledMethods = computed(() => PAYMENT_METHODS.filter((m) => config.value.payments[m]?.enabled))
  const adjustment = computed(() => config.value.payments[form.payment]?.adjustment)
  const adjustmentCents = computed(() => adjustmentFor(adjustment.value, cart.subtotalCents + shippingCents.value))
  const totalCents = computed(() => cart.subtotalCents + shippingCents.value + adjustmentCents.value)

  /** Si el método elegido se apagó desde el panel se pasa al que quede: sin tarjeta, transferencia. */
  function ensureEnabledPayment() {
    const first = enabledMethods.value[0]
    if (first && !enabledMethods.value.includes(form.payment)) form.payment = first
  }
  watch(enabledMethods, ensureEnabledPayment)

  // ─── Validación amable: al salir del campo, y se limpia mientras se corrige ──
  function check(key: keyof CheckoutForm): string {
    const delivery = form.method === 'delivery'
    switch (key) {
      case 'name': return form.name.trim().length < 3 ? err.name : ''
      case 'email': return EMAIL.test(form.email.trim()) ? '' : err.email
      case 'phone': return digits(form.phone).length < 9 || digits(form.phone).length > 13 ? err.phone : ''
      case 'documentId': return /^\d{10}(\d{3})?$/.test(digits(form.documentId)) ? '' : err.documentId
      case 'province': return delivery && !form.province ? err.province : ''
      case 'city': return delivery && form.city.trim().length < 2 ? err.city : ''
      case 'address': return delivery && form.address.trim().length < 6 ? err.address : ''
      case 'giftNote': return form.isGift && form.giftNote.length > 240 ? err.giftNote : ''
      default: return ''
    }
  }

  function setError(key: keyof CheckoutForm) {
    const message = check(key)
    if (message) errors[key] = message
    else delete errors[key]
  }

  function blur(key: keyof CheckoutForm) {
    touched.add(key)
    // Ciudad conocida sin provincia: se completa sola.
    if (key === 'city' && !form.province) form.province = provinceOf(form.city)
    setError(key)
    if (key === 'city' && form.province) setError('province')
  }

  watch(form, () => {
    for (const key of Object.keys(errors) as (keyof CheckoutForm)[]) if (touched.has(key)) setError(key)
  })

  function validateAll(): boolean {
    for (const key of FIELD_ORDER) {
      touched.add(key)
      setError(key)
    }
    const first = FIELD_ORDER.find((k) => errors[k])
    if (first) nextTick(() => document.getElementById(`co-${first}`)?.focus())
    return !first
  }

  // ─── Datos recordados ───────────────────────────────────────────────
  function prefill() {
    try {
      const saved = JSON.parse(localStorage.getItem(SAVED_CUSTOMER_KEY) || '{}')
      for (const key of REMEMBERED) {
        if (typeof saved[key] === 'string' && saved[key]) (form as Record<string, unknown>)[key] = saved[key]
      }
    } catch {
      /* sin almacenamiento: el formulario arranca vacío */
    }
    if (form.method === 'pickup' && !config.value.shipping.pickupEnabled) form.method = 'delivery'
    if (route.query.pago === TRANSFER_QUERY && enabledMethods.value.includes('transfer')) form.payment = 'transfer'
    ensureEnabledPayment()
  }
  watch(() => config.value.shipping.pickupEnabled, (on) => { if (!on) form.method = 'delivery' })

  function remember() {
    try {
      localStorage.setItem(SAVED_CUSTOMER_KEY, JSON.stringify(Object.fromEntries(REMEMBERED.map((k) => [k, form[k]]))))
      sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify({ code: order.value?.code, email: order.value?.customer.email }))
    } catch {
      /* modo privado */
    }
  }

  function payload(): CreateOrderPayload {
    const isPickup = form.method === 'pickup'
    const p = pickup.value
    const giftNote = form.isGift ? form.giftNote.trim() : ''
    return {
      items: cart.lines.map((l) => ({ productId: l.productId, variantId: l.variantId, quantity: l.quantity })),
      customer: {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        documentId: digits(form.documentId),
      },
      delivery: isPickup
        ? { method: 'pickup', province: provinceOf(p.city) || 'Guayas', city: p.city, address: `Retiro en ${p.name}`, reference: '', giftNote }
        : { method: 'delivery', province: form.province, city: form.city.trim(), address: form.address.trim(), reference: form.reference.trim(), giftNote },
      notes: form.notes.trim() || undefined,
      isGift: form.isGift,
      paymentMethod: form.payment,
    }
  }

  // ─── Cuenta regresiva de la cajita de Payphone ──────────────────────
  let expiry: ReturnType<typeof setInterval> | undefined
  function startCountdown() {
    clearInterval(expiry)
    const ends = Date.now() + PAYPHONE_TTL_MS
    secondsLeft.value = Math.round(PAYPHONE_TTL_MS / 1000)
    expiry = setInterval(() => {
      secondsLeft.value = Math.max(0, Math.round((ends - Date.now()) / 1000))
      if (secondsLeft.value === 0) {
        clearInterval(expiry)
        phase.value = 'expired'
      }
    }, 1000)
  }
  onBeforeUnmount(() => clearInterval(expiry))

  function handleError(e: unknown) {
    const error = e as ApiError
    if (error.status === 409) {
      const line = lineFromSoldOutMessage(error.message, cart.lines)
      if (line) markSoldOut(line.key)
    }
    if (error.status === 503 && form.payment === 'card') {
      cardDown.value = true
      formError.value = enabledMethods.value.includes('transfer') ? checkoutCopy.cardDown : error.message
      return
    }
    formError.value = error.message || 'No pudimos crear tu pedido. Intenta de nuevo.'
    toast.error(formError.value)
  }

  async function submit() {
    formError.value = ''
    if (cart.isEmpty || submitting.value || !validateAll()) return
    submitting.value = true
    try {
      const res = await orderService.create(payload())
      order.value = res.order
      remember()
      // Con tarjeta la bolsa se guarda aparte: si el pago no pasa, vuelve tal cual.
      if (res.payphone) saveBagSnapshot(cart.lines)
      cart.clear()
      clearSoldOut()
      if (!res.payphone) {
        phase.value = 'placed'
        return
      }
      phase.value = 'paying'
      startCountdown()
      await nextTick()
      await box.render(res.payphone)
    } catch (e) {
      handleError(e)
    } finally {
      submitting.value = false
    }
  }

  function restoreBag() {
    const lines = takeBagSnapshot()
    if (lines.length && cart.isEmpty) {
      cart.$patch({ lines })
      cart.persist()
    }
  }

  function backToForm() {
    clearInterval(expiry)
    restoreBag()
    phase.value = 'form'
  }

  /** Nuevo intento: el server crea otra orden con otro clientTransactionId. */
  function retry() {
    backToForm()
    submit()
  }

  function useTransfer() {
    form.payment = 'transfer'
    cardDown.value = false
    formError.value = ''
    if (phase.value !== 'form') backToForm()
  }

  function removeLine(key: string) {
    cart.remove(key)
    clearSoldOut(key)
    formError.value = ''
  }

  watch(phase, (p) => { if (p === 'placed') dropBagSnapshot() })

  return {
    form, errors, phase, submitting, formError, cardDown, order, secondsLeft, cart, config, box, pickup,
    cityPending, shippingCents, shippingLabel, adjustment, adjustmentCents, totalCents, enabledMethods,
    prefill, blur, submit, retry, backToForm, useTransfer, removeLine,
  }
}
