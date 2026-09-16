# PRD — Skayboy y Poligirl: el octavo juego, dos personajes y una puerta

> **Consume:** `Docs/BRIEF.md` (para quién: *"nunca un muro en la primera pantalla"*;
> riesgo 4, *"cuatro juegos hermosos con doce preguntas adentro"*; "móvil primero, sesiones
> de dos o tres minutos"; "Fuera de alcance": multijugador en tiempo real y cuentas de
> usuario; el supuesto confirmado de puntajes en `localStorage`).
> `Docs/DECISIONES.md`: `D-05` (los cuatro juegos de la v1, que no se redefinen solos),
> `D-09` (jugable con el pulgar, sin muro de entrada), `D-12` (quien escribe no puede
> correr la verificación), `D-14` (los molinetes abiertos), `D-15` (no hay jugador como
> entidad), `D-17` (voseo, sin anglicismos), `D-21` (crédito de tapas), `D-32` límite 3
> (0 ms hasta que la acción principal es tocable: una pantalla que hay que esperar o
> despachar es un molinete con forma de animación), `D-33` (el acierto es el único grito
> del sitio), `D-35` (toda pantalla termina en pie de imprenta), `D-37` punto 4 y `D-39`
> (este juego suena entero), `D-38` (dos personas vivas se pueden dibujar, tres barandas),
> `D-40` (un acompañante también es un molinete), `D-41` (pixel adentro, imprenta afuera),
> `D-42` (los muñecos tienen cara; el pie de homenaje pasa a obligatorio), **`D-43`** (no hay
> botón de cambio: cada columna de mando maneja siempre al mismo personaje).
> **`Docs/REVISIONES/REV-14-ciclo-15.md`: `FIND-59`**, que este archivo cierra.
> `Docs/ARQ/ARQ-schema-niveles.md`: `CTR-16.4` y `CTR-16.5`, leídos del disco el 2026-09-16
> después de que `arquitectura` los enmendara por `FIND-58`.
> `Docs/UX/UX-28-la-pantalla-y-las-dos-puertas.md` §1 y §3, `Docs/UX/UX-29-el-fracaso-no-es-la-muerte.md` §7.
> `Docs/PRODUCTO/`: `BR-01` (escalonamiento sin muro), `BR-15` (los clones se adoptan
> vestidos) y `BR-16` (una idea no entra a un ciclo sin pasar a `US-XX`), `BR-18`
> apartado g (la cuota de Fáciles de `US-02` sin medir), `BR-22` (precedente de un juego
> sin resultado correcto), `US-06`, `US-07` y `US-08` como precedentes de juego que entra
> al sitio fuera del contrato de cuatro, `IDEA-14` (la ficha entera) e `IDEA-04`.
> `Docs/INVESTIGACION/INV-60-skayboy-poligirl.md`: `RES-60` (y su lectura: el nombre del
> juego de origen no se escribe en ningún lado), `RES-61.2` (los dos en su puerta al mismo
> tiempo), `RES-61.4`, `RES-61.5`, `RES-61.7`, `RES-61.8` (el rango por letra y su umbral
> sin fuente), `RES-61.11`, `RES-62` (el orden de motores), `RES-64.3`, `RES-64.5`,
> `RES-64.7`, `RES-64.11`, `RES-64.16`, `RES-64.17`, `RES-64.19`, `RES-65.1`, `RES-65.3`,
> `RES-65.4`, `RES-65.6`, `RES-65.9`, `RES-65.10`, y las tres mediciones sobre el repo.
> `RES-04` (la muerte del Indio, 5-jun-2026), `RES-20` (los 105 temas).
> `public/arte/README.md`, `public/arte/ensayo/README.md` y la medición de
> `public/arte/skayboy_poligirl.png` que trae el encargo del 2026-09-16.
> `.claude/rules/diseno-marca.md`, `.claude/rules/voz-ricotera.md` (los tres registros),
> `.claude/rules/codigo-juegos.md`. `src/lib/tarjeta/plan.ts` (`MAX_FILAS = 6`, el campo
> `hero`).
>
> **Produce:** `US-09`, `BR-23`, `BR-24`, `BR-25`, `BR-26`, `BR-27`, `BR-28`.
>
> **Enmendado el mismo día (2026-09-16), y no se versiona a `-v2`.** Dos cosas cambiaron
> después de escribirlo, ninguna nace de esta carpeta: **`FIND-59`** —el choque de la puerta
> del nivel 1 contra `CTR-16.5`, que cierro acá y cede este documento— y **`D-43`**, que le
> sacó a `D-40` el botón de cambio y dejó tres párrafos míos citando un mecanismo que ya no
> existe. No hay `-v2` porque nada de esto se construyó todavía y porque `T-231` apunta a
> este archivo: versionarlo el día que nació sería mover la puerta de lugar. Cada enmienda
> queda marcada donde pasó, como hizo `arquitectura` con `CTR-16.3` y `CTR-16.4`.
>
> **IDs reservados por el ciclo 15 y NO tomados por este archivo** (`Docs/IDS.md`, fila
> del 2026-09-16): `ADR-08` y `CTR-15`+ (`arquitectura`), `UX-27`+ (`experiencia`),
> `CNT-17`+ (`contenido`), `T-226`+ (`orquestador`), `REV-14`/`FIND-55`+ (`revisor`),
> `RES-70`+ (`investigador`).

## Por qué este archivo existe y no un bloque en `PRD-alcance-v1.md`

`PRD-alcance-v1.md` es el archivo de los cuatro juegos que fija `D-05`, y su propia tabla
"Piso de ítems — resumen" dice de sí misma que es la de esos cuatro. `US-06` entró ahí
porque en ese momento no había otro lugar; desde entonces el proyecto hizo lo contrario dos
veces seguidas y salió mejor: `US-07` tiene `PRD-adivinar-por-la-letra.md` y `US-08` tiene
`PRD-ponelos-en-fila.md`. Este juego es el caso más extremo de los tres —género distinto,
motor de terceros, dos personas reales dibujadas, sonido propio— y meterlo adentro de un
archivo de 1384 líneas que habla de bancos de preguntas obligaría a explicar en cada
párrafo que acá "ítem" no significa lo mismo. Va aparte.

**Lo que este archivo no hace:** no elige el motor 2D ni fija el schema del nivel
(`ADR-08`/`CTR-15`, `arquitectura`), no diseña la pantalla, el reparto de la zona de pulgar,
la convención de sprites ni qué se ve cuando el juego se pierde (`UX-27`+, `experiencia`),
no redacta una sola línea de las que se leen —incluido el pie de homenaje— (`CNT-17`+,
`contenido`), y no corta tareas (`orquestador`).

---

