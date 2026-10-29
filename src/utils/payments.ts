import { formatCents } from './format'
import type { PaymentAdjustment, PaymentMethod, PaymentsSettings } from '@/types'

export const PAYMENT_METHODS: PaymentMethod[] = ['card', 'transfer']

const NO_ADJUSTMENT: PaymentAdjustment = { kind: 'none', unit: 'percent', value: 0, label: '' }

/**
 * Mientras llega la config del server: tarjeta y transferencia activas, sin
 * valores especiales, igual que los valores iniciales del server.
 */
export function defaultPayments(): PaymentsSettings {
  const method = (enabled: boolean) => ({
    enabled,
    title: '',
    description: '',
    adjustment: { ...NO_ADJUSTMENT },
  })
  return { card: method(true), transfer: method(true) }
}

/** Mismo cálculo que el server: recargo (+) o descuento (−) sobre subtotal + envío. */
export function adjustmentFor(
  adjustment: PaymentAdjustment | undefined,
  baseCents: number,
): number {
  if (!adjustment || adjustment.kind === 'none' || !adjustment.value) return 0
  const amount =
    adjustment.unit === 'percent'
      ? Math.round((baseCents * adjustment.value) / 100)
      : Math.round(adjustment.value)
  return adjustment.kind === 'discount' ? -Math.min(amount, baseCents) : amount
}

/** Etiqueta corta para la tarjeta del método: "+5 %" o "−$2,00". */
export function adjustmentBadge(adjustment: PaymentAdjustment | undefined): string {
  if (!adjustment || adjustment.kind === 'none' || !adjustment.value) return ''
  const sign = adjustment.kind === 'discount' ? '−' : '+'
  const amount =
    adjustment.unit === 'percent'
      ? `${String(adjustment.value).replace('.', ',')} %`
      : formatCents(adjustment.value)
  return `${sign}${amount}`
}

/** "+$0,35" / "−$1,00" para las filas de totales. */
export function signedCents(cents: number): string {
  return `${cents > 0 ? '+' : '−'}${formatCents(Math.abs(cents))}`
}
