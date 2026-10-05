# CNT-31 — La noche ricotera: el banco de "¿Qué tipo de ricotero sos?" con el barro, el chori, la birra, el porro y la familia

- **Rol dueño:** `contenido`
- **Fecha:** 2026-10-04, ciclo 18. **Vuelta 6 (arreglos del verificador adversarial): 2026-10-05**, §11.
- **Estado:** entrega completa, con la vuelta 6 aplicada. Reescribe `src/data/dos-ejes.json` (los 30 enunciados, las cinco líneas que cantan y las cuatro bajadas) sobre el banco de `CNT-30` vuelta 4. **Las tablas de `CNT-30` §3, §4 y §5 pasan a ser historia**: este documento describe el banco como queda. De `CNT-30` siguen vigentes las reglas de §2 que `D-59` no toca (el cuerpo capaz, la seguridad, los dos ejes, la sintaxis que no delata el polo) y el §6 (cadenas de pantalla), salvo lo que dice el §10 de acá.
- **Consume:** `D-59` (entera, con su síntesis), `D-57` y sus siete enmiendas (sobre todo la 7: la luz), `BR-17`, `BR-36`, `BR-37` y `BR-38` (que ya existe: la leí entera en la vuelta 6), `CNT-30` (el banco y por qué cada escena es como es), `INV-172` (`RES-172`..`RES-194`), `INV-150` (`RES-154`, `RES-156`, `RES-158`, `RES-160`, `RES-161`), `D-14`, `D-17`, `.claude/rules/voz-ricotera.md`, `.claude/rules/contenido-json.md`, `src/lib/dos-ejes/banco.test.ts` (las 24 pruebas, línea por línea) y `src/lib/voz.test.ts`.
- **Produce:** `src/data/dos-ejes.json` (schema v2 de `CTR-08`, sin claves nuevas): `EJ-029`..`EJ-058` reescritos con el mismo id (sin huecos, tres por celda, todos `listo` con `momento`), las cinco líneas que cantan, las cuatro bajadas, y `EJ-001`..`EJ-028` intactos y `retirado`. **IDs nuevos de este documento: ninguno** (los ítems se reescriben con su id, como permite `Docs/IDS.md` mientras no cambie lo que miden: cada uno sigue midiendo lo mismo en el mismo eje y el mismo momento).
- **No hago acá:** el schema, el motor, la isla, el taller de tarjetas ni las guardas (`BR-38` es de `producto`; las guardas de `banco.test.ts`, del hilo principal). Si algo de eso dice otra cosa que este documento, manda el de ellos y se vuelve acá.
- **Ficha `RES-XX` pendiente:** ninguna. Una escena del test no afirma nada de ningún recital real, así que no lleva ficha (`CTR-08.5` regla 5). Lo que sí hago es **decir de dónde salió cada textura**: casi todo es *leyenda* de `INV-172` (ninguna página se abrió) y la usé como escenario, nunca como dato.
- **No lo corrí** (`D-12`). Medí a mano cada texto contra las 24 pruebas de `banco.test.ts` (§8), contra las siete de `voz.test.ts` y contra el schema, y sobre el JSON ya escrito corrí con `Grep` los vetos por expresión regular (nada cae fuera de los 28 retirados). El comando que lo corre de verdad está en el §10.

## 1. Qué pidió `D-59`, y cómo lo leí

El usuario pidió que la noche sea la ricotera de verdad: *"barro, sucio, drogas, reviente, y también familia, amigos, amor. Un choripán, un pancho, una birra, un porro, hasta cocaína debe ser parte del recital. La previa, ir un rato antes a escabiar o no."* Lo leí en cuatro frases:

1. **Lo sucio no es un adorno: "lo primero no puede faltar".** Cada uno de los cinco momentos lleva una parte sucia (el aire, la comida, el barro, lo que se toma o se fuma) y una parte tierna (los tuyos, un padre, una pareja, un amigo), en el mismo momento. **Desde la vuelta 6 eso se mide por celda** (`BR-38`: una de las tres escenas de cada momento × eje trae, en el enunciado, barro, mugre, humo, lo que se toma o se fuma o el reviente): diez de diez (§3, "El piso de lo sucio").
2. **Quien juega elige cómo se mueve, no si consume.** Lo sucio va en el **enunciado**, como la escena que ya está puesta. Las opciones son lo que hacés vos adentro de esa escena, y **ninguna de las 60 nombra lo que se toma o se fuma**. En dos ítems (`EJ-029` y `EJ-048`) las opciones contestan a la ronda que pasa —pasarla sin tomar ni fumar, o quedarse aparte—, que es el modelo que `D-59` describe para la previa. Es la solución más simple a "lo que se toma o se fuma nunca de un solo lado" (la guarda de `banco.test.ts` da trivialmente) y es la que mejor le sirve al quinto lugar.
3. **La merca es paisaje.** Una mención, en un enunciado, en una oración propia (§5).
4. **La banda y sus rituales entran a la escena, sus personas no.** Aparecen "los Redondos", "la misa", "el pogo", "los trapos" y "el pasacalle"; no aparece nadie por su nombre ni el escenario con alguien arriba (el Indio murió el 5 de junio de 2026).

Y lo que **no** cambia, aunque la escena sea otra: la noche en cinco momentos, los dos ejes, tres por celda, los cuatro nombres, que ninguna pregunta pida saber de la banda, que ninguna respuesta sea mejor que otra, y las tragedias, el cuerpo capaz y la seguridad afuera.

## 2. Qué cambia respecto de `CNT-30` y qué no

| | `CNT-30` (vuelta 4) | `CNT-31` |
|---|---|---|
| El recital | "un recital", sin dueño, sin banda, sin misa, sin pogo | el recital ricotero: Redondos, misa, pogo, trapos, pasacalle, caravana (solo en enunciados, líneas que cantan y bajadas) |
| Lo que se come y se toma | vetado de todo el banco (el test leía *vino*, *birra*…) | en el **enunciado**: fernet, birra, vino, chori, pancho, porro. Nunca nombrado en una opción |
| La plata | ni puesto ni micro ni pancho en ninguna parte | el puesto, el micro y la combi **están en la escena**; ninguna opción compra, paga ni tiene entrada (`D-59` punto 4) |
| Los que no entraron | no existían (la noche era "la normal") | `EJ-043` (la reja y los trapos) y `EJ-045`/`EJ-046` (el charco y la fila) (`RES-154`, `RES-176`) |
| La merca | vetada | una mención de paisaje en `EJ-049` |
| La familia y el amor | sin parentesco en ningún texto | **en el enunciado y de terceros** (una nena en los hombros de su viejo, una pareja bajo una campera). En una opción, ninguno (enmienda 7, y la guarda) |
| Los cinco lugares | cuatro | **cinco**: suma *el que no toma ni fuma* (§4) |
| Las opciones | 60, afinadas en cuatro vueltas | **51 de 60 iguales** (no tiré lo que costó cuatro vueltas); cambian `EJ-029` (las dos), `EJ-030` (la A), `EJ-042` (la A), `EJ-048` (las dos), `EJ-051` (la A) y `EJ-052` (las dos). Las cuatro últimas de esa lista son de la vuelta 6 |
| La luz con teléfono | cinco de quince | **tres firmes de quince** (`031`, `036`, `055`) |

