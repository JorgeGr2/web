import { describe, expect, it } from 'vitest';
import { calcularDesistimiento } from '../../src/lib/calc/desistimiento';
import { calcularDevolucionFianza, calcularGarantias } from '../../src/lib/calc/fianza';
import { calcularProrrateo } from '../../src/lib/calc/prorrateo';
import { calcularAsequibilidad } from '../../src/lib/calc/asequibilidad';
import { calcularRentabilidad, cuotaFrancesa } from '../../src/lib/calc/rentabilidad';
import { calcularDuracion } from '../../src/lib/calc/duracion';
import { generarCarta } from '../../src/lib/calc/carta';

describe('desistimiento', () => {
  const base = {
    renta: 900,
    fechaInicio: '2025-01-15',
    fechaComunicacion: '2025-06-01',
    fechaSalida: '2025-07-15',
    fechaFinPeriodo: '2026-01-15',
    clausula: 'si' as const,
  };
  it('calcula la indemnización proporcional por días', () => {
    const out = calcularDesistimiento(base);
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.r.tipo).toBe('desistimiento');
    expect(out.r.fechaSeisMeses).toBe('2025-07-15');
    expect(out.r.fechaPreaviso).toBe('2025-07-01');
    expect(out.r.fechaMinimaSalida).toBe('2025-07-15');
    expect(out.r.diasRestantes).toBe(184);
    expect(out.r.indemnizacion).toBe(453.7);
  });
  it('sin cláusula no hay indemnización', () => {
    const out = calcularDesistimiento({ ...base, clausula: 'no' });
    expect(out.ok && out.r.indemnizacion).toBe(0);
  });
  it('detecta que no se cumplen los seis meses ni el preaviso', () => {
    const out = calcularDesistimiento({ ...base, fechaComunicacion: '2025-06-20', fechaSalida: '2025-07-10' });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.r.cumpleSeisMeses).toBe(false);
    expect(out.r.cumplePreaviso).toBe(false);
    expect(out.r.fechaMinimaSalida).toBe('2025-07-20');
  });
  it('salir al terminar el periodo no es desistimiento', () => {
    const out = calcularDesistimiento({ ...base, fechaSalida: '2026-01-15' });
    expect(out.ok && out.r.tipo).toBe('fin-de-periodo');
  });
  it('contratos anteriores a la Ley 4/2013 quedan fuera de alcance', () => {
    const out = calcularDesistimiento({ ...base, fechaInicio: '2012-01-01' });
    expect(out.ok && out.r.tipo).toBe('fuera-de-alcance');
  });
  it('valida el orden de las fechas', () => {
    const out = calcularDesistimiento({ ...base, fechaComunicacion: '2025-08-01' });
    expect(out.ok).toBe(false);
  });
});

describe('fianza', () => {
  it('dentro de plazo no genera intereses', () => {
    const out = calcularDevolucionFianza({ importe: 800, fechaEntregaLlaves: '2026-01-10', fechaDevolucion: '2026-02-10', tipoManual: null });
    expect(out.ok && out.r.enPlazo).toBe(true);
    expect(out.ok && out.r.fechaLimite).toBe('2026-02-10');
  });
  it('intereses por 59 días de retraso al 3,25 %', () => {
    const out = calcularDevolucionFianza({ importe: 800, fechaEntregaLlaves: '2026-01-10', fechaDevolucion: '2026-04-10', tipoManual: null });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.r.diasRetraso).toBe(59);
    expect(out.r.intereses).toBe(4.2);
    expect(out.r.totalReclamable).toBe(804.2);
  });
  it('divide por años naturales', () => {
    const out = calcularDevolucionFianza({ importe: 1000, fechaEntregaLlaves: '2025-11-15', fechaDevolucion: '2026-01-31', tipoManual: null });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.r.tramos.map((t) => [t.anio, t.dias])).toEqual([
      [2025, 16],
      [2026, 31],
    ]);
    expect(out.r.diasRetraso).toBe(47);
  });
  it('marca como estimado un año sin tipo publicado', () => {
    const out = calcularDevolucionFianza({ importe: 1000, fechaEntregaLlaves: '2027-01-01', fechaDevolucion: '2027-03-01', tipoManual: null });
    expect(out.ok && out.r.tramos[0]?.tipoEstimado).toBe(true);
  });
  it('permite un tipo manual', () => {
    const out = calcularDevolucionFianza({ importe: 1000, fechaEntregaLlaves: '2026-01-01', fechaDevolucion: '2026-03-03', tipoManual: 4 });
    // límite 2026-02-01, 30 días de retraso: 1000 × 4 × 30 / 36500 = 3,29
    expect(out.ok && out.r.intereses).toBe(3.29);
  });
  it('garantías máximas en vivienda', () => {
    const out = calcularGarantias({ renta: 900, uso: 'vivienda' });
    expect(out.ok && out.r).toEqual({ fianzaLegal: 900, mensualidadesFianza: 1, garantiaAdicionalMaxima: 1800, totalMaximoEntrada: 3600 });
  });
  it('fianza de dos mensualidades en uso distinto de vivienda', () => {
    const out = calcularGarantias({ renta: 900, uso: 'otro' });
    expect(out.ok && out.r.fianzaLegal).toBe(1800);
  });
});

