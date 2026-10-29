<script setup lang="ts">
// Cantidad en la bolsa: solo aparece cuando hay más de una pieza disponible.
const props = defineProps<{ max: number; label: string }>()
const model = defineModel<number>({ required: true })

function step(delta: number) {
  model.value = Math.min(props.max, Math.max(1, model.value + delta))
}
</script>

<template>
  <div class="stepper" role="group" :aria-label="label">
    <button type="button" class="stepper__btn" :disabled="model <= 1" aria-label="Quitar una" @click="step(-1)">
      <i class="fa-solid fa-minus" aria-hidden="true"></i>
    </button>
    <output class="stepper__value" aria-live="polite">{{ model }}</output>
    <button type="button" class="stepper__btn" :disabled="model >= max" aria-label="Agregar una" @click="step(1)">
      <i class="fa-solid fa-plus" aria-hidden="true"></i>
    </button>
  </div>
</template>

<style scoped lang="scss">
.stepper {
  @include flex(row, center, flex-start);
  box-shadow: inset 0 0 0 1px $line;

  &__btn {
    @include flex(row, center, center);
    width: 36px;
    height: 36px;
    font-size: 0.65rem;
    color: $ink;
    transition: background-color 0.3s $ease;
    @include focus-ring($ink);

    &:hover:not(:disabled) {
      background: $quartz-deep;
    }

    &:disabled {
      color: $silver;
      cursor: default;
    }
  }

  &__value {
    min-width: 1.8rem;
    text-align: center;
    font-family: $font-mono;
    font-size: $text-sm;
  }
}
</style>
