# CNT-30 — La noche: el banco, las cuatro maneras y todo lo que se lee en "¿Qué tipo de ricotero sos?"

- **Rol dueño:** `contenido`
- **Fecha:** 2026-10-04, ciclo 18.
- **Estado:** entrega completa, **con la vuelta 1 de arreglos aplicada el 2026-10-04** (el
  verificador adversarial leyó el banco y encontró defectos de lectura que ninguna guarda ve; el
  §10 los lista uno por uno con lo que se hizo). Reemplaza el banco de `CNT-09` (los 20 ítems
  vigentes pasan a `retirado`, ninguno se borra) y suma lo que `CNT-26` §1 y §2.3 dejó
  pendiente. **Las cadenas de pantalla del §6 son la versión que vale**: `src/lib/dos-ejes/copy.ts`
  tiene todavía la versión anterior, y el §6 dice fila por fila qué confirma y qué cambia (la
  vuelta 1 suma tres cambios de copy que son del hilo principal: `POLOS.oscuridad`,
  `PANTALLA_0.subtitulo` y `LUGARES.dosEjes`, más el molde de `CONTRASTE` de `CNT-29`; está
  pedido en `Docs/SUGERENCIAS/CNT-para-hilo-principal-vuelta-1-dos-ejes.md`).
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
  leer algo que se trajo, escuchar cada palabra, contar los segundos, guardar un papel en un
  cajón, hojear una revista—, nunca la ausencia de la de `luz` ni un refugio. Es la lección de
  `T-127` (ocho de diez opciones de `oscuridad` eran un *no hacer*) y la de la vuelta 1: siete de
  quince eran cerrarse, taparse o mirar afuera con melancolía (asomarse a la ventana, la frente
  contra el vidrio, enroscarse en la campera, dormir, la capucha, cerrar los ojos, mirar el
  techo) y **las siete se reemplazaron** por un hacer con objeto o atención.
  **La opción de `luz` no apunta nunca a quien está cerca ni a quien mira** (ese es el veto 6 de
  `BR-36` por el sentido, aunque ningún test lo vea): apunta a gente que ya es de uno ("mi
  gente", "los míos") o a un contacto a distancia (un audio, un mensaje, una foto mandada). Las
  excepciones son dos y están a la vista de `REV-19`: `EJ-041` ("quienes charlan", a distancia de
  una charla, sin hablarles) y `EJ-042` ("con otros": un techo común, no una charla).
- **`orden-caos` = con plan / sobre la marcha**, las dos opciones igual de acompañadas o igual
  de solas. De los 15, **tres se contestan a otra persona** (`EJ-033`, `052`, `057`) y **doce son
  decisiones propias** (`EJ-032`, `034`, `038`, `039`, `040`, `044`, `045`, `046`, `050`, `051`,
  `056`, `058`). La vuelta 1 bajó de ocho a tres las que suponen compañía ("alguien propone",
  "alguien te pasa", "por si se separan") porque una noche con ocho de quince escenas de grupo
  cuenta una sola clase de gente. Ningún ítem mezcla: ese cruce de ejes fue lo que hundió a
  `EJ-019` y lo que la vuelta 1 corrigió en `EJ-034` y `EJ-052`.
- **Ningún polo paga solo, y ninguno confiesa un descuido.** Ni "llego tarde" (la firma de
  `caos`) ni "reviso todo mil veces" (la de `orden`): `EJ-024` y `EJ-016` ya enseñaron que una
  opción que confiesa un defecto se dice con vergüenza y la otra no. La vuelta 1 agregó la mitad
  que faltaba: **`caos` tiene una ganancia dicha con el modismo de quien la tiene** ("cuando me
  late", "cualquier día me va", "llego cuando llego", "sigo el sonido", "las dejo venir"), y
  `orden` no es la competencia (quince opciones que empezaban por seguir, pensar, fijar o marcar
  eran el vocabulario de la eficiencia). Ya no hay una raíz que se repita en más de dos opciones
  de orden ni en más de dos de caos (`cuando` aparece en dos de caos; `una` en dos de orden).
- **(T)** Ninguna opción nombra su eje: ni *luz, oscuro, orden, caos, plan, lista, horario,
  reviso, todo, todos, toda*. **(O)** Y ninguna opción ni bajada de cuadrante repite la palabra
  de otro lugar de la grilla que apuntaría al nombre de un cuadrante antes de que el jugador lo
  conozca: *libro, radio, mochila, mesa, ronda, mapa, esquina, rincón, hora* (la vuelta 1 sacó
  *hora fija* y *rincón* de las opciones; quedan en el nombre y la bajada de `CU-1` y `CU-3`,
  donde son el nombre). **`banco.test.ts` no tiene esta lista** (la versión anterior de este
  documento la marcaba con **(T)** y era falso): lo mira el oído de `REV-19`, y está pedido en
  la sugerencia al hilo principal que se sume al test. Tampoco los delatores que la lectura de
  la vuelta 1 encontró y que el test no tiene: *fij\*, pensad\*, pense, marcad\*, vera, veremos,
  veamos* (el banco nuevo no los usa).

**La voz.**

- **(T)** Enunciado ≤ 14 palabras (el más largo mide 11), opción ≤ 5 palabras y ≤ 28 caracteres
  (la más larga mide 27: `EJ-057`), nada de *che, viste, posta*, ni épica ni psicodelia.
- **(T)** Responde quien juega: segunda persona singular en el enunciado, primera en la opción,
  sin adjetivo con género. Los ítems que mencionan a otros lo hacen como contexto: **`alguien`
  queda en dos enunciados** (`EJ-033`, `EJ-043`; eran ocho y siete de los ocho eran de
  orden-caos: una marca de forma) y el resto usa la forma impersonal ("te preguntan", "te
  proponen", "te pasaron"). Nunca "les toca" ni "arrancan".
- **(T)** Ningún cierre repetido más de tres veces. Quedan 24 enunciados que afirman sin preguntar
  y seis que cierran con una pregunta, **las seis distintas** (`¿Qué hacés con ella?`, `¿Cómo lo
  llenás?`, `¿Dónde te quedás?`, `¿Cómo pasás el rato?`, `¿Dónde te ubicás?`, `¿Qué te sale?`).
  **"¿Qué hacés?" no aparece.** Lo que hizo el banco viejo era una plantilla; lo que hace éste es
  dejar que el enunciado describa y que las opciones contesten solas. **Ni "resolver" ni "un
  rato largo" se repiten en enunciados** (la vuelta 1 los sacó: lenguaje de oficina y un
  tic en tres escenas).
- **(O)** Imagen física y barata: llaves, campera, auriculares, cajón, papelito, revista,
  crucigrama, bolsillo, foto, cartel. El intruso de `voz-ricotera` §4.5 no se busca en las
  opciones: con cinco palabras no hay lugar para él, y forzarlo sería jerga puesta de más
  (el único que se coló es *crucigrama*, `EJ-045`).
- **(O)** Cada momento es independiente del orden: dentro de un momento sale un ítem de cada
  eje en orden al azar y los tres de uno pueden aparearse con los tres del otro (nueve
  parejas, en los dos órdenes). Por eso **ningún enunciado fija un antes o un después dentro del
  momento** (la vuelta 1 sacó "Llegás primero…", "Ya con las llaves en la mano…" y "Falta poco
  para llegar", que armaban secuencias incoherentes). Las seis de la previa pasan en casa
  mientras llega la hora; las de la ida son un camino sin vehículo; las de la vuelta pasan en
  casa, ya de noche, sin orden entre sí.

**Lo que no resolví con reglas y lo dejo a la vista de `REV-19`.** El eje `luz-oscuridad`
tiene 15 opciones de `luz` que suponen que hay gente de uno: *mi gente* (cuatro), *los míos*
(cuatro), un audio, un mensaje, una foto mandada. Después de la vuelta 1 ninguna apunta a quien
está cerca ni a quien mira (ni "quien tenga cerca", ni "sonrío a quien me mira", ni "busco la
mirada de alguien"), pero **para quien no tiene a nadie a quien mandarle un audio sigue siendo
una opción que le queda corta**. Es inherente al polo —*con la gente* es el polo—, y no
encontré cómo aflojarlo sin quedarme sin eje. Lo mismo vale en sentido inverso para el momento
`adentro`: sus seis escenas se oyen igual desde la vereda (la vuelta 1 sacó la pausa técnica que
había que ver y la canción lenta que pedía cerrar los ojos), pero dan por hecho que quien juega
llegó a escucharlas, y eso es estructural de `D-57` punto 1, no de contenido: si se quiere otra
cosa, se reabre el punto, no el banco. Es lo primero que le pido a `REV-19` que mire.

## 3. Los cinco momentos

`nombre` es el sello (registro 3, ≤ 3 palabras). `canta` es la línea de registro 1: ≤ 8 palabras,
cuerpo y objetos, ni un polo empujado, sin suspensivos **(T)**.

| id | Sello | Canta | Por qué esta y no otra |
|---|---|---|---|
| `previa` | La previa | Campera sobre la silla, llaves en el bolsillo. | 8 palabras, justo. Una prenda y un manojo: objetos que cualquiera tiene. La propuesta del panel (*Zapatillas atadas, campera en la mano*) presupone pies y una mano libre. |
| `ida` | La ida | Ruido de fondo, el camino que se estira. | **Cambió en la vuelta 1** (era *Ventanilla empañada, motor que no para*: un micro de larga distancia, el pasaje ya pagado y la peregrinación de `RES-160`). Ahora no hay vehículo ni pasaje: ruido, camino, lo que se estira. 8 palabras. Sin "rodillas contra el asiento" (presupone piernas) y sin mate (empuja `luz`). |
| `vereda` | La vereda | Pasto pisado y un parlante lejano. | Sin "choripán": es el puesto, y el puesto es plata (`RES-161`). El parlante lejano es lo que llega de adentro. |
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
| `EJ-029` | L | Mientras te preparás, suena música. ¿Qué hacés con ella? | La comparto con mi gente | Me pongo los auriculares | **Nuevo en la vuelta 1** (era "Llegás primero…", con la devoción de llegar primero en la premisa). Los auriculares son un objeto y una atención, pero siguen siendo un tapón: es la candidata de oscuridad más cerrada que quedó. |
| `EJ-030` | L | Todavía falta un rato largo para salir. ¿Cómo lo llenás? | Mando un audio contando | Tarareo para adentro | **Cambió** (la B era asomarse a la ventana). "Contando" no dice qué ni a quién: se contesta con un audio a cualquiera que sea de uno. |
| `EJ-031` | L | Esperás la hora de salir. ¿Dónde te quedás? | En lo de los míos | En casa, con lo mío | **Nuevo** (era la invitación, con "Voy directo" = rechazarla). Las dos son un lugar con la misma forma. La A supone que los tuyos tienen casa; la B, que la tuya es un lugar donde estar. |
| `EJ-032` | O | Falta decidir qué llevás a un recital. | Lo tengo armado de antes | Lo resuelvo en la puerta | El más limpio: nada se compra y es *cuándo*, no *qué*. "Resolver" salió del enunciado y quedó en la opción. |
| `EJ-033` | O | Alguien te pregunta cuándo salís. | Digo cuándo y lo cumplo | Salgo cuando me late | **Cambió** (era "Doy una hora fija" / "Digo que ya se verá"). "Cuando me late" es el modismo de quien tiene la libertad; "lo cumplo" puede leerse seco: si `REV-19` lo oye autoritario, es la primera en cambiar. |
| `EJ-034` | O | Te quedan tres cosas por hacer antes de salir. | Las hago una por una | Voy de una a otra | **Nuevo** (era "alguien propone otro rumbo", con orden = decirle que no a quien propone). Decisión propia, sin otra persona. "Una por una" es la raíz del orden que más se parece a la competencia: ojo. |

### La ida

| Id | Eje | Enunciado | Opción A | Opción B | Dónde estuvo más justo |
|---|---|---|---|---|---|
| `EJ-035` | L | El camino se hace largo. ¿Cómo pasás el rato? | Hablo con los míos | Miro qué pasa afuera | **Cambió** (era el micro de "Quedan dos horas de ruta"). Sin vehículo ni pasaje. La B es mirar algo concreto con interés, no apoyar la frente en el vidrio. |
| `EJ-036` | L | Ves algo lindo al pasar y sacás una foto. | La mando enseguida | Me quedo mirándola un rato | **Nuevo** (era "Arranca el micro"). Es otra decisión: qué se hace con lo que se ve. La A supone alguien a quien mandarle; la B, que se mira con ganas, no que se esconde. |
| `EJ-037` | L | Por un tramo, el teléfono no tiene señal. | Dejo mensajes para después | Leo algo que traje | **Nuevo** (era "El micro se detiene…", la escena con respaldo de `RES-160`; se perdió a cambio de una ida sin vehículo). La B supone haber traído algo para leer: lo trae cualquiera, pero ojo. |
| `EJ-038` | O | Te pasaron un papel con indicaciones para llegar. | Lo sigo punto por punto | Lo uso de referencia | **Cambió** (era "Cortan la ruta y hay que elegir otra", con "probar otra salida" del lado del caos: andar un lugar que no se conoce es seguridad). Es la única escena de camino de la celda. Es el ítem más "del que nunca fue": las indicaciones existen porque no todos conocen el lugar. A favor, no en contra. |
| `EJ-039` | O | Vas con música en los oídos. | Dejo terminar cada tema | Voy cambiando de tema | **Cambió** (era el papel de indicaciones, que pasó a `EJ-038`). Decisión propia de atención, sin camino ni otra persona. "Cada tema hasta el final" se parece a un gesto de devoción: ojo. |
| `EJ-040` | O | Te preguntás cuánto falta para llegar. | Saco la cuenta | Llego cuando llego | **Nuevo** (era "alguien pregunta por dónde se entra", que suponía entrada y grupo). Las dos son un modismo. Ninguna opción habla de entrar ni de cuánto cuesta. |

### La vereda

| Id | Eje | Enunciado | Opción A | Opción B | Dónde estuvo más justo |
|---|---|---|---|---|---|
| `EJ-041` | L | Desde adentro llega un sonido lejano. ¿Dónde te ubicás? | Cerca de quienes charlan | En un borde, con aire | "Te ubicás" y no "te parás" (`D-57`). Elegir un sector es una posición, no una postura. |
| `EJ-042` | L | Cae una llovizna fina sobre la vereda. | Busco techo con otros | Me tapo como puedo | **Cambió** (la B era "Me pongo la capucha": previsión contra improvisar). Las dos son improvisadas y activas. "Con otros" es un techo común, no una charla. |
| `EJ-043` | L | Entre la gente, te cruzás con alguien conocido. | Saludo y charlamos un rato | Saludo y sigo mi rumbo | La B no es un desaire: las dos arrancan saludando. "Mi rumbo" es dirección, no un paso. |
| `EJ-044` | O | Hay mucho para mirar en la vereda. | Miro una cosa por vez | Miro lo que me llama | **Nuevo** (era "Llegó el momento de ubicarte": el lugar suele estar asignado para quien va en silla de ruedas). Las dos son una mirada, con el mismo verbo. |
| `EJ-045` | O | Abren tarde y el tiempo no pasa. | Saco mi crucigrama | Invento un juego | **Cambió** (era "Hago lo que tenía pensado" / "Veo qué se me ocurre": test de revista sin imagen). Un objeto contra un hacer inventado, los dos sin consumo. El crucigrama es el intruso del banco. |
| `EJ-046` | O | Hay dos caminos y ninguno tiene cartel. | Voy por el más ancho | Sigo el sonido | **Nuevo** (eran dos puertas abiertas: suponían poder entrar). Vista contra oído; caos tiene su ganancia. "El más ancho" puede leerse como el más seguro: si `REV-19` lo oye así, cambia por otro rasgo de lo que se ve. |

### Adentro

| Id | Eje | Enunciado | Opción A | Opción B | Dónde estuvo más justo |
|---|---|---|---|---|---|
| `EJ-047` | L | Suena una canción lenta. ¿Qué te sale? | Busco a mi gente | Escucho cada palabra | **Cambió** (era "Busco la mirada de alguien" / "Cierro los ojos", el gesto de `RES-157`). Sin cerrar nada. Sin título de canción. "Cada palabra" supone entender el idioma de la canción: es el que `REV-19` mira primero. |
| `EJ-048` | L | Se hace una pausa antes del próximo acorde. | Cuchicheo con los míos | Cuento los segundos | **Cambió** (era "Sonrío a quien me mira": un desconocido por el sentido; y "silencio largo" se lee como minuto de silencio). Las dos son calladas. "Cuento los segundos" es la B más rara que quedó. |
| `EJ-049` | L | Entre un tema y otro, se oye cómo cambian los instrumentos. | Comento lo que pasó | Repaso lo último que sonó | **Cambió** (era la mirada técnica a los cables). Se oye y no se ve: se vive igual desde la vereda. Es el enunciado más largo del banco (11). |
| `EJ-050` | O | Ya pensás cómo contar esta noche. | Voy armando el relato | Lo cuento como salga | **Cambió** (sin "a alguien"). Es la única escena de la noche sobre contar. "Como salga" no es un fracaso: es contarlo al momento. |
| `EJ-051` | O | Una canción se te queda en la cabeza. | La escucho de nuevo mañana | La escucho si me acuerdo | **Nuevo** (era "la música se acelera de golpe": la señal del pogo). Sin cuerpo ni multitud. "Si me acuerdo" puede leerse flojo: es la que pide `REV-19` si le suena a descuido. |
| `EJ-052` | O | Terminó un tema y te preguntan qué te pareció. | Contesto con calma | Contesto al toque | **Nuevo** (era "lugar de encuentro por si se separan": una medida de seguridad, no un temperamento). Decisión de atención, a otra persona, sin separarse en ningún lado. |

### La vuelta

| Id | Eje | Enunciado | Opción A | Opción B | Dónde estuvo más justo |
|---|---|---|---|---|---|
| `EJ-053` | L | Ya en casa, todavía tenés el ruido en el cuerpo. | Llamo a mi gente | Me lavo la cara | Es en casa: no roza el trayecto. "El ruido en el cuerpo" es imagen de oído, no un dato. "Llamar" puede costar saldo: si `REV-19` lo cuenta como plata, cambia por "Le escribo". |
| `EJ-054` | L | Encontrás un papelito de esa noche en el bolsillo. | Lo muestro a los míos | Lo guardo en un cajón | **Nuevo** (era "Pasan los días y esta noche sigue en tu cabeza": la tercera sobre contar la noche y con tono de elegía). Un objeto, un diminutivo, y qué se hace con él. No dice qué papel es. |
| `EJ-055` | L | Es tarde y no te da el sueño. | Escribo a mi gente | Hojeo una revista vieja | **Cambió** (la B era "Miro el techo y pienso", el repliegue). La B es una absorción con un objeto; "revista" es un guiño al test de revista, que ya está retirado. Se parece a `EJ-010` (retirado por otra escena). |
| `EJ-056` | O | Antes de dormir, pensás en la semana que viene. | Anoto qué va cada día | Dejo la semana abierta | **Cambió** (era "Dejo marcado lo importante" / "Mañana veo qué sale": la competencia contra postergar). Es el ítem con menos "noche de recital": se queda en la vuelta porque no es de ninguna otra celda. |
| `EJ-057` | O | Te proponen ir a otro recital. | Acepto y cerramos la fecha | Acepto, cualquier día me va | **Cambió** ("ya veremos cuándo" es en rioplatense la manera amable de decir que no). Las dos aceptan: ninguna rechaza. Habla de fecha, nunca de entrada. |
| `EJ-058` | O | Hay cosas de esta noche que querés recordar. | Empiezo por la primera | Las dejo venir | **Nuevo** (era "Querés dejar escrito algo de esta noche": la tercera sobre contar y con tono de elegía). Es una manera de acordarse, sin escribir. "La primera" supone que cada cosa tiene un lugar en el orden: es el que `REV-19` mira si le suena a escuela. |

**Un cruce que revisé y no encontré:** `EJ-047`, `048` y `049` (los tres de `adentro` en `luz-
oscuridad`) no ubican la obra en el plano: ninguno dice "esta canción es de luz". Las canciones no
tienen título y el acorde no tiene nombre. Es la decisión del usuario en `US-06` y la repite
`D-57` punto 9.

**Tres decisiones distintas por celda, y las dos celdas donde no se logra del todo.** La vuelta 1
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
| `CU-1` | luz + orden | **Mesa larga a las nueve** | Hay una hora, un lugar y gente que te espera: la noche empieza sabiendo adónde va. Pero cuando alguien cambia el plan, vos ya tenés la noche acordada. | Con la gente, con plan. |
| `CU-2` | luz + caos | **Ronda en cualquier esquina** | Te sumás a lo que aparece —una charla, un grupo, un mate en la vereda— y la noche toma forma. Pero cuando alguien pregunta adónde van, vos todavía no tenés respuesta. | Con la gente, sobre la marcha. |
| `CU-3` | oscuridad + orden | **Radio bajita, misma hora** | Tenés tu rincón y tu hora, y desde ahí no se te escapa un acorde. Pero cuando alguien corre la hora, vos ya tenés la tuya puesta. | Con lo propio, con plan. |
| `CU-4` | oscuridad + caos | **Mochila liviana, sin mapa** | Llevás poco encima y los ojos abiertos, y la noche te muestra lo que no estaba anunciado. Pero cuando alguien te pide el camino, vos no lo tenés anotado. | Con lo propio, sobre la marcha. |

**La forma, que es lo que pidió `D-57`.** Cada bajada es **un placer y un costo, y los cuatro
costos tienen la misma forma**: "Pero cuando *alguien* *[hace algo]*, vos *[ya / todavía no]
tenés* *[cosa]*." **Vos de sujeto y *tenés* de verbo en los cuatro**: una situación, nunca un
rasgo de carácter (la versión anterior de `CU-1` decía "vos tardás en soltar lo acordado", el
único costo que describía cómo sos y no qué te pasa). Entre 11 y 12 palabras cada costo; entre
15 y 20 cada placer; entre 27 y 31 el total (techo 36 de `banco.test.ts`; 240 caracteres del
schema v2: ninguna pasa de 170).

- **Ninguno de oscuridad se dice como exclusión, y ninguno de luz queda sin pagar.** La
  versión inicial pagaba el único costo del eje `luz-oscuridad` en `CU-3` ("cuando alguien te
  llama para sumarte, vos ya tenés el rincón ocupado": decir que no a sumarse, o sea exclusión
  propia, espejo exacto del placer de `CU-2`, "te sumás"), y la luz no pagaba nunca. **Ahora
  los cuatro costos son de `orden-caos`**: `CU-1` y `CU-3` (orden) se hacen la misma pregunta
  desde dos lados ("cuando alguien cambia el plan, vos ya tenés la noche acordada" / "cuando
  alguien corre la hora, vos ya tenés la tuya puesta"); `CU-2` y `CU-4` (caos) también ("todavía
  no tenés respuesta" / "no lo tenés anotado"). El placer es lo que distingue `luz-oscuridad`, y
  el costo, lo que distingue `orden-caos`: así ningún polo de un eje paga más que el otro. El
  placer de `CU-3` ("no se te escapa un acorde") dejó de leerse como escuchar de lejos, desde
  casa.
- **Ninguna describe cómo aguantás algo malo.** Ése era el defecto de las bajadas de `CU-3` y
  `CU-4` en `T-127` ("lo resolvés en silencio, antes de que alguien pregunte"; "te lo guardás y lo
  masticás solo"): los de luz describían placeres y los de oscuridad un padecimiento. Acá los
  cuatro placeres son placeres: una noche que sabe adónde va, una noche que toma forma, una noche
  en la que no se te escapa un acorde, una noche que muestra lo que no estaba anunciado.
- **Sin género.** Ninguna usa *solo/sola*, ni participio que concuerde con quien juega.
  (`acordada` concuerda con la noche; `puesta`, con la hora; `abiertos`, con los ojos;
  `anotado`, con el camino; `anunciado`, con lo que muestra la noche.)
- **Ancladas en la noche, entendibles sin haber ido.** Hora, lugar, grupo, vereda, rincón,
  acorde, camino: palabras de cualquier salida. Ninguna dice "recital". (*Acorde* es de cualquier
  música; entra por el momento `adentro`, que ya lo trae.)

**La prueba que pidió el encargo: tapá los nombres, ¿alguna está triste o es más linda?** La
leí cuatro veces, de a una y en fila. Las más cálidas por oído son `CU-1` y `CU-2` (por *gente
que te espera* y *un mate en la vereda*); `CU-3` y `CU-4` quedan más calladas pero no tristes:
*no se te escapa un acorde* y *los ojos abiertos* son placeres con peso. **`CU-4` era la más
pobre** (lo anotó la primera versión y `REV-19` previa lo confirmó): *lo justo* dice plata en
Argentina, *sin rumbo fijo* de noche y por cuenta propia es el retrato de la imprudencia que
`BR-36` saca de las opciones, y *nadie buscó* sumaba una tercera falta, y *por dónde anduviste*
es la pregunta del que se quedó preocupado. La reescribí con lo que propuso la lectura
(*llevás poco encima y los ojos abiertos*; *te pide el camino*), que enumera dos cosas buenas
como las otras tres. Sigue siendo el primer lugar por donde volvería a mirar: *poco encima*
puede leerse como plata, y *lo que no estaba anunciado* es la imagen más abstracta de las cuatro.

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
(**confirma** = igual; **cambia** = hay que tocarlo). Las funciones se escriben como
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
| `LUGARES.dosEjes` (**opcional**, ver 6.4) | `Nadie te pide nada en la puerta.` | **VUELTA 1: cambia** (hoy `copy.ts` de `sitio` dice `Hay un lugar libre en el micro.`), solo si el renglón sigue en la página | R1, 7 palabras, física. Reemplaza `Una vela te alumbra media cara.` por `D-57` punto 9, y la propuesta inicial (`Hay un lugar libre en el micro.`) por la lectura de la vuelta 1: el micro de larga distancia es la peregrinación que `BR-36` llama más de adentro y el lugar libre es la silla vacía. |

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

## 8. Cómo se verifica

No tengo con qué correrlo (`D-12`); lo corre el hilo principal, `revisor` u `orquestador`:

```
node --test src/lib/dos-ejes/banco.test.ts
node --test src/lib/dos-ejes/partida.test.ts
node --test src/lib/voz.test.ts
node --test src/lib/esquemas.test.ts
```

1. **`banco.test.ts`** es la guarda que se escribió antes que el banco. Medí a mano contra cada
   veto y contra los presupuestos, y la vuelta 1 los volvió a medir sobre los 30 textos nuevos
   (ninguna opción pasa de 28 caracteres ni de 5 palabras; ninguno de los vetos aparece en un
   ítem `listo`; ningún delator del eje aparece en una opción; ningún `a pie`, `caminando`,
   `camino` en la vuelta; seis cierres con pregunta, las seis distintas, y `¿Qué hacés?` no
   aparece). **No lo corrí** (`D-12`): lo hizo el verificador antes de la vuelta 1 con 15 de 15,
   y hay que volver a correrlo.
2. **`partida.test.ts`** está en verde (16 de 16, lo corrió el verificador): el sorteo ya es el
   de los momentos.
3. **`voz.test.ts`** ya recorre `momentos[].nombre` y `momentos[].canta` (`cadenasDelBanco`,
   línea 189): la nota anterior de este documento, que decía que no, estaba vieja.
4. **`esquemas.test.ts`** valida el banco contra `CTR-08` v2 (`contratoVersion: 2`, 52 de 52):
   la nota anterior de este documento, que anunciaba que iba a fallar, estaba vieja. Los
   cambios de la vuelta 1 no tocan la forma: ninguna clave nueva.
5. **`tarjetas.test.ts` va a fallar hasta que se regeneren las tarjetas**, y no es un defecto
   del contenido: `huellaDelTaller()` entra con las **bajadas** de los cuadrantes y con `POLOS`,
   y la vuelta 1 cambió tres bajadas (`CU-1`, `CU-3`, `CU-4`) y `POLOS.oscuridad` (cuando el
   hilo principal lo aplique). El comando que dice el propio test es `npm run generar-dos-ejes`;
   lo corre el hilo principal.

## 9. Para `REV-19` y para el hilo principal

**Lo que le pido a `revisor`, en este orden:**

1. Las 15 opciones de `luz`: ¿alguna le queda mal a quien llega sin compañía? (§2, último
   párrafo). La vuelta 1 sacó las cuatro que apuntaban a quien está cerca o mira; las que
   quedan apuntan a *mi gente*, *los míos* o a un contacto a distancia.
2. `CU-4` contra las otras tres: la vuelta 1 la reescribió porque era la más pobre; ¿ahora lo es
   *poco encima* (plata)?
3. Las escenas reescritas, **leídas por alguien que no las escribió** (el que escribe siempre se
   ve las dos opciones con el mismo orgullo): `EJ-029`..`EJ-031`, `033`, `034`, `035`..`040`, `044`..`046`,
   `047`..`049`, `051`, `052`, `054`, `055`, `056`..`058`. Las seis más justas para la prueba del
   que no fue: `EJ-033` ("Digo cuándo y lo cumplo" suena seco), `EJ-039` ("Dejo terminar cada
   tema" es devoción fina), `EJ-046` ("el más ancho" suena a más seguro), `EJ-047` ("cada
   palabra" supone entender la letra), `EJ-051` ("si me acuerdo" suena flojo) y `EJ-058` ("la
   primera" suena a escuela).
4. La lectura de los 30 en voz alta: si una opción suena a excusa o a alarde frente a su gemela.
5. **Las dos celdas que siguen siendo el mismo dilema con otro objeto** (§4, "Tres decisiones
   distintas por celda"): `adentro × luz-oscuridad` y `vuelta × luz-oscuridad`.

**Lo que le dejo al hilo principal** (nada de esto lo toco, no es mi carpeta):

- Los **tres cambios de copy de la vuelta 1** y el molde de `CONTRASTE` (todo en
  `Docs/SUGERENCIAS/CNT-para-hilo-principal-vuelta-1-dos-ejes.md`): `POLOS.oscuridad` →
  `con lo propio`, `PANTALLA_0.subtitulo` → `…de cómo la pasás`, `LUGARES.dosEjes` →
  `Nadie te pide nada en la puerta.`, y `CONTRASTE` con la forma de `CNT-29` v2. Anotar
  `con lo propio` como enmienda de `D-57` en `Docs/DECISIONES.md`.
- Tres palabras que sumar a los delatores de `banco.test.ts` (y una lista que el test no tiene):
  ver la misma sugerencia.
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

