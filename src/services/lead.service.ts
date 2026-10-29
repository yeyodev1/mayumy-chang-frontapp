import APIBase from './httpBase'
import type { LeadPayload } from '@/types'

/** Lista de espera de Galápagos y solicitudes de diseño a medida. */
class LeadService extends APIBase {
  async create(payload: LeadPayload): Promise<void> {
    await this.post('leads', payload)
  }
}

export const leadService = new LeadService()
