import { ref } from 'vue'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import type { ApiError, Product, Segment } from '@/types'
import { useAdminList } from './useAdminList'

/**
 * Listado de piezas del panel: filtros en la URL (segmento, stock, categoría,
 * búsqueda) y ajuste rápido de stock sin entrar a editar.
 */
export function useAdminProducts() {
  const toast = useToastStore()
  const list = useAdminList<Product, 'segment' | 'stock' | 'category'>(
    (q) =>
      adminService.products({
        ...q,
        segment: q.segment as Segment | '',
        stock: q.stock as 'in' | 'out' | '',
        limit: 50,
      }),
    ['segment', 'stock', 'category'],
  )

  const stockBusy = ref<string | null>(null)

  async function adjustStock(product: Product, delta: 1 | -1) {
    const variant = product.variants[0]
    if (!variant || product.variants.length !== 1) return
    const next = variant.stock + delta
    if (next < 0) return
    stockBusy.value = product._id
    try {
      const updated = await adminService.setStock(product._id, variant._id, next)
      Object.assign(product, updated)
      if (next === 0) {
        toast.success(
          updated.keepVisibleWhenSoldOut
            ? `${product.name} quedó agotada (sigue visible con la etiqueta Agotado)`
            : `${product.name} quedó agotada y ya no se ve en la tienda`,
        )
      }
    } catch (e) {
      toast.error((e as ApiError).message || 'No se pudo cambiar el stock')
    } finally {
      stockBusy.value = null
    }
  }

  return { ...list, stockBusy, adjustStock }
}
