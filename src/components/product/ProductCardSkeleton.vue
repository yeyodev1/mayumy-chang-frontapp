<template>
  <div class="pskel" aria-hidden="true">
    <div class="skeleton pskel__media"></div>
    <div class="skeleton pskel__line pskel__line--xs"></div>
    <div class="skeleton pskel__line"></div>
    <div class="skeleton pskel__line pskel__line--sm"></div>
  </div>
</template>

<style scoped lang="scss">
.pskel {
  @include flex(column, stretch, flex-start, 0.7rem);

  &__media {
    aspect-ratio: 4 / 5;
    margin-bottom: 0.3rem;
  }

  &__line {
    height: 1.1rem;
    width: 72%;

    &--xs {
      height: 0.6rem;
      width: 40%;
    }

    &--sm {
      height: 0.8rem;
      width: 24%;
    }
  }
}
</style>
