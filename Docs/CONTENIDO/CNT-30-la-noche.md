# CNT-30 — La noche: el banco, las cuatro maneras y todo lo que se lee en "¿Qué tipo de ricotero sos?"

- **Rol dueño:** `contenido`
- **Fecha:** 2026-10-04, ciclo 18.
- **Estado:** entrega completa, **con las vueltas 1, 2, 3 y 4 de arreglos aplicadas el 2026-10-04**
  (un verificador adversarial leyó el banco cuatro veces y encontró defectos de lectura que ninguna
  guarda ve; §10, §11, §12 y §13 listan los de cada vuelta con lo que se hizo). **La vuelta 3 es la
  que más movió** (los 30 ítems, las cuatro bajadas y el renglón del lugar); **la vuelta 4 es la
  última y cierra lo que quedaba**: la luz sin parentesco ni distracción del que no mira, con
  teléfono en un tercio como máximo (`D-57`, enmienda 7); 25 de los 30 ítems, las bajadas de
  `CU-3` y `CU-4` y dos líneas que cantan. **Las tablas de §2, §3, §4 y §5 describen el banco tal
  como está después de la vuelta 4**; §10 a §12 son historia y no se reescriben. Reemplaza el banco
  de `CNT-09` (los 20 ítems vigentes pasan a `retirado`, ninguno se borra) y suma lo que `CNT-26` §1
  y §2.3 dejó pendiente. **Las cadenas de pantalla del §6 son la versión que vale**; el §6 dice fila
  por fila qué confirma y qué cambia frente a `copy.ts`. Lo que queda para el hilo principal está
  en `Docs/SUGERENCIAS/CNT-para-hilo-principal-vuelta-4-dos-ejes.md`.
- **Consume:** `D-57` (entera, con sus enmiendas 1 a 7), `D-58`, `US-06`, `BR-17`, `BR-36` y `BR-37`
  (apliqué la lista de vetos que vigila `banco.test.ts`, que es su traducción a máquina),
  `CNT-09`, `CNT-02`, `CNT-26`, `REV-07`, `D-14`, `D-17`, `D-21`, `D-33`, `RES-150`..`RES-171`
  (`INV-150`), `.claude/rules/voz-ricotera.md`, `.claude/rules/contenido-json.md`,
  `src/lib/dos-ejes/banco.test.ts` (línea por línea), `src/lib/voz.test.ts`.
- **Produce:** `src/data/dos-ejes.json` versión 2 de `CTR-08` — 5 `momentos`, 4 `cuadrantes`
  con nombres de `D-57` y bajadas nuevas, 28 ítems viejos (`EJ-001`..`EJ-028`, todos `retirado`)
  y **30 ítems nuevos** (`EJ-029`..`EJ-058`, todos `listo`, tres por celda, sin huecos). IDs
  nuevos de este documento: `EJ-029`..`EJ-058`.
- **No hago acá:** el schema (`CTR-08` v2 es de `arquitectura`, en
  `src/data/_schema/dos-ejes.schema.json`), el motor, la isla ni el taller de tarjetas.
- **Ninguna ficha `RES-XX` pendiente.** El banco no afirma nada de la banda, así que no tiene
  qué fichar (`CTR-08.5` regla 5). Ninguna escena lleva respaldo de `INV-150`.
- **No lo corrí** (`D-12`). Cada texto de la vuelta 4 lo medí a mano contra las 19 pruebas de
  `banco.test.ts` (también la firma de un polo, por raíces, con una tabla de las 60 opciones), las
  siete de `voz.test.ts` y el schema; el comando que lo corre está en el §8.

## 1. Por qué la noche

`REV-07` encontró que el banco viejo era un test de revista con el título puesto: plantas,
muebles, un asado, una playa. `CNT-09` le dejó la pregunta a `producto`, nadie la contestó y el
juego siguió dos ciclos con veinte escenas que podían vivir en cualquier sitio. `D-57` la contesta
con una sola decisión: **la partida es una noche de recital en cinco momentos**, y la noche es de
cualquiera que sale a ver música.

Tres cosas que esa decisión resuelve de una vez, y que conviene dejar escritas porque son lo que
hay que defender si alguien quiere volver al banco anterior:

1. **El mundo ricotero entra por la escena y no por el dato.** Nadie contesta nada sobre la
   banda: contesta qué hace con la música mientras se prepara, cuando llueve en la vereda, cuando
   sube el volumen. La noche del recital es el ritual de la gente (`INV-150`), contado sin
   dueño. `BR-17` prohíbe ejes que midan conocimiento; no prohíbe escenas del ritual. Lo que no
   puede pasar es lo que mató a `EJ-011`: que una de las dos opciones sea *más de adentro* que la
   otra. Eso se mide ítem por ítem con la prueba de los cuatro lugares (§4).
2. **El orden de las preguntas deja de delatar el eje.** En el banco viejo el sorteo intercalaba
   ABAB y la alternancia se leía. Ahora cada momento trae un ítem de cada eje en orden al azar
   adentro del momento: la secuencia la manda la noche.
3. **Tres por celda son tres noches seguidas sin repetir una escena** (`BR-37`). Con 30 ítems
   la segunda partida ya no repite la mitad.

Y una consecuencia de oficio: los ítems viejos no se rescatan. Eran buenos por separado
(`REV-07`, `CNT-09` §T-127) pero ninguna escena era de la noche. Pasan a `retirado` con la nota
que pidió `D-57` y se quedan donde estaban (`Docs/IDS.md`: un id no se recicla).

## 2. Las reglas que apliqué

Las de `D-57` y `BR-36`, más las que ya vigila `banco.test.ts`. Marco con **(T)** las que una
máquina mira, y con **(O)** las que lee el oído de `REV-19`. **Lo que sigue describe el banco tal
como está después de la vuelta 4**, y cada número se contó sobre el JSON.

**La noche.**

- **(T)** Un ítem de cada eje por momento; ítems `listo` con `momento`; tres por celda; 30 en total.
- El recital es "un recital", sin dueño, en presente. Nunca la banda, sus temas, el Indio, misa,
  pogo ni aguante **(T)**; ni una canción nombrada: son "un tema", "una canción lenta", sin título.
- Nada que pida haber ido, saber o tener algo. Plata: ni entrada, ni puesto, ni remera, ni
  comprar, ni pagar **(T)**, ni lo que la presupone sin decirla.
- **Un cuerpo capaz de algo no es temperamento.** "Te ubicás", nunca "te parás". Nada de saltar,
  multitud apretada, "en el medio", correr **(T)**. Los gestos del cuerpo que quedan (*muevo la
  cabeza despacio*, *marco el compás*, *tamborileo en la rodilla*, *aplaudo*) se hacen sentado.
  *Silbar* se sacó (es una capacidad que no todos tienen) y *respirar hondo* también (en una pausa,
  a cuatro meses del 5 de junio, se leía como minuto de silencio).
- **Seguridad no es temperamento.** Ni "a dedo", ni "desconocidos", ni volver a pie, ni
  "caminando" **(T)**. Y la versión fina que ninguna máquina ve: **la vuelta no tiene trayecto**
  (sus seis ítems pasan en casa) y **ninguna luz de ningún momento apunta a quien está cerca sin
  ser de uno** (la vuelta 3 sacó *quienes charlan*, *con otros* y *las voces de la calle*, los tres
  desconocidos por el sentido).
- Sin alcohol, drogas, policía, fuego ni bengalas **(T)**. Sin Bulacio, Olavarría, Cromañón ni la
  muerte del Indio **(T)**; ninguna escena de despedida ni velorio **(T)**. Ningún `último` ni
  `mano` en una canción lenta, ningún `eco`: a cuatro meses del 5 de junio se leían como homenaje.

**Los ejes.**

- **`luz-oscuridad` = con la gente / con lo propio** (`POLOS`, `copy.ts`). La opción de
  `oscuridad` es siempre **un hacer con ganas, con un objeto o con el cuerpo** —subir el volumen,
  tamborilear, tararear, buscarle un detalle a una foto, elegir un favorito, mover la cabeza,
  marcar el compás, que te retumbe en la panza, quedarte con la noche, prepararte un té, dibujar
  en un papel—, nunca la ausencia de la de `luz`, nunca un refugio, nunca taparse (la vuelta 3
  sacó *auriculares*, *para adentro*, *afuera* y *el último eco*; la 4, *silbar*, *respirar hondo*
  y *palmas*).
  **Qué puede suponer una luz (vuelta 4, `D-57` enmienda 7).** Tres vueltas empujaron la luz de un
  lado al otro: con alguien presente excluía a quien fue sin compañía; sin nadie al lado pasó a
  mandar mensajes y excluyó a quien no tiene saldo; con *mi hermana* o *mis viejos* excluyó a quien
  no los tiene. Ninguna luz es posible sin otro: **es la definición del eje** (`BR-17`). Queda así,
  y es lo que mide `REV-19` sobre el banco entero:
  1. **Puede suponer a alguien**, en el enunciado, al lado o a distancia.
  2. **No puede nombrar un parentesco** (cero en el banco: salieron *mi vieja*, *mis viejos*, *mi
     hermana*, *mi prima*), ni hablar con desconocidos, ni ser la distracción del que no mira
     (filmar, cuchichear durante el tema). Las personas que quedan son *una amiga* (`031`),
     *un amigo* (`042`), *los míos* (`035`, `043`), *quien quiero* (`036`, `053`) y *alguien*
     (`037`, `054`); la forma "alguien tuyo" vive en los enunciados (`029`, `047`). No se puede
     decir *quien vino con vos* en una opción: el veto del alcohol lee *vino*.
  3. **Teléfono, como mucho en un tercio** (cinco de quince): `029` (te manda un tema), `031` (le
     escribo a una amiga), `036` (la mando a quien quiero), `042` (aviso a un amigo) y `055`
     (escribo en el grupo). **Es el tope de la enmienda; la lectura pedía cuatro y no lo sigo**:
     cada momento necesita una luz posible para quien volvió o fue sin compañía, y en la ida, la
     vereda, la previa y la vuelta la única que se puede hacer solo es la del mensaje. En
     `Cuando suena` esa luz la da el resto de la sala (`048` *aplaudo con el resto*, `049` *grito
     con el resto*): sin teléfono y sin hablarle a nadie. Dos luces se dicen en voz alta o por
     mensaje y no las cuento (`041` *le cuento cómo me suena*, `053` *le cuento a quien quiero*);
     si `REV-19` las cuenta, son siete y el tope se pasa.
  4. **Una persona puesta por el enunciado** y las dos opciones le contestan: `EJ-029` (te manda
     un tema) y `EJ-047` (alguien tuyo la sabe, *la canto a dúo*). Las únicas que piden al otro al
     lado son `035` y `043` (*los míos*), `030` (*la subo para compartirla*) y `047`: una en la
     previa, la ida, la vereda y `Cuando suena`, y la vuelta ninguna. **La regla "una por celda"
     de la vuelta 3 se sacó**: la enmienda 7 la reemplaza por "que en cada momento haya una luz
     posible sin nadie al lado", y eso lo cumplen los cinco.
  **"Mi gente" no está en ninguna** (`gente` es la palabra con la que el resultado traduce la luz;
  la guarda de traducción la veta) y **"un amigo" en masculino aparece una sola vez** (`EJ-042`):
  el sitio eligió no ponerle género a nadie.
