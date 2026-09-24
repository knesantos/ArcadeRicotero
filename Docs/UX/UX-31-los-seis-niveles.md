# UX-31 — La gramática de los seis niveles

> Rol dueño: `experiencia`. Ciclo 16, 2026-09-22.
>
> **Consume:** `Docs/PRODUCTO/PRD-skayboy-y-poligirl.md` — `US-09` entero (criterios 1 a 9,
> `FIND-59`), "Piso de ítems" (2/2/2, "qué enseña cada escalón"), `BR-23` (paridad, punto 5
> sobre la columna de mando), `BR-24` (el fracaso no narra), `BR-25` (las seis condiciones
> de un nivel listo, sobre todo (c) simultaneidad de presencia no de entrada y (d) el que
> espera está a salvo). `Docs/ARQ/ARQ-schema-niveles.md` — `CTR-16.4` (la leyenda, y el
> reparto `C`/`I`/`X` sin declarar que este documento cierra), `CTR-16.5` (un nivel, las dos
> reglas de composición), `CTR-16.6` (`sostenido`, `alternativaSolo`), `CTR-16.9` (lo que el
> contrato deja abierto a `experiencia`), y **`CTR-16.10`** (`T-264`, cerrado el mismo día en
> paralelo — citado al revisar esta tarea, en `§2`: los caracteres reales de palanca,
> placa y compuerta, y que ninguna pieza tiene reloj; y en `§5`, corregida contra la versión
> anterior de esta tarea: `CTR-16.10.8` fija que los cuatro mecanismos van en la clave y la
> luz, no en una rampa de terreno). `src/lib/skayboy/mundo.ts` (`TILE=16`,
> `CAJA_ANCHO×CAJA_ALTO = 10×20`, `VELOCIDAD=88 px/s`, `IMPULSO_SALTO` da ~40 px de salto,
> `ALCANCE_ALTO_TILES=2`, `ALCANCE_HUECO_TILES=3`, la sala es cerrada — `frena()` trata
> "afuera de la grilla" como pared). `src/data/skayboy.json` (`NIV-01`, la grilla real de
> 15 × 9, la leyenda cargada). `Docs/UX/UX-27-la-convencion-del-pixel.md` (la grilla, la
> paleta de 15, `§5.2` — ningún estado solo por color), `Docs/UX/UX-28-la-pantalla-y-las-dos-puertas.md`
> (las dos columnas de mando, el que espera de frente, `§6` el techo de duración),
> `Docs/UX/UX-29-el-fracaso-no-es-la-muerte.md` (`§7.1` sala cerrada sin vacío, `§7.2` el
> terreno rechaza — no mata), `Docs/UX/UX-30-cielo-e-infierno-en-la-mezcla.md` (`§3`, quién
> camina qué y por qué no se explica). `Docs/DECISIONES.md`: `D-40`, `D-43` (no hay botón de
> cambio — cada columna maneja siempre al mismo personaje).
>
> **Resuelve:** la gramática de contenido de `NIV-01`..`NIV-06` — qué enseña cada uno, el
> reparto explícito de `devuelve` (cielo/infierno declarados con nombre), qué se ve desde la
> entrada, la paridad programada, la duración objetivo y la columna de mando que `BR-23`
> punto 5 pide fundamentar. **No resuelve:** el schema de los mecanismos (`CTR-16.10`, de
> `arquitectura` — cerrado y consumido, no una decisión propia), la grilla final tile a tile
> (`T-277`, con el solucionador de `T-266` en la mano) ni los nombres de nivel (`CNT-21`,
> `contenido`). Los bocetos de este documento son **provisorios**, y se dice así cada vez que
> corresponde.

---

## 1. La columna de mando: quién es quién, y por qué (`BR-23` punto 5)

`BR-23` punto 5 obliga a que esta decisión se escriba y se fundamente, no a que se herede
de un default. `UX-28 §2` deja las dos columnas fijas — izquierda y derecha, cada una
maneja siempre al mismo personaje (`D-43`) — pero no dice cuál personaje va en cuál lado.
Se fija acá, y no se edita `UX-28` para no cruzar `T-261`, que lo está tocando en paralelo.

> **Skayboy: columna izquierda. Poligirl: columna derecha.**

**El fundamento no es arbitrario: ya estaba escrito en el dato.** `CTR-16.2` lista a
Skayboy primero en `personajes`, la leyenda numera su entrada `"1"` antes que la de Poligirl
`"2"`, y `mundo.ts` documenta `PERSONAJES` como *"el orden en que se reparten las columnas de
mando"* con Skayboy primero. Y en el único nivel que existe hoy (`NIV-01`), la entrada y la
puerta de Skayboy (`1`, `A`) ya caen del lado izquierdo de la grilla y las de Poligirl
(`2`, `B`) del lado derecho — nadie lo decidió a propósito todavía, pero es lo que hay.

Este documento **fija esa coincidencia como regla de los seis niveles**: en cada uno, la
entrada y la puerta de Skayboy caen en la mitad izquierda de la grilla (columnas 0 a 6) y
las de Poligirl en la mitad derecha (columnas 8 a 14), y la columna de mando espeja el lado
de la pantalla. Dos motivos, y el segundo es el que pesa:

