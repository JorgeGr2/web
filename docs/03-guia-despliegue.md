# 3. Guía para publicar la web (sin experiencia previa)

Esta guía te lleva desde el código hasta una web pública con tu dominio y HTTPS. Está pensada para alguien que nunca ha usado la terminal, Git ni DNS. Tiempo estimado: 1–2 horas la primera vez, más la espera de propagación del dominio.

> **Qué está hecho y qué te toca a ti.**
> - ✅ Hecho: el código, las pruebas y la subida del código a GitHub en la rama `claude/sweet-dijkstra-tw4ipu` del repositorio `JorgeGr2/web`.
> - 👤 Te toca: comprar el dominio, crear la cuenta de Cloudflare, conectar el repositorio, rellenar tus datos de titular y pulsar los botones de los paneles. **Nunca compartas contraseñas ni claves en un chat**: esta guía no las necesita.
> - ⛔ La web **no está publicada** todavía. Lo estará cuando completes el paso 7.

## 1. Qué archivos y carpetas hay

```
web/
├── README.md                 Resumen y comandos
├── package.json              Dependencias y comandos (npm run …)
├── astro.config.mjs          Configuración de Astro (sitemap, validación de variables)
├── .env.example              Plantilla de variables de entorno (cópiala como .env)
├── .nvmrc                    Versión de Node recomendada (24)
├── public/                   Archivos que se publican tal cual (iconos, imagen social, js de anuncios)
├── src/
│   ├── pages/                Cada archivo es una página (calculadoras, guías, legales…)
│   ├── content/guias/        Las guías en Markdown (texto fácil de editar)
│   ├── data/normativa.ts     ⚠️ Datos legales fechados (revisar cada mes)
│   ├── data/herramientas.mjs Lista de calculadoras
│   ├── data/cambios.ts       Historial público de cambios
│   ├── lib/calc/             Lógica de cada calculadora (con pruebas)
│   ├── components/ layouts/  Piezas de diseño reutilizables
│   ├── config/               Lectura y validación de variables de entorno
│   └── styles/global.css     Estilos
├── tests/                    Pruebas automáticas (unitarias y de navegador)
├── scripts/                  QA del sitio compilado y generación de iconos
└── docs/                     Toda la documentación (esta guía incluida)
```

## 2. Programas y cuentas necesarios