- **`orden-caos` = con plan / sobre la marcha**, las dos opciones igual de acompañadas o igual de
  solas. De los 15, **dos se contestan a otra persona** (`EJ-033`, `057`) y trece son decisiones
  propias. **El eje mide una sola cosa**: *anticipar o resolver sobre la hora*, siempre dentro
  de la noche (qué llevás, cuándo salís, qué te ponés, qué hacés si llueve, la música del camino,
  el camino que falta, qué hacés con la campera, qué hacés mientras no empieza o empieza más
  tarde, cómo contar la noche, una canción pegada, qué hacés con el oído, la sed antes de dormir,
  otro día, un parlante prendido).
- **Ningún polo paga solo, y ninguno confiesa un descuido.** Ni "llego tarde" ni "reviso todo mil
  veces". `caos` tiene una ganancia dicha con el modismo de quien la tiene (*al vuelo*, *en un
  rato*, *según el humor*, *si llueve, llueve*, *sin mirar*, *me dejo llevar*, *lo tomo como
  viene*, *de una*, *así me gusta*, *nomás*), y `orden` también tiene su modismo y su imagen
  física (*las dejo juntas desde antes*, *llevo algo por si llueve*, *lo parto en tramos*, *me
  abrigo en capas*, *el mazo de cartas*, *me pongo algodón*, *un vaso de agua*, *el cargador*),
  no el vocabulario de la eficiencia: la vuelta 3 sacó *definir*, *ajustar*, *confirmar*,
  *cerrar* y *de antemano*. La vuelta 4 sacó los tres *Ya* de orden (`034`, `045`, `052`) y los
  dos *Voy* + gerundio (`040`, `050`), que ninguna palabra-guarda contaba porque tienen dos o tres
  letras, y tres modismos de caos que eran una excusa conocida (*ya voy*, *el día que pinte*)
  o confesaban un descuido (*llego cuando llego*).
- **La sintaxis tampoco delata el polo** (lo que la vuelta 3 midió y la 2 no): en la vuelta 2, 12
  de 15 opciones de caos llevaban subordinada (7 en subjuntivo) contra 1 de 15 en orden, y la raíz
  *sal-* estaba en 4 de caos y 0 de orden. Ahora **caos lleva subordinada en 3** (`038` *si
  llueve*, `046` *como viene*, `056` *si hace falta*, **ninguna en subjuntivo**) y **orden en 3**
  (`034` *qué me pongo*, `038` *por si llueve*, `050` *qué voy a contar*); ninguna opción lleva
  *sal-* ni *cuando*.
- **(T)** Ninguna opción nombra su eje ni lo delata (*luz, oscur\*, orden\*, caos, plan, lista,
  horario\*, reviso, todo/a/os/as, fij\*, pensad\*, marcad\*, vera, veamos, veremos*) ni dice
  *gente, propio, plan, sobre, marcha* (la guarda de traducción). **(T)** Ninguna palabra de tres
  letras o más —ni `me`, `mi`, `por`— está en tres opciones de un polo y en ninguna del de
  enfrente. **(O)** Y lo que el test no ve, porque cuenta palabras exactas y no raíces (la vuelta 4
  las contó una por una, sobre las 60 opciones): **ninguna raíz se repite en más de dos opciones de
  un polo, salvo `me` en tres de oscuridad** (`035`, `049`, `053`), que pasa la guarda porque la
  luz de enfrente la trae una vez (`me` en `EJ-041`, *cómo me suena*); `mi`/`míos` ya no pasa de
  dos en luz (`043` y `035`: *mi favorito* está en oscuridad). Raíces en dos: *quien-* y *quier-*
  (`036`, `053`), *algui-* (`037`,
  `054`), *cuent-* (`041`, `053`), *escrib-* (`031`, `055`), *resto* (`048`, `049`), *míos* (`035`,
  `043`) en luz; *tarar-* en las dos (luz `037`, oscuridad `031`, `035`); *escuch-* y *busc-* en
  oscuridad; *dej-* (`032`, `056` en orden; `040`, `051` en caos), *pong-* (`034`, `052` en orden),
  *elij-* (`039`, `050`), *que* (`034`, `050`) y *rato* (`033`, `044` en caos).
- **(O)** **Ninguna opción repite una palabra de más de tres letras de una bajada de cuadrante**
  (la vuelta 2 tenía `cuenta`, `manos`, `charla` y `sale` repetidas, que desde la segunda noche
  apuntaban a una manera): la comparé una por una, con las bajadas de `CU-3` y `CU-4` ya
  reescritas (entraron *puntada*, *hilo*, *manos*, *libres*, *abre*, *alegra*; salieron *trae* y
  *pesa*). **La única excepción es `alguien` (`EJ-037`, `054`)**, que está en las cuatro bajadas
  por la forma común ("Pero cuando alguien…") y por eso no apunta a ninguna; `cuando` ya no está
  en ninguna opción. **(T)** Y ninguna dice una palabra de los
  cuatro nombres (*mesa, larga, nueve, ronda, cualquier, esquina, radio, bajita, misma, hora,
  mochila, liviana, mapa*, más *rincón, horario, libro*).

**La voz.**

- **(T)** Enunciado ≤ 14 palabras (el más largo mide 10), opción ≤ 5 palabras y ≤ 28 caracteres
  (la más larga mide 27), nada de *che, viste, posta*, ni épica ni psicodelia.
- **(T)** Responde quien juega: segunda persona en el enunciado, primera en la opción, sin
  adjetivo con género. `alguien` queda en tres enunciados (`EJ-029`, `033`, `047`: *alguien tuyo*
  o *alguien te pregunta*); el resto usa la forma impersonal.
- **(T)** **Tres preguntas, las tres distintas** (la vuelta 2 tenía siete y seis eran de
  `luz-oscuridad`; la vuelta 4 sacó `¿A qué lo dedicás?`, `¿Y ahora?` y `¿Cómo arrancás?`): `¿Cómo
  lo llevás?` (`035`), `¿Qué te sale?` (`049`) y `¿Cuándo las juntás?` (`032`). Los otros 27
  afirman sin preguntar. **"¿Qué hacés?" no aparece.**
- **Los enunciados no le ponen conducta a nadie** (la vuelta 3 sacó *ya pensás cómo contar*,
  *ya pensás en lo que sigue* y *pensás en mañana*: afirmaban la conducta de orden y la opción de
  caos la contradecía; la 4, *te preguntás cuánto falta*, que le ponía a quien juega la conducta de
  orden). La anticipación la pone la opción, nunca el enunciado. *Pensás* y *te preguntás* no
  quedan en ningún enunciado.
- **(O)** Imagen física y barata: campera, capas, parlante, cargador, rodilla, farol, panza, té,
  papel, barquito, mazo de cartas, algodón, vaso de agua, nube, tramos. El intruso de `voz-ricotera` §4.5 no se busca en
  las opciones: con cinco palabras no hay lugar para él.
- **(O)** **Cada momento es independiente del orden**: dentro de un momento sale un ítem de cada
  eje en orden al azar, y los tres de uno pueden aparearse con los tres del otro. La vuelta 3
  revisó **los nueve pares de cada momento, en los dos órdenes** (§4, "Los cruces"). Ningún
  enunciado fija un antes ni un después, ni dice que el sonido ya llegó o que todavía no.
- **(O)** **Cada celda tiene al menos dos escenas que solo pasan en una noche de música** (el
  tema que te mandan, el parlante, la prueba de sonido, los instrumentos que entran, el
  recital que no empieza), **con una excepción que la vuelta 4 dejó y dice**: `vuelta × luz-oscuridad`
  tiene una sola (`053`, *te dura la noche*); `054` y `055` (la casa en silencio, no te da sueño)
  son de cualquier madrugada y se leen de la noche solo porque el momento se llama *la vuelta*.
  La vuelta 3 las contó (§4, "El rastro de la noche"). Ninguna lleva credencial: no nombran un
  tema, un disco ni una palabra del código.