1. Encaja con `BR-23` punto 5 tal como quedó escrito: *"la izquierda es por donde se
   empieza a leer y es la que agarra la mano que sostiene"* — Skayboy ya era el primero en
   leerse.
2. **El control queda del mismo lado que el cuerpo en pantalla.** El pulgar izquierdo mueve
   lo que se ve a la izquierda, sin que nadie tenga que aprenderlo — es la misma economía de
   `UX-28 §3` (de perfil el que juega, de frente el que espera): la forma le ahorra al
   jugador una traducción.

No es una jerarquía. `BR-23` es clara en que esto **no** exige simetría de habilidades y
esto tampoco la introduce: es únicamente de qué lado de la pantalla vive cada uno, y los
tres colores de personaje de `UX-27 §4` siguen siendo 3 y 3.

---

## 2. La leyenda del boceto: `CTR-16.4` más cuatro caracteres provisorios

Los doce caracteres de `CTR-16.4` ya están cargados en `src/data/skayboy.json` y se usan
tal cual. Se cierra acá algo que la verificación del ciclo 15 marcó como no escrito en
ningún lado: **`C` es cielo, `I` es infierno.** La inicial coincide a propósito —así la
leyenda se lee sola— pero lo que manda es el campo `devuelve`, no la letra:

| Caracter | Tipo | Devuelve a | Terreno (`UX-30 §3`) |
|---|---|---|---|
| `C` | `molinete` | Skayboy | **cielo** — Poligirl lo camina, a Skayboy lo rechaza |
| `I` | `molinete` | Poligirl | **infierno** — Skayboy lo camina, a Poligirl lo rechaza |
| `X` | `molinete` | los dos | ninguno lo camina; no se resuelve por reparto |

Cuatro caracteres más para los mecanismos de `CTR-16.10`. **Nota agregada al cerrar esta
tarea, en la misma ráfaga:** cuando se escribió el párrafo de abajo, `CTR-16.10` (`T-264`)
todavía no había cerrado y el schema solo tenía `=` (mecanismo genérico, con un booleano
`sostenido` para distinguir palanca de placa) y `n`. Eso ya no es así: `CTR-16.10` está
vigente y trajo los caracteres reales — `/` (palanca), `=` (placa, que **cambió de
significado**: ya no es "mecanismo genérico") y `\|` (compuerta) — y con ellos se fue el
campo `sostenido`: ahora lo dice el caracter de la grilla, no un booleano del arreglo
(`CTR-16.6`, enmendado). **Los bocetos de `§3` siguen usando `P`/`L`/`G` sin renombrar** —no
vale la pena tocar seis grillas provisorias para una traducción mecánica antes de que
`T-277` las cargue con el solucionador en la mano—, así que la tabla de abajo queda como
diccionario de esa traducción, no como estado del schema:

| Caracter de este boceto | Qué representa | Caracter real (`CTR-16.10`) |
|---|---|---|
| `P` | palanca — **no** "dispara y queda para siempre": queda para el lado que la cruzás caminando, hacia la derecha activa y hacia la izquierda vuelve a reposo; saltarla por arriba no la mueve (`CTR-16.10.2`). Enmendado el 2026-09-23: ver el aviso de abajo | `/` |
| `L` | placa de presión — abre mientras algo pesa encima, cuerpo o caja (`CTR-16.10.3`) | `=` |
| `G` | compuerta — sólida mientras está cerrada, aire cuando la abren, sin un tercer estado (`CTR-16.10.4`) | `\|` |
| `n` | caja empujable | `n` — ya era el mismo caracter, no cambió |

> **Enmendado el 2026-09-23 (ciclo 16, ráfaga 1), y falso en la versión anterior de esta
> fila.** Acá decía que la palanca "dispara y queda abierta para siempre" y que "nadie tiene
> que quedarse parado ni volver a tocarla", citando `CTR-16.10.2` como si lo confirmara.
> `CTR-16.10.2` dice lo contrario, textual: *"queda para el lado que la cruzaste caminando:
> hacia la derecha, activa; hacia la izquierda, en reposo; saltarla por arriba no la mueve."*
> Es **direccional y reversible**, no un disparador de un solo sentido: si el mismo cuerpo
> vuelve a cruzarla caminando hacia la izquierda, la palanca vuelve a reposo y, si nada más la
> sostiene, la compuerta que mandaba abierta se cierra (salvo que alguien esté adentro,
> `CTR-16.10.4`). Los seis bocetos de `§3` estaban escritos sobre la lectura vieja y dos de
> ellos (`NIV-03`, y por herencia el patrón que copiaban `NIV-05`/`NIV-06`) hacían que el
> propio personaje que disparaba la palanca la volviera a cruzar hacia la izquierda de camino
> a su propia puerta, deshaciendo lo que acababa de hacer. Quedan rediseñados en `§3` para que
> ningún camino de una persona sola vuelva a cruzar su propia palanca antes de que el otro la
> haya usado. **Esto NO cierra sin cambios el traspaso**
> `Docs/SUGERENCIAS/UX-para-arquitectura-lo-que-los-seis-niveles-necesitan-de-CTR-16.10.md`
> — ese archivo queda enmendado por separado el mismo día, porque decía lo mismo que acá.

