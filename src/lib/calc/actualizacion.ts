/**
 * Actualización anual de la renta de un alquiler de vivienda (art. 18 LAU).
 *
 * Alcance: actualizaciones con fecha desde el 1 de enero de 2025 (cuando el
 * IRAV empezó a funcionar como tope). Para fechas anteriores se explica el
 * régimen, pero no se calcula.
 */
import {
  FECHA_INICIO_IRAV,
  FECHA_LEY_12_2023,
  FECHA_LEY_4_2013,
  FUENTES,
  limiteEnVigor,
  limiteParaFecha,
  ETIQUETA_ESTADO,
  type Fuente,
} from '../../data/normativa';
import { aaaamm, esFechaIso, fechaCorta, mesAnterior, mesLargo, partes, sumarAnios } from '../fechas';
import { porcentaje, redondear2 } from '../formato';
import type { Aviso, ErrorCampo } from './tipos';

export type Clausula = 'ipc' | 'irav' | 'igc' | 'fijo' | 'ninguna';
export type RespuestaSN = 'si' | 'no' | 'nose';

export const NOMBRE_CLAUSULA: Record<Clausula, string> = {
  ipc: 'IPC (Índice de Precios de Consumo)',
  irav: 'IRAV (Índice de Referencia de Arrendamientos de Vivienda)',
  igc: 'IGC (Índice de Garantía de Competitividad)',
  fijo: 'Porcentaje fijo pactado',
  ninguna: 'Sin cláusula de actualización',
};

const CORTO_CLAUSULA: Record<Clausula, string> = {
  ipc: 'IPC',
  irav: 'IRAV',
  igc: 'IGC',
  fijo: 'porcentaje fijo',
  ninguna: 'sin cláusula',
};

export interface EntradaActualizacion {
  renta: number | null;
  fechaFirma: string;
  fechaActualizacion: string;
  clausula: Clausula | null;
  /** Variación anual del índice pactado (IPC o IGC) o porcentaje fijo. */
  indicePct: number | null;
  /** Variación anual del IRAV publicada en la fecha de actualización. */
  iravPct: number | null;
  /** ¿La renta actual supera el límite del sistema estatal de índices de referencia? */
  superaReferencia: RespuestaSN | null;
  /** Porcentaje de un nuevo acuerdo entre las partes (null si no lo hay). */
  nuevoPactoPct: number | null;
}

export interface Escenario {
  etiqueta: string;
  pct: number;
  rentaNueva: number;
}

export interface ResultadoActualizacion {
  tipo: 'calculado' | 'sin-actualizacion' | 'fuera-de-alcance';
  pct: number;
  rentaActual: number;
  rentaNueva: number;
  diferenciaMensual: number;
  diferenciaAnual: number;
  regimen: string;
  /** Regla que ha determinado el porcentaje final (para la carta). */
  criterio: string;
  pasos: string[];
  avisos: Aviso[];
  fundamentos: Fuente[];
  alternativo?: Escenario;
  /** Mes del índice que probablemente corresponde (último publicado en la fecha de actualización). */
  mesIndice: { probable: string; alternativo: string | null };
}

export type SalidaActualizacion = { ok: true; r: ResultadoActualizacion } | { ok: false; errores: ErrorCampo[] };

/** ¿Es un contrato sujeto al tope del IRAV (firmado desde la Ley 12/2023)? */
export function esContratoLey12(fechaFirma: string): boolean {
  return fechaFirma >= FECHA_LEY_12_2023;
}

/**
 * Mes cuyo índice será probablemente "el último publicado" en la fecha de
 * actualización. El INE publica el dato de un mes hacia el día 12-16 del mes
 * siguiente; entre el 12 y el 15 hay que comprobar el calendario.
 */
export function mesIndiceAplicable(fechaActualizacion: string): { probable: string; alternativo: string | null } {
  const { d } = partes(fechaActualizacion);
  const mes = aaaamm(fechaActualizacion);
  if (d >= 16) return { probable: mesAnterior(mes, 1), alternativo: null };
  if (d <= 11) return { probable: mesAnterior(mes, 2), alternativo: null };
  return { probable: mesAnterior(mes, 1), alternativo: mesAnterior(mes, 2) };
}

function enRango(n: number | null, min: number, max: number): n is number {
  return n !== null && Number.isFinite(n) && n >= min && n <= max;
}

