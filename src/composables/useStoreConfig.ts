import { computed, ref } from 'vue'
import { orderService } from '@/services/order.service'
import { defaultPayments } from '@/utils/payments'
import { formatCents } from '@/utils/format'
import type { DeliveryMethod, ShippingZone, StoreConfig } from '@/types'

/**
 * Ajustes públicos de la tienda (envío, pagos, citas, contacto, Galápagos),
 * pedidos una sola vez por carga y compartidos por toda la web. Mientras llegan
 * rigen los valores iniciales del server para que nada parpadee.
 */
const config = ref<StoreConfig>({
  shipping: {
    baseCity: 'Guayaquil',
    localCents: 400,
    nationalCents: 700,
    freeFromCents: 0,
    pickupEnabled: true,
    pickup: { name: 'Taller Mayumy Chang', address: 'Guayaquil (con cita previa)', city: 'Guayaquil', hours: 'Lun a Sáb · con cita' },
  },
  payments: defaultPayments(),
  bankAccounts: [],
  booking: { url: '', label: 'Agendar cita' },
  contact: { whatsapp: '593985870627', instagram: '', email: '', showroom: 'Guayaquil, Ecuador' },
  collab: {
    enabled: true,
    eyebrow: 'Próximamente · Edición limitada',
    title: 'Galápagos',
    subtitle: 'Una colección de alta joyería nacida en el archipiélago. Piezas numeradas, hechas a mano.',
    release: '2027',
  },
})
const loaded = ref(false)
let request: Promise<void> | null = null

function load() {
  if (!request) {
    request = orderService
      .config()
      .then((data) => {
        config.value = { ...config.value, ...data, payments: data.payments ?? defaultPayments() }
        loaded.value = true
      })
      .catch(() => {
        // Sin red quedan los valores iniciales; el server recalcula igual al comprar.
        request = null
      })
  }
  return request
}

/** Sin tildes y en minúsculas: "Guayaquil " y "guayaquil" son la misma ciudad. */
export function normalizeCity(city: string): string {
  return city.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase()
}

/** Mismo cálculo que el server (ver CONTRATO-API.md → Envío). */
export function shippingFor(
  subtotalCents: number,
  method: DeliveryMethod,
  city: string,
  cfg: StoreConfig,
): { cents: number; zone: ShippingZone } {
  const s = cfg.shipping
  if (method === 'pickup') return { cents: 0, zone: 'pickup' }
  if (s.freeFromCents > 0 && subtotalCents >= s.freeFromCents) return { cents: 0, zone: 'free' }
  if (city && normalizeCity(city) === normalizeCity(s.baseCity)) return { cents: s.localCents, zone: 'local' }
  return { cents: s.nationalCents, zone: 'national' }
}

export function useStoreConfig() {
  load()
  const shippingCopy = computed(() => ({
    local: formatCents(config.value.shipping.localCents),
    national: formatCents(config.value.shipping.nationalCents),
    city: config.value.shipping.baseCity,
  }))
  return { config, loaded, shippingCopy, load }
}
