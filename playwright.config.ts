import { defineConfig, devices } from '@playwright/test';

/**
 * Pruebas de extremo a extremo sobre el sitio compilado (astro preview).
 * Uso: npm run build && npm run test:e2e
 */
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:4321',
    locale: 'es-ES',
    timezoneId: 'Europe/Madrid',
  },
  webServer: {
    // --ignore-lock: no se detiene si quedó un aviso de «servidor ya en marcha»
    // de una ejecución anterior interrumpida.
    command: 'npx astro preview --host 127.0.0.1 --port 4321 --ignore-lock',
    url: 'http://127.0.0.1:4321/',
    reuseExistingServer: true,
    timeout: 60_000,
  },
  projects: [
    { name: 'escritorio', use: { ...devices['Desktop Chrome'] } },
    { name: 'movil', use: { ...devices['Pixel 7'] } },
  ],
});
