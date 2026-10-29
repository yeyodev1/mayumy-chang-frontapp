import { computed, ref } from 'vue'
import { productService } from '@/services/product.service'
import type { Product, Stone } from '@/types'

/**
 * Catálogo visible completo, pedido una vez por carga y compartido por la home
 * (pieza del mes, más vendidos, piedras, categorías). Son decenas de piezas,
 * no miles: una sola llamada evita cinco y mantiene todo coherente.
 */
const items = ref<Product[]>([])
const loading = ref(true)
let request: Promise<void> | null = null

function load(force = false) {
  if (!request || force) {
    loading.value = !items.value.length
    request = productService
      .list({ limit: 100 })
      .then((res) => {
        items.value = res.items
      })
      .catch(() => {
        request = null
      })
      .finally(() => {
        loading.value = false
      })
  }
  return request
}

export function useCatalog() {
  load()

  const pieceOfMonth = computed(
    () => items.value.find((p) => p.isPieceOfMonth) ?? items.value.find((p) => p.isFeatured) ?? items.value[0] ?? null,
  )
  const bestSellers = computed(() => {
    const best = items.value.filter((p) => p.isBestSeller)
    return (best.length >= 4 ? best : items.value).slice(0, 10)
  })
  const byStone = (stone: Stone) => items.value.filter((p) => p.stone === stone)
  /** Primera foto de la categoría (la usa la lista de categorías al pasar el cursor). */
  const coverFor = (category: string) => items.value.find((p) => p.category === category)?.images[0]?.url ?? ''

  return { items, loading, pieceOfMonth, bestSellers, byStone, coverFor, reload: () => load(true) }
}
