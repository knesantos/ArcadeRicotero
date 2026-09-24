# De `arquitectura` para el hilo principal: la fila de `T-279` contra `CTR-19`

> 2026-09-23, ciclo 16, ráfaga 2, `T-273`. `CTR-19` quedó en
> `Docs/ARQ/ARQ-schema-recitales.md`. **No toco `Docs/ORQ/`.** La fila de `T-279` en
> `ORQ-plan-ciclo-16.md §2` se escribió antes de la enmienda de `D-45`, y `§2.3` la corrige en
> prosa pero no en la tabla. Te dejo las tres diferencias para que la ráfaga 3 no arranque
> desde la fila.

## 1. Faltan archivos en la columna "Archivos"

La fila nombra `recitales.json`, su schema, `recitales.ts`, `ingerir-recitales.mjs`,
`catalogo.ts` y `escalonar.test.ts`. `CTR-19` agrega los de la pieza 1, que son **los únicos
que abren la puerta de `BR-28`**:

- `src/data/setlistfm.json` y `src/data/_schema/setlistfm.schema.json` (`CTR-19.10`, el
  ejemplo de `CTR-19.12` es el archivo real y valida).
- `src/lib/en-vivo.ts` y `src/lib/en-vivo.test.ts` (`CTR-19.5`, t1 a t9).
- `src/pages/juegos/adivinar-el-tema.astro`, que deja de importar `popularidad.json`.
- Dos filas en `ALIAS` de `src/lib/letra/temas.ts` (`CTR-19.2`).
- `src/lib/tema/catalogo.test.ts`: los dos tests de tercios con vistas se reescriben, porque
  hoy afirman `cat.medidos`.

Y **los cuatro de la pieza 2 son condicionales**: si `RES-76`+ no trae ninguna fuente usable,
no existen, y eso es un estado válido (`CTR-19.7`). La lista completa, en orden, está en
*Consecuencias* de `CTR-19`.

## 2. "El total de recitales coincide con el de `RES-73`" ya no aplica

Los recitales guardados salen de fuentes abiertas, no de setlist.fm. El total se compara, por
fuente, con lo que cuente **`RES-76`+** (comando (2) de `CTR-19.13`). Los 256 de `RES-74` son
el `setlistsCargados` del conteo citado y no tienen que coincidir con nada guardado.

## 3. Una cita vieja en `D-45` que `INV-73` ya señaló

El *Estado* de `D-45` dice que la condición la muestra `RES-73`. La cobertura quedó en
**`RES-74`** (aviso de trazabilidad de `INV-73`). La enmienda del 2026-09-23 ya cita bien a
`RES-74`, pero la línea de *Estado* de arriba sigue con el número viejo. Es tu archivo.

## Lo que no cambia de la fila

Que `escalonar.test.ts` (o `en-vivo.test.ts`, da igual cuál) cuente **8 Fáciles determinados
sobre el pozo real**, y que un título que no resuelve ni está declarado `fuera` ponga el test
en rojo con su nombre. Es t1 y t5 de `CTR-19.13`.
