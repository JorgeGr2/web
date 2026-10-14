# 6. Plan SEO y editorial de 90 días

El calendario empieza el día en que la web se publica con su dominio. Las fechas de indexación y de aprobación de AdSense **no dependen de ti**: el plan tiene puntos de decisión en lugar de suponer que ocurrirán en una fecha concreta. Dedicación estimada: 4-8 horas por semana **[hipótesis]**.

## Días 1-30 · Publicación, configuración y primeros contenidos

**Semana 1 · Publicación y comprobaciones**
- [ ] Completar `docs/12-tareas-pendientes-y-proximas-acciones.md` (bloque «Antes de publicar»): datos del titular, revisión de textos y datos normativos.
- [ ] Desplegar en Cloudflare Pages con el dominio (`docs/03-guia-despliegue.md`) y comprobar la lista del paso 10.
- [ ] Poner `PUBLIC_SITE_INDEXABLE=true`.
- [ ] Crear y verificar Search Console (propiedad de dominio) y enviar `sitemap-index.xml`.
- [ ] Activar Cloudflare Web Analytics y el reenvío de `contacto@`.

**Semana 2 · Indexación y seguimiento**
- [ ] Solicitar indexación de la portada, `/calculadoras/actualizacion-renta/`, `/guias/limite-subida-alquiler-2-por-ciento/` y `/guias/irav-indice-alquiler/`.
- [ ] Comprobar si se ha decidido la convalidación del RDL 29/2026 y actualizar `src/data/normativa.ts` (`docs/09-mantenimiento-normativo.md`).
- [ ] Actualizar el IRAV con el dato publicado por el INE ese mes.
- [ ] Crear la hoja de seguimiento (`docs/07-analitica-y-seguimiento.md`).

**Semanas 3-4 · Contenido prioritario**
- [ ] Publicar los briefs **17 (zonas tensionadas)** y **21 (gran tenedor)**: alta demanda ligada a los decretos de 2026.
- [ ] Publicar el brief **28 (checklist para firmar un contrato)**: recurso enlazable.
- [ ] Validar volúmenes con Keyword Planner (`docs/02-estrategia-seo-palabras-clave.md`, 2.6) y reordenar los briefs.
- [ ] Revisión de políticas de AdSense (fase A de `docs/04-guia-adsense-monetizacion.md`).

**Punto de decisión (día 30):** ¿Search Console muestra páginas indexadas y primeras impresiones? Si no hay ninguna página indexada, revisa **Indexación → Páginas** y la inspección de URL antes de seguir publicando.

## Días 31-60 · Primeras consultas y solicitud de AdSense

**Semanas 5-6 · Evaluación**
- [ ] Revisar consultas e impresiones en Search Console; anotar las consultas con intención no cubierta.
- [ ] Mejorar títulos y descripciones **solo** en páginas con impresiones suficientes (≥ 100 en 28 días) y CTR bajo.
- [ ] Revisar Core Web Vitals y la cobertura de indexación.
- [ ] Actualizar normativa e IRAV (rutina mensual).

**Semanas 7-8 · Nuevas páginas basadas en datos y AdSense**
- [ ] Publicar 2-3 briefs elegidos según los datos (candidatos: 20 fianza por comunidad, 24 necesidad del propietario, 27 reparaciones).
- [ ] Contactar con 5-10 posibles fuentes de enlaces legítimos (asociaciones, servicios de vivienda, blogs especializados) ofreciendo un recurso concreto.
- [ ] **Solicitar AdSense** si se cumplen: dominio definitivo, datos del titular completos, al menos 18-20 páginas de contenido útil, sin errores en `npm run verify`.
- [ ] Configurar el mensaje de consentimiento de **Privacidad y mensajes** antes de que se activen los anuncios.

**Punto de decisión (día 60):** si AdSense rechaza el sitio, corregir según el motivo y volver a solicitar (no antes de unos días). Si lo aprueba, activar anuncios automáticos con carga baja-media.

## Días 61-90 · Análisis y decisiones

**Semanas 9-10 · Rendimiento**
- [ ] Clasificar las páginas en: crecen / estancadas con impresiones / sin impresiones.
- [ ] Actualizar a fondo las 2-3 páginas «estancadas con impresiones» (contenido, ejemplos, enlaces internos).
- [ ] Si hay anuncios: revisar RPM por página y país, y comprobar en móvil que no molestan al usar las calculadoras (añadir exclusiones si hace falta).

**Semanas 11-12 · Ampliación y monetización**
- [ ] Ampliar el grupo temático que más demanda demuestre (por ejemplo, si «zonas tensionadas» crece, añadir páginas por comunidad con datos oficiales).
- [ ] Si se acerca la campaña de la Renta (marzo-junio), preparar los briefs 18 y 19 con revisión de un asesor fiscal.
- [ ] Revisar la experiencia de usuario con 3-5 personas reales usando la calculadora principal.

**Revisión del día 90 (decisiones basadas en datos):**
- ¿Qué consultas traen clics? → profundizar en esos temas.
- ¿Qué páginas no tienen impresiones tras 60 días indexadas? → mejorar o fusionar.
- ¿El tráfico se acerca al escenario conservador, intermedio u optimista de `docs/05-modelo-financiero.md`? → ajustar dedicación e inversión.
- ¿Merece la pena ampliar al nicho de compraventa? Solo si el actual crece de forma sostenida y el mantenimiento está bajo control.

## Rutinas fijas

| Frecuencia | Tarea | Tiempo |
|---|---|---|
| Semanal | Search Console: rendimiento, indexación, errores | 20 min |
| Semanal | Revisar el BOE por normas sobre arrendamientos | 10 min |
| Mensual (día 15-16) | Actualizar el IRAV y revisar el estado normativo | 20 min |
| Mensual | Hoja de seguimiento (tráfico, ingresos, costes) | 30 min |
| Mensual | `npm outdated` y `npm audit`; actualizar dependencias si procede | 30 min |
| Trimestral | Keyword Planner y revisión del plan editorial | 1 h |
| Enero | Interés legal del dinero del año (Ley de Presupuestos) | 10 min |