## Lo ya decidido, trazado y no re-discutido

Cinco decisiones del usuario cierran el diseño grueso y este documento las toma como
insumo. Se listan porque `US-09` se apoya en ellas y porque dentro de tres meses nadie se
va a acordar de cuál vino de dónde.

| Qué | Dónde | Qué arrastra para esta historia |
|---|---|---|
| El par es **cielo / infierno**, no fuego / agua | `IDEA-14`, respuesta 1 del usuario | arriba/abajo es la geometría del nivel; el nombre del juego dejó de explicarse por el par y eso es de `contenido` |
| Se juega **de a dos, en horizontal** | `IDEA-14`, respuesta 2 | dos zonas de pulgar en una pantalla de ~812×375 |
| Se pueden dibujar las dos personas | `D-38` | tres barandas; la 2 la enmienda `D-42` |
| El juego **suena entero** | `D-39` | primera excepción a `D-37` punto 4, con tres condiciones que no negocia esta historia |
| Se juega **también solo** | `D-40` | cada nivel resoluble de las dos maneras; prohibido por construcción el puzzle que exige simultaneidad sin segunda solución |
| **No hay botón de cambio** | `D-43` | cada columna de mando maneja siempre al mismo personaje, y el que no tiene un dedo encima se queda quieto y a salvo. Cambia cómo se escribe el camino del que juega solo, y **agrega lo que el nivel 1 tiene que enseñar** — ver `FIND-59` más abajo |
| **Pixel adentro, imprenta afuera** | `D-41` | el área de juego es un recorte con borde, nunca un `<canvas>` a sangre |
| Los muñecos **tienen cara** | `D-42` | el pie de homenaje pasa de conveniente a **obligatorio**, y la derrota se mira de nuevo |

Y una restricción de publicación que viene de `RES-60` y afecta a todo lo que se escriba:
**el nombre del juego de origen no aparece en ningún lado** — ni en texto visible, ni en
metadata, ni en comentarios del código, ni en los nombres de archivo.

---

## US-09 — Skayboy y Poligirl (dos personajes, una puerta)

**Prioridad: no forma parte del "Listo" de la v1.**

`D-05` fijó en `/kickoff` que la v1 cierra con cuatro juegos. No reabro ese número porque
apareció un octavo título, exactamente como no lo reabrí para `US-06`, `US-07` ni `US-08`.
Este juego entra al sitio por la misma puerta que esos tres: **construible y publicable sin
esperar a nada, contado aparte de los cuatro que definen si la v1 está lista.**

> Como alguien que llega al sitio por un enlace, con o sin quien lo acompañe, quiero
> abrirme paso con dos personajes que no pisan lo mismo hasta que los dos lleguen a su
> puerta, para pasar un nivel en un rato corto — sin que el sitio me pida una segunda
> persona ni saber jugar plataformas.

### Criterio 1 — caso feliz, de a dos

- **Given** dos personas con un teléfono en horizontal, cada una con los controles de su
  lado de la pantalla.
- **When** cada una mueve su personaje y los dos quedan parados en su propia puerta al
  mismo tiempo (`RES-61.2`, `RES-61.3`).
- **Then** el nivel se da por pasado, y pasar al siguiente no cuesta más de un toque.

### Criterio 2 — caso feliz, una sola persona

> **Enmendado por `D-43`.** Decía *"usa el botón de cambio para pasar al otro"*, citando la
> frase de `D-40` que `D-43` reemplazó el mismo día. El criterio no cambia de fondo —era y
> sigue siendo *el nivel se termina entero con una persona*—; cambia el mecanismo con el que
> se cumple, y ese no era mío.

- **Given** una sola persona jugando el mismo nivel, sin nadie al lado.
- **When** maneja un personaje con una columna de mando y después mueve al otro tocando la
  otra columna (`D-43`, `RES-65.1`, `RES-65.3`).
- **Then** el personaje que no tiene un dedo encima **queda quieto y a salvo** donde lo
  dejaron, y el nivel se termina entero así — la puerta doble incluida, porque el que llegó
  primero espera parado en la suya. La simultaneidad que este juego exige es **de presencia,
  no de entrada** (`BR-25`).

### Criterio 3 — caso borde: el que llega solo no elige modo

- **Given** alguien que abre la dirección del juego por primera vez, solo, desde un enlace
  que le pasaron.
- **When** entra.
- **Then** empieza a jugar sin que ninguna pantalla le pregunte con cuántas personas juega
  y sin ningún cartel que le avise que el juego es de a dos. El pasaje de una manera de
  jugar a la otra está disponible **durante** la partida, nunca en una pantalla anterior a
  ella (`D-40` consecuencia 3, `D-32` límite 3).

> **Enmendado por `D-43`.** Este criterio cerraba con *"cuál de las dos se ofrece primero es
> de `experiencia`"*. Esa pregunta **ya no existe**: `UX-28` §1 la disolvió en vez de
> contestarla —no hay dos modos, hay una pantalla y dos maneras de agarrarla— y `D-43` lo
> fijó. El criterio queda igual de verificable y se cumple sin que nadie ofrezca nada.

### Criterio 4 — caso borde: el primer nivel enseña la regla entera y no se puede perder

> **Enmendado el 2026-09-16 por `FIND-59` (`REV-14`), y acá cede este documento.** Decía que
> lo único que el nivel 1 enseña es *"moverse y llegar a la puerta"* y que *"el segundo
> introduce la puerta doble"*. Eso chocaba de frente con `CTR-16.5` regla 1 —una entrada y
> una puerta **por personaje**— y con su regla 2, que declara la victoria como regla del
> juego y no como campo por nivel. **El fundamento está en la sección que sigue a los
> criterios.** Lo que el criterio protegía —que el primer nivel no se pueda perder— no se
> toca: se mueve al lugar donde vivía de verdad.

- **Given** alguien que nunca jugó un plataformas, solo o acompañado.
- **When** juega el primer nivel del piso.
- **Then** ese nivel tiene **las dos entradas y las dos puertas** (`CTR-16.5` regla 1) y se
  pasa con los dos personajes parados en la suya (`CTR-16.5` regla 2), **y no hay en él
  ningún elemento que devuelva a nadie a la entrada**: ni molinete propio, ni molinete
  compartido, ni mecanismo, ni caja. Se aprende moviendo: que hay dos, que cada columna de
  mando es uno, y que la puerta se abre cuando los dos llegaron.
- **Y además** — porque es la mitad que se verifica y la que se va a olvidar: **ese nivel se
  termina sin haber tenido que esperar, sin haber tenido que soltar a uno en un lugar
  incómodo y sin un solo tramo que exija que los dos se muevan dentro de la misma ventana de
  tiempo** (`BR-25` c). La distancia de cada uno a su puerta es corta y las dos puertas se
  ven desde la entrada.

