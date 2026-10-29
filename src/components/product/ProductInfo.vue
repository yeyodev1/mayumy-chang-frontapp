<script setup lang="ts">
import { computed } from 'vue'
import { site, segmentLabel, stoneMeta, fill, whatsappLink } from '@/config/site'
import { useStoreConfig } from '@/composables/useStoreConfig'
import { formatCents } from '@/utils/format'
import type { Product } from '@/types'

const props = defineProps<{ product: Product; variantId: string; inBag: boolean }>()
const emit = defineEmits<{ add: []; 'update:variantId': [id: string] }>()
const { config, shippingCopy } = useStoreConfig()

const stone = computed(() => stoneMeta(props.product.stone))
const variant = computed(() => props.product.variants.find((v) => v._id === props.variantId))
const stockNote = computed(() => {
  const n = variant.value?.stock ?? 0
  if (n === 1) return site.product.unique
  if (n > 1 && n <= 3) return fill(site.product.stockLeft, { n })
  return ''
})
const price = computed(() => variant.value?.priceCents ?? props.product.priceFromCents)
const askLink = computed(() =>
  whatsappLink(fill(site.product.whatsappMsg, { name: props.product.name }), config.value.contact.whatsapp),
)
const sections = computed(() => [
  { title: site.product.shippingTitle, text: fill(site.product.shippingText, shippingCopy.value) + (config.value.shipping.pickupEnabled ? ` ${site.product.pickupText}` : '') },
  { title: site.product.giftTitle, text: site.product.giftText },
  { title: site.product.careTitle, text: site.product.careText },
])
</script>

<template>
  <div class="pinfo" :style="{ '--c': stone?.color }">
    <RouterLink to="/tienda" class="pinfo__back link-line"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i> {{ site.product.back }}</RouterLink>

    <p class="pinfo__meta">
      <span v-if="stone" class="pinfo__dot" aria-hidden="true"></span>
      {{ [segmentLabel(product.segment), product.line, stone?.name].filter(Boolean).join(' · ') }}
    </p>
    <h1 class="pinfo__name">{{ product.name }}</h1>
    <p v-if="product.shortDescription" class="pinfo__short">{{ product.shortDescription }}</p>

    <p class="pinfo__price">
      {{ formatCents(price) }}
      <s v-if="product.compareAtPriceCents > price">{{ formatCents(product.compareAtPriceCents) }}</s>
    </p>

    <div v-if="product.variants.length > 1" class="pinfo__variants" role="radiogroup" aria-label="Opción">
      <button
        v-for="v in product.variants"
        :key="v._id"
        type="button"
        role="radio"
        class="pinfo__variant"
        :class="{ 'is-on': v._id === variantId }"
        :aria-checked="v._id === variantId"
        :disabled="!v.isAvailable"
        @click="emit('update:variantId', v._id)"
      >
        {{ v.label }}
      </button>
    </div>

    <template v-if="product.isAvailable">
      <p v-if="stockNote" class="pinfo__stock"><span class="pinfo__pulse" aria-hidden="true"></span>{{ stockNote }}</p>
      <button type="button" class="btn btn--primary btn--block pinfo__cta" :disabled="inBag && variant?.stock === 1" @click="emit('add')">
        <i :class="inBag ? 'fa-solid fa-check' : 'fa-solid fa-bag-shopping'" aria-hidden="true"></i>
        {{ inBag ? site.shop.added : site.product.addToBag }}
      </button>
    </template>
    <div v-else class="pinfo__out">
      <p class="pinfo__out-title">{{ site.product.soldOut }}</p>
      <p>{{ site.product.soldOutText }}</p>
      <a :href="askLink" target="_blank" rel="noopener" class="btn btn--ghost btn--block">
        <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ site.product.askSimilar }}
      </a>
    </div>

    <div v-if="product.details.length || product.material" class="pinfo__specs">
      <p class="pinfo__label">[ {{ site.product.details }} ]</p>
      <ul>
        <li v-for="d in product.details" :key="d">{{ d }}</li>
      </ul>
      <p v-if="product.material" class="pinfo__material">{{ product.material }}</p>
    </div>

    <p v-if="product.description" class="pinfo__desc">{{ product.description }}</p>

    <details v-for="s in sections" :key="s.title" class="pinfo__acc">
      <summary>{{ s.title }} <i class="fa-solid fa-plus" aria-hidden="true"></i></summary>
      <p>{{ s.text }}</p>
    </details>
  </div>
