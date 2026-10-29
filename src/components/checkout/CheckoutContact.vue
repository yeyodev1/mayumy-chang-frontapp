<script setup lang="ts">
import CheckoutSection from './CheckoutSection.vue'
import CheckoutField from './CheckoutField.vue'
import { site } from '@/config/site'
import { checkoutCopy } from './checkoutCopy'
import type { CheckoutErrors, CheckoutForm } from '@/composables/useCheckout'

// El form es reactivo y vive en useCheckout; acá solo se pinta y se edita.
const props = defineProps<{ form: CheckoutForm; errors: CheckoutErrors }>()
const emit = defineEmits<{ blur: [key: keyof CheckoutForm] }>()
const f = props.form
const t = checkoutCopy.fields
</script>

<template>
  <CheckoutSection num="01" :title="site.checkout.contact">
    <div class="csec__row">
      <CheckoutField id="co-name" :label="t.name" :error="errors.name" v-slot="{ describedby, invalid }">
        <input id="co-name" v-model="f.name" type="text" autocomplete="name" :aria-invalid="invalid" :aria-describedby="describedby" @blur="emit('blur', 'name')" />
      </CheckoutField>
      <CheckoutField id="co-email" :label="t.email" :error="errors.email" :hint="t.emailHint" v-slot="{ describedby, invalid }">
        <input id="co-email" v-model="f.email" type="email" autocomplete="email" inputmode="email" autocapitalize="off" spellcheck="false" :aria-invalid="invalid" :aria-describedby="describedby" @blur="emit('blur', 'email')" />
      </CheckoutField>
    </div>
    <div class="csec__row">
      <CheckoutField id="co-phone" :label="t.phone" :error="errors.phone" :hint="t.phoneHint" v-slot="{ describedby, invalid }">
        <input id="co-phone" v-model="f.phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="0991234567" :aria-invalid="invalid" :aria-describedby="describedby" @blur="emit('blur', 'phone')" />
      </CheckoutField>
      <CheckoutField id="co-documentId" :label="t.documentId" :error="errors.documentId" :hint="t.documentHint" v-slot="{ describedby, invalid }">
        <input id="co-documentId" v-model="f.documentId" type="text" inputmode="numeric" maxlength="15" :aria-invalid="invalid" :aria-describedby="describedby" @blur="emit('blur', 'documentId')" />
      </CheckoutField>
    </div>
  </CheckoutSection>
</template>
