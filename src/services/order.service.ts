import APIBase from './httpBase'
import type { CreateOrderPayload, Order, PayphoneBoxConfig, StoreConfig } from '@/types'

class OrderService extends APIBase {
  async config(): Promise<StoreConfig> {
    const { data } = await this.get<StoreConfig>('store/config')
    return data
  }

  /** `payphone` llega null cuando el pedido se paga por transferencia. */
  async create(payload: CreateOrderPayload): Promise<{ order: Order; payphone: PayphoneBoxConfig | null }> {
    const { data } = await this.post<{ order: Order; payphone: PayphoneBoxConfig | null }>('orders', payload)
    return data
  }

  async confirm(
    id: string,
    clientTransactionId: string,
  ): Promise<{ order: Order; approved: boolean; message: string }> {
    const { data } = await this.post<{ order: Order; approved: boolean; message: string }>(
      'orders/confirm',
      { id, clientTransactionId },
    )
    return data
  }

  async mine(): Promise<Order[]> {
    const { data } = await this.get<Order[]>('orders/mine')
    return data
  }

  /** Seguimiento sin cuenta: el código del pedido más el correo con que se compró. */
  async byCode(code: string, email: string): Promise<Order> {
    const { data } = await this.get<Order>(
      `orders/by-code/${encodeURIComponent(code)}?email=${encodeURIComponent(email)}`,
    )
    return data
  }
}

export const orderService = new OrderService()