Es `BR-01` punto 1 —*el primer ítem de cualquier partida es Fácil*— leído en un juego de
niveles ordenados, y es lo que reemplaza a los cuatro niveles de tutorial del juego de
origen, que acá no caben porque `D-32` límite 3 no deja poner una pantalla previa.

**Lo que `BR-01` pide en el primer escalón es menos exigencia, no otras reglas.** Fácil es
menos obstáculo, menos distancia y menos precisión. Fácil no es "se gana distinto".

### Criterio 5 — caso borde: el fracaso

- **Given** un jugador cuyo personaje toca el terreno que no lo deja pasar.
- **When** eso pasa.
- **Then** vuelve a la entrada del nivel de inmediato, sin que nada diga ni muestre que
  murió, sin contador de vidas que se agote, sin pantalla de fin de partida y sin costo
  acumulado. El reintento es inmediato y gratis (`BR-24`).

> **Enmendado el 2026-09-16, y no lo pidió ningún hallazgo.** El *Given* decía "toca el
> elemento que no lo aguanta, **o se cae**". Caerse ya no existe: `UX-29` §7.1 sacó el vacío
> de todos los niveles —el nivel es una sala cerrada— porque la caída es la otra imagen de
> muerte que un plataformas produce sin querer, y la produce el nivel, no el dibujo. El
> criterio quedaba nombrando un caso que el diseño acababa de hacer imposible.

### Criterio 6 — caso borde: jugable con el pulgar, y el marco se ve

- **Given** un teléfono en horizontal, sin teclado.
- **When** el jugador mira la pantalla.
- **Then** los controles de cada lado respetan `--toque-min` ≥ 48 px (`RES-65.6`), no tapan
  la parte del nivel que hay que mirar para jugar, y el área de juego es **un recorte con
  borde**, no un `<canvas>` contra el borde de la ventana (`D-41` punto 3).

Va escrito como criterio de aceptación y no como detalle de pantalla por el mismo motivo
por el que `US-08` escribió así su criterio 4: es el criterio no negociable "jugable con el
pulgar" (`D-09`), y un juego que solo se juegue bien con teclado sería un molinete nuevo
con forma de gesto. El teclado en escritorio es un agregado gratis (`INV-60`, medición
sobre el repo), nunca la vía principal.

### Criterio 7 — el pie de homenaje está, sin tocar nada

- **Given** cualquier persona en la pantalla del juego.
- **When** mira la pantalla sin tocar nada.
- **Then** ve el pie que exige `D-42`: que es un homenaje de fans, que no es oficial, y que
  ni Eduardo Beilinson ni Carmen Castro tuvieron nada que ver. En registro 3, seco
  (`BR-26`).

### Criterio 8 — al terminar, se comparte

- **Given** un jugador que llegó hasta donde llegó: pasó los seis niveles del piso o dejó
  en el tercero.
- **When** toca compartir.
- **Then** obtiene la pieza compartible, que dice **hasta dónde llegó y de qué manera
  jugó** —solo o de a dos—, sin nota, sin rango por letra, sin comparación contra otro
  jugador y sin firmar a nadie; y el pie de homenaje va impreso adentro de la imagen
  (`BR-27`).

### Criterio 9 — la unidad que cierra es el nivel, no el juego

- **Given** un jugador que pasó dos niveles y cierra el teléfono.
- **When** vuelve al sitio otro día, desde el mismo aparato.
- **Then** no tiene que rehacer lo que ya pasó: el avance se guarda en el aparato
  (`localStorage`, como el resto del sitio — brief, supuesto confirmado), sin cuenta y sin
  sincronización entre aparatos.

