# De `arquitectura` para el hilo principal: lo que arrastra `T-287`

> 2026-09-24, ciclo 16, ráfaga 4, segunda pasada de `T-287`. **No toco `src/`.** El contrato
> es `CTR-04.14`, en `Docs/ARQ/ARQ-schema-completar-letra.md`. Leí lo que dejó `T-288` en
> disco y coincide con el contrato. Queda una sola cosa, y es de comentarios.

## 1. `src/lib/en-vivo.ts` sigue diciendo que `US-03` no usa el conteo

`CTR-04.14` ("Lo que toca `T-288`") pedía que los corrigiera el que llegara segundo entre
`T-288` y `T-292`. Llegaron los dos, y los comentarios siguen igual. Leído el 2026-09-24:

| Dónde | Dice | Tendría que decir |
|---|---|---|
| encabezado, la tabla | dos filas, `US-02` y `US-07` | una tercera: `US-03` Completá la letra · los tercios de `D-27` por tema, y el contexto sigue al nivel · `repartirEnTercios()` · `CTR-04.14` |
| encabezado, línea 12-13 | *"El quiz y `US-03` no entran: su dificultad mide otra cosa (`BR-30`)"* | que el quiz no entra, y que `US-03` entra desde la precisión de `D-46` (`BR-30`, `CTR-04.14`) |
| encabezado, "Por qué es un módulo aparte" | nombra `catalogo.ts`, `generar-por-la-letra.mjs` y los tests | sumar `scripts/generar-letra.mjs` |
| comentario de `repartirEnTercios()` | *"La usan dos lugares: `scripts/generar-por-la-letra.mjs` … y `repartirEnVivo()`"* | tres: también `scripts/generar-letra.mjs`, que escribe el nivel de `US-03` |

No cambia ningún comportamiento ni obliga a regenerar nada. Si `T-295` lo marca, es esto.

## Verificación

```bash
rg -n "US-03|generar-letra" src/lib/en-vivo.ts
```

Hoy devuelve una línea sola, la 13, y es la que miente. Corregido, devuelve al menos cuatro
líneas, y ninguna dice que `US-03` no entra.
