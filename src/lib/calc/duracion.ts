/**
 * Duración del contrato de alquiler de vivienda y sus prórrogas (arts. 9 y
 * 10 LAU, redacción del RDL 7/2019 y la Ley 12/2023).
 *
 * Alcance: contratos celebrados desde el 6 de marzo de 2019.
 * - Prórroga obligatoria anual hasta 5 años (7 si el arrendador es persona
 *   jurídica). El inquilino puede no renovar avisando 30 días antes del fin
 *   del contrato o de cada prórroga.
 * - Después, si nadie avisa (arrendador con 4 meses, inquilino con 2 meses de
 *   antelación), prórroga tácita anual hasta 3 años más; el inquilino puede
 *   salir avisando con un mes de antelación al fin de cada anualidad.
 */
import { FECHA_RDL_7_2019, FUENTES, type Fuente } from '../../data/normativa';
import { esFechaIso, fechaCorta, sumarAnios, sumarDias, sumarMeses } from '../fechas';
import type { Aviso, ErrorCampo } from './tipos';

export type TipoArrendador = 'fisica' | 'juridica';

export interface EntradaDuracion {
  fechaInicio: string;
  duracionPactadaAnios: number | null;
  arrendador: TipoArrendador | null;
  fechaReferencia: string;
}

export interface Hito {
  fecha: string;
  titulo: string;
  detalle: string;
  tipo: 'inicio' | 'fin-periodo' | 'preaviso' | 'fin';
}

export type Fase = 'pactado' | 'prorroga-obligatoria' | 'prorroga-tacita' | 'finalizado';

export interface ResultadoDuracion {
  tipo: 'calculado' | 'fuera-de-alcance';
  minimoAnios: number;
  finPactado: string;
  finObligatoria: string;
  finMaximoTacita: string;
  preavisoArrendador: string;
  preavisoArrendatario: string;
  hitos: Hito[];
  fase: Fase;
  finPeriodoActual: string | null;
  proximoHito: Hito | null;
  avisos: Aviso[];
  fundamentos: Fuente[];
}

export type SalidaDuracion = { ok: true; r: ResultadoDuracion } | { ok: false; errores: ErrorCampo[] };

