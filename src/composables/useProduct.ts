import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { productService } from '@/services/product.service'
import { useCartStore } from '@/stores/cart'
import { site } from '@/config/site'
import type { ApiError, Product } from '@/types'

/** Ficha de una pieza: carga por slug, variante elegida y piezas para combinar. */
export function useProduct() {
  const route = useRoute()
  const cart = useCartStore()

  const product = ref<Product | null>(null)
  const related = ref<Product[]>([])
  const loading = ref(true)
  const error = ref<ApiError | null>(null)
  const variantId = ref('')

  const variant = computed(() => product.value?.variants.find((v) => v._id === variantId.value) ?? null)
  const soldOut = computed(() => !product.value?.isAvailable)
  const inBag = computed(() => Boolean(product.value && cart.has(product.value._id)))

  async function load(slug: string) {
    loading.value = true
    error.value = null
    related.value = []
    try {
      const p = await productService.bySlug(slug)
      product.value = p
      variantId.value = p.variants.find((v) => v.isAvailable)?._id ?? p.variants[0]?._id ?? ''
      document.title = `${p.name} — ${site.name}`
      productService
        .related(slug)
        .then((items) => (related.value = items.slice(0, 4)))
        .catch(() => {})
    } catch (e) {
      error.value = e as ApiError
      product.value = null
    } finally {
      loading.value = false
    }
  }

  function addToBag() {
    if (!product.value || !variant.value?.isAvailable) return
    // La bolsa se abre sola: ese es el aviso.
    cart.add(product.value, variant.value._id)
  }

  watch(
    () => route.params.slug,
    (slug) => {
      if (typeof slug === 'string' && slug) load(slug)
    },
    { immediate: true },
  )

  return { product, related, loading, error, variantId, variant, soldOut, inBag, addToBag }
}
