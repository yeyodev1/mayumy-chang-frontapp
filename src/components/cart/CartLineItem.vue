<script setup lang="ts">
import { computed } from 'vue'
import BagStepper from './BagStepper.vue'
import { clearSoldOut, soldOutKeys } from './bagAlerts'
import { useCartStore, type CartLine } from '@/stores/cart'
import { formatCents } from '@/utils/format'
import { cldUrl } from '@/utils/cloudinary'
import { site } from '@/config/site'

const props = defineProps<{ line: CartLine }>()
const emit = defineEmits<{ navigate: [] }>()
const cart = useCartStore()
const copy = site.bag

const unique = computed(() => (props.line.maxQuantity || 1) <= 1)
// "Única" es la variante por defecto: no aporta nada repetirla.
const variant = computed(() => {
  const label = props.line.variantLabel && props.line.variantLabel !== 'Única' ? props.line.variantLabel : ''
  return [label, unique.value ? copy.uniqueNote : ''].filter(Boolean).join(' · ')
})
const soldOut = computed(() => soldOutKeys.value.includes(props.line.key))
const qty = computed({
  get: () => props.line.quantity,
  set: (value: number) => cart.setQuantity(props.line.key, value),
})
const to = computed(() => ({ name: 'Product', params: { slug: props.line.slug } }))

function remove() {
  cart.remove(props.line.key)
  clearSoldOut(props.line.key)
}
</script>

<template>
  <li class="bline" :class="{ 'is-out': soldOut }">
    <RouterLink :to="to" class="bline__thumb" tabindex="-1" aria-hidden="true" @click="emit('navigate')">
      <img v-if="line.image" :src="cldUrl(line.image, { w: 220 })" alt="" width="96" height="120" loading="lazy" />
    </RouterLink>
    <div class="bline__body">
      <p v-if="variant" class="bline__variant">{{ variant }}</p>
      <RouterLink :to="to" class="bline__name" @click="emit('navigate')">{{ line.name }}</RouterLink>
      <p class="bline__price">{{ formatCents(line.unitPriceCents * line.quantity) }}</p>
      <p v-if="soldOut" class="bline__out" role="alert">{{ copy.soldOut }}</p>
      <div class="bline__actions">
        <BagStepper v-if="!unique && !soldOut" v-model="qty" :max="line.maxQuantity" :label="`Cantidad de ${line.name}`" />
        <button type="button" class="bline__remove link-line" :aria-label="`${copy.remove} ${line.name}`" @click="remove">
          {{ copy.remove }}
        </button>
      </div>
    </div>
  </li>
</template>

<style scoped lang="scss">
.bline {
  @include flex(row, stretch, flex-start, 1rem);
  padding-block: 1.2rem;
  border-bottom: 1px solid $line;

  &__thumb {
    flex: 0 0 96px;
    aspect-ratio: 4 / 5;
    overflow: hidden;
    background: $quartz-deep;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 1.2s $ease;
    }

    &:hover img {
      transform: scale(1.04);
    }
  }

  &.is-out &__thumb {
    opacity: 0.5;
  }

  &__body {
    @include flex(column, flex-start, flex-start, 0.2rem);
    flex: 1;
    min-width: 0;
  }

  &__variant {
    @include eyebrow;
    color: $ink-muted;
  }

  &__name {
    font-family: $font-serif;
    font-size: $text-xl;
    line-height: 1.05;
    @include focus-ring($ink);
  }

  &__price {
    font-family: $font-serif;
    font-size: $text-lg;
    font-variant-numeric: tabular-nums;
    color: $ink-soft;
  }

  &__out {
    font-size: $text-sm;
    color: $danger;
  }

  &__actions {
    @include flex(row, center, space-between, 0.8rem);
    align-self: stretch;
    margin-top: auto;
    padding-top: 0.5rem;
  }

  &__remove {
    @include eyebrow;
    margin-left: auto;
    padding: 0.3rem 0;
    color: $ink-soft;

    &:hover {
      color: $ink;
    }
  }
}
</style>
