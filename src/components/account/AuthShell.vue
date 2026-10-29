<script setup lang="ts">
import BrandLogo from '@/components/brand/BrandLogo.vue'
import { site } from '@/config/site'

defineProps<{ eyebrow: string; title: string; text: string }>()
</script>

<template>
  <section class="ashell">
    <div class="ashell__brand">
      <p class="ashell__eyebrow">[ {{ eyebrow }} ]</p>
      <h1 class="ashell__name"><BrandLogo :label="site.name" /></h1>
      <p class="ashell__tagline">{{ site.tagline }}</p>
    </div>
    <div class="ashell__panel">
      <div class="ashell__inner">
        <h2 class="ashell__title">{{ title }}</h2>
        <p class="ashell__text">{{ text }}</p>
        <slot />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.ashell {
  @include flex(column, stretch, flex-start);
  flex: 1;
  // El header de la tienda es fijo: el acceso arranca debajo para no taparlo.
  padding-top: var(--header-h);
  min-height: 100vh;
  background: $quartz;

  @include from('lg') {
    flex-direction: row;
  }

  &__brand {
    @include flex(column, flex-start, flex-end, 0.6rem);
    padding: 2.4rem 1.25rem 2.2rem;
    background: $basalt;
    color: $frost;

    @include from('lg') {
      flex: 0 0 44%;
      justify-content: center;
      padding: 4rem 3.5rem;
    }
  }

  &__eyebrow {
    @include eyebrow;
    color: $silver;
  }

  &__name {
    width: clamp(220px, 60vw, 380px);
    margin-block: 0.6rem 0.4rem;
    color: $gold;
  }

  &__tagline {
    font-family: $font-serif;
    font-style: italic;
    font-size: $text-xl;
    color: rgba($frost, 0.7);
  }

  &__panel {
    @include flex(column, stretch, center);
    flex: 1;
    padding: 2.2rem 1.25rem $space-xl;
    background: $quartz;

    @include from('lg') {
      align-items: center;
      padding: 3rem;
    }
  }

  &__inner {
    width: 100%;
    max-width: 420px;
  }

  &__title {
    @include display($display-sm);
  }

  &__text {
    margin: 0.5rem 0 1.6rem;
    color: $ink-soft;
    font-size: $text-sm;
  }
}
</style>

<style lang="scss">
// Formulario de acceso al panel.
.aform {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;

  &__field {
    display: flex;
    flex-direction: column;

    > input {
      min-height: 50px;
    }
  }

  &__error {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-radius: $radius-sm;
    background: $danger-bg;
    color: $danger;
    font-size: $text-sm;
  }

  &__submit {
    margin-top: 0.3rem;
  }

  &__alt {
    font-size: $text-sm;
    color: $ink-soft;

    a {
      color: $ink;
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }
}
</style>
