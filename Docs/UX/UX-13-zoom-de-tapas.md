# UX-13 — El zoom de "Adiviná la tapa": qué pedazo de qué tapa se muestra

> Rol dueño: `experiencia`. Consume: `UX-04` (sistema visual), `UX-05` (catálogo de tapas
> en pantalla), `D-19` (la mezcla), `D-21` (la tapa entra confirmada), `BR-01`, `RES-06`,
> `RES-22`, `RES-37`, `RES-44`, y
> `Docs/SUGERENCIAS/HILO-para-experiencia-tapas-sin-titulo.md`.
> Produce: **`UX-13` v1**. Tarea: `T-171` del ciclo 10.
> Última actualización: **2026-09-01**.

---

## Por qué este archivo existe, y por qué no es una fila más de `UX-05`

`UX-05` §5 cataloga **la pantalla "en la cocina"** de `US-04` y dice, textual, que el
crédito y el catálogo del juego jugable *"no lo resuelve esta fila (…) queda para el
`UX-XX` propio del juego 4, todavía sin escribir"*. Este es ese archivo.

**Y llega tarde a propósito de nadie.** El 2026-08-28 el hilo principal convirtió el juego
en un juego de zoom —pedido directo del usuario— y **eligió los diez encuadres sin mí**,
porque frenar el arreglo hubiera dejado el defecto en producción. Lo dejó escrito como
deuda en `Docs/SUGERENCIAS/HILO-para-experiencia-tapas-sin-titulo.md`, con esta frase:

> *"El script dice «Si cambia el catálogo, cambia esta tabla — no al revés» y acá fui al
> revés."*

**Esta ficha adopta los diez encuadres.** No los cambio, y abajo digo por qué cada uno
está bien elegido y qué lo haría estar mal. A partir de acá el orden se restablece: manda
esta tabla, y `scripts/generar-tapas.mjs` la sigue.

---

## 1. El defecto que el zoom mató, y que conviene no volver a montar

Ocho de las diez tapas **imprimen el título del disco en la cara frontal**, y ocho de los
diez ítems mostraban la tapa entera. El juego promete que reconozcas una tapa y se ganaba
**leyendo**. En el álbum doble era doble: las dos caras imprimen los dos títulos, así que
un ítem descartaba dos de las cuatro opciones sin saber nada.

Las únicas dos que no imprimen su título: **Gulp!** —lo manuscrito es *"Patricio Rey y sus
Redonditos de Ricota"*, el nombre de la banda— y **¡Bang! ¡Bang!…**, sin una sola letra.

> ### 🔴 La regla que sale de esto, y es la que hay que sostener
>
> **Ningún encuadre puede contener el título del disco, ni una parte legible de él.**
> No alcanza con que el recorte sea chico: hay que mirar dónde cae. Y no alcanza con
> mirarlo una vez — si mañana cambia un master, cambia el encuadre.
>
> El nombre de la banda **sí puede entrar** (Gulp!), porque está en las diez tapas y no
> distingue una de otra. Lo que no puede entrar es lo que identifica *este* disco.

---

## 2. Lo que escalona es el lado del zoom, no si hay recorte

**Ninguna tapa se muestra entera, en ningún nivel.** Lo que cambia con la dificultad es
cuánto se ve, y eso es lo que hace que `BR-01` escalone de verdad en vez de depender de qué
tapa toque:

| Nivel | Zoom | Del master | Qué se ve |
|---|---|---|---|
| `facil` | 0,40 | ~381 px | un **motivo entero** — la multitud de *Oktubre*, el óvalo de *Luzbelito* |
| `media` | 0,26 | ~248 px | **una parte** de un motivo — el muñeco con antifaz, las caras en la cúpula |
| `dificil` | 0,22 | ~210 px | **un rasgo suelto** — los colmillos, un ojo, la olla |

**Adopto los tres valores como están.** El salto de `facil` a `media` (0,40 → 0,26) es
grande y el de `media` a `dificil` (0,26 → 0,22) es chico, y eso es correcto aunque parezca
desparejo: entre "veo un motivo" y "veo un pedazo de motivo" hay un salto de reconocimiento,
y entre "un pedazo" y "un pedazo más chico" hay un continuo. La escalera tiene que ser
irregular porque la percepción lo es.

> **Esta forma agranda, y es la única del sitio que lo hace.** Un `dificil` sale de 210 px
> y se dibuja a 480: se ve blando. `UX-04` prohíbe agrandar porque ahí la nitidez es todo,
> y **acá la excepción está bien tomada** — en un juego de zoom, el grano es el género, y
> negarse a agrandar habría topeado en silencio cuán fuerte podía ser el recorte. Queda
> declarada como excepción de `UX-04`, no como olvido.

---

## 3. Los diez encuadres

