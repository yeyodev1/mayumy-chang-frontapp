<script setup lang="ts">
import { ref, toRef } from 'vue'
import type { Product, ProductImage } from '@/types'
import { useAdminProductImages } from '@/composables/useAdminProductImages'
import { cldUrl } from '@/utils/cloudinary'
import BaseModal from '@/components/ui/BaseModal.vue'
import AdminCard from './AdminCard.vue'

const props = defineProps<{ product: Product | null }>()
const emit = defineEmits<{ updated: [product: Product] }>()

const { uploads, busy, upload, dismissUpload, remove, move, makeCover } = useAdminProductImages(
  toRef(props, 'product'),
  (p) => emit('updated', p),
)

const input = ref<HTMLInputElement | null>(null)
const dragOver = ref(false)
const dragFrom = ref<number | null>(null)
const dropAt = ref<number | null>(null)
const toDelete = ref<ProductImage | null>(null)

// Las sembradas son relativas (/products/x.webp) y se sirven desde este mismo front.
const img = (url: string) => cldUrl(url, { w: 360 })
const roleOf = (i: number) => (i === 0 ? 'Portada' : i === 1 ? 'Puesta' : '')

function onPick(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (files?.length) upload(files)
  ;(e.target as HTMLInputElement).value = ''
}

function onDrop(e: DragEvent) {
  dragOver.value = false
  // Soltar archivos sube; soltar una foto de la lista sobre la zona no hace nada.
  if (e.dataTransfer?.files.length) upload(e.dataTransfer.files)
}

function onReorderDrop(to: number) {
  if (dragFrom.value !== null) move(dragFrom.value, to)
  dragFrom.value = null
  dropAt.value = null
}

function confirmDelete() {
  if (toDelete.value) remove(toDelete.value)
  toDelete.value = null
}
</script>

<template>
  <AdminCard title="Fotos" icon="fa-regular fa-images">
    <p v-if="!product" class="imgs__locked">
      <i class="fa-solid fa-lock" aria-hidden="true"></i>
      Guarda la pieza primero; después podrás subirle fotos.
    </p>

    <template v-else>
      <p class="imgs__guide">
        La primera foto es la portada (fondo neutro); la segunda se ve al pasar el cursor (puesta). Arrastra para
        cambiar el orden.
      </p>

      <ol v-if="product.images.length || uploads.length" class="imgs__list" :class="{ 'is-busy': busy }">
        <li
          v-for="(image, i) in product.images"
          :key="image.url"
          class="imgs__item"
          :class="{ 'imgs__item--target': dropAt === i && dragFrom !== i }"
          draggable="true"
          @dragstart="dragFrom = i"
          @dragend="dragFrom = null; dropAt = null"
          @dragover.prevent="dropAt = i"
          @drop.prevent="onReorderDrop(i)"
        >
          <div class="imgs__frame">
            <img :src="img(image.url)" :alt="`Foto ${i + 1} de ${product.name}`" loading="lazy" draggable="false" />
            <span v-if="roleOf(i)" class="imgs__role" :class="{ 'imgs__role--cover': i === 0 }">{{ roleOf(i) }}</span>
          </div>
          <div class="imgs__tools">
            <button type="button" :disabled="busy || i === 0" :aria-label="`Mover foto ${i + 1} antes`" @click="move(i, i - 1)">
              <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
            </button>
            <button
              type="button"
              :disabled="busy || i === product.images.length - 1"
              :aria-label="`Mover foto ${i + 1} después`"
              @click="move(i, i + 1)"
            >
              <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
            </button>
            <button v-if="i !== 0" type="button" :disabled="busy" :aria-label="`Usar foto ${i + 1} como portada`" title="Usar como portada" @click="makeCover(i)">
              <i class="fa-regular fa-star" aria-hidden="true"></i>
            </button>
            <button type="button" class="imgs__del" :disabled="busy" :aria-label="`Eliminar foto ${i + 1}`" @click="toDelete = image">
              <i class="fa-solid fa-trash-can" aria-hidden="true"></i>
            </button>
          </div>
        </li>
        <li v-for="u in uploads" :key="u.id" class="imgs__item imgs__item--uploading">
          <div class="imgs__frame">
            <img :src="u.preview" :alt="`Subiendo ${u.name}`" />
            <span v-if="!u.error" class="imgs__progress" :style="{ transform: `scaleX(${u.progress / 100})` }"></span>
          </div>
          <p v-if="u.error" class="imgs__error" role="alert">
            {{ u.error }}
            <button type="button" @click="dismissUpload(u.id)">Quitar</button>
          </p>
          <p v-else class="imgs__pct" aria-live="polite">{{ u.progress < 100 ? `Subiendo ${u.progress}%` : 'Procesando…' }}</p>
        </li>
      </ol>

      <div
        class="imgs__drop"
        :class="{ 'imgs__drop--over': dragOver }"
        @dragenter.prevent="dragOver = dragFrom === null"
        @dragover.prevent="dragOver = dragFrom === null"
        @dragleave="dragOver = false"
        @drop.prevent="onDrop"
      >
        <p>Arrastra fotos aquí o</p>
        <button type="button" class="btn btn--ghost" @click="input?.click()">Elegir fotos</button>
        <small>JPG, PNG o WebP, hasta 8 MB.</small>
        <input ref="input" type="file" accept="image/*" multiple class="visually-hidden" tabindex="-1" @change="onPick" />
      </div>
    </template>

    <BaseModal
      :open="Boolean(toDelete)"
      title="¿Eliminar esta foto?"
      message="Se borra de la pieza y no se puede recuperar."
      confirm-label="Eliminar"
      danger
      @confirm="confirmDelete"
      @cancel="toDelete = null"
    />
  </AdminCard>
