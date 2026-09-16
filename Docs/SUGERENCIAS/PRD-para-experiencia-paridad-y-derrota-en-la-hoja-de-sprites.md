# De `producto` para `experiencia` — lo que `US-09` le pide al dibujo antes de cortar sprites

> **Consume:** `US-09`, `BR-23` (paridad), `BR-24` (el fracaso), `BR-25` (nivel listo) —
> `Docs/PRODUCTO/PRD-skayboy-y-poligirl.md`. `D-38`, `D-41`, `D-42`. `RES-64.3`, `RES-64.5`
> (`INV-60`). `public/arte/skayboy_poligirl.png`, medida el 2026-09-16.
> `public/arte/ensayo/README.md`, hallazgo 3.
>
> No edito tu carpeta ni el README de `public/arte/`. Esto son cuatro cosas que `US-09`
> deja pedidas y que se pagan carísimo si se descubren con los sprites ya cortados.

## 1. La hoja no cumple todavía la paridad de `BR-23` punto 2

Medido sobre el archivo: **Skayboy trae una guitarra suelta y dos retratos de perfil;
Poligirl trae un retrato y ningún objeto.** No es acusación de nadie —es una hoja de
concepto, no un atlas—, pero es exactamente la asimetría que `BR-23` existe para cazar, y
si se recorta tal cual queda escrita en el juego. `D-38` baranda 3 y el artículo
`la-negra-poli`, rotulado `hecho`, dicen lo mismo con otras palabras: *un pilar, con el
mismo rango que la voz y la guitarra*.

Lo que `BR-23` pide y se puede chequear mirando el atlas: mismo alto de sprite, misma caja
de colisión, **misma cantidad de cuadros por estado**, y ningún estado que exista para uno
y no para el otro.

## 2. Faltan poses, y una de ellas es la que sostiene `D-40`

La hoja trae quieto (tres variantes), correr, saltar y caer. No trae:

- **el estado visual del personaje en pausa** — el que queda quieto mientras se maneja al
  otro. Sin eso, el camino de uno solo de `D-40` no se puede ni dibujar, y `BR-25` (d) pide
  que se vea que el inactivo está **quieto y a salvo**, no simplemente parado;
- la derrota (ver punto 3);
- ciclo de caminata de varios cuadros y pose de empujar, si el nivel usa cajas
  (`RES-61.5`).

## 3. La derrota es bloqueante, y `BR-24` dice qué no puede ser

`D-42` precisión 2 la dejó **bloqueante antes de animar**. `BR-24` fija el marco desde
producto y el resto es tuyo: sin cuerpo tirado, sin lápida, sin sangre, sin alma que sube,
sin contador de vidas, sin pantalla que haya que despachar con un toque cuarenta veces por
partida (`D-32` límite 3). **El fracaso es del lugar, no de la persona:** el infierno quema
y el cielo no sostiene, y los dos muñecos siguen enteros. El aviso, si existe, va en
registro 3.

## 4. La discrepancia entre el arte y la ficha: Fedora contra Panamá

La hoja rotula *"Sombrero Fedora"*. `RES-64.3` fichó un **Panamá beige**, con fuente y
fecha. No la resuelvo yo porque no es mía, y no es un detalle de estilo: el sombrero es el
rasgo por el que `D-38` dibujaba al personaje, y hoy el dibujo dice una cosa y la ficha del
sitio dice otra. Las salidas son tres y las tres son legítimas: se corrige el dibujo, se
corrige el rótulo del dibujo, o `investigador` rehace la ficha. **Lo único que no puede
pasar es que queden las dos afirmaciones vivas.**

## 5. Dos cosas del ensayo del 2026-09-11 que siguen valiendo con pixel art

- **A tamaño chico las dos figuras no se leen igual de bien** (hallazgo 3): a Skayboy lo
  salvan el sombrero y la guitarra; a Poligirl se le empasta el pelo. `BR-23` punto 3 pide
  volver a medirlo sobre la hoja nueva. `D-41` cambia el idioma, no el problema.
- **El contraste adentro del área de juego no tiene vara corrible** (`D-41` consecuencia 3).
  Sigue siendo tuyo, como lo fue el velo plano de `D-21`.