export function calcularDuracion(e: EntradaDuracion): SalidaDuracion {
  const errores: ErrorCampo[] = [];
  if (!esFechaIso(e.fechaInicio)) errores.push({ campo: 'fechaInicio', mensaje: 'Indica la fecha de inicio del contrato.' });
  if (e.duracionPactadaAnios === null || !(e.duracionPactadaAnios > 0 && e.duracionPactadaAnios <= 30) || !Number.isInteger(e.duracionPactadaAnios * 12)) {
    errores.push({ campo: 'duracionPactadaAnios', mensaje: 'Indica la duración pactada en años (por ejemplo, 1; admite meses como 0,5).' });
  }
  if (!e.arrendador) errores.push({ campo: 'arrendador', mensaje: 'Indica si el propietario es una persona física o una empresa.' });
  if (!esFechaIso(e.fechaReferencia)) errores.push({ campo: 'fechaReferencia', mensaje: 'Fecha de referencia no válida.' });
  if (errores.length) return { ok: false, errores };

  const minimoAnios = e.arrendador === 'juridica' ? 7 : 5;
  const avisos: Aviso[] = [];
  const fundamentos: Fuente[] = [FUENTES.lau, FUENTES.rdl7_2019, FUENTES.ley12_2023];
  const meses = Math.round((e.duracionPactadaAnios as number) * 12);
  const finPactado = sumarMeses(e.fechaInicio, meses);
  const finMinimo = sumarAnios(e.fechaInicio, minimoAnios);
  const finObligatoria = finPactado > finMinimo ? finPactado : finMinimo;
  const finMaximoTacita = sumarAnios(finObligatoria, 3);
  const preavisoArrendador = sumarMeses(finObligatoria, -4);
  const preavisoArrendatario = sumarMeses(finObligatoria, -2);

  if (e.fechaInicio < FECHA_RDL_7_2019) {
    avisos.push({
      nivel: 'importante',
      texto: 'Tu contrato es anterior al 6 de marzo de 2019. Se rige por duraciones distintas: 5 años de prórroga obligatoria y 3 de tácita si se firmó antes del 6/6/2013; 3 años y 1 de tácita entre el 6/6/2013 y el 5/3/2019 (con un breve periodo, del 19/12/2018 al 22/01/2019, en el que rigió el RDL 21/2018). Consulta la guía de duración del contrato.',
    });
    return {
      ok: true,
      r: { tipo: 'fuera-de-alcance', minimoAnios, finPactado, finObligatoria, finMaximoTacita, preavisoArrendador, preavisoArrendatario, hitos: [], fase: 'pactado', finPeriodoActual: null, proximoHito: null, avisos, fundamentos },
    };
  }

  const hitos: Hito[] = [{ fecha: e.fechaInicio, titulo: 'Inicio del contrato', detalle: 'Empieza a contar la duración (o desde que te entregaron la vivienda, si fue después).', tipo: 'inicio' }];
  // Fin del plazo pactado y prórrogas obligatorias anuales.
  const periodos: { fin: string; fase: Fase }[] = [{ fin: finPactado, fase: 'pactado' }];
  let cursor = finPactado;
  while (cursor < finObligatoria) {
    const siguiente = sumarAnios(cursor, 1) < finObligatoria ? sumarAnios(cursor, 1) : finObligatoria;
    periodos.push({ fin: siguiente, fase: 'prorroga-obligatoria' });
    cursor = siguiente;
  }
  for (const p of periodos) {
    const esUltimo = p.fin === finObligatoria;
    hitos.push({
      fecha: sumarDias(p.fin, -30),
      titulo: 'Último día para que el inquilino avise de que no renueva',
      detalle: esUltimo ? 'Al final del periodo obligatorio rige el preaviso de dos meses del art. 10 (ver más abajo).' : 'Basta con comunicarlo al menos 30 días antes del fin del contrato o de la prórroga (art. 9.1 LAU).',
      tipo: 'preaviso',
    });
    hitos.push({
      fecha: p.fin,
      titulo:
        p.fase === 'pactado'
          ? esUltimo
            ? 'Fin de la duración pactada (cubre el periodo mínimo)'
            : 'Fin de la duración pactada'
          : esUltimo
            ? `Fin del periodo mínimo de ${minimoAnios} años`
            : 'Fin de una prórroga anual obligatoria',
      detalle: esUltimo
        ? 'Termina la duración obligatoria. Si nadie avisa a tiempo, empieza la prórroga tácita.'
        : 'Si el inquilino no avisa, el contrato se prorroga obligatoriamente un año más.',
      tipo: 'fin-periodo',
    });
  }
  // El aviso de 30 días del último periodo no aplica (prima el de 2 meses del art. 10).
  const idx = hitos.findIndex((h) => h.tipo === 'preaviso' && h.fecha === sumarDias(finObligatoria, -30));
  if (idx >= 0) hitos.splice(idx, 1);

  hitos.push({
    fecha: preavisoArrendador,
    titulo: 'Último día para que el propietario comunique que no renueva',
    detalle: 'Debe hacerlo al menos cuatro meses antes del fin del periodo mínimo (art. 10.1 LAU).',
    tipo: 'preaviso',
  });
  hitos.push({
    fecha: preavisoArrendatario,
    titulo: 'Último día para que el inquilino comunique que no renueva',
    detalle: 'Al menos dos meses antes del fin del periodo mínimo (art. 10.1 LAU).',
    tipo: 'preaviso',
  });
  for (let k = 1; k <= 3; k++) {
    const fin = sumarAnios(finObligatoria, k);
    hitos.push({
      fecha: sumarMeses(fin, -1),
      titulo: `Prórroga tácita, año ${k}: preaviso del inquilino`,
      detalle: 'Durante la prórroga tácita, el inquilino puede no renovar avisando con un mes de antelación al fin de cada anualidad.',
      tipo: 'preaviso',
    });
    hitos.push({
      fecha: fin,
      titulo: k === 3 ? 'Fin de la prórroga tácita (máximo legal)' : `Fin del año ${k} de prórroga tácita`,
      detalle: k === 3 ? 'Termina el último año de prórroga tácita. Después, el contrato se extingue salvo nuevo contrato o acuerdo.' : 'Si nadie lo impide, continúa un año más.',
      tipo: k === 3 ? 'fin' : 'fin-periodo',
    });
  }
  hitos.sort((a, b) => (a.fecha < b.fecha ? -1 : a.fecha > b.fecha ? 1 : 0));

  // Fase actual y fin del periodo en curso a la fecha de referencia.
  const ref = e.fechaReferencia;
  let fase: Fase = 'finalizado';
  let finPeriodoActual: string | null = null;
  const todos = [...periodos, ...[1, 2, 3].map((k) => ({ fin: sumarAnios(finObligatoria, k), fase: 'prorroga-tacita' as Fase }))];
  for (const p of todos) {
    if (ref < p.fin) {
      fase = p.fase;
      finPeriodoActual = p.fin;
      break;
    }
  }
  const proximoHito = hitos.find((h) => h.fecha >= ref) ?? null;

  avisos.push({
    nivel: 'info',
    texto: 'La prórroga tácita solo se produce si ninguna de las partes comunica que no quiere renovar en los plazos indicados. Las fechas suponen que no ha habido un contrato nuevo ni una novación.',
  });
  avisos.push({
    nivel: 'info',
    texto: 'Si el contrato lo prevé expresamente, el propietario persona física puede recuperar la vivienda para sí o familiares tras el primer año, avisando con dos meses de antelación (art. 9.3 LAU).',
  });
  avisos.push({
    nivel: 'aviso',
    texto: 'Existen prórrogas extraordinarias que esta calculadora no suma: por vulnerabilidad cuando el propietario es gran tenedor y en zonas de mercado tensionado (art. 10 LAU, Ley 12/2023), y la prórroga extraordinaria del RDL 29/2026, pendiente de convalidación. Consulta la página de normativa.',
  });
  if (fase === 'finalizado') {
    avisos.push({
      nivel: 'aviso',
      texto: `A la fecha de referencia (${fechaCorta(ref)}) ya habría terminado el plazo máximo de prórrogas. Si seguís con el alquiler, puede existir un contrato nuevo o una tácita reconducción (art. 1566 del Código Civil): conviene revisarlo.`,
    });
  }

  return {
    ok: true,
    r: { tipo: 'calculado', minimoAnios, finPactado, finObligatoria, finMaximoTacita, preavisoArrendador, preavisoArrendatario, hitos, fase, finPeriodoActual, proximoHito, avisos, fundamentos },
  };
}
