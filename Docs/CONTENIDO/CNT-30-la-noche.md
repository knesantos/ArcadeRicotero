# CNT-30 — La noche: el banco, las cuatro maneras y todo lo que se lee en "¿Qué tipo de ricotero sos?"

- **Rol dueño:** `contenido`
- **Fecha:** 2026-10-04, ciclo 18.
- **Estado:** entrega completa, **con las vueltas 1 y 2 de arreglos aplicadas el 2026-10-04**
  (un verificador adversarial leyó el banco dos veces y encontró defectos de lectura que ninguna
  guarda ve; el §10 lista los de la vuelta 1 y el §11 los de la vuelta 2, uno por uno, con lo que
  se hizo. La vuelta 2 además corrió contra `banco.test.ts` tal como quedó en `661bfb9`, con sus
  guardas de traducción de los polos y de firma de un polo, y de ahí salió la mitad del trabajo).
  Reemplaza el banco de `CNT-09` (los 20 ítems vigentes pasan a `retirado`, ninguno se borra) y
  suma lo que `CNT-26` §1 y §2.3 dejó pendiente. **Las cadenas de pantalla del §6 son la versión
  que vale**: `src/lib/dos-ejes/copy.ts` ya tiene casi todas (el hilo principal pegó
  `POLOS.oscuridad`, `PANTALLA_0.subtitulo` y el molde de `CONTRASTE` de `CNT-29`) y el §6 dice
  fila por fila qué confirma y qué cambia. Queda pendiente un solo texto, `LUGARES.dosEjes`
  (§6.2 y §6.4), en `Docs/SUGERENCIAS/CNT-para-hilo-principal-vuelta-2-dos-ejes.md`.
- **Consume:** `D-57` (entera), `US-06`, `BR-17`, `BR-36` y `BR-37` (los escribe `producto` en este
  ciclo; apliqué la lista de vetos que ya vigila `banco.test.ts`, que es su traducción a máquina),
  `CNT-09`, `CNT-02`, `CNT-26`, `REV-07`, `D-14`, `D-17`, `D-21`, `D-33`, `RES-150`..`RES-171`
  (`INV-150`), `.claude/rules/voz-ricotera.md`, `.claude/rules/contenido-json.md`,
  `src/lib/dos-ejes/banco.test.ts` (línea por línea), `src/lib/voz.test.ts`.
- **Produce:** `src/data/dos-ejes.json` versión 2 de `CTR-08` — 5 `momentos`, 4 `cuadrantes`
  con nombres de `D-57` y bajadas nuevas, 28 ítems viejos (`EJ-001`..`EJ-028`, todos `retirado`)
  y **30 ítems nuevos** (`EJ-029`..`EJ-058`, todos `listo`, tres por celda). IDs nuevos de
  este documento: `EJ-029`..`EJ-058`.
- **No hago acá:** el schema (`CTR-08` v2 es de `arquitectura` y ya está en
  `src/data/_schema/dos-ejes.schema.json`, `contratoVersion: 2`; el JSON de este ciclo valida
  contra él), el motor, la isla ni el taller de tarjetas.
- **Ninguna ficha `RES-XX` pendiente.** El banco no afirma nada de la banda, así que no tiene
  qué fichar (`CTR-08.5` regla 5). **Ninguna escena lleva respaldo de `INV-150`**: la versión
  inicial tenía el micro que se detiene en la ruta (`RES-160`) y la vuelta 1 lo sacó (§10, punto 1).

## 1. Por qué la noche

`REV-07` encontró que el banco viejo era un test de revista con el título puesto: plantas,
muebles, un asado, una playa. `CNT-09` le dejó la pregunta a `producto`, nadie la contestó y el
juego siguió dos ciclos con veinte escenas que podían vivir en cualquier sitio. `D-57` la contesta
con una sola decisión: **la partida es una noche de recital en cinco momentos**, y la noche es de
cualquiera que sale a ver música.

Tres cosas que esa decisión resuelve de una vez, y que conviene dejar escritas porque son lo que
hay que defender si alguien quiere volver al banco anterior:

1. **El mundo ricotero entra por la escena y no por el dato.** Nadie contesta nada sobre la
   banda: contesta qué hace con la música mientras se prepara, cuando falta señal en el camino,
   cuando llueve en la vereda. La noche del recital es el ritual de la gente (`INV-150`), contado sin
   dueño. `BR-17` prohíbe ejes que midan conocimiento; no prohíbe escenas del ritual. Lo que no
   puede pasar es lo que mató a `EJ-011`: que una de las dos opciones sea *más de adentro* que la
   otra. Eso se mide ítem por ítem con la prueba de los cuatro lugares (§4).
2. **El orden de las preguntas deja de delatar el eje.** En el banco viejo el sorteo intercalaba
   ABAB y la alternancia se leía. Ahora cada momento trae un ítem de cada eje en orden al azar
   adentro del momento: la secuencia la manda la noche.
3. **Tres por celda son tres noches seguidas sin repetir una escena** (`BR-37`). Con 30 ítems
   la segunda partida ya no repite la mitad, que era uno de los siete defectos del relevamiento.

Y una consecuencia de oficio: los ítems viejos no se rescatan. Eran buenos por separado
(`REV-07`, `CNT-09` §T-127) pero ninguna escena era de la noche, y una escena de asado en medio de
"la vereda" rompe el único trato que hace la partida. Pasan a `retirado` con la nota que pidió
`D-57` y se quedan donde estaban (`Docs/IDS.md`: un id no se recicla).

## 2. Las reglas que apliqué

Las de `D-57` y `BR-36`, más las que ya vigila `banco.test.ts`. Marco con **(T)** las que una
máquina mira, y con **(O)** las que lee el oído de `REV-19`.

**La noche.**

- **(T)** Un ítem de cada eje por momento; ítems `listo` con `momento`; tres por celda; 30 en total.
- El recital es "un recital" o "otro recital", sin dueño, en presente. Nunca la banda, sus temas,
  el Indio, misa, pogo ni aguante **(T)**; ni una canción nombrada: las canciones son "una canción
  lenta", sin título.
- Nada que pida haber ido, saber o tener algo. Plata: ni entrada, ni puesto, ni remera, ni
  comprar, ni pagar **(T)**, y tampoco lo que la presupone sin decirla (un consumo en la vereda, un
  puesto de comida, el choripán del sitio, que `RES-161` respalda y que por eso mismo quedó afuera).
- **Un cuerpo capaz de algo no es temperamento.** "Te ubicás", nunca "te parás". Nada de saltar,
  de multitud apretada, de "en el medio", de correr **(T)**; y nada que se resuelva solo si se
  camina: *estirar las piernas* y *bajar a ver* quedaron afuera aunque sonaban inocentes.
- **Seguridad no es temperamento.** Ni "a dedo", ni "desconocidos", ni volver a pie, ni
  "caminando" **(T)**. Y una versión más fina que ninguna máquina ve: ninguna opción de `vuelta`
  puede ser peor para quien vuelve sin compañía. Por eso **la vuelta no tiene trayecto**: sus seis
  ítems pasan en casa, en la cama o sin lugar fijo (`EJ-057`, `EJ-058`), y en ninguno se mueve
  nadie. Eso cierra, por construcción, el lugar de "volviendo de noche sin compañía".
- Sin alcohol, drogas, policía, fuego ni bengalas **(T)**. Sin Bulacio, Olavarría, Cromañón ni la
  muerte del Indio **(T)**; ninguna escena de despedida ni velorio **(T)**.

**Los ejes.**

