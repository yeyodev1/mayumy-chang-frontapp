<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { ApiError } from '@/types'
import AdminSwitch from '@/components/admin/AdminSwitch.vue'

const props = defineProps<{
  submit: (payload: { name: string; email: string; password: string; notifyOrders: boolean }) => Promise<void>
}>()
const emit = defineEmits<{ done: [] }>()

const form = reactive({ name: '', email: '', password: '', notifyOrders: true })
const showPassword = ref(false)
const saving = ref(false)
const error = ref('')

async function onSubmit() {
  error.value = ''
  if (form.password.length < 8) {
    error.value = 'La contraseña debe tener al menos 8 caracteres'
    return
  }
  saving.value = true
  try {
    await props.submit({ ...form, email: form.email.trim(), name: form.name.trim() })
    Object.assign(form, { name: '', email: '', password: '', notifyOrders: true })
    emit('done')
  } catch (e) {
    error.value = (e as ApiError).message
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <form class="uform" @submit.prevent="onSubmit">
    <div class="uform__row">
      <div class="uform__field">
        <label for="u-name">Nombre</label>
        <input id="u-name" v-model="form.name" type="text" autocomplete="off" required />
      </div>
      <div class="uform__field">
        <label for="u-email">Correo</label>
        <input id="u-email" v-model="form.email" type="email" inputmode="email" autocomplete="off" required />
      </div>
      <div class="uform__field">
        <label for="u-pass">Contraseña (mín. 8)</label>
        <div class="uform__pass">
          <input id="u-pass" v-model="form.password" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" required />
          <button type="button" class="uform__eye" :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'" @click="showPassword = !showPassword">
            <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>

    <div class="uform__foot">
      <AdminSwitch v-model="form.notifyOrders" label="Recibir correo de cada venta" show-label />
      <button class="btn btn--cocoa" type="submit" :disabled="saving">
        <i class="fa-solid fa-user-plus" aria-hidden="true"></i>
        {{ saving ? 'Dando acceso…' : 'Dar acceso' }}
      </button>
    </div>

    <p v-if="error" class="uform__error" role="alert">
      <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> {{ error }}
    </p>
  </form>
</template>

<style scoped lang="scss">
.uform {
  @include flex(column, stretch, flex-start, 1rem);

  &__row {
    @include flex-cards(14rem, 0.9rem);
  }

  &__field {
    @include flex(column, stretch, flex-start, 0);
  }

  &__pass {
    position: relative;

    input {
      padding-right: 2.8rem;
    }
  }

  &__eye {
    position: absolute;
    right: 0.4rem;
    top: 50%;
    transform: translateY(-50%);
    width: 2.2rem;
    height: 2.2rem;
    color: $ink-soft;
    border-radius: $radius-sm;
    @include focus-ring;
  }

  &__foot {
    @include flex(row, center, space-between, 0.8rem);
    flex-wrap: wrap;
  }

  &__error {
    color: $danger;
    font-size: $text-sm;
    background: $danger-bg;
    padding: 0.7rem 0.9rem;
    border-radius: $radius-sm;
  }
}
</style>
