/**
 * Utilidades de fechas en formato ISO (AAAA-MM-DD), sin horas ni zonas
 * horarias. Trabajar con cadenas evita errores de cambio de hora.
 */

const ISO_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

export interface FechaPartes {
  y: number;
  m: number; // 1-12
  d: number; // 1-31
}

export function esFechaIso(s: unknown): s is string {
  if (typeof s !== 'string') return false;
  const m = ISO_RE.exec(s);
  if (!m) return false;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  return mo >= 1 && mo <= 12 && d >= 1 && d <= diasDelMes(y, mo);
}

export function partes(iso: string): FechaPartes {
  if (!esFechaIso(iso)) throw new Error(`Fecha no válida: ${iso}`);
  const [y, m, d] = iso.split('-').map(Number) as [number, number, number];
  return { y, m, d };
}

export function iso({ y, m, d }: FechaPartes): string {
  return `${String(y).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export function esBisiesto(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

export function diasDelMes(y: number, m: number): number {
  return [31, esBisiesto(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1] ?? 30;
}

function aDiaJuliano(isoStr: string): number {
  const { y, m, d } = partes(isoStr);
  return Math.round(Date.UTC(y, m - 1, d) / 86_400_000);
}

function desdeDiaJuliano(n: number): string {
  const dt = new Date(n * 86_400_000);
  return iso({ y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate() });
}

export function sumarDias(isoStr: string, dias: number): string {
  return desdeDiaJuliano(aDiaJuliano(isoStr) + dias);
}

/**
 * Suma meses de calendario. Si el día no existe en el mes de destino (p. ej.
 * 31 de enero + 1 mes) se usa el último día de ese mes, que es el criterio
 * del artículo 5 del Código Civil para los plazos por meses.
 */
export function sumarMeses(isoStr: string, meses: number): string {
  const { y, m, d } = partes(isoStr);
  const total = y * 12 + (m - 1) + meses;
  const ny = Math.floor(total / 12);
  const nm = (total % 12) + 1;
  return iso({ y: ny, m: nm, d: Math.min(d, diasDelMes(ny, nm)) });
}

export function sumarAnios(isoStr: string, anios: number): string {
  return sumarMeses(isoStr, anios * 12);
}

/** Días transcurridos de `desde` a `hasta` (positivo si hasta es posterior). */
export function diferenciaDias(desde: string, hasta: string): number {
  return aDiaJuliano(hasta) - aDiaJuliano(desde);
}

export function maxFecha(a: string, b: string): string {
  return a >= b ? a : b;
}

export function minFecha(a: string, b: string): string {
  return a <= b ? a : b;
}

/** Primer día del mes siguiente a la fecha dada. */
export function primerDiaMesSiguiente(isoStr: string): string {
  const { y, m } = partes(isoStr);
  return m === 12 ? iso({ y: y + 1, m: 1, d: 1 }) : iso({ y, m: m + 1, d: 1 });
}

/** Mes anterior en formato AAAA-MM. */
export function mesAnterior(aaaamm: string, n = 1): string {
  const [y, m] = aaaamm.split('-').map(Number) as [number, number];
  const total = y * 12 + (m - 1) - n;
  return `${Math.floor(total / 12)}-${String((total % 12) + 1).padStart(2, '0')}`;
}

/** Fecha de hoy en la zona horaria de Madrid, en ISO. */
export function hoyMadrid(now: Date = new Date()): string {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Madrid',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return fmt.format(now);
}

const MESES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

/** "1 de noviembre de 2026" */
export function fechaLarga(isoStr: string): string {
  const { y, m, d } = partes(isoStr);
  return `${d} de ${MESES[m - 1]} de ${y}`;
}

/** "01/11/2026" */
export function fechaCorta(isoStr: string): string {
  const { y, m, d } = partes(isoStr);
  return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
}

/** "noviembre de 2026" a partir de AAAA-MM o de una fecha ISO. */
export function mesLargo(aaaamm: string): string {
  const [y, m] = aaaamm.split('-').map(Number) as [number, number];
  return `${MESES[m - 1]} de ${y}`;
}

export function aaaamm(isoStr: string): string {
  return isoStr.slice(0, 7);
}
