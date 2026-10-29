import type { OrderStatus } from '@/types'

/**
 * Cómo se ve y se nombra cada estado de pedido. Lo usan el panel admin y el
 * seguimiento público. Los colores salen de la paleta de piedras y minerales; `fg` sobre
 * `bg` cumple contraste AA, y el estado nunca va solo por color: lleva ícono y
 * label.
 */
export interface OrderStatusMeta {
  label: string
  /** Frase corta para el cliente final (seguimiento del pedido). */
  customerLabel: string
  icon: string
  bg: string
  fg: string
  /** Color sólido para puntos, barras y gráficos. */
  solid: string
}

export const ORDER_STATUS: Record<OrderStatus, OrderStatusMeta> = {
  pending: {
    label: 'Pago pendiente',
    customerLabel: 'Esperando el pago',
    icon: 'fa-solid fa-hourglass-half',
    bg: '#e9ebe8',
    fg: '#4a524f',
    solid: '#a9afb2',
  },
  review: {
    label: 'Por aprobar',
    customerLabel: 'Pedido recibido',
    icon: 'fa-solid fa-clipboard-check',
    bg: '#f6ecd0',
    fg: '#6b4d00',
    solid: '#d99f0a',
  },
  paid: {
    label: 'Pagado',
    customerLabel: 'Pago recibido',
    icon: 'fa-solid fa-credit-card',
    bg: '#e3e6f4',
    fg: '#1d2a8c',
    solid: '#1d2a8c',
  },
  preparing: {
    label: 'En preparación',
    customerLabel: 'Estamos preparando tu pedido',
    icon: 'fa-solid fa-box-open',
    bg: '#dcebec',
    fg: '#0d4f57',
    solid: '#0d4f57',
  },
  shipped: {
    label: 'Enviado',
    customerLabel: 'Va en camino',
    icon: 'fa-solid fa-truck-fast',
    bg: '#e4ecef',
    fg: '#34505c',
    solid: '#8fa6b2',
  },
  delivered: {
    label: 'Entregado',
    customerLabel: 'Entregado',
    icon: 'fa-solid fa-circle-check',
    bg: '#dcefe6',
    fg: '#0a5c40',
    solid: '#0a7350',
  },
  canceled: {
    label: 'Cancelado',
    customerLabel: 'Pedido cancelado',
    icon: 'fa-solid fa-ban',
    bg: '#ebebea',
    fg: '#5a5f5d',
    solid: '#7d8582',
  },
  failed: {
    label: 'Pago fallido',
    customerLabel: 'El pago no se completó',
    icon: 'fa-solid fa-circle-xmark',
    bg: '#f5e1dc',
    fg: '#8a2615',
    solid: '#9c2b19',
  },
}

/** Orden en que se muestran los estados en filtros y resúmenes. */
export const ORDER_STATUS_ORDER: OrderStatus[] = [
  'review',
  'paid',
  'preparing',
  'shipped',
  'delivered',
  'pending',
  'canceled',
  'failed',
]

/** Estados que el taller todavía tiene que mover. */
export const ACTIONABLE_STATUSES: OrderStatus[] = ['review', 'paid', 'preparing']

/**
 * Siguiente paso natural del despacho: paid → preparing → shipped → delivered.
 * Con transferencia el pedido arranca en review y aprobarlo lo pasa a preparing.
 */
export function nextOrderStatus(status: OrderStatus): OrderStatus | null {
  const flow: Partial<Record<OrderStatus, OrderStatus>> = {
    review: 'preparing',
    paid: 'preparing',
    preparing: 'shipped',
    shipped: 'delivered',
  }
  return flow[status] ?? null
}

/** Un pedido ya entregado, fallido o cancelado no se cancela. */
export function canCancelOrder(status: OrderStatus): boolean {
  return ['pending', 'review', 'paid', 'preparing', 'shipped'].includes(status)
}

export function orderStatusLabel(status: OrderStatus): string {
  return ORDER_STATUS[status]?.label ?? status
}
