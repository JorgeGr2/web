# Alquiler en Regla

Calculadoras y guías gratuitas sobre el **alquiler de vivienda en España** para inquilinos y pequeños propietarios: actualización de la renta (IPC, IRAV y límite extraordinario del 2 %), carta de actualización, fin del contrato y prórrogas, desistimiento, devolución de la fianza, prorrateo, asequibilidad y rentabilidad. Cada resultado explica los pasos y cita la norma aplicada, con fecha de revisión.

Sitio estático hecho con [Astro](https://astro.build/), preparado para publicarse gratis en Cloudflare Pages y monetizarse con Google AdSense **cuando lo aprueben**. Por defecto no carga ningún script de terceros ni usa cookies.

> Estado a 14/10/2026: **no publicado**. El código está listo y probado; la publicación requiere tu dominio y tus cuentas (ver [guía de despliegue](docs/03-guia-despliegue.md)).

## Documentación

| Documento | Contenido |
|---|---|
| [01 · Investigación de mercado](docs/01-investigacion-mercado.md) | 12 nichos evaluados, criterios, tabla comparativa, decisión e incertidumbres |
| [02 · Estrategia SEO](docs/02-estrategia-seo-palabras-clave.md) | Mapa de palabras clave, arquitectura, SEO técnico y plan editorial de 30 contenidos |
| [03 · Guía de despliegue](docs/03-guia-despliegue.md) | Paso a paso para publicar sin experiencia previa |
| [04 · Guía de AdSense](docs/04-guia-adsense-monetizacion.md) | Fases A-F: preparación, indexación, solicitud, activación, ingresos y escalado |
| [05 · Modelo financiero](docs/05-modelo-financiero.md) | Escenarios conservador, intermedio y optimista; costes; sensibilidad |
| [06 · Plan de 90 días](docs/06-plan-90-dias.md) | Calendario SEO y editorial |
| [07 · Analítica y seguimiento](docs/07-analitica-y-seguimiento.md) | Search Console, Cloudflare Web Analytics, GA4 con consentimiento; rutinas |
| [08 · Riesgos](docs/08-riesgos.md) | Riesgos principales y medidas |
| [09 · Mantenimiento normativo](docs/09-mantenimiento-normativo.md) | Rutina mensual para mantener los datos legales al día |
| [10 · Resultados de las pruebas](docs/10-qa-resultados.md) | Resultados reales de tipos, pruebas, QA, accesibilidad y Lighthouse |
| [11 · Fuentes](docs/11-fuentes.md) | Fuentes consultadas y fecha |
| [12 · Tareas pendientes y próximas acciones](docs/12-tareas-pendientes-y-proximas-acciones.md) | Lo que te toca hacer, por orden de prioridad |

## Funcionalidades implementadas

**Calculadoras** (`/calculadoras/`), todas con validación accesible, pasos del cálculo, avisos, base legal enlazada, URL para compartir el cálculo e impresión:

1. **Actualización de la renta**: aplica la cláusula del contrato (IPC, IRAV, IGC, % fijo o ninguna), el tope del IRAV para contratos desde el 26/05/2023 y los límites extraordinarios de 2026 según la fecha (RDL 29/2026, con la regla del índice de referencia y los escenarios de los decretos decaídos). Indica qué mes del índice usar.
2. **Carta de actualización de la renta**: genera el texto con los requisitos del art. 18.3 LAU; se rellena desde la calculadora; copiar, descargar .txt o imprimir/PDF. No guarda nombres ni direcciones.
3. **Fin del contrato y prórrogas**: línea temporal con prórroga obligatoria (5/7 años), tácita (3 años) y fechas límite de preaviso.
4. **Irse antes de tiempo**: seis meses, 30 días de preaviso, fecha mínima de salida e indemnización proporcional.
5. **Devolución de la fianza**: plazo de un mes e intereses de demora por tramos anuales del interés legal; máximos de fianza y garantías.
6. **Prorrateo del alquiler**: dos métodos.
7. **¿Cuánto alquiler puedo pagar?**: renta máxima según ingresos y dinero de entrada con máximos legales.
8. **Rentabilidad del alquiler**: bruta, neta y sobre capital propio con hipoteca (amortización francesa).

**Contenido:** 20 guías en Markdown agrupadas por temas, página de estado normativo con historial de cambios, portada, índices, metodología, sobre el proyecto, contacto, aviso legal, privacidad, cookies, publicidad y 404.

**Técnico:** HTML semántico; títulos, descripciones y canónicas únicos; sitemap con `lastmod`; robots.txt y `noindex` controlados por configuración; JSON-LD (BreadcrumbList, WebSite, Article); diseño responsive con modo oscuro; accesibilidad WCAG 2.1 AA verificada con axe; cabeceras de seguridad y CSP; integración de AdSense, ads.txt, CMP de Google y GA4 con Consent Mode v2 activables por variables de entorno; validación de la configuración que impide indexar sin datos del titular.

## Requisitos

- Node.js 24 LTS (mínimo 22.12)
- npm 10 o superior (para instalar dependencias nuevas se recomienda npm 11, que evita un error conocido de npm 10 al resolver dependencias)

## Instalación y ejecución local

Todos los comandos se ejecutan en la carpeta del proyecto:

```bash
npm ci                 # instala dependencias exactas (package-lock.json)
cp .env.example .env   # opcional: tus valores locales
npm run dev            # http://localhost:4321
```

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga automática |
| `npm run build` | Compila el sitio estático en `dist/` |
| `npm run preview` | Sirve `dist/` para revisarlo |
| `npm run check` | Comprobación de tipos (TypeScript y Astro) |
| `npm test` | Pruebas unitarias (Vitest) |
| `npm run qa:dist` | Control de calidad del sitio compilado (metadatos, enlaces, sitemap, HTML, secretos) |
| `npm run verify` | `check` + `test` + `build` + `qa:dist` |
| `npm run test:e2e` | Pruebas en navegador (Playwright): accesibilidad, móvil, CSP y calculadoras. La primera vez: `npx playwright install chromium` |
| `npm run assets` | Regenera iconos e imagen para redes sociales |

## Configuración (variables de entorno)

Todas empiezan por `PUBLIC_` porque su valor es público. Ninguna es un secreto. Detalle en [`.env.example`](.env.example).

| Variable | Obligatoria | Descripción |
|---|---|---|
| `PUBLIC_SITE_URL` | No (recomendada) | URL canónica con https y sin barra final. Si no se define, se usa `https://www.alquilerenregla.es`; cámbiala solo si publicas en otro dominio. Con `PUBLIC_SITE_INDEXABLE=true` la compilación rechaza el dominio de ejemplo y las URL sin https |
| `PUBLIC_SITE_NAME` | No | Nombre visible (por defecto «Alquiler en Regla») |
| `PUBLIC_SITE_INDEXABLE` | Para publicar | Por defecto `false` (`noindex` y robots bloqueante). Ponla a `true` solo al lanzar |
| `PUBLIC_OWNER_NAME`, `PUBLIC_OWNER_NIF`, `PUBLIC_OWNER_ADDRESS`, `PUBLIC_CONTACT_EMAIL` | Sí para indexar | Datos del titular (LSSI-CE). La compilación falla si faltan con `PUBLIC_SITE_INDEXABLE=true` |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | No | Verificación de Search Console por etiqueta HTML |
| `PUBLIC_ADSENSE_CLIENT` | No | `ca-pub-` + 16 dígitos. Activa el código de AdSense y genera `ads.txt` |
| `PUBLIC_ADSENSE_SLOT_INARTICLE`, `PUBLIC_ADSENSE_SLOT_FOOTER` | No | Bloques manuales opcionales |
| `PUBLIC_GA4_ID` | No | Google Analytics 4 con consentimiento denegado por defecto |
| `PUBLIC_CF_ANALYTICS_ENABLED` | No | Declara que usas Cloudflare Web Analytics (para la política de privacidad) |
| `PUBLIC_CF_BEACON_TOKEN` | No | Cloudflare Web Analytics manual fuera de Cloudflare Pages |

## Despliegue (resumen)

Cloudflare Pages → Conectar a Git → repositorio → preset **Astro**, comando `npm run build`, salida `dist`, variable `NODE_VERSION=24` y las variables anteriores. Dominio propio en «Dominios personalizados». Guía completa para principiantes: [docs/03-guia-despliegue.md](docs/03-guia-despliegue.md).

## Estructura

```
src/
  pages/            Páginas (calculadoras, guías, legales, robots.txt)
  content/guias/    Guías en Markdown (frontmatter validado)
  data/             normativa.ts (datos legales fechados), herramientas, cambios
  lib/calc/         Lógica pura de cada calculadora (probada)
  lib/ui/           Utilidades de interfaz seguras (sin innerHTML)
  components/ layouts/ styles/
  config/           Validación de variables de entorno
  integrations/     ads.txt, _headers y tablas accesibles al compilar
tests/unit/         Vitest
tests/e2e/          Playwright
scripts/            QA del sitio compilado y generación de recursos
docs/               Documentación del proyecto
```

## Mantenimiento

La normativa del alquiler cambia a menudo. Cada mes, actualiza el IRAV y revisa el BOE siguiendo [docs/09-mantenimiento-normativo.md](docs/09-mantenimiento-normativo.md). Todo lo que cambia con la ley está en `src/data/normativa.ts`.

## Aviso

La información del sitio es orientativa y no constituye asesoramiento jurídico ni fiscal. Las previsiones de ingresos de la documentación son hipótesis, no garantías.
