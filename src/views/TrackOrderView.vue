<script setup lang="ts">
import { computed } from 'vue'
import HeptagonMark from '@/components/brand/HeptagonMark.vue'
import CheckoutField from '@/components/checkout/CheckoutField.vue'
import { trackingCopy as t } from '@/components/tracking/trackingCopy'
import { useTrackLookup } from '@/composables/useTrackLookup'
import { useStoreConfig } from '@/composables/useStoreConfig'
import { site, whatsappLink } from '@/config/site'

const copy = site.tracking
const { code, email, loading, error, errors, submit } = useTrackLookup()
const { config } = useStoreConfig()
const helpUrl = computed(() => whatsappLink(t.helpMsg, config.value.contact.whatsapp))
</script>

<template>
  <section class="trk">
    <div class="trk__intro">
      <HeptagonMark class="trk__mark" size="56px" :stroke="1.2" />
      <p class="trk__eyebrow">[ {{ copy.eyebrow }} ]</p>
      <h1 class="trk__title">{{ copy.hand }}</h1>
      <p class="trk__text">{{ t.text }}</p>
    </div>

    <form class="trk__form" novalidate @submit.prevent="submit">
      <CheckoutField id="trk-code" :label="t.codeLabel" :error="errors.code" :hint="t.codeHint" v-slot="{ describedby, invalid }">
        <input
          id="trk-code"
          v-model="code"
          class="trk__code"
          type="text"
          autocomplete="off"
          autocapitalize="characters"
          spellcheck="false"
          :placeholder="t.codePlaceholder"
          :aria-invalid="invalid"
          :aria-describedby="describedby"
        />
      </CheckoutField>
      <CheckoutField id="trk-email" :label="t.emailLabel" :error="errors.email" v-slot="{ describedby, invalid }">
        <input id="trk-email" v-model="email" type="email" inputmode="email" autocomplete="email" autocapitalize="off" spellcheck="false" :aria-invalid="invalid" :aria-describedby="describedby" />
      </CheckoutField>
      <Transition name="rise">
        <p v-if="error" class="trk__error" role="alert">{{ error }}</p>
      </Transition>
      <button type="submit" class="btn btn--primary btn--block trk__submit" :disabled="loading">
        {{ loading ? t.searching : t.submit }}
      </button>
      <a :href="helpUrl" target="_blank" rel="noopener" class="trk__help link-line">
        <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ t.help }}
      </a>
    </form>
  </section>
</template>

<style scoped lang="scss">
.trk {
  @include container(1080px);
  @include flex(column, stretch, flex-start, 2.4rem);
  flex: 1;
  padding-top: calc(var(--header-h) + 4rem);
  padding-bottom: $space-section;

  @include from('lg') {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    gap: 4rem;
    padding-top: calc(var(--header-h) + 6rem);
  }

  &__intro {
    @include flex(column, flex-start, flex-start, 0.8rem);
    max-width: 30rem;
  }

  &__mark {
    color: var(--stone);
    margin-bottom: 1rem;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-lg);
  }

  &__text {
    color: $ink-soft;
    font-size: $text-lg;
  }

  &__form {
    @include flex(column, stretch, flex-start, 1.2rem);
    width: 100%;
    max-width: 30rem;
    padding: clamp(1.4rem, 4vw, 2.2rem);
    background: $frost;
    box-shadow: inset 0 0 0 1px $line;
  }

  &__code {
    font-family: $font-mono;
    letter-spacing: 0.12em;
    text-transform: uppercase;

    &::placeholder {
      color: $silver;
    }
  }

  &__error {
    padding: 0.9rem 1rem;
    border-left: 2px solid $danger;
    background: $danger-bg;
    color: $danger;
    font-size: $text-sm;
  }

  &__submit {
    min-height: 56px;
  }

  &__help {
    @include flex(row, center, center, 0.4rem);
    align-self: center;
    font-size: $text-sm;
    color: $ink-soft;
  }
}
</style>
