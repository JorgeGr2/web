/**
 * Datos normativos que usan las calculadoras y las guías.
 *
 * ESTE ES EL ARCHIVO QUE HAY QUE REVISAR CUANDO CAMBIA LA LEY O SE PUBLICA UN
 * ÍNDICE NUEVO. Procedimiento: docs/09-mantenimiento-normativo.md
 *
 * Todas las fechas son ISO (AAAA-MM-DD). Cada dato lleva su fuente.
 */

/** Fecha en la que se revisó por última vez este archivo. Se muestra en la web. */
export const ESTADO_NORMATIVO_FECHA = '2026-10-25';

export interface Fuente {
  texto: string;
  url: string;
}

export const FUENTES = {
  lau: {
    texto: 'Ley 29/1994, de Arrendamientos Urbanos (texto consolidado, BOE)',
    url: 'https://www.boe.es/buscar/act.php?id=BOE-A-1994-26003',
  },
  ley12_2023: {
    texto: 'Ley 12/2023, de 24 de mayo, por el derecho a la vivienda (BOE)',
    url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2023-12203',
  },
  rdl7_2019: {
    texto: 'Real Decreto-ley 7/2019, de 1 de marzo, de medidas urgentes en materia de vivienda y alquiler (BOE)',
    url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2019-3108',
  },
  rdl29_2026: {
    texto: 'Real Decreto-ley 29/2026, de 6 de octubre (BOE-A-2026-20823)',
    url: 'https://www.boe.es/buscar/doc.php?id=BOE-A-2026-20823',
  },
  rdl28_2026: {
    texto: 'Real Decreto-ley 28/2026, de 6 de octubre (BOE-A-2026-20822)',
    url: 'https://www.boe.es/buscar/doc.php?id=BOE-A-2026-20822',
  },
  rdl26_2026: {
    texto: 'Real Decreto-ley 26/2026, de 29 de septiembre (BOE-A-2026-20266)',
    url: 'https://www.boe.es/buscar/doc.php?id=BOE-A-2026-20266',
  },
  rdl8_2026: {
    texto: 'Real Decreto-ley 8/2026, de 20 de marzo (BOE-A-2026-6545)',
    url: 'https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-6545',
  },
  ineIrav: {
    texto: 'INE: Índice de Referencia de Arrendamientos de Vivienda (IRAV), últimos datos',
    url: 'https://www.ine.es/dyngs/INEbase/operacion.htm?c=Estadistica_C&cid=1254736177110&idp=1254735976607&menu=ultiDatos',
  },
  ineIpc: {
    texto: 'INE: calculadora de variaciones del IPC',
    url: 'https://www.ine.es/varipc/',
  },
  ineCalendario: {
    texto: 'INE: calendario de publicación de estadísticas',
    url: 'https://www.ine.es/dynt3/Calendario/calenHTML.htm',
  },
  serpavi: {
    texto: 'Resolución de 16 de abril de 2026 que actualiza el sistema estatal de índices de precios de referencia (BOE-A-2026-8691)',
    url: 'https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-8691',
  },
  serpaviWeb: {
    texto: 'Ministerio de Vivienda: Sistema Estatal de Referencia del Precio del Alquiler de Vivienda (SERPAVI)',
    url: 'https://serpavi.mivau.gob.es/',
  },
  moncloaSerpavi: {
    texto: 'La Moncloa: qué es el índice de precios de referencia del alquiler y cómo consultarlo',
    url: 'https://www.lamoncloa.gob.es/serviciosdeprensa/notasprensa/vivienda-agenda-urbana/paginas/2024/indice-referencia-precio-alquiler-vivienda-sepavi.aspx',
  },
  codigoCivil: {
    texto: 'Código Civil, artículos 1108 (intereses de demora) y 5 (cómputo de plazos) (BOE)',
    url: 'https://www.boe.es/buscar/act.php?id=BOE-A-1889-4763',
  },
} satisfies Record<string, Fuente>;

/** Entrada en vigor de la Ley 12/2023 (publicada en el BOE el 25/05/2023). */
export const FECHA_LEY_12_2023 = '2023-05-26';
/** Desde esta fecha el IRAV sustituye al IPC como tope para contratos posteriores a la Ley 12/2023. */
export const FECHA_INICIO_IRAV = '2025-01-01';
/** Entrada en vigor del RDL 7/2019 (duraciones de 5/7 años y prórroga tácita de 3). */
export const FECHA_RDL_7_2019 = '2019-03-06';
/** Entrada en vigor de la Ley 4/2013 (redacción actual del desistimiento del art. 11 LAU). */
export const FECHA_LEY_4_2013 = '2013-06-06';

export type EstadoNorma =
  | 'vigente'
  | 'vigente-pendiente-convalidacion'
  | 'convalidada'
  | 'decaida'
  | 'derogada';

