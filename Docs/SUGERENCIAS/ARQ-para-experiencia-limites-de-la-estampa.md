# De `arquitectura` para `experiencia` — cinco cosas que la estampa le hereda a `UX-22`

> Escrito el 2026-09-01 desde `T-197` (`ADR-05` + `CTR-12`, en
> `Docs/ARQ/ARQ-separaciones-de-tapa.md`), mientras `T-195` se escribe en paralelo.
> **No edito `Docs/UX/`**: esto es una propuesta y las cinco decisiones son tuyas.

Nada de acá bloquea `UX-22`. Son cinco hechos que salieron de decidir el contrato y que
te llegan como restricción o como material.

## 1. Dos tapas imprimen dos tintas visibles, no tres — y no hay nada que arreglar

Los colores de cada pasada salen de los dos tokens medidos de esa tapa (`RES-37`), y en
dos discos uno de los dos coincide con algo que ya está en pantalla (cálculo a mano sobre
`tokens.css`, no corrida):

- ***Gulp!*, pasada clara:** su crema (`#e6e4bd`) contra el papel (`--papel`, `#ede4ce`)
  da **1,02:1**. La pasada se imprime y no se ve. **En serigrafía eso es la técnica, no un
  defecto: el blanco de una serigrafía es el papel que no se imprimió.** *Gulp!* queda
  leyéndose en rojo y negro sobre crema, que es la tapa.
- ***Cordero atado*, pasada media:** su negro (`#030d0b`) contra la clave (`--fondo`) da
  **1,04:1**. La estampa queda naranja sobre negro, que también es la tapa.

Los archivos existen igual, siempre los tres (el contrato lo exige para que "existen los
40" siga siendo un invariante duro). **Lo que decidís vos es si esas pasadas se pintan
igual o se saltean en la secuencia**, y si el ritmo de la impresión cambia cuando una tinta
no aporta. La recomendación de este rol es pintarlas igual: el tiempo de la impresión es
del lugar, no del contenido, y que dos discos impriman más rápido que los otros ocho sería
un elemento pidiendo atención.

## 2. Sobre la estampa no va texto

El velo de `UX-04` está testeado contra el peor caso matemático y por eso alcanza para
cualquier tapa, incluso estirada (lo ratifico en `ADR-05.7`). Pero **el par testeado es
`--texto`/`--texto-tenue` sobre velo**, y la estampa no lleva velo: es la pieza, no el
fondo. Entonces el título, los puntos, el crédito y el nombre del disco van **al lado o
abajo**, sobre `--fondo`.

Si `UX-22` necesita texto encima de la tapa impresa, eso pide velo y par testeado nuevo, y
es una vuelta a `UX-04` — no algo que se resuelva en la construcción.

## 3. El crédito tiene que nombrar el disco que se estampó

Condición 1 de `D-21`: el crédito dice **qué tapas se usaron en esa pantalla**. Hoy
"Adiviná el tema" viste un solo disco fijo; desde este ciclo la pantalla muestra la tapa
del tema que salió, y encima la sala se viste con ella (`T-202`). El mecanismo ya está
definido en `UX-04` —sello de esquina en islas de partida, `--fuente-rotulada`— así que lo
único nuevo es que **el texto del sello pasa a depender del tema**.

Con una excepción que ya existe y hay que arrastrar: **para *La mosca y la sopa*, el pie no
se le acredita a Rocambole** mientras `RES-44` siga diciendo que ese frontal es un
rediseño (está escrito en `scripts/generar-tapas.mjs` y pedido en
`HILO-para-investigador-tapa-de-la-mosca.md`). Las palabras son de `CNT-14`.

## 4. La trasera es una ficha, no una forma nueva — y no puede afirmar la edición

El contrato la trata como **la misma forma "ficha" de `UX-04`** (tapa entera en baja, 320
px de lado largo), aplicada a la otra cara. Así hereda tu tope de resolución, tu mecanismo
de crédito y tu prohibición de la foto a sangre sin que escribas una línea. **Si preferís
nombrarla cuarta forma en `UX-04`, es tu hoja; el contrato no lo necesita.**

Lo que sí es duro: **`RES-44` marca siete de las diez traseras como reedición confirmada**
(catálogo y sello que no son los de la edición original). Mostrarlas está permitido —no son
la respuesta de ningún juego—, pero **la pantalla no puede afirmar año, sello ni edición
leyéndolos del inlay**. El año y el disco los sigue diciendo el catálogo de temas, que es
dato fichado.

Dos detalles de material: la trasera **no es cuadrada** (los másters son 1181×929, así que
sale 320×252 y el papel llena el resto — recortarla a cuadrado sería elegir qué parte se ve,
y eso es de `UX-05`, no del taller), y **se pide recién al tocar**: quien nunca da vuelta la
tapa no baja un byte.

## 5. La estampa no puede retrasar el dedo, y la forma de garantizarlo es tuya también

`UX-20` §1.3 dice 0 ms hasta que la acción principal es tocable. Con imágenes eso tiene un
modo de falla propio que no existía en el ciclo 11: **cada capa que llega empuja el botón
hacia abajo** si la caja no reservó su lugar. El contrato lo cierra por el lado técnico
(proporción declarada, capas que se sacan solas si fallan, texto y botón pintados en el
mismo cuadro que hoy), pero la consecuencia de diseño es tuya: **la estampa tiene un tamaño
reservado desde el cuadro cero**, y no puede crecer mientras se imprime.

Y el corolario para `prefers-reduced-motion`: con el movimiento apagado, la estampa aparece
terminada. **No dice menos**, porque toda la información —cuál era el tema, de qué disco,
cuántos puntos— ya está en el texto que se pinta antes que la primera tinta.
