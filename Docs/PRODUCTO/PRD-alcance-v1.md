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
>
> **Revisión 2026-10-04 (`D-57`, ciclo 18, "¿Qué tipo de ricotero sos?" se rehace).**
> Consume `D-57`, `INV-150` (`RES-150`..`RES-171`), la nota final de `CNT-09` —que llevaba
> desde el ciclo 8 sin respuesta—, `REV-07`, `CTR-08` v2 (`Docs/ARQ/ARQ-schema-dos-ejes.md`) y
> `src/lib/dos-ejes/banco.test.ts`, que se escribió antes que el banco. **Enmienda `US-06` con
> fecha, sin borrar el texto viejo**: la partida pasa a ser una noche de cinco momentos, el
> piso sube de 20 a 30 con tres por celda, y el criterio 4 suma la tarjeta de imagen y las
> cuatro postales. Contesta de frente la pregunta de `CNT-09` sobre el rastro de la banda.
> Suma `BR-36` (la frontera entre escena y credencial) y `BR-37` ("esta noche" y "otra noche"),
> las dos a continuación de `BR-17`, y una nota bajo la tabla de pisos. `US-06` sigue
> **fuera** de los cuatro juegos de `D-05`. El resto del documento no se tocó.
>
> **Revisión 2026-10-04 (`D-59`, ciclo 19, la noche ricotera entera).** Consume `D-59`,
> `INV-172` (`RES-172`..`RES-194`), `D-57` punto 3 y enmienda 7, `BR-36` y
> `src/lib/dos-ejes/banco.test.ts`. **Suma `BR-38`**, a continuación de `BR-37`: reemplaza los
> vetos 1, 3 y 4 de `BR-36` por la forma de `D-59` (lo marca en `BR-36` sin borrar el texto) y
> suma **el quinto lugar** de la prueba, *el que no toma ni fuma*. **Enmienda `US-06` con fecha**
> (una enmienda más, al final de la historia, y una marca en el criterio 7). El piso no cambia:
> 30 escenas, tres por celda. El resto del documento no se tocó.
>
> **Revisión 2026-10-05 (`D-59` enmiendas 2 y 3, ciclo 19, el plano de dos ejes).** Consume
> `D-59` enmiendas 2 y 3, `D-57` punto 7, `UX-38` y `src/lib/dos-ejes/partida.ts`
> (`planoFijo()`). **Enmienda `US-06` con fecha, sin borrar**: el criterio 3 queda
> **exceptuado para el plano de dos ejes del resultado**, por decisión del usuario, con el costo
> dicho, y se suma el criterio 9 (qué tiene que ser cierto para darlo por bueno). La excepción
> está marcada en el criterio 3, en la cabecera de la historia y en las dos frases que decían
> «los criterios 1, 2 y 3 no cambian»; `BR-17` lleva una nota. `BR-36`, `BR-37` y `BR-38` no
> dicen nada que la enmienda contradiga y no se tocaron. El resto del documento no se tocó.

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

> **Nota 2026-10-04 (`D-57`, ciclo 18).** `US-06` sigue sin entrar a la tabla de arriba: no es
> uno de los cuatro de `D-05`, y meterlo cambiaría la cuenta del "Listo". Pero su piso
> cambió, y quien busque pisos tiene que encontrarlo al lado de los otros:
>
> | Fuera del "Listo" | Piso | Forma del piso | Costo dominante |
> |---|---|---|---|
> | Qué tipo de ricotero sos (`US-06`) | **30 escenas** *(subido de 20 el 2026-10-04)* | **3 por celda**: 5 momentos de la noche × 2 ejes. Sin "mínimo Fácil": `BR-01` no aplica | Texto puro. Lo caro no es escribirlo: es la lectura de `REV-19` contra `BR-36` |
>
> **Manda la enmienda de `US-06`**, no esta fila: el porqué del número y la forma de contarlo
> están allá. Lo vigilan `src/lib/dos-ejes/banco.test.ts` (celda por celda) y
> `src/lib/pisos.test.ts`. Los pisos de `US-07`..`US-10` viven en sus propios documentos y no
> los copio acá.

---

## US-06 — Test: qué tipo de ricotero sos (fuera del "Listo" de la v1)

> **Origen: `IDEA-09` promovida por `T-115` (ciclo 8), sobre `BR-16`.**
> `Docs/PRODUCTO/PRD-backlog-ideas.md` trae el detalle de por qué esta idea, de las diez
> guardadas, era la candidata más fuerte: texto puro, sin audio ni imagen con derechos, y
> devuelve una identidad en vez de un puntaje. Acá se fija lo que faltaba: los ejes (ya
> decididos por el usuario), los criterios, el piso y qué devuelve.

> **ENMENDADA el 2026-10-04 por `D-57` (ciclo 18).** El texto de abajo se conserva entero, para
> que se vea de dónde se viene. **Vale todo lo que dice, salvo lo que una marca
> "[Reemplazado …]" o "[Ampliado …]" declara cambiado.** Lo cambiado, de un vistazo: la
> partida es una noche de cinco momentos; el piso pasa de 20 a 30 con tres por celda; el
> criterio 4 suma la tarjeta de imagen y las cuatro postales; y se agregan los criterios 5 a 8.
> **Los criterios 1, 2 y 3 no cambian, palabra por palabra**, y `BR-17` tampoco. La enmienda
> entera, con la respuesta a la pregunta de `CNT-09`, está al final de esta historia, en
> «Enmienda 2026-10-04». **El mismo día, una segunda enmienda por `D-59`** (la noche ricotera):
> también al final, en «Enmienda 2026-10-04 (segunda)». **Una tercera, del 2026-10-05, exceptúa
> al plano de dos ejes del criterio 3** (`D-59` enmiendas 2 y 3): al final, en «Enmienda
> 2026-10-05 (tercera)». **[Matizado 2026-10-05.]** «Los criterios 1, 2 y 3 no cambian, palabra
> por palabra» sigue siendo cierto del *texto* del criterio 3 y deja de serlo de su *alcance*:
> tiene una excepción, una sola, el lugar de las maneras en el plano.

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

> **[Exceptuado 2026-10-05, solo para el plano de dos ejes del resultado (`D-59` enmienda 3).]**
> El texto de arriba se conserva entero y rige para todo lo demás: la hoja, el nombre, la grilla
> de las cuatro maneras, la línea de contraste, la tarjeta, la postal y la vista previa. Para el
> plano, «nada en la pantalla lo jerarquiza» **deja de ser cierto en una sola cosa, el lugar**:
> cada manera ocupa el mismo rincón para todos, por decisión del usuario. Qué sigue prohibido,
> qué cuesta y cómo se da por bueno el plano: «Enmienda 2026-10-05 (tercera)» y criterio 9, al
> final de la historia.

**Criterio 4 — caso borde (se comparte, como pedía la idea):**
- **Given** un jugador terminó el test.
- **When** toca compartir el resultado.
- **Then** lo que se comparte es el nombre de su identidad como elemento central, sin
  puntaje visible — el mismo principio que ya resuelve `UX-02` para el quiz, aplicado a un
  resultado que no es un número. Si `UX-02` sirve tal cual o necesita una variante para un
  resultado sin puntaje lo decide `experiencia`; esta historia solo fija que el enganche
  existe y qué NO puede llevar (puntaje, ranking).

> **[Ampliado 2026-10-04.]** Lo de arriba sigue vigente y no se retira: el nombre de la
> identidad como elemento central, sin puntaje. La ampliación (la tarjeta de imagen por
> identidad, las cuatro postales con vista previa propia y la línea de contraste al volver)
> está en «Criterio 4, ampliado», en la enmienda del final de esta historia.

> **[Reemplazado 2026-10-04 por «Piso vigente: 30 escenas» de la enmienda del final.]** Lo que
> queda reemplazado del bloque que sigue: el número (20, que eran 10 por eje), el sorteo de
> «5 de las 10 de cada eje» y la mitad del «Por qué 20 y no más» (la parte de «dos partidas
> seguidas ya pueden no coincidir», que ahora es una garantía y no una posibilidad: `BR-37`).
> **Sigue en pie**, sin cambios: que cada pregunta tenga exactamente 2 opciones, una por
> extremo; que `BR-01` no aplique; que no haga falta ficha `RES-XX` (reforzado por `BR-36`); y
> los cuatro cuadrantes con nombre propio y sin grados. Se deja el texto como estaba.

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

> **[Reemplazado 2026-10-04, solo la última cláusula.]** El sorteo «de las 5 de 10 por eje»
> ya no existe: lo reemplaza el sorteo por momentos de `CTR-08` v2.5 (`arquitectura`). Lo
> demás de este párrafo sigue valiendo, y la variante de `UX-02` ya la contestó `UX-06` §6
> (y la amplía `UX-36`).

### Enmienda 2026-10-04 — la partida es una noche (`D-57`, ciclo 18)

> Pedido del usuario, 2026-10-04, textual: *"Hacé un ciclo entero de mejora importante sobre
> el juego de qué tipo de ricotero sos, mejora artística, de preguntas, de resultado y de
> otras cosas que analices que se puedan mejorar."* `D-57` es la síntesis de siete lectores,
> tres conceptos completos y tres jueces. **Acá va solo lo que es de `producto`**: qué es una
> partida, cuánto contenido hace falta, qué se promete al compartir, y las dos reglas
> (`BR-36`, `BR-37`) que impiden que la mejora rompa lo que `US-06` promete. Pantallas y
> arte son de `experiencia` (`UX-36`); textos, de `contenido` (`CNT-30`); forma y motor, de
> `arquitectura` (`CTR-08` v2).

**Qué cambia y qué no**

| Pieza | Antes (2026-08-24) | Desde 2026-10-04 | Marca |
|---|---|---|---|
| Qué es una partida | Diez preguntas sueltas, sorteadas «5 de las 10 de cada eje» | **Una noche de recital en cinco momentos** (la previa, la ida, la vereda, adentro, la vuelta): en cada uno, una escena de cada eje. Siguen siendo diez, cinco por eje | Reemplaza el sorteo |
| Piso | 20 (10 por eje) | **30 listos, 3 por celda** (momento × eje) | Reemplaza |
| Qué es el resultado | Una identidad que se «encuentra» («Diste con esto») | **De esta noche** (`BR-37`) | Nuevo |
| Jugar otra vez | «Probá de nuevo»: repetía la mitad | **«Empezá otra noche»**: escenas que no salieron en la visita (`BR-37`) | Nuevo |
| Compartir | El nombre de la identidad y un enlace | Suma **tarjeta de imagen por identidad** y **cuatro postales** con vista previa propia | Amplía el criterio 4 |
| El rastro de la banda en las escenas | Ninguno: «sabor ricotero» = credencial | **Escena de recital sin dueño**, con la frontera de `BR-36` | Da vuelta el criterio con que se retiró `EJ-011` |
| Criterios 1, 2 y 3 | — | **No cambian** *[Matizado 2026-10-05: el criterio 3 tiene una excepción, el plano de dos ejes]* | — |
| `BR-17`, los dos ejes, los cuatro cuadrantes y sus ids | — | **No cambian.** Cambian nombres y bajadas (`D-57` punto 5, `CNT-30`) | — |

**La noche, en términos de producto.** Cinco momentos, siempre en el mismo orden. En cada
uno salen dos escenas, una que mueve cada eje; cuál de las dos va primero cambia de una
noche a otra. Cada escena vive en un solo momento y en un solo eje, así que **ninguna se
repite dentro de una noche**. Al final hay cinco respuestas por eje, impar (`BR-17` regla 3
intacta): el empate sigue siendo imposible. Los momentos son tantos como las preguntas por
eje (`CTR-08` v2.2), y ese número tiene que seguir siendo impar: un sexto momento daría seis
por eje, que es par, y `BR-17` regla 3 lo impide. Alargar la noche es pasar de cinco a siete,
nunca a seis. El nombre de cada momento y la línea que lo canta son de `contenido`.

