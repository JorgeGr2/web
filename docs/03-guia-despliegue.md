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
| Un registrador de dominios | Comprar el dominio | Pago anual (ver paso 5) |
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

Resultado esperado: se crea la carpeta `web` y el último comando dice `Switched to a new branch 'claude/sweet-dijkstra-tw4ipu'` (o similar).

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

## 5. Comprar y configurar un dominio

1. **Elige el nombre.** «Alquiler Claro» es un nombre de trabajo: comprueba que el dominio está libre y que no hay una marca registrada igual o confundible (puedes buscar en la web de la [Oficina Española de Patentes y Marcas](https://www.oepm.es/)). Si eliges otro nombre, cambia `PUBLIC_SITE_NAME`.
2. **Extensión.** `.es` transmite cercanía al público español; `.com` es más universal. Ambas valen para SEO.
3. **Dónde comprarlo.** Cualquier registrador acreditado (por ejemplo, registradores españoles para `.es`). Compara el **precio de renovación**, no solo el del primer año, y evita paquetes de alojamiento o correo que no necesitas. Cloudflare Registrar vende dominios a precio de coste, pero no admite todas las extensiones: si no ofrece la tuya, cómprala en otro registrador y usa Cloudflare solo para el DNS (paso 9).
4. Activa la **renovación automática** y el **bloqueo de transferencia**. Usa tus datos reales en el registro (obligatorio).

## 6. Qué alojamiento recomiendo y por qué

**Recomendación: Cloudflare Pages (plan gratuito).**

- Gratis para sitios estáticos como este, con HTTPS automático y red de distribución mundial.
- Lee el archivo `_headers` que genera el proyecto (cabeceras de seguridad y caché).
- Despliega solo cada vez que subes cambios a GitHub y crea una vista previa por cada rama.
- Incluye Web Analytics sin cookies y reenvío de correo gratuito (para `contacto@tudominio.es`).
- Límites del plan gratuito según su documentación: 500 compilaciones al mes y 20.000 archivos por sitio, sobrados para este proyecto. Compruébalos en [la página de límites](https://developers.cloudflare.com/pages/platform/limits/).

Limitaciones y alternativas:
- **Netlify:** también lee `_headers`; su plan gratuito tiene límites de uso que conviene revisar.
- **GitHub Pages:** gratis, pero **no** aplica el archivo `_headers` (perderías las cabeceras de seguridad).
- **Vercel (plan Hobby):** sus condiciones lo limitan a uso personal no comercial; una web con publicidad no encaja.

Cloudflare está integrando Pages dentro de «Workers»; si los menús no coinciden exactamente con esta guía, busca la opción equivalente en su documentación.

## 7. Subir el código al alojamiento

### 7.1 Llevar el código a la rama principal

El código está en la rama `claude/sweet-dijkstra-tw4ipu`. Lo normal es fusionarlo en `main`:

1. Entra en `https://github.com/JorgeGr2/web`.
2. Pulsa **Compare & pull request** junto a la rama (o **Pull requests → New pull request**, base `main`, compare `claude/sweet-dijkstra-tw4ipu`).
3. Revisa los cambios y pulsa **Create pull request** y después **Merge pull request**.

(Si el repositorio aún no tiene rama `main`, en GitHub ve a **Settings → General → Default branch** y elige la rama de trabajo, o crea `main` desde ella.)

### 7.2 Crear el proyecto en Cloudflare Pages

1. Entra en el [panel de Cloudflare](https://dash.cloudflare.com/) → **Workers y Pages** → **Crear** → pestaña **Pages** → **Conectar a Git**.
2. Autoriza a Cloudflare a acceder a tu GitHub y elige el repositorio `JorgeGr2/web`.
3. Configuración de compilación:
   - **Rama de producción:** `main`
   - **Framework preset:** Astro
   - **Comando de compilación:** `npm run build`
   - **Directorio de salida:** `dist`
4. Antes de pulsar «Guardar e implementar», añade las variables del paso 8.
5. Pulsa **Guardar e implementar**. Resultado esperado: tras 1–2 minutos, «Éxito» y una dirección del tipo `https://alquiler-claro.pages.dev`.

## 8. Configurar las variables de entorno

En el proyecto de Pages: **Configuración → Variables y secretos** (entorno de *Producción*). Ninguna es secreta: todas acaban visibles en la web.

| Variable | Valor en el primer despliegue | Valor al lanzar |
|---|---|---|
| `NODE_VERSION` | `24` | `24` |
| `PUBLIC_SITE_URL` | `https://www.tudominio.es` | igual |
| `PUBLIC_SITE_NAME` | `Alquiler Claro` (o tu nombre) | igual |
| `PUBLIC_SITE_INDEXABLE` | `false` | `true` (paso 10) |
| `PUBLIC_OWNER_NAME` | tu nombre o razón social | igual |
| `PUBLIC_OWNER_NIF` | tu NIF | igual |
| `PUBLIC_OWNER_ADDRESS` | domicilio a efectos de notificaciones | igual |
| `PUBLIC_CONTACT_EMAIL` | `contacto@tudominio.es` | igual |
| `PUBLIC_CF_ANALYTICS_ENABLED` | `false` | `true` si activas Web Analytics |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | vacío | solo si verificas Search Console por etiqueta HTML |
| `PUBLIC_ADSENSE_CLIENT`, `PUBLIC_ADSENSE_SLOT_*`, `PUBLIC_GA4_ID` | vacío | ver `docs/04-guia-adsense-monetizacion.md` |

Sobre el domicilio: la LSSI-CE exige publicar un domicilio. Si no quieres publicar el de tu vivienda, puedes usar un domicilio profesional o de una oficina virtual a tu nombre; consúltalo con un asesor si tienes dudas.

Después de cambiar variables, ve a **Implementaciones** y pulsa **Reintentar implementación** en la última (las variables se aplican al compilar).

Si la compilación falla con «Configuración no válida», el mensaje dice exactamente qué variable corregir.

## 9. Conectar el dominio y HTTPS

1. En Cloudflare: **Añadir un dominio** (plan Free). Cloudflare te mostrará **dos servidores de nombres** (por ejemplo `xxx.ns.cloudflare.com`).
2. En el panel de tu registrador, cambia los **servidores DNS** del dominio por esos dos. La propagación tarda de minutos a 24-48 h; Cloudflare te avisará por correo cuando esté activo.
3. En el proyecto de Pages → **Dominios personalizados** → **Configurar un dominio** → escribe `www.tudominio.es` → Cloudflare crea el registro DNS. Repite con `tudominio.es`.
4. Para que solo haya una versión, crea una redirección: **Reglas → Reglas de redirección → Crear regla** con la plantilla «Redirigir de raíz a WWW» (301). Así `tudominio.es` lleva a `https://www.tudominio.es`.
5. **HTTPS:** Cloudflare emite el certificado automáticamente. En **SSL/TLS → Certificados perimetrales**, activa «Usar siempre HTTPS».
6. **Correo de contacto (opcional, gratis):** **Correo electrónico → Enrutamiento de correo** → crea `contacto@tudominio.es` que reenvíe a tu correo personal.
7. **Analítica sin cookies (opcional):** en el proyecto de Pages → **Métricas → Web Analytics → Habilitar**, y pon `PUBLIC_CF_ANALYTICS_ENABLED=true` para que la política de privacidad lo mencione.

## 10. Comprobar la web pública y abrirla a Google

Con el sitio aún en modo revisión, comprueba:

- [ ] `https://www.tudominio.es/` carga con candado (HTTPS) y la redirección desde `tudominio.es` funciona.
- [ ] El aviso legal, la privacidad y el contacto muestran **tus datos reales** (no «Pendiente de completar»).
- [ ] Las 8 calculadoras dan resultado con un ejemplo de su página.
- [ ] Desde el móvil se ve bien y el menú funciona.
- [ ] Revisas y apruebas todos los textos (ver `docs/12-tareas-pendientes-y-proximas-acciones.md`).

Cuando todo esté bien, cambia `PUBLIC_SITE_INDEXABLE` a `true` y vuelve a implementar. Comprueba entonces:

- [ ] `https://www.tudominio.es/robots.txt` muestra `Allow: /` y la línea `Sitemap:`.
- [ ] `https://www.tudominio.es/sitemap-index.xml` se abre y enlaza a `sitemap-0.xml` con 27 direcciones.
- [ ] La franja amarilla de «Versión de revisión» ha desaparecido.
- [ ] Desde la terminal, las cabeceras de seguridad están presentes:

```bash
curl -sI https://www.tudominio.es/ | grep -i -E "content-security-policy|strict-transport|x-content-type"
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
| Dominio | Pago anual al registrador | Varía según extensión y registrador; compara la renovación |
| Alojamiento (Cloudflare Pages Free) | 0 € | Suficiente salvo crecimiento extraordinario |
| DNS, HTTPS, reenvío de correo, Web Analytics | 0 € | Incluidos en el plan Free de Cloudflare |
| Google Search Console, AdSense, Analytics | 0 € | — |
| Herramientas SEO de pago | 0 € al principio | Opcionales cuando haya ingresos que las justifiquen |
| Revisión jurídica/fiscal de contenidos | Opcional | Recomendable para las guías fiscales antes de publicarlas |
| Asesoría fiscal por los ingresos de AdSense | Según asesor | Ver `docs/04-guia-adsense-monetizacion.md`, fase E |

Detalle y escenarios en `docs/05-modelo-financiero.md`.
