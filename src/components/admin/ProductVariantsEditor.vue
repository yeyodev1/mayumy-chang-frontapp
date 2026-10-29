<script setup lang="ts">
import { emptyVariant, type VariantDraft } from '@/composables/useAdminProductForm'
import AdminCard from './AdminCard.vue'

const variants = defineModel<VariantDraft[]>({ required: true })
const compareAt = defineModel<string>('compareAt', { required: true })
defineProps<{ errors: Record<string, string> }>()

function add() {
  variants.value.push(emptyVariant())
}

function removeAt(i: number) {
  variants.value.splice(i, 1)
}
</script>

<template>
  <AdminCard title="Precio y stock" icon="fa-solid fa-tag">
    <p class="vars__intro">
      Casi todas las piezas son únicas: una variante "Única" con stock 1. Agrega más solo si la pieza viene en tallas o
      largos distintos.
    </p>
    <p v-if="errors.variants" class="vars__err" role="alert">{{ errors.variants }}</p>

    <ul class="vars">
      <li v-for="(v, i) in variants" :key="v.key" class="vars__row">
        <div class="vars__field vars__field--label">
          <label :for="`v-label-${v.key}`">Variante</label>
          <input
            :id="`v-label-${v.key}`"
            v-model="v.label"
            type="text"
            placeholder="Única"
            :aria-invalid="Boolean(errors[`variant-${i}-label`])"
          />
          <small v-if="errors[`variant-${i}-label`]" class="vars__err">{{ errors[`variant-${i}-label`] }}</small>
        </div>
        <div class="vars__field vars__field--price">
          <label :for="`v-price-${v.key}`">Precio (USD)</label>
          <div class="vars__money">
            <span aria-hidden="true">$</span>
            <input
              :id="`v-price-${v.key}`"
              v-model="v.price"
              type="text"
              inputmode="decimal"
              placeholder="0.00"
              :aria-invalid="Boolean(errors[`variant-${i}-price`])"
            />
          </div>
          <small v-if="errors[`variant-${i}-price`]" class="vars__err">{{ errors[`variant-${i}-price`] }}</small>
        </div>
        <div class="vars__field vars__field--stock">
          <label :for="`v-stock-${v.key}`">Stock</label>
          <input
            :id="`v-stock-${v.key}`"
            v-model.number="v.stock"
            type="number"
            inputmode="numeric"
            min="0"
            step="1"
            :aria-invalid="Boolean(errors[`variant-${i}-stock`])"
          />
          <small v-if="errors[`variant-${i}-stock`]" class="vars__err">{{ errors[`variant-${i}-stock`] }}</small>
        </div>
        <button
          type="button"
          class="vars__remove"
          :disabled="variants.length <= 1"
          :aria-label="`Quitar variante ${v.label || i + 1}`"
          @click="removeAt(i)"
        >
          <i class="fa-solid fa-trash-can" aria-hidden="true"></i>
        </button>
      </li>
    </ul>

    <button type="button" class="vars__add" @click="add">
      <i class="fa-solid fa-plus" aria-hidden="true"></i> Agregar variante
    </button>

    <div class="vars__compare">
      <label for="p-compare">Precio anterior (tachado)</label>
      <div class="vars__money">
        <span aria-hidden="true">$</span>
        <input
          id="p-compare"
          v-model="compareAt"
          type="text"
          inputmode="decimal"
          placeholder="Opcional"
          :aria-invalid="Boolean(errors.compareAt)"
        />
      </div>
      <small v-if="errors.compareAt" class="vars__err">{{ errors.compareAt }}</small>
      <small v-else class="vars__hint">Solo si la pieza está rebajada. Déjalo vacío si no.</small>
    </div>
  </AdminCard>
</template>

<style scoped lang="scss">
.vars {
  list-style: none;
  @include flex(column, stretch, flex-start, 0.6rem);

  &__intro {
    margin: -0.4rem 0 0.9rem;
    font-size: 0.86rem;
    color: $ink-soft;
  }

  &__row {
    @include flex(row, flex-end, flex-start, 0.6rem 0.7rem);
    flex-wrap: wrap;
    padding: 0.8rem;
    border-radius: $radius-sm;
    background: $quartz;
  }

  &__field {
    min-width: 0;

    &--label {
      flex: 1 1 100%;

      @include from('sm') {
        flex: 2 1 140px;
      }
    }

    &--price {
      flex: 1 1 110px;
    }

    &--stock {
      flex: 0 1 90px;
    }
  }

  &__money {
    position: relative;

    span {
      position: absolute;
      left: 0.8rem;
      top: 50%;
      transform: translateY(-50%);
      color: $ink-muted;
    }

    input {
      padding-left: 1.6rem;
      font-variant-numeric: tabular-nums;
    }
  }

  &__remove {
    @include flex(row, center, center);
    width: 2.75rem;
    height: 2.75rem;
    flex-shrink: 0;
    border-radius: $radius-sm;
    color: $ink-soft;
    @include focus-ring;

    &:hover:not(:disabled) {
      color: $danger;
      background: $danger-bg;
    }

    &:disabled {
      opacity: 0.3;
    }
  }

  &__add {
    @include flex(row, center, center, 0.5rem);
    margin-top: 0.8rem;
    min-height: 2.75rem;
    padding: 0 1.1rem;
    border-radius: $radius-sm;
    border: 1px dashed $ink-muted;
    font-size: 0.88rem;
    @include focus-ring;

    &:hover {
      border-color: $basalt;
    }
  }

  &__compare {
    max-width: 16rem;
    margin-top: 1.2rem;
    padding-top: 1.1rem;
    border-top: 1px solid $line;
  }

  &__hint {
    display: block;
    margin-top: 0.3rem;
    font-size: 0.78rem;
    color: $ink-muted;
  }

  &__err {
    display: block;
    margin-top: 0.25rem;
    font-size: 0.78rem;
    color: $danger;
  }
}

input[aria-invalid='true'] {
  border-color: $danger;
}
</style>