**Por qué casi no toqué las opciones.** `CNT-30` §2 y §4 explican, ítem por ítem, qué sacó cada vuelta (el parentesco, el «mío» del lado de luz, los auriculares, la distracción del que no mira, la excusa del caos, la firma por raíz). `D-59` dijo dónde va lo sucio —en el enunciado— y eso permite que el banco cambie de textura sin reabrir nada de lo que ya estaba cerrado. El riesgo de tocar una opción es el de siempre: **cada palabra nueva entra a una guarda por raíz que nadie corre a mano sin errar** (el `me` de luz ya está tres veces, el de oscuridad cuatro). La vuelta 6 tocó las que el verificador mostró chocando con su escena (§11) y recontó las raíces de las 60 (§8, fila 19).

## 3. La noche, momento por momento

Cada fila dice qué entró de `INV-172`, con su ficha. **Todo es *leyenda* de prensa sin abrir** (la previa, el puesto, el barro): sirve de escena, no de dato, y ninguna escena lo afirma como cosa que pasó.

### La previa — *Botella cortada, guitarra afinando, olor a yerba.*

- **Parte sucia:** el fernet que pasa en la botella cortada (`EJ-029`; `RES-173`, `RES-178`), la birra tibia en la plaza (`EJ-031`), la ropa que va a terminar con barro (`EJ-034`; `RES-177`, `RES-185`), las zapatillas viejas (`EJ-032`).
- **Parte tierna:** uno de los tuyos afinando una guitarra junto al fogón (`EJ-030`; `RES-172`), los que llegan tarde (`EJ-031`), el vecino de carpa que te grita (`EJ-033`; `RES-172`).
- **El ítem de "ir a escabiar o no":** `EJ-029`. La esquina, los tuyos y el fernet son la escena; las dos opciones son de la ronda (pasarlo y seguir charlando, o quedarse en el cordón) y ninguna dice qué se toma. Es lo que `D-59` punto 2 describe como "sumarse a la ronda, que no obliga a tomar, o quedarse con lo propio".
- **La que canta cambió:** era *Campera puesta, llaves en el bolsillo.* Ahora son tres objetos de la previa: la botella cortada, la guitarra, la yerba. La botella cortada es lo primero que se lee en la primera hoja: es a propósito ("lo primero no puede faltar"), y es un objeto, no una escena de alguien tomando.

### La ida — *Ventanilla empañada, latas rodando, ruta que se estira.*

- **Parte sucia (vuelta 6):** el olor a chori y a vino en la combi (`EJ-035`; `RES-173`, `RES-178`, `RES-172`), la olla de panchos de la parada de ruta (`EJ-037`; vocabulario del puesto, sin ficha, `RES-173`), la birra que va de mano en mano en el fondo (`EJ-039`; `RES-173`, `RES-178`). **La vuelta 5 había contado «la caravana» y «los micros en fila» como parte sucia y no lo son**: son paisaje de la ida, y con ellos la ida entera no traía nada de la lista de `BR-38`.
- **Parte tierna:** los míos en la combi (`EJ-035`; `RES-174`, `RES-160`), el pasacalle sobre la ruta y la foto para quien querés (`EJ-036`; `RES-172`), el parlante que pasa de mano en mano (`EJ-039`), los Redondos a todo volumen en la caravana (`EJ-040`; la banda como paisaje, `D-59` punto 5).
- **Qué no entró:** el dedo (`RES-174`, `RES-189` lo dicen: es el veto de seguridad), las cifras de micros y los nombres de las agencias (los verificadores mandaron sacarlos), el viaje de 43 horas de Mauro (`RES-160`: testimonio, y una persona real).
- **La que canta cambió dos veces.** Era *Ruido de fondo, el camino que se estira.*; la vuelta 5 la dejó en *Ventanilla empañada y la ruta que se estira.* (el vidrio con el aliento de todos) y la vuelta 6 le suma lo que le faltaba: *latas rodando*, el piso de una combi de verdad. Es un objeto, no una escena de alguien tomando, y no nombra la birra. Es la más ancha de las cinco (55 caracteres).

### La vereda — *Pies en el barro y un parlante lejano.*

- **Parte sucia:** el humo del puesto de chori (`EJ-041`; `RES-173`, `RES-178`), el barro que ya se tragó una zapatilla (`EJ-045`; `RES-185`: Gualeguaychú 2014, leyenda), el frío que pela (`EJ-044`; `RES-184`, `RES-177`), la fila (`EJ-046`; `RES-176`).
- **Parte tierna y de los que no entraron:** los trapos atados a la reja, uno por barrio (`EJ-043`; `RES-154`, `RES-156`, `RES-193`: *sin nombres reales*), la pareja que se tapa con una sola campera bajo la llovizna y el amigo con quien te tapás (`EJ-042`; `RES-191`, solo la forma).
- **Dos precauciones.** *El barro es de Gualeguaychú y no de Olavarría:* el enunciado no dice cuál, pero no usé "cementerio", ni terminal, ni lluvia de crónica (`RES-188` es un veto con fuente). Y *"siempre llueve"* no se dice nunca: `RES-187` es la ficha que protege de eso (el cielo gris de la ida no dice qué cae después).
- **La que canta cambió:** era *Baldosa fría y un parlante lejano.* La baldosa pasa a barro (la vereda de la noche ricotera ya no es baldosa) y el parlante lejano se queda: es lo que llega de adentro para el que no entró.

### Cuando suena — *Golpe en el pecho y todos cantan.*

- **Parte sucia:** el porro que se pasan los tuyos entre tema y tema (`EJ-048`; `RES-179`: lo único del consumo que nombra la crónica de color, según el buscador), el humo y la merca (`EJ-049`; §5), el pogo y el reviente que llegan hasta la calle (`EJ-052`; `RES-158`), el sudor (`EJ-050`; `RES-187`).
- **Parte tierna:** alguien tuyo cantando con los ojos cerrados (`EJ-047`), una nena que canta en los hombros de su viejo (`EJ-051`; `RES-190`), los abrazos que se cuentan al otro día (`EJ-050`).
- **La que canta cambió:** era *Golpe en el pecho, primer acorde.* El golpe se queda y "primer acorde" se va (era técnico y apuntaba a un tema). Entra "todos cantan": el canto de todos, que `D-59` pide en la escena.

### La vuelta — *Zapatillas embarradas, llave en la puerta.*

- **Parte sucia:** la campera que huele a humo (`EJ-053`; `RES-176`), la mugre en las uñas y la boca seca (`EJ-056`; `RES-176`, `RES-187`), los pies helados de madrugada (`EJ-054`; `RES-184`), el cuerpo hecho pelota (`EJ-055`).
- **Parte tierna:** avisar que llegaste (`EJ-054`), el grupo que sigue despierto (`EJ-055`), la guitarra en la plaza otra vez (`EJ-057`; `RES-172`), la casa en silencio.
- **"Pegar la vuelta":** entra solo en `EJ-058`, en pasado y ya en casa (*Pegaste la vuelta: el parlante sigue prendido en la mochila*). La vuelta sigue sin trayecto: sus seis escenas pasan adentro de la casa (`CNT-30` §2, seguridad).
- **La que canta cambió:** era *Frío en las manos, llave en la puerta.* La llave se queda (cierra el círculo con la casa de la previa) y entran las zapatillas embarradas, el objeto que `D-59` pidió.

