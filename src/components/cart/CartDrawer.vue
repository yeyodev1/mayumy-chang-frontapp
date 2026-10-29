<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import CartLineItem from './CartLineItem.vue'
import FreeShippingBar from './FreeShippingBar.vue'
import CartEmpty from './CartEmpty.vue'
import { checkoutCopy } from '@/components/checkout/checkoutCopy'
import { useCartStore } from '@/stores/cart'
import { useBodyScroll } from '@/composables/useBodyScroll'
import { useFocusTrap } from '@/composables/useFocusTrap'
import { useStoreConfig } from '@/composables/useStoreConfig'
import { formatCents } from '@/utils/format'
import { fill, site } from '@/config/site'

const cart = useCartStore()
const { isOpen } = storeToRefs(cart)
const route = useRoute()
const { shippingCopy } = useStoreConfig()
const panel = ref<HTMLElement | null>(null)
const copy = site.bag
const close = () => cart.close()

useBodyScroll(isOpen)
useFocusTrap(panel, isOpen, close)

// Al navegar a otra página la bolsa ya cumplió: se cierra.
watch(() => route.fullPath, close)
</script>

<template>
  <Teleport to="body">
    <Transition name="bag" :duration="{ enter: 1200, leave: 520 }">
      <div v-if="isOpen" class="bag" @click.self="close">
        <aside ref="panel" class="bag__panel" role="dialog" aria-modal="true" aria-labelledby="bag-title" tabindex="-1">
          <header class="bag__head">
            <h2 id="bag-title" class="bag__title">
              {{ copy.title }} <span class="bag__count">({{ cart.count }})</span>
            </h2>
            <button type="button" class="bag__close" aria-label="Cerrar la bolsa" data-autofocus @click="close">
              <span>Cerrar</span>
              <i class="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>
          </header>

          <CartEmpty v-if="cart.isEmpty" class="bag__empty" @navigate="close" />

          <template v-else>
            <div class="bag__free"><FreeShippingBar :subtotal-cents="cart.subtotalCents" /></div>
            <TransitionGroup tag="ul" name="bline" class="bag__lines">
              <CartLineItem
                v-for="(line, i) in cart.lines"
                :key="line.key"
                :line="line"
                :style="{ '--i': i }"
                @navigate="close"
              />
            </TransitionGroup>

            <footer class="bag__foot">
              <p class="bag__subtotal">
                <span>{{ copy.subtotal }}</span>
                <strong>{{ formatCents(cart.subtotalCents) }}</strong>
              </p>
              <p class="bag__note">{{ copy.shippingNote }}</p>
              <p class="bag__rates">{{ fill(checkoutCopy.shipFrom, shippingCopy) }}</p>
              <RouterLink :to="{ name: 'Checkout' }" class="btn btn--primary btn--block bag__cta" @click="close">
                {{ copy.checkout }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
              </RouterLink>
              <button type="button" class="bag__keep link-line" @click="close">{{ copy.keep }}</button>
            </footer>
          </template>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
$panel-ease: cubic-bezier(0.16, 1, 0.3, 1);

.bag {
  position: fixed;
  inset: 0;
  z-index: 150;
  background: rgba($basalt, 0.42);
  @include flex(row, stretch, flex-end);

  &__panel {
    @include flex(column, stretch, flex-start);
    width: min(100%, 460px);
    height: 100%;
    background: $quartz;
    box-shadow: $shadow-lg;
    outline: none;
  }

  &__head {
    @include flex(row, center, space-between, 1rem);
    padding: 1.3rem 1.5rem 1.1rem;
    border-bottom: 1px solid $line;
  }

  &__title {
    @include display($display-sm);
  }

  &__count {
    font-family: $font-mono;
    font-size: $text-sm;
    letter-spacing: 0.04em;
    color: $ink-muted;
    vertical-align: middle;
  }

  &__close {
    @include flex(row, center, center, 0.5rem);
    @include eyebrow;
    min-height: 44px;
    padding-inline: 0.4rem;
    color: $ink;
    @include focus-ring($ink);

    i {
      font-size: 0.95rem;
      transition: transform 0.5s $ease;
    }

    &:hover i {
      transform: rotate(90deg);
    }
  }

  &__free:has(*) {
    padding: 1rem 1.5rem 0;
  }

  &__lines {
    position: relative;
    flex: 1;
    overflow-y: auto;
    overscroll-behavior: contain;
    list-style: none;
    padding: 0 1.5rem;
  }

  &__foot {
    @include flex(column, stretch, flex-start, 0.45rem);
    padding: 1.2rem 1.5rem calc(1.2rem + env(safe-area-inset-bottom));
    background: $frost;
    border-top: 1px solid $line;
  }

  &__subtotal {
    @include flex(row, baseline, space-between);

    span {
      @include eyebrow;
      color: $ink;
    }

    strong {
      font-family: $font-serif;
      font-weight: 400;
      font-size: $display-sm;
      line-height: 1;
    }
  }

  &__note,
  &__rates {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__rates {
    font-family: $font-mono;
    letter-spacing: 0.02em;
  }

  &__cta {
    min-height: 56px;
    margin-top: 0.6rem;
  }

  &__keep {
    align-self: center;
    margin-top: 0.3rem;
    padding: 0.5rem 0;
    font-size: $text-sm;
    color: $ink-soft;
  }
}

// Entrada: el velo aparece, el panel desliza largo y las piezas llegan una tras otra.
.bag-enter-active {
  transition: opacity 0.5s ease;

  .bag__panel {
    transition: transform 0.9s $panel-ease;
  }

  .bag__lines > *,
  .bag__foot {
    transition:
      opacity 0.7s $ease,
      transform 0.8s $ease;
    transition-delay: calc(0.28s + var(--i, 0) * 0.08s);
  }

  .bag__foot {
    transition-delay: 0.45s;
  }
}

.bag-leave-active {
  transition: opacity 0.45s ease 0.05s;

  .bag__panel {
    transition: transform 0.5s cubic-bezier(0.7, 0, 0.84, 0);
  }
}

.bag-enter-from,
.bag-leave-to {
  opacity: 0;

  .bag__panel {
    transform: translateX(100%);
  }
}

.bag-enter-from {
  .bag__lines > *,
  .bag__foot {
    opacity: 0;
    transform: translateX(28px);
  }
}

// Al quitar una pieza se desvanece y las demás suben a su lugar.
.bline-leave-active {
  position: absolute;
  left: 1.5rem;
  right: 1.5rem;
  transition:
    opacity 0.35s ease,
    transform 0.45s $ease;
}

.bline-leave-to {
  opacity: 0;
  transform: translateX(24px);
}

.bline-move {
  transition: transform 0.6s $ease;
}
</style>
