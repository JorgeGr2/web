/**
 * Desistimiento del inquilino (art. 11 LAU, redacción de la Ley 4/2013):
 * puede irse transcurridos al menos seis meses, avisando con 30 días de
 * antelación. Si el contrato lo pacta, indemniza con una mensualidad por
 * cada año que reste por cumplir (proporcional en periodos inferiores).
 */
import { FECHA_LEY_4_2013, FUENTES, type Fuente } from '../../data/normativa';
import { diferenciaDias, esFechaIso, fechaCorta, maxFecha, sumarDias, sumarMeses } from '../fechas';
import { redondear2 } from '../formato';
import type { Aviso, ErrorCampo } from './tipos';

export type Clausula = 'si' | 'no' | 'nose';

export interface EntradaDesistimiento {
  renta: number | null;
  fechaInicio: string;
  fechaComunicacion: string;
  fechaSalida: string;
  /** Fin del periodo en curso: fin de la duración pactada o de la prórroga anual en la que estás. */
  fechaFinPeriodo: string;
  clausula: Clausula | null;
}

export interface ResultadoDesistimiento {
  tipo: 'desistimiento' | 'fin-de-periodo' | 'fuera-de-alcance';
  /** Fecha más temprana en la que puedes dejar la vivienda cumpliendo la ley. */
  fechaMinimaSalida: string;
  cumpleSeisMeses: boolean;
  cumplePreaviso: boolean;
  fechaSeisMeses: string;
  fechaPreaviso: string;
  diasRestantes: number;
  /** Indemnización máxima si hay cláusula (o si la hubiera, cuando es "no lo sé"). */
  indemnizacionMaxima: number;
  /** Indemnización que corresponde según lo que has indicado sobre la cláusula. */
  indemnizacion: number;
  pasos: string[];
  avisos: Aviso[];
  fundamentos: Fuente[];
}

export type SalidaDesistimiento = { ok: true; r: ResultadoDesistimiento } | { ok: false; errores: ErrorCampo[] };

