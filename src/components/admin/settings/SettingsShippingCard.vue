<script setup lang="ts">
import type { StoreSettingsForm } from '@/composables/useStoreSettings'
import AdminCard from '../AdminCard.vue'
import AdminField from '../AdminField.vue'
import AdminSwitch from '../AdminSwitch.vue'

defineProps<{ shipping: StoreSettingsForm['shipping']; errors: Record<string, string> }>()
</script>

<template>
  <AdminCard title="Envío Servientrega" icon="fa-solid fa-truck-fast">
    <p class="ship__intro">
      Se cobra solo en el checkout: tarifa local si la ciudad de la clienta es la ciudad base, nacional para el resto.
    </p>
    <div class="ship__row">
      <AdminField id="s-city" label="Ciudad base" :error="errors.baseCity" hint="Donde está el taller.">
        <input id="s-city" v-model="shipping.baseCity" type="text" placeholder="Guayaquil" />
      </AdminField>
      <AdminField id="s-local" label="Tarifa local (USD)" :error="errors.local">
        <input id="s-local" v-model="shipping.local" type="text" inputmode="decimal" placeholder="4.00" />
      </AdminField>
      <AdminField id="s-national" label="Tarifa nacional (USD)" :error="errors.national">
        <input id="s-national" v-model="shipping.national" type="text" inputmode="decimal" placeholder="7.00" />
      </AdminField>
      <AdminField id="s-free" label="Envío gratis desde (USD)" :error="errors.freeFrom" hint="0 = nunca es gratis.">
        <input id="s-free" v-model="shipping.freeFrom" type="text" inputmode="decimal" placeholder="0" />
      </AdminField>
    </div>

    <div class="ship__pickup">
      <AdminSwitch v-model="shipping.pickupEnabled" label="Retiro en taller" show-label />
      <p class="ship__hint">
        {{ shipping.pickupEnabled ? 'La clienta puede elegir retirar sin costo.' : 'Apagado: solo envío por Servientrega.' }}
      </p>
      <div v-if="shipping.pickupEnabled" class="ship__row">
        <AdminField id="s-pname" label="Nombre" :error="errors.pickupName">
          <input id="s-pname" v-model="shipping.pickup.name" type="text" placeholder="Taller Luminous Jewelers" />
        </AdminField>
        <AdminField id="s-paddress" label="Dirección" :error="errors.pickupAddress">
          <input id="s-paddress" v-model="shipping.pickup.address" type="text" />
        </AdminField>
        <AdminField id="s-pcity" label="Ciudad" :error="errors.pickupCity">
          <input id="s-pcity" v-model="shipping.pickup.city" type="text" />
        </AdminField>
        <AdminField id="s-phours" label="Horario" hint="Ej. Lun a Sáb · con cita">
          <input id="s-phours" v-model="shipping.pickup.hours" type="text" />
        </AdminField>
      </div>
    </div>
  </AdminCard>
</template>

<style scoped lang="scss">
.ship {
  &__intro,
  &__hint {
    margin: -0.4rem 0 1rem;
    font-size: 0.86rem;
    color: $ink-soft;
  }

  &__hint {
    margin: 0 0 0.9rem;
    font-size: 0.8rem;
    color: $ink-muted;
  }

  &__row {
    @include flex(row, flex-start, flex-start, 0.9rem);
    flex-wrap: wrap;
  }

  &__pickup {
    margin-top: 1.2rem;
    padding-top: 1rem;
    border-top: 1px solid $line;
  }
}
</style>
