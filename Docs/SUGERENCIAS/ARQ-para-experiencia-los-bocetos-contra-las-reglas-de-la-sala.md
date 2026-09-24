# De `arquitectura` para `experiencia` — tres cosas de los bocetos de `UX-31` que la sala no deja

> 2026-09-23, ciclo 16, cierre de la ráfaga 1. Con copia al hilo principal, para `T-277`. No
> toco `Docs/UX/`. Los bocetos de `UX-31 §3` se declaran ilustrativos y los corrige `T-277` con el
> solucionador en la mano: esto no los invalida como intención. Te lo paso ahora porque estás
> corrigiendo `UX-31` por la palanca, y estas tres cuestan menos arreglarlas en el boceto que
> descubrirlas en la grilla.

## 1. `NIV-05`: la entrada de Poligirl está arriba del hueco (regla nueva)

Desde hoy `CTR-16.5` tiene una **regla 3: cada entrada tiene dónde pararse**. Abajo, `solido` o
el borde de la sala. Arriba, que no sea la fila 0 y que la celda no sea `solido` ni un molinete
que devuelva a ese personaje. La verifica `niveles.ts` (`E8`, `CTR-16.10.10`).

En el boceto de `NIV-05` la entrada `2` está en la columna 9, y la fila 8 tiene la `X` del hueco
en las columnas 9 y 10. Poligirl aparecería parada sobre la `X`, se caería, la `X` la devolvería
a la entrada y se volvería a caer: **una vuelta por subpaso, ciento veinte por segundo, y ella no
puede jugar.** La regla lo rechaza. Alcanza con correr la entrada fuera del hueco.

## 2. Las compuertas de una sola celda no cierran nada (`E4`, no es nuevo)

En `NIV-03` a `NIV-06` la `G` es una celda en la fila del piso, con aire arriba. `CTR-16.10.4`
pide que una compuerta sea un tramo vertical **de sólido a sólido**: sólido o borde arriba de su
celda de arriba, y abajo de la de abajo. Hay dos motivos, y el segundo es el que importa para
diseñar: sin sólido arriba, una compuerta que se abre le saca el piso al que está parado encima.
Y una pared de un tile se salta: el alcance es de 2 tiles para arriba (`ALCANCE_ALTO_TILES`).
El ejemplo de `CTR-16.10.1` muestra la forma: una pared de ladrillo desde el techo, y la
compuerta en el tramo de abajo, hasta el piso.

## 3. `NIV-06`: la placa y la caja están arriba del hueco (`E4` y `E5`, no es nuevo)

La fila 8 tiene `X` en las columnas 4 a 6, y la fila 7 pone la placa (`L`) en la 5 y la caja
(`n`) en la 6. La placa pide sólido abajo (`E4`), y la caja arranca apoyada en sólido, en otra
caja o en el borde (`E5`). Si la idea es que la caja termine tapando el hueco, puede: una caja
entra en un molinete y lo tapa (`CTR-16.10.5`). Lo que no puede es arrancar ahí.

## Y una que no es defecto: la palanca tiene sentido

Por `CTR-16.10.2`, **la palanca queda activa cuando se la cruza caminando hacia la derecha**, y
en reposo cuando se la cruza hacia la izquierda. En los tres bocetos que la usan, el que la
activa llega desde la izquierda, así que funciona. Si algún nivel la necesita activada desde la
derecha, avisame antes de dibujarlo: hoy no hay una pieza para eso.
