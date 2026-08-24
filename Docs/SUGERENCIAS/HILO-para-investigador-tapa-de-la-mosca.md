# Para `investigador`: volver a mirar el veredicto de `RES-44` sobre la tapa de *La mosca y la sopa*

> De: hilo principal · Fecha: 2026-08-24 · Consume: `RES-44` (`INV-44`), `RES-06`, `RES-22`,
> `D-04`, `UX-04`.
> **Es un pedido acotado: una fila de una tabla, no la tabla entera.**

## Qué pasó hoy

El usuario trajo la tapa de *La mosca y la sopa* y pidió que el sitio la use. Se hizo:
`scripts/generar-tapas.mjs` ya no apunta a la contratapa sino a la tapa real, y la ficha del
disco en la Redondopedia la muestra.

**Pero eso choca de frente con `RES-44`**, que había dictaminado exactamente lo contrario.

## El choque, en dos líneas

`RES-44` dice que el frontal de este disco es un **rediseño** y no arte de Rocambole:

> *"foto de recital en vivo, sello de goma amarillo con mosca; **no hay** gato momificado ni
> cerdos/peces (arte real, `RES-22`)"* — veredicto: **"rediseño confirmado — no es la tapa de
> Rocambole"**, apto para `US-04`: **"NO — crítico"**.

El hilo principal comparó la imagen del usuario contra el `-frontal` que ya estaba en
`TapasDiscos/`: **son la misma obra**, en dos ediciones distintas y con distinta resolución.
Así que el veredicto de `RES-44` le cae igual a la imagen nueva.

## Por qué igual se usó, y por qué esto no es cerrarle la puerta a la ficha

Tres razones, y la tercera es la que más pesa:

1. **Es el proyecto del usuario y lo pidió mirando el disco.** `D-14` fijó que la postura del
   proyecto es la del usuario, no la de la cautela.
2. **La contratapa tampoco era la obra**: `RES-44` la marca como reedición y también como
   **"NO"** para `US-04`. O sea que la opción anterior no era "lo correcto" contra "lo
   incorrecto": era una cara descartada contra otra cara descartada.
3. **La evidencia de esa fila es la más floja de las 35 de la tabla.** La propia ficha
   anota la fuente así: *"redondossubtitulados.com (snippet, fetch 403, dominio ya
   'reportado' en `RES-06`)"*. **No se pudo leer la página**: el veredicto salió de un
   fragmento indexado. Todas las demás filas tienen marcadores leídos en la imagen.

## Las tres preguntas

1. **¿Cuál es la tapa de la primera edición de *La mosca y la sopa* (1991, Del Cielito)?**
   Con fuente que se pueda abrir, no un snippet. Si es esta —campo rojo, foto de recital,
   bloque amarillo torcido con la mosca—, `RES-44` se corrige y listo.
2. **¿De dónde salió lo del gato momificado y los cerdos y peces?** `RES-44` los cita como
   "arte real" apoyándose en `RES-06`/`RES-22`. Vale la pena chequear **a qué pieza se
   refieren esas fichas**: puede ser el arte interno, el sobre, u otro disco. Si describen
   otra cosa, el argumento central del veredicto se cae solo.
3. **¿Quién firma esta tapa?** Es lo único que hoy el sitio no puede decir. Mientras no haya
   respuesta, **el pie de esa imagen no le acredita nada a Rocambole** — y eso ya está
   escrito en el comentario del generador.

## Lo que cambia según cómo salga

- **Si la tapa es la original**: se corrige `RES-44`, y `contenido` puede volver a evaluar si
  este disco entra al banco de `US-04`, que hoy está afuera **entero** por este veredicto.
  Ojo que eso toca el piso de `US-04`, que hoy está cumplido en 10/10 sin él.
- **Si de verdad es un rediseño**: no se saca del sitio —el usuario ya decidió—, pero el pie
  tiene que decirlo. Un rótulo que dice la verdad sobre lo que hay adentro es exactamente lo
  que `D-14` pide, y una tapa de reedición rotulada como tal es contenido perfectamente bueno.

**Numeración:** `RES-53` está libre (`RES-51` y `RES-52` se consumieron en el ciclo 8).
