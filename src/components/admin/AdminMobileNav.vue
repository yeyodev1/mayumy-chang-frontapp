<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import HeptagonMark from '@/components/brand/HeptagonMark.vue'
import { site } from '@/config/site'
import { adminNav, isNavActive } from './adminNav'
import AdminMoreSheet from './AdminMoreSheet.vue'

defineProps<{ pending: number }>()
const emit = defineEmits<{ logout: [] }>()
const route = useRoute()
const moreOpen = ref(false)

const tabs = adminNav.filter((i) => i.tab)
// "Más" se marca cuando la sección actual vive dentro de la hoja.
const moreActive = computed(() => adminNav.some((i) => !i.tab && isNavActive(i, route.path)))

function logout() {
  moreOpen.value = false
  emit('logout')
}
</script>

<template>
  <header class="topbar">
    <RouterLink to="/admin" class="topbar__brand" aria-label="Ir al panel">
      <HeptagonMark size="26px" :stroke="2.4" class="topbar__mark" />
      <span class="topbar__name">{{ site.name }}</span>
    </RouterLink>
    <a href="/" target="_blank" rel="noopener" class="topbar__icon" aria-label="Ver tienda" title="Ver tienda">
      <i class="fa-solid fa-store" aria-hidden="true"></i>
    </a>
  </header>

  <nav class="tabs" aria-label="Menú del panel">
    <RouterLink
      v-for="item in tabs"
      :key="item.name"
      :to="item.to"
      class="tabs__link"
      :class="{ 'tabs__link--active': isNavActive(item, route.path) }"
      :aria-current="isNavActive(item, route.path) ? 'page' : undefined"
    >
      <span class="tabs__icon">
        <i :class="item.icon" aria-hidden="true"></i>
        <span v-if="item.badge && pending > 0" class="tabs__badge">
          {{ pending }}<span class="visually-hidden"> por atender</span>
        </span>
      </span>
      <span class="tabs__label">{{ item.short }}</span>
    </RouterLink>
    <button
      type="button"
      class="tabs__link"
      :class="{ 'tabs__link--active': moreActive }"
      :aria-expanded="moreOpen"
      @click="moreOpen = true"
    >
      <span class="tabs__icon"><i class="fa-solid fa-ellipsis" aria-hidden="true"></i></span>
      <span class="tabs__label">Más</span>
    </button>
  </nav>

  <AdminMoreSheet :open="moreOpen" @close="moreOpen = false" @logout="logout" />
</template>

<style scoped lang="scss">
@media print {
  .topbar,
  .tabs {
    display: none !important;
  }
}

.topbar {
  @include flex(row, center, space-between, 1rem);
  position: sticky;
  top: 0;
  z-index: 40;
  padding: 0.55rem 0.6rem 0.55rem 1rem;
  background: $basalt;
  color: $frost;

  @include from('lg') {
    display: none;
  }

  &__brand {
    @include flex(row, center, flex-start, 0.6rem);
    @include focus-ring($silver);
  }

  &__mark {
    color: $silver;
  }

  &__name {
    font-family: $font-serif;
    font-size: 1.3rem;
    line-height: 1;
  }

  &__icon {
    @include flex(row, center, center);
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    color: rgba($frost, 0.85);
    @include focus-ring($silver);
  }
}

.tabs {
  @include flex(row, stretch, space-around, 0);
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 40;
  padding: 0.3rem 0.25rem calc(0.3rem + env(safe-area-inset-bottom));
  background: $frost;
  border-top: 1px solid $line;

  @include from('lg') {
    display: none;
  }

  &__link {
    @include flex(column, center, center, 0.2rem);
    flex: 1;
    min-width: 0;
    min-height: 3.2rem;
    padding: 0.3rem 0.1rem;
    border-radius: $radius-sm;
    color: $ink-muted;
    @include focus-ring;

    &--active {
      color: $ink;

      .tabs__icon {
        background: $basalt;
        color: $frost;
      }
    }
  }

  &__icon {
    position: relative;
    @include flex(row, center, center);
    width: 100%;
    max-width: 3rem;
    height: 1.85rem;
    border-radius: $radius-pill;
    font-size: 0.95rem;
    transition: background-color 0.2s ease;
  }

  &__badge {
    position: absolute;
    top: -0.3rem;
    right: 0;
    min-width: 1.15rem;
    padding: 0 0.3rem;
    border-radius: $radius-pill;
    background: $citrino;
    color: $basalt;
    border: 2px solid $frost;
    font-family: $font-mono;
    font-size: 0.62rem;
    font-weight: 600;
    line-height: 1.05rem;
    text-align: center;
  }

  &__label {
    font-size: 0.7rem;
    font-weight: 500;
    white-space: nowrap;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
