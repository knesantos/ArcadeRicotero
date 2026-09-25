# Del hilo principal para `experiencia`: la puerta abierta queda detrás del muñeco

> 2026-09-24, ciclo 16, ráfaga 4, al cerrar `T-290` (`UX-32`). No pide nada para esta ráfaga:
> es un dato medido para `T-297`/`T-302` (la victoria bailada de `UX-33`) y para quien revise
> `UX-32 §7` punto 1.

## Lo que se midió

`sala.v2` tiene `puertaAbierta` (una sola para las dos, porque la insignia estaba calada en la
hoja y sin hoja los dos dibujos serían iguales; lo cuenta `sala.test.ts`), y `escena.ts` la
dibuja en las dos puertas en el mismo cuadro en que `mundo.terminado` pasa a verdadero. Eso
anda, y `escena.test.ts` lo juega sobre la traza grabada del nivel 1.

**Lo que no se ve en la prueba a máquina y sí se ve en el cuadro:** el muñeco se dibuja
encima de la puerta, mide 16 × 24 y la puerta 16 × 16. El que llega primero se queda parado
justo sobre su puerta (en `NIV-01`, Skayboy en `x = 16`, alineado con el tile), así que su
puerta queda tapada casi entera **antes y después** de ganar. El cambio de esa puerta se lee
solo en tres o cuatro píxeles: el hueco entre el brazo y el marco, y el que queda entre las
piernas. En la del que llega último, que suele quedar corrido unos píxeles, el cambio se ve
bien: la hoja negra desaparece y queda el marco.

**Dicho sin rodeos: hoy "ganar se ve" descansa en una sola puerta**, la del que llega último,
en los seis niveles. Y ni esa está garantizada. El mundo se congela en el primer subpaso en que
el centro del cuerpo entra a la columna de la puerta (`estaEnSuPuerta`, `mundo.ts`); si el
último llega **caminando**, entra por un costado y queda corrido unos 8 px, y la puerta asoma.
Si llega **de un salto** y cae con el centro ya alineado con la columna, puede tapar su puerta
igual que el primero, y entonces al ganar lo único que cambia a la vista es la pose — que
`UX-32 §3` ya declaró ambigua ("esperando" contra "llegamos"). Ese caso no lo reproduje con un
nivel sembrado: es plausible por cómo está escrito el congelado, no medido. Lo encontró la
verificación de `T-290`.

Cómo reproducirlo: el script `t290c/antes-y-gana.mjs`, que quedó **fuera del repo**, en el
scratchpad de la sesión de `T-290` (se corre desde la raíz con
`node --experimental-strip-types <script> src/arte/pixel <salida>`), pinta el cuadro anterior a ganar y el que
gana, nivel por nivel, con la escena de verdad. Las imágenes salieron en
`scratchpad/t290c/escena/NIV-0N-antes-y-gana.png`.

## Por qué no lo resolví acá

`UX-32 §2.2` fija que la abierta es la misma silueta que la cerrada con el tapón sacado, y que
las cerradas no se tocan. Dentro de eso, `puertaAbierta` ya saca todo lo que se puede sacar:
queda el marco solo. Lo que tapa la puerta es el muñeco, no el dibujo, y mover dónde se para
el muñeco o dibujar la puerta encima de él son decisiones de diseño, no de píxel.

## Lo que queda para decidir

1. Si alcanza con que se lea en una puerta y apenas en la otra, porque la victoria de
   `UX-33 §2` suma el baile y el baile ya dice "llegamos". Ojo: con el caso del salto, "una
   puerta" puede ser ninguna.
2. Si no alcanza, dos salidas, y la elección es de `experiencia` en `T-297`/`T-302`:
   - **el marco abierto se dibuja por encima del muñeco** en el cuadro que gana (es un cambio
     del orden de los trazos en `escena.ts`, barato; el costo es de lectura: el marco cruza al
     muñeco);
   - **o el baile lo corre**: que la coreografía de `UX-33 §2.2` saque a cada uno del centro de
     su puerta en los primeros cuadros.
   Que la puerta se lea por algo que sobresalga del muñeco no se puede: arriba de la cabeza no
   hay lugar, el muñeco es más alto que el tile.

## Una lectura de `UX-32 §2.2` que conviene que confirmes

`§2.2` describe la abierta como *"la misma silueta con el dintel retirado"*, con aire *"hasta el
borde del tile"*, como si el tapón estuviera arriba. En las cerradas que ya existen el arco de
arriba (renglones 0 a 2) es **contorno**: es lo que hace que se lean puerta y no sólido, y
`UX-27 §5.2` pide contorno de clave en las dos formas. El tapón es la **hoja**, que baja hasta el
piso. Así que `puertaAbierta` conserva el arco entero y saca la hoja: el aire llega hasta el
borde de **abajo** del tile, no el de arriba. Se lee abierta por forma (el marco vacío), pero no
es la letra de `§2.2`. Si querías otra cosa, se redibuja en un tile; `sala.test.ts` hoy obliga a
esta lectura (la clave de la abierta es exactamente el marco de las cerradas).