**Piso vigente: 30 escenas listas, tres por celda.** Una celda es un momento por un eje:
cinco por dos, diez celdas. Lo motiva el riesgo 4 del brief —el banco corto: un juego hermoso
con pocas escenas adentro— y el supuesto de la visita de dos o tres minutos.

- **Qué cuenta.** Lo que está `listo`. Los retirados y los borradores no cuentan.
- **El piso es por celda, no en total.** Treinta repartidas mal (seis en la previa, una en la
  vuelta) dejan un momento cojo, y el motor se niega a servir una noche con una celda vacía.
  Tres por celda **y** treinta en total: las dos cosas.
- **Por qué tres.** Tres es lo que da tres noches seguidas sin repetir una escena (`BR-37`), y
  tres noches es lo que cabe en la visita del brief: dos o tres minutos. *Supuesto de duración,
  no medido, análogo al del criterio 1: una noche son diez toques de elegir entre dos frases
  cortas más las diez pausas de 0,6 s de `D-57` punto 12 (seis segundos en total), así que cabe
  en poco más de un minuto. `experiencia` lo valida y, si dura más, lo avisa por
  `Docs/SUGERENCIAS/`.* Con dos por celda la tercera noche repetiría media noche; con cuatro,
  la cuarta noche ya no cabe en la visita.
- **Por qué no más.** Un piso es «no se cierra por debajo», no «no se puede agregar»: si
  `contenido` escribe más, entra, y le sirve a quien vuelve otro día. Pero el piso no lo
  exige: dentro de una visita, tres por celda ya garantizan que no se repita nada, y cada
  escena nueva cuesta una lectura de `REV-19` desde cuatro lugares (`BR-36`).
- **El retiro y la entrada son la misma entrega.** Los veinte listos de hoy se retiran con
  nota, sin reciclar ids (`EJ-001`..`EJ-028` se quedan en el archivo; las nuevas son
  `EJ-029`..`EJ-058`), y las treinta entran en la misma integración. No hay versión publicable
  con veinte viejas más algunas nuevas: las viejas no tienen `momento`, y una noche sin su
  estructura entera no se arma. Es el aviso de `REV-07` (retirar sin reemplazar deja el piso
  incumplido en silencio) llevado a esta forma.
- **Sigue sin necesitar** audio, imagen con derechos, distractores ni ficha `RES-XX`: es el
  contenido más barato del sitio. Lo caro es leerlo (`BR-36`). `BR-01` sigue sin aplicar.
- **Lo vigilan** `src/lib/dos-ejes/banco.test.ts` (celda por celda) y
  `src/lib/pisos.test.ts` («US-06: el piso de 30 escenas»).

**Criterios 1, 2 y 3: no cambian.** Quedan como están más arriba. La noche es la forma en que
se ordenan las diez preguntas del criterio 1; no cambia cuántas son ni cómo se resuelve el
resultado. **[Matizado 2026-10-05: el criterio 3 tiene una excepción, el plano de dos ejes; ver
«Enmienda 2026-10-05 (tercera)».]**

**Criterio 4, ampliado.** El texto de arriba sigue en pie. Se suma:

- **4a — la tarjeta de imagen.**
  - **Given** un jugador terminó la noche.
  - **When** toca compartir.
  - **Then** se comparte la **tarjeta de imagen de su manera** junto con el enlace a la
    postal de esa manera. La tarjeta es la misma para todos los que cayeron en esa manera:
    ninguna lleva un dato de la persona. **No lleva ningún número**: ni puntaje, ni conteo por
    eje, ni porcentaje, ni «cuánta gente tiene la tuya» (el sitio no muestra los números de
    la analítica, `D-56`). Las cuatro tarjetas pesan igual: las mismas piezas de arte, el
    nombre en el mismo tamaño, la misma estructura; ninguna se ve como un premio (extiende el
    criterio 3 a la imagen). **Si el aparato no puede compartir archivos**, quedan a mano el
    enlace y la forma de bajar la tarjeta: nadie se queda sin poder mandarla (`D-14`).
- **4b — la postal.**
  - **Given** alguien recibe el enlace de la postal de una manera, sin haber jugado nunca.
  - **When** lo abre, o lo ve como vista previa en un chat o en una red.
  - **Then** la vista previa dice **qué le salió al otro** —el título es «Me salió» y el nombre
    de la manera— con la imagen de esa manera; al abrirla, ve **qué es esa manera antes de
    jugar** y un botón que arranca su noche directo, con el desafío puesto. Hay **cuatro
    postales, una por manera**. Los enlaces viejos (`?g=dos-ejes&r=CU-n`) siguen andando y
    abren con el nombre vigente de la manera: **viaja el id, no el nombre**. Tampoco acá hay
    números.
- **4c — el contraste al volver.**
  - **Given** alguien llegó por la postal o por un enlace de otro.
  - **When** termina su noche.
  - **Then** ve **una línea neutra** de contraste con la manera del otro (`CNT-29`): la
    misma, que comparten un polo, o la opuesta. **Nunca ganar ni perder**, y la línea es
    simétrica: dicha desde cualquiera de los dos, dice lo mismo.

**Criterio 5 — la noche.**
- **Given** un jugador arranca una partida.
- **When** avanza hasta el final.
- **Then** pasa por **cinco momentos, siempre en el mismo orden** (la previa, la ida, la
  vereda, adentro, la vuelta); en cada uno responde **dos escenas, una de cada eje**; ninguna
  escena se repite dentro de la noche; al terminar cada eje tiene cinco respuestas y el
  resultado es uno de los cuatro cuadrantes (criterios 1 y 2, intactos).

**Criterio 6 — otra noche** (`BR-37`).
- **Given** un jugador terminó una noche y sigue en la misma visita.
- **When** toca «Empezá otra noche».
- **Then** arranca otra noche sin pasar por la portada ni pedirle nada, y **en cada momento y
  cada eje sirve una escena que no salió en las noches anteriores de la visita**, mientras la
  celda las tenga: con tres por celda, la segunda y la tercera noche no repiten ninguna. Si una
  celda se agotó, toma de todas **sin avisar y sin error**. El resultado de la nueva noche
  **reemplaza** al anterior: no hay «mejor de tres», ni historial, ni cuenta de noches.
- **Borde.** Si la persona recarga la página, es otra visita: puede ver escenas que ya vio, y
  no es un defecto.

**Criterio 7 — la escena es de todos** (`BR-36`).
- **Given** cualquier escena `lista` del banco.
- **When** la lee alguien que nunca fue a un recital, alguien sin plata para una entrada,
  alguien en silla de ruedas, o alguien que tiene que volver de noche sin compañía.
- **Then** puede elegir cualquiera de las dos opciones **tal como están escritas**, y ninguna
  de las dos le dice que es «menos de adentro» (las pruebas son las de `BR-36`: los cuatro
  lugares y la del que no fue). Nada de la noche —ni la escena, ni el sello
  del momento, ni la línea que canta, ni la bajada de una manera— nombra a la banda ni a sus
  temas, ni a Bulacio, Olavarría, Cromañón o la muerte del Indio.

> **[Reemplazado 2026-10-04 por `BR-38` (`D-59`): «los cuatro lugares» y la mitad de la última
> frase.]** Los lugares de la prueba son **cinco**: se suma *el que no toma ni fuma*. Y la noche
> **puede nombrar** a la banda, a los Redondos, la misa, los trapos, el pogo y «ricotero» **en la
> escena** (no en una opción). **Siguen vedados**, en todo lo que la gente lee de la noche, las
> personas de la banda, sus temas por su título, y Bulacio, Olavarría, Cromañón y la muerte del
> Indio. Lo demás del criterio —que cualquiera pueda elegir cualquiera de las dos tal como
> están escritas, y que ninguna sea «menos de adentro»— sigue entero.

**Criterio 8 — un toque, una respuesta.**
- **Given** una escena en pantalla.
- **When** el jugador toca una opción y vuelve a tocar —la misma, la otra, o el lugar donde
  va a aparecer la siguiente— antes de que la siguiente llegue.
- **Then** cuenta **un solo toque** por escena, la siguiente no se contesta sin que haya
  llegado, y quien juega ve cuál tocó. Si usa «Volvé a la anterior», la respuesta nueva
  **reemplaza** a la vieja: **ningún camino deja un eje con más o menos de cinco respuestas**,
  porque con otro número el empate vuelve por la puerta de atrás (`BR-17` regla 3).
- *Por qué es un criterio y no solo una decisión de pantalla:* hasta el ciclo 18 un doble toque
  contestaba la pregunta siguiente sin leerla y corrompía, sin avisar, el único resultado que
  da el juego (`D-57`, lo que estaba mal, punto 1). Qué hace la pantalla para impedirlo es de
  `UX-36`; que el resultado no se corrompa es de acá.

**La pregunta de `CNT-09`, contestada.** `CNT-09` cerró su entrega con una nota dirigida a
`producto` («Nota para `producto`, no para mí — el banco no tiene ni un rastro de la banda»):
con `EJ-011` retirado no quedaba una sola mención a la banda en las veinte escenas —plantas,
súper, asado, playa, una plaza con mate—, y lo único ricotero del juego eran el título, la
paleta de *Luzbelito* y los cuatro nombres. Preguntaba si estaba bien así o si el juego
necesitaba, «en algún lugar que no sea el contenido de las preguntas», algo más que lo
recuerde. **Llevaba desde el ciclo 8 sin respuesta.** Va, de frente:

> **No estaba bien así. Y el contenido de las preguntas también era un lugar.**

1. **La medición de `CNT-09` era correcta; lo que faltaba era el juicio.** Un test que se
   llama «¿Qué tipo de ricotero sos?» y cuyas veinte escenas servirían idénticas en cualquier
   sitio **no cumple lo que promete la puerta**. El que llega por un enlace de Twitter es un
   desconocido sin contexto (brief, «Para quién»): lo único que sabe es el título, y lo que
   juega no se lo confirma. `D-57` lo midió igual: ni una escena del banco era del mundo
   ricotero. `CNT-09` lo había dejado a la vista y se lo dejó a `producto`; nadie lo tomó.
2. **El criterio con el que se retiró `EJ-011` leía `BR-17` más ancho de lo que `BR-17` dice.**
   `BR-17` prohíbe un eje que mida *conocimiento* («sabés mucho / sabés poco»). No dice nada
   de dónde transcurre una escena. Se confundieron dos cosas: **ambientar** y **puntuar**. Lo
   que cierra un molinete es que contestar bien sea mostrar que se es de adentro; que la
   escena pase en un recital no lo cierra. **Queda dado vuelta por escrito, como pide `D-57`
   punto 3:** el sabor ricotero ya no es, por sí solo, una credencial. `EJ-011` sigue retirado
   (un id no se recicla, y los veintiocho del banco viejo salen); lo que cambia es el
   criterio, no el ítem.
3. **El rastro entra por dos lugares, y por uno no entra.**
   - **Por la forma de la partida.** La noche —previa, ida, vereda, adentro, vuelta— es el
     recital contado desde quien va, no desde la banda. Lo reconoce quien estuvo y lo imagina
     quien no.
   - **Por el marco.** El libro de *Luzbelito* como única pieza de arte, los sellos y la voz
     (`UX-36`, `CNT-30`). Nada de eso está en el banco.
   - **No entra por el nombre de la banda, de sus temas, de su gente ni de sus rituales.**
     Ahí la escena se vuelve credencial. El recital es «un recital», **sin dueño** (`D-57`
     punto 2): la noche es la de cualquiera que sale a ver música, contada en presente.
