<script setup lang="ts">
import { site } from '@/config/site'
</script>

<template>
  <div class="announce" aria-label="Avisos de la tienda">
    <div class="announce__marquee">
      <span v-for="n in 2" :key="n" :aria-hidden="n === 2">{{ site.announcement }} · {{ site.announcement }} ·&nbsp;</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.announce {
  overflow: hidden;
  background: $basalt;
  color: $quartz;
  font-family: $font-mono;
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding-block: 0.45rem;

  &__marquee {
    display: flex;
    width: max-content;
    white-space: nowrap;
    animation: marquee 38s linear infinite;
  }
}

@keyframes marquee {
  to {
    transform: translateX(-50%);
  }
}
</style>
