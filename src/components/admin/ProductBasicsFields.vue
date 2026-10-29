<script setup lang="ts">
import type { ProductDraft } from '@/composables/useAdminProductForm'
import { useAdminCategories } from '@/composables/useAdminCategories'
import { SEGMENTS } from './adminCatalog'
import AdminCard from './AdminCard.vue'
import ProductStonePicker from './products/ProductStonePicker.vue'

defineProps<{
  form: ProductDraft
  errors: Record<string, string>
  slugPreview: string
}>()

const { categories, load: loadCategories } = useAdminCategories()
loadCategories()

// TODO coordinador: mover a site.ts (líneas de diseño conocidas)
const LINES = ['Heptágono', 'Corona']
</script>

<template>
  <AdminCard title="La pieza" icon="fa-regular fa-gem">
    <div class="fields">
      <div class="fields__row">
        <label for="p-name">Nombre</label>
        <input id="p-name" v-model="form.name" type="text" :aria-invalid="Boolean(errors.name)" placeholder="Collar Heptágono Zafiro" />
        <small v-if="errors.name" class="fields__err" role="alert">{{ errors.name }}</small>
      </div>

      <fieldset class="fields__row">
        <legend>Segmento</legend>
        <div class="fields__toggles">
          <button
            v-for="s in SEGMENTS"
            :key="s.id"
            type="button"
            class="fields__toggle"
            :class="{ 'fields__toggle--on': form.segment === s.id }"
            :aria-pressed="form.segment === s.id"
            @click="form.segment = s.id"
          >
            {{ s.label }}
          </button>
        </div>
        <small v-if="errors.segment" class="fields__err" role="alert">{{ errors.segment }}</small>
      </fieldset>

      <div class="fields__split">
        <div class="fields__row">
          <label for="p-cat">Categoría</label>
          <select id="p-cat" v-model="form.category" :aria-invalid="Boolean(errors.category)">
            <option value="" disabled>Elige una categoría</option>
            <option v-for="c in categories" :key="c.slug" :value="c.slug">
              {{ c.name }}{{ c.isVisible ? '' : ' (oculta)' }}
            </option>
          </select>
          <small v-if="errors.category" class="fields__err" role="alert">{{ errors.category }}</small>
          <RouterLink to="/admin/categorias" class="fields__hint fields__hint--link">Crear o editar categorías</RouterLink>
        </div>
        <div class="fields__row">
          <label for="p-line">Línea de diseño</label>
          <input id="p-line" v-model="form.line" type="text" list="p-lines" placeholder="Heptágono, Corona… (opcional)" />
          <datalist id="p-lines">
            <option v-for="l in LINES" :key="l" :value="l" />
          </datalist>
        </div>
      </div>

      <ProductStonePicker v-model="form.stone" />

      <div class="fields__row">
        <label for="p-material">Material</label>
        <input id="p-material" v-model="form.material" type="text" placeholder="Plata 925 · Circonias baguette" />
      </div>

      <div class="fields__row">
        <label for="p-slug">Dirección en la tienda</label>
        <input id="p-slug" v-model="form.slug" type="text" placeholder="se genera del nombre" autocapitalize="off" />
        <small class="fields__hint">/pieza/<strong>{{ slugPreview || '…' }}</strong></small>
      </div>
    </div>
  </AdminCard>
</template>

<style scoped lang="scss">
.fields {
  @include flex(column, stretch, flex-start, 1.1rem);

  &__row {
    min-width: 0;
    border: 0;
  }

  &__split {
    @include flex(row, flex-start, flex-start, 1rem);
    flex-wrap: wrap;

    > .fields__row {
      flex: 1 1 220px;
    }
  }

  legend {
    @include eyebrow;
    margin-bottom: 0.4rem;
  }

  &__toggles {
    @include flex(row, stretch, flex-start, 0.4rem);
  }

  &__toggle {
    flex: 1;
    min-height: 2.9rem;
    padding: 0 0.4rem;
    border: 1px solid $line;
    border-radius: $radius-sm;
    background: $frost;
    font-size: 0.92rem;
    color: $ink-soft;
    @include focus-ring;

    &:hover {
      border-color: $basalt;
    }

    &--on {
      background: $basalt;
      border-color: $basalt;
      color: $frost;
    }
  }

  &__hint {
    display: block;
    margin-top: 0.3rem;
    font-size: 0.8rem;
    color: $ink-muted;
    overflow-wrap: anywhere;

    &--link {
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }

  &__err {
    display: block;
    margin-top: 0.3rem;
    font-size: 0.8rem;
    color: $danger;
  }
}

input[aria-invalid='true'],
select[aria-invalid='true'] {
  border-color: $danger;
}
</style>