### El piso de lo sucio (`BR-38`), celda por celda

Con la lista **estricta** de `BR-38` —barro, mugre, humo, lo que se toma o se fuma, reviente—, sin contar la merca, el pancho, el sudor, la boca seca ni «hecho pelota», y **solo en el enunciado**:

| Celda | Qué escena y qué palabra |
|---|---|
| previa × luz | `EJ-029` *fernet*; `EJ-031` *birra* |
| previa × orden | `EJ-034` *barro* |
| ida × luz | `EJ-035` *vino* |
| ida × orden | `EJ-039` *birra* |
| vereda × luz | `EJ-041` *humo* |
| vereda × orden | `EJ-045` *barro* |
| adentro × luz | `EJ-048` *porro*; `EJ-049` *humo* |
| adentro × orden | `EJ-052` *reviente* |
| vuelta × luz | `EJ-053` *humo* |
| vuelta × orden | `EJ-056` *mugre* |

Diez celdas, diez con al menos una. Con la vuelta 5 fallaban cuatro (ida × luz, ida × orden, adentro × orden, vuelta × orden). **Ninguna guarda lo cuenta todavía** (hueco 1 de `BR-38`): propongo una al hilo principal en `Docs/SUGERENCIAS/CNT-para-hilo-principal-noche-ricotera.md`, con la lista de palabras.

## 4. El quinto lugar: *el que no toma ni fuma*

`D-59` suma un quinto lugar a la prueba de `BR-36` (nunca fui · sin plata · silla de ruedas · volviendo de noche sin compañía): **¿puede elegir cualquiera de las dos opciones, de verdad y sin sentirse el que no pertenece, alguien que no toma ni fuma —por salud, por los hijos, porque dejó—?** Lo vigila `banco.test.ts` (que lo que se toma o se fuma no separe los polos) y lo lee `REV-20`.

**Cómo lo resolví.**

1. **Lo que se toma o se fuma vive en el enunciado y ninguna opción lo nombra.** Aparece en seis enunciados —`EJ-029` (el fernet), `EJ-031` (la birra tibia y la yerba), `EJ-035` (el vino en el aire de la combi), `EJ-039` (la birra del fondo), `EJ-048` (el porro) y `EJ-049` (la merca, aparte)— y en ninguna de las 60 opciones. Lo comprobé con `Grep` sobre el JSON con la lista de `CONSUMO` del test: ninguna opción cae.
2. **Lo sucio de un enunciado es paisaje de al lado, o la ronda de los tuyos; nunca la mano de quien juega.** En `EJ-031`, `EJ-035` y `EJ-039` el aire huele a birra o a vino, o la birra va por el fondo, y las opciones son de otra cosa: el que toma y el que no eligen igual. En `EJ-029` y `EJ-048` la ronda pasa entre los tuyos y **las dos opciones son de esa ronda y no del consumo**: pasarla (que no obliga a tomar ni a fumar) y seguir charlando o aplaudiendo, o quedarse aparte (*Me quedo en el cordón*, *Miro subir el humo*). Una opción que contestara a la botella con otra bebida (*Se la paso al de al lado*, *Me sirvo*) deja a la otra como "la del que no".
3. **Lo que no se toma entra al banco como cosa de la escena, no como la manera de no tomar.** El mate (en una bajada), la yerba (en un enunciado y en la que canta de la previa), el agua y el té (en opciones de la vuelta) están, pero **ninguno es la alternativa a la birra**: no puse una opción "me cebo un mate" frente a otra que bebe, porque eso nombra al que no toma como una manera de ser (y lo marca). La yerba entra como olor de la plaza; el agua, en la vuelta, como lo que le pide la boca seca a quien tomó y a quien no.
4. **Cada ítem, en su `notaInterna`, lleva el veredicto del quinto lugar** con la razón, igual que los otros cuatro.

**Lo que no resolví con reglas y le dejo a `REV-20`:** `EJ-029` A (*Lo paso y sigo charlando*) y `EJ-048` A (*Lo paso y aplaudo*) se refieren con un pronombre a lo que pasa por la ronda (el fernet, el porro). **La guarda `CONSUMO` no ve pronombres** (da 0 de 60), así que ese caso lo mira el ojo. Para quien no toma ni fuma se puede pasar una botella o un porro sin consumirlo, que es lo que `D-59` dice; alguien puede leer la A como "la del que sí". Si `REV-20` la lee así, la salida es sacar el consumo del enunciado y dejar la ronda con la música (la guitarra de `EJ-030`), a costa de que `EJ-029` y `EJ-048` pierdan lo suyo. Sería el cambio de una línea cada una.

## 5. La merca

**Una sola mención, en `EJ-049`:** *Hay humo y merca dando vueltas. Entran los instrumentos de golpe. ¿Qué te sale?*

- **Por qué ahí y no en otro lado.** `D-59` punto 3 dice "paisaje, nunca elección", y el lugar donde el reviente pesa más es cuando entra el volumen. Las dos opciones (*Grito con el resto* / *Me retumba en la panza*) son del cuerpo y de la sala; ninguna toca ni se acerca a la merca.
- **Cómo está dicha (vuelta 6).** En una oración propia, como cosa de alrededor (*Hay humo y merca dando vueltas.*), y **separada de la frase del golpe y de la pregunta**: la vuelta 5 la tenía en la misma oración que *¿Qué te sale?* y la reacción del cuerpo podía leerse como efecto. Sin adjetivo, sin glamour y sin sermón: no dice quién la usa, ni qué pasa después, ni que sea buena o mala. Se sacó el barro de la oración: *droga + barro + campo + «de golpe»* es la fórmula de la crónica de Olavarría que `INV-172` dejó afuera (`RES-183`: *«los muertos habían consumido drogas y alcohol»*; `RES-188`), y `BR-38` pide que no haya barro puesto al lado de lo que lo evoca.
- **Qué respaldo tiene.** `INV-172` lo dijo claro: *la cocaína no aparece en ninguna crónica de color como escena; está en la policial y en lecturas de fans* (`RES-179`, `RES-181`). **Rótulo: leyenda.** Se usa igual (`D-14`), como el aire de la escena del test y no como un hecho sobre ningún recital real. No lleva ficha porque no afirma nada.
- **No cuenta para lo sucio de `BR-38`**: el piso de la celda adentro × luz lo cumplen el porro y el humo de `EJ-048` y de `EJ-049`, no la merca.
- **Qué descarté.** *Una raya en el baño*, *alguien se manda una*, *el que vende en la puerta* (cada una pone una persona haciendo algo: una escena que las opciones esquivan o contestan, y de las dos sale la merca como elección); *un papel de merca* (glamour de la cosa); y la mención en cualquier opción (`VETOS_DE_LAS_OPCIONES` ya la veta). La palabra elegida es *merca* y no *cocaína* ni *falopa*: es la que usa la gente en la previa; *cocaína* suena a parte policial y *falopa* es la palabra que `RES-180` pone en boca del Indio (y una palabra suya no se usa sin ficha). Ojo con un parecido: *Monona blues (Merca para vender)* está en cuarentena (`RES-181`, `D-13`) y no es evidencia de nada; el enunciado no lo cita ni lo evoca (ninguna canción se nombra).
- **La pregunta que le queda a `REV-20`:** ¿*humo y merca* en una oración propia se lee como paisaje o como guiño? Si se lee como guiño, la salida es sacar el *humo* de esa oración (*Hay merca dando vueltas.*) o cambiar de cosa de alrededor, no sacarla.

