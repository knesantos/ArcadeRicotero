# CNT-30 — La noche: el banco, las cuatro maneras y todo lo que se lee en "¿Qué tipo de ricotero sos?"

- **Rol dueño:** `contenido`
- **Fecha:** 2026-10-04, ciclo 18.
- **Estado:** entrega completa. Reemplaza el banco de `CNT-09` (los 20 ítems vigentes pasan a
  `retirado`, ninguno se borra) y suma lo que `CNT-26` §1 y §2.3 dejó pendiente. **Las cadenas de
  pantalla del §6 son la versión que vale**: `src/lib/dos-ejes/copy.ts` ya tiene una provisional
  que el hilo principal armó de las propuestas del panel, y el §6 dice fila por fila qué confirma
  y qué cambia.
- **Consume:** `D-57` (entera), `US-06`, `BR-17`, `BR-36` y `BR-37` (los escribe `producto` en este
  ciclo; apliqué la lista de vetos que ya vigila `banco.test.ts`, que es su traducción a máquina),
  `CNT-09`, `CNT-02`, `CNT-26`, `REV-07`, `D-14`, `D-17`, `D-21`, `D-33`, `RES-150`..`RES-171`
  (`INV-150`), `.claude/rules/voz-ricotera.md`, `.claude/rules/contenido-json.md`,
  `src/lib/dos-ejes/banco.test.ts` (línea por línea), `src/lib/voz.test.ts`.
- **Produce:** `src/data/dos-ejes.json` versión 2 de `CTR-08` — 5 `momentos`, 4 `cuadrantes`
  con nombres de `D-57` y bajadas nuevas, 28 ítems viejos (`EJ-001`..`EJ-028`, todos `retirado`)
  y **30 ítems nuevos** (`EJ-029`..`EJ-058`, todos `listo`, tres por celda). IDs nuevos de
  este documento: ninguno de `CNT-`; ítems `EJ-029`..`EJ-058`.
- **No hago acá:** el schema (`CTR-08` v2 es de `arquitectura`; el que hay en
  `src/data/_schema/dos-ejes.schema.json` sigue en la versión 1 y **va a rechazar este JSON**
  hasta que lo actualicen: `contratoVersion`, `momentos` y `momento` por ítem), el motor, la isla
  ni el taller de tarjetas.
- **Ninguna ficha `RES-XX` pendiente.** El banco no afirma nada de la banda, así que no tiene
  qué fichar (`CTR-08.5` regla 5). La única escena con respaldo es el micro que se detiene
  en la ruta (`EJ-037`, `RES-160`), y va contada sin decir por qué ni a quién.

## 1. Por qué la noche

`REV-07` encontró que el banco viejo era un test de revista con el título puesto: plantas,
muebles, un asado, una playa. `CNT-09` le dejó la pregunta a `producto`, nadie la contestó y el
juego siguió dos ciclos con veinte escenas que podían vivir en cualquier sitio. `D-57` la contesta
con una sola decisión: **la partida es una noche de recital en cinco momentos**, y la noche es de
cualquiera que sale a ver música.

Tres cosas que esa decisión resuelve de una vez, y que conviene dejar escritas porque son lo que
hay que defender si alguien quiere volver al banco anterior:

1. **El mundo ricotero entra por la escena y no por el dato.** Nadie contesta nada sobre la
   banda: contesta qué hace cuando llega primero a un lugar, cuando el micro se detiene, cuando
   llueve en la vereda. La noche del recital es el ritual de la gente (`INV-150`), contado sin
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
  ítems pasan en casa o días después. Eso cierra, por construcción, el lugar de "volviendo de
  noche sin compañía".
- Sin alcohol, drogas, policía, fuego ni bengalas **(T)**. Sin Bulacio, Olavarría, Cromañón ni la
  muerte del Indio **(T)**; ninguna escena de despedida ni velorio **(T)**.

**Los ejes.**

- **`luz-oscuridad` = con la gente / por tu cuenta**, las dos opciones igual de planeadas o
  igual de improvisadas. En los 15 ítems de este eje las dos opciones son igual de improvisadas;
  la única excepción es `EJ-031`, donde las dos están decididas. La opción de `oscuridad` es siempre **una
  acción que alguien elige hacer** —elegir un rincón, apoyar la frente en el vidrio, cerrar los
  ojos, respirar hondo, ajustar los cables con la mirada—, nunca la ausencia de la de `luz`. Es la
  lección de `T-127`: ocho de diez opciones de `oscuridad` eran un *no hacer*.
