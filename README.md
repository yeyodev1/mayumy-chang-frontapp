# Mayumy Chang · Alta Joyería — frontapp

Tienda en línea y panel de administración de Mayumy Chang (Guayaquil).
Vue 3 + Vite + TypeScript + SCSS + Pinia + vue-router + GSAP + Lenis. Se despliega en Vercel como SPA.
El API vive en el repo hermano `mayumy-chang-backapp`.

## Setup local

```bash
pnpm install
cp .env.example .env        # VITE_API_BASE_URL apunta al backapp local (:8110)
pnpm dev                    # http://localhost:5277
```

## Scripts

| Script | Qué hace |
|---|---|
| `pnpm dev` | servidor de desarrollo |
| `pnpm build` | `vue-tsc -b && vite build` (el type-check corre acá) |
| `pnpm typecheck` | solo type-check |
| `pnpm format` | Prettier |

## Qué hay

- **Tienda**: home editorial (pieza del mes, lo más vendido, colección Galápagos, cinco piedras, categorías,
  diseño a medida), tienda filtrable por metal / categoría / piedra (filtros en la URL), ficha de pieza,
  bolsa lateral, checkout de una página con envío Servientrega calculado por ciudad, pago con Payphone o
  transferencia, seguimiento de pedido.
- **Panel** (`/admin`): pedidos, piezas (stock, pieza del mes, agotado visible u oculto, fotos en Cloudinary),
  categorías, solicitudes (citas a medida y lista de espera de Galápagos), clientes, ajustes de envío,
  agenda de Confirmafy, contacto y pagos.
- Videos de las piezas generados con Higgsfield a partir de las fotos reales (`public/video`).

## Producción

`vercel.json` reescribe `/api/*` al backapp, así el front habla con el API en el mismo origen.