4. **La regla que lo sostiene es una sola: reconocible, no exigido.** Quien fue reconoce la
   noche; quien no fue juega la misma noche como una salida cualquiera. Esa asimetría es lo
   que hace compatible «molinetes abiertos» con «un sitio sobre esta banda», que era la
   tensión que `CNT-09` anotó sin poder resolver. Dónde pasa la frontera, ítem por ítem, lo
   fija `BR-36`.
5. **El trazo es fino a propósito.** Hoy lo ricotero de las escenas es *dónde* pasan, no *qué
   hay que saber*. Si alguna vez parece poco, la salida es una escena más reconocible
   **dentro** de `BR-36`, nunca un nombre propio: lo segundo es exactamente lo que `BR-36`
   veta.

**Lo que esto cuesta, dicho.** Cambié una regla barata de mirar («la palabra *banda* no
aparece») por una cara de mirar («¿hay una opción de adentro?»), porque la barata dejaba afuera
lo único que el juego promete. La máquina vigila lo que se puede contar y el resto lo lee
`revisor` en `REV-19`: treinta escenas por cuatro lugares. Ese es el precio y se acepta.

**Queda fuera de esta enmienda:** los enunciados, las opciones, los cinco sellos, las cuatro
bajadas y el copy de las pantallas (dueño `contenido`, `CNT-30` y `CNT-29`); la portada, la
hoja, la grilla de las cuatro maneras, la tarjeta y el arte (dueño `experiencia`, `UX-36`;
y `D-57` puntos 7, 8, 9, 12 y 13); el schema, el motor, el taller de tarjetas y las
postales como rutas (dueño `arquitectura`, `CTR-08` v2, `ADR-02`). Tampoco promuevo a
criterio la accesibilidad de `D-57` punto 13 (foco, región viva, teclado): es de `UX-36`, y
nada del brief la ata al criterio de aceptación de esta historia.

### Enmienda 2026-10-04 (segunda) — la noche ricotera (`D-59`, ciclo 19)

> El banco pasa de «un recital sin dueño» a **la noche ricotera**: la escena puede traer la
> previa, lo que se toma y se fuma, el barro, el reviente, la misa y la gente que va, y la
> opción sigue siendo de quien juega (`BR-38`, que reemplaza los vetos 1, 3 y 4 de `BR-36` y
> suma el quinto lugar, *el que no toma ni fuma*). **El piso no cambia: 30 escenas listas, tres
> por celda**, y lo que se reemplace del banco actual se retira con nota y entra el reemplazo
> en la misma integración («El retiro y la entrada son la misma entrega»). Deja sin efecto
> «escena de recital sin dueño» y el punto 3 de «La pregunta de `CNT-09`, contestada» **en lo
> que dicen de la banda y sus rituales**; «reconocible, no exigido» sigue como estaba. Los
> criterios 1 a 6 y 8, y `BR-17`, no cambian.

### Enmienda 2026-10-05 (tercera) — el plano de dos ejes, fijo (`D-59` enmiendas 2 y 3, ciclo 19)

> Pedido del usuario, 2026-10-05, textual: *"Me gustan las explicaciones pero quiero que esté el
> gráfico también, queda lindo ver que está en un plano de dos ejes."* (`D-59` enmienda 2). Y,
> mirando las dos versiones lado a lado —la relativa, con la tuya siempre arriba a la izquierda,
> y la fija—: *"B, el fijo como el rombo viejo."* (`D-59` enmienda 3). **La decisión es del
> usuario**: esta enmienda no la discute; la ata a lo que cuesta y a lo que no se relaja. La
> pantalla y las medidas son de `experiencia` (`UX-38`); el texto del lector, de `contenido`
> (`T-352`); el motor, de `arquitectura` (`planoFijo()` en `partida.ts`).

**Qué se exceptúa, exacto.** El criterio 3 dice que *nada en la pantalla jerarquiza una manera
sobre las otras tres*. Para **el plano de dos ejes del resultado**, y solo para él, eso deja de
valer en **una cosa: el lugar**. Luz arriba y Orden a la izquierda, siempre; cada manera tiene su
rincón, el mismo para todos, tenga quien mire el resultado que tenga:

| | Orden (izquierda) | Caos (derecha) |
|---|---|---|
| **Luz** (arriba) | `CU-1` Mesa larga a las nueve | `CU-2` Ronda en cualquier esquina |
| **Oscuridad** (abajo) | `CU-3` Radio bajita, misma hora | `CU-4` Mochila liviana, sin mapa |

(Nombres de `D-57` punto 5. Los ids y sus polos no se mueven.)

**Qué sigue bajo el criterio 3, sin excepción.** La hoja del resultado y el nombre; **la grilla de
las cuatro maneras, que sigue relativa** (la tuya primero, `disposicion()`: entre las cuatro
grillas posibles cada manera pasa una vez por cada lugar, y lo vigila `partida.test.ts`); la
línea de contraste; la tarjeta de imagen, la postal y la vista previa. **El plano no viaja en
ninguna de las tres** (`UX-38` §6; hoy ni `taller.ts` ni las páginas lo nombran). Si algún día
se lo quiere en la tarjeta, es otra enmienda: la tarjeta la ve un desconocido, y el criterio 4a
le exige que las cuatro pesen igual.

**Lo que se acepta, con el costo dicho.**

1. **Una de cada cuatro personas ve la suya en el rincón que se lee primero, y otra en el que se
   lee último, para siempre.** No depende del azar ni de cuánto jugó: depende de la manera.
   `D-57` punto 7 sacó el rombo exactamente por esto (*«dejaba las dos caras de luz siempre
   arriba»*) y `UX-38` §2.1 había descartado esta misma disposición (*«la jerarquía del rombo
   con otro dibujo»*). Vuelve porque el usuario la eligió viéndola.
2. **El costo mayor no es el rincón: es que arriba es «luz».** Arriba ya es el lugar del acierto
   en otros juegos del sitio (`PRD-ponelos-en-fila.md`, «El riesgo de que la fila de arriba se
   lea como "acierto"»), y *luz* es la palabra que halaga. `CU-3` y `CU-4`, las dos de
   oscuridad, quedan abajo para todos. `D-57` («lo que estaba mal», 4) midió que los resultados
   viejos no halagaban parejo a luz y a oscuridad, y se arregló en el texto de las bajadas; el
   plano lo reabre en el lugar. Se acepta.
3. **Qué compra.** Lo que pidió el usuario, ver que está en un plano de dos ejes, y algo que la
   grilla relativa no daba: dos amigos con resultados opuestos miran el mismo mapa, y el
   punteado de quien mandó el enlace cae en el mismo rincón para los dos.
4. **Se puede deshacer.** Volver a lo relativo no pide motor nuevo: `disposicion()` sigue
   existiendo y ordena la grilla. Si la lectura con gente real (`UX-38` §10.5: «¿Se lee más
   pobre alguna de las cuatro maneras en el plano?») dice que una manera se siente de última,
   se reabre por ahí. Nada de esto toca los criterios.

**Lo que no se relaja.** La excepción es del lugar, de nada más. De dónde sale cada prohibición,
para que no se lea una de más ni una de menos:

| En el plano (dibujo y texto del lector) no hay | Dónde está escrito |
|---|---|
| Ningún número: ni puntaje, ni conteo por eje, ni porcentaje, ni «cuánta gente tiene la tuya» | Criterio 3 (no se muestra el conteo), criterio 4a, `D-56`. `D-59` enmienda 3 lo cita bajo `BR-17` |
| Ningún punto ni posición calculada: la marca es el borde y el sello | `BR-17` regla 2 (cada respuesta vale un polo puro: no hay un intermedio que dibujar, y un punto a mitad de camino mostraría un valor que el test no calcula); `UX-38` §1.3 |
| Ninguna graduación: ni escala, ni marcas regulares sobre un eje, ni flechas, ni «un poco más» | «No hay grados dentro de un cuadrante» (piso de `US-06`); `UX-38` §1.4 |
| Ninguna manera más grande, de otra letra o de otro peso: la tuya se marca con borde y sello | Criterio 3 (ningún cuadrante «más»), criterio 4a (las cuatro pesan igual) |
| Ningún color por manera ni por rincón | Criterio 4a; `D-57` punto 8 (*«ninguna pieza se asigna a un cuadrante»*); `diseno-marca.md` |
| Ninguna palabra que ordene los rincones: ni «mejor», «peor», «primera», «última», ni «más». «Arriba a la izquierda» es un lugar, no una nota | Criterio 3; `BR-37` regla 1 |
| Ningún toque ni decisión más, y ninguna dependencia: el plano se mira; si no se puede armar, no se pinta y nada más cambia | Brief, criterios no negociables 2 y 3 (pulgar, sin muro); `UX-38` §0.1 |

**Criterio 9 — el plano de dos ejes** (`D-59` enmiendas 2 y 3).
- **Given** un jugador terminó la noche (con o sin enlace de otro) y está en el resultado.
- **When** baja hasta «Las cuatro maneras».
- **Then** ve, debajo de los dos botones y arriba de la grilla, un plano de dos ejes que cumple
  **las siete condiciones** de abajo. Si falla una, el plano no se da por bueno.

| # | Condición | Cómo se verifica |
|---|---|---|
| 1 | **El mismo mapa para todos.** Luz arriba y Orden a la izquierda: `CU-1` arriba a la izquierda, `CU-2` arriba a la derecha, `CU-3` abajo a la izquierda, `CU-4` abajo a la derecha, en las cuatro maneras y con o sin enlace. Sale del motor (`planoFijo()`), que no recibe el resultado, así que no puede girar con él | Automático: `partida.test.ts`, «el plano es fijo: Luz arriba, Orden a la izquierda, para todos»; `isla.test.ts`, «el plano es una imagen con su texto…» (sale de `planoFijo(banco)` y no escribe los polos a mano) |
| 2 | **La tuya, donde cae, marcada solo con borde y sello** («Esta noche»). La de quien mandó el enlace, punteada y con su sello («Quien te lo mandó»); si es la misma, los dos | Parcial: `estilos.test.ts` exige las reglas `--tuya` y `--suya` (`ESTADOS_EJES`). El resto, por la medición del hilo (Playwright, 2026-10-05: 40 casos, la tuya en su rincón) |
| 3 | **Los cuatro miden y pesan lo mismo**: mismo ancho y alto de cuadrante, misma letra, con o sin marca; filas y columnas iguales; sin desborde; nada bajo 12 px | Letra: `estilos.test.ts` (nada bajo 0,75 rem en `.ejes-`). Tamaños: medición del hilo (5 ventanas × 4 maneras × con y sin amigo). **Ningún test repite la igualdad de tamaños** |
| 4 | **Sin número, sin punto, sin graduación.** Ni un dígito en el texto del plano ni en su `aria-label`; sin punto; ninguna marca regular ni flecha sobre los ejes | Parcial: `isla.test.ts` (sin punto). Los dígitos, en el navegador: `/\d/.test(p.textContent + p.getAttribute('aria-label'))` con `p = document.querySelector('.ejes-plano')` da `false`. Las marcas, por lectura de `revisor` |
| 5 | **Ningún color por manera ni por rincón.** Ninguna regla de `.ejes-plano*` ata color, fondo o borde a un id de manera, a un `data-*` ni a un `nth-*`; solo `--tuya` y `--suya` | `rg -n -i "ejes-plano.*(cu-[1-4]\|data-\|nth-)" src/styles/juego.css` no devuelve nada (hoy no devuelve) |
| 6 | **Nada que ordene en el texto del lector.** Dice los dos ejes, los cuatro polos y dónde cae la tuya (y la del otro) como lugar. Sin «mejor», «peor», «primera», «última», «más». Quien usa lector de pantalla recibe lo que recibe quien ve | Lectura de `contenido` (`T-352`) y de `revisor`. `voz.test.ts` mira la voz, no el orden |
| 7 | **No viaja ni estorba.** No está en la tarjeta, la postal ni la vista previa; no suma un toque ni nada enfocable adentro; «Compartí» y «Empezá otra noche» quedan en el mismo lugar con y sin el plano; si falla al armarse, no se pinta y el resto no cambia | `rg -n -i "plano" src/lib/dos-ejes/taller.ts src/pages` no devuelve nada; `isla.test.ts` (sin `'a'`, `'button'` ni `tabindex`); los botones, por la medición del hilo (2026-10-05); el `try/catch` de `plano()`, por lectura |

