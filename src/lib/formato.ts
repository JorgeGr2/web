/** Formateo de números y lectura de importes escritos al estilo español. */

const EURO = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });
const NUM2 = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** 1234.5 → "1234,50 €" (Intl en es-ES agrupa miles a partir de 5 cifras). */
export function euros(n: number): string {
  return EURO.format(redondear2(n));
}

/** 2.5 → "2,50 %" */
export function porcentaje(n: number, decimales = 2): string {
  const f = new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  });
  return `${f.format(n)} %`;
}

export function numero2(n: number): string {
  return NUM2.format(n);
}

/** Redondeo a céntimos evitando errores de coma flotante (1.005 → 1.01). */
export function redondear2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/**
 * Convierte texto introducido por una persona en número.
 * Acepta "1.234,56", "1234,56", "1234.56", "1 234,56", "2,5 %", "-0,3".
 * Devuelve null si no es un número.
 */
export function leerNumero(texto: string | null | undefined): number | null {
  if (texto == null) return null;
  let s = String(texto).trim().replace(/[€%\s ]/g, '');
  if (s === '' || s === '-' || s === '+') return null;
  const tieneComa = s.includes(',');
  const tienePunto = s.includes('.');
  if (tieneComa && tienePunto) {
    // El último separador es el decimal.
    if (s.lastIndexOf(',') > s.lastIndexOf('.')) s = s.replace(/\./g, '').replace(',', '.');
    else s = s.replace(/,/g, '');
  } else if (tieneComa) {
    s = s.replace(',', '.');
  } else if (tienePunto) {
    // "1.234" (miles) frente a "2.5" (decimal): si hay exactamente 3 cifras
    // tras el único punto y más de una cifra antes, se interpreta como miles.
    const partes = s.split('.');
    if (partes.length > 2 || (partes.length === 2 && partes[1]?.length === 3 && (partes[0]?.replace('-', '').length ?? 0) >= 1 && !/^-?0$/.test(partes[0] ?? ''))) {
      s = s.replace(/\./g, '');
    }
  }
  if (!/^[+-]?\d+(\.\d+)?$/.test(s)) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}
