<script setup lang="ts">
import type { Product } from '@/types'
import { useAdminCategories } from '@/composables/useAdminCategories'
import { useAdminProducts } from '@/composables/useAdminProducts'
import { formatCents } from '@/utils/format'
import { cldUrl } from '@/utils/cloudinary'
import { segmentName, stoneOf } from '@/components/admin/adminCatalog'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminSearch from '@/components/admin/AdminSearch.vue'
import AdminTable from '@/components/admin/AdminTable.vue'
import AdminPagination from '@/components/admin/AdminPagination.vue'
import AdminState from '@/components/admin/AdminState.vue'
import ProductFilters from '@/components/admin/products/ProductFilters.vue'
import ProductStockStepper from '@/components/admin/products/ProductStockStepper.vue'
import ProductStateTag from '@/components/admin/products/ProductStateTag.vue'

const { search, page, filters, items, total, pages, loading, error, load, goTo, stockBusy, adjustStock } =
  useAdminProducts()

const { categories, load: loadCategories, labelOf: categoryLabel } = useAdminCategories()
loadCategories()

const thumb = (p: Product) => cldUrl(p.images[0]?.url, { w: 120 })
const filtered = () => Boolean(search.value || filters.segment || filters.stock || filters.category)
</script>

<template>
  <section>
    <AdminPageHeader eyebrow="Catálogo" title="Productos">
      <RouterLink :to="{ name: 'AdminProductNew' }" class="btn btn--primary">
        <i class="fa-solid fa-plus" aria-hidden="true"></i> Nueva pieza
      </RouterLink>
    </AdminPageHeader>

    <div class="products__tools">
      <AdminSearch v-model="search" label="Buscar piezas" placeholder="Nombre, línea o material" />
      <ProductFilters :filters="filters" :categories="categories" />
    </div>

    <AdminState
      :loading="loading && !items.length"
      :error="error"
      :empty="!items.length"
      empty-icon="fa-regular fa-gem"
      :empty-text="filtered() ? 'Ninguna pieza coincide con ese filtro.' : 'Aún no hay piezas.'"
      @retry="load"
    />

    <AdminTable v-if="items.length" caption="Piezas del catálogo" :class="{ 'is-stale': loading }">
      <thead>
        <tr>
          <th scope="col">Pieza</th>
          <th scope="col">Segmento</th>
          <th scope="col">Categoría</th>
          <th scope="col">Piedra</th>
          <th scope="col" class="is-num">Precio</th>
          <th scope="col">Stock</th>
          <th scope="col">Estado</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in items" :key="p._id" :class="{ 'products__row--muted': !p.isPublished }">
          <td class="is-primary">
            <span class="products__name">
              <span class="products__thumb">
                <img v-if="thumb(p)" :src="thumb(p)" alt="" loading="lazy" />
                <i v-else class="fa-regular fa-image" aria-hidden="true"></i>
              </span>
              <span class="products__title">
                <RouterLink :to="{ name: 'AdminProductEdit', params: { id: p._id } }" class="row-link">
                  {{ p.name }}
                </RouterLink>
                <span v-if="p.isPieceOfMonth || p.isBestSeller" class="products__badges">
                  <span v-if="p.isPieceOfMonth" class="products__badge products__badge--month">Pieza del mes</span>
                  <span v-if="p.isBestSeller" class="products__badge">Más vendido</span>
                </span>
              </span>
            </span>
          </td>
          <td data-label="Segmento" class="products__muted">{{ segmentName(p.segment) }}</td>
          <td data-label="Categoría" class="products__muted">{{ categoryLabel(p.category) }}</td>
          <td data-label="Piedra">
            <span class="products__stone">
              <span
                class="products__dot"
                :class="{ 'products__dot--none': p.stone === 'ninguna' }"
                :style="{ background: stoneOf(p.stone).color }"
                aria-hidden="true"
              ></span>
              {{ stoneOf(p.stone).name }}
            </span>
          </td>
          <td data-label="Precio" class="is-num products__price">
            <s v-if="p.compareAtPriceCents" class="products__was">{{ formatCents(p.compareAtPriceCents) }}</s>
            {{ formatCents(p.priceFromCents) }}
          </td>
          <td data-label="Stock">
            <ProductStockStepper :product="p" :busy="stockBusy === p._id" @change="adjustStock(p, $event)" />
          </td>
          <td data-label="Estado"><ProductStateTag :product="p" /></td>
        </tr>
      </tbody>
    </AdminTable>

    <AdminPagination :page="page" :pages="pages" :total="total" noun="piezas" @go="goTo" />
  </section>
</template>

<style scoped lang="scss">
.products {
  &__tools {
    @include flex(row, center, flex-start, 0.7rem);
    flex-wrap: wrap;
    margin-bottom: 1.2rem;

    > * {
      flex: 1 1 100%;
    }
  }

  &__name {
    @include flex(row, center, flex-start, 0.85rem);
    min-width: 0;
  }

  &__title {
    @include flex(column, flex-start, center, 0.3rem);
    min-width: 0;

    a {
      font-family: $font-serif;
      font-weight: 400;
      font-size: 1.2rem;
      line-height: 1.15;
      color: $ink;
    }
  }

  &__thumb {
    @include flex(row, center, center);
    width: 3.4rem;
    height: 3.4rem;
    flex-shrink: 0;
    border-radius: $radius-sm;
    background: $quartz;
    color: $ink-muted;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__badges {
    @include flex(row, center, flex-start, 0.3rem);
    flex-wrap: wrap;
  }

  &__badge {
    @include eyebrow;
    padding: 0.1rem 0.45rem;
    border: 1px solid $line;
    border-radius: $radius-sm;
    font-size: 0.62rem;

    &--month {
      border-color: $zafiro;
      color: $zafiro;
    }
  }

  &__muted {
    font-size: 0.88rem;
    color: $ink-soft;
  }

  &__stone {
    @include flex(row, center, flex-start, 0.45rem);
    font-size: 0.88rem;
    white-space: nowrap;
  }

  &__dot {
    width: 0.7rem;
    height: 0.7rem;
    border-radius: 50%;
    box-shadow: inset 0 0 0 1px rgba($basalt, 0.15);

    &--none {
      border: 1px dashed $ink-muted;
      box-shadow: none;
    }
  }

  &__price {
    font-family: $font-mono;
    font-size: 0.9rem;
    white-space: nowrap;
  }

  &__was {
    margin-right: 0.35rem;
    color: $ink-muted;
    font-size: 0.8rem;
  }

  &__row--muted .products__title a {
    color: $ink-muted;
  }
}

.is-stale {
  opacity: 0.55;
}
</style>