- **`luz-oscuridad` = con la gente / con lo propio** (la vuelta 1 cambió *por cuenta propia* por
  *con lo propio*: §6.1), las dos opciones igual de improvisadas: **en los 15 ítems de este eje
  las dos son improvisadas, sin excepción** (`EJ-031` dejó de ser la que tenía las dos
  decididas). La opción de `oscuridad` es siempre **una acción que alguien elige hacer, con un
  objeto o una atención concreta** —ponerse los auriculares, tararear, mirar qué pasa afuera,
  reírse con ganas, seguir la melodía, escuchar el último eco, sentirlo en la panza, dibujar en
  un papel, hojear una revista—, nunca la ausencia de la de `luz` ni un refugio. Es la lección de
  `T-127` (ocho de diez opciones de `oscuridad` eran un *no hacer*) y la de la vuelta 1: siete de
  quince eran cerrarse, taparse o mirar afuera con melancolía (asomarse a la ventana, la frente
  contra el vidrio, enroscarse en la campera, dormir, la capucha, cerrar los ojos, mirar el
  techo) y **las siete se reemplazaron** por un hacer con objeto o atención.
  **La opción de `luz` no apunta nunca a quien está cerca ni a quien mira** (ese es el veto 6 de
  `BR-36` por el sentido; el test ya veta `quien tenga`, `quien me mira` y compañía, pero no ve
  cada caso): apunta a gente que ya es de uno ("un amigo", "mi familia", "los míos", "los de
  casa"), a un contacto a distancia (un audio o una foto mandada: son dos, `EJ-030` y `EJ-036`) o
  a gente presente sin contacto ni teléfono (trece de las quince no necesitan ni saldo ni datos).
  **"Mi gente" ya no está en ninguna:** *gente* es la palabra con la que el resultado traduce la
  luz (`POLOS.luz`), y la guarda de traducción de `banco.test.ts` la veta en cualquier opción.
  Las excepciones son cuatro y están a la vista de `REV-19`: `EJ-054` ("una charla de fondo":
  sonido, no persona), `EJ-055` ("las voces de la calle": se oyen, no se les habla), `EJ-041`
  ("quienes charlan", a distancia de una charla, sin hablarles) y `EJ-042` ("con otros": un techo
  común, no una charla).
- **`orden-caos` = con plan / sobre la marcha**, las dos opciones igual de acompañadas o igual
  de solas. De los 15, **dos se contestan a otra persona** (`EJ-033`, `057`) y **trece son
  decisiones propias** (`EJ-032`, `034`, `038`, `039`, `040`, `044`, `045`, `046`, `050`, `051`,
  `052`, `056`, `058`). La vuelta 1 bajó de ocho a tres las que suponen compañía ("alguien
  propone", "alguien te pasa", "por si se separan") y la vuelta 2 a dos, porque una noche con
  ocho de quince escenas de grupo cuenta una sola clase de gente. Ningún ítem mezcla: ese cruce
  de ejes fue lo que hundió a `EJ-019` y lo que la vuelta 1 corrigió en `EJ-034` y `EJ-052`.
  **Y el eje mide una sola cosa** (la vuelta 2 lo corrigió: antes mezclaba cinco, `REV-07`
  pedía una): *anticipar o resolver sobre la hora*, siempre dentro de la noche —qué llevás,
  cuándo salís, qué te ponés, un papel con indicaciones, la música del camino, cuánto falta,
  cómo se mira, qué hacés mientras algo no arranca, un cambio de horario, cómo contar la noche,
  una canción pegada, lo que sigue, la mañana, otra fecha, un teléfono sin batería—, y ya no
  secuencial contra disperso, ni memoria, ni vista contra oído, ni agenda semanal.
- **Ningún polo paga solo, y ninguno confiesa un descuido.** Ni "llego tarde" (la firma de
  `caos`) ni "reviso todo mil veces" (la de `orden`): `EJ-024` y `EJ-016` ya enseñaron que una
  opción que confiesa un defecto se dice con vergüenza y la otra no. La vuelta 1 agregó la mitad
  que faltaba: **`caos` tiene una ganancia dicha con el modismo de quien la tiene** ("según el
  humor", "el día que pinte", "llego cuando llego", "donde caiga la vista", "dejo que llegue el
  después"), y `orden` no es la competencia (quince opciones que empezaban por seguir, pensar,
  fijar o marcar eran el vocabulario de la eficiencia). Ninguna raíz se repite en más de dos
  opciones de un polo (`antes`, `elijo`, `saco` y `pongo` aparecen en dos de orden; `dejo`, en
  dos de caos), y la forma tampoco: la vuelta 2 bajó `por` a una opción de orden (eran cinco y
  ninguna de caos) y "Me + verbo" a dos de caos y dos de oscuridad (eran cuatro de caos y
  cuatro de oscuridad). El test descarta `por` y las palabras de dos letras: el cuidado es del
  oído de `REV-19`, y está pedido en la sugerencia que el test las cuente.
- **(T)** Ninguna opción nombra su eje: ni *luz, oscuro, orden, caos, plan, lista, horario,
  reviso, todo, todos, toda*. **(O)** Y ninguna opción ni bajada de cuadrante repite la palabra
  de otro lugar de la grilla que apuntaría al nombre de un cuadrante antes de que el jugador lo
  conozca: *libro, radio, mochila, mesa, ronda, mapa, esquina, rincón, hora* (la vuelta 1 sacó
  *hora fija* y *rincón* de las opciones; quedan en el nombre y la bajada de `CU-1` y `CU-3`,
  donde son el nombre). **Hoy `banco.test.ts` sí las tiene** (la guarda "ninguna opción apunta
  al nombre de una manera": las palabras de los cuatro nombres, más *rincón, hora, horario,
  libro*), igual que los delatores *fij\*, pensad\*, pense, marcad\*, vera, veremos, veamos*, la
  guarda de traducción de los polos (*gente, propio, plan, sobre, marcha*, en cualquier opción)
  y la de firma de un polo (una palabra de tres letras o más en tres opciones de un polo y en
  ninguna del de enfrente). La versión anterior de este documento decía lo contrario: estaba
  vieja desde `661bfb9`. **Las guardas de traducción y de firma fueron lo que rompió la vuelta
  1**: cuatro "mi gente" y cuatro "los míos" pasaban todas las demás.

**La voz.**

- **(T)** Enunciado ≤ 14 palabras (el más largo mide 11), opción ≤ 5 palabras y ≤ 28 caracteres
  (la más larga mide 27: `EJ-042`), nada de *che, viste, posta*, ni épica ni psicodelia.
- **(T)** Responde quien juega: segunda persona singular en el enunciado, primera en la opción,
  sin adjetivo con género. Los ítems que mencionan a otros lo hacen como contexto: **`alguien`
  queda en un solo enunciado** (`EJ-033`; eran ocho y siete de los ocho eran de orden-caos: una
  marca de forma) y el resto usa la forma impersonal ("te preguntan", "te proponen", "te
  pasaron", "dicen"). Nunca "les toca" ni "arrancan".
- **(T)** Ningún cierre repetido más de tres veces. Quedan 23 enunciados que afirman sin preguntar
  y siete que cierran con una pregunta, **las siete distintas** (`¿Qué hacés con ella?`, `¿Cómo lo
  llenás?`, `¿Dónde te quedás?`, `¿Qué llevás?`, `¿Cómo pasás el rato?`, `¿Dónde te ubicás?`,
  `¿Qué te sale?`).
  **"¿Qué hacés?" no aparece.** Lo que hizo el banco viejo era una plantilla; lo que hace éste es
  dejar que el enunciado describa y que las opciones contesten solas. **Ni "resolver" ni "un
  rato largo" se repiten en enunciados** (la vuelta 1 los sacó: lenguaje de oficina y un
  tic en tres escenas).
- **(O)** Imagen física y barata: llaves, campera, auriculares, cuarto, alero, afiche, panza,
  manos, revista, papel, foto, ropa. El intruso de `voz-ricotera` §4.5 no se busca en las
  opciones: con cinco palabras no hay lugar para él, y forzarlo sería jerga puesta de más
  (la vuelta 2 sacó el único que se había colado, *crucigrama*, `EJ-045`; los que más se le
  parecen ahora son *alero* y *afiche*).
- **(O)** Cada momento es independiente del orden: dentro de un momento sale un ítem de cada
  eje en orden al azar y los tres de uno pueden aparearse con los tres del otro (nueve
  parejas, en los dos órdenes). Por eso **ningún enunciado fija un antes o un después dentro del
  momento** (la vuelta 1 sacó "Llegás primero…", "Ya con las llaves en la mano…" y "Falta poco
  para llegar", que armaban secuencias incoherentes). Las seis de la previa pasan en casa
  mientras llega la hora; las de la ida son un camino sin vehículo; las de la vuelta pasan en
  casa, ya de noche, sin orden entre sí.

**Lo que no resolví con reglas y lo dejo a la vista de `REV-19`.** El eje `luz-oscuridad`
tiene 15 opciones de `luz`. Después de la vuelta 2, **trece no necesitan teléfono** y dos sí (un
audio, una foto mandada); cuatro son gente presente sin contacto ni teléfono (quienes charlan,
una charla de fondo, las voces de la calle, un alero compartido) y las demás son *un amigo*,
*mi familia*, *los míos* (dos) y *los de casa*, ninguna repetida más de dos veces. Ninguna
apunta a quien está cerca ni a quien mira, pero **para quien va sin nadie las que nombran a los
suyos siguen siendo una opción que le queda corta**: *con la gente* es el polo, y no encontré
cómo aflojarlo sin quedarme sin eje. Lo que sí hizo la vuelta 2 es que ese jugador tenga, en
la ida, la vereda y la vuelta, una luz que no le pide a nadie. En la previa y en `adentro` las
tres luces nombran a alguien: es lo primero que miraría. Lo mismo vale en sentido inverso para el momento
`adentro`: sus seis escenas se oyen igual desde la vereda (la vuelta 1 sacó la pausa técnica que
había que ver y la canción lenta que pedía cerrar los ojos), pero dan por hecho que quien juega
llegó a escucharlas, y eso es estructural de `D-57` punto 1, no de contenido: si se quiere otra
cosa, se reabre el punto, no el banco. Es lo primero que le pido a `REV-19` que mire.

## 3. Los cinco momentos

`nombre` es el sello (registro 3, ≤ 3 palabras). `canta` es la línea de registro 1: ≤ 8 palabras,
cuerpo y objetos, ni un polo empujado, sin suspensivos **(T)**.

| id | Sello | Canta | Por qué esta y no otra |
|---|---|---|---|
| `previa` | La previa | Campera puesta, llaves en el bolsillo. | **Cambió en la vuelta 2** (era *Campera sobre la silla…*: con el abrigo en una silla se lee como el del que no está). 6 palabras. Una prenda y un manojo: objetos que cualquiera tiene. La propuesta del panel (*Zapatillas atadas, campera en la mano*) presupone pies y una mano libre. |
| `ida` | La ida | Ruido de fondo, el camino que se estira. | **Cambió en la vuelta 1** (era *Ventanilla empañada, motor que no para*: un micro de larga distancia, el pasaje ya pagado y la peregrinación de `RES-160`). Ahora no hay vehículo ni pasaje: ruido, camino, lo que se estira. 8 palabras. Sin "rodillas contra el asiento" (presupone piernas) y sin mate (empuja `luz`). |
| `vereda` | La vereda | Baldosa fría y un parlante lejano. | **Cambió en la vuelta 2** (era *Pasto pisado…*: la vereda es baldosa, y el pasto pisado evoca el predio abierto de los recitales masivos, con "pisado" como imagen de multitud: Olavarría por evocación). Sin "choripán": es el puesto, y el puesto es plata (`RES-161`). El parlante lejano es lo que llega de adentro. |
| `adentro` | Adentro | Bombo en el pecho, primer acorde. | Se queda como la trajo el panel: el bombo se siente con el cuerpo que sea y "primer acorde" no nombra ningún tema. |
| `vuelta` | La vuelta | Zumbido en el oído, llave en la puerta. | **Cambió en la vuelta 1** (era *El asiento tibio, el ruido que queda*: el asiento tibio es la imagen del que se acaba de ir, y junto con el casete "Hay un lugar libre en el micro" leía como silla vacía, el tono de velorio que `D-57` punto 9 ya reconoció con las velas). Ahora: en casa, sin trayecto, y cierra el círculo con las llaves de la previa. 8 palabras. Sin "garganta rota" (presupone haber gritado) ni "zapatillas embarradas" (clima, calle y pies). |

**La prueba de que ninguna empuja un polo.** Tapé las cinco y las leí en fila: ninguna dice
"con la gente" ni "con lo propio", ninguna dice hora ni improvisación. La más cargada es la
`vuelta` (hay oído y llave) y no inclina; la `ida` quedó sin vehículo y es la más neutra.

## 4. Los treinta ítems

Cada ítem lleva en `notaInterna`, en una línea, **la prueba de los cuatro lugares de `D-57`
punto 3** (nunca fui · sin plata · silla de ruedas · volviendo de noche sin compañía) y qué
constructo mide. Los treinta dan ✔ en los cuatro. La última columna de la tabla no repite el ✔:
dice **dónde estuvo más justo cada uno**, que es donde `REV-19` tiene que mirar primero.

`L` = `luz-oscuridad` (opción A = `luz`, opción B = `oscuridad`). `O` = `orden-caos` (A = `orden`,
B = `caos`). En el archivo las opciones van siempre en ese orden; el motor las baraja
(`CTR-08.3`).

### La previa

| Id | Eje | Enunciado | Opción A | Opción B | Dónde estuvo más justo |
|---|---|---|---|---|---|
| `EJ-029` | L | Mientras te preparás, suena música. ¿Qué hacés con ella? | La comparto con un amigo | Pongo los auriculares | **Cambió en la vuelta 2** ("mi gente" sale: *gente* es la palabra con la que el resultado traduce la luz; "Me pongo" pasa a "Pongo"). Los auriculares son un objeto y una atención, pero siguen siendo un tapón: es la candidata de oscuridad más cerrada que quedó. |
| `EJ-030` | L | Todavía falta un rato largo para salir. ¿Cómo lo llenás? | Mando un audio a alguien | Tarareo para adentro | **Cambió en la vuelta 2** ("contando" dejaba el gerundio colgado). "A alguien" es de uno por el verbo: un audio se le manda a quien ya se conoce. Una de las dos luces a distancia que quedan: supone teléfono con saldo o datos. |
| `EJ-031` | L | Esperás la hora de salir. ¿Dónde te quedás? | En lo de mi familia | En mi cuarto | **Cambió en la vuelta 2** ("En lo de los míos" y "En casa, con lo mío" eran casi espejos, y "con lo mío" repetía "con lo propio"). Las dos son un lugar con la misma forma. La A supone una familia con casa; la B, un cuarto propio. |
| `EJ-032` | O | Estás por salir para un recital. ¿Qué llevás? | Lo tengo armado de antes | Lo agarro al salir | **Cambió en la vuelta 2** (el enunciado decía "Falta decidir" y orden "Lo tengo armado": se contradecían, y "en la puerta" era ambigua). Nada se compra y es *cuándo*, no *qué*. |
| `EJ-033` | O | Alguien te pregunta cuándo salís. | Le confirmo con tiempo | Le aviso cuando salgo | **Cambió en la vuelta 2** ("Digo cuándo y lo cumplo" tenía orgullo moral y "Salgo cuando me late", contestado a quien espera, era descuido hacia otro). Las dos le contestan algo concreto a quien pregunta. Es el único enunciado del banco con "alguien". |
| `EJ-034` | O | Te vestís para salir. | Elijo la ropa de antemano | Me visto según el humor | **Nuevo en la vuelta 2** (era "tres cosas por hacer antes de salir": test de revista sin noche). Ninguna opción nombra una prenda. "Según el humor" es la ganancia de caos: si `REV-19` lo oye como "me da igual", cambia. |

### La ida

| Id | Eje | Enunciado | Opción A | Opción B | Dónde estuvo más justo |
|---|---|---|---|---|---|
| `EJ-035` | L | El camino se hace largo. ¿Cómo pasás el rato? | Hablo con los míos | Miro qué pasa afuera | **Cambió** (era el micro de "Quedan dos horas de ruta"). Sin vehículo ni pasaje. La B es mirar algo concreto con interés, no apoyar la frente en el vidrio. |
| `EJ-036` | L | Ves algo lindo al pasar y sacás una foto. | La mando enseguida | La miro un buen rato | **Cambió en la vuelta 2** (la B era "Me quedo mirándola": el reflexivo "Me…" abría cuatro opciones de oscuridad). Es otra decisión: qué se hace con lo que se ve. La A es la otra luz a distancia y supone teléfono; la B, que se mira con ganas, no que se esconde. |
| `EJ-037` | L | Te acordás de algo gracioso. | Lo cuento en voz alta | Me río con ganas | **Nuevo en la vuelta 2** (era "Por un tramo, el teléfono no tiene señal": otra luz de mandar algo a distancia, y "Leo algo que traje" era previsión, la firma de orden, en una opción de oscuridad). Ninguna necesita teléfono. "Me río con ganas" es la oscuridad más alegre del banco: si `REV-19` la lee como "la más feliz", cambia. |
| `EJ-038` | O | Te pasaron un papel con indicaciones para llegar. | Lo sigo paso a paso | Lo tomo como pista | **Cambió en la vuelta 2** ("punto por punto" y "de referencia" eran registro de oficina, y "por" abría cinco opciones de orden). Es la única escena de camino de la celda. Es el ítem más "del que nunca fue": las indicaciones existen porque no todos conocen el lugar. A favor, no en contra. |
| `EJ-039` | O | Vas a escuchar música en el camino. | Elijo antes qué escuchar | Pongo lo primero que sale | **Nuevo en la vuelta 2** (era "Dejo terminar cada tema": el respeto del devoto contra el que saltea). Es *cuándo* se elige la música, no cómo se escucha. No nombra tema ni disco. |
| `EJ-040` | O | Te preguntás cuánto falta para llegar. | Saco la cuenta | Llego cuando llego | **Nuevo** (era "alguien pregunta por dónde se entra", que suponía entrada y grupo). Las dos son un modismo. Ninguna opción habla de entrar ni de cuánto cuesta. |

### La vereda

| Id | Eje | Enunciado | Opción A | Opción B | Dónde estuvo más justo |
|---|---|---|---|---|---|
| `EJ-041` | L | Desde adentro llega un sonido lejano. ¿Dónde te ubicás? | Cerca de quienes charlan | Donde mejor se oye | **Cambió en la vuelta 2** (la B era "En un borde, con aire": para quien llega sin compañía, apartarse de noche y afuera es lo menos seguro, y "con aire" se lee como escapar del apretujamiento). "Te ubicás" y no "te parás" (`D-57`). La A es luz sin teléfono ni contacto: se ubica cerca de una charla sin hablarles. |
| `EJ-042` | L | Cae una llovizna fina sobre la vereda. | Comparto un alero con otros | Espero bajo un alero | **Cambió en la vuelta 2** ("Me tapo como puedo" era aguantar algo malo de manera precaria frente a "Busco techo con otros", que resolvía). Las dos resuelven con el mismo objeto; lo único que cambia es con quién. "Con otros" es un techo común, no una charla. |
| `EJ-043` | L | Hay afiches pegados en la pared. | Los comento con mi familia | Leo cada afiche | **Nuevo en la vuelta 2** (era "te cruzás con alguien conocido": luz por construcción, y "sigo mi rumbo" cortaba la charla que ofrecía la otra). Un objeto que está ahí. "Cada afiche" puede sonar a devoción fina: es la que `REV-19` mira primero. |
| `EJ-044` | O | Hay mucho para mirar en la vereda. | Empiezo por lo más cercano | Miro donde caiga la vista | **Cambió en la vuelta 2** (era "una cosa por vez" / "lo que me llama": atención secuencial contra dispersa, con "por" y "una" de firma de orden). Las dos son una mirada, sin cuerpo. |
| `EJ-045` | O | El sonido de adentro no arranca. | Saco lo que traje | Invento algo con las manos | **Nuevo en la vuelta 2** (era "Abren tarde" / "Saco mi crucigrama" / "Invento un juego": daba por hecho que se está en la fila para entrar, y el juego inventado se lee social). Las dos son igual de solas. Sin crucigrama: ya no queda ningún intruso. |
| `EJ-046` | O | Dicen que empieza más tarde. | Ajusto mis tiempos | Me acomodo a lo nuevo | **Nuevo en la vuelta 2** (eran "dos caminos sin cartel": con silla de ruedas es accesibilidad, y volviendo de noche "el más ancho" era la precaución y "sigo el sonido" la imprudencia presentada como carácter). Sin trayecto. Las dos se adaptan: orden corrige lo que tenía, caos acepta lo que viene. |

### Adentro

| Id | Eje | Enunciado | Opción A | Opción B | Dónde estuvo más justo |
|---|---|---|---|---|---|
| `EJ-047` | L | Suena una canción lenta. ¿Qué te sale? | Busco una mano conocida | Sigo la melodía | **Cambió en la vuelta 2** ("Busco a mi gente" sale; "Escucho cada palabra" era el gesto del fan que descifra las letras y suponía entender el idioma). Sin cerrar nada ni título de canción. "Una mano conocida" es de los suyos; la melodía se oye en cualquier idioma. |
| `EJ-048` | L | Se hace una pausa antes del próximo acorde. | Cuchicheo con los míos | Escucho el último eco | **Cambió en la vuelta 2** ("Cuento los segundos" es la expresión de la impaciencia). Las dos son calladas. "El eco" supone una sala; se oye igual desde la vereda. |
| `EJ-049` | L | El volumen sube de golpe. | Sonrío a un amigo | Lo siento en la panza | **Nuevo en la vuelta 2** (era "se oye cómo cambian los instrumentos": dato técnico, y la misma pausa que `EJ-048` con otro objeto). Se siente igual desde afuera. La A es un gesto a uno de los suyos, no a quien está cerca. |
| `EJ-050` | O | Ya pensás cómo contar esta noche. | Voy armando el relato | Lo cuento como salga | **Cambió** (sin "a alguien"). Es la única escena de la noche sobre contar. "Como salga" no es un fracaso: es contarlo al momento. |
| `EJ-051` | O | Una canción se te queda en la cabeza. | La escucho en casa, entera | La tarareo hasta que pase | **Cambió en la vuelta 2** ("si me acuerdo" confesaba olvido y "mañana" era una agenda artificial para una canción pegada). Las dos son una ganancia. Sin cuerpo ni multitud. |
| `EJ-052` | O | Todavía falta, pero ya pensás en lo que sigue. | Defino el después | Dejo que llegue el después | **Nuevo en la vuelta 2** (era "te preguntan qué te pareció": reflexión contra impulso, sin rastro de la noche). No dice irse ni quedarse (quedarse hasta el último minuto es devoción). "El después" es un sustantivo inventado: si `REV-19` lo oye literario, es el primero en cambiar. |

### La vuelta

| Id | Eje | Enunciado | Opción A | Opción B | Dónde estuvo más justo |
|---|---|---|---|---|---|
| `EJ-053` | L | Ya en casa, todavía tenés el ruido en el cuerpo. | Busco a los de casa | Me lavo la cara | **Cambió en la vuelta 2** ("Llamo a mi gente" sale: llamar supone saldo y era casi la misma opción que `EJ-055`). Es en casa: no roza el trayecto. "Los de casa" supone que haya alguien: para quien vive solo esta luz no está, y las otras dos de la celda no le piden a nadie. |
| `EJ-054` | L | La casa está en silencio. | Pongo una charla de fondo | Dibujo en un papel | **Nuevo en la vuelta 2** (era el papelito de esa noche: se lee, después de un recital, como la entrada cortada). Escena de casa sin objeto de recuerdo; la luz es compañía que no le pide nada a nadie. "Una charla de fondo" es compañía en forma de sonido: si `REV-19` no la cuenta como luz, cambia. |
| `EJ-055` | L | Desde la calle llegan voces. | Las escucho un rato | Hojeo una revista vieja | **Nuevo en la vuelta 2** (era "Es tarde y no te da el sueño" / "Escribo a mi gente": la misma opción que `EJ-053`). Luz sin teléfono ni contacto. Escuchar las voces de la calle se parece a espiar: es la que `REV-19` mira si le suena raro. "Revista" es un guiño al test de revista, ya retirado. |
| `EJ-056` | O | Antes de dormir, pensás en mañana. | Pongo la alarma | Dejo que el cuerpo avise | **Cambió en la vuelta 2** (era agenda semanal: test de revista sin rastro de la noche). El enunciado no dice qué hay mañana: con un compromiso, caos quedaría como el descuido. |
| `EJ-057` | O | Te proponen repetir una noche así. | Cerramos la fecha ahora | Acepto, el día que pinte | **Cambió en la vuelta 2** (era "ir a otro recital": daba por hecho que se puede pagar otra salida, "cualquier día me va" apuntaba a «Ronda en cualquier esquina» y las dos arrancaban con "Acepto"). Las dos le dicen que sí a la misma persona. Habla de fecha, nunca de entrada. |
| `EJ-058` | O | El teléfono quedó sin batería. | Lo pongo a cargar ya | Lo cargo cuando haga falta | **Nuevo en la vuelta 2** (era "Hay cosas de esta noche que querés recordar": recuerdo-homenaje a cuatro meses del 5 de junio, y "la primera" suena a escuela). Mira hacia adelante y hacia lo práctico. "Cuando haga falta" es la ganancia de caos: si `REV-19` lo lee como descuido con el aparato, cambia. |

**Un cruce que revisé y no encontré:** `EJ-047`, `048` y `049` (los tres de `adentro` en `luz-
oscuridad`) no ubican la obra en el plano: ninguno dice "esta canción es de luz". Las canciones no
tienen título y el acorde no tiene nombre. Es la decisión del usuario en `US-06` y la repite
`D-57` punto 9.

**Vuelta 2: tres decisiones de naturaleza distinta por celda, y lo que queda.** En
`luz-oscuridad`, la previa es música, rato y dónde quedarse; la ida, rato, una foto y un
recuerdo gracioso (ya no hay dos luces de mandar algo); la vereda, dónde ubicarse, una
llovizna y unos afiches (ya no hay un encuentro con un conocido, que era luz por
construcción); `adentro`, una canción lenta, una pausa y un volumen que sube (ya no hay dos
pausas); la vuelta, el ruido en el cuerpo, la casa en silencio y las voces de la calle (ya no
hay dos luces de llamar o escribir). `orden-caos` sigue siendo el mismo dilema, *anticipar o
resolver sobre la hora*, en quince objetos: es lo que el eje es. Lo que le dejo a `REV-19`:
las tres de la previa de `luz-oscuridad` siguen siendo esperar en casa, y las de la vuelta de
`orden-caos` (la mañana, otra fecha, un teléfono sin batería) siguen siendo "hacerlo ahora o
cuando toque" sobre tres cosas de la casa.

**Tres decisiones distintas por celda, y las dos celdas donde no se logra del todo (estado de la
vuelta 1).** La vuelta 1
reescribió para que cada celda pida decisiones de naturaleza distinta (qué hacer con la música,
con el rato y dónde quedarse en la previa de `luz-oscuridad`; qué hacer con el rato, con una
foto y con la falta de señal en la ida). **`adentro × luz-oscuridad` y `vuelta × luz-oscuridad`
siguen siendo, en el fondo, "reparto con los míos / me quedo con lo propio" sobre tres
ocasiones distintas**: es lo que el eje es, y cambiar el objeto es lo que se puede hacer sin
perder el eje. Lo dejo dicho porque el patrón de `BR-36` ("una celda con el mismo dilema y
otro objeto") se mira ahí primero. La celda `ida × orden-caos` era la peor (las tres seguían
lo señalizado o improvisaban el camino) y ahora son un papel, la música y la cuenta de lo que
falta.

## 5. Las cuatro maneras

Los ids y los polos no se mueven (`D-57` punto 5; lo ata `banco.test.ts`). Cambian nombre y
bajada. Los nombres son los de `D-57`, sin persona gramatical: se dicen igual en "me", "te" y
"le salió".

| Id | Polos | Nombre | Bajada | La línea que nombra |
|---|---|---|---|---|
| `CU-1` | luz + orden | **Mesa larga a las nueve** | Hay una hora, un lugar y gente que te espera: la noche empieza sabiendo adónde va. Pero cuando alguien cambia el plan, a vos se te hace cuesta arriba. | Con la gente, con plan. |
| `CU-2` | luz + caos | **Ronda en cualquier esquina** | Te sumás a lo que aparece —una charla, un grupo, un mate en la vereda— y la noche toma forma. Pero cuando alguien pregunta adónde van, a vos te lleva un rato contestar. | Con la gente, sobre la marcha. |
| `CU-3` | oscuridad + orden | **Radio bajita, misma hora** | Tenés tu rincón y tu hora, y desde ahí la noche se te hace a medida. Pero cuando alguien corre la hora, a vos te toca rehacer la cuenta. | Con lo propio, con plan. |
| `CU-4` | oscuridad + caos | **Mochila liviana, sin mapa** | Salís con las manos libres y la noche te va mostrando lo que se cruza. Pero cuando alguien te pide el camino, a vos te sale un «por ahí». | Con lo propio, sobre la marcha. |

**La forma, que es lo que pidió `D-57`.** Cada bajada es **un placer y un costo, y los cuatro
costos tienen la misma forma**: "Pero cuando *alguien* *[hace algo]*, a vos *[te pasa algo]*."
**Alguien como sujeto y *a vos* como quien lo recibe**, con un verbo distinto en cada una (*se
te hace cuesta arriba*, *te lleva un rato*, *te toca*, *te sale*): una situación y lo que
provoca, nunca un rasgo de carácter. **La vuelta 2 cambió el molde de la vuelta 1** ("vos ya
tenés… / vos todavía no tenés…"): los costos de orden se leían como tener algo, casi una
ventaja ("vos ya tenés la noche acordada"), y los de caos como una falta ("todavía no tenés
respuesta"), o sea el defecto 2 de `REV-07` puesto en la grilla; además `CU-1` y `CU-3` eran
casi la misma frase. Ahora los cuatro dicen lo que pasa, no lo que se tiene ni lo que falta.
Entre 13 y 14 palabras cada costo; entre 15 y 20 cada placer; entre 29 y 33 el total (techo 36
de `banco.test.ts`; 240 caracteres del schema v2: ninguna pasa de 170; la tarjeta admite cinco
renglones y estas ocupan cuatro).

- **Ninguno de oscuridad se dice como exclusión, y ninguno de luz queda sin pagar.** La
  versión inicial pagaba el único costo del eje `luz-oscuridad` en `CU-3` ("cuando alguien te
  llama para sumarte, vos ya tenés el rincón ocupado": decir que no a sumarse, o sea exclusión
  propia, espejo exacto del placer de `CU-2`, "te sumás"), y la luz no pagaba nunca. **Ahora
  los cuatro costos son de `orden-caos`**: `CU-1` y `CU-3` (orden) pagan con el plan que se
  mueve ("cuando alguien cambia el plan, a vos se te hace cuesta arriba" / "cuando alguien
  corre la hora, a vos te toca rehacer la cuenta"); `CU-2` y `CU-4` (caos) pagan con la
  pregunta que llega ("te lleva un rato contestar" / "te sale un «por ahí»"). El placer es lo
  que distingue `luz-oscuridad`, y el costo, lo que distingue `orden-caos`: así ningún polo de
  un eje paga más que el otro. Que `luz-oscuridad` "no pague nunca" (lo anotó la lectura de la
  vuelta 2) es a propósito: `D-57` punto 5 pide que ninguno de oscuridad se diga como
  exclusión, y el único modo de no cargarle un costo a un polo de ese eje es que el costo sea
  del otro.
- **Ninguna describe cómo aguantás algo malo.** Ése era el defecto de las bajadas de `CU-3` y
  `CU-4` en `T-127` ("lo resolvés en silencio, antes de que alguien pregunte"; "te lo guardás y lo
  masticás solo"): los de luz describían placeres y los de oscuridad un padecimiento. Acá los
  cuatro placeres son placeres: una noche que sabe adónde va, una noche que toma forma, una noche
  que se hace a medida, una noche que se va mostrando. (La vuelta 2 sacó "no se te escapa un
  acorde": era el oído del entendido y el único placer definido por la música.)
- **Sin género.** Ninguna usa *solo/sola*, ni participio que concuerde con quien juega.
  (`libres` concuerda con las manos.)
- **Ancladas en la noche, entendibles sin haber ido.** Hora, lugar, gente, vereda, rincón,
  manos, camino: palabras de cualquier salida. Ninguna dice "recital".

**La prueba que pidió el encargo: tapá los nombres, ¿alguna está triste o es más linda?** La
leí cuatro veces, de a una y en fila. Las más cálidas por oído son `CU-1` y `CU-2` (por *gente
que te espera* y *un mate en la vereda*); `CU-3` y `CU-4` quedan más calladas pero no tristes:
*la noche se te hace a medida* y *las manos libres* son placeres con peso. **`CU-4` era la más
pobre** (lo anotó la primera versión y `REV-19` previa lo confirmó): *lo justo* dice plata en
Argentina, *sin rumbo fijo* de noche y por cuenta propia es el retrato de la imprudencia que
`BR-36` saca de las opciones, y *por dónde anduviste* es la pregunta del que se quedó
preocupado. La vuelta 1 la reescribió con *llevás poco encima y los ojos abiertos*, y **la
lectura de la vuelta 2 la encontró otra vez**: eso mismo es, en el habla rioplatense, el
consejo de seguridad para andar de noche ("no lleves nada encima", "andá con los ojos
abiertos"), o sea que el placer se leía como vigilancia y, junto con *sin mapa*, pintaba a
quien anda de noche a la deriva; y *poco encima* además se lee plata. Ahora es *salís con las
manos libres y la noche te va mostrando lo que se cruza*: un placer físico, sin cuidado ni
plata, y concreto (*lo que se cruza*, no *lo que no estaba anunciado*). Sigue siendo la más
callada de las cuatro y el primer lugar por donde volvería a mirar.

**El nombre y la línea que nombra, juntos.** El nombre es lo que se dice en voz alta; la línea
es la traducción: *Mesa larga a las nueve* → "Con la gente, con plan". Se arma sola desde los
polos (`lineaQueNombra`, §6). Dos de los nombres llevan palabras que ya son de un polo de
`orden` (*a las nueve*, *misma hora*) y dos de `caos` (*en cualquier esquina*, *sin mapa*): se
reconoce sin explicarlo.

**Alternativas de `D-57` que quedan anotadas:** *Mate en cualquier esquina* (`CU-2`) y *Libro con
señalador* (`CU-3`). Con cualquiera de las dos la bajada de arriba sigue valiendo: no nombra
ningún objeto del nombre.

## 6. Cadenas de pantalla

Para pegar en `src/lib/dos-ejes/copy.ts` (y la del casete en `src/lib/sitio/copy.ts`). La columna
"Frente a `copy.ts`" compara con lo que el hilo principal armó provisoriamente el 2026-10-04
(**confirma** = igual; **cambia** = había que tocarlo: el hilo principal ya pegó todas menos
`LUGARES.dosEjes`). Las funciones se escriben como
`función(parámetros)` y el texto lleva los huecos `${...}`. `R1`, `R2`, `R3` son los registros de
`voz-ricotera.md` §5. Todos los botones están en voseo imperativo (`D-17`): *Empezá, Compartí,
Bajá, Volvé*. Ninguna lleva "¡Y listo!" ni "y listo", ni suspensivos en un botón o rótulo, ni
signo de exclamación.

### 6.1 Una decisión que cambia más de una fila: los polos no tienen persona

`D-57` nombra los polos "Con la gente", "Por tu cuenta", "Con plan", "Sobre la marcha". Los
cuatro nombres de cuadrante se escribieron sin persona **para que se digan igual en "me", "te" y
"le salió"**. La línea que los traduce viaja por los mismos tres lugares: aparece en la
tarjeta ("Me salió «X»: …"), en el desafío ("A alguien le salió «X»: …") y en el resultado
("Esta noche te salió «X»"). **"Por tu cuenta" se rompe en dos de esos tres**: "A alguien le salió
«Radio bajita, misma hora»: por tu cuenta, con plan" se lee como un reproche al que lee, y en la
tarjeta de quien dice "me salió" es un sinsentido.

La primera versión de este documento propuso **`por cuenta propia`**, que no tiene persona. **La
lectura de la vuelta 1 lo corrigió**: hay una asimetría de calor. *Con la gente* es la palabra
con la que el sitio nombra a quien juega (`voz-ricotera` §3.8), y *por cuenta propia* es en la
Argentina la categoría laboral del cuentapropista —suena a trámite, y yo mismo lo había
admitido—: la lectura implícita era que la gente del sitio es la de luz. El texto que vale es
**`con lo propio`**: sin persona (se dice igual en "me", "te" y "le salió"), de la misma forma que
*con la gente* y *con plan* (preposición, artículo, sustantivo), y es la definición del brief
(*compañía contra lo propio*). Es **una sola cadena** (`POLOS.oscuridad`). **Es un apartamiento
doble del texto de `D-57`** (que decía "Por tu cuenta", puntos 6 y contrato) y queda escrito
solo acá y en `copy.ts`: está pedido en la sugerencia al hilo principal que lo anote como
enmienda de `D-57` en `Docs/DECISIONES.md`, que es de él. Los polos se guardan en minúscula y
las dos formas de armar la línea se derivan:

- `polosEnFrase(lo, oc)` → `con la gente, con plan` (sin mayúscula ni punto: va después de un
  dos puntos o adentro de una oración).
- `lineaQueNombra(lo, oc)` → `Con la gente, con plan.` (primera letra en mayúscula, con punto:
  es la línea que va sola debajo del nombre en el resultado).

### 6.2 La tabla

| Clave | Texto | Frente a `copy.ts` | Registro y prueba |
|---|---|---|---|
| **PANTALLA_0** | | | |
| `titulo` | `¿Qué tipo de ricotero sos?` | confirma | R1, 5 palabras, segunda persona. Es el `h1` de `D-51` y no se toca. |
| `subtitulo(momentos, preguntas)` | `Una noche de recital en ${enLetras(momentos)} momentos y ${enLetras(preguntas)} preguntas de cómo la pasás. No hace falta saber nada ni haber ido.` | **VUELTA 1: cambia** (era `…de cómo sos.`: presentaba el test como esencia, contra `BR-37` regla 1 y `D-57` punto 6, "esta noche, no una esencia"; el título puede preguntar "sos", una afirmación que viene después no) | R3, dice el mecanismo y lo que no se pide. Es también la `og:description` de la portada. **Los números salen del dato:** `momentos` = `banco.momentos.length` (5) y `preguntas` = `banco.preguntasPorEje * 2` (10), con `enLetras()`. Sin "y listo". Tapado el título: queda esto y el botón, y el que llegó por un enlace sabe qué es y qué tocar. |
| `indiceRotulo` | `Las hojas de la noche` | **cambia** | R3, el rótulo de la etiqueta de papel con los cinco sellos. "Adentro del libro" chocaba con el sello `Adentro`, uno de los cinco que lista: un rótulo que dice "adentro" encima de una lista que contiene "Adentro". "Hojas" es el cuerpo del libro (D-57) y no explica nada. |
| `boton` | `Empezá la noche` | confirma | R1 (los botones son el registro que canta: `voz-ricotera` §5), voseo imperativo. Dice que esto no es una ronda con puntaje. |
| `desafio(nombre, polos)` | `A alguien le salió «${nombre}»: ${polos}. ¿Y a vos?` con `polos` = `polosEnFrase(...)` | **cambia** (la línea llega en minúscula y sin punto, y el punto lo pone la frase) | O. 1 R3 (lo que dice el otro, `ADR-02`), o. 2 R1. Sin verbo de ganar ni superar. Ver los cuatro textos abajo. |
| **POLOS** | | | |
| `luz` | `con la gente` | **cambia** (minúscula; la mayúscula la pone `lineaQueNombra`) | R3, la traducción de la punta. |
| `oscuridad` | `con lo propio` | **VUELTA 1: cambia** (la versión inicial de este documento decía `por cuenta propia`, y `D-57` decía `Por tu cuenta`; ver 6.1) | R3, sin persona, misma forma que `con la gente` y `con plan`. |
| `orden` | `con plan` | confirma | R3. |
| `caos` | `sobre la marcha` | confirma | R3. |
| `EJES` (`Luz`, `Oscuridad`, `Orden`, `Caos`) | los de hoy | confirma | R3, los rótulos que eligió el usuario (`BR-17`). Siguen en el sello de dos palabras. |
| **PARTIDA** | | | |
| `folio(n, total)` | `${n} de ${total}` | confirma | R3. Orientación, no medición. |
| `anterior` | `Volvé a la anterior` | confirma | R1 (botón), voseo (`D-17`). |
| `teclas` | `Teclas 1 y 2 para elegir. Retroceso vuelve.` | confirma | R3, solo con mouse. Sin suspensivos y sin infinitivo en la primera palabra. |
| `anuncio(momento, n, total)` | `${momento}. Pregunta ${n} de ${total}.` | confirma | R3, para el lector de pantalla: el sello (`La previa`) y el folio. |
| **RESULTADO** | | | |
| `rotulo` | `Esta noche te salió` | confirma | R3. "Esta noche" y no "Diste con esto": otra noche puede dar otra manera (`BR-37`). |
| `marca` | `Arcade Ricotero · ¿Qué tipo de ricotero sos?` | confirma | R3, la línea chica arriba de la hoja para que la captura salga con nombre y apellido. |
| `compartir` | `Compartí` | confirma | R1 (botón), voseo. |
| `denuevo` | `Empezá otra noche` | confirma | R1 (botón). Es lo opuesto a "Probá de nuevo", que sonaba a haber fallado. |
| `bajar` | `Bajá la tarjeta` | confirma | R1 (botón), voseo. |
| `volver` | `Volvé al arcade` | confirma | R1 (botón), voseo. |
| `lasCuatro` | `Las cuatro maneras` | confirma | R3, 3 palabras. Nombra la grilla. |
| `lasCuatroCanta` | `Cuatro puertas a la misma noche.` | **cambia** (era `Cuatro sillas alrededor de la misma mesa.`) | R1, 5 palabras, física (puertas) y sin sermón. La provisional tenía dos defectos: "mesa" es `Mesa larga a las nueve`, o sea le da el único objeto de la grilla a `CU-1`; y "alrededor de la misma mesa" pone a las cuatro **con la gente**, que es exactamente lo que las dos de oscuridad no son. Dice la paridad (cuatro entradas a un solo lugar) sin decir "ninguna vale más". Tapada: queda `Las cuatro maneras`, que nombra. |
| `tuya` | `Esta noche` | confirma | R3, sello chico. |
| `suya` | `Quien te lo mandó` | confirma | R3, sin género. |
| `altGrilla` | `Las cuatro maneras, con la tuya primero.` | confirma | R3, para el lector de pantalla. |
| `paraCompartir(nombre)` | `Me salió «${nombre}». ¿Qué tipo de ricotero sos vos?` | confirma | R1 en primera persona, fuera del sitio. Primera frase de 6 a 7 palabras (`Me salió «Mesa larga a las nueve».` es la más larga). Nombra el test (ya no hace falta decir "en el arcade ricotero": el enlace es la postal, que lo dice) y no lleva número (`BR-17`). Igual para las cuatro. |
| `copiado` | `Se copió el enlace.` | confirma | R3. |
| `aManoTitulo` | `Copiá esto y mandalo` | confirma | R3, voseo. |
| **POSTAL** | | | |
| `ogTitulo(nombre)` | `Me salió «${nombre}»` | confirma | R1, 4 a 7 palabras. Es el `og:title`. |
| `ogDescripcion(linea)` | `${linea} ¿Qué tipo de ricotero sos vos? Una noche de recital, sin saber nada.` con `linea` = `lineaQueNombra(...)` (lleva punto) | confirma | R3 + R1. Dice qué es X antes de jugar y repite el molinete. |
| `rotulo` | `A quien te lo mandó le salió` | confirma | R3, sin género. |
| `boton` | `Empezá tu noche` | confirma | R1 (botón), voseo. |
| **TARJETA** | | | |
| `meSalio` | `Me salió` | confirma | R1, el arranque de la frase que la tarjeta completa con el nombre. |
| `pregunta` | `¿Y a vos cuál te sale?` | confirma | R1, segunda persona, 6 palabras. |
| `credito` | `Lomo, mármol y esquinero: tapa de Luzbelito (Rocambole, 1996), en baja.` | confirma | R3, dice qué se usa y de dónde. Sin día ni mes de salida: `RES-167` los pone en duda. El año 1996 no está en duda (1-ago o 7-oct, los dos son 1996). Sin óvalo ni figura. |
| `alt(nombre, linea)`, `altJuego` | los de hoy | confirma | R3. Llevan el crédito (`D-21`). |
| **CASETE** (`sitio/copy.ts`) | | | |
| `JUEGOS[«¿Qué tipo de ricotero sos?»].baja` | `Nadie te toma examen. Una noche de recital, sin puntaje y sin saber nada de la banda.` | **cambia** (hoy: `Nadie te toma examen. Diez preguntas sobre vos, sin puntaje y sin saber nada de la banda.`) | La primera frase es la que el portal imprime (`primeraOracion`) y **no cambia**: 4 palabras, R1, y lleva toda la tranquilidad que el casete muestra (`CNT-26` §1.2 la admitió a conciencia). Cambia la segunda: "Diez preguntas sobre vos" pasa a "Una noche de recital", que dice lo que ahora es el juego y **saca el "Diez" escrito a mano** (el relevamiento lo marcó en tres textos). Si se quiere el número, derivarlo del banco con `enLetras()`, no escribirlo. `voz.test.ts` mide la primera frase: 4 ≤ 8. |
| `JUEGOS[...].accion` | `EMPEZÁ` | confirma | R1 (botón). |
| `LUGARES.dosEjes` (**opcional**, ver 6.4) | `Se entra con las manos vacías.` | **VUELTA 2: cambia** (hoy `copy.ts` de `sitio` dice `Hay un lugar libre en el micro.`; la vuelta 1 había propuesto `Nadie te pide nada en la puerta.`), solo si el renglón sigue en la página | R1, 6 palabras, física. Dice el molinete abierto con una imagen del cuerpo y sin *nadie*, *nada* ni *puerta*: el aviso ya se dice con *nada/nadie* en el subtítulo, en el casete y en la vista previa, y la puerta de un recital es donde se pide la entrada, o sea que se leía como un chiste a costa de quien no pudo pagarla. Reemplaza `Una vela te alumbra media cara.` por `D-57` punto 9, y el micro de larga distancia (peregrinación y silla vacía) por la lectura de la vuelta 1. |

### 6.3 Los textos armados, para leerlos de corrido

**La línea que llega** (`PANTALLA_0.desafio`), para las cuatro:

- A alguien le salió «Mesa larga a las nueve»: con la gente, con plan. ¿Y a vos?
- A alguien le salió «Ronda en cualquier esquina»: con la gente, sobre la marcha. ¿Y a vos?
- A alguien le salió «Radio bajita, misma hora»: con lo propio, con plan. ¿Y a vos?
- A alguien le salió «Mochila liviana, sin mapa»: con lo propio, sobre la marcha. ¿Y a vos?

Si la isla todavía lee el nombre del amigo en el enlace viejo (`n`), la variante es `A ${amigo} le
salió «…»` y el resto igual.

**Un aviso que no me corresponde cerrar y que importa.** `CNT-26` §2.3 explicó por qué esta línea
llevaba una tercera oración ("Diez preguntas de cómo sos, no de cuánto sabés"): la isla **pisaba**
`#subtitulo` con el desafío y con eso le sacaba la tranquilidad a la pantalla que más la necesita,
la de quien llega por el enlace de un amigo. La línea de arriba **no la lleva**, así que o la isla
deja de pisar el subtítulo (el desafío va en una línea propia encima, que es lo que pide la tapa
del libro), o esta línea vuelve a cerrar con **`No hace falta saber nada.`**. Cualquiera de las
dos sirve; las dos no, porque sería el mismo aviso dicho dos veces en la misma pantalla.

**La línea que nombra** (`RESULTADO`), debajo de "Esta noche te salió": el nombre grande y debajo
`Con la gente, con plan.` (o la que corresponda). Tapada esa línea, el que llegó por un enlace sabe
cuál es su manera pero no qué quiere decir: por eso existe.

**El texto que viaja** (`paraCompartir`): `Me salió «Radio bajita, misma hora». ¿Qué tipo de
ricotero sos vos?`

### 6.4 `LUGARES.dosEjes` — una propuesta que dejo a la vista

`CNT-26` §1.1 escribió **"Una vela te alumbra media cara."** para el renglón del lugar de esta
página. `D-57` punto 9 saca las velas de lo nuevo: dos velas encendidas, cuatro meses después del
5 de junio, se leen como un velorio aunque ningún texto lo diga, y aclara que la vela *de la
carátula y del pie* no se toca. El renglón **no es ninguna de las dos**: es texto de la página del
juego. No sé si el renglón sigue viviendo con la tapa del libro (eso lo decide `experiencia`,
`UX-36`). Si sigue, **la vuelta 1 cambió mi propuesta inicial** ("Hay un lugar libre en el
micro.", que es la que hoy está en `src/lib/sitio/copy.ts`): el micro de larga distancia es la
peregrinación de `RES-160` que `BR-36` llama más de adentro, da por hecho un pasaje pago (la
prueba "sin plata") y deja afuera a quien va en colectivo a un recital de su ciudad; y "un lugar
libre" es la silla vacía, el tono de elegía que `D-57` punto 9 ya había reconocido. El texto que
propongo ahora es **"Nadie te pide nada en la puerta."**: siete palabras, objeto y lugar, no
explica, no empuja ningún polo ni nombra uno de los cuatro cuadrantes, no repite palabra del
título ni del subtítulo, y dice el molinete abierto —nadie te pide nada, pasá— sin decirlo ni
decir de dónde viene la gente. **Ojo con "la puerta"**: es la del recital, donde sí se pide algo,
y el renglón dice que acá no (no hay cuentas ni Premium). Yo lo leo como el molinete abierto; si
`REV-19` lo oye como un chiste a costa de quien no pudo entrar, la alternativa es *Pasá, nadie
te pide nada* (5 palabras, imperativo, sin lugar). Si el renglón se va, no hace falta nada.

**Vuelta 2: cambia otra vez, y la propuesta de arriba queda como historia.** La lectura le
encontró dos defectos a *Nadie te pide nada en la puerta.* El primero, que el aviso del molinete
ya se dice con *nada/nadie* en el subtítulo ("No hace falta saber nada ni haber ido."), en el
casete ("Nadie te toma examen." y "sin saber nada de la banda") y en la vista previa ("sin saber
nada"), y que "Nadie te toma examen" y "Nadie te pide nada" repiten el molde: contra
`voz-ricotera` §4.6 (no explica), la misma idea dicha cuatro veces es explicación. El segundo, que
"la puerta" de un recital es donde se pide la entrada y se lee como un chiste sobre colarse. El
texto que vale es **"Se entra con las manos vacías."**: seis palabras, una imagen del cuerpo y
barata, sin *nadie*, sin *nada* y sin *puerta*, que dice lo mismo desde otro lado (para entrar no
se lleva nada: ni cuenta, ni Premium, ni saber). El aviso explícito queda en el subtítulo, que es
registro 3 y es donde tiene que estar; el renglón del lugar canta. Es copy del hilo principal
(`src/lib/sitio/copy.ts`): está en la sugerencia de la vuelta 2.

## 7. Lo que descarté, y por qué

- **`Por tu cuenta` como polo** (texto literal de `D-57`): se rompe en la tarjeta y en el desafío
  (§6.1). **`Por cuenta propia`** (la primera versión de este documento) tampoco: es el cuentapropista
  y deja a luz con la palabra de la gente del sitio y a oscuridad con una de trámite. Queda
  `con lo propio`.
- **El micro de larga distancia como escena de la ida** (la versión inicial de `EJ-035`, `036` y
  `037`, y la línea que canta de la ida y el renglón del lugar). Las tres de `luz-oscuridad`
  de la ida eran un micro, así que el micro salía todas las noches: pasaje pago por hecho,
  peregrinación de devoción (`RES-160`), una sola clase de gente. Quedó la ida sin vehículo.
  *El micro que se detiene en la ruta* era la única escena con respaldo de `INV-150` y se pierde
  a propósito.
- **Contacto con quien está cerca, con quien mira o con quien esté** ("Hablo con quien tenga
  cerca", "Sonrío a quien me mira", "Busco la mirada de alguien", "Armo charla con quien esté"):
  es el veto 6 de `BR-36` por el sentido, aunque ningún test lo vea.
- **Un punto de encuentro por si se separan** (`EJ-052`): una medida de seguridad presentada
  como temperamento, imposible para quien no recorre una multitud o no tiene batería ni señal.
- **Un cambio de ritmo que acelera la música** (`EJ-051`): es la señal del pogo (`RES-158`).
- **Cerrar los ojos con una canción lenta** (`EJ-047`): el gesto de `RES-157`, que `D-57` punto 9
  sacó porque se lee como velorio.
- **"Ya veremos cuándo" y "Mañana veo qué sale"** del lado del caos: en rioplatense son la manera
  amable de decir que no; el caos paga con una ganancia, no con una evasiva.
- **Las `canta` del panel**, salvo `adentro`: *Zapatillas atadas*, *rodillas contra el asiento*,
  *choripán*, *garganta rota* y *zapatillas embarradas* presuponen pies, piernas, plata (el puesto,
  `RES-161`), haber gritado, o clima y calle. Cada una está en el §3.
- **Cantar en público como escena.** La primera idea de la ida fue "arranca un cántico en el micro:
  me sumo / lo escucho". El caso límite que `D-57` nombra ("cantar con todo el micro"): la opción de `luz`
  es cantar con la gente y la de `oscuridad` queda callada en un lugar donde todos cantan, o sea
  que **los dos ejes dejaban de tener gente**. Salió.
- **Estirar las piernas, bajar a ver, dar una vuelta con alguien.** Ninguna se contesta sentado.
  Es la regla de la silla de ruedas, y la de volver de noche: `dar una vuelta` es caminar de noche.
- **`Apago el celular`** como opción de `oscuridad` en la vuelta: es `EJ-009` con otras palabras
  (*alivio, nadie me ubica*), la frase que `REV-07` marcó como la más compartible de las cuarenta.
- **El costo con rótulo** ("El costo:", "Lo que cuesta:") en las bajadas: convierte un párrafo en
  un formulario. "Pero cuando…, vos…" tiene la misma forma en las cuatro sin decirla.
- **`primera mitad` / `segunda mitad`** para contar qué comparten dos maneras (`CNT-29`): obligaba
  a contar mitades de una línea que el jugador casi no lee.
- **`Adentro del libro`** como rótulo del índice: colisiona con el sello `Adentro`.
- **`Cuatro sillas alrededor de la misma mesa`**: ver la fila `lasCuatroCanta`.
- **Un verso, una vela o un tema por cuadrante.** Ya descartado por el usuario en `US-06` y por
  `D-57` puntos 8 y 9. No hay ni una vela, ni un verso, ni el nombre de un tema en las 30
  escenas ni en las cadenas.
- **Lo que descartó la vuelta 2**, para que no vuelva: *mi gente* en cualquier opción (la
  palabra de `POLOS.luz`); *Voy por el más ancho* / *Sigo el sonido* (accesibilidad con silla de
  ruedas, y precaución contra imprudencia al volver de noche); *Un papelito de esa noche en el
  bolsillo* (se lee como la entrada cortada); *Cuento los segundos* (impaciencia); *Escucho cada
  palabra* y *Dejo terminar cada tema* (devoción del fan); *Digo cuándo y lo cumplo* (virtud);
  *Saludo y sigo mi rumbo* (corta la charla, que es oscuridad como ausencia de luz); *Me tapo
  como puedo* (aguantar algo malo); *Acepto, cualquier día me va* (apunta a «Ronda en cualquier
  esquina»); *Saco mi crucigrama* (chiste generacional) e *Invento un juego* (se lee social);
  *Hay cosas de esta noche que querés recordar* (recuerdo-homenaje).
- **Dos propuestas de la lectura que la máquina veta**, anotadas para que nadie las vuelva a
  proponer: *Salto de una a otra* cae en `salt*` (el veto del cuerpo) y *Hablo con quien vino
  conmigo* cae en `vino` (el veto del alcohol lee el pasado de *venir*). Las dos eran buenas
  ideas; las dos se resolvieron con otra palabra. Lo del `vino` queda dicho en la sugerencia de
  la vuelta 2, por si el hilo principal prefiere acotar el veto.

## 8. Cómo se verifica

No tengo con qué correrlo (`D-12`); lo corre el hilo principal, `revisor` u `orquestador`:

```
node --test src/lib/dos-ejes/banco.test.ts
node --test src/lib/dos-ejes/partida.test.ts
node --test src/lib/voz.test.ts
node --test src/lib/esquemas.test.ts
node --test src/lib/pisos.test.ts
npm run generar-dos-ejes && node --test src/lib/dos-ejes/tarjetas.test.ts
```

1. **`banco.test.ts`** es la guarda que se escribió antes que el banco, y desde `661bfb9` tiene
   19 pruebas: contra el banco de la vuelta 1 daba 16 de 19 (fallaban la traducción de los
   polos, la firma de un polo y el nombre de una manera). **La vuelta 2 midió a mano los 30
   textos contra las 19**, y en especial contra esas tres: ninguna opción lleva *gente,
   propio, plan, sobre* ni *marcha*; ninguna palabra de tres letras o más está en tres opciones
   de un polo y en ninguna del de enfrente (el máximo es dos: *antes, elijo, saco, pongo, dejo,
   comparto, mando, míos, amigo, familia, alguien, busco, miro*); ninguna opción lleva
   *cualquier* ni otra palabra de los cuatro nombres. Además, 28 caracteres y 5 palabras por
   opción (la más larga mide 27), ningún veto de `BR-36`, ningún `camino` en la vuelta, siete
   cierres con pregunta, los siete distintos, y `¿Qué hacés?` no aparece. **No lo corrí**
   (`D-12`): es el primer comando de la lista.
2. **`partida.test.ts`** estaba en verde (17 de 17 en la última corrida del verificador): el
   sorteo ya es el de los momentos y la vuelta 2 no lo toca (mismos ids, tres por celda).
3. **`voz.test.ts`** ya recorre `momentos[].nombre` y `momentos[].canta` (`cadenasDelBanco`,
   línea 189): la nota anterior de este documento, que decía que no, estaba vieja.
4. **`esquemas.test.ts`** valida el banco contra `CTR-08` v2 (`contratoVersion: 2`, 64 de 64 en
   la última corrida). Los cambios de la vuelta 1 y de la vuelta 2 no tocan la forma: ninguna
   clave nueva, y `nombre` y `canta` de los momentos siguen dentro de 2–24 y 6–80 caracteres.
5. **`tarjetas.test.ts` va a fallar de nuevo hasta que se regeneren las tarjetas**, y no es un
   defecto del contenido: `huellaDelTaller()` entra con las **bajadas** de los cuadrantes, y la
   vuelta 2 cambió las cuatro (`CU-1`..`CU-4`). El comando que dice el propio test es
   `npm run generar-dos-ejes`; lo corre el hilo principal. El taller mide cada bajada y falla
   fuerte si ocupa más de cinco renglones: las nuevas miden entre 137 y 170 caracteres, como
   las de antes, y deberían ocupar cuatro.

## 9. Para `REV-19` y para el hilo principal

**Lo que le pido a `revisor`, en este orden:**

1. Las 15 opciones de `luz`: ¿alguna le queda mal a quien llega sin compañía? (§2, último
   párrafo). Quedan dos que piden teléfono (`EJ-030`, `EJ-036`) y las seis de la previa y de
   `adentro` nombran a alguien; las de la ida, la vereda y la vuelta traen una luz que no le
   pide a nadie.
2. `CU-4` contra las otras tres: la vuelta 2 la reescribió otra vez (*poco encima y los ojos
   abiertos* era el consejo de seguridad para andar de noche); ¿*las manos libres* y *lo que se
   cruza* son un placer como los otros tres?
3. Las escenas reescritas en la vuelta 2, **leídas por alguien que no las escribió** (el que
   escribe siempre se ve las dos opciones con el mismo orgullo): `EJ-029`, `030`, `031`, `032`,
   `033`, `034`, `036`..`039`, `041`..`049`, `051`..`058`. Las más justas para la prueba del que
   no fue: `EJ-043` ("cada afiche" suena a devoción fina), `EJ-037` ("me río con ganas" es la
   oscuridad más alegre), `EJ-055` ("las voces de la calle" se parece a espiar), `EJ-052` ("el
   después" suena literario), `EJ-054` ("una charla de fondo" ¿es luz?) y `EJ-058` ("cuando haga
   falta" ¿es descuido con el aparato?).
4. La lectura de los 30 en voz alta: si una opción suena a excusa o a alarde frente a su gemela.
5. **Las celdas que siguen siendo el mismo dilema con otro objeto** (§4, "Vuelta 2"): la previa
   de `luz-oscuridad` (tres esperas en casa) y la vuelta de `orden-caos` (la mañana, otra fecha,
   un teléfono sin batería).
6. **El momento `adentro`.** Su sello y sus seis escenas dan por hecho que se entró. Las
   escenas se oyen igual desde la vereda (la vuelta 2 sacó "Abren tarde" y el dato técnico de
   los instrumentos), pero el sello dice "Adentro". Es estructural de `D-57` punto 1; la
   sugerencia de la vuelta 2 propone renombrar el sello a *Cuando suena* o dejar escrito que
   adentro también es la vereda del que no entró.

**Lo que le dejo al hilo principal** (nada de esto lo toco, no es mi carpeta):

- **Hecho por el hilo principal desde la vuelta 1** (`Docs/SUGERENCIAS/CNT-para-hilo-principal-vuelta-1-dos-ejes.md`,
  puntos 1, 2 y 3): `POLOS.oscuridad` → `con lo propio`, `PANTALLA_0.subtitulo` → `…de cómo la
  pasás`, el molde de `CONTRASTE` de `CNT-29` v2, la enmienda de `D-57` en `Docs/DECISIONES.md`
  y las palabras que `banco.test.ts` no tenía (más las guardas de traducción y de firma, que la
  sugerencia no pedía). Lo único que queda de aquella sugerencia es `LUGARES.dosEjes`, que la
  vuelta 2 cambió otra vez.
- **Lo nuevo de la vuelta 2**, en `Docs/SUGERENCIAS/CNT-para-hilo-principal-vuelta-2-dos-ejes.md`:
  `LUGARES.dosEjes` → `Se entra con las manos vacías.`, regenerar las tarjetas, que el test de
  firma cuente también `por` y `me`, el veto de `vino`, y el sello de `adentro`.
- Los comentarios de `src/lib/sitio/copy.ts` (`LUGARES`) siguen diciendo "el noveno" y "los ocho":
  ya lo anoté en `CNT-26` §6.
- Un recordatorio de `ESTADO.md`: el posteo 5 del hilo de Twitter describe el rombo y los
  nombres viejos (`D-57`, Consecuencias).

## 10. Vuelta 1 de arreglos (2026-10-04): qué encontró la lectura y qué se hizo

Un verificador adversarial corrió los tests (todos verdes) y **leyó** el banco. Lo que sigue es
lo que ninguna guarda ve y lo que cambió. Los ids `EJ-029`..`EJ-058` se conservan sin huecos
(todavía no se publicó) y cada celda sigue con tres.

| Gravedad | Hallazgo | Qué se hizo |
|---|---|---|
| alta | Las tres de `ida × luz-oscuridad` eran un micro de larga distancia: pasaje por hecho, peregrinación (`RES-160`), una sola clase de gente; la `canta` y el renglón del lugar lo reforzaban | Cero micros: la ida es "el camino" (`EJ-035`..`037` nuevos o reescritos), la `canta` ya no tiene vehículo y el renglón propuesto es otro (§6.4) |
| alta | "Sonrío a quien me mira", "Busco la mirada de alguien", "Hablo con quien tenga cerca", "Armo charla con quien esté": contacto con desconocidos por el sentido | La opción de luz apunta a *mi gente*, *los míos* o a un contacto a distancia (`EJ-035`, `037`, `047`, `048`) |
| alta | `EJ-052`, el punto de encuentro, es una medida de seguridad y cruzaba ejes | Retirado y reemplazado en el mismo id por una decisión de atención ("te preguntan qué te pareció") |
| alta | El costo de `CU-3` era exclusión propia, único costo en el eje luz-oscuridad; la luz no pagaba nunca | Los cuatro costos pasan a `orden-caos` y tienen la misma forma ("Pero cuando alguien…, vos … tenés …"); el placer de `CU-3` ya no es escuchar de lejos |
| alta | `EJ-033`, `056`, `057`: orden era la competencia y caos el descuido ("ya veremos" = no) | `caos` con ganancia y modismo ("cuando me late", "dejo la semana abierta", "cualquier día me va"); `orden` sin "fijo", "marcado" ni "lo importante" |
| media | Vocabulario que delataba el eje: once de quince de orden con *seguir, pensado, fijar, marcado*; cinco de caos con *ver* | Léxico variado (§2). Los delatores nuevos que el test no tiene van en la sugerencia al hilo principal |
| media | `EJ-051`: la señal del pogo y entrar a la multitud | Reemplazado (volver a escuchar una canción) |
| media | `EJ-047`: cerrar los ojos es el gesto de `RES-157` y suena a velorio | "Escucho cada palabra" / "Busco a mi gente" |
| media | El final suena a elegía (asiento tibio, lugar libre en el micro, "lo que quedó", "dejar escrito") | `canta` de la vuelta nueva, renglón nuevo, `EJ-054` y `EJ-058` reemplazados |
| media | Siete de quince de oscuridad eran repliegue | Las siete reemplazadas por un hacer con objeto o atención |
| media | `CU-4` era la bajada más pobre | Reescrita (§5) |
| media | `CU-1` describía un rasgo y no una situación | "…cuando alguien cambia el plan, vos ya tenés la noche acordada" |
| media | `POLOS`: asimetría de calor (*con la gente* contra *por cuenta propia*) | `con lo propio` (§6.1), y pedido de enmienda a `D-57` |
| media | Celdas con el mismo dilema y otro objeto (`ida × L`, `ida × O`, `adentro × L`, `vuelta × L`, y las tres de contar la noche) | Reescritas las dos de `ida`; las otras dos siguen y están dichas (§4); sobre contar la noche queda una sola |
| media | Una noche con una sola clase de gente (ocho de quince de orden-caos con compañía) | Tres de quince suponen compañía |
| media | `EJ-034`, `031`, `042`, `037`: cruces de eje y opciones que miden otra cosa | Los cuatro reescritos |
| media | `EJ-044`: la ubicación asignada de quien va en silla de ruedas | Reemplazado (cómo se mira) |
| baja | `EJ-049` y `EJ-029` con credencial fina | Reescritos |
| baja | Opciones que apuntan a un cuadrante (*hora fija*, *rincón*, *al grupo*) | Sacadas de las opciones. El **(T)** de §2 sobre libro/radio/mochila/mesa/ronda/mapa/esquina se corrigió a **(O)**: el test no lo tiene |
| baja | `PANTALLA_0.subtitulo` dice "cómo sos" | Cambiado a "cómo la pasás" (§6.2): lo aplica el hilo principal |
| baja | Gramática y voz (*juntarse*, *contra el vidrio*, *Elijo la que ya miré*, *Me hago lugar entre voces*, *Resolver* ×2, *un rato largo* ×3, test de revista en `EJ-045` y `EJ-056`) | Todas reescritas o sacadas; `EJ-045` y `EJ-056` ahora con un objeto |
| baja | Secuencias incoherentes por el orden al azar dentro del momento | Ningún enunciado fija un antes o un después dentro del momento (§2, **(O)**) |
| baja | Afirmaciones viejas en este documento (schema en v1, `voz.test` sin los momentos), `R3` en los botones, tres "con" seguidos en `CNT-29` | Actualizadas en el encabezado y en §8. Los ocho botones del §6.2 pasan de R3 a R1 (`voz-ricotera` §5 pone los botones en el registro que canta). El contraste de `CNT-29` pasa a "Con la tuya comparte: con la gente, con plan." (forma nueva en los cuatro casos: `CNT-29` §3) |

## 11. Vuelta 2 de arreglos (2026-10-04): qué encontró la lectura y qué se hizo

Un verificador adversarial corrió los tests sobre el banco de la vuelta 1 y lo leyó otra vez.
`banco.test.ts` dio 16 de 19 (el hilo principal había sumado en `661bfb9` las guardas de
traducción de los polos y de firma de un polo, y el banco no las pasaba), `esquemas.test.ts`
64 de 64 y `voz.test.ts` 15 de 15. Los ids `EJ-029`..`EJ-058` se conservan sin huecos y cada
celda sigue con tres. **Cambiaron 27 de los 30 ítems** (quedan `EJ-035`, `EJ-040` y `EJ-050`),
las cuatro bajadas y dos de los cinco `canta`. Cada ítem cambiado lleva su razón en la
`notaInterna`, con "Vuelta 2" adelante.

| Gravedad | Hallazgo | Qué se hizo |
|---|---|---|
| alta | *Mi gente* en cuatro opciones de luz (*gente* es la palabra de `POLOS.luz`: guarda de traducción) y *los míos* en cuatro (guarda de firma); `EJ-031` casi espejo, y *con lo mío* repetía *con lo propio* | Ninguna opción lleva *gente*; *los míos* queda en dos (`EJ-035`, `048`); las demás nombran a *un amigo*, *mi familia*, *los de casa* o a nadie (§2) |
| alta | `EJ-057`: *cualquier* apunta a «Ronda en cualquier esquina»; *otro recital* da por hecho que se paga otra salida; las dos arrancan con *Acepto* | "Te proponen repetir una noche así": *Cerramos la fecha ahora* / *Acepto, el día que pinte* |
| alta | `EJ-046`: *el más ancho* es accesibilidad con silla de ruedas, y volviendo de noche *seguir el sonido* es la imprudencia presentada como carácter | Escena nueva, sin trayecto: un cambio de horario (*Ajusto mis tiempos* / *Me acomodo a lo nuevo*) |
| alta | `EJ-054`: el papelito de esa noche se lee como la entrada cortada; mostrar o guardar son ritos de reliquia; *esa noche* contradice *ya en casa* | Escena de casa sin objeto de recuerdo: "La casa está en silencio." (*una charla de fondo* / *dibujo en un papel*) |
| media | Firmas que el test descarta: *por* en cinco de orden y ninguna de caos; *Me + verbo* en cuatro de caos y ninguna de orden; *Me…* en cuatro de oscuridad y ninguna de luz | *Por* en una de orden; *Me…* en dos de caos y dos de oscuridad |
| media | `EJ-033`: *lo cumplo* es orgullo moral y *cuando me late*, a quien espera, es descuido | *Le confirmo con tiempo* / *Le aviso cuando salgo*: las dos le contestan |
| media | `EJ-051`: *si me acuerdo* confiesa olvido y *mañana* es agenda artificial | *La escucho en casa, entera* / *La tarareo hasta que pase* |
| media | `EJ-042`: *me tapo como puedo* es aguantar algo malo frente a una solución lista (el defecto de `D-57` punto 4, en una opción) | Las dos resuelven con un alero: *Comparto un alero con otros* / *Espero bajo un alero* |
| media | `EJ-045`: *saco mi crucigrama* es solitario e *invento un juego* se lee social; *abren tarde* da por hecho que se está en la fila | "El sonido de adentro no arranca.": *Saco lo que traje* / *Invento algo con las manos* |
| media | `EJ-043`: saludar a un conocido es luz por construcción y *sigo mi rumbo* corta la charla | Escena nueva con un objeto: "Hay afiches pegados en la pared." |
| media | `EJ-048`: *cuento los segundos* es impaciencia | *Escucho el último eco* |
| media | `EJ-032`: *falta decidir* contradice *lo tengo armado*; *en la puerta* es ambigua | "Estás por salir para un recital. ¿Qué llevás?" y *Lo agarro al salir* |
| media | `orden-caos` mide cinco cosas, y `EJ-034`, `052`, `056` son test de revista sin rastro de la noche | El eje mide una sola (*anticipar o resolver sobre la hora*, §2): `034` es qué te ponés, `052` lo que sigue, `056` la mañana; además `038`, `039`, `044` y `058` |
| media | La noche cuenta una sola clase de gente: cinco opciones de luz mandan algo a distancia y ninguna sirve sin teléfono | Trece de las quince no necesitan teléfono; cuatro son gente presente sin contacto (§2); en la ida, la vereda y la vuelta hay una luz que no le pide a nadie |
| media | Celdas con el mismo dilema y otro objeto: `053`/`055` (llamar/escribir), `036`/`037` (mandar algo), previa × luz-oscuridad | `055` y `037` cambian de naturaleza; `053` pasa a buscar a los de casa; la previa sigue siendo esperar en casa (§4, para `REV-19`) |
| media | Los costos de las bajadas: orden se lee como tener (casi una ventaja) y caos como una falta; `CU-1` y `CU-3` casi idénticas; luz-oscuridad no paga nunca | Los cuatro dicen lo que pasa, con un verbo distinto cada uno (§5); lo de luz-oscuridad es a propósito |
| media | `CU-4`: *poco encima y los ojos abiertos* es el consejo de seguridad para andar de noche; *poco encima* se lee plata; *lo que no estaba anunciado* es abstracto | *Salís con las manos libres y la noche te va mostrando lo que se cruza* |
| media | `EJ-041`: *en un borde, con aire* es lo menos seguro para quien llega sin compañía | *Donde mejor se oye* |
| media | `EJ-047` y `EJ-039`: *escucho cada palabra* y *dejo terminar cada tema* son gestos del fan; `EJ-047` supone entender el idioma | *Sigo la melodía*; `EJ-039` pasa a *cuándo* se elige la música |
| media | `adentro` da por hecho que se entró (sello, `EJ-045`, `EJ-049`, el zumbido) | `EJ-045` y `EJ-049` ya no hablan de abrir ni de instrumentos; el sello no se toca (es de `D-57` punto 1): propuesta en la sugerencia de la vuelta 2 |
| baja | El final suena a recuerdo-homenaje (`EJ-058`, `EJ-054`) | `EJ-058` mira hacia lo práctico; `EJ-054` ya no es un objeto de la noche |
| baja | `Pasto pisado` (la vereda es baldosa; evoca el predio) y `Campera sobre la silla` (la silla vacía) | *Baldosa fría y un parlante lejano*; *Campera puesta, llaves en el bolsillo* |
| baja | `con lo propio` es vago | **No se cambió.** `D-57` (enmienda 1) ya lo dio por bueno, cambiarlo mueve `POLOS`, `CNT-29` y las tarjetas, y el eco que la lectura marcó (`con lo mío` en `EJ-031`) ya no está. Queda dicho para `REV-19`: la alternativa es *a solas* |
| baja | El aviso del molinete se dice cuatro veces con *nada/nadie*, y *la puerta* se lee como chiste | `LUGARES.dosEjes` → *Se entra con las manos vacías.* (§6.4); el aviso explícito queda en el subtítulo |
| baja | Gerundio colgado (`EJ-030`), *Voy de una a otra*, *Leo algo que traje* en oscuridad (`EJ-037`), registro de oficina (`EJ-038`), dato técnico (`EJ-049`), *no se te escapa un acorde* (`CU-3`) | *Mando un audio a alguien*; `EJ-034` y `EJ-037` reemplazados; *paso a paso* y *como pista*; `EJ-049` es el volumen que sube; el placer de `CU-3` es *la noche se te hace a medida* |
| baja | Afirmaciones viejas o falsas en este documento (guardas que "no existían", `partida` 16 de 16, `esquemas` 52 de 52, "ninguna raíz en más de dos de orden", "las dos improvisadas sin excepción") | Actualizadas en el encabezado, §2, §3, §4, §5, §6, §8 y §9 |

