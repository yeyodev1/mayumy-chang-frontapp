<script setup lang="ts">
import { ref, toRef } from 'vue'
import { useRoute } from 'vue-router'
import { useBodyScroll } from '@/composables/useBodyScroll'
import { useFocusTrap } from '@/composables/useFocusTrap'
import { adminNav, isNavActive } from './adminNav'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: []; logout: [] }>()
const route = useRoute()
const panel = ref<HTMLElement | null>(null)

// En el celular solo caben 4 pestañas: el resto del menú vive en esta hoja.
const items = adminNav.filter((i) => !i.tab)

useBodyScroll(toRef(props, 'open'))
useFocusTrap(panel, toRef(props, 'open'), () => emit('close'))
</script>

<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div v-if="open" class="more" @click.self="emit('close')">
        <div ref="panel" class="more__panel" role="dialog" aria-modal="true" aria-label="Más secciones">
          <header class="more__head">
            <span class="more__title">Más secciones</span>
            <button type="button" class="more__close" aria-label="Cerrar" @click="emit('close')">
              <i class="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>
          </header>
          <nav class="more__list">
            <RouterLink
              v-for="item in items"
              :key="item.name"
              :to="item.to"
              class="more__link"
              :class="{ 'more__link--active': isNavActive(item, route.path) }"
              :aria-current="isNavActive(item, route.path) ? 'page' : undefined"
              @click="emit('close')"
            >
              <i :class="item.icon" aria-hidden="true"></i>
              {{ item.label }}
            </RouterLink>
            <a href="/" target="_blank" rel="noopener" class="more__link">
              <i class="fa-solid fa-store" aria-hidden="true"></i>
              Ver tienda
              <i class="fa-solid fa-arrow-up-right-from-square more__ext" aria-hidden="true"></i>
            </a>
            <button type="button" class="more__link more__link--out" @click="emit('logout')">
              <i class="fa-solid fa-arrow-right-from-bracket" aria-hidden="true"></i>
              Cerrar sesión
            </button>
          </nav>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.more {
  position: fixed;
  inset: 0;
  z-index: 60;
  @include flex(column, stretch, flex-end, 0);
  background: $overlay;

  &__panel {
    padding: 0.8rem 1rem calc(1.2rem + env(safe-area-inset-bottom));
    background: $frost;
    border-radius: $radius-lg $radius-lg 0 0;
    max-height: 85vh;
    overflow-y: auto;
  }

  &__head {
    @include flex(row, center, space-between, 1rem);
    padding: 0.2rem 0.3rem 0.6rem;
  }

  &__title {
    font-family: $font-serif;
    font-size: 1.5rem;
  }

  &__close {
    @include flex(row, center, center);
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    @include focus-ring;
  }

  &__list {
    @include flex(column, stretch, flex-start, 0.15rem);
  }

  &__link {
    @include flex(row, center, flex-start, 0.9rem);
    min-height: 3.1rem;
    padding: 0 0.8rem;
    border-radius: $radius-sm;
    font-size: 1rem;
    color: $ink;
    text-align: left;
    @include focus-ring;

    i {
      width: 1.2rem;
      text-align: center;
      color: $ink-muted;
    }

    &--active {
      background: $basalt;
      color: $frost;

      i {
        color: $silver;
      }
    }

    &--out {
      margin-top: 0.4rem;
      border-top: 1px solid $line;
      border-radius: 0;
      color: $danger;

      i {
        color: $danger;
      }
    }
  }

  &__ext {
    margin-left: auto;
    font-size: 0.75rem;
  }
}

.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.3s ease;

  .more__panel {
    transition: transform 0.4s $ease;
  }
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;

  .more__panel {
    transform: translateY(100%);
  }
}
</style>