**Lo que este diseño necesitaba que `CTR-16.10` garantizara, y está confirmado con la
lectura correcta:** que una compuerta cerrada frene como un sólido y abierta deje de frenar
del todo, sin un tercer estado (`CTR-16.10.4`) — eso sigue en pie tal cual. Lo que **no**
estaba confirmado, porque la versión anterior de esta sección lo pedía mal, es que la
palanca quedara disparada para siempre: no lo hace, y los niveles de abajo ya no cuentan con
eso.

---

## 3. Los seis niveles

Los bocetos son **ilustrativos, no validados por el solucionador.** Muestran la intención
—qué enseña, quién abre para quién, dónde son los saltos— con coordenadas de grilla
razonables. La grilla que se carga de verdad, tile a tile, la arma `T-277` con `T-266` (el
solucionador) en la mano; si una traza no cierra, ahí se corrige el boceto, no acá.

Convención de las grillas: 15 columnas (0–14) × 9 filas (0–8). Fila 0 y fila 8 son pared.
Los marcadores (entrada, puerta, mecanismo, molinete) viven en la fila de piso y se paran
sobre la fila de abajo, que es sólida salvo donde el boceto marca un hueco a propósito.

### NIV-01 — Fácil 1: hay dos, y la puerta es doble

**Qué enseña (una sola cosa):** que el juego se maneja con dos columnas y se gana cuando
los dos personajes están, a la vez, cada uno en su puerta. Es todo el tutorial que este
juego tiene (`FIND-59`, `US-09` criterio 4).

**Qué entra:** dos entradas, dos puertas, dos coleccionables opcionales. Nada de lo que
rechaza a nadie: ningún molinete, ningún mecanismo, ninguna caja.

**Reparto de `devuelve`:** ninguno. Es el único nivel del piso sin un solo molinete en la
grilla — la leyenda los declara para el archivo entero, la grilla de este nivel no usa
ninguno.

**Qué se ve desde la entrada:** las dos puertas, a la vista, sin nada que las tape —
`US-09` criterio 4 lo exige con nombre. Distancia entrada→puerta: **4 tiles** para cada
uno. Ningún salto: alcance usado, 0 de 2 (alto) y 0 de 3 (hueco). Bien lejos del límite.

**El camino de una persona sola:** entra primero cualquiera de los dos — no importa el
orden, es simétrico. Se mueve a Skayboy hasta su puerta A; ahí queda parado, sin dedo
encima, sobre piso llano y sin ningún molinete a la vista (`BR-25` d). Se cambia de columna,
se mueve a Poligirl hasta B, y con los dos en su puerta el nivel se da por pasado.

**Paridad:** no aplica — sin mecanismos, no hay nada que contar (`BR-23.1` habla de
niveles con mecanismos).

**Boceto** (es el nivel real, ya cargado en `src/data/skayboy.json`; no es un boceto nuevo):

```
###############
#.............#
#.............#
#.............#
#.............#
#.............#
#.............#
#A.o.1...2.o.B#
###############
```

### NIV-02 — Fácil 2: el terreno tiene bando

**Qué enseña (una sola cosa):** que hay piso que rechaza a uno y no al otro — el motivo
concreto de por qué son dos (`CTR-16.4`, lectura de la tabla de escalones).

**Qué entra:** las dos entradas y puertas de siempre, y por primera vez `C` e `I` en la
grilla. Ningún mecanismo todavía.

**Reparto de `devuelve`:** un tramo de infierno (`I`) cerca de la zona de Skayboy —lo
camina sin problema— y un tramo de cielo (`C`) cerca de la de Poligirl —ídem—, visibles
desde el centro de la sala pero **fuera del camino corto de cada uno a su propia puerta**.
Nadie necesita cruzarlos para ganar: están para que se descubran tocando, no para bloquear.
Es la misma lógica que `D-09` pide siempre — el molinete se aprende jugando, no leyendo.

**Qué se ve desde la entrada:** las dos puertas, a la vista, igual que en `NIV-01` —sigue
siendo Fácil—. Distancia entrada→puerta: **2 tiles** para cada uno (más corta que `NIV-01`,
porque lo nuevo que hay que absorber es el terreno, no la distancia). Alcance usado: 0 y 0.
Lejos del límite.

**El camino de una persona sola:** igual que `NIV-01` — cada uno a su puerta por el camino
corto, sin tocar el terreno ajeno porque no hace falta. El que espera queda en su puerta,
piso llano, sin molinete debajo.

**Paridad:** no aplica.

**Boceto:**

```
###############
#.............#
#.............#
#.............#
#.............#
#.............#
#.............#
#A.1..I.C..2.B#
###############
```

### NIV-03 — Media 1: un mecanismo le abre paso al otro

