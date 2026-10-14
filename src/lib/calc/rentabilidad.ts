/**
 * Rentabilidad de una vivienda en alquiler (antes de impuestos).
 * - Bruta: renta anual / precio de compra.
 * - Neta: (ingresos efectivos − gastos anuales) / inversión total.
 * - Con hipoteca: flujo de caja anual / capital propio aportado.
 */
import { redondear2 } from '../formato';
import type { Aviso, ErrorCampo } from './tipos';

export interface EntradaRentabilidad {
  precioCompra: number | null;
  /** Impuestos y gastos de compra (ITP o IVA+AJD, notaría, registro, gestoría), en euros. */
  gastosCompra: number | null;
  reforma: number | null;
  rentaMensual: number | null;
  /** Meses al año sin inquilino (media prevista). */
  mesesVacios: number | null;
  ibi: number | null;
  comunidad: number | null;
  seguros: number | null;
  mantenimiento: number | null;
  /** Comisión de gestión, en % de la renta cobrada. */
  gestionPct: number | null;
  hipoteca: number | null;
  interesPct: number | null;
  plazoAnios: number | null;
}

export interface ResultadoRentabilidad {
  inversionTotal: number;
  ingresosAnuales: number;
  gastosAnuales: number;
  beneficioNeto: number;
  rentabilidadBruta: number;
  rentabilidadNeta: number;
  cuotaMensual: number | null;
  cuotasAnuales: number | null;
  interesesPrimerAnio: number | null;
  capitalPropio: number | null;
  flujoCajaAnual: number | null;
  rentabilidadCapitalPropio: number | null;
  avisos: Aviso[];
}

export type SalidaRentabilidad = { ok: true; r: ResultadoRentabilidad } | { ok: false; errores: ErrorCampo[] };

/** Cuota mensual de un préstamo de amortización francesa. */
export function cuotaFrancesa(capital: number, interesAnualPct: number, anios: number): number {
  const n = Math.round(anios * 12);
  const i = interesAnualPct / 100 / 12;
  if (n <= 0) return 0;
  if (i === 0) return capital / n;
  return (capital * i) / (1 - (1 + i) ** -n);
}

/** Intereses pagados durante los primeros 12 meses. */
export function interesesPrimerAnio(capital: number, interesAnualPct: number, anios: number): number {
  const cuota = cuotaFrancesa(capital, interesAnualPct, anios);
  const i = interesAnualPct / 100 / 12;
  let pendiente = capital;
  let total = 0;
  for (let k = 0; k < Math.min(12, Math.round(anios * 12)); k++) {
    const int = pendiente * i;
    total += int;
    pendiente -= cuota - int;
  }
  return total;
}

