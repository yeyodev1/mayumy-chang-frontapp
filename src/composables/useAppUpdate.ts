import { ref } from 'vue'
import type { Router } from 'vue-router'

const CHECK_EVERY_MS = 5 * 60 * 1000
// Navegar entre páginas también revisa, pero no más de una vez por minuto.
const MIN_GAP_MS = 60 * 1000

const updateAvailable = ref(false)
let lastCheck = 0
let started = false

async function check() {
  if (import.meta.env.DEV || updateAvailable.value) return
  lastCheck = Date.now()
  try {
    const res = await fetch(`/version.json?t=${lastCheck}`, { cache: 'no-store' })
    if (!res.ok) return
    const { version } = (await res.json()) as { version?: string }
    if (version && version !== __APP_VERSION__) updateAvailable.value = true
  } catch {
    /* sin red: se reintenta en la próxima revisión */
  }
}

function checkSoon() {
  if (Date.now() - lastCheck > MIN_GAP_MS) check()
}

/**
 * Avisa cuando se desplegó una versión nueva mientras la pestaña seguía abierta.
 * Sin esto, quien deja el panel abierto sigue con el código viejo hasta recargar.
 */
export function startAppUpdateWatch(router: Router) {
  if (started) return
  started = true
  check()
  setInterval(check, CHECK_EVERY_MS)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') checkSoon()
  })
  router.afterEach(checkSoon)
  // Tras un deploy los chunks viejos ya no existen: abrir una página lazy falla.
  router.onError((error) => {
    if (
      /dynamically imported module|Importing a module script failed/i.test(String(error?.message))
    ) {
      updateAvailable.value = true
    }
  })
}

export function useAppUpdate() {
  return { updateAvailable, reload: () => window.location.reload() }
}