**Lo que cuesta verificarlo, dicho.** Las condiciones 3, 5 y 6 no tienen un test que las repita
solas: la 3 vive en una medición hecha una vez, la 5 en un `rg`, la 6 en una lectura. Es el
mismo trato de `BR-36` y `BR-38`: la máquina vigila lo que se puede contar y `revisor` lee el
resto. Si el hilo quiere cerrar la 3, es un test de tamaños en el navegador; no lo pido.

**Queda fuera de esta enmienda.** El copy del lector (`contenido`, `T-352`); el recorte, los
ejes y las medidas (`experiencia`, `UX-38`, y el lienzo `T-351`); el motor (`arquitectura`). No
toca `BR-17`, `BR-36`, `BR-37` ni `BR-38`, el piso (30, tres por celda), los cuatro nombres, el
criterio 4 ni la tarjeta.

**Verificación.** `producto` no ejecuta (`D-12`); lo corre el hilo principal o `revisor`:

```bash
node --test src/lib/dos-ejes/partida.test.ts src/lib/dos-ejes/isla.test.ts src/lib/estilos.test.ts
rg -n -i "ejes-plano.*(cu-[1-4]|data-|nth-)" src/styles/juego.css
rg -n -i "plano" src/lib/dos-ejes/taller.ts src/pages
rg -n "^### Enmienda 2026-10-05 \(tercera\)" Docs/PRODUCTO/PRD-alcance-v1.md
```

Los dos `rg` del medio **no tienen que devolver nada**; el último, una línea.

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

> **Nota 2026-10-04.** `BR-17` no cambia: sus tres reglas siguen valiendo enteras. Lo que
> sumó el ciclo 18 son dos reglas hermanas, `BR-36` y `BR-37`, a continuación. La primera
> dice qué escenas del mundo del recital entran al banco sin cerrar un molinete (cómo se
> lee `BR-17` ahora que el banco no es ajeno a la banda); la segunda, qué recuerda una
> visita y cómo se presenta el resultado de una partida inestable por diseño.

> **Nota 2026-10-05.** `BR-17` tampoco cambia con el plano fijo (`D-59` enmiendas 2 y 3): ninguna
> de sus tres reglas dice dónde se dibuja una manera. Lo que exceptúa la enmienda tercera de
> `US-06` es el **lugar** de las maneras en el plano del resultado, no cómo se puntúa. La regla 2
> es la que sostiene «sin punto» y «sin graduación»: cada respuesta vale un polo puro, así que
> no hay posición intermedia que mostrar.

---

## BR-36 — La frontera entre escena y credencial: cuándo una escena de recital entra al banco

**Aplica a:** `US-06` (criterio 7), el banco de la noche (`CNT-30`) y su revisión (`REV-19`).
**Consume:** `D-57` (puntos 2, 3 y 4), `BR-17`, la nota final de `CNT-09` y su `T-127` §2,
`REV-07`, `INV-150` (`RES-150`..`RES-161`), `D-14`, `CTR-08.5` regla 5 y
`src/lib/dos-ejes/banco.test.ts`. **Motiva (brief):** el criterio no negociable 3, «sin muro de
entrada», y «La postura: molinetes abiertos». **Fecha:** 2026-10-04.

> **ENMENDADA el 2026-10-04 por `BR-38` (`D-59`, ciclo 19).** El texto de abajo se conserva
> entero. **Vale todo lo que dice, salvo lo que una marca «[REEMPLAZADO por BR-38,
> 2026-10-04]» declara cambiado: los vetos 1, 3 y 4**, que pasan a la forma de `D-59` (y
> `BR-38` conserva de ellos las personas de la banda, los temas por su título y la policía).
> Los vetos 2, 5, 6 y 7 y la regla en una línea **no cambian**. Se lee con cuatro precisiones:
> **(a)** la fila «Dónde ocurre» de la tabla de escena y credencial ya no separa por el mundo
> de la banda: la credencial es lo que puntúa quién es de adentro, no dónde pasa la escena;
> **(b)** «el alcance es más ancho que el del test» lo fijan hoy las dos listas del test,
> `VETOS_DE_LA_NOCHE` (todo lo que se lee) y `VETOS_DE_LAS_OPCIONES` (solo donde se elige), y la
> primera fila de «Quién vigila qué» corresponde a los dos tests que las recorren; **(c)** «la
> prueba de los cuatro lugares» son **cinco** (suma *el que no toma ni fuma*); **(d)** el «Hueco
> conocido» sobre sello, línea que canta y bajadas quedó cerrado por el test «los sellos, las
> líneas que cantan y las bajadas tampoco…».

**Qué resuelve.** `D-57` abrió el banco al mundo del recital, que hasta ahora estaba vedado
entero. Abrirlo sin una frontera es volver al problema que `EJ-011` ya había mostrado: una
escena de recital donde una de las dos opciones es «la del que sabe». Esta regla dice dónde
pasa la frontera y, sobre todo, **quién la vigila**: la máquina, lo que se puede contar;
`revisor`, lo que hay que leer.

### La regla, en una línea

> **Una escena entra al banco si cualquiera puede contestarla desde su propia vida y las dos
> opciones se dicen con el mismo orgullo. No entra si contestarla bien es mostrar que se es
> de adentro.**

### Escena y credencial, lado a lado

| | Escena | Credencial |
|---|---|---|
| Qué hace falta para contestar | Lo que el enunciado ya trae | Haber ido, saber cómo es, o conocer una palabra o un objeto del código |
| Qué dice de quien elige una opción | Cómo se mueve en esa situación | Qué tan de adentro está |
| Qué pasa con la opción que no elegiste | Es otra manera, igual de decible | Es la que te deja más afuera |
| Dónde ocurre | En un recital sin nombre ni dueño | En el mundo de la banda, por su nombre |

### Lo que esta regla da vuelta, y lo que deja en pie

- **Da vuelta** el criterio con el que se retiró `EJ-011`: que el sabor ricotero, por sí solo,
  funcionara como credencial de pertenencia. Por qué, y qué responde a la pregunta que
  `CNT-09` dejó abierta, está en la enmienda de `US-06`.
- **Deja en pie, entera**, `BR-17` (un ítem mueve un solo eje; dos polos puros; conteo impar
  por eje), que ninguna pregunta pida saber de la banda, y todo lo que encontró `REV-07` (un
  eje que mide una sola cosa, un polo que no paga nunca). `BR-36` no relaja nada de eso:
  agrega una frontera en un territorio que antes estaba cerrado.
- **Cambia dónde mira la regla.** Antes miraba si aparecía la banda; ahora mira si hay una
  opción de adentro. Lo primero se contaba con una palabra. Lo segundo se lee.

### Los vetos de `D-57` punto 2, con su motivo

**Las palabras exactas viven en `VETOS`, dentro de `banco.test.ts`, y no se copian acá** (una
lista copiada en este archivo ya quedó vieja una vez). Acá van los **motivos**. Si lista y
motivo se contradicen, manda el motivo y se arregla la lista.

1. **[REEMPLAZADO por BR-38, 2026-10-04]** **La banda por su nombre.** Su nombre, el de sus integrantes, sus temas y sus rituales de
   tribuna (la misa, el pogo, el aguante). Un nombre propio es un código: quien lo conoce
   está adentro. El recital es «un recital», sin dueño, contado en presente, de cualquiera que
   sale a ver música (`D-57` punto 2). *El adjetivo «ricotero» queda vedado en enunciados y
   opciones (donde calificaría a alguien: «el más ricotero»); en el sello, la línea que canta
   y las bajadas puede aparecer, porque el título y la marca ya lo llevan, pero nunca para
   puntuar.*
2. **Muertes y tragedias.** Bulacio, Olavarría, Cromañón y la muerte del Indio son registro 3
   entero (`CNT-04`, `CNT-06`) y nunca escena de un test de dos botones. Tampoco lo que las
   evoca: el fuego, las bengalas, una despedida, un velorio. `D-57` punto 9 ya lo dijo de las
   velas y del verso de cierre —a cuatro meses del 5 de junio, «esta noche» se lee como un
   velorio aunque ningún texto lo diga—, y vale igual para una escena que se despide.
3. **[REEMPLAZADO por BR-38, 2026-10-04]** **Plata.** Es el molinete literal: nada acá se le niega a nadie por no tener con qué entrar
   (`CLAUDE.md`, §6). Ninguna escena dice que alguien pagó, compró o tiene entrada, y nadie
   dice cómo entró. La gente sin entrada fue parte de los recitales de la banda (`RES-154`):
   una escena de adentro que se da por «la normal» los deja afuera otra vez.
4. **[REEMPLAZADO por BR-38, 2026-10-04]** **Alcohol, drogas y policía.** El veto lo puso el test; la razón de producto es la misma
   del cuerpo y la seguridad de abajo: una opción que gira en torno a tomar, consumir o tratar
   con la policía no mide cómo se mueve alguien en una noche, mide si toma, si puede, si le
   toca. Parte a la gente por salud, por religión o por historia propia.
5. **El cuerpo y la multitud.** Un cuerpo capaz de algo no es un temperamento: ninguna opción
   exige pararse, saltar, correr, empujar ni aguantar apretado (`D-57` punto 3, el lugar de la
   silla de ruedas). Se escribe «te ubicás», no «te parás».
6. **Seguridad.** Hablar con desconocidos, ir a dedo: para quien tiene que cuidarse no es una
   elección, y se lee como valiente o como miedoso (`D-57` punto 2).
7. **Épica y psicodelia.** Ya es regla de voz (`voz-ricotera.md` §3.6 y §7), y acá pesa doble:
   «la lucha», «la resistencia», «el viaje» son la voz de la tribuna y se leen como la del que
   es de verdad. Es lo mismo que evitó `D-57` punto 1 al llamar «la ida» al segundo momento.

**El alcance es más ancho que el del test.** `D-57` punto 2 dice que la **noche** —no solo los
enunciados— es de cualquiera. Por eso los vetos 1 y 2 valen para **todo texto de la noche que
la gente lee**: enunciado, opciones, sello del momento, línea que canta, nombre y bajada de las
cuatro maneras. Los vetos 3 a 7 valen donde hay una elección que puede cerrarse: enunciado y
opciones.

### La prueba de los cuatro lugares (`D-57` punto 3)

**Por ítem, no por banco.** Cada escena se lee cuatro veces, parado en cada lugar, sobre el
texto **tal como está escrito** y no sobre lo que quiso decir quien lo escribió. Pasa si pasa
las cuatro.

- **Nunca fui.** *¿Puede contestarla, de verdad y sin adivinar, alguien que nunca estuvo en un
  recital?* Falla cuando el enunciado da por sabido cómo es adentro, qué se hace, cómo se
  llama algo o qué significa un objeto, o cuando una opción solo se entiende con el código. Se
  arregla trayendo en el enunciado lo que hace falta: cómo es ir a ver música lo imagina
  cualquiera, por una cancha, un casamiento o una fiesta. *Una ayuda de lectura, no una
  exigencia: cambiá «recital» por otra salida. Si el dilema sobrevive, es escena; si la gracia
  desaparece, mirá si la gracia era saber de recitales.*
