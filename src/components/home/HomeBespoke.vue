<script setup lang="ts">
import { ref } from 'vue'
import { site } from '@/config/site'
import { useBooking } from '@/composables/useBooking'
import { useReveal } from '@/composables/useReveal'
import BespokeSteps from './BespokeSteps.vue'

const root = ref<HTMLElement | null>(null)
const { href, label } = useBooking()
useReveal(root)
</script>

<template>
  <section ref="root" class="hbes" aria-labelledby="hbes-title">
    <div class="hbes__media" data-reveal-mask>
      <video
        src="/video/atelier.mp4"
        poster="/video/atelier.webp"
        muted
        loop
        playsinline
        autoplay
        preload="none"
        aria-hidden="true"
        data-parallax="0.08"
      ></video>
    </div>

    <div class="hbes__copy">
      <p class="hbes__eyebrow" data-reveal>[ {{ site.bespoke.eyebrow }} ]</p>
      <h2 id="hbes-title" class="hbes__title" data-split>{{ site.bespoke.title }}</h2>
      <p class="hbes__text" data-reveal>{{ site.bespoke.text }}</p>
      <BespokeSteps />
      <div class="hbes__ctas" data-reveal>
        <a :href="href" target="_blank" rel="noopener" class="btn btn--light">
          {{ label }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </a>
        <RouterLink to="/a-medida" class="btn btn--ghost-light">Cómo funciona</RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hbes {
  background: $basalt;
  color: $quartz;
  @include flex(column, stretch);

  @include from('lg') {
    flex-direction: row;
    min-height: 100vh;
  }

  &__media {
    position: relative;
    overflow: hidden;
    aspect-ratio: 16 / 11;

    @include from('lg') {
      flex: 0 0 55%;
      aspect-ratio: auto;
    }

    video {
      position: absolute;
      inset: -10% 0;
      width: 100%;
      height: 120%;
      object-fit: cover;
    }
  }

  &__copy {
    flex: 1;
    @include flex(column, flex-start, center, 1.4rem);
    padding: $space-xl 1.25rem;

    @include from('md') {
      padding-inline: 2rem;
    }

    @include from('lg') {
      padding: $space-xl clamp(2rem, 4vw, 4.5rem);
    }
  }

  &__eyebrow {
    @include eyebrow;
    color: $silver;
  }

  &__title {
    @include display(clamp(2.6rem, 1.6rem + 4vw, 5.4rem));
  }

  &__text {
    color: rgba($quartz, 0.75);
    max-width: 44ch;
  }

  &__ctas {
    @include flex(row, center, flex-start, 0.6rem);
    flex-wrap: wrap;
    margin-top: 0.6rem;
  }
}
</style>
