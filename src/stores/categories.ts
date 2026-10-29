import { defineStore } from 'pinia'
import { productService } from '@/services/product.service'
import type { ShopCategory } from '@/types'

let request: Promise<void> | null = null

/** Categorías visibles de la tienda. Las administra el panel; se piden una vez por carga. */
export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    items: [] as ShopCategory[],
    loaded: false,
  }),

  getters: {
    bySlug: (s) => (slug: string | undefined | null) => s.items.find((c) => c.slug === slug),
  },

  actions: {
    load(force = false): Promise<void> {
      if (!request || force) {
        request = productService
          .categories()
          .then((items) => {
            this.items = items
            this.loaded = true
          })
          .catch(() => {
            // Sin categorías la tienda sigue funcionando; se reintenta en la próxima carga.
            request = null
          })
      }
      return request
    },
  },
})
