# CNT → producto — El piso de `US-04` cierra en 9, no en 10

> `contenido`, `T-54` del ciclo 4. No edito `Docs/PRODUCTO/`, dejo la propuesta acá.
> Consume: `RES-44`/`RES-46` (`Docs/INVESTIGACION/INV-44-tapas-coveralia.md`), `CTR-05`
> (`Docs/ARQ/ARQ-schema-adivinar-tapa.md`), `src/data/tapa.json` (recién cargado).

## El número

`src/data/tapa.json` tiene **9 ítems en `estado: "listo"`**, no 10. `US-04` pide un piso
de 10 (`PRD-alcance-v1.md`) y `CTR-05.10` lo hereda.

## Por qué no llegué a 10

`public/tapas/` tiene un solo derivado por disco — la cara `frontal`, que produce
`scripts/generar-tapas.mjs` desde `Docs/INVESTIGACION/TapasDiscos/`. No existen todavía
los `-detalle.jpg` de `T-49`, así que **no tengo un segundo encuadre de ningún disco** para
completar el pool con una imagen distinta del mismo título, que es la salida que `CTR-05.10`
deja prevista ("el ítem es una imagen, no un disco").

De los 10 títulos del enum, **9 tienen su `frontal` auditado como apto** (`RES-44`,
veredicto "coincide con la original, sin marcador que lo pruebe") y entraron como ítems
`listo`. El décimo, ***La mosca y la sopa***, queda afuera entero: `RES-44` encontró que
`la-mosca-y-la-sopa-frontal.jpg` —el único archivo que existe en `public/tapas/` para ese
disco— es un **rediseño confirmado, no la tapa de Rocambole** (una foto de recital con un
sello de goma, sin el gato momificado ni los cerdos y peces del arte real documentado en
`RES-06`/`RES-22`). No es un caso de "no determinable": está confirmado que la imagen
disponible es la incorrecta. Cargarla como respuesta correcta es exactamente lo que `D-21`
prohíbe — el jugador que sabe que la tapa real tiene un gato momificado vería una foto de
recital y, si acertara "La mosca y la sopa", el juego lo premiaría por una imagen falsa.

El título **sigue jugando como distractor** en tres ítems del banco (`TP-004`, `TP-005`,
`TP-007`, `TP-008`) — eso no necesita imagen y no está bloqueado.

## Qué se necesitaría para cerrar el piso

Cualquiera de estas tres, no las tres:

1. **Un máster real de la tapa de *La mosca y la sopa*** (gato momificado, cerdos y peces,
   `RES-06`/`RES-22`) en `Docs/INVESTIGACION/TapasDiscos/`, para que `arquitectura`/quien
   gestione esa carpeta corra `generar-tapas.mjs` de nuevo. Con eso, cargo el décimo ítem
   en la próxima ráfaga sin tocar nada más de este archivo.
2. **Que `T-49` entregue el derivado `-detalle.jpg`** de cualquiera de los 9 discos ya
   aptos. Con un segundo encuadre completo el pool a 10 sin esperar a *La mosca y la sopa*
   — es la salida que `CTR-05.10` ya preveía.
3. **Que `producto` baje el piso de `US-04` a 9** para este ciclo, documentado como tal,
   si ninguna de las dos anteriores entra a tiempo.

## Un segundo flag, menor, sobre dos ítems que sí cargué

`TP-007` (*Lobo suelto*) y `TP-008` (*Cordero atado*) llevan `credito.autor: "Rocambole
(Ricardo Cohen)"` porque es el único valor que admite el enum de `CTR-05.4`. Pero `RES-44`
anota el frontal de *Cordero atado* como "arte naif azul/naranja (autoría Semilla
Bucciarelli, no Rocambole)", y `RES-40`/`RES-36` dan el crédito de tapa de los dos
volúmenes como conjunto ("Visiones: Rocambole, Semilla y Meroyuela"), sin separar aportes.
Los cargué igual — Rocambole es uno de los tres nombrados y `RES-06` sostiene que hizo
"todas" las portadas desde 1978 — pero dejé `notaInterna` en ambos ítems marcando la
salvedad. Si `arquitectura` en algún momento amplía `credito.autor` para créditos
compartidos, estos dos ítems son los primeros para revisar.
