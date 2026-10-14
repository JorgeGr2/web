/**
 * Configuración del sitio para las páginas. Los valores vienen de las
 * variables de entorno (ver .env.example) ya validadas en astro.config.mjs.
 */
import { parseEnv } from './env-schema.mjs';

const cfg = parseEnv(import.meta.env as unknown as Record<string, string | undefined>);

export const SITE = {
  ...cfg,
  description:
    'Calculadoras y guías gratuitas para inquilinos y propietarios en España: actualización de la renta (IPC, IRAV y límite del 2 %), fianza, preaviso, duración del contrato y rentabilidad.',
  locale: 'es_ES',
  lang: 'es',
  /** Datos del titular completos (requisito para indexar). */
  ownerComplete: Boolean(cfg.owner.name && cfg.owner.nif && cfg.owner.address && cfg.owner.email),
  adsEnabled: Boolean(cfg.adsense.client),
  analyticsEnabled: Boolean(cfg.ga4Id),
} as const;

/**
 * Proveedor de alojamiento, citado en la política de privacidad.
 * Si publicas en otro proveedor (Netlify, GitHub Pages…), cambia estos datos.
 */
export const HOSTING = {
  nombre: 'Cloudflare Pages (Cloudflare, Inc.)',
  privacidad: 'https://www.cloudflare.com/privacypolicy/',
};

/** Texto a mostrar cuando el titular aún no ha rellenado un dato obligatorio. */
export const PENDIENTE = '[Pendiente de completar por el titular del sitio]';

export function absoluteUrl(path: string): string {
  return new URL(path, `${SITE.siteUrl}/`).toString();
}
