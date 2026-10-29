<script setup lang="ts">
import { ref } from 'vue'
import { site } from '@/config/site'
import type { BankAccount } from '@/types'

defineProps<{ account: Omit<BankAccount, 'isActive'> }>()
const copy = site.checkout.bank
const copied = ref(false)

// En el celular copiar el número evita errores al pegarlo en la app del banco.
async function copyNumber(number: string) {
  try {
    await navigator.clipboard.writeText(number)
    copied.value = true
    setTimeout(() => (copied.value = false), 1800)
  } catch {
    /* sin permiso de portapapeles: el número igual queda seleccionable */
  }
}
</script>

<template>
  <article class="bank">
    <header class="bank__head">
      <img v-if="account.logoUrl" :src="account.logoUrl" :alt="account.bank" class="bank__logo" height="24" />
      <span v-else class="bank__name">{{ account.bank }}</span>
      <span class="bank__type">{{ copy.accountType[account.accountType] }}</span>
    </header>
    <div class="bank__number">
      <span class="bank__label">{{ copy.number }}</span>
      <strong class="bank__digits">{{ account.number }}</strong>
      <button type="button" class="bank__copy" @click="copyNumber(account.number)">
        <i :class="copied ? 'fa-solid fa-check' : 'fa-regular fa-copy'" aria-hidden="true"></i>
        <span aria-live="polite">{{ copied ? copy.copied : copy.copy }}</span>
      </button>
    </div>
    <dl class="bank__list">
      <div><dt>{{ copy.holder }}</dt><dd>{{ account.holder }}</dd></div>
      <div v-if="account.documentId">
        <dt>{{ account.documentId.length === 13 ? copy.ruc : copy.cedula }}</dt>
        <dd>{{ account.documentId }}</dd>
      </div>
      <div v-if="account.email">
        <dt>{{ copy.email }}</dt>
        <dd><a :href="`mailto:${account.email}`">{{ account.email }}</a></dd>
      </div>
    </dl>
  </article>
</template>

<style scoped lang="scss">
.bank {
  @include flex(column, stretch, flex-start, 0.8rem);
  padding: 1.1rem 1.2rem;
  background: $frost;
  box-shadow: inset 0 0 0 1px $line;
  border-radius: $radius-sm;
  text-align: left;

  &__head {
    @include flex(row, center, space-between, 0.8rem);
    flex-wrap: wrap;
  }

  &__logo {
    height: 24px;
    width: auto;
    max-width: 10rem;
    object-fit: contain;
  }

  &__name {
    font-family: $font-serif;
    font-size: $text-lg;
  }

  &__type {
    @include eyebrow;
  }

  &__number {
    @include flex(row, center, flex-start, 0.3rem 0.8rem);
    flex-wrap: wrap;
    padding: 0.8rem 0.9rem;
    background: $quartz-deep;
  }

  &__label {
    @include eyebrow;
    flex-basis: 100%;
  }

  &__digits {
    font-family: $font-mono;
    font-weight: 500;
    font-size: $text-lg;
    letter-spacing: 0.06em;
    user-select: all;
  }

  &__copy {
    @include flex(row, center, center, 0.4rem);
    @include eyebrow;
    min-height: 2.5rem;
    margin-left: auto;
    padding: 0 0.9rem;
    background: $frost;
    color: $ink;
    @include focus-ring($ink);
  }

  &__list {
    @include flex(column, stretch, flex-start, 0.35rem);
    font-size: $text-sm;

    div {
      @include flex(row, baseline, space-between, 0 0.8rem);
      flex-wrap: wrap;
    }

    dt {
      color: $ink-soft;
    }

    dd {
      margin-left: auto;
      text-align: right;
      overflow-wrap: anywhere;
    }

    a {
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }
}
</style>
