/** Forma con la que httpBase rechaza cualquier error del API. */
export interface ApiError {
  status: number
  message: string
  data?: unknown
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pages: number
}

/** Lo que devuelve el backapp en /auth/login y /auth/me. */
export interface SessionUser {
  id: string
  email: string
  name: string
  phone: string
  accountType: 'customer' | 'admin' | string
}

// ─── Tienda (ver CONTRATO-API.md en la carpeta del cliente) ─────────
export type Segment = 'oro-18k' | 'plata-925' | 'semijoyas'
export type Stone = 'zafiro' | 'esmeralda' | 'cristal' | 'granate' | 'citrino' | 'perla' | 'ninguna'

/** Slug de una categoría. Las categorías se administran desde el panel. */
export type Category = string

export interface ShopCategory {
  _id: string
  slug: string
  name: string
  blurb: string
  order: number
  isVisible: boolean
  /** Piezas visibles por segmento (solo en GET /categories). */
  counts?: Partial<Record<Segment, number>>
}

export interface AdminCategory extends ShopCategory {
  productCount: number
}

export type CategoryPayload = Partial<Pick<ShopCategory, 'name' | 'blurb' | 'isVisible'>>

export interface ProductImage {
  /** Cloudinary o relativa al frontapp (/products/x.webp) cuando publicId es ''. */
  url: string
  publicId: string
}

export interface ProductVariant {
  _id: string
  label: string
  priceCents: number
  stock: number
  /** Derivado: stock > 0. */
  isAvailable: boolean
}

