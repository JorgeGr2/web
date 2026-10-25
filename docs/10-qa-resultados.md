# 10. Resultados reales de las pruebas

**Fecha de ejecución:** 14/10/2026; repetidas el 25/10/2026 tras añadir 12 guías, en el entorno de desarrollo (Linux, Node 22.22.0, Chromium 141 de Playwright). Todas las cifras de esta página proceden de ejecuciones reales; las salidas se reproducen resumidas.

## 10.1 Resumen

| Comprobación | Comando | Resultado |
|---|---|---|
| Instalación limpia | `npm ci` | Correcta, `found 0 vulnerabilities` |
| Auditoría de dependencias | `npm audit` | `found 0 vulnerabilities` |
| Tipos (TypeScript + Astro) | `npm run check` | `0 errors, 0 warnings, 0 hints` (72 archivos) |
| Pruebas unitarias | `npm test` | **73 pruebas superadas** (3 archivos): lógica de las 8 calculadoras, fechas, formatos, configuración, CSP, periodos normativos |
| Compilación | `npm run build` | 40 páginas generadas |
| QA del sitio compilado | `npm run qa:dist` | `Páginas analizadas: 40. URLs en el sitemap: 39.` → **sin errores** |
| QA en modo producción simulado (indexable, AdSense, GA4 con IDs ficticios) | variables de prueba + `build` + `qa:dist` | Sin errores; `ads.txt` correcto; `robots.txt` con `Sitemap:`; `index, follow` en las páginas |
| Bloqueo de publicación sin datos del titular | `PUBLIC_SITE_INDEXABLE=true npm run build` | La compilación **falla** con el mensaje que lista las variables que faltan (comportamiento esperado) |
| Pruebas en navegador | `npm run test:e2e` | **106 pruebas superadas** (escritorio y móvil) |
| Lighthouse (móvil simulado, local) | Lighthouse 12.8.2 | Portada, calculadora de actualización y guía del IRAV: **100 / 100 / 100** en rendimiento, accesibilidad y buenas prácticas; SEO **100** en modo indexable (66 en modo revisión, por el `noindex` intencionado). LCP 0,9-1,3 s, CLS 0, TBT 0 ms |

## 10.2 Qué comprueba cada batería

**`qa:dist` (scripts/qa-dist.mjs)** en las 40 páginas:
- Exactamente un `<h1>`; `lang="es"`.
- `<title>` y meta description presentes y **únicos**; avisos de longitud.
- Canónica absoluta y correcta; `noindex` coherente con el modo.
- JSON-LD válido con `@context` y `@type`.
- Imágenes con `alt`.
- **Enlaces internos y anclas** existentes (0 rotos).
- Texto de relleno o errores de plantilla («lorem ipsum», «undefined», «NaN»…) y palabras pegadas.
- Sitemap: contiene todas las páginas y excluye la 404. `robots.txt` y `_headers` presentes; `ads.txt` si hay AdSense.
- Que no se cargan scripts de Google sin configuración.
- **Secretos** en el código fuente: IDs reales de AdSense o Analytics, claves de API de Google, claves privadas, tokens (0 hallazgos).
- Validación HTML con `html-validate` (reglas recomendadas): 0 errores.

**Playwright (tests/e2e)**, en escritorio (Desktop Chrome) y móvil (Pixel 7):
- Cada página: estado 200, un `<h1>`, **sin desbordamiento horizontal**, **sin errores de consola** y **0 violaciones graves o críticas de accesibilidad** (axe-core, WCAG 2.1 A/AA).
- Contraste en **modo oscuro** (portada, calculadora, normativa).
- La página 404 devuelve estado 404.
- Las 8 calculadoras devuelven los resultados esperados con casos resueltos a mano (p. ej., 1.000 € → 1.020,00 € con el límite del 2 %; desistimiento 453,70 €; fianza 804,20 €; prorrateo 493,55 €; rentabilidad neta 4,55 %).
- Errores de formulario accesibles (resumen enlazado, `aria-invalid`).
- La URL compartible reproduce el cálculo al recargar; «Restablecer» lo limpia.
- El generador de carta no guarda nombres ni direcciones en la URL.
- La calculadora funciona con la **CSP de producción aplicada** sin violaciones.

## 10.3 Revisión visual

Capturas reales en `docs/qa/`:
- `portada-escritorio.jpg`
- `calculadora-movil-resultado.jpg`
- `fin-contrato-escritorio.jpg`

Problemas detectados durante la revisión y **corregidos**: desbordamiento horizontal de 7 px en móvil por una tabla ancha, palabras pegadas por la compresión de HTML, tarjeta de guías sin margen interior, tablas desplazables sin acceso por teclado, nombres de regiones duplicados casillas de verificación sin etiqueta accesible en una lista de comprobación de las guías nuevas (sustituidas por una lista normal) y, tras el cambio de nombre, que las pruebas de navegador no arrancaban por sí solas el servidor de vista previa cuando quedaba un aviso de «servidor ya en marcha» de una ejecución anterior (ahora usan `--ignore-lock`).

## 10.4 Lo que no se ha podido comprobar en este entorno

- **Enlaces externos** (BOE, INE, Google, Cloudflare): la red del entorno bloquea esos dominios, así que no se ha verificado que respondan. Los identificadores del BOE y las direcciones del INE proceden de resultados de búsqueda de esas mismas webs. Revísalos tras publicar.
- **Despliegue real** en Cloudflare Pages, dominio, HTTPS y cabeceras en producción: requieren tu cuenta (`docs/03-guia-despliegue.md`, paso 10, incluye cómo comprobarlo).
- **Funcionamiento real de AdSense, del CMP de Google y de GA4**: requieren cuentas aprobadas; solo se ha comprobado que el código y `ads.txt` se generan correctamente con IDs ficticios.
- **Navegadores distintos de Chromium** (Safari, Firefox): no instalados en el entorno. El código usa funciones estándar con amplio soporte, pero conviene probar en un iPhone y en Firefox.
- **Search Console y datos de tráfico:** no existen hasta publicar.

## 10.5 Cómo repetir las pruebas

```bash
npm ci
npm run verify          # tipos + unitarias + compilación + QA
npx playwright install chromium   # solo la primera vez
npm run test:e2e        # navegador real, escritorio y móvil
```
