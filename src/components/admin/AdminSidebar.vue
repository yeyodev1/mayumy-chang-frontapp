<script setup lang="ts">
import { useRoute } from 'vue-router'
import HeptagonMark from '@/components/brand/HeptagonMark.vue'
import { site } from '@/config/site'
import { adminNav, isNavActive } from './adminNav'

defineProps<{ pending: number; userName: string }>()
const emit = defineEmits<{ logout: [] }>()
const route = useRoute()
</script>

<template>
  <aside class="sidebar" aria-label="Menú del panel">
    <RouterLink to="/admin" class="sidebar__brand">
      <HeptagonMark size="34px" :stroke="2" class="sidebar__mark" />
      <span class="sidebar__brand-text">
        <span class="sidebar__name-brand">{{ site.name }}</span>
        <span class="sidebar__tag">Panel</span>
      </span>
    </RouterLink>

    <nav class="sidebar__nav">
      <RouterLink
        v-for="item in adminNav"
        :key="item.name"
        :to="item.to"
        class="sidebar__link"
        :class="{ 'sidebar__link--active': isNavActive(item, route.path) }"
        :aria-current="isNavActive(item, route.path) ? 'page' : undefined"
      >
        <i :class="item.icon" aria-hidden="true"></i>
        <span>{{ item.label }}</span>
        <span v-if="item.badge && pending > 0" class="sidebar__badge">
          {{ pending }}<span class="visually-hidden"> por atender</span>
        </span>
      </RouterLink>
    </nav>

    <div class="sidebar__foot">
      <a href="/" target="_blank" rel="noopener" class="sidebar__link sidebar__link--quiet">
        <i class="fa-solid fa-store" aria-hidden="true"></i>
        <span>Ver tienda</span>
        <i class="fa-solid fa-arrow-up-right-from-square sidebar__ext" aria-hidden="true"></i>
      </a>
      <div class="sidebar__user">
        <span class="sidebar__avatar" aria-hidden="true">{{ userName.charAt(0) || 'M' }}</span>
        <span class="sidebar__name">{{ userName }}</span>
        <button class="sidebar__logout" type="button" aria-label="Cerrar sesión" title="Cerrar sesión" @click="emit('logout')">
          <i class="fa-solid fa-arrow-right-from-bracket" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  </aside>
</template>

<style scoped lang="scss">
.sidebar {
  @include flex(column, stretch, flex-start, 0);
  position: sticky;
  top: 0;
  height: 100vh;
  width: 248px;
  flex-shrink: 0;
  padding: 1.6rem 0.9rem 1.2rem;
  background: $basalt;
  color: $frost;
  overflow-y: auto;

  &__brand {
    @include flex(row, center, flex-start, 0.75rem);
    padding: 0 0.6rem 2rem;
    color: $frost;
    @include focus-ring($silver);
  }

  &__mark {
    flex-shrink: 0;
    color: $silver;
  }

  &__brand-text {
    @include flex(column, flex-start, center, 0.15rem);
  }

  &__name-brand {
    font-family: $font-serif;
    font-size: 1.45rem;
    line-height: 1;
  }

  &__tag {
    @include eyebrow;
    color: $silver;
  }

  &__nav {
    @include flex(column, stretch, flex-start, 0.1rem);
    flex: 1;
  }

  &__link {
    @include flex(row, center, flex-start, 0.85rem);
    padding: 0.68rem 0.8rem;
    border-radius: $radius-sm;
    font-size: 0.93rem;
    color: rgba($frost, 0.72);
    transition: background-color 0.2s ease, color 0.2s ease;
    @include focus-ring($silver);

    i {
      width: 1.1rem;
      text-align: center;
      font-size: 0.88rem;
    }

    &:hover {
      background: rgba($frost, 0.06);
      color: $frost;
    }

    &--active {
      background: $frost;
      color: $basalt;
      font-weight: 600;

      &:hover {
        background: $frost;
        color: $basalt;
      }
    }

    &--quiet {
      font-size: 0.88rem;
    }
  }

  &__badge {
    margin-left: auto;
    min-width: 1.5rem;
    padding: 0.05rem 0.45rem;
    border-radius: $radius-pill;
    background: $citrino;
    color: $basalt;
    font-family: $font-mono;
    font-size: 0.72rem;
    font-weight: 600;
    text-align: center;
    font-variant-numeric: tabular-nums;
  }

  &__ext {
    margin-left: auto;
    font-size: 0.7rem !important;
    opacity: 0.6;
  }

  &__foot {
    @include flex(column, stretch, flex-start, 0.6rem);
    border-top: 1px solid rgba($frost, 0.12);
    padding-top: 0.9rem;
  }

  &__user {
    @include flex(row, center, flex-start, 0.65rem);
    padding: 0.3rem 0.4rem 0 0.6rem;
  }

  &__avatar {
    @include flex(row, center, center);
    width: 2rem;
    height: 2rem;
    flex-shrink: 0;
    border-radius: 50%;
    border: 1px solid rgba($frost, 0.3);
    font-family: $font-serif;
    font-size: 1.05rem;
    text-transform: uppercase;
  }

  &__name {
    flex: 1;
    min-width: 0;
    font-size: 0.85rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__logout {
    @include flex(row, center, center);
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 50%;
    color: rgba($frost, 0.75);
    transition: background-color 0.2s ease, color 0.2s ease;
    @include focus-ring($silver);

    &:hover {
      background: rgba($frost, 0.1);
      color: $frost;
    }
  }
}
</style>
