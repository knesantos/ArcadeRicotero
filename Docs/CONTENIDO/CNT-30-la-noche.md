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
  este documento: `EJ-029`..`EJ-058`.
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
  ítems pasan en casa, en la cama, días después o sin lugar fijo (`EJ-057`, `EJ-058`), y en ninguno
  se mueve nadie. Eso cierra, por construcción, el lugar de "volviendo de noche sin compañía".
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

## 5. Las cuatro maneras

Los ids y los polos no se mueven (`D-57` punto 5; lo ata `banco.test.ts`). Cambian nombre y
bajada. Los nombres son los de `D-57`, sin persona gramatical: se dicen igual en "me", "te" y
"le salió".

| Id | Polos | Nombre | Bajada | La línea que nombra |
|---|---|---|---|---|
| `CU-1` | luz + orden | **Mesa larga a las nueve** | Hay una hora, un lugar y gente que te espera: la noche empieza sabiendo adónde va. Pero cuando cambia el rumbo, vos tardás en soltar lo acordado. | Con la gente, con plan. |
| `CU-2` | luz + caos | **Ronda en cualquier esquina** | Te sumás a lo que aparece —una charla, un grupo, un mate en la vereda— y la noche toma forma. Pero cuando alguien pregunta adónde van, vos todavía no tenés respuesta. | Con la gente, sobre la marcha. |
| `CU-3` | oscuridad + orden | **Radio bajita, misma hora** | Tenés tu rincón y tu hora, y desde ahí la noche se escucha entera. Pero cuando alguien te llama para sumarte, vos ya tenés el rincón ocupado. | Por cuenta propia, con plan. |
| `CU-4` | oscuridad + caos | **Mochila liviana, sin mapa** | Vas con lo justo, sin rumbo fijo, y la noche te muestra cosas que nadie buscó. Pero cuando alguien pregunta por dónde anduviste, vos no tenés el recorrido. | Por cuenta propia, sobre la marcha. |

**La forma, que es lo que pidió `D-57`.** Cada bajada es **un placer y un costo, y los cuatro
costos tienen la misma forma**: "Pero cuando *[algo pasa]*, vos *[verbo en presente]* *[cosa]*."
Vos de sujeto en los cuatro. Entre 11 y 13 palabras cada costo; entre 14 y 20 cada placer; entre
27 y 31 el total (techo 36, y 220 caracteres que tenía el schema viejo: ninguna llega a 180).

- **Ninguno de oscuridad se dice como exclusión.** `CU-3` y `CU-4` no dicen "se arma sin vos" ni
  "quedás afuera": el costo de `CU-3` es que vos ya ocupaste el rincón cuando alguien te llama (algo
  que *vos hacés*), y el de `CU-4` es que no tenés el recorrido cuando te lo piden (algo que *no
  tenés*, igual que `CU-2` no tiene respuesta). Los dos costos de caos son hermanos de forma; el de
  `CU-1` y el de `CU-3` también (los dos de orden: soltar y ocupar).
