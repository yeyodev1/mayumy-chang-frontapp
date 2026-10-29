<script setup lang="ts">
import { ref } from 'vue'
import type { ProductDraft } from '@/composables/useAdminProductForm'
import BaseModal from '@/components/ui/BaseModal.vue'
import AdminCard from './AdminCard.vue'
import AdminSwitch from './AdminSwitch.vue'

const props = defineProps<{
  form: ProductDraft
  isNew: boolean
  saving: boolean
  slug?: string
  name?: string
  /** Si la pieza ya era la del mes al cargarla (para no avisar de más). */
  wasPieceOfMonth?: boolean
}>()
const emit = defineEmits<{ remove: [] }>()
const confirmOpen = ref(false)
</script>

<template>
  <AdminCard title="En la tienda" icon="fa-solid fa-eye">
    <div class="pub">
      <div class="pub__row">
        <AdminSwitch v-model="form.isPublished" label="Publicado" show-label />
        <p class="pub__hint">{{ form.isPublished ? 'Las clientas la ven y la pueden comprar.' : 'Borrador: solo la ves tú.' }}</p>
      </div>

      <div class="pub__row">
        <AdminSwitch v-model="form.keepVisibleWhenSoldOut" label="Mantener visible cuando se agote" show-label />
        <p class="pub__hint">
          Se muestra con la etiqueta Agotado; da sensación de que se vende rápido. Apágalo para piezas que no volverán.
        </p>
      </div>

      <div class="pub__row">
        <AdminSwitch v-model="form.isPieceOfMonth" label="Pieza del mes" show-label />
        <p v-if="form.isPieceOfMonth && !props.wasPieceOfMonth" class="pub__note" role="status">
          <i class="fa-solid fa-circle-info" aria-hidden="true"></i>
          Solo hay una pieza del mes: al guardar, la anterior deja de serlo.
        </p>
        <p v-else class="pub__hint">Sale arriba en la tienda, destacada.</p>
      </div>

      <div class="pub__row">
        <AdminSwitch v-model="form.isBestSeller" label="Más vendido" show-label />
      </div>

      <div class="pub__row">
        <AdminSwitch v-model="form.isFeatured" label="Destacada" show-label />
      </div>

      <div class="pub__order">
        <label for="p-order">Orden en la tienda</label>
        <input id="p-order" v-model.number="form.order" type="number" inputmode="numeric" step="1" />
        <small>Los números más bajos aparecen primero.</small>
      </div>

      <a v-if="!isNew && slug && form.isPublished" :href="`/pieza/${slug}`" target="_blank" rel="noopener" class="pub__view">
        <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i> Ver en la tienda
      </a>
      <button v-if="!isNew" type="button" class="pub__delete" :disabled="saving" @click="confirmOpen = true">
        <i class="fa-solid fa-trash-can" aria-hidden="true"></i> Eliminar pieza
      </button>
    </div>

    <BaseModal
      :open="confirmOpen"
      :title="`¿Eliminar ${name || 'esta pieza'}?`"
      message="Se borra con todas sus fotos. Si solo quieres esconderla, apaga «Publicado»."
      confirm-label="Eliminar"
      danger
      @confirm="confirmOpen = false; emit('remove')"
      @cancel="confirmOpen = false"
    />
  </AdminCard>
</template>

<style scoped lang="scss">
.pub {
  @include flex(column, stretch, flex-start, 0.7rem);

  &__row {
    padding-bottom: 0.7rem;
    border-bottom: 1px solid $line;
  }

  &__hint {
    margin-top: -0.1rem;
    font-size: 0.8rem;
    color: $ink-muted;
    line-height: 1.45;
  }

  &__note {
    @include flex(row, baseline, flex-start, 0.45rem);
    padding: 0.5rem 0.7rem;
    border-radius: $radius-sm;
    background: $info-bg;
    color: $zafiro;
    font-size: 0.8rem;
  }

  &__order small {
    display: block;
    margin-top: 0.3rem;
    font-size: 0.78rem;
    color: $ink-muted;
  }

  &__view {
    @include flex(row, center, flex-start, 0.5rem);
    font-size: 0.88rem;
    text-decoration: underline;
    text-underline-offset: 3px;
    @include focus-ring;
  }

  &__delete {
    @include flex(row, center, flex-start, 0.5rem);
    align-self: flex-start;
    min-height: 2.75rem;
    font-size: 0.85rem;
    color: $danger;
    @include focus-ring;
  }
}
</style>