- **Sin plata.** *¿Puede elegir cualquiera de las dos alguien que no tiene un peso para gastar
  esa noche?* Falla cuando una opción cuesta (una compra, un transporte pago, algo que se
  lleva puesto) o cuando la escena da por hecho que se pagó. Se arregla con decisiones de
  atención, de lugar, de ánimo o de a quién le hablás. El ejemplo del banco viejo es `EJ-005`,
  la plata tirada, que `CNT-09` retiró por medir otra cosa y que habría caído acá también.
- **Silla de ruedas.** *¿Puede elegir cualquiera de las dos alguien que no puede pararse,
  saltar, correr, subir ni aguantar apretado?* La silla de ruedas es el lugar desde donde se
  lee: vale igual para quien no aguanta de pie. Falla cuando una opción **exige** una
  capacidad del cuerpo, o cuando la escena solo existe de pie y en el medio. **No prohíbe que
  el cuerpo aparezca** (la imagen física y barata es de la voz del sitio, `voz-ricotera.md`
  §4.3): prohíbe que una capacidad sea lo que decide. Se arregla con «te ubicás», no
  «te parás».
- **Volviendo de noche sin compañía.** *Para alguien que tiene que volver solo o sola de noche,
  ¿cada opción es un gusto, o una de las dos es una precaución —o una imprudencia— presentada
  como carácter?* Falla cuando una opción es caminar, irse solo, hablar con alguien que no se
  conoce, tomar el camino oscuro: una persona elige por seguridad y la otra queda como valiente
  o como miedosa, y para quien se cuida **no es una elección**. Es la falla de `EJ-010` en el
  banco viejo («volver caminando solo de noche, mirar atrás»), que `CNT-09` reescribió porque
  era «una condición real para buena parte de la gente». Se arregla hablando de cómo se ocupa
  el tiempo —qué se mira, qué se escucha, a quién se le cuenta, si
  se queda un rato antes de irse—, no de cómo ni con quién se cruza la calle. Es el lugar más
  exigente de la noche, y por eso la vuelta tiene su propia guarda en el test.

**Cómo se usa.**
- **Con el veredicto escrito, por ítem y por lugar**: una tabla de treinta filas por cuatro
  columnas. Un fallo lleva su motivo; un «pasa» es una casilla. Lo que no puede ser una casilla
  es la prueba del que no fue (abajo): lleva, por ítem, cuál de las dos habría adivinado quien
  lee, o «ninguna».
- **Ítem por ítem es necesario y no alcanza** (`REV-06`, `REV-07`): `D-57` pide que `REV-19`
  sea adversarial sobre el conjunto, y los patrones de más abajo son ese encargo.
- **Un ítem que falla una vez se reescribe o se retira.** No lo compensan los otros veintinueve.
- **Los cuatro son el piso de la prueba, no el techo.** Si `revisor` encuentra un quinto lugar
  desde el que una escena se rompe, lo suma a esta regla por enmienda.

### Ninguna opción es «más de adentro» que la otra

- **Qué es «más de adentro».** La opción que elegiría quien quiere mostrar que es «de verdad».
  Las marcas habituales son la del **mayor sacrificio** (esperar más, aguantar), la de la
  **devoción** (llegar primero, quedarse hasta el último minuto), la de la **entrega total**
  (en el medio, a los gritos) y la que usa **una palabra o un objeto del código**. En el banco
  viejo la tuvo `EJ-001` («salir hecho pomada certifica que estuviste hasta el final»). Y tiene
  un espejo que también cuenta: la opción «de vuelta de todo», que se lee como la del veterano.
- **La prueba del que no fue.** `revisor` lee el par como lo leería alguien que nunca fue y se
  pregunta cuál elegiría «el ricotero de verdad». Si lo adivina sin dudar, la credencial está
  en el ítem. Se corre leyendo, no encuestando.
- **El mismo orgullo.** Cada par se puede decir en voz alta, en una previa, sin sonar a excusa
  ni a alarde (criterio heredado de `CNT-09`). Y **las dos opciones pagan algo**: ninguna es la
  de la competencia contra la del descuido. Es el defecto 2 de `REV-07`: «un eje donde un polo
  es siempre competencia y el otro a veces es descuido no separa maneras: ordena».
- **Alcanza a las cuatro maneras y a sus bajadas.** `D-57` punto 5 pide que los cuatro costos
  tengan la misma forma y que ninguno de oscuridad se diga como exclusión; la vara para leerlo
  es esta misma prueba. `CU-1` fue «Guardián de la llama» en el banco viejo y `REV-07` lo
  marcó por lo mismo: nombraba devoción, no temperamento.

### La regla de la ficha

Una escena no afirma nada sobre la banda ni sobre cómo es un recital de nadie, así que **no
lleva `RES-XX`** (`CTR-08.5` regla 5, intacta). Si para ser verdadera una escena necesita una
ficha, está afirmando algo —cómo se vive, qué se hace, qué pasó— y por eso mismo no es escena:
no entra.

`INV-150` trae situaciones con respaldo (`RES-156`..`RES-161`). Son **material para
`contenido`, no cita**: el propio informe dice que funcionan solo si se leen como situaciones
comunes (sección «Qué sirve para el juego», punto 2), y ninguna lleva su ficha en el ítem. Las
que más fácil se vuelven credencial son las que el informe trae como ritual de la banda —el
trapo con el nombre del pueblo, los brazos arriba al final, la carpa de la previa—: `revisor`
las mira primero. Del mismo informe quedan **vedadas** como escena Bulacio, Olavarría 2017, la
despedida de junio de 2026, la división entre el Indio y Skay (`RES-152`) y las bengalas.

### Quién vigila qué

| Qué | Quién | Cómo |
|---|---|---|
| Los siete vetos, sobre enunciado y opciones de cada ítem `listo` | `banco.test.ts`, «ningún enunciado ni opción cae en un veto de BR-36» | Automático. **Piso, no techo:** una palabra que no está en la lista no es una aprobación |
| Bulacio, Olavarría y Cromañón en sello, línea que canta, enunciado y opción | `src/data/_schema/dos-ejes.schema.json`, vía `esquemas.test.ts` | Automático |
| La vuelta sin «a pie», «caminando» ni «camino» | `banco.test.ts` | Automático |
| Una opción no delata su eje; sin marcas de género; ningún cierre más de tres veces y «¿Qué hacés?» pelado, nunca; las dos opciones no son la misma frase | `banco.test.ts` | Automático (guardas de `BR-17` y `CNT-09`, en el mismo archivo) |
| La noche en orden, todo ítem `listo` con momento, tres por celda y treinta en total, los veintiocho viejos retirados | `banco.test.ts` y `pisos.test.ts` | Automático |
| Largos: enunciado ≤ 14 palabras, opción ≤ 5 y ≤ 28 caracteres, nombre ≤ 26, bajada ≤ 36; sello ≤ 3, línea que canta ≤ 8 y sin «…» | `banco.test.ts` | Automático |
| Nombres de las maneras sin persona; cada `CU-n` con sus polos | `banco.test.ts` | Automático |
| Voz: anglicismos, folleto, infinitivos, etc., sobre todo el texto visible del banco | `voz.test.ts` | Automático |
| **Los cuatro lugares, ítem por ítem** | `revisor`, `REV-19` | **Lectura**, con veredicto por ítem y por lugar |
| **Ninguna opción más de adentro; el mismo orgullo; las dos pagan** | `revisor`, `REV-19` | **Lectura** («la prueba del que no fue») |
| **Los cuatro nombres y sus bajadas, con la misma vara** | `revisor`, `REV-19` | **Lectura** |
| **Patrones del conjunto** (abajo) | `revisor`, `REV-19`, adversarial | **Lectura** con el encargo «rompé», no «verificá» (`REV-06`, `REV-07`) |
| Que `VETOS` cubra el motivo | `revisor` propone la palabra, el hilo principal la agrega al test | Lectura |

**Pasar los tests no es entrar al banco.** Un ítem entra cuando los tests pasan **y**
`REV-19` lo leyó. El banco no se integra sin `REV-19` sobre el conjunto (`D-57`).

**Patrones del conjunto, lo que `REV-19` busca y ningún ítem muestra solo:**
- Una celda cuyas tres escenas son el mismo dilema con otro objeto.
- Un polo que paga siempre y otro que a veces confiesa un descuido.
- La opción «de adentro» cayendo siempre del mismo lado de un eje: si «luz» es siempre la de
  más entrega, el eje mide devoción.
- Una noche que cuenta una sola clase de gente (la que va con amigos, la que va en micro, la
  que entró): treinta escenas «limpias» pueden sumar una sola persona.

**Hueco conocido (2026-10-04).** Los vetos de `VETOS` solo recorren enunciado y opciones de
los ítems `listo`. **Ninguna máquina** recorre el sello, la línea que canta ni las bajadas
buscando el nombre de la banda (veto 1), y el schema mira Bulacio, Olavarría y Cromañón en
sello, línea, enunciado y opción pero **no en las bajadas**. El alcance de arriba los incluye:
hasta que el test los cubra, los lee `REV-19`. Quien lo cierra es el hilo principal (las
guardas son suyas, `D-57`, consecuencias).

### Qué pasa cuando un ítem no pasa

- Se reescribe o se retira con nota; el id no se recicla (`Docs/IDS.md`).
- Si una celda baja de tres, **la integración no cierra** (el test lo dice). No se compensa
  con otra celda ni se baja el piso en silencio.
- **El riesgo que veo.** La vuelta, por dos ejes, son seis escenas que no pueden usar caminar,
  ir solo, plata ni el cuerpo: es la celda más angosta. Si después de `REV-19` alguna celda no
  llega a tres, **no lo resuelvo yo**: lo escalo al usuario, por el hilo principal, con las
  dos salidas que veo —aceptar dos en esa celda, con la tercera noche repitiendo una sola
  escena de esa celda; o cambiar el momento, que reabre `D-57` punto 1— y `US-06` no cierra
  hasta que elija.

### Qué no hace esta regla

- No escribe escenas ni da ejemplos del banco nuevo (`contenido`). Los únicos ejemplos que
  cita son de ítems ya retirados.
- No fija la lista de palabras: es del test.
- No decide el sello ni la línea que canta de cada momento, ni el arte (`UX-36`).
- No toca `BR-17`.
- No ordena a nadie: nada acá mide quién es más ricotero. Es el criterio 3 de `US-06`
  aplicado al ítem.

**Verificación.** `producto` no ejecuta (`D-12`); lo corre el hilo principal o `revisor`:

```bash
node --test src/lib/dos-ejes/banco.test.ts src/lib/esquemas.test.ts src/lib/pisos.test.ts
rg -n "^## BR-36" Docs/PRODUCTO/PRD-alcance-v1.md
```

`banco.test.ts` y `pisos.test.ts` dan rojo mientras `src/data/dos-ejes.json` siga en v1: las
guardas se escribieron antes que el banco (`ARQ-schema-dos-ejes.md`, v2.9). Se ponen en verde
cuando entra `CNT-30`. Lo que ninguna máquina corre —los cuatro lugares, «más de adentro»,
el mismo orgullo— lo lee `REV-19`.

---

## BR-37 — «Esta noche» y «otra noche»: qué recuerda una visita, y qué no

**Aplica a:** `US-06` (criterio 6 y el rótulo del resultado). **Consume:** `D-57` (punto 6 y
las alternativas descartadas), `BR-17`, `US-06` criterio 3, `CTR-08` v2.5 (`vistos`), `D-56`,
`UX-01`, `src/lib/dos-ejes/partida.ts` y `src/scripts/partida-dos-ejes.ts`. **Motiva
(brief):** «El momento de uso» (sesiones de dos o tres minutos) y el supuesto confirmado de
«puntajes y rachas en `localStorage`», que acá se acota. **Fecha:** 2026-10-04.