## 6. Los treinta ítems

`L` = `luz-oscuridad` (A = `luz`, B = `oscuridad`). `O` = `orden-caos` (A = `orden`, B = `caos`). En el archivo las opciones van siempre en ese orden; el motor las baraja. **Todos dan ✓ en los cinco lugares**, con la razón en su `notaInterna`. "Igual" = la opción es la de `CNT-30` vuelta 4, sin tocar. "V6" = lo cambió la vuelta 6 (§11). Las fichas son todas leyenda (§3).

### La previa

| Id | Eje | Enunciado | A | B | Qué cambió | Lo sucio / lo tierno (ficha) |
|---|---|---|---|---|---|---|
| `EJ-029` | L | En la esquina, los tuyos pasan el fernet en una botella cortada. | Lo paso y sigo charlando | Me quedo en el cordón | Enunciado y las dos opciones. Era *Alguien tuyo te manda un tema.* / *Le contesto con otro* / *Lo escucho bien fuerte*. **V6: la B era *Subo mi música*** (el parlante cruzaba a luz; con auriculares, aislarse en medio de los tuyos) | fernet y botella cortada · los tuyos (`RES-173`, `RES-178`, `RES-172`) |
| `EJ-030` | L | Uno de los tuyos afina una guitarra junto al fogón. | Me arrimo y canto | Tamborileo en la rodilla | Enunciado y la A. Era *Suena música mientras te preparás.* / *La subo para compartirla* | guitarra y fogón · uno de los tuyos (`RES-172`, `RES-161`) |
| `EJ-031` | L | La plaza huele a birra tibia y a yerba. Faltan los que llegan tarde. | Le escribo a una amiga | Tarareo un tema | Enunciado. Opciones iguales. Era *Falta un rato para salir.* | birra tibia y yerba · los que llegan tarde (`RES-173`, `RES-178`, `RES-172`) |
| `EJ-032` | O | Zapatillas viejas, campera y mochila. ¿Cuándo las juntás? | Las dejo juntas desde antes | Las agarro al vuelo | Enunciado. Opciones iguales. Era *Hay cosas para llevar al recital.* **V6: *«una bolsa para el recital»* no se entendía para qué era; queda *mochila*** | zapatillas viejas (el barro sin nombrarlo) (`RES-177`, `RES-185`) |
| `EJ-033` | O | Desde la carpa de al lado te gritan: ¿cuándo salís? | Le doy el dato justo | Le digo: en un rato | Enunciado. Opciones iguales. Era *Alguien te pregunta cuándo salís.* | la carpa del acampe · el vecino que grita (`RES-172`) |
| `EJ-034` | O | Te vestís para el recital. La ropa va a terminar con barro. | Sé qué me pongo | Me visto según el humor | Enunciado. Opciones iguales | el barro como certeza de la noche (`RES-177`, `RES-185`) |

### La ida

| Id | Eje | Enunciado | A | B | Qué cambió | Lo sucio / lo tierno (ficha) |
|---|---|---|---|---|---|---|
| `EJ-035` | L | Olor a chori y a vino en la combi. El camino es largo. | Hablo con los míos | Tarareo una que me gusta | Enunciado. Opciones iguales. Era *El camino se hace largo. ¿Cómo lo llevás?* **V6: la vuelta 5 decía *En la combi suena un disco de los Redondos*, y con la banda sonando *Tarareo una que me gusta* se leía como una de ese disco** (la banda se muda a `EJ-040`) | combi del barrio · olor a chori y a vino (`RES-174`, `RES-160`, `RES-173`, `RES-178`) |
| `EJ-036` | L | Un pasacalle gigante cuelga sobre la ruta. Sacás una foto. | La mando a quien quiero | Le encuentro un detalle | Enunciado. Opciones iguales. Era *Sacás una foto camino al recital.* | pasacalle sobre la ruta · la foto a quien querés (`RES-172`) |
| `EJ-037` | L | En la parada de ruta, hierven los panchos. Se te viene un tema. | Se lo tarareo a alguien | Lo busco y lo escucho | Enunciado. Opciones iguales. Era *Te acordás de un tema.* **V6: el *pancho frío* en la mano de quien juega daba la plata por hecha; ahora es la olla del puesto** | la olla de panchos de la parada (`RES-174`, `RES-173`) |
| `EJ-038` | O | Los micros hacen fila y el cielo se pone gris. | Llevo algo por si llueve | Si llueve, llueve | Enunciado. Opciones iguales. Era *Hay nubes en el cielo.* | micros en fila (`RES-160`, `RES-174`, `RES-187`): paisaje, no cuenta como sucio |
| `EJ-039` | O | Te pasan el parlante. En el fondo, una birra va de mano en mano. | Elijo la música con calma | Pongo una sin mirar | Enunciado. Opciones iguales. Era *Vas a escuchar música en el camino.* **V6: la ida de orden-caos no tenía nada sucio; la birra va por el fondo, lejos de la mano de quien juega** | el parlante que pasa · la birra del fondo (`RES-174`, `RES-160`, `RES-173`, `RES-178`) |
| `EJ-040` | O | La caravana avanza con los Redondos a todo volumen. Falta para llegar. | Lo parto en tramos | Me dejo llevar | Enunciado. Opciones iguales. Era *Falta para llegar al recital.* **V6: acá se mudan los Redondos desde `EJ-035`; ninguna opción toca la música** | la caravana · la banda como paisaje (`RES-174`, `RES-189`) |

### La vereda

| Id | Eje | Enunciado | A | B | Qué cambió | Lo sucio / lo tierno (ficha) |
|---|---|---|---|---|---|---|
| `EJ-041` | L | Del puesto de chori sube humo y se oye la prueba de sonido. | Comento cómo me suena | Le busco el ritmo | Enunciado. Opciones iguales. Era *Se oye la prueba de sonido.* | el puesto y el humo del chori (`RES-173`, `RES-178`, `RES-161`) |
| `EJ-042` | L | Cae una llovizna fina y una pareja se tapa con una campera. | Me tapo con un amigo | Miro llover contra el farol | Enunciado. Era *Cae una llovizna fina.* / *Aviso a un amigo: llueve*. **V6: la A era una acción chata y la pareja quedaba de decorado; ahora contesta a la escena** | la pareja de terceros y el amigo (`RES-191`, solo la forma) |
| `EJ-043` | L | En la reja, cada barrio ata su trapo. | Los comento con los míos | Elijo mi favorito | Enunciado (de afiches a trapos). Opciones iguales. **V6: la vuelta 5 decía *Los que no entraron atan trapos en la reja*: dejaba a quien juega del lado de los que entraron y chocaba con `EJ-045` y `EJ-046`** | la reja y los trapos (`RES-154`, `RES-156`, `RES-193`) |
| `EJ-044` | O | Frío que pela en la vereda. Tenés campera y buzo. Después puede dar calor. | Me abrigo en capas | Me la saco al rato | Enunciado. Opciones iguales. **V6: *Tenés la campera* (una sola capa) contra *Me abrigo en capas*** | frío de vereda (`RES-184`, `RES-177`) |
| `EJ-045` | O | El barro ya se tragó una zapatilla y las puertas siguen cerradas. | Saco el mazo de cartas | Armo un barquito de papel | Enunciado. Opciones iguales. Era *Todavía no empieza el recital.* | el charco y la zapatilla (`RES-185`) |
| `EJ-046` | O | Corre la voz en la fila: la misa empieza más tarde. | Lo tenía previsto | Lo tomo como viene | Enunciado. Opciones iguales. Era *Dicen que el recital empieza más tarde.* | la fila · "la misa" como paisaje (`RES-176`) |

