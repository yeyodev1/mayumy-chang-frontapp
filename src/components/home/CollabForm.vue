<script setup lang="ts">
import { reactive, ref } from 'vue'
import { site } from '@/config/site'
import { leadService } from '@/services/lead.service'
import type { ApiError } from '@/types'

const copy = site.home.collab
const form = reactive({ name: '', email: '' })
const sending = ref(false)
const done = ref(false)
const error = ref('')

async function submit() {
  error.value = ''
  if (!form.name.trim()) return (error.value = 'Escribe tu nombre.')
  if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return (error.value = 'Revisa tu correo: falta algo.')
  sending.value = true
  try {
    await leadService.create({ kind: 'waitlist', name: form.name.trim(), email: form.email.trim() })
    done.value = true
  } catch (e) {
    error.value = (e as ApiError).message
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <div class="cform">
    <Transition name="rise" mode="out-in">
      <p v-if="done" key="done" class="cform__done" role="status">
        <i class="fa-solid fa-check" aria-hidden="true"></i> {{ copy.done }}
      </p>
      <form v-else key="form" class="cform__form" novalidate @submit.prevent="submit">
        <div class="cform__field">
          <label for="collab-name">{{ copy.name }}</label>
          <input id="collab-name" v-model="form.name" type="text" autocomplete="name" required />
        </div>
        <div class="cform__field">
          <label for="collab-email">{{ copy.email }}</label>
          <input id="collab-email" v-model="form.email" type="email" autocomplete="email" inputmode="email" required />
        </div>
        <button type="submit" class="btn btn--light" :disabled="sending">
          {{ sending ? copy.sending : copy.submit }}
        </button>
        <p v-if="error" class="cform__error" role="alert">{{ error }}</p>
      </form>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.cform {
  width: 100%;

  &__form {
    @include flex(column, stretch, flex-start, 0.9rem);

    @include from('md') {
      flex-direction: row;
      align-items: flex-end;
      flex-wrap: wrap;
    }
  }

  &__field {
    flex: 1 1 200px;

    label {
      color: rgba($quartz, 0.65);
    }

    input {
      background: transparent;
      border: 0;
      border-bottom: 1px solid rgba($quartz, 0.4);
      border-radius: 0;
      color: $quartz;
      padding-inline: 0;

      &:focus {
        border-bottom-color: $quartz;
        box-shadow: none;
      }
    }
  }

  &__error {
    width: 100%;
    font-size: $text-sm;
    color: #ffb4a6;
  }

  &__done {
    @include flex(row, center, flex-start, 0.7rem);
    font-family: $font-serif;
    font-size: $text-xl;
    color: $quartz;
  }
}
</style>
