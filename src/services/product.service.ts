import APIBase from './httpBase'
import type { Category, Paginated, Product, ProductSort, Segment, ShopCategory, Stone } from '@/types'

export interface ProductQuery {
  segment?: Segment
  category?: Category
  stone?: Stone
  line?: string
  bestSeller?: boolean
  featured?: boolean
  search?: string
  sort?: ProductSort
  page?: number
  limit?: number
}

function toQuery(params: object): string {
  const qs = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '' && value !== null) qs.set(key, String(value))
  }
  const str = qs.toString()
  return str ? `?${str}` : ''
}

class ProductService extends APIBase {
  async list(query: ProductQuery = {}): Promise<Paginated<Product>> {
    const { data } = await this.get<Paginated<Product>>(`products${toQuery(query)}`)
    return data
  }

  async categories(): Promise<ShopCategory[]> {
    const { data } = await this.get<ShopCategory[]>('categories')
    return data
  }

  async bySlug(slug: string): Promise<Product> {
    const { data } = await this.get<Product>(`products/${encodeURIComponent(slug)}`)
    return data
  }

  async related(slug: string): Promise<Product[]> {
    const { data } = await this.get<Product[]>(`products/${encodeURIComponent(slug)}/related`)
    return data
  }

  /** null cuando no hay pieza del mes marcada en el panel. */
  async pieceOfMonth(): Promise<Product | null> {
    const { data } = await this.get<Product | null>('products/piece-of-month')
    return data
  }
}

export const productService = new ProductService()
export { toQuery }