### Cuando suena (`adentro`)

| Id | Eje | Enunciado | A | B | Qué cambió | Lo sucio / lo tierno (ficha) |
|---|---|---|---|---|---|---|
| `EJ-047` | L | Suena una canción lenta. Alguien tuyo la canta con los ojos cerrados. | Escucho cómo la canta | Muevo la cabeza despacio | Enunciado. Opciones iguales. Era *…Alguien tuyo la sabe.* | alguien tuyo con los ojos cerrados (`RES-190`, `RES-191`, solo la forma) |
| `EJ-048` | L | Entre tema y tema, los tuyos se pasan un porro. | Lo paso y aplaudo | Miro subir el humo | Enunciado y las dos opciones. Era *Cambian un instrumento entre tema y tema.* / *Aplaudo con el resto* / *Marco el compás*. **V6: el porro llegaba a la mano de quien juega y las opciones miraban a otro lado; ahora es el modelo de `EJ-029`** | el porro entre los tuyos (`RES-179`) |
| `EJ-049` | L | Hay humo y merca dando vueltas. Entran los instrumentos de golpe. ¿Qué te sale? | Grito con el resto | Me retumba en la panza | Enunciado. Opciones iguales. Era *Entran todos los instrumentos de golpe.* **V6: la merca en su oración, sin barro y aparte de la pregunta** | humo y merca: el reviente (`RES-179`, `RES-181`, §5) |
| `EJ-050` | O | Mañana te preguntan cómo estuvo: el coro, el sudor, los abrazos. | Elijo qué voy a contar | Lo cuento de una | Enunciado. Opciones iguales. Era *Te van a preguntar cómo estuvo el recital.* | el sudor y los abrazos (`RES-187`) |
| `EJ-051` | O | En los hombros de su viejo, una nena canta. La canción se te pega. | La repito para no perderla | La dejo dar vueltas | Enunciado y la A. Era *Una canción se te queda en la cabeza.* / *Me la grabo cantándola*. **V6: *me la grabo* se leía como grabar a la nena** | padre e hija, de terceros (`RES-190`) |
| `EJ-052` | O | El pogo no para y el reviente llega hasta la calle. | Me ubico y me quedo | Voy cambiando de sitio | Enunciado y las dos opciones. Era *El volumen cansa los oídos.* / *Traje algodón por las dudas* / *Me tapo con los dedos*. **V6: *adelante* y los parlantes sobre el cuerpo de quien juega rompían la enmienda 6, y las dos opciones eran cuidarse el oído** | el pogo y el reviente hasta la calle (`RES-158`) |

### La vuelta

| Id | Eje | Enunciado | A | B | Qué cambió | Lo sucio / lo tierno (ficha) |
|---|---|---|---|---|---|---|
| `EJ-053` | L | La campera huele a humo y todavía te dura la noche. | Se lo cuento a alguien | Me quedo con la noche | Enunciado. Opciones iguales. Era *Ya en casa, todavía te dura la noche.* | la campera con humo (`RES-176`) |
| `EJ-054` | L | Llegás de madrugada con los pies helados. La casa está en silencio. | Aviso que llegué | Preparo un té | Enunciado. Opciones iguales. Era *Llegás y la casa está en silencio.* | los pies helados, la madrugada (`RES-184`) |
| `EJ-055` | L | Tenés el cuerpo hecho pelota y no te da sueño. | Escribo en el grupo | Dibujo en un papel | Enunciado. Opciones iguales. Era *Es tarde y no te da sueño.* | el cuerpo hecho pelota |
| `EJ-056` | O | Mugre en las uñas y la boca seca. Se acerca la hora de dormir. | Dejo un vaso de agua | Me levanto si hace falta | Enunciado. Opciones iguales. Era *Se acerca la hora de dormir.* **V6: la boca seca no está en la lista de lo sucio de `BR-38`; entra la mugre** | la mugre en las uñas (`RES-176`, `RES-187`) |
| `EJ-057` | O | Te proponen otra noche de guitarra en la plaza. | Propongo un día | Acepto, con el día abierto | Enunciado. Opciones iguales. Era *Te proponen juntarse a escuchar música otro día.* | la previa otra vez, gratis (`RES-172`) |
| `EJ-058` | O | Pegaste la vuelta: el parlante sigue prendido en la mochila. | Lo conecto al cargador | Lo apago nomás | Enunciado. Opciones iguales. Era *Quedó el parlante prendido en casa.* **V6: con `EJ-054` (la casa en silencio) salía la contradicción una noche de cada nueve** | "pegar la vuelta", ya en casa (`RES-174`) |

### Los cruces

Los nueve pares de cada momento, en los dos órdenes, los volví a leer en voz alta tras la vuelta 6 (el motor sortea un ítem de cada eje por momento y los dos órdenes salen). Lo que queda para que `REV-20` mire:

- **La vuelta:** la contradicción de *la casa en silencio* con *el parlante prendido* se cerró en la vuelta 6 (el parlante está en la mochila). Queda un roce chico: `EJ-055` dice *no te da sueño* y `EJ-056` *se acerca la hora de dormir*; no se pisan (la hora se acerca, el sueño no llega).
- **La ida:** se cerró el cruce de dos músicas (`EJ-035` ya no tiene disco). `EJ-040` (los Redondos a todo volumen) y `EJ-039` (te pasan el parlante) son los dos de orden-caos y no salen juntos.
- **Cuando suena:** `EJ-047` (una canción lenta) con `EJ-052` (el pogo no para) es un roce de tono: la canción lenta sigue y el pogo es de otra parte de la sala; es de las que `REV-20` decide si sobran. Y `EJ-051` (la nena) puede salir con `EJ-048` o `EJ-049`: son pantallas distintas y el enunciado no las junta, pero `BR-38` pide que *un chico y lo que se toma o se fuma no compartan escena*: **lo lee `REV-20`**, porque ninguna guarda ve el cruce.

## 7. Las cuatro maneras

Los **nombres no se tocan** (`D-57` punto 5; `CNT-30` §5): *Mesa larga a las nueve*, *Ronda en cualquier esquina*, *Radio bajita, misma hora*, *Mochila liviana, sin mapa*. Cambian las bajadas, **con la misma forma** (un placer y un costo de `orden-caos` que paga quien juega: *Pero cuando alguien… a vos te toca…*). Cada una gana un objeto ricotera, y **ninguna nombra lo que se toma o se fuma**: la manera es lo que le queda a quien juega, y sería decirle que es "el de la birra" o "el que no".

