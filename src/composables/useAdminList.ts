import { onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { ApiError, Paginated } from '@/types'

/**
 * Lista paginada del panel: búsqueda con debounce, filtros y página.
 * El estado vive en la URL (?search=&page=&status=) para que "atrás" desde
 * un detalle devuelva al dueño exactamente a donde estaba.
 */
export function useAdminList<T, K extends string = never>(
  fetcher: (query: Record<K, string> & { search: string; page: number }) => Promise<Paginated<T>>,
  filterKeys: K[] = [],
) {
  type Filters = Record<K, string>

  const route = useRoute()
  const router = useRouter()

  const fromQuery = (key: string) => {
    const value = route.query[key]
    return typeof value === 'string' ? value : ''
  }

  const search = ref(fromQuery('search'))
  const page = ref(Number(fromQuery('page')) || 1)
  const filters = reactive(Object.fromEntries(filterKeys.map((k) => [k, fromQuery(k)]))) as Filters

  const items = ref<T[]>([]) as { value: T[] }
  const total = ref(0)
  const pages = ref(1)
  const loading = ref(true)
  const error = ref('')

  let requestId = 0

  async function load() {
    const current = ++requestId
    loading.value = true
    error.value = ''
    try {
      const data = await fetcher({ ...(filters as Filters), search: search.value.trim(), page: page.value })
      // Una respuesta lenta de una búsqueda vieja no pisa a la nueva.
      if (current !== requestId) return
      items.value = data.items
      total.value = data.total
      pages.value = Math.max(1, data.pages)
    } catch (e) {
      if (current !== requestId) return
      error.value = (e as ApiError).message || 'No se pudo cargar la lista'
    } finally {
      if (current === requestId) loading.value = false
    }
  }

  function syncUrl() {
    const query: Record<string, string> = {}
    if (search.value.trim()) query.search = search.value.trim()
    if (page.value > 1) query.page = String(page.value)
    for (const key of filterKeys) if (filters[key]) query[key] = filters[key]
    router.replace({ query })
  }

  function refresh() {
    syncUrl()
    load()
  }

  let debounce: ReturnType<typeof setTimeout> | undefined
  watch(search, () => {
    clearTimeout(debounce)
    debounce = setTimeout(() => {
      page.value = 1
      refresh()
    }, 320)
  })

  watch(
    () => ({ ...filters }),
    () => {
      page.value = 1
      refresh()
    },
  )

  function goTo(next: number) {
    page.value = Math.min(Math.max(1, next), pages.value)
    refresh()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  onMounted(load)

  return { search, page, filters, items, total, pages, loading, error, load, goTo }
}
