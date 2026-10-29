<script setup lang="ts">
import { computed } from 'vue'
import type { Lead, LeadStatus } from '@/types'
import { site } from '@/config/site'
import { LEAD_STATUS, LEAD_STATUS_ORDER } from './adminCatalog'
import { firstName, formatWhen, toWhatsappNumber } from './adminFormat'

const props = defineProps<{ lead: Lead; busy: boolean }>()
const emit = defineEmits<{ status: [value: LeadStatus] }>()

const hello = computed(() => {
  const name = firstName(props.lead.name)
  const base = name ? `Hola ${name}, ` : 'Hola, '
  return props.lead.kind === 'bespoke'
    ? `${base}te escribo de ${site.name} por tu solicitud de diseño a medida.`
    : `${base}te escribo de ${site.name}. Gracias por anotarte en la lista de Galápagos.`
})

const wa = computed(() => {
  const digits = toWhatsappNumber(props.lead.phone)
  return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(hello.value)}` : ''
})
const mail = computed(() =>
  props.lead.email
    ? `mailto:${props.lead.email}?subject=${encodeURIComponent(site.name)}&body=${encodeURIComponent(hello.value)}`
    : '',
)
</script>

<template>
  <article class="lead" :class="`lead--${lead.status}`">
    <header class="lead__head">
      <div class="lead__who">
        <h3 class="lead__name">{{ lead.name || 'Sin nombre' }}</h3>
        <time class="lead__when" :datetime="lead.createdAt">{{ formatWhen(lead.createdAt) }}</time>
      </div>
      <span class="lead__pill">{{ LEAD_STATUS[lead.status].label }}</span>
    </header>

    <p v-if="lead.budget" class="lead__budget"><span>Presupuesto</span> {{ lead.budget }}</p>
    <p v-if="lead.message" class="lead__msg">{{ lead.message }}</p>

    <div class="lead__contact">
      <a v-if="lead.email" :href="`mailto:${lead.email}`" class="lead__link">{{ lead.email }}</a>
      <a v-if="lead.phone" :href="`tel:${lead.phone}`" class="lead__link">{{ lead.phone }}</a>
    </div>

    <div class="lead__actions">
      <a v-if="wa" :href="wa" target="_blank" rel="noopener" class="lead__btn lead__btn--main">
        <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> WhatsApp
      </a>
      <a v-if="mail" :href="mail" class="lead__btn">
        <i class="fa-regular fa-envelope" aria-hidden="true"></i> Correo
      </a>
    </div>

    <div class="lead__status" role="radiogroup" :aria-label="`Estado de la solicitud de ${lead.name}`">
      <button
        v-for="s in LEAD_STATUS_ORDER"
        :key="s"
        type="button"
        role="radio"
        class="lead__state"
        :class="{ 'is-on': lead.status === s }"
        :aria-checked="lead.status === s"
        :disabled="busy"
        @click="emit('status', s)"
      >
        {{ LEAD_STATUS[s].label }}
      </button>
    </div>
  </article>
</template>

<style scoped lang="scss">
.lead {
  @include flex(column, stretch, flex-start, 0.8rem);
  height: 100%;
  padding: 1.1rem;
  background: $frost;
  border: 1px solid $line;
  border-radius: $radius-md;

  &--new {
    border-left: 3px solid $zafiro;
  }

  &--closed {
    background: $quartz;
  }

  &__head {
    @include flex(row, flex-start, space-between, 0.75rem);
  }

  &__who {
    min-width: 0;
  }

  &__name {
    font-family: $font-serif;
    font-weight: 400;
    font-size: 1.45rem;
    line-height: 1.1;
    overflow-wrap: anywhere;
  }

  &__when {
    font-family: $font-mono;
    font-size: 0.72rem;
    color: $ink-muted;
  }

  &__pill {
    @include eyebrow;
    flex-shrink: 0;
    padding: 0.15rem 0.5rem;
    border-radius: $radius-sm;
    background: $quartz-deep;
    font-size: 0.62rem;
  }

  &--new &__pill {
    background: $info-bg;
    color: $zafiro;
  }

  &__budget {
    font-size: 0.92rem;

    span {
      @include eyebrow;
      margin-right: 0.35rem;
    }
  }

  &__msg {
    padding: 0.7rem 0.85rem;
    border-radius: $radius-sm;
    background: $quartz;
    font-size: 0.92rem;
    line-height: 1.55;
    white-space: pre-line;
    overflow-wrap: anywhere;
  }

  &--closed &__msg {
    background: $frost;
  }

  &__contact {
    @include flex(column, flex-start, flex-start, 0.1rem);
    font-size: 0.88rem;
  }

  &__link {
    overflow-wrap: anywhere;
    color: $ink-soft;
    @include focus-ring;

    &:hover {
      color: $ink;
      text-decoration: underline;
    }
  }

  &__actions {
    @include flex(row, stretch, flex-start, 0.5rem);
    margin-top: auto;
  }

  &__btn {
    @include flex(row, center, center, 0.5rem);
    flex: 1;
    min-height: 2.75rem;
    border: 1px solid $basalt;
    border-radius: $radius-sm;
    font-size: 0.88rem;
    @include focus-ring;

    &:hover {
      background: $quartz;
    }

    &--main {
      background: $basalt;
      color: $frost;

      &:hover {
        background: $basalt-soft;
      }
    }
  }

  &__status {
    @include flex(row, stretch, flex-start, 0);
    border: 1px solid $line;
    border-radius: $radius-sm;
    overflow: hidden;
  }

  &__state {
    flex: 1;
    min-height: 2.5rem;
    font-size: 0.8rem;
    color: $ink-soft;
    @include focus-ring;

    & + & {
      border-left: 1px solid $line;
    }

    &:hover:not(.is-on) {
      background: $quartz;
    }

    &.is-on {
      background: $basalt;
      color: $frost;
    }

    &:disabled {
      opacity: 0.6;
    }
  }
}
</style>
