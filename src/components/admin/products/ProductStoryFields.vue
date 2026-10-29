<script setup lang="ts">
import type { ProductDraft } from '@/composables/useAdminProductForm'
import AdminCard from '../AdminCard.vue'
import ChipsInput from '../ChipsInput.vue'

defineProps<{ form: ProductDraft }>()

// TODO coordinador: mover a site.ts (sugerencias del panel admin)
const DETAIL_SUGGESTIONS = ['PLATA 925', 'ORO 18K', '7 BAGUETTES TALLADAS', 'CIERRE DE PRESIÓN', 'CADENA 45 CM']
const BADGE_SUGGESTIONS = ['Pieza única', 'Hecho a mano', 'Edición limitada']
</script>

<template>
  <AdminCard title="Descripción y ficha" icon="fa-solid fa-align-left">
    <div class="story">
      <div>
        <label for="p-short">Descripción corta</label>
        <input
          id="p-short"
          v-model="form.shortDescription"
          type="text"
          maxlength="180"
          placeholder="Una línea que se ve debajo del nombre"
        />
      </div>
      <div>
        <label for="p-desc">Descripción larga</label>
        <textarea id="p-desc" v-model="form.description" rows="5" placeholder="Cómo nació la pieza, cómo se lleva, qué la hace distinta."></textarea>
      </div>
      <ChipsInput
        v-model="form.details"
        label="Ficha técnica"
        hint="Datos cortos que salen en la ficha, en mayúsculas: metal, medidas, cierre."
        :suggestions="DETAIL_SUGGESTIONS"
      />
      <ChipsInput
        v-model="form.badges"
        label="Sellos"
        hint="Etiquetas cortas sobre la foto. Opcional."
        :suggestions="BADGE_SUGGESTIONS"
      />
    </div>
  </AdminCard>
</template>

<style scoped lang="scss">
.story {
  @include flex(column, stretch, flex-start, 1.1rem);

  textarea {
    resize: vertical;
    line-height: 1.55;
  }
}
</style>
