<script setup lang="ts">
import { nextTick, watch } from 'vue'
import HomeHero from '@/components/home/HomeHero.vue'
import HomeSegments from '@/components/home/HomeSegments.vue'
import HomeMonth from '@/components/home/HomeMonth.vue'
import HomeBestSellers from '@/components/home/HomeBestSellers.vue'
import HomeGalapagos from '@/components/home/HomeGalapagos.vue'
import HomeStones from '@/components/home/HomeStones.vue'
import HomeCategories from '@/components/home/HomeCategories.vue'
import HomeBespoke from '@/components/home/HomeBespoke.vue'
import HomeDesigner from '@/components/home/HomeDesigner.vue'
import { useCatalog } from '@/composables/useCatalog'
import { refreshScroll } from '@/composables/useSmoothScroll'

// Orden pedido por la clienta: directo a comprar (segmentos, pieza del mes, lo más
// vendido) y enseguida la colección Galápagos, que debe verse "desde el principio".
const { loading } = useCatalog()

// Cuando llega el catálogo cambian las alturas: los ScrollTrigger se recalculan.
watch(loading, (now) => {
  if (!now) nextTick(() => window.setTimeout(refreshScroll, 120))
})
</script>

<template>
  <div class="home">
    <HomeHero />
    <HomeSegments />
    <HomeMonth />
    <HomeBestSellers />
    <HomeGalapagos />
    <HomeStones />
    <HomeCategories />
    <HomeBespoke />
    <HomeDesigner />
  </div>
</template>
