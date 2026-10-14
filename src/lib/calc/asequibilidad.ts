/**
 * ¿Cuánto alquiler puedo pagar? Usa como referencia el porcentaje de los
 * ingresos netos que se quiera destinar a vivienda (30 % por defecto, umbral
 * de uso habitual en estudios y políticas de vivienda) y calcula el dinero
 * necesario para entrar a vivir.
 */
import { redondear2 } from '../formato';
import type { Aviso, ErrorCampo } from './tipos';

export interface EntradaAsequibilidad {
  ingresosNetos: number | null;
  porcentaje: number | null;
  suministros: number | null;
  /** Renta de un piso concreto que quieres evaluar (opcional). */
  rentaObjetivo: number | null;
  ahorro: number | null;
  /** Meses de garantía adicional que pide el anuncio (0 a 2). */
  mesesGarantia: number | null;
}

export interface ResultadoAsequibilidad {
  rentaMaxima: number;
  rentaMaximaConSuministros: number;
  esfuerzoObjetivo: number | null;
  esfuerzoObjetivoConSuministros: number | null;
  entradaMinima: number | null;
  entradaMaxima: number | null;
  ahorroSuficiente: boolean | null;
  avisos: Aviso[];
}

export type SalidaAsequibilidad = { ok: true; r: ResultadoAsequibilidad } | { ok: false; errores: ErrorCampo[] };

export function calcularAsequibilidad(e: EntradaAsequibilidad): SalidaAsequibilidad {
  const errores: ErrorCampo[] = [];
  if (e.ingresosNetos === null || !(e.ingresosNetos > 0 && e.ingresosNetos < 1_000_000)) errores.push({ campo: 'ingresosNetos', mensaje: 'Introduce los ingresos netos mensuales del hogar.' });
  if (e.porcentaje === null || !(e.porcentaje > 0 && e.porcentaje <= 100)) errores.push({ campo: 'porcentaje', mensaje: 'Introduce un porcentaje entre 1 y 100.' });
  if (e.suministros !== null && !(e.suministros >= 0 && e.suministros < 100_000)) errores.push({ campo: 'suministros', mensaje: 'Los suministros deben ser 0 o una cantidad positiva.' });
  if (e.rentaObjetivo !== null && !(e.rentaObjetivo > 0 && e.rentaObjetivo < 1_000_000)) errores.push({ campo: 'rentaObjetivo', mensaje: 'La renta del piso debe ser una cantidad positiva.' });
  if (e.ahorro !== null && !(e.ahorro >= 0)) errores.push({ campo: 'ahorro', mensaje: 'El ahorro debe ser 0 o una cantidad positiva.' });
  if (e.mesesGarantia !== null && !(e.mesesGarantia >= 0 && e.mesesGarantia <= 2)) errores.push({ campo: 'mesesGarantia', mensaje: 'La garantía adicional en vivienda no puede superar dos mensualidades (art. 36.5 LAU).' });
  if (errores.length) return { ok: false, errores };

  const ingresos = e.ingresosNetos as number;
  const pct = e.porcentaje as number;
  const suministros = e.suministros ?? 0;
  const avisos: Aviso[] = [];
  const presupuesto = (ingresos * pct) / 100;
  const rentaMaxima = redondear2(presupuesto);
  const rentaMaximaConSuministros = redondear2(Math.max(0, presupuesto - suministros));

  let esfuerzoObjetivo: number | null = null;
  let esfuerzoObjetivoConSuministros: number | null = null;
  let entradaMinima: number | null = null;
  let entradaMaxima: number | null = null;
  let ahorroSuficiente: boolean | null = null;

  if (e.rentaObjetivo !== null) {
    const r = e.rentaObjetivo;
    esfuerzoObjetivo = redondear2((r / ingresos) * 100);
    esfuerzoObjetivoConSuministros = redondear2(((r + suministros) / ingresos) * 100);
    // Fianza legal (1 mes) + primera mensualidad; la garantía adicional es opcional y hasta 2 meses.
    const meses = e.mesesGarantia ?? 0;
    entradaMinima = redondear2(r * 2 + r * meses);
    entradaMaxima = redondear2(r * 4);
    if (e.ahorro !== null) ahorroSuficiente = e.ahorro >= entradaMinima;
    if (esfuerzoObjetivoConSuministros > pct) {
      avisos.push({
        nivel: 'aviso',
        texto: `Ese piso supondría un ${esfuerzoObjetivoConSuministros.toFixed(1).replace('.', ',')} % de tus ingresos con suministros, por encima del ${pct} % que te has marcado.`,
      });
    }
  }
  avisos.push({
    nivel: 'info',
    texto: 'Los honorarios de la inmobiliaria por gestionar y formalizar el contrato corren a cargo del propietario (art. 20.1 LAU, redacción de la Ley 12/2023): no deberían sumarse a lo que pagas al entrar.',
  });
  return { ok: true, r: { rentaMaxima, rentaMaximaConSuministros, esfuerzoObjetivo, esfuerzoObjetivoConSuministros, entradaMinima, entradaMaxima, ahorroSuficiente, avisos } };
}