export interface Product {
  _id: string
  slug: string
  name: string
  segment: Segment
  category: Category
  line: string
  stone: Stone
  material: string
  shortDescription: string
  description: string
  details: string[]
  badges: string[]
  images: ProductImage[]
  variants: ProductVariant[]
  priceFromCents: number
  compareAtPriceCents: number
  stockTotal: number
  isAvailable: boolean
  keepVisibleWhenSoldOut: boolean
  isBestSeller: boolean
  isPieceOfMonth: boolean
  isFeatured: boolean
  isPublished: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export type ProductSort = 'order' | 'price-asc' | 'price-desc' | 'new'

export type OrderStatus =
  'pending' | 'review' | 'paid' | 'preparing' | 'shipped' | 'delivered' | 'canceled' | 'failed'
export type DeliveryMethod = 'delivery' | 'pickup'
/** card = Payphone en línea; transfer = transferencia antes del despacho. */
export type PaymentMethod = 'card' | 'transfer'
export type ShippingZone = 'local' | 'national' | 'pickup' | 'free'

/** Valor especial por método: recargo o descuento, en % o en centavos (unit 'fixed'). */
export interface PaymentAdjustment {
  kind: 'none' | 'surcharge' | 'discount'
  unit: 'percent' | 'fixed'
  value: number
  label: string
}

export interface PaymentMethodSettings {
  enabled: boolean
  /** Nombre y descripción que se escriben en el panel; vacíos = copy de site.ts. */
  title: string
  description: string
  adjustment: PaymentAdjustment
}

export type PaymentsSettings = Record<PaymentMethod, PaymentMethodSettings>

export interface BankAccount {
  id: string
  bank: string
  logoUrl: string
  accountType: 'corriente' | 'ahorros'
  holder: string
  number: string
  documentId: string
  email: string
  isActive: boolean
}

/** Lo que se edita en Ajustes → Pagos. */
export interface PaymentSettings {
  payments: PaymentsSettings
  bankAccounts: BankAccount[]
}

export interface OrderItem {
  product: string
  slug: string
  name: string
  image: string
  variantId: string
  variantLabel: string
  unitPriceCents: number
  quantity: number
  lineTotalCents: number
}

export interface OrderCustomer {
  name: string
  email: string
  phone: string
  documentId: string
}

export interface OrderDelivery {
  method: DeliveryMethod
  province: string
  city: string
  address: string
  reference: string
  giftNote: string
}

export interface Order {
  _id: string
  code: string
  user: string | null
  customer: OrderCustomer
  delivery: OrderDelivery
  items: OrderItem[]
  subtotalCents: number
  shippingCents: number
  shippingZone: ShippingZone
  /** Recargo (+) o descuento (−) del método de pago, ya sumado en totalCents. */
  paymentAdjustmentCents?: number
  paymentAdjustmentLabel?: string
  totalCents: number
  notes: string
  isGift: boolean
  status: OrderStatus
  paymentMethod: PaymentMethod
  clientTransactionId: string
  payphone: {
    transactionId: number | null
    statusCode: number | null
    authorizationCode: string
    cardBrand: string
    lastDigits: string
  }
  paidAt: string | null
  createdAt: string
  updatedAt: string
}

export interface PayphoneBoxConfig {
  token: string
  storeId: string
  clientTransactionId: string
  amount: number
  amountWithoutTax: number
  currency: 'USD'
  reference: string
  email: string
  phoneNumber: string
  documentId: string
}

export interface CreateOrderPayload {
  items: { productId: string; variantId: string; quantity: number }[]
  customer: OrderCustomer
  delivery: Omit<OrderDelivery, 'giftNote'> & { giftNote?: string }
  notes?: string
  isGift?: boolean
  paymentMethod: PaymentMethod
}

export interface PickupPoint {
  name: string
  address: string
  city: string
  hours: string
}

/** Envío Servientrega: tarifa local (ciudad base) y nacional, editables en el panel. */
export interface ShippingSettings {
  baseCity: string
  localCents: number
  nationalCents: number
  /** 0 = nunca gratis. */
  freeFromCents: number
  pickupEnabled: boolean
  pickup: PickupPoint
}

export interface BookingSettings {
  /** Agenda de Confirmafy de Mayumy; vacío = se agenda por WhatsApp. */
  url: string
  label: string
}

export interface ContactSettings {
  whatsapp: string
  instagram: string
  email: string
  showroom: string
}

/** Teaser de la colección de alta joyería (Galápagos). */
export interface CollabSettings {
  enabled: boolean
  eyebrow: string
  title: string
  subtitle: string
  release: string
}

export interface StoreConfig {
  shipping: ShippingSettings
  payments: PaymentsSettings
  /** Solo las cuentas activas, sin isActive. */
  bankAccounts: Omit<BankAccount, 'isActive'>[]
  booking: BookingSettings
  contact: ContactSettings
  collab: CollabSettings
}

/** Lo que se edita en Ajustes de la tienda (GET/PUT /admin/settings/store). */
export interface StoreSettings {
  shipping: ShippingSettings
  booking: BookingSettings
  contact: ContactSettings
  collab: CollabSettings
}

export type LeadKind = 'waitlist' | 'bespoke'
export type LeadStatus = 'new' | 'contacted' | 'closed'

export interface Lead {
  _id: string
  kind: LeadKind
  name: string
  email: string
  phone: string
  message: string
  budget: string
  status: LeadStatus
  createdAt: string
}

export interface LeadPayload {
  kind: LeadKind
  name: string
  email: string
  phone?: string
  message?: string
  budget?: string
}

export interface AdminStats {
  revenueTodayCents: number
  revenueMonthCents: number
  ordersToday: number
  ordersPendingFulfillment: number
  ordersByStatus: Record<OrderStatus, number>
  topProducts: { name: string; quantity: number; revenueCents: number }[]
  leadsThisMonth: number
  lowStock: { _id: string; name: string; slug: string; stockTotal: number }[]
  salesLast30: { date: string; revenueCents: number; orders: number }[]
}

export interface AdminCustomer {
  _id: string
  name: string
  email: string
  phone: string
  createdAt: string
  ordersCount: number
  totalSpentCents: number
  lastOrderAt: string | null
}

/** Persona con acceso al panel (GET /admin/users). */
export interface AdminUser {
  id: string
  email: string
  name: string
  notifyOrders: boolean
  isActive: boolean
  lastLoginAt: string | null
  createdAt: string | null
}