| Id | Queda | Qué ganó |
|---|---|---|
| `CU-1` | *Hay una hora, un lugar, un chori en la parrilla y gente que te espera: la noche ya sabe adónde va. Pero cuando alguien cambia la hora, a vos te toca rearmar la mesa.* | el chori en la parrilla (la mesa larga con comida) |
| `CU-2` | *Te sumás a lo que aparece —una guitarra, un mate, otra canción— y la noche toma forma. Pero cuando alguien pregunta adónde siguen, a vos te toca elegir ahí mismo.* | la guitarra en lugar de la charla (el mate ya estaba) |
| `CU-3` | *Te cosés la noche a medida, puntada por puntada, con un disco y la vereda de siempre. Pero cuando alguien adelanta la salida, a vos te toca mover lo que venía después.* | el disco y la vereda de siempre. **V6: la vuelta 5 decía *el termo de siempre* y con `CU-2` repetía el mate (y con *olor a yerba* y *yerba*, el mate era la bebida más repetida de la noche)** |
| `CU-4` | *Con las botamangas que ya vieron barro, un cambio te abre otro y cada uno te alegra. Pero cuando alguien quiere saber el rumbo, a vos te toca averiguarlo en el celular.* | las botamangas que ya vieron barro (la mochila liviana que no teme ensuciarse). **V6: la vuelta 5 decía *las zapatillas*, y la zapatilla con barro ya salía en `EJ-032`, `EJ-045` y la que canta de la vuelta; la de `EJ-045` es la única con ficha (`RES-185`)** |

- **Largo:** 34, 30, 32 y 32 palabras (techo 36), recontadas en la vuelta 6; entre 162 y 168 caracteres (techo 240 del schema; el techo de las más largas que ya pasaron el taller fue 169). `CU-3` mide 167 y `CU-4` 168.
- **Sin género:** ninguna dice *solo/sola* ni participio que concuerde con quien juega.
- **Sin eco con las opciones:** comparé cada palabra de más de tres letras de las cuatro bajadas con las 60 opciones. Ninguna se repite (las únicas comunes a las cuatro son las de la forma: *alguien*, *cuando*, *noche*, *toca*). Las dos palabras nuevas de la vuelta 6 (*vereda*, *botamangas*) no están en ninguna opción, y las dos que salen (*termo*, *zapatillas*) tampoco estaban.
- **El orgullo:** tapados los nombres, los cuatro placeres son placeres y los cuatro costos son un roce chico que paga quien juega. El barro y las botamangas de `CU-4` son lo que más cerca queda del barro de `D-59` y no hablan de ninguna crónica.
- **Tarjetas:** cambiaron `CU-3` y `CU-4` (y antes las cuatro): hay que regenerarlas (§10).

## 8. Medición a mano contra `banco.test.ts`

Sobre el JSON ya escrito, tras la vuelta 6. Lo que dice "Grep" lo corrí con expresiones regulares copiadas de las listas del test.

| # | Prueba | Resultado |
|---|---|---|
| 1 | cinco momentos, en orden, `preguntasPorEje` = 5 | ✓ ids `previa`, `ida`, `vereda`, `adentro`, `vuelta`; 5 por eje |
| 2 | sello ≤ 3 palabras, canta ≤ 8, sin `…` | ✓ sellos intactos; cantas de 7, 8, 8, 7 y 6 palabras (la de la ida, 8: *Ventanilla empañada, latas rodando, ruta que se estira.*; 55 caracteres, techo 80 del schema) |
| 3 | todo ítem `listo` con momento | ✓ 30 de 30 |
| 4 | tres por celda y ≥ 30 | ✓ 10 celdas × 3 |
| 5 | ids sin repetir, `EJ-001`..`EJ-028` `retirado` | ✓ intactos |
| 6 | enunciado ≤ 14 palabras, opción ≤ 5 palabras y ≤ 28 caracteres | ✓ el enunciado más largo mide 14 palabras (`031`, `039`, `044`, `049`, `051`, `056`) y 79 caracteres (`049`, techo 120 del schema); la opción más larga mide 5 palabras y 27 caracteres (`032` A) |
| 7 | nombre ≤ 26 caracteres, bajada ≤ 36 palabras | ✓ (nombres sin tocar; bajadas de 34, 30, 32 y 32 palabras) |
| 8 | cada `CU-n` conserva sus polos | ✓ sin tocar |
| 9 | nombres sin persona | ✓ sin tocar |
| 10 | vetos de la noche en enunciado y opciones | ✓ Grep: nada fuera de los retirados (el único *viaje* es el de `EJ-013`, retirado) |
| 11 | los mismos vetos en sellos, cantas y bajadas | ✓ Grep: nada (ni *cana*, ni *fuego*, ni *indio*) |
| 12 | vetos de las opciones (plata, vehículo, cuerpo, banda, merca) | ✓ Grep: nada fuera de los retirados. *Redondos*, *misa*, *pogo* y *merca* solo están en enunciados |
| 13 | lo que se toma o se fuma nunca separa los polos | ✓ 0 de 60 opciones nombran consumo (la guarda no ve pronombres: `029` A y `048` A, §4) |
| 14 | la guarda del consumo sabe ver | ✓ es del test |
| 15 | sin parentesco ni pareja propia en una opción | ✓ Grep: nada; *su viejo*, *una pareja* y *los tuyos* están en enunciados |
| 16 | la vuelta sin *a pie*, *caminando*, *camino* | ✓ Grep: nada en los seis ítems de la vuelta (el *camino* de `EJ-035` es de la ida) |
| 17 | ninguna opción delata su eje | ✓ Grep: nada. Ningún enunciado dice *luz*, *oscur\**, *orden\**, *caos* |
| 18 | ninguna opción dice la traducción de su polo | ✓ Grep: ni *gente*, ni *propio*, ni *plan*, ni *sobre*, ni *marcha* |
| 19 | ninguna palabra es la firma de un polo | ✓ recontada a mano (abajo) |
| 20 | la firma sabe ver | ✓ es del test |
| 21 | sin género en primera persona | ✓ Grep: nada en opciones ni en bajadas |
| 22 | los enunciados no cierran todos igual | ✓ tres preguntas, las tres distintas (`032`: ¿cuándo las juntás?, `033`: ¿cuándo salís?, `049`: ¿qué te sale?); *¿Qué hacés?* no aparece |
| 23 | las dos opciones no son la misma frase | ✓ |
| 24 | ninguna opción apunta al nombre de una manera | ✓ comparé las 60 opciones con las 13 palabras de los nombres, los extras (*rincón, hora, horario, libro*) y las palabras de las cuatro bajadas de la vuelta 6; Grep: nada fuera de los retirados |
| 25 | **el piso de lo sucio por celda** (`BR-38`, hueco 1; **ninguna guarda lo cuenta**) | ✓ 10 de 10 con la lista estricta (§3, "El piso de lo sucio") |

**La firma de un polo (19), recontada entera en la vuelta 6.** Las raíces de las 60 opciones, por eje, con la regla del test (sin las palabras vacías, de tres letras o más más `me` y `mi`, cinco letras en las de seis o más). Ninguna raíz está en tres opciones de un polo y en ninguna del de enfrente. Las más repetidas, para que se vea el margen: en luz-oscuridad `paso` ×2 en luz (`029`, `048`), `escri` ×2 en luz, `algui` ×2 en luz, `mios` ×2 en luz, `comen` ×2 en luz, `busco` ×2 en oscuridad, `miro` ×2 en oscuridad, `quedo` ×2 en oscuridad; `me` ×3 en luz y ×4 en oscuridad (está de los dos lados). En orden-caos `elijo` ×2 en orden (`039`, `050`), `que` ×2 en orden, `rato` ×2 en caos; `dejo` ×2 y ×2, `me` ×3 y ×4. **Cualquier opción nueva que repita una de esas raíces del mismo lado rompe la guarda**: son las ocho de luz-oscuridad y las tres de orden-caos con dos.

