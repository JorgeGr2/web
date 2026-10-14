/**
 * Genera el texto de la comunicación escrita de actualización de la renta
 * (art. 18.3 LAU: debe expresar el porcentaje aplicado; la nueva renta es
 * exigible desde el mes siguiente a la notificación).
 *
 * El texto se devuelve como cadena plana y se inserta en la página con
 * textContent: nunca se interpreta como HTML.
 */
import { fechaLarga, mesLargo, primerDiaMesSiguiente, esFechaIso } from '../fechas';
import { euros, porcentaje } from '../formato';
import type { ErrorCampo } from './tipos';

export interface DatosCarta {
  arrendador: string;
  arrendatario: string;
  direccionVivienda: string;
  fechaContrato: string;
  fechaActualizacion: string;
  rentaActual: number | null;
  pct: number | null;
  /** Nombre del índice o criterio aplicado, p. ej. "IRAV" o "límite extraordinario del 2 %". */
  criterio: string;
  /** Mes del índice (AAAA-MM), opcional. */
  mesIndice: string;
  /** Fecha prevista de envío de la carta. */
  fechaEnvio: string;
  lugar: string;
  /** Norma adicional a citar (p. ej. "Real Decreto-ley 29/2026"). Opcional. */
  normaAdicional: string;
}

export type SalidaCarta = { ok: true; texto: string; rentaNueva: number; exigibleDesde: string } | { ok: false; errores: ErrorCampo[] };

const LIMPIA = (s: string, max = 200) => s.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);

export function generarCarta(d: DatosCarta): SalidaCarta {
  const errores: ErrorCampo[] = [];
  const arrendador = LIMPIA(d.arrendador);
  const arrendatario = LIMPIA(d.arrendatario);
  const direccion = LIMPIA(d.direccionVivienda, 300);
  const criterio = LIMPIA(d.criterio, 120);
  const lugar = LIMPIA(d.lugar, 80);
  const norma = LIMPIA(d.normaAdicional, 160);

  if (!arrendador) errores.push({ campo: 'arrendador', mensaje: 'Escribe el nombre de la persona o empresa arrendadora.' });
  if (!arrendatario) errores.push({ campo: 'arrendatario', mensaje: 'Escribe el nombre de la persona arrendataria.' });
  if (!direccion) errores.push({ campo: 'direccionVivienda', mensaje: 'Escribe la dirección de la vivienda alquilada.' });
  if (!esFechaIso(d.fechaContrato)) errores.push({ campo: 'fechaContrato', mensaje: 'Indica la fecha del contrato.' });
  if (!esFechaIso(d.fechaActualizacion)) errores.push({ campo: 'fechaActualizacion', mensaje: 'Indica la fecha de la actualización (aniversario del contrato).' });
  if (!esFechaIso(d.fechaEnvio)) errores.push({ campo: 'fechaEnvio', mensaje: 'Indica la fecha en que enviarás la carta.' });
  if (d.rentaActual === null || !(d.rentaActual > 0)) errores.push({ campo: 'rentaActual', mensaje: 'Indica la renta mensual actual.' });
  if (d.pct === null || !Number.isFinite(d.pct) || Math.abs(d.pct) > 50) errores.push({ campo: 'pct', mensaje: 'Indica el porcentaje de actualización aplicado.' });
  if (!criterio) errores.push({ campo: 'criterio', mensaje: 'Indica el índice o criterio aplicado (por ejemplo, IRAV).' });
  if (errores.length) return { ok: false, errores };

  const rentaActual = d.rentaActual as number;
  const pct = d.pct as number;
  const rentaNueva = Math.round(rentaActual * (1 + pct / 100) * 100) / 100;
  const exigibleDesde = primerDiaMesSiguiente(d.fechaEnvio);
  // La nueva renta corresponde a la anualidad que empieza en la fecha de
  // actualización, pero nunca antes del mes siguiente a la notificación.
  const efecto = exigibleDesde > d.fechaActualizacion ? exigibleDesde : d.fechaActualizacion;
  const sentido = pct >= 0 ? 'incremento' : 'reducción';
  const indiceTxt = d.mesIndice && /^\d{4}-\d{2}$/.test(d.mesIndice) ? ` correspondiente a ${mesLargo(d.mesIndice)}` : '';

  const parrafos = [
    `${lugar ? `${lugar}, ` : ''}${fechaLarga(d.fechaEnvio)}`,
    `De: ${arrendador} (parte arrendadora)`,
    `A: ${arrendatario} (parte arrendataria)`,
    `Asunto: Actualización anual de la renta de la vivienda situada en ${direccion}`,
    `Estimado/a ${arrendatario}:`,
    `En relación con el contrato de arrendamiento de vivienda firmado el ${fechaLarga(d.fechaContrato)} sobre el inmueble indicado, y conforme a lo pactado en dicho contrato y al artículo 18 de la Ley 29/1994, de Arrendamientos Urbanos${norma ? `, así como a lo dispuesto en el ${norma}` : ''}, le comunico la actualización de la renta correspondiente a la anualidad que se cumple el ${fechaLarga(d.fechaActualizacion)}.`,
    `Criterio aplicado: ${criterio}${indiceTxt}.`,
    `Porcentaje de ${sentido} aplicado: ${porcentaje(pct)}.`,
    `Renta mensual actual: ${euros(rentaActual)}.`,
    `Nueva renta mensual: ${euros(rentaNueva)}.`,
    `La nueva renta se aplicará a partir del ${fechaLarga(efecto)} y, de acuerdo con el artículo 18.3 de la Ley de Arrendamientos Urbanos, en ningún caso antes del mes siguiente a aquel en que reciba esta comunicación. Si lo desea, puedo facilitarle la certificación del Instituto Nacional de Estadística correspondiente al índice aplicado.`,
    'Quedo a su disposición para cualquier aclaración.',
    'Atentamente,',
    arrendador,
  ];
  return { ok: true, texto: parrafos.join('\n\n'), rentaNueva, exigibleDesde: efecto };
}