- **Ninguna describe cómo aguantás algo malo.** Ése era el defecto de las bajadas de `CU-3` y
  `CU-4` en `T-127` ("lo resolvés en silencio, antes de que alguien pregunte"; "te lo guardás y lo
  masticás solo"): los de luz describían placeres y los de oscuridad un padecimiento. Acá los
  cuatro placeres son placeres: una noche que sabe adónde va, una noche que toma forma, una noche
  que se escucha entera, una noche que muestra cosas que nadie buscó.
- **Sin género.** Ninguna usa *solo/sola*, ni participio que concuerde con quien juega. (`entera`
  concuerda con la noche; `ocupado`, con el rincón.)
- **Ancladas en la noche, entendibles sin haber ido.** Hora, lugar, grupo, vereda, rincón,
  recorrido: palabras de cualquier salida. Ninguna dice "recital".

**La prueba que pidió el encargo: tapá los nombres, ¿alguna está triste o es más linda?** La
leí cuatro veces, de a una y en fila. Las más cálidas por oído son `CU-1` y `CU-2` (por *gente
que te espera* y *un mate en la vereda*); `CU-3` y `CU-4` quedan más calladas pero no tristes: *se
escucha entera* y *cosas que nadie buscó* son placeres con peso. Si `REV-19` oye una más pobre,
la candidata es **`CU-4`**: *lo justo*, *sin rumbo fijo* y *nadie buscó* se pueden leer como
carencia seguida. Está anotado a propósito: es el primer lugar por donde volvería a mirar.

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

Propongo **`por cuenta propia`**, que no tiene persona y por eso se dice en las tres. Pierde algo
de calor (es un poco de trámite) y a cambio es igual de orgullosa que *con la gente*: no hay
nadie en el mundo que diga "por cuenta propia" con pena. Es **una sola cadena** (`POLOS.oscuridad`)
y se revierte en un minuto si el usuario prefiere el texto literal de `D-57`; lo anoto porque es la
única parte de este documento donde me aparto de la decisión escrita. Los polos se guardan en
minúscula y las dos formas de armar la línea se derivan:

- `polosEnFrase(lo, oc)` → `con la gente, con plan` (sin mayúscula ni punto: va después de un
  dos puntos o adentro de una oración).
- `lineaQueNombra(lo, oc)` → `Con la gente, con plan.` (primera letra en mayúscula, con punto:
  es la línea que va sola debajo del nombre en el resultado).

### 6.2 La tabla

| Clave | Texto | Frente a `copy.ts` | Registro y prueba |
|---|---|---|---|
| **PANTALLA_0** | | | |
| `titulo` | `¿Qué tipo de ricotero sos?` | confirma | R1, 5 palabras, segunda persona. Es el `h1` de `D-51` y no se toca. |
| `subtitulo(momentos, preguntas)` | `Una noche de recital en ${enLetras(momentos)} momentos y ${enLetras(preguntas)} preguntas de cómo sos. No hace falta saber nada ni haber ido.` | cambia (una coma por "y") | R3, dice el mecanismo y lo que no se pide. Es también la `og:description` de la portada. **Los números salen del dato:** `momentos` = `banco.momentos.length` (5) y `preguntas` = `banco.preguntasPorEje * 2` (10), con `enLetras()`. Sin "y listo". Tapado el título: queda esto y el botón, y el que llegó por un enlace sabe qué es y qué tocar. |
| `indiceRotulo` | `Las hojas de la noche` | **cambia** | R3, el rótulo de la etiqueta de papel con los cinco sellos. "Adentro del libro" chocaba con el sello `Adentro`, uno de los cinco que lista: un rótulo que dice "adentro" encima de una lista que contiene "Adentro". "Hojas" es el cuerpo del libro (D-57) y no explica nada. |
| `boton` | `Empezá la noche` | confirma | R3, voseo imperativo. Dice que esto no es una ronda con puntaje. |
| `desafio(nombre, polos)` | `A alguien le salió «${nombre}»: ${polos}. ¿Y a vos?` con `polos` = `polosEnFrase(...)` | **cambia** (la línea llega en minúscula y sin punto, y el punto lo pone la frase) | O. 1 R3 (lo que dice el otro, `ADR-02`), o. 2 R1. Sin verbo de ganar ni superar. Ver los cuatro textos abajo. |
| **POLOS** | | | |
| `luz` | `con la gente` | **cambia** (minúscula; la mayúscula la pone `lineaQueNombra`) | R3, la traducción de la punta. |
| `oscuridad` | `por cuenta propia` | **cambia** (era `Por tu cuenta`; ver 6.1) | R3, sin persona. |
| `orden` | `con plan` | confirma | R3. |
| `caos` | `sobre la marcha` | confirma | R3. |
| `EJES` (`Luz`, `Oscuridad`, `Orden`, `Caos`) | los de hoy | confirma | R3, los rótulos que eligió el usuario (`BR-17`). Siguen en el sello de dos palabras. |
| **PARTIDA** | | | |
| `folio(n, total)` | `${n} de ${total}` | confirma | R3. Orientación, no medición. |
| `anterior` | `Volvé a la anterior` | confirma | R3, voseo (`D-17`). |
| `teclas` | `Teclas 1 y 2 para elegir. Retroceso vuelve.` | confirma | R3, solo con mouse. Sin suspensivos y sin infinitivo en la primera palabra. |
| `anuncio(momento, n, total)` | `${momento}. Pregunta ${n} de ${total}.` | confirma | R3, para el lector de pantalla: el sello (`La previa`) y el folio. |
| **RESULTADO** | | | |
| `rotulo` | `Esta noche te salió` | confirma | R3. "Esta noche" y no "Diste con esto": otra noche puede dar otra manera (`BR-37`). |
| `marca` | `Arcade Ricotero · ¿Qué tipo de ricotero sos?` | confirma | R3, la línea chica arriba de la hoja para que la captura salga con nombre y apellido. |
| `compartir` | `Compartí` | confirma | R3, voseo. |
| `denuevo` | `Empezá otra noche` | confirma | R3. Es lo opuesto a "Probá de nuevo", que sonaba a haber fallado. |
| `bajar` | `Bajá la tarjeta` | confirma | R3, voseo. |
| `volver` | `Volvé al arcade` | confirma | R3, voseo. |
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
| `boton` | `Empezá tu noche` | confirma | R3, voseo. |
| **TARJETA** | | | |
| `meSalio` | `Me salió` | confirma | R1, el arranque de la frase que la tarjeta completa con el nombre. |
| `pregunta` | `¿Y a vos cuál te sale?` | confirma | R1, segunda persona, 6 palabras. |
| `credito` | `Lomo, mármol y esquinero: tapa de Luzbelito (Rocambole, 1996), en baja.` | confirma | R3, dice qué se usa y de dónde. Sin día ni mes de salida: `RES-167` los pone en duda. El año 1996 no está en duda (1-ago o 7-oct, los dos son 1996). Sin óvalo ni figura. |
| `alt(nombre, linea)`, `altJuego` | los de hoy | confirma | R3. Llevan el crédito (`D-21`). |
| **CASETE** (`sitio/copy.ts`) | | | |
| `JUEGOS[«¿Qué tipo de ricotero sos?»].baja` | `Nadie te toma examen. Una noche de recital, sin puntaje y sin saber nada de la banda.` | **cambia** (hoy: `Nadie te toma examen. Diez preguntas sobre vos, sin puntaje y sin saber nada de la banda.`) | La primera frase es la que el portal imprime (`primeraOracion`) y **no cambia**: 4 palabras, R1, y lleva toda la tranquilidad que el casete muestra (`CNT-26` §1.2 la admitió a conciencia). Cambia la segunda: "Diez preguntas sobre vos" pasa a "Una noche de recital", que dice lo que ahora es el juego y **saca el "Diez" escrito a mano** (el relevamiento lo marcó en tres textos). Si se quiere el número, derivarlo del banco con `enLetras()`, no escribirlo. `voz.test.ts` mide la primera frase: 4 ≤ 8. |
| `JUEGOS[...].accion` | `EMPEZÁ` | confirma | R3. |
| `LUGARES.dosEjes` (**opcional**, ver 6.4) | `Hay un lugar libre en el micro.` | cambia, solo si el renglón sigue en la página | R1, 7 palabras, física. Reemplaza `Una vela te alumbra media cara.` por `D-57` punto 9. |

### 6.3 Los textos armados, para leerlos de corrido

**La línea que llega** (`PANTALLA_0.desafio`), para las cuatro:

- A alguien le salió «Mesa larga a las nueve»: con la gente, con plan. ¿Y a vos?
- A alguien le salió «Ronda en cualquier esquina»: con la gente, sobre la marcha. ¿Y a vos?
- A alguien le salió «Radio bajita, misma hora»: por cuenta propia, con plan. ¿Y a vos?
- A alguien le salió «Mochila liviana, sin mapa»: por cuenta propia, sobre la marcha. ¿Y a vos?

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
`UX-36`). Si sigue, propongo **"Hay un lugar libre en el micro."**: siete palabras, objeto y
lugar, no explica, no empuja ningún polo ni nombra uno de los cuatro cuadrantes, no repite
palabra del título ni del subtítulo, y es la imagen exacta del molinete abierto (*hay lugar, pasá*)
sin decirlo. Si el renglón se va, no hace falta nada.