## 9. Lo que descarté, para que no vuelva

- **Una opción que contesta a la botella con otra bebida** (*Se la paso al de al lado*, *Me sirvo*, *Convido de mi botella*): deja a la otra como "la del que no". Los dos ítems donde las opciones tocan la ronda (`EJ-029`, `EJ-048`) las hacen de la ronda, no de lo que se toma.
- **Una opción con mate frente a un enunciado con birra**: el mate pasa a ser "la del que no toma". El mate está en la escena y en `CU-2`; no es la alternativa a nada.
- **`ronda` y `esquina` en una opción**: son palabras de un nombre (*Ronda en cualquier esquina*) y la guarda las lee. Por eso *sumarse a la ronda*, que usa `D-59`, se dice *Lo paso y sigo charlando* o *Me arrimo y canto*.
- **El porro, el fernet o la birra pasados en una opción con su nombre** (*Le paso el porro al de al lado*): la guarda no lo prohíbe si las dos opciones nombran consumo, pero entonces las dos son de quien consume. Y *el de al lado* es un desconocido. La ronda es la de *los tuyos* y el objeto va con pronombre.
- **Una raya en el baño, alguien que vende, un papel de merca** (§5).
- **«Caña» y «gorra»**: el test saca tildes y la ñ, así que *caña* (la bebida) cae en el veto de la policía (*cana*), y *gorra* también. Quedan afuera de todo el banco.
- **El control de ruta y el dedo** en la ida (`RES-174`): policía y seguridad. **La conferencia de prensa, las bengalas, los detenidos, la valla** (`RES-176`, `RES-183`): registro 3.
- **El cementerio de zapatillas, la terminal, la lluvia del sábado** (`RES-188`): son de las crónicas vedadas; la zapatilla que se traga el charco es de `RES-185`.
- **Nombres propios** (Mauro, Sebastián y Tiziano, Claudia Canelo, Romina y Rafael, Hugo Andino): ninguna escena lleva un nombre. `RES-175` cayó como testimonio y `RES-190`/`RES-191` son leyenda sin apellido: sirven la forma, no la persona.
- **El 5 de junio** (`RES-192`, `RES-194`): ninguna escena, ni la plaza, ni los banderazos, ni el dolor de padres e hijos. La nena de `EJ-051` canta y no se despide.
- **El "ricotero" en una opción, "la misa" en una opción, "los Redondos" en una opción** (`VETOS_DE_LAS_OPCIONES`: puntúan quién es más de adentro). Y, desde la vuelta 6, **"los Redondos" en un enunciado cuya opción canta o tararea**: quien conoce los temas oye el disco y quien no, no (`EJ-035`).
- **`con lo que no te importe ensuciar`** en `EJ-034`: afirmaba la conducta de orden en el enunciado.
- **La botella cortada como escena de alguien que la toma** (*Alguien se sirve de la botella cortada*): una persona haciendo algo con la bebida; la botella en la canta es un objeto.
- **El pogo como acción** (`RES-158`: *meterse*, *saltar*): el pogo suena y nadie elige meterse (`D-59` punto 6). Tampoco *adelante*: pone a quien juega en el campo.
- **(vuelta 6) Contar la caravana y los micros en fila como parte sucia.** Son paisaje de la ida; no están en la lista de `BR-38`.
- **(vuelta 6) El pancho en la mano, el sudor, la boca seca y «hecho pelota» como parte sucia del piso.** Son textura y están; no cuentan para el piso. El piso se cumple con palabras de la lista de `BR-38`.
- **(vuelta 6) *Subo mi música* y *Aviso a un amigo: llueve* como opciones de luz y de oscuridad.** La primera cruza a luz o aísla; la segunda avisa a alguien que no está.
- **(vuelta 6) *Me la grabo*, con una nena cantando en la escena.** Se lee como filmarla.
- **(vuelta 6) Barro en el enunciado de la merca.** Es la fórmula de la crónica de Olavarría.

## 10. Para `REV-20` y para el hilo principal

**Lo que le pido a `revisor`, en este orden** (todo lo que ninguna máquina ve):

1. **El quinto lugar, ítem por ítem** (`notaInterna`): ¿alguna opción la elige peor el que no toma ni fuma? Mirá primero `EJ-029` A y `EJ-048` A (*Lo paso…*, §4: el pronombre que la guarda no ve) y `EJ-048` B (*Miro subir el humo*: ¿es "la del que no fuma"?).
2. **`EJ-049`, la merca** (§5): ¿paisaje o guiño? ¿*Humo y merca* en una oración propia es seco?
3. **La noche, ¿suena ricotera?** Es la pregunta del usuario. Las cinco líneas que cantan y los treinta enunciados, leídos de corrido, sin los títulos. **Mirá en especial las opciones leídas de corrido**, sin los enunciados: el verificador las leyó como el mundo de una excursión (*Preparo un té*, *Dibujo en un papel*, *Saco el mazo de cartas*, *Lo conecto al cargador*, *Tamborileo en la rodilla*), y no las toqué (§11, problema 2).
4. **Los que no entraron** (`EJ-043`, `EJ-045`, `EJ-046`): ¿se lee como lástima o como la escena? Desde la vuelta 6 `EJ-043` ya no los nombra.
5. **La banda en el enunciado** (`EJ-040`, *los Redondos a todo volumen*; `EJ-046`, *la misa*; `EJ-052`, *pogo*): ¿alguna pide saber algo? ¿Alguna opción queda "más de adentro" por lo que dice el enunciado? **Mirá `EJ-046`: con *la misa* en el enunciado, *Lo tenía previsto* puede leerse como "sé cómo son las misas".** No la toqué (§11, problema 13).
6. **La ternura** (`EJ-047`, `EJ-051`, `EJ-042`): ¿suena a homenaje a cuatro meses del 5 de junio? `EJ-047` es la que más se acerca (una canción lenta, alguien con los ojos cerrados).
7. **El teléfono y la luz con alguien al lado:** tres firmes (`031`, `036`, `055`) y tres que se pueden hacer por mensaje (`041`, `053`, `054`): seis como máximo, uno menos que antes. Tope de la enmienda 7: un tercio, cinco de quince. Con alguien al lado (los pone el enunciado o la opción): `029`, `030`, `035`, `042`, `043`, `047`, `048`; cada momento tiene al menos una luz que se hace sin nadie al lado (`031`, `036`/`037`, `041`, `049`, `053`/`054`/`055`).
8. **Los cruces flojos** (§6, "Los cruces"), sobre todo canción lenta con pogo y la nena junto al consumo.
9. **Las repeticiones.** El barro está en `034`, `045` y en las cantas de la vereda y la vuelta (`CU-4` ya no); el humo en `041`, `049`, `053` y en `048` B; las zapatillas en `032`, `045` y la canta de la vuelta; el mate en `CU-2` y la yerba en `031` y la canta de la previa. Es un estribillo a propósito, no un descuido; si cansa, `REV-20` dice cuál se va.

