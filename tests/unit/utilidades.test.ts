import { describe, expect, it } from 'vitest';
import { diferenciaDias, esFechaIso, fechaLarga, hoyMadrid, primerDiaMesSiguiente, sumarAnios, sumarMeses } from '../../src/lib/fechas';
import { euros, leerNumero, porcentaje, redondear2 } from '../../src/lib/formato';
import { parseEnv, validateEnv } from '../../src/config/env-schema.mjs';
import { buildCsp, buildHeaders, wrapTables } from '../../src/integrations/site-files.mjs';
import { limiteParaFecha } from '../../src/data/normativa';

describe('fechas', () => {
  it('valida fechas ISO reales', () => {
    expect(esFechaIso('2026-02-29')).toBe(false);
    expect(esFechaIso('2024-02-29')).toBe(true);
    expect(esFechaIso('2026-13-01')).toBe(false);
    expect(esFechaIso('01/02/2026')).toBe(false);
  });
  it('suma meses con fin de mes', () => {
    expect(sumarMeses('2026-01-31', 1)).toBe('2026-02-28');
    expect(sumarMeses('2026-03-31', -1)).toBe('2026-02-28');
    expect(sumarAnios('2024-02-29', 1)).toBe('2025-02-28');
    expect(sumarMeses('2026-11-15', 2)).toBe('2027-01-15');
  });
  it('diferencia de días', () => {
    expect(diferenciaDias('2026-01-01', '2026-12-31')).toBe(364);
    expect(diferenciaDias('2026-03-28', '2026-03-30')).toBe(2); // cambio de hora
  });
  it('primer día del mes siguiente', () => {
    expect(primerDiaMesSiguiente('2026-12-15')).toBe('2027-01-01');
  });
  it('formato largo en español', () => {
    expect(fechaLarga('2026-11-01')).toBe('1 de noviembre de 2026');
  });
  it('hoy en Madrid', () => {
    expect(hoyMadrid(new Date('2026-10-13T23:30:00Z'))).toBe('2026-10-14');
  });
});

describe('formato y lectura de números', () => {
  it('lee importes escritos en español', () => {
    expect(leerNumero('1.234,56')).toBe(1234.56);
    expect(leerNumero('2,47')).toBe(2.47);
    expect(leerNumero('2.47')).toBe(2.47);
    expect(leerNumero('1.234')).toBe(1234);
    expect(leerNumero('850 €')).toBe(850);
    expect(leerNumero('-0,5')).toBe(-0.5);
    expect(leerNumero('0.500')).toBe(0.5);
    expect(leerNumero('1,234.5')).toBe(1234.5);
    expect(leerNumero('abc')).toBeNull();
    expect(leerNumero('')).toBeNull();
    expect(leerNumero('1e5')).toBeNull();
  });
  it('formatea euros y porcentajes', () => {
    expect(euros(1020)).toMatch(/^1020,00\s€$/);
    expect(euros(12345.6)).toMatch(/^12\.345,60\s€$/);
    expect(porcentaje(2.5)).toBe('2,50 %');
    expect(redondear2(1.005)).toBe(1.01);
  });
});

describe('configuración por variables de entorno', () => {
  it('valores por defecto válidos para desarrollo', () => {
    const cfg = parseEnv({});
    expect(cfg.indexable).toBe(false);
    expect(validateEnv(cfg)).toEqual([]);
  });
  it('el dominio y el nombre por defecto son los del proyecto', () => {
    const cfg = parseEnv({});
    expect(cfg.siteUrl).toBe('https://www.alquilerenregla.es');
    expect(cfg.siteName).toBe('Alquiler en Regla');
  });
  it('indexar exige datos del titular', () => {
    const errors = validateEnv(parseEnv({ PUBLIC_SITE_INDEXABLE: 'true' }));
    expect(errors.join(' ')).toContain('PUBLIC_OWNER_NAME');
  });
  it('indexar rechaza el dominio de ejemplo antiguo', () => {
    const errors = validateEnv(parseEnv({ PUBLIC_SITE_INDEXABLE: 'true', PUBLIC_SITE_URL: 'https://www.tu-dominio.es' }));
    expect(errors.join(' ')).toContain('valor de ejemplo');
  });
  it('configuración de producción completa', () => {
    const cfg = parseEnv({
      PUBLIC_SITE_URL: 'https://www.ejemplo-real.es/',
      PUBLIC_SITE_INDEXABLE: 'true',
      PUBLIC_OWNER_NAME: 'Nombre Apellido',
      PUBLIC_OWNER_NIF: '00000000T',
      PUBLIC_OWNER_ADDRESS: 'Calle 1, 28000 Madrid',
      PUBLIC_CONTACT_EMAIL: 'contacto@ejemplo-real.es',
      PUBLIC_ADSENSE_CLIENT: 'ca-pub-1234567890123456',
    });
    expect(cfg.siteUrl).toBe('https://www.ejemplo-real.es');
    expect(cfg.adsense.publisherId).toBe('pub-1234567890123456');
    expect(validateEnv(cfg)).toEqual([]);
  });
  it('rechaza IDs con formato incorrecto', () => {
    const errors = validateEnv(parseEnv({ PUBLIC_ADSENSE_CLIENT: 'pub-123', PUBLIC_GA4_ID: 'UA-1' }));
    expect(errors).toHaveLength(2);
  });
  it('CSP estricta sin anuncios y relajada con AdSense', () => {
    expect(buildCsp(parseEnv({}))).toContain("script-src 'self' https://static.cloudflareinsights.com");
    expect(buildCsp(parseEnv({ PUBLIC_ADSENSE_CLIENT: 'ca-pub-1234567890123456' }))).toContain("script-src 'self' 'unsafe-inline' https:");
  });
  it('cabeceras noindex mientras el sitio no es indexable', () => {
    expect(buildHeaders(parseEnv({}))).toContain('X-Robots-Tag: noindex');
  });
});

describe('periodos normativos', () => {
  it('localiza el límite vigente por fecha', () => {
    expect(limiteParaFecha('2026-11-01')?.id).toBe('rdl-29-2026');
    expect(limiteParaFecha('2026-04-01')?.id).toBe('rdl-8-2026');
    expect(limiteParaFecha('2026-10-05')).toBeUndefined();
    expect(limiteParaFecha('2028-01-01')).toBeUndefined();
  });
});

describe('envoltorio de tablas', () => {
  it('envuelve tablas sueltas y respeta las ya envueltas', () => {
    const html = '<p>a</p><table><tr><td>1</td></tr></table><div class="table-wrap" tabindex="0">\n <table><tr><td>2</td></tr></table></div>';
    const out = wrapTables(html);
    expect(out.match(/class="table-wrap"/g)).toHaveLength(2);
    expect(out).toContain('role="region"');
    expect(wrapTables(out)).toBe(out);
  });
});