## 7. Lo que descarté, y por qué

- **`Por tu cuenta` como polo** (texto literal de `D-57`): se rompe en la tarjeta y en el desafío
  (§6.1). Queda anotado como el texto de repuesto.
- **Las `canta` del panel**, salvo `adentro`: *Zapatillas atadas*, *rodillas contra el asiento*,
  *choripán*, *garganta rota* y *zapatillas embarradas* presuponen pies, piernas, plata (el puesto,
  `RES-161`), haber gritado, o clima y calle. Cada una está en el §3.
- **Cantar en público como escena.** `EJ-036` nació como "arranca un cántico en el micro: me sumo /
  lo escucho". El caso límite que `D-57` nombra ("cantar con todo el micro"): la opción de `luz`
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
   veto y contra los presupuestos, y verifiqué con `rg` sobre el JSON (ninguna opción de los 30
   pasa de 28 caracteres ni de 5 palabras; ninguno de los vetos aparece en un ítem `listo`; ningún
   delator del eje aparece en una opción; ningún `a pie`, `caminando`, `camino` en la vuelta).
   Lo único que no se puede medir a ojo es el cierre repetido, que sale bien por construcción:
   ningún cierre aparece más de dos veces y `¿Qué hacés?` no aparece.
2. **`partida.test.ts` va a necesitar cambios del hilo principal**: hoy exige "los dos ejes se
   intercalan: nunca tres seguidas del mismo" y el sorteo es el viejo. Con momentos, el sorteo
   cambia. No es de contenido.