**Lo que le dejo al hilo principal.** Todo está en `Docs/SUGERENCIAS/CNT-para-hilo-principal-noche-ricotera.md`, con la tabla *Dónde | Hoy | Pasa a*. En una línea: **regenerar las tarjetas** (cambiaron las cuatro bajadas con `D-59`, y `CU-3` y `CU-4` otra vez en la vuelta 6), **una guarda para el piso de lo sucio por celda** (`BR-38`, hueco 1) y, si querés, dos cadenas del sitio (`LUGARES.dosEjes` y la bajada del casete). Nada de eso es de este documento ni bloquea el banco. Y a `experiencia`, en `CNT-para-experiencia-noche-ricotera.md`: la línea que canta de la ida cambió y es la más ancha.

**Derechos (`CNT-01`, `D-14`):** nada nuevo. No hay audio, tapa ni letra en el banco; la banda se nombra como paisaje (nombre, sin logo ni tipografía) en tres enunciados. Si llega un reclamo, se baja.

**Cómo se verifica** (no lo corrí; lo corre el hilo principal, `revisor` u `orquestador`):

```
node --test src/lib/dos-ejes/banco.test.ts
node --test src/lib/dos-ejes/partida.test.ts
node --test src/lib/voz.test.ts
node --test src/lib/esquemas.test.ts
node --test src/lib/pisos.test.ts
npm run generar-dos-ejes && node --test src/lib/dos-ejes/tarjetas.test.ts
```

`tarjetas.test.ts` va a fallar hasta que se regeneren las tarjetas, y no es un defecto del contenido: `huellaDelTaller()` entra con las bajadas, y la vuelta 6 cambió dos más. Hay un riesgo concreto del taller: las bajadas miden hasta 168 caracteres y el taller falla fuerte si una ocupa más de cinco renglones (la más larga que ya pasó fue de 169).

## 11. Vuelta 6: lo que encontró el verificador adversarial (2026-10-05) y qué hice

Un verificador leyó el banco y dio **tests verdes** (126 de 126; `tarjetas.test.ts`, 9 de 10, por las bajadas, ya avisado en §10) y **"suena ricotera: a medias"**: la escena era ricotera y quien la caminaba no. Doce problemas. Nada de lo que pidió contradice `D-59`: no hubo que descartar ninguno por eso. Lo que no hice, y por qué, está dicho.

| # | Gravedad | Dónde | Qué hice |
|---|---|---|---|
| 1 | alta | La ida entera, `adentro × orden`, `vuelta × orden`: el piso de `BR-38` falla en 4 de 10 celdas con la lista estricta; la que canta de la ida, limpia | **Hecho.** `EJ-035` (olor a chori y a vino), `EJ-039` (la birra por el fondo), `EJ-052` (el reviente), `EJ-056` (la mugre) y la que canta de la ida (*latas rodando*). Diez de diez (§3). El pedido de la guarda por celda va al hilo principal |
| 2 | alta | `031`, `037`, `041`, `048`, `049`, `052`, `053`: lo sucio de adorno; 57 de 60 opciones iguales; opciones "de excursión" | **Hecho a medias, a propósito.** Reescribí donde la escena y las opciones chocaban o no se pertenecían: `048` (modelo de `EJ-029`), `052` (par nuevo: dónde ubicarse), `037` (el pancho sale de la mano), `049` (la merca en su oración). **No toqué `031`, `041` ni `053`**: ahí lo sucio es el aire de un lugar y las opciones contestan a la otra mitad de la escena (esperar a los que llegan tarde, la prueba de sonido, la noche que dura), y reabrirlas es reabrir cuatro vueltas de afinado. **Tampoco toqué** *Preparo un té*, *Dibujo en un papel*, *Saco el mazo de cartas* ni *Lo conecto al cargador*: ninguna guarda ni `BR-38` las marca y su defecto es de oído; queda en el punto 3 de §10 para que `REV-20` decida si hay que cambiar una tanda aparte |
| 3 | alta | `EJ-035`: con *un disco de los Redondos*, *Tarareo una que me gusta* pide conocer los temas | **Hecho.** Sin disco ni banda en `035`; *los Redondos* se mudan a `EJ-040`, cuyas opciones no tocan la música. Como el verificador sugirió |
| 4 | alta | `EJ-052`: *adelante* y el volumen sobre quien juega; las dos opciones son del turista | **Hecho.** El pogo y el reviente llegan hasta la calle; el par es dónde ubicarse (*Me ubico y me quedo* / *Voy cambiando de sitio*), sin pedir cuerpo capaz ni meterse en el pogo |
| 5 | media | `EJ-049`: *humo, merca y barro*, la merca junto a la reacción del cuerpo, la fórmula de Olavarría | **Hecho**, como pidió: sin barro, la merca en una oración propia, la pregunta aparte (§5) |
| 6 | media | `EJ-029` B: *Subo mi música* tiene dos lecturas y las dos fallan; la guarda no ve pronombres | **Hecho.** B pasa a *Me quedo en el cordón*. La nota sobre los pronombres va al hilo principal y a `REV-20` (§4) |
| 7 | media | `EJ-037`: el pancho en la mano da la plata por hecha | **Hecho.** El pancho es de la olla del puesto |
| 8 | media | `EJ-043`: *los que no entraron* en tercera persona, opciones de vidriera, pretérito que choca con `045` y `046` | **Hecho**, con el texto que sugirió: *En la reja, cada barrio ata su trapo.* |
| 9 | media | `EJ-051`: *Me la grabo* se lee como grabar a la nena | **Hecho.** *La repito para no perderla* |
| 10 | media | `EJ-042`: la luz es avisar a alguien que no está; 8 de 15 luces son comentar o avisar | **Hecho en `042`** (*Me tapo con un amigo*) y de paso `048` pasa a pasar y aplaudir. Las luces de decir o mandar bajan de 8 a 7 de 15 (`031`, `036`, `041`, `043`, `053`, `054`, `055`); no reabrí el resto: queda dicho para `REV-20` (§10, punto 7) |
| 11 | baja | `CU-2`/`CU-3`: el mate dos veces; fogón de campamento | **Hecho en `CU-3`** (*la vereda de siempre* en lugar del termo). El mate queda en `CU-2`. Tarjetas por regenerar |
| 12 | baja | La zapatilla con barro sale cuatro veces | **Hecho en `CU-4`** (*las botamangas*). Quedan `EJ-032`, `EJ-045` (con ficha, `RES-185`) y la que canta de la vuelta |
| 13 | baja | `EJ-046`: *la misa* hace que *Lo tenía previsto* suene a veterano | **No lo toqué, y lo dejo anotado.** Con *la misa* tapada la escena se entiende (la prueba de la palabra del código), y cambiar la A reabre *actividad contra paciencia*, el defecto que la vuelta 4 sacó. Va a `REV-20` (§10, punto 5) |
| 14 | baja | Cinco cruces y pulidos | **Hechos cuatro.** `054`+`058` (el parlante pasa a la mochila), `035`+`039` (ya sin disco), `044` (campera y buzo), `032` (la bolsa pasa a mochila). **No toqué `EJ-050`** (*Mañana te preguntan cómo estuvo* en *Cuando suena*): mira hacia adelante a propósito y el salto de tiempo es de la hoja entera, no de ese ítem |

**Y lo que cambió de lugar en `notaInterna`:** cada ítem tocado dice qué vuelta lo tocó y por qué; los de luz con teléfono dicen "una de tres" (`031`, `036`, `055`).
