# UX-37 — El menú, la tarjeta y el pulgar: lo que `D-61` le suma a Skayboy y Poligirl

> Rol dueño: `experiencia`. 2026-10-04 (`D-61`).
>
> **De dónde sale.** `D-61`, pedido directo del usuario: menú para jugar y ver qué niveles hay,
> paso entre niveles, la jugabilidad de las teclas en el celular, y un botón de pantalla completa
> que se encuentre. El traspaso del hilo principal
> (`Docs/SUGERENCIAS/HILO-para-todos-skayboy-menu-y-mando.md`) dice qué se construye; **este
> documento es el flujo y las medidas que esa construcción tiene que cumplir, y la lista de lo
> que enmienda.** Se escribe mientras el código se arma en paralelo: lo que acá es *cuenta* no se
> midió en un navegador, y va marcado.
>
> **Consume:** `D-61` entera; `D-14` (molinetes abiertos), `D-17` (voseo), `D-32` límite 3 (0 ms
> hasta que la acción principal es tocable), `D-33` (el grito es de la tapa), `D-41` punto 4 (los
> dos idiomas no se mezclan en la misma pieza), `D-42` y `BR-26` (el pie), `D-47`, `D-53`, `D-55`
> (con mouse no hay botones), `D-54`; `US-09` criterios 1, 2, 3, 6, 7 y 9; `BR-24` (nada de vidas,
> muerte, perder, puntaje, rango, tiempo), `BR-27` (qué se comparte), `BR-31` (nada que narre un
> logro compartido); `CNT-21` (los seis nombres), `CNT-22` §1; `ADR-08.2` punto 4 (nada se
> dibuja en el canvas), `ADR-10.5` (todo lo que se ve en el modo vive adentro del contenedor),
> `CTR-16.11.2` (dónde se retoma); `UX-27` §1.2, §5.1, §9; `UX-28` §1, §2.1, §2.2; `UX-29` (el
> fracaso devuelve a la entrada); `UX-30` (el disco es *Gulp!*); `UX-32` §4 y §5; `UX-33` entera;
> `.claude/rules/diseno-marca.md`, `.claude/rules/voz-ricotera.md`. Leído también, para no
> inventar sobre el aire: `src/data/skayboy.json` (los seis niveles), `src/lib/skayboy/dedos.ts`,
> `menu.ts` y `escena.ts` (`cajaDeEtiqueta()`, `ubicarEtiquetas()`), `src/styles/skayboy.css`
> (el sello de pantalla completa y el modo) y `src/lib/skayboy/copy.ts`.
>
> **Resuelve:** el menú de entrada y de pausa (`§3`), la tarjeta de fin de nivel (`§4`), el
> rótulo de entrada de nivel (`§5`), el pulgar que rueda con arrastre de dirección (`§6`), la
> pantalla completa en cualquier posición (`§7`); las enmiendas a `UX-27`, `UX-28`, `UX-32` y
> `UX-33` (`§8`) y los desvíos de
> `Docs/SUGERENCIAS/HILO-para-experiencia-pantalla-completa.md` (`§9`).
>
> **No resuelve:** las palabras (`CNT-40`, reservado, todavía sin escribir: lo que el traspaso
> pone como borrador es del hilo y lo que mande `contenido` es lo que queda); el CSS (es del hilo
> principal); `BR-40`, `ADR-10.5` y `CTR-16.11.2` (de `producto` y `arquitectura`); el lienzo
> (hoja nueva para el menú y la tarjeta: tarea del usuario, igual que `T-319`); la pieza
> compartible del sexto nivel (`BR-27`).
>
> **Una sola cosa de `D-61` que este documento cambia y no solo documenta: la tarjeta de fin de
> nivel va arriba del área, no abajo (`§4.3`).** El motivo está medido en los seis niveles y es
> que abajo es donde bailan.

---

## 1. El recorrido, de punta a punta

1. **Se abre el enlace.** Aparece el menú de entrada, con el nivel que corresponde ya armado
   detrás (`CTR-16.11.2`: el primero sin pasar, o el primero de la fila si están los seis).
2. **Un toque: el botón grande.** El menú se va en un cuadro, sin transición. Aparece el rótulo
   de entrada (número y nombre del nivel) sobre el aire del área, un par de segundos. Se juega.
3. **Se gana.** En el mismo cuadro en que las dos puertas se abren y los dos bailan
   (`UX-33` §2) aparece la tarjeta, arriba del área. **Un toque** —en el botón principal de la
   tarjeta o en cualquier parte del área— carga el nivel siguiente, y vuelve el paso 2.
4. **Se falla.** El terreno rechaza y el personaje vuelve a la entrada del mismo nivel
   (`UX-29`). **No hay rótulo, ni tarjeta, ni menú**: el fracaso no se narra (`BR-24`).
5. **Se quiere otra cosa.** El sello `MENÚ` abre el mismo menú con la partida en pausa: seguir,
   empezar el nivel de nuevo, o elegir cualquiera de los seis.
6. **Se gana el sexto.** La misma tarjeta, que dice que era el último y ofrece volver al primero.

**Cuánto dura**, leído en voz alta como el jugador: abrir el enlace, `Jugá` (un toque), un nivel
(menos de un minuto la primera vez que sale bien, `UX-28` §6), un toque en la tarjeta. Una sesión
de dos o tres minutos son dos o tres niveles con un toque entre cada uno y ninguna pantalla que
haya que esperar. **Lo que `D-61` le cuesta a la primera sesión es un toque** —el de `Jugá`—
antes del primer cuadro. No es un muro (no pregunta nada, no pide nada), pero es el punto de este
recorrido más cercano a uno, y por eso el `§10.2` lo tiene como checklist.

---

## 2. Lo que vale para las tres capas

Menú, tarjeta y rótulo comparten cinco reglas. Están acá y no repetidas en cada sección.

### 2.1 Texto encima del área, sobre su propia tinta

`UX-27` §5.1 decía *"Adentro del área no hay texto. Ninguno."* y era la mitad del mecanismo de
contraste: sin texto sobre el tileset, no hay contraste de texto que medir. `D-61` pide tres capas
de texto que se ven encima del tubo, y el contador de la victoria (`UX-33` §2.5) ya vivía así sin
que `§5.1` lo dijera. La regla nueva, en una frase:

> **El texto no se dibuja en el área: se apoya encima, sobre su propia tinta.**

Cinco condiciones, y las cinco se cumplen o la capa no entra:

1. **Es HTML.** Nunca píxeles del canvas (`ADR-08.2` punto 4), nunca una fuente de píxel, nunca
   un borde pixelado: cada pieza queda de un lado de la frontera de `D-41` punto 4. Estas son
   imprenta, y el tubo sigue siendo píxel.