**Qué enseña (una sola cosa):** que alguien puede activar algo para que el otro pase por
donde antes no podía. Se introduce la palanca —la que no pide quedarse parado: se cruza una
vez, hacia la derecha, y queda activa hasta que alguien la vuelva a cruzar hacia la
izquierda (`CTR-16.10.2`)— porque es la más simple de las dos formas de mecanismo.

**Qué entra:** una palanca (`P`) y una compuerta (`G`), más `I` y `C` de `NIV-02`
reutilizados como paisaje, en el hueco central que nadie necesita cruzar (ya aprendidos, no
vuelven a enseñar nada).

**Reparto de `devuelve`:** igual que `NIV-02`, de fondo.

**Qué se ve desde la entrada:** ya no las dos puertas completas — la de Poligirl queda
detrás de la compuerta cerrada, que se ve pero no se cruza todavía. Distancia
entrada→puerta: Skayboy 4 tiles (pasa por la palanca de camino a la suya), Poligirl 4 tiles
una vez abierta la compuerta. Ningún salto: alcance 0 y 0.

**El camino de una persona sola:** entra primero Skayboy. Camina **hacia la derecha** desde
su entrada hasta la palanca (`P`) y la cruza en ese sentido — queda activa, y con ella la
compuerta de Poligirl mandada abierta (`CTR-16.10.2`) — y sigue, sin volver atrás, hasta su
puerta A, que queda más allá de la palanca. Ahí espera, sobre piso llano y sin ningún
molinete cerca. **No vuelve a cruzar la palanca en ningún momento de este camino**, así que
la compuerta de Poligirl sigue mandada abierta cuando le toca a ella. Se cambia de columna y
se mueve a Poligirl, que cruza la compuerta abierta hasta B.

**Paridad de este nivel:** Skayboy le abre paso a Poligirl. **1–0.**

**Boceto** (rediseñado el 2026-09-23: en la versión anterior, la puerta A quedaba del lado
opuesto de la palanca respecto de la entrada, y para llegar a ella Skayboy tenía que volver
a cruzar la palanca hacia la izquierda — desactivándola antes de que Poligirl pasara. Y la
compuerta no quedaba entre la entrada y la puerta de Poligirl, así que no le bloqueaba nada.
Las dos cosas se corrigen acá: la puerta A queda más allá de la palanca en el mismo sentido
de cruce, y la compuerta queda entre la entrada y la puerta de Poligirl. **Segunda corrección
el mismo día:** la compuerta era una sola celda con aire arriba, y `CTR-16.10.4` pide un
tramo de sólido a sólido — lo señaló el traspaso de `arquitectura`,
`Docs/SUGERENCIAS/ARQ-para-experiencia-los-bocetos-contra-las-reglas-de-la-sala.md`, punto
2. Ahora la columna 11 es pared desde la fila 1 hasta la fila 6, con la compuerta en la fila
7, apoyada en el borde de la fila 8: nadie puede saltarla por arriba, y abrirla no le saca el
piso a nadie parado encima porque no hay dónde pararse encima):

```
###############
#..........#..#
#..........#..#
#..........#..#
#..........#..#
#..........#..#
#..........#..#
#1.P.A.IC2.G.B#
###############
```

