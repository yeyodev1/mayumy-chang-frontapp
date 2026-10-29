<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import type { AdminCategory, CategoryPayload } from '@/types'
import { useAdminCategories } from '@/composables/useAdminCategories'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminCard from '@/components/admin/AdminCard.vue'
import AdminState from '@/components/admin/AdminState.vue'
import CategoryForm from '@/components/admin/categories/CategoryForm.vue'
import CategoryRow from '@/components/admin/categories/CategoryRow.vue'
import BaseModal from '@/components/ui/BaseModal.vue'

const { categories, loading, error, busyId, load, create, update, move, remove } =
  useAdminCategories()

const editing = ref<AdminCategory | null>(null)
const toRemove = ref<AdminCategory | null>(null)
const formCard = ref<HTMLElement | null>(null)

async function startEdit(category: AdminCategory) {
  editing.value = category
  await nextTick()
  formCard.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

async function submit(payload: CategoryPayload) {
  if (editing.value) {
    await update(editing.value, payload)
    editing.value = null
  } else {
    await create(payload)
  }
}

function setVisible(category: AdminCategory, isVisible: boolean) {
  update(
    category,
    { isVisible },
    isVisible ? `"${category.name}" ya se ve en la tienda` : `"${category.name}" quedó oculta`,
  )
}

function confirmRemove() {
  const category = toRemove.value
  toRemove.value = null
  if (category) remove(category)
}

onMounted(() => load(true))
</script>

<template>
  <section class="cats">
    <AdminPageHeader
      eyebrow="Catálogo"
      title="Categorías"
      subtitle="Las que se ven en los filtros de la tienda, en este orden. Dentro de cada segmento (oro, plata, semijoyas) salen solo las que tienen piezas."
    />

    <div ref="formCard" class="cats__form">
      <AdminCard
        :title="editing ? `Editar ${editing.name}` : 'Nueva categoría'"
        :icon="editing ? 'fa-solid fa-pen' : 'fa-solid fa-plus'"
      >
        <CategoryForm :category="editing" :submit="submit" @cancel="editing = null" />
      </AdminCard>
    </div>

    <AdminState
      :loading="loading && !categories.length"
      :error="error?.message"
      :empty="!categories.length"
      empty-icon="fa-solid fa-layer-group"
      empty-text="Todavía no hay categorías."
      @retry="load(true)"
    />

    <ol v-if="categories.length" class="cats__list">
      <li v-for="(category, i) in categories" :key="category._id">
        <CategoryRow
          :category="category"
          :busy="busyId === category._id"
          :first="i === 0"
          :last="i === categories.length - 1"
          :position="i + 1"
          @up="move(i, -1)"
          @down="move(i, 1)"
          @edit="startEdit(category)"
          @visible="setVisible(category, $event)"
          @remove="toRemove = category"
        />
      </li>
    </ol>

    <BaseModal
      :open="Boolean(toRemove)"
      title="¿Eliminar la categoría?"
      :message="
        toRemove?.productCount
          ? `Tiene ${toRemove.productCount} pieza(s). Pásalas a otra categoría antes de eliminarla, o mejor ocúltala.`
          : `${toRemove?.name ?? ''} dejará de existir. Si solo quieres sacarla de la tienda por un tiempo, ocúltala.`
      "
      confirm-label="Eliminar"
      danger
      @confirm="confirmRemove"
      @cancel="toRemove = null"
    />
  </section>
</template>

<style scoped lang="scss">
.cats {
  &__form {
    margin-bottom: 1.4rem;
    scroll-margin-top: 1rem;
  }

  &__list {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.6rem);
  }
}
</style>
