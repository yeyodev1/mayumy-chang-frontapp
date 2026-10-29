<template>
  <div class="tsk" aria-hidden="true">
    <div class="tsk__row">
      <span v-for="n in 4" :key="n" class="skeleton tsk__step"></span>
    </div>
    <div class="tsk__cols">
      <div class="tsk__col">
        <div v-for="n in 2" :key="n" class="tsk__line">
          <span class="skeleton tsk__thumb"></span>
          <span class="tsk__text"><span class="skeleton tsk__bar"></span><span class="skeleton tsk__bar tsk__bar--short"></span></span>
        </div>
      </div>
      <div class="tsk__col">
        <span class="skeleton tsk__bar"></span>
        <span class="skeleton tsk__bar"></span>
        <span class="skeleton tsk__bar tsk__bar--short"></span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tsk {
  @include flex(column, stretch, flex-start, 1.6rem);

  &__row {
    @include flex(column, stretch, flex-start, 0.7rem);

    @include from('md') {
      flex-direction: row;
    }
  }

  &__step {
    flex: 1;
    height: 3.2rem;
  }

  &__cols {
    @include flex(column, stretch, flex-start, 1.6rem);

    @include from('md') {
      flex-direction: row;
    }
  }

  &__col {
    @include flex(column, stretch, flex-start, 0.8rem);
    flex: 1;
  }

  &__line {
    @include flex(row, center, flex-start, 0.9rem);
  }

  &__thumb {
    flex: 0 0 56px;
    aspect-ratio: 4 / 5;
  }

  &__text {
    @include flex(column, stretch, flex-start, 0.5rem);
    flex: 1;
  }

  &__bar {
    height: 1rem;

    &--short {
      width: 55%;
    }
  }
}
</style>