3. **`voz.test.ts`** recorre enunciados, opciones, nombres y bajadas del banco, y **no recorre
   `momentos[].nombre` ni `momentos[].canta`**. Los mide `banco.test.ts` por largo y por
   suspensivos, pero ninguna de las siete reglas de voz (anglicismos, folleto, infinitivo, "los
   fans") pasa por ellos. Propongo sumar `momentos` a `cadenasDelBanco()`; es una línea. Es código
   del hilo principal.
4. **`esquemas.test.ts` va a fallar** hasta que `arquitectura` publique `CTR-08` v2: el schema
   que está en `src/data/_schema/dos-ejes.schema.json` tiene `contratoVersion: { const: 1 }`,
   `additionalProperties: false` en la raíz y en el ítem, y no conoce `momentos` ni `momento`.
   Con eso el JSON de este ciclo **no valida todavía**, y no es un defecto del contenido.

## 9. Para `REV-19` y para el hilo principal

**Lo que le pido a `revisor`, en este orden:**

1. Las 15 opciones de `luz`: ¿alguna le queda mal a quien llega sin compañía? (§2, último párrafo).
2. `CU-4` contra las otras tres: ¿es la más pobre?
3. Que `EJ-034`, `EJ-037`, `EJ-039` y `EJ-049` (los cuatro que marqué más justos) pasen la prueba
   de los cuatro lugares **leídos por alguien que no los escribió**. Yo los dejé en ✔, pero el
   que escribe siempre se ve las dos opciones con el mismo orgullo.
4. La lectura de los 30 en voz alta: si una opción suena a excusa o a alarde frente a su gemela.

**Lo que le dejo al hilo principal** (nada de esto lo toco, no es mi carpeta):

- Pegar la tabla del §6.2 en `copy.ts` y `sitio/copy.ts`, con `POLOS` en minúscula y las dos
  funciones `polosEnFrase` / `lineaQueNombra`.
- La nota de `CNT-29` (`Docs/CONTENIDO/CNT-29-el-contraste-al-volver.md`) **cambia el
  `CONTRASTE` provisional**: la forma es otra y dos de los cuatro casos reciben un parámetro más
  (el polo compartido).
- Los comentarios de `src/lib/sitio/copy.ts` (`LUGARES`) siguen diciendo "el noveno" y "los ocho":
  ya lo anoté en `CNT-26` §6.
- Un recordatorio de `ESTADO.md`: el posteo 5 del hilo de Twitter describe el rombo y los
  nombres viejos (`D-57`, Consecuencias).

