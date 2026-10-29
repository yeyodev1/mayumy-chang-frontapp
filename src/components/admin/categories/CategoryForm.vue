<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { AdminCategory, ApiError, CategoryPayload } from '@/types'
import AdminSwitch from '@/components/admin/AdminSwitch.vue'

const props = defineProps<{
  category?: AdminCategory | null
  submit: (payload: CategoryPayload) => Promise<void>
}>()
const emit = defineEmits<{ cancel: [] }>()

const empty = (): Required<CategoryPayload> => ({ name: '', blurb: '', isVisible: true })
const form = reactive(empty())
const saving = ref(false)
const error = ref('')

watch(
  () => props.category,
  (c) => {
    Object.assign(form, c ? { name: c.name, blurb: c.blurb, isVisible: c.isVisible } : empty())
    error.value = ''
  },
  { immediate: true },
)

async function onSubmit() {
  error.value = ''
  if (form.name.trim().length < 2) {
    error.value = 'Ponle un nombre a la categoría.'
    return
  }
  saving.value = true
  try {
    await props.submit({ ...form, name: form.name.trim(), blurb: form.blurb.trim() })
    if (!props.category) Object.assign(form, empty())
  } catch (e) {
    error.value = (e as ApiError).message || 'No se pudo guardar'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <form class="cform" @submit.prevent="onSubmit">
    <div class="cform__row">
      <div class="cform__field">
        <label for="c-name">Nombre</label>
        <input id="c-name" v-model="form.name" type="text" maxlength="40" placeholder="Anillos" required />
        <small v-if="category" class="cform__hint">
          Dirección: /tienda?categoria=<strong>{{ category.slug }}</strong> (no cambia al renombrar)
        </small>
      </div>
      <div class="cform__field cform__field--wide">
        <label for="c-blurb">Texto corto</label>
        <input id="c-blurb" v-model="form.blurb" type="text" maxlength="160" placeholder="Para todos los días y para el día que importa." />
      </div>
    </div>

    <p v-if="error" class="cform__error" role="alert">
      <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> {{ error }}
    </p>

    <div class="cform__foot">
      <AdminSwitch v-model="form.isVisible" label="Visible en la tienda" show-label />
      <div class="cform__actions">
        <button v-if="category" type="button" class="btn btn--ghost" @click="emit('cancel')">Cancelar</button>
        <button class="btn btn--primary" type="submit" :disabled="saving">
          {{ saving ? 'Guardando…' : category ? 'Guardar cambios' : 'Crear categoría' }}
        </button>
      </div>
    </div>
  </form>
</template>

<style scoped lang="scss">
.cform {
  @include flex(column, stretch, flex-start, 1rem);

  &__row {
    @include flex(row, flex-start, flex-start, 1rem);
    flex-wrap: wrap;
  }

  &__field {
    @include flex(column, stretch, flex-start, 0);
    flex: 1 1 14rem;
    min-width: 0;

    &--wide {
      flex: 2 1 20rem;
    }
  }

  &__hint {
    color: $ink-muted;
    font-size: 0.78rem;
    margin-top: 0.35rem;
    overflow-wrap: anywhere;
  }

  &__error {
    color: $danger;
    font-size: $text-sm;
    background: $danger-bg;
    padding: 0.7rem 0.9rem;
    border-radius: $radius-sm;
  }

  &__foot {
    @include flex(row, center, space-between, 0.8rem);
    flex-wrap: wrap;
  }

  &__actions {
    @include flex(row, center, flex-end, 0.6rem);
    flex-wrap: wrap;
    margin-left: auto;
  }
}
</style>
