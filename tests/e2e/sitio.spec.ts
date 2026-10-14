import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

// Todas las rutas generadas en dist/ (excepto 404).
function rutas(): string[] {
  const dist = join(process.cwd(), 'dist');
  const walk = (d: string): string[] => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
  return walk(dist)
    .filter((f) => f.endsWith('index.html'))
    .map((f) => '/' + relative(dist, f).replace(/\\/g, '/').replace(/index\.html$/, ''));
}

function vigilarErrores(page: Page): string[] {
  const errores: string[] = [];
  page.on('console', (m) => m.type() === 'error' && errores.push(m.text()));
  page.on('pageerror', (e) => errores.push(e.message));
  return errores;
}

for (const ruta of rutas()) {
  test(`carga sin errores, sin desbordamiento y accesible: ${ruta}`, async ({ page }) => {
    const errores = vigilarErrores(page);
    const resp = await page.goto(ruta);
    expect(resp?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    const desborde = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(desborde, 'desbordamiento horizontal').toBeLessThanOrEqual(0);
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    const graves = axe.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(graves.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(', ')}`)).toEqual([]);
    expect(errores).toEqual([]);
  });
}

test('modo oscuro: sin problemas de contraste en portada y calculadora', async ({ browser }) => {
  const ctx = await browser.newContext({ colorScheme: 'dark' });
  const page = await ctx.newPage();
  for (const ruta of ['/', '/calculadoras/actualizacion-renta/', '/normativa/']) {
    await page.goto(ruta);
    const axe = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze();
    expect(axe.violations.map((v) => v.nodes.map((n) => n.target.join(' ')).join(', '))).toEqual([]);
  }
  await ctx.close();
});

test('la página 404 responde con estado 404', async ({ page }) => {
  const resp = await page.goto('/esta-pagina-no-existe/');
  expect(resp?.status()).toBe(404);
  await expect(page.locator('h1')).toContainText('No hemos encontrado');
});

test('funciona con la política de seguridad de contenidos (CSP) de producción', async ({ page }) => {
  const { buildCsp } = await import('../../src/integrations/site-files.mjs');
  const { parseEnv } = await import('../../src/config/env-schema.mjs');
  const csp = buildCsp(parseEnv({}));
  await page.route('**/*', async (route) => {
    const resp = await route.fetch();
    await route.fulfill({ response: resp, headers: { ...resp.headers(), 'content-security-policy': csp } });
  });
  const errores = vigilarErrores(page);
  await page.goto('/calculadoras/actualizacion-renta/');
  await page.fill('#renta', '1000');
  await page.fill('#fechaFirma', '2021-06-01');
  await page.fill('#fechaActualizacion', '2025-06-01');
  await page.check('input[name=clausula][value=ipc]');
  await page.fill('#indicePct', '2');
  await page.click('button[type=submit]');
  await expect(page.locator('#resultado')).toContainText('1020,00');
  expect(errores).toEqual([]);
});
