<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { site } from '@/config/site'
import { useUserStore } from '@/stores/user'
import TheMobileMenu from '@/layout/TheMobileMenu.vue'
import HeaderAnnounce from '@/layout/HeaderAnnounce.vue'
import HeaderBag from '@/layout/HeaderBag.vue'

const props = defineProps<{ minimal?: boolean }>()
const route = useRoute()
const userStore = useUserStore()

const menuOpen = ref(false)
const scrolled = ref(false)
const hidden = ref(false)

// Sobre los héroes oscuros (home, a medida) el header arranca claro y transparente.
const onDark = computed(() => Boolean(route.meta.darkHeader) && !scrolled.value && !menuOpen.value)

let lastY = 0
function onScroll() {
  const y = window.scrollY
  scrolled.value = y > 40
  // Se esconde al bajar y vuelve al subir: la foto manda, el menú está a un gesto.
  hidden.value = y > 420 && y > lastY && !menuOpen.value
  lastY = y
}

watch(
  () => route.fullPath,
  () => (menuOpen.value = false),
)

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  if (userStore.hasToken) userStore.restore()
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})

const leftNav = site.nav.slice(0, 4)
</script>

<template>
  <div class="hdr" :class="{ 'hdr--dark': onDark, 'hdr--solid': scrolled || menuOpen, 'hdr--hidden': hidden }">
    <HeaderAnnounce v-if="!props.minimal" />

    <header class="hdr__bar">
      <div v-if="props.minimal" class="hdr__nav">
        <RouterLink to="/tienda" class="hdr__back link-line">
          <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
          <span class="hdr__collapse">{{ site.bag.keep }}</span>
        </RouterLink>
      </div>
      <nav v-else class="hdr__nav" aria-label="Principal">
        <button
          type="button"
          class="hdr__menu-btn"
          :aria-expanded="menuOpen"
          aria-controls="mobile-menu"
          @click="menuOpen = !menuOpen"
        >
          <span class="hdr__burger" :class="{ 'hdr__burger--open': menuOpen }"><i></i><i></i></span>
          <span>{{ menuOpen ? 'Cerrar' : 'Menú' }}</span>
        </button>
        <RouterLink v-for="item in leftNav" :key="item.to" :to="item.to" class="hdr__link link-line">
          {{ item.label }}
        </RouterLink>
      </nav>

      <RouterLink to="/" class="hdr__brand" aria-label="Mayumy Chang, ir al inicio">
        <span class="hdr__brand-name">{{ site.name }}</span>
        <span class="hdr__brand-sub">{{ site.tagline }}</span>
      </RouterLink>

      <div v-if="props.minimal" class="hdr__actions">
        <span v-if="route.name !== 'Login'" class="hdr__secure">
          <i class="fa-solid fa-lock" aria-hidden="true"></i>
          <span class="hdr__collapse">Pago seguro</span>
        </span>
      </div>
      <div v-else class="hdr__actions">
        <RouterLink to="/a-medida" class="hdr__link hdr__link--wide link-line">A medida</RouterLink>
        <RouterLink v-if="userStore.isAdmin" to="/admin" class="hdr__link hdr__link--wide link-line">Panel</RouterLink>
        <HeaderBag />
      </div>
    </header>

    <TheMobileMenu v-if="!props.minimal" id="mobile-menu" :open="menuOpen" @close="menuOpen = false" />
  </div>
</template>

<style scoped lang="scss">
.hdr {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 60;
  color: $ink;
  transition:
    transform 0.6s $ease,
    color 0.4s ease;

  &--hidden {
    transform: translateY(-100%);
  }


  &__bar {
    position: relative;
    @include flex(row, center, space-between, 1rem);
    height: var(--header-h);
    padding-inline: 1.25rem;
    transition:
      background-color 0.5s ease,
      backdrop-filter 0.5s ease,
      border-color 0.5s ease;
    border-bottom: 1px solid transparent;

    @include from('md') {
      padding-inline: 2rem;
    }
  }

  &--solid &__bar {
    background: rgba($quartz, 0.86);
    backdrop-filter: blur(14px) saturate(1.2);
    border-bottom-color: rgba($basalt, 0.08);
  }

  &--dark {
    color: $quartz;
  }

  &__nav,
  &__actions {
    flex: 1;
    @include flex(row, center, flex-start, 1.6rem);
  }

  &__actions {
    justify-content: flex-end;
  }

  &__link {
    display: none;
    font-family: $font-mono;
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;

    @include from('lg') {
      display: inline-block;
    }

    &.router-link-exact-active {
      background-size: 100% 1px;
    }
  }

  &__menu-btn {
    @include flex(row, center, flex-start, 0.6rem);
    font-family: $font-mono;
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    min-height: 44px;

    @include from('lg') {
      display: none;
    }
  }

  &__burger {
    position: relative;
    width: 22px;
    height: 10px;

    i {
      position: absolute;
      left: 0;
      right: 0;
      height: 1px;
      background: currentColor;
      transition: transform 0.45s $ease, top 0.45s $ease;
    }
    i:first-child {
      top: 0;
    }
    i:last-child {
      top: 9px;
    }

    &--open i:first-child {
      top: 5px;
      transform: rotate(45deg);
    }
    &--open i:last-child {
      top: 5px;
      transform: rotate(-45deg);
    }
  }

  // Checkout: sin menú, solo volver y la señal de pago seguro.
  &__back,
  &__secure {
    @include flex(row, center, flex-start, 0.5rem);
    font-family: $font-mono;
    font-size: 0.68rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    min-height: 44px;
  }

  &__secure {
    color: $ink-soft;
  }

  // En móvil solo el ícono: el nombre de la marca necesita el centro.
  &__collapse {
    @include until('md') {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }
  }

  &__brand {
    @include flex(column, center, center, 0.1rem);
    text-align: center;
    flex-shrink: 0;
  }

  &__brand-name {
    font-family: $font-serif;
    font-size: clamp(1.25rem, 1rem + 1vw, 1.7rem);
    letter-spacing: 0.16em;
    text-transform: uppercase;
    line-height: 1;
  }

  &__brand-sub {
    display: none;
    font-family: $font-mono;
    font-size: 0.56rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    opacity: 0.7;

    @include from('md') {
      display: block;
    }
  }

}


</style>
