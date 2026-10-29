/**
 * Pide a Cloudinary la imagen al tamaño que se va a pintar, en el mejor formato
 * que soporte el navegador (f_auto) y con compresión automática (q_auto).
 * Las URL que no son de Cloudinary se devuelven tal cual.
 */
export interface CldOptions {
  w: number
  h?: number
}

export function cldUrl(url: string | undefined | null, { w, h }: CldOptions): string {
  if (!url) return ''
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url
  // Ya trae transformaciones nuestras: no duplicarlas.
  if (/\/upload\/f_auto,q_auto/.test(url)) return url
  const parts = ['f_auto', 'q_auto', `w_${Math.round(w)}`]
  if (h) parts.push(`h_${Math.round(h)}`)
  // c_limit nunca agranda ni recorta: las fotos de empaque se ven completas.
  parts.push('c_limit')
  return url.replace('/upload/', `/upload/${parts.join(',')}/`)
}

/** srcset 1x/2x para pantallas retina. */
export function cldSrcset(url: string | undefined | null, w: number): string {
  if (!url) return ''
  return `${cldUrl(url, { w })} 1x, ${cldUrl(url, { w: w * 2 })} 2x`
}
