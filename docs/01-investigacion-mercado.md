# 1. Investigación de mercado y elección del nicho

**Fecha de la investigación:** 14 de octubre de 2026
**Mercado analizado:** web en español orientada principalmente a España (el titular del proyecto escribe en español y tiene dominio de correo `.es`; mantener el contenido en su idioma reduce el coste de mantenimiento).

## 1.1 Limitaciones de datos (léelo primero)

Desde el entorno en el que se ha hecho este trabajo **no ha sido posible** consultar:

- **Google Keyword Planner** (requiere una cuenta de Google Ads del titular).
- **Google Trends**, **Google Autocomplete** y **resultados reales de google.es**: la política de red del entorno bloquea esos dominios (`trends.google.com`, `suggestqueries.google.com`, `www.google.es`, Bing y DuckDuckGo devuelven conexión rechazada).
- Herramientas SEO de pago (Semrush, Ahrefs, Sistrix): no hay acceso ni credenciales.

Lo que **sí** se ha podido usar es un buscador web (con resultados resumidos) para revisar páginas que compiten, documentación oficial de Google, el BOE, el INE y medios. Por tanto:

- **No hay volúmenes de búsqueda, CPC ni RPM verificados en este documento.** Donde aparece una cifra de demanda es un dato **oficial de tamaño de audiencia** (INE, Seguridad Social, AEAT) o una **observación cualitativa** (existencia de competidores, cobertura mensual en medios, herramientas oficiales).
- Las puntuaciones son **juicios razonados sobre evidencias cualitativas**, no mediciones. En la sección 1.6 se explica cómo validarlas con Keyword Planner y Trends en 30 minutos antes de invertir más.

Etiquetas usadas: **[Dato]** = dato observado en fuente citada · **[Estimación]** = cálculo propio a partir de datos · **[Hipótesis]** = suposición razonable no verificada.

## 1.2 Criterios y pesos de la puntuación

| # | Criterio | Peso | Qué mide (1 = peor, 5 = mejor) |
|---|---|---|---|
| C1 | Demanda demostrable | 20 % | Tamaño de la audiencia con el problema, recurrencia, señales públicas de búsqueda (medios que publican cada mes, herramientas oficiales, foros) |
| C2 | Competencia abordable | 15 % | Posibilidad realista de que una web nueva aparezca en consultas long-tail frente a marcas establecidas |
| C3 | Intención clara | 10 % | ¿La persona quiere resolver un problema concreto (calcular, decidir, redactar)? |
| C4 | Diferenciación posible | 15 % | Herramientas propias, lógica específica de España, información que otros no ofrecen bien |
| C5 | Potencial publicitario | 15 % | Valor comercial del público (anunciantes de seguros, servicios financieros, inmobiliarios, legales). **[Hipótesis]**: no hay CPC verificados |
| C6 | Resistencia a respuestas sin clic | 10 % | Riesgo de que la vista creada con IA de Google o un asistente responda sin visita. Las calculadoras con datos personales resisten mejor |
| C7 | Viabilidad y coste de mantenimiento | 10 % | Esfuerzo técnico y frecuencia de actualizaciones necesarias |
| C8 | Riesgo legal, reputacional y de políticas | 5 % | 5 = riesgo bajo. Considera YMYL, exactitud y políticas de AdSense |

Puntuación final = Σ (nota × peso) × 20 → escala 0–100.

## 1.3 Nichos evaluados

