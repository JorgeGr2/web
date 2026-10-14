// @ts-check
/**
 * Lectura y validación de las variables de entorno del sitio.
 *
 * Se usa desde dos sitios:
 *  - astro.config.mjs (Node, al compilar): para fijar `site`, generar ads.txt,
 *    cabeceras de seguridad y detener la compilación si la configuración es
 *    peligrosa (p. ej. indexar sin datos del titular).
 *  - src/config/site.ts (páginas): para leer la misma configuración ya
 *    normalizada.
 *
 * Es JavaScript con JSDoc para poder importarlo desde la configuración de
 * Astro sin pasos extra.
 */

/**
 * @typedef {Object} SiteEnv
 * @property {string} siteUrl
 * @property {string} siteName
 * @property {boolean} indexable
 * @property {{ name: string, nif: string, address: string, email: string }} owner
 * @property {string} googleSiteVerification
 * @property {{ client: string, publisherId: string, slotInArticle: string, slotFooter: string }} adsense
 * @property {string} ga4Id
 * @property {string} cfBeaconToken
 * @property {boolean} cfAnalytics
 */

/** Dominio elegido para el proyecto (se puede sustituir con PUBLIC_SITE_URL). */
const DEFAULT_URL = 'https://www.alquilerenregla.es';
/** Dominios de ejemplo de la documentación: nunca deben llegar a producción. */
const PLACEHOLDER_HOST = /(^|\.)tu-?dominio\.(es|com)$/i;

/** @param {unknown} v */
const str = (v) => (typeof v === 'string' ? v.trim() : '');

/**
 * Normaliza las variables de entorno en un objeto de configuración.
 * @param {Record<string, string | undefined>} raw
 * @returns {SiteEnv}
 */
export function parseEnv(raw) {
  const client = str(raw.PUBLIC_ADSENSE_CLIENT);
  const siteUrl = (str(raw.PUBLIC_SITE_URL) || DEFAULT_URL).replace(/\/+$/, '');
  return {
    siteUrl,
    siteName: str(raw.PUBLIC_SITE_NAME) || 'Alquiler en Regla',
    indexable: str(raw.PUBLIC_SITE_INDEXABLE).toLowerCase() === 'true',
    owner: {
      name: str(raw.PUBLIC_OWNER_NAME),
      nif: str(raw.PUBLIC_OWNER_NIF),
      address: str(raw.PUBLIC_OWNER_ADDRESS),
      email: str(raw.PUBLIC_CONTACT_EMAIL),
    },
    googleSiteVerification: str(raw.PUBLIC_GOOGLE_SITE_VERIFICATION),
    adsense: {
      client,
      publisherId: client.replace(/^ca-/, ''),
      slotInArticle: str(raw.PUBLIC_ADSENSE_SLOT_INARTICLE),
      slotFooter: str(raw.PUBLIC_ADSENSE_SLOT_FOOTER),
    },
    ga4Id: str(raw.PUBLIC_GA4_ID),
    cfBeaconToken: str(raw.PUBLIC_CF_BEACON_TOKEN),
    // Cloudflare Web Analytics activado desde el panel de Cloudflare Pages (no
    // necesita código) o mediante el token manual.
    cfAnalytics: str(raw.PUBLIC_CF_ANALYTICS_ENABLED).toLowerCase() === 'true' || Boolean(str(raw.PUBLIC_CF_BEACON_TOKEN)),
  };
}

/**
 * Devuelve la lista de errores de configuración. Una lista vacía significa
 * que la configuración es coherente.
 * @param {SiteEnv} cfg
 * @returns {string[]}
 */
export function validateEnv(cfg) {
  /** @type {string[]} */
  const errors = [];

  if (!/^https?:\/\/[^\s/]+\.[^\s/]+$/.test(cfg.siteUrl)) {
    errors.push(`PUBLIC_SITE_URL no es una URL válida sin ruta ni barra final: "${cfg.siteUrl}"`);
  }
  if (cfg.adsense.client && !/^ca-pub-\d{16}$/.test(cfg.adsense.client)) {
    errors.push('PUBLIC_ADSENSE_CLIENT debe tener el formato ca-pub-XXXXXXXXXXXXXXXX (16 dígitos).');
  }
  for (const [key, val] of /** @type {const} */ ([
    ['PUBLIC_ADSENSE_SLOT_INARTICLE', cfg.adsense.slotInArticle],
    ['PUBLIC_ADSENSE_SLOT_FOOTER', cfg.adsense.slotFooter],
  ])) {
    if (val && !/^\d{6,12}$/.test(val)) errors.push(`${key} debe ser el número del bloque de anuncios (solo dígitos).`);
    if (val && !cfg.adsense.client) errors.push(`${key} está definido pero falta PUBLIC_ADSENSE_CLIENT.`);
  }
  if (cfg.ga4Id && !/^G-[A-Z0-9]{4,16}$/.test(cfg.ga4Id)) {
    errors.push('PUBLIC_GA4_ID debe tener el formato G-XXXXXXXXXX.');
  }
  if (cfg.cfBeaconToken && !/^[a-f0-9]{32}$/i.test(cfg.cfBeaconToken)) {
    errors.push('PUBLIC_CF_BEACON_TOKEN debe ser el token hexadecimal de 32 caracteres de Cloudflare Web Analytics.');
  }
  if (cfg.owner.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cfg.owner.email)) {
    errors.push('PUBLIC_CONTACT_EMAIL no parece un correo válido.');
  }

  if (cfg.indexable) {
    if (esDominioDeEjemplo(cfg.siteUrl)) errors.push('PUBLIC_SITE_URL sigue con el valor de ejemplo; pon tu dominio real.');
    if (!cfg.siteUrl.startsWith('https://')) errors.push('PUBLIC_SITE_URL debe usar https:// en producción.');
    const missing = [
      ['PUBLIC_OWNER_NAME', cfg.owner.name],
      ['PUBLIC_OWNER_NIF', cfg.owner.nif],
      ['PUBLIC_OWNER_ADDRESS', cfg.owner.address],
      ['PUBLIC_CONTACT_EMAIL', cfg.owner.email],
    ]
      .filter(([, v]) => !v)
      .map(([k]) => k);
    if (missing.length) {
      errors.push(
        `PUBLIC_SITE_INDEXABLE=true exige los datos del titular (LSSI-CE, art. 10). Faltan: ${missing.join(', ')}.`,
      );
    }
  }
  return errors;
}

/** @param {string} url */
function esDominioDeEjemplo(url) {
  try {
    return PLACEHOLDER_HOST.test(new URL(url).hostname);
  } catch {
    return false;
  }
}

/**
 * Indica si el sitio carga algún servicio de terceros que necesite
 * relajar la política de seguridad de contenidos (CSP).
 * @param {SiteEnv} cfg
 */
export function usesThirdPartyAdsOrAnalytics(cfg) {
  return Boolean(cfg.adsense.client || cfg.ga4Id);
}
