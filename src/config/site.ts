import type { Segment, Stone } from '@/types'

/**
 * El copy es configuración: todos los textos y datos de la marca viven acá.
 * Los componentes solo consumen y pintan. Fuente: reunión con Mayumy del 12-oct-2026
 * y las fotos de la colección. Lo editable a diario (envío, citas, WhatsApp,
 * Galápagos) llega del panel por /store/config.
 */
export const site = {
  name: 'Mayumy Chang',
  shortName: 'Mayumy Chang',
  tagline: 'Alta joyería de autor',
  description: 'Joyería de autor diseñada en Guayaquil por Mayumy Chang.',
  city: 'Guayaquil',
  email: '',
  // Solo dígitos con código de país (respaldo si el panel no trae uno)
  whatsapp: '593985870627',
  whatsappDisplay: '+593 98 587 0627',
  social: {
    instagram: '',
    instagramHandle: '',
    facebook: '',
    tiktok: '',
  },
  update: {
    text: 'Hay una nueva versión de la tienda.',
    action: 'Actualizar',
  },
  announcement: 'Envío a todo Ecuador con Servientrega · Piezas únicas · Empaque de regalo sin costo',
  nav: [
    { label: 'Tienda', to: '/tienda' },
    { label: 'Oro 18K', to: '/tienda?segmento=oro-18k' },
    { label: 'Plata 925', to: '/tienda?segmento=plata-925' },
    { label: 'Semijoyas', to: '/tienda?segmento=semijoyas' },
    { label: 'A medida', to: '/a-medida' },
  ],

  segments: [
    { id: 'oro-18k', label: 'Oro 18K', short: 'Oro', note: 'Oro de 18 quilates' },
    { id: 'plata-925', label: 'Plata 925', short: 'Plata', note: 'Plata de ley' },
    { id: 'semijoyas', label: 'Semijoyas', short: 'Semi', note: 'Para todos los días' },
  ] as { id: Segment; label: string; short: string; note: string }[],

  // Las cinco luces: cada piedra es un capítulo de la home y un filtro de la tienda.
  stones: [
    { id: 'zafiro', name: 'Zafiro', color: '#1d2a8c', video: 'zafiro', line: 'El azul más profundo de la colección. Se nota sin decir nada.' },
    { id: 'esmeralda', name: 'Esmeralda', color: '#0a7350', video: 'esmeralda', line: 'Un verde vivo que ilumina la cara, igual con negro que con blanco.' },
    { id: 'cristal', name: 'Cristal', color: '#8fa6b2', video: 'cristal', line: 'Transparente: refleja todo lo que tiene cerca. Combina con todo.' },
    { id: 'granate', name: 'Granate', color: '#9c2b19', video: 'granate', line: 'Un rojo profundo que se vuelve ámbar cuando le da la luz.' },
    { id: 'citrino', name: 'Citrino', color: '#d99f0a', video: 'citrino', line: 'Amarillo de sol, con corazones calados que solo ve quien la lleva.' },
  ] as { id: Stone; name: string; color: string; video: string; line: string }[],

  home: {
    hero: {
      eyebrow: 'Alta joyería · Guayaquil',
      lede: 'Piezas de autor en oro 18K, plata 925 y semijoyas. Diseñadas por Mayumy Chang, casi todas únicas.',
      primary: 'Ver la tienda',
      secondary: 'Diseñar mi anillo',
      scroll: 'Desliza',
      captions: ['Heptágono · Zafiro', 'Corona · Citrino', 'Heptágono · Esmeralda'],
    },
    month: {
      eyebrow: 'Pieza del mes',
      cta: 'Añadir a la bolsa',
      view: 'Ver la pieza',
    },
    bestSellers: {
      eyebrow: 'Lo más vendido',
      title: 'Las que se van primero',
      note: 'Casi todas son piezas únicas: cuando se venden, no vuelven.',
      cta: 'Ver toda la tienda',
    },
    collab: {
      formTitle: 'Entra a la lista privada',
      formText: 'Te avisamos antes que a nadie cuando abra la colección. Piezas numeradas, cupos limitados.',
      name: 'Tu nombre',
      email: 'Tu correo',
      submit: 'Quiero estar en la lista',
      sending: 'Enviando…',
      done: 'Estás en la lista. Te escribiremos antes del lanzamiento.',
    },
    stones: {
      eyebrow: 'Cinco luces',
      title: 'Elige tu piedra',
      cta: 'Ver piezas en {stone}',
    },
    categories: {
      eyebrow: 'Compra por pieza',
      title: 'Todo, ordenado como lo buscas',
      empty: 'Muy pronto',
    },
    designer: {
      eyebrow: 'La diseñadora',
      title: 'Doce años diseñando joyas',
      text: [
        'Mayumy Chang dibuja cada pieza antes de que exista. Elige las piedras, decide la forma y revisa el acabado antes de que una joya llegue a la tienda.',
        'Su firma es la geometría limpia: siete baguettes que forman un heptágono, una corona que esconde corazones por detrás. Detalles que se descubren de cerca.',
      ],
      signature: 'Mayumy Chang',
      role: 'Diseñadora y fundadora',
    },
    service: [
      { icon: 'fa-truck-fast', title: 'Envío con Servientrega', text: '{local} en {city} · {national} al resto del país' },
      { icon: 'fa-lock', title: 'Pago seguro', text: 'Tarjeta de débito o crédito, o transferencia' },
      { icon: 'fa-gift', title: 'Empaque de regalo', text: 'Sin costo. Incluye una nota escrita a mano' },
      { icon: 'fa-gem', title: 'Piezas únicas', text: 'Si te gusta, no esperes: hay una sola' },
    ],
  },

  bespoke: {
    eyebrow: 'Diseño a medida',
    title: 'Tu anillo, dibujado contigo',
    text: 'Anillos de compromiso y piezas personalizadas en oro 18K. Te sentamos en el taller, bocetamos juntos y fabricamos la joya a tu medida.',
    // Es un proceso real y en este orden: por eso va numerado.
    steps: [
      { title: 'Agenda tu cita', text: 'Eliges día y hora en línea. La cita es en el taller, en Guayaquil.' },
      { title: 'Boceto en el taller', text: 'Mayumy dibuja contigo, te muestra piedras y metales, y ajustamos hasta que sea tuyo.' },
      { title: 'Fabricación y entrega', text: 'Hacemos la pieza a mano y te avisamos cuando está lista para entregarla.' },
    ],
    book: 'Agendar mi cita',
    bookWhatsapp: 'Agendar por WhatsApp',
    whatsappMsg: 'Hola Mayumy, quiero agendar una cita para diseñar una joya a medida.',
    formTitle: '¿Prefieres que te llamemos?',
    formText: 'Déjanos tus datos y una idea de lo que buscas. Te escribimos en menos de un día hábil.',
    name: 'Tu nombre',
    email: 'Tu correo',
    phone: 'Tu WhatsApp',
    idea: 'Cuéntanos tu idea',
    ideaPlaceholder: 'Anillo de compromiso en oro blanco, piedra central ovalada…',
    budget: 'Presupuesto aproximado',
    budgets: ['Hasta $1.000', '$1.000 – $2.500', '$2.500 – $5.000', 'Más de $5.000'],
    submit: 'Enviar mi idea',
    sending: 'Enviando…',
    done: 'Recibimos tu idea. Mayumy te escribirá muy pronto.',
  },

  shop: {
    eyebrow: 'Tienda',
    title: 'Todas las piezas',
    all: 'Todo',
    allSegments: 'Todos los metales',
    stoneFilter: 'Piedra',
    sortLabel: 'Ordenar',
    sorts: [
      { id: 'order', label: 'Destacadas' },
      { id: 'new', label: 'Lo nuevo' },
      { id: 'price-asc', label: 'Precio: menor a mayor' },
      { id: 'price-desc', label: 'Precio: mayor a menor' },
    ],
    count: '{n} piezas',
    countOne: '1 pieza',
    empty: {
      title: 'Aún no hay piezas aquí',
      text: 'Estamos preparando esta selección. Mientras tanto, mira lo que ya está disponible o diseña una pieza a medida.',
      reset: 'Ver todas las piezas',
      bespoke: 'Diseñar a medida',
    },
    soldOut: 'Agotado',
    unique: 'Pieza única',
    lastOnes: 'Últimas {n}',
    quickAdd: 'Añadir',
    added: 'En tu bolsa',
  },

  product: {
    addToBag: 'Añadir a la bolsa',
    soldOut: 'Agotada',
    soldOutText: 'Esta pieza ya se vendió. Escríbenos si quieres algo parecido.',
    askSimilar: 'Pedir una similar',
    unique: 'Pieza única · solo hay una',
    stockLeft: 'Quedan {n}',
    details: 'Ficha',
    material: 'Material',
    shippingTitle: 'Envío y entrega',
    shippingText: 'Servientrega: {local} en {city}, {national} al resto del país. Llega en 24 a 72 horas hábiles.',
    pickupText: 'También puedes retirarla en el taller, con cita.',
    giftTitle: 'Para regalar',
    giftText: 'Va en estuche con nota escrita a mano, sin costo.',
    careTitle: 'Cuidado',
    careText: 'Guárdala sola en su estuche y evita perfumes y agua de mar. Límpiala con un paño suave.',
    related: 'Combínala con',
    back: 'Volver a la tienda',
    whatsappMsg: 'Hola Mayumy, me interesa la pieza «{name}».',
  },

  bag: {
    title: 'Tu bolsa',
    empty: 'Tu bolsa está vacía',
    emptyText: 'Las piezas únicas se van rápido. Mira lo más vendido.',
    emptyCta: 'Ir a la tienda',
    subtotal: 'Subtotal',
    shippingNote: 'El envío se calcula con tu ciudad en el siguiente paso.',
    checkout: 'Finalizar compra',
    keep: 'Seguir mirando',
    remove: 'Quitar',
    uniqueNote: 'Pieza única',
    soldOut: 'Se agotó mientras mirabas',
  },

  checkout: {
    title: 'Finalizar compra',
    contact: 'Tus datos',
    delivery: 'Entrega',
    deliveryShip: 'Envío con Servientrega',
    deliveryPickup: 'Retiro en el taller',
    province: 'Provincia',
    city: 'Ciudad',
    address: 'Dirección',
    reference: 'Referencia',
    gift: 'Es un regalo',
    giftNote: 'Nota para la tarjeta (opcional)',
    giftNotePlaceholder: 'Escribimos tu mensaje a mano',
    notes: 'Notas del pedido (opcional)',
    shippingLocal: 'Envío en {city}',
    shippingNational: 'Envío nacional',
    shippingFree: 'Envío gratis',
    shippingPickup: 'Retiro en el taller',
    sameDayNote: 'Despachamos en 24 horas hábiles. Servientrega entrega en 24 a 72 horas.',
    frozenNote: 'Cada pieza va en su estuche, protegida para el viaje.',
    paymentNote: 'Pago seguro con tarjeta a través de Payphone.',
    summary: 'Tu pedido',
    total: 'Total',
    payment: {
      legend: 'Pago',
      cardTitle: 'Tarjeta',
      cardText: 'Débito o crédito, en línea con Payphone',
      transferTitle: 'Transferencia',
      transferText: 'Desde tu banco, antes del despacho',
      transferNote:
        'Haz tu pedido, transfiere el total y envía el comprobante con tu código. Apenas veamos el pago, lo aprobamos y lo preparamos.',
      submitCard: 'Continuar al pago',
      submitTransfer: 'Hacer mi pedido',
      switchPayment: '¿Tu tarjeta da error? Paga por transferencia',
    },
    bank: {
      accountType: { corriente: 'Cuenta corriente', ahorros: 'Cuenta de ahorros' },
      number: 'No. de cuenta',
      holder: 'Titular',
      ruc: 'RUC',
      cedula: 'Cédula',
      email: 'Comprobante a',
      copy: 'Copiar número',
      copied: 'Número copiado',
    },
    placed: {
      hand: 'Gracias',
      title: 'Recibimos tu pedido',
      text: 'Tu pedido {code} quedó registrado. Te enviamos el detalle a {email}.',
      transferText: 'Tu pedido {code} quedó por aprobar. Te enviamos el detalle y la cuenta a {email}.',
      transferTitle: 'Transfiere {total} para confirmarlo',
      transferSteps:
        'Envía el comprobante a {email} o por WhatsApp con tu código {code}. Apenas lo veamos, aprobamos tu pedido.',
      transferStepsNoEmail:
        'Envía el comprobante por WhatsApp con tu código {code}. Apenas lo veamos, aprobamos tu pedido.',
      transferWhatsapp: 'Enviar comprobante por WhatsApp',
      transferWhatsappMsg: 'Hola Mayumy, te envío el comprobante de la transferencia de mi pedido {code} por {total}.',
      reserveNote: 'Tu pieza queda reservada mientras confirmamos el pago.',
      track: 'Ver mi pedido',
      shop: 'Seguir mirando',
    },
  },

  tracking: {
    navLabel: 'Mi pedido',
    eyebrow: 'Seguimiento',
    hand: '¿Dónde está tu pieza?',
    title: 'Sigue tu pedido',
    text: 'Escribe el correo con el que compraste y te enviamos un código para ver tus pedidos.',
    emailLabel: 'Tu correo',
    sendCode: 'Enviarme el código',
    sending: 'Enviando…',
    codeTitle: 'Revisa tu correo',
    codeText: 'Si hay pedidos con {email}, te llegó un código de 6 dígitos. También trae un botón para entrar directo.',
    codeLabel: 'Código de verificación',
    verify: 'Ver mis pedidos',
    verifying: 'Verificando…',
    resend: 'Reenviar código',
    resendIn: 'Reenviar en {s} s',
    changeEmail: 'Usar otro correo',
    listTitle: 'Tus pedidos',
    empty: 'No encontramos pedidos con ese correo.',
    viewOrder: 'Ver detalle',
    help: '¿No te llega el código? Escríbenos',
  },

  notFound: {
    eyebrow: 'Error 404',
    title: 'Esta página no existe',
    text: 'Puede que el enlace esté mal escrito o que la pieza ya no esté publicada.',
    home: 'Volver al inicio',
    shop: 'Ir a la tienda',
  },

  legal: {
    copyright: 'Mayumy Chang. Todos los derechos reservados.',
    credit: {
      made: 'Hecho con',
      by: 'por',
      agency: { name: 'Bakano', url: 'https://bakano.ec' },
      author: {
        name: 'yeyo.dev',
        url: 'https://yeyo.dev',
        instagram: 'https://www.instagram.com/yeyo.dev/',
      },
    },
  },
} as const

// Provincias de Ecuador para el checkout (Servientrega llega a todas).
export const provinces = [
  'Azuay', 'Bolívar', 'Cañar', 'Carchi', 'Chimborazo', 'Cotopaxi', 'El Oro', 'Esmeraldas',
  'Galápagos', 'Guayas', 'Imbabura', 'Loja', 'Los Ríos', 'Manabí', 'Morona Santiago', 'Napo',
  'Orellana', 'Pastaza', 'Pichincha', 'Santa Elena', 'Santo Domingo de los Tsáchilas',
  'Sucumbíos', 'Tungurahua', 'Zamora Chinchipe',
]

export function segmentLabel(id: string | undefined | null): string {
  return site.segments.find((s) => s.id === id)?.label ?? ''
}

export function stoneMeta(id: string | undefined | null) {
  return site.stones.find((s) => s.id === id)
}

export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''))
}

export function whatsappLink(message = 'Hola Mayumy, quiero más información', phone: string = site.whatsapp): string {
  const digits = (phone || site.whatsapp).replace(/\D/g, '')
  if (!digits) return '#'
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}