**Lo que no resolví con reglas y lo dejo a la vista de `REV-19`.** Cuatro cosas. **Una:** cinco
luces suponen teléfono (arriba): es el tope de un tercio de la enmienda 7, no uno menos, y sale de
que en cada momento hace falta una luz posible para quien va sin compañía. **Dos:** `adentro`
sigue dando por hecho que quien juega *oye* la música, no que entró: el sello pasó a *Cuando
suena* (`D-57` enmienda 6) y las seis escenas se sienten igual desde la vereda, pero siguen siendo
las del momento en que ya suena. **Tres:** `EJ-048` y `EJ-049` (*con el resto*) son luces con la
sala o con la vereda, no con alguien: se leen como luz sin que se hable con nadie, y si `REV-19`
las lee como "a quien está cerca" cae el veto 6. **Cuatro:** `EJ-052` (*me pongo algodón* / *así
me gusta*) trata el oído y no la seguridad de la persona; si se lee como precaución contra
imprudencia, hay que cambiarla.

## 3. Los cinco momentos

`nombre` es el sello (registro 3, ≤ 3 palabras). `canta` es la línea de registro 1: ≤ 8 palabras,
cuerpo y objetos, ni un polo empujado, sin suspensivos **(T)**.

| id | Sello | Canta | Por qué esta y no otra |
|---|---|---|---|
| `previa` | La previa | Campera puesta, llaves en el bolsillo. | 6 palabras. Una prenda y un manojo: objetos que cualquiera tiene. *Campera sobre la silla* se leía como la del que no está. |
| `ida` | La ida | Ruido de fondo, el camino que se estira. | 8 palabras. Sin vehículo ni pasaje (la primera versión era un micro de larga distancia: `RES-160`); sin mate (empuja `luz`). |
| `vereda` | La vereda | Baldosa fría y un parlante lejano. | La vereda es baldosa, no pasto (el pasto pisado evoca el predio abierto). Sin choripán: es el puesto, y el puesto es plata (`RES-161`). El parlante lejano es lo que llega de adentro. |
| `adentro` | **Cuando suena** | Golpe en el pecho, primer acorde. | **El sello cambió en la vuelta 3** (era *Adentro*): `D-57` enmienda 6 lo tomó de la propuesta de la vuelta 2, porque *Adentro* daba por hecho que quien juega entró (`BR-36` veto 3, `RES-154`). El `id` sigue siendo `adentro` (lo ata el schema). **La que canta cambió en la vuelta 4** (era *Bombo en el pecho*): en el mundo ricotero *bombo* trae el bombo de la tribuna, un ritual que `BR-36` veto 1 deja afuera de lo que se lee en la noche. *Golpe en el pecho* es el mismo cuerpo sin tribuna, y "primer acorde" no nombra ningún tema. |
| `vuelta` | La vuelta | Frío en las manos, llave en la puerta. | En casa, sin trayecto, y cierra el círculo con las llaves de la previa. **Cambió en la vuelta 4** (era *Zumbido en el oído*): el zumbido da por hecho que quien juega estuvo cerca de los parlantes, lo mismo que la enmienda 6 corrigió en el sello; el frío en las manos lo tiene cualquiera que pasó la noche, adentro o en la vereda. Sin "garganta rota" (presupone haber gritado) ni "asiento tibio" (la silla vacía). |

**La prueba de que ninguna empuja un polo.** Tapé las cinco y las leí en fila: ninguna dice
"con la gente" ni "con lo propio", ninguna dice hora ni improvisación. La `ida` es la más
neutra; la `vuelta` es la más cargada (oído y llave) y no inclina.

## 4. Los treinta ítems

Cada ítem lleva en `notaInterna`, en una línea, **la prueba de los cuatro lugares de `D-57`
punto 3** (nunca fui · sin plata · silla de ruedas · volviendo de noche sin compañía), el
constructo que mide y, desde la vuelta 3, qué había antes y por qué cambió. Los treinta dan ✔ en
los cuatro. La última columna de las tablas dice **qué cambió en las vueltas 3 y 4 y dónde mirar
primero**: *Era* es lo de la vuelta 3 y *Antes (v4)* lo que la vuelta 4 reemplazó; los cinco
ítems que la 4 no tocó (`032`, `035`, `042`, `043`, `051`) conservan solo la nota de la 3.

`L` = `luz-oscuridad` (opción A = `luz`, opción B = `oscuridad`). `O` = `orden-caos` (A = `orden`,
B = `caos`). En el archivo las opciones van siempre en ese orden; el motor las baraja
(`CTR-08.3`).

### La previa

| Id | Eje | Enunciado | Opción A | Opción B | Qué cambió (vueltas 3 y 4) y dónde mirar |
|---|---|---|---|---|---|
| `EJ-029` | L | Alguien tuyo te manda un tema. | Le contesto con otro | Lo escucho bien fuerte | Era *La comparto con un amigo* / *Pongo los auriculares*. La persona la pone el enunciado, a distancia; la oscuridad ya no es taparse. **Antes (v4):** *Le paso uno mío* (*mío* es lo que el resultado traduce de oscuridad). Luz con teléfono; es el único «te mandan algo» del banco. |
| `EJ-030` | L | Suena música mientras te preparás. | La subo para compartirla | Tamborileo en la rodilla | Era *Mando un audio a alguien* / *Tarareo para adentro*. **Antes (v4):** *La comparto con mi vieja*: un parentesco (enmienda 7). Pide a alguien presente sin nombrarlo. |
| `EJ-031` | L | Falta un rato para salir. | Le escribo a una amiga | Tarareo un tema | Era *¿Dónde te quedás?* / *En lo de mi familia* / *En mi cuarto*: las dos pedían tener algo. Ahora es qué hacés, en el mismo lugar. **Antes (v4):** *¿A qué lo dedicás?* (formulario de revista) y *Silbo un tema entre dientes* (contenerse, y silbar es una capacidad). Luz con teléfono. |
| `EJ-032` | O | Hay cosas para llevar al recital. ¿Cuándo las juntás? | Las dejo juntas desde antes | Las agarro al vuelo | Era *¿Qué llevás?* con opciones que contestaban *cuándo*. *Al vuelo* es el modismo de caos y no lleva *sal-*. Es el único *antes* del banco en orden (el otro, de `039`, se fue en la v4). |
| `EJ-033` | O | Alguien te pregunta cuándo salís. | Le doy el dato justo | Le digo: en un rato | Era *Le confirmo con tiempo* (virtud) / *Le aviso cuando salgo* (*cuando* y *sal-* solo en caos). **Antes (v4):** *Le digo: ya voy*, la excusa clásica de quien todavía no salió. Las dos le contestan algo concreto. Único `alguien` de orden-caos. |
| `EJ-034` | O | Te vestís para el recital. | Sé qué me pongo | Me visto según el humor | Era *Elijo la ropa de antemano* (oficina). Orden tiene su modismo y el enunciado nombra el recital. **Antes (v4):** *Ya sé qué me pongo* (uno de tres *Ya* en orden, ninguno en caos). Mirar: *según el humor*, ¿suena a "me da igual"? |

### La ida

| Id | Eje | Enunciado | Opción A | Opción B | Vuelta 3: qué cambió y dónde mirar |
|---|---|---|---|---|---|
| `EJ-035` | L | El camino se hace largo. ¿Cómo lo llevás? | Hablo con los míos | Tarareo una que me gusta | La B era *Miro qué pasa afuera* (la ventanilla que la vuelta 1 retiró). Única luz de la celda con presencia. |
| `EJ-036` | L | Sacás una foto camino al recital. | La mando a mis viejos | Le encuentro un detalle | Era *La mando enseguida* / *La miro un buen rato*: impulso contra paciencia, sabor de orden-caos. Sin adverbios. Luz con teléfono. |
| `EJ-037` | L | Te acordás de quién te mostró un tema. | Le escribo que me acordé | Lo busco y lo escucho | Era *algo gracioso* / *Lo cuento en voz alta* (a quien esté cerca). La persona la pone el enunciado. Luz con teléfono. |
| `EJ-038` | O | Te pasaron un papel con indicaciones para llegar al recital. | Lo sigo paso a paso | Lo uso de pista | La B era *Lo tomo como pista* (la misma forma que `EJ-046`). El enunciado ahora nombra el recital. Es el ítem más "del que nunca fue": las indicaciones existen porque no todos conocen el lugar. |
| `EJ-039` | O | Vas a escuchar música en el camino. | Elijo la música antes | Pongo una al azar | Era *Elijo antes qué escuchar* / *Pongo lo primero que sale* (el *te sale* de CU-4). Las dos son verbo y objeto. |
| `EJ-040` | O | Te preguntás cuánto falta para el recital. | Voy midiendo cada tramo | Llego cuando llego | Era *Saco la cuenta* (el *rehacer la cuenta* de CU-3). Único *cuando* de caos. Mirar: *cada tramo*, ¿es exhaustivo? |

### La vereda