export const ETIQUETA_ESTADO: Record<EstadoNorma, string> = {
  vigente: 'En vigor',
  'vigente-pendiente-convalidacion': 'En vigor, pendiente de convalidación',
  convalidada: 'En vigor (convalidado)',
  decaida: 'Decaído (no convalidado)',
  derogada: 'Derogado',
};

export interface LimiteExtraordinario {
  id: string;
  norma: string;
  fuente: Fuente;
  /** Primer día en vigor. */
  desde: string;
  /** Último día al que la norma dice aplicarse. */
  hasta: string;
  /** Último día en que estuvo realmente en vigor, si dejó de estarlo antes. */
  finEfectivo?: string;
  estado: EstadoNorma;
  /** Incremento máximo sin nuevo pacto, en %. */
  limitePct: number;
  /** Si la renta supera el índice de referencia estatal, no hay incremento. */
  reglaPrecioReferencia: boolean;
  nota: string;
}

/**
 * Límites extraordinarios a la actualización anual de la renta de 2026.
 * Orden cronológico. Para cambiar el estado de un decreto (p. ej., si se
 * convalida o se deroga) basta con editar `estado` y, si procede, `finEfectivo`.
 */
export const LIMITES_EXTRAORDINARIOS: LimiteExtraordinario[] = [
  {
    id: 'rdl-8-2026',
    norma: 'Real Decreto-ley 8/2026',
    fuente: FUENTES.rdl8_2026,
    desde: '2026-03-22',
    hasta: '2027-12-31',
    finEfectivo: '2026-04-28',
    estado: 'decaida',
    limitePct: 2,
    reglaPrecioReferencia: false,
    nota: 'El Congreso no lo convalidó en el Pleno del 28/04/2026. La fecha de fin es la de la votación; la resolución de derogación se publica después en el BOE.',
  },
  {
    id: 'rdl-26-2026',
    norma: 'Real Decreto-ley 26/2026',
    fuente: FUENTES.rdl26_2026,
    desde: '2026-10-01',
    hasta: '2027-12-31',
    finEfectivo: '2026-10-02',
    estado: 'derogada',
    limitePct: 2,
    reglaPrecioReferencia: true,
    nota: 'Derogado por el Congreso el 02/10/2026 (derogación publicada en el BOE ese mismo día).',
  },
  {
    id: 'rdl-29-2026',
    norma: 'Real Decreto-ley 29/2026',
    fuente: FUENTES.rdl29_2026,
    desde: '2026-10-08',
    hasta: '2027-12-31',
    estado: 'vigente-pendiente-convalidacion',
    limitePct: 2,
    reglaPrecioReferencia: true,
    nota: 'Publicado en el BOE el 07/10/2026 y en vigor desde el 08/10/2026. Con las Cortes disueltas, su convalidación o derogación corresponde a la Diputación Permanente del Congreso.',
  },
];

/** Estados en los que un límite se aplica sin discusión. */
export function limiteEnVigor(l: LimiteExtraordinario): boolean {
  return l.estado === 'vigente' || l.estado === 'vigente-pendiente-convalidacion' || l.estado === 'convalidada';
}

/** Devuelve el límite extraordinario cuyo periodo de vigencia incluye la fecha dada. */
export function limiteParaFecha(fechaIso: string): LimiteExtraordinario | undefined {
  return LIMITES_EXTRAORDINARIOS.find((l) => fechaIso >= l.desde && fechaIso <= (l.finEfectivo ?? l.hasta));
}

/**
 * Último valor del IRAV comprobado en la web del INE por el equipo del sitio.
 * NO se usa para calcular: solo se muestra como referencia junto al campo,
 * para que cada persona compruebe el dato vigente en su fecha de
 * actualización.
 */
export const ULTIMO_IRAV_COMPROBADO = {
  mesDato: '2026-09',
  valorPct: 2.54,
  publicadoEl: '2026-10-14',
  comprobadoEl: '2026-10-25',
  fuente: FUENTES.ineIrav,
};

/**
 * Interés legal del dinero (%), fijado por la Ley de Presupuestos de cada año.
 * Se usa para los intereses de demora de la fianza (art. 36.4 LAU).
 * Fuente: leyes de Presupuestos Generales del Estado. Desde 2023 se mantiene
 * el 3,25 % al estar prorrogados los presupuestos; compruébalo cada enero.
 */
export const INTERES_LEGAL: Record<number, number> = {
  2015: 3.5,
  2016: 3,
  2017: 3,
  2018: 3,
  2019: 3,
  2020: 3,
  2021: 3,
  2022: 3,
  2023: 3.25,
  2024: 3.25,
  2025: 3.25,
  2026: 3.25,
};
