<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { usePaymentSettings } from '@/composables/usePaymentSettings'
import { PAYMENT_METHODS } from '@/utils/payments'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminCard from '@/components/admin/AdminCard.vue'
import AdminState from '@/components/admin/AdminState.vue'
import PaymentMethodEditor from '@/components/admin/payments/PaymentMethodEditor.vue'
import BankAccountEditor from '@/components/admin/payments/BankAccountEditor.vue'

const {
  form,
  loading,
  saving,
  uploading,
  error,
  loaded,
  cardLive,
  load,
  save,
  addAccount,
  removeAccount,
  uploadLogo,
} = usePaymentSettings()

onMounted(load)

const MAX_ACCOUNTS = 10
// Mismo chequeo que el server, para avisar antes de guardar.
const noActiveAccount = computed(() => !form.bankAccounts.some((a) => a.isActive))

// TODO coordinador: mover a site.ts (copy del panel admin)
function warningFor(m: string): string {
  if (m === 'card' && form.payments.card.enabled && cardLive.value === false) {
    return 'Falta conectar Payphone: la tarjeta no aparece en el checkout hasta que se configure el token. Pídeselo a soporte.'
  }
  if (m === 'card' && !form.payments.card.enabled) {
    return 'La tarjeta está apagada: las clientas solo pueden pagar por transferencia.'
  }
  if (m === 'transfer' && noActiveAccount.value) {
    return 'Activa al menos una cuenta abajo para recibir transferencias.'
  }
  return ''
}
</script>

<template>
  <section class="payset">
    <AdminPageHeader
      eyebrow="Tienda"
      title="Pagos"
      subtitle="Tarjeta con Payphone y transferencia: qué se ofrece en el checkout, si tiene recargo o descuento, y a qué cuentas transfieren tus clientas."
    />

    <AdminState :loading="loading && !loaded" :error="error?.message" shape="form" @retry="load" />

    <form v-if="loaded" class="payset__form" @submit.prevent="save">
      <AdminCard title="Formas de pago" icon="fa-solid fa-wallet">
        <PaymentMethodEditor
          v-for="m in PAYMENT_METHODS"
          :key="m"
          :method="m"
          :settings="form.payments[m]"
          :warning="warningFor(m)"
          :always-warn="m === 'card'"
        />
      </AdminCard>

      <AdminCard title="Cuentas para transferencias" icon="fa-solid fa-building-columns">
        <p class="payset__hint">
          Las cuentas activas salen en el checkout, en la confirmación del pedido y en el correo a la
          clienta. Desactiva una para ocultarla sin borrarla.
        </p>
        <div class="payset__accounts">
          <BankAccountEditor
            v-for="a in form.bankAccounts"
            :key="a.id"
            :account="a"
            :uploading="uploading === a.id"
            @upload="uploadLogo(a, $event)"
            @remove="removeAccount(a.id)"
          />
          <p v-if="!form.bankAccounts.length" class="payset__empty">Todavía no hay cuentas.</p>
        </div>
        <button
          v-if="form.bankAccounts.length < MAX_ACCOUNTS"
          type="button"
          class="btn btn--ghost payset__add"
          @click="addAccount"
        >
          <i class="fa-solid fa-plus" aria-hidden="true"></i> Agregar cuenta
        </button>
      </AdminCard>

      <div class="payset__foot">
        <button class="btn btn--primary" type="submit" :disabled="saving || Boolean(uploading)">
          {{ saving ? 'Guardando…' : 'Guardar cambios' }}
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped lang="scss">
.payset {
  &__form {
    @include flex(column, stretch, flex-start, 1.2rem);
    max-width: 52rem;
  }

  &__hint,
  &__empty {
    margin-bottom: 0.9rem;
    font-size: 0.88rem;
    color: $ink-soft;
  }

  &__accounts {
    @include flex(column, stretch, flex-start, 0.9rem);
  }

  &__add {
    margin-top: 0.9rem;
  }

  &__foot {
    @include flex(row, center, flex-end, 0.8rem);
  }
}
</style>