| # | Nicho / modelo | C1 | C2 | C3 | C4 | C5 | C6 | C7 | C8 | **Total** |
|---|---|---|---|---|---|---|---|---|---|---|
| N1 | **Alquiler de vivienda en España: herramientas para inquilinos y pequeños propietarios** | 5 | 3 | 5 | 4 | 4 | 4 | 3 | 3 | **80** |
| N11 | Impuestos y gastos de compraventa de vivienda por comunidad (ITP, AJD, plusvalía) | 4 | 2 | 5 | 3 | 5 | 4 | 2 | 2 | 70 |
| N2 | Plazos y días hábiles en España (multas, trámites, laboral) + festivos por comunidad | 3 | 3 | 5 | 4 | 2 | 4 | 4 | 4 | 69 |
| N3 | Herramientas fiscales para autónomos (factura IVA/IRPF, cuota RETA) | 5 | 1 | 5 | 2 | 5 | 4 | 2 | 2 | 68 |
| N4 | Nómina y sueldo neto de asalariados | 5 | 1 | 5 | 2 | 4 | 4 | 2 | 2 | 65 |
| N12 | Calculadoras genéricas en inglés (EE. UU./Reino Unido) | 5 | 1 | 4 | 1 | 5 | 3 | 3 | 4 | 65 |
| N5 | Calculadoras de reformas y bricolaje (pintura, azulejos, hormigón) | 3 | 2 | 5 | 2 | 3 | 3 | 5 | 5 | 64 |
| N10 | Nota de acceso a la universidad (PAU) y notas de corte | 4 | 2 | 5 | 3 | 2 | 3 | 2 | 4 | 61 |
| N6 | Consumo y coste de la electricidad doméstica | 4 | 1 | 4 | 2 | 4 | 2 | 3 | 4 | 59 |
| N7 | Coste de viajes en coche y gasto por kilómetro | 3 | 2 | 4 | 2 | 3 | 2 | 4 | 5 | 58 |
| N8 | Mascotas: alimentación y cuidados (calculadoras) | 4 | 2 | 4 | 2 | 2 | 2 | 4 | 3 | 57 |
| N9 | Huerto y jardín: calendario de siembra por clima | 3 | 2 | 3 | 3 | 2 | 2 | 4 | 5 | 56 |

### Evidencia por nicho (resumen)

**N1 · Alquiler de vivienda (elegido)**
- [Dato] Alrededor del **20,2 % de los hogares** vivía de alquiler en 2025 según la Encuesta de Condiciones de Vida del INE (citado por idealista). El censo da un 16,1 % de 18,5 millones de hogares. [Estimación] Entre **3 y 3,7 millones de hogares** inquilinos; cada contrato con cláusula de actualización genera una revisión anual de la renta.
- [Dato] El INE publica cada mes el **IRAV** (Índice de Referencia de Arrendamientos de Vivienda); último dato comprobado en la web del INE: **agosto de 2026 = 2,47 %**, publicado el 15/09/2026. Medios y portales (idealista, Housfy, Fotocasa, merca2, Raisin) publican un artículo **cada mes** sobre ese dato: señal indirecta pero sólida de demanda recurrente.
- [Dato] 2026 ha sido un año de **cambios normativos continuos**: RDL 8/2026 (marzo, límite del 2 %, decaído el 28/04/2026), RDL 26/2026 (29/09/2026, derogado el 02/10/2026) y **RDL 28/2026 y RDL 29/2026** (BOE de 07/10/2026, en vigor desde el 08/10/2026, pendientes de convalidación por la Diputación Permanente). El RDL 29/2026 limita las actualizaciones hasta el 31/12/2027: sin incremento si la renta supera el índice de referencia estatal y, sin nuevo pacto, máximo 2 %. La confusión genera búsquedas del tipo «¿cuánto me pueden subir el alquiler?».
- [Dato] Existe una calculadora del Ministerio de Vivienda (actualizada en octubre de 2026) y otras de portales, pero **en foros de usuarios se señala que no redactan la notificación** al inquilino (Rankia). Varias páginas que posicionan contienen errores (p. ej., un medio calcula 40–50 € de intereses por 2 meses de retraso en una fianza de 800 €, cuando al 3,25 % anual son unos 4,30 €). Hay hueco para herramientas **correctas, explicadas y con la norma citada**.
- [Hipótesis] Anunciantes con valor comercial: seguros de impago, gestión de alquileres, portales inmobiliarios, abogados, hipotecas. No hay CPC verificados.
- Riesgos: contenido YMYL (jurídico-económico) y **mantenimiento normativo** frecuente. Mitigación: datos normativos centralizados y fechados, fuentes oficiales enlazadas, avisos de «estado a fecha» y una rutina mensual documentada (`docs/09-mantenimiento-normativo.md`).

**N11 · Compraventa (ITP/AJD/plusvalía)** — demanda alta y público de alto valor, pero 17 normativas autonómicas que cambian cada año y competidores con mucha autoridad (portales, notarías, comparadores hipotecarios). Buen candidato para **ampliar** la web más adelante (mismo público: vivienda).

**N2 · Plazos y días hábiles** — problema muy concreto y lógica difícil de resolver por una IA sin calendario local (festivos autonómicos y locales). En los resultados aparecen sitios de preguntas de baja calidad (señal de hueco), pero el valor publicitario del público es bajo y «calendario laboral» lo dominan medios generalistas. Parte de esta lógica (plazos y fechas) se reutiliza en N1.

