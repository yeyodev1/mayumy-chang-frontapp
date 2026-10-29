<script setup lang="ts">
/**
 * Tabla del panel. En escritorio es una tabla real; bajo 900 px cada fila se
 * vuelve una tarjeta y cada celda muestra su `data-label` a la izquierda.
 * Clases para las celdas:
 *  - `is-primary`: título de la tarjeta (ocupa todo el ancho, sin label).
 *  - `is-num`: alineada a la derecha, cifras tabulares.
 *  - `is-actions`: botones; en móvil va al pie de la tarjeta.
 * Un `<RouterLink class="row-link">` dentro de la fila hace clickeable toda la fila.
 */
defineProps<{ caption: string }>()
</script>

<template>
  <div class="atable-wrap">
    <table class="atable">
      <caption class="visually-hidden">
        {{
          caption
        }}
      </caption>
      <slot />
    </table>
  </div>
</template>

<style scoped lang="scss">
$cards-until: 900px;

.atable-wrap {
  width: 100%;
}

.atable {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.92rem;

  :deep(thead) {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }

  :deep(tbody) {
    @include flex(column, stretch, flex-start, 0.65rem);
  }

  :deep(tr) {
    position: relative;
    @include flex(row, center, space-between, 0.35rem 1rem);
    flex-wrap: wrap;
    padding: 0.95rem 1rem;
    background: $surface;
    border: 1px solid $line;
    border-radius: $radius-md;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;

    &:hover {
      border-color: $silver;
    }

    &:focus-within {
      box-shadow: 0 0 0 2px $basalt;
    }
  }

  :deep(td) {
    @include flex(row, center, space-between, 0.8rem);
    flex: 1 1 100%;
    min-width: 0;
    color: $ink;

    &[data-label]::before {
      content: attr(data-label);
      font-family: $font-mono;
      font-size: 0.68rem;
      letter-spacing: 0.06em;
      color: $ink-muted;
      text-transform: uppercase;
      flex-shrink: 0;
    }

    &.is-primary {
      order: -1;
      font-weight: 700;
      padding-bottom: 0.35rem;

      &::before {
        display: none;
      }
    }

    &.is-num {
      font-variant-numeric: tabular-nums;
    }

    &.is-actions {
      justify-content: flex-end;
      padding-top: 0.45rem;
      position: relative;
      z-index: 2;

      &::before {
        display: none;
      }
    }
  }

  :deep(.row-link) {
    @include focus-ring;
    outline: none;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 1;
      border-radius: inherit;
    }
  }

  // ─── Escritorio: tabla real ─────────────────────────────────────────
  @media (min-width: $cards-until) {
    background: $surface;
    border: 1px solid $line;
    border-radius: $radius-md;
    overflow: hidden;

    :deep(thead) {
      position: static;
      width: auto;
      height: auto;
      overflow: visible;
      clip-path: none;
      display: table-header-group;
    }

    :deep(tbody) {
      display: table-row-group;
    }

    :deep(tr) {
      display: table-row;
      padding: 0;
      background: none;
      border: 0;
      border-radius: 0;

      &:hover td {
        background: rgba($quartz, 0.55);
      }

      &:focus-within {
        box-shadow: inset 3px 0 0 $basalt;
      }
    }

    :deep(th) {
      padding: 0.8rem 1rem;
      text-align: left;
      font-family: $font-mono;
      font-size: 0.68rem;
      font-weight: 500;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: $ink-muted;
      background: rgba($quartz, 0.6);
      border-bottom: 1px solid $line;
      white-space: nowrap;

      &.is-num {
        text-align: right;
      }
    }

    // Safari ignora position: relative en un table-row: el ::after del row-link
    // se estiraba sobre toda la página y cualquier clic abría el último producto.
    // En escritorio el área clicable queda en la celda del enlace.
    :deep(td) {
      position: relative;
      display: table-cell;
      padding: 0.85rem 1rem;
      vertical-align: middle;
      border-bottom: 1px solid $line;
      transition: background-color 0.15s ease;

      &::before {
        display: none;
      }

      &.is-primary {
        padding-bottom: 0.85rem;
      }

      &.is-num {
        text-align: right;
      }

      &.is-actions {
        text-align: right;
        padding-top: 0.85rem;
        white-space: nowrap;
      }
    }

    :deep(tr:last-child td) {
      border-bottom: 0;
    }
  }
}
</style>
