// Control de calidad del sitio compilado (carpeta dist/).
// Uso: npm run build && npm run qa:dist
//
// Comprueba en cada página: un único <h1>, title y description únicos y de
// longitud razonable, canonical correcta, idioma, JSON-LD válido, imágenes con
// alt, enlaces internos y anclas existentes, palabras pegadas, texto de
// relleno, sitemap, robots.txt, secretos y validez HTML (html-validate).
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { HtmlValidate } from 'html-validate';
import { parseEnv } from '../src/config/env-schema.mjs';
import { loadEnv } from 'vite';

const DIST = new URL('../dist/', import.meta.url).pathname;
const cfg = parseEnv({ ...loadEnv('production', process.cwd(), 'PUBLIC_'), ...process.env });
const errors = [];
const warnings = [];
const err = (page, msg) => errors.push(`${page}: ${msg}`);
const warn = (page, msg) => warnings.push(`${page}: ${msg}`);

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

if (!existsSync(DIST)) {
  console.error('No existe dist/. Ejecuta antes: npm run build');
  process.exit(1);
}

const files = walk(DIST);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const routeOf = (file) => {
  const rel = '/' + relative(DIST, file).replace(/\\/g, '/');
  if (rel === '/404.html') return '/404/';
  return rel.replace(/index\.html$/, '');
};

const decode = (s) =>
  s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)));

const pages = new Map();
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  pages.set(routeOf(file), { file, html, ids });
}

const titles = new Map();
const descriptions = new Map();

for (const [route, { html }] of pages) {
  const is404 = route === '/404/';
  const h1s = html.match(/<h1[\s>]/g) ?? [];
  if (h1s.length !== 1) err(route, `debe tener exactamente un <h1> (tiene ${h1s.length})`);
  if (!/<html lang="es"/.test(html)) err(route, 'falta lang="es"');

  const title = decode(/<title>([^<]*)<\/title>/.exec(html)?.[1] ?? '');
  if (!title) err(route, 'falta <title>');
  else {
    if (title.length > 70) warn(route, `title largo (${title.length}): ${title}`);
    if (titles.has(title)) err(route, `title duplicado con ${titles.get(title)}`);
    titles.set(title, route);
  }

  const desc = decode(/<meta name="description" content="([^"]*)"/.exec(html)?.[1] ?? '');
  if (!desc) err(route, 'falta meta description');
  else {
    if (desc.length < 50 || desc.length > 170) warn(route, `description de ${desc.length} caracteres`);
    if (descriptions.has(desc)) err(route, `description duplicada con ${descriptions.get(desc)}`);
    descriptions.set(desc, route);
  }

  const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1];
  if (!canonical) err(route, 'falta canonical');
  else if (!is404 && canonical !== `${cfg.siteUrl}${route}`) err(route, `canonical inesperada: ${canonical}`);

  const robots = /<meta name="robots" content="([^"]+)"/.exec(html)?.[1] ?? '';
  if (cfg.indexable && !is404 && robots.includes('noindex')) err(route, 'noindex en un sitio indexable');
  if (!cfg.indexable && !robots.includes('noindex')) err(route, 'falta noindex en modo revisión');

  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(m[1]);
      if (!data['@context'] || !data['@type']) err(route, 'JSON-LD sin @context o @type');
    } catch {
      err(route, 'JSON-LD no válido');
    }
  }

  for (const m of html.matchAll(/<img\b[^>]*>/g)) if (!/\salt="/.test(m[0])) err(route, `imagen sin alt: ${m[0].slice(0, 80)}`);

  // Texto visible (sin scripts ni estilos).
  const text = decode(
    html
      .replace(/<script[\s\S]*?<\/script>/g, ' ')
      .replace(/<style[\s\S]*?<\/style>/g, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' '),
  );
  for (const bad of ['lorem ipsum', 'TODO', 'FIXME', 'undefined', 'NaN', '[object Object]']) {
    if (text.includes(bad)) err(route, `texto sospechoso: "${bad}"`);
  }
  const glued = text.match(/[a-záéíóúñ)][.:;,][A-ZÁÉÍÓÚÑ¿¡][a-záéíóúñ]+/g)?.filter((g) => !/^\w\.\w/.test(g));
  if (glued?.length) err(route, `posibles palabras pegadas: ${[...new Set(glued)].slice(0, 5).join(' | ')}`);

  // Enlaces internos y anclas.
  for (const m of html.matchAll(/<a\b[^>]*\shref="([^"]+)"/g)) {
    const href = decode(m[1]);
    if (/^(https?:|mailto:|tel:)/.test(href)) {
      if (href.startsWith('http://')) warn(route, `enlace sin https: ${href}`);
      continue;
    }
    const [pathPart, hash] = href.split('#');
    const target = pathPart === '' ? route : pathPart.split('?')[0];
    if (!target.startsWith('/')) {
      err(route, `enlace relativo no admitido: ${href}`);
      continue;
    }
    if (target.endsWith('/') ? !pages.has(target) : !existsSync(join(DIST, target))) {
      err(route, `enlace interno roto: ${href}`);
      continue;
    }
    if (hash && pages.has(target) && !pages.get(target).ids.has(hash)) err(route, `ancla inexistente: ${href}`);
  }
}

