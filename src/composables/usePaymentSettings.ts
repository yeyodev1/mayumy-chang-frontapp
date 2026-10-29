import { reactive, ref } from 'vue'
import { adminService } from '@/services/admin.service'
import { orderService } from '@/services/order.service'
import { useToastStore } from '@/stores/toast'
import { useStoreConfig } from './useStoreConfig'
import { PAYMENT_METHODS, defaultPayments } from '@/utils/payments'
import type { ApiError, BankAccount, PaymentSettings } from '@/types'

// El valor fijo viaja en centavos; en el formulario se escribe en dólares.
function toForm(data: PaymentSettings): PaymentSettings {
  const payments = defaultPayments()
  for (const m of PAYMENT_METHODS) {
    const adj = { ...data.payments[m].adjustment }
    if (adj.unit === 'fixed') adj.value = adj.value / 100
    payments[m] = { ...data.payments[m], adjustment: adj }
  }
  return { payments, bankAccounts: data.bankAccounts.map((a) => ({ ...a })) }
}

function toPayload(form: PaymentSettings): PaymentSettings {
  const payments = defaultPayments()
  for (const m of PAYMENT_METHODS) {
    const adj = { ...form.payments[m].adjustment }
    adj.value = Number(adj.value) || 0
    if (adj.unit === 'fixed') adj.value = Math.round(adj.value * 100)
    payments[m] = { ...form.payments[m], adjustment: adj }
  }
  return { payments, bankAccounts: form.bankAccounts }
}

export function emptyBankAccount(): BankAccount {
  return {
    id: `new-${Date.now()}`,
    bank: '',
    logoUrl: '',
    accountType: 'corriente',
    holder: '',
    number: '',
    documentId: '',
    email: '',
    isActive: true,
  }
}

export function usePaymentSettings() {
  const toast = useToastStore()
  const { config } = useStoreConfig()

  const form = reactive<PaymentSettings>({ payments: defaultPayments(), bankAccounts: [] })
  const loading = ref(false)
  const saving = ref(false)
  const uploading = ref<string | null>(null)
  const error = ref<ApiError | null>(null)
  const loaded = ref(false)
  /**
   * Si la tarjeta de verdad se ofrece en el checkout. El server la apaga en
   * /store/config mientras falte el token de Payphone, aunque aquí esté activa.
   */
  const cardLive = ref<boolean | null>(null)

  async function checkCard() {
    try {
      const fresh = await orderService.config()
      cardLive.value = fresh.payments.card.enabled
      // La tienda abierta en esta pestaña ve el cambio sin recargar.
      config.value = { ...config.value, payments: fresh.payments, bankAccounts: fresh.bankAccounts }
    } catch {
      cardLive.value = null
    }
  }

  function fill(data: PaymentSettings) {
    const next = toForm(data)
    form.payments = next.payments
    form.bankAccounts = next.bankAccounts
  }

  async function load() {
    loading.value = true
    error.value = null
    try {
      fill(await adminService.paymentSettings())
      loaded.value = true
      checkCard()
    } catch (e) {
      error.value = e as ApiError
    } finally {
      loading.value = false
    }
  }

  async function save() {
    saving.value = true
    try {
      const saved = await adminService.updatePaymentSettings(toPayload(form))
      fill(saved)
      await checkCard()
      toast.success('Listo, el checkout ya muestra los cambios')
    } catch (e) {
      toast.error((e as ApiError).message || 'No se pudo guardar')
    } finally {
      saving.value = false
    }
  }

  function addAccount() {
    form.bankAccounts.push(emptyBankAccount())
  }

  function removeAccount(id: string) {
    form.bankAccounts = form.bankAccounts.filter((a) => a.id !== id)
  }

  async function uploadLogo(account: BankAccount, file: File) {
    uploading.value = account.id
    try {
      account.logoUrl = (await adminService.uploadBankLogo(file)).url
      toast.success('Logo listo. Guarda los cambios para publicarlo')
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      uploading.value = null
    }
  }

  return {
    form,
    loading,
    saving,
    uploading,
    error,
    loaded,
    cardLive,
    load,
    save,
    addAccount,
    removeAccount,
    uploadLogo,
  }
}
