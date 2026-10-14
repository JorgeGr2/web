# 12. Tareas pendientes que requieren tu intervención y próximas acciones

## 12.1 Antes de publicar (imprescindible)

| # | Tarea | Por qué | Dónde |
|---|---|---|---|
| 1 | Comprobar la marca «Alquiler en Regla» en la OEPM y comprar `alquilerenregla.es` (DonDominio u OVHcloud) | No puedo comprar ni registrar nada en tu nombre | `docs/03`, paso 5 |
| 2 | Crear la cuenta de Cloudflare (gratis) y conectar el repositorio | Requiere tus credenciales | `docs/03`, paso 7 |
| 3 | Fusionar la rama `claude/sweet-dijkstra-tw4ipu` en `main` (pull request en GitHub) | Publicar desde la rama principal | `docs/03`, paso 7.1 |
| 4 | Rellenar tus datos de titular (`PUBLIC_OWNER_NAME`, `PUBLIC_OWNER_NIF`, `PUBLIC_OWNER_ADDRESS`, `PUBLIC_CONTACT_EMAIL`) en el panel de Cloudflare | Obligatorio por la LSSI-CE; no invento identidades | `docs/03`, paso 8 |
| 5 | **Revisar personalmente todos los textos** y aprobarlos | La metodología afirma que el responsable revisa el contenido. Si no vas a revisarlo, cambia ese párrafo en `src/pages/metodologia.astro` | Todas las páginas |
| 6 | Verificar en el BOE los puntos de la lista 12.2 | Algunos datos proceden de resúmenes de búsqueda; contrastarlos reduce el riesgo jurídico | `docs/09` |
| 7 | Probar la web en un iPhone (Safari) y en Firefox | En el entorno solo había Chromium | — |
| 8 | Poner `PUBLIC_SITE_INDEXABLE=true` cuando todo esté revisado | Hasta entonces la web lleva `noindex` | `docs/03`, paso 10 |

## 12.2 Datos que conviene contrastar con el texto oficial

Marcados como verificados con fuentes oficiales o múltiples fuentes en la investigación, pero que no he podido leer directamente en el BOE o el INE (la red del entorno bloqueaba esos dominios):

1. **RDL 29/2026**: alcance exacto del límite del 2 % (si distingue grandes tenedores, cómo afecta a los contratos anteriores a la Ley 12/2023 y si un nuevo pacto sigue limitado por el IRAV) y requisitos de la prórroga extraordinaria.
2. **Fechas de vigencia** del RDL 8/2026 (22/03/2026 al 28/04/2026, fecha de la votación) y del RDL 26/2026 (01/10/2026 al 02/10/2026).
3. **Interés legal del dinero**: 3,5 % en 2015; 3 % de 2016 a 2022; 3,25 % de 2023 a 2026.
4. **Regímenes históricos de duración**: preaviso de un mes en la LAU original; 3 + 1 años con Ley 4/2013; plazos del RDL 21/2018.
5. **Topes temporales de 2022-2024** (IGC con máximo del 2 % y 3 % en 2024) descritos en la guía de índices.
6. Fecha de entrada en vigor de la **Ley 2/2015** (IGC por defecto): 01/04/2015.
7. Cobertura del **SERPAVI** (edificios colectivos de más de cinco años, entre 30 y 150 m²).
8. Que la obligación de **depositar la fianza** existe en «la mayoría» de comunidades.

## 12.3 Después de publicar

| # | Tarea | Cuándo | Dónde |
|---|---|---|---|
| 9 | Crear y verificar Search Console; enviar el sitemap | Día 1 | `docs/04`, fase B |
| 10 | Activar Cloudflare Web Analytics y `contacto@` con Email Routing | Día 1 | `docs/03`, paso 9 |
| 11 | Seguir el estado de convalidación del RDL 29/2026 y actualizar el archivo de normativa | En cuanto se vote | `docs/09` |
| 12 | Actualizar el IRAV cada mes | Día 15-16 de cada mes | `docs/09` |
| 13 | Validar volúmenes con Keyword Planner | Primer mes | `docs/02`, 2.6 |
| 14 | Consultar a un asesor fiscal sobre los ingresos de AdSense | Antes de activar AdSense | `docs/04`, fase E |
| 15 | Crear la cuenta de AdSense, añadir el sitio y el ID `ca-pub-` | Cuando el sitio esté listo (días 31-60) | `docs/04`, fase C |
| 16 | Configurar el mensaje de consentimiento (Privacidad y mensajes) | Antes de que se sirvan anuncios | `docs/04`, fase D |
| 17 | (Opcional) Crear GA4 y definir `PUBLIC_GA4_ID` | Tras el CMP | `docs/07` |
| 18 | Revisar enlaces externos (BOE, INE, Google) | Tras publicar y cada trimestre | — |

## 12.4 Próximas acciones ordenadas por impacto, coste y prioridad

| Prioridad | Acción | Impacto | Coste | Riesgo si no se hace |
|---|---|---|---|---|
| 1 | Publicar con dominio y datos del titular (tareas 1-8) | Muy alto: sin esto no hay tráfico ni AdSense | Bajo (dominio) + 2-4 h | Proyecto parado |
| 2 | Search Console + sitemap (tarea 9) | Alto | 0 € · 30 min | Indexación lenta y sin datos |
| 3 | Rutina normativa mensual (tareas 11-12) | Alto (confianza y exactitud) | 0 € · 20 min/mes | Información errónea en un tema YMYL |
| 4 | Briefs 17 (zonas tensionadas), 21 (gran tenedor) y 28 (checklist) | Alto | Tiempo de redacción | Perder la demanda ligada a los decretos de 2026 |
| 5 | Validar demanda con Keyword Planner (tarea 13) | Medio-alto | 0 € · 1 h | Priorizar temas con poca demanda |
| 6 | Asesoría fiscal (tarea 14) | Alto en el beneficio neto | Variable | Costes o sanciones inesperados |
| 7 | Solicitar AdSense con el CMP configurado (tareas 15-16) | Medio-alto (ingresos) | 0 € · 1-2 h | Sin ingresos |
| 8 | Enlaces legítimos (asociaciones, servicios de vivienda, medios) | Alto a medio plazo | Tiempo | Crecimiento lento |
| 9 | Briefs fiscales 18-19 con revisión profesional, antes de marzo | Alto y estacional | Revisión profesional | Perder la temporada de la Renta |
| 10 | GA4 vinculado a AdSense (tarea 17) | Medio (decisiones por página) | 0 € · 1 h | Menos visibilidad de ingresos por página |
