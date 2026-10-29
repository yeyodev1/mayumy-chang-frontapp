import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productService } from '@/services/product.service'
import { site } from '@/config/site'
import type { ApiError, Product, ProductSort, Segment, Stone } from '@/types'

type FilterKey = 'segmento' | 'categoria' | 'piedra' | 'orden'

/**
 * Catálogo atado a la URL (?segmento=&categoria=&piedra=&orden=): un filtro se
 * comparte por WhatsApp tal cual y "atrás" deshace el último filtro.
 */
export function useShop() {
  const route = useRoute()
  const router = useRouter()

  const products = ref<Product[]>([])
  const loading = ref(true)
  const error = ref('')

  const q = (key: FilterKey) => (typeof route.query[key] === 'string' ? (route.query[key] as string) : '')
  const segment = computed(() => (site.segments.some((s) => s.id === q('segmento')) ? (q('segmento') as Segment) : undefined))
  const category = computed(() => q('categoria') || undefined)
  const stone = computed(() => (site.stones.some((s) => s.id === q('piedra')) ? (q('piedra') as Stone) : undefined))
  const sort = computed<ProductSort>(() => (q('orden') as ProductSort) || 'order')

  let token = 0
  async function fetchProducts() {
    const mine = ++token
    loading.value = true
    error.value = ''
    try {
      const data = await productService.list({
        segment: segment.value,
        category: category.value,
        stone: stone.value,
        sort: sort.value,
        limit: 100,
      })
      if (mine === token) products.value = data.items
    } catch (e) {
      if (mine === token) error.value = (e as ApiError).message
    } finally {
      if (mine === token) loading.value = false
    }
  }

  function setFilter(key: FilterKey, value: string | null) {
    const query = { ...route.query }
    if (value && !(key === 'orden' && value === 'order')) query[key] = value
    else delete query[key]
    router.push({ name: 'Shop', query })
  }

  function reset() {
    router.push({ name: 'Shop' })
  }

  watch(
    () => [route.query.segmento, route.query.categoria, route.query.piedra, route.query.orden],
    () => {
      if (route.name === 'Shop') fetchProducts()
    },
    { immediate: true },
  )

  const hasFilters = computed(() => Boolean(segment.value || category.value || stone.value))

  return { products, loading, error, segment, category, stone, sort, hasFilters, setFilter, reset, fetchProducts }
}
