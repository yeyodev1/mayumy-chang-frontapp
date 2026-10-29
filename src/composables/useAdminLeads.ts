import { computed, ref } from 'vue'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import type { ApiError, Lead, LeadKind, LeadStatus } from '@/types'
import { useAdminList } from './useAdminList'

/**
 * Solicitudes del sitio: diseño a medida (bespoke) y lista de espera de
 * Galápagos (waitlist). Sin `kind` en la URL se abre "Diseño a medida".
 */
export function useAdminLeads() {
  const toast = useToastStore()
  const list = useAdminList<Lead, 'kind' | 'status'>(
    (q) =>
      adminService.leads({
        ...q,
        kind: (q.kind || 'bespoke') as LeadKind,
        status: q.status as LeadStatus | '',
      }),
    ['kind', 'status'],
  )

  const kind = computed<LeadKind>({
    get: () => (list.filters.kind as LeadKind) || 'bespoke',
    set: (value) => {
      list.filters.kind = value === 'bespoke' ? '' : value
    },
  })

  const busyId = ref<string | null>(null)

  async function setStatus(lead: Lead, status: LeadStatus) {
    if (lead.status === status) return
    busyId.value = lead._id
    const previous = lead.status
    lead.status = status
    try {
      Object.assign(lead, await adminService.setLeadStatus(lead._id, status))
    } catch (e) {
      lead.status = previous
      toast.error((e as ApiError).message || 'No se pudo cambiar el estado')
    } finally {
      busyId.value = null
    }
  }

  return { ...list, kind, busyId, setStatus }
}