**Por qué esto es un criterio y no un detalle:** el brief promete sesiones de dos o tres
minutos, y este es el primer juego del sitio donde **la partida entera no entra en una
sesión**. Un jugador que tuviera que empezar del nivel 1 cada vez usaría el sitio como no
está pensado usarlo. Lo que cierra en un rato corto es **un nivel**; los seis son el
recorrido, no la partida. Cuánto dura un nivel se mide, no se cita (`INV-60`, "Sin
resolver"): es de `experiencia`, y si la medición da que un nivel del piso no entra en una
sesión corta, el que se corrige es el nivel.

---

## `FIND-59` — la puerta del nivel 1 es doble. Cede este documento, no el contrato.

`REV-14` encontró que `US-09` criterio 4 y la tabla de escalones le daban al nivel 1 una
sola puerta, y que `CTR-16.5` exige una por personaje y sentencia que *"un nivel que se gana
con uno solo en la puerta es otro juego"*. No podían ser ciertos los dos. **Cede el mío, y
los motivos son cuatro.** Se escriben acá porque dentro de tres meses el que diseñe el nivel
1 va a tener la misma tentación que tuve yo, y con el mismo argumento.

### 1. El nivel 1 es todo el tutorial que este juego va a tener

`D-32` límite 3 no deja una pantalla previa, criterio 3 prohíbe el cartel y `UX-28` §1 sacó
hasta la pregunta de con cuántas personas se juega. **No hay ningún otro lugar donde este
juego explique qué es.** El juego de origen se tomaba cuatro niveles de tutorial; acá hay
uno, y no es uno de seis: es el único.

Un nivel 1 de una puerta enseña *llegá a la puerta y ganás*, y el nivel 2 se lo desmiente.
Eso no es una rampa blanda: es un muro corrido de la primera pantalla a la segunda, y encima
del peor tipo — el jugador **hizo lo que aprendió y no funcionó**. Es exactamente lo que
`BR-01` existe para impedir, con la agravante de que la culpa se la lleva él.

### 2. El motivo que apareció después, y que nadie tenía cuando se escribió el choque

`D-43` sacó el botón de cambio: cada columna de mando maneja siempre al mismo personaje, y
el que no tiene un dedo encima se queda quieto. Es mejor, y le agrega al nivel 1 un trabajo
que antes no tenía.

**Con un botón de cambio, el botón anunciaba que había otro personaje. Sin botón, no lo
anuncia nada.** Lo único que revela que hay un segundo es tocar la otra columna. Entonces:

> Si el nivel 1 se gana con uno solo en la puerta, **una persona que llega sola lo pasa sin
> haber tocado nunca la otra columna** — y se va creyendo que el juego es eso.

El camino que `D-40` abrió para el que llega sin acompañante quedaría cerrado por el único
nivel encargado de mostrarlo. La decisión que abre el molinete y el nivel que lo cierra, en
la misma pantalla. Con dos puertas el descubrimiento es forzoso y no cuesta una palabra: se
lleva a uno hasta su puerta, la puerta no abre, y del otro lado de la pantalla hay un muñeco
parado **mirando a cámara**, que es la señal que `UX-28` §3 ya fijó para el que espera. Se
toca ahí y el juego entero quedó enseñado sin un cartel.

### 3. El costo que puso `arquitectura` sobre la mesa es real y no es de forma

`CTR-16.5` lo dejó anotado al marcar el choque: si el nivel 1 se gana con uno en la puerta,
la condición de victoria deja de ser **la regla del juego** y pasa a ser **un campo por
nivel**, con su `if`/`then` y su verificación. Seis niveles pagando un parámetro para que el
primero sea más blando, y un escalón 1 que enseña una regla que el escalón 2 cambia.

### 4. Dónde vivía de verdad la blandura que yo estaba protegiendo

Y acá está lo que yo tenía mal, dicho sin vueltas: **confundí "no se puede perder" con "se
gana con uno".** Criterio 4 se escribió para que alguien que nunca jugó un plataformas no
quede expulsado en los primeros treinta segundos. Eso se protege sacando **lo que hace
perder** —el molinete, el mecanismo, la caja, el tramo con tiempo—, no sacando la regla.

**La puerta doble no es una dificultad: no se puede fallar en ella.** No devuelve a nadie a
la entrada, no tiene ventana de tiempo (`BR-25` c: es simultaneidad de presencia, no de
entrada) y no se pierde por llegar tarde — el primero espera parado y a salvo. Un nivel con
dos puertas, sin molinetes y con las dos puertas a la vista desde la entrada **no tiene un
solo estado de fracaso**, y sigue siendo el nivel más blando que este juego puede tener.
`UX-29` §7.1 ya le sacó el vacío a todos los niveles del sitio, así que ni siquiera queda la
caída.

### Lo que esto no cambia, para que nadie lo "arregle" de nuevo

- **`CTR-16.4` queda intacta.** Que el nivel 1 no tenga ningún molinete en su grilla no
  choca con que la **leyenda** declare los tres: la leyenda es del archivo entero y la
  grilla es de cada nivel. Nadie tiene que meterle un charco al nivel 1 para que el schema
  valide.
- **`CTR-16.5` reglas 1 y 2 quedan como están escritas.** No hace falta un campo por nivel,
  ni un `if`/`then`, ni una excepción. **`arquitectura` no tiene nada que cambiar por este
  hallazgo** — lo único que le pido es sacar el bloque que lo deja abierto y una
  verificación chica, y está en
  `Docs/SUGERENCIAS/PRD-para-arquitectura-find-59-cerrado-la-puerta-del-nivel-1.md`.
- **Qué personaje entra por qué lado, cuántos tiles separan cada entrada de su puerta y cómo
  se ve todo eso** no lo fija producto. Es de `experiencia` y del diseño del nivel.

---

## Piso de ítems: **seis niveles listos, 2 / 2 / 2** — confirmado

`IDEA-14` dejó esto como lectura y `BR-16` manda fijarlo al promover. **Se confirma el
número y se corrigen dos cosas de la lectura**, que es para lo que sirve fijarlo en vez de
copiarlo.

### Corrección 1 — se cuentan niveles **listos**, no niveles que existen

Con `D-40` adentro, un nivel que se pasa de a dos y no se pasa solo no es medio nivel: es
cero. El piso se cumple cuando **seis niveles pasan entero el control de `BR-25`**. Seis o
ninguno: si uno de los seis falla su planilla, el juego no cierra su ciclo, con el mismo
criterio de "ningún juego cierra por debajo de su piso" que usa la tabla de pisos de
`PRD-alcance-v1.md`.

### Corrección 2 — la cita de `BR-01` se precisa

La lectura decía *"`BR-01` exige tres escalones y un escalón de un nivel es un muro"*, y el
número está bien pero el motivo no era ese. `BR-01` punto 3 pide un mínimo de Fáciles para
que **"el primer ítem no sea siempre el mismo"** — y ese motivo acá **no existe**: en un
juego de niveles ordenados el primero es siempre el mismo a propósito, nadie sortea el
primer nivel de un plataformas. Lo que sí sostiene el dos por escalón es otra cosa, y
conviene decirla bien:

> **Un escalón de un solo nivel no deja lugar para fallar adentro del escalón.** El que no
> pasa el único nivel Fácil no tiene otro Fácil donde aprender, y el escalón se le
> convierte en muro — que es exactamente lo que `BR-01` existe para impedir. Dos por
> escalón es el mínimo que permite que el primero enseñe y el segundo confirme.

### Por qué seis y no más, ahora que hay arte

La hoja que trajo el usuario (`public/arte/skayboy_poligirl.png`, medida el 2026-09-16)
abarata el juego de verdad: seis poses por personaje —quieto de frente, quieto de perfil,
quieto mirando a la derecha, corriendo, saltando, cayendo— más dos retratos. **Pero no
llegó a cero.** No trae ciclo de caminata de varios cuadros, no trae derrota, no trae pose
de empujar (`RES-61.5`) y **no trae el estado visual del personaje en pausa que `D-40`
necesita** — que es la pieza sin la cual el camino del que juega solo no se puede ni
dibujar. El arte bajó de precio; el piso no sube por eso.

### Por qué seis y no menos

`BR-01` pide tres escalones y la corrección 2 pide dos niveles por escalón. Cinco rompe uno
de los dos.

### Qué enseña cada escalón

| Escalón | Niveles | Qué entra |
|---|---|---|
| **Fácil** | 1 y 2 | el 1 **no se puede perder** (criterio 4): las dos puertas, ningún molinete, ningún mecanismo. El 2 mete el **primer molinete propio** (`CTR-16.4`): hay terreno que devuelve a uno y no al otro, que es el motivo por el que son dos |
| **Media** | 3 y 4 | el mecanismo que uno abre para el otro: palanca, botón de presión o caja empujable (`RES-61.4`, `RES-61.5`). Acá entra también el **molinete que devuelve a los dos**, que es el único obstáculo que no se resuelve repartiéndose, y acá la paridad de `BR-23` empieza a ser contable |
| **Difícil** | 5 y 6 | **combinación de lo ya enseñado, sin mecanismo nuevo** |

**La regla del último escalón es de producto y no es una preferencia:** en el escalón
Difícil no entra un mecanismo que no se haya enseñado antes. Un mecanismo nuevo al final
cuesta arte nuevo **y** una segunda solución nueva para el que juega solo, y aparece justo
donde ya no queda nivel para enseñarlo — es la definición de muro, corrida al final de la
partida en vez de al principio.

### Lo que el piso no promete

Que los seis niveles entren en una sesión de dos o tres minutos. Lo que entra es un nivel
(criterio 9).

### Cómo se verifica que el piso está cumplido

Seis planillas de `BR-25`, una por nivel, **jugadas** — no leídas. Los cuatro roles que
escriben no tienen con qué correr eso (`D-12`), así que la corre `revisor`, `orquestador` o
el hilo principal, con el juego abierto en un teléfono en horizontal y después solo.

---

## BR-23 — La paridad de Poligirl

**Aplica a:** `US-09`, y a todo lo que se dibuje, se escriba o se programe de este juego.

**De dónde sale.** `D-38` baranda 3, textual: *"Poligirl no es la compañera de Skayboy"*,
con **paridad de peso, de pantalla y de agencia**. Y el sitio ya publica sobre
`la-negra-poli`, **rotulado `hecho`**, que fue *"no una colaboradora ni una acompañante: un
pilar, con el mismo rango que la voz y la guitarra"* (`RES-64.7`, `RES-64.8`). Si el juego
le da el papel de apoyo, **el sitio se contradice a sí mismo sobre una persona viva** — y
no en un rincón, sino en la pieza que va a circular por Twitter.

### Qué exige, en cosas que se pueden contar

1. **Agencia.** En cada nivel del piso que tenga mecanismos (escalones Media y Difícil),
   la cantidad de veces que Poligirl le abre paso a Skayboy y la inversa quedan parejas:
   **diferencia máxima de uno, contada sobre los seis niveles**. No es un adorno del
   diseño: es lo único de esta regla que se puede auditar sin discutir de tono.
2. **Pantalla.** Mismo alto de sprite, misma caja de colisión y misma cantidad de cuadros
   por estado. Ningún estado existe para uno y no para el otro.
3. **Legibilidad al tamaño al que se juega.** Las dos siluetas se reconocen igual de bien.
   El ensayo del 2026-09-11 midió que no era así —*"el sombrero y la SG le dan a Skayboy
   una silueta reconocible en miniatura; la mata de pelo de Poligirl se empasta"*
   (`public/arte/ensayo/README.md`)—. Con pixel art (`D-41`) el problema cambia de forma y
   no desaparece: **se vuelve a medir sobre la hoja nueva, antes de cortar los sprites.**
4. **Ninguno de los dos es carga del otro.** Ninguna mecánica convierte a un personaje en
   objeto que el otro levanta, empuja o transporta. Cajas sí (`RES-61.5`); personas no.
5. **Qué personaje vive en qué columna de mando no es un default.** *(Enmendado por `D-43`:
   este punto decía "el que arranca activo en el camino de uno solo", y con dos columnas
   fijas no arranca activo ninguno — el que no tiene un dedo encima está quieto, los dos por
   igual. Lo que queda por decidir es el lado, y sigue sin ser neutro: la izquierda es por
   donde se empieza a leer y es la que agarra la mano que sostiene.)* Y con el nivel 1
   enseñando las dos columnas (criterio 4), **el reparto es lo primero que aprende cualquiera
   que entre**. Es decisión de `experiencia`, y esta regla la obliga a **escribirla y
   fundamentarla**, no a dejarla como salió.

### Qué NO exige

**Simetría de habilidades.** El género existe justamente porque los dos personajes son
asimétricos: uno pasa por donde el otro no. Que sean distintos es la mecánica; que uno
valga menos es el defecto. Es la misma frase de `D-38` y no se relaja.

### La hoja de sprites del 2026-09-16 todavía no cumple el punto 2

Medido sobre el archivo: Skayboy trae **una guitarra suelta y dos retratos de perfil**;
Poligirl trae **un retrato y ningún objeto**. No es una acusación de nadie —es una hoja de
concepto, no un atlas— pero es exactamente la asimetría que esta regla existe para cazar, y
si se recorta tal cual queda escrita en el juego. Es de `experiencia` con quien produzca el
arte; queda dicho en
`Docs/SUGERENCIAS/PRD-para-experiencia-paridad-y-derrota-en-la-hoja-de-sprites.md`.

### Y una cosa que esta regla prohíbe aunque nadie la haya propuesto

**El juego no se apoya en ningún vínculo sentimental entre los personajes, bajo ningún
concepto** (`D-38` baranda 3, `RES-64.11`, que está rotulado **leyenda** y contradicho entre
dos medios grandes). Ni por mecánica, ni por texto, ni por una animación de festejo al
llegar juntos a la puerta. Llegan juntos porque el nivel se pasa de a dos, y eso es todo lo
que el sitio afirma sobre ellos.

---

## BR-24 — El fracaso no se narra como la muerte de Skay ni de Poli

**Aplica a:** `US-09`, todo su texto visible, toda su animación y todo su sonido.

**Por qué existe.** Un plataformas devuelve al jugador al principio del nivel decenas de
veces por partida. `D-38` baranda 3 prohíbe narrar la vida real de dos personas vivas;
`D-42` le puso **cara reconocible** a los muñecos y dejó escrito que con cara *"la pregunta
pesa más, no menos: un sprite con la cara de alguien muriéndose cuarenta veces por partida
es exactamente la clase de imagen que 'lo vean y les moleste' contempla"*. Y `RES-04` pone
la fecha que vuelve todo esto concreto: el Indio murió el 5-jun-2026, hace tres meses.
Nadie había decidido qué registro rige esto (`D-38` consecuencia 3). Se decide acá.

### Qué prohíbe

1. **Ninguna palabra visible del juego dice que el personaje murió**, ni sus equivalentes:
   *murió, muerto, morir, muerte, cadáver, te mataron, perdiste una vida, fin de la
   partida*. Tampoco "vidas" como contador.
2. **Ninguna imagen representa el cuerpo del muñeco muerto**: sin cuerpo tirado, sin
   lápida, sin sangre, sin alma que sube. (Y sigue vetado el par lobo/cordero como código
   de acierto/error — `public/arte/README.md`, que no se negocia acá.)
3. **No hay contador que se agote ni pantalla de fin de partida.** El fracaso devuelve al
   principio del nivel y nada más: sin costo acumulado y sin una pantalla intermedia que
   haya que despachar con un toque para poder seguir (`D-32` límite 3 — una pantalla que
   hay que sacarse de encima es un molinete con forma de animación, cuarenta veces por
   partida).
4. **El aviso, si existe, va en registro 3** (`voz-ricotera.md` §5): seco, sin chiste, sin
   suspensivos, sin jerga. Acá el sitio se saca la voz. No hay gracia que hacer sobre el
   fracaso de un muñeco con la cara de alguien que está vivo.
5. **El fracaso no toma prestado el grito del acierto** (`D-33`): ni el sonido, ni el
   movimiento, ni el tratamiento reservado. Es el reverso exacto de lo que `BR-22` le
   prohibió a `US-08`, entrando por la misma puerta de atrás.

### Qué **es** el fracaso, entonces

**No llegar.** El personaje que toca el terreno que no lo deja pasar vuelve a la entrada:
**se lo llevó el lugar, no lo mató nadie.** Es `D-32` aplicado a otra cosa —*el movimiento
es del lugar, no del elemento*— y acá el castigo también es del lugar.

> **Enmendado el 2026-09-16.** Este párrafo cerraba con *"el infierno quema y el cielo no
> sostiene"*, que es una imagen de daño con otra ropa. `UX-29` §7.2 lo resolvió mejor el
> mismo día y con el nombre del sitio adentro: **el terreno ajeno no lastima, te rechaza —
> es el molinete otra vez**, y por eso `CTR-16.4` llama `molinete` a lo que iba a llamarse
> `letal`. Efecto de arrastre que conviene: cielo e infierno dejan de ser premio y castigo.
> Son dos terrenos y ninguno de los dos mata a nadie. Los dos muñecos siguen enteros.

### Lo que esta regla no decide

**Qué se ve exactamente** cuando eso pasa. Eso es de `experiencia` (`D-38` consecuencia 3,
`D-42` precisión 2, que lo declara **bloqueante antes de animar la derrota**). Producto fija
qué no puede ser y en qué registro se habla.

---

## BR-25 — Cuándo un nivel está listo, que es distinto de que exista

**Aplica a:** cada uno de los seis niveles del piso de `US-09`.

Un nivel cuenta para el piso cuando cumple las seis condiciones. No hay niveles a medias:
uno que falla cualquiera de las seis vale cero.

**(a) Se pasa de a dos.** Dos personas moviéndose a la vez lo terminan. Verificado
jugándolo, no leyéndolo.

**(b) Se pasa solo.** *(Enmendado por `D-43`: decía "alternando con el botón de cambio".)*
Una sola persona lo termina **tocando una columna de mando y después la otra**, y el camino
de uno solo **está escrito al lado del nivel** — no "se puede", sino *así se hace*. Un nivel
sin su segunda solución documentada no cuenta para el piso aunque alguien haya logrado
pasarlo.

**(c) Ninguna acción exige que los dos personajes se muevan dentro de la misma ventana de
tiempo**, salvo que tenga una segunda solución que no lo exija (`D-40` consecuencia 1).
Acá está la prueba operativa que hace usable a esta condición:

> **La simultaneidad de presencia está permitida; la simultaneidad de entrada, no.**
> Que los dos tengan que estar parados en su puerta al mismo tiempo (`RES-61.2`) es
> **presencia**: el que llegó primero espera quieto, y el que juega solo lo cumple sin
> hacer nada especial. Que los dos tengan que saltar juntos, o que una plataforma solo
> aguante si los dos la pisan en el mismo segundo, es **entrada**: una sola persona no
> puede, y ahí el nivel se cierra por construcción.

**(d) Dejar quieto al que no tiene un dedo encima no lo pierde.** Es la trampa que la frase
"queda quieto donde lo dejaron" esconde, y no la vio ninguna ficha: si el personaje en pausa
queda sobre una plataforma que se mueve, sobre un molinete que lo devuelve a la entrada
(`CTR-16.4`), o en un lugar del que no se puede volver, el nivel **no** es resoluble solo,
aunque en teoría lo sea. El que espera queda **quieto y a salvo** —es la promesa que `UX-28`
§3 hace visible—, y eso se verifica dejándolo ahí mientras se juega el otro.

**(e) Se puede fracasar y reintentar sin costo** (`BR-24` punto 3).

**(f) La paridad se cumple y está contada** (`BR-23` punto 1): quién le abre paso a quién,
anotado por nivel para que la cuenta de los seis se pueda hacer.

**Cómo se prueba.** Una planilla por nivel con estas seis filas, jugada en un teléfono en
horizontal y después solo. La parte que sí puede mirar una máquina —que el dato del nivel
declare su segunda solución— la deja pedida
`Docs/SUGERENCIAS/PRD-para-arquitectura-el-nivel-declara-su-segunda-solucion.md`; el
mecanismo es de `arquitectura`, la exigencia es de acá.

---

## BR-26 — El pie de homenaje es un requisito de la pantalla, no un detalle de copy

**Aplica a:** `US-09` y a toda pieza de este juego que salga del sitio.

`D-42` precisión 1 lo dice sin rodeos: con cara reconocible, el pie **pasa de conveniente a
obligatorio**. Esta regla lo convierte en algo que se puede verificar.

### Qué tiene que decir

Tres cosas, y ninguna es opcional: **que es un homenaje de fans**, **que no es oficial**, y
**que ni Eduardo Beilinson ni Carmen Castro tuvieron nada que ver**. Con los nombres
completos y no con los apodos: el pie es justamente el lugar donde el sitio dice de quién
**no** es esto, y para eso sirve el nombre de la persona, no el seudónimo con el que juega
el muñeco (`RES-64.17`).

### En qué registro

**Registro 3, entero** (`voz-ricotera.md` §5): seco, sin imagen, sin chiste, sin
suspensivos, sin jerga y sin voz. Dice qué hay adentro y se calla. Un pie de homenaje con
onda es un pie en el que no se puede confiar, por el mismo motivo por el que un `LEYENDA`
con onda envenena el rótulo.

### Dónde

1. **En la pantalla del juego, visible sin tocar nada** (criterio 7 de `US-09`). No detrás
   de un `<details>`, no en una pantalla de créditos aparte.
2. **Impreso adentro de la pieza que se comparte** (`BR-27`). La imagen viaja sola por
   Twitter, sin el sitio alrededor: un pie que solo vive en la página no acompaña al dibujo
   a ningún lado. Es el mismo razonamiento con el que `US-08` metió el crédito de `D-21`
   adentro de la lámina en vez de dejarlo en el pie de la página.

### Qué no es

**No es un permiso ni un gate.** `D-14` no cambió: si algún día llega un reclamo, se baja y
listo. El pie es un **rótulo**, y vale lo mismo que un `LEYENDA`: dice la verdad sobre lo
que hay adentro.

**El texto exacto es de `contenido`** (`CNT-17`+). Acá se fija qué tiene que decir, en qué
registro y dónde tiene que estar; no las palabras.

---

## BR-27 — Qué se comparte al terminar, y quién firma

**Aplica a:** `US-09`. Contesta el punto 8 de la lista de `IDEA-14`, que nadie había
preguntado: qué comparte un plataformas, y si la tarjeta la firma una persona o dos.

### 1. Este juego no tiene puntaje, y el rango por letra no entra

El juego de origen puntúa con rango A/B/C/D, que exige terminar bajo un tiempo objetivo
**y** haber juntado todo (`RES-61.8`). **No entra a la v1 de este juego**, por dos motivos
de distinto peso:

- El umbral no se puede copiar de ningún lado: `RES-61.8` dejó verificado que el número que
  circula pertenece a otra entrega y que **no hay fuente para el de las primeras**. Sería
  puro trabajo de tuning y, peor, un número inventado presentado como medida.
- Y el que importa: **un puntaje por tiempo castiga estructuralmente al que juega solo.**
  Alternar personajes es más lento que ser dos, siempre. Un cronómetro convertiría el
  camino que abrió `D-40` en el camino de segunda — que es, aplicado a los modos, el mismo
  defecto que `BR-23` prohíbe para los personajes. Las dos puertas valen igual o `D-40` no
  sirvió de nada.

### 2. Lo que la pieza dice

**Hasta dónde llegó y de qué manera jugó.** El número grande es el nivel alcanzado sobre
los seis; al lado, si jugó **solo** o **de a dos**. Nada más: sin nota, sin porcentaje, sin
rango, sin comparación contra otro jugador y sin promedio de nadie. Si el tiempo se muestra,
va chico y nunca como titular, y **nunca comparando los dos modos** — mismo criterio con el
que `BR-18` apartado b sacó la cifra cruda del titular del ranking.

### 3. Se comparte aunque no haya terminado

Un jugador que dejó en el tercer nivel comparte igual, y la pieza lo dice sin reproche. No
se exige terminar los seis para habilitar el botón: exigirlo sería un molinete nuevo
(`D-14`), el mismo que `US-08` criterio 2 ya cerró para la bandeja sin ubicar.

### 4. La tarjeta no firma a nadie — y eso contesta la pregunta de la firma

La pregunta abierta era si la firma una persona o dos. **La respuesta es ninguna.** El
sitio no tiene jugador como entidad y no lo va a tener: `D-15` cerró las cuentas y `D-14`
las nombra como molinete, e `IDEA-13` dejó escrito que si alguna vez existe un "jugador"
entra por una puerta angosta que nadie abrió todavía. Pedir un nombre para firmar la
tarjeta es pedirle algo al jugador **para salir**, que es igual de cerrado que pedírselo
para entrar.

Lo que sí puede decir la pieza es **de qué manera se jugó** —solo o de a dos—, que es un
hecho de la partida y no una identidad. El que la recibe entiende que fueron dos sin que
nadie escriba dos nombres.

### 5. Lo que va impreso adentro sí o sí

El pie de homenaje (`BR-26`) y el crédito que ya corresponda por lo que la pieza muestre
(`D-21` si aparece una tapa; el crédito de la música vive en el pie del sitio por `D-35` y
`UX-26`, no lo duplico acá).

### 6. Lo que no decide esta regla

Si la pieza reusa `src/lib/tarjeta/plan.ts` o es un módulo propio. Dato al costado para
quien lo decida: ese módulo tiene `MAX_FILAS = 6` fijo —los seis niveles del piso entran
justo— y un campo `hero` que ya es deliberadamente agnóstico ("no `tiempo`"), así que un
`hero` que sea el nivel alcanzado no lo viola. Pero `US-08` necesitó módulo propio por una
razón parecida y no fue un drama. Es de `arquitectura` con `experiencia`; queda anotado en
`Docs/SUGERENCIAS/PRD-para-arquitectura-el-nivel-declara-su-segunda-solucion.md`.

---

## Qué NO entra a este juego, y por qué

### No entran los mecanismos de las entregas 2 a 5 del juego de origen

Espejos y rayos de luz, portales, hielo con fricción distinta por personaje, ventiladores
(`RES-61.12` a `RES-61.15`). El set de la primera entrega —charcos de los tres tipos,
palancas y botones, cajas, puerta doble— alcanza para seis niveles, y cada entrega suma sin
reemplazar, así que esto es ampliación de un ciclo posterior y no bloqueo.

**Y acá el costo de un mecanismo es doble:** son piezas de arte **y** una segunda solución
para el que juega solo (`D-40`). Lo que en el juego de origen era "un mecanismo más", acá es
dos.

### No entra el coleccionable como condición

El juego de origen tiene diamantes opcionales por nivel (`RES-61.7`) y este proyecto ya
tiene el ancla escrita para el suyo — «Juguetes perdidos», *"un par de sienes ardientes /
que son todo el tesoro"* (`IDEA-14`). **No entra al piso**: que exista o no es una decisión
de arte, no de alcance. Lo que sí fija producto: **si existe, no puede ser condición para
pasar el nivel ni para compartir.** Un coleccionable obligatorio es precisión fina
convertida en requisito, y eso choca de frente con `D-09` y con los molinetes.

### No entra un segundo aparato

Dos personas en **un** teléfono. El multijugador por red está fuera de alcance del brief y
quedó descartado con fundamento doble (`RES-65.9`). No toca "sin backend" y conviene
dejarlo escrito para que nadie lo levante como bloqueo.

### No entra un séptimo nivel a cuenta del piso

Seis es piso, no techo. Pero un séptimo nivel no cuenta para declarar listo el juego: si hay
tiempo de sobra, primero se cierran los seis con `BR-25` completo.

### Y no se escribe, en ningún lado, el nombre del juego de origen

`RES-60`: ni en texto visible, ni en metadata, ni en comentarios del código, ni en nombres
de archivo. Es lo único de todo el relevamiento legal que quedó sin fisuras.

---

## BR-28 — El noveno juego espera al escalón fácil del segundo

**Aplica a:** el alcance del sitio, no a `US-09`.

**El estado, dicho de frente, que es mi trabajo y no el de nadie más.** `US-02` ("Adiviná
el tema") tiene su piso de 30 temas cumplido con 95, y **0 de los 8 ítems Fáciles** que ese
mismo piso le exige. El motivo está declarado y no es desidia: falta la `YT_API_KEY`, y
`BR-18` apartado g dejó escrito que **no la puede traer ningún rol** — el mecanismo está
puesto, la fórmula está fijada, y el día que haya mediciones los ocho aparecen solos.
Skayboy y Poligirl es **el juego número ocho con el segundo así**. Que el ciclo 15 exista no
lo tapa.

**Qué hago con eso, y qué no.**

1. **No lo reabro y no lo uso como veto.** `BR-18` apartado g decidió que la cuota sin medir
   no frena el "Listo" de la v1, con un argumento propio —`US-02` tiene una segunda rampa
   adentro de cada ítem: errar abre más audio en vez de cerrar la puerta— y con tres
   condiciones que se verifican corriendo tests. Ninguna de las tres se cayó. Abrir el
   octavo juego no cambia ninguna de las tres.
2. **Pero el costo de no tenerlo sube con cada juego nuevo, y eso sí es mío.** Cuando se
   escribió el apartado g, lo que estaba en juego era *"un juego de la v1 sin su escalón
   fácil"*. Hoy es lo mismo con siete títulos alrededor tapándolo, y el riesgo 4 del brief
   no se mide por juego: se mide por sitio. Ocho frentes abiertos y uno de los cuatro de la
   v1 incompleto es exactamente la forma que tiene ese riesgo cuando se cumple.
3. **El punto de control, que es lo único accionable que puedo escribir.** Si al cerrar el
   ciclo 15 `US-02` sigue en 0 de 8 Fáciles, **el ciclo siguiente no abre un noveno juego**
   antes de que pase una de estas dos cosas:
   - **la clave llega** y las cifras se cargan (`BR-18` apartados c y f: dueño
     `arquitectura` para los `videoId`, `contenido` para el criterio de video declarado, el
     usuario para la credencial); **o**
   - **se decide por escrito que no va a llegar** y se retira la cuota de 8 Fáciles de
     `US-02` con una decisión que la reemplace — no con silencio. Cuesta un documento, y es
     honesto: hoy el sitio tiene una promesa escrita que nadie puede cumplir.

   Lo que **no** es esta regla: un veto a `US-09` ni a ningún juego que el usuario pida. Es
   orden de construcción, que es de `producto`, y tiene salida por las dos puertas.

---

## `D-05` no se toca

El "Listo" de la v1 sigue siendo cuatro juegos: quiz, adivinar el tema, completar la letra,
adivinar la tapa. Skayboy y Poligirl es el octavo título del sitio —después de la
Redondopedia (`US-05`), los dos ejes (`US-06`), Sacalo por la letra (`US-07`) y Ponelos en
fila (`US-08`)—, construible y publicable sin esperar a nada, y fuera del contrato que
define si la v1 está lista.

---

## PENDIENTE

- **Lo que esta historia no fija y tiene dueño con ID reservado:** el motor 2D y el schema
  del nivel (`ADR-08`/`CTR-15`, `arquitectura`, con el orden de `RES-62` ya servido: Kaplay,
  LittleJS, Phaser pineado a 3.90.0); los efectos de sonido, que `D-39` **no** cubre
  (`arquitectura`); la pantalla, las dos zonas de pulgar, la convención de sprites en
  `public/arte/README.md`, qué se ve al fracasar y cómo entra el que llega solo —que `UX-28`
  contestó disolviendo la pregunta, y `D-43` fijó— (`UX-27`+, `experiencia`); el nombre del juego, el texto del pie de homenaje y el tema que
  suena (`CNT-17`+, `contenido`, con el usuario confirmando el nombre). Los tres traspasos
  quedaron escritos: `Docs/SUGERENCIAS/PRD-para-experiencia-paridad-y-derrota-en-la-hoja-de-sprites.md`,
  `Docs/SUGERENCIAS/PRD-para-arquitectura-el-nivel-declara-su-segunda-solucion.md` y
  `Docs/SUGERENCIAS/PRD-para-contenido-pie-de-homenaje-y-palabras-vetadas.md`.
  **Al 2026-09-16 llegaron cuatro de esos dueños** (`ADR-08`, `CTR-15`..`CTR-17`,
  `UX-27`..`UX-30`) y el que falta entero es `contenido`. El cuarto traspaso, el de
  `FIND-59`, es
  `Docs/SUGERENCIAS/PRD-para-arquitectura-find-59-cerrado-la-puerta-del-nivel-1.md`.
- **Lo que el fracaso le cuesta al reloj, y si hay tope. Es mío y no lo cierro en esta
  enmienda.** `UX-29` §4 sacó las vidas —lo que se gasta es tiempo— y dejó escrito que
  *"cuánto vale exactamente, y si hay tope, es de `producto`"*. Lo digo acá para que no se
  pierda, y con el aviso de que **arrastra a `BR-27`**: esa regla dice que si el tiempo se
  muestra va chico y nunca como titular, y `UX-28` §7 propone justo lo contrario —el reloj
  como número grande de la tarjeta—. **No es un choque todavía**, porque `UX-28` lo deja
  como candidato y no como decisión, y `REV-14` no lo levantó. Pero es la misma pregunta
  mirada desde dos lados y la contesto yo, con `experiencia`, antes de que se dibuje la
  tarjeta. El motivo de `BR-27` sigue intacto mientras tanto: un reloj en el titular castiga
  al que juega solo, que es más lento siempre.
- **La discrepancia entre el arte y la ficha, que no resuelvo yo.** La hoja de sprites
  rotula *"Sombrero Fedora"* y `RES-64.3` fichó un **Panamá beige**. No es un detalle de
  estilo: es el rasgo por el que `D-38` baranda 2 dibujaba al personaje, y el sitio tiene
  una ficha que dice otra cosa que el dibujo. Dueños: `experiencia` para el arte,
  `investigador` si hay que rehacer la ficha. Nombrada en
  `Docs/SUGERENCIAS/PRD-para-experiencia-paridad-y-derrota-en-la-hoja-de-sprites.md`.
- **Cuánto dura un nivel, medido y no citado** (`INV-60`, "Sin resolver": dos versiones que
  no se promedian). Es lo que decide si el criterio 9 se cumple de verdad. Dueño:
  `experiencia`.
- **El contraste adentro del área de juego.** `contraste.test.ts` mide pares declarados en
  CSS y acá el fondo es un tileset (`D-41` consecuencia 3, y el hallazgo 2 del ensayo del
  2026-09-11). Sin vara corrible. Dueño: `experiencia`, como el velo plano de `D-21`.
- **La deuda que abrió `D-39`** —`dos-ejes` pidió la misma excepción con el mismo argumento
  y se la negaron— sigue anotada en las consecuencias de esa decisión. No es de esta
  historia, pero el noveno juego la va a encontrar.
- **No toqué `ESTADO.md`.** El ciclo 15 corre con varios roles escribiendo en paralelo
  (`Docs/IDS.md`, fila del 2026-09-16) y ese archivo es de raíz: lo actualiza quien cierre
  la ráfaga, no cada rol por su cuenta.
- **No toqué `PRD-alcance-v1.md`.** `US-09` no entra a la tabla "Piso de ítems — resumen"
  por el mismo motivo por el que no entraron `US-06`, `US-07` ni `US-08`: esa tabla dice de
  sí misma que es la de los cuatro juegos de `D-05`. Lo único que ese archivo podría querer
  algún día es una mención de este en la lista de frentes fuera del contrato de cuatro.
