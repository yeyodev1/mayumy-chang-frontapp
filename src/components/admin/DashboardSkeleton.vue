<template>
  <div class="dskel" role="status" aria-live="polite">
    <span class="visually-hidden">Cargando las cifras…</span>
    <div class="dskel__kpis" aria-hidden="true">
      <span class="skeleton dskel__hero"></span>
      <div class="dskel__tiles">
        <span v-for="n in 4" :key="n" class="skeleton dskel__tile"></span>
      </div>
    </div>
    <span class="skeleton dskel__chart" aria-hidden="true"></span>
    <div class="dskel__cards" aria-hidden="true">
      <span v-for="n in 3" :key="n" class="skeleton dskel__card"></span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dskel {
  @include flex(column, stretch, flex-start, 1rem);

  &__kpis {
    @include flex(column, stretch, flex-start, 0.8rem);

    @include from('xl') {
      flex-direction: row;
    }
  }

  &__hero {
    min-height: 9rem;
    border-radius: $radius-md;

    @include from('xl') {
      flex: 0 0 300px;
    }
  }

  &__tiles {
    @include flex(row, stretch, flex-start, 0.8rem);
    flex-wrap: wrap;
    flex: 1;
  }

  &__tile {
    flex: 1 1 calc(50% - 0.4rem);
    min-height: 8rem;
    border-radius: $radius-md;
  }

  &__chart {
    height: 18rem;
    border-radius: $radius-md;
  }

  &__cards {
    @include flex-cards(300px, 1rem);
  }

  &__card {
    min-height: 14rem;
    border-radius: $radius-md;
  }
}
</style>