export function calcularActualizacion(e: EntradaActualizacion): SalidaActualizacion {
  const errores: ErrorCampo[] = [];
  if (!enRango(e.renta, 1, 1_000_000)) errores.push({ campo: 'renta', mensaje: 'Introduce la renta mensual actual en euros (por ejemplo, 850).' });
  if (!esFechaIso(e.fechaFirma)) errores.push({ campo: 'fechaFirma', mensaje: 'Indica la fecha de firma del contrato.' });
  if (!esFechaIso(e.fechaActualizacion)) errores.push({ campo: 'fechaActualizacion', mensaje: 'Indica la fecha en que se cumple la anualidad (la de la actualización).' });
  if (!e.clausula) errores.push({ campo: 'clausula', mensaje: 'Elige qué dice tu contrato sobre la actualización.' });
  if (errores.length) return { ok: false, errores };

  const renta = e.renta as number;
  const clausula = e.clausula as Clausula;
  const { fechaFirma, fechaActualizacion } = e;

  if (fechaActualizacion < sumarAnios(fechaFirma, 1)) {
    return {
      ok: false,
      errores: [
        {
          campo: 'fechaActualizacion',
          mensaje: `La renta solo se actualiza al cumplirse cada año de contrato: la primera fecha posible es el ${fechaCorta(sumarAnios(fechaFirma, 1))}.`,
        },
      ],
    };
  }

  const ley12 = esContratoLey12(fechaFirma);
  const mesIndice = mesIndiceAplicable(fechaActualizacion);
  const avisos: Aviso[] = [];
  const pasos: string[] = [];
  const fundamentos: Fuente[] = [FUENTES.lau];
  if (ley12) fundamentos.push(FUENTES.ley12_2023);

  let criterio = clausula === 'ninguna' ? '' : NOMBRE_CLAUSULA[clausula];
  const base = (pct: number, regimen: string, tipo: ResultadoActualizacion['tipo'] = 'calculado'): ResultadoActualizacion => {
    const rentaNueva = redondear2(renta * (1 + pct / 100));
    return {
      tipo,
      pct,
      rentaActual: renta,
      rentaNueva,
      diferenciaMensual: redondear2(rentaNueva - renta),
      diferenciaAnual: redondear2((rentaNueva - renta) * 12),
      regimen,
      criterio,
      pasos,
      avisos,
      fundamentos,
      mesIndice,
    };
  };

  // 1. Sin cláusula, no hay actualización.
  if (clausula === 'ninguna') {
    pasos.push('Tu contrato no prevé actualizar la renta.');
    pasos.push('El artículo 18.1 de la LAU dispone que, en defecto de pacto expreso, no se aplica actualización de rentas.');
    if (fechaFirma < FECHA_LEY_4_2013) {
      avisos.push({
        nivel: 'aviso',
        texto: 'Tu contrato es anterior al 6 de junio de 2013. La redacción original del artículo 18 de la LAU preveía la actualización por IPC durante los primeros años; revisa tu caso con el texto vigente cuando se firmó.',
      });
    }
    return { ok: true, r: base(0, 'Sin cláusula de actualización: la renta no cambia.', 'sin-actualizacion') };
  }

  // 2. Fuera del alcance de la calculadora.
  if (fechaActualizacion < FECHA_INICIO_IRAV) {
    pasos.push('Las actualizaciones anteriores a 2025 tuvieron límites temporales distintos: entre el 31/03/2022 y el 31/12/2023, el 2 % (vía IGC) si no había nuevo acuerdo; en 2024, el 3 %.');
    return { ok: true, r: base(0, 'Fecha de actualización anterior a 2025: esta calculadora no la calcula.', 'fuera-de-alcance') };
  }

  // 3. Validación de los datos que dependen del caso.
  const necesitaIndice = clausula === 'ipc' || clausula === 'igc' || clausula === 'fijo';
  const necesitaIrav = clausula === 'irav' || (ley12 && necesitaIndice);
  if (necesitaIndice && !enRango(e.indicePct, -20, 50)) {
    errores.push({
      campo: 'indicePct',
      mensaje: clausula === 'fijo' ? 'Indica el porcentaje fijo que dice tu contrato.' : `Indica la variación anual del ${clausula.toUpperCase()} que corresponde a tu fecha (por ejemplo, 2,5).`,
    });
  }
  if (necesitaIrav && !enRango(e.iravPct, -20, 50)) {
    errores.push({ campo: 'iravPct', mensaje: 'Indica la variación anual del IRAV publicada por el INE para tu fecha (por ejemplo, 2,47).' });
  }
  const limite = limiteParaFecha(fechaActualizacion);
  const limiteActivo = limite && limiteEnVigor(limite);
  if (limiteActivo && limite.reglaPrecioReferencia && !e.superaReferencia) {
    errores.push({ campo: 'superaReferencia', mensaje: 'Indica si tu renta supera el índice de referencia estatal (o marca «No lo sé»).' });
  }
  if (e.nuevoPactoPct !== null && !enRango(e.nuevoPactoPct, -50, 50)) {
    errores.push({ campo: 'nuevoPactoPct', mensaje: 'El porcentaje del nuevo acuerdo debe estar entre -50 y 50.' });
  }
  if (errores.length) return { ok: false, errores };

  // 4. Porcentaje según el contrato.
  let pct = clausula === 'irav' ? (e.iravPct as number) : (e.indicePct as number);
  pasos.push(`Según la cláusula de tu contrato (${CORTO_CLAUSULA[clausula]}), la variación sería del ${porcentaje(pct)}.`);

  const { m: mFirma, d: dFirma } = partes(fechaFirma);
  const { m: mAct, d: dAct } = partes(fechaActualizacion);
  if (mFirma !== mAct || dFirma !== dAct) {
    avisos.push({
      nivel: 'aviso',
      texto: `La fecha de actualización no coincide con el aniversario del contrato (${String(dFirma).padStart(2, '0')}/${String(mFirma).padStart(2, '0')}). La LAU solo permite actualizar en la fecha en que se cumple cada año de vigencia, salvo que el contrato diga otra cosa sobre el inicio de la vigencia.`,
    });
  }

  // 5. Tope del IRAV para contratos firmados desde la Ley 12/2023.
  let regimen: string;
  if (ley12) {
    regimen = 'Contrato firmado desde el 26/05/2023: la subida no puede superar la variación del IRAV (art. 18.1 LAU, redacción de la Ley 12/2023).';
    if (clausula !== 'irav') {
      const irav = e.iravPct as number;
      if (pct > irav) {
        pasos.push(`Tu contrato es posterior a la Ley 12/2023, así que la subida no puede superar el IRAV (${porcentaje(irav)}): se aplica el ${porcentaje(irav)}.`);
        pct = irav;
        criterio = 'IRAV, tope legal para contratos firmados desde el 26/05/2023';
      } else {
        pasos.push(`El porcentaje del contrato no supera el IRAV (${porcentaje(irav)}), así que no hace falta limitarlo.`);
      }
    }
    fundamentos.push(FUENTES.ineIrav);
  } else {
    regimen = 'Contrato anterior al 26/05/2023: se aplica la cláusula del contrato (no le afecta el tope del IRAV de la Ley 12/2023).';
    if (clausula === 'irav') fundamentos.push(FUENTES.ineIrav);
    if (clausula === 'ipc') fundamentos.push(FUENTES.ineIpc);
  }

  // 6. Límites extraordinarios de 2026.
  let alternativo: Escenario | undefined;
  if (limite && limiteActivo) {
    fundamentos.push(limite.fuente);
    regimen += ` Además, la fecha cae en el periodo del límite extraordinario del ${limite.norma} (${ETIQUETA_ESTADO[limite.estado].toLowerCase()}).`;
    const pctAntesDeLimite = pct;
    if (limite.reglaPrecioReferencia && e.superaReferencia === 'si') {
      if (pct > 0) {
        pasos.push(`Tu renta supera el límite del sistema estatal de índices de referencia: con el ${limite.norma} no procede ningún incremento.`);
        pct = 0;
        criterio = `renta superior al índice de referencia estatal (${limite.norma})`;
      }
    } else if (e.nuevoPactoPct !== null) {
      pasos.push(`Hay un nuevo acuerdo entre las partes del ${porcentaje(e.nuevoPactoPct)}: el ${limite.norma} remite a lo pactado.`);
      pct = e.nuevoPactoPct;
      criterio = 'nuevo acuerdo por escrito entre las partes';
      avisos.push({
        nivel: 'aviso',
        texto: 'Un nuevo acuerdo debe ser libre y constar por escrito. Comprueba en el texto del decreto si en tu caso (por ejemplo, si el propietario es un gran tenedor o tu contrato es posterior a la Ley 12/2023) el acuerdo sigue limitado por algún tope.',
      });
    } else if (pct > limite.limitePct) {
      pasos.push(`Sin nuevo acuerdo, el ${limite.norma} limita la subida al ${porcentaje(limite.limitePct)}.`);
      pct = limite.limitePct;
      criterio = `límite extraordinario del ${porcentaje(limite.limitePct, 0)} del ${limite.norma}`;
    } else {
      pasos.push(`El porcentaje resultante no supera el ${porcentaje(limite.limitePct)} del ${limite.norma}, así que no cambia.`);
    }

    if (limite.reglaPrecioReferencia && e.superaReferencia === 'nose' && pct > 0) {
      alternativo = { etiqueta: 'Si tu renta supera el índice de referencia', pct: 0, rentaNueva: renta };
      avisos.push({
        nivel: 'importante',
        texto: 'El resultado principal supone que tu renta NO supera el índice de referencia estatal. Si lo supera, no procede ninguna subida. Puedes consultarlo en el sistema estatal de índices de referencia del Ministerio de Vivienda.',
      });
    }
    if (limite.estado === 'vigente-pendiente-convalidacion') {
      avisos.push({
        nivel: 'importante',
        texto: `El ${limite.norma} está en vigor, pero pendiente de convalidación. Si se deroga, el límite dejaría de aplicarse a las actualizaciones posteriores. Comprueba el estado en nuestra página de normativa.`,
      });
    }
    if (!ley12 && pctAntesDeLimite > 0) {
      avisos.push({
        nivel: 'info',
        texto: `El ${limite.norma} modifica también el régimen transitorio de los contratos anteriores a la Ley 12/2023. Según su redacción, sus actualizaciones podrían quedar sujetas además al tope del IRAV; compruébalo en el BOE si el IRAV de tu fecha es inferior al porcentaje resultante.`,
      });
    }
  } else if (limite && !limiteActivo) {
    fundamentos.push(limite.fuente);
    const fin = limite.finEfectivo ?? limite.hasta;
    avisos.push({
      nivel: 'importante',
      texto: `Tu fecha de actualización cae en los días en que estuvo en vigor el ${limite.norma} (del ${fechaCorta(limite.desde)} al ${fechaCorta(fin)}), que limitaba la subida al ${porcentaje(limite.limitePct)}. Hoy está ${ETIQUETA_ESTADO[limite.estado].toLowerCase()} y hay debate jurídico sobre si ese límite se mantiene para las actualizaciones de esos días. Si es tu caso, conviene consultar a un profesional.`,
    });
    if (pct > limite.limitePct) {
      alternativo = {
        etiqueta: `Si se aplicara el límite del ${limite.norma}`,
        pct: limite.limitePct,
        rentaNueva: redondear2(renta * (1 + limite.limitePct / 100)),
      };
    }
  }

  if (pct < 0) {
    avisos.push({
      nivel: 'info',
      texto: 'El porcentaje es negativo: si tu cláusula actualiza en ambos sentidos, la renta bajaría. Revisa la redacción de tu contrato.',
    });
  }

  if (fechaFirma < FECHA_LEY_4_2013) {
    avisos.push({
      nivel: 'aviso',
      texto: 'Tu contrato es anterior al 6 de junio de 2013: la redacción del artículo 18 de la LAU era distinta. Revisa la cláusula con el texto vigente cuando se firmó.',
    });
  }

  pasos.push(`Porcentaje final: ${porcentaje(pct)}.`);
  const r = base(pct, regimen);
  if (alternativo) r.alternativo = alternativo;
  return { ok: true, r };
}

/** Texto breve con el mes del índice recomendado, para la interfaz. */
export function textoMesIndice(fechaActualizacion: string): string {
  const { probable, alternativo } = mesIndiceAplicable(fechaActualizacion);
  return alternativo
    ? `Normalmente, el dato de ${mesLargo(probable)} si el INE ya lo había publicado ese día; si no, el de ${mesLargo(alternativo)}.`
    : `Normalmente, el dato de ${mesLargo(probable)} (el último publicado por el INE en esa fecha).`;
}
