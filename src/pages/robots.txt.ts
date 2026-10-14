import type { APIRoute } from 'astro';
import { SITE } from '../config/site';

/**
 * robots.txt
 * - Sitio en revisión (PUBLIC_SITE_INDEXABLE distinto de "true"): bloquea el rastreo.
 * - Sitio publicado: permite el rastreo e indica el sitemap.
 */
export const GET: APIRoute = () => {
  const body = SITE.indexable
    ? `User-agent: *\nAllow: /\n\nSitemap: ${SITE.siteUrl}/sitemap-index.xml\n`
    : `# Sitio en revisión: no indexar todavía.\nUser-agent: *\nDisallow: /\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
