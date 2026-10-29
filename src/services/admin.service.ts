import APIBase from './httpBase'
import type {
  AdminCategory,
  AdminCustomer,
  AdminStats,
  Category,
  Lead,
  LeadKind,
  LeadStatus,
  CategoryPayload,
  Order,
  OrderStatus,
  Paginated,
  Product,
  ProductImage,
  AdminUser,
  PaymentSettings,
  Segment,
  StoreSettings,
} from '@/types'

function toQuery(params: object): string {
  const qs = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '' && value !== null) qs.set(key, String(value))
  }
  const str = qs.toString()
  return str ? `?${str}` : ''
}

export interface AdminListQuery {
  search?: string
  page?: number
  limit?: number
}

export interface AdminProductQuery extends AdminListQuery {
  category?: Category | ''
  segment?: Segment | ''
  /** in = con stock, out = agotadas. */
  stock?: 'in' | 'out' | ''
}

export interface AdminLeadQuery extends AdminListQuery {
  kind?: LeadKind | ''
  status?: LeadStatus | ''
}

export interface AdminOrderQuery extends AdminListQuery {
  status?: OrderStatus | ''
}

/** Lo que se manda al crear o editar: el Product sin campos calculados ni imágenes. */
export type ProductPayload = Partial<
  Omit<
    Product,
    | '_id'
    | 'images'
    | 'priceFromCents'
    | 'stockTotal'
    | 'isAvailable'
    | 'createdAt'
    | 'updatedAt'
    | 'variants'
  >
> & {
  variants?: { _id?: string; label: string; priceCents: number; stock: number }[]
}

class AdminService extends APIBase {
  async stats(): Promise<AdminStats> {
    const { data } = await this.get<AdminStats>('admin/stats')
    return data
  }

  // ─── Productos ────────────────────────────────────────────────────
  async products(query: AdminProductQuery = {}): Promise<Paginated<Product>> {
    const { data } = await this.get<Paginated<Product>>(`admin/products${toQuery(query)}`)
    return data
  }

  async product(id: string): Promise<Product> {
    const { data } = await this.get<Product>(`admin/products/${id}`)
    return data
  }

  async createProduct(payload: ProductPayload): Promise<Product> {
    const { data } = await this.post<Product>('admin/products', payload)
    return data
  }

  async updateProduct(id: string, payload: ProductPayload): Promise<Product> {
    const { data } = await this.put<Product>(`admin/products/${id}`, payload)
    return data
  }

  async deleteProduct(id: string): Promise<{ ok: true }> {
    const { data } = await this.delete<{ ok: true }>(`admin/products/${id}`)
    return data
  }

  /** Sube una imagen (campo `image`). `onProgress` recibe 0..100. */
  async uploadImage(id: string, file: File, onProgress?: (pct: number) => void): Promise<Product> {
    const form = new FormData()
    form.append('image', file)
    const { data } = await this.post<Product>(`admin/products/${id}/images`, form, undefined, {
      // Las fotos de producto pesan: más margen que el timeout por defecto.
      timeout: 120000,
      onUploadProgress: (e) => {
        if (onProgress && e.total) onProgress(Math.round((e.loaded / e.total) * 100))
      },
    })
    return data
  }

  /**
   * Las fotos de Cloudinary se borran por publicId; las sembradas (publicId '')
   * solo existen en el documento y se identifican por su url.
   */
  async deleteImage(id: string, image: ProductImage): Promise<Product> {
    const path = image.publicId
      ? `admin/products/${id}/images/${encodeURIComponent(image.publicId)}`
      : `admin/products/${id}/images?url=${encodeURIComponent(image.url)}`
    const { data } = await this.delete<Product>(path)
    return data
  }

  /** Por url: sirve igual para fotos de Cloudinary y sembradas. */
  async reorderImages(id: string, urls: string[]): Promise<Product> {
    const { data } = await this.put<Product>(`admin/products/${id}/images/order`, { urls })
    return data
  }

  /** Ajuste rápido de stock desde el listado. */
  async setStock(id: string, variantId: string, stock: number): Promise<Product> {
    const { data } = await this.patch<Product>(`admin/products/${id}/stock`, { variantId, stock })
    return data
  }

