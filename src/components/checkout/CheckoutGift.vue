<script setup lang="ts">
import CheckoutSection from './CheckoutSection.vue'
import CheckoutField from './CheckoutField.vue'
import { checkoutCopy } from './checkoutCopy'
import { site } from '@/config/site'
import type { CheckoutErrors, CheckoutForm } from '@/composables/useCheckout'

const props = defineProps<{ form: CheckoutForm; errors: CheckoutErrors }>()
const emit = defineEmits<{ blur: [key: keyof CheckoutForm] }>()
const f = props.form
const c = site.checkout
</script>

<template>
  <CheckoutSection num="03" :title="checkoutCopy.giftSection">
    <label class="gift" :class="{ 'is-on': f.isGift }">
      <input v-model="f.isGift" class="gift__input" type="checkbox" role="switch" :aria-checked="f.isGift" />
      <span class="gift__track" aria-hidden="true"><span class="gift__thumb"></span></span>
      <span class="gift__body">
        <span class="gift__title">{{ c.gift }}</span>
        <span class="gift__text">{{ checkoutCopy.giftHint }}</span>
      </span>
    </label>

    <Transition name="rise">
      <CheckoutField v-if="f.isGift" id="co-giftNote" :label="c.giftNote" :error="errors.giftNote" :hint="`${f.giftNote.length}/240`" v-slot="{ describedby, invalid }">
        <textarea id="co-giftNote" v-model="f.giftNote" rows="3" maxlength="240" class="gift__note" :placeholder="c.giftNotePlaceholder" :aria-invalid="invalid" :aria-describedby="describedby" @blur="emit('blur', 'giftNote')"></textarea>
      </CheckoutField>
    </Transition>

    <CheckoutField id="co-notes" :label="c.notes.replace(' (opcional)', '')" optional>
      <textarea id="co-notes" v-model="f.notes" rows="2" :placeholder="checkoutCopy.fields.notesPlaceholder"></textarea>
    </CheckoutField>
  </CheckoutSection>
</template>

<style scoped lang="scss">
.gift {
  @include flex(row, center, flex-start, 1rem);
  position: relative;
  margin: 0;
  padding: 1rem 1.1rem;
  border-radius: $radius-sm;
  background: $frost;
  box-shadow: inset 0 0 0 1px $line;
  font-family: $font-principal;
  font-size: inherit;
  letter-spacing: 0;
  text-transform: none;
  color: $ink;
  cursor: pointer;
  transition: box-shadow 0.35s $ease;

  &.is-on {
    box-shadow: inset 0 0 0 1.5px $basalt;
  }

  &:has(input:focus-visible) {
    outline: 2px solid $ink;
    outline-offset: 3px;
  }

  &__input {
    position: absolute;
    opacity: 0;
    width: 1px;
    height: 1px;
  }

  &__track {
    flex: 0 0 auto;
    position: relative;
    width: 42px;
    height: 24px;
    border-radius: $radius-pill;
    background: $quartz-deep;
    box-shadow: inset 0 0 0 1px $line;
    transition: background-color 0.35s $ease;
  }

  &__thumb {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: $frost;
    box-shadow: $shadow-sm;
    transition: transform 0.45s $ease;
  }

  &.is-on &__track {
    background: $basalt;
  }

  &.is-on &__thumb {
    transform: translateX(18px);
  }

  &__body {
    @include flex(column, flex-start, flex-start, 0.1rem);
  }

  &__title {
    font-family: $font-serif;
    font-size: $text-lg;
    line-height: 1.1;
  }

  &__text {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__note {
    font-family: $font-serif;
    font-style: italic;
    font-size: 1.15rem;
  }
}
</style>