**Qué resuelve.** Un test de cinco respuestas por eje es inestable, y `D-57` decidió no
repararlo sino decirlo. Esta regla fija cómo se dice («esta noche»), qué pasa cuando alguien
quiere otra («otra noche») y qué se descartó para estabilizarlo, con el porqué.

### Regla 1 — El resultado es de esta noche

- **Qué se promete.** Lo que salió es lo que salió **esta noche**; no dice qué es la persona.
  **Ninguna superficie que muestre el resultado** —la pantalla, la tarjeta, la postal, el texto
  que viaja con el enlace— dice «sos X», «eres», «naciste», «tu verdadero», ni un «siempre»
  que defina a la persona. El verbo del sitio es *salir*: «te salió», «me salió», «le salió»,
  en pasado y de una ocasión. Las bajadas cuentan lo que se hace y no lo que se es (la forma,
  no el texto, que es de `contenido`: «llegás» y no «sos de los que llegan»). La pregunta del
  título («¿Qué tipo de ricotero sos?») se queda: una pregunta no es una sentencia.
- **Dónde lo dice la pantalla.** En el rótulo del resultado: `D-57` fija «ESTA NOCHE TE SALIÓ»
  en lugar de «Diste con esto»; el texto final de todas las superficies es de `contenido`
  (`CNT-30`). Las superficies sin lugar para un rótulo entero —la tarjeta, el título de la
  postal— llevan «esta noche» en el verbo, no en una frase aparte.
- **Por qué.**
  1. **Es la verdad sobre el instrumento.** Con cinco respuestas por eje, un 3 a 2 se da
     vuelta con una sola; el relevamiento que sostiene `D-57` midió que la segunda partida
     repetía la mitad de las preguntas y que, con una inclinación de 60 a 40 en un eje, la
     siguiente cae muy seguido en otro cuadrante. Quien juega dos veces y saca dos distintas
     concluye —con razón— que el test no lo estaba leyendo (`REV-07`, defecto 3). La salida
     honesta no es esconderlo detrás de «sos X»: es decirlo una vez, en el rótulo.
  2. **Lo vuelve parte del juego y no un defecto.** Otra noche es otra salida, otra manera.
     Eso no es una mala medición: es lo que el juego dice que es.
  3. **Sin esencia no hay jerarquía.** El criterio 3 de `US-06` pide que ningún cuadrante sea
     «el verdadero». Una esencia es lo que pide el «más». Una ocasión no.
- **Qué no hace.** No promete que otra noche dé otra manera, ni que dé la misma. No pide
  disculpas por la inestabilidad ni agrega letra chica de «los resultados pueden variar»: la
  nombra el rótulo, una vez, en registro 3 seco.

### Regla 2 — Otra noche sirve escenas que no salieron

- **El botón.** «Empezá otra noche» (voseo, `D-17`), el mismo en las cuatro maneras. No
  «Probá de nuevo» —suena a haber fallado, y acá no hay nada que fallar (criterio 3)— ni
  «Repetí», porque lo que viene no es lo mismo.
- **La promesa.** En la misma visita, en cada momento y cada eje, la noche nueva sirve una
  escena **que no salió antes**. Con tres escenas por celda (el piso de `US-06`), **las
  noches 1, 2 y 3 de una visita no repiten ninguna escena**. La cuarta puede repetir: las
  celdas se agotaron y el motor toma de todas, **sin aviso y sin error** (`CTR-08` v2.5). Una
  celda con más de tres tiene más noches frescas, celda por celda.
- **Dentro de una noche no se repite nada:** cada ítem vive en una sola celda.
- **Qué cuenta como «salió».** Una escena sale cuando se sirve la noche. «Empezá otra noche»
  solo existe en el resultado, así que las diez ya se mostraron: no hay escenas «quemadas sin
  verse» por abandonar a mitad. «Volvé a la anterior» muestra de nuevo la misma escena y no
  consume otra.
- **Qué no se cuenta en pantalla.** Nada dice «noche 2», «te quedan N escenas», «escena
  nueva» ni «ya viste todas». Un contador de escenas gastadas vuelve el juego una colección que
  se completa, y es un número que premia a quien jugó más: lo que el criterio 3 de `US-06` no
  deja (y `D-56` y `UX-01` ya dicen que el sitio no muestra números de la gente). El folio
  «3 de 10» sigue: es orientación dentro de la noche, no medición.
- **El resultado de otra noche reemplaza al anterior.** Sin «mejor de tres», sin historial,
  sin comparación entre noches. Quien quiera compararse con su noche anterior lo hace solo,
  mirando las cuatro maneras, que están todas a la vista.

### Regla 3 — Nada se acumula entre noches, y nada se guarda entre visitas

- **La visita es la página abierta.** La isla recuerda qué escenas sirvió **en memoria**
  (`vistos`). Se pierde al recargar o al entrar por otra ruta —de una postal al juego, por
  ejemplo—. **Una recarga es otra visita** y puede traer escenas que ya salieron: no es un
  defecto.
- **Ni `localStorage`, ni cookie, ni nada que sobreviva a la pestaña.** Tres razones de
  producto:
  1. **No compra nada.** Con tres por celda la cuarta noche repite igual (`CTR-08` v2.5,
     alternativa 3): persistir solo mueve la repetición a otro día.
  2. **Acá no hay puntaje que guardar.** El brief confirmó, por omisión, «puntajes y rachas en
     `localStorage`» para los juegos que tienen puntaje y racha; este no tiene ninguno, por el
     criterio 3. Guardar los ids de las escenas vistas sería inventar un estado sin dueño: ¿qué
     se le muestra a quien lo tiene?
  3. **Un historial de escenas es la mitad de un historial de resultados.** El paso siguiente
     es «tus noches anteriores», y de ahí un conteo: lo que el tipo `Resultado` no puede
     cargar a propósito.
- **Si algún día se quiere recordar entre visitas**, es una enmienda de esta regla, no un
  cambio de parámetro del motor (`CTR-08` v2.5 lo deja dicho). Y tendría que contestar primero
  qué ve la persona con esa memoria.

### Descartado — acumular entre noches («Sumá otra tanda»)

`D-57` descartó, entre otras, esta idea: «Sumá otra tanda» conservaba las respuestas y las
sumaba (cinco por eje, luego nueve, luego trece) para que la identidad se afirmara con cada
tanda. **No se descarta por el empate**: cinco, nueve y trece siguen siendo impares. Se
descarta por esto:

1. **Cambia qué es el resultado.** «Esta noche te salió» pasaría a ser «tu promedio»: ya no
   cuenta lo que pasó, calcula lo que sos. Es lo que la regla 1 evita, y esconde la
   inestabilidad detrás de una cifra más grande en vez de decirla.
2. **Introduce grados.** Quien jugó una tanda tendría una manera «provisoria» y quien jugó tres
   una «firme»: un grado de certeza por cantidad jugada. `US-06` prohíbe los grados dentro de un
   cuadrante porque un grado se lee como más o menos ricotero. Acá el grado sería **cuánto
   jugó**, que es peor: premia el tiempo libre, y este sitio es de quien tiene dos minutos.
3. **Exige guardar números entre noches.** Acumular es contar respuestas por eje, y `Resultado`
   no lleva números a propósito (`US-06` criterio 3, `CTR-08.6`). Habría que abrir un canal de
   conteo en la isla: construir el contador que la regla no quiere.
4. **Rompe la sesión y redefine «partida».** A la tercera tanda son 26 preguntas contra los dos
   o tres minutos del brief («todo lo que exija más está mal cortado», `CLAUDE.md`), y el
   conteo impar de `BR-17` regla 3 es «dentro de una partida»: la partida pasaría a ser la
   suma de las tandas.

También quedó afuera **«siete por eje»**: estabiliza más, a cambio de cuatro preguntas más, y
rompe los cinco momentos (`D-57`). La inestabilidad se asume y se dice (regla 1).

### Quién vigila qué

- **El motor.** `src/lib/dos-ejes/partida.test.ts`: «otra noche no repite escenas mientras
  haya frescas (`BR-37`)» (tres noches seguidas, con un banco sintético y con el real; la cuarta
  no falla) y «ninguna noche repite un ítem». Automático.
- **Lo que hace posible la promesa.** Tres por celda: `banco.test.ts` y `pisos.test.ts`.
  Automático.
- **Que la isla pasa `vistos` y no guarda nada.** Hoy **ningún test lo mira.**
  `partida-dos-ejes.ts` declara `const vistos = new Set<string>()` y se lo pasa al motor en
  `empezar()`; el único `localStorage` del archivo es el comentario que dice que no se usa.
  **Hueco conocido:** si alguien reemplaza el `Set` por `localStorage`, nada falla. Propongo una
  guarda de una línea —el archivo de la isla no contiene `localStorage`, `sessionStorage` ni
  `document.cookie`—, del tipo de la que ya existe en `src/lib/correccion/armar.test.ts`. Es
  del hilo principal.
- **Que ninguna superficie dice «sos X».** Ningún test: `voz.test.ts` mira la voz
  (anglicismos, folleto, infinitivos…), no la esencia. Lo lee `revisor` en `REV-19` sobre la
  pantalla, la tarjeta, la postal, el texto para compartir y las bajadas. Hoy `copy.ts` ya dice
  «Esta noche te salió», «Empezá otra noche», «Me salió» y «le salió».

### Qué no hace esta regla

No fija el copy (`contenido`), ni diseña el botón, la hoja o la grilla (`UX-36`), ni toca el
motor (`arquitectura`). No cambia el título del juego: es la puerta de `D-51` y no es de esta
regla. No decide ninguna analítica de noches jugadas: `D-56` cuenta entradas por pantalla y
nada más.

**Verificación.** `producto` no ejecuta (`D-12`); lo corre el hilo principal o `revisor`:

```bash
node --test src/lib/dos-ejes/partida.test.ts src/lib/dos-ejes/banco.test.ts
rg -n "^## BR-37" Docs/PRODUCTO/PRD-alcance-v1.md
rg -n "localStorage|sessionStorage|document\.cookie" src/scripts/partida-dos-ejes.ts
```

El último comando tiene que devolver **una sola línea**, la del comentario que dice que no se
usa (hoy la 65). Si devuelve otra, la regla 3 se rompió.

---

## BR-38 — La noche ricotera: la escena es la ricotera entera, la opción es de quien juega

**Aplica a:** `US-06` (criterio 7 y la enmienda del 2026-10-04 por `D-59`), el banco de la noche
(`CNT-31`) y su revisión (`REV-20`). **Consume:** `D-59` (entera, con su síntesis), `D-57` (puntos
2 y 3, y la enmienda 7), `BR-17`, `BR-36`, `CNT-30`, `INV-172` (`RES-172`..`RES-194`), `INV-150`,
`D-14`, `D-09`, `CLAUDE.md` §6 y `src/lib/dos-ejes/banco.test.ts`. **Motiva (brief):** el criterio
no negociable 3, «sin muro de entrada», y «La postura: molinetes abiertos»; «Idioma y tono» (la
jerga va en el tono, no en la barrera: acá, lo ricotero va en la escena y no en la opción); y el
riesgo 3, «mitología repetida como hecho», porque casi todo `INV-172` es leyenda sin abrir.
**Fecha:** 2026-10-04.