  // ─── Pedidos ──────────────────────────────────────────────────────
  async orders(query: AdminOrderQuery = {}): Promise<Paginated<Order>> {
    const { data } = await this.get<Paginated<Order>>(`admin/orders${toQuery(query)}`)
    return data
  }

  async order(id: string): Promise<Order> {
    const { data } = await this.get<Order>(`admin/orders/${id}`)
    return data
  }

  async setOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    const { data } = await this.patch<Order>(`admin/orders/${id}/status`, { status })
    return data
  }

  // ─── Clientes y solicitudes ───────────────────────────────────────
  async customers(query: AdminListQuery = {}): Promise<Paginated<AdminCustomer>> {
    const { data } = await this.get<Paginated<AdminCustomer>>(`admin/customers${toQuery(query)}`)
    return data
  }

  async leads(query: AdminLeadQuery = {}): Promise<Paginated<Lead>> {
    const { data } = await this.get<Paginated<Lead>>(`admin/leads${toQuery(query)}`)
    return data
  }

  async setLeadStatus(id: string, status: LeadStatus): Promise<Lead> {
    const { data } = await this.patch<Lead>(`admin/leads/${id}`, { status })
    return data
  }

  // ─── Categorías ───────────────────────────────────────────────────
  async categories(): Promise<AdminCategory[]> {
    const { data } = await this.get<AdminCategory[]>('admin/categories')
    return data
  }

  async createCategory(payload: CategoryPayload): Promise<AdminCategory> {
    const { data } = await this.post<AdminCategory>('admin/categories', payload)
    return data
  }

  async updateCategory(id: string, payload: CategoryPayload): Promise<AdminCategory> {
    const { data } = await this.put<AdminCategory>(`admin/categories/${id}`, payload)
    return data
  }

  async reorderCategories(ids: string[]): Promise<AdminCategory[]> {
    const { data } = await this.put<AdminCategory[]>('admin/categories/order', { ids })
    return data
  }

  async deleteCategory(id: string): Promise<void> {
    await this.delete(`admin/categories/${id}`)
  }

  // ─── Usuarios del panel ───────────────────────────────────────────
  async users(): Promise<AdminUser[]> {
    const { data } = await this.get<AdminUser[]>('admin/users')
    return data
  }

  async createUser(payload: {
    name: string
    email: string
    password: string
    notifyOrders: boolean
  }): Promise<AdminUser> {
    const { data } = await this.post<AdminUser>('admin/users', payload)
    return data
  }

  async updateUser(
    id: string,
    payload: Partial<Pick<AdminUser, 'name' | 'notifyOrders' | 'isActive'>> & { password?: string },
  ): Promise<AdminUser> {
    const { data } = await this.patch<AdminUser>(`admin/users/${id}`, payload)
    return data
  }

  async removeUser(id: string): Promise<void> {
    await this.delete(`admin/users/${id}`)
  }

  async sendTestSaleEmail(): Promise<{ sent: string[]; failed: string[] }> {
    const { data } = await this.post<{ sent: string[]; failed: string[] }>(
      'admin/users/test-notification',
      {},
    )
    return data
  }

  // ─── Ajustes de la tienda ─────────────────────────────────────────
  async settings(): Promise<StoreSettings> {
    const { data } = await this.get<StoreSettings>('admin/settings/store')
    return data
  }

  async updateSettings(payload: StoreSettings): Promise<StoreSettings> {
    const { data } = await this.put<StoreSettings>('admin/settings/store', payload)
    return data
  }

  async paymentSettings(): Promise<PaymentSettings> {
    const { data } = await this.get<PaymentSettings>('admin/settings/payments')
    return data
  }

  async updatePaymentSettings(payload: PaymentSettings): Promise<PaymentSettings> {
    const { data } = await this.put<PaymentSettings>('admin/settings/payments', payload)
    return data
  }

  /** Sube el logo de un banco a Cloudinary; la URL se guarda al guardar la cuenta. */
  async uploadBankLogo(file: File): Promise<{ url: string }> {
    const form = new FormData()
    form.append('image', file)
    const { data } = await this.post<{ url: string }>('admin/settings/bank-logo', form, undefined, {
      timeout: 60000,
    })
    return data
  }
}

export const adminService = new AdminService()
