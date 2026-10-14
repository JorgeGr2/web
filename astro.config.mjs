// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';
import { parseEnv, validateEnv } from './src/config/env-schema.mjs';
import siteFiles from './src/integrations/site-files.mjs';
import { lastmodPorRuta } from './src/data/lastmod.mjs';

// Las variables se leen de .env (en local) o del panel del alojamiento.
const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const cfg = parseEnv({ ...loadEnv(mode, process.cwd(), 'PUBLIC_'), ...pickPublic(process.env) });

const errors = validateEnv(cfg);
if (errors.length) {
  throw new Error(`\n\nConfiguración no válida:\n - ${errors.join('\n - ')}\n\nRevisa .env.example y el README.\n`);
}

const lastmod = lastmodPorRuta();

export default defineConfig({
  site: cfg.siteUrl,
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // Todo el CSS en archivos externos: mejor caché y CSP estricta.
    inlineStylesheets: 'never',
  },
  vite: {
    build: {
      // Evita que Vite incruste scripts pequeños dentro del HTML; así la
      // política CSP puede limitar los scripts a 'self'.
      assetsInlineLimit: 0,
    },
  },
  integrations: [
    sitemap({
      filter: (page) => !/\/404\/?$/.test(page),
      serialize(item) {
        const path = new URL(item.url).pathname;
        const date = lastmod[path];
        if (date) item.lastmod = new Date(`${date}T00:00:00Z`).toISOString();
        return item;
      },
    }),
    siteFiles(cfg),
  ],
  devToolbar: { enabled: false },
});

/** @param {NodeJS.ProcessEnv} env */
function pickPublic(env) {
  /** @type {Record<string, string>} */
  const out = {};
  for (const [k, v] of Object.entries(env)) if (k.startsWith('PUBLIC_') && typeof v === 'string') out[k] = v;
  return out;
}
