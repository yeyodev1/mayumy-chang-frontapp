<script setup lang="ts">
import { ref } from 'vue'
import { site, fill } from '@/config/site'
import { useReveal } from '@/composables/useReveal'
import { useStoreConfig } from '@/composables/useStoreConfig'

const root = ref<HTMLElement | null>(null)
const { shippingCopy } = useStoreConfig()
useReveal(root)
const d = site.home.designer
</script>

<template>
  <section ref="root" class="dsg" aria-labelledby="dsg-title">
    <div class="dsg__inner">
      <figure class="dsg__media" data-reveal-mask>
        <video
          src="/video/zafiro-puesto.mp4"
          poster="/video/zafiro-puesto.webp"
          muted
          loop
          playsinline
          autoplay
          preload="none"
          aria-hidden="true"
        ></video>
      </figure>

      <div class="dsg__copy">
        <p class="dsg__eyebrow" data-reveal>[ {{ d.eyebrow }} ]</p>
        <h2 id="dsg-title" class="dsg__title" data-split>{{ d.title }}</h2>
        <p v-for="p in d.text" :key="p" class="dsg__text" data-reveal>{{ p }}</p>
        <p class="dsg__sign" data-reveal>
          <span class="dsg__name">{{ d.signature }}</span>
          <span class="dsg__role">{{ d.role }}</span>
        </p>
      </div>
    </div>

    <ul class="dsg__service">
      <li v-for="item in site.home.service" :key="item.title" data-reveal>
        <i :class="['fa-solid', item.icon]" aria-hidden="true"></i>
        <p class="dsg__service-title">{{ item.title }}</p>
        <p class="dsg__service-text">{{ fill(item.text, shippingCopy) }}</p>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.dsg {
  padding: $space-section 1.25rem $space-xl;

  @include from('md') {
    padding-inline: 2rem;
  }

  &__inner {
    @include flex(column, stretch, flex-start, $space-lg);

    @include from('lg') {
      flex-direction: row;
      align-items: center;
      gap: clamp(3rem, 7vw, 8rem);
    }
  }

  &__media {
    aspect-ratio: 3 / 4;
    overflow: hidden;
    background: $quartz-deep;

    @include from('lg') {
      flex: 0 0 38%;
    }

    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__copy {
    flex: 1;
    @include flex(column, flex-start, flex-start, 1.2rem);
    max-width: 40rem;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include caps(clamp(5rem, 2.5rem + 10vw, 12rem));
    line-height: 0.92;
  }

  &__text {
    font-size: $text-lg;
    color: $ink-soft;
    line-height: 1.55;
  }

  &__sign {
    @include flex(column, flex-start, flex-start, 0.2rem);
    margin-top: 0.8rem;
  }

  &__name {
    font-family: $font-serif;
    font-style: italic;
    font-size: $display-sm;
  }

  &__role {
    @include eyebrow;
  }

  &__service {
    list-style: none;
    @include flex-cards(220px, 0);
    margin-top: $space-section;
    border-top: 1px solid $ink;

    li {
      @include flex(column, flex-start, flex-start, 0.45rem);
      padding: 1.6rem 1.2rem 0.8rem 0;

      i {
        font-size: 1.1rem;
        margin-bottom: 0.4rem;
        color: var(--stone);
        transition: color 0.8s ease;
      }
    }
  }

  &__service-title {
    font-family: $font-serif;
    font-size: $text-xl;
  }

  &__service-text {
    font-size: $text-sm;
    color: $ink-soft;
  }
}
</style>
