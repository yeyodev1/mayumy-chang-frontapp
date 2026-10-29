<script setup lang="ts">
import { toRef } from 'vue'
import { site, whatsappLink } from '@/config/site'
import { useBodyScroll } from '@/composables/useBodyScroll'
import { useStoreConfig } from '@/composables/useStoreConfig'

const props = defineProps<{ open: boolean }>()
defineEmits<{ close: [] }>()
useBodyScroll(toRef(props, 'open'))
const { config } = useStoreConfig()

// Los segmentos van en grande: es como Mayumy organiza su catálogo.
const big = [
  { label: 'Tienda', to: '/tienda' },
  ...site.segments.map((s) => ({ label: s.label, to: `/tienda?segmento=${s.id}` })),
  { label: 'A medida', to: '/a-medida' },
]
</script>

<template>
  <Transition name="mmenu">
    <div v-if="open" class="mmenu" role="dialog" aria-modal="true" aria-label="Menú">
      <nav class="mmenu__big">
        <RouterLink
          v-for="(item, i) in big"
          :key="item.to"
          :to="item.to"
          class="mmenu__item"
          :style="{ '--i': i }"
          @click="$emit('close')"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
      <div class="mmenu__foot">
        <RouterLink to="/rastrear" class="mmenu__small" @click="$emit('close')">{{ site.tracking.navLabel }}</RouterLink>
        <a :href="whatsappLink(undefined, config.contact.whatsapp)" target="_blank" rel="noopener" class="mmenu__small">
          <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> WhatsApp
        </a>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.mmenu {
  position: fixed;
  inset: 0;
  top: calc(var(--header-h) + 1.9rem);
  z-index: -1;
  background: $quartz;
  color: $ink;
  padding: 2rem 1.25rem 2.5rem;
  @include flex(column, stretch, space-between);

  &__big {
    @include flex(column, flex-start, flex-start, 0.2rem);
  }

  &__item {
    @include caps(clamp(4rem, 18vw, 6.5rem));
    transition: color 0.3s ease;

    &.router-link-exact-active {
      color: var(--stone);
    }
  }

  &__foot {
    @include flex(row, center, space-between, 1rem);
    border-top: 1px solid $line;
    padding-top: 1.2rem;
  }

  &__small {
    @include eyebrow;
    color: $ink;
  }
}

.mmenu-enter-active {
  transition: clip-path 0.7s $ease-in-out;

  .mmenu__item {
    transition:
      transform 0.8s $ease calc(0.15s + var(--i) * 0.05s),
      opacity 0.8s $ease calc(0.15s + var(--i) * 0.05s);
  }
}
.mmenu-leave-active {
  transition: clip-path 0.45s $ease-in-out;
}
.mmenu-enter-from,
.mmenu-leave-to {
  clip-path: inset(0 0 100% 0);
}
.mmenu-enter-from .mmenu__item {
  transform: translateY(60%);
  opacity: 0;
}
</style>