| Qué | Para qué | Coste |
|---|---|---|
| [Node.js](https://nodejs.org/es) versión 24 LTS (mínimo 22.12) | Ejecutar y compilar la web en tu ordenador | Gratis |
| [Git](https://git-scm.com/downloads) | Descargar y subir el código | Gratis |
| Cuenta de [GitHub](https://github.com/) (ya la tienes: `JorgeGr2`) | Guardar el código | Gratis |
| Cuenta de [Cloudflare](https://dash.cloudflare.com/sign-up) | Alojamiento, DNS, HTTPS, analítica sin cookies y reenvío de correo | Gratis (plan Free) |
| Un registrador de dominios (DonDominio u OVHcloud) | Comprar `alquilerenregla.es` | Pago anual (ver paso 5) |
| Opcional: [Visual Studio Code](https://code.visualstudio.com/) | Editar textos cómodamente | Gratis |

Al instalar Node.js en Windows, deja marcadas las opciones por defecto. Para comprobar la instalación, abre una terminal («Terminal» en Mac; «PowerShell» en Windows) y escribe:

```bash
node --version
```

Resultado esperado: `v24.x.x` (o al menos `v22.12.0`).

```bash
git --version
```

Resultado esperado: `git version 2.x.x`.

## 3. Ejecutar la web en tu ordenador

En la terminal, ve a la carpeta donde quieras guardar el proyecto (por ejemplo, Documentos):

```bash
cd Documentos
git clone https://github.com/JorgeGr2/web.git
cd web
git checkout claude/sweet-dijkstra-tw4ipu
```

Resultado esperado: se crea la carpeta `web`. El último comando dirá `Already on 'claude/sweet-dijkstra-tw4ipu'` si esa ya es la rama por defecto, o `Switched to a new branch 'claude/sweet-dijkstra-tw4ipu'` si no lo es; las dos respuestas son correctas. (Cuando hayas creado `main` en el paso 7.1, usa `git checkout main`.)

**Todos los comandos siguientes se ejecutan dentro de la carpeta `web`.**

Instala las dependencias (solo la primera vez, o cuando cambie `package.json`):

```bash
npm ci
```

Resultado esperado: termina con `found 0 vulnerabilities` o similar, sin errores en rojo. Si `npm ci` falla, prueba con `npm install`.

Arranca el servidor de desarrollo:

```bash
npm run dev
```

Resultado esperado: un mensaje con `Local http://localhost:4321/`. Abre esa dirección en el navegador. Verás la web con una franja amarilla que dice «Versión de revisión»: es normal hasta que configures el sitio como indexable. Para parar el servidor, pulsa `Ctrl + C` en la terminal.

## 4. Comprobar que funciona antes de publicar

Comprobación completa (tipos + pruebas unitarias + compilación + control de calidad del HTML):

```bash
npm run verify
```

Resultado esperado al final: `QA del sitio compilado: sin errores.` Si aparece una lista de «Errores», no publiques hasta corregirlos.

Pruebas en navegador real (accesibilidad, móvil, calculadoras). La primera vez instala el navegador de pruebas:

```bash
npx playwright install chromium
npm run test:e2e
```

Resultado esperado: `82 passed` (el número puede cambiar si se añaden pruebas).

Para ver la versión compilada tal como se publicará:

```bash
npm run build
npm run preview
```

y abre `http://localhost:4321/`.

## 5. Comprar el dominio

El nombre elegido es **Alquiler en Regla** y el dominio, **`alquilerenregla.es`** (libre el 14/10/2026 según tu comprobación).

1. **Antes de pagar**, busca «Alquiler en Regla» (y variantes parecidas) en la web de la [Oficina Española de Patentes y Marcas](https://www.oepm.es/) y en [TMview](https://www.tmdn.org/tmview/), que incluye las marcas de la Unión Europea, válidas también en España. Fíjate sobre todo en las registradas para servicios inmobiliarios, de información o de publicación en línea. Si aparece una igual o muy parecida, no compres el dominio y elige otro nombre: además de las variables `PUBLIC_SITE_NAME` y `PUBLIC_SITE_URL` (paso 8), habrá que cambiar el nombre y la URL por defecto en `src/config/env-schema.mjs` y el texto de la imagen social en `scripts/generate-assets.mjs` (y ejecutar `npm run assets`).
2. **Dónde comprarlo.** Cloudflare Registrar no vende dominios `.es` (hay una petición abierta en su foro), así que cómpralo en un registrador acreditado y usa Cloudflare solo para el DNS (paso 9). Recomendado: **DonDominio** (español, especializado en dominios, sin empujar a contratar alojamiento) u **OVHcloud** (europeo, precios publicados). IONOS, Arsys o Hostinger también valen, pero suelen tener un primer año barato y una renovación más cara. Compara siempre el **precio de renovación**.
3. **Al comprar:** crea la cuenta con datos reales. El titular del dominio debe ser el mismo que pondrás en el aviso legal (`PUBLIC_OWNER_NAME`): tú, con tu DNI o NIE, o tu empresa, con su NIF. Elige 1 año y **no añadas extras** (alojamiento, certificado SSL, constructor web ni buzón de correo): la web ya está hecha y Cloudflare da gratis el alojamiento, el HTTPS y el reenvío de correo (reenvía a tu correo personal; no es un buzón). Activa la **renovación automática** y el bloqueo de transferencia si el registrador lo ofrece.
4. **Opcional:** si `alquilerenregla.com` está libre, puedes registrarlo para proteger el nombre. Hazlo después del paso 9, desde el panel de Cloudflare (**Registro de dominios → Registrar dominios**), donde se vende a precio de coste. Para que lleve al `.es`, crea en ese dominio un registro DNS `A` con nombre `@`, contenido `192.0.2.1` y proxy activado (nube naranja), y una regla de redirección 301 hacia `https://www.alquilerenregla.es`. Suma su renovación a los costes del paso 12.
5. Guarda los correos de confirmación. No compartas contraseñas ni códigos de autorización en ningún chat.
6. **No cambies nada más en el registrador por ahora.** Los servidores DNS, `www`, el HTTPS y el correo se configuran en el paso 9, después de crear la web en Cloudflare (pasos 7 y 8).

## 6. Qué alojamiento recomiendo y por qué

**Recomendación: Cloudflare Pages (plan gratuito).**

- Gratis para sitios estáticos como este, con HTTPS automático y red de distribución mundial.
- Lee el archivo `_headers` que genera el proyecto (cabeceras de seguridad y caché).
- Despliega solo cada vez que subes cambios a GitHub y crea una vista previa por cada rama.
- Incluye Web Analytics sin cookies y reenvío de correo gratuito (para `contacto@alquilerenregla.es`).
- Límites del plan gratuito según su documentación: 500 compilaciones al mes y 20.000 archivos por sitio, sobrados para este proyecto. Compruébalos en [la página de límites](https://developers.cloudflare.com/pages/platform/limits/).

Limitaciones y alternativas:
- **Netlify:** también lee `_headers`; su plan gratuito tiene límites de uso que conviene revisar.
- **GitHub Pages:** gratis, pero **no** aplica el archivo `_headers` (perderías las cabeceras de seguridad).
- **Vercel (plan Hobby):** sus condiciones lo limitan a uso personal no comercial; una web con publicidad no encaja.

Cloudflare está integrando Pages dentro de «Workers»; si los menús no coinciden exactamente con esta guía, busca la opción equivalente en su documentación.

## 7. Subir el código al alojamiento

### 7.1 Crear la rama principal `main`

Ahora mismo el repositorio solo tiene la rama `claude/sweet-dijkstra-tw4ipu`, que es la rama por defecto; `main` todavía no existe. Créala a partir de ella:

1. Entra en `https://github.com/JorgeGr2/web`.
2. Pulsa el selector de ramas (arriba a la izquierda, donde pone `claude/sweet-dijkstra-tw4ipu`), escribe `main` y pulsa **Create branch main from claude/sweet-dijkstra-tw4ipu**.
3. Ve a **Settings → General → Default branch**, pulsa el icono de las dos flechas, elige `main` y confirma con **Update**.

Resultado esperado: `main` aparece como rama por defecto. A partir de ahora, los cambios hechos en otras ramas se llevan a `main` con un pull request (**Pull requests → New pull request**, base `main` → **Create pull request** → **Merge pull request**).

### 7.2 Crear el proyecto en Cloudflare Pages

1. Entra en el [panel de Cloudflare](https://dash.cloudflare.com/) → **Workers y Pages** → **Crear** → pestaña **Pages** → **Conectar a Git**.
2. Autoriza a Cloudflare a acceder a tu GitHub y elige el repositorio `JorgeGr2/web`.
3. Configuración de compilación:
   - **Nombre del proyecto:** `alquiler-en-regla` (Cloudflare propone `web`, el nombre del repositorio). Este nombre fija la dirección provisional `https://alquiler-en-regla.pages.dev`; si está ocupada, Cloudflare le añade un sufijo.
   - **Rama de producción:** `main`
   - **Framework preset:** Astro
   - **Comando de compilación:** `npm run build`
   - **Directorio de salida:** `dist`
4. Antes de pulsar «Guardar e implementar», abre en esa misma pantalla **Variables de entorno (avanzado)** y añade las variables de la tabla del paso 8.
5. Pulsa **Guardar e implementar**. Resultado esperado: tras 1–2 minutos, «Éxito» y una dirección del tipo `https://alquiler-en-regla.pages.dev`.

## 8. Configurar las variables de entorno

Durante la creación del proyecto se añaden en **Variables de entorno (avanzado)** (paso 7.2); después se cambian en **Configuración → Variables y secretos** (entorno de *Producción*). Ninguna es secreta: todas acaban visibles en la web.

| Variable | Valor en el primer despliegue | Valor al lanzar |
|---|---|---|
| `NODE_VERSION` | `24` | `24` |
| `PUBLIC_SITE_URL` | `https://www.alquilerenregla.es` | igual |
| `PUBLIC_SITE_NAME` | `Alquiler en Regla` | igual |
| `PUBLIC_SITE_INDEXABLE` | `false` | `true` (paso 10) |
| `PUBLIC_OWNER_NAME` | tu nombre o razón social | igual |
| `PUBLIC_OWNER_NIF` | tu NIF | igual |
| `PUBLIC_OWNER_ADDRESS` | domicilio a efectos de notificaciones | igual |
| `PUBLIC_CONTACT_EMAIL` | `contacto@alquilerenregla.es` | igual |
| `PUBLIC_CF_ANALYTICS_ENABLED` | `false` | `true` si activas Web Analytics |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | vacío | solo si verificas Search Console por etiqueta HTML |
| `PUBLIC_ADSENSE_CLIENT`, `PUBLIC_ADSENSE_SLOT_*`, `PUBLIC_GA4_ID` | vacío | ver `docs/04-guia-adsense-monetizacion.md` |

Sobre el domicilio: la LSSI-CE exige publicar un domicilio. Si no quieres publicar el de tu vivienda, puedes usar un domicilio profesional o de una oficina virtual a tu nombre; consúltalo con un asesor si tienes dudas.

Después de cambiar variables, ve a **Implementaciones** y pulsa **Reintentar implementación** en la última (las variables se aplican al compilar).

Si la compilación falla con «Configuración no válida», el mensaje dice exactamente qué variable corregir.

## 9. Conectar el dominio y HTTPS

1. En Cloudflare: **Añadir un dominio** → `alquilerenregla.es` → plan **Free**. Cloudflare copia los registros DNS que ya tenga el dominio. Si ves registros `A`, `AAAA` o `CNAME` para `alquilerenregla.es` o `www` que no has creado tú (suelen ser la página de aparcamiento del registrador), bórralos: Pages creará los suyos en el punto 3. Al terminar te mostrará **dos servidores de nombres** (por ejemplo `xxx.ns.cloudflare.com`).
2. En el panel de tu registrador (DonDominio u OVHcloud), abre la opción **Servidores DNS** del dominio, elige servidores personalizados y pon esos dos. Si el dominio tiene **DNSSEC** activado en el registrador, desactívalo antes del cambio (si no, el dominio dejará de funcionar); podrás activarlo después desde Cloudflare. La propagación tarda de minutos a 24-48 h, y Cloudflare te avisará por correo cuando el dominio esté **Activo**.
3. **Cuando el dominio aparezca como «Activo» en Cloudflare**, ve al proyecto de Pages → **Dominios personalizados** → **Configurar un dominio** → escribe `www.alquilerenregla.es` → Cloudflare crea el registro DNS. Repite con `alquilerenregla.es`.
4. Para que solo haya una versión, crea una redirección: **Reglas → Reglas de redirección → Crear regla** con la plantilla «Redirigir de raíz a WWW» (301). Así `alquilerenregla.es` lleva a `https://www.alquilerenregla.es`.
5. **HTTPS:** Cloudflare emite el certificado automáticamente. En **SSL/TLS → Certificados perimetrales**, activa «Usar siempre HTTPS».
6. **Correo de contacto (necesario si usas `contacto@alquilerenregla.es`; gratis):** **Correo electrónico → Enrutamiento de correo** → crea `contacto@alquilerenregla.es` para que reenvíe a tu correo personal y confirma el mensaje de verificación que Cloudflare envía a tu correo. Es solo un reenvío: contestarás desde tu correo personal. Hazlo antes del paso 10, porque esta dirección aparece en el aviso legal y en la página de contacto.
7. **Analítica sin cookies (opcional):** en el proyecto de Pages → **Métricas → Web Analytics → Habilitar**, y pon `PUBLIC_CF_ANALYTICS_ENABLED=true` para que la política de privacidad lo mencione.

## 10. Comprobar la web pública y abrirla a Google

Con el sitio aún en modo revisión, comprueba:

- [ ] `https://www.alquilerenregla.es/` carga con candado (HTTPS) y la redirección desde `alquilerenregla.es` funciona.
- [ ] El aviso legal, la privacidad y el contacto muestran **tus datos reales** (no «Pendiente de completar»).
- [ ] Un correo de prueba enviado a `contacto@alquilerenregla.es` llega a tu buzón personal.
- [ ] Las 8 calculadoras dan resultado con un ejemplo de su página.
- [ ] Desde el móvil se ve bien y el menú funciona.
- [ ] Revisas y apruebas todos los textos (ver `docs/12-tareas-pendientes-y-proximas-acciones.md`).

Cuando todo esté bien, cambia `PUBLIC_SITE_INDEXABLE` a `true` y vuelve a implementar. Comprueba entonces:

- [ ] `https://www.alquilerenregla.es/robots.txt` muestra `Allow: /` y la línea `Sitemap:`.
- [ ] `https://www.alquilerenregla.es/sitemap-index.xml` se abre y enlaza a `sitemap-0.xml` con 27 direcciones.
- [ ] La franja amarilla de «Versión de revisión» ha desaparecido.
- [ ] Desde la terminal, las cabeceras de seguridad están presentes:

```bash
curl -sI https://www.alquilerenregla.es/ | grep -i -E "content-security-policy|strict-transport|x-content-type"
```

Resultado esperado: tres líneas con esas cabeceras. (En Windows, si no tienes `curl`, usa una herramienta web de cabeceras HTTP.)

## 11. Cómo actualizar la web en el futuro

1. Edita los archivos (por ejemplo, una guía en `src/content/guias/` o un dato en `src/data/normativa.ts`).
2. Comprueba en local: `npm run verify`.
3. Sube los cambios:

```bash
git add -A
git commit -m "Describe el cambio"
git push
```

4. Cloudflare compila y publica automáticamente en 1–2 minutos. Si trabajas en otra rama, obtendrás una URL de vista previa antes de fusionar en `main`.

Si una publicación sale mal, en **Implementaciones** puedes **revertir** a la versión anterior con un clic.

Mantén las dependencias al día cada 1–3 meses: `npm outdated` para ver versiones nuevas, `npm audit` para avisos de seguridad; actualiza, ejecuta `npm run verify` y `npm run test:e2e`, y sube los cambios.

## 12. Costes recurrentes esperables

| Concepto | Coste | Notas |
|---|---|---|
| Dominio `alquilerenregla.es` | Pago anual al registrador | Compara el precio de renovación, no solo el del primer año. Si compras también `alquilerenregla.com` (paso 5.4), suma su renovación |
| Alojamiento (Cloudflare Pages Free) | 0 € | Suficiente salvo crecimiento extraordinario |
| DNS, HTTPS, reenvío de correo, Web Analytics | 0 € | Incluidos en el plan Free de Cloudflare |
| Google Search Console, AdSense, Analytics | 0 € | — |
| Herramientas SEO de pago | 0 € al principio | Opcionales cuando haya ingresos que las justifiquen |
| Revisión jurídica/fiscal de contenidos | Opcional | Recomendable para las guías fiscales antes de publicarlas |
| Asesoría fiscal por los ingresos de AdSense | Según asesor | Ver `docs/04-guia-adsense-monetizacion.md`, fase E |

Detalle y escenarios en `docs/05-modelo-financiero.md`.