**Qué resuelve.** `D-59` le devolvió a la noche lo que `D-57` punto 2 y los vetos 1, 3 y 4 de
`BR-36` le habían sacado: la previa en la esquina, la birra, el porro, el barro, el reviente, la
misa; y la familia, los amigos y el amor en la misma noche. *«Lo primero no puede faltar»*, dijo
el usuario. Abrirla sin una frontera cuesta algo preciso: **el que no toma ni fuma queda afuera de
su propia noche**, que es exactamente el molinete que `CLAUDE.md` §6 no deja cerrar. Esta regla
dice dónde pasa la frontera. Lo que se **cuenta** puede ser todo. Lo que se **elige** no le puede
pedir a quien juega que consuma, que haya pagado ni que sea de adentro.

### La regla, en una línea

> **La escena es la ricotera entera. La opción es de quien juega: elige cómo se mueve, nunca si
> consume, ni si pagó, ni cuánto sabe de la banda.**

La de `BR-36` sigue al lado, palabra por palabra: *una escena entra al banco si cualquiera puede
contestarla desde su propia vida y las dos opciones se dicen con el mismo orgullo.* La nueva es su
versión para lo sucio: **la escena se reconoce; la opción no se exige.**

### Qué puede decir cada lugar

*Escena* es todo lo que la gente lee de la noche menos lo que toca: enunciado, sello del momento,
línea que canta y bajadas de las cuatro maneras. *Opción* es lo que toca.

| | La escena | Una opción |
|---|---|---|
| Lo que se toma o se fuma: la previa, el escabio, la birra, el vino, el fernet, el porro, el humo | Sí. En las bajadas, como lugar y no como lo que hace quien cayó ahí | Puede estar, **nunca de un solo lado**, y nunca como lo que hace quien juega (quinto lugar) |
| Lo que se come y se paga: el chori, el pancho, el puesto, el micro, la gente sin entrada | Sí, como lo que hay | No: ninguna dice que compraste, pagaste o tenés entrada, ni toma un pasaje |
| La merca | Solo en el enunciado, como paisaje | Nunca |
| El barro, la mugre, el reviente, la madrugada, el frío | Sí | Sí, sin exigir un cuerpo capaz (veto 5) |
| La banda, los Redondos, la misa, los trapos, el pogo, «ricotero» | Sí | Nunca: en una opción puntúan quién es de adentro |
| La familia, los amigos, el amor | Sí, **de la gente de la escena** | Amigos, sí; sin parentesco ni pareja propia (`D-57` enmienda 7) |
| Las personas de la banda, y sus temas por su título | Nunca | Nunca |
| Tragedias, policía, seguridad, épica y psicodelia | Nunca | Nunca |

### Lo que reemplaza de `BR-36`, y lo que deja igual

**Veto 1, la banda por su nombre.**
- *Entra a la escena:* la banda, los Redondos, la misa, los trapos, el pogo adelante y «ricotero»
  (`D-59` puntos 1 y 5). Nunca para puntuar: «la noche más ricotera» es una credencial.
- *No entra a una opción:* banda, Redondos, misa, ricotero. En una opción puntúan quién es más de
  adentro, que es la regla de `BR-36` en una línea.
- *Sigue vedado en toda la noche:* **las personas** (el Indio, Skay, Poli): el Indio murió el 5 de
  junio y una escena con él en el escenario es un velorio aunque no lo diga (`D-59` punto 5). Y
  **los temas por su título**, por lectura de `producto` (`D-59` no los trae): un título es un
  código, y `BR-17` dice que ninguna pregunta pide saber de la banda; la escena dice «un tema».
  Ninguna máquina lo cuenta: lo lee `REV-20`.

**Veto 3, plata.**
- *Entra a la escena:* lo que se paga (el chori, la birra, el micro, el puesto) y la gente que no
  pudo pagar la entrada (`D-59` punto 4; `RES-154`), dicha sin lástima y sin orgullo.
- *No entra a una opción:* nada que diga que compraste, pagaste, tenés entrada o tomaste un pasaje
  (`VETOS_DE_LAS_OPCIONES`: «plata» y «vehículo y pasaje»).
- *Sigue igual de estricto en la escena:* no da por hecho que quien juega pagó ni dice cómo
  entró. Que haya un puesto no es que hayas comprado (la prueba «sin plata», más abajo).

**Veto 4, alcohol, drogas y policía.** Reemplazado, **salvo la policía**.
- *Entra a la escena:* todo lo que se toma y se fuma, y el reviente, sin glamour y sin sermón: ni
  lo celebra ni lo reprocha, dice que está (`D-59` puntos 1 y 3).
- *En una opción:* puede estar, nunca de un solo lado, y quien no consume tiene que poder contestar
  de verdad: el quinto lugar.
- *La merca:* paisaje, nunca elección (apartado siguiente).
- ***La policía sigue fuera de toda la noche.*** `D-59` no la pidió, y la guarda la mantiene en
  `VETOS_DE_LA_NOCHE` («que no pidió nadie y parte a la gente por historia propia»). Es lo único
  del veto 4 que no cambia. Si el usuario la quiere, se enmienda esta línea y la lista, y nada más.

**Lo que deja igual**, con `D-59` encima:
- **Veto 2, tragedias.** Entero. El barro sí, Olavarría no; el humo sí, las bengalas no; la misa
  sí, la despedida de junio no. Nada de la escena se lee como esa noche: sin fecha, sin lugar, sin
  «la noche que…», sin barro puesto al lado de lo que lo evoca (`RES-183`, `RES-188`). Un trapo no
  lleva el nombre de nadie que ya no está (`RES-193`).
- **Vetos 5, 6 y 7.** Cuerpo y multitud (el pogo suena, nadie elige meterse), seguridad (sin dedo
  ni desconocidos), épica y psicodelia. Sin cambios de fondo.
- **La regla en una línea** de `BR-36`, y la regla de la ficha (más abajo).

### La merca: paisaje, nunca elección

- **Dónde.** En el enunciado, como algo que pasa alrededor y no es de quien juega. Dice que está:
  sin glamour, sin sermón, sin cantidad ni precio, y sin atribuirla a un tema, a una persona de la
  banda ni a una fecha (`RES-181` la deja leyenda y sin fuente).
- **Dónde no.** En ninguna opción (`VETOS_DE_LAS_OPCIONES`, «la merca como elección»). Tampoco en el
  nombre ni en la bajada de una manera, porque una manera con merca adentro es una manera de ser;
  ni en el sello ni en la línea que canta, porque un momento no se titula con una droga. Fuera de
  las opciones **ninguna máquina lo cuenta** hoy (hueco 2).
- **No cuenta para lo sucio** del piso de más abajo: si la merca sirviera para cumplirlo, pasaría
  de paisaje a protagonista.
- **Por qué.** `D-59` punto 3: el sitio no tiene muro de edad ni de entrada, y una opción que se
  elige convierte el consumo en una manera de ser. El usuario pidió que esté, *«hasta cocaína debe
  ser parte del recital»*, no que sea algo que uno hace.
- **Si el usuario la quiere también como opción**, se cambia esta línea y la lista, y nada más
  (`D-59` punto 3).

### El quinto lugar: el que no toma ni fuma

`D-59` punto 2 suma un quinto lugar a la prueba de `D-57` punto 3, y con eso la prueba de `BR-36`
pasa de cuatro lugares a cinco. Mismo método: **por ítem, no por banco**, sobre el texto tal como
está escrito, y pasa si pasa los cinco.

- **El que no toma ni fuma.** *¿Puede elegir cualquiera de las dos, tal como están escritas,
  alguien que no toma ni fuma —por salud, por los hijos, porque dejó, porque maneja, por lo que
  sea— y decirla en voz alta en una previa sin que suene a confesión ni a mérito?* Falla de seis
  formas:
  1. **Una opción toma o fuma y la otra no.** El eje deja de medir cómo se mueve alguien y mide si
     toma; quien no toma cae siempre del mismo polo. *La guarda lo cuenta.*
  2. **Las dos nombran lo que se toma o se fuma, pero una lo acepta y la otra lo rechaza.** Es el
     caso 1 con las palabras repartidas. *La guarda no lo ve:* cuenta que la palabra esté de los
     dos lados, no lo que cada lado hace con ella.
  3. **El verbo de las dos es consumir.** Parejas, sí, pero quien no consume no puede decir
     ninguna con verdad. *La guarda no lo ve.*
  4. **Una opción es la confesión o la medalla del que no consume** («no tomo»). El sitio ni lo
     disculpa ni lo premia. `RES-182` sugería «no tomo, voy por el tema» como opción: no entra a
     una opción, porque separa los polos por el consumo (`D-59` punto 2). Puede vivir como **gente
     de la escena**: quien no toma y va por los temas está en la noche tanto como la ronda.
  5. **El enunciado pone el vaso o el porro en la mano de quien juega** y las opciones deciden qué
     hacer con eso. La escena puede tener la ronda, el humo y la birra de otro; no puede hacer
     que quien juega ya esté consumiendo.
  6. **Un momento donde la única manera de estar con la gente pasa por consumir.** Es la enmienda
     7 con otra falta: si quien no consume no tiene ninguna luz posible en un momento, es un
     defecto. *Se mira sobre el banco entero, no ítem por ítem.*
- **Se arregla** sacando el consumo de la opción y dejándolo en el enunciado como lo que hay. Las
  opciones dicen qué hace quien juega con lo que no pasa por la boca: dónde se ubica, qué mira,
  qué canta, si se suma a la ronda o se queda con lo propio. El modelo es el de `D-59`: *«ir a
  escabiar o no»* se juega con la previa en la escena y las dos opciones **de la previa**. Sumarse
  a la ronda no obliga a tomar.
- **Alcanza a las cuatro maneras y a sus bajadas**, como la prueba de «más de adentro»: la bajada
  puede traer la ronda o el humo como lugar, y nunca dice que quien cayó ahí toma o fuma.
- **Cómo se lee.** `REV-20`, con el veredicto escrito por ítem: la tabla de treinta filas pasa a
  **cinco columnas**. En las cuatro primeras un «pasa» es una casilla; en el quinto lugar lleva
  *dónde aparece lo que se toma o se fuma (enunciado, opción A, opción B) y quién lo hace (quien
  juega, otro, nadie)*, o «no aparece». Lo que la guarda no ve no puede ser una casilla. Un ítem
  que falla una vez se reescribe o se retira: no lo compensan los otros veintinueve.
- **Lo que no es.** No prohíbe que el consumo aparezca: `D-59` pide que esté. Prohíbe que sea lo
  que decide.

### Los otros cuatro lugares, con `D-59` encima

- **Nunca fui.** El enunciado ahora puede traer «la misa», «los trapos» o «el pogo». Que estén no
  es el problema; el problema es que la escena solo se entienda si se sabe qué son. La ayuda de
  lectura de `BR-36` («cambiá "recital" por otra salida») ya no sirve, porque la noche es ésta, y
  se reemplaza por **tapá la palabra del código**: si la escena se sigue entendiendo, la palabra
  es paisaje; si no, estaba haciendo el trabajo del enunciado. Reconocible, no exigido.
- **Sin plata.** Sigue entera, con la escena trayendo ahora cosas que cuestan. Se mira que el
  enunciado no dé la plata por hecha y que ninguna opción tenga como verbo comprar, o comer algo
  que se compra: eso la guarda no lo ve si la palabra «comprar» no está.
- **Silla de ruedas.** Sigue entera. El pogo suena y nadie elige meterse; el barro puede estar y
  ninguna opción exige vadearlo.
- **Volviendo de noche sin compañía.** Sigue entera: la vuelta no tiene trayecto, y la madrugada,
  el frío y la mugre pueden estar en el enunciado, nunca como camino.

### Ninguna opción es «más de adentro»: lo que suma `D-59`

`BR-36` listó las marcas de «más de adentro» (sacrificio, devoción, entrega total, palabra del
código). Con la noche ricotera aparecen dos más, y `REV-20` las mira primero:
- **La opción que más aguanta lo sucio.** La del reviente, la del barro hasta el final, la que no
  se va de la ronda. Se lee como la del que es de verdad, igual que «salir hecho pomada» en
  `EJ-001`. Y su espejo: la más limpia se lee como la del turista.
