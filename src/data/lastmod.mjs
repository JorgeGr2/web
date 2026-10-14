// @ts-check
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { HERRAMIENTAS } from './herramientas.mjs';
import { PAGINAS_FIJAS } from './paginas-fijas.mjs';

/**
 * Devuelve { '/ruta/': 'AAAA-MM-DD' } con la fecha de última revisión de cada
 * página, para el campo <lastmod> del sitemap.
 */
export function lastmodPorRuta() {
  /** @type {Record<string, string>} */
  const map = {};
  for (const h of HERRAMIENTAS) map[h.path] = h.revisado;
  for (const p of PAGINAS_FIJAS) map[p.path] = p.revisado;

  const dir = fileURLToPath(new URL('../content/guias/', import.meta.url));
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const src = readFileSync(`${dir}/${file}`, 'utf8');
    const m = /^actualizado:\s*['"]?(\d{4}-\d{2}-\d{2})/m.exec(src);
    if (m?.[1]) map[`/guias/${file.replace(/\.md$/, '')}/`] = m[1];
  }
  return map;
}
