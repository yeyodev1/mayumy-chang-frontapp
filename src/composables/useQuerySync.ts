import type { Router } from 'vue-router'

/**
 * Refleja estado de UI en la query sin navegar: router.replace dispararía el
 * scrollBehavior del router (sube al inicio) en cada tecla o filtro.
 * Se conserva el history.state de vue-router para que "atrás" siga funcionando.
 */
export function replaceQuery(router: Router, query: Record<string, string>) {
  const href = router.resolve({ path: router.currentRoute.value.path, query }).href
  window.history.replaceState({ ...window.history.state, current: href }, '', href)
}