describe('prorrateo', () => {
  it('entrada a mitad de un mes de 31 días', () => {
    const out = calcularProrrateo({ renta: 900, fecha: '2026-10-15', movimiento: 'entrada' });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.r.diasOcupados).toBe(17);
    expect(out.r.importeMes).toBe(493.55);
    expect(out.r.importeDiarioAnual).toBe(503.01);
  });
  it('salida en febrero', () => {
    const out = calcularProrrateo({ renta: 900, fecha: '2026-02-10', movimiento: 'salida' });
    expect(out.ok && out.r.importeMes).toBe(321.43);
  });
  it('el método anual no supera la renta del mes', () => {
    const out = calcularProrrateo({ renta: 900, fecha: '2026-10-01', movimiento: 'entrada' });
    expect(out.ok && out.r.importeDiarioAnual).toBe(900);
  });
});

describe('asequibilidad', () => {
  it('calcula la renta máxima y el esfuerzo de un piso concreto', () => {
    const out = calcularAsequibilidad({ ingresosNetos: 2000, porcentaje: 30, suministros: 100, rentaObjetivo: 700, ahorro: 1000, mesesGarantia: 0 });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.r.rentaMaxima).toBe(600);
    expect(out.r.rentaMaximaConSuministros).toBe(500);
    expect(out.r.esfuerzoObjetivo).toBe(35);
    expect(out.r.esfuerzoObjetivoConSuministros).toBe(40);
    expect(out.r.entradaMinima).toBe(1400);
    expect(out.r.entradaMaxima).toBe(2800);
    expect(out.r.ahorroSuficiente).toBe(false);
  });
  it('rechaza garantías adicionales superiores a dos meses', () => {
    const out = calcularAsequibilidad({ ingresosNetos: 2000, porcentaje: 30, suministros: null, rentaObjetivo: 700, ahorro: null, mesesGarantia: 3 });
    expect(out.ok).toBe(false);
  });
});

describe('rentabilidad', () => {
  it('bruta y neta sin hipoteca', () => {
    const out = calcularRentabilidad({
      precioCompra: 200000, gastosCompra: 20000, reforma: 0, rentaMensual: 1000, mesesVacios: 0,
      ibi: 500, comunidad: 600, seguros: 300, mantenimiento: 600, gestionPct: 0,
      hipoteca: null, interesPct: null, plazoAnios: null,
    });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.r.rentabilidadBruta).toBe(6);
    expect(out.r.rentabilidadNeta).toBe(4.55);
    expect(out.r.beneficioNeto).toBe(10000);
  });
  it('cuota de hipoteca francesa conocida', () => {
    expect(Math.round(cuotaFrancesa(160000, 3, 30) * 100) / 100).toBe(674.57);
    expect(Math.round(cuotaFrancesa(100000, 0, 10) * 100) / 100).toBe(833.33);
  });
  it('rentabilidad sobre capital propio con hipoteca', () => {
    const out = calcularRentabilidad({
      precioCompra: 200000, gastosCompra: 20000, reforma: 0, rentaMensual: 1000, mesesVacios: 0,
      ibi: 500, comunidad: 600, seguros: 300, mantenimiento: 600, gestionPct: 0,
      hipoteca: 160000, interesPct: 3, plazoAnios: 30,
    });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.r.capitalPropio).toBe(60000);
    expect(out.r.cuotaMensual).toBe(674.57);
    // 10000 − 674,57 × 12 ≈ 1905,17 → / 60000 = 3,18 %
    expect(out.r.rentabilidadCapitalPropio).toBe(3.18);
  });
  it('exige interés y plazo si hay hipoteca', () => {
    const out = calcularRentabilidad({
      precioCompra: 200000, gastosCompra: null, reforma: null, rentaMensual: 1000, mesesVacios: null,
      ibi: null, comunidad: null, seguros: null, mantenimiento: null, gestionPct: null,
      hipoteca: 100000, interesPct: null, plazoAnios: null,
    });
    expect(out.ok).toBe(false);
  });
});

