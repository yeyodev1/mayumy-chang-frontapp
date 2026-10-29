import { ref } from 'vue'
import type { CartLine } from '@/stores/cart'

/**
 * Líneas que el server reportó agotadas al crear el pedido (409). Viven en
 * memoria: la bolsa y el resumen del checkout las marcan hasta que se quitan.
 */
export const soldOutKeys = ref<string[]>([])

export function markSoldOut(key: string) {
  if (!soldOutKeys.value.includes(key)) soldOutKeys.value = [...soldOutKeys.value, key]
}

export function clearSoldOut(key?: string) {
  soldOutKeys.value = key ? soldOutKeys.value.filter((k) => k !== key) : []
}

/** El server responde "«Nombre» se acaba de agotar": se busca la línea por nombre. */
export function lineFromSoldOutMessage(message: string, lines: CartLine[]): CartLine | undefined {
  const name = /«([^»]+)»/.exec(message)?.[1]?.trim().toLowerCase()
  if (!name) return undefined
  return lines.find((l) => l.name.trim().toLowerCase() === name)
}

// Copia de la bolsa mientras se paga con tarjeta: si el pago no pasa, vuelve tal cual.
const SNAPSHOT_KEY = 'mayumy_bag_snapshot'

export function saveBagSnapshot(lines: CartLine[]) {
  try {
    sessionStorage.setItem(SNAPSHOT_KEY, JSON.stringify(lines))
  } catch {
    /* modo privado */
  }
}

export function takeBagSnapshot(): CartLine[] {
  try {
    const raw = sessionStorage.getItem(SNAPSHOT_KEY)
    sessionStorage.removeItem(SNAPSHOT_KEY)
    return raw ? (JSON.parse(raw) as CartLine[]) : []
  } catch {
    return []
  }
}

export function dropBagSnapshot() {
  try {
    sessionStorage.removeItem(SNAPSHOT_KEY)
  } catch {
    /* modo privado */
  }
}
