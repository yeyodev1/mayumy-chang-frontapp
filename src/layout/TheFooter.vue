<script setup lang="ts">
import { computed } from 'vue'
import { site, whatsappLink } from '@/config/site'
import { useStoreConfig } from '@/composables/useStoreConfig'
import FooterCredit from '@/layout/FooterCredit.vue'
import HeptagonMark from '@/components/brand/HeptagonMark.vue'

const { config, shippingCopy } = useStoreConfig()
const year = new Date().getFullYear()

const instagram = computed(() => {
  const handle = config.value.contact.instagram.replace(/^@/, '').trim()
  if (!handle) return null
  return handle.startsWith('http') ? { url: handle, label: 'Instagram' } : { url: `https://instagram.com/${handle}`, label: `@${handle}` }
})
</script>

<template>
  <footer class="ftr">
    <div class="ftr__top">
      <div class="ftr__intro">
        <HeptagonMark size="44px" :stroke="1.4" />
        <p class="ftr__lede">Joyería de autor diseñada en {{ site.city }}. Envíos a todo Ecuador con Servientrega: {{ shippingCopy.local }} en {{ shippingCopy.city }} y {{ shippingCopy.national }} al resto del país.</p>
        <RouterLink to="/a-medida" class="btn btn--ghost-light">{{ site.bespoke.book }}</RouterLink>
      </div>

      <nav class="ftr__col" aria-label="Tienda">
        <p class="ftr__head">[ Tienda ]</p>
        <RouterLink to="/tienda" class="link-line">Todas las piezas</RouterLink>
        <RouterLink v-for="s in site.segments" :key="s.id" :to="`/tienda?segmento=${s.id}`" class="link-line">{{ s.label }}</RouterLink>
      </nav>

      <nav class="ftr__col" aria-label="Ayuda">
        <p class="ftr__head">[ Ayuda ]</p>
        <RouterLink to="/rastrear" class="link-line">{{ site.tracking.navLabel }}</RouterLink>
        <RouterLink to="/a-medida" class="link-line">Diseño a medida</RouterLink>
        <a :href="whatsappLink('Hola Mayumy, tengo una pregunta sobre un envío', config.contact.whatsapp)" target="_blank" rel="noopener" class="link-line">Envíos y cambios</a>
      </nav>

      <div class="ftr__col">
        <p class="ftr__head">[ Contacto ]</p>
        <a :href="whatsappLink(undefined, config.contact.whatsapp)" target="_blank" rel="noopener" class="link-line">
          <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ site.whatsappDisplay }}
        </a>
        <a v-if="instagram" :href="instagram.url" target="_blank" rel="noopener" class="link-line">
          <i class="fa-brands fa-instagram" aria-hidden="true"></i> {{ instagram.label }}
        </a>
        <a v-if="config.contact.email" :href="`mailto:${config.contact.email}`" class="link-line">{{ config.contact.email }}</a>
        <span class="ftr__muted">{{ config.contact.showroom }}</span>
      </div>
    </div>

    <p class="ftr__word" aria-hidden="true">{{ site.name }}</p>

    <div class="ftr__bottom">
      <span>© {{ year }} {{ site.legal.copyright }}</span>
      <FooterCredit />
    </div>
  </footer>
</template>

<style scoped lang="scss">
.ftr {
  background: $basalt;
  color: $quartz;
  padding: $space-xl 1.25rem 1.5rem;
  overflow: hidden;

  @include from('md') {
    padding-inline: 2rem;
  }

  &__top {
    @include flex(row, flex-start, space-between, 2.5rem);
    flex-wrap: wrap;
  }

  &__intro {
    flex: 1 1 320px;
    max-width: 420px;
    @include flex(column, flex-start, flex-start, 1.4rem);
  }

  &__lede {
    color: rgba($quartz, 0.75);
    font-size: $text-sm;
  }

  &__col {
    flex: 0 1 200px;
    @include flex(column, flex-start, flex-start, 0.65rem);
    font-size: $text-sm;

    a {
      @include flex(row, center, flex-start, 0.5rem);
    }
  }

  &__head {
    @include eyebrow;
    color: $silver;
    margin-bottom: 0.4rem;
  }

  &__muted {
    color: rgba($quartz, 0.55);
  }

  // El nombre a todo el ancho, como firma al final de la página.
  &__word {
    @include caps(clamp(6rem, 25vw, 26rem));
    text-align: center;
    margin-top: $space-xl;
    color: $quartz;
    white-space: nowrap;
    line-height: 0.78;
  }

  &__bottom {
    @include flex(row, center, space-between, 1rem);
    flex-wrap: wrap;
    border-top: 1px solid rgba($quartz, 0.14);
    padding-top: 1.2rem;
    margin-top: 1.5rem;
    font-family: $font-mono;
    font-size: 0.68rem;
    letter-spacing: 0.06em;
    color: rgba($quartz, 0.6);
  }
}
</style>
