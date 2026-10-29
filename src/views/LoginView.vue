<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AuthShell from '@/components/account/AuthShell.vue'
import PasswordInput from '@/components/account/PasswordInput.vue'
import { useUserStore } from '@/stores/user'
import type { ApiError } from '@/types'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await userStore.login(email.value.trim(), password.value)
    const next = typeof route.query.next === 'string' && route.query.next.startsWith('/') ? route.query.next : null
    if (!userStore.isAdmin) {
      userStore.clear()
      error.value = 'Este acceso es solo para el equipo de la tienda.'
      return
    }
    await router.replace(next ?? '/admin')
  } catch (e) {
    error.value = (e as ApiError).message || 'No se pudo ingresar. Revisa tu conexión.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <!-- TODO coordinador: mover a site.ts (copy del acceso al panel) -->
  <AuthShell eyebrow="Panel" title="Ingresar al panel" text="Pedidos, piezas y ajustes de la tienda. Acceso solo para el equipo.">
    <form class="aform" @submit.prevent="submit">
      <div class="aform__field">
        <label for="login-email">Correo</label>
        <input id="login-email" v-model="email" type="email" autocomplete="email" inputmode="email" required />
      </div>

      <div class="aform__field">
        <label for="login-password">Contraseña</label>
        <PasswordInput id="login-password" v-model="password" autocomplete="current-password" />
      </div>

      <Transition name="rise">
        <p v-if="error" class="aform__error" role="alert">
          <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> {{ error }}
        </p>
      </Transition>

      <button class="btn btn--primary btn--block aform__submit" type="submit" :disabled="loading">
        {{ loading ? 'Ingresando…' : 'Ingresar' }}
      </button>

      <p class="aform__alt">
        ¿Buscas comprar? <RouterLink :to="{ name: 'Shop' }">Ve a la tienda</RouterLink>, no necesitas cuenta.
      </p>
    </form>
  </AuthShell>
</template>