**Nota agregada el 2026-09-24 (`T-294`, corrige `FIND-74`).** El traspaso de `T-277`
(`Docs/SUGERENCIAS/HILO-para-experiencia-los-seis-niveles-contra-el-solucionador.md §1`)
carga la grilla final de este nivel con un ladrillo en `[9, 7]`, pegado a la puerta de
Poligirl — no en `[6, 7]`, junto a la de Skayboy, que es donde lo ponía la versión anterior
de ese boceto. Ese traspaso decía que el ladrillo en `[6, 7]` "tampoco sirve ahí, medido:
5", pero esa medición corre sobre la traza de **tres** turnos que quedó grabada —Skayboy
frena "a un paso" de `A` sin necesitar nada contra qué frenar, y da el último paso recién
al final—. Con la traza de **dos** turnos, en la que Skayboy camina derecho hasta `A` y
frena contra lo primero que encuentra, el ladrillo en `[6, 7]` sí sirve — el mismo motivo
por el que sirve en `[9, 7]` para Poligirl (punto 4 de `§0` del traspaso: "alguien tiene
que llegar primero a su puerta y frenar ahí"). **La versión cierta: `[9, 7]` fue una
elección entre dos lugares igual de válidos para dar tolerancia, no una obligación que la
medición impusiera.** Ninguno enseña algo distinto del otro —los dos son "algo contra qué
frenar, pegado a una puerta"—, así que la elección no mueve la columna "Qué enseña" de este
nivel.

### NIV-04 — Media 2: lo que hace falta sostener, y lo que no perdona a nadie

**Qué enseña (una sola cosa):** que hay una forma de mecanismo que necesita peso quieto
—y una caja lo reemplaza para que nadie quede sacrificado sosteniendo nada— **y** que hay
terreno que no le perdona a ninguno de los dos (`X`), así que ahí no sirve turnarse. Se
cuentan como una sola idea porque las dos dicen lo mismo desde ángulos distintos: no todo
se resuelve repartiéndose.

**Qué entra:** una placa (`L`), una caja (`n`), una compuerta (`G`), y la primera aparición
de `X` — el molinete que devuelve a los dos.

**Reparto de `devuelve`:** `C`/`I` de fondo, más `X` en el medio de la sala, visible y
evitable por los dos sin necesidad de cruzarlo (todavía no hace falta — eso llega recombinado
en Difícil).

**Qué se ve desde la entrada:** la puerta de Skayboy queda detrás de una compuerta cerrada;
la de Poligirl, a la vista. Distancia entrada→puerta: Poligirl 3 tiles (pasa por la caja de
camino), Skayboy 2 tiles una vez abierta la compuerta.

**El camino de una persona sola:** entra primero Poligirl. Camina contra la caja (`n`) y la
empuja un tile hasta que tapa la placa (`L`) y la deja abierta —es el ejemplo textual de
`CTR-16.6`, "la caja tapa la placa y la deja abierta"—, salta por encima de la caja ya
trabada y sigue hasta su puerta B. La caja se queda haciendo el trabajo, así que nadie tiene
que sacrificarse parado ahí. **Ahí espera, sobre piso llano y lejos de `X` y de cualquier
otro molinete.** Se cambia de columna y Skayboy cruza la compuerta ya abierta hasta A.

**Paridad de este nivel:** Poligirl le abre paso a Skayboy. **0–1.**

**Boceto** (rediseñado el 2026-09-23: en la versión anterior la compuerta quedaba más cerca
de la pared que la puerta de Skayboy, así que no le bloqueaba el paso; y la placa quedaba
antes que la caja en el sentido en que Poligirl entra, así que empujar la caja la alejaba de
la placa en vez de taparla. Las dos se corrigen: la compuerta ahora queda entre la entrada y
la puerta de Skayboy, y la caja queda antes que la placa en el sentido de entrada de
Poligirl. **Segunda corrección el mismo día, mismo motivo que `NIV-03`:** la columna 2 es
pared de la fila 1 a la 6, con la compuerta en la fila 7 — sólido a sólido, `CTR-16.10.4`):

```
###############
#.#...........#
#.#...........#
#.#...........#
#.#...........#
#.#...........#
#.#...........#
#AG1..X..2nLB.#
###############
```

### NIV-05 — Difícil 1: los dos mecanismos, y el primer salto

**Qué enseña (una sola cosa):** combinar. Los dos tipos de mecanismo aparecen en la misma
sala, cada uno abriéndole paso al otro, y por primera vez hace falta saltar un hueco para
llegar hasta el propio. **Ningún tipo de mecanismo nuevo** (`escalon: 3`, PRD "Piso de
ítems").

**Qué entra:** palanca, placa, caja y **dos** compuertas —una por personaje, cada una
abierta por el mecanismo del otro—, los cuatro tipos reutilizados. El boceto trae `X`, ya
visto en `NIV-04`: no vuelve para enseñar nada —sigue siendo el mismo molinete que devuelve
a los dos—, va debajo del hueco como lo que pasa si el salto se erra, no como una idea nueva
a combinar. **No trae `C` ni `I`:** con las dos compuertas, la palanca, la placa, la caja y
el hueco, la grilla ya no tiene lugar para el terreno ambiente sin apretar el camino — y no
hace falta, porque ninguno enseña nada nuevo a esta altura.

**Reparto de `devuelve`:** ninguno de fondo. Solo el `X` bajo el hueco: acá no es ambiente,
es lo que atrapa a quien cae.

**Qué se ve desde la entrada:** ninguna de las dos puertas a la vista completa —las dos
quedan detrás de su compuerta—, que es lo que corresponde a Difícil (`US-09` criterio 4 solo
exige las dos puertas visibles en el Fácil). Distancia entrada→puerta: Skayboy 5 tiles en
línea recta. Poligirl la tiene al lado de la entrada (1 tile), pero su camino real no es
recto: cruza su compuerta, salta el hueco hacia el lado de Skayboy para llegar a la caja,
empuja, y vuelve — un recorrido de ida y vuelta, no una línea. Alcance usado: **hueco de 2
tiles**, de un máximo de 3 — se acerca al límite pero no lo toca.

**El camino de una persona sola:** entra primero Skayboy, que no necesita saltar: camina
**hacia la derecha**, cruza su palanca en ese sentido —queda activa, y con ella la compuerta
de Poligirl mandada abierta (`CTR-16.10.2`)— y sigue, sin volver atrás, hasta su propia
compuerta, que sigue cerrada porque nadie la abrió todavía. **Ahí espera, sobre piso llano,
lejos del hueco y de `X`, y sin volver a cruzar su palanca.** Se cambia de columna: Poligirl
cruza su compuerta —ya abierta por la palanca de Skayboy, que él no tocó de nuevo— salta el
hueco de 2 tiles hacia el lado de Skayboy para llegar hasta la caja, la empuja sobre la
placa, y eso abre la compuerta de Skayboy. Salta de vuelta el hueco, cruza otra vez su propia
compuerta —sigue abierta, nadie la tocó— y sigue hasta B. Se vuelve a Skayboy, que ahora
cruza su compuerta hasta A. (Si el salto se erra, quien cae toca el `X` del fondo y vuelve a
su propia entrada —el terreno rechaza, no mata, `UX-29 §7.2`—, no hace falta reintentar el
nivel entero.)

**Paridad de este nivel:** los dos se abren paso mutuamente. **1–1.**

**Boceto** (rediseñado el 2026-09-23: la versión anterior traía una sola compuerta con dos
usos, cuando el nivel necesita dos —una por personaje—, y ponía la placa y la caja encima de
las mismas columnas del hueco, lo que no se puede: no hay piso donde hay un pozo. Acá cada
compuerta está entre la entrada y la puerta de su propio dueño, la caja y la placa quedan
fuera del hueco, en el sentido en que Poligirl las alcanza saltando, y ningún camino de una
persona sola vuelve a cruzar su propia palanca. **Segunda corrección el mismo día, mismo
motivo que `NIV-03`:** las dos compuertas (columnas 5 y 11) eran una sola celda con aire
arriba. Ahora cada una es pared de la fila 1 a la 6 con la compuerta en la fila 7 —
`CTR-16.10.4`—, y ninguna de las dos columnas coincide con las del hueco (9 y 10), así que no
le saca piso al salto):

```
###############
#....#.....#..#
#....#.....#..#
#....#.....#..#
#....#.....#..#
#....#.....#..#
#....#.....#..#
#1.P.GALn..G2B#
#########XX####
```

### NIV-06 — Difícil 2: el hueco más largo del piso

**Qué enseña (una sola cosa):** lo mismo que `NIV-05` combinado, con el hueco llevado al
borde de lo que el mundo permite. Sigue sin mecanismo nuevo — cierra el piso mostrando
cuánto da de sí lo ya aprendido.

**Qué entra:** los mismos cuatro tipos de `NIV-05`, con los roles invertidos —esta vez
Poligirl dispara la palanca y Skayboy salta y empuja la caja— para que la paridad total del
piso cierre pareja, y otra vez **dos** compuertas, una por personaje. Debajo del hueco
reaparece `X`, igual que en `NIV-05`: misma red, ahora de tres tiles porque el hueco es de
tres. No trae `C` ni `I`, por el mismo motivo que `NIV-05`: no queda lugar y no enseñan nada
nuevo a esta altura.

**Reparto de `devuelve`:** ninguno de fondo. Solo el `X` bajo el hueco — igual que `NIV-05`.

**Qué se ve desde la entrada:** ninguna puerta completa a la vista, igual que `NIV-05`.
Distancia entrada→puerta: Poligirl 4 tiles en línea recta (cruza su palanca y su compuerta
de camino). Skayboy la tiene al lado de la entrada (1 tile), pero su camino real es de ida y
vuelta: cruza su compuerta, salta el hueco de tres, empuja la caja y vuelve. Alcance usado:
**hueco de 3 tiles**, el máximo que `ALCANCE_HUECO_TILES` permite. Es el único punto de los
seis niveles que toca el límite, y lo hace a propósito: es el último nivel del piso.

**El camino de una persona sola:** entra primero Poligirl, que camina **hacia la derecha**
y cruza su palanca en ese sentido —queda activa, y con ella la compuerta de Skayboy mandada
abierta (`CTR-16.10.2`)— y sigue, sin volver atrás, hasta su propia compuerta, todavía
cerrada porque nadie la abrió. **Ahí espera, sobre piso llano, lejos del hueco y de `X`, y
sin volver a cruzar su palanca.** Se cambia de columna: Skayboy cruza su compuerta —ya
abierta por la palanca de Poligirl— salta el hueco de 3 tiles, empuja la caja sobre la
placa, y eso abre la compuerta de Poligirl. Salta de vuelta el hueco, cruza otra vez su
propia compuerta —sigue abierta, nadie la tocó— y sigue hasta A. Se vuelve a Poligirl, que
cruza hasta B. (Si el salto se erra, quien cae toca el `X` del fondo y vuelve a su propia
entrada — mismo mecanismo que en `NIV-05`.)

**Paridad de este nivel:** los dos se abren paso mutuamente. **1–1.**

**Boceto** (rediseñado el 2026-09-23, mismo motivo que `NIV-05`: dos compuertas en vez de
una, y la placa y la caja fuera de las columnas del hueco. **Segunda corrección el mismo día,
mismo motivo que `NIV-03`:** las dos compuertas (columnas 3 y 12) eran una sola celda con
aire arriba. Ahora cada una es pared de la fila 1 a la 6 con la compuerta en la fila 7 —
`CTR-16.10.4`—, y ninguna de las dos columnas coincide con las del hueco (4 a 6)):

```
###############
#..#........#.#
#..#........#.#
#..#........#.#
#..#........#.#
#..#........#.#
#..#........#.#
#A1G...nL2P.GB#
####XXX########
```

---

## 4. La paridad programada, de punta a punta (`BR-23.1`)

| Nivel | Escalón | Skayboy abre para Poligirl | Poligirl abre para Skayboy |
|---|---|---|---|
| NIV-01 | Fácil | — | — |
| NIV-02 | Fácil | — | — |
| NIV-03 | Media | 1 | 0 |
| NIV-04 | Media | 0 | 1 |
| NIV-05 | Difícil | 1 | 1 |
| NIV-06 | Difícil | 1 | 1 |
| **Total** | | **3** | **3** |

Diferencia: **0**, dentro del máximo de uno que exige `BR-23.1`. `T-277` la recuenta a
máquina sobre las trazas grabadas, no sobre esta tabla — esta tabla es la intención de
diseño, la de `T-277` es la que manda.

---

## 5. Las tintas de los mecanismos: cero nuevas

`UX-27 §4` reparte las 15 tintas en fijos (2), terreno (6), personajes (3+3) y objetos
(1: el coleccionable — `§4.1.2` le sacó su tinta propia a la puerta el mismo día). Los
cuatro mecanismos **no piden una 16.**

**Corrección sobre la versión anterior de esta tabla, hecha en la pasada de coherencia de
esta ráfaga.** Acá decía que palanca y placa usaban "rampa de terreno" y que la caja usaba
"rampa de sólido". `CTR-16.10.8` (`T-264`, cerrado el mismo día) precisa que ninguna de las
dos franjas sirve: las seis del terreno no son neutrales —tres son de cielo y tres de
infierno (`UX-27 §4.1`)— así que pintar un mecanismo con una de ellas se leería como "de
Skayboy" o "de Poligirl", según quién camina ese terreno (`UX-30 §3`), y eso rompe la
paridad de `BR-23` punto 1: toda pieza de este contrato es de los dos, y el schema le
prohíbe declarar un `de`. Y "rampa de sólido" no existe como franja propia en la paleta —
`UX-27 §4` solo fija clave y luz como los dos colores fijos—, así que tampoco resolvía
contra ninguna tinta real. **Los cuatro mecanismos van en la clave y la luz, los dos
fijos**, y se distinguen por **forma**, como ya manda `UX-27 §5.2` — ningún estado se
comunica solo con color. *(Confirmado coherente el 2026-09-23 con la decisión del aire y el
sólido de `UX-27 §1.1`: `--px-clave` es el sólido del área y `--px-luz` el aire, así que
"la compuerta cerrada… la misma familia que un sólido" de la fila de abajo ya lee bien —
cerrada en clave, exactamente como una pared — sin que esta tabla tuviera que cambiar una
palabra.)*

| Mecanismo | Tinta que usa | Cómo se distingue |
|---|---|---|
| Palanca | `--px-clave` / `--px-luz` | silueta de mango; **inclinada** a un lado en reposo y al otro disparada (`CTR-16.10.8`) — el ángulo dice el estado, no la tinta |
| Placa de presión | `--px-clave` / `--px-luz` | **levantada**, libre, y **a ras** de piso, pisada (`CTR-16.10.8`) |
| Compuerta | `--px-clave` (la misma familia que un sólido) cerrada; desaparece (aire) abierta | **llena** cerrada y **recogida** contra su anclaje de arriba, abierta (`CTR-16.10.8`) — el estado lo dice la **presencia**, no un cambio de tinta |
| Caja | `--px-clave` / `--px-luz`, en dither de cruz — el medio tono que pide `CTR-16.10.8` cuando hace falta uno, "trama de clave y luz, no un color" | el dither es lo que la distingue de una pared: misma familia de tinta, textura distinta. No tiene estado |

Qué forma exacta toma el mango, el hundido de la placa o el dither de la caja es de quien
dibuja (`T-276`); esta tabla fija la familia de tinta y el mecanismo de lectura, no el
píxel final — es lo que `CTR-16.10.8` deja abierto a propósito.

Ninguno usa `--acento-3` ni `--acento-4` (acierto/error son del sitio, no del terreno,
`UX-27 §4.2`), y ninguno pisa la tinta del coleccionable — esa sigue siendo solo de ese
objeto. La puerta ya no tiene tinta propia (`UX-27 §4.1.2`): comparte clave y luz con
estos cuatro mecanismos, y se distingue de ellos por forma, no por color.

---

## 6. La duración objetivo: el piso del solucionador y el techo del teléfono

`T-266` va a medir, por nivel, la traza más corta de una persona sola alternando columnas
— eso es un **piso**, no un objetivo: es lo más rápido que se puede hacer y ningún humano
lo va a igualar la primera vez. El **techo** ya lo fijó `UX-28 §6`: un nivel se pasa en
menos de un minuto la primera vez que sale bien, contando reintentos. Este documento no
sube ni baja ese número — lo reparte por escalón y fija la relación esperada con el piso
del solucionador:

| Escalón | Techo (dentro de `UX-28 §6`) | Relación esperada con la traza mínima de `T-266` |
|---|---|---|
| Fácil (1, 2) | ≤ 20 s | 3–4× |
| Media (3, 4) | ≤ 40 s | 4–6× |
| Difícil (5, 6) | ≤ 60 s (el techo de `UX-28 §6`) | 5–8× |

Si la traza mínima de un nivel Difícil mide, por ejemplo, 12 segundos, el objetivo humano
ronda 36–72 s — y si un nivel medido se acerca o pasa el techo de 60 s, el que se corrige es
el nivel, no el techo. Ese número **se mide, no se cita** (`US-09` criterio 9, `UX-28 §6`):
lo mide quien pruebe con cronómetro, y estas relaciones son la vara con la que decide si lo
que midió está bien o el nivel quedó largo.

---

## 7. Los nombres: lo que este documento no escribe, y lo que no pueden decir

El nombre de cada nivel es de `contenido` (`CNT-21`, `T-270`, en paralelo). Lo que fija acá
es el límite que `BR-24` ya impone y que un nombre podría romper sin querer:

> **Ningún nombre de nivel explica la mecánica.** Nada de "La Palanca", "El Salto Largo" ni
> "Cielo contra Infierno" — `UX-30 §3` ya prohibió que una pantalla explique por qué un
> terreno rechaza a quién, y un título que lo diga por la puerta de atrás comete el mismo
> error. El nombre puede cantar (registro 1, `voz-ricotera.md §5`) sobre lo que se siente
> jugar el nivel; no puede instruir sobre cómo se juega.

Los seis campos `"nombre"` quedan vacíos en los bocetos de este documento — no son míos
para llenar.

---

## 8. Cómo se verifica

Sin comando propio (`T-265` no lo tiene). Lo que se puede correr, cuando exista:

```
node scripts/resolver-niveles.mjs --todos   # T-266/T-277: confirma que las trazas cierran
                                              # y recuenta la paridad de la tabla de §4
```

Lo que se audita a ojo, con esta vara:

1. Que cada nivel enseñe **una** cosa (`§3`, columna "Qué enseña") — dos lecciones en el
   mismo nivel es un nivel mal cortado.
2. Que los Fáciles tengan las dos puertas a la vista desde la entrada y cero uso de
   `ALCANCE` — lejos del límite, como pide la tarea.
3. Que ningún nombre de nivel (cuando `CNT-21` los escriba) explique un mecanismo.
4. Que la tabla de `§4` sume diferencia ≤ 1 — la recuenta `T-277` a máquina sobre las
   trazas, no sobre esta tabla.
5. Que "Qué entra" nombre todo caracter que aparece en el boceto de la grilla —si el boceto
   trae `X`, `C` o `I`, el texto lo dice; si no lo trae, el texto no lo promete. Es lo que
   la verificación del ciclo 16 encontró roto en `NIV-05` y `NIV-06` y quedó corregido acá.

---

## 9. Respuesta al traspaso de `T-277` (`FIND-74`)

> `Docs/SUGERENCIAS/HILO-para-experiencia-los-seis-niveles-contra-el-solucionador.md`,
> leído entero para esta tarea (`T-294`).

**Lo de `FIND-74` queda registrado en `§3`, NIV-03**: la versión cierta es que `[9, 7]` es
una elección entre dos lugares igual de válidos para dar tolerancia, no una obligación que
imponía la medición del ladrillo en `[6, 7]` — esa medición corría sobre una sola de las dos
trazas posibles.

**Lo que el traspaso pide de fondo — "que `UX-31 §3` refleje las grillas que quedaron
cargadas" en `src/data/skayboy.json`**: no lo hago en esta tarea. `§3` ya avisa, en su
primera línea, que los bocetos son "ilustrativos, no validados por el solucionador" y que
"si una traza no cierra, ahí se corrige el boceto, no acá" — la fuente de verdad tile a
tile es el dato cargado por `T-277`, y el traspaso mismo ya es el registro completo de qué
cambió en cada nivel y por qué. Resincronizar las seis grillas ASCII de `§3` para que
calquen ese dato es trabajo real —seis niveles, entradas y puertas que cambiaron de lado,
techos bajos nuevos— y el plan de esta ráfaga (`ORQ-plan-ciclo-16.md §2.5`) le dio a
`T-294` un alcance puntual: `FIND-74`. No lo absorbo sin que se corte como tarea propia. Si
se quiere que `§3` deje de decir "boceto provisorio" y pase a ser el espejo exacto del
dato cargado, es tarea de un próximo ciclo, no de esta.

El resto del traspaso —los cuatro puntos de `§0`, el detalle nivel por nivel de `§1`, los
callejones de `§2`, y "lo que no cambia" de `§3` del traspaso— no le pide nada más a este
documento: son justificaciones de grilla y de física que quedan del lado de
`arquitectura`/`mundo.ts`, y ninguna mueve "qué enseña cada nivel" (`§3` de acá), la
paridad de `§4` (el traspaso mismo la confirma "igual, 3 a 3", contada sobre las trazas) ni
el límite de nombres de `§7`.
