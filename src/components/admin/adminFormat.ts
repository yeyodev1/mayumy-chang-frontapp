// Formatos que solo usa el panel. Lo general (formatCents, formatDate) vive en utils/format.ts.

const dateTime = new Intl.DateTimeFormat('es-EC', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'America/Guayaquil',
})

const dayOnly = new Intl.DateTimeFormat('es-EC', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  timeZone: 'America/Guayaquil',
})

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '—'
  return dateTime.format(new Date(value))
}

/** "Hoy 14:20", "Ayer 09:10" o "3 oct, 18:45": lo que el dueño lee de un vistazo. */
export function formatWhen(value: string | null | undefined): string {
  if (!value) return '—'
  const d = new Date(value)
  const key = (x: Date) => x.toLocaleDateString('en-CA', { timeZone: 'America/Guayaquil' })
  const now = new Date()
  const yesterday = new Date(now.getTime() - 86400000)
  const time = d.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Guayaquil' })
  if (key(d) === key(now)) return `Hoy ${time}`
  if (key(d) === key(yesterday)) return `Ayer ${time}`
  return dateTime.format(d)
}

/** "2026-10-07" → "mié 7 oct" (sin correrse de día por zona horaria). */
export function formatDay(isoDay: string): string {
  return dayOnly.format(new Date(`${isoDay}T12:00:00-05:00`))
}

/** Número de Ecuador a formato wa.me: 0991234567 → 593991234567. */
export function toWhatsappNumber(phone: string): string {
  const digits = (phone || '').replace(/\D/g, '')
  if (!digits) return ''
  if (digits.startsWith('593')) return digits
  if (digits.startsWith('0')) return `593${digits.slice(1)}`
  if (digits.length === 9 && digits.startsWith('9')) return `593${digits}`
  return digits
}

export function whatsappTo(phone: string, message: string): string {
  const number = toWhatsappNumber(phone)
  if (!number) return ''
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

export function firstName(name: string): string {
  return (name || '').trim().split(/\s+/)[0] || ''
}
