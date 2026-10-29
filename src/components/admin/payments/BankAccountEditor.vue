<script setup lang="ts">
import { ref } from 'vue'
import AdminSwitch from '../AdminSwitch.vue'
import type { BankAccount } from '@/types'

const props = defineProps<{ account: BankAccount; uploading: boolean }>()
const emit = defineEmits<{ upload: [file: File]; remove: [] }>()

const a = props.account
const fileInput = ref<HTMLInputElement | null>(null)
const id = (field: string) => `bank-${a.id}-${field}`

function onFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) emit('upload', file)
  if (fileInput.value) fileInput.value.value = ''
}
</script>

<template>
  <article class="bacc" :class="{ 'bacc--off': !a.isActive }">
    <header class="bacc__head">
      <div class="bacc__logo">
        <img v-if="a.logoUrl" :src="a.logoUrl" :alt="`Logo de ${a.bank || 'el banco'}`" />
        <i v-else class="fa-solid fa-building-columns" aria-hidden="true"></i>
      </div>
      <div class="bacc__logo-actions">
        <button type="button" class="bacc__link" :disabled="uploading" @click="fileInput?.click()">
          <i class="fa-solid fa-image" aria-hidden="true"></i>
          {{ uploading ? 'Subiendo…' : a.logoUrl ? 'Cambiar logo' : 'Subir logo' }}
        </button>
        <button v-if="a.logoUrl" type="button" class="bacc__link" @click="a.logoUrl = ''">
          Quitar logo
        </button>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="visually-hidden"
          tabindex="-1"
          @change="onFile"
        />
      </div>
      <AdminSwitch v-model="a.isActive" :label="a.isActive ? 'Activa' : 'Desactivada'" show-label />
    </header>

    <div class="bacc__grid">
      <div class="bacc__field">
        <label :for="id('bank')">Banco</label>
        <input
          :id="id('bank')"
          v-model="a.bank"
          type="text"
          required
          maxlength="60"
          placeholder="Banco Internacional"
        />
      </div>
      <div class="bacc__field">
        <label :for="id('type')">Tipo de cuenta</label>
        <select :id="id('type')" v-model="a.accountType">
          <option value="corriente">Corriente</option>
          <option value="ahorros">Ahorros</option>
        </select>
      </div>
      <div class="bacc__field">
        <label :for="id('number')">Número de cuenta</label>
        <input
          :id="id('number')"
          v-model="a.number"
          type="text"
          inputmode="numeric"
          required
          maxlength="30"
        />
      </div>
      <div class="bacc__field">
        <label :for="id('holder')">Titular</label>
        <input
          :id="id('holder')"
          v-model="a.holder"
          type="text"
          required
          maxlength="100"
          placeholder="Mayumy Chang"
        />
      </div>
      <div class="bacc__field">
        <label :for="id('doc')">RUC o cédula</label>
        <input
          :id="id('doc')"
          v-model="a.documentId"
          type="text"
          inputmode="numeric"
          maxlength="13"
        />
      </div>
      <div class="bacc__field">
        <label :for="id('email')">Correo para comprobantes</label>
        <input
          :id="id('email')"
          v-model="a.email"
          type="email"
          maxlength="160"
          placeholder="pagos@tucorreo.com"
        />
      </div>
    </div>

    <button type="button" class="bacc__remove" @click="emit('remove')">
      <i class="fa-solid fa-trash-can" aria-hidden="true"></i> Eliminar cuenta
    </button>
  </article>
</template>

<style scoped lang="scss">
.bacc {
  @include flex(column, stretch, flex-start, 0.9rem);
  padding: 1rem;
  border-radius: $radius-md;
  box-shadow: inset 0 0 0 1px $line;

  &--off {
    background: $quartz;
  }

  &__head {
    @include flex(row, center, flex-start, 0.8rem);
    flex-wrap: wrap;
  }

  &__logo {
    @include flex(row, center, center);
    width: 9rem;
    height: 3.2rem;
    padding: 0.4rem 0.6rem;
    border-radius: $radius-sm;
    background: $frost;
    box-shadow: inset 0 0 0 1px $line;
    color: $ink-soft;
    font-size: 1.3rem;

    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  }

  &__logo-actions {
    @include flex(column, flex-start, center, 0.1rem);
    flex: 1;
  }

  &__link {
    @include flex(row, center, flex-start, 0.4rem);
    min-height: 2rem;
    font-size: 0.85rem;
    color: $ink;
    @include focus-ring;

    &:hover {
      text-decoration: underline;
    }
  }

  &__grid {
    @include flex-cards(13rem, 0.8rem);
  }

  &__field {
    @include flex(column, stretch, flex-start, 0);
  }

  &__remove {
    @include flex(row, center, flex-start, 0.4rem);
    align-self: flex-start;
    min-height: 2.5rem;
    font-size: 0.85rem;
    color: $danger;
    @include focus-ring;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
