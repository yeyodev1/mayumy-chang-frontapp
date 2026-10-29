import { ref } from 'vue'
import type { PayphoneBoxConfig } from '@/types'

const CSS_URL = 'https://cdn.payphonetodoesposible.com/box/v2.0/payphone-payment-box.css'
const JS_URL = 'https://cdn.payphonetodoesposible.com/box/v2.0/payphone-payment-box.js'

/** Expira a los 10 minutos: pasado eso hay que crear otro intento. */
export const PAYPHONE_TTL_MS = 10 * 60 * 1000

let assets: Promise<void> | null = null

function waitForGlobal(timeoutMs = 8000): Promise<void> {
  return new Promise((resolve, reject) => {
    const start = Date.now()
    const tick = () => {
      if (window.PPaymentButtonBox || typeof PPaymentButtonBox !== 'undefined') return resolve()
      if (Date.now() - start > timeoutMs) return reject(new Error('timeout'))
      setTimeout(tick, 80)
    }
    tick()
  })
}

function waitForElement(id: string, timeoutMs = 3000): Promise<HTMLElement> {
  return new Promise((resolve, reject) => {
    const start = Date.now()
    const tick = () => {
      const el = document.getElementById(id)
      if (el) return resolve(el)
      if (Date.now() - start > timeoutMs) return reject(new Error('container'))
      requestAnimationFrame(tick)
    }
    tick()
  })
}

/** Carga CSS y script de la Cajita una sola vez por sesión, solo cuando se va a pagar. */
function loadAssets(): Promise<void> {
  if (assets) return assets
  assets = new Promise<void>((resolve, reject) => {
    if (!document.querySelector(`link[href="${CSS_URL}"]`)) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = CSS_URL
      document.head.appendChild(link)
    }
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${JS_URL}"]`)
    if (existing) {
      waitForGlobal().then(resolve, reject)
      return
    }
    const script = document.createElement('script')
    script.type = 'module'
    script.src = JS_URL
    script.onload = () => waitForGlobal().then(resolve, reject)
    script.onerror = () => reject(new Error('script'))
    document.head.appendChild(script)
  }).catch((e) => {
    // Si falló (red, bloqueador), se permite reintentar desde cero.
    assets = null
    throw e
  })
  return assets
}

export function usePayphoneBox() {
  const loading = ref(false)
  const error = ref('')

  async function render(config: PayphoneBoxConfig, containerId = 'pp-button') {
    loading.value = true
    error.value = ''
    try {
      await loadAssets()
      const Box = window.PPaymentButtonBox ?? PPaymentButtonBox
      // El contenedor puede montarse tarde (transición de entrada): se espera.
      const container = await waitForElement(containerId)
      container.innerHTML = ''
      new Box({
        token: config.token,
        clientTransactionId: config.clientTransactionId,
        amount: config.amount,
        amountWithoutTax: config.amountWithoutTax,
        currency: config.currency,
        storeId: config.storeId,
        reference: config.reference,
        email: config.email,
        phoneNumber: config.phoneNumber,
        documentId: config.documentId,
        lang: 'es',
        defaultMethod: 'card',
        timeZone: -5,
      }).render(containerId)
    } catch {
      error.value = 'No pudimos cargar el formulario de pago. Revisa tu conexión o desactiva el bloqueador de anuncios e intenta de nuevo.'
    } finally {
      loading.value = false
    }
  }

  return { loading, error, render }
}
