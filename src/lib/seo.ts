import { SITE, absoluteUrl } from '../config/site';

export interface MigaLd {
  label: string;
  href: string;
}

/** BreadcrumbList (datos estructurados admitidos por Google). */
export function breadcrumbLd(items: MigaLd[]): Record<string, unknown> {
  const all = [{ label: 'Inicio', href: '/' }, ...items];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: all.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.label,
      item: absoluteUrl(it.href),
    })),
  };
}

/** Datos del sitio para la portada. No se declara una organización inventada. */
export function websiteLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.siteName,
    url: absoluteUrl('/'),
    inLanguage: 'es-ES',
    description: SITE.description,
  };
}

/** Article para guías: fechas reales y autoría del titular si está configurada. */
export function articleLd(opts: { title: string; description: string; path: string; published: string; modified: string }): Record<string, unknown> {
  const author = SITE.owner.name
    ? { '@type': 'Person', name: SITE.owner.name, url: absoluteUrl('/sobre-el-proyecto/') }
    : { '@type': 'Organization', name: SITE.siteName, url: absoluteUrl('/') };
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    description: opts.description,
    inLanguage: 'es-ES',
    mainEntityOfPage: absoluteUrl(opts.path),
    datePublished: opts.published,
    dateModified: opts.modified,
    author,
    publisher: { '@type': 'Organization', name: SITE.siteName, url: absoluteUrl('/') },
    image: absoluteUrl('/og/default.png'),
  };
}
