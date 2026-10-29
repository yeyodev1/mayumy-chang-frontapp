<script setup lang="ts">
import { site } from '@/config/site'

const credit = site.legal.credit
</script>

<template>
  <div class="credit">
    <span class="credit__text">{{ credit.made }}</span>
    <i class="fa-solid fa-gem credit__paw" aria-hidden="true"></i>
    <span class="credit__text">{{ credit.by }}</span>
    <a :href="credit.agency.url" target="_blank" rel="noopener" class="credit__brand">
      {{ credit.agency.name }}
      <span class="visually-hidden">(se abre en otra pestaña)</span>
    </a>
    <span class="credit__dot" aria-hidden="true">·</span>
    <a :href="credit.author.url" target="_blank" rel="noopener" class="credit__dev">
      <span class="credit__dev-name">{{ credit.author.name }}</span>
      <span class="visually-hidden">(se abre en otra pestaña)</span>
    </a>
    <a
      :href="credit.author.instagram"
      target="_blank"
      rel="noopener"
      class="credit__ig"
      :aria-label="`Instagram de ${credit.author.name}`"
    >
      <i class="fa-brands fa-instagram" aria-hidden="true"></i>
    </a>
  </div>
</template>

<style scoped lang="scss">
@use 'sass:color';

.credit {
  // Por encima del nombre gigante del footer.
  position: relative;
  z-index: 2;
  @include flex(row, center, flex-start, 0.4rem);
  flex-wrap: wrap;
  padding: 0.4rem 0.5rem 0.4rem 0.9rem;
  border-radius: $radius-pill;
  border: 1px solid rgba($lilac, 0.22);
  background: color.mix($cocoa, $lilac, 92%);
  color: rgba($lilac, 0.8);
  font-size: $text-xs;
  transition: border-color 0.3s ease, background 0.3s ease;

  @include from('md') {
    margin-left: auto;
  }

  &:hover,
  &:focus-within {
    border-color: rgba($peach, 0.6);
    background: color.mix($cocoa, $lilac, 86%);
  }

  &__paw {
    color: $tangerine;
    transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  &:hover &__paw,
  &:focus-within &__paw {
    transform: rotate(-25deg) scale(1.35);
  }

  &__brand {
    font-family: $font-display;
    font-size: 1.05rem;
    line-height: 1;
    color: $peach;
    transition: color 0.25s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    @include focus-ring($mustard);

    &:hover {
      color: $mustard;
      transform: translateY(-2px) rotate(-3deg);
    }
  }

  &__dot {
    color: rgba($lilac, 0.4);
  }

  // Nombre con brillo que barre al pasar el cursor.
  &__dev {
    font-family: $font-heading;
    font-size: 0.82rem;
    @include focus-ring($mustard);
  }

  &__dev-name {
    background: linear-gradient(
      100deg,
      $lilac 0%,
      $lilac 40%,
      $mustard 50%,
      $lilac 60%,
      $lilac 100%
    );
    background-size: 250% 100%;
    background-position: 100% 0;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    transition: background-position 0.9s ease;
  }

  &__dev:hover &__dev-name,
  &__dev:focus-visible &__dev-name {
    background-position: 0 0;
  }

  &__ig {
    @include flex(row, center, center);
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    color: $cocoa;
    background: $lilac;
    font-size: 0.95rem;
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.3s ease;
    @include focus-ring($mustard);

    &:hover {
      transform: rotate(12deg) scale(1.12);
      background: linear-gradient(45deg, $mustard, $tangerine 45%, color.adjust($tangerine, $hue: -25deg) 70%, $periwinkle);
      color: $paper;
    }
  }

  @include reduced-motion {
    &__dev-name {
      background: none;
      color: $lilac;
    }
  }
}
</style>