export function calcularRentabilidad(e: EntradaRentabilidad): SalidaRentabilidad {
  const errores: ErrorCampo[] = [];
  const positivo = (v: number | null, campo: string, msg: string, obligatorio = false) => {
    if (v === null) {
      if (obligatorio) errores.push({ campo, mensaje: msg });
      return;
    }
    if (!(v >= 0 && v < 100_000_000)) errores.push({ campo, mensaje: msg });
  };
  positivo(e.precioCompra, 'precioCompra', 'Introduce el precio de compra de la vivienda.', true);
  if (e.precioCompra === 0) errores.push({ campo: 'precioCompra', mensaje: 'El precio de compra debe ser mayor que cero.' });
  positivo(e.rentaMensual, 'rentaMensual', 'Introduce la renta mensual prevista.', true);
  positivo(e.gastosCompra, 'gastosCompra', 'Los gastos de compra deben ser 0 o una cantidad positiva.');
  positivo(e.reforma, 'reforma', 'La reforma debe ser 0 o una cantidad positiva.');
  positivo(e.ibi, 'ibi', 'El IBI debe ser 0 o una cantidad positiva.');
  positivo(e.comunidad, 'comunidad', 'La comunidad debe ser 0 o una cantidad positiva.');
  positivo(e.seguros, 'seguros', 'Los seguros deben ser 0 o una cantidad positiva.');
  positivo(e.mantenimiento, 'mantenimiento', 'El mantenimiento debe ser 0 o una cantidad positiva.');
  positivo(e.hipoteca, 'hipoteca', 'La hipoteca debe ser 0 o una cantidad positiva.');
  if (e.mesesVacios !== null && !(e.mesesVacios >= 0 && e.mesesVacios <= 12)) errores.push({ campo: 'mesesVacios', mensaje: 'Los meses vacíos deben estar entre 0 y 12.' });
  if (e.gestionPct !== null && !(e.gestionPct >= 0 && e.gestionPct <= 100)) errores.push({ campo: 'gestionPct', mensaje: 'La comisión de gestión debe estar entre 0 y 100 %.' });
  const conHipoteca = (e.hipoteca ?? 0) > 0;
  if (conHipoteca) {
    if (e.interesPct === null || !(e.interesPct >= 0 && e.interesPct <= 30)) errores.push({ campo: 'interesPct', mensaje: 'Introduce el tipo de interés de la hipoteca (0 a 30 %).' });
    if (e.plazoAnios === null || !(e.plazoAnios >= 1 && e.plazoAnios <= 50)) errores.push({ campo: 'plazoAnios', mensaje: 'Introduce el plazo de la hipoteca en años (1 a 50).' });
  }
  if (errores.length) return { ok: false, errores };

  const precio = e.precioCompra as number;
  const renta = e.rentaMensual as number;
  const inversionTotal = precio + (e.gastosCompra ?? 0) + (e.reforma ?? 0);
  const mesesCobrados = 12 - (e.mesesVacios ?? 0);
  const ingresosAnuales = renta * mesesCobrados;
  const gestion = (ingresosAnuales * (e.gestionPct ?? 0)) / 100;
  const gastosAnuales = (e.ibi ?? 0) + (e.comunidad ?? 0) + (e.seguros ?? 0) + (e.mantenimiento ?? 0) + gestion;
  const beneficioNeto = ingresosAnuales - gastosAnuales;
  const avisos: Aviso[] = [];

  let cuotaMensual: number | null = null;
  let cuotasAnuales: number | null = null;
  let intereses1: number | null = null;
  let capitalPropio: number | null = null;
  let flujoCajaAnual: number | null = null;
  let rentabilidadCapitalPropio: number | null = null;
  if (conHipoteca) {
    const capital = e.hipoteca as number;
    cuotaMensual = cuotaFrancesa(capital, e.interesPct as number, e.plazoAnios as number);
    cuotasAnuales = cuotaMensual * 12;
    intereses1 = interesesPrimerAnio(capital, e.interesPct as number, e.plazoAnios as number);
    capitalPropio = inversionTotal - capital;
    flujoCajaAnual = beneficioNeto - cuotasAnuales;
    if (capitalPropio > 0) {
      rentabilidadCapitalPropio = redondear2((flujoCajaAnual / capitalPropio) * 100);
    } else {
      avisos.push({ nivel: 'aviso', texto: 'La hipoteca cubre toda la inversión: la rentabilidad sobre capital propio no se puede calcular.' });
    }
    if (flujoCajaAnual < 0) {
      avisos.push({ nivel: 'aviso', texto: 'Con estos datos, las cuotas de la hipoteca superan el beneficio del alquiler: tendrías que aportar dinero cada mes.' });
    }
    avisos.push({ nivel: 'info', texto: 'El flujo de caja incluye la devolución de capital de la hipoteca, que no es un gasto sino ahorro en forma de vivienda.' });
  }
  avisos.push({
    nivel: 'info',
    texto: 'Resultado antes de impuestos. En el IRPF, los rendimientos del alquiler de vivienda habitual pueden aplicar reducciones del 50 % al 90 % según el contrato y la zona; consulta la guía o a tu asesor.',
  });

  return {
    ok: true,
    r: {
      inversionTotal: redondear2(inversionTotal),
      ingresosAnuales: redondear2(ingresosAnuales),
      gastosAnuales: redondear2(gastosAnuales),
      beneficioNeto: redondear2(beneficioNeto),
      rentabilidadBruta: redondear2(((renta * 12) / precio) * 100),
      rentabilidadNeta: redondear2((beneficioNeto / inversionTotal) * 100),
      cuotaMensual: cuotaMensual === null ? null : redondear2(cuotaMensual),
      cuotasAnuales: cuotasAnuales === null ? null : redondear2(cuotasAnuales),
      interesesPrimerAnio: intereses1 === null ? null : redondear2(intereses1),
      capitalPropio: capitalPropio === null ? null : redondear2(capitalPropio),
      flujoCajaAnual: flujoCajaAnual === null ? null : redondear2(flujoCajaAnual),
      rentabilidadCapitalPropio,
      avisos,
    },
  };
}
