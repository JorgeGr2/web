import { describe, expect, it } from 'vitest';
import { calcularActualizacion, mesIndiceAplicable, type EntradaActualizacion } from '../../src/lib/calc/actualizacion';

const base: EntradaActualizacion = {
  renta: 1000,
  fechaFirma: '2024-03-01',
  fechaActualizacion: '2026-03-01',
  clausula: 'ipc',
  indicePct: 3,
  iravPct: 2.47,
  superaReferencia: null,
  nuevoPactoPct: null,
};

function ok(e: Partial<EntradaActualizacion>) {
  const out = calcularActualizacion({ ...base, ...e });
  if (!out.ok) throw new Error(JSON.stringify(out.errores));
  return out.r;
}

describe('actualización de renta', () => {
  it('contrato posterior a la Ley 12/2023: el IPC se limita al IRAV', () => {
    const r = ok({});
    expect(r.pct).toBe(2.47);
    expect(r.rentaNueva).toBe(1024.7);
    expect(r.diferenciaMensual).toBe(24.7);
    expect(r.diferenciaAnual).toBe(296.4);
  });

  it('si el IPC es menor que el IRAV, se aplica el IPC', () => {
    expect(ok({ indicePct: 1.5 }).pct).toBe(1.5);
  });

  it('cláusula IRAV usa el valor del IRAV', () => {
    expect(ok({ clausula: 'irav', indicePct: null }).pct).toBe(2.47);
  });

  it('RDL 29/2026: sin nuevo pacto, máximo 2 %', () => {
    const r = ok({ fechaFirma: '2024-11-01', fechaActualizacion: '2026-11-01', superaReferencia: 'no' });
    expect(r.pct).toBe(2);
    expect(r.rentaNueva).toBe(1020);
    expect(r.avisos.some((a) => a.texto.includes('pendiente de convalidación'))).toBe(true);
  });

  it('RDL 29/2026: renta por encima del índice de referencia → sin subida', () => {
    const r = ok({ fechaFirma: '2024-11-01', fechaActualizacion: '2026-11-01', superaReferencia: 'si' });
    expect(r.pct).toBe(0);
    expect(r.rentaNueva).toBe(1000);
  });

  it('RDL 29/2026: "no lo sé" da el 2 % y un escenario alternativo sin subida', () => {
    const r = ok({ fechaFirma: '2024-11-01', fechaActualizacion: '2026-11-01', superaReferencia: 'nose' });
    expect(r.pct).toBe(2);
    expect(r.alternativo?.pct).toBe(0);
  });

  it('RDL 29/2026: un nuevo pacto sustituye al límite del 2 %', () => {
    const r = ok({ fechaFirma: '2024-11-01', fechaActualizacion: '2026-11-01', superaReferencia: 'no', nuevoPactoPct: 2.3 });
    expect(r.pct).toBe(2.3);
  });

  it('RDL 29/2026: exige responder si se supera el índice de referencia', () => {
    const out = calcularActualizacion({ ...base, fechaFirma: '2024-11-01', fechaActualizacion: '2026-11-01' });
    expect(out.ok).toBe(false);
    if (!out.ok) expect(out.errores.map((e) => e.campo)).toContain('superaReferencia');
  });

  it('el límite del RDL 29/2026 no se aplica después del 31/12/2027', () => {
    const r = ok({ fechaFirma: '2025-01-15', fechaActualizacion: '2028-01-15' });
    expect(r.pct).toBe(2.47);
  });

  it('contrato anterior a la Ley 12/2023: se aplica el IPC pactado', () => {
    const r = ok({ fechaFirma: '2020-11-01', fechaActualizacion: '2025-11-01', indicePct: 3.2, iravPct: null });
    expect(r.pct).toBe(3.2);
    expect(r.rentaNueva).toBe(1032);
  });

  it('fecha dentro del RDL 8/2026 (decaído): sin límite, con escenario alternativo y aviso', () => {
    const r = ok({ fechaFirma: '2021-04-01', fechaActualizacion: '2026-04-01', indicePct: 3, iravPct: null });
    expect(r.pct).toBe(3);
    expect(r.alternativo?.pct).toBe(2);
    expect(r.avisos.some((a) => a.nivel === 'importante')).toBe(true);
  });

  it('sin cláusula: no hay actualización', () => {
    const r = ok({ clausula: 'ninguna' });
    expect(r.tipo).toBe('sin-actualizacion');
    expect(r.rentaNueva).toBe(1000);
  });

  it('actualización anterior a 2025: fuera de alcance', () => {
    const r = ok({ fechaFirma: '2022-06-01', fechaActualizacion: '2024-06-01' });
    expect(r.tipo).toBe('fuera-de-alcance');
  });

  it('falta el IRAV en un contrato posterior a la Ley 12/2023', () => {
    const out = calcularActualizacion({ ...base, iravPct: null });
    expect(out.ok).toBe(false);
    if (!out.ok) expect(out.errores[0]?.campo).toBe('iravPct');
  });

  it('no permite actualizar antes del primer aniversario', () => {
    const out = calcularActualizacion({ ...base, fechaActualizacion: '2025-02-28' });
    expect(out.ok).toBe(false);
  });

  it('índice negativo reduce la renta', () => {
    const r = ok({ fechaFirma: '2020-06-01', fechaActualizacion: '2025-06-01', indicePct: -0.5, iravPct: null });
    expect(r.rentaNueva).toBe(995);
  });

  it('avisa si la fecha no coincide con el aniversario', () => {
    const r = ok({ fechaActualizacion: '2026-03-15' });
    expect(r.avisos.some((a) => a.texto.includes('aniversario'))).toBe(true);
  });

  it('valida la renta', () => {
    const out = calcularActualizacion({ ...base, renta: null });
    expect(out.ok).toBe(false);
  });
});

describe('mes del índice aplicable', () => {
  it('a primeros de mes, el de dos meses antes', () => {
    expect(mesIndiceAplicable('2026-11-01')).toEqual({ probable: '2026-09', alternativo: null });
    expect(mesIndiceAplicable('2026-01-05')).toEqual({ probable: '2025-11', alternativo: null });
  });
  it('a partir del día 16, el del mes anterior', () => {
    expect(mesIndiceAplicable('2026-10-20')).toEqual({ probable: '2026-09', alternativo: null });
  });
  it('entre el 12 y el 15, hay dos posibilidades', () => {
    expect(mesIndiceAplicable('2026-10-14')).toEqual({ probable: '2026-09', alternativo: '2026-08' });
  });
});