| Id | Eje | Enunciado | Opción A | Opción B | Vuelta 3: qué cambió y dónde mirar |
|---|---|---|---|---|---|
| `EJ-041` | L | Se oye la prueba de sonido. | Cuento cómo suena a alguien | Le busco el ritmo | Era *Cerca de quienes charlan* (desconocidos de noche) / *Donde mejor se oye* (el devoto). La prueba de sonido no choca con `EJ-045` ni `EJ-046`. Mirar: *busco el ritmo*, ¿es oído fino? Luz sin presencia. |
| `EJ-042` | L | Cae una llovizna fina. | Aviso a un amigo: llueve | Miro llover contra el farol | Era *un alero con otros* / *bajo un alero*: el mismo objeto y oscuridad como luz menos gente. Dos haceres distintos. Único *un amigo* en masculino. |
| `EJ-043` | L | Hay afiches de recitales en la pared. | Los comento con los míos | Elijo mi favorito | Era *con mi familia* / *Leo cada afiche*. Sin *cada*, sin familia. Única luz de la celda con presencia. |
| `EJ-044` | O | Hace frío y tenés la campera. Después puede dar calor. | Busco dónde guardarla | La llevo puesta, nomás | Era *Empiezo por lo más cercano* / *donde caiga la vista*: atención, no plan. Ahora anticipar o resolver. |
| `EJ-045` | O | Todavía no empieza el recital. | Ya traía algo para esto | Armo un barquito de papel | Era *El sonido de adentro no arranca* / *Invento algo con las manos* (no se entendía). Un hacer concreto. |
| `EJ-046` | O | Dicen que el recital empieza más tarde. | Encuentro algo para hacer | Lo tomo como viene | Era *Ajusto mis tiempos* / *Me acomodo a lo nuevo* (casi sinónimos). Orden rehace el rato; caos lo suelta. |

### Cuando suena (`adentro`)

| Id | Eje | Enunciado | Opción A | Opción B | Vuelta 3: qué cambió y dónde mirar |
|---|---|---|---|---|---|
| `EJ-047` | L | Suena una canción lenta. Alguien tuyo la sabe. | Le canto lo que sé | Doy unas palmas | Era *Busco una mano conocida* (pareja o consuelo) / *Sigo la melodía* (oído fino). La luz está con la música; la oscuridad no es escucha fina. La más ambigua sobre si el otro está presente. |
| `EJ-048` | L | Se hace una pausa antes del próximo acorde. | Cuchicheo con mi hermana | Respiro hondo | Era *Escucho el último eco* (homenaje a cuatro meses del 5 de junio). Única luz de la celda con presencia. |
| `EJ-049` | L | El volumen sube de golpe. ¿Qué te sale? | Grabo esto para un compa | Me retumba en la panza | Era *Sonrío a un amigo* (al lado, masculino) / *Lo siento en la panza* (se lee como "perdón"). Luz con teléfono. |
| `EJ-050` | O | Te van a preguntar cómo estuvo el recital. | Voy armando el relato | Lo cuento de una | El enunciado era *Ya pensás cómo contar esta noche* (afirmaba orden). *De una* es el modismo; sin *salga*. |
| `EJ-051` | O | Una canción se te queda en la cabeza. | Me la grabo cantándola | La dejo dar vueltas | Era *La escucho en casa, entera* (pedía saber el título) / *La tarareo hasta que pase* (un malestar). Las dos son una ganancia. |
| `EJ-052` | O | Todavía falta para que termine. ¿Y ahora? | Ya sé cómo sigue | Lo dejo correr | Era *ya pensás en lo que sigue* / *Defino el después* / *Dejo que llegue el después*. Sin palabra compartida. Mirar: ¿qué es *cómo sigue*? Es la noche; si se oye literario, cambia. |

### La vuelta

| Id | Eje | Enunciado | Opción A | Opción B | Vuelta 3: qué cambió y dónde mirar |
|---|---|---|---|---|---|
| `EJ-053` | L | Ya en casa, todavía tenés el zumbido. | Le cuento a mi prima | Me quedo con el zumbido | Era *Busco a los de casa* (suponía que vivís con alguien) / *Me lavo la cara* (rutina). Luz sin presencia obligada. |
| `EJ-054` | L | Se te quedó un tema en la boca. | Se lo canto a alguien | Lo canto en la ducha | Era *La casa está en silencio* / *Pongo una charla de fondo* (estar solo con una grabación). Es la canción que se canta a la vuelta. |
| `EJ-055` | L | Te llega una foto por mensaje. | Le contesto con una mía | La miro de a poco | Era *Desde la calle llegan voces* (oír desconocidos de noche). Quien la manda la pone el enunciado. Luz con teléfono. |
| `EJ-056` | O | Mañana es otro día. ¿Cómo arrancás? | Pongo la alarma | Duermo sin despertador | El enunciado era *Antes de dormir, pensás en mañana* (afirmaba orden). El enunciado no dice qué hay mañana. |
| `EJ-057` | O | Te proponen juntarse a escuchar música otro día. | Propongo un día | Acepto, el día que pinte | Era *Te proponen repetir una noche así* / *Cerramos la fecha ahora*: otra salida que se paga y un plural. Gratis y en singular. |
| `EJ-058` | O | Quedó el parlante prendido en casa. | Lo apago y lo guardo | Me duermo con música | Era *El teléfono quedó sin batería* / *Lo cargo cuando haga falta* (una imprudencia leída desde la calle, y caos confesaba un descuido). Anclado en casa. |

### Los cruces: los nueve pares de cada momento, en los dos órdenes

Dentro de un momento sale un ítem de cada eje en orden al azar, así que cada enunciado de `L`
se lee con cada uno de `O`, antes y después. Leí los 45 pares en voz alta:

- **La previa:** *Falta un rato para salir* con *Te vestís* y *Hay cosas para llevar* se leen en
  cualquier orden; *Suena música mientras te preparás* con *Alguien te pregunta cuándo salís*
  también. (La vuelta 2 tenía *Estás por salir* contra *Falta un rato largo*: se fue.)
- **La ida:** *El camino se hace largo* con *Te preguntás cuánto falta* se completan; ninguno
  fija si ya llegaste.
- **La vereda:** *Se oye la prueba de sonido* con *Todavía no empieza* o *Dicen que empieza más
  tarde* es lo mismo que pasa en cualquier recital (la prueba va antes). La vuelta 2 tenía
  *llega un sonido lejano* contra *no arranca*: se contradecían en 2 de los 9 pares. *Cae una
  llovizna* con *Hace frío* se refuerzan.
- **Cuando suena:** *Suena una canción lenta* con *Una canción se te queda en la cabeza*
  son dos canciones de la misma noche, sin orden entre sí; *Todavía falta para que termine* no
  contradice ninguna de las tres.
- **La vuelta:** las seis pasan en casa; *Quedó el parlante prendido en casa* con *Se te quedó un
  tema en la boca* es la misma noche.

### El rastro de la noche, celda por celda

Las dos escenas que solo pasan en una noche de música (la tercera puede ser de cualquier
salida). La vuelta 2 dejaba seis celdas con una sola o ninguna.

| Celda | Escenas con rastro |
|---|---|
| previa × L | `029` (un tema que te mandan), `030` (suena música) |
| previa × O | `032` (cosas para llevar al recital), `034` (te vestís para el recital) |
| ida × L | `036` (una foto camino al recital), `037` (quién te mostró un tema) |
| ida × O | `038` (indicaciones para llegar al recital), `039` (música en el camino), `040` |
| vereda × L | `041` (la prueba de sonido), `043` (afiches de recitales) |
| vereda × O | `045` y `046` (el recital que no empieza o empieza tarde) |
| adentro × L | las tres: `047`, `048`, `049` |
| adentro × O | `050` (cómo estuvo el recital), `051` (una canción pegada) |
| vuelta × L | `053` (el zumbido), `054` (un tema en la boca) |
| vuelta × O | `057` (juntarse a escuchar música), `058` (el parlante) |

## 5. Las cuatro maneras

Los ids y los polos no se mueven (`D-57` punto 5; lo ata `banco.test.ts`). Cambian nombre y
bajada. Los nombres son los de `D-57`, sin persona gramatical: se dicen igual en "me", "te" y
"le salió".

| Id | Polos | Nombre | Bajada | La línea que nombra |
|---|---|---|---|---|
| `CU-1` | luz + orden | **Mesa larga a las nueve** | Hay una hora, un lugar y gente que te espera: la noche empieza sabiendo adónde va. Pero cuando alguien cambia la hora, a vos te toca rearmar la mesa. | Con la gente, con plan. |
| `CU-2` | luz + caos | **Ronda en cualquier esquina** | Te sumás a lo que aparece —una charla, un mate, otra canción— y la noche toma forma. Pero cuando alguien pregunta adónde siguen, a vos te toca elegir ahí mismo. | Con la gente, sobre la marcha. |
| `CU-3` | oscuridad + orden | **Radio bajita, misma hora** | Te cosés la noche a medida, canción por canción. Pero cuando alguien adelanta la salida, a vos te toca mover lo que venía después. | Con lo propio, con plan. |
| `CU-4` | oscuridad + caos | **Mochila liviana, sin mapa** | Un cambio trae otro, y a vos no te pesa. Pero cuando alguien quiere saber el rumbo, a vos te toca averiguarlo en el celular. | Con lo propio, sobre la marcha. |

**La forma.** Cada bajada es **un placer y un costo, y los cuatro costos tienen la misma forma**:
"Pero cuando *alguien* *[hace algo]*, a vos te toca *[una tarea]*." **Alguien como sujeto, *a vos
te toca* como lo que pagás vos**, con un verbo distinto en cada una (*rearmar*, *elegir*,
*mover*, *averiguar*). **La vuelta 3 cambió el peso, no la gramática**: la lectura encontró que
con la misma gramática los cuatro no pesaban igual. `CU-1` (*se te hace cuesta arriba*) nombraba
una dificultad de carácter, la rigidez, y era el más pesado; `CU-3` era una tarea, `CU-2` una
demora, y `CU-4` (*te sale un «por ahí»*) era un chiste simpático, casi un encanto. Y en los dos de
caos lo pagaban los otros (el que pregunta se quedaba sin respuesta), mientras que en los dos de
orden lo pagabas vos. Ahora **los cuatro son un roce chico y concreto que pagás vos**, sin rasgo
de carácter ni remate gracioso: una mesa que se rearma, una elección en el momento, lo que venía
después que se mueve, un dato que se busca en el celular.