**N3 · Autónomos** — [Dato] más de 3,43 millones de afiliados al RETA (mayo de 2025, citado por Consejo de Gestores). Público muy valioso, pero compiten Infoautonomos, Billin, Declarando, Billeo, Holded o Taxdown, con equipos de contenido y calculadoras ya hechas; además, las tablas de cuotas varían entre fuentes y exigen verificación constante.

**N4 · Nómina** — competencia de portales de empleo, medios económicos y asesorías; escalas de IRPF autonómicas que cambian cada año.

**N12 · Calculadoras en inglés** — mayor RPM potencial, pero competencia extrema (Omni, Calculator.net, NerdWallet…), sin diferenciación y fuera del idioma del titular.

**N5 · Reformas** — [Dato] un único sitio (hacecuentas.com) declara entre 1.400 y 2.700 calculadoras y aparece en casi todas las búsquedas probadas (pintura, azulejos, hormigón, comida de perro, consumo eléctrico). Es un mercado saturado por producción masiva y con poca diferenciación posible.

**N6 Energía, N7 Viajes, N8 Mascotas, N9 Huerto, N10 PAU** — o bien los dominan comparadores y marcas con gran autoridad (energía), o las respuestas son simples y se resuelven en la página de resultados (viaje, mascotas, siembra), o la demanda es muy estacional y depende de 17 normativas (PAU).

## 1.4 Decisión

**Nicho elegido: herramientas y guías sobre el alquiler de vivienda en España, para inquilinos y pequeños propietarios particulares.**

Motivos (por orden de peso):
1. **Demanda demostrable y recurrente**: millones de contratos con revisión anual, índice oficial mensual y cambios normativos que obligan a recalcular.
2. **Intención de resolución**: «calcular la subida», «saber si puedo irme antes», «cuándo me tienen que devolver la fianza», «redactar la carta».
3. **Diferenciación real**: lógica que depende de la **fecha de firma del contrato** y del **régimen vigente en la fecha de actualización**, generador de carta, cálculo de intereses por tramos anuales, todo con artículos de la ley citados y sin enviar datos a ningún servidor.
4. **Resistencia a respuestas sin clic**: el número del índice lo puede dar Google directamente, pero aplicar el régimen correcto a *tu* contrato y redactar la notificación exige una herramienta.
5. **Ampliable**: compraventa (N11), plazos (N2) y fiscalidad del propietario son extensiones naturales para el mismo público.

## 1.5 Principales incertidumbres

| Incertidumbre | Impacto | Cómo se reduce |
|---|---|---|
| Volúmenes de búsqueda reales desconocidos | Alto | Validar con Keyword Planner y Trends (sección 1.6) antes de escribir más contenido |
| RPM real desconocido para este tema en España | Alto | Usar escenarios con intervalos (`docs/05-modelo-financiero.md`) y medir con datos reales de AdSense |
| El RDL 29/2026 puede no convalidarse | Medio | La lógica normativa está en un único fichero de datos (`src/data/normativa.ts`) con estado y fechas; cambiarlo actualiza todas las herramientas |
| Competencia de portales con mucha autoridad | Medio | Priorizar long-tail y casos concretos; herramientas mejores que las existentes; enlaces naturales |
| Exactitud jurídica (YMYL) | Alto | Citar el artículo exacto, enlazar BOE/INE, fecha de revisión visible, aviso de que no es asesoramiento, corrección pública de errores |
| Aprobación de AdSense no garantizada | Medio | Cumplir políticas, contenido propio y útil, páginas institucionales completas |

## 1.6 Validación rápida que debes hacer tú (30 minutos)

1. **Google Trends** (trends.google.es), región España, últimos 5 años: compara «subida alquiler», «IRAV», «fianza alquiler», «dejar piso alquiler». Anota si la tendencia es estable o creciente.
2. **Keyword Planner** (ads.google.com → Herramientas → Planificador de palabras clave; no hace falta pagar campañas para ver rangos): introduce las palabras clave del mapa de `docs/02-estrategia-seo-palabras-clave.md`, ubicación España, idioma español. Anota rango de búsquedas mensuales y «puja por la parte superior de la página» (indicador del valor comercial).
3. Si los rangos de las 10 palabras clave principales suman menos de ~10.000 búsquedas/mes o las pujas son muy bajas, revisa la prioridad del plan editorial antes de seguir ampliando.

## 1.7 Fuentes consultadas (14/10/2026)

Ver la lista completa en [`docs/11-fuentes.md`](11-fuentes.md).
