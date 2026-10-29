<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { AdminStats } from '@/types'
import { formatCents } from '@/utils/format'
import { formatDay } from './adminFormat'

const props = defineProps<{ days: AdminStats['salesLast30'] }>()

const box = ref<HTMLElement | null>(null)
const width = ref(640)
const HEIGHT = 220
const PAD = { top: 12, right: 8, bottom: 26, left: 52 }
let observer: ResizeObserver | null = null

onMounted(() => {
  if (!box.value) return
  width.value = box.value.clientWidth
  observer = new ResizeObserver(([entry]) => {
    if (entry) width.value = Math.max(280, entry.contentRect.width)
  })
  observer.observe(box.value)
})
onBeforeUnmount(() => observer?.disconnect())

const data = computed(() => [...props.days].sort((a, b) => a.date.localeCompare(b.date)))
const totalCents = computed(() => data.value.reduce((s, d) => s + d.revenueCents, 0))
const totalOrders = computed(() => data.value.reduce((s, d) => s + d.orders, 0))

// Eje en dólares con 3 líneas de referencia "redondas".
const ticks = computed(() => {
  const max = Math.max(...data.value.map((d) => d.revenueCents), 0) / 100
  if (max <= 0) return [0, 25, 50, 75]
  const raw = max / 3
  const mag = 10 ** Math.floor(Math.log10(raw))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw
  return [0, step, step * 2, step * 3]
})
const yMax = computed(() => ticks.value[ticks.value.length - 1]! * 100)

const plotW = computed(() => width.value - PAD.left - PAD.right)
const plotH = HEIGHT - PAD.top - PAD.bottom
const slot = computed(() => plotW.value / Math.max(1, data.value.length))
const barW = computed(() => Math.max(3, Math.min(22, slot.value - 2)))

const y = (cents: number) => PAD.top + plotH - (cents / yMax.value) * plotH

const bars = computed(() =>
  data.value.map((d, i) => {
    const h = Math.max(d.revenueCents > 0 ? 2 : 0, (d.revenueCents / yMax.value) * plotH)
    const x = PAD.left + i * slot.value + (slot.value - barW.value) / 2
    return { ...d, i, x, h, top: PAD.top + plotH - h, label: formatDay(d.date) }
  }),
)

// Solo algunas fechas en el eje, para que no se pisen en móvil.
const every = computed(() => (width.value < 520 ? 7 : 5))

// Barra con punta redondeada de 4px y base recta sobre la línea de cero.
function barPath(x: number, top: number, w: number, h: number) {
  const r = Math.min(4, w / 2, h)
  const b = top + h
  return `M${x},${b}V${top + r}Q${x},${top} ${x + r},${top}H${x + w - r}Q${x + w},${top} ${x + w},${top + r}V${b}Z`
}

const active = ref<number | null>(null)
const tip = computed(() => (active.value === null ? null : bars.value[active.value]))
const tipLeft = computed(() => {
  if (!tip.value) return 0
  const center = tip.value.x + barW.value / 2
  return Math.min(Math.max(center, 80), width.value - 80)
})
</script>