2. **Lleva su propio fondo, plano y opaco.** `--fondo` sin alfa, con borde de `--papel`. El
   texto no toca un píxel del tileset, así que **no hay un contraste nuevo que medir**: los pares
   son los que `contraste.test.ts` ya tiene (`--texto` y `--papel` sobre `--fondo`, `--fondo`
   sobre `--papel`, `--disco-gulp-tinta` sobre `--fondo`, que ya figura como "Gulp! sobre
   fondo"). Lo "medio transparente" de `D-47` es de los mandos y solo ahí.
3. **Ocupa una región acotada que no cubre lo que hay que mirar** (`§3.3`, `§4.3`, `§5.2`).
4. **No pisa un blanco ajeno.** Ningún blanco táctil se superpone con otro (`§2.2`).
5. **No se mueve.** Aparece en un cuadro y se va en un cuadro (`D-32`). No hay entrada, no hay
   fundido, no hay nada que el movimiento reducido tenga que apagar.

Lo que **sigue prohibido** adentro del área, sin tocar (`UX-27` §9): barra de vida, marcador,
reloj, nombre de personaje, texto sobre el tileset, y cualquier texto durante la partida **salvo
el rótulo de entrada de `§5`**, que dura un par de segundos y está sobre su propia tinta.
Consecuencia que conviene saber: **durante la partida no hay un nombre de nivel a la vista**.
Para saber en cuál se está, se abre el menú y se mira cuál ficha dice `ACÁ ESTÁS`.

### 2.2 Zona de pulgar: las medidas

`--toque-min` es 48 px y no se achica nunca (`US-09` criterio 6, `RES-65.6`). Todo lo que se toca
en estas tres capas lo respeta, y **ningún blanco se superpone con otro**: dos blancos de 48 que
se pisan son un toque equivocado esperando.

| Pieza | Blanco mínimo (px CSS) | Aire entre blancos | Nota |
|---|---|---|---|
| Botón grande del menú | **56** de alto × todo el ancho de su columna (≥ 112) | 8 | `--toque-min` + 8: es lo que el que llega sin idea tiene que encontrar |
| Ficha de nivel | **48** de alto × ≥ 104 de ancho | 8 | la ficha entera es el blanco, no el número |
| Botones chicos del menú (empezar de nuevo, pantalla completa) | **48** × ≥ 96 | 8 | |
| Botones de la tarjeta | **48** de alto × ≥ 56 | 8 | |
| Sello `MENÚ` y sello de pantalla completa, en el mueble | **48 × 48**; la estampa visible mide 26 | — | el blanco es transparente (`UX-33` §1.2, `§9.2`) |
| Esos mismos sellos, en el modo | **48 × 48**, estampa entera | — | |
| Rótulo de entrada | **ninguno** | — | no toma toques |
| Teclas (sin cambios) | 52 × 64 y 112 × 244 | 8 y 16 | el salto cede hasta `--toque-min` en ventanas bajas (`§9.4`) |

**Dónde cae cada dedo.** Con el teléfono de costado los pulgares descansan abajo, en las dos
esquinas: son los mandos. El menú, la tarjeta y los sellos son **decisiones, no timing**: viven
arriba o en el medio, a donde llega el dedo de la mano libre o el pulgar estirado, y se tocan una
vez. La única acción que tiene que ser rápida con el pulgar —seguir— **conserva el toque invisible
sobre toda el área** (`UX-32` §5): el pulgar no viaja.

**Nada de esto agrega medidas de marca.** Todo sale de `--toque-min`, `--espacio-1` y
`--espacio-2`, `--registro` y de las medidas del mueble que `skayboy.css` ya declara (`--bisel`,
`--chapa-pie-alto`). Si el hilo necesita una nueva, es una propuesta antes de ser un valor.

### 2.3 El pie de homenaje: ninguna de las tres capas lo toca

> **Nada del menú, de la tarjeta, del rótulo ni de los dos sellos tapa un solo píxel de la
> chapa del pie, la desplaza, o la deja fuera de la ventana** (`BR-26`, `D-42` precisión 1,
> `US-09` criterio 7: se ve sin tocar nada).

Vale en **todos los estados**: menú en entrada, en pausa y en ganado; tarjeta compacta y completa;
rótulo; modo de pantalla completa de costado y parado, con y sin el menú abierto.

Cómo se cumple por construcción, para que no dependa de que alguien se acuerde:

- **Ninguna capa se ancla a todo `.fichin` con `inset: 0`** cuando `.fichin` es el mueble: el pie
  vive adentro del mueble, y un panel de `inset: 0` lo cubre. Cada capa tiene su región:
  el menú, la `R` de `§3.3`; la tarjeta y el rótulo, la banda de arriba del tubo.
- **En el modo, `.fichin` es la ventana** y la grilla tiene dos filas, `sala` y `pie`
  (`skayboy.css`, el bloque "La pantalla completa"). La región de las tres capas es la fila
  `sala`. La fila `pie` no se ofrece como lugar de nada.
- **La verificación es geométrica** (`§10.1`): el rectángulo de `.chapa-pie` no se cruza con el
  de ninguna capa ni con el de ninguno de los dos sellos, en los estados de arriba.

### 2.4 El idioma visual: lo que se ve y lo que no

El disco de este juego es *Gulp!* (`UX-30`, `D-19`): `--disco-gulp-tinta` (rojo, `#df5744`) y
`--disco-gulp-apoyo` (crema, `#e6e4bd`). La base no rota: `--fondo`, grano, `--toque-min`, AA.

| Pieza | Cómo se resuelve |
|---|---|
| **Panel del menú, tarjeta y rótulo** | Recorte pegado: fondo `--fondo` plano y opaco, **borde grueso** de `--papel` (3 px el panel y la tarjeta, 2 px el rótulo), esquina de 3 px. **Sin sombra** (cae afuera de la región), **sin rotación** (están adentro de un tubo derecho, `UX-27` §1.2 punto 2), sin cinta |
| **Fichas y botones** | Sello de goma: rectángulo de 3 px de esquina, borde de 2 px de `--papel`. Número y sellos en `--fuente-rotulada`, mayúsculas; **el nombre del nivel en `--fuente`**, tal como viene de `CNT-21`, porque es lo único largo de la ficha. Tocado: tinta invertida (relleno `--papel`, letra `--fondo`), sin levantar ni inflar |
| **Botón grande** | Relleno `--papel`, letra `--fondo`, borde de 3 px `--disco-gulp-tinta`. **No va relleno de rojo**: `#df5744` es pariente del rojo de error `--acento-4` (`UX-27` §4) y un botón principal rojo se lee como peligro |
| **`PASADO` y `ACÁ ESTÁS`** | Sello de goma de borde fino en `--disco-gulp-apoyo`, letra `--texto`, apenas torcido (±1°). `ACÁ ESTÁS` suma el borde de la ficha a 4 px. **Nunca verde, nunca ✔**: no es un acierto (`D-33`), y el ✔ es de las opciones del quiz |
| **Foco del teclado** | `outline` de `--bisel` (4 px) en `--disco-gulp-tinta`, sin desplazamiento: la misma tinta que ya usa `.seguir-juego:focus-visible` |

**Los tics vetados que esta zona tienta** (tabla de `diseno-marca.md`): la **barra de acento al
borde izquierdo** en la ficha pasada ("pasado = raya verde") es el caso que motivó la regla;
la pastilla cápsula como chip de estado; la tarjeta gris "elevada" con sombra difusa; el degradado
o el desenfoque detrás del menú ("para que se vea el juego atrás"); el hover que levanta; el
emoji o el ícono de librería, y **cualquier candado**: los seis están abiertos y ninguna ficha se
ve apagada, gris o con un sello de "bloqueado".

### 2.5 Los registros y la regla de las dos líneas

Cada pantalla tiene una línea que **nombra** y otra que **canta** (`voz-ricotera.md` §5):

| Pantalla | Nombra (registro 3) | Canta (registro 1) |
|---|---|---|
| Menú | `Los niveles`, `Nivel 3`, `PASADO`, el botón | el nombre de cada nivel (`CNT-21`) |
| Tarjeta | `NIVEL 2 DE 6 · PASADO` | el nombre del que sigue |
| Rótulo | `NIVEL 2 DE 6` | el nombre del nivel |

La prueba de tapar la que canta: tapando el nombre del nivel, el que llegó por un enlace sigue
sabiendo que esto es el nivel 3 de 6 y qué botón tocar. **Los sellos, los avisos y los botones
sin imagen** van en registro 3; los botones en voseo (`D-17`), con tilde donde la lleven, y por
eso en `--fuente-rotulada` (la deuda de acentos de `diseno-marca.md`). Los textos exactos son de
`CNT-40`; acá se fija dónde va cada uno, no qué dice.

---

## 3. El menú

> **Historia que resuelve:** `US-09` criterio 3 (enmendado por `D-61`/`BR-40`: el menú de entrada
> no pregunta nada) y criterio 9 (los seis abiertos, la fila manda dónde se retoma).

### 3.1 Qué es, y en qué momentos se abre

Un panel sobre el tubo que deja ver los seis niveles y juega uno con un toque. Es el mismo panel
en tres momentos, y lo único que cambia entre ellos es el botón grande:

| Momento | Cuándo | Botón grande | Renglón de abajo | Lo demás |
|---|---|---|---|---|
| `entrada` | La página recién abrió; el reloj del mundo está en cero | `Jugá` (`MENU.jugar`): el nivel armado | `Nivel 3: <nombre>` (`MENU.cualToca`) | ninguna ficha lleva `ACÁ ESTÁS` |
| `pausa` | Se abrió con el sello `MENÚ` en medio de la partida; el mundo no avanza | `Seguí jugando` (`MENU.seguirJugando`): sigue donde estaba | el nombre del nivel que se sigue | aparece `Empezá el nivel de nuevo` (`MENU.repetir`); la ficha del nivel en curso lleva `ACÁ ESTÁS` y **tocarla es seguir** |
| `ganado` | Se abrió desde `Elegí otro` en la tarjeta | juega **el que sigue** (en el sexto, el primero) | el nombre de ese nivel | `ACÁ ESTÁS` no aparece: no hay partida en curso; la ficha recién pasada lleva `PASADO` |

**Las fichas.** Siempre seis, en el orden de la fila, **todas tocables** (el candado de orden de
`US-09` criterio 9 se fue con `D-61` punto 2: era "saber lo suficiente" con forma de nivel,
`D-14`). Cada una lleva su número (`MENU.numero`), su nombre y, si está en `avance.pasados`,
`PASADO`. Lo que ganó otra pestaña cuenta si la isla vuelve a leer el avance al abrir el menú.
**Un solo sello por ficha, y manda `ACÁ ESTÁS` sobre `PASADO`**: la ficha del nivel que se está
jugando de nuevo dice dónde estás, y su `aria-label` (`MENU.etiqueta`) nombra un solo estado.

**Tocar una ficha** (distinta de la de `ACÁ ESTÁS`) arma ese nivel de cero, cierra el menú, dispara
el rótulo de `§5` y se juega: **un toque, sin confirmación**. Descarta la partida en curso sin
preguntar, y no cuesta nada: no hay vidas, ni puntaje, ni costo acumulado (`BR-24`); el avance
guardado no se toca.

### 3.2 Lo que el menú no tiene, y no va a tener

- **Nada que pregunte con cuántas personas se juega.** `UX-28` §1 sigue entera en lo que importa:
  no hay modo que elegir. El menú abre sobre un botón que dice `Jugá`.
- Nada que pida nombre, cuenta, edad, ni permiso. Nada de instrucciones de cómo se juega: el
  nivel 1 es todo el tutorial que este juego tiene (`US-09`, `FIND-59`).
- Sin candados, sin fichas apagadas, sin puntaje, sin tiempo, sin rango ni "mejor marca" por nivel
  (`BR-24`, `BR-27` punto 2).
- Sin compartir: la pieza de `BR-27` no existe todavía y el menú no promete lo que no hay.
- Sin sonido y sin movimiento: aparece y se va en un cuadro.

### 3.3 La región, el tamaño y lo que pasa cuando no entra

> **El panel cubre el tubo y, si hay columnas de mando a los costados, esas columnas. Nunca la
> chapa del pie, la cabecera con "Volver al arcade", ni los dos sellos del mueble.**

Es la región `R`: de borde a borde de las dos columnas de mando y de la parte de arriba a la de
abajo del tubo con su bisel. En el apilado de vertical, donde los mandos van debajo, `R` es el
tubo solo. En el modo, `R` es la fila `sala` entera. Mientras el menú está abierto, **los mandos y
`#seguir-juego` quedan `inert`**: no reciben toques ni foco, y el mundo no corre.

*Cuenta, sin medir* (px CSS; interior = región menos 3 de borde y 4 de relleno por lado):

| Dónde | `R` | Interior | Entra todo en `entrada`? | Entra todo en `pausa`? |
|---|---|---|---|---|
| Mueble, horizontal ×1 | 480 × 152 | 480 × 138 | Sí, en dos columnas | **No: faltan ~44.** Scrollea la columna de acciones |
| Mueble, horizontal ×2 | 720 × 296 | 720 × 282 | Sí | Sí |
| Mueble, vertical (×1, apilado) | 256 × 152 | 256 × 138 | **No** (~312 de contenido). Scrollea | **No** |
| Modo, costado | la sala (≥ 568 × 296) | ≥ 568 × 282 | Sí | Sí |
| Modo, parado | la sala (≥ 375 × 600) | ≥ 361 × 586 | Sí | Sí |

**Dos composiciones**, según la forma de `R`:

- **Ancha y baja** (ancho de `R` ≥ 440): **dos columnas.** A la izquierda las acciones, en este
  orden: botón grande (56), renglón (14), `Empezá el nivel de nuevo` si hay pausa (48), pantalla
  completa (48). A la derecha, `Los niveles` (14) y **las seis fichas en 3 × 2** (48 + 8 + 48 =
  104). La cuenta de la izquierda en `entrada` a ×1 es 56 + 14 + 8 + 48 = 126, y entra en 138.
- **Angosta o alta**: **una columna apilada**, mismo orden de arriba abajo, con las fichas en
  2 × 3 (160).

**Cuando no entra, scrollea por dentro, y no se achica nada**: ni una ficha ni un botón baja de
`--toque-min`. El panel lleva `overscroll-behavior: contain` y `touch-action: pan-y` para que el
gesto no arrastre la página (el defecto que motivó `D-47`). El **orden del contenido es el orden de
importancia**: botón grande, renglón, fichas, empezar de nuevo, pantalla completa. Lo que queda
fuera de la vista sin scrollear es lo que menos se usa. La última ficha visible va **cortada a
mitad**: es la señal de que hay más, sin ícono ni flecha.

**Medir antes de dar por bueno** (`§10.1`): los dos casos con scroll son el que el hilo más
probablemente va a ver en el teléfono, porque el vertical es como se entra desde un enlace.

*Alternativa descartada:* partir el menú en dos paneles, el botón grande en el tubo y la lista en
la zona de mando de abajo (en vertical es una zona libre y es donde descansan los pulgares). Gana
unos 100 px de alto en un solo caso a cambio de dos regiones que mantener en sincronía y de un
panel que salta por encima de la chapa del pie.

### 3.4 El sello `MENÚ`

La misma pieza que el sello de pantalla completa (`UX-33` §1.2; medidas de `§9.2`), **en la
esquina de enfrente**: arriba a la izquierda del mueble. Blanco de 48 × 48; estampa visible de 26
pegada sobre el canto de arriba del mueble (se come los 4 px de chapa, nunca el bisel ni el área);
`--fuente-rotulada`; torcido -0,8° donde el otro va +0,8°. Su palabra es `MENU.sello`; su
`aria-label`, `MENU.abrir`.

Se ve durante la partida y con la tarjeta a la vista. **No se ve con el menú abierto**: el menú se
cierra con su propio botón grande y con `Escape`, y un sello que abre y cierra necesitaría una
cadena de "cerrar" que el borrador de `CNT-22`/`CNT-40` no tiene.

Tres reglas de sitio, las mismas de `UX-33` §1.2 espejadas:

1. **Nunca entra al área, nunca toca el pie.** Los tres lugares del sello de pantalla completa
   (arriba; colgado abajo en el ×2 apretado; al costado, arriba, en el apilado acostado) tienen
   su simétrico a la izquierda. "Colgado abajo" cuelga **por debajo del pie**, nunca encima.
2. **Los blancos no se pisan.** El de `MENÚ`, el de pantalla completa y el de "Volver al arcade"
   (48 de alto, a la izquierda de la cabecera) son tres blancos distintos. Si no entran sin
   pisarse, **cede la estampa** (el aire visual), no el blanco: primero el área, después la
   cabecera, recién al final el sello (`UX-33` §1.2).
3. **El lado izquierdo es el más disputado y no está medido.** `skayboy.css` midió 31 px entre el
   título y el mueble **a la derecha**; el título y "Volver" viven a la izquierda. A 812 × 375 y a
   812 × 354 la estampa de 26 asoma 22 sobre la franja del título. **Si pisa el título o el blanco
   de "Volver", el repuesto decidido acá es juntar los dos sellos en el lugar medido de la
   derecha, uno al lado del otro**, y no apretar ninguno de los dos.

**En el modo, el sello `MENÚ` existe** (`D-61` no lo dice y es la única puerta al menú durante
la partida sin salir del modo): arriba a la **izquierda del área**, espejo del sello de salir de `UX-33` §1.5, con su
mismo tope (a la derecha de la columna de mando, no encima), con la estampa entera de 48 y el
relleno de `§7.2`.

### 3.5 Foco, teclado y lector de pantalla

- **Al abrirse, el foco va al botón grande, sin desplazar la página** (`focus({ preventScroll:
  true })`). En la computadora, `Enter` en `entrada` empieza a jugar.
- **`Escape`** cierra el menú si hay una partida en pausa, y devuelve el foco al sello `MENÚ`. En
  `entrada` no hace nada; en `ganado` vuelve a la tarjeta. En el modo, el primer `Escape` es del
  sistema y sale de la pantalla completa; el segundo cierra el menú.
- El foco **no queda atrapado**: "Volver al arcade" sigue siendo alcanzable.
- Cada ficha es un `<button>` con `MENU.etiqueta(n, nombre, estado)`: `Nivel 3, Un favor que no se
  ve. Pasado.` El sello visible va en mayúsculas por CSS; lo que lee el lector va con su caja
  normal.

### 3.6 Los tres estados

- **Acierto** (elige un nivel): un toque y está jugando, con el rótulo de `§5`.
- **Falla** (la ficha apunta a un nivel que no está sembrado; en producción un borrador no se
  sirve): el toque no arma nada y el menú queda abierto. No hay mensaje: la ficha no existe sin
  nivel, y una ficha que no hace nada es un defecto del banco, no del jugador.
- **Abandona**: cierra la pestaña con el menú abierto. La próxima vez abre en `entrada`; una
  partida en pausa no se guarda (lo único que se guarda es `pasados`, `CTR-16.11`).

---

## 4. La tarjeta de fin de nivel

> **Historia que resuelve:** `US-09` criterio 1 (pasar al siguiente no cuesta más que un toque) y
> `BR-31` punto 1.

### 4.1 Qué es y cuándo aparece

**En el mismo cuadro en que `mundo.terminado` pasa a verdadero**, sin demora (`D-32` límite 3).
Convive con las puertas abiertas, el baile y el contador de `UX-33` §2. Se esconde mientras el
menú está abierto y vuelve al cerrarlo. **No tiene reloj ni cuenta atrás y no se cierra sola:**
dura lo que la persona se quede mirando (`UX-33` §2.3).

### 4.2 Qué lleva

| Pieza | Texto (borrador del hilo; manda `CNT-40`) | Registro |
|---|---|---|
| Sello grande | `NIVEL 2 DE 6 · PASADO` (`FIN_DE_NIVEL.rotulo`). **Nombra el nivel, no a las personas**: nada de "ganaron" (`BR-31`) | 3 |
| Renglón chico | `Sigue: <nombre>` (`FIN_DE_NIVEL.sigue`); en el sexto, `Último nivel.` | 3 + el nombre en 1 |
| Botón principal | `Seguí` (`PANTALLA.seguir`); en el sexto, `Volvé al primero` | 1 |
| Botón | `Repetí` | 1 |
| Botón | `Elegí otro`: abre el menú en `ganado` | 1 |

**El sexto.** Hoy `Volvé al primero` es el botón principal porque la pieza compartible de `BR-27`
no existe (`copy.ts` lo dice, y `avisoUltimoNivel` —"Ahora se comparte."— no se muestra para no
prometer lo que no hay). **El destino de `UX-33` §2.4 no se borra**: el día que exista la pieza,
el botón principal del sexto es el de compartir y `Volvé al primero` pasa a secundario. Lugar
reservado, diseño no hecho: es de `BR-27`.

### 4.3 Dónde va: arriba, y por qué `D-61` dice abajo

`D-61` pide la tarjeta "abajo, afuera del centro del área" para que *"el baile y el contador
queden a la vista"*. **Abajo es exactamente donde están.** En los seis niveles las dos puertas
están en la fila 8 de 9 de la grilla (`src/data/skayboy.json:45, 65, 85, 109, 133, 159`: el
renglón `#…1…2…#` de cada nivel), así que los dos muñecos paran en la fila de abajo, con la celda
de 16 × 24 entre 104 y 128 nativos de los 144. Y el contador ubica cada etiqueta **sobre la
cabeza** de su muñeco —entre 88 y 104— y, si no entra, debajo de los pies (`escena.ts:634-657`).

```
 y nativo
   0 ┌──────────────────────────────┐
     │  aire: acá no se mira nada   │  ← libre: hasta ~86
  86 ├──────────────────────────────┤
  88 │  etiqueta del contador       │
 104 │  muñecos, baile, puertas     │  ← el escenario
 128 │  piso (el último renglón)    │
 144 └──────────────────────────────┘
```

**La mitad de abajo del área es el escenario del baile. Lo único libre es la mitad de arriba.** Una
tarjeta "abajo" tapa lo que `D-61` quiere que se vea, y en pantalla completa (donde las columnas de
mando no tapan el medio) lo tapa entero. Entonces, **decidido acá: la tarjeta se apoya en la banda
de arriba del área, y no pasa de los 86 nativos de alto.** Comparte lugar con el rótulo de `§5`,
que se va a los dos segundos y nunca coincide con ella: si una tarjeta aparece con el rótulo
todavía a la vista, **la tarjeta lo esconde**.

La regla que se verifica es el resultado, no el mecanismo (`§10.1`): **en los seis niveles, a ×1,
a ×2 y en el modo, ni un muñeco, ni una puerta, ni una etiqueta del contador quedan tapados.** El
hilo elige cómo lo logra: un tope de altura, o la caja de la tarjeta pasada como un tercer
obstáculo a `ubicarEtiquetas()`. Si por una razón que acá no veo prefiere dejarla abajo, la
condición no cambia y con los niveles de hoy no se cumple.

### 4.4 Dos tamaños, según cuánto aire hay arriba

La banda libre mide el 60 % del alto del área (86 de 144). *Cuenta, sin medir:*

| Forma | Alto | Cuándo | Contenido |
|---|---|---|---|
| **Completa** | **98** (12 de borde y relleno + sello 16 + aire 4 + `Sigue` 14 + aire 4 + botones 48) | área de 164 px de alto o más: ×2, el modo, vertical del modo | sello, `Sigue`, tres botones |
| **Compacta** | **80** (12 + sello 16 + aire 4 + botones 48) | área de menos de 164: ×1 en el mueble (144 → 86 libres) | sello y tres botones en una fila. **`Sigue:` no se ve**: lo nombra el `aria-label` de `Seguí` y, dos segundos después, el rótulo de entrada |

A ×1 los tres botones tienen que entrar en una fila de 232 px (los 240 del área menos el borde):
con la letra a 0,6 rem y 8 de relleno, `SEGUÍ` + `REPETÍ` + `ELEGÍ OTRO` son unos 200 más 16 de
aire. **Es cuenta ajustada y hay que medirla**: si no entran, lo que se acorta es la palabra (es de
`CNT-40`), no el blanco de 48.

El ancho de la tarjeta es el del área menos el aire. **En el modo, de costado, vive entre las dos
columnas de mando** y debajo de la fila de sellos (los dos sellos de 48 ocupan las esquinas de
arriba): a 568 × 320 sobran 172 de banda libre y se gastan 56 en los sellos y 98 en la tarjeta.
Aunque con el nivel ganado los mandos no tengan nada que hacer, **la tarjeta no se apoya sobre
ellos**: dejaría teclas visibles debajo de un botón y dos blancos pisados.

### 4.5 La tarjeta y el toque sobre el área

El toque invisible de `UX-32` §5 (`#seguir-juego`, todo el área) **sigue igual**: tocar en
cualquier parte carga el nivel siguiente. La tarjeta se suma, no lo reemplaza. Tres consecuencias:

- **La tarjeta no se come toques que no son suyos.** Su cuerpo y su sello no toman el toque
  (`pointer-events: none`): un toque ahí cae al área y sigue. Solo los tres botones lo toman.
- **Un solo control para seguir en el orden de tabulación.** `UX-32` §5 pedía que "sea uno solo".
  Con la tarjeta visible hay dos con el mismo nombre; entonces `#seguir-juego` **sale del orden de
  tabulación y del árbol de accesibilidad** (`tabindex="-1"`, `aria-hidden="true"`) mientras la
  tarjeta está a la vista: el control con nombre es `Seguí` de la tarjeta, y el invisible queda
  solo para el dedo.
- **El foco no se roba** al aparecer: la persona puede estar con las teclas apretadas. El aviso
  para el lector (`avisoVictoria`, y `avisoUltimo` en el sexto) ya existe y la tarjeta no lo
  duplica. *Supuesto:* con teclado se llega a la tarjeta con `Tab`, como antes al botón invisible.

### 4.6 Los tres estados

- **Acierto**: la tarjeta es el acierto. **No usa el grito de `D-33`**: aparece plana, en un
  cuadro, sin sonido nuevo, sin estampa por pasadas (`UX-32` §4). Un sello con `PASADO` no es una
  tapa.
- **Falla**: no existe acá. El fracaso es otra pantalla (la entrada, sin tarjeta, `UX-29`).
- **Abandona**: no toca nada. La tarjeta se queda, sin reloj. Cierra la pestaña: el nivel quedó
  guardado como pasado y la próxima vez se retoma en el que sigue.

---

## 5. El rótulo de entrada de nivel

> **Historia que resuelve:** `US-09` criterio 9 (la unidad que cierra es el nivel: ahora tiene
> nombre a la vista).

### 5.1 Qué es

Un par de líneas sobre el aire de arriba del área, al empezar un nivel: `NIVEL 2 DE 6`
(`ENTRADA.rotulo`, registro 3) y debajo el nombre de `CNT-21`, que canta. **Aparece y se va en un
cuadro; no toma toques; no se mueve.** El juego corre debajo desde el primer cuadro: no es una
espera (`D-32` límite 3).

### 5.2 Dónde, cuánto y cuándo

- **Dónde:** pegado al borde de arriba del tubo, centrado, **entre 36 y 44 de alto** (*cuenta*:
  borde 4 + dos renglones de 12 y 16 + relleno 8). Ocupa las filas 0 a 2 de la grilla, que en los
  seis niveles son aire o pared. Su borde de abajo queda por encima de los 70 nativos: más abajo
  empieza donde el contador puede ubicarse. Sobre fondo propio (`§2.1`). **En el modo, de costado,** entre los dos sellos de
  las esquinas no entra el nombre más largo (27 letras: unos 190 contra 184 de hueco a 568 × 320):
  el rótulo se apoya **debajo de la fila de sellos**, igual que la tarjeta (56 + 44 = 100, dentro
  de los 172 libres).
- **Cuánto:** `DURACION_DEL_ROTULO_MS`, hoy 2.600. **Entre 2 y 3 segundos** es el rango que vale:
  menos no se lee, más es una espera. No es movimiento, es tiempo de lectura.
- **Cuándo aparece:** al empezar un nivel que se armó desde el menú o desde la tarjeta (`Jugá`,
  una ficha, `Seguí`, `Repetí`, `Empezá el nivel de nuevo`).
- **Cuándo no:** al volver a la entrada después de un fallo (`UX-29`: el fracaso no se narra, y un
  cartel de "NIVEL 2 DE 6" que reaparece es una pantalla de fin de partida con otro nombre,
  `BR-24`); ni al `Seguí jugando` de una pausa. Se va antes si se abre el menú o aparece la tarjeta.
- **Lector de pantalla:** región `aria-live="polite"`; anuncia lo mismo que se ve.

### 5.3 Los tres estados

- **Acierto**: la persona lo lee y juega; se va solo.
- **Falla**: no existe. Si el nivel no se arma, no hay rótulo.
- **Abandona**: si abre el menú, el rótulo se esconde y no vuelve al cerrarlo.

---

## 6. El pulgar que rueda

> **Historia que resuelve:** `US-09` criterio 2 (una sola persona, un dedo por columna) y
> criterio 6 (jugable con el pulgar).

### 6.1 Qué cambia, y por qué

Hasta `D-61` cada botón capturaba su puntero: el pulgar que bajaba en `←` y se corría a `→` seguía
caminando a la izquierda. Y correr saltando pedía **dos dedos en la misma columna**, cuando los
niveles 4 a 6 solo se ganan con salto y dirección a la vez (`skayboy-soluciones.json`, medido por
el hilo). `UX-28` §2.2 prometía que en solitario alcanzaba con "un pulgar por columna" y **no era cierto**.
Ahora lo es.

### 6.2 Las reglas (`dedos.ts`, ya escrito y probado en Node)

1. **El puntero lo captura la columna, no el botón.** Un dedo que baja en una columna es de esa
   columna hasta que se levanta; **no pasa a la columna del otro personaje**.
2. **La tecla es la más cercana al dedo**, sin franjas muertas: el aire de 8 entre las dos
   flechas y el de 16 entre las flechas y el salto se reparten por la mitad. **En el empate gana
   la flecha**: saltar sin querer es peor que tardar un píxel en saltar.
3. **Lejos de todas, ninguna.** Un dedo a más de **32 px** (`MARGEN_DEL_DEDO`, dos tercios de
   `--toque-min`) de la tecla más cercana no aprieta nada: se fue de la columna.
4. **La dirección viaja con el pulgar al saltar.** Si el dedo sube de una flecha al bloque de
   saltar sin levantarse, **salta y sigue yendo para ese lado**.

| El pulgar… | Pasa |
|---|---|
| baja en `←` | camina a la izquierda |
| se corre a `→` sin levantarse | pasa a caminar a la derecha |
| sube de `→` al bloque de saltar | **salta y sigue yendo a la derecha** |
| se queda en el bloque | sigue yendo a la derecha; el salto no se repite (sale por flanco) |
| baja otra vez a `←` | camina a la izquierda; **el arrastre se suelta** |
| baja derecho en el bloque | salta parado |
| se levanta | suelta todo |

**Lo que se ve:** las dos teclas encendidas a la vez (la flecha arrastrada y el bloque), con el
mismo cambio que ya tiene una tecla apretada: relleno `--papel` y figura en hueco. Se distingue por
forma y relleno, nunca solo por color (`UX-33` §1.4).

### 6.3 Lo que no cambia

- **Los dos dedos siguen sirviendo.** Quien agarra el teléfono entre dos (`UX-28` §2.2, primer
  párrafo: pulgar abajo, dedo de la mano libre arriba) juega igual que antes; las teclas apretadas
  son la unión. *Supuesto a confirmar en el código:* `dedos.ts` modela un dedo por puntero y la isla
  junta los de una columna.
- **El salto no cambia de tamaño** por esto (112 × 244): no se partió en dos diagonales (`D-61`,
  descartado: sumaba dos blancos chicos donde hoy hay uno grande).
- **La física y las trazas no cambian.** Una dirección conservada es una tecla apretada más.
- **Con mouse no hay botones** (`D-55`): no existe el arrastre; las mismas teclas se aprietan con
  el teclado.

### 6.4 Qué cuesta, para que no sorprenda

Un pulgar que sube al bloque y **se queda** deja al personaje corriendo hasta que el dedo se
levanta o baja a otra flecha. Es lo que `D-61` decidió (conservar la dirección en el aire cambiaba
la física y regrababa las seis trazas). Se aprende en un nivel y se corrige levantando el dedo.

---

## 7. La pantalla completa, en cualquier posición

> **Historia que resuelve:** `US-09` criterio 6 (ningún gesto de juego mueve la página) y
> criterio 7 (el pie se ve).

### 7.1 El botón aparece siempre, y dice lo que hace

- **Siempre que haya fichín**, parado o acostado, en cualquier ventana. Deja de haber una ventana
  sin botón (`UX-33` §1.9 y el desvío 1 de `§9`).
- **La estampa nombra el verbo del toque, en los dos estados.** Fuera del modo dice
  `PANTALLA COMPLETA`; dentro, `SALÍ` (`CNT-22` §1, que decía `PANTALLA NORMAL`: nombraba el
  estado y el usuario no encontró el botón). Los `aria-label` (`entrar`, `salir`) quedan como
  están. Con tilde y sin ícono, en `--fuente-rotulada`.
- **El menú tiene su copia** (el hilo la agrega a la columna de acciones de `§3.3`): la misma
  cadena, el mismo toque. Es el lugar donde el que abre el menú mira.

### 7.2 Cómo se ve en el modo

Sin cambios respecto de `UX-33` §1: el área crece al mayor múltiplo entero; las seis teclas
encima, en la disposición del horizontal; el pie pinchado abajo; la chapa decorativa no viaja.
**El relleno de los controles queda definido** (era un hueco de `UX-33` §1.4): `--fondo` al **56 %**
en las teclas y al **66 %** en los dos sellos (`MENÚ` y `SALÍ`), porque el sello lleva palabra y
pide 4,5:1 contra el peor caso, el blanco puro de la paleta del área (`--px-blanco-gulp`).
Los dos anillos, `--papel` afuera y `--fondo` adentro, siguen opacos. El menú, la tarjeta y el
rótulo **no** son medio transparentes: son opacos (`§2.1`).

### 7.3 Parado

- **Android.** Al entrar, el sistema acuesta la pantalla. La persona gira el teléfono para
  seguirla; lo que el sistema hace con la orientación es de `ADR-10`.
- **iPhone, y todo donde no hay bloqueo de orientación.** Parado, **el área va arriba y las
  columnas de mando abajo**, lado a lado, en la misma tinta. El pie, pinchado abajo. El área toma
  el mayor múltiplo entero del ancho y se queda arriba; lo que sobra son bandas de clave.
- **Girar el fichín 90° con CSS** queda descartado y anotado (`D-61`): rompe la medida de todo el
  encuadre.

### 7.4 Lo que no cambia

El pie reserva su franja antes de buscar la escala (`UX-33` §1.7, y su costo en `§9.6`).
`prefers-reduced-motion` no tiene nada que apagar. Con el modo activo, ningún gesto sobre el
área o los controles mueve la página.

### 7.5 Los tres estados

- **Acierto** (entra): el área crece, las teclas se superponen, el sello dice `SALÍ`.
- **Falla** (el sistema niega la pantalla completa): el modo CSS igual se aplica, que es lo que
  importa (`UX-33` §1.8: el resultado, no el mecanismo). Sin aviso.
- **Abandona** (`Esc`, `SALÍ`, o el gesto del sistema): vuelve el mueble y **la página queda donde
  estaba** (`§9.9`).

---

## 8. Las enmiendas, sección por sección

Cada una cita el texto viejo corto y dice el nuevo. Ninguna borra lo viejo: se marca.

### 8.1 `UX-27` §5.1, y lo que arrastra (`§1.2` puntos 3 y 4, `§9`)

**Dice hoy** (`§5.1`): *"Adentro del área no hay texto. Ninguno. Ni rótulos, ni contador, ni nombre
de personaje, ni cartel de nivel, ni el reloj."* Y lo repiten `§1.2` punto 3 (*"ningún sello de
goma entra"*), punto 4 (*"Adentro no hay texto"*) y la fila de `§9` (*"cartel de nivel, cualquier
texto"*).

**Pasa a decir:** `§5.1` sigue **absoluta para lo que dibuja el motor**: ningún texto en el
`<canvas>`, ni sobre el tileset. Y para la partida en curso, **salvo el rótulo de entrada**. Tres
capas de HTML pueden estar encima del tubo —**el menú, la tarjeta de fin de nivel y el rótulo
de entrada**, además del contador de la victoria que `UX-33` §2.5 ya traía— con las cinco
condiciones de `UX-37` §2.1. Los puntos 3 y 4 de `§1.2` y la fila de `§9` se leen igual:
**ningún sello ni texto *dibujado en* el área**; la imprenta apoyada encima, sobre su propia
tinta, es otra pieza (`D-41` punto 4: cada pieza de un lado de la frontera).

**Por qué `§1.2` y `§9` entran acá y `D-61` no los lista:** dicen lo mismo que `§5.1` con otras
palabras, y enmendar una sola dejaba las otras dos contradiciendo. Se pide al hilo sumarlas a
"Consume y enmienda" de `D-61`.

### 8.2 `UX-28` §1: *"nadie toca una pantalla previa"*

**Dice hoy:** *"Nadie elige nada, nadie lee un cartel, nadie toca una pantalla previa."*

**Pasa a decir:** nadie elige **un modo**, que es lo que `D-40` consecuencia 3 prohíbe y lo que
la propia `§1` explica (*"elegir un modo es una pantalla previa"*). Hay un menú de entrada con un
botón grande que dice `Jugá`: **un toque, cero preguntas, cero espera** (el botón es tocable desde
el primer pintado y el menú no tiene entrada animada, `D-32` límite 3). Sigue sin existir: botón
de cambio, rótulo de "modo un jugador", aviso de "traé un amigo", preferencia guardada; y **se
suma a la lista: el menú nunca tiene "1 jugador / 2 jugadores"**.

**Costo, dicho:** un toque antes del primer cuadro. `D-61` lo aceptó con el argumento de que el
usuario pidió *"el menú para jugar"* y el botón grande juega el mismo nivel que se jugaba antes.

### 8.3 `UX-28` §2.2: *"un pulgar por columna"*

**Dice hoy:** *"Y en solitario el mismo reparto funciona sin cambiar nada: el teléfono agarrado
con las dos manos, un pulgar por columna, el mismo lugar para las mismas teclas."*

**Pasa a decir:** **era falso para correr saltando**, que los niveles 4 a 6 piden (`D-61`
contexto 2). Con las teclas como estaban, un pulgar por columna caminaba o saltaba, no las dos.
**Ahora funciona porque la dirección viaja con el pulgar** (`UX-37` §6): el mismo reparto, un
pulgar por columna, sin cambiar el lugar de las teclas. El primer párrafo de `§2.2` (dos
personas, dos puntos de contacto cada una) sigue valiendo.

**Y una consecuencia que `D-61` no lista:** `UX-28` §2.1 dice *"Lo que las teclas no hacen: no se
deslizan, no tienen doble toque, no tienen mantener para cargar, no hay gesto. … Cualquier cosa
que pida deslizar es precisión fina con otro nombre."* **Pasa a decir: no se deslizan, salvo un
gesto, y es opcional** —subir de la flecha al bloque de saltar—, que apunta a un blanco de 112 ×
244 y no pide precisión; quien juega con dos dedos no lo necesita.

### 8.4 `UX-32` §4: *"Nada más."*

**Dice hoy:** *"Nada más. Sin flash de color, sin cámara que se acerque, sin texto que diga
'ganaron'."* (lo que pasa afuera del área al ganar: el efecto de la puerta y el control para seguir.)

**Pasa a decir:** *nada más* **que la tarjeta de `UX-37` §4**, que aparece en el mismo instante,
nombra el nivel y no a las personas (`NIVEL 2 DE 6 · PASADO`), no usa el grito de `D-33`, no suena y
no se mueve. El resto sigue: sin flash, sin cámara, sin "ganaron".

### 8.5 `UX-32` §5: el control para seguir

**Dice hoy:** *"Tocar en cualquier parte del área, una vez ganada, carga el próximo nivel."*,
*"Tampoco hace falta un botón nuevo en el mueble"* y *"que exista, que sea uno solo, y que un
toque alcance"*. Y deja abierto qué hace el toque en el sexto.

**Pasa a decir:**

- El toque sobre el área **sigue igual**.
- **Ahora hay botones nuevos y visibles** (los de la tarjeta). No son del mueble ni entran en el
  presupuesto de `UX-28` §2.3: viven sobre el área, en su región (`UX-37` §4.3), y no reabren los 51
  px de sobra.
- **"Uno solo" pasa a ser uno solo en el orden de tabulación:** con la tarjeta a la vista,
  `#seguir-juego` sale de la tabulación y del árbol de accesibilidad y el control con nombre es
  `Seguí` de la tarjeta (`UX-37` §4.5).
- **El sexto:** lo construido es `Volvé al primero`; el destino de `UX-33` §2.4 (la pieza de
  `BR-27`) queda pendiente de `producto` y de que la pieza exista.

### 8.6 `UX-33` §1.2: el sello dice el verbo, no el estado

**Dice hoy** (tabla): *"Ventana … Un estado que nombra lo que se gana al tocar"* y *"Pantalla
completa … Un estado que nombra que ya se está adentro"*, *"en el mismo molde de cuatro estampas
que ya usa `UX-21`"*.

**Pasa a decir:** **la estampa nombra el verbo del toque en los dos estados**: `PANTALLA COMPLETA`
fuera del modo, `SALÍ` adentro. El molde de la cinta (la estampa dice en qué estado estás) se
descarta para este botón: el usuario no lo encontró (`D-61`). Y `UX-21` salió del sitio con
`D-50` el 2026-10-01: el molde de referencia ya no existe, y la pieza queda definida por
`UX-33` §1.2 más esta enmienda. `CNT-22` §1 dejaba las dos palabras sin tilde "a propósito"; con
`SALÍ` y la letra rotulada completa, deja de hacer falta.
Se absorbe además el desvío 2 de `§9` (blanco de 48, estampa de 26, tres lugares).

### 8.7 `UX-33` §1.9: el botón en vertical

**Dice hoy:** *"El botón de pantalla completa **no aparece en vertical**."* y *"el botón se
muestra exactamente donde ya se muestra el fichín horizontal."*

**Pasa a decir:** **aparece siempre, parado o acostado** (`UX-37` §7.1). Lo que decía `§1.9` para
no agregarlo —que el apilado de vertical "ya funciona"— no era la razón que importaba: parado es
como se entra desde un enlace, y el apilado muestra el área a 240 px de ancho. En el modo parado el
área va arriba y las teclas abajo (`UX-37` §7.3). Lo que **sigue exactamente igual** es la línea de
`CNT-18` (*"De costado se ve el doble de grande"*) y su condición de `UX-28` §4.1.
Se absorbe el desvío 1 de `§9` (cualquier ventana acostada).

### 8.8 `UX-33` §4, punto 1: las palabras del interruptor

**Dice hoy:** *"un estado que nombra lo que se gana al tocar, y un estado que nombra que ya se
está adentro"*. **Pasa a decir:** dos palabras que nombran el toque (`§8.6`). Los dos huecos
(`PANTALLA_COMPLETA.ventana` y `.completa`) están en el traspaso para `CNT-40`, que todavía no se
escribió.

---

## 9. Los desvíos de `HILO-para-experiencia-pantalla-completa.md`

El traspaso del 2026-09-24 (`T-301`) listaba nueve cosas que lo construido hacía distinto de
`UX-33`. **Se aceptan las nueve** —cada una está medida en el navegador por el hilo— y quedan
escritas acá. Las medidas son del hilo; lo que se decide es lo que corresponde a `experiencia`.

1. **El botón aparece también en cualquier ventana acostada.** Aceptado, **y `D-61` lo supera**:
   aparece siempre (`§7.1`, `§8.7`). La pregunta del hilo —¿`§1.9` pasa a decir "de costado, o con
   el fichín horizontal"?— se contesta: ni una ni otra, **siempre**.
2. **El sello del mueble: blanco de 48, estampa de 26, tres lugares.** Aceptado. El blanco mide
   `--toque-min` y es transparente; la estampa es el `::before` de 26, pegada al canto de arriba
   del mueble (se come los 4 px de chapa, nunca bisel ni área). Tres lugares: arriba a la derecha
   (×1 de costado, y ×2 con alto de sobra: unos 31 px entre título y mueble, la estampa asoma 22);
   **colgado abajo a la derecha** en el ×2 de 401 a 500 de alto (asoma 20 y cuelga 6 bajo el
   borde); **al costado derecho, arriba**, en el apilado acostado. **A 480 × 360 justos la estampa
   pisa el título**: es el caso que la hoja ya declaraba roto y sigue roto. El sello `MENÚ` hereda
   la misma regla, espejada (`§3.4`).
3. **En el modo, el sello de salir tiene un tope.** Aceptado: a 844 × 390 la columna de 324 y el
   sello de 48 no entran uno arriba del otro en los 366 de la sala. Queda a la izquierda de la
   columna, sobre el área. `MENÚ` hace lo mismo en el costado opuesto (`§3.4`).
4. **Medio transparente, con números.** Aceptado: **56 %** las teclas (la figura de `--papel` da
   3,4:1 contra el blanco de Gulp!, pide 3:1) y **66 %** el sello (la palabra da 4,85:1, pide 4,5).
   El sello es menos transparente que las teclas, y no al revés. Lo vigila `estilos.test.ts`.
   Completa a `UX-33` §1.4, que no fijaba el porcentaje.
5. **Parado, en el modo: el área va arriba de las teclas.** Aceptado, y con `D-61` **deja de ser
   un caso raro**: es lo que ve el iPhone (`§7.3`). Completa `UX-33` §1.9.
6. **La reserva del pie cuesta un escalón en el teléfono común.** Aceptado: a 844 × 390 @ 3 el área
   queda a ×7 (560 × 336, 86 % del alto) y no a ×8 (98 %). **Se descarta la salida del hilo**
   (el pie superpuesto sobre la banda de clave, el área a ×8): un pie que depende de cuánta banda
   sobra deja de estar "visible sin tocar nada" en cualquier tamaño (`BR-26`), y a ×8 no queda
   banda. El escalón es el precio del pie.
7. **Lo que no cambió.** Nada que decidir. La mención al interruptor de la cinta quedó vieja
   (`D-50`, 2026-10-01): el modo ya no tiene nada que apagar. Lo que sigue sin poder mirarse desde
   acá —que ningún gesto mueva la página en Safari de iPhone y que el píxel siga nítido con
   `E ≠ E₀`— es de `ADR-10.7` y necesita un teléfono.
8. **Ventanas bajas: cuando las teclas no entran, cede el salto.** Aceptado, y enmienda `UX-33`
   §1.4, que decía *"**Tamaño:** sin cambios respecto de `UX-28` §2.1"* y no contemplaba una
   ventana más baja que la columna. La fila de la sala es la ventana menos el pie, siempre; cuando
   la columna de 324 no entra, **cede el bloque de saltar y solo él**, con piso en `--toque-min`.
   Medido: 234 de alto a 812 × 354, 220 a 844 × 340, 200 a 568 × 320 (112 × 200, cuatro veces
   `--toque-min`). Las flechas siguen en 52 × 64. `UX-28` §2.1 pedía el bloque grande por el
   timing; a 200 sigue siendo un blanco que no obliga a apuntar. **Se descarta** que el pie suba
   sobre la banda de clave y las teclas bajen hasta el borde: choca con `BR-26`.
9. **Al salir, la página vuelve adonde estaba.** Aceptado: al entrar el documento se achica y el
   navegador sube la página; al salir, la persona quedaba en el título y no en el mueble. Medido:
   entró en 40, salió en 40. Queda como parte de `§7.5` (abandono).

---

## 10. Cómo se verifica

Los comandos los corre otro (`D-12`).

### 10.1 A máquina y con el navegador

```
node --test src/lib/contraste.test.ts   # los pares de §2.1: --texto y --papel sobre --fondo, --fondo sobre
                                         # --papel, --disco-gulp-tinta sobre --fondo. Si algo del menú usa un
                                         # par que no está, se agrega al test (un color sin par no existe)
node --test src/lib/estilos.test.ts     # abajo: lo que conviene que vigile
node --test src/lib/voz.test.ts         # cuando CNT-40 se copie a copy.ts
node --test src/lib/skayboy/menu.test.ts src/lib/skayboy/dedos.test.ts src/lib/skayboy/escena.test.ts
npm test
```

**Lo que `estilos.test.ts` puede mirar** (propuesta, el hilo decide): que cada botón del menú, de
la tarjeta y los dos sellos declaren `min-height` y `min-width` de `var(--toque-min)`; que el
fondo del panel, la tarjeta y el rótulo no lleve alfa ni `color-mix`; que no haya `border-radius:
999px` ni barra lateral en las fichas; que ninguna de las tres capas tenga `inset: 0` sobre el
mueble; que no haya `transition` ni `animation` en ellas.

**Lo que no se puede mirar sin un navegador**, con el fragmento de medición que ya usó `T-271`
(`teclasFuera`) extendido a las tres capas, a 568 × 320, 640 × 360, 812 × 354, 812 × 375,
844 × 390, 1280 × 720, 390 × 844 y 375 × 667:

1. **El pie:** el rectángulo de `.chapa-pie` no se cruza con el de ninguna capa ni sello, en
   `entrada`, `pausa` y `ganado`, con la tarjeta compacta y completa, y con el modo prendido de
   costado y parado. Ni el pie sale de la ventana (`bottom ≤ innerHeight`).
2. **El escenario:** en los seis niveles, ganados, a ×1, a ×2 y en el modo: ni un muñeco, ni una
   puerta, ni una etiqueta del contador dentro del rectángulo de la tarjeta.
3. **Ningún blanco se pisa:** `MENÚ`, pantalla completa, "Volver al arcade", las teclas y los botones
   de la tarjeta, de a pares.
4. **Los dos casos con scroll de `§3.3`** (vertical ×1, y horizontal ×1 en pausa): el botón grande
   se ve sin scrollear, la última ficha asoma cortada, y arrastrar el panel no mueve la página.
5. **Los tres botones de la tarjeta compacta entran en una fila a ×1** (240 de área).

### 10.2 Primera pantalla sin muro, y accesibilidad

La primera pantalla, en el teléfono, con `localStorage` vacío:

- [ ] Nada pide cuenta, nombre, edad, permiso ni cuántos juegan.
- [ ] El botón grande está en la primera vista, sin scrollear, mide 56 o más y dice un verbo.
- [ ] Debajo dice qué nivel va a jugar, con número y nombre.
- [ ] Del enlace al primer cuadro hay **un toque**. Se cuenta.
- [ ] Se toca la ficha 6 sin haber pasado nada y se juega.
- [ ] Ninguna ficha se ve apagada, gris, con candado ni con un "bloqueado".
- [ ] El pie de homenaje se ve con el menú abierto, sin tocar nada.
- [ ] El menú no explica cómo se juega: el nivel 1 es el tutorial.

Accesibilidad:

- [ ] Todo blanco mide 48 o más; ninguno se pisa con otro (`§2.2`).
- [ ] Ningún estado se comunica solo con color: `PASADO` y `ACÁ ESTÁS` llevan palabra y borde.
- [ ] Foco visible en todo lo tocable (4 px, `--disco-gulp-tinta`); el orden de `Tab` es el de
      lectura; con el menú abierto, mandos y `#seguir-juego` están `inert`.
- [ ] `Escape` cierra el menú (`§3.5`); `Enter` en `entrada` juega.
- [ ] Cada sello y botón tiene su `aria-label` en voseo; el sello se lee con caja normal.
- [ ] El rótulo se anuncia una vez (`aria-live="polite"`); la tarjeta no duplica `avisoVictoria`.
- [ ] Con `prefers-reduced-motion` no hay nada que se apague: no hay movimiento.
- [ ] Con la tarjeta a la vista, hay un solo `Seguí` en el orden de tabulación (`§4.5`).

### 10.3 A ojo, con el teléfono en la mano

1. Correr saltando con **un solo pulgar por columna**, en el nivel 4, y pasarlo.
2. Con dos personas: los dos pulgares no se pisan, y el dedo que se corre al otro lado no maneja
   al otro personaje (`§6.2` regla 1).
3. Ganar un nivel y mirar el cuadro: el baile y el contador se ven enteros, y la tarjeta está arriba.
4. Abrir `MENÚ` en medio del nivel, cerrar con `Seguí jugando`, y comprobar que el mundo siguió
   donde estaba y no avanzó mientras el menú estuvo abierto.
5. En pantalla completa, parado y de costado: el botón dice lo que hace, el pie está a la vista,
   y `MENÚ` se alcanza sin salir.

---

## 11. Lo que este documento no cierra

- **Las palabras.** `CNT-40`, reservado: el hilo copia a `copy.ts` lo que `contenido` escriba, no
  el borrador. Dos cosas que `contenido` tiene que mirar: `Sigue: <nombre>` y `Seguí` son dos
  formas del mismo verbo en la misma tarjeta, y a ×1 `Sigue:` no se ve (`§4.4`); y `SALÍ` en el modo
  tiene que resolverse como imperativo corto en una estampa de 26 px.
- **Las medidas marcadas *cuenta*.** `R` en los cinco lugares de `§3.3`, los 80 y 98 de la tarjeta,
  los tres botones a ×1, y el lado izquierdo del sello `MENÚ`. Las mide el hilo y las contesta acá.
- **El lienzo.** Una hoja nueva para el menú y la tarjeta; hasta que exista, este documento es la
  vara. El orden del circuito de `diseno-marca.md` (lienzo, `tokens.css`, componentes) se invirtió
  de nuevo, como con `T-319`.
- **La pieza compartible del sexto nivel** (`BR-27`): el flujo "se entra, se juega, se comparte, se
  cierra" de este juego queda sin su tercer paso hasta que exista.
- **La portada: el casete de este juego pasa de A9 a A4** (`D-61` punto 6). `UX-35` (§1, §2.3,
  §2.6, §4, §5.1 y el checklist de §7.1) y `UX-04` (la tabla de casetes) nombran a Skayboy como el
  noveno, solo y sin carátula, y quedaron viejos. No se tocan acá.
- **La leyenda de teclas con mouse** que `D-55` dejó para `experiencia` en `UX-28` §2 y `UX-35`
  §5. Sigue pendiente.
- **Dónde se guarda lo que juntó cada uno** (`BR-31`): no cambia.
