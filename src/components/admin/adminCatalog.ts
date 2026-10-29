import { site } from '@/config/site'
import type { LeadKind, LeadStatus, Product, Segment, Stone } from '@/types'

// TODO coordinador: mover a site.ts (catálogo del panel: perla y "sin piedra" no están en site.stones)

export const SEGMENTS: { id: Segment; label: string }[] = site.segments.map((s) => ({
  id: s.id,
  label: s.label,
}))

export interface StoneOption {
  id: Stone
  name: string
  color: string
}

export const STONES: StoneOption[] = [
  ...site.stones.map((s) => ({ id: s.id, name: s.name, color: s.color })),
  { id: 'perla', name: 'Perla', color: '#e6e1d6' },
  { id: 'ninguna', name: 'Sin piedra', color: 'transparent' },
]

export function segmentName(id: string | undefined | null): string {
  return SEGMENTS.find((s) => s.id === id)?.label ?? '—'
}

export function stoneOf(id: string | undefined | null): StoneOption {
  return STONES.find((s) => s.id === id) ?? STONES[STONES.length - 1]!
}

/** Estado de una pieza tal como lo ve la clienta en la tienda. */
export type ProductState = 'draft' | 'live' | 'soldout-visible' | 'soldout-hidden'

export const PRODUCT_STATE: Record<ProductState, { label: string; hint: string; tone: string }> = {
  live: { label: 'Publicado', hint: 'Se ve y se puede comprar', tone: 'live' },
  'soldout-visible': { label: 'Agotado visible', hint: 'Se ve con la etiqueta Agotado', tone: 'warn' },
  'soldout-hidden': { label: 'Agotado oculto', hint: 'No aparece en la tienda', tone: 'muted' },
  draft: { label: 'Borrador', hint: 'Solo lo ves tú', tone: 'muted' },
}

export function productState(p: Pick<Product, 'isPublished' | 'isAvailable' | 'keepVisibleWhenSoldOut'>): ProductState {
  if (!p.isPublished) return 'draft'
  if (p.isAvailable) return 'live'
  return p.keepVisibleWhenSoldOut ? 'soldout-visible' : 'soldout-hidden'
}

export const LEAD_KINDS: { id: LeadKind; label: string; icon: string }[] = [
  { id: 'bespoke', label: 'Diseño a medida', icon: 'fa-solid fa-ring' },
  { id: 'waitlist', label: 'Lista Galápagos', icon: 'fa-solid fa-water' },
]

export const LEAD_STATUS: Record<LeadStatus, { label: string; tone: string }> = {
  new: { label: 'Nuevo', tone: 'new' },
  contacted: { label: 'Contactado', tone: 'contacted' },
  closed: { label: 'Cerrado', tone: 'closed' },
}

export const LEAD_STATUS_ORDER: LeadStatus[] = ['new', 'contacted', 'closed']