describe('duración del contrato', () => {
  it('contrato de 1 año con persona física', () => {
    const out = calcularDuracion({ fechaInicio: '2024-09-01', duracionPactadaAnios: 1, arrendador: 'fisica', fechaReferencia: '2026-10-14' });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.r.finPactado).toBe('2025-09-01');
    expect(out.r.finObligatoria).toBe('2029-09-01');
    expect(out.r.preavisoArrendador).toBe('2029-05-01');
    expect(out.r.preavisoArrendatario).toBe('2029-07-01');
    expect(out.r.finMaximoTacita).toBe('2032-09-01');
    expect(out.r.fase).toBe('prorroga-obligatoria');
    expect(out.r.finPeriodoActual).toBe('2027-09-01');
  });
  it('persona jurídica: siete años', () => {
    const out = calcularDuracion({ fechaInicio: '2024-09-01', duracionPactadaAnios: 1, arrendador: 'juridica', fechaReferencia: '2026-10-14' });
    expect(out.ok && out.r.finObligatoria).toBe('2031-09-01');
  });
  it('fase de prórroga tácita', () => {
    const out = calcularDuracion({ fechaInicio: '2019-06-01', duracionPactadaAnios: 1, arrendador: 'fisica', fechaReferencia: '2026-10-14' });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.r.finObligatoria).toBe('2024-06-01');
    expect(out.r.fase).toBe('prorroga-tacita');
    expect(out.r.finPeriodoActual).toBe('2027-06-01');
  });
  it('duración pactada mayor que el mínimo', () => {
    const out = calcularDuracion({ fechaInicio: '2020-01-31', duracionPactadaAnios: 6, arrendador: 'fisica', fechaReferencia: '2026-10-14' });
    expect(out.ok && out.r.finObligatoria).toBe('2026-01-31');
  });
  it('contratos anteriores al RDL 7/2019 quedan fuera de alcance', () => {
    const out = calcularDuracion({ fechaInicio: '2018-01-01', duracionPactadaAnios: 1, arrendador: 'fisica', fechaReferencia: '2026-10-14' });
    expect(out.ok && out.r.tipo).toBe('fuera-de-alcance');
  });
  it('los hitos están ordenados por fecha', () => {
    const out = calcularDuracion({ fechaInicio: '2024-09-01', duracionPactadaAnios: 1, arrendador: 'fisica', fechaReferencia: '2026-10-14' });
    if (!out.ok) throw new Error();
    const fechas = out.r.hitos.map((h) => h.fecha);
    expect([...fechas].sort()).toEqual(fechas);
    expect(out.r.proximoHito?.fecha).toBe('2027-08-02');
  });
});

describe('carta de actualización', () => {
  const datos = {
    arrendador: 'Ana Pérez',
    arrendatario: 'Luis García',
    direccionVivienda: 'Calle Mayor 1, 2.º B, 28013 Madrid',
    fechaContrato: '2024-11-01',
    fechaActualizacion: '2026-11-01',
    rentaActual: 1000,
    pct: 2,
    criterio: 'límite extraordinario del 2 %',
    mesIndice: '',
    fechaEnvio: '2026-10-10',
    lugar: 'Madrid',
    normaAdicional: 'Real Decreto-ley 29/2026',
  };
  it('incluye porcentaje, nueva renta y artículo 18 LAU', () => {
    const out = generarCarta(datos);
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.texto).toContain('2,00 %');
    expect(out.texto).toMatch(/1020,00\s€/);
    expect(out.texto).toContain('artículo 18');
    expect(out.texto).toContain('Real Decreto-ley 29/2026');
    expect(out.exigibleDesde).toBe('2026-11-01');
  });
  it('si se envía tarde, la nueva renta se aplica desde el mes siguiente al envío', () => {
    const out = generarCarta({ ...datos, fechaEnvio: '2026-11-05' });
    expect(out.ok && out.exigibleDesde).toBe('2026-12-01');
  });
  it('elimina caracteres de control de los campos', () => {
    const out = generarCarta({ ...datos, arrendador: 'Ana\u0000 <b>Pérez</b>' });
    expect(out.ok && out.texto).toContain('Ana <b>Pérez</b>');
  });
  it('valida campos obligatorios', () => {
    const out = generarCarta({ ...datos, arrendatario: '  ' });
    expect(out.ok).toBe(false);
  });
});
