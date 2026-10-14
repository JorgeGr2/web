# 5. Modelo financiero: escenarios, costes y sensibilidad

**Nada de este documento es una previsión garantizada.** No existen todavía datos reales de tráfico ni de RPM del sitio. Todas las cifras de tráfico y RPM son **hipótesis** explícitas para razonar sobre la viabilidad; sustitúyelas por datos reales de AdSense y Search Console en cuanto los tengas.

## 5.1 Fórmulas

- **Ingresos publicitarios estimados = páginas vistas ÷ 1.000 × RPM de página**
- **Beneficio neto estimado = ingresos publicitarios − costes operativos**
- Sesiones = páginas vistas ÷ páginas por sesión

## 5.2 De qué depende el RPM real

El RPM de página (ingresos por cada 1.000 páginas vistas) depende de:
- **País** de las visitas: el tráfico de España suele valer menos que el de EE. UU. o el norte de Europa, y el de Latinoamérica bastante menos.
- **Temática:** los anunciantes de seguros, servicios inmobiliarios, financieros y legales pujan más que en temas de ocio. El público de este sitio (inquilinos y propietarios) encaja en categorías de valor medio-alto. **[Hipótesis]**
- **Consentimiento:** quien rechaza las cookies recibe anuncios no personalizados o limitados, normalmente peor pagados.
- **Dispositivo:** el móvil suele tener RPM menor que el escritorio.
- **Estacionalidad:** la demanda publicitaria suele caer en enero y subir en el último trimestre.
- **Calidad del tráfico** y número y posición de los anuncios.

No se ha encontrado ninguna fuente pública fiable con el RPM medio de AdSense para sitios en español con tráfico de España (Google no publica RPM por país ni temática). Por eso se usan **intervalos hipotéticos** y un análisis de sensibilidad.

## 5.3 Hipótesis de los tres escenarios

| Hipótesis | Conservador | Intermedio | Optimista |
|---|---|---|---|
| Páginas vistas/mes en el mes 6 | 500 | 3.000 | 10.000 |
| Páginas vistas/mes en el mes 12 | 3.000 | 15.000 | 60.000 |
| Páginas vistas/mes en el mes 24 | 8.000 | 40.000 | 150.000 |
| Páginas por sesión | 1,3 | 1,5 | 1,8 |
| RPM de página (€) | 2 | 4 | 8 |
| Aprobación de AdSense | Mes 4-6 | Mes 3-4 | Mes 2-3 |
| Supuestos de contenido | Solo las 16 páginas actuales y poco mantenimiento | Plan editorial de 30 piezas y mantenimiento mensual | Plan completo, enlaces conseguidos y posiciones altas en consultas de la calculadora principal |

Las curvas de tráfico son **hipótesis**: los sitios nuevos suelen tardar meses en ganar visibilidad orgánica, y la vista creada con IA de Google puede reducir los clics de consultas informativas.

## 5.4 Costes operativos

| Concepto | Coste mensual | Notas |
|---|---|---|
| Dominio | ≈ 1-1,5 € | **[Hipótesis]** dominio de 12-18 €/año; comprueba el precio de renovación real |
| Alojamiento, DNS, HTTPS, correo de reenvío, analítica | 0 € | Planes gratuitos de Cloudflare |
| Herramientas | 0 € | Search Console, AdSense y Analytics son gratuitos |
| Tiempo del titular | No monetizado | Unas 4-8 h/semana en los escenarios intermedio y optimista **[Hipótesis]** |
| **Coste base** | **≈ 1,25 €** | Usado en las tablas |
| Escenario fiscal B: alta como autónomo + gestoría | ≈ 110-300 € | **[Hipótesis, verificar con asesor]** cuota reducida (tarifa plana) el primer año y cuota mínima por tramos después, más una gestoría online. Depende de tu situación personal |

> **El coste fiscal puede decidir la rentabilidad.** Si tu caso exige el alta en el régimen de autónomos solo por esta actividad, el punto de equilibrio sube mucho. Consulta con un asesor antes de activar AdSense y, si ya trabajas por cuenta propia o ajena, pregunta cómo encajan estos ingresos.