</template>

<style scoped lang="scss">
.pinfo {
  @include flex(column, stretch, flex-start, 1.1rem);

  &__back {
    @include eyebrow;
    color: $ink;
    width: max-content;
    margin-bottom: 0.6rem;
  }

  &__meta {
    @include eyebrow;
    @include flex(row, center, flex-start, 0.5rem);
  }

  &__dot {
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 50%;
    background: var(--c);
  }

  &__name {
    @include display(clamp(2.4rem, 1.8rem + 2.6vw, 4.2rem));
  }

  &__short {
    font-size: $text-lg;
    color: $ink-soft;
  }

  &__price {
    @include flex(row, baseline, flex-start, 0.8rem);
    font-family: $font-serif;
    font-size: $display-sm;

    s {
      font-size: $text-lg;
      color: $ink-muted;
    }
  }

  &__variants {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
  }

  &__variant {
    font-family: $font-mono;
    font-size: 0.75rem;
    padding: 0.6rem 1rem;
    min-height: 44px;
    border: 1px solid $line;

    &.is-on {
      border-color: $ink;
      background: $ink;
      color: $frost;
    }

    &:disabled {
      text-decoration: line-through;
      opacity: 0.4;
    }
  }

  &__stock {
    @include flex(row, center, flex-start, 0.6rem);
    font-family: $font-mono;
    font-size: 0.74rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  // Un pulso suave del color de la piedra: "hay una sola" se siente urgente sin gritar.
  &__pulse {
    width: 0.55rem;
    height: 0.55rem;
    border-radius: 50%;
    background: var(--c, $ink);
    animation: pulse 1.8s ease-out infinite;
  }

  &__cta {
    min-height: 56px;
  }

  &__out {
    @include flex(column, stretch, flex-start, 0.6rem);
    padding: 1.2rem;
    background: $quartz-deep;
  }

  &__out-title {
    @include eyebrow;
    color: $ink;
  }

  &__specs {
    border-top: 1px solid $line;
    padding-top: 1.1rem;
    @include flex(column, flex-start, flex-start, 0.6rem);

    ul {
      list-style: none;
      @include flex(row, center, flex-start, 0.35rem);
      flex-wrap: wrap;
    }

    li {
      font-family: $font-mono;
      font-size: 0.68rem;
      letter-spacing: 0.08em;
      background: $basalt;
      color: $quartz;
      padding: 0.2rem 0.5rem;
    }
  }

  &__label {
    @include eyebrow;
  }

  &__material {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__desc {
    line-height: 1.7;
    color: $ink-soft;
  }

  &__acc {
    border-top: 1px solid $line;

    &:last-child {
      border-bottom: 1px solid $line;
    }

    summary {
      @include flex(row, center, space-between);
      list-style: none;
      cursor: pointer;
      padding-block: 1rem;
      font-family: $font-mono;
      font-size: 0.74rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;

      &::-webkit-details-marker {
        display: none;
      }

      i {
        transition: transform 0.4s $ease;
      }
    }

    &[open] summary i {
      transform: rotate(45deg);
    }

    p {
      padding-bottom: 1rem;
      color: $ink-soft;
      font-size: $text-sm;
    }
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--c, #000) 55%, transparent);
  }
  100% {
    box-shadow: 0 0 0 10px transparent;
  }
}
</style>
