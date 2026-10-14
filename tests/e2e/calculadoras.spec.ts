import { test, expect } from '@playwright/test';

const resultado = (page: import('@playwright/test').Page) => page.locator('#resultado');

test('actualización: contrato posterior a 2023 con límite del RDL 29/2026', async ({ page }) => {
  await page.goto('/calculadoras/actualizacion-renta/');
  await page.fill('#renta', '1.000');
  await page.fill('#fechaFirma', '2024-11-01');
  await page.fill('#fechaActualizacion', '2026-11-01');
  await page.check('input[name=clausula][value=ipc]');
  await page.fill('#indicePct', '3');
  await page.fill('#iravPct', '2,47');
  await page.check('input[name=superaReferencia][value=no]');
  await page.click('button[type=submit]');
  await expect(resultado(page)).toContainText('1020,00');
  await expect(resultado(page)).toContainText('2,00 %');
  // El enlace a la carta lleva los datos del cálculo.
  const href = await page.locator('#resultado a', { hasText: 'Redactar la carta' }).getAttribute('href');
  expect(href).toContain('pct=2');
  // La URL permite compartir el cálculo y lo repite al recargar.
  await page.reload();
  await expect(resultado(page)).toContainText('1020,00');
});

test('actualización: muestra errores accesibles si faltan datos', async ({ page }) => {
  await page.goto('/calculadoras/actualizacion-renta/');
  await page.click('button[type=submit]');
  const resumen = page.locator('[data-error-summary]');
  await expect(resumen).toBeVisible();
  await expect(resumen).toContainText('Revisa estos datos');
  await expect(page.locator('#renta')).toHaveAttribute('aria-invalid', 'true');
});

test('actualización: sin cláusula, la renta no cambia', async ({ page }) => {
  await page.goto('/calculadoras/actualizacion-renta/');
  await page.fill('#renta', '800');
  await page.fill('#fechaFirma', '2022-03-01');
  await page.fill('#fechaActualizacion', '2026-03-01');
  await page.check('input[name=clausula][value=ninguna]');
  await page.click('button[type=submit]');
  await expect(resultado(page)).toContainText('no se actualiza');
});

test('carta: genera el texto con los datos del cálculo', async ({ page }) => {
  await page.goto('/calculadoras/carta-actualizacion-renta/?rentaActual=1000&pct=2&fechaContrato=2024-11-01&fechaActualizacion=2026-11-01&criterio=IRAV&mesIndice=2026-09');
  await page.fill('#arrendador', 'Ana Pérez');
  await page.fill('#arrendatario', 'Luis García');
  await page.fill('#direccionVivienda', 'Calle Mayor 1, Madrid');
  await page.fill('#fechaEnvio', '2026-10-10');
  await page.click('button[type=submit]');
  await expect(page.locator('.letter')).toContainText('Porcentaje de incremento aplicado: 2,00 %');
  await expect(page.locator('.letter')).toContainText('septiembre de 2026');
  // Los nombres no se guardan en la URL.
  expect(page.url()).not.toContain('Ana');
});

test('fin del contrato: calcula la prórroga obligatoria', async ({ page }) => {
  await page.goto('/calculadoras/fin-contrato-alquiler/');
  await page.fill('#fechaInicio', '2024-09-01');
  await page.fill('#duracionPactadaAnios', '1');
  await page.check('input[name=arrendador][value=fisica]');
  await page.click('button[type=submit]');
  await expect(resultado(page)).toContainText('01/09/2029');
  await expect(resultado(page)).toContainText('01/09/2032');
});

test('desistimiento: indemnización proporcional', async ({ page }) => {
  await page.goto('/calculadoras/indemnizacion-desistimiento/');
  await page.fill('#renta', '900');
  await page.fill('#fechaInicio', '2025-01-15');
  await page.fill('#fechaFinPeriodo', '2026-01-15');
  await page.fill('#fechaComunicacion', '2025-06-01');
  await page.fill('#fechaSalida', '2025-07-15');
  await page.check('input[name=clausula][value=si]');
  await page.click('button[type=submit]');
  await expect(resultado(page)).toContainText('453,70');
});

test('fianza: intereses de demora', async ({ page }) => {
  await page.goto('/calculadoras/devolucion-fianza/');
  await page.fill('#importe', '800');
  await page.fill('#fechaEntregaLlaves', '2026-01-10');
  await page.fill('#fechaDevolucion', '2026-04-10');
  await page.click('button[type=submit]');
  await expect(resultado(page)).toContainText('804,20');
});

test('prorrateo: entrada a mitad de mes', async ({ page }) => {
  await page.goto('/calculadoras/prorrateo-alquiler/');
  await page.fill('#renta', '900');
  await page.check('input[name=movimiento][value=entrada]');
  await page.fill('#fecha', '2026-10-15');
  await page.click('button[type=submit]');
  await expect(resultado(page)).toContainText('493,55');
});

test('asequibilidad: renta máxima según ingresos', async ({ page }) => {
  await page.goto('/calculadoras/cuanto-alquiler-puedo-pagar/');
  await page.fill('#ingresosNetos', '2000');
  await page.click('button[type=submit]');
  await expect(resultado(page)).toContainText('600,00');
});

test('rentabilidad: bruta y neta', async ({ page }) => {
  await page.goto('/calculadoras/rentabilidad-alquiler/');
  await page.fill('#precioCompra', '200000');
  await page.fill('#gastosCompra', '20000');
  await page.fill('#rentaMensual', '1000');
  await page.fill('#ibi', '500');
  await page.fill('#comunidad', '600');
  await page.fill('#seguros', '300');
  await page.fill('#mantenimiento', '600');
  await page.click('button[type=submit]');
  await expect(resultado(page)).toContainText('4,55 %');
  await expect(resultado(page)).toContainText('6,00 %');
});

test('restablecer limpia el resultado', async ({ page }) => {
  await page.goto('/calculadoras/prorrateo-alquiler/?renta=900&movimiento=salida&fecha=2026-02-10');
  await expect(resultado(page)).toContainText('321,43');
  await page.click('button[type=reset]');
  await expect(resultado(page)).toHaveAttribute('data-state', 'empty');
  expect(page.url()).not.toContain('renta=');
});
