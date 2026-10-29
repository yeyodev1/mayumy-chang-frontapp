/** Devuelve tinta oscura o papel según la luminancia del fondo (AA sobre colores de marca). */
export function contrastText(hex: string, dark = '#3d1c16', light = '#fbf6ee'): string {
  const m = hex.replace('#', '')
  const full = m.length === 3 ? m.split('').map((c) => c + c).join('') : m
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255)
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  const lum = 0.2126 * lin(r ?? 0) + 0.7152 * lin(g ?? 0) + 0.0722 * lin(b ?? 0)
  return lum > 0.18 ? dark : light
}