- **«Ricotero» o la banda dichos para puntuar**, en el enunciado («la noche más ricotera», «como
  un ricotero de verdad»). En la escena la palabra puede estar; en cuanto califica a alguien, es
  credencial.

### Lo sucio no puede faltar

- **El piso.** En cada celda (momento × eje), al menos **una de las tres escenas** trae lo sucio en
  el enunciado: el barro, la mugre, el humo, lo que se toma o se fuma, el reviente. Diez celdas,
  diez escenas como mínimo sobre treinta. Es `D-59` punto 1 en número: *«cada momento lleva su
  parte sucia, no solo la tierna»*.
- **Por qué por celda, y una de tres.** El piso de la noche ya se cuenta por celda, y una por celda
  reparte lo sucio entre los cinco momentos sin elegir cuáles. Con el sorteo parejo (`CTR-08`
  v2.5), una noche trae en promedio tres o cuatro escenas sucias de las diez, y menos de una noche
  de cada cincuenta sale sin ninguna. **No garantiza que cada momento de cada noche lo tenga**: lo
  garantiza el banco, y la probabilidad hace el resto. Garantizarlo por noche pediría celdas enteras
  sucias (quince de treinta), y la noche pasaría a ser solo reviente.
- **Lo tierno no se cuenta, se lee.** `REV-20` mira que la noche tenga las dos clases de gente (la
  familia, los amigos y el amor, y lo sucio) y que ninguna sea la única: es el patrón de «una sola
  clase de gente» de `BR-36`, con otro eje. Una noche toda ternura no suena ricotera. Una toda
  reviente, tampoco.
- **La prueba.** *Tapá el título y los sellos: si lo que queda podría ser un casamiento, la noche no
  suena ricotera. Después tapá la palabra del código: si ya no se entiende, es credencial.*
  Reconocible y no exigido, las dos a la vez.
- **Quién lo cuenta.** Hoy, nadie (hueco 1).

### La escena no afirma

La regla de la ficha de `BR-36` sigue entera: una escena no afirma nada, así que no lleva `RES-XX`.
Importa más ahora, porque la noche habla de una banda real y `INV-172` es casi toda leyenda que
nadie abrió (`RES-172`..`RES-194`): es material, no cita. Una escena puede *tener* barro, humo, una
ronda, un trapo. No dice «en los recitales se…», ni cifras de recitales (público, grados,
kilómetros, precios), ni fechas, ni lugares con nombre (Gualeguaychú, Mendoza, Tandil), ni lo que
dijo alguien, ni «se cuenta que». Es una noche en presente. Así `D-14` se cumple sin rótulo, porque
no hay nada que rotular. Si para ser verdadera una escena necesita una ficha, es dato y no entra.

### La gente de la noche

- **La familia y el amor son de la gente de la escena**: un padre que le pasa la canción a su hija,
  una pareja que se conoció en una misa. No son de quien juega: ninguna opción nombra un parentesco
  ni una pareja propia (guarda, `D-57` enmienda 7), y el enunciado tampoco le asigna una a quien
  juega.
- **Un chico y lo que se toma o se fuma no comparten escena.** El padre y su hija están en la
  escena de la canción, no en la de la ronda. Es lectura de `producto`, por la misma razón del
  veto 6; la lee `REV-20`.
- **Sin muro de edad ni aviso que se interponga** (`D-09`, y la última línea de `D-59`): no se le
  pide nada a quien juega para entrar. Un rótulo que `experiencia` quiera proponer no puede ser
  una condición para jugar.

### Quién vigila qué

| Qué | Quién | Cómo |
|---|---|---|
| Tragedias, personas de la banda, policía, seguridad, épica y psicodelia, en enunciado, opciones, sello, línea que canta y bajadas | `banco.test.ts`: «ningún enunciado ni opción cae en un veto de la noche (BR-36, D-59)» y «los sellos, las líneas que cantan y las bajadas tampoco (los vetos de la noche valen para todo lo que se lee)», sobre `VETOS_DE_LA_NOCHE` | Automático. **Piso, no techo** |
| Plata, vehículo y pasaje, cuerpo y multitud, la banda como credencial y la merca, en las opciones | `banco.test.ts`: «ninguna opción cae en un veto de las opciones (BR-36, D-59)», sobre `VETOS_DE_LAS_OPCIONES` | Automático. **Solo opciones** |
| Lo que se toma o se fuma no está de un solo lado | `banco.test.ts`: «lo que se toma o se fuma nunca separa los polos (D-59)», sobre `CONSUMO`, y «la guarda del consumo sabe ver: una birra de un solo lado la marca» | Automático. **Cuenta la palabra, no lo que la opción hace con ella** (casos 2 y 3 del quinto lugar) |
| Sin parentesco ni pareja propia en una opción | `banco.test.ts`: «ninguna opción nombra un parentesco ni una pareja propia (D-57 enmienda 7, D-59)» | Automático. Solo opciones |
| La vuelta sin «a pie» ni «caminando» | `banco.test.ts`: «a la vuelta nadie vuelve a pie: de noche es seguridad, no temperamento» | Automático |
| La noche en orden, ítems con momento, tres por celda y treinta en total, retirados y ids | `banco.test.ts`: «la noche tiene sus cinco momentos…», «cada ítem listo es de un momento de la noche», «cada celda momento × eje tiene al menos tres ítems listos», «los ids no se repiten y los retirados se quedan donde estaban»; y `pisos.test.ts` | Automático. No cambia |
| Largos, nombres y polos | `banco.test.ts`: «el sello del momento es seco…», «enunciados y opciones entran en la hoja», «las cuatro maneras entran en la tarjeta», «cada CU-n conserva sus polos…», «los nombres no tienen persona…» | Automático. No cambia |
| Una opción no delata su eje; ninguna palabra es firma de un polo; sin género; cierres; las dos opciones no son la misma frase | `banco.test.ts`: «ninguna opción delata su eje…», «ninguna opción dice la palabra con la que el resultado traduce su polo», «ninguna palabra es la firma de un polo», «ninguna opción apunta al nombre de una manera», «ninguna opción en primera persona le pone género…», «los enunciados no cierran todos igual», «las dos opciones de un ítem no son la misma frase…» | Automático. No cambia |
| Voz; Bulacio, Olavarría y Cromañón en sello, línea, enunciado y opción | `voz.test.ts`; el schema, vía `esquemas.test.ts` | Automático |
| **Los cinco lugares, ítem por ítem**, con el quinto escrito (dónde aparece el consumo y quién lo hace) | `revisor`, `REV-20` | **Lectura**, con veredicto por ítem y por lugar |
| **Ninguna opción más de adentro** (con las dos marcas de `D-59`), el mismo orgullo, las dos pagan | `revisor`, `REV-20` | **Lectura** («la prueba del que no fue») |
| **Los cuatro nombres y sus bajadas**: quinto lugar, sin merca, sin «tomás» ni «fumás» | `revisor`, `REV-20` | **Lectura** |
| **Lo sucio por celda, lo tierno, y si la noche suena ricotera** (la prueba de «tapá el título») | `revisor`, `REV-20` | **Lectura** |
| **La merca** solo en el enunciado y sin glamour ni sermón; **la escena sin cifras, fechas ni lugares con nombre**; los temas por su título; «ricotero» que puntúa; un chico junto al consumo | `revisor`, `REV-20` | **Lectura** |
| **Patrones del conjunto** de `BR-36`, más uno: lo sucio como firma de un polo (si «caos» es siempre la del reviente, el eje mide cuánto aguantás, no cómo te movés) | `revisor`, `REV-20`, adversarial | **Lectura** con el encargo «rompé», no «verificá» |
| Que las listas cubran el motivo | `revisor` propone la palabra, el hilo principal la agrega al test | Lectura |

**Pasar los tests no es entrar al banco.** Un ítem entra cuando los tests pasan **y** `REV-20` lo
leyó con los cinco lugares. El banco no se integra sin esa lectura sobre el conjunto.

**Huecos conocidos (2026-10-04).** Quien los cierra es el hilo principal (las guardas son suyas,
`D-57`, consecuencias); hasta entonces los lee `REV-20`.
1. **Lo sucio por celda:** ningún test lo cuenta. Propongo un test «cada celda trae lo sucio»,
   con una lista de palabras que escriba `contenido`, sin la merca.
2. **La merca fuera de las opciones:** `VETOS_DE_LAS_OPCIONES` solo recorre opciones. Falta
   recorrer nombre y bajada de las maneras, sello y línea que canta con la misma lista.
3. **El consumo como verbo:** `CONSUMO` cuenta la palabra, no el verbo. El caso 3 del quinto lugar
   se cierra por palabras: una lista de verbos en primera persona de lo que se toma y se fuma,
   vedada en opciones y en bajadas (que hoy nadie recorre buscando consumo). El caso 2 solo se lee.
4. **«Ricotero» y la banda para puntuar, en un enunciado:** la lista de la banda como credencial
   solo mira opciones.
5. **Lugares con nombre y cifras de recitales:** en toda la noche solo Olavarría está en una lista.
6. **Un chico junto a lo que se toma o se fuma, y los temas por su título:** nada los mira.

### Qué pasa cuando un ítem no pasa

- Se reescribe o se retira con nota; el id no se recicla (`Docs/IDS.md`). Si una celda baja de
  tres, la integración no cierra, igual que en `BR-36`.
- **El riesgo que veo.** El quinto lugar le saca a las opciones el verbo de consumir y el piso le
  exige al enunciado traer lo sucio. La celda más angosta sigue siendo la vuelta (sin trayecto, sin
  plata, sin cuerpo, sin consumo como verbo), y la previa pierde su dilema más fácil, la birra. Si
  después de `REV-20` alguna celda no llega a tres escenas con una sucia, **no lo resuelvo yo**: lo
  escalo al usuario, por el hilo principal, con la salida que veo, que es pasar el piso de lo sucio
  de «una por celda» a «dos por momento». El piso de 30 y los tres por celda no se tocan.

### Qué no hace esta regla

- No escribe escenas ni da ejemplos del banco nuevo (`contenido`, `CNT-31`): los únicos textos que
  cita son de `banco.test.ts`, de `D-59` y de `INV-172`.
- No fija las listas de palabras: viven en el test, y si lista y motivo se contradicen, manda el
  motivo (`BR-36`).
- No toca `BR-17`, `BR-37`, el piso (30, tres por celda) ni los cuatro nombres de las maneras. No
  decide arte ni copy.
- No pide ninguna ficha `RES-XX` nueva.
- No dice si la noche suena ricotera: lo lee `REV-20`, con la prueba de arriba.

**Lo que esto cuesta, dicho.** Treinta escenas por cinco lugares, y el quinto es el que la máquina
ve peor: cuenta una palabra y la decisión está en el verbo. Se acepta, como se aceptó con `REV-19`.

**Verificación.** `producto` no ejecuta (`D-12`); lo corre el hilo principal o `revisor`:

```bash
node --test src/lib/dos-ejes/banco.test.ts src/lib/esquemas.test.ts src/lib/pisos.test.ts src/lib/voz.test.ts
rg -n "^## BR-38" Docs/PRODUCTO/PRD-alcance-v1.md
rg -n "^[134]\. \*\*\[REEMPLAZADO por BR-38" Docs/PRODUCTO/PRD-alcance-v1.md
```

El último tiene que devolver **tres líneas**, los vetos 1, 3 y 4 de `BR-36`. Lo que ningún
comando corre —los cinco lugares, «más de adentro», lo sucio por celda, la merca— lo lee `REV-20`.

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