`centro` es dónde cae el cuadrado, en fracciones del master (`[x, y]` desde arriba a la
izquierda). Mirados uno por uno contra el master: **ninguno toca el título.**

| Ítem | Nivel | Master | Centro | Qué cae adentro | Por qué ahí |
|---|---|---|---|---|---|
| `gulp` | facil | `gulp-frontal.jpg` | `[0.42, 0.33]` | el manuscrito verde «Patricio Rey» | Es la única tapa cuyo manuscrito **no** es el título, así que la letra puede entrar sin regalar nada — y la caligrafía verde de Rocambole es lo más reconocible del disco |
| `oktubre` | facil | `oktubre-frontal.jpg` | `[0.50, 0.83]` | la multitud de caras grises y las banderas | El título rojo está **arriba**; el centro bajo (0,83) lo deja afuera por construcción. La multitud es el motivo del disco |
| `luzbelito` | facil | `luzbelito-frontal.jpg` | `[0.50, 0.52]` | el óvalo dorado con el busto | Centro geométrico: el óvalo ocupa el medio y el título corre por los bordes |
| `un-baion-para-el-ojo-idiota` | media | `un-baion-…-frontal.jpg` | `[0.72, 0.35]` | el muñeco con antifaz y chupete | Cuadrante superior derecho, lejos del título; el muñeco es una figura entera pero no dice de qué disco es |
| `bang-bang-estas-liquidado` | media | `bang-bang-…-frontal.jpg` | `[0.80, 0.33]` | la cara bajo el sombrero ocre | Esta tapa no tiene texto, así que el centro se eligió por composición, no por evasión |
| `ultimo-bondi-a-finisterre` | media | `ultimo-bondi-…-frontal.jpg` | `[0.50, 0.50]` | las caras de superhéroe en la cúpula | Centro exacto: el título va abajo y la cúpula domina el medio |
| `lobo-suelto` | dificil | `lobo-suelto-…-cd1-frontal.jpg` | `[0.53, 0.47]` | los dos colmillos y el hocico partido | Un rasgo suelto de la cara del lobo. **Clave en el álbum doble:** el encuadre no puede dejar ver ninguno de los dos títulos, o el ítem descarta dos opciones |
| `cordero-atado` | dificil | `lobo-suelto-…-cd2-frontal.jpg` | `[0.68, 0.28]` | el ojo verde entre las plumas azules | Ídem, del otro volumen, y deliberadamente de otra zona para que los dos ítems del doble no se parezcan |
| `momo-sampler` | dificil | `momo-sampler-frontal.jpg` | `[0.57, 0.48]` | la cara de piedra del medallón | El medallón es el motivo y está centrado; el título corre por el borde |
| `la-mosca-y-la-sopa` | dificil | `la-mosca-y-la-sopa-trasera.jpg` | `[0.79, 0.50]` | la olla con el cucharón | **Sale de la trasera y no del frontal**, y no es un capricho: `RES-44` audita el frontal como rediseño con foto de recital, **no arte de Rocambole**. Recortar de ahí le firmaría un trabajo que no es suyo. La trasera trae el collage real. Ojo: esa cara tiene el título dos veces en el lomo y la lista de temas arriba — el centro cae sobre la olla, que es la misma pieza que `UX-05` ya había elegido para este disco en tres superficies |

**Un detalle que no es casual y conviene que se sostenga:** la olla de *La mosca y la sopa*
es el mismo recorte que `UX-05` usa en el casete del portal, en la categoría `letras` del
quiz y en la pantalla de "Completá la letra". Cuatro superficies, una pieza. Eso es
coherencia de marca, no ahorro de trabajo.

---

## 4. Lo que este catálogo NO decide

- **Qué pasa al revelar.** El premio del formato splash es ver la obra entera después de
  adivinar por un pedazo, y hoy no se puede: `aPayload` manda una sola ruta. **Es la pieza
  que falta y es mía junto con `arquitectura`** — cuando exista, esta tabla no cambia: se
  le agrega la ruta del entero al lado de la del zoom.
- **La regla del contrato** que ata `estado: "listo"` a `encuadre: "detalle"`. Es de
  `arquitectura` (`T-172`).
- **Las explicaciones de los ítems.** Dos de ellas hablan del alfabeto del título, que el
  zoom sacó de pantalla. Es de `contenido` (`T-173`).

## 5. Verificación

```
node --test src/lib/tapa/encuadre.test.ts
node scripts/generar-tapas.mjs
```

**Y una que no la hace una máquina:** el día que cambie un master, hay que volver a mirar
los diez recortes contra la imagen nueva. Un centro en fracciones sigue siendo válido
numéricamente aunque la imagen debajo haya cambiado — y ahí volvería el título a pantalla
sin que ningún test se queje.
