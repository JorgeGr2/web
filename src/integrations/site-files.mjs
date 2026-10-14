// @ts-check
import { writeFile } from 'node:fs/promises';
import { usesThirdPartyAdsOrAnalytics } from '../config/env-schema.mjs';

/**
 * Genera, al terminar la compilación, los archivos que dependen de la
 * configuración y no son páginas:
 *  - ads.txt (solo si hay ID de AdSense)
 *  - _headers (cabeceras de seguridad y caché; lo entienden Cloudflare Pages
 *    y Netlify)
 *
 * @param {import('../config/env-schema.mjs').SiteEnv} cfg
 * @returns {import('astro').AstroIntegration}
 */
export default function siteFiles(cfg) {
  return {
    name: 'alquiler-claro:site-files',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        if (cfg.adsense.publisherId) {
          // Línea estándar de Google para AdSense. f08c47fec0942fa0 es el ID
          // de la entidad certificadora de Google (TAG-ID), igual para todos.
          const adsTxt = `google.com, ${cfg.adsense.publisherId}, DIRECT, f08c47fec0942fa0\n`;
          await writeFile(new URL('ads.txt', dir), adsTxt, 'utf8');
          logger.info('ads.txt generado.');
        } else {
          logger.info('ads.txt no generado (PUBLIC_ADSENSE_CLIENT vacío).');
        }

        await writeFile(new URL('_headers', dir), buildHeaders(cfg), 'utf8');
        logger.info('_headers generado.');
      },
    },
  };
}

/**
 * @param {import('../config/env-schema.mjs').SiteEnv} cfg
 */
export function buildCsp(cfg) {
  // Cloudflare Web Analytics se permite siempre: no usa cookies y Cloudflare
  // Pages puede inyectarlo automáticamente si lo activas en el panel.
  const cfScript = 'https://static.cloudflareinsights.com';
  const cfConnect = 'https://cloudflareinsights.com';

  if (usesThirdPartyAdsOrAnalytics(cfg)) {
    // AdSense y su CMP cargan recursos de muchos dominios de Google y crean
    // iframes. Google no publica una lista cerrada, por eso se permite https:
    // para scripts, imágenes, marcos y conexiones, manteniendo el resto de
    // protecciones (sin plugins, sin enmarcar este sitio, base fija).
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https:",
      "style-src 'self' 'unsafe-inline' https:",
      "img-src 'self' data: https:",
      "font-src 'self' https:",
      "connect-src 'self' https:",
      'frame-src https:',
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      'upgrade-insecure-requests',
    ].join('; ');
  }
  return [
    "default-src 'self'",
    `script-src 'self' ${cfScript}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    `connect-src 'self' ${cfConnect}`,
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    'upgrade-insecure-requests',
  ].join('; ');
}

/**
 * @param {import('../config/env-schema.mjs').SiteEnv} cfg
 */
export function buildHeaders(cfg) {
  const lines = [
    '/*',
    `  Content-Security-Policy: ${buildCsp(cfg)}`,
    '  X-Content-Type-Options: nosniff',
    '  X-Frame-Options: DENY',
    '  Referrer-Policy: strict-origin-when-cross-origin',
    '  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()',
    '  Strict-Transport-Security: max-age=31536000; includeSubDomains',
    '  Cross-Origin-Opener-Policy: same-origin-allow-popups',
  ];
  if (!cfg.indexable) lines.push('  X-Robots-Tag: noindex, nofollow');
  lines.push(
    '',
    '/_astro/*',
    '  Cache-Control: public, max-age=31536000, immutable',
    '',
    '/ads.txt',
    '  Cache-Control: public, max-age=3600',
    '',
  );
  return lines.join('\n');
}
