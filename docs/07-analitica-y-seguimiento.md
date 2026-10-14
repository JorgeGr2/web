# 7. Analítica y seguimiento

Objetivo: medir lo necesario para tomar decisiones **sin** cargar herramientas de seguimiento antes de tener el consentimiento que exige la normativa.

## 7.1 Herramientas y orden recomendado

| Herramienta | Qué mide | Cookies | Consentimiento | Cuándo |
|---|---|---|---|---|
| Google Search Console | Consultas, impresiones, clics, posición, indexación, Core Web Vitals | No (no se instala nada en la web) | No | Desde el día 1 |
| Cloudflare Web Analytics | Visitas y páginas vistas agregadas | No | No (no almacena nada en el dispositivo) | Desde el día 1 |
| Google AdSense (informes) | Páginas vistas, impresiones, RPM, ingresos | Sí (anuncios) | Sí, mediante el CMP de Google | Tras la aprobación |
| Google Analytics 4 | Comportamiento detallado e ingresos por página (al vincular AdSense) | Sí | Sí | Opcional, tras configurar el CMP |

## 7.2 Google Search Console

1. Crea una **propiedad de dominio** en [Search Console](https://search.google.com/search-console) y verifícala con un registro TXT en el DNS de Cloudflare (pasos en `docs/04-guia-adsense-monetizacion.md`, fase B).
2. Envía `sitemap-index.xml` en **Sitemaps**.
3. Comprueba que los datos llegan: a los 2-3 días aparecen las primeras filas en **Rendimiento** si Google ha mostrado alguna página; en **Indexación → Páginas** verás qué URL están indexadas.

## 7.3 Cloudflare Web Analytics

En el proyecto de Pages → **Métricas → Web Analytics → Habilitar**. Cloudflare inyecta su script automáticamente. Pon `PUBLIC_CF_ANALYTICS_ENABLED=true` para que la política de privacidad lo mencione. La política de seguridad (CSP) del proyecto ya permite sus dominios. Comprueba que llegan datos visitando la web y mirando el panel al cabo de unos minutos.

Si alojas fuera de Cloudflare, crea un sitio en **Analytics y registros → Web Analytics**, copia el token y ponlo en `PUBLIC_CF_BEACON_TOKEN`.

## 7.4 Google Analytics 4 (opcional)

1. Crea una propiedad en [Google Analytics](https://analytics.google.com/) y un flujo de datos web con tu dominio. Copia el **ID de medición** (`G-…`).
2. Configura **antes** el mensaje de consentimiento en AdSense (Privacidad y mensajes) y activa la opción que permite a otros productos de Google usar las señales de consentimiento.
3. Define `PUBLIC_GA4_ID=G-…` y vuelve a implementar. El proyecto carga GA4 con **Consent Mode v2** y todos los permisos **denegados** por defecto (`ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage`), con redacción de datos publicitarios activada. Solo se conceden cuando la persona acepta en el mensaje de Google.
4. Comprueba en GA4 → **Informes → Tiempo real** que aparece tu visita tras aceptar el consentimiento.
5. Vincula AdSense en GA4 (**Administrar → Vinculación de productos → AdSense**) para ver ingresos por página.

Ten en cuenta que, con consentimiento denegado por defecto, GA4 infravalora las visitas: para el volumen total usa Cloudflare Web Analytics o AdSense.

## 7.5 Sistema de seguimiento

### Semanal (20-30 minutos)

| Pregunta | Dónde | Acción |
|---|---|---|
| ¿Qué páginas empiezan a posicionarse? | Search Console → Rendimiento → Páginas (últimos 7 días frente a los 7 anteriores) | Anotar en la hoja; enlazarlas desde otras páginas |
| ¿Qué consultas tienen muchas impresiones y pocos clics? | Rendimiento → Consultas: impresiones ≥ 100, CTR < 2 %, posición 5-20 | Mejorar título, descripción o contenido de la página que aparece |
| ¿Hay errores de indexación? | Indexación → Páginas, Sitemaps | Corregir y validar la corrección |
| ¿Problemas de rendimiento? | Experiencia → Métricas web principales | Revisar la URL afectada |
| ¿Cambios de tráfico bruscos? | Cloudflare Web Analytics / Search Console | Buscar la causa: actualización de Google, noticia, error técnico |
| ¿Cambios normativos? | BOE (sección I, «arrendamientos») | Seguir `docs/09-mantenimiento-normativo.md` |

### Mensual (30-45 minutos)

Hoja de cálculo con una fila por mes:

| Mes | Clics orgánicos | Impresiones | CTR | Posición media | Páginas vistas | Países principales | Páginas más vistas | RPM de página | Impresiones de anuncios | Ingresos | Costes | Beneficio |
|---|---|---|---|---|---|---|---|---|---|---|---|---|

- **Contenidos que necesitan mejoras:** los que llevan ≥ 60 días indexados y tienen impresiones pero CTR bajo o posición estancada.
- **Ingresos:** solo con datos reales de AdSense (no simular).
- **Fuentes de tráfico:** Cloudflare Web Analytics muestra los referentes; GA4 (si se usa) da más detalle.

No conviertas la hoja en un objetivo en sí: su función es decidir qué mejorar el mes siguiente.
