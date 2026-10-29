<script setup lang="ts">
import { reactive, ref } from 'vue'
import { site } from '@/config/site'
import { leadService } from '@/services/lead.service'
import type { ApiError } from '@/types'

const copy = site.bespoke
const form = reactive({ name: '', email: '', phone: '', message: '', budget: '' })
const sending = ref(false)
const done = ref(false)
const error = ref('')

async function submit() {
  error.value = ''
  if (!form.name.trim()) return (error.value = 'Escribe tu nombre.')
  if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return (error.value = 'Revisa tu correo: falta algo.')
  sending.value = true
  try {
    await leadService.create({
      kind: 'bespoke',
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      message: form.message.trim(),
      budget: form.budget,
    })
    done.value = true
  } catch (e) {
    error.value = (e as ApiError).message
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <div class="bform">
    <p class="bform__title">{{ copy.formTitle }}</p>
    <p class="bform__text">{{ copy.formText }}</p>
    <Transition name="rise" mode="out-in">
      <p v-if="done" key="done" class="bform__done" role="status">
        <i class="fa-solid fa-check" aria-hidden="true"></i> {{ copy.done }}
      </p>
      <form v-else key="form" class="bform__form" novalidate @submit.prevent="submit">
        <div class="bform__row">
          <div class="bform__field">
            <label for="bk-name">{{ copy.name }}</label>
            <input id="bk-name" v-model="form.name" type="text" autocomplete="name" required />
          </div>
          <div class="bform__field">
            <label for="bk-phone">{{ copy.phone }}</label>
            <input id="bk-phone" v-model="form.phone" type="tel" autocomplete="tel" inputmode="tel" />
          </div>
        </div>
        <div class="bform__field">
          <label for="bk-email">{{ copy.email }}</label>
          <input id="bk-email" v-model="form.email" type="email" autocomplete="email" inputmode="email" required />
        </div>
        <div class="bform__field">
          <label for="bk-idea">{{ copy.idea }}</label>
          <textarea id="bk-idea" v-model="form.message" rows="3" :placeholder="copy.ideaPlaceholder"></textarea>
        </div>
        <fieldset class="bform__budget">
          <legend>{{ copy.budget }}</legend>
          <label v-for="b in copy.budgets" :key="b" class="bform__pill" :class="{ 'is-on': form.budget === b }">
            <input v-model="form.budget" type="radio" name="budget" :value="b" class="visually-hidden" />
            {{ b }}
          </label>
        </fieldset>
        <button type="submit" class="btn btn--primary" :disabled="sending">{{ sending ? copy.sending : copy.submit }}</button>
        <p v-if="error" class="bform__error" role="alert">{{ error }}</p>
      </form>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.bform {
  @include flex(column, stretch, flex-start, 0.8rem);

  &__title {
    @include display($display-sm);
  }

  &__text {
    color: $ink-soft;
    margin-bottom: 0.6rem;
  }

  &__form {
    @include flex(column, stretch, flex-start, 1rem);
  }

  &__row {
    @include flex(column, stretch, flex-start, 1rem);

    @include from('md') {
      flex-direction: row;

      > * {
        flex: 1;
      }
    }
  }

  &__budget {
    border: 0;
    @include flex(row, center, flex-start, 0.4rem);
    flex-wrap: wrap;

    legend {
      font-family: $font-mono;
      font-size: $text-xs;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: $ink-soft;
      margin-bottom: 0.5rem;
    }
  }

  &__pill {
    margin: 0;
    cursor: pointer;
    font-family: $font-mono;
    font-size: 0.72rem;
    text-transform: none;
    letter-spacing: 0.02em;
    color: $ink;
    padding: 0.6rem 0.9rem;
    border: 1px solid $line;
    border-radius: $radius-pill;
    transition: background-color 0.3s ease, color 0.3s ease;

    &.is-on {
      background: $basalt;
      border-color: $basalt;
      color: $frost;
    }

    &:has(input:focus-visible) {
      outline: 2px solid $ink;
      outline-offset: 2px;
    }
  }

  &__error {
    color: $danger;
    font-size: $text-sm;
  }

  &__done {
    @include flex(row, center, flex-start, 0.7rem);
    font-family: $font-serif;
    font-size: $text-xl;
  }
}
</style>
