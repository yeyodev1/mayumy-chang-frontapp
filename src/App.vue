<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import TheHeader from '@/layout/TheHeader.vue'
import TheFooter from '@/layout/TheFooter.vue'
import ToastList from '@/components/ui/ToastList.vue'
import UpdateBanner from '@/components/ui/UpdateBanner.vue'
import PageCurtain from '@/components/ui/PageCurtain.vue'
import CartDrawer from '@/components/cart/CartDrawer.vue'
import { refreshScroll, scrollToTop, startSmoothScroll } from '@/composables/useSmoothScroll'

const route = useRoute()
// El panel admin trae su propio layout: sin header, footer ni cortina de la tienda.
const isAdmin = computed(() => Boolean(route.meta.admin))
const minimal = computed(() => Boolean(route.meta.minimalChrome))
const curtain = ref<InstanceType<typeof PageCurtain> | null>(null)

// Primera carga: sin cortina (la clienta quiere entrar directo a comprar).
let firstPaint = true

// Los hooks SIEMPRE terminan en done(): si algo falla (un ScrollTrigger de la página
// que se fue, la cortina), la vista nueva igual tiene que aparecer.
async function onLeave(_el: Element, done: () => void) {
  try {
    if (!firstPaint && !isAdmin.value) await curtain.value?.cover()
  } catch (error) {
    console.error('[transición] al salir:', error)
  } finally {
    done()
  }
}

async function onEnter(_el: Element, done: () => void) {
  try {
    if (!route.hash) scrollToTop()
    await nextTick()
    refreshScroll()
    if (!firstPaint && !isAdmin.value) await curtain.value?.reveal()
  } catch (error) {
    console.error('[transición] al entrar:', error)
  } finally {
    firstPaint = false
    done()
  }
}

onMounted(() => {
  if (!isAdmin.value) startSmoothScroll()
  // Si la primera carga es una vista sin transición, igual se libera el flag.
  window.setTimeout(() => (firstPaint = false), 1200)
})
</script>

<template>
  <div class="app">
    <TheHeader v-if="!isAdmin" :minimal="minimal" />
    <main class="app__main">
      <RouterView v-slot="{ Component, route: r }">
        <!-- El panel va sin cortina: entrar con transición out-in mientras App quita
             header y footer dejaba la vista vacía. -->
        <component :is="Component" v-if="r.meta.admin" key="admin" />
        <Transition v-else mode="out-in" :css="false" @leave="onLeave" @enter="onEnter">
          <component :is="Component" :key="r.path" />
        </Transition>
      </RouterView>
    </main>
    <TheFooter v-if="!isAdmin && !minimal" />
    <CartDrawer v-if="!isAdmin" />
    <PageCurtain ref="curtain" />
    <ToastList />
    <UpdateBanner />
  </div>
</template>

<style scoped lang="scss">
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  &__main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}
</style>
