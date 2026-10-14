/** Prorrateo de la renta cuando se entra o se sale de la vivienda a mitad de mes. */
import { diasDelMes, esFechaIso, partes } from '../fechas';
import { redondear2 } from '../formato';
import type { ErrorCampo } from './tipos';

export type Movimiento = 'entrada' | 'salida';

export interface EntradaProrrateo {
  renta: number | null;
  fecha: string;
  movimiento: Movimiento | null;
}

export interface ResultadoProrrateo {
  diasMes: number;
  diasOcupados: number;
  /** Proporción del mes: renta × días ocupados / días del mes. */
  importeMes: number;
  /** Renta diaria anual: renta × 12 / 365 × días ocupados. */
  importeDiarioAnual: number;
  rentaDiariaMes: number;
  rentaDiariaAnual: number;
}

export type SalidaProrrateo = { ok: true; r: ResultadoProrrateo } | { ok: false; errores: ErrorCampo[] };

export function calcularProrrateo(e: EntradaProrrateo): SalidaProrrateo {
  const errores: ErrorCampo[] = [];
  if (e.renta === null || !(e.renta > 0 && e.renta < 1_000_000)) errores.push({ campo: 'renta', mensaje: 'Introduce la renta mensual en euros.' });
  if (!esFechaIso(e.fecha)) errores.push({ campo: 'fecha', mensaje: 'Indica la fecha de entrada o salida.' });
  if (!e.movimiento) errores.push({ campo: 'movimiento', mensaje: 'Indica si entras o sales de la vivienda.' });
  if (errores.length) return { ok: false, errores };

  const renta = e.renta as number;
  const { y, m, d } = partes(e.fecha);
  const diasMes = diasDelMes(y, m);
  // Se cuentan ambos extremos: el día de entrada y el día de salida se pagan.
  const diasOcupados = e.movimiento === 'entrada' ? diasMes - d + 1 : d;
  const rentaDiariaMes = renta / diasMes;
  const rentaDiariaAnual = (renta * 12) / 365;
  return {
    ok: true,
    r: {
      diasMes,
      diasOcupados,
      importeMes: redondear2(rentaDiariaMes * diasOcupados),
      importeDiarioAnual: redondear2(Math.min(renta, rentaDiariaAnual * diasOcupados)),
      rentaDiariaMes: redondear2(rentaDiariaMes),
      rentaDiariaAnual: redondear2(rentaDiariaAnual),
    },
  };
}