- **`orden-caos` = con plan / sobre la marcha**, las dos opciones igual de acompañadas o igual
  de solas. De los 15, ocho se contestan a otra persona (`EJ-033`, `034`, `038`, `040`, `050`,
  `052`, `057` y `039`, que la tiene al lado) y siete son decisiones propias (`EJ-032`, `044`,
  `045`, `046`, `051`, `056`, `058`). Ningún ítem mezcla: ese cruce de ejes fue lo que hundió a
  `EJ-019`.
- **Ningún costo de falla escrito en un solo polo.** Ni "llego tarde" (la firma de `caos`) ni
  "reviso todo mil veces" (la de `orden`): `EJ-024` y `EJ-016` ya enseñaron que una opción que
  confiesa un defecto se dice con vergüenza y la otra no.
- **(T)** Ninguna opción nombra su eje: ni *luz, oscuro, orden, caos, plan, lista, horario,
  reviso, todo, todos, toda*. Y ninguna opción lleva *libro, radio, mochila, mesa, ronda, mapa*
  ni *esquina*, que apuntarían al nombre de un cuadrante antes de que el jugador lo conozca.

**La voz.**

- **(T)** Enunciado ≤ 14 palabras (el más largo mide 12), opción ≤ 5 palabras y ≤ 28 caracteres
  (dos miden 28: `EJ-040` y `EJ-049`), nada de *che, viste, posta*, ni épica ni psicodelia.
