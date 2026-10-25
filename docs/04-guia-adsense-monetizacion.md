# 4. Guía paso a paso para empezar a ganar dinero con AdSense

Adaptada a esta web (Astro estático en Cloudflare Pages, público en España). Fecha de revisión: 14/10/2026. Las interfaces de Google cambian a menudo: si un menú no coincide, sigue el enlace a la ayuda oficial de cada paso.

> **Importante.** Cumplir todo lo que aquí se indica **no garantiza** la aprobación de AdSense ni ningún nivel de ingresos. Google decide la aprobación y los anunciantes determinan los ingresos.

---

## FASE A · Preparación

1. **Publica la web con su dominio definitivo** siguiendo `docs/03-guia-despliegue.md`. AdSense revisa el dominio que des de alta, así que no lo solicites con la dirección `*.pages.dev`.
2. **Completa tus datos de titular** (`PUBLIC_OWNER_*`): el aviso legal, la privacidad y el contacto deben mostrar datos reales. Un sitio anónimo transmite poca confianza a usuarios, a Google y a AdSense.
3. **Revisa todo el contenido personalmente.** Lee las 8 calculadoras y las 20 guías, comprueba los cálculos con tus propios ejemplos y contrasta los datos normativos con el BOE (lista en `docs/12-tareas-pendientes-y-proximas-acciones.md`). La página de metodología afirma que el responsable revisa el contenido: haz que sea verdad.
4. **Comprueba las políticas vigentes:**
   - [Requisitos de elegibilidad de AdSense](https://support.google.com/adsense/answer/9724): mayor de 18 años, contenido propio que cumpla las políticas y poder editar el HTML (este proyecto lo permite).
   - [Políticas del programa AdSense](https://support.google.com/adsense/answer/48182) y [Políticas para editores de Google](https://support.google.com/publisherpolicies/answer/10502938).
   - Para el contenido, las directrices de Google sobre [contenido útil y fiable](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) y las [políticas contra el spam](https://developers.google.com/search/docs/essentials/spam-policies).
5. **Privacidad y consentimiento.** Hoy la web no usa cookies (la política de cookies lo dice). Al activar AdSense en el EEE, Reino Unido o Suiza, Google exige un [CMP certificado por Google](https://support.google.com/adsense/answer/13554116). La opción más sencilla y gratuita es el propio mensaje de **Privacidad y mensajes** de AdSense (fase D, paso 4). El proyecto ya ajusta automáticamente la política de privacidad, la de cookies y el pie de página cuando defines `PUBLIC_ADSENSE_CLIENT`.
6. **Control final** (debe salir todo bien):

```bash
npm run verify
npm run test:e2e
```

7. **Sin contenido copiado, páginas vacías ni errores.** Todo el contenido es original; no añadas textos copiados de otras webs ni páginas «en construcción». La comprobación `qa:dist` detecta enlaces rotos, metadatos duplicados y texto de relleno.

¿Cuánto contenido hace falta? Google no publica un mínimo de páginas ni de tráfico. Lo que pesa es que el sitio sea útil, navegable y original. Desde el 25/10/2026 el sitio tiene 28 páginas de contenido (8 calculadoras y 20 guías). La primera solicitud, hecha con 16 páginas y la web recién publicada, se rechazó por «contenido de poco valor»: ver el plan en la fase C, paso 6.

---

## FASE B · Indexación y SEO

1. **Crea la propiedad en [Google Search Console](https://search.google.com/search-console).** Elige **Propiedad de dominio** y escribe `alquilerenregla.es`.
2. **Verifícala por DNS** (recomendado): Search Console te da un registro TXT; en Cloudflare ve a **DNS → Registros → Añadir registro**, tipo `TXT`, nombre `@`, contenido el valor que te den. Pulsa «Verificar» en Search Console (puede tardar unos minutos).
   - Alternativa: propiedad de **prefijo de URL** con `https://www.alquilerenregla.es/` y método «Etiqueta HTML» → copia solo el valor `content="..."` en `PUBLIC_GOOGLE_SITE_VERIFICATION` y vuelve a implementar.
3. **Envía el sitemap:** en Search Console → **Sitemaps** → escribe `sitemap-index.xml` → Enviar. Estado esperado: «Correcto», con 39 URL descubiertas.
4. **Comprueba la indexación** de las páginas importantes: usa la barra de **Inspección de URLs** con la portada y la calculadora de actualización → «Solicitar indexación». No esperes que todas las páginas se indexen enseguida: puede tardar de días a semanas y Google no indexa todo lo que se envía.
5. **Detecta problemas técnicos:** revisa cada semana **Indexación → Páginas** (motivos de no indexación), **Experiencia → Métricas web principales** y **Seguridad y acciones manuales**.
6. **Analítica respetando la privacidad.** Empieza con Cloudflare Web Analytics (sin cookies, sin banner). Si quieres Google Analytics 4 (útil para ver ingresos por página al vincularlo con AdSense), créalo **después** de configurar el CMP: ver `docs/07-analitica-y-seguimiento.md`.
7. **Empieza a medir** impresiones, clics y consultas en **Rendimiento → Resultados de búsqueda**. Los primeros datos útiles suelen llegar al cabo de unas semanas.

---

## FASE C · Solicitud de AdSense

1. **Crea la cuenta** en [adsense.google.com](https://adsense.google.com/) con la misma cuenta de Google que usarás para cobrar. País: España. Tipo de cuenta: **particular** o **empresa** según cómo vayas a facturar (consúltalo antes con tu asesor; ver fase E).
2. **Añade el sitio:** **Sitios → + Nuevo sitio** → escribe `alquilerenregla.es` ([ayuda](https://support.google.com/adsense/answer/12169212)).
3. **Conecta el sitio** ([ayuda](https://support.google.com/adsense/answer/7584263)). AdSense ofrece tres métodos; con este proyecto el más sencillo es el **fragmento de código**:
   - Copia tu ID de editor, con formato `ca-pub-` seguido de 16 dígitos (aparece en el código que te muestra AdSense y en **Cuenta → Información de la cuenta**).
   - En Cloudflare Pages, define `PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX` y vuelve a implementar.
   - El proyecto insertará el código de AdSense en el `<head>` de todas las páginas, la etiqueta `google-adsense-account` y generará **`/ads.txt`** con la línea `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`. Así cubres a la vez el método del código y el de ads.txt.
   - Comprueba en el navegador que `https://www.alquilerenregla.es/ads.txt` muestra esa línea.
   - En AdSense, marca «He colocado el código» y pulsa **Verificar**.
4. **Completa las tareas de la cuenta** (datos de pago, dirección, verificación de identidad si te la piden). Si solicitas la revisión sin completarlas, el sitio se queda en «Preparándose» ([ayuda](https://support.google.com/adsense/answer/12170222)).
5. **Solicita la revisión** («Solicitar revisión»). Según la ayuda de Google suele tardar unos días y a veces 2-4 semanas. **No borres y vuelvas a añadir el sitio**: retrasa el proceso. Puedes consultar el estado en **Sitios**.
6. **Si lo rechazan** («Necesita atención» o «No está listo para mostrar anuncios»):
   - Lee el motivo exacto en **Sitios** o en el **Centro de políticas** ([qué hacer si el sitio no está listo](https://support.google.com/adsense/answer/12176698), [cuenta no aprobada](https://support.google.com/adsense/answer/9680050)).
   - Motivos habituales y qué hacer en este proyecto:
     - *Contenido de poco valor* → añade contenidos del plan editorial que resuelvan necesidades nuevas, amplía ejemplos propios, refuerza la página «Sobre el proyecto» con quién eres y tu relación con el tema (sin inventar credenciales).
     - *Sitio inaccesible o en construcción* → comprueba que el dominio carga, que no hay páginas vacías y que `PUBLIC_SITE_INDEXABLE=true`.
     - *Navegación difícil* → no suele aplicar (menú y pie completos), pero revisa la versión móvil.
     - *Infracción de políticas* → identifica la página y corrígela.
   - **Primer rechazo de este sitio (25/10/2026, «contenido de poco valor»).** Plan aplicado: 12 guías nuevas (de 16 a 28 páginas de contenido), autoría visible en las guías, guías agrupadas por temas con enlaces relacionados (también desde cada calculadora), página «Sobre el proyecto» ampliada e IRAV actualizado. Antes de volver a solicitar: publica esos cambios en `main`, espera **3-4 semanas**, comprueba en Search Console que la mayoría de las páginas están indexadas y que hay algunas impresiones o clics, y solo entonces marca «Confirmo que he resuelto los problemas» y pulsa **Solicitar revisión**.
   - Corrige, espera unos días a que Google vuelva a rastrear y pulsa de nuevo **Solicitar revisión** (o, en el Centro de políticas, **Corregir → Iniciar proceso de revisión**; [ayuda](https://support.google.com/adsense/answer/7003627)). Si te han rechazado varias veces seguidas, el botón se desactiva hasta la fecha que indique.

---

## FASE D · Activación de anuncios

1. **Empieza con anuncios automáticos.** En AdSense → **Anuncios → Por sitio → editar** (lápiz) → activa **Anuncios automáticos**. El código ya está en todas las páginas: no hay que tocar nada más.
   - Configuración recomendada para este sitio: **carga de anuncios baja o media**, desactiva los formatos que tapen el contenido si notas que molestan, y añade **exclusiones de página** en las calculadoras si los anuncios se cuelan entre el formulario y el resultado (Anuncios → Por sitio → Exclusiones de página / áreas excluidas).
   - Usa la **vista previa** de AdSense para ver dónde colocará los anuncios antes de aplicar los cambios.
2. **Cuándo evaluar ubicaciones manuales.** Tras 4-8 semanas con datos, si quieres más control: crea en AdSense **Anuncios → Por bloque de anuncios → Anuncios display** (adaptables), copia el número `data-ad-slot` y ponlo en `PUBLIC_ADSENSE_SLOT_INARTICLE` (bloque al final del contenido de calculadoras y guías). El componente `src/components/AdSlot.astro` solo pinta el bloque si hay ID, con la etiqueta «Publicidad» y separado de formularios y botones. No hace falta quitar los automáticos: AdSense los combina.
3. **Comprueba que los anuncios se sirven:**
   - Visita varias páginas desde una ventana privada (los anuncios pueden tardar desde minutos hasta unas horas tras la aprobación).
   - **Nunca hagas clic en tus propios anuncios** ni pidas a nadie que lo haga.
   - En AdSense → **Informes**, comprueba que aparecen impresiones y solicitudes de anuncios por sitio.
4. **Consentimiento (obligatorio para tráfico de España y la UE):**
   - AdSense → **Privacidad y mensajes → Normativa europea** → **Crear mensaje** para tu sitio ([ayuda](https://support.google.com/adsense/answer/10961068)). Idioma: español. Elige las opciones **Consentir**, **No consentir** y **Gestionar opciones** (la AEPD exige que rechazar sea tan fácil como aceptar). Añade el enlace a tu política de privacidad (`https://www.alquilerenregla.es/privacidad/`). Publica el mensaje.
   - AdSense añade automáticamente un enlace para revocar el consentimiento; además, el pie de la web muestra «Configuración de privacidad y cookies», que reabre el mensaje ([ayuda](https://support.google.com/adsense/answer/10959060)).
   - Si usas Google Analytics 4, activa en **Privacidad y mensajes → Configuración** la opción que permite a otros productos de Google usar las señales de consentimiento (modo de consentimiento; [ayuda](https://support.google.com/adsense/answer/16053245)). El proyecto ya carga GA4 con todo **denegado** por defecto.
   - Comprueba desde una ventana privada que el mensaje aparece al entrar y que, al rechazar, se siguen viendo anuncios no personalizados o limitados.
5. **ads.txt:** ya se genera solo. En **Sitios**, el estado de ads.txt puede tardar hasta un mes en actualizarse en sitios con poco tráfico; usa «Buscar actualizaciones» ([guía de ads.txt](https://support.google.com/adsense/answer/12171612)).
6. **Evitar tráfico inválido y problemas de políticas** ([tráfico no válido](https://support.google.com/adsense/answer/16737), [políticas de ubicación de anuncios](https://support.google.com/adsense/answer/1346295)):
   - No hagas clic en tus anuncios, no recargues páginas para generar impresiones, no compres tráfico barato ni uses intercambios de visitas.
   - No pidas clics ni pongas textos como «apóyanos haciendo clic».
   - No coloques anuncios pegados a botones o campos de las calculadoras, ni que imiten la navegación o los resultados.
   - Si sospechas de clics fraudulentos (picos raros desde un país o una fuente), informa con el [formulario de tráfico no válido](https://support.google.com/adsense/answer/16737) y añade una regla de seguridad en Cloudflare si procede.

---

## FASE E · Primeros ingresos

1. **Qué métricas revisar y dónde:**
   - **AdSense → Informes:** ingresos estimados, **RPM de página**, impresiones, páginas vistas, desglosadas por sitio, país y plataforma.
   - **Search Console → Rendimiento:** consultas, páginas, impresiones, clics y CTR orgánico.
   - **Google Analytics 4** (si lo usas y lo vinculas con AdSense): ingresos por página.
2. **Cálculo de ingresos estimados:**

   **Ingresos publicitarios estimados = páginas vistas ÷ 1.000 × RPM de página**

   Ejemplo: 20.000 páginas vistas al mes con un RPM de 4 € → 20.000 ÷ 1.000 × 4 = **80 €**. El RPM real lo da AdSense; antes de tenerlo, usa los intervalos del `docs/05-modelo-financiero.md`.
3. **Identificar páginas con más potencial:** cruza en una hoja de cálculo (mensual) las páginas vistas de cada URL con el RPM medio, y las impresiones de Search Console. Prioriza las páginas con muchas impresiones y posición entre 5 y 20: mejorar su título o su contenido puede multiplicar los clics.
4. **Mejorar sin perjudicar al usuario:** mejora títulos y descripciones que tengan CTR bajo, añade ejemplos y respuestas a las dudas que veas en las consultas, enlaza mejor entre páginas relacionadas. **No** aumentes la densidad de anuncios por encima de lo que permite una lectura cómoda: penaliza la experiencia y, a medio plazo, el SEO.
5. **Interpretar fluctuaciones:** el RPM varía por la demanda publicitaria (suele bajar en enero y subir en el último trimestre), el país de las visitas, el dispositivo, el porcentaje de usuarios que rechazan el consentimiento (reciben anuncios no personalizados, normalmente peor pagados) y las noticias (picos de tráfico informativo con RPM menor). Compara periodos equivalentes y medias de 28 días, no días sueltos.
6. **Pagos, umbral y fiscalidad** ([umbrales](https://support.google.com/adsense/answer/1709871), [pasos para cobrar](https://support.google.com/adsense/answer/1709858)):
   - Umbral de pago en euros: **70 €**. Los pagos se emiten entre el día 21 y el 26 del mes siguiente si el saldo supera el umbral el día 20 y no hay retenciones.
   - Al alcanzar 10 € Google puede enviarte por correo postal un **PIN** para verificar tu dirección; sin él no te pagará.
   - Forma de pago en España: transferencia SEPA (con un pequeño ingreso de prueba; [ayuda](https://support.google.com/adsense/answer/2975858)).
   - **Información fiscal:** en **Pagos → Información de pagos → Gestionar configuración** ([ayuda](https://support.google.com/adsense/answer/14131950)).
   - **En España**, los ingresos de AdSense suelen tratarse como rendimientos de una actividad económica: normalmente implica darse de alta en Hacienda (declaración censal), declararlos en el IRPF y, como el pagador es una empresa de otro país de la UE, puede ser necesario el alta en el Registro de Operadores Intracomunitarios y presentar declaraciones informativas de IVA. La obligación de alta en autónomos depende de tu situación. **Consulta a un asesor fiscal antes de cobrar el primer pago**; esta guía no es asesoramiento fiscal.
   - El reparto de ingresos lo explica Google en [Reparto de ingresos de AdSense](https://support.google.com/adsense/answer/180195): el editor recibe el 80 % tras la comisión de la plataforma compradora.

---

## FASE F · Escalado

1. **Plan de 90 días:** ver `docs/06-plan-90-dias.md`.
2. **Objetivos de actividad medibles** (no de ingresos): publicar 2 contenidos nuevos o mejoras sustanciales por semana, revisar la normativa cada mes, revisar Search Console cada semana, conseguir 5 menciones o enlaces legítimos por trimestre.
3. **Actualizar o crear:**
   - **Actualiza** una página cuando tenga impresiones pero CTR bajo, posición media 5-20, consultas que la página no responde, o cuando cambie la norma o el dato.
   - **Crea** una página nueva cuando veas en Search Console consultas recurrentes con una **intención distinta** que ninguna página cubre (por ejemplo, «alquiler por habitaciones»).
4. **Enlaces y menciones legítimos:** ofrece la calculadora y las guías como recurso a asociaciones de inquilinos o propietarios, servicios municipales de vivienda, blogs de gestión de alquileres y periodistas que escriben cada mes sobre el IRAV (con datos útiles y fechados); participa respondiendo con rigor en foros y enlaza solo cuando resuelva la duda. **No compres enlaces** ni hagas intercambios masivos: incumple las políticas de Google.
5. **Detectar oportunidades en Search Console:** filtra **Rendimiento** por consultas con más de 100 impresiones y CTR inferior al 2 %, o que contengan palabras como «calcular», «modelo», «plazo» o un año; agrúpalas por intención.
6. **Ampliar o profundizar:** profundiza mientras queden intenciones de alquiler sin cubrir (los briefs 17-30). Amplía hacia **compraventa y fiscalidad de la vivienda** (nicho N11 de la investigación) solo cuando las páginas actuales reciban tráfico estable y puedas mantener la calidad.
7. **¿Merece la pena invertir?** Usa el criterio: inversión ≤ beneficio neto de 3-6 meses y con un efecto medible. Ejemplos razonables cuando haya ingresos: revisión jurídica de las guías fiscales, una herramienta SEO durante un mes para un análisis de competidores, mejoras técnicas solo si Search Console muestra problemas.
