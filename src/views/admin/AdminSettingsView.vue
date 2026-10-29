<script setup lang="ts">
import { onMounted } from 'vue'
import { useStoreSettings } from '@/composables/useStoreSettings'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminState from '@/components/admin/AdminState.vue'
import SettingsShippingCard from '@/components/admin/settings/SettingsShippingCard.vue'
import SettingsSiteCards from '@/components/admin/settings/SettingsSiteCards.vue'

const { form, errors, loading, saving, error, loaded, load, save } = useStoreSettings()

onMounted(load)
</script>

<template>
  <section class="settings">
    <AdminPageHeader
      eyebrow="Tienda"
      title="Ajustes de la tienda"
      subtitle="Envíos, citas, contacto y el adelanto de Galápagos. Lo que guardes aquí se ve al instante en la web."
    />

    <AdminState :loading="loading && !loaded" :error="error?.message" shape="form" @retry="load" />

    <form v-if="loaded" class="settings__form" novalidate @submit.prevent="save">
      <SettingsShippingCard :shipping="form.shipping" :errors="errors" />
      <SettingsSiteCards :form="form" :errors="errors" />

      <div class="settings__bar">
        <button class="btn btn--light settings__save" type="submit" :disabled="saving">
          {{ saving ? 'Guardando…' : 'Guardar ajustes' }}
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped lang="scss">
.settings {
  &__form {
    @include flex(column, stretch, flex-start, 1rem);
    max-width: 54rem;
  }

  // Botón a la izquierda: los toasts salen abajo a la derecha y lo taparían.
  &__bar {
    @include flex(row, center, flex-start, 0.8rem);
    position: sticky;
    bottom: calc(4.4rem + env(safe-area-inset-bottom));
    z-index: 30;
    padding: 0.6rem;
    border-radius: $radius-md;
    background: $basalt;
    box-shadow: $shadow-md;

    @include from('lg') {
      bottom: 1.2rem;
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
