# Del hilo principal para `experiencia`: ganar no se ve, porque la puerta no tiene dibujo abierto

**Fecha:** 2026-09-24 · **Origen:** `T-278` (ciclo 16), la isla de Skayboy y Poligirl dibuja
con los atlas aprobados. Lo encontró la verificación de la tarea. **No edité `Docs/UX/`,
`Docs/ARQ/` ni el arte**, como corresponde. Con copia a `arquitectura` (punto 3) y a
`contenido` (punto 4).

## Qué pasa hoy

Antes de `T-278`, la isla pintaba la puerta como un marco de tinta plana y **lo rellenaba
cuando el nivel se ganaba** (`fill: mundo.terminado`). Era provisorio, pero se veía.

`T-278` sacó la tinta plana y dibuja todo con los atlas aprobados. **`sala.v1` tiene una sola
puerta por personaje, `puertaSkayboy` y `puertaPoligirl`, y ninguna abierta.** La isla no
inventa un tile ni tiñe el que hay: `UX-27 §9` y `CTR-15.6` lo prohíben, y los dibujos los
aprobó el usuario. Así que:

- cuando los dos llegan a su puerta, el mundo marca `terminado`, el reloj se congela y suena
  el efecto `puerta` **si la cinta está prendida**;
- **en el área no cambia nada.** Con la cinta apagada, ganar no se ve ni se oye.

Lo comprobé en el servidor de desarrollo con el nivel 1: los dos en su puerta, los dos
tesoros juntados, y el área igual que un cuadro antes.

## Qué hace falta decidir (es tuyo)

1. **Cómo se ve ganar.** `UX-29 §8` dice *"Los dos llegan a la puerta y la puerta se abre. Eso
   es todo lo que pasa."* Hoy no pasa ni eso. Se me ocurren tres salidas, sin preferencia:
   - **a.** Una fila más en `sala.txt`: `puertaSkayboyAbierta` y `puertaPoligirlAbierta`. Sale
     como `sala.v2`, vuelve a aprobación y la isla lo toma con cambiar una constante y una
     línea de `tileDe()` en `src/lib/skayboy/escena.ts`.
   - **b.** Un estado de los muñecos al ganar, por ejemplo `enPausa` (de frente = esperando,
     `UX-28 §3`). No hace falta arte nuevo, pero hay que ver si se lee como "llegaron" o como
     "se trabó".
   - **c.** Algo fuera del canvas, en el gabinete o en el aviso del DOM. Eso ya no es del
     atlas, y si lleva palabras es de `contenido`.
2. **Si hay además un aviso para el lector de pantalla.** La vuelta a la entrada tiene
   `PANTALLA.avisoEntrada`; ganar no tiene nada, ni con la cinta prendida.

## 3. Para `arquitectura`: dos papeles que no dicen lo mismo

`CTR-16.4` (`Docs/ARQ/ARQ-schema-niveles.md`, en la enmienda del 2026-09-22) dice *"una puerta
no se abre: se llega"*. `UX-29 §8` dice que *"la puerta se abre"*. Leo que `CTR-16.4` habla de
la mecánica (ningún mecanismo abre una puerta: eso es una compuerta) y `UX-29` de lo que se ve.
Si es así, conviene escribirlo en uno de los dos para que el próximo que lea no crea que
`experiencia` pidió algo que el contrato prohíbe.

## 4. Para `contenido`

La bajada del casete (`CASETE.baja` en `src/lib/skayboy/copy.ts`, `CNT-19`) promete *"las dos
puertas se abren juntas"*. Hoy no se ve que se abran. No toqué el copy: si `experiencia` elige
la **b** o la **c**, puede que la frase tenga que cambiar.

## Mientras tanto

En la isla y en `escena.ts` quedó escrito como hueco, no como decisión: la puerta se dibuja
cerrada siempre y el comentario remite a este traspaso.
