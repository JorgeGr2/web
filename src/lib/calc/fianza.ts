/**
 * Fianza del alquiler de vivienda (art. 36 LAU).
 * - Cuantía legal: una mensualidad (vivienda) o dos (uso distinto).
 * - Garantía adicional: en vivienda, con contratos de hasta 5 años (7 si el
 *   arrendador es persona jurídica), máximo dos mensualidades.
 * - Devolución: si no se devuelve en un mes desde la entrega de llaves, el
 *   saldo devenga el interés legal del dinero.
 */
import { FUENTES, INTERES_LEGAL, type Fuente } from '../../data/normativa';
import { diferenciaDias, esFechaIso, fechaCorta, partes, sumarDias, sumarMeses, iso } from '../fechas';
import { redondear2 } from '../formato';
import type { Aviso, ErrorCampo } from './tipos';

export interface EntradaDevolucion {
  importe: number | null;
  fechaEntregaLlaves: string;
  /** Fecha real de devolución o, si aún no se ha devuelto, la fecha hasta la que calcular. */
  fechaDevolucion: string;
  /** Tipo de interés manual en %, si se quiere sustituir la tabla oficial. */
  tipoManual: number | null;
}

export interface TramoInteres {
  anio: number;
  desde: string;
  hasta: string;
  dias: number;
  tipoPct: number;
  interes: number;
  tipoEstimado: boolean;
}

export interface ResultadoDevolucion {
  fechaLimite: string;
  enPlazo: boolean;
  diasRetraso: number;
  tramos: TramoInteres[];
  intereses: number;
  totalReclamable: number;
  pasos: string[];
  avisos: Aviso[];
  fundamentos: Fuente[];
}

export type SalidaDevolucion = { ok: true; r: ResultadoDevolucion } | { ok: false; errores: ErrorCampo[] };

const ULTIMO_ANIO_TABLA = Math.max(...Object.keys(INTERES_LEGAL).map(Number));

function tipoAnual(anio: number): { tipo: number; estimado: boolean } {
  const t = INTERES_LEGAL[anio];
  if (t !== undefined) return { tipo: t, estimado: false };
  return { tipo: INTERES_LEGAL[ULTIMO_ANIO_TABLA] as number, estimado: true };
}

