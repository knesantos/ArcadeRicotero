# Pulida de los juegos: "Sacalo por la letra", ronda 1

> Propuesta del constructor de la ronda (2026-11-18). Es el juego 3 de la pulida; sigue a
> `pulida-juegos-jugo-y-casete.md`, `-ronda-2-sonido-y-entero.md`, `-ronda-3-cierre.md` y
> `-dos-ejes.md`. Nada de esto está decidido: son cosas hechas en la rama `pulida/juegos-ui`
> que necesitan el visto de su dueño.

## 1. Una regla que el encargo pisaba: el disco de este juego

El encargo decía que este juego viste *La mosca y la sopa* (la mezcla de `D-19` para "letras").
**No es así, y no lo cambié:** `UX-08` §1 le asignó *Momo Sampler* a propósito, para que no se
lea igual que "Completá la letra", y `contraste.test.ts` mide ese par ("boton primario de
por-la-letra"). El botón "Jugá" que se veía celeste lavado es la plata medida de esa tapa
(`--disco-momo-sampler-tinta`). Lo que hice fue darle forma de chapa —un filete del fondo por
adentro, dos anillos pegados— sin tocar la tinta. Si se quiere otro disco, es decisión de
`experiencia` y cambia `UX-08`.

## 2. Lo que cambió y conviene dejar escrito

1. **La hoja es un papel doblado, y cada escalón abre un doblez.** La escalera de `BR-20`
   (1, 2, 4, 8 versos) es lo que hace un papel doblado en tres cuando se abre: cada doblez
   duplica lo que se ve. Abajo asoma el canto de los dobleces que quedan, uno por intento sin
   gastar. **La cantidad de letra a la vista no cambió**: son los mismos versos, en los mismos
   escalones (`CTR-09.3`), y el papel de la portada trae un garabato impreso, no letra.
2. **Los chips salieron.** El intento gastado se anota en el papel, sobre el quiebre que abrió:
   lo arriesgado, con la cruz y un tachón de lápiz en el rojo del error; lo pasado, con el
   punto. Cambia `UX-08` §3 (los chips) y saca tres clases de `ESTADOS_LETRA`
   (`.chip--fallado`, `.chip--pasado`, `.chip--ultimo`) por `.nota--*`.
3. **La banda del medio es el bolsillo.** El lugar del juego (`CNT-13`: "un papel arrugado te
   pesa en el bolsillo") ahora se ve: el bolsillo de atrás del jean, con la sarga y el pespunte
   impresos como máscaras (`scripts/imprimir-papel-por-la-letra.mjs`, `public/arte/por-la-letra/`,
   unos 130 KiB en total). Tintas: `--borde` para la sarga, el peltre de *Momo Sampler* para el hilo.
4. **El rótulo de los versos es una etiqueta con fondo liso**, para que su letra siga sobre
   `--fondo` (el par medido) y no sobre la sarga.
5. **La letra se escribe.** Cada palabra del verso es un `span` y entra un instante después que
   la anterior. Entre palabra y palabra hay nodos de texto, así que se lee y se copia igual.
   Conviene que alguien lo pase por un lector de pantalla de verdad: yo no lo hice.
6. **Hay ruidos**, los mismos cuatro de `efectos.ts`: tecla al elegir y al pasar, golpe al
   errar, sello al acertar. Este juego no tiene música, así que nunca van encima de nada. El
   interruptor está en la portada, debajo de "Jugá".
7. **Textos nuevos para `contenido`** (`src/lib/por-la-letra/copy.ts`): la hazaña
   "¡Con un renglón!" (sacarlo con el primer verso; es un segundo grito, como "¡Con una
   décima!"), "N al hilo", "Llevás N puntos", y el sello "N de N" del resultado.
8. **El buscador es el de papel del hermano**: la ficha elegida se pega con cinta y la ayuda se
   va al escribir. No toqué su CSS compartido.
9. **`scripts/mirar-juego.mjs`** tiene el recorrido de este juego y esconde la barra de
   herramientas de `astro dev`, que flotaba sobre la zona del pulgar y se comía los toques.

## 3. Detalles vivos de esta ronda

| Detalle | Estado al que está atado | Con movimiento reducido |
|---|---|---|
| El papel de la portada viaja a su lugar en la partida | "Jugá" | no viaja |
| El verso se escribe palabra por palabra | abrir un tema o un doblez | aparece escrito |
| El doblez gira desde el quiebre hasta quedar plano | gastar un intento | aparece abierto |
| El papel se sacude y el tachón pasa sobre lo arriesgado | error | quieto, tachado |
| Lo que vale se vuelve a estampar | gastar un intento | cambia de una |
| El sello redondo cae en la esquina del papel | cerrar el tema | puesto |
| "+N" vuela del sello a la cuenta de la cabecera | acierto | la cuenta cambia de una |
| El papel del tema nuevo sube del bolsillo | "Seguí" | puesto |
| El sello de la vuelta, la cifra que cuenta y los temas que se pegan | resultado | todo puesto |

## 4. Lo que queda abierto

- La hoja va girada 1,1° siendo el contenedor de desplazamiento. `UX-08` §4 lo había evitado.
  No vi problemas, pero no lo probé con el dedo en un teléfono de verdad.
- Con el teclado abierto, mientras dura el golpe de un error queda un hueco entre el papel y el
  canto de los dobleces (es el doblez nuevo, todavía de canto). Se ve en la tira del error.
- Cuadros con la CPU ×4 (430 × 860, control en la misma tanda: 16,7 ms): pasar, errar y acertar
  dan p95 de 16,8, 16,9 y 33,4 ms. Cada toque deja **un** cuadro largo (200, 133 y 267 ms), que es
  el de armar el DOM, no la animación; el del acierto es el más caro porque arma la estampa.
- En la mesa (1280), el papel de la portada queda medio metido detrás de la chapa de puntajes.
- Con ocho versos, al acertar la pantalla baja hasta "Seguí" y el sello del papel queda arriba,
  fuera de la vista.
