<script setup lang="ts">
import { ref } from 'vue'
import { site } from '@/config/site'
import { useBooking } from '@/composables/useBooking'
import { useReveal } from '@/composables/useReveal'
import BespokeSteps from '@/components/home/BespokeSteps.vue'
import BespokeForm from '@/components/home/BespokeForm.vue'

const root = ref<HTMLElement | null>(null)
const { href, label } = useBooking()
useReveal(root)
</script>

<template>
  <div ref="root" class="bes">
    <section class="bes__hero">
      <video
        class="bes__video"
        src="/video/atelier.mp4"
        poster="/video/atelier.webp"
        muted
        loop
        playsinline
        autoplay
        aria-hidden="true"
        data-parallax="0.1"
      ></video>
      <div class="bes__hero-copy">
        <p class="bes__eyebrow">[ {{ site.bespoke.eyebrow }} ]</p>
        <h1 class="bes__title" data-split>{{ site.bespoke.title }}</h1>
        <p class="bes__text" data-reveal>{{ site.bespoke.text }}</p>
        <a :href="href" target="_blank" rel="noopener" class="btn btn--light" data-reveal>
          {{ label }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </a>
      </div>
    </section>

    <section class="bes__body">
      <div class="bes__steps">
        <p class="bes__label" data-reveal>[ Cómo funciona ]</p>
        <BespokeSteps tone="light" />
        <a :href="href" target="_blank" rel="noopener" class="btn btn--primary bes__book" data-reveal>
          {{ label }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </a>
      </div>
      <div class="bes__form" data-reveal>
        <BespokeForm />
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.bes {
  &__hero {
    position: relative;
    min-height: 100vh;
    min-height: 100svh;
    background: $basalt;
    color: $quartz;
    overflow: hidden;
    @include flex(column, flex-start, flex-end);
    padding: calc(var(--header-h) + 3rem) 1.25rem $space-xl;

    @include from('md') {
      padding-inline: 2rem;
    }

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba($basalt, 0.45), rgba($basalt, 0.2) 40%, rgba($basalt, 0.85));
    }
  }

  &__video {
    position: absolute;
    inset: -8% 0;
    width: 100%;
    height: 116%;
    object-fit: cover;
  }

  &__hero-copy {
    position: relative;
    z-index: 1;
    @include flex(column, flex-start, flex-start, 1.3rem);
    max-width: 48rem;
  }

  &__eyebrow {
    @include eyebrow;
    color: $silver;
  }

  &__title {
    @include display(clamp(3rem, 1.8rem + 5vw, 7rem));
  }

  &__text {
    font-size: $text-lg;
    color: rgba($quartz, 0.8);
    max-width: 46ch;
  }

  &__body {
    @include flex(column, stretch, flex-start, $space-xl);
    padding: $space-section 1.25rem;

    @include from('md') {
      padding-inline: 2rem;
    }

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
      gap: clamp(3rem, 7vw, 8rem);
    }
  }

  &__steps {
    flex: 1;
    @include flex(column, stretch, flex-start, 1.2rem);
  }

  &__label {
    @include eyebrow;
  }

  &__book {
    align-self: flex-start;
    margin-top: 0.6rem;
  }

  &__form {
    flex: 1;
    padding: clamp(1.5rem, 3vw, 2.5rem);
    background: $frost;
    border: 1px solid $line;
  }
}
</style>