export function calcularDesistimiento(e: EntradaDesistimiento): SalidaDesistimiento {
  const errores: ErrorCampo[] = [];
  if (e.renta === null || !(e.renta > 0 && e.renta < 1_000_000)) errores.push({ campo: 'renta', mensaje: 'Introduce la renta mensual en euros.' });
  for (const [campo, msg] of [
    ['fechaInicio', 'Indica la fecha de inicio del contrato.'],
    ['fechaComunicacion', 'Indica la fecha en que comunicas (o comunicarás) que te vas.'],
    ['fechaSalida', 'Indica la fecha en que dejarás la vivienda y entregarás las llaves.'],
    ['fechaFinPeriodo', 'Indica cuándo termina el periodo en curso (contrato o prórroga anual).'],
  ] as const) {
    if (!esFechaIso(e[campo])) errores.push({ campo, mensaje: msg });
  }
  if (!e.clausula) errores.push({ campo: 'clausula', mensaje: 'Indica si tu contrato incluye una cláusula de indemnización por desistimiento.' });
  if (errores.length) return { ok: false, errores };

  if (e.fechaSalida <= e.fechaInicio) errores.push({ campo: 'fechaSalida', mensaje: 'La fecha de salida debe ser posterior al inicio del contrato.' });
  if (e.fechaFinPeriodo <= e.fechaInicio) errores.push({ campo: 'fechaFinPeriodo', mensaje: 'El fin del periodo debe ser posterior al inicio del contrato.' });
  if (e.fechaComunicacion < e.fechaInicio) errores.push({ campo: 'fechaComunicacion', mensaje: 'La comunicación no puede ser anterior al inicio del contrato.' });
  if (e.fechaComunicacion > e.fechaSalida) errores.push({ campo: 'fechaComunicacion', mensaje: 'La comunicación debe hacerse antes de la salida.' });
  if (errores.length) return { ok: false, errores };

  const renta = e.renta as number;
  const pasos: string[] = [];
  const avisos: Aviso[] = [];
  const fundamentos: Fuente[] = [FUENTES.lau, FUENTES.codigoCivil];

  const fechaSeisMeses = sumarMeses(e.fechaInicio, 6);
  const fechaPreaviso = sumarDias(e.fechaComunicacion, 30);
  const fechaMinimaSalida = maxFecha(fechaSeisMeses, fechaPreaviso);
  const cumpleSeisMeses = e.fechaSalida >= fechaSeisMeses;
  const cumplePreaviso = e.fechaSalida >= fechaPreaviso;
  const diasRestantes = Math.max(0, diferenciaDias(e.fechaSalida, e.fechaFinPeriodo));
  const indemnizacionMaxima = redondear2((renta * diasRestantes) / 365);

  const comun = { fechaMinimaSalida, cumpleSeisMeses, cumplePreaviso, fechaSeisMeses, fechaPreaviso, diasRestantes, pasos, avisos, fundamentos };

  if (e.fechaInicio < FECHA_LEY_4_2013) {
    avisos.push({
      nivel: 'importante',
      texto: 'Tu contrato es anterior al 6 de junio de 2013. La versión original del artículo 11 de la LAU solo permitía desistir en contratos de más de cinco años, tras cinco años y con dos meses de preaviso. Los tribunales resuelven estos casos de forma variable: consulta a un profesional.',
    });
    return { ok: true, r: { tipo: 'fuera-de-alcance', indemnizacionMaxima: 0, indemnizacion: 0, ...comun } };
  }

  if (e.fechaSalida >= e.fechaFinPeriodo) {
    pasos.push(`Sales el ${fechaCorta(e.fechaSalida)} o después del fin del periodo en curso (${fechaCorta(e.fechaFinPeriodo)}): no es un desistimiento anticipado, sino no renovar.`);
    pasos.push('Durante la prórroga obligatoria basta con avisar al menos 30 días antes del fin del contrato o de la prórroga (art. 9.1 LAU). En la prórroga tácita de hasta tres años, el aviso es de un mes antes del fin de cada anualidad (art. 10.1 LAU).');
    return { ok: true, r: { tipo: 'fin-de-periodo', indemnizacionMaxima: 0, indemnizacion: 0, ...comun } };
  }

  pasos.push(`Seis meses desde el inicio: se cumplen el ${fechaCorta(fechaSeisMeses)}.`);
  pasos.push(`Preaviso de 30 días desde tu comunicación del ${fechaCorta(e.fechaComunicacion)}: termina el ${fechaCorta(fechaPreaviso)}.`);
  pasos.push(`Fecha más temprana para salir cumpliendo ambos requisitos: ${fechaCorta(fechaMinimaSalida)}.`);

  if (!cumpleSeisMeses) {
    avisos.push({
      nivel: 'importante',
      texto: `Con la fecha de salida indicada no se cumplen los seis meses de contrato. Si te vas antes del ${fechaCorta(fechaSeisMeses)}, el propietario podría reclamarte la renta hasta completar ese plazo u otros daños; lo prudente es salir a partir de esa fecha o acordarlo por escrito.`,
    });
  }
  if (!cumplePreaviso) {
    avisos.push({
      nivel: 'importante',
      texto: `No se respeta el preaviso de 30 días: la salida debería ser el ${fechaCorta(fechaPreaviso)} o después. Un preaviso insuficiente puede dar lugar a reclamar la renta de los días que falten.`,
    });
  }

  pasos.push(`Quedan ${diasRestantes} días hasta el fin del periodo en curso (${fechaCorta(e.fechaFinPeriodo)}).`);
  pasos.push(`Indemnización máxima pactable: una mensualidad por año restante, en proporción → ${renta} € × ${diasRestantes} / 365 = ${indemnizacionMaxima.toFixed(2).replace('.', ',')} €.`);

  let indemnizacion = indemnizacionMaxima;
  if (e.clausula === 'no') {
    indemnizacion = 0;
    pasos.push('Tu contrato no incluye cláusula de indemnización: no se debe indemnización por desistir cumpliendo los seis meses y el preaviso.');
  } else if (e.clausula === 'nose') {
    avisos.push({
      nivel: 'aviso',
      texto: 'Revisa el contrato: la indemnización solo se debe si está pactada expresamente. Mostramos el máximo que se podría reclamar si existe la cláusula.',
    });
  }
  if (e.clausula !== 'no') {
    avisos.push({
      nivel: 'info',
      texto: 'La ley fija el máximo; si el contrato pacta una cantidad mayor, ese exceso puede considerarse nulo. Algunos tribunales moderan la indemnización (art. 1154 del Código Civil), por ejemplo si la vivienda se alquila enseguida. Existen también interpretaciones distintas sobre qué periodo cuenta como «año que reste»; aquí se usa el periodo en curso.',
    });
  }

  return { ok: true, r: { tipo: 'desistimiento', indemnizacionMaxima, indemnizacion, ...comun } };
}
