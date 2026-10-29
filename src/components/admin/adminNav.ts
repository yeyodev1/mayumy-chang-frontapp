// TODO coordinador: mover a site.ts (copy del panel admin)
export interface AdminNavItem {
  to: string
  name: string
  label: string
  short: string
  icon: string
  /** Muestra el contador de pedidos por atender. */
  badge?: boolean
  /** Va fijo en la barra inferior del celular; el resto queda en "Más". */
  tab?: boolean
}

export const adminNav: AdminNavItem[] = [
  { to: '/admin', name: 'AdminDashboard', label: 'Panel', short: 'Panel', icon: 'fa-solid fa-chart-simple', tab: true },
  { to: '/admin/pedidos', name: 'AdminOrders', label: 'Pedidos', short: 'Pedidos', icon: 'fa-solid fa-receipt', badge: true, tab: true },
  { to: '/admin/productos', name: 'AdminProducts', label: 'Productos', short: 'Piezas', icon: 'fa-regular fa-gem', tab: true },
  { to: '/admin/categorias', name: 'AdminCategories', label: 'Categorías', short: 'Categorías', icon: 'fa-solid fa-layer-group' },
  { to: '/admin/solicitudes', name: 'AdminLeads', label: 'Solicitudes', short: 'Solicitudes', icon: 'fa-solid fa-envelope-open-text', tab: true },
  { to: '/admin/clientes', name: 'AdminCustomers', label: 'Clientes', short: 'Clientes', icon: 'fa-solid fa-user-group' },
  { to: '/admin/ajustes', name: 'AdminSettings', label: 'Ajustes', short: 'Ajustes', icon: 'fa-solid fa-sliders' },
  { to: '/admin/pagos', name: 'AdminPayments', label: 'Pagos', short: 'Pagos', icon: 'fa-solid fa-building-columns' },
  { to: '/admin/usuarios', name: 'AdminUsers', label: 'Usuarios', short: 'Usuarios', icon: 'fa-solid fa-user-shield' },
]

/** Qué item del menú se marca como activo, incluyendo las subrutas (detalle, editar). */
export function isNavActive(item: AdminNavItem, path: string): boolean {
  if (item.to === '/admin') return path === '/admin' || path === '/admin/'
  return path.startsWith(item.to)
}
