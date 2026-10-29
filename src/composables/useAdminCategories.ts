import { ref } from 'vue'
import { adminService } from '@/services/admin.service'
import { useCategoriesStore } from '@/stores/categories'
import { useToastStore } from '@/stores/toast'
import type { AdminCategory, ApiError, CategoryPayload } from '@/types'

// Estado de módulo: la sección Categorías, la lista y el form de producto ven la misma lista.
const categories = ref<AdminCategory[]>([])
const loading = ref(false)
const error = ref<ApiError | null>(null)
const busyId = ref<string | null>(null)
let request: Promise<void> | null = null

export function useAdminCategories() {
  const toast = useToastStore()
  const shop = useCategoriesStore()

  function load(force = false): Promise<void> {
    if (!request || force) {
      loading.value = true
      error.value = null
      request = adminService
        .categories()
        .then((items) => {
          categories.value = items
        })
        .catch((e) => {
          error.value = e as ApiError
          request = null
        })
        .finally(() => {
          loading.value = false
        })
    }
    return request
  }

  // Lo que cambia acá se ve en la tienda sin recargar.
  const syncShop = () => shop.load(true)

  const labelOf = (slug: string) => categories.value.find((c) => c.slug === slug)?.name ?? slug

  async function create(payload: CategoryPayload) {
    const created = await adminService.createCategory(payload)
    categories.value = [...categories.value, { ...created, productCount: 0 }]
    toast.success(`Categoría "${created.name}" creada`)
    syncShop()
  }

  async function update(
    category: AdminCategory,
    payload: CategoryPayload,
    okMessage = 'Cambios guardados',
  ) {
    busyId.value = category._id
    try {
      const updated = await adminService.updateCategory(category._id, payload)
      categories.value = categories.value.map((c) =>
        c._id === category._id ? { ...updated, productCount: c.productCount } : c,
      )
      toast.success(okMessage)
      syncShop()
    } finally {
      busyId.value = null
    }
  }

  async function move(index: number, delta: -1 | 1) {
    const to = index + delta
    if (to < 0 || to >= categories.value.length) return
    const ids = categories.value.map((c) => c._id)
    const [moved] = ids.splice(index, 1)
    ids.splice(to, 0, moved!)
    busyId.value = moved!
    try {
      categories.value = await adminService.reorderCategories(ids)
      syncShop()
    } catch (e) {
      toast.error((e as ApiError).message || 'No se pudo cambiar el orden')
    } finally {
      busyId.value = null
    }
  }

  async function remove(category: AdminCategory) {
    busyId.value = category._id
    try {
      await adminService.deleteCategory(category._id)
      categories.value = categories.value.filter((c) => c._id !== category._id)
      toast.success(`Categoría "${category.name}" eliminada`)
      syncShop()
    } catch (e) {
      toast.error((e as ApiError).message || 'No se pudo eliminar la categoría')
    } finally {
      busyId.value = null
    }
  }

  return { categories, loading, error, busyId, load, labelOf, create, update, move, remove }
}
