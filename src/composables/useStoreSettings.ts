import { reactive, ref } from 'vue'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import { useStoreConfig } from './useStoreConfig'
import type { ApiError, BookingSettings, CollabSettings, ContactSettings, PickupPoint, StoreSettings } from '@/types'

/** Ajustes en el formulario: las tarifas se escriben en dólares (texto). */
export interface StoreSettingsForm {
  shipping: {
    baseCity: string
    local: string
    national: string
    freeFrom: string
    pickupEnabled: boolean
    pickup: PickupPoint
  }
  booking: BookingSettings
  contact: ContactSettings
  collab: CollabSettings
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const dollars = (cents: number) => (cents / 100).toFixed(2)
/** "4", "4,50" o "4.5" → 450. NaN si no es un monto válido. */
const toCents = (value: string) => {
  const n = Number(String(value).trim().replace(',', '.'))
  return String(value).trim() !== '' && Number.isFinite(n) && n >= 0 ? Math.round(n * 100) : NaN
}

function emptyForm(): StoreSettingsForm {
  return {
    shipping: {
      baseCity: '',
      local: '',
      national: '',
      freeFrom: '0',
      pickupEnabled: false,
      pickup: { name: '', address: '', city: '', hours: '' },
    },
    booking: { url: '', label: '' },
    contact: { whatsapp: '', instagram: '', email: '', showroom: '' },
    collab: { enabled: false, eyebrow: '', title: '', subtitle: '', release: '' },
  }
}

export function useStoreSettings() {
  const toast = useToastStore()
  const { config } = useStoreConfig()

  const form = reactive<StoreSettingsForm>(emptyForm())
  const errors = reactive<Record<string, string>>({})
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<ApiError | null>(null)
  const loaded = ref(false)

  function fill(data: StoreSettings) {
    const s = data.shipping
    form.shipping = {
      baseCity: s.baseCity,
      local: dollars(s.localCents),
      national: dollars(s.nationalCents),
      freeFrom: dollars(s.freeFromCents),
      pickupEnabled: s.pickupEnabled,
      pickup: { ...s.pickup },
    }
    form.booking = { ...data.booking }
    form.contact = { ...data.contact }
    form.collab = { ...data.collab }
  }

  // Mismas reglas que el server, para avisar antes de enviar y señalar el campo.
  function validate(): boolean {
    for (const key of Object.keys(errors)) delete errors[key]
    const s = form.shipping
    if (!s.baseCity.trim()) errors.baseCity = 'Escribe la ciudad base.'
    if (Number.isNaN(toCents(s.local))) errors.local = 'Monto no válido.'
    if (Number.isNaN(toCents(s.national))) errors.national = 'Monto no válido.'
    if (Number.isNaN(toCents(s.freeFrom || '0'))) errors.freeFrom = 'Monto no válido (0 = nunca).'
    if (s.pickupEnabled) {
      if (!s.pickup.name.trim()) errors.pickupName = 'Falta el nombre.'
      if (!s.pickup.address.trim()) errors.pickupAddress = 'Falta la dirección.'
      if (!s.pickup.city.trim()) errors.pickupCity = 'Falta la ciudad.'
    }
    const url = form.booking.url.trim()
    if (url && !/^https?:\/\/\S+$/i.test(url)) errors.bookingUrl = 'Pega el enlace completo, empieza con https://'
    const wa = form.contact.whatsapp.replace(/\D/g, '')
    if (wa && (wa.length < 8 || wa.length > 15)) errors.whatsapp = 'Con código de país, solo números (ej. 593985870627).'
    if (form.contact.email.trim() && !EMAIL.test(form.contact.email.trim())) errors.email = 'Revisa el correo.'
    if (form.collab.enabled && !form.collab.title.trim()) errors.collabTitle = 'Ponle un título antes de mostrarla.'
    return Object.keys(errors).length === 0
  }

  function payload(): StoreSettings {
    const s = form.shipping
    return {
      shipping: {
        baseCity: s.baseCity.trim(),
        localCents: toCents(s.local),
        nationalCents: toCents(s.national),
        freeFromCents: toCents(s.freeFrom || '0'),
        pickupEnabled: s.pickupEnabled,
        pickup: { ...s.pickup },
      },
      booking: { url: form.booking.url.trim(), label: form.booking.label.trim() },
      contact: { ...form.contact, whatsapp: form.contact.whatsapp.replace(/\D/g, '') },
      collab: { ...form.collab },
    }
  }

  async function load() {
    loading.value = true
    error.value = null
    try {
      fill(await adminService.settings())
      loaded.value = true
    } catch (e) {
      error.value = e as ApiError
    } finally {
      loading.value = false
    }
  }

  async function save() {
    if (!validate()) {
      toast.error('Revisa los campos marcados antes de guardar.')
      return
    }
    saving.value = true
    try {
      const saved = await adminService.updateSettings(payload())
      fill(saved)
      // La tienda abierta en esta pestaña ve el cambio sin recargar.
      config.value = { ...config.value, ...saved }
      toast.success('Listo, la tienda ya muestra los cambios')
    } catch (e) {
      toast.error((e as ApiError).message || 'No se pudo guardar')
    } finally {
      saving.value = false
    }
  }

  return { form, errors, loading, saving, error, loaded, load, save }
}
