# 9. Mantenimiento normativo (rutina mensual)

La utilidad del sitio depende de que los datos legales estén al día. Todo lo que cambia con la normativa está concentrado en **tres archivos**:

| Archivo | Qué contiene |
|---|---|
| `src/data/normativa.ts` | Fecha de revisión, límites extraordinarios (decretos de 2026), último IRAV comprobado, interés legal del dinero, enlaces a fuentes |
| `src/data/cambios.ts` | Historial público de cambios (se muestra en `/normativa/`) |
| `src/content/guias/*.md` | Textos de las guías (fechas `actualizado:`) |

Las fechas de revisión de las calculadoras están en `src/data/herramientas.mjs` (`revisado`) y las de las páginas fijas en `src/data/paginas-fijas.mjs`.

## Cada mes (hacia el día 15-16, cuando el INE publica el IPC y el IRAV)

1. Abre la [página del IRAV en el INE](https://www.ine.es/dyngs/INEbase/operacion.htm?c=Estadistica_C&cid=1254736177110&idp=1254735976607&menu=ultiDatos) y anota el último dato y su fecha de publicación.
2. En `src/data/normativa.ts`, actualiza `ULTIMO_IRAV_COMPROBADO` (`mesDato`, `valorPct`, `publicadoEl`, `comprobadoEl`).
3. Revisa en el [BOE](https://www.boe.es/) si hay normas nuevas sobre arrendamientos urbanos (busca «arrendamientos» en las disposiciones generales del mes).
4. Si no hay cambios legales, actualiza solo `ESTADO_NORMATIVO_FECHA` a la fecha de hoy.
5. Añade una línea en `src/data/cambios.ts` (arriba del todo).
6. Ejecuta `npm run verify` y sube los cambios (`git add -A`, `git commit -m "Actualizar IRAV de <mes>"`, `git push`).

## Si un decreto se convalida o se deroga

En `src/data/normativa.ts`, dentro de `LIMITES_EXTRAORDINARIOS`:

- **Convalidado:** cambia `estado: 'vigente-pendiente-convalidacion'` por `estado: 'convalidada'` y actualiza la `nota`.
- **Derogado:** cambia a `estado: 'derogada'` y añade `finEfectivo: 'AAAA-MM-DD'` con el último día en vigor. La calculadora mostrará entonces el aviso de «debate jurídico» para las fechas de ese periodo y dejará de aplicar el límite después.
- Actualiza también los textos que mencionan el estado: la guía `limite-subida-alquiler-2-por-ciento.md` (primer párrafo), `src/pages/normativa.astro` (párrafo «Si el decreto se convalida…») y el aviso de `fin-contrato-alquiler.astro`.
- Ejecuta `npm test`: si una prueba depende del estado (por ejemplo, la que espera el aviso de «pendiente de convalidación»), adáptala al nuevo estado.

## Si aparece un límite nuevo

Añade un objeto a `LIMITES_EXTRAORDINARIOS` con `desde`, `hasta`, `estado`, `limitePct`, `reglaPrecioReferencia` y su `fuente`. Añade una prueba en `tests/unit/actualizacion.test.ts` con un caso resuelto a mano.

## Cada enero

- Interés legal del dinero: comprueba en la Ley de Presupuestos (o su prórroga) el tipo del año y añádelo a `INTERES_LEGAL`.
- Revisa los textos que mencionan años concretos.

## Comprobaciones antes de subir cualquier cambio legal

- [ ] El dato procede de la fuente oficial (BOE, INE, ministerio), no solo de prensa.
- [ ] La fecha de revisión se ha actualizado.
- [ ] El historial de cambios tiene una línea nueva.
- [ ] `npm run verify` termina sin errores.
