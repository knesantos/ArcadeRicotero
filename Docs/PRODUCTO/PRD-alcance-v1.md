# PRD — Alcance v1: los cuatro juegos

> Consume: `Docs/BRIEF.md` ("Listo de la v1", "Orden de corte", "Criterios no
> negociables", riesgos 4 y 6), `Docs/DECISIONES.md` `D-05`, `D-04`, `D-06`, `D-08`,
> `D-09`, `D-10`, `D-24`.
>
> Los cuatro juegos (quiz, adivinar el tema, completar la letra, adivinar la tapa o el
> disco) están **confirmados por `D-05`** en el `/kickoff` del usuario — este documento
> no los re-discute. Lo que faltaba y produce este archivo: criterio de aceptación por
> juego, piso de ítems, y las reglas de negocio que el brief dejó como `PENDIENTE` a
> cargo de `producto` (dificultad de "completar la letra", puntaje del reveal de audio).
>
> **Revisión 2026-08-24 (`T-99`, ciclo 7).** Consume además `D-24` y los dos hilos que la
> devuelven a `producto`: `Docs/SUGERENCIAS/HILO-para-producto-mecanica-y-escalera-de-us02.md`
> y `Docs/SUGERENCIAS/HILO-mapa-del-juego-de-referencia.md`. `US-02` ya estaba construida
> con seis intentos y buscador cuando `BR-02` todavía describía intento único con cuatro
> opciones — esta revisión hace que la regla escrita diga lo que el juego hace. Toca
> `US-02`, `BR-02`, `BR-04` y el piso de `US-02`. El resto del documento no se tocó.
>
> **Revisión 2026-08-24 (`T-115`, ciclo 8).** Consume además `Docs/PRODUCTO/PRD-backlog-
> ideas.md` (`IDEA-09`, `BR-16`) y el pedido directo del usuario, 2026-08-23: *"un eje luz
> oscuridad y otro eje orden caos"* y confirmación de que lo que se ubica en el plano es el
> jugador, no los 105 temas. Suma `US-06` y `BR-17`, un quinto juego que **no** toca el
> número que fija `D-05` — sigue siendo cuatro el "Listo" de la v1. El resto del documento
> no se tocó.
>
> **Revisión 2026-08-24 (`T-116`, ciclo 8).** Consume además `Docs/INVESTIGACION/INV-25-
> escuchas-spotify.md` (`RES-51`, Spotify cierra en negativo) y `Docs/INVESTIGACION/INV-26-
> reproducciones-youtube.md` (`RES-52`, YouTube abre con condiciones), y responde al hilo
> `Docs/SUGERENCIAS/HILO-para-producto-cuota-de-faciles-en-us02.md`. Suma `BR-18`: qué
> promete el sitio sobre popularidad de temas —YouTube sí, Spotify no, nunca mezclados— y,
> con ese mismo dato, resuelve la salida 2 que `arquitectura` había dejado abierta para el
> piso de Fáciles de `US-02`. Toca `BR-01` y `US-02` (nota, no reescritura) y el resumen de
> pisos. El resto del documento no se tocó.
>
> **Revisión 2026-08-25 (`T-129`, ciclo 9).** Sobre el pedido del usuario en
> `Docs/ORQ/ORQ-plan-ciclo-9.md`: el quiz deja de repartir una ronda fija de 8 preguntas
> con resultado en "aciertos sobre 8" y pasa a jugarse **con 3 vidas**, hasta perderlas o
> hasta agotar el banco entero. Suma `BR-19`. Toca `US-01` (reescribe criterios 1 y 2,
> agrega 4, 5 y 6), `BR-01` (nota, sus tres puntos siguen intactos), `BR-05` (se retira
> de `US-01`, queda disponible para `US-04`) y el resumen de pisos (nota). El resto del
> documento no se tocó.
>
> **Revisión 2026-09-01 (`T-164` y `T-166`, ciclo 10).** Consume además `D-27`, `CTR-03.11`
> y `FIND-29` de `REV-08`. El ciclo 10 midió que `US-02` **no escalonaba** —la vuelta salía
> de un barajado puro y el campo `dificultad` no existía— y que por lo tanto el mínimo de
> **8 Fáciles** que este documento le exige estaba en **0**. El mecanismo ya está puesto
> (`T-162`, `T-163`); lo que faltaba era la decisión de `producto` sobre qué hace el "Listo"
> de la v1 mientras `popularidad.json` no tenga mediciones. **Suma el apartado (g) a
> `BR-18`** y una nota al piso de `US-02`. Y `T-166` recorta el `h1` del quiz, que tenía
> diez palabras contra el techo de ocho de `voz-ricotera.md` 4.1. El resto del documento no
> se tocó.
>
> **Corrección el mismo día, sobre la misma `T-129`.** La primera versión de `BR-19` no
> decía nada sobre cuánto dura la partida, y el apartado sobre molinetes afirmaba que el
> modelo nuevo "encaja mejor con la sesión de 2-3 minutos" comparando contra una ronda de
> 8 que, medida de verdad, **ya la incumplía** (~4:30). Se agrega `BR-19` apartado 7
> (duración medida, y una salida de "retirada voluntaria" como tercer desenlace) y se
> corrige la afirmación en el apartado 8. Toca además `US-01` (agrega criterio 6) y el
> apartado 6 de `BR-19` (el resultado y el payload de `ADR-02` pasan de dos desenlaces a
> tres).
>
> **Revisión 2026-09-23 (`T-274`, ciclo 16, enmienda de `D-45`).** Consume además
> `Docs/INVESTIGACION/INV-73-recitales-setlistfm.md` (`RES-73`..`RES-75`) y `BR-28`
> (`Docs/PRODUCTO/PRD-skayboy-y-poligirl.md`). Suma el apartado (h) a `BR-18`: la vara de
> Fáciles de `US-02` deja de salir del ranking de vistas de YouTube (apartado f, que queda
> **enmendado, no borrado**) y pasa a salir del conteo citado de setlist.fm, leído contra
> el filtro de catálogo. Dos cosas quedan explícitamente pendientes de otra mano — ninguna
> de las dos se resuelve en esta revisión: si `D-27` (los tercios de "Sacalo por la
> letra") también se alimenta de este conteo, pendiente **del usuario**; y la actualización
> formal de `BR-28` en `PRD-skayboy-y-poligirl.md`, fuera del alcance de archivo de esta
> tarea. El resto del documento no se tocó.
>
> **Revisión 2026-09-24 (`T-283`, ciclo 16, enmienda de `D-46`).** Consume además `D-46`
> (decisión del usuario, textual: *"La dificultad de todo lo que sea con canciones sale de
> ahí"*, que enmienda `D-27`) y `Docs/SUGERENCIAS/ARQ-para-producto-lo-que-el-corte-en-
> vivo-deja-abierto.md`. Suma `BR-30`: una tabla con los ocho juegos del sitio, si trabajan
> con canciones y cómo decide cada uno la dificultad hoy y desde `D-46`. Contesta, más
> ancha de lo que se le había preguntado, la "Salida B" que `BR-18` (h) dejó pedida al
> usuario en la revisión anterior — la respuesta es sí, con la fuente que `D-27` ya tenía
> asignada (tercios), no la de `US-02` (corte de 8) — y confirma la regla de reparto
> Media/Difícil de `US-02` que `Docs/SUGERENCIAS/ARQ-para-producto-lo-que-el-corte-en-
> vivo-deja-abierto.md` §1 dejaba pedida. Marca la enmienda en `BR-18` (h), sin borrar. El
> resto del documento no se tocó.
>
> **Revisión 2026-09-24 (`T-286`, ciclo 16, ráfaga 4, precisión de `D-46`).** El usuario
> contestó, textual: *"Completá la letra también sale del conteo"* — `BR-30` había dejado a
> `US-03` afuera con argumento propio, y el usuario lo revirtió sin pedir que se lo
> convenza. Enmienda la fila de `US-03` en `BR-30` (marcada, sin borrar la razón anterior),
> suma la sección "`BR-03`: el contexto sigue al nivel — no se desacopla" con la decisión
> de que la tabla de `BR-03` no cambia y lo único que migra es de dónde sale el nivel
> (tercios por tema, igual que `US-07`), y corrige de paso el traspaso a `arquitectura` que
> `T-283` había dejado excluyendo a `CTR-04`. El resto del documento no se tocó.
>
> **Revisión 2026-09-25 (`D-48`, "Más o menos" promovida de `IDEA-11`).** Consume además
> `Docs/PRODUCTO/PRD-mas-o-menos.md`, donde vive `US-10`/`BR-32`/`BR-33` enteros — este
> archivo no los aloja, solo los referencia. Suma la fila de `US-10` a la tabla de `BR-30`
> y corrige "los ocho juegos" a "los nueve juegos" en su `Aplica a`. No toca ningún otro
> punto: `US-10` no es uno de los cuatro juegos de `D-05` ni compite por su piso.

## Por qué existe el piso de ítems

El riesgo 4 del brief es literal: "cuatro juegos hermosos con doce preguntas adentro".
Un juego con el motor terminado y un puñado de ítems no cuenta como listo (`BRIEF.md`,
"Listo de la v1"). Cada historia de abajo fija un número, no una sensación, y ese número
está ajustado al costo real de producir cada tipo de ítem — porque quien carga el
contenido (`contenido`) trabaja en las mismas ráfagas irregulares que todo el equipo, y
un ítem de texto no cuesta lo mismo que un ítem que además necesita audio o una imagen
con derechos.

---

## BR-01 — Escalonamiento de dificultad sin muro de entrada (transversal a los 4 juegos)

**Aplica a:** `US-01`, `US-02`, `US-03`, `US-04`. Motivo: el criterio no negociable
"sin muro de entrada" (`D-09`) exige que el que recién llega no se sienta expulsado en
la primera pantalla de **ningún** juego.

**Taxonomía:** todo ítem del banco de contenido (pregunta, tema, letra, tapa) lleva una
etiqueta de dificultad de 3 valores — **Fácil / Media / Difícil** — asignada por
`contenido` al cargarlo.

> **Excepción `US-02`, añadida `T-116` (ciclo 8).** Desde que `adivinar-tema.json` pasó a
> ser manifiesto de audio (`D-24`), ese juego no lleva la etiqueta `dificultad` por ítem, y
> `contenido` no la asigna ahí. El nivel Fácil de `US-02` se calcula contra el ranking de
> vistas de YouTube (`BR-18`, apartado f), no se asigna a mano. El resto de esta regla
> —primer ítem Fácil, la dificultad no baja dentro de la partida— sigue igual para los
> cuatro juegos, `US-02` incluido.

> **Nota `US-01`, añadida `BR-19` (ciclo 9).** Los tres puntos de esta regla siguen
> intactos para `US-01` bajo el modo de vidas — el detalle completo está en `BR-19`,
> apartado 4. Lo único que `BR-19` documenta y que esta regla no preveía cuando se
> escribió sobre una ronda de 8: con vidas, un jugador que no pierde durante el primer
> escalón llega a ver el pozo Fácil **completo**, no solo su primer ítem. No es una
> violación del punto 3 —el primer ítem sigue variando entre los 10 candidatos— es una
> consecuencia nueva que esta regla no imaginaba.

**Regla:**
1. El primer ítem que se sirve en cualquier partida nueva, en cualquiera de los 4
   juegos, es siempre de nivel **Fácil**. Nunca Media ni Difícil.
2. Dentro de la misma partida, la dificultad no baja: si el ítem N es de nivel X, el
   ítem N+1 es de nivel X o superior (Fácil → Media → Difícil), nunca al revés.
3. Cada juego necesita un mínimo de ítems Fáciles en su piso (fijado en cada historia
   más abajo) para que "el primer ítem" no sea siempre el mismo — si solo hay uno o dos
   ítems Fáciles, el jugador que recién llega ve siempre lo mismo, y eso no es
   escalonamiento, es una vidriera fija.

**Verificación:** en cualquier partida nueva de cualquier juego, el primer ítem servido
está etiquetado Fácil. Es un chequeo binario, sin ambigüedad.

---

## US-01 — Quiz de preguntas

**Prioridad:** Alta (P0) — **la primera que se construye.**

> **Revisión 2026-08-25 (`T-129`, ciclo 9), sobre `BR-19`.** El criterio 1 describía una
> **ronda fija de 8 preguntas** con resultado en "aciertos sobre 8"; el criterio 2 asumía
> que la partida sigue entera pase lo que pase. El pedido del usuario cambia las dos
> cosas a la vez: el quiz se juega **con 3 vidas**, y la partida puede terminar antes de
> la pregunta 8 (si se pierden las 3 vidas) o mucho después (hasta la 40, si nunca se
> pierden). Se reescriben los criterios 1 y 2, y se agregan 4, 5 y 6 (escalón, victoria y
> retirada voluntaria). El criterio 3 no cambia. El detalle de la mecánica —cuánto dura
> cada escalón, cuánto dura la partida entera, cómo se cierra el hueco de los 10 fáciles
> exactos, qué sobrevive de `BR-01` y de `BR-05`— vive en `BR-19`, igual que `BR-02`
> sostiene el detalle de `US-02`.

Como jugador que llega por un link de Twitter sin saber nada de los Redondos, quiero
jugar una partida de preguntas de dificultad creciente con margen para equivocarme, para
demostrar cuánto sé sin que una sola respuesta mala me saque del juego.

**Criterio 1 — caso feliz (arranca con 3 vidas y avanza):**
- **Given** un jugador nuevo, sin partidas previas, abre el quiz.
- **When** arranca una partida.
- **Then** el sistema le da **3 vidas** y sirve preguntas una por una, empezando siempre
  por una de nivel Fácil (`BR-01`); cada respuesta incorrecta le resta una vida (`BR-19`)
  y cada respuesta —correcta o no— lo lleva a la pregunta siguiente sin pedir cuenta ni
  login.

**Criterio 2 — caso borde (no sabe nada, se queda sin vidas):**
- **Given** un jugador acumula 3 respuestas incorrectas.
- **When** responde la que le cuesta la tercera vida.
- **Then** el juego no lo corta a mitad de pregunta: primero ve la explicación de ese
  ítem igual que en cualquier respuesta, y recién al tocar `SEGUÍ` la partida termina
  mostrando el resultado de derrota (`BR-19`), habilitando jugar de nuevo sin fricción.

**Criterio 3 — caso borde (veracidad):**
- **Given** una pregunta del banco afirma un dato verificable.
- **When** se muestra al jugador.
- **Then** esa pregunta cita en su ficha de `contenido` la ficha `RES-XX` que la
  respalda, o lleva la marca explícita de leyenda (`D-09`, ningún dato falso).

**Criterio 4 — caso borde (el escalón sube):**
- **Given** un jugador respondió, bien o mal, todas las preguntas del pozo Fácil sin
  perder sus 3 vidas.
- **When** arranca la siguiente pregunta.
- **Then** el ítem servido es de nivel Media, nunca vuelve a ser Fácil en esa partida, y
  lo mismo ocurre al agotarse el pozo Media: la siguiente pregunta es Difícil (`BR-19`).

**Criterio 5 — caso borde (agota el banco, gana):**
- **Given** un jugador respondió, bien o mal, todas las preguntas del pozo Difícil sin
  perder sus 3 vidas.
- **When** responde la última pregunta del banco.
- **Then** la partida termina mostrando un resultado de **victoria**, distinto del de
  derrota (`BR-19`) — agotar el banco es un desenlace previsto, no un caso sin pantalla.

**Criterio 6 — caso borde (se retira antes de tiempo):**
- **Given** un jugador viene jugando una partida y todavía tiene vidas y preguntas por
  responder.
- **When** decide cerrarla sin llegar a perder ni a agotar el banco.
- **Then** ve un resultado de retirada (`BR-19`), distinto del de derrota y del de
  victoria, sin que el sitio le exija seguir jugando para tener algo que mostrar o
  compartir.

**Piso de ítems: 40 preguntas.**
- Mínimo 10 por categoría (historia, discos, letras, mitología) — 4 categorías × 10.
- De esas 40, mínimo 10 de nivel Fácil, 15 Media, 15 Difícil (para que `BR-01` no
  repita siempre la misma pregunta como "primer ítem").
- **Por qué 40 y no 12:** es el contenido más barato de producir del banco — texto puro,
  sin audio ni imagen con derechos — y es el juego que se construye primero, así que
  fija el piso más alto de los cuatro. **Desde `BR-19` (ciclo 9) el piso ya no solo evita
  que una ronda de 8 repita octeto: es el largo entero de la partida por vidas** — los 40
  ítems son, a la vez, el contenido y el mapa de los tres escalones (10/15/15). Un piso
  más alto ya no es solo "más variedad": es directamente "la partida dura más antes de
  poder ganarse", que es el riesgo 4 del brief aplicado a este mecanismo nuevo.

> **El `h1` de la portada del quiz se recorta a ocho palabras (2026-09-01, `T-166`).**
> Decía *"Entrá a jugar con los Redondos, sepas lo que sepas."* — **diez palabras**, contra
> el techo de ocho que `voz-ricotera.md` 4.1 fija para toda línea grande del sitio. **Pasa
> a decir "Entrá, sepas lo que sepas."**
>
> Se recorta y no se declara una excepción, por tres motivos:
>
> 1. **Es una línea, no un patrón.** Los otros cinco juegos tienen títulos de dos a cinco
>    palabras y pasan holgados. Una excepción por un solo caso deja el techo sin dientes.
> 2. **Lo que sobraba era el trabajo de la otra línea.** El subtítulo ya nombra el juego
>    —*"Preguntas de historia, discos, letras y mitología ricotera."*— así que *"a jugar con
>    los Redondos"* estaba diciendo por segunda vez lo que ya estaba dicho, y el botón
>    `JUGÁ` lo dice por tercera. La regla de las dos líneas se cumple igual: **tapá la que
>    canta y el que llegó por un enlace todavía sabe qué es esto y qué botón tocar.**
> 3. **Lo que se conserva es lo único que no se puede perder.** *"Sepas lo que sepas"* es
>    la promesa de los molinetes abiertos (`D-09`, `D-14`) dicha en cinco palabras, y
>    *"Entrá"* es literalmente esa imagen. La línea quedó más corta y más de este proyecto.
>
> **Consecuencia, y es la que motivó la tarea:** con esto `voz.test.ts` puede auditar los
> `PANTALLA_0.titulo` de los cinco juegos, que hasta hoy quedaban afuera del auditor porque
> sumarlos rompía el build por esta línea sola (`T-167`).

**Queda fuera de esta historia:** el copy exacto de la pantalla de resultado y el
mecanismo de compartir (dueño `experiencia`, ver `D-10`); la tolerancia de matching si
alguna pregunta usa texto libre en vez de opción múltiple (dueño `experiencia`).

---

## BR-19 — La partida del quiz por vidas

**Aplica a:** `US-01`. Fija lo que el pedido del usuario dejó como intención y no como
número: *"en vez de una nota sobre 8 que sea con 3 vidas y si erras perdes una vida, a
medida que vas avanzando cada 10 preguntas aumenta la dificultad"*, más su respuesta
directa a qué pasa al terminar los tres niveles —*"se queda en difícil hasta perder"*—
y a qué pasa si nunca pierde: agota el banco de 40 y gana.

**Aviso de frente, para que la desviación del pedido no quede enterrada en el medio de
un apartado:** el usuario pidió textualmente *"cada 10 preguntas aumenta la
dificultad"*; lo que sigue **no hace eso** para el segundo y el tercer escalón — hace
10/15/15 (apartado 2). La razón: un escalón parejo de 10 para los tres niveles deja
ítems sin usar (5 medias, y no alcanza para completar el pozo difícil), y eso vuelve
**imposible** cumplir la otra instrucción textual del mismo usuario —*"si agotás el
banco de 40, ganaste"*—, que fue su respuesta a una pregunta puntual que le hice yo.
Entre las dos, sostuve la que responde a esa pregunta sobre el desenlace del juego, no
la cifra que traje yo mismo al preguntarle. Si el usuario prefiere lo contrario —un
escalón de 10 parejo para los tres niveles, aunque eso vuelva inalcanzable la victoria
por agotar el banco o la obligue a redefinirse— es una decisión suya, no mía, y queda
pedida acá.

### 1. Las vidas: cuántas, y la única cosa que las gasta

**Tres vidas.** Se pierde una únicamente por **responder incorrecto**. No hay una
segunda vía que decidir: el quiz no tiene "pasar" —cada pregunta es de múltiple choice,
4 opciones (`BR-04`), se responde tocando una— ni límite de tiempo por pregunta, que
`UX-01` v2 ya sacó explícitamente por incumplir WCAG 2.2.1 (`src/scripts/partida.ts`,
`responder`/`avanzar`: "el avance lo manda el dedo, siempre. No hay temporizador"). Con
solo dos acciones posibles —acertar o errar— la única que cuesta vida es la segunda.

Perder la tercera vida termina la partida en la lógica, pero no de golpe en la pantalla:
el jugador todavía ve la explicación del ítem que se la costó, igual que después de
cualquier respuesta (`US-01` criterio 2 no se pierde, se hereda). Recién al tocar
`SEGUÍ` pasa al resultado de derrota. Cortarlo antes, sin mostrarle la explicación de la
pregunta que lo sacó, sería la primera vez que este sitio interrumpe una partida a mitad
de un ítem — y es justo lo que el criterio de continuidad de `US-01` existe para impedir.

### 2. El largo del escalón — y el cierre del hueco de los 10 fáciles exactos

**El pedido literal era "cada 10 preguntas". El banco de hoy tiene pozos de 10 / 15 /
15, no de 10 / 10 / 10 — y ahí nace el hueco que abrió esta tarea.**

Medí las tres salidas que planteó `orquestador` contra la restricción que fijó el propio
usuario al responder mi pregunta de qué pasa al agotar los niveles —*"se queda en
difícil hasta perder"*, y si agota el banco entero, gana— y **dos de las tres quedan
descartadas por esa misma restricción, no por gusto:**

- **"El escalón sortea un subconjunto del pozo"** (dejar, por ejemplo, 8 de los 10
  fáciles) da variedad real entre partidas — pero un ítem que un escalón deja afuera
  **nunca vuelve a estar disponible en esa partida** (la dificultad no baja, `BR-01`
  punto 2), así que agotar el banco de 40 dejaría de ser alcanzable: quedarían ítems que
  ninguna partida, ni la más perfecta, podría llegar a ver. Contradice de frente la
  respuesta del usuario. **Descartada.**
- **"El escalón dura menos de 10"**, aplicado parejo a los tres niveles, tiene el mismo
  problema (deja ítems sin usar, el banco se vuelve inalcanzable) y además **no** cierra
  la partida en 40 preguntas sino en menos — otra promesa rota. **Descartada.**
- **"El banco de fáciles crece"** (subir el piso mínimo de Fácil más allá de 10) sí
  ayudaría a que el escalón 1 no sea siempre el mismo bloque completo — pero le pide a
  `contenido` escribir preguntas nuevas antes de poder cerrar un ciclo que
  `Docs/ORQ/ORQ-plan-ciclo-9.md` armó, en su tramo A, justamente para cerrar **sin**
  escritura de contenido nueva. No es gratis y no es de esta ráfaga: **queda en
  `PENDIENTE` como la palanca correcta para más adelante, no para ahora.**

**La que uso es una cuarta, que no estaba en la lista porque nace de mirar el motor que
ya existe.** `armarRonda` (`src/lib/quiz/ronda.ts`) ya sabe repartir un banco por nivel
en la proporción exacta del piso (`MEZCLA`: 10 fácil / 15 media / 15 difícil) y servirlo
**ordenado**: primero el pozo Fácil entero (barajado), después el Media entero
(barajado), después el Difícil entero (barajado) — es lo que hace hoy con `largo = 8`,
tomando una porción proporcional de cada pozo. **Si se la llama con `largo` igual al
tamaño del banco entero (40, hoy) en vez de con 8, devuelve, sin cambiar una sola línea
de `ronda.ts`, exactamente los tres bloques completos, en orden, sin dejar ningún ítem
afuera y sin repetir ninguno.** El "escalón" de esta regla no es un número que alguien
escribe aparte para vidas: es el punto donde cambia el campo `dificultad` del ítem que
`armarRonda` ya venía sirviendo. `T-142` (`src/lib/quiz/vidas.ts`) compone sobre esto sin
tocar `ronda.ts`, tal como pide el plan del ciclo.

**Los números de hoy, con el banco en 40 (10/15/15):**

| Escalón | Nivel | Cuánto dura | Preguntas (hoy) |
|---|---|---|---|
| 1 | Fácil | el pozo Fácil entero | 1 a 10 |
| 2 | Media | el pozo Media entero | 11 a 25 |
| 3 | Difícil | el pozo Difícil entero, y ahí se queda | 26 a 40 |

**Por qué el primer escalón cae justo en 10 y los otros dos no, y por qué eso es
correcto y no una traición al pedido:** el pedido importa más en el primer escalón que
en los otros dos — es el que decide si el que recién llega se siente expulsado (`D-09`,
`D-14`), y ahí "cada 10" se cumple literal porque el piso mínimo de Fácil ya es 10. Para
el segundo y el tercero, cortar en 10 exigiría descartar 5 medias y usar solo una
fracción del pozo difícil, y **eso es matemáticamente incompatible con "si agotás el
banco, ganaste"**: no se puede agotar un banco de 40 dejando ítems adentro que la
partida nunca visita. Si en el futuro `contenido` pareja los tres pozos a 10 cada uno
(hoy son 10/15/15), los escalones 2 y 3 van a durar 10 también, sin tocar esta regla: el
número no está hardcodeado, sale del tamaño real del pozo.

**Por qué esto no es el bug del ciclo 7, aunque se le parezca de lejos.** Ahí la
dificultad **nunca** subía — 300 rondas simuladas dieron 2.400 preguntas, las 2.400
fáciles, y la categoría `letras` era inalcanzable pasara lo que pasara. Acá la dificultad
sube siempre, en la pregunta 11 en punto, la conozca o no el jugador — es la garantía
estructural que `armarRonda` ya tenía y que esta regla hereda entera. Lo que sigue
habiendo, y no tiene arreglo sin pagar uno de los dos costos que descarté arriba, es que
**cualquier jugador que gane el escalón Fácil sin perder ve, en esa partida, el pozo
Fácil completo** — es la vidriera fija que preocupaba a `orquestador`, pero reducida a su
mínima expresión posible: ya no es "toda la partida", es "el primer tercio, y solo si el
jugador no pierde ahí". Elijo no pagar el costo de recortarla ahora —descartar contenido
ya pago es el riesgo 4 del brief tratado al revés— y anoto en `PENDIENTE` que cada Fácil
que `contenido` sume por encima del piso de 10 diluye esto solo, sin tocar una letra de
esta regla.

### 3. Qué pasa al agotar los tres niveles, y qué pasa al agotar el banco

- **Al terminar el escalón Difícil sin haber perdido las 3 vidas: no hay un cuarto
  nivel.** La partida sigue sirviendo preguntas Difíciles —hoy, las que le queden del
  pozo de 15 sin repetir ninguna— tal como pide *"se queda en difícil hasta perder"*.
- **Si el pozo Difícil se agota y las 3 vidas siguen en pie: victoria.** El jugador
  respondió, bien o mal en distinta medida, las 40 preguntas del banco sin quedarse sin
  vidas. Es un desenlace previsto y distinto del de derrota, no un caso límite sin
  pantalla (`US-01` criterio 5).
- **Perder la tercera vida termina la partida en cualquier punto**, así sea en la
  pregunta 3 o en la 40 — incluso si esa era la última del banco: quedarse sin vidas en
  la última pregunta es derrota, no victoria. "Sin morir" (la condición que puso el
  usuario) manda por sobre "llegó hasta el final".

### 4. Qué de `BR-01` sigue en pie, y qué reemplaza `BR-19`

Los tres puntos de `BR-01` **siguen enteros, en su letra** — lo que reemplaza `BR-19` es
el `largo` con el que se llama a `armarRonda` (pasa de 8 fijo a "el banco entero"), no
la lógica de `BR-01` en sí:

1. **El primer ítem es Fácil siempre.** Sigue, y queda más blindado que antes: ya no
   depende de una ronda corta que podría, en teoría, no tener ningún Fácil disponible —
   con el banco entero como `largo`, el pozo Fácil siempre está completo.
2. **La dificultad no baja dentro de la partida.** Sigue, y con vidas se vuelve más
   estricta todavía: no solo "no baja" — hay exactamente tres tramos posibles y cada uno
   se agota entero antes de pasar al siguiente (apartado 2).
3. **Mínimo de Fáciles para que "el primer ítem" no sea siempre el mismo.** Sigue
   textual — con 10 Fáciles el primer ítem varía entre 10 candidatos, cosa que el
   apartado 2 no toca. Lo que `BR-19` **agrega**, porque `BR-01` no lo preveía cuando se
   escribió sobre una ronda de 8 y nunca el banco entero, es la consecuencia de que ahora
   un jugador puede llegar a ver el pozo Fácil **completo**, no solo su primer ítem —
   documentada y asumida en el apartado 2, no escondida.

### 5. Qué pasa con `BR-05`

**Se retira de `US-01`.** `BR-05` fija tramos de resultado (bajo/medio/alto) sobre un
**% de aciertos de una ronda de largo fijo** — y con vidas no hay largo fijo: la partida
puede cerrar en la pregunta 3 o en la 40, así que "% de aciertos sobre el total de la
ronda" deja de estar definido de antemano; el resultado pasa a ser **hasta dónde
llegaste** (apartado 6), no una nota. Los dos cortes de `BR-05` (30% / 70%) no se
derogan ni se reescriben: quedan disponibles para **`US-04`**, que sigue jugando con el
modelo clásico de `armarRonda` de largo constante y las mismas 4 opciones de `BR-04`, y
hoy no tiene tramos de resultado propios. Si `experiencia` decide sumarle tramos a la
pantalla de resultado de `US-04`, estos son los cortes que corresponde citar sin que
`producto` los redacte de nuevo — esa extensión no está confirmada acá, es decisión de
`experiencia`.

### 6. Qué muestra la pantalla de resultado (el dato, no el diseño)

Ya no hay "aciertos sobre 8" ni tramo bajo/medio/alto. Lo que el resultado tiene que
poder decir, como mínimo —el copy exacto es de `contenido` (`CNT-10`) y la pantalla es
de `experiencia` (`UX-07`), esto solo fija qué datos tienen que estar disponibles:

1. **Desenlace: tres estados posibles, no dos.** Ganó (agotó el banco), perdió (se
   quedó sin vidas), o se retiró (cerró la partida por su cuenta, sin perder ni agotar
   el banco — apartado 7). Los tres necesitan una pantalla distinta entre sí, y de los
   tres solo la derrota se presenta como algo que salió mal: retirarse no es perder.
2. **Hasta dónde llegó:** el número de la última pregunta respondida sobre el total del
   banco (p. ej. "pregunta 23 de 40") y el nivel en el que estaba (Fácil, Media o
   Difícil) al momento del desenlace.
3. **Cuánto acertó de lo que jugó:** aciertos sobre preguntas respondidas (p. ej. 18 de
   23) — dato secundario, ya no determina ningún tramo.
4. **Si se retiró, cuántas vidas le quedaban.** Es lo que distingue una retirada
   tranquila (3 vidas intactas) de una al límite (1 vida), y solo existe en ese
   desenlace — no aplica a victoria (siempre le quedó al menos 1) ni a derrota (siempre
   0).

**Esto cambia el payload de `ADR-02`.** El link de resultado compartido hoy lleva
`puntaje` y `total` sobre 8 (`src/scripts/partida.ts`, `compartirResultado`); con vidas
esos dos campos no alcanzan para describir ninguno de los tres desenlaces. No resuelvo
yo el esquema del link —es de `arquitectura`, `T-132`— pero dejo dicho qué tiene que
poder representar: cuál de los tres desenlaces fue, pregunta alcanzada sobre el total,
aciertos sobre respondidas, y vidas restantes cuando el desenlace es una retirada.

### 7. Cuánto dura la partida — el problema nuevo va para el otro lado

Medido contra el texto real del banco (`src/data/quiz.json`: enunciado 140 caracteres de
mediana, opciones 72, explicación 171), a ~17 caracteres por segundo de lectura más 4
segundos de decidir y tocar:

| Preguntas | Duración estimada |
|---|---|
| 8 (la ronda fija de hoy) | ~4 min 30 s |
| 10 (fin del escalón Fácil) | ~4 min 25 s |
| 25 (fin del escalón Media) | ~11 min |
| 40 (banco agotado = victoria) | **~18 min 40 s** |

**Dos cosas salen de esta tabla, y las dos hay que decirlas de frente.**

Primera: **la ronda de 8 de hoy ya mide más que los 2-3 minutos que declara el brief.**
No es un problema que crea `BR-19` — lo hereda de `US-01` tal como está construida, y ya
estaba anotado sin validar en `PENDIENTE` ("Validación del tiempo real de partida",
dueño `experiencia`). Lo que sí era mío, y estaba mal: el apartado 8 (antes de esta
corrección) decía que una partida más corta bajo vidas "encaja mejor todavía con la
sesión de 2-3 minutos... que una ronda que fuerza siempre 8 preguntas completas" —
comparando contra un modelo que **también** incumplía esa sesión. Queda corregido ahí.

Segunda, y es la que importa: **ganar cuesta ~18 minutos y 40 segundos, y el jugador que
llega ahí es exactamente el que el sitio dice querer premiar** — el que se sabe el tema
(`Docs/BRIEF.md`, "Para quién"). El que no sabe nada se va en dos o tres preguntas,
sesión corta cumplida; al que más sabe, la mecánica le rompe esa misma promesa justo
cuando más la mereció cumplida.

**Lo que hago con esto, y por qué esta salida y no las otras dos:**

- **"Cortar antes" (que ganar sea llegar a un número menor que 40)** queda descartada:
  chocaría de frente contra el apartado 2 entero — cualquier corte por debajo de 40 deja
  ítems sin usar y reabre el mismo problema matemático que ya resolví ahí (agotar el
  banco dejaría de significar agotarlo). No lo reabro para resolver esto.
- **"Asumirlo por escrito y listo"** no alcanza solo: dejaría a quien más sabe sin
  ninguna salida corta, y el riesgo 1 del brief (dedicación en ráfagas, sesiones
  impredecibles) aplica tanto al jugador como al equipo — nadie que juega en un rato
  suelto tiene por qué comprometerse a 18 minutos para llevarse algo que valga la pena
  compartir.
- **La que uso es "salida limpia a mitad".** El jugador puede terminar la partida
  cuando quiera, sin haber perdido las 3 vidas ni agotado el banco, y se queda con un
  resultado real de "hasta acá llegué" — ni derrota ni victoria, un tercer desenlace
  (apartado 6). Esto no acorta la victoria por agotar el banco —sigue entera, disponible
  para quien quiera ir por los 18 minutos como un logro opcional, tipo maratón— pero
  saca la obligación: nadie necesita jugar 18 minutos para llevarse algo compartible.
  Es, además, lo que más se parece a cómo trabaja este mismo proyecto en ráfagas
  irregulares (`Docs/BRIEF.md`, restricción de tiempo): se corta en cualquier punto sin
  dejar nada roto.

**El botón de salida tiene que estar disponible desde la primera pregunta**, no recién
a partir de cierto punto — si apareciera tarde, seguiría obligando a un tramo largo
antes de poder cortar con dignidad. El texto exacto y dónde vive en pantalla son de
`experiencia` (`UX-07`) y `contenido` (`CNT-10`); esto solo fija que existe, que está
siempre disponible, y qué tiene que mostrar al usarlo (apartado 6).

### 8. Por qué esto sigue sin ser un muro (`D-14`)

Tres vidas con dificultad creciente puede terminar una partida en la pregunta 3 — más
corto que el piso garantizado de 8 preguntas que tenía el modelo anterior. Sigue sin ser
un muro por lo mismo que nunca lo fue el modelo viejo, no por algo nuevo:

- **Ninguna cantidad de errores deja al jugador sin pantalla.** Perder las 3 vidas
  siempre resuelve en un resultado legible (apartado 6), nunca en un estado roto o a
  medio cargar — la continuidad de `US-01` criterio 2 se hereda entera (apartado 1).
- **`Jugá de nuevo` sigue a un toque de distancia**, sin fricción, igual que hoy.
- **El primer ítem sigue siendo Fácil siempre** (`BR-01` punto 1, apartado 4): el que no
  sabe nada tiene, igual que antes, la mejor chance posible de arrancar bien.
- **Nada de esto pide cuenta, login, ni haber jugado antes.** Los molinetes que importan
  acá —poder empezar una partida y poder terminarla con una pantalla que la cierre— están
  intactos. Lo que cambia es cuánto dura la partida de quien sabe poco: puede cerrar en
  la pregunta 3, más corto que el piso de 8 que garantizaba el modelo anterior — un
  modelo que, medido de verdad (apartado 7), tampoco entraba en los 2-3 minutos del
  brief. No es una mejora sobre un modelo que cumplía la sesión corta: es más corto que
  uno que no la cumplía tampoco, y a cambio suma la salida limpia del apartado 7 para
  que el que sabe mucho no quede obligado a los 18 minutos que cuesta ganar del todo.

### Criterio de aceptación (verificable)

1. **Vida por error:** en una partida jugada con al menos una respuesta incorrecta, el
   contador de vidas baja exactamente en 1 por cada respuesta incorrecta y no baja con
   ninguna correcta.
2. **Escalón por pozo, no por número fijo:** en cualquier partida jugada hasta el final
   (con o sin derrota), comparando la secuencia servida contra el banco cargado — los
   ítems de índice 1 a 10 son exactamente el pozo Fácil completo (10 de 10, sin
   repetidos), del 11 al 25 el pozo Media completo (15 de 15), del 26 al 40 el pozo
   Difícil completo (15 de 15). Ningún ítem se sirve dos veces en la misma partida.
3. **Derrota en cualquier punto:** una partida que acumula 3 respuestas incorrectas,
   sea en la pregunta 3 o en la 40, termina en el resultado de derrota — nunca en el de
   victoria, aunque la última pregunta respondida haya sido la número 40.
4. **Victoria solo sin perder:** el resultado de victoria aparece si y solo si el
   jugador respondió las 40 preguntas del banco sin haber llegado nunca a 0 vidas.
5. **Continuidad:** ninguna respuesta —ni la que cuesta la tercera vida— corta la
   partida antes de mostrar la explicación de ese ítem.
6. **Salida voluntaria, disponible desde el arranque:** en cualquier punto de la
   partida —desde la primera pregunta— el jugador puede cerrarla sin haber perdido las
   3 vidas ni agotado el banco, y el resultado que ve es de retirada, distinto de
   derrota y de victoria, con los mismos datos del apartado 6 (pregunta alcanzada,
   nivel, aciertos sobre respondidas, vidas restantes).

---

## US-02 — Adivinar el tema (reveal progresivo de audio)

**Prioridad:** Alta (P0) — se defiende recortando piso antes que salir (`D-05`).

> **Revisión 2026-08-24, sobre `D-24` y `T-99`.** El criterio 1 describía **intento
> único** ("si falla, el ítem se cierra en 0 puntos") y no fijaba largo de ronda. El
> juego construido, calcado a propósito del juego de referencia (`D-24`), es **seis
> intentos con desbloqueo** y una vuelta de **cuatro temas**. Se reescribe el criterio 1
> para que describa eso. Los criterios 2 y 3 no cambian de mecánica y quedan como están,
> salvo el aviso sobre `US-02` criterio 3 en `PENDIENTE`, al final del archivo.

Como jugador que reconoce temas de oído, quiero escuchar un fragmento cada vez más
largo de un tema y arriesgar cuál es, para demostrar que lo reconozco con lo mínimo
posible y ganar más puntos cuanto menos necesité escuchar.

**Criterio 1 — caso feliz:**
- **Given** un jugador arranca un ítem nuevo, que por `BR-01` es de nivel Fácil si es el
  primero de la partida — **con la salvedad medida de `BR-18` apartado (g)**: mientras
  `popularidad.json` no tenga mediciones, todos los temas son `dificil` y este "si es el
  primero" no se cumple. El mecanismo está puesto y se enciende con un comando.
- **When** se reproduce el paso 1 del reveal (0,1 seg) y el jugador busca un título en el
  buscador de los 105 temas de `RES-20` y **arriesga** una respuesta, o **pasa** si no
  tiene ningún candidato — tiene **seis intentos por tema**, uno por escalón (`BR-02`).
- **Then** cada intento gastado (arriesgar mal, o pasar) abre el escalón siguiente de
  audio; si acierta en cualquiera de los seis, el ítem se cierra con el puntaje del
  escalón en que acertó (tabla de `BR-02`); si agota los seis intentos sin acertar, el
  ítem se cierra en 0 puntos, se revela la respuesta correcta, y la partida sigue con el
  próximo ítem sin bloquear al jugador (mismo principio de continuidad que `US-01`
  criterio 2). **Una vuelta son cuatro temas**: a un ritmo de hasta seis intentos por
  tema —cada uno con su propio audio y su tipeo en el buscador— cuatro temas llenan los
  dos o tres minutos del brief con el mismo margen que el quiz reserva para sus 8
  preguntas más simples; `experiencia` valida el tiempo real y puede ajustar el número
  vía `Docs/SUGERENCIAS/`.

**Criterio 2 — caso borde (sin sonido disponible):**
- **Given** un jugador abre el juego con el dispositivo en silencio o sin auriculares.
- **When** intenta escuchar el paso 1.
- **Then** el juego se lo advierte explícitamente antes de arrancar la partida — no lo
  deja adivinar "a ciegas" sin saber que el audio no sonó (el brief pide degradar con
  dignidad, no fallar en silencio).

**Criterio 3 — caso borde (el tema entero no está disponible):**
- **Given** un jugador acierta o agota los pasos de un ítem.
- **When** intenta escuchar el tema completo al revelar.
- **Then** si ese tema todavía no tiene su mp3 en el sitio, igual puede ver el resultado
  del ítem (acertó o no, puntos ganados) sin que un enlace roto le impida cerrar la
  partida.

> **Reescrito el 2026-09-01 (`FIND-35` de `REV-09`). Redacción anterior, por trazabilidad:**
> *"When intenta escuchar el tema completo **vía Spotify** al revelar. Then si no tiene la
> app o no tiene Premium (`D-08`), igual puede ver el resultado…"*
>
> **`D-22` sacó a Spotify del camino** —el sitio sirve los temas enteros en mp3— y en
> `src/scripts/partida-tema.ts` no queda una sola mención a Spotify. El criterio quedó
> describiendo una integración que no existe, y contra eso no se puede aceptar ni rechazar
> nada.
>
> **Lo que el criterio protege no cambió, y por eso se reescribe en vez de retirarse:** que
> un camino roto al tema entero **no le impida al jugador cerrar la partida**. Ahora ese
> camino es el mp3, y el caso borde es real —95 fragmentos contra 105 temas, así que hay
> temas sin entero—, no hipotético.

**Piso de ítems: 30 temas** (subido de 20 — revisión 2026-08-24, ver nota abajo), cada
uno con fragmento de audio propio.
- Mínimo 8 de nivel Fácil — **desde `T-116` (ciclo 8), definido por `BR-18` apartado f**:
  los 8 temas de mayor posición en el ranking de vistas de YouTube, dentro del pool con
  fragmento producido — ya no una etiqueta manual de `contenido`. Resto repartido en
  Media/Difícil. El número (8) sigue siendo el que fijó la revisión del 19 de agosto: sube
  de 5 a 8 en la misma proporción que el piso, manteniendo el ~25-27% que ya usan los
  otros tres juegos (10/40 del quiz, 4/15 de letras), para que `BR-01` no repita siempre
  el mismo puñado de temas fáciles.

> **Nota del 2026-09-01 (`T-164`): hoy esos 8 Fáciles son 0, y aun así el "Listo" de la v1
> no se frena. El motivo está en `BR-18` apartado (g), y no es "es poca cosa".** El
> mecanismo que los produce está construido y verificado; lo que falta es el insumo
> (`YT_API_KEY`), que no lo puede traer ningún rol. Mientras falte, el reparto es plano y
> `catalogo().medidos` vale 0 — **declarado y medible, no supuesto**. El día que la clave
> corra, los ocho aparecen sin tocar una línea de código.
- **Por qué sube de 20 a 30 y no se queda ni iguala al quiz (revisión 2026-08-24, sobre
  `D-24`):** el piso original cargaba **dos** costos por ítem — producir el fragmento de
  audio (`D-06`) y curar tres distractores para el múltiple choice que `BR-04` le exigía
  hasta el 19 de agosto. El segundo costo **desapareció**: con el buscador de `D-24` la
  respuesta sale de elegir un título entre los 105 de `RES-20`, un pool compartido por
  todos los ítems, no un conjunto de opciones que haya que redactar uno por uno. Lo único
  que sigue costando por ítem es el fragmento de audio, y ese costo **no bajó** — sigue
  siendo trabajo manual del usuario (`D-06`). Por eso el piso sube (se fue la mitad del
  costo original), pero se queda lejos del piso de 40 del quiz (la otra mitad, la que no
  se fue, sigue siendo más cara que redactar una pregunta de texto).
- **Esto toca la definición de "Listo" de la v1.** `Docs/BRIEF.md`, sección "Listo de la
  v1", cita literalmente "cada uno con su piso de ítems cumplido (40 / 20 / 15 / 10)" —
  ese segundo número queda desactualizado hasta que se corrija ahí. No lo edito en este
  archivo porque `Docs/BRIEF.md` no es mío; queda anotado en `PENDIENTE`.

**Queda fuera de esta historia:** cómo se sirve el tema completo al revelar (`D-22`
lo saca de Spotify y lo pasa a mp3 propio; el criterio 3 de esta historia y el bullet de
arriba todavía describen la vía vieja — ver `PENDIENTE`, no es parte de esta revisión).

---

## BR-02 — Puntaje del reveal progresivo en "adivinar el tema"

**Aplica a:** `US-02`.

> **Revisión 2026-08-19 (histórica, superada por la de abajo).** La mecánica de intentos
> de esta regla se corrigió a partir de
> `Docs/SUGERENCIAS/ARQ-para-producto-opciones-adivinar-tema.md` (`arquitectura`, `T-24`).
> El texto original permitía errar gratis en cada paso; combinado con `BR-04` (4 opciones,
> extendida entonces también a `US-02`) eso le daba a un jugador que no reconoce nada un
> esperado de 70 puntos con piso de 40, y volvía inalcanzables el paso 5 y la rama de 0
> puntos. La corrección de esa fecha fue **intento único**: errás y el ítem se cierra en
> cero, sin reintento.

> **Revisión 2026-08-24, sobre `D-24` y `T-99`.** El usuario trajo el juego que quiere
> calcado (relevado en `Docs/SUGERENCIAS/HILO-mapa-del-juego-de-referencia.md`) y hace
> **exactamente lo contrario** de la revisión del 19 de agosto: no hay intento único, hay
> **seis intentos**, y errar —o pasar— es lo que abre el escalón siguiente. `US-02` ya
> está construida así (`src/lib/tema/escalera.ts`, `src/scripts/partida-tema.ts`); esta
> revisión hace que la regla escrita diga lo que el juego hace. Reemplaza "la respuesta es
> un solo intento por ítem" y la tabla de 5 filas de la revisión anterior. **Por qué no
> reabre el agujero que motivó el intento único:** ese agujero existía porque, con 4
> opciones, errar gratis era una máquina de descartar hasta la última opción
> sobreviviente. Ahora no hay opciones que descartar — hay un buscador sobre 105 títulos
> (`BR-04`, revisión de esta misma fecha) — así que errar ya no elimina nada útil para el
> jugador. Castigar el error con el ítem entero, en ese contexto, solo servía para cerrar
> el molinete al que entra sin reconocer nada, dejándolo con 0,1 segundo escuchado y nada
> más (`D-14`). Verificación aritmética completa al final de esta regla.

**Pasos:** el reveal tiene **seis pasos fijos**, numerados 1 a 6, de 0,1 a 15 segundos:
0,1 · 0,5 · 2 · 4 · 8 · 15. Los cinco primeros son los que ya fijaba esta regla desde el
19 de agosto; el sexto lo agrega `D-24` porque la escalera del juego de referencia tiene
un escalón más. La duración exacta en segundos deja de ser un `PENDIENTE` de
`arquitectura`: `D-24` la fijó junto con la mecánica y `arquitectura` ya la aplicó en
`CTR-01.9`.

**Mecánica (reescrita — seis intentos con desbloqueo):** el jugador tiene **seis
intentos por tema**, uno por escalón. En cada intento puede:
- **Arriesgar** una respuesta, elegida de un buscador con autocompletado sobre los 105
  títulos de `RES-20` — no hay opciones que contar (`BR-04` ya no aplica a este juego).
- **Pasar**, si no tiene ningún candidato para proponer.

Las dos acciones cuestan lo mismo, **un intento**, y las dos abren el escalón siguiente
(más audio). No hay forma de escuchar más sin gastar un intento, y no hay forma de gastar
un intento sin recibir más audio a cambio.

- **Si acierta:** el ítem se cierra en el acto con el puntaje de la tabla de abajo, según
  el escalón en el que respondió.
- **Si se le acaban los seis intentos sin acertar** (haya arriesgado, pasado, o combinado
  ambas cosas): el ítem se cierra en **0 puntos**, se revela la respuesta correcta, y la
  partida sigue con el próximo ítem — mismo principio de continuidad que el quiz
  (`US-01` criterio 2).

**Por qué "pasar" cuesta un intento y no es gratis** — es la mitad de la mecánica que el
mapa del juego de referencia dejó abierta para que `producto` la confirmara. Pasar y
arriesgar le dan al jugador exactamente lo mismo, el escalón siguiente, así que cobrarle
distinto premiaría la inacción por sobre el intento. Y hay un motivo de fondo: si pasar
fuera gratis, la ronda de seis intentos dejaría de ser un techo real — nada impediría
escuchar los 15 segundos completos sin gastar el recurso que hace que el ítem cierre, y
la vuelta de cuatro temas dejaría de caber en los dos o tres minutos del brief. Con los
seis intentos parejos, ese techo se sostiene. **Pasar existe igual, y no es decorativo:**
es la salida honesta para el jugador que no reconoce nada del catálogo y no tiene ningún
título para proponer — nadie está obligado a tipear una respuesta que no tiene, y esa es
la otra mitad de "sin muro de entrada" (`D-14`). Coincide con el juego de referencia, que
cobra lo mismo por *Skip* que por errar.

**Tabla de puntaje** (las cinco primeras filas son las que ya tenía esta regla, sin
tocar; la sexta la agrega esta revisión):

| Paso alcanzado al responder | Segundos | Puntos si acierta |
|---|---|---|
| 1 | 0,1 s | 100 |
| 2 | 0,5 s | 80 |
| 3 | 2 s | 60 |
| 4 | 4 s | 40 |
| 5 | 8 s | 20 |
| 6 (fragmento completo) | 15 s | **10** |

**Por qué 10 y no 0 en el paso 6:** dos partes de esta regla siguen intactas sin
excepción. Primero, **0 puntos es exclusivamente el resultado de una respuesta
incorrecta** (o de agotar los seis intentos sin responder), nunca el resultado de haber
tardado en acertar. Segundo, un acierto **nunca puede valer 0**, porque eso premiaría
igual al que reconoció el tema recién en el fragmento completo y al que directamente no
lo sacó. **Por qué 10 y no otro número:** confirmo el valor que `D-24` dejó provisorio.
Sigue la caída de a 20 puntos que traían los primeros cuatro escalones y la suaviza en
los últimos dos —de 40 a 20 y de 20 a 10— para no tocar el piso. Es además el valor que
ya está escrito en `src/lib/tema/escalera.ts`, así que confirmarlo cierra la brecha entre
esta regla y el juego construido sin pedirle a nadie que retoque una línea de código.

**Si nunca responde:** si el jugador agota los seis intentos sin haber arriesgado nunca
(pasó las seis veces), cuenta igual que agotar los seis fallando — 0 puntos, respuesta
revelada, la partida sigue.

**Verificación aritmética — jugador que no reconoce absolutamente nada:**

Cambia de raíz respecto de la verificación de la revisión anterior, porque cambió el
mecanismo de responder: ya no hay 4 opciones entre las que tirar una moneda, hay un
buscador sobre los **105 títulos** de `RES-20`. Para un jugador que no reconoce el tema
pero conoce el catálogo, arriesgar un título al azar cuesta lo mismo que pasar y encima
suma una chance de acertar — así que la mejor estrategia posible es tirar seis títulos
distintos, uno por intento, nunca pasar de arranque.

Con seis títulos distintos elegidos sin ninguna información, la probabilidad de que
alguno sea el correcto es 6/105, y por simetría —cualquiera de los seis intentos tiene la
misma chance de ser el que acierta— la probabilidad de acertar justo en el intento `n`
(para `n` de 1 a 6) es 1/105 en cada uno:

| Resultado | Probabilidad | Puntos |
|---|---|---|
| Acierta en el paso 1 | 1/105 | 100 |
| Acierta en el paso 2 | 1/105 | 80 |
| Acierta en el paso 3 | 1/105 | 60 |
| Acierta en el paso 4 | 1/105 | 40 |
| Acierta en el paso 5 | 1/105 | 20 |
| Acierta en el paso 6 | 1/105 | 10 |
| No acierta nunca | 99/105 | 0 |

**Esperado:** (100+80+60+40+20+10)/105 = 310/105 ≈ **2,95 puntos por tema**. Contra el
techo de 25 que fijaba la verificación anterior —y que `BR-04` sigue usando como vara
para el quiz con 4 opciones—, el azar puro rinde acá casi diez veces menos. Dejar
responder sin castigar el error de más no reabre el agujero que motivó el intento único
del 19 de agosto: con 105 títulos, el azar directamente no paga.

**Rama de 0 y paso 6, alcanzables:**
- **Rama de 0:** con la cuenta de arriba, es el resultado del **94,3%** de las tiradas de
  un jugador sin reconocimiento (99/105). Sigue siendo, con enorme margen, el resultado
  más probable para quien no sabe — la promesa de "premiar al que sabe" queda intacta.
- **Paso 6 (10 puntos):** se alcanza cada vez que un jugador, sepa o no, escucha el
  fragmento completo de 15 segundos antes de reconocer el tema. No hace falta ninguna
  eliminación de opciones para llegar ahí: alcanza con pasar o arriesgar cinco veces.

---

## US-03 — Completar la letra

**Prioridad:** Alta (P0) — se defiende recortando piso antes que salir (`D-05`).

Como jugador que se sabe las letras, quiero completar el hueco de un verso con cada vez
menos contexto alrededor, para demostrar que me sé la canción de memoria y no solo por
asociación con el título.

**Criterio 1 — caso feliz:**
- **Given** un jugador arranca un ítem de nivel Fácil (`BR-01`: primer ítem siempre
  Fácil).
- **When** se le muestra el verso con el hueco.
- **Then** ve 2 versos completos antes y 2 después del hueco, más título y disco
  visibles (`BR-03`, nivel Fácil), y puede elegir o escribir qué completa el hueco.

**Criterio 2 — caso borde (nivel Difícil, tema del tercio bajo):**
- **Given** un jugador llega a un ítem de nivel Difícil dentro de la misma partida (el
  tema de ese ítem sale del tercio bajo de popularidad en vivo, `BR-30`).
- **When** se le muestra el ítem.
- **Then** ve únicamente el verso con el hueco, sin versos adicionales, sin título ni
  disco (`BR-03`, nivel Difícil). El tema es siempre uno real de los 105 de `RES-20`
  (`CTR-04.5`) — nunca inventado ni ajeno a la discografía —, pero puede ser un tema que
  no apareció antes en la misma partida: con el nivel derivado del tema (`BR-30`,
  precisión de `D-46`), eso es lo esperado, no una falla. Lo único que escala entre
  niveles es cuánta letra rodea el hueco (`BR-03`); nunca el universo del que sale el
  tema.

> **Enmendado 2026-09-24 (`BR-30`, precisión de `D-46`; contradicción detectada por
> `arquitectura` en `CTR-04.14` 🔴 y traspasada en
> `Docs/SUGERENCIAS/ARQ-para-producto-la-letra-con-el-conteo.md` punto 1 — se adopta la
> opción **A** que propone esa nota).** El título de este criterio decía "mismo tema" y el
> cuerpo decía **"nunca se introduce un tema completamente nuevo solo en modo difícil; la
> dificultad escala mostrando menos letra del mismo universo de temas de la partida, no
> cambiando de tema (pedido explícito del usuario en `/kickoff`)"**. Con el nivel por tema
> que fija `BR-30` (tercios sobre el conteo citado), un tema del tercio bajo da **solo**
> ítems Difícil: por construcción, todo tema que aparece en un ítem Difícil es un tema que
> no pudo haber aparecido antes en la misma partida en Fácil o Media (salvo que dos huecos
> Difíciles compartan tema). El criterio viejo se incumplía siempre, no a veces — no era un
> caso borde que se pudiera cazar con una prueba puntual.
>
> **Qué del `/kickoff` se sostiene y qué no.** La frase de `Docs/BRIEF.md` — "la dificultad
> escala mostrando menos letra, no cambiando de tema" — distinguía este juego de un diseño
> donde "difícil" significara "te pregunto por una canción más rara". Leída así, lo que
> promete es que **el eje de dificultad es cuánta letra se muestra**, no dos ejes separados
> (`BR-30`, argumento 1), y eso se sostiene entero: en los tres niveles el hueco sigue
> siendo un verso real de los 105 de `RES-20`, nunca inventado, y lo único que cambia entre
> niveles es el contexto (`BR-03`). Lo que no se sostiene es la lectura más estricta que
> este criterio le había agregado encima —que el tema de un ítem Difícil tuviera que haber
> aparecido ya en la partida—: eso lo fijó `producto` al escribir la historia, no el
> `/kickoff`, que habla de letra, no de continuidad de temas dentro de una partida. No es
> una promesa incumplida del usuario: es un criterio que pedía más de lo que el pedido
> original exigía.
>
> **Por qué no se ajusta el mecanismo en su lugar.** La salida alternativa —mezclar temas
> de distintos tercios dentro de la misma partida para forzar que un Difícil solo entre si
> su tema ya apareció— exigiría romper el acople de `BR-03` al nivel que `BR-30` acaba de
> defender con cuatro argumentos, entre ellos que ese acople hace que "Fácil" signifique a
> la vez tema muy tocado y máximo contexto (`BR-30`, argumento 3). Reabrir esa decisión sin
> un motivo nuevo —el único motivo sería este mismo criterio, que es lo que se está
> corrigiendo— no se justifica.
>
> **El mitigante ya está escrito, no hace falta uno nuevo:** `BR-01` punto 2, la
> dificultad no baja dentro de la partida. Un tema "completamente nuevo" en modo Difícil
> solo puede aparecer tarde, para quien ya demostró que sabe lo suficiente como para haber
> pasado Fácil y Media (`BR-30`, argumento 4) — no es un muro de entrada (`D-09`, no
> negociable), es el desafío que corresponde a ese tramo de la partida.
>
> `Docs/BRIEF.md`, "Listo de la v1", punto 3, trae la misma frase ("no cambiando de tema")
> y queda con la misma lectura de arriba, pero **no la edito acá**: no es carpeta de
> `producto` en el sentido de "archivo que este PRD sobrescribe" (mismo criterio que la
> nota del piso de `US-02` en `PENDIENTE`, más abajo). Queda anotado en `PENDIENTE`.
>
> Redacción anterior del criterio, por trazabilidad: *"nunca se introduce un tema
> completamente nuevo solo en modo difícil; la dificultad escala mostrando menos letra del
> mismo universo de temas de la partida, no cambiando de tema (pedido explícito del
> usuario en `/kickoff`)."*

**Criterio 3 — caso borde (exposición de derechos):**
- **Given** cualquier ítem de este juego, en cualquier nivel.
- **When** se renderiza en pantalla.
- **Then** nunca muestra más de 5 versos completos de una misma canción a la vez (tope
  fijado en `BR-03`). Si llega un reclamo, el juego se da de baja (`D-14`).

> **Reescrito el 2026-09-01 (`FIND-35` de `REV-09`). Redacción anterior, por trazabilidad:**
> *"…y el juego completo **no se publica hasta que la nota de derechos de `contenido` lo
> habilite explícitamente** — gate de publicación, no de construcción."*
>
> **`D-14` sacó ese cerrojo**, y lo hizo nombrando la alternativa que descartaba:
> *"sostener el gate de `D-07`"*. La nota de derechos (`CNT-01`) sigue existiendo pero
> cambió de función — **ya no es un gate, es un mapa** de qué se usa y de dónde salió.
>
> **El tope de 5 versos no se toca**: ese sí es una regla viva de `BR-03` y se cumple en
> `banco.ts`. Lo que se retira es la condición de publicación, que el sitio ya incumplía
> por decisión tomada: **está publicado desde hace días, con este juego adentro.**

**Piso de ítems: 15 letras completas**, transcriptas y segmentadas en versos.
- Mínimo 4 de nivel Fácil.
  > **Nota 2026-09-24 (`BR-30`, precisión de `D-46`).** De dónde sale la etiqueta de nivel
  > de cada ítem cambió — ya no la pone `contenido` a mano, sale del conteo por tema
  > (tercios, igual que `US-07`) — sin tocar este piso ni el mínimo de 4. Detalle en
  > `BR-30`.
- **Por qué 15 y no 40:** cada ítem exige transcribir la letra completa y segmentarla en
  versos, y es el contenido con mayor exposición directa a derechos de autor (letra
  completa, no un fragmento). Un piso similar al de audio, menor al del quiz, refleja
  ese costo y esa exposición. 15 alcanza para que la partida no repita siempre el mismo
  tema que el jugador acaba de escuchar en "adivinar el tema".

**Queda fuera de esta historia:** la tolerancia de matching cuando el jugador escribe
con errores de tipeo, mayúsculas o tildes (dueño `experiencia` para el mecanismo de
input, `contenido` para qué cuenta como "la palabra correcta").

---

## BR-03 — Niveles de dificultad de "completar la letra"

> **Nota 2026-09-24 (`BR-30`, precisión de `D-46`, `T-286`).** Esta tabla no cambió ni
> una celda. Lo que cambió es de dónde sale el nivel que la tabla consulta: ya no lo pone
> `contenido` a mano por ítem, sale del conteo citado por **tema** — tercios, igual que
> `US-07` (`CTR-19.15`). El argumento completo de por qué el contexto sigue atado al nivel
> en vez de desacoplarse en un eje aparte está en `BR-30`, sección "`BR-03`: el contexto
> sigue al nivel — no se desacopla".

**Aplica a:** `US-03`. Fija lo que el brief dejó `PENDIENTE`: "cuánta letra se muestra
en cada nivel de dificultad". Pedido explícito del usuario en `/kickoff`: la dificultad
escala **mostrando menos letra**, nunca cambiando de tema.

**Unidad de medida:** versos completos visibles alrededor del hueco. El corte respeta
siempre el verso entero — nunca se muestra medio verso ni un adjetivo suelto separado de
su línea. El hueco a completar es siempre una palabra o frase corta dentro de un verso,
en los 3 niveles por igual; lo único que cambia entre niveles es el contexto alrededor,
nunca el tamaño del hueco.

| Nivel | Versos visibles antes del hueco | Versos visibles después | Título visible | Disco visible |
|---|---|---|---|---|
| Fácil | 2 | 2 | Sí | Sí |
| Media | 1 | 1 | Sí | No |
| Difícil | 0 (verso pelado) | 0 | No | No |

**Tope de exposición de derechos:** en ningún nivel se muestran más de 5 versos
completos de una misma canción a la vez (el máximo es el nivel Fácil: 2 + el verso del
hueco + 2). Este número es el que `contenido` cita en su nota de derechos para acotar
cuánta letra por ítem queda expuesta.

---

## BR-04 — Cantidad de opciones en una pregunta de múltiple choice

**Confirmo 4**, ni tres ni cinco. **Aplica a `US-01` y `US-04`**, el mismo número para
las dos: la cuenta de azar no distingue si la opción es texto o una tapa. Con 4 opciones
el que no sabe nada acierta al azar el 25% de las veces; con 3 sube al 33% y empieza a
rendirle casi como al que sabe, justo en los ítems Fáciles que `BR-01` pone primero en
toda partida — eso vacía la promesa de "premiar al que sabe". Con 5 el azar baja al 20%,
pero choca con "jugable con el pulgar" (`D-09`, no negociable): 5 puntos porcentuales de
rigor no justifican ceder un criterio que no cede.

> **Extensión a `US-02`, 2026-08-19 (histórica, retirada por la revisión de abajo).**
> `BR-04` no nombraba a `US-02` porque esa historia dejó el mecanismo de respuesta
> explícitamente fuera de alcance. `arquitectura` escaló la ausencia de regla en
> `Docs/SUGERENCIAS/ARQ-para-producto-opciones-adivinar-tema.md` al escribir `CTR-03`,
> porque sin esta regla, 4 opciones combinadas con el reveal progresivo de `BR-02` (tal
> como estaba redactado) rendían 70 puntos esperados con piso de 40 para quien tira al
> azar, y volvían inalcanzables el paso 5 y la rama de 0 puntos. Esa fecha cerró las dos
> mitades del problema juntas: confirmó 4 opciones para `US-02` y corrigió `BR-02` a
> intento único.

> **Retiro de `US-02`, 2026-08-24, sobre `D-24` y `T-99`.** `US-02` deja de responder por
> opciones: el buscador con autocompletado de `D-24`, sobre los 105 títulos de `RES-20`,
> reemplaza el múltiple choice que la extensión de arriba le había impuesto.
> **`BR-04` deja de aplicar a `US-02`** — vuelve a aplicar solo a `US-01` y `US-04`, como
> en su redacción original. No hay "cuatro opciones" que contar cuando la respuesta sale
> de elegir un título de una lista de 105: el control del azar de ese juego se movió
> entero a `BR-02`, que lo recalcula contra el tamaño real del catálogo (105) en vez de
> contra un número fijo de opciones. `modoRespuesta: "buscador"` en `CTR-03.5` es el valor
> que corresponde ahora; `"opciones"` queda retirado para este juego.

---

## BR-05 — Cortes de puntaje de los tres tramos de resultado (bajo / medio / alto)

> **Revisión 2026-08-25 (`T-129`, ciclo 9), sobre `BR-19`.** Esta regla necesita una
> ronda de **largo fijo** para que "% de aciertos sobre el total" signifique algo —
> `BR-19` saca a `US-01` de ese modelo: con vidas, la partida cierra en la pregunta 3 o
> en la 40, nunca en un total conocido de antemano. **Se retira de `US-01`.** Los dos
> cortes de abajo (30% / 70%) y su argumento no se derogan: quedan escritos y
> disponibles para **`US-04`**, que sigue jugando con `armarRonda` de largo constante y
> las mismas 4 opciones de `BR-04`, y hoy no tiene tramos de resultado propios. Si
> `experiencia` le suma tramos a la pantalla de `US-04`, estos son los que corresponde
> citar — esa decisión no está tomada acá, es de `experiencia`.

**Aplica a:** ~~`US-01`~~ retirada por `BR-19` (ciclo 9, ver nota arriba). Disponible
para `US-04` si `experiencia` decide sumarle tramos de resultado — no confirmado. Pedido
originalmente por `experiencia` en
`Docs/SUGERENCIAS/UX-para-producto-historias-quiz-y-audio.md` — única cosa que quedó
abierta tras `UX-01` (pantalla final) y `UX-02` (tarjeta compartible): ambas diseñan la
*estructura* de tres niveles y esperan de acá el % de aciertos que separa cada tramo.

**Los dos cortes, en % de aciertos sobre el total de la ronda, sin huecos ni solapes:**

| Tramo | Rango de % de aciertos |
|---|---|
| Bajo | 0% ≤ x < 30% |
| Medio | 30% ≤ x < 70% |
| Alto | 70% ≤ x ≤ 100% |

**Por qué el corte de abajo va en 30% y no en 25% o menos:** `BR-04` fija 4 opciones por
pregunta, y con 4 opciones el azar puro rinde 25% de aciertos — un jugador que responde
sin saber nada, al azar, saca en promedio 2 de 8. Si ese resultado cayera en "medio", el
tramo medio dejaría de distinguir "sabe algo" de "tocó botones al azar", y vaciaría la
promesa del brief de "premiar al que sabe sin expulsar al que recién llega" (`D-09`). El
corte en 30% deja al azar puro firmemente adentro de "bajo", con 5 puntos porcentuales de
margen para que ningún redondeo real lo empuje a "medio". El corte de arriba (70%) no
tiene la misma restricción — no hay un umbral de azar que defender ahí — y queda fijado
para que "alto" represente una minoría exigente sin vaciar "medio" del otro lado.

**Cómo redondea sobre una ronda de 8 preguntas (`US-01` criterio 1):** los únicos
resultados posibles son 0 a 8 aciertos — nueve valores discretos de %: 0 / 12,5 / 25 /
37,5 / 50 / 62,5 / 75 / 87,5 / 100. Verificado a mano contra los cortes de arriba:

| Aciertos | % | Tramo |
|---|---|---|
| 0/8 | 0% | Bajo |
| 1/8 | 12,5% | Bajo |
| 2/8 | 25% | Bajo |
| 3/8 | 37,5% | Medio |
| 4/8 | 50% | Medio |
| 5/8 | 62,5% | Medio |
| 6/8 | 75% | Alto |
| 7/8 | 87,5% | Alto |
| 8/8 | 100% | Alto |

Los tres tramos reciben al menos un valor posible (tres cada uno), `0/8` cae en Bajo,
`8/8` cae en Alto, y ningún resultado posible de 8 preguntas cae justo sobre un corte
(30% y 70% quedan entre dos valores discretos), así que no hace falta regla de desempate
por redondeo.

**Fuera de esta regla:** el título/copy de cada tramo (dueño `contenido`) y el arte
asociado por tramo (dueño `experiencia`, `UX-04`) — acá solo se fijan los dos números.

---

## US-04 — Adivinar la tapa o el disco

**Prioridad:** Media (P1) — **la primera que se cae si hay que recortar** (`D-05`: es
la de mayor exposición a la obra de Rocambole, artista vivo, y la que menos depende del
resto del sistema).

Como jugador que reconoce tapas de memoria, quiero ver una tapa y adivinar a qué disco
pertenece, para demostrar que conozco la discografía visualmente, en una partida que
cierra igual de rápido que las otras tres.

**Criterio 1 — caso feliz:**
- **Given** un jugador arranca una partida, cuyo primer ítem es Fácil por `BR-01`.
- **When** se le muestra una tapa en baja resolución con crédito a Rocambole (`D-04`).
- **Then** puede elegir entre opciones de múltiple choice (nunca tipeo — jugable con el
  pulgar, criterio no negociable) cuál es el disco correcto, y ve el resultado
  inmediatamente sin pasos adicionales.

**Criterio 2 — caso borde (pool en su piso mínimo):**
- **Given** el pool de tapas está en su piso mínimo (10).
- **When** un jugador juega varias partidas seguidas.
- **Then** el juego sigue siendo jugable de punta a punta (arranca, muestra tapas,
  cierra con resultado) aunque repita tapas entre partidas distintas — repetir contenido
  entre partidas no es lo mismo que no cerrar un ciclo dentro de una partida.

**Criterio 3 — caso borde (es el primero que se cae):**
- **Given** este es el juego con mayor exposición a la obra de Rocambole.
- **When** llega un reclamo de quien corresponda.
- **Then** es el primero en darse de baja, sin que eso arrastre a los otros tres juegos
  (orden de corte, `D-05`; postura, `D-14`).

> **Reescrito el 2026-09-01 (`FIND-35` de `REV-09`). Redacción anterior, por trazabilidad:**
> *"When llega el momento de publicar el sitio. Then es el primero en quedar fuera de la
> versión publicada **si la nota de derechos de `contenido` no cubre explícitamente el uso
> de tapas reales**."*
>
> Mismo motivo que en `US-03`: **`D-14` retiró el cerrojo**. Y acá el criterio viejo era
> además contrafáctico — el sitio está publicado, con las diez tapas adentro y el crédito a
> Rocambole a la vista.
>
> **El orden de corte se conserva entero**, que es lo que este criterio existe para fijar:
> si hay que sacar algo, este juego sale primero. Lo que cambió es qué lo dispara — antes
> una nota que nunca se cerró, ahora un reclamo, que es el hecho real del que habla `D-14`.

**Piso de ítems: 10 tapas o discos.**
- Mínimo 3 de nivel Fácil.
- **Por qué 10 y no más:** a propósito es el piso más bajo de los cuatro. Es el juego
  que se cae primero (`D-05`), así que mantener su piso bajo minimiza el trabajo hundido
  si hay que recortarlo entero. Al mismo tiempo, con menos de 10 el jugador memoriza el
  pool completo en una sola sesión y el juego deja de ser un desafío. La cobertura
  ideal es la discografía de estudio completa; el número final de discos oficiales no lo
  fijo yo sin fuente — queda sujeto a una ficha `RES-XX` de `investigador` (`D-09`,
  ningún dato falso incluye no inventar cuántos discos hay).

**Queda fuera de esta historia:** si la tapa se muestra completa o recortada/pixelada
como parte de la mecánica de dificultad (dueño `experiencia`, con el material que
`investigador` fiche).

---

## Piso de ítems — resumen

| Juego | Piso | Mínimo Fácil | Costo dominante |
|---|---|---|---|
| Quiz (`US-01`) | 40 preguntas | 10 | Texto — el más barato, se construye primero |
| Adivinar el tema (`US-02`) | 30 temas *(subido de 20 el 2026-08-24)* | 8 | Audio propio por ítem (`D-06`) — bajó al perder la curación de distractores que exigía el múltiple choice (`D-24`) |
| Completar la letra (`US-03`) | 15 letras | 4 | Transcripción + mayor exposición a derechos |
| Adivinar la tapa (`US-04`) | 10 tapas | 3 | Imagen con derechos; primero que se cae (`D-05`) |

Ningún juego cierra un ciclo por debajo de su piso, sin importar cuánto tiempo lleve el
motor terminado.

**Nota `T-116` (ciclo 8):** el "Mínimo Fácil" de `US-02` (8) dejó de ser una etiqueta que
`contenido` asigna a mano — desde esta ráfaga sale del ranking de vistas de YouTube
(`BR-18`, apartado f). Los otros tres juegos siguen con etiqueta manual, sin cambios.

**Nota `T-129` (ciclo 9):** el piso de `US-01` (40) dejó de ser solo "el pool del que
sale una ronda de 8": con `BR-19`, es el largo entero de la partida por vidas y el mapa
de sus tres escalones (10/15/15). Sigue siendo 40 —no sube por esto— pero ahora
significa más.

**Esta tabla es la de los cuatro juegos que `D-05` fijó como "Listo" de la v1.** `US-06`,
a continuación, es historia nueva y queda fuera de esa cuenta a propósito — ver el primer
párrafo de esa historia.

---

## US-06 — Test: qué tipo de ricotero sos (fuera del "Listo" de la v1)

> **Origen: `IDEA-09` promovida por `T-115` (ciclo 8), sobre `BR-16`.**
> `Docs/PRODUCTO/PRD-backlog-ideas.md` trae el detalle de por qué esta idea, de las diez
> guardadas, era la candidata más fuerte: texto puro, sin audio ni imagen con derechos, y
> devuelve una identidad en vez de un puntaje. Acá se fija lo que faltaba: los ejes (ya
> decididos por el usuario), los criterios, el piso y qué devuelve.

**Prioridad: no forma parte del "Listo" de la v1.** `D-05` confirmó **cuatro** juegos como
el contrato de la v1 (`Docs/BRIEF.md`, "Listo de la v1"), y esa es una decisión del usuario
en `/kickoff`, no algo que `producto` redefina en solitario porque apareció una quinta idea
buena. `US-06` entra al sitio del mismo modo que ya entró `US-05` (la Redondopedia):
construible y publicable sin esperar a nada, pero contada aparte de los cuatro juegos que
definen si la v1 está "lista".

**Por qué no desplaza a `US-02` ni a `US-03`.** Las dos siguen en 0 de su piso (30 y 15) y
las dos están frenadas por trabajo que **ningún rol puede adelantar**: `US-02` espera a que
el usuario produzca los fragmentos de audio (`D-06`); `US-03` espera a que el usuario
escuche los 24 versos de la hoja de escucha y confirme el minuto de cada uno. Sacar
cualquiera de las dos para meter `US-06` en su lugar no acorta esa espera ni un día — el
cuello de botella es el mismo con o sin esta historia. Y `US-06` **no compite por ese mismo
recurso**: es texto puro, así que `contenido` puede escribir su banco en la misma ráfaga en
la que espera al usuario para lo otro, sin retrasar a `US-02` ni a `US-03`.

**Por qué los ejes pasan la prueba de "ningún resultado mejor que otro" (`BR-17`).**
Decisión del usuario, textual: *"un eje luz oscuridad y otro eje orden caos"*. Ninguno de
los dos mide cuánto sabe el jugador de la banda — no es historia, no son discos, no es
letra, no es mitología. Son dos maneras de estar en esto, no dos niveles de estarlo. Contra
esos mismos ejes, uno que sí hubiera roto la regla: "sabe mucho / sabe poco", que convierte
el test en una clasificación y cierra el molinete (`D-14`). Los ejes del usuario no tienen
ese problema.

**Qué se ubica en el plano, y qué no.** Se ubica el **jugador**, con sus respuestas. **No
se les asigna coordenadas a los 105 temas** — decisión explícita del usuario, y la que saca
del medio el problema real que esta idea tenía: una coordenada por tema es una afirmación
sobre la obra ("este tema es más caos que aquel"), y habría que defenderla tema por tema.
El test no necesita esa afirmación: alcanza con que cada *pregunta* del banco mueva al
jugador, no con que cada *tema* tenga una posición fija.

**Criterio 1 — caso feliz:**
- **Given** un jugador nuevo abre el test.
- **When** arranca una partida.
- **Then** el sistema sirve 10 preguntas de elección entre dos opciones —5 que mueven el
  eje luz↔oscuridad, 5 que mueven el eje orden↔caos (`BR-17`)— *(supuesto de duración de
  sesión, análogo al de `US-01`: elegir entre dos opciones cortas sin necesitar saber nada
  de la banda se resuelve más rápido que una pregunta de conocimiento — 10 entran cómodas
  en los 2-3 minutos del brief; `experiencia` valida el tiempo real y puede ajustar el
  número vía `Docs/SUGERENCIAS/`)*, ninguna tiene respuesta correcta ni incorrecta, y al
  responder la última el sistema devuelve **un cuadrante de los cuatro, con nombre propio**
  — no un puntaje ni un porcentaje — sin que el jugador haya necesitado crear cuenta ni
  loguearse.

**Criterio 2 — caso borde (el empate es imposible por diseño):**
- **Given** un jugador responde alternando sin ningún patrón reconocible.
- **When** termina la partida.
- **Then** el resultado cae siempre en uno de los cuatro cuadrantes — nunca "empate" ni un
  quinto resultado "neutro" — porque cada eje se resuelve con una cantidad impar de
  preguntas (5 y 5, `BR-17`), así que ningún eje puede terminar 50/50.

**Criterio 3 — caso borde (ningún cuadrante es mejor):**
- **Given** el jugador cae en cualquiera de los cuatro cuadrantes.
- **When** se le muestra el resultado.
- **Then** nada en la pantalla lo jerarquiza sobre los otros tres: no hay tramos como los
  de `BR-05` (bajo/medio/alto), no se muestra el conteo exacto de respuestas por eje, y
  ningún cuadrante se presenta como el "verdadero" o el "más" ricotero — es una identidad,
  no una nota.

**Criterio 4 — caso borde (se comparte, como pedía la idea):**
- **Given** un jugador terminó el test.
- **When** toca compartir el resultado.
- **Then** lo que se comparte es el nombre de su identidad como elemento central, sin
  puntaje visible — el mismo principio que ya resuelve `UX-02` para el quiz, aplicado a un
  resultado que no es un número. Si `UX-02` sirve tal cual o necesita una variante para un
  resultado sin puntaje lo decide `experiencia`; esta historia solo fija que el enganche
  existe y qué NO puede llevar (puntaje, ranking).

**Piso de ítems: 20 preguntas** (10 por eje: 10 que mueven luz↔oscuridad, 10 que mueven
orden↔caos), cada una con exactamente 2 opciones, una por extremo del eje que le toca.
- Cada partida sirve un subconjunto elegido al azar: 5 de las 10 de cada eje (10 preguntas
  por partida), manteniendo siempre el conteo impar por eje que exige `BR-17`.
- **`BR-01` (escalonamiento de dificultad) no aplica a esta historia.** No hay dificultad
  que escalonar: ninguna pregunta es "más difícil" que otra porque ninguna pide saber algo
  de la banda — son elecciones de temperamento, no de conocimiento. Por el mismo motivo no
  hay mínimo de ítems "Fáciles" que fijar acá.
- **Por qué 20 y no más:** es el contenido más barato de todo el banco. No necesita
  fragmento de audio (`D-06`), no necesita imagen con derechos, no necesita curar
  distractores (`BR-04` no aplica: no hay opción incorrecta que descartar) y no necesita
  ficha `RES-XX` — no es una afirmación verificable, es una elección de identidad, así que
  la regla de veracidad no la alcanza. Aun así el piso no baja a "doce preguntas" (riesgo 4
  del brief): con 10 ítems por eje y una ronda que usa 5, dos partidas seguidas del mismo
  jugador ya pueden no coincidir.
- **Los cuatro cuadrantes tienen nombre propio**, fijado por `contenido` (fuera de esta
  historia) en registro 1 de `.claude/rules/voz-ricotera.md` — título de ≤8 palabras, sin
  comparativo ni superlativo que implique jerarquía entre los cuatro. **No hay grados
  dentro de un cuadrante:** alcanza con caer en uno. Abrir niveles de intensidad ("bastante
  caótico" / "muy caótico") multiplica el banco que `contenido` tiene que escribir y, peor,
  abre la puerta a que un grado se lea como más o menos ricotero que otro — exactamente lo
  que la restricción del usuario prohíbe.

**Queda fuera de esta historia:** el texto exacto de las preguntas, las dos opciones de
cada una, y el nombre de los cuatro cuadrantes (dueño `contenido`); si `UX-02` se reutiliza
tal cual o necesita una variante para un resultado sin puntaje (dueño `experiencia`); el
mecanismo de sorteo de las 5 de 10 por eje (dueño `arquitectura`).

---

## BR-17 — Los ejes de "qué tipo de ricotero sos" no miden nivel, y cada pregunta mueve uno solo

**Aplica a:** `US-06`.

**Los ejes**, decisión del usuario y no discutible acá: **luz↔oscuridad** y **orden↔caos**.

**Regla 1 — un ítem, un eje.** Cada pregunta del banco mueve exactamente uno de los dos
ejes, nunca los dos a la vez. Una pregunta que empujara luz/oscuridad y orden/caos al mismo
tiempo le restaría al jugador la posibilidad de tener una postura distinta en cada eje, que
es lo que hace que haya cuatro cuadrantes y no dos resultados.

**Regla 2 — cada opción tira a un extremo puro.** Las dos opciones de una pregunta no son
"un poco más luz" y "un poco más oscuridad": son luz u oscuridad, sin punto intermedio. Sin
este piso binario, la regla 3 no alcanza para garantizar que no haya empate — hace falta
que cada respuesta valga lo mismo que cualquier otra del mismo eje.

**Regla 3 — conteo impar por eje dentro de una partida.** El número de preguntas que mueven
un mismo eje, dentro de una misma partida, es siempre impar. Es la única forma de que un
eje nunca termine 50/50: con un número par, un jugador que responde parejo empataría y el
test necesitaría un quinto resultado ("neutro") que ninguna de las diez ideas guardadas ni
el pedido del usuario contemplan. `US-06` fija ese número en 5 por eje (10 preguntas por
partida); si en el futuro cambia, tiene que seguir siendo impar.

**Por qué estos dos ejes pasan la restricción de "ningún resultado mejor que otro" y otros
no la pasarían.** Ninguno de los dos correlaciona con cuánto sabe el jugador de la banda:
no hay una "cantidad correcta" de luz ni de orden. Un eje que sí la rompería es cualquiera
que mida conocimiento —"sabés mucho / sabés poco de la banda"— porque ahí el test deja de
separar maneras de ser ricotero y pasa a clasificar quién lo es más, que es cerrar el
molinete (`D-14`).

---

## BR-18 — La promesa de popularidad: YouTube sí, Spotify no, nunca mezclados

**Aplica a:** el pedido del usuario en el ciclo 8, textual: *"agregando informacion de
cantidad de escuchas de cada tema en spotify y youtube para poder rankear temas por mas
escuchas y demas, asi conocer los populares y los mas oscuros"*. Consume `RES-51`
(`Docs/INVESTIGACION/INV-25-escuchas-spotify.md`, Spotify cierra en negativo) y `RES-52`
(`Docs/INVESTIGACION/INV-26-reproducciones-youtube.md`, YouTube abre con condiciones).

**No es uno de los cuatro juegos de `D-05` ni `US-06`**: es una promesa transversal sobre
datos, del mismo tipo que `BR-06` (la promesa de escuchar el tema por Spotify). Este
documento no diseña la pantalla donde vive el ranking (dueño `experiencia`) ni puebla el
dato (dueño `arquitectura` para el schema y la corrida que resuelve los `videoId`;
`contenido` para el criterio de qué video declarar cuando falta el canal Topic).

### a) Qué promete el sitio

**De Spotify, nada.** `RES-51` es taxativo: nunca existió un contador público de
reproducciones, y el índice `popularity` que sí existía lo sacaron en febrero de 2026 para
apps en Development Mode — el modo en el que este sitio está y va a seguir estando, porque
el único que conserva el campo exige organización legal registrada y 250.000 usuarios
activos mensuales. No hay ningún número al que apuntar, ni siquiera aproximado, así que el
sitio no dice nada sobre popularidad en Spotify — ni "más escuchado", ni "estimado según
terceros": el tracker de terceros que releva `RES-51` (kworb.net) no cubre el catálogo
completo y deja afuera justo a los temas oscuros, que es lo que este pedido quiere poder
encontrar.

**De YouTube, esto y no más:** el sitio dice **"el más visto en YouTube"**, nunca "el más
escuchado" a secas. Es el mismo movimiento que hizo `BR-06` con Spotify: ahí la promesa
bajó de "reproducción" a "acceso"; acá baja de una afirmación sobre el gusto de la gente
—que el sitio no puede sostener con este dato— a una afirmación chica y verificable:
cuántas vistas tiene un video puntual, medidas tal día. Todo número que el sitio muestre
lleva pegados los tres datos que exige `RES-52`: **cifra, fecha de medición, video de
origen** (canal + título). Sin los tres juntos, ese número no se publica.

### b) Ranking, no cifra suelta — y por qué

El sitio muestra un **orden**, no una cifra cruda como protagonista. La posición de un
tema en la lista de populares/oscuros es lo que se destaca; el número de vistas, si se
muestra, va chico y siempre con su fecha al lado — nunca como titular solo.

**Por qué:** una cifra absoluta ("3,4 millones de vistas") empieza a quedar vieja apenas
pasa un día, porque las vistas solo suben. El sitio trabaja en **ráfagas muy irregulares**
(`Docs/BRIEF.md`, restricción de tiempo: "a veces veinte minutos, a veces un domingo
entero. No hay fecha de entrega"), así que no hay forma de prometer que esa cifra se
actualice todos los días. Un **orden**, en cambio, aguanta meses: que un tema siga siendo
más visto que otro casi no cambia aunque las cifras de los dos suban. Es la misma lógica
de `BR-06` —prometer lo que se puede sostener, no lo que luce mejor el primer día—
aplicada a un dato que envejece distinto que un enlace roto.

**Lo que descarto:** publicar la cifra cruda como titular del ranking. No es un problema
legal —`RES-52` (apartado d) lo autoriza expresamente— es que este sitio no tiene con qué
mantenerla fresca al ritmo al que envejece.

### c) Temas sin video en el canal Topic

Ningún tema queda fuera del ranking por no estar en el canal Topic. `RES-52` (apartado b)
es puntual: no se puede reportar "las vistas del tema" sin decir de qué video salieron,
pero sí se puede usar otro video declarado. La regla:

**Topic primero. Si el tema no está ahí, `contenido` elige el video más defensible** (canal
oficial de la banda antes que subida de fans; audio de estudio antes que en vivo o lyric
video) **y el sitio lo dice al lado del número, siempre** — mismo registro seco que un
rótulo `LEYENDA`: sin adorno, dice de dónde salió el dato.

Si de verdad no existe ningún video ubicable para un tema —caso límite, no esperado— ese
tema queda **afuera del ranking**, sin número inventado ni cero falso. No bloquea nada más:
el tema sigue jugable en los otros juegos igual. Es "sin muro de entrada" aplicado a la
integridad del ranking, no a la partida — no se le niega al jugador ver la lista completa
por culpa de un solo tema sin dato.

### d) La obligación de refrescar — cada cuánto

`RES-52` (apartado d) exige "esfuerzos razonables" para que el dato guardado no se
desactualice. Traducido a un número operable, dado el ritmo de ráfagas del proyecto —sin
fecha fija, sin cron posible sin costo ("cero costo recurrente" en `Docs/BRIEF.md`)—:

**Ningún número queda circulando con más de 180 días desde su fecha de medición.** Antes
de publicar cualquier cambio que toque el banco de contenido, si la fecha de medición del
ranking tiene más de 180 días, refrescarlo es parte obligatoria de esa ráfaga — no una
tarea aparte que se puede seguir postergando indefinidamente. El refresco en sí es barato
una vez resueltos los `videoId` (`RES-52`, apartado c: 3 unidades de cuota para los 105
temas), así que el costo técnico no es la excusa; el compromiso es de calendario, no de
plata ni de cuota.

**Por qué 180 y no 30 ni 365:** 30 días es una promesa que este proyecto, con ráfagas de
"a veces un domingo entero" y sin fecha de entrega, va a romper seguido — y una promesa
que se rompe seguido es peor que no hacerla. 365 días es exactamente el piso que ya quedó
señalado como falla ("que no sea de hace un año"). 180 queda a mitad, con margen real de
sobra por debajo del límite que ya se identificó como inaceptable.

**Verificación:** binaria — hoy menos la fecha de medición guardada, comparado contra 180.
No hace falta juicio, alcanza con la resta.

### e) YouTube y Spotify no se mezclan, nunca

`RES-52` (apartado f) lo deja escrito: universos de usuario distintos, umbrales de
validación distintos, y ninguna fuente los declara equivalentes. **Sumarlos o promediarlos
sería una invención del sitio** — exactamente lo que la regla de veracidad (`D-14`)
prohíbe, aunque acá no haya una respuesta de quiz de por medio: es un dato que el jugador
puede creer, y el sitio no le muestra un número que no puede defender.

Van como **dos rankings separados**, o no van. Hoy solo existe el de YouTube. Si algún día
vuelve un número de Spotify —`RES-51` deja la puerta entreabierta a "Extended Quota Mode"
si el sitio alguna vez tuviera 250.000 usuarios activos mensuales, cosa que un fan site sin
fines de lucro no va a tener— entra como una segunda lista con su propio rótulo, nunca
fusionada con la de YouTube en un "popularidad" único.

### f) Resuelve la cuota de Fáciles de `US-02` (el hilo de `arquitectura`)

> **Enmendado 2026-09-23 por el apartado (h), sin borrarse.** La fuente del orden de los 8
> Fáciles deja de ser el ranking de vistas de YouTube y pasa a ser el conteo citado de
> setlist.fm (`D-45`). Este apartado queda como registro de la regla original y de por qué
> se llegó a "posición, no corte fijo" — ese razonamiento se hereda entero en (h). **La
> vara vigente hoy es la de (h)**, más abajo.

`Docs/SUGERENCIAS/HILO-para-producto-cuota-de-faciles-en-us02.md` dejó tres salidas sin
elegir porque la etiqueta `dificultad` ya no vive en `adivinar-tema.json` (ese archivo es
manifiesto de audio desde `D-24`, no banco de ítems). Con el ranking de YouTube de esta
regla, la **salida 2** que planteaba el hilo —una regla de producción, no un campo nuevo—
deja de ser una vara blanda y se puede medir:

**Regla: dentro del pool de temas que tienen fragmento de audio producido, "Fácil" son los
8 de mayor posición en el ranking de vistas de YouTube** (apartado b de esta regla),
recalculado en cada refresco (apartado d). No es un campo nuevo en el manifiesto —
`arquitectura` ya dejó dicho que ahí no va, porque el manifiesto declara qué archivos hay,
no qué tan conocido es un tema— es una consulta contra el archivo del ranking, que es un
artefacto separado.

**Por qué posición y no un corte fijo de vistas:** las vistas solo suben, así que un
umbral fijo ("más de X vistas") sería cada vez más fácil de cruzar con los años y metería
temas que hoy no calificarían — el corte se corrompería solo, sin que nadie lo tocara. Un
**top-8 por posición** no tiene ese problema: sigue siendo top-8 pase el tiempo que pase,
mientras el ranking se refresque según el apartado d.

**Con el dato que hay hoy, no con el que falta:** esta regla se fija ahora porque no
necesita las cifras reales para existir — es una fórmula, no una medición. Las cifras
reales las trae `arquitectura` (resolver los 105 `videoId` una vez, `RES-52` apartado c) y
`contenido` (el criterio de video declarado, apartado c de esta regla) en la próxima
ráfaga que toque esto. Hasta entonces, `US-02` sigue sin poder verificar su cuota de
Fáciles — exactamente como hoy, porque sigue en 0 de su piso de 30.

---

### g) Qué hace el "Listo" de la v1 con la cuota de Fáciles sin medir — **2026-09-01, `T-164`**

El apartado (f) dejó la frase *"hasta entonces, `US-02` sigue sin poder verificar su cuota
de Fáciles"* y la dejó cómoda, porque el piso estaba en 0 de 30 y la pregunta no apremiaba.
**Ahora apremia:** el piso está en 95, los otros cuatro también están cumplidos, y esto es
lo único que separa a la v1 de poder declararse. Así que se contesta.

**La decisión: la cuota de Fáciles sin medir NO frena el "Listo" de la v1.** Y no es por
conveniencia — se decide con tres condiciones que se pueden correr, y si alguna cae, cae la
decisión.

**El argumento, que es el que importa.** El mínimo de 8 Fáciles no es un fin: existe para
servir a `BR-01` punto 1, *nunca un muro en la primera pantalla*. La pregunta entonces no
es "¿hay ocho fáciles?" sino **"¿este juego le pone un muro al que llega sin saber nada?"**,
y en `US-02` la respuesta es distinta que en los otros tres, por una razón que ninguna de
las tres comparte:

> **`US-02` tiene una segunda rampa, adentro de cada ítem.** Por `D-24` el tema se revela en
> **seis pasos** —0,1 · 0,5 · 2 · 5 · 10 segundos— y **errar abre más audio** en vez de
> cerrar la puerta. El que no reconoce el tema en el primer pestañeo no pierde: escucha más.
>
> En el quiz, en las tapas y en las letras la primera pantalla es de una sola oportunidad —
> sabés el dato o no lo sabés—, y ahí el orden de los ítems **es** la única rampa que hay.
> Por eso `BR-01` punto 1 pesa distinto en cada juego, y por eso acá se puede sostener sin
> los ocho.

**Las tres condiciones, y cómo se verifican.** La decisión vale mientras las tres se
cumplan; el día que una falle, la cuota vuelve a ser bloqueante:

1. **La escalera de seis pasos sigue existiendo y errar sigue abriendo audio** (`BR-02`,
   `D-24`). Es la rampa que reemplaza al orden. Se verifica en `src/lib/tema/escalera.test.ts`.
2. **El mecanismo está puesto, no prometido.** El campo existe, la vuelta escalona y el día
   que haya mediciones los ocho aparecen solos. Se verifica en
   `src/lib/tema/catalogo.test.ts` y `src/lib/escalonar.test.ts`.
3. **La degradación se declara y se puede leer.** `catalogo().medidos === 0` dice "este
   juego no escalona" sin que haya que deducirlo jugando, y el sitio no afirma en ningún
   lado que escalona. Un ✅ sobre esto sería lo mismo que un dato falso puesto como
   respuesta correcta: le miente al que sabe.

**Lo que esta decisión NO hace, para que nadie la estire.** No retira la cuota de 8 Fáciles
—sigue escrita, sigue siendo el objetivo y sigue esperando la clave—, no la extiende a los
otros tres juegos, y no dice que `BR-01` sea opcional. Dice una cosa sola: que en el juego
que reparte audio progresivo, el orden de los ítems no es el único molinete abierto.

*Alternativa descartada:* **frenar la v1 hasta que corra la clave.** Se descarta porque
dejaría el "Listo" del proyecto colgado de una credencial de un tercero, cuando el juego
se juega hoy de punta a punta en un celular y su rampa propia funciona. `D-14` ya fijó la
proporción del proyecto para este tipo de decisión, y `D-05` fijó que el alcance se
defiende recortando antes que no salir.

*Alternativa descartada:* **etiquetar ocho temas a mano** para cumplir la letra de la
cuota. Es lo que `D-27` y el apartado (f) de esta misma regla descartaron dos veces, con el
mismo motivo: una etiqueta manual de "qué tan conocido es" se corrompe sola. Cumplir la
cuota con un dato peor es cumplirla en el papel y romperla en la pantalla.

---

### h) La vara de Fáciles cambia de fuente: lo más tocado en vivo — 2026-09-23, `T-274`, enmienda de `D-45`

> **Enmendado 2026-09-24 por `BR-30` (`D-46`), sin borrarse.** Lo que sigue fijaba la vara
> del conteo en vivo únicamente para `US-02`. `D-46` —*"la dificultad de todo lo que sea
> con canciones sale de ahí"*— la extiende de principio, no de mecanismo: el corte de 8
> fijo que define este apartado sigue siendo propio de `US-02` (`BR-30` no lo toca); lo que
> se extiende a otros juegos con canciones —hoy, `US-07`— es la fuente (el conteo citado
> de setlist.fm), repartida con la regla de tercios que ya tenía asignada `D-27`, no con
> este corte de 8. El detalle completo, juego por juego, está en `BR-30`.

**El apartado (f) queda enmendado, no derogado.** Lo que sigue reemplaza únicamente **de
dónde sale el orden** de los 8 Fáciles de `US-02`; la cuota (8), el pool sobre el que se
calcula (temas con fragmento de audio producido) y el motivo de fondo (`BR-01` punto 3:
que el primer ítem no sea siempre el mismo) siguen intactos y se heredan textuales del
apartado (f). Se marca enmendado en vez de borrarse para que quede a la vista qué cambió
y por qué — mismo criterio que usa `CLAUDE.md` con sus propios avisos corregidos.

**Qué cambió y por qué.** `D-45` (decisión del usuario) mueve la fuente de "Fácil" de las
vistas de YouTube a lo más tocado en vivo según setlist.fm, condicionada a que la
cobertura alcanzara para ordenar sin que un empate lo decida el azar. `INV-73` confirmó
la condición: el top-25 de la página de estadísticas de setlist.fm no tiene empate en el
puesto 8 (`RES-74`), reverificado con dos fetches independientes que coinciden dígito por
dígito.

**La vara nueva.** Dentro del pool de temas con fragmento de audio producido (hoy 95),
"Fácil" son los **8 títulos de mayor conteo citado** en la página de estadísticas de
setlist.fm, contando solo los títulos que **resuelven a un slug del catálogo** — la
normalización que `RES-75` deja propuesta y que fija `T-279`. Se recalcula cada vez que
se refresque el índice de recitales; la fecha de ese primer refresco no está fijada
todavía (ver `PENDIENTE`).

**Cómo se lee con el filtro de catálogo.** setlist.fm cuenta *lo que la banda tocó*, no
*lo que el sitio puede dar como respuesta*: `RES-75` encontró que 2 de los 8 puestos más
altos del ranking crudo (`Un tal Brigitte Bardot`, puesto 4; `Nene nena`, puesto 7) son
demos de RCA de 1982 que nunca entraron a los 10 discos de estudio — sin slug de
catálogo, no pueden ser respuesta de ningún juego. El filtro de catálogo se aplica
**antes** de cortar el top-8, no después: leyendo solo los títulos que resuelven a un
slug, el top-25 de `RES-74` da, hoy — Jijiji, Ñam fri fruli fali fru, Vamos las bandas,
Nadie es perfecto, Divina TV. Führer, Nueva Roma, Mi perro dinamita, La bestia pop —
bajando hasta el puesto 10, sin empate en el corte (57 contra 55). **Esto es una lectura
derivada de `INV-73`, no una lista que este documento congele**: la arma `T-279` contra
el pool con fragmento vigente en cada ingesta, y si alguno de esos 8 títulos todavía no
tiene su audio producido, el filtro sigue bajando en el ranking hasta completar 8 —
mismo mecanismo que el apartado (f) ya preveía para YouTube, aplicado ahora a esta fuente.

**Qué dice el rótulo — registro 3, sin excepción (`.claude/rules/voz-ricotera.md` §5).**
El sitio dice **"lo más tocado en vivo"**, nunca "el más popular" ni "el más escuchado":
son promesas distintas y la propia `D-45` explica por qué no son intercambiables — un
tema que se tocó en cada misa no es por eso el que más suena hoy. Mismo patrón de tres
datos juntos que ya exige el apartado (a) para YouTube —cifra, fecha, origen— trasladado
a esta fuente: **qué mide** (cuántas veces figura el tema en los setlists cargados en
setlist.fm), **de dónde sale** (la página de estadísticas de setlist.fm, con la fecha de
consulta) y, si se muestra un número, que vaya chico y nunca como titular (apartado b
sigue entero: es la misma razón — una cifra que solo puede subir envejece distinto que un
orden). El copy exacto es de `contenido`/`experiencia`; esto fija qué tiene que poder
decir sin mentirle a quien juega.

**Si la clave de YouTube llega algún día (`D-45` consecuencia 1).** El ranking de vistas
de YouTube, si algún día se resuelve, **vive aparte** — `CTR-07.7` queda intacto, es otro
archivo y otra cuenta — y **no reactiva sola la vara del apartado (f)**. Si en el futuro
conviene volver a YouTube, usar las dos fuentes a la vez, o quedarse con setlist.fm, es
una decisión nueva de `producto` con el usuario, con el mismo peso que tuvo esta. Hasta
entonces, la vara vigente para los 8 Fáciles de `US-02` es la de este apartado (h).

**Cómo se levanta la puerta de `BR-28`.** `BR-28` frena un noveno juego mientras `US-02`
siga en 0 de 8 Fáciles. Con esta vara, la puerta se abre **cuando un test cuente los 8**
sobre el pool real de fragmentos — `T-279`, no antes: escribir esta regla no alcanza, es
la misma trampa que `D-45` consecuencia 2 nombra ("declarar un choque como resuelto"). La
condición original de `BR-28` apartado 3 ("la clave llega, o se decide por escrito que no
va a llegar") queda superada por esta vara — ya no depende de la clave — y no la
actualizo en su propio archivo (`Docs/PRODUCTO/PRD-skayboy-y-poligirl.md`) porque `T-274`
no tiene ese archivo en su alcance; queda anotado en `PENDIENTE` para la próxima ráfaga de
`producto` sobre ese documento.

**La pregunta de `D-27`, para el usuario — no la contesto, dejo el costo de cada salida.**
`D-45` consecuencia 3 deja abierto si los tercios de dificultad de "Sacalo por la letra"
(`US-07`, `D-27`, `src/lib/popularidad.ts`) también se alimentan de este conteo en vez de
seguir esperando la `YT_API_KEY`. Dos salidas, con su costo real:

> **Contestada el 2026-09-24 por `D-46`, sin borrar el razonamiento de abajo.** El usuario
> eligió la **Salida B**, y más ancho de lo que se le preguntó acá: no solo `US-07`, sino
> "todo lo que sea con canciones". El costo que esta salida señalaba —un ranking del
> catálogo completo, no solo un top-25— sigue siendo real y lo está resolviendo `T-282`
> (`Docs/ORQ/ORQ-plan-ciclo-16.md` §2.4); mientras tanto, `US-07` puede llegar degradado a
> Difícil por falta de dato, no por decisión, igual que le pasó a `US-02` con `BR-18` (g).
> El detalle está en `BR-30`.

- **Salida A — no tocar `D-27`.** Sigue infiriendo dificultad de las vistas de YouTube y
  sigue esperando la clave. Costo: **cero trabajo nuevo**, pero `US-07` sigue sin
  escalonamiento real mientras la clave no llegue — el mismo estado ya declarado hoy
  (`popularidad.ts`: `medidos === 0`, todos los temas `dificil`). A favor: no mezcla dos
  promesas distintas — "cuánto se escucha" (la intención original de `D-27`) y "cuánto se
  tocó en vivo" (`D-45`) miden cosas distintas, aunque estén correlacionadas.
- **Salida B — `D-27` también lee del conteo citado de setlist.fm.** Costo real y no
  chico: los tercios de `D-27` necesitan un ranking del **catálogo completo** (104 o 105
  temas, según se reconcilie — ver `PENDIENTE` de `INV-73`), no un top-8 ni un top-25, y
  lo único que `RES-74` trae hoy es la página pública de estadísticas, que solo expone un
  top-25. Conseguir un conteo defendible para los ~80 temas que quedan fuera de ese
  top-25 puede no ser alcanzable por la misma vía que `RES-73` ya validó (licencia "para
  ver", sin bots, sin retención vía API más allá de caché corta) sin pedirle a
  `investigador` una ficha nueva y a `arquitectura` un contrato que hoy no existe. Y el
  rótulo de "Sacalo por la letra" tendría que dejar de decir lo que `D-27` promete hoy y
  pasar a decir lo mismo que este apartado —"lo más tocado en vivo"—, que es un cambio de
  promesa, no solo de fuente; `D-27` fue decisión directa del usuario, así que cambiarla
  la pide él, no `producto` por su cuenta.

  **A favor de la B, para que no quede descartada de arranque:** el argumento con el que
  `D-45` eligió setlist.fm —"el recital fue donde la gente aprendió los temas, se
  cantaban enteros desde la tribuna"— encaja con "Sacalo por la letra" tan bien como con
  "Adiviná el tema", quizás mejor: saberse la letra de memoria se parece más a haberla
  cantado en la cancha que a haberla escuchado en YouTube.

  **Mi recomendación, si el usuario pide una: Salida A por ahora.** El costo de la B —un
  ranking del catálogo completo, no solo un top-25 público— no está resuelto por ninguna
  ficha existente, y `D-27` no está bloqueando nada hoy que no estuviera bloqueado antes
  de `D-45` (`US-07` sigue con el mismo `PENDIENTE` que ya tenía). Pero la decisión es del
  usuario, no mía — **queda pedida acá**, igual que `BR-19` dejó pedida la suya en su
  momento.

**Verificación:** `rg -n "^### h)" Docs/PRODUCTO/PRD-alcance-v1.md` devuelve la línea de
este apartado. Que el apartado (f) haya quedado marcado enmendado (no borrado) y que la
pregunta de `D-27` esté explícitamente rotulada como pendiente del usuario, lo mira
`revisor`. El conteo real de los 8 —si el filtro de catálogo y el pool con fragmento dan
efectivamente 8 títulos— lo corre `T-279` (`src/lib/escalonar.test.ts`).

---

## BR-30 — Qué juegos son "con canciones" y cómo cada uno usa la dificultad

**Aplica a:** los nueve juegos del sitio — los cuatro de `D-05` (`US-01`..`US-04`) más
`US-06`, `US-07`, `US-08`, `US-09` y `US-10` (sumado 2026-09-25 por `producto` al escribir
`Docs/PRODUCTO/PRD-mas-o-menos.md`, con la misma tabla que ya venía). Contesta el pedido de
`Docs/ORQ/ORQ-plan-ciclo-16.md`
§2.4 (`T-283`), sobre `D-46` — decisión del usuario, textual: *"La dificultad de todo lo
que sea con canciones sale de ahí"*, que enmienda `D-27` y responde, más ancha de lo
preguntado, la "Salida B" que `BR-18` (h) había dejado pedida al usuario.

**Qué significa "con canciones" acá, y qué no.** Un juego trabaja con canciones si su
ítem **es** un tema (la respuesta es "cuál canción es esta") o **sale** de un tema (su
contenido se recorta de una canción puntual: un verso, una letra). Es una clasificación
de **contenido**, no de dificultad — las dos preguntas de la tabla van en columnas
separadas a propósito, porque la primera no contesta sola la segunda: un juego puede
trabajar con canciones y seguir decidiendo su dificultad por otra cosa. Esa distinción es
el tema de los dos apartados que siguen a la tabla, y es la respuesta a la pregunta que
motivó esta tarea (*"las preguntas del quiz que son sobre un tema: ¿la dificultad es del
tema o de la pregunta?"*).

### La tabla, sin celdas vacías

| Juego | ¿Con canciones? | Cómo decide hoy la dificultad | Cómo la decide desde `D-46` |
|---|---|---|---|
| `US-01` Quiz | **Parcial, y no cuenta.** El ítem es la pregunta, no el tema; algunas preguntas (categoría `letras`, o `discos` citando un tema) mencionan una canción, la mayoría no. | Manual: `contenido` etiqueta cada pregunta Fácil/Media/Difícil al cargarla (`BR-01`, taxonomía; escalones 10/15/15 de `BR-19`). | **No cambia.** La dificultad de una pregunta mide qué tan oscuro es el dato que pide, no cuán tocada en vivo está la canción que nombra — ver "Por qué el quiz no entra", abajo. |
| `US-02` Adivinar el tema | **Sí.** El ítem es el tema: la respuesta es reconocer la canción. | **Ya inferida, enmendado 2026-09-24.** 8 Fáciles = top del conteo citado de setlist.fm dentro del pozo con audio (`BR-18` h, `CTR-19.5`); Media/Difícil = tercios sobre los 87 restantes (antes: Media = figura y no es de los 8, Difícil = no figura — ver "Media y Difícil de `US-02`" más abajo). | **No cambia el mecanismo.** `D-46` confirma el principio que `D-45`/`BR-18` (h) ya le habían dado a este juego — es el juego de origen de la regla, no uno que la recibe ahora. |
| `US-03` Completar la letra | **Sí, enmendado 2026-09-24 (precisión de `D-46`, `T-286`).** Esta celda decía "no en el eje de dificultad"; el usuario lo revirtió, textual: *"Completá la letra también sale del conteo"*. | **Corregido 2026-09-24** (`Docs/SUGERENCIAS/ARQ-para-producto-la-letra-con-el-conteo.md` punto 2): no era manual. Automática por posición dentro de la estrofa — `scripts/generar-letra.mjs` ponía el nivel según cuántos versos tenía el hueco alrededor **dentro de su estrofa** (2+2 antes/después da `facil`, 1+1 da `media`, si no `dificil`); `contenido` elegía **qué verso promover** (`letra-confirmaciones.json`), y el nivel salía de rebote de esa elección, no de una etiqueta puesta a mano. *Decía: "Manual: `contenido` etiqueta cada hueco (`BR-01`); el nivel define cuánto contexto rodea el hueco (`BR-03`: 2+2 versos y título/disco visibles en Fácil, verso pelado en Difícil)."* | **Cambia la fuente del nivel, no la tabla de `BR-03`.** El nivel pasa de "posición del hueco en la estrofa" a tercios del conteo por **tema** — el mismo mecanismo que `US-07` (`CTR-19.15`), aplicado acá. `BR-03` sigue exactamente igual: la tabla sigue diciendo cuánto contexto va con cada nivel; lo único que cambia es qué decide el nivel. Ver "La precisión del 2026-09-24", abajo. |
| `US-04` Adivinar la tapa | **No.** El ítem es una tapa o un disco, no una canción. | Manual (`BR-01`, taxonomía; mínimo 3 Fácil sobre 10). | No aplica: no hay canciones que medir. |
| `US-06` Qué tipo de ricotero sos | **No.** El ítem es una pregunta de temperamento (`BR-17`). | **No usa dificultad.** `BR-17` ya fija que `BR-01` no aplica: ninguna pregunta pide saber de la banda. | No aplica: no hay dificultad que `D-46` pueda redirigir. |
| `US-07` Sacalo por la letra | **Sí.** El ítem es el tema: la respuesta es reconocer la canción por sus versos. | **Ya inferida por `D-27`**, no manual — aunque `Docs/PRODUCTO/PRD-adivinar-por-la-letra.md` todavía la describe como "Plan B" sin activar (marcado, ver "Archivos"). Tercios por vistas de YouTube; degradada hoy a todo Difícil por falta de `YT_API_KEY`. | **Cambia la fuente, no el mecanismo.** Los tercios de `D-27` se calculan sobre el conteo citado de setlist.fm en vez de las vistas de YouTube — la "Salida B" de `BR-18` (h), confirmada. |
| `US-08` Ponelos en fila | **Parcial.** De los 14 conjuntos, 10 son temas (aperturas, cierres, los diez tracklists); 4 son discos o tapas. | **No usa dificultad.** `US-08` lo dice explícito: `BR-01` no aplica porque no hay respuesta correcta (`BR-22`). | No aplica: no hay dificultad que `D-46` pueda redirigir. |
| `US-09` Skayboy y Poligirl | **No.** El ítem es un nivel de plataformas. `D-39` hace sonar un tema entero de fondo, pero el tema no es el ítem ni decide nada. | Manual: el escalón de cada nivel lo fija quien lo diseña (`BR-25`, `BR-29`: niveles 1-2 Fácil, 3-4 Media, 5-6 Difícil, por cuánto mecanismo enseña, no por popularidad). | No aplica: no hay canciones que medir. |
| `US-10` Más o menos | **Parcial.** Una de las siete familias (`las-palabras`) es de temas; las otras seis (`la-banda`, `la-gente`, `los-recitales`, `los-discos`, `lo-que-dura`, `en-vivo`) no lo son. | **No usa la etiqueta de `BR-01`.** Escalona por los cuatro escalones de racha de `BR-33` (`PRD-mas-o-menos.md`), no por ítem etiquetado a mano. | No aplica: no hay dificultad por ítem que `D-46` pueda redirigir — el escalón lo fija la racha, no un conteo por tema. |

### Por qué el quiz no entra, aunque una pregunta hable de un tema

Es el caso que motivó la pregunta del encargo. **La dificultad es de la pregunta, no del
tema.** Una pregunta de la categoría `letras` puede citar *Ji Ji Ji* —hoy el tema más
tocado en vivo del catálogo, `CTR-19.5`— y aun así pedir un dato oscuro: en qué compilado
salió una versión en vivo puntual, quién tocó qué instrumento esa noche. Esa pregunta
sigue siendo difícil aunque la canción sea facilísima de reconocer, porque lo que mide la
dificultad de una pregunta de trivia no es "cuánto circula la canción": es **cuánto
circula el dato que pide**, y las dos cosas coinciden a veces y a veces no. `D-46` mueve
la dificultad de lo que sea "con canciones" en el sentido de *reconocer una canción*; una
pregunta de trivia no le pide eso al jugador aunque una canción aparezca en el enunciado.
**La etiqueta de dificultad del quiz sigue siendo de `contenido`, ítem por ítem, sin
excepción por el tema que la pregunta mencione.**

### Por qué `US-03` no entra, aunque su ítem salga de una canción

> **Enmendado 2026-09-24 (`T-286`, precisión de `D-46`), sin borrar.** El usuario contestó
> este apartado, textual: *"Completá la letra también sale del conteo"*. No pidió que se
> le explique por qué no debería — lo decidió. Queda escrito abajo, tal cual se argumentó,
> porque es la razón que había y hay que poder leerla; la decisión vigente y lo que
> `arrastra` están en "La precisión del 2026-09-24", después de este apartado.

Mismo tipo de caso, otra forma. El eje de dificultad de "Completar la letra" no es "qué
tan conocida es la canción": es **cuánta letra queda visible alrededor del hueco**
(`BR-03`). Un tema carísimo de reconocer puede tener un ítem Fácil (2 versos antes, 2
después, título y disco a la vista — con eso el jugador ni necesita reconocer la canción
de oído, completa por contexto) y un tema conocidísimo puede tener un ítem Difícil (verso
pelado, sin título) donde solo lo saca quien se la sabe de memoria. Las dos cosas ya
conviven en la misma canción según qué verso se eligió mostrar. Migrar esta dificultad al
conteo en vivo mezclaría dos preguntas distintas —"¿cuánto contexto doy?" y "¿cuán tocada
está esta canción?"— bajo una sola etiqueta, y la que ya existe (`BR-03`) mide justo lo
que hace falta sin necesitar el dato externo.

**La diferencia con `US-02`/`US-07` es el verbo de la tarea.** Esos dos piden *reconocer
cuál canción es*, y ahí "cuán conocida es" es la dificultad en sí —el propio
`PRD-adivinar-por-la-letra.md` ya lo dice con esas palabras para `US-07`—. `US-03` pide
*completar una palabra*, y una canción muy tocada en vivo no vuelve automáticamente fácil
completar un verso puntual si se lo muestra pelado.

**La regla general que queda de esto, para el próximo caso parecido:** `D-46` gobierna la
dificultad de un ítem cuando esa dificultad mide qué tan conocida es la canción misma —es
decir, cuando la tarea del jugador es reconocerla o identificarla. No gobierna cuando la
canción es el material del que sale el ítem pero la dificultad mide otra cosa (un dato de
trivia, cuánto contexto queda visible).

> **Esta regla general queda escrita como estaba, y ya no es la que rige a `US-03`.** La
> siguió el apartado de arriba hasta el 2026-09-24; el usuario decidió lo contrario para
> este caso puntual, con la mano en el propio caso concreto en vez de en la regla general.
> No la reescribo —puede seguir sirviendo para el "próximo caso parecido" que no sea
> `US-03`— pero avisada: dejar de aplicarla acá fue una decisión del usuario, no un error
> de esta regla.

### La precisión del 2026-09-24: "Completá la letra" también, y qué pasa con `BR-03`

**Cómo migra: tercios por tema, igual que `US-07`.** El nivel de un ítem de `US-03` deja
de ser una etiqueta que `contenido` pone a mano en cada hueco y pasa a ser una propiedad
del **tema** de ese hueco: se ordenan por el conteo citado los temas que tienen al menos
un ítem en el banco de este juego, se parten en tercios (`D-27`, "sin escucha por ahora es
difícil" para el tema sin línea), y todo hueco de un tema hereda el nivel de su tema. Es
la misma regla que `CTR-19.15` ya calcula para `US-07` — no una tercera fórmula. Si
`arquitectura` prefiere escribir una función nueva en vez de reusar la que ya reparte en
tercios, es su decisión (`T-287`); lo que fijo acá es la regla, no el nombre de la
función.

**El pozo es el de este juego, no el catálogo entero** — mismo criterio que ya usa `US-07`
("Dónde se calcula el pozo de `US-07`", arriba): los temas de los que salen los huecos ya
cargados en `letra.json`, no los 105 de `RES-20`. Un tema sin ningún hueco cargado no
compite por un tercio que no le corresponde.

#### `BR-03`: el contexto sigue al nivel — no se desacopla

Es la pregunta que dejó pedida la precisión de `D-46`: *"hoy la cantidad de versos de
contexto alrededor del hueco sale del nivel del ítem (2, 1 o 0)... cuando el nivel lo pone
el conteo del tema, ¿el contexto sigue al nivel, o el contexto se desacopla y se fija por
otra regla?"* La tabla de `BR-03` —2 versos y título/disco en Fácil, 1 en Media, verso
pelado en Difícil— **no cambia una celda.** Lo único que cambia es de dónde sale el nivel
que esa tabla consulta.

**Por qué no se desacopla, contra la tentación de hacerlo:**

1. **Desacoplar inventa un eje que el brief nunca pidió; acoplado no inventa nada.**
   `Docs/BRIEF.md` define la dificultad de este juego con estas palabras exactas: *"la
   dificultad escala mostrando menos letra... fácil da contexto, difícil da un verso
   pelado."* No es una implementación que `producto` eligió: es la definición del juego
   confirmada en `/kickoff`, antes de que existiera este documento — ahí "dificultad" **es**
   "cuánta letra se muestra", no dos cosas separadas. Si el contexto se desacopla, "nivel"
   pasa a significar solamente "qué tan tocado en vivo está el tema" y deja de decir nada
   sobre cuánta letra se ve — la promesa del `/kickoff` ("fácil da contexto, difícil da un
   verso pelado") quedaría sin ningún nivel que la sostenga, y haría falta inventar un eje
   nuevo con su propio nombre para sostenerla. Eso sí sería reescribir el juego, y nadie lo
   pidió. Acoplado, sigue siendo exactamente la regla del `/kickoff`, con el nivel viniendo
   de otro lado.
2. **Desacoplar necesita una regla nueva que hoy no existe en ningún documento; acoplado
   no necesita ninguna.** Si el contexto dejara de seguir al nivel, alguien tiene que
   decidir de qué depende entonces — ¿lo vuelve a elegir `contenido` a mano, por ítem,
   como hasta hoy? ¿depende de la posición del ítem dentro de la partida? Ninguna de las
   dos está pedida ni fundamentada en ningún documento de este proyecto, y escribir una
   bajo esta misma tarea sería inventar mecánica de juego con la excusa de migrar un dato.
   Acoplado, `CTR-04.7` sigue exactamente igual, sin una línea nueva.
3. **Contra `BR-01` (arranca por Fácil, cuota): acoplado sostiene el molinete abierto
   mejor que desacoplado, no peor.** El primer ítem de cualquier partida tiene que ser
   Fácil (`BR-01` punto 1). Con el acople, "Fácil" significa a la vez "tema muy tocado en
   vivo" **y** "verso con el máximo de apoyo" (2 versos antes, 2 después, título y disco a
   la vista): el que llega sin saber nada recibe, en su primer ítem, la combinación más
   generosa que el juego puede dar. Desacoplado, nada garantizaría eso: `contenido` podría
   elegir un hueco de un tema muy tocado y mostrarlo pelado, y el primer ítem de la
   partida sería un muro real aunque cumpliera la letra de `BR-01`. El acople hace
   estructuralmente imposible ese caso — no hay forma de que un ítem Fácil muestre menos
   de 2+2 versos, porque el nivel *es* la cantidad de contexto.
4. **A favor de la experiencia del que juega: la peor combinación queda reservada para el
   final, no puede aparecer temprano.** Con el acople, el peor caso del juego —tema poco
   tocado, verso pelado, sin título ni disco— solo puede aparecer tarde en la partida
   (`BR-01` punto 2, la dificultad no baja), para quien ya demostró que sabe lo suficiente
   como para haber pasado Fácil y Media. Desacoplado, un jugador podría toparse con "tema
   conocido, sin ningún apoyo" más temprano, porque las dos variables ya no viajarían
   pegadas al mismo escalón.

**Lo que se pierde, dicho de frente y no escondido.** Hoy `contenido` puede mostrar con
generosidad un hueco de un tema oscuro para compensar que casi nadie lo reconoce, o poner
un hueco pelado de un tema conocidísimo para que el desafío sea de memoria y no de
reconocimiento. Esa libertad editorial por ítem **se pierde**: el nivel ya no lo elige
`contenido`, lo pone el conteo, y con él viaja la cantidad de contexto entera. Es el mismo
costo que ya aceptó `US-07` cuando `D-27` le sacó la etiqueta manual (ver "Qué pasa con un
ítem que tenía dificultad a mano y la pierde", abajo) — acá se acepta con el mismo
argumento: lo pidió el usuario, dos veces, con el mismo texto.

**Consecuencia que no es del contexto en sí, pero se dispara por acoplarlo: recalcular no
es solo repintar una etiqueta.** Porque el contexto viaja pegado al nivel, un ítem que
cambia de nivel al recalcularse el banco contra un conteo nuevo también tiene que cambiar
cuántos versos guarda —agregarlos o sacarlos, no solo el campo `dificultad`—. Es distinto
de `US-07`, donde recalcular solo mueve un tema de franja sin tocar qué revela cada paso
de la escalera (`BR-20` queda intacta). Se anota acá porque es la consecuencia directa de
esta decisión, y para que no sorprenda a quien construya `T-288`.

**Lo que le pido a `arquitectura` y al hilo principal, sin fijarlo yo:** que `CTR-04` sume
el campo que declara de dónde sale `dificultad` en este banco —mismo rol que ya le toca a
`CTR-03` y `CTR-09`, ver "Qué no hace esta regla", más abajo— es de `arquitectura`
(`T-287`). Cómo se recalcula el banco existente es del hilo principal (`T-288`), con el
mismo criterio que ya fijó esta regla para `US-07`: ningún ítem pierde hoy una etiqueta
que ya tenía escrita a mano — y, corregido el mismo día que esto: no había una etiqueta a
mano que perder, el nivel salía de rebote de la posición del hueco en la estrofa (ver
"Qué pasa con un ítem que tenía dificultad a mano y la pierde", más abajo).

**Y el criterio 2 de `US-03` queda resuelto acá, no repetido.** Con el nivel por tema, un
tema del tercio bajo da solo ítems Difícil — por construcción, el tema de un ítem Difícil
nunca pudo haber aparecido antes en Fácil o Media dentro de la misma partida. Eso rompía,
siempre y no a veces, el criterio 2 de `US-03` tal como estaba escrito (*"nunca se
introduce un tema completamente nuevo solo en modo difícil"*). Lo detectó `arquitectura`
en `CTR-04.14` (🔴) y lo traspasó en
`Docs/SUGERENCIAS/ARQ-para-producto-la-letra-con-el-conteo.md` punto 1. La resolución —se
adopta la opción **A** que esa nota propone: la precisión de `D-46` prevalece, el criterio
2 se enmienda— está en `US-03`, criterio 2, con el argumento completo. No lo repito acá.

**Si el piso de 4 Fáciles deja de alcanzarse con el pozo real, no es una falla de esta
regla: es una señal para `contenido`.** El mínimo de `US-03` (4 sobre 15) sigue en pie. Si
los tercios del pozo actual dejan menos de 4 ítems en el nivel Fácil, la salida no es
tocar esta regla — es que `contenido` cargue más huecos de temas del tercio de arriba,
igual que ya le pasa a `US-07` con su piso de 15 sobre un pozo que hoy reparte 30/30/28.

### La regla de reparto: los tercios de `D-27`, salvo el corte de 8 de `US-02`

Tres juegos infieren dificultad de canciones desde el 2026-09-24, y usan **dos reglas
distintas** — cada una vigente por motivo propio, no por descuido:

- **`US-02` conserva el corte de 8**, fijo y no proporcional al pozo (`BR-18` h,
  `CTR-19.5`). Es una regla más vieja que `D-46` y específica de este juego: nació de la
  cuota original de `BR-18` (f) y `D-45`/`BR-18` (h) ya le cambiaron la fuente sin tocar
  el número. `D-46` no reabre esto — es, con sus propias palabras, "el juego de origen de
  la regla".
- **`US-07` usa los tercios de `D-27`** —temas del pozo ordenados por conteo y partidos
  en tres franjas iguales, *"sin conteo es difícil"*, textual del usuario— porque es la
  regla que ya tenía asignada desde que `D-27` se escribió (2026-08-27) específicamente
  para este juego, antes incluso de que existiera `BR-18` (f). `D-46` no inventa un
  mecanismo nuevo acá: **reactiva el que ya tenía**, cambiándole la fuente de vistas de
  YouTube (que nunca llegaron) a conteo en vivo (que sí existe, `RES-74`).
- **`US-03` usa la misma regla que `US-07`, sumada el 2026-09-24** por la precisión de
  `D-46`: tercios sobre el pozo de temas de este juego, con el mismo criterio de empate y
  de "sin conteo es difícil". No es una tercera fórmula: es el segundo juego que usa la
  que ya tenía `US-07`.

**Por qué no homologar las tres en una sola regla.** Forzar a `US-02` a tercios rompería
un número ya construido, testeado y citado en media docena de documentos sin ningún
beneficio — el corte de 8 no le debe nada a `D-27`. Forzar a `US-07` y `US-03` al corte de
8 ignoraría que esa es una regla específica de `US-02` (nació de su propia cuota), no una
vara general. Cada uno se queda con la regla que le corresponde.

**Dónde se calcula el pozo de `US-07`.** Igual que en `US-02`: los tercios se calculan
sobre el pozo del juego —los temas con letra ya cargada en el banco (88 hoy, sobre un
piso de 60)—, no sobre los 105 del catálogo entero. Un tema fuera del pozo no compite por
un tercio que no le corresponde.

### Media y Difícil de `US-02` — confirmando lo que dejó pedido `Docs/SUGERENCIAS/ARQ-para-producto-lo-que-el-corte-en-vivo-deja-abierto.md` §1

> **Enmendado 2026-09-24 (ciclo 16, ráfaga 3), sin borrarse.** Lo que sigue es la regla tal
> como se confirmó con el conteo parcial y la promesa de que "se corrige sola" cuando
> llegara el conteo completo. Llegó (`Docs/SUGERENCIAS/ARQ-para-producto-lo-que-el-conteo-
> completo-mueve.md` §1) y no se corrigió sola: se dio vuelta. La corrección real está
> después del párrafo original, sin borrarlo — mismo criterio que usa `CLAUDE.md` con sus
> propios avisos corregidos.

Se confirma la regla que ya rige en `CTR-19.5` paso 5: **Media** son los temas del pozo
que figuran en la página de estadísticas de setlist.fm y no quedaron entre los 8 Fáciles;
**Difícil**, los que no figuran. No escribo otra: es *"sin escucha por ahora es difícil"*
de `D-27`, con "escucha" leído como "figura en lo que publicó la página" — mismo
principio que gobierna todo lo demás en esta regla, sin inventar un número nuevo. Hoy da
8/15/72, torcido hacia Difícil porque `RES-74` solo cubre un top-25; **eso se corrige
solo** cuando `T-282` traiga el conteo completo, sin que esta regla tenga que
reescribirse.

**Con el conteo completo, de los 95 temas con fragmento 90 figuran** en la página de
estadísticas —los 8 Fáciles son los mismos de siempre— y el reparto de la regla de arriba
queda **8 Fácil, 82 Media, 5 Difícil**. Los 5 que no figuran son casi todos instrumentales
o cortinas (*Invocación*, *Capricho Magyar*, *Sushi*, *Soga de Caín*, *San Telmo*), no
temas poco tocados: "Difícil" deja de significar lo que `D-27` quiso decir —*"sin escucha
por ahora es difícil"*, leído como "poco tocado"— y pasa a significar "nadie lo cargó
nunca en setlist.fm". Y con 82 de 90 en un solo casillero, la partida deja de subir:
pasada la cuota fija de 8, el jugador pasa el resto de la sesión en el mismo nivel salvo
por 5 títulos sueltos. `BR-01` no pide solo que no haya muro en la primera pantalla: pide
que la dificultad **escalone**, y un reparto 8/82/5 no escalona nada después del octavo
ítem.

**Se cambia la regla.** Para los 87 temas que no son de los 8 Fáciles, `US-02` pasa a usar
la misma fuente de tercios que ya tiene asignada `US-07` (`CTR-19.15`, con el empate en el
borde bajando entero, igual que ahí): el pozo de esos 87 se ordena por conteo y se parte
en tres franjas iguales; la franja de abajo es **Difícil**, las dos de arriba son
**Media**. Esto no reabre "La regla de reparto" de más arriba: el corte de 8 sigue fijo y
sigue siendo lo que distingue a `US-02` de `US-07` (`BR-18` h); lo único que cambia es
cómo se reparte lo que queda **después** de sacar esos 8. Motivo: le devuelve a "Difícil"
el significado que tiene en el resto del sitio —poco tocado en vivo, no "sin registro en
la página"— y sostiene la curva que pide `BR-01`. No fijo acá el número exacto de la
partición nueva ni el criterio de empate: depende del conteo vigente, lo calcula
`repartirEnVivo()` y es alcance de `arquitectura` (el mismo traspaso de un cambio de línea
anotado en `Docs/SUGERENCIAS/ARQ-para-producto-lo-que-el-conteo-completo-mueve.md` §1).

### Qué pasa con un ítem que tenía dificultad a mano y la pierde

El caso real es `US-07`, no uno hipotético. Su propio documento
(`Docs/PRODUCTO/PRD-adivinar-por-la-letra.md`, sección "Piso de ítems") describe hoy la
etiqueta como manual, con la migración a un ranking automático anotada como "Plan B... no
vía principal todavía". Eso quedó desactualizado el mismo 2026-08-27, el día en que
`D-27` fijó exactamente esa migración para este juego —la propia decisión dice que el
archivo de curaduría manual "no se escribe" y que el ranking automático "pasa a ser el
plan A"— sin que nadie volviera a tocar el PRD para decirlo. Se marca la enmienda ahí
(ver "Archivos"), sin borrar el texto original, con el mismo criterio que usa
`CLAUDE.md` con sus propios avisos corregidos.

**Ningún ítem pierde hoy una etiqueta que ya tenía escrita a mano.** Lo que cambia es de
dónde sale la etiqueta la próxima vez que se recalcule el banco (dependiente de
`T-285`): antes del recálculo, el campo puede seguir reflejando lo último que
`contenido` escribió; después, lo pisa la fórmula. No hace falta un candado especial para
esa transición porque `BR-20` (la escalera de versos) sigue intacta: cambia **cuál** tema
entra en qué nivel, no **qué se ve** dentro de un nivel.

**Desde el 2026-09-24, el mismo caso se repite en `US-03`** (precisión de `D-46`, "La
precisión del 2026-09-24", arriba) — **con una premisa corregida.** No había una etiqueta
puesta a mano que perder: el nivel de cada ítem salía automático de la posición del hueco
dentro de su estrofa, y `contenido` lo decidía de rebote al elegir qué verso promover (ver
la celda de `US-03` en la tabla de arriba, corregida el mismo día). Lo que cambia es de
dónde sale ese nivel la próxima vez que se recalcule el banco (`T-288`): de la posición en
la estrofa a los tercios del conteo por tema. **A diferencia de `US-07`, acá sí cambia qué
se ve dentro de un nivel:** el contexto (`BR-03`) está atado al nivel, así que un ítem que
cambia de nivel al recalcularse cambia también cuánto contexto guarda — no solo el campo
`dificultad`. Es la consecuencia que ya quedó anotada arriba, repetida acá porque es este
apartado el que existe justamente para que no sorprenda.

### Cómo sigue cumpliendo `BR-01`

Para los juegos con dificultad inferida, los tres puntos de `BR-01` se sostienen igual
que hoy:

1. **Primer ítem Fácil.** Sigue garantizado: mientras haya al menos un Fácil en el pozo
   —lo mismo que ya asume `BR-18` (g) para `US-02`— el primero de la partida sale de ahí.
2. **La dificultad no baja dentro de la partida.** No lo toca esta regla: es mecánica de
   `escalonar()`, no de dónde sale la etiqueta.
3. **Piso mínimo de Fáciles.** `US-02` sigue con 8 fijos (`BR-18` h). `US-07` sigue con su
   mínimo de 15 sobre el piso de 60 (25%, ya fijado en `PRD-adivinar-por-la-letra.md`):
   los tercios del pozo de hoy (88) dan 30 / 30 / 28 (`CTR-19.15`). Con un pozo de 60, el
   piso, darían 20 por franja. El mínimo de 15 se sostiene en los dos casos — no hace
   falta subir el número del piso para que la cuenta cierre. Si un tema del pozo se queda
   sin línea en el conteo, cae en Difícil (`D-27`) y el generador lo nombra; con los tres
   alias de `CTR-19.16` (`RES-90`), hoy eso no le pasa a ninguno de los 88, así que ya no
   hay degradación por falta de dato. No frena nada porque `US-07` no es uno de los cuatro
   juegos de `D-05`, y porque tiene la misma segunda rampa que ya salvó a `US-02` en
   `BR-18` (g): errar o pasar abre el escalón siguiente (`BR-20`), así que el orden de los
   ítems no es el único molinete abierto.

   **Y `US-03`, sumado el 2026-09-24, sigue con su mínimo de 4 sobre 15** ("Piso de
   ítems" de `US-03`). Acá no hay segunda rampa que lo salve si el pozo real no alcanza —
   este juego no tiene escalera de intentos, es respuesta única como el quiz—, así que si
   los tercios dejan menos de 4 Fáciles es `contenido` quien tiene que sumar huecos del
   tercio de arriba, como ya quedó dicho en "La precisión del 2026-09-24".

### El rótulo, en registro 3

Ya está escrito: `RNF-CTR-19-A` (`Docs/ARQ/ARQ-schema-recitales.md`) fija qué mide, de
dónde sale y con qué fecha, para toda pantalla que muestre un número o un orden salido
del conteo citado. **Esta regla no escribe uno nuevo**: extiende el mismo requisito a
cualquier pantalla de `US-07` —y, desde el 2026-09-24, de `US-03`— que muestre nivel,
número o puesto salido de la misma fuente — es el mismo dato, `setlistfm.json`, así que
es el mismo rótulo. Sigue sin decir "el más popular" ni "el más escuchado": dice **"lo
más tocado en vivo"**, con la fuente y la fecha al lado si se muestra un número.

### Qué no hace esta regla

No fijo el campo de schema que guarda de dónde sale la dificultad de cada banco (`CTR-03`,
`CTR-09`, y `CTR-07` retirado de ese rol): es de `arquitectura` (`T-284`).

> **Enmendado 2026-09-24 (`T-286`).** Acá decía *"`CTR-04` (`US-03`) no entra a esa lista,
> por lo dicho arriba"*. Ya no es cierto: `CTR-04` **entra** a esa lista, con el mismo rol
> que `CTR-03`/`CTR-09` — el campo lo fija `arquitectura` (`T-287`), y de paso decide cómo
> declara que el contexto de `BR-03` sigue derivado del mismo nivel, no de un campo aparte.

No fijo la fórmula exacta de `repartirEnVivo()` para `US-02`, ni la de los tercios para
`US-07` y `US-03`, ni el archivo donde viven: también de `arquitectura`. No decido si
`experiencia` muestra el nivel en pantalla de `US-07` o de `US-03`: eso sigue sin pedirle
nada a la isla hasta que lo decida, igual que ya vale para `US-02` (`CTR-19.9`).

**Verificación:** `rg -n "^## BR-30" Docs/PRODUCTO/PRD-alcance-v1.md` devuelve esta línea.
Que la tabla no tenga celdas vacías y que las enmiendas de `BR-18` (h) y de
`PRD-adivinar-por-la-letra.md` estén marcadas sin borrar, lo mira `revisor`.

---

## PENDIENTE

- ~~**Duración exacta en segundos de cada paso del reveal de audio.**~~ **[RESUELTO
  2026-08-24 por `D-24`.]** Ya no es un pendiente de `arquitectura`: la escalera de seis
  pasos y sus segundos (0,1 · 0,5 · 2 · 4 · 8 · 15) quedaron fijados junto con la
  mecánica de `US-02`, y `BR-02` los cita ahora.
- **Número real de discos de estudio para el piso de `US-04`.** El piso de 10 es un
  mínimo jugable, no la cobertura final. Dueño: `investigador`, ficha `RES-XX`.
- **`US-02` criterio 3 y su bullet de "queda fuera de esta historia" describen todavía la
  vía vieja de Spotify** ("si no tiene la app o no tiene Premium…", "la vía técnica
  exacta del link o embed de Spotify"). `D-22` reemplazó esa vía por mp3 propio del
  sitio antes de esta revisión, y el juego construido (`src/scripts/partida-tema.ts`,
  `pintarRevelacion`) ya no toca Spotify — usa `tema.entero` y un `<audio>` propio. No lo
  reescribí en `T-99` porque no era su alcance (la tarea pedía `BR-02`, no `D-22`).
  Dueño: `producto`, próxima ráfaga.
- **El piso de `US-02` subió a 30 (revisión 2026-08-24) y `Docs/BRIEF.md` sigue citando
  "(40 / 20 / 15 / 10)" en "Listo de la v1".** Ese número quedó desactualizado. No lo
  edito acá porque `Docs/BRIEF.md` no es carpeta de `producto` en el sentido de "archivo
  que este PRD sobrescribe" — lo fija `/kickoff` — pero si alguien lo vuelve a tocar,
  el número correcto para `US-02` es 30. Dueño: quien próximamente actualice el brief.
- **`Docs/BRIEF.md`, "Listo de la v1", punto 3, sigue diciendo "la dificultad escala
  mostrando menos letra, no cambiando de tema" sin la lectura del 2026-09-24.** `US-03`
  criterio 2 (enmendado esta misma ráfaga) ya deja escrito que esa frase describe el eje
  de dificultad (cuánta letra se muestra), no que un tema del nivel Difícil tenga que
  haber aparecido antes en la partida — con el nivel por tema de `BR-30`, eso último es
  estructuralmente imposible. No edito `Docs/BRIEF.md`, mismo motivo que el bullet de
  arriba. Si alguien lo vuelve a tocar, la nota de corrección va con el mismo formato que
  ya usan las de `RES-05` y `BR-06` en ese archivo, citando `US-03` criterio 2. Dueño:
  quien próximamente actualice el brief.
- **Validación del tiempo real de partida** (8 preguntas / 5 letras / 6 tapas siguen
  siendo supuestos de pacing, no medidos; los 4 temas de `US-02` dejaron de serlo el
  2026-08-24: `D-24` los confirmó junto con la mecánica, no es una cuenta de `producto`
  a ojo). Dueño: `experiencia`, al diseñar el flujo de sesión.
- **Tolerancia de matching de texto libre** en "completar la letra" si el input no es
  múltiple choice. Dueño: `experiencia` (mecanismo), `contenido` (qué cuenta como
  correcto).
- No fijé el schema JSON que guarda la etiqueta de dificultad ni los pasos del reveal:
  es `CTR-XX` de `arquitectura`.
- **Cifras reales del ranking de YouTube (`BR-18`), añadido `T-116`.** La regla existe;
  el dato no. Falta que `arquitectura` resuelva los 105 `videoId` una vez y los guarde
  (`RES-52`, apartado c) y que `contenido` aplique el criterio de video declarado del
  apartado c de `BR-18` en los temas sin canal Topic. Hasta que eso exista, `BR-18`
  apartado f (Fáciles de `US-02` por posición en el ranking) no tiene con qué calcular
  nada — sigue igual de bloqueado que hoy, que es 0 de 30. **Actualizado 2026-09-23: este
  bloqueo dejó de frenar la cuota de Fáciles**, que desde el apartado (h) sale del conteo
  citado de setlist.fm. Si algún día la clave llega, el ranking de YouTube se guarda igual
  (sigue siendo la promesa de los apartados a-e) pero **no reemplaza la vara de Fáciles
  sin una decisión nueva** (`D-45` consecuencia 1, apartado h).
- **`BR-28` (`Docs/PRODUCTO/PRD-skayboy-y-poligirl.md`) sigue citando la condición vieja.**
  Su apartado 3 dice que la puerta del noveno juego se abre cuando "la clave llega" o "se
  decide por escrito que no va a llegar". Desde el apartado (h), la puerta se abre cuando
  `T-279` cuenta los 8 Fáciles sobre la vara de setlist.fm — la clave de YouTube ya no es
  la condición. No lo edito en este archivo porque `T-274` no tiene `PRD-skayboy-y-
  poligirl.md` en su alcance. Dueño: `producto`, próxima ráfaga sobre ese documento.
- **Dónde vive la pantalla del ranking de populares/oscuros.** No lo decido acá — `BR-18`
  fija la promesa y las reglas del dato, no el flujo ni la pantalla (`CLAUDE.md`, límites
  de `producto`). Dueño: `experiencia`, si decide que es una pantalla propia, una sección
  de la Redondopedia, o ambas cosas.
- **El primer refresco del ranking de YouTube no tiene fecha todavía.** El reloj de los
  180 días de `BR-18` apartado d arranca a correr recién cuando exista una primera
  medición guardada. Dueño: `arquitectura` (la corrida) y `contenido` (el criterio de
  video), en la ráfaga que produzca el dato real.
- **`ADR-02` (link de resultado compartido) tiene que dejar de llevar `puntaje`/`total`
  sobre 8 para `US-01`.** `BR-19` apartado 6 dice qué tiene que poder representar el
  payload nuevo — ahora **tres** desenlaces posibles (ganó/perdió/se retiró), no dos:
  cuál de los tres fue, pregunta alcanzada sobre el total, aciertos sobre respondidas, y
  vidas restantes si el desenlace es una retirada. El esquema exacto no lo fijo acá.
  Dueño: `arquitectura`, `T-132`.
- **El piso mínimo de Fácil de `US-01` (10) es también, desde `BR-19`, el largo del
  primer escalón de la partida por vidas.** Cualquier Fácil que `contenido` sume por
  encima de ese piso reduce la vidriera fija que `BR-19` apartado 2 documenta y asume
  (todo jugador que gana el escalón Fácil ve el pozo completo). No bloquea nada de este
  ciclo — es la mitigación de fondo, no la de ahora. Dueño: `contenido`, sin fecha.
- **Si `BR-05` se extiende a `US-04`** (tramos de resultado bajo/medio/alto, cortes ya
  fijados) **es decisión de `experiencia`, no confirmada por este documento.** `BR-19`
  apartado 5 deja los cortes disponibles, no obligatorios. Dueño: `experiencia`.
- **`BR-30` (`T-283`) deja tres traspasos para `arquitectura` (`T-284`), dependiente de
  esta tarea:** el campo de schema que declara de dónde sale la dificultad de cada banco
  (`CTR-03`, `CTR-09`; `CTR-04` queda afuera, `US-03` no migra; `CTR-07` se retira de ese
  rol), la fórmula `repartirEnVivo()` para `US-07` con reparto en tercios (no el corte de
  8 de `CTR-19.5`), y el conteo completo de setlist.fm en `CTR-19` (dueño `investigador`,
  `T-282`, del que depende la fórmula para no llegar degradada). Dueño: `arquitectura`.

  > **Enmendado 2026-09-24 (precisión de `D-46`, `T-286`).** El paréntesis de arriba decía
  > "`CTR-04` queda afuera, `US-03` no migra". Ya no es cierto: el usuario decidió que
  > `US-03` también sale del conteo (`BR-30`, "La precisión del 2026-09-24"). `CTR-04`
  > entra a la lista de campos de schema que `arquitectura` tiene que sumar — mismo rol
  > que `CTR-03`/`CTR-09` — y además tiene que decidir cómo declara que el contexto
  > (`BR-03`) sigue derivado del mismo nivel que la dificultad, no de un campo aparte.
  > Dueño: `arquitectura` (`T-287`).
- **Recalcular `US-03` contra el conteo no es solo repintar una etiqueta.** Porque `BR-30`
  decidió que el contexto (`BR-03`) sigue atado al nivel, un ítem que cambia de nivel al
  recalcularse el banco también tiene que cambiar cuántos versos de contexto guarda —
  agregarlos o sacarlos, no solo el campo `dificultad`—. Es distinto de `US-07`, donde
  recalcular solo mueve un tema de franja sin tocar qué muestra cada paso de la escalera
  (`BR-20` queda intacta). Dueño: hilo principal, al construir `T-288`.