- **Ninguno de oscuridad se dice como exclusión, y ninguno de luz queda sin pagar.** Los cuatro
  costos son de `orden-caos` (el placer distingue `luz-oscuridad`, el costo distingue
  `orden-caos`): así ningún polo de un eje paga más que el otro. Que `luz-oscuridad` "no pague
  nunca" es a propósito: `D-57` punto 5 pide que ninguno de oscuridad se diga como exclusión.
- **Ninguna describe cómo aguantás algo malo.** Los cuatro placeres son placeres: una noche que
  sabe adónde va, una noche que toma forma, una noche que te cosés a medida (un objeto de la casa,
  con *canción por canción* adentro), un cambio que trae otro y no te pesa.
- **`CU-4` otra vez (vuelta 3).** *La noche te va mostrando lo que se cruza* era, junto con *sin
  mapa*, el retrato de andar solo de noche a la deriva, y en rioplatense *se me cruzó alguien* de
  noche suena a amenaza. Es la lectura que `CNT-30` decía haber sacado dos veces. Ahora es un
  placer de lo abierto sin calle: *un cambio trae otro, y a vos no te pesa* (y *pesa* habla con
  *liviana*). El costo ya no es que alguien *te pida el camino* (un desconocido por el sentido)
  sino que alguien *quiera saber el rumbo*.
- **`CU-3` y `CU-2` (vuelta 3).** `CU-3` era *Tenés tu rincón y tu hora*: una posesión y no un
  hacer, con *rincón* arrastrando *arrinconado* y *hora* tres veces entre el nombre y la bajada;
  ahora *te cosés la noche a medida* es un hacer con una imagen física y la bajada no dice
  *hora*. `CU-2` decía *un grupo* y *adónde van*, que de noche son desconocidos; ahora *una
  charla, un mate, otra canción* y *adónde siguen*.
- **Sin género y sin eco.** Ninguna usa *solo/sola* ni participio que concuerde con quien juega.
  **Ninguna palabra de más de tres letras de una bajada está en una opción, salvo `alguien` y
  `cuando`** (están en las cuatro por la forma común y no apuntan a ninguna; la guarda que propuse
  a `banco.test.ts` tendría que dejarlas pasar; hoy la corrí a mano). Entre 23 y 30 palabras cada una; entre 124 y
  160 caracteres (techo 36 palabras de `banco.test.ts` y 240 del schema; la tarjeta admite cinco
  renglones y estas deberían ocupar cuatro: el taller mide y falla fuerte si no).

**La prueba que pidió el encargo: tapá los nombres, ¿alguna está triste o es más linda, alguna
pesa más?** La leí de a una y en fila. Las más cálidas por oído siguen siendo `CU-1` y `CU-2`
(*gente que te espera*, *un mate*); `CU-3` y `CU-4` son más calladas y no tristes (*te cosés la
noche*, *no te pesa*). **Los costos, tapados los nombres, pesan parejo**: cada uno es una tarea
de segundos. Sigue siendo `CU-4` la que miraría primero.

**Alternativas de `D-57` que quedan anotadas:** *Mate en cualquier esquina* (`CU-2`) y *Libro
con señalador* (`CU-3`). Con cualquiera de las dos la bajada de arriba sigue valiendo; con la de
`CU-2`, *mate* quedaría en el nombre y en la bajada del mismo cuadrante, que es el único roce.

## 6. Cadenas de pantalla

Para `src/lib/dos-ejes/copy.ts` (y la del casete y el lugar en `src/lib/sitio/copy.ts`). La
columna "Frente a `copy.ts`" compara con el árbol del 2026-10-04 después de la vuelta 3:
**confirma** = igual, **cambia** = hay que tocarlo, **retirada** = ya no existe. Las funciones se
escriben como `función(parámetros)` y el texto lleva los huecos `${...}`. `R1`, `R2`, `R3` son los
registros de `voz-ricotera.md` §5. Todos los botones están en voseo imperativo (`D-17`): *Empezá,
Compartí, Bajá, Volvé*. Ninguna lleva "y listo", ni suspensivos en un botón o rótulo, ni signo
de exclamación.

### 6.1 Los polos no tienen persona