## 5.5 Resultados por escenario (coste base)

| Escenario | Mes 12: ingresos | Mes 12: beneficio neto | Mes 24: ingresos | Mes 24: beneficio neto | Sesiones/mes en el mes 24 |
|---|---|---|---|---|---|
| Conservador | 3.000 ÷ 1.000 × 2 = **6 €** | ≈ 4,75 € | 8.000 ÷ 1.000 × 2 = **16 €** | ≈ 14,75 € | ≈ 6.150 |
| Intermedio | 15.000 ÷ 1.000 × 4 = **60 €** | ≈ 58,75 € | 40.000 ÷ 1.000 × 4 = **160 €** | ≈ 158,75 € | ≈ 26.700 |
| Optimista | 60.000 ÷ 1.000 × 8 = **480 €** | ≈ 478,75 € | 150.000 ÷ 1.000 × 8 = **1.200 €** | ≈ 1.198,75 € | ≈ 83.300 |

Con el **escenario fiscal B** (supongamos 200 €/mes de costes fiscales), solo el escenario optimista sería rentable en el mes 12, y el intermedio seguiría en pérdidas en el mes 24. El punto de equilibrio sería de unos 200 € de ingresos al mes: **50.000 páginas vistas/mes con RPM de 4 €**, o 25.000 con RPM de 8 €.

## 5.6 Análisis de sensibilidad (ingresos mensuales)

| Páginas vistas/mes | RPM 1 € | RPM 2 € | RPM 4 € | RPM 6 € | RPM 8 € | RPM 12 € |
|---|---|---|---|---|---|---|
| 5.000 | 5 € | 10 € | 20 € | 30 € | 40 € | 60 € |
| 10.000 | 10 € | 20 € | 40 € | 60 € | 80 € | 120 € |
| 25.000 | 25 € | 50 € | 100 € | 150 € | 200 € | 300 € |
| 50.000 | 50 € | 100 € | 200 € | 300 € | 400 € | 600 € |
| 100.000 | 100 € | 200 € | 400 € | 600 € | 800 € | 1.200 € |
| 200.000 | 200 € | 400 € | 800 € | 1.200 € | 1.600 € | 2.400 € |

Lectura: el resultado es casi proporcional a ambas variables. Doblar el tráfico tiene el mismo efecto que doblar el RPM, pero el tráfico depende sobre todo de ti (contenido útil, enlaces, mantenimiento) y el RPM sobre todo del mercado publicitario.

## 5.7 Qué palancas priorizar (impacto / coste / riesgo)

| Acción | Impacto potencial | Coste | Riesgo | Prioridad |
|---|---|---|---|---|
| Mantener la normativa y los índices al día cada mes | Alto (confianza, retorno de usuarios) | Bajo | Bajo | 1 |
| Mejorar títulos y contenidos con datos de Search Console | Alto | Bajo | Bajo | 2 |
| Publicar los briefs 17-22 (zonas tensionadas, IRPF, deducciones) | Alto, estacional | Medio | Medio (YMYL fiscal: revisar) | 3 |
| Conseguir enlaces legítimos (asociaciones, medios) | Alto | Medio (tiempo) | Bajo | 4 |
| Ajustar anuncios automáticos (carga, exclusiones) | Medio | Bajo | Bajo si se respeta la experiencia | 5 |
| Bloques manuales adicionales | Bajo-medio | Bajo | Medio (experiencia, políticas) | 6 |
| Más anuncios por página | Bajo a corto plazo, negativo a medio | Bajo | Alto | No recomendado |

## 5.8 Cómo actualizar el modelo con datos reales

Cada mes, en una hoja de cálculo:

| Mes | Páginas vistas (AdSense o Analytics) | RPM de página (AdSense) | Ingresos (AdSense) | Costes | Beneficio | Clics orgánicos (Search Console) | Impresiones (Search Console) |
|---|---|---|---|---|---|---|---|

Calcula el RPM real (ingresos ÷ páginas vistas × 1.000) y sustituye las hipótesis. A partir de 3 meses de datos, proyecta con la tendencia de clics orgánicos, no con estas tablas.