<template>
  <figure class="chart">
    <figcaption class="chart__head">
      <span class="chart__title">Ventas de los últimos 30 días</span>
      <span class="chart__sum">
        <strong>{{ formatCents(totalCents) }}</strong> · {{ totalOrders }} {{ totalOrders === 1 ? 'pedido' : 'pedidos' }}
      </span>
    </figcaption>

    <div ref="box" class="chart__box" @mouseleave="active = null">
      <svg :width="width" :height="HEIGHT" :viewBox="`0 0 ${width} ${HEIGHT}`" aria-hidden="true" focusable="false">
        <g class="chart__grid">
          <template v-for="t in ticks" :key="t">
            <line :x1="PAD.left" :x2="width - PAD.right" :y1="y(t * 100)" :y2="y(t * 100)" :class="{ 'is-zero': t === 0 }" />
            <text :x="PAD.left - 8" :y="y(t * 100) + 4" text-anchor="end">${{ t.toLocaleString('es-EC') }}</text>
          </template>
        </g>
        <path
          v-for="b in bars"
          :key="b.date"
          :d="barPath(b.x, b.top, barW, b.h)"
          class="chart__bar"
          :class="{ 'is-active': active === b.i, 'is-dim': active !== null && active !== b.i }"
        />
        <g class="chart__x">
          <text
            v-for="b in bars.filter((_, i) => (bars.length - 1 - i) % every === 0)"
            :key="b.date"
            :x="b.i === bars.length - 1 ? b.x + barW : b.x + barW / 2"
            :y="HEIGHT - 6"
            :text-anchor="b.i === bars.length - 1 ? 'end' : 'middle'"
          >
            {{ b.label.replace(/^\S+\s/, '') }}
          </text>
        </g>
      </svg>

      <!-- Zonas de toque más grandes que la barra; también navegables con teclado. -->
      <button
        v-for="b in bars"
        :key="`hit-${b.date}`"
        type="button"
        class="chart__hit"
        :style="{ left: `${PAD.left + b.i * slot}px`, width: `${slot}px`, top: `${PAD.top}px`, height: `${plotH}px` }"
        :aria-label="`${b.label}: ${formatCents(b.revenueCents)}, ${b.orders} pedidos`"
        @mouseenter="active = b.i"
        @focus="active = b.i"
        @blur="active = null"
        @click="active = b.i"
      ></button>

      <div v-if="tip" class="chart__tip" :style="{ left: `${tipLeft}px`, top: `${Math.max(tip.top - 8, 0)}px` }" aria-hidden="true">
        <span class="chart__tip-day" style="display: block">{{ tip.label }}</span>
        <strong>{{ formatCents(tip.revenueCents) }}</strong>
        <span>{{ tip.orders }} {{ tip.orders === 1 ? 'pedido' : 'pedidos' }}</span>
      </div>
    </div>

    <table class="visually-hidden">
      <caption>Ventas por día, últimos 30 días</caption>
      <thead><tr><th scope="col">Día</th><th scope="col">Ventas</th><th scope="col">Pedidos</th></tr></thead>
      <tbody>
        <tr v-for="d in data" :key="d.date"><td>{{ formatDay(d.date) }}</td><td>{{ formatCents(d.revenueCents) }}</td><td>{{ d.orders }}</td></tr>
      </tbody>
    </table>
  </figure>
</template>

<style scoped lang="scss">
.chart {
  &__head {
    @include flex(row, baseline, space-between, 0.4rem 1rem);
    flex-wrap: wrap;
    margin-bottom: 0.8rem;
  }

  &__title {
    font-family: $font-serif;
    font-size: 1.4rem;
    line-height: 1.1;
    color: $ink;
  }

  &__sum {
    font-size: 0.88rem;
    color: $ink-soft;

    strong {
      color: $ink;
      font-variant-numeric: tabular-nums;
    }
  }

  &__box {
    position: relative;
    width: 100%;

    svg {
      display: block;
    }
  }

  &__grid {
    line {
      stroke: $line;
      stroke-width: 1;
      stroke-dasharray: 2 4;

      &.is-zero {
        stroke: $ink-muted;
        stroke-dasharray: none;
      }
    }
  }

  &__grid text,
  &__x text {
    font-family: $font-mono;
    font-size: 10px;
    fill: $ink-muted;
    font-variant-numeric: tabular-nums;
  }

  &__bar {
    fill: $basalt;
    transition: opacity 0.15s ease;

    &.is-active {
      fill: $zafiro;
    }

    &.is-dim {
      opacity: 0.45;
    }
  }

  &__hit {
    position: absolute;
    background: transparent;
    border-radius: 4px;

    &:focus-visible {
      outline: 2px solid $basalt;
      outline-offset: 0;
    }
  }

  &__tip {
    position: absolute;
    transform: translate(-50%, -100%);
    @include flex(column, center, flex-start, 0);
    padding: 0.45rem 0.75rem;
    border-radius: $radius-sm;
    background: $basalt;
    color: $frost;
    font-size: 0.78rem;
    white-space: nowrap;
    pointer-events: none;
    box-shadow: $shadow-md;
    z-index: 3;

    strong {
      font-family: $font-serif;
      font-size: 1.15rem;
      font-weight: 400;
      font-variant-numeric: tabular-nums;
    }
  }

  &__tip-day {
    color: $silver;

    &::first-letter {
      text-transform: uppercase;
    }
  }
}
</style>
