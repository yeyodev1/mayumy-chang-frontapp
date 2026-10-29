<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAdminProductForm } from '@/composables/useAdminProductForm'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminState from '@/components/admin/AdminState.vue'
import ProductBasicsFields from '@/components/admin/ProductBasicsFields.vue'
import ProductStoryFields from '@/components/admin/products/ProductStoryFields.vue'
import ProductVariantsEditor from '@/components/admin/ProductVariantsEditor.vue'
import ProductImagesEditor from '@/components/admin/ProductImagesEditor.vue'
import ProductPublishPanel from '@/components/admin/ProductPublishPanel.vue'

const route = useRoute()
const { product, form, loading, saving, loadError, errors, isNew, load, reset, setImages, save, remove } =
  useAdminProductForm()

const routeId = computed(() => (route.name === 'AdminProductEdit' ? String(route.params.id) : ''))

const slugPreview = computed(() =>
  (form.slug || form.name)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, ''),
)

const title = computed(() => (isNew.value ? 'Nueva pieza' : form.name || 'Editar pieza'))
// Si ya era la del mes, el aviso de "desmarca la anterior" sobra.
const wasPieceOfMonth = ref(false)
watch(product, (p) => (wasPieceOfMonth.value = Boolean(p?.isPieceOfMonth)))

onMounted(() => {
  if (routeId.value) load(routeId.value)
})
// Al crear, la ruta cambia de /nuevo a /:id sin recargar: no hay que volver a pedirla.
watch(routeId, (id) => {
  if (id && id !== product.value?._id) load(id)
  else if (!id) reset()
})
</script>

<template>
  <section class="edit">
    <AdminPageHeader :eyebrow="isNew ? 'Catálogo' : 'Editar pieza'" :title="title" back="/admin/productos" />

    <AdminState :loading="loading" :error="loadError" shape="form" @retry="routeId && load(routeId)" />

    <form v-if="!loading && !loadError" class="edit__form" novalidate @submit.prevent="save">
      <div class="edit__main">
        <ProductBasicsFields :form="form" :errors="errors" :slug-preview="slugPreview" />
        <ProductVariantsEditor v-model="form.variants" v-model:compare-at="form.compareAt" :errors="errors" />
        <ProductStoryFields :form="form" />
      </div>

      <div class="edit__side">
        <ProductImagesEditor :product="product" @updated="setImages" />
        <ProductPublishPanel
          :form="form"
          :is-new="isNew"
          :saving="saving"
          :slug="product?.slug"
          :name="product?.name"
          :was-piece-of-month="wasPieceOfMonth"
          @remove="remove"
        />
      </div>

      <div class="edit__bar">
        <button type="submit" class="btn btn--light edit__save" :disabled="saving">
          {{ saving ? 'Guardando…' : isNew ? 'Crear pieza' : 'Guardar cambios' }}
        </button>
        <p class="edit__bar-text">
          {{ isNew ? 'Después de crearla podrás subir fotos.' : 'Los cambios se ven en la tienda al guardar.' }}
        </p>
      </div>
    </form>
  </section>
</template>

<style scoped lang="scss">
.edit {
  &__form {
    @include flex(column, stretch, flex-start, 1rem);

    @include from('lg') {
      flex-direction: row;
      flex-wrap: wrap;
      align-items: flex-start;
    }
  }

  &__main {
    @include flex(column, stretch, flex-start, 1rem);
    min-width: 0;

    @include from('lg') {
      flex: 1.6 1 0;
    }
  }

  &__side {
    @include flex(column, stretch, flex-start, 1rem);
    min-width: 0;

    @include from('lg') {
      flex: 1 1 0;
    }
  }

  // Barra de guardado siempre a mano; en móvil flota sobre el menú inferior.
  &__bar {
    @include flex(row, center, flex-start, 1rem);
    position: sticky;
    bottom: calc(4.4rem + env(safe-area-inset-bottom));
    z-index: 30;
    flex: 1 1 100%;
    padding: 0.6rem;
    border-radius: $radius-md;
    background: $basalt;
    color: $frost;
    box-shadow: $shadow-md;

    @include from('lg') {
      bottom: 1.2rem;
    }
  }

  &__bar-text {
    display: none;
    font-size: 0.85rem;
    color: rgba($frost, 0.75);

    @include from('md') {
      display: block;
    }
  }

  &__save {
    flex: 1;

    @include from('md') {
      flex: 0 0 auto;
    }
  }
}
</style>