- **(T)** Responde quien juega: segunda persona singular en el enunciado, primera en la opción,
  sin adjetivo con género. Los ítems que mencionan a otros lo hacen como contexto ("alguien
  propone", "alguien te pasa"): nunca "les toca" ni "arrancan".
- **(T)** Ningún cierre repetido más de tres veces. Quedan 24 enunciados que afirman sin preguntar
  y seis que cierran con una pregunta, cinco distintas (`¿Cómo lo llenás?`, `¿Cómo te
  acomodás?`, `¿Dónde te ubicás?`, `¿Cómo lo resolvés?`, `¿Qué te sale?` dos veces). **"¿Qué
  hacés?" no aparece.** Lo que hizo el banco viejo era una plantilla; lo que hace éste es
  dejar que el enunciado describa y que las opciones contesten solas.
- **(O)** Imagen física y barata: llaves, campera, ventanilla, vidrio, rincón, techo, cables,
  capucha, papel. El intruso de `voz-ricotera` §4.5 no se busca en las opciones: con cinco
  palabras no hay lugar para él, y forzarlo sería jerga puesta de más.

**Lo que no resolví con reglas y lo dejo a la vista de `REV-19`.** El eje `luz-oscuridad`
quedó con 15 opciones de `luz` que dicen *alguien, quien, la gente, los de al lado*. Para quien
llega sin compañía ninguna es un riesgo (se resuelven con un mensaje, una charla, una sonrisa), pero
son opciones que suponen que hay alguien. Es inherente al polo —*con la gente* es el polo—, y no
encontré cómo aflojarlo sin quedarme sin eje. Es lo primero que le pido a `REV-19` que mire.

## 3. Los cinco momentos

`nombre` es el sello (registro 3, ≤ 3 palabras). `canta` es la línea de registro 1: ≤ 8 palabras,
cuerpo y objetos, ni un polo empujado, sin suspensivos **(T)**.

| id | Sello | Canta | Por qué esta y no otra |
|---|---|---|---|
| `previa` | La previa | Campera sobre la silla, llaves en el bolsillo. | 8 palabras, justo. Una prenda y un manojo: objetos que cualquiera tiene. La propuesta del panel (*Zapatillas atadas, campera en la mano*) presupone pies y una mano libre. |
| `ida` | La ida | Ventanilla empañada, motor que no para. | Sin "rodillas contra el asiento" (presupone piernas) y sin mate (empuja `luz`). El motor no dice a qué viaja ni cómo. |
| `vereda` | La vereda | Pasto pisado y un parlante lejano. | Sin "choripán": es el puesto, y el puesto es plata (`RES-161`). El parlante lejano es lo que llega de adentro. |
| `adentro` | Adentro | Bombo en el pecho, primer acorde. | Se queda como la trajo el panel: el bombo se siente con el cuerpo que sea y "primer acorde" no nombra ningún tema. |
| `vuelta` | La vuelta | El asiento tibio, el ruido que queda. | Sin "garganta rota" (presupone haber gritado) ni "zapatillas embarradas" (clima, calle y pies). Lo que queda en el oído es de quien estuvo, y de quien lo imagina. |

**La prueba de que ninguna empuja un polo.** Tapé las cinco y las leí en fila: ninguna dice
"con la gente" ni "por tu cuenta", ninguna dice hora ni improvisación. La más cargada es la
`ida` (hay motor, hay ventanilla) y no inclina.

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
| `EJ-029` | L | Llegás primero al lugar donde se juntan. | Charlo con quien llegue | Elijo un rincón y miro | La A supone que llega alguien; "quien llegue" lo deja abierto. La B es una acción (elegir, mirar), no un esperar. |
| `EJ-030` | L | Todavía falta un rato largo para salir. ¿Cómo lo llenás? | Mando un mensaje al grupo | Me asomo a la ventana | La A supone un grupo al que escribirle. Se contesta igual con un mensaje a cualquiera. |
| `EJ-031` | L | Te invitan a juntarse antes de un recital. | Voy a la juntada | Voy directo al recital | Las dos decididas (no improvisadas). La "juntada" supone amigos; la invitación ya los pone. |
| `EJ-032` | O | Falta resolver qué llevás a un recital. | Lo dejo decidido de antes | Lo decido en la puerta | El más limpio: nada se compra y es *cuándo*, no *qué*. |
| `EJ-033` | O | Alguien te pregunta cuándo vas a salir. | Doy una hora fija | Digo que ya se verá | "Ya se verá" puede leerse evasivo. Quedó sin "llego tarde" a propósito. |
| `EJ-034` | O | Ya con las llaves en la mano, alguien propone otro rumbo. | Prefiero seguir lo pensado | Me prendo al cambio | "Prefiero" le da voz propia al polo `orden`; si `REV-19` lo lee terco, es el primero en caer. |

### La ida

| Id | Eje | Enunciado | Opción A | Opción B | Dónde estuvo más justo |
|---|---|---|---|---|---|
| `EJ-035` | L | Quedan dos horas de ruta. | Hablo con quien tenga cerca | Apoyo la frente al vidrio | "Quien tenga cerca" supone gente al lado: en un micro la hay. |
| `EJ-036` | L | Arranca el micro. ¿Cómo te acomodás? | Me hago lugar entre voces | Me enrosco en la campera | La campera presupone frío. Es el objeto más barato que hay. |
| `EJ-037` | L | El micro se detiene un rato largo en la ruta. | Armo charla con quien esté | Duermo un rato | "Duermo un rato" es la opción más corta del banco: ojo si se lee pasiva. Es la escena del micro roto (`RES-160`) sin decir por qué. |
| `EJ-038` | O | Cortan la ruta y hay que elegir otra. | Propongo el desvío marcado | Propongo probar otra salida | La A supone que hay un desvío señalizado. Las dos le proponen algo a otros. |
| `EJ-039` | O | Alguien te pasa un papel con indicaciones para llegar. | Lo sigo punto por punto | Lo uso de referencia | Es el ítem más "del que nunca fue": las indicaciones existen porque no todos conocen el lugar. A favor, no en contra: es la escena que *no* pide haber ido. |
| `EJ-040` | O | Falta poco para llegar y alguien pregunta por dónde se entra. | Digo que sigamos las señales | Digo que veamos al llegar | 28 caracteres en las dos. Ninguna opción habla de entrar ni de cuánto cuesta. |

### La vereda

| Id | Eje | Enunciado | Opción A | Opción B | Dónde estuvo más justo |
|---|---|---|---|---|---|
| `EJ-041` | L | Desde adentro llega un sonido lejano. ¿Dónde te ubicás? | Cerca de quienes charlan | En un borde, con aire | "Te ubicás" y no "te parás" (`D-57`). Elegir un sector es una posición, no una postura. |
| `EJ-042` | L | Cae una llovizna fina sobre la vereda. | Busco techo con otros | Me pongo la capucha | La capucha presupone abrigo y el techo presupone techo. Las dos son respuestas activas a la misma lluvia. |
| `EJ-043` | L | Entre la gente, te cruzás con alguien conocido. | Saludo y charlamos un rato | Saludo y sigo mi rumbo | La B no es un desaire: las dos arrancan saludando. "Mi rumbo" es dirección, no un paso. |
| `EJ-044` | O | Llegó el momento de ubicarte. ¿Cómo lo resolvés? | Voy al lugar que pensé | Me ubico donde me toque | "El lugar que pensé" se puede pensar sin haber estado: es una idea. |
| `EJ-045` | O | Pasa un rato largo antes de que abran. | Hago lo que tenía pensado | Veo qué se me ocurre | Las dos callan *qué* se hace: si no, entra el consumo. |
| `EJ-046` | O | Hay dos puertas abiertas y ninguna tiene cartel. | Elijo la que ya miré | Voy por la primera | "Ya miré" es mirar desde afuera. Ninguna habla de entrar ni de cuánto cuesta. |

### Adentro

| Id | Eje | Enunciado | Opción A | Opción B | Dónde estuvo más justo |
|---|---|---|---|---|---|
| `EJ-047` | L | Suena una canción lenta. ¿Qué te sale? | Busco la mirada de alguien | Cierro los ojos | Cerrar los ojos supone vista; la A, alguien. Las dos son un gesto de la cara, igual de íntimas. Sin título de canción. |
| `EJ-048` | L | Hay un silencio largo antes del próximo acorde. | Sonrío a quien me mira | Respiro hondo y escucho | "Quien me mira" supone alguien mirando. Las dos son calladas. |
| `EJ-049` | L | Cambian los instrumentos y hay una pausa. | Comento lo que pasó | Miro cómo ajustan los cables | La B es la más rara del banco (la mirada técnica). 28 caracteres justos. |
| `EJ-050` | O | Ya pensás cómo le vas a contar esta noche a alguien. | Voy armando el relato | Se lo cuento como salga | "Como salga" no es un fracaso: es contarlo al momento. |
| `EJ-051` | O | Cambia el ritmo: la música se acelera de golpe. ¿Qué te sale? | Sigo mi compás | Me dejo llevar | "Compás" y "llevar" son actitud, no movimiento: no piden saltar. El más largo de los enunciados (12). |
| `EJ-052` | O | Alguien propone un lugar de encuentro por si se separan. | Lo fijo en la cabeza | Nos encontramos igual | La A es mental. La B supone un grupo que se reencuentra. |

### La vuelta

| Id | Eje | Enunciado | Opción A | Opción B | Dónde estuvo más justo |
|---|---|---|---|---|---|
| `EJ-053` | L | Ya en casa, todavía tenés el ruido en el cuerpo. | Llamo a alguien | Me lavo la cara | Es en casa: no roza el trayecto. "El ruido en el cuerpo" es imagen de oído, no un dato. |
| `EJ-054` | L | Pasan los días y esta noche sigue en tu cabeza. | La cuento cada tanto | La repaso para mí | Pasan días: sin trayecto. La B no es esconder, es repasar. |
| `EJ-055` | L | Es tarde y no te da el sueño. | Le escribo a alguien | Miro el techo y pienso | Es en la cama. Se parece a `EJ-010` (retirado por otra escena), con la diferencia de que acá la B no escribe en un cuaderno. |
| `EJ-056` | O | Antes de dormir, pensás en la semana que viene. | Dejo marcado lo importante | Mañana veo qué sale | Es el ítem con menos "noche de recital": se queda en la vuelta porque no es de ninguna otra celda. |
| `EJ-057` | O | Alguien te propone ir a otro recital. | Acepto y fijamos la fecha | Acepto y ya veremos cuándo | Las dos empiezan con "acepto": ninguna rechaza. Habla de fecha, nunca de entrada. |
| `EJ-058` | O | Querés dejar escrito algo de esta noche. | Empiezo por el principio | Empiezo por lo que quedó | Las dos son una manera de escribir, no una falla. Papel y lápiz no entran en la escena. |

**Un cruce que revisé y no encontré:** `EJ-047`, `048` y `049` (los tres de `adentro` en `luz-
oscuridad`) no ubican la obra en el plano: ninguno dice "esta canción es de luz". Las canciones no
tienen título y el acorde no tiene nombre. Es la decisión del usuario en `US-06` y la repite
`D-57` punto 9.

<!-- CONTINUA -->
