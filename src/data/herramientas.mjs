// @ts-check
/**
 * Registro central de calculadoras. Lo usan la portada, el índice de
 * calculadoras, los enlaces relacionados y el sitemap (fecha de revisión).
 *
 * Si añades una calculadora nueva: crea su página en
 * src/pages/calculadoras/<slug>.astro y añádela aquí.
 */

/**
 * @typedef {Object} Herramienta
 * @property {string} slug
 * @property {string} path
 * @property {string} nombre        Nombre corto para tarjetas y menús.
 * @property {string} resumen       Una frase: qué resuelve.
 * @property {'inquilino' | 'propietario' | 'ambos'} publico
 * @property {string} icono         Nombre del icono (src/components/Icon.astro).
 * @property {string} revisado      Fecha ISO de la última revisión del contenido y la lógica.
 */

/** @type {Herramienta[]} */
export const HERRAMIENTAS = [
  {
    slug: 'actualizacion-renta',
    path: '/calculadoras/actualizacion-renta/',
    nombre: 'Actualización de la renta',
    resumen: 'Cuánto puede subir tu alquiler este año según la fecha de tu contrato: IPC, IRAV y límite del 2 %.',
    publico: 'ambos',
    icono: 'trending',
    revisado: '2026-10-14',
  },
  {
    slug: 'carta-actualizacion-renta',
    path: '/calculadoras/carta-actualizacion-renta/',
    nombre: 'Carta de actualización de renta',
    resumen: 'Genera el texto para comunicar la nueva renta por escrito, con el porcentaje y la base legal.',
    publico: 'propietario',
    icono: 'letter',
    revisado: '2026-10-14',
  },
  {
    slug: 'fin-contrato-alquiler',
    path: '/calculadoras/fin-contrato-alquiler/',
    nombre: 'Fin del contrato y prórrogas',
    resumen: 'Fechas de prórroga obligatoria, prórroga tácita y plazos de preaviso de tu contrato.',
    publico: 'ambos',
    icono: 'calendar',
    revisado: '2026-10-14',
  },
  {
    slug: 'indemnizacion-desistimiento',
    path: '/calculadoras/indemnizacion-desistimiento/',
    nombre: 'Irse antes de tiempo',
    resumen: 'Si puedes dejar el piso, con cuánto preaviso y cuánta indemnización se puede reclamar.',
    publico: 'inquilino',
    icono: 'door',
    revisado: '2026-10-14',
  },
  {
    slug: 'devolucion-fianza',
    path: '/calculadoras/devolucion-fianza/',
    nombre: 'Devolución de la fianza',
    resumen: 'Plazo legal para devolver la fianza e intereses de demora si se retrasa.',
    publico: 'ambos',
    icono: 'shield',
    revisado: '2026-10-14',
  },
  {
    slug: 'prorrateo-alquiler',
    path: '/calculadoras/prorrateo-alquiler/',
    nombre: 'Prorrateo del alquiler',
    resumen: 'Cuánto pagar si entras o sales del piso a mitad de mes.',
    publico: 'ambos',
    icono: 'split',
    revisado: '2026-10-14',
  },
  {
    slug: 'cuanto-alquiler-puedo-pagar',
    path: '/calculadoras/cuanto-alquiler-puedo-pagar/',
    nombre: '¿Cuánto alquiler puedo pagar?',
    resumen: 'Renta máxima recomendable según tus ingresos y dinero necesario para entrar a vivir.',
    publico: 'inquilino',
    icono: 'wallet',
    revisado: '2026-10-14',
  },
  {
    slug: 'rentabilidad-alquiler',
    path: '/calculadoras/rentabilidad-alquiler/',
    nombre: 'Rentabilidad del alquiler',
    resumen: 'Rentabilidad bruta, neta y con hipoteca de un piso en alquiler.',
    publico: 'propietario',
    icono: 'chart',
    revisado: '2026-10-14',
  },
];

/** @param {string} slug */
export function herramienta(slug) {
  const h = HERRAMIENTAS.find((x) => x.slug === slug);
  if (!h) throw new Error(`Herramienta desconocida: ${slug}`);
  return h;
}
