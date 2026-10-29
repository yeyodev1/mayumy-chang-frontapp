import { defineStore } from 'pinia'
import type { Product } from '@/types'

const STORAGE_KEY = 'mayumy_bag'

export interface CartLine {
  /** productId:variantId */
  key: string
  productId: string
  slug: string
  name: string
  image: string
  variantId: string
  variantLabel: string
  unitPriceCents: number
  quantity: number
  /** Stock que había al agregar: casi todo es pieza única, no se puede pedir más. */
  maxQuantity: number
}

function load(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CartLine[]) : []
  } catch {
    return []
  }
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    lines: load(),
    // La bolsa se abre al agregar: feedback inmediato sin sacar a la clienta de la página.
    isOpen: false,
    // Último agregado, para el destello del contador en el header.
    lastAddedAt: 0,
  }),

  getters: {
    count: (s) => s.lines.reduce((sum, l) => sum + l.quantity, 0),
    subtotalCents: (s) => s.lines.reduce((sum, l) => sum + l.unitPriceCents * l.quantity, 0),
    isEmpty: (s) => s.lines.length === 0,
    has: (s) => (productId: string) => s.lines.some((l) => l.productId === productId),
  },

  actions: {
    persist() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.lines))
      } catch {
        /* modo privado: la bolsa vive solo en memoria */
      }
    },

    add(product: Product, variantId?: string, quantity = 1) {
      const variant =
        product.variants.find((v) => v._id === variantId) ??
        product.variants.find((v) => v.isAvailable) ??
        product.variants[0]
      if (!variant || variant.stock <= 0) return false
      const key = `${product._id}:${variant._id}`
      const existing = this.lines.find((l) => l.key === key)
      if (existing) {
        existing.maxQuantity = variant.stock
        existing.quantity = Math.min(variant.stock, existing.quantity + quantity)
      } else {
        this.lines.push({
          key,
          productId: product._id,
          slug: product.slug,
          name: product.name,
          image: product.images[0]?.url ?? '',
          variantId: variant._id,
          variantLabel: variant.label,
          unitPriceCents: variant.priceCents,
          quantity: Math.min(variant.stock, quantity),
          maxQuantity: variant.stock,
        })
      }
      this.persist()
      this.lastAddedAt = Date.now()
      this.isOpen = true
      return true
    },

    setQuantity(key: string, quantity: number) {
      const line = this.lines.find((l) => l.key === key)
      if (!line) return
      if (quantity <= 0) return this.remove(key)
      line.quantity = Math.min(line.maxQuantity || 1, Math.floor(quantity))
      this.persist()
    },

    remove(key: string) {
      this.lines = this.lines.filter((l) => l.key !== key)
      this.persist()
    },

    clear() {
      this.lines = []
      this.persist()
    },

    open() {
      this.isOpen = true
    },

    close() {
      this.isOpen = false
    },
  },
})
