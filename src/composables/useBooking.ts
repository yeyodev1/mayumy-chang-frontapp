import { computed } from 'vue'
import { site, whatsappLink } from '@/config/site'
import { useStoreConfig } from './useStoreConfig'

/**
 * A dónde lleva "Agendar mi cita": la agenda de Confirmafy de Mayumy si ya está
 * configurada en el panel; si no, WhatsApp con el mensaje listo.
 */
export function useBooking() {
  const { config } = useStoreConfig()
  const hasAgenda = computed(() => /^https?:\/\//.test(config.value.booking.url))
  const href = computed(() =>
    hasAgenda.value ? config.value.booking.url : whatsappLink(site.bespoke.whatsappMsg, config.value.contact.whatsapp),
  )
  const label = computed(() =>
    hasAgenda.value ? config.value.booking.label || site.bespoke.book : site.bespoke.bookWhatsapp,
  )
  return { href, label, hasAgenda }
}
