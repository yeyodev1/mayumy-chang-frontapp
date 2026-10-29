/// <reference types="vite/client" />

/** Fecha ISO del build; la inyecta vite.config.ts. */
declare const __APP_VERSION__: string

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_META_PIXEL_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/** Cajita de Pagos de Payphone (se carga por CDN desde el composable del checkout). */
interface PPaymentButtonBoxOptions {
  token: string
  clientTransactionId: string
  amount: number
  amountWithoutTax: number
  amountWithTax?: number
  tax?: number
  service?: number
  tip?: number
  currency: string
  storeId: string
  reference: string
  lang?: 'es' | 'en'
  defaultMethod?: 'card' | 'payphone'
  timeZone?: number
  email?: string
  phoneNumber?: string
  documentId?: string
}

declare class PPaymentButtonBox {
  constructor(options: PPaymentButtonBoxOptions)
  render(containerId: string): void
}

interface Window {
  PPaymentButtonBox?: typeof PPaymentButtonBox
}