export function calcularDevolucionFianza(e: EntradaDevolucion): SalidaDevolucion {
  const errores: ErrorCampo[] = [];
  if (e.importe === null || !(e.importe > 0 && e.importe < 1_000_000)) errores.push({ campo: 'importe', mensaje: 'Introduce el importe de la fianza (o el saldo pendiente) en euros.' });
  if (!esFechaIso(e.fechaEntregaLlaves)) errores.push({ campo: 'fechaEntregaLlaves', mensaje: 'Indica la fecha en que entregaste las llaves.' });
  if (!esFechaIso(e.fechaDevolucion)) errores.push({ campo: 'fechaDevolucion', mensaje: 'Indica la fecha de devolución o la fecha hasta la que calcular.' });
  if (e.tipoManual !== null && !(e.tipoManual >= 0 && e.tipoManual <= 20)) errores.push({ campo: 'tipoManual', mensaje: 'El tipo de interés debe estar entre 0 y 20 %.' });
  if (errores.length) return { ok: false, errores };
  if (e.fechaDevolucion < e.fechaEntregaLlaves) {
    return { ok: false, errores: [{ campo: 'fechaDevolucion', mensaje: 'La fecha de devolución no puede ser anterior a la entrega de llaves.' }] };
  }

  const importe = e.importe as number;
  const fechaLimite = sumarMeses(e.fechaEntregaLlaves, 1);
  const pasos: string[] = [];
  const avisos: Aviso[] = [];
  const fundamentos: Fuente[] = [FUENTES.lau, FUENTES.codigoCivil];
  pasos.push(`Entrega de llaves: ${fechaCorta(e.fechaEntregaLlaves)}. El plazo de un mes termina el ${fechaCorta(fechaLimite)}.`);

  const diasRetraso = Math.max(0, diferenciaDias(fechaLimite, e.fechaDevolucion));
  if (diasRetraso === 0) {
    pasos.push('La devolución está dentro del plazo: no se generan intereses.');
    return { ok: true, r: { fechaLimite, enPlazo: true, diasRetraso: 0, tramos: [], intereses: 0, totalReclamable: importe, pasos, avisos, fundamentos } };
  }

  // Intereses desde el día siguiente al fin del plazo, por tramos de año natural.
  const tramos: TramoInteres[] = [];
  let cursor = sumarDias(fechaLimite, 1);
  while (cursor <= e.fechaDevolucion) {
    const { y } = partes(cursor);
    const finAnio = iso({ y, m: 12, d: 31 });
    const hasta = finAnio < e.fechaDevolucion ? finAnio : e.fechaDevolucion;
    const dias = diferenciaDias(cursor, hasta) + 1;
    const { tipo, estimado } = e.tipoManual !== null ? { tipo: e.tipoManual, estimado: false } : tipoAnual(y);
    tramos.push({ anio: y, desde: cursor, hasta, dias, tipoPct: tipo, interes: redondear2((importe * tipo * dias) / 36500), tipoEstimado: estimado });
    cursor = sumarDias(hasta, 1);
  }
  const intereses = redondear2(tramos.reduce((s, t) => s + (importe * t.tipoPct * t.dias) / 36500, 0));

  pasos.push(`Días de retraso: ${diasRetraso} (desde el ${fechaCorta(sumarDias(fechaLimite, 1))} hasta el ${fechaCorta(e.fechaDevolucion)}).`);
  pasos.push('Intereses = importe × tipo de interés legal × días / 365, por cada año natural.');
  if (tramos.some((t) => t.tipoEstimado)) {
    avisos.push({
      nivel: 'aviso',
      texto: `Para años sin tipo publicado en nuestra tabla se usa el último conocido (${INTERES_LEGAL[ULTIMO_ANIO_TABLA]} %, ${ULTIMO_ANIO_TABLA}). Compruébalo en la Ley de Presupuestos vigente o escribe el tipo manualmente.`,
    });
  }
  avisos.push({
    nivel: 'info',
    texto: 'El propietario puede retener la parte de la fianza necesaria para cubrir deudas o daños acreditados. Los intereses se calculan sobre el saldo que deba devolverse.',
  });
  return {
    ok: true,
    r: { fechaLimite, enPlazo: false, diasRetraso, tramos, intereses, totalReclamable: redondear2(importe + intereses), pasos, avisos, fundamentos },
  };
}

export interface EntradaGarantias {
  renta: number | null;
  uso: 'vivienda' | 'otro';
}

export interface ResultadoGarantias {
  fianzaLegal: number;
  mensualidadesFianza: number;
  garantiaAdicionalMaxima: number | null;
  totalMaximoEntrada: number | null;
}

export function calcularGarantias(e: EntradaGarantias): { ok: true; r: ResultadoGarantias } | { ok: false; errores: ErrorCampo[] } {
  if (e.renta === null || !(e.renta > 0 && e.renta < 1_000_000)) {
    return { ok: false, errores: [{ campo: 'rentaGarantias', mensaje: 'Introduce la renta mensual en euros.' }] };
  }
  const renta = e.renta;
  const meses = e.uso === 'vivienda' ? 1 : 2;
  const fianzaLegal = redondear2(renta * meses);
  if (e.uso === 'vivienda') {
    const garantia = redondear2(renta * 2);
    // Fianza + garantía adicional máxima + primera mensualidad.
    return { ok: true, r: { fianzaLegal, mensualidadesFianza: 1, garantiaAdicionalMaxima: garantia, totalMaximoEntrada: redondear2(fianzaLegal + garantia + renta) } };
  }
  return { ok: true, r: { fianzaLegal, mensualidadesFianza: 2, garantiaAdicionalMaxima: null, totalMaximoEntrada: null } };
}
