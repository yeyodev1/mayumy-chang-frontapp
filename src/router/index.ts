import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { site } from '@/config/site'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: site.name },
  },
  {
    // Filtros en la query (?segmento=&categoria=&piedra=&orden=): se comparten por WhatsApp tal cual.
    path: '/tienda',
    name: 'Shop',
    component: () => import('@/views/ShopView.vue'),
    meta: { title: 'Tienda' },
  },
  {
    path: '/pieza/:slug',
    name: 'Product',
    component: () => import('@/views/ProductView.vue'),
    meta: { title: 'Pieza' },
  },
  { path: '/producto/:slug', redirect: (to) => ({ name: 'Product', params: to.params }) },
  {
    path: '/a-medida',
    name: 'Bespoke',
    component: () => import('@/views/BespokeView.vue'),
    meta: { title: 'Diseño a medida', darkHeader: true },
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('@/views/CheckoutView.vue'),
    meta: { title: 'Finalizar compra', minimalChrome: true },
  },
  {
    // URL de respuesta registrada en Payphone Developer: no cambiarla sin avisar.
    path: '/pay-response',
    name: 'PaymentResponse',
    component: () => import('@/views/PaymentResponseView.vue'),
    meta: { title: 'Confirmando tu pago', minimalChrome: true },
  },
  {
    path: '/rastrear',
    name: 'TrackOrder',
    component: () => import('@/views/TrackOrderView.vue'),
    meta: { title: 'Mi pedido' },
  },
  { path: '/pedido', redirect: '/rastrear' },
  {
    path: '/pedido/:code',
    name: 'OrderTracking',
    component: () => import('@/views/OrderTrackingView.vue'),
    meta: { title: 'Tu pedido' },
  },
  {
    // Solo administración: los clientes compran como invitados con su correo.
    path: '/admin/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'Administración', guestOnly: true, minimalChrome: true },
  },
  { path: '/login', redirect: '/admin/login' },
  { path: '/carrito', redirect: '/tienda' },
  {
    path: '/admin',
    component: () => import('@/layout/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, admin: true },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/AdminDashboardView.vue'),
        meta: { title: 'Panel' },
      },
      {
        path: 'productos',
        name: 'AdminProducts',
        component: () => import('@/views/admin/AdminProductsView.vue'),
        meta: { title: 'Productos' },
      },
      {
        path: 'productos/nuevo',
        name: 'AdminProductNew',
        component: () => import('@/views/admin/AdminProductEditView.vue'),
        meta: { title: 'Nueva pieza' },
      },
      {
        path: 'productos/:id',
        name: 'AdminProductEdit',
        component: () => import('@/views/admin/AdminProductEditView.vue'),
        meta: { title: 'Editar pieza' },
      },
      {
        path: 'categorias',
        name: 'AdminCategories',
        component: () => import('@/views/admin/AdminCategoriesView.vue'),
        meta: { title: 'Categorías' },
      },
      {
        path: 'pedidos',
        name: 'AdminOrders',
        component: () => import('@/views/admin/AdminOrdersView.vue'),
        meta: { title: 'Pedidos' },
      },
      {
        path: 'pedidos/:id',
        name: 'AdminOrderDetail',
        component: () => import('@/views/admin/AdminOrderDetailView.vue'),
        meta: { title: 'Pedido' },
      },
      {
        path: 'clientes',
        name: 'AdminCustomers',
        component: () => import('@/views/admin/AdminCustomersView.vue'),
        meta: { title: 'Clientes' },
      },
      {
        path: 'solicitudes',
        name: 'AdminLeads',
        component: () => import('@/views/admin/AdminLeadsView.vue'),
        meta: { title: 'Citas y lista de espera' },
      },
      {
        path: 'usuarios',
        name: 'AdminUsers',
        component: () => import('@/views/admin/AdminUsersView.vue'),
        meta: { title: 'Usuarios del panel' },
      },
      {
        path: 'ajustes',
        name: 'AdminSettings',
        component: () => import('@/views/admin/AdminSettingsView.vue'),
        meta: { title: 'Ajustes de la tienda' },
      },
      {
        path: 'pagos',
        name: 'AdminPayments',
        component: () => import('@/views/admin/AdminPaymentsView.vue'),
        meta: { title: 'Pagos' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Página no encontrada' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // El scroll lo resuelve App.vue junto con Lenis (después de la transición de página).
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash }
    return false
  },
})

router.beforeEach(async (to) => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth || to.meta.guestOnly) {
    // La sesión se verifica contra el API una sola vez por carga.
    await userStore.restore()
  }

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    return { name: 'Login', query: { next: to.fullPath }, replace: true }
  }

  if (to.meta.requiresAdmin && !userStore.isAdmin) {
    return { name: 'Home', replace: true }
  }

  if (to.meta.guestOnly && userStore.isAuthenticated) {
    return { name: userStore.isAdmin ? 'AdminDashboard' : 'Home', replace: true }
  }
})

router.afterEach((to) => {
  const title = to.meta.title as string | undefined
  document.title =
    title && title !== site.name ? `${title} — ${site.name}` : `${site.name} — ${site.tagline}`
})

export default router
