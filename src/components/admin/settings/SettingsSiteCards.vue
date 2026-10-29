<script setup lang="ts">
import type { StoreSettingsForm } from '@/composables/useStoreSettings'
import AdminCard from '../AdminCard.vue'
import AdminField from '../AdminField.vue'
import AdminSwitch from '../AdminSwitch.vue'

defineProps<{ form: StoreSettingsForm; errors: Record<string, string> }>()
</script>

<template>
  <AdminCard title="Citas" icon="fa-regular fa-calendar">
    <div class="site__row">
      <AdminField
        id="b-url"
        label="Enlace de la agenda"
        hint="Pega aquí el enlace de tu agenda de Confirmafy. Vacío = las citas se piden por WhatsApp."
        :error="errors.bookingUrl"
        wide
      >
        <input id="b-url" v-model="form.booking.url" type="url" inputmode="url" placeholder="https://confirmafy.com/…" autocapitalize="off" />
      </AdminField>
      <AdminField id="b-label" label="Texto del botón" hint="Lo que dice el botón en la web.">
        <input id="b-label" v-model="form.booking.label" type="text" maxlength="60" placeholder="Agendar cita" />
      </AdminField>
    </div>
  </AdminCard>

  <AdminCard title="Contacto" icon="fa-regular fa-address-card">
    <div class="site__row">
      <AdminField id="c-wa" label="WhatsApp" hint="Con código de país, solo números: 593985870627." :error="errors.whatsapp">
        <input id="c-wa" v-model="form.contact.whatsapp" type="tel" inputmode="numeric" placeholder="593985870627" />
      </AdminField>
      <AdminField id="c-ig" label="Instagram" hint="El enlace o el usuario (@mayumychang).">
        <input id="c-ig" v-model="form.contact.instagram" type="text" autocapitalize="off" />
      </AdminField>
      <AdminField id="c-mail" label="Correo" :error="errors.email">
        <input id="c-mail" v-model="form.contact.email" type="email" inputmode="email" autocapitalize="off" />
      </AdminField>
      <AdminField id="c-show" label="Showroom" hint="Ej. Guayaquil, Ecuador · con cita">
        <input id="c-show" v-model="form.contact.showroom" type="text" />
      </AdminField>
    </div>
  </AdminCard>

  <AdminCard title="Colección Galápagos" icon="fa-solid fa-water">
    <AdminSwitch v-model="form.collab.enabled" label="Mostrar el adelanto en la web" show-label />
    <p class="site__hint">
      {{ form.collab.enabled ? 'Se ve en la home con la lista de espera.' : 'Oculto: nadie ve el adelanto.' }}
    </p>
    <div class="site__row">
      <AdminField id="g-eyebrow" label="Etiqueta" hint="Texto pequeño arriba del título.">
        <input id="g-eyebrow" v-model="form.collab.eyebrow" type="text" maxlength="80" placeholder="Próximamente · Edición limitada" />
      </AdminField>
      <AdminField id="g-title" label="Título" :error="errors.collabTitle">
        <input id="g-title" v-model="form.collab.title" type="text" maxlength="80" placeholder="Galápagos" />
      </AdminField>
      <AdminField id="g-release" label="Lanzamiento" hint="Ej. 2027 o Marzo 2027">
        <input id="g-release" v-model="form.collab.release" type="text" maxlength="40" />
      </AdminField>
      <AdminField id="g-sub" label="Subtítulo" wide>
        <textarea id="g-sub" v-model="form.collab.subtitle" rows="3" maxlength="300"></textarea>
      </AdminField>
    </div>
  </AdminCard>
</template>

<style scoped lang="scss">
.site {
  &__row {
    @include flex(row, flex-start, flex-start, 0.9rem);
    flex-wrap: wrap;
  }

  &__hint {
    margin: 0 0 0.9rem;
    font-size: 0.8rem;
    color: $ink-muted;
  }

  textarea {
    resize: vertical;
  }
}
</style>
