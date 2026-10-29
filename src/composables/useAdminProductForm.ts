import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { adminService, type ProductPayload } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import type { ApiError, Category, Product, Segment, Stone } from '@/types'

/** Variante en el formulario: el precio se edita en dólares (texto) y se guarda en centavos. */
export interface VariantDraft {
  key: string
  _id?: string
  label: string
  price: string
  stock: number
}

export interface ProductDraft {
  name: string
  slug: string
  segment: Segment | ''
  category: Category
  line: string
  stone: Stone
  material: string
  shortDescription: string
  description: string
  details: string[]
  badges: string[]
  variants: VariantDraft[]
  /** Precio tachado en dólares; vacío = sin precio tachado. */
  compareAt: string
  keepVisibleWhenSoldOut: boolean
  isBestSeller: boolean
  isPieceOfMonth: boolean
  isFeatured: boolean
  isPublished: boolean
  order: number
}

let keySeq = 0
const newKey = () => `v${++keySeq}`

export function centsToDollars(cents: number): string {
  return (cents / 100).toFixed(2)
}

/** "12,5" o "12.50" → 1250. Devuelve NaN si no es un número válido. */
export function dollarsToCents(value: string): number {
  const n = Number(String(value).trim().replace(',', '.'))
  return Number.isFinite(n) ? Math.round(n * 100) : NaN
}

export function emptyVariant(label = ''): VariantDraft {
  return { key: newKey(), label, price: '', stock: 1 }
}

function emptyDraft(): ProductDraft {
  return {
    name: '',
    slug: '',
    segment: '',
    category: '',
    line: '',
    stone: 'ninguna',
    material: '',
    shortDescription: '',
    description: '',
    details: [],
    badges: [],
    variants: [emptyVariant('Única')],
    compareAt: '',
    keepVisibleWhenSoldOut: true,
    isBestSeller: false,
    isPieceOfMonth: false,
    isFeatured: false,
    isPublished: false,
    order: 0,
  }
}

function toDraft(p: Product): ProductDraft {
  return {
    name: p.name,
    slug: p.slug,
    segment: p.segment,
    category: p.category,
    line: p.line ?? '',
    stone: p.stone ?? 'ninguna',
    material: p.material ?? '',
    shortDescription: p.shortDescription,
    description: p.description,
    details: [...(p.details ?? [])],
    badges: [...(p.badges ?? [])],
    variants: p.variants.map((v) => ({
      key: newKey(),
      _id: v._id,
      label: v.label,
      price: centsToDollars(v.priceCents),
      stock: v.stock ?? 0,
    })),
    compareAt: p.compareAtPriceCents ? centsToDollars(p.compareAtPriceCents) : '',
    keepVisibleWhenSoldOut: p.keepVisibleWhenSoldOut,
    isBestSeller: p.isBestSeller,
    isPieceOfMonth: p.isPieceOfMonth,
    isFeatured: p.isFeatured,
    isPublished: p.isPublished,
    order: p.order,
  }
}

export function useAdminProductForm() {
  const router = useRouter()
  const toast = useToastStore()

  const product = ref<Product | null>(null)
  const form = reactive<ProductDraft>(emptyDraft())
  const loading = ref(false)
  const saving = ref(false)
  const loadError = ref('')
  const errors = reactive<Record<string, string>>({})

  const isNew = computed(() => !product.value)

  async function load(id: string) {
    loading.value = true
    loadError.value = ''
    try {
      setProduct(await adminService.product(id))
    } catch (e) {
      loadError.value = (e as ApiError).message || 'No se pudo cargar la pieza'
    } finally {
      loading.value = false
    }
  }

  function setProduct(p: Product) {
    product.value = p
    Object.assign(form, toDraft(p))
  }

  /** De editar una pieza a "Nueva pieza" el componente se reutiliza: se limpia a mano. */
  function reset() {
    product.value = null
    Object.assign(form, emptyDraft())
    for (const key of Object.keys(errors)) delete errors[key]
  }

  /** Solo las fotos cambiaron: no pisar lo que se está escribiendo en el formulario. */
  function setImages(p: Product) {
    if (product.value) product.value = { ...product.value, images: p.images }
  }

  function validate(): boolean {
    for (const key of Object.keys(errors)) delete errors[key]
    if (!form.name.trim()) errors.name = 'Ponle un nombre a la pieza.'
    if (!form.segment) errors.segment = 'Elige oro, plata o semijoyas.'
    if (!form.category) errors.category = 'Elige una categoría.'
    if (!form.variants.length) errors.variants = 'Agrega al menos una variante.'
    form.variants.forEach((v, i) => {
      if (!v.label.trim()) errors[`variant-${i}-label`] = 'Falta el nombre.'
      const cents = dollarsToCents(v.price)
      if (!Number.isFinite(cents) || cents <= 0) errors[`variant-${i}-price`] = 'Precio no válido.'
      if (!Number.isInteger(Number(v.stock)) || Number(v.stock) < 0) errors[`variant-${i}-stock`] = 'Stock no válido.'
    })
    if (form.compareAt.trim()) {
      const cents = dollarsToCents(form.compareAt)
      if (!Number.isFinite(cents) || cents < 0) errors.compareAt = 'Precio no válido.'
    }
    return Object.keys(errors).length === 0
  }

  function payload(): ProductPayload {
    return {
      name: form.name.trim(),
      // Vacío = el server lo genera desde el nombre.
      ...(form.slug.trim() ? { slug: form.slug.trim() } : {}),
      segment: form.segment as Segment,
      category: form.category,
      line: form.line.trim(),
      stone: form.stone,
      material: form.material.trim(),
      shortDescription: form.shortDescription.trim(),
      description: form.description.trim(),
      details: form.details,
      badges: form.badges,
      variants: form.variants.map((v) => ({
        ...(v._id ? { _id: v._id } : {}),
        label: v.label.trim(),
        priceCents: dollarsToCents(v.price),
        stock: Number(v.stock) || 0,
      })),
      compareAtPriceCents: form.compareAt.trim() ? dollarsToCents(form.compareAt) : 0,
      keepVisibleWhenSoldOut: form.keepVisibleWhenSoldOut,
      isBestSeller: form.isBestSeller,
      isPieceOfMonth: form.isPieceOfMonth,
      isFeatured: form.isFeatured,
      isPublished: form.isPublished,
      order: Number(form.order) || 0,
    }
  }

  async function save(): Promise<boolean> {
    if (!validate()) {
      toast.error('Revisa los campos marcados antes de guardar.')
      return false
    }
    saving.value = true
    try {
      if (product.value) {
        setProduct(await adminService.updateProduct(product.value._id, payload()))
        toast.success('Cambios guardados')
      } else {
        const created = await adminService.createProduct(payload())
        setProduct(created)
        toast.success('Pieza creada. Ahora súbele sus fotos.')
        router.replace({ name: 'AdminProductEdit', params: { id: created._id } })
      }
      return true
    } catch (e) {
      toast.error((e as ApiError).message || 'No se pudo guardar la pieza')
      return false
    } finally {
      saving.value = false
    }
  }

  async function remove(): Promise<void> {
    if (!product.value) return
    saving.value = true
    try {
      await adminService.deleteProduct(product.value._id)
      toast.success(`${product.value.name} eliminada`)
      router.push({ name: 'AdminProducts' })
    } catch (e) {
      toast.error((e as ApiError).message || 'No se pudo eliminar la pieza')
    } finally {
      saving.value = false
    }
  }

  return { product, form, loading, saving, loadError, errors, isNew, load, reset, setProduct, setImages, save, remove }
}