// Sitemap y robots.
const sitemapFiles = files.filter((f) => /sitemap-\d+\.xml$/.test(f));
const sitemapUrls = new Set(sitemapFiles.flatMap((f) => [...readFileSync(f, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])));
for (const route of pages.keys()) {
  const url = `${cfg.siteUrl}${route}`;
  if (route === '/404/') {
    if (sitemapUrls.has(url)) err('sitemap', 'incluye la página 404');
  } else if (!sitemapUrls.has(url)) err('sitemap', `falta ${route}`);
}
if (!existsSync(join(DIST, 'robots.txt'))) err('robots.txt', 'no existe');
else {
  const robots = readFileSync(join(DIST, 'robots.txt'), 'utf8');
  if (cfg.indexable && !robots.includes('Sitemap:')) err('robots.txt', 'no indica el sitemap');
  if (!cfg.indexable && !robots.includes('Disallow: /')) err('robots.txt', 'debería bloquear el rastreo en modo revisión');
}
if (cfg.adsense.client && !existsSync(join(DIST, 'ads.txt'))) err('ads.txt', 'falta y hay ID de AdSense');
if (!existsSync(join(DIST, '_headers'))) err('_headers', 'no existe');

// Sin servicios de terceros si no están configurados.
if (!cfg.adsense.client && !cfg.ga4Id) {
  for (const [route, { html }] of pages) {
    if (/googlesyndication|googletagmanager|google-analytics/.test(html)) err(route, 'carga scripts de Google sin configuración');
  }
}

// Secretos o identificadores reales en el código fuente versionado.
const SRC = new URL('../', import.meta.url).pathname;
const sourceFiles = walk(SRC).filter(
  (f) => !/\/(node_modules|dist|\.git|\.astro|test-results|playwright-report)\//.test(f) && /\.(m?[jt]s|astro|md|json|css|ya?ml|txt|example)$/.test(f),
);
const secretPatterns = [
  [/ca-pub-\d{16}/, 'ID de editor de AdSense'],
  [/\bG-(?=[A-Z0-9]*\d)[A-Z0-9]{8,12}\b/, 'ID de Google Analytics'],
  [/AIza[0-9A-Za-z_-]{35}/, 'clave de API de Google'],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'clave privada'],
  [/(?:sk|pk)_live_[0-9a-zA-Z]{20,}/, 'clave de pago'],
  [/ghp_[0-9A-Za-z]{36}/, 'token de GitHub'],
];
for (const f of sourceFiles) {
  if (f.includes('/tests/') || f.endsWith('qa-dist.mjs')) continue;
  const s = readFileSync(f, 'utf8');
  for (const [re, what] of secretPatterns) if (re.test(s)) err(relative(SRC, f), `posible ${what}`);
}

// Validación HTML.
const validator = new HtmlValidate({
  extends: ['html-validate:recommended'],
  rules: {
    'no-trailing-whitespace': 'off',
    'attribute-boolean-style': 'off',
    'void-style': 'off',
    'no-inline-style': 'off',
    'long-title': 'off',
    'prefer-native-element': 'off',
    'no-redundant-for': 'off',
    'doctype-style': 'off',
    'attribute-empty-style': 'off',
    'no-raw-characters': 'off',
    'wcag/h37': 'error',
  },
});
for (const [route, { html }] of pages) {
  const report = await validator.validateString(html, route);
  for (const r of report.results) for (const m of r.messages) err(route, `HTML (${m.ruleId}): ${m.message} [línea ${m.line}]`);
}

console.log(`Páginas analizadas: ${pages.size}. URLs en el sitemap: ${sitemapUrls.size}.`);
if (warnings.length) console.log(`\nAvisos (${warnings.length}):\n - ${warnings.join('\n - ')}`);
if (errors.length) {
  console.error(`\nErrores (${errors.length}):\n - ${errors.join('\n - ')}`);
  process.exit(1);
}
console.log('\nQA del sitio compilado: sin errores.');
