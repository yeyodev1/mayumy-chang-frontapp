import { ref, type Ref } from 'vue'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import type { ApiError, Product, ProductImage } from '@/types'

export interface UploadItem {
  id: number
  name: string
  preview: string
  progress: number
  error: string
}

const MAX_MB = 8
let uploadSeq = 0

/**
 * Imágenes de una pieza ya creada: subida con progreso (una a la vez, para
 * que el orden en que llegan sea el orden en que se soltaron), borrado y orden.
 * images[0] es la portada (fondo neutro) e images[1] la que se ve al pasar el
 * cursor (puesta). Se identifican por url: las sembradas no tienen publicId.
 */
export function useAdminProductImages(product: Ref<Product | null>, onUpdated: (p: Product) => void) {
  const toast = useToastStore()
  const uploads = ref<UploadItem[]>([])
  const busy = ref(false)

  async function upload(files: FileList | File[]) {
    if (!product.value) return
    const list = Array.from(files).filter((f) => {
      if (!f.type.startsWith('image/')) {
        toast.error(`${f.name} no es una imagen`)
        return false
      }
      if (f.size > MAX_MB * 1024 * 1024) {
        toast.error(`${f.name} pesa más de ${MAX_MB} MB`)
        return false
      }
      return true
    })
    const queued = list.map((file) => {
      const item: UploadItem = { id: ++uploadSeq, name: file.name, preview: URL.createObjectURL(file), progress: 0, error: '' }
      uploads.value.push(item)
      return { file, item }
    })

    for (const { file, item } of queued) {
      const tracked = () => uploads.value.find((u) => u.id === item.id)
      try {
        const updated = await adminService.uploadImage(product.value!._id, file, (pct) => {
          const u = tracked()
          if (u) u.progress = pct
        })
        onUpdated(updated)
        uploads.value = uploads.value.filter((u) => u.id !== item.id)
        URL.revokeObjectURL(item.preview)
      } catch (e) {
        const u = tracked()
        if (u) u.error = (e as ApiError).message || 'No se pudo subir'
      }
    }
    if (queued.length && !uploads.value.some((u) => u.error)) {
      toast.success(queued.length === 1 ? 'Foto subida' : `${queued.length} fotos subidas`)
    }
  }

  function dismissUpload(id: number) {
    const item = uploads.value.find((u) => u.id === id)
    if (item) URL.revokeObjectURL(item.preview)
    uploads.value = uploads.value.filter((u) => u.id !== id)
  }

  async function run(action: () => Promise<Product>, okMessage: string) {
    busy.value = true
    try {
      onUpdated(await action())
      toast.success(okMessage)
    } catch (e) {
      toast.error((e as ApiError).message || 'No se pudo actualizar las fotos')
    } finally {
      busy.value = false
    }
  }

  function remove(image: ProductImage) {
    if (!product.value) return
    const id = product.value._id
    return run(() => adminService.deleteImage(id, image), 'Foto eliminada')
  }

  function reorder(urls: string[], okMessage = 'Orden de fotos guardado') {
    if (!product.value) return
    const id = product.value._id
    return run(() => adminService.reorderImages(id, urls), okMessage)
  }

  function move(from: number, to: number) {
    const ids = product.value?.images.map((i) => i.url) ?? []
    if (to < 0 || to >= ids.length || from === to) return
    const [moved] = ids.splice(from, 1)
    ids.splice(to, 0, moved!)
    return reorder(ids)
  }

  function makeCover(index: number) {
    const ids = product.value?.images.map((i) => i.url) ?? []
    const [moved] = ids.splice(index, 1)
    ids.unshift(moved!)
    return reorder(ids, 'Portada actualizada')
  }

  return { uploads, busy, upload, dismissUpload, remove, move, makeCover }
}