`D-57` nombra los polos "Con la gente", "Por tu cuenta", "Con plan", "Sobre la marcha". Los
cuatro nombres de cuadrante se escribieron sin persona **para que se digan igual en "me", "te" y
"le salió"**, y la línea que los traduce viaja por los mismos tres lugares (la tarjeta, el
desafío, el resultado). "Por tu cuenta" se rompe en dos de los tres ("A alguien le salió «Radio
bajita, misma hora»: por tu cuenta" se lee como un reproche). **"Por cuenta propia"** era el
cuentapropista: una palabra de trámite al lado de *con la gente*, que es como el sitio nombra a
quien juega (`voz-ricotera` §3.8). **Queda `con lo propio`** (`D-57` enmienda 1): sin persona, de la
misma forma que *con la gente* y *con plan*. Es una sola cadena (`POLOS.oscuridad`). Los polos se
guardan en minúscula y las dos formas de armar la línea se derivan: `polosEnFrase(lo, oc)` →
`con la gente, con plan` (va después de dos puntos) y `lineaQueNombra(lo, oc)` → `Con la gente,
con plan.` (va sola debajo del nombre). La alternativa a `con lo propio` si `REV-19` lo oye vago
es *a solas*; no la cambié (mueve `POLOS`, `CNT-29` y las tarjetas).

### 6.2 La tabla

| Clave | Texto | Frente a `copy.ts` | Registro y prueba |
|---|---|---|---|
| **PANTALLA_0** | | | |
| `titulo` | `¿Qué tipo de ricotero sos?` | confirma | R1, 5 palabras, segunda persona. Es el `h1` de `D-51` y no se toca. |
| `subtitulo(momentos, preguntas)` | `Una noche de recital en ${enLetras(momentos)} momentos y ${enLetras(preguntas)} preguntas de cómo la pasás. No hace falta saber nada ni haber ido.` | confirma | R3, dice el mecanismo y lo que no se pide. Es también la `og:description` de la portada. Los números salen del dato (`banco.momentos.length` y `banco.preguntasPorEje * 2`). Presenta una noche y no una esencia (`BR-37` regla 1). |
| `indiceRotulo` | `Las hojas de la noche` | confirma | R3, el rótulo de la etiqueta de papel con los cinco sellos. "Adentro del libro" chocaba con el sello `Cuando suena`, y "hojas" es el cuerpo del libro. |
| `boton` | `Empezá la noche` | confirma | R1, voseo imperativo. Dice que esto es una noche, no una ronda con puntaje. |
| `desafio(nombre, polos)` | — | **retirada** (`D-57` enmienda 3) | La vuelta 3 la saca del documento: la isla le pega a la tapa la misma etiqueta del amigo que trae la postal (`POSTAL.rotulo`, *A quien te lo mandó le salió*) y **no pisa el subtítulo**, así que el aviso de la vuelta 1 (que la isla dejara de pisar el subtítulo, o que la línea cerrara con *No hace falta saber nada*) ya no hace falta: el subtítulo queda entero con su tranquilidad. |
| `sinNoche` | `Esta noche no se pudo armar. Volvé a cargar la página.` | **confirma** (la dejaba `copy.ts` para `contenido`) | R3, seco, voseo (`Volvé`), sin suspensivos. Lo que dice la portada si una celda del banco está vacía (`banco.test.ts` no lo deja pasar): sin esta línea, "Empezá" no haría nada, que es un molinete (`UX-36` §4.8). "Esta noche" y no "ahora": el banco habla en noches. |
| **POLOS** | | | |
| `luz` · `oscuridad` · `orden` · `caos` | `con la gente` · `con lo propio` · `con plan` · `sobre la marcha` | confirma | R3, la traducción de la punta; sin persona (§6.1). |
| `EJES` (`Luz`, `Oscuridad`, `Orden`, `Caos`) | los de hoy | confirma | R3, los rótulos que eligió el usuario (`BR-17`). Siguen en el sello de dos palabras. |
| **PARTIDA** | | | |
| `folio(n, total)` | `${n} de ${total}` | confirma | R3. Orientación, no medición. |
| `anterior` | `Volvé a la anterior` | confirma | R1 (botón), voseo. |
| `teclas` | `Teclas 1 y 2 para elegir. Retroceso vuelve.` | confirma | R3, solo con mouse. Sin suspensivos y sin infinitivo en la primera palabra. |
| `anuncio(momento, n, total)` | `${momento}. Pregunta ${n} de ${total}.` | confirma | R3, para el lector de pantalla: el sello (`Cuando suena`) y el folio. |
| **RESULTADO** | | | |
| `rotulo` | `Esta noche te salió` | confirma | R3. "Esta noche" y no "Diste con esto": otra noche puede dar otra manera (`BR-37`). |
| `marca` | `Arcade Ricotero` | **confirma** (la versión anterior de este documento decía `Arcade Ricotero · ¿Qué tipo de ricotero sos?`) | R3. Va en dos renglones (`UX-36` §5.1): esta, en la calcada de la tapa de *Oktubre* (solo mayúsculas y sin tilde), y debajo el título del juego (`PANTALLA_0.titulo`). La misma cadena encabeza la tarjeta y la vista previa. |
| `compartir` · `denuevo` · `bajar` · `volver` | `Compartí` · `Empezá otra noche` · `Bajá la tarjeta` · `Volvé al arcade` | confirma | R1 (botones), voseo. `Empezá otra noche` es lo opuesto de "Probá de nuevo", que sonaba a haber fallado. |
| `lasCuatro` | `Las cuatro maneras` | confirma | R3, 3 palabras. Nombra la grilla. |
| `lasCuatroCanta` | `Cuatro puntas de la misma hoja.` | **confirma** (pegada por el hilo después de la vuelta 3; antes `Cuatro puertas a la misma noche.`) | R1, 6 palabras, física (las cuatro puntas de una hoja) y sin sermón. **Por qué cambia:** la lectura de la vuelta 3 notó que *puertas* contradice el argumento de este mismo documento (la puerta de un recital es donde se pide la entrada: `LUGARES` ya lo había sacado por eso), y *Cuatro sillas* ya estaba descartada. *Esquinas* (la sugerencia de la lectura) apuntaría a «Ronda en cualquier esquina» antes de que se conozca el nombre: es la guarda de §2. *Puntas* es la misma imagen del libro (*Las hojas de la noche*), no lleva persona ni entrada, y las cuatro puntas de una hoja son iguales. Tapada: queda `Las cuatro maneras`, que nombra. |
| `tuya` · `suya` | `Esta noche` · `Quien te lo mandó` | confirma | R3, sellos chicos, sin género. |
| `altGrilla` | `Las cuatro maneras, con la tuya primero.` | confirma | R3, para el lector de pantalla. |
| `paraCompartir(nombre)` | `Me salió «${nombre}». ¿Qué tipo de ricotero sos vos?` | confirma | R1 en primera persona, fuera del sitio. Primera frase de 6 a 7 palabras. Nombra el test y no lleva número (`BR-17`). |
| `copiado` · `aManoTitulo` | `Se copió el enlace.` · `Copiá esto y mandalo` | confirma | R3, voseo. |
| **POSTAL** | | | |
| `ogTitulo(nombre)` | `Me salió «${nombre}»` | confirma | R1, 4 a 7 palabras. Es el `og:title`. |
| `ogDescripcion(linea)` | `${linea} ¿Qué tipo de ricotero sos vos? Una noche de recital, sin saber nada.` | confirma | R3 + R1. Dice qué es X antes de jugar y repite el molinete. |
| `rotulo` · `boton` | `A quien te lo mandó le salió` · `Empezá tu noche` | confirma | R3 sin género · R1 voseo. |
| **TARJETA** | | | |
| `meSalio` · `pregunta` | `Me salió` · `¿Y a vos cuál te sale?` | confirma | R1, el arranque que la tarjeta completa con el nombre · segunda persona, 6 palabras. |
| `credito` | `Lomo, mármol y esquinero de la tapa de Luzbelito (Rocambole, 1996).` | **cambia** (cierre de la vuelta 4, §13; antes `…tapa de Luzbelito (Rocambole, 1996), en baja.`) | R3, dice qué se usa y de dónde. Sin día ni mes (`RES-167`). Sin óvalo ni figura. *En baja* era jerga de imprenta: la baja resolución es la condición de `D-21`, no algo que se le diga a la gente. Los `alt` pierden el mismo *en baja*. |
| `alt(nombre, linea)`, `altJuego` | los de hoy | confirma | R3. Llevan el crédito (`D-21`). |
| **CASETE** (`sitio/copy.ts`) | | | |
| `JUEGOS[«¿Qué tipo de ricotero sos?»].baja` | `Nadie te toma examen. Una noche de recital, sin puntaje y sin saber nada de la banda.` | confirma | La primera frase es la que el portal imprime y mide `voz.test.ts` (4 ≤ 8 palabras). Sin "Diez" escrito a mano. |
| `JUEGOS[...].accion` | `EMPEZÁ` | confirma | R1 (botón). |
| `LUGARES.dosEjes` | `Entrá con la campera puesta.` | **confirma** (pegada por el hilo después de la vuelta 3; antes `Se entra con las manos vacías.`) | R1, 5 palabras, imperativo y física. **Por qué cambia:** *manos vacías* es en castellano llegar sin regalo o volver fracasado, no entrar sin pagar, y repite *manos* de la bajada de `CU-4` en la versión de la vuelta 2 (ya no está). *Entrá con la campera puesta* es la misma imagen de la previa (*Campera puesta, llaves en el bolsillo*), dice "como estás" sin hablar de plata ni de puerta, y no repite *nada/nadie* (el aviso explícito queda en el subtítulo). Si el renglón ya no vive en la página, no hace falta nada. |

### 6.3 Los textos armados, para leerlos de corrido

**La etiqueta que llega** (la de la postal, `POSTAL.rotulo`): *A quien te lo mandó le salió*, y
debajo el nombre y la línea que nombra, para las cuatro:

- Mesa larga a las nueve — Con la gente, con plan.
- Ronda en cualquier esquina — Con la gente, sobre la marcha.
- Radio bajita, misma hora — Con lo propio, con plan.
- Mochila liviana, sin mapa — Con lo propio, sobre la marcha.

**La línea que nombra** (`RESULTADO`), debajo de "Esta noche te salió": el nombre grande y debajo
`Con la gente, con plan.` (o la que corresponda). Tapada esa línea, el que llegó por un enlace sabe
cuál es su manera pero no qué quiere decir: por eso existe.

**El texto que viaja** (`paraCompartir`): `Me salió «Radio bajita, misma hora». ¿Qué tipo de
ricotero sos vos?`

## 7. Lo que descarté, y por qué

- **`Por tu cuenta` y `Por cuenta propia` como polo**: §6.1.
- **El micro de larga distancia como escena de la ida**: pasaje pago por hecho, peregrinación de
  devoción (`RES-160`), una sola clase de gente. Quedó la ida sin vehículo.
- **Contacto con quien está cerca, con quien mira o con quien esté**: el veto 6 de `BR-36` por
  el sentido. **Y, desde la vuelta 3, "cerca de quienes charlan", "con otros" y "las voces de la
  calle"**: son desconocidos de noche, y elegirlos es la opción más segura, no un temperamento.
- **Un punto de encuentro por si se separan**, **un cambio de ritmo que acelera la música**
  (la señal del pogo, `RES-158`), **cerrar los ojos con una canción lenta** (`RES-157`),
  **estirar las piernas / bajar a ver / dar una vuelta con alguien**: ver `D-57` punto 3.
- **"Ya veremos cuándo" y "Mañana veo qué sale"** del lado del caos: en rioplatense son la manera
  amable de decir que no.
- **Las `canta` del panel**, salvo `adentro`: presuponen pies, piernas, plata o haber gritado.
- **Cantar en público como escena**: los dos ejes dejaban de tener gente.
- **`Apago el celular`** como oscuridad: es `EJ-009` con otras palabras.
- **El costo con rótulo** ("El costo:") en las bajadas: convierte un párrafo en un formulario.
- **Un verso, una vela o un tema por cuadrante.** Ya descartado por el usuario en `US-06` y por
  `D-57` puntos 8 y 9.
- **Lo que descartó la vuelta 2**, para que no vuelva: *mi gente* en cualquier opción; *Voy por el
  más ancho* / *Sigo el sonido*; *Un papelito de esa noche en el bolsillo*; *Cuento los
  segundos*; *Escucho cada palabra* y *Dejo terminar cada tema*; *Digo cuándo y lo cumplo*;
  *Saludo y sigo mi rumbo*; *Me tapo como puedo*; *Acepto, cualquier día me va*; *Saco mi
  crucigrama* e *Invento un juego*; *Hay cosas de esta noche que querés recordar*.
- **Lo que descarta la vuelta 3**, para que no vuelva: *Busco una mano conocida*, *Escucho el
  último eco* y *Lo siento en la panza* (homenaje a cuatro meses del 5 de junio, pareja o
  "perdón"); *Pongo los auriculares* (taparse) y *Tarareo para adentro* (reprimirse); *Miro qué
  pasa afuera* (la ventanilla); *Comparto un alero con otros* / *Espero bajo un alero* (la misma
  frase con otra punta, y desconocidos); *Cerca de quienes charlan* y *Donde mejor se oye*;
  *Pongo una charla de fondo* (estar solo con una grabación); *Las escucho un rato* (voces
  de la calle); *Hojeo una revista vieja* (el guiño al test de revista); *Lo cargo cuando haga
  falta* (una imprudencia leída desde la calle); *Defino el después* y *Ajusto mis tiempos*
  (oficina); *Cerramos la fecha ahora* (plural, y una salida que se paga); *Los comento con mi
  familia* y *En mi cuarto* / *En lo de mi familia* (dan por hecho una casa o una familia);
  *La tarareo hasta que pase* (trata la canción como un malestar); *Me lavo la cara* (rutina);
  *Tenés tu rincón y tu hora* (una posesión); *se te hace cuesta arriba* y *te sale un «por
  ahí»* (rasgo de carácter y chiste); *Cuatro puertas a la misma noche* (la puerta es donde se
  pide la entrada) y *Se entra con las manos vacías* (llegar sin regalo, o volver fracasado).
- **Dos propuestas de la lectura que la máquina veta**: *Salto de una a otra* cae en `salt*` y
  *Hablo con quien vino conmigo* cae en `vino` (el veto del alcohol lee el pasado de *venir*).

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

1. **`banco.test.ts`** tiene 19 pruebas. **La vuelta 3 midió a mano los 30 textos y las cuatro
   bajadas contra las 19**: opciones de 5 palabras y 28 caracteres como techo (la más larga mide
   27); ninguna palabra de `VETOS`, de los delatores, de la traducción (*gente, propio, plan,
   sobre, marcha*), de los cuatro nombres ni de género; ningún `camino`, `a pie` ni `caminando`
   en la vuelta; seis cierres con pregunta, los seis distintos, y `¿Qué hacés?` no aparece; las
   dos opciones de un ítem no se contienen; y la firma de un polo (palabras exactas, contando
   `me`, `mi` y `por`) no llega a tres con cero enfrente: el máximo es `mi` ×3 en luz con una
   en oscuridad y `me` ×3 en oscuridad con una en luz. **No lo corrí**: es el primer comando.
2. **`partida.test.ts`** no la toca esta vuelta: mismos ids, tres por celda, mismos momentos.
3. **`voz.test.ts`** recorre enunciados, opciones, nombres, bajadas y los cinco sellos y líneas
   que cantan: ninguna cadena empieza con un infinitivo de la lista, ninguna lleva un anglicismo
   del glosario ni una fórmula de folleto.
4. **`esquemas.test.ts`** valida el banco contra `CTR-08` v2: ninguna clave nueva; el enunciado
   más corto mide 22 caracteres (mínimo 10) y la bajada más larga unos 160 (máximo 240).
5. **`tarjetas.test.ts` va a fallar hasta que se regeneren las tarjetas**, y no es un defecto del
   contenido: `huellaDelTaller()` entra con las **bajadas**, y la vuelta 3 cambió las cuatro. El
   comando es `npm run generar-dos-ejes`; lo corre el hilo principal. El taller mide cada bajada
   y falla fuerte si ocupa más de cinco renglones: las nuevas miden entre 124 y 160 caracteres,
   por debajo de la más larga de antes (169). `«` y `»` no aparecen en las bajadas (se fue
   `«por ahí»`); el `—` de `CU-2` ya estaba.

## 9. Para `REV-19` y para el hilo principal

**Lo que le pido a `revisor`, en este orden:**

1. **Las luces que suponen teléfono** (§2): siete de quince (`029`, `031`, `036`, `037`, `042`,
   `049`, `055`). Es el precio de sacar la compañía presente (cuatro quedan, una por celda de
   previa, ida, vereda y adentro; la vuelta no tiene ninguna). ¿Es la exclusión menor?
2. **`EJ-047`**: *alguien tuyo la sabe* deja abierto si el otro está al lado. ¿Se lee como luz para
   quien va sin compañía?
3. **Las oscuridades de `Cuando suena`**: *palmas*, *respirar hondo*, *me retumba en la panza*.
   ¿Alguna es "la del que no se interesa" o "la del que está en otra cosa"? La vuelta 2 las tenía
   todas como escucha fina; ahora son cuerpo.
4. **`CU-4` contra las otras tres**: *un cambio trae otro, y a vos no te pesa* y el costo *averiguarlo
   en el celular*. ¿Pesa igual que *rearmar la mesa*, *elegir ahí mismo* y *mover lo que venía
   después*?
5. **Las seis escenas más jóvenes**, leídas por alguien que no las escribió: `EJ-038` ("del que
   nunca fue"), `EJ-040` (*cada tramo*), `EJ-041` (*busco el ritmo*), `EJ-052` (*cómo sigue*),
   `EJ-054` (*Se lo canto a alguien*) y `EJ-058` (*Me duermo con música*: ¿es descuido con el
   aparato?).
6. **Los 45 pares de los cruces** (§4), en voz alta.
7. **Las celdas que siguen siendo el mismo dilema con otro objeto**: la previa de `luz-oscuridad`
   (un tema, la música, un rato: *compartir o quedarse con la música*) y la vuelta de `orden-caos`
   (la mañana, otro día, un parlante: *dejarlo asegurado o dejarlo abierto*).

**Lo que le dejo al hilo principal** (nada de esto lo toco, no es mi carpeta; el detalle está en
`Docs/SUGERENCIAS/CNT-para-hilo-principal-vuelta-3-dos-ejes.md`):

- **Regenerar las tarjetas** (§8, punto 5).
- **`src/lib/sitio/copy.ts`**: `LUGARES.dosEjes` → `Entrá con la campera puesta.`
- **`src/lib/dos-ejes/copy.ts`**: `RESULTADO.lasCuatroCanta` → `Cuatro puntas de la misma hoja.`
- **`banco.test.ts`**: que la firma de un polo cuente **raíces** y no palabras exactas, que saque
  `que` y `cuando` de `vacias` (la vuelta 2 tenía 12 de 15 opciones de caos con subordinada y
  *cuando* en tres, y el test no lo veía), y que la guarda del nombre de una manera suba a
  **las palabras de más de tres letras de las bajadas** (cuatro ecos de la vuelta 2 pasaron).
- **`experiencia`** (`UX-36`, línea de `lasCuatroCanta`): la que canta pasa a `Cuatro puntas de la
  misma hoja.`
- Los comentarios de `src/lib/sitio/copy.ts` (`LUGARES`) siguen diciendo "el noveno" y "los ocho"
  (ya lo anoté en `CNT-26` §6) y el posteo 5 del hilo de Twitter describe el rombo y los nombres
  viejos (`D-57`, Consecuencias).

## 10. Vuelta 1 de arreglos (2026-10-04), en resumen

Un verificador adversarial corrió los tests (todos verdes) y **leyó** el banco. Lo que cambió, sin
la tabla entera (el detalle de cada ítem vive en su `notaInterna`):

- **Altas.** La ida eran tres micros de larga distancia (pasaje por hecho, peregrinación de
  `RES-160`): pasó a ser "el camino", sin vehículo. Cuatro luces apuntaban a quien está cerca o
  mira (veto 6 de `BR-36` por el sentido): pasaron a los suyos o a alguien a distancia. `EJ-052`
  era un punto de encuentro (seguridad). El costo de `CU-3` era exclusión y la luz no pagaba
  nunca: los cuatro costos pasaron a `orden-caos` con la misma forma. `caos` ganó un modismo.
- **Medias.** El vocabulario que delataba el eje (once de quince de orden con *seguir*, *pensado*,
  *marcado*); `EJ-051` (la señal del pogo), `EJ-047` (cerrar los ojos), el final que sonaba a
  elegía; siete de quince oscuridades eran un repliegue; `POLOS` con asimetría de calor (*con lo
  propio*); una noche con una sola clase de gente.
- **Bajas.** Opciones que apuntaban a un cuadrante, el subtítulo "cómo sos" (pasó a "cómo la
  pasás"), gramática y voz, secuencias incoherentes por el orden al azar.

## 11. Vuelta 2 de arreglos (2026-10-04), en resumen

`banco.test.ts` dio 16 de 19 sobre el banco de la vuelta 1 (el hilo principal había sumado las
guardas de traducción y de firma); `esquemas.test.ts` 64 de 64 y `voz.test.ts` 15 de 15. Cambiaron
27 de los 30 ítems, las cuatro bajadas y dos `canta`:

- **Altas.** *Mi gente* en cuatro opciones (gente es la palabra de `POLOS.luz`) y *los míos* en
  cuatro; `EJ-057` (*cualquier* y una salida que se paga); `EJ-046` (accesibilidad y la
  imprudencia como carácter); `EJ-054` (el papelito de esa noche).
- **Medias.** Firmas que el test descartaba (*por*, *Me + verbo*); `EJ-033`, `051`, `042`, `045`,
  `043`, `048`, `032`; `orden-caos` medía cinco cosas y pasó a una (*anticipar o resolver sobre
  la hora*); costos de las bajadas con un molde nuevo; `CU-4`; `EJ-041`, `047`, `039`.
- **Bajas.** `Pasto pisado`, `Campera sobre la silla`, el renglón del lugar, gerundio colgado.
- **Lo que la vuelta 3 encontró de esa vuelta:** sacó las firmas por palabra exacta, pero dejó la
  de forma (la sintaxis), la compañía presente en ocho luces, desconocidos en tres escenas y los
  ecos con las bajadas. Es lo que arregla el §12.

## 12. Vuelta 3 de arreglos (2026-10-04): qué encontró la lectura y qué se hizo

Un verificador adversarial corrió las cinco suites sobre el banco de la vuelta 2 (todas verdes:
`banco.test.ts` 19 de 19, `esquemas.test.ts` 64 de 64, `voz.test.ts` 15 de 15, `partida.test.ts`
17 de 17, `tarjetas.test.ts` 8 de 8) y lo **leyó**: todo lo que sigue son defectos de lectura que
ninguna guarda ve. Los ids `EJ-029`..`EJ-058` se conservan sin huecos y cada celda sigue con tres.
Cada ítem cambiado lleva su razón en la `notaInterna`, con "Vuelta 3" adelante.

| Gravedad | Hallazgo | Qué se hizo |
|---|---|---|
| alta | `Cuando suena` × luz-oscuridad: las tres luces pedían que hubiera alguien tuyo al lado (*una mano conocida*, *los míos*, *un amigo*), y el mismo patrón en `031`, `035`, `037`, `043`, `053`: ocho de quince. Quien fue sin compañía no tiene luz posible: la exclusión de `D-57` punto 5 | Una persona presente **como mucho por celda** (cuatro en todo el banco, la vuelta ninguna). En las demás la gente la pone el enunciado, de cerca o de lejos, o la opción nombra a alguien a distancia (§2). En `Cuando suena`, una luz también está con la música (`047`, `049`) y las oscuridades ya no son escucha fina (§2) |
| alta | `EJ-054`: *Pongo una charla de fondo* es estar solo con una grabación, no polo puro, y evoca *Radio bajita, misma hora* | Escena nueva: un tema que se te queda en la boca, cantado a alguien o en la ducha. Nada de radio, charla ni sonido grabado como luz |
| alta | `EJ-058`: el teléfono sin batería cae en la vuelta y no dice que estés en casa; *Lo cargo cuando haga falta* es una imprudencia leída desde la calle, y caos confesaba un descuido | Anclado en casa y sin teléfono: *Quedó el parlante prendido en casa* (*Lo apago y lo guardo* / *Me duermo con música*) |
| media | Sintaxis: 12 de 15 opciones de caos con subordinada (7 en subjuntivo) contra 1 de 15 en orden; *cuando* en 3 de caos y 0 de orden; *sal-* en 4 de caos y 0 de orden y además verbo de `CU-4`; en los enunciados, 6 de las 7 preguntas eran de luz-oscuridad y *pensás* en 3 de orden-caos y 0 del otro | Caos con subordinada en 3 (1 en subjuntivo) y orden en 3; ninguna opción con *sal-*, *cuando* solo en `040`; seis preguntas, tres por eje; ningún *pensás* (§2). La sugerencia de `banco.test.ts` que cuente raíces y saque *cuando* y *que* de `vacias`, al hilo principal (§9) |
| media | `EJ-050`, `052`, `056`: el enunciado afirma la conducta de orden y la opción de caos la contradice | Enunciados que no le ponen conducta a nadie (*Te van a preguntar cómo estuvo el recital*, *Todavía falta para que termine*, *Mañana es otro día*) |
| media | Orden habla como una oficina (*defino, ajusto, confirmo, cerramos, de antemano*) y caos se lleva los modismos con calor | Orden también con modismo e imagen física (*desde antes*, *el dato justo*, *ya sé qué me pongo*, *paso a paso*, *la alarma*); se sacaron las cinco palabras de oficina |
| media | `EJ-042`: *Comparto un alero con otros* / *Espero bajo un alero*: el mismo objeto, oscuridad como luz menos «otros», y «otros» de noche son desconocidos | Dos haceres distintos ante la llovizna, sin objeto compartido: avisarle a un amigo, o mirar llover contra el farol |
| media | `EJ-041` y las tres oscuridades de `Cuando suena`: *Cerca de quienes charlan* elige lo más seguro; *Donde mejor se oye* es el devoto; las tres oscuridades eran atención a la música y las tres luces, distracción social | `EJ-041` es la prueba de sonido (contarlo / buscarle el ritmo); en la celda, luces con la música y oscuridades de cuerpo (palmas, respirar, la panza) |
| media | La vereda se contradice en 2 de los 9 pares: `EJ-041` *llega un sonido lejano* contra `EJ-045` *no arranca* y `EJ-046` *empieza más tarde* | La prueba de sonido no choca con *todavía no empieza*; revisados los nueve pares de cada momento (§4, los cruces) |
| media | `EJ-043`: *con mi familia* da por hecho con quién fuiste, y *cada afiche* suena exhaustivo | *Los comento con los míos* / *Elijo mi favorito* |
| media | `EJ-031`: *En mi cuarto* y *En lo de mi familia* piden tener algo | Pasa de dónde a qué hacés mientras esperás (*Le escribo a una amiga* / *Silbo un tema entre dientes*) |
| media | `EJ-044`: mide atención en orden contra atención dispersa | Anticipar o resolver: la campera si después hace calor |
| media | `EJ-046`: *Ajusto mis tiempos* y *Me acomodo a lo nuevo* son casi sinónimos | *Encuentro algo para hacer* / *Lo tomo como viene* |
| media | `EJ-051`: *La tarareo hasta que pase* es un malestar y la de orden pide saber el título | *Me la grabo cantándola* / *La dejo dar vueltas* |
| media | `EJ-052`: las dos comparten *el después*; *Defino* es oficina | Sin palabra compartida; el enunciado dice qué falta |
| media | `EJ-053`: *Me lavo la cara* es una rutina y *Busco a los de casa* supone que convivís | *Le cuento a mi prima* / *Me quedo con el zumbido* |
| media | `EJ-055`: *Las escucho un rato* es oír pasivamente a desconocidos desde adentro | Una foto por mensaje; contestar o mirarla de a poco |
| media | `EJ-057`: *repetir una noche así* es otra salida que se paga y *Cerramos* es plural | Juntarse a escuchar música otro día; las dos en primera del singular |
| media | `CU-1..CU-4`, los costos: pesan distinto (carácter, tarea, demora, chiste) y en los de caos pagan los otros | Los cuatro un roce chico que pagás vos, con la misma forma (§5) |
| media | `CU-4` sigue siendo andar solo de noche a la deriva (*lo que se cruza*) | *Un cambio trae otro, y a vos no te pesa* (§5) |
| media | La mitad de los ítems sin rastro de recital ni de música | Cada celda con al menos dos escenas de la noche (§4, el rastro) |
| baja | `EJ-029`, `030`, `035`: auriculares, *para adentro*, *afuera*, *¿Qué hacés con ella?* | Todo sacado; oscuridades que son un hacer con ganas (§2) |
| baja | `EJ-032`, `033`, `036`, `045` | *¿Cuándo las juntás?*; *el dato justo*; sin adverbios; *un barquito de papel* |
| baja | Opciones que repiten palabras de las bajadas (*cuenta*, *manos*, *charla*, *sale*) | Cambiadas las cuatro y comparada cada bajada, palabra por palabra, con las 60 opciones (§5; salvo `alguien` y `cuando`, la forma común de las cuatro); la guarda de `banco.test.ts`, al hilo principal |
| baja | `EJ-047`/`048`/`049`/`029`: mano en una lenta, *último eco*, *un amigo* ×2, *Lo siento en la panza* | Todo sacado (§4) |
| baja | La previa: *Estás por salir* contra *Falta un rato largo* | Sacados los dos |
| baja | `CU-3` (una posesión, *hora* ×3) y `CU-2` (*un grupo*, *adónde van*) | §5 |
| baja | Cadenas: *Cuatro puertas*, *manos vacías* | *Cuatro puntas de la misma hoja.* y *Entrá con la campera puesta.* (§6.2); *sinNoche* confirmada |
| baja | El documento quedó viejo frente al árbol (§6.2 y §6.3 con `desafio` vigente, la fila `marca`, el sello `Adentro`, el test que no contaba `por` ni `me`) | Puesto al día contra `copy.ts`, el JSON, las enmiendas de `D-57` y `banco.test.ts` (§2, §3, §6, §8, §9) |

## 13. Vuelta 4 de arreglos (2026-10-04): la última, y quién la cerró

**Quién la escribió.** La empezó `contenido` sobre la lista de la verificación final de la vuelta 3
(30 problemas) y con la vara de la enmienda 7 de `D-57`, y se cortó antes de terminar: el cupo de
subagentes se agotó hasta el 8 de octubre. Dejó cambiados 25 de los 30 ítems, las bajadas de
`CU-3` y `CU-4`, las líneas que cantan de `adentro` y `vuelta`, y este documento hasta el §12.
**El cierre lo escribió el hilo principal** y está marcado así en la `notaInterna` de cada ítem
que tocó; `contenido` lo revisa cuando vuelva, y si algo no le cierra, manda su texto.

**Lo que hizo `contenido`** (está en la `notaInterna` de cada ítem, con "Vuelta 4" adelante):

- **La luz sin parentesco**: salieron *mi vieja*, *mis viejos*, *mi hermana* y *mi prima*. La luz
  supone a alguien —es la definición del eje— y no le cierra la opción a quien no tiene a quién.
- **Teléfono en un tercio de las luces** (cinco de quince), el tope de la enmienda 7.
- **Sin la distracción del que no mira**: salieron *grabar para un compa* y *cuchichear* en la
  pausa; quedaron *aplaudo con el resto* y *grito con el resto*, que se hacen sin hablarle a nadie.
- **Sin el recuerdo de quien te pasó la música** (`EJ-037`), que a cuatro meses del 5 de junio era
  una escena de ausencia.
- **Sin credenciales ni contradicciones**: salió *Ya sé cómo sigue* (`EJ-052`, saber la lista de
  temas) y los tres *Ya* de orden; `EJ-038` dejó las indicaciones (silla de ruedas, noche sin
  compañía) por *Hay nubes en el cielo*; `EJ-044` dejó el guardarropa; `EJ-033` dejó el *ya voy*.
- **Las líneas que cantan** sin *bombo* (el de la tribuna) ni *zumbido* (da por hecho que se estuvo
  cerca de los parlantes): *Golpe en el pecho, primer acorde.* y *Frío en las manos, llave en la
  puerta.*

**Lo que cerró el hilo principal:**

| Ítem | Era (vuelta 4 de `contenido`) | Queda | Por qué |
|---|---|---|---|
| `EJ-041` luz | *Le cuento cómo me suena* | *Comento cómo me suena* | El «le» no tenía a quién referirse: el enunciado no pone a nadie. *Se lo cuento a alguien* hacía de *alguien* la firma de luz (tres contra cero) y la guarda lo agarró |
| `EJ-047` luz | *La canto a dúo* | *Escucho cómo la canta* | Cantar a dúo pide saberse la letra: la credencial de `BR-36`. Escuchar cómo la canta el otro no pide nada, y no le pone género |
| `EJ-052` orden / caos | *Me pongo algodón* / *Así me gusta* | *Traje algodón por las dudas* / *Me tapo con los dedos* | *Así me gusta* era una preferencia (y la del que aguanta el volumen), no resolver sobre la marcha. Ahora las dos cuidan el oído: una lo previó, la otra se arregla con lo que tiene |
| `TARJETA.credito` | *…(Rocambole, 1996), en baja.* | *Lomo, mármol y esquinero de la tapa de Luzbelito (Rocambole, 1996).* | *En baja* es jerga de imprenta (§6.2) |

**Verificado:** `node --test src/lib/dos-ejes/banco.test.ts src/lib/voz.test.ts src/lib/esquemas.test.ts src/lib/pisos.test.ts src/lib/dos-ejes/partida.test.ts`
da 121 de 121, y la suite entera queda en el `ESTADO.md` del cierre. Lo que ninguna máquina ve
—si las cuatro maneras se dicen con el mismo orgullo, si la luz de un momento le queda posible a
quien fue sin compañía— lo mira `REV-19`.