</template>

<style scoped lang="scss">
.imgs {
  &__locked {
    @include flex(row, center, flex-start, 0.6rem);
    padding: 1rem;
    border-radius: $radius-sm;
    background: $quartz;
    color: $ink-soft;
    font-size: 0.9rem;
  }

  &__guide {
    margin: -0.4rem 0 1rem;
    font-size: 0.84rem;
    color: $ink-soft;
    line-height: 1.5;
  }

  &__list {
    list-style: none;
    @include flex-cards(130px, 0.75rem);
    margin-bottom: 1rem;

    > li {
      max-width: calc(50% - 0.375rem);
    }

    &.is-busy {
      opacity: 0.6;
      pointer-events: none;
    }
  }

  &__item {
    @include flex(column, stretch, flex-start, 0.35rem);
    cursor: grab;

    &--target .imgs__frame {
      outline: 2px solid $basalt;
      outline-offset: 2px;
    }
  }

  &__frame {
    position: relative;
    aspect-ratio: 4 / 5;
    border-radius: $radius-sm;
    overflow: hidden;
    background: $quartz;
    border: 1px solid $line;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__role {
    position: absolute;
    left: 0.35rem;
    top: 0.35rem;
    padding: 0.1rem 0.45rem;
    border-radius: $radius-sm;
    background: rgba($frost, 0.92);
    color: $ink;
    font-family: $font-mono;
    font-size: 0.62rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;

    &--cover {
      background: $basalt;
      color: $frost;
    }
  }

  &__progress {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 4px;
    background: $basalt;
    transform-origin: left;
    transition: transform 0.2s linear;
  }

  &__tools {
    @include flex(row, center, space-between, 0.1rem);

    button {
      @include flex(row, center, center);
      flex: 1;
      height: 2.5rem;
      border-radius: $radius-sm;
      color: $ink-soft;
      font-size: 0.82rem;
      @include focus-ring;

      &:hover:not(:disabled) {
        background: $quartz;
        color: $ink;
      }

      &:disabled {
        opacity: 0.3;
      }
    }
  }

  &__del:hover:not(:disabled) {
    color: $danger !important;
  }

  &__pct {
    font-family: $font-mono;
    font-size: 0.72rem;
    color: $ink-soft;
    text-align: center;
  }

  &__error {
    font-size: 0.78rem;
    color: $danger;

    button {
      text-decoration: underline;
    }
  }

  &__drop {
    @include flex(column, center, center, 0.5rem);
    padding: 1.4rem 1rem;
    border: 1px dashed $ink-muted;
    border-radius: $radius-md;
    text-align: center;
    color: $ink-soft;
    font-size: 0.9rem;
    transition: border-color 0.2s ease, background-color 0.2s ease;

    small {
      font-size: 0.78rem;
      color: $ink-muted;
    }

    &--over {
      border-color: $basalt;
      background: $quartz;
    }
  }
}
</style>
