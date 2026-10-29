/**
 * Ciudades principales por provincia para el <datalist> del checkout. Es una
 * ayuda para escribir, no una lista cerrada: la clienta puede poner cualquier
 * ciudad y el envío se calcula igual (ciudad base = local, el resto = nacional).
 */
export const citiesByProvince: Record<string, string[]> = {
  Azuay: ['Cuenca', 'Gualaceo', 'Paute', 'Santa Isabel', 'Sígsig', 'Camilo Ponce Enríquez'],
  Bolívar: ['Guaranda', 'San Miguel', 'Chillanes', 'Caluma', 'Echeandía'],
  Cañar: ['Azogues', 'La Troncal', 'Cañar', 'Biblián'],
  Carchi: ['Tulcán', 'San Gabriel', 'El Ángel', 'Mira'],
  Chimborazo: ['Riobamba', 'Guano', 'Alausí', 'Chambo'],
  Cotopaxi: ['Latacunga', 'La Maná', 'Salcedo', 'Pujilí', 'Saquisilí'],
  'El Oro': ['Machala', 'Pasaje', 'Santa Rosa', 'Huaquillas', 'El Guabo', 'Piñas', 'Zaruma', 'Arenillas'],
  Esmeraldas: ['Esmeraldas', 'Atacames', 'Quinindé', 'San Lorenzo', 'Muisne'],
  Galápagos: ['Puerto Ayora', 'Puerto Baquerizo Moreno', 'Puerto Villamil'],
  Guayas: [
    'Guayaquil', 'Samborondón', 'Durán', 'Daule', 'Milagro', 'Playas', 'Nobol', 'El Triunfo',
    'Naranjal', 'Balzar', 'Yaguachi', 'Salitre', 'Naranjito', 'Pedro Carbo',
  ],
  Imbabura: ['Ibarra', 'Otavalo', 'Cotacachi', 'Atuntaqui', 'Pimampiro'],
  Loja: ['Loja', 'Catamayo', 'Cariamanga', 'Macará', 'Vilcabamba'],
  'Los Ríos': ['Babahoyo', 'Quevedo', 'Ventanas', 'Vinces', 'Buena Fe', 'Valencia'],
  Manabí: [
    'Portoviejo', 'Manta', 'Chone', 'Jipijapa', 'Montecristi', 'Bahía de Caráquez', 'El Carmen',
    'Pedernales', 'Puerto López',
  ],
  'Morona Santiago': ['Macas', 'Sucúa', 'Gualaquiza'],
  Napo: ['Tena', 'Archidona', 'Baeza'],
  Orellana: ['El Coca', 'La Joya de los Sachas', 'Loreto'],
  Pastaza: ['Puyo', 'Mera', 'Shell'],
  Pichincha: [
    'Quito', 'Cumbayá', 'Tumbaco', 'Sangolquí', 'Conocoto', 'Calderón', 'Pomasqui', 'Puembo',
    'Cayambe', 'Machachi', 'Tabacundo',
  ],
  'Santa Elena': ['Salinas', 'Santa Elena', 'La Libertad', 'Ballenita', 'Montañita', 'Olón'],
  'Santo Domingo de los Tsáchilas': ['Santo Domingo', 'La Concordia'],
  Sucumbíos: ['Nueva Loja', 'Shushufindi'],
  Tungurahua: ['Ambato', 'Baños de Agua Santa', 'Pelileo', 'Píllaro'],
  'Zamora Chinchipe': ['Zamora', 'Yantzaza', 'Zumbi'],
}

const plain = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase()

/** Provincia de una ciudad conocida ("quito" → "Pichincha"), o '' si no está en la lista. */
export function provinceOf(city: string): string {
  const needle = plain(city)
  if (!needle) return ''
  for (const [province, cities] of Object.entries(citiesByProvince)) {
    if (cities.some((c) => plain(c) === needle)) return province
  }
  return ''
}
