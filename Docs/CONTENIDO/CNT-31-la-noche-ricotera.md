# CNT-31 — La noche ricotera: el banco de "¿Qué tipo de ricotero sos?" con el barro, el chori, la birra, el porro y la familia

- **Rol dueño:** `contenido`
- **Fecha:** 2026-10-04, ciclo 18. **Vuelta 6 (arreglos del verificador adversarial): 2026-10-05**, §11. **Vuelta 7 (segunda lectura adversarial y el pedido del hilo principal de que quien camina la noche sea ricotero): 2026-10-05**, §12. **`T-352` (el texto del lector en el plano de dos ejes): 2026-10-05**, §13. **`REV-20` (las decisiones de `contenido` sobre la revisión del ciclo 19): 2026-10-06**, §14.
- **Estado:** entrega completa, con las vueltas 6 y 7 aplicadas. **Desde el 2026-10-06 (§14) cambian las dos opciones de `EJ-049`**; las tablas de abajo ya traen las nuevas y el texto viejo queda dicho donde corresponde. Ninguna bajada cambia: las tarjetas no se regeneran. Reescribe `src/data/dos-ejes.json` (los 30 enunciados, las cinco líneas que cantan y las cuatro bajadas) sobre el banco de `CNT-30` vuelta 4. **Las tablas de `CNT-30` §3, §4 y §5 pasan a ser historia**: este documento describe el banco como queda. De `CNT-30` siguen vigentes las reglas de §2 que `D-62` no toca (el cuerpo capaz, la seguridad, los dos ejes, la sintaxis que no delata el polo) y el §6 (cadenas de pantalla), salvo lo que dice el §10 de acá.
- **Consume:** `D-62` (entera, con su síntesis), `D-57` y sus siete enmiendas (sobre todo la 7: la luz), `BR-17`, `BR-36`, `BR-37` y `BR-38`, `CNT-30` (el banco y por qué cada escena es como es), `INV-172` (`RES-172`..`RES-194`), `INV-150` (`RES-154`, `RES-156`, `RES-158`, `RES-160`, `RES-161`), `D-14`, `D-17`, `.claude/rules/voz-ricotera.md`, `.claude/rules/contenido-json.md`, `src/lib/dos-ejes/banco.test.ts` (las 24 pruebas, línea por línea; **[2026-10-06] hoy son 27; los dos textos nuevos de `EJ-049` se midieron a mano contra las que los tocan, §14**) y `src/lib/voz.test.ts`.
- **Produce:** `src/data/dos-ejes.json` (schema v2 de `CTR-08`, sin claves nuevas): `EJ-029`..`EJ-058` reescritos con el mismo id (sin huecos, tres por celda, todos `listo` con `momento`), las cinco líneas que cantan, las cuatro bajadas, y `EJ-001`..`EJ-028` intactos y `retirado`. **IDs nuevos de este documento: ninguno** (los ítems se reescriben con su id, como permite `Docs/IDS.md` mientras no cambie lo que miden: cada uno sigue midiendo lo mismo en el mismo eje y el mismo momento).
- **No hago acá:** el schema, el motor, la isla, el taller de tarjetas ni las guardas (`BR-38` es de `producto`; las guardas de `banco.test.ts`, del hilo principal). Si algo de eso dice otra cosa que este documento, manda el de ellos y se vuelve acá.
- **Ficha `RES-XX` pendiente:** ninguna. Una escena del test no afirma nada de ningún recital real, así que no lleva ficha (`CTR-08.5` regla 5). Lo que sí hago es **decir de dónde salió cada textura**: casi todo es *leyenda* de `INV-172` (ninguna página se abrió) y la usé como escenario, nunca como dato.
- **No lo corrí** (`D-12`). Medí a mano cada texto contra las 24 pruebas de `banco.test.ts` (§8), contra las siete de `voz.test.ts` y contra el schema, y sobre el JSON ya escrito corrí con `Grep` los vetos por expresión regular (nada cae fuera de los 28 retirados). El comando que lo corre de verdad está en el §10.

## 1. Qué pidió `D-62`, y cómo lo leí

El usuario pidió que la noche sea la ricotera de verdad: *"barro, sucio, drogas, reviente, y también familia, amigos, amor. Un choripán, un pancho, una birra, un porro, hasta cocaína debe ser parte del recital. La previa, ir un rato antes a escabiar o no."* Lo leí en cuatro frases:

1. **Lo sucio no es un adorno: "lo primero no puede faltar".** Cada uno de los cinco momentos lleva una parte sucia (el aire, la comida, el barro, lo que se toma o se fuma) y una parte tierna (los tuyos, un padre, una pareja, un amigo), en el mismo momento. **Desde la vuelta 6 eso se mide por celda** (`BR-38`: una de las tres escenas de cada momento × eje trae, en el enunciado, barro, mugre, humo, lo que se toma o se fuma o el reviente): diez de diez (§3, "El piso de lo sucio").
2. **Quien juega elige cómo se mueve, no si consume.** Lo sucio va en el **enunciado**, como la escena que ya está puesta. Las opciones son lo que hacés vos adentro de esa escena, y **ninguna de las 60 nombra lo que se toma o se fuma**. En dos ítems (`EJ-029` y `EJ-048`) las opciones contestan a la ronda que pasa —pasarla sin tomar ni fumar, o quedarse con lo propio—, que es el modelo que `D-62` describe para la previa. Es la solución más simple a "lo que se toma o se fuma nunca de un solo lado" (la guarda de `banco.test.ts` da trivialmente) y es la que mejor le sirve al quinto lugar. **Desde la vuelta 7, lo sucio también entra a las opciones por el lado que no es consumir**: el barro (`EJ-038`, `EJ-045`), la mugre y el sudor (`EJ-055`, `EJ-058`), el humo en la ropa (`EJ-053`), la ronda (`EJ-029`, `EJ-048`).
3. **La merca es paisaje.** Una mención, en un enunciado, en una oración propia (§5).
4. **La banda y sus rituales entran a la escena, sus personas no.** Aparecen "los Redondos", "la misa", "el pogo", "los trapos" y "el pasacalle"; no aparece nadie por su nombre ni el escenario con alguien arriba (el Indio murió el 5 de junio de 2026).

Y lo que **no** cambia, aunque la escena sea otra: la noche en cinco momentos, los dos ejes, tres por celda, los cuatro nombres, que ninguna pregunta pida saber de la banda, que ninguna respuesta sea mejor que otra, y las tragedias, el cuerpo capaz y la seguridad afuera.

## 2. Qué cambia respecto de `CNT-30` y qué no

| | `CNT-30` (vuelta 4) | `CNT-31` |
|---|---|---|
| El recital | "un recital", sin dueño, sin banda, sin misa, sin pogo | el recital ricotero: Redondos, misa, pogo, trapos, pasacalle, caravana (solo en enunciados, líneas que cantan y bajadas) |
| Lo que se come y se toma | vetado de todo el banco (el test leía *vino*, *birra*…) | en el **enunciado**: fernet, birra, vino, chori, pancho, porro. Nunca nombrado en una opción |
| La plata | ni puesto ni micro ni pancho en ninguna parte | el puesto, el micro y la combi **están en la escena**; ninguna opción compra, paga ni tiene entrada (`D-62` punto 4) |
| Los que no entraron | no existían (la noche era "la normal") | `EJ-043` (la reja y los trapos) y `EJ-045`/`EJ-046` (el charco y la fila) (`RES-154`, `RES-176`) |
| La merca | vetada | una mención de paisaje en `EJ-049` |
| La familia y el amor | sin parentesco en ningún texto | **en el enunciado y de terceros** (un padre y su hija grande, una pareja bajo una campera). En una opción, ninguno (enmienda 7, y la guarda) |
| Los cinco lugares | cuatro | **cinco**: suma *el que no toma ni fuma* (§4) |
| Las opciones | 60, afinadas en cuatro vueltas | **42 de 60 iguales** (no tiré lo que costó cuatro vueltas); cambian `EJ-029` (las dos), `EJ-030` (la A), `EJ-031` (la B), `EJ-038` (la A), `EJ-042` (la A), `EJ-045` (las dos), `EJ-048` (las dos), `EJ-049` (la B), `EJ-051` (la A), `EJ-052` (las dos), `EJ-053` (la B), `EJ-054` (la B), `EJ-055` (la B) y `EJ-058` (la A). Las de la vuelta 7 son once (nueve nuevas y dos que ya habían cambiado en la 6, `029` B y `051` A) y sacan de las opciones el mundo de una excursión (té, dibujo, mazo de cartas, barquito de papel, cargador) |
| La luz con teléfono | cinco de quince | **cuatro firmes de quince** (`031`, `036`, `054`, `055`) y `053`, que puede ser en voz alta: tope de la enmienda 7, cinco |

**Por qué casi no toqué las opciones en la primera pasada, y por qué las toqué en la séptima.** `CNT-30` §2 y §4 explican, ítem por ítem, qué sacó cada vuelta (el parentesco, el «mío» del lado de luz, los auriculares, la distracción del que no mira, la excusa del caos, la firma por raíz). `D-62` dijo dónde va lo sucio —en el enunciado— y eso permitía que el banco cambiara de textura sin reabrir nada de lo que ya estaba cerrado. El riesgo de tocar una opción es el de siempre: **cada palabra nueva entra a una guarda por raíz que nadie corre a mano sin errar**. Pero el hilo principal dejó claro (vuelta 7) que el pedido central del usuario es *"las preguntas más ricoteras"*, y un banco donde la escena es de barro y la opción es de campamento no lo cumple: cambió el criterio de "tocar lo mínimo" a "que quien camina la noche sea de la noche". Las raíces de las 60 se recontaron entera (§8, fila 19).

## 3. La noche, momento por momento

Cada fila dice qué entró de `INV-172`, con su ficha. **Todo es *leyenda* de prensa sin abrir** (la previa, el puesto, el barro): sirve de escena, no de dato, y ninguna escena lo afirma como cosa que pasó. **[Corrección 2026-10-06, `REV-20` papeles: eso vale para las fichas de `INV-172` (`RES-172`..`RES-194`). Las de `INV-150` que también se citan acá tienen su propio rótulo: `RES-154` hecho (Paladium, Tandil) y testimonio (River, Córdoba); `RES-156`, `RES-157`, `RES-158` y `RES-161` hecho; `RES-160` testimonio (el viaje de Mauro, que no se usa) y hecho (las caravanas). Ninguna escena afirma nada de ninguna, así que ningún rótulo le llega al jugador; lo que se corrige es el papel.]**

### La previa — *Botella cortada, guitarra afinando, olor a yerba.*

- **Parte sucia:** el fernet que pasa en la botella cortada (`EJ-029`; `RES-173`, `RES-178`), la birra tibia en la plaza (`EJ-031`), la ropa que va a terminar con barro (`EJ-034`; `RES-177`, `RES-185`), las zapatillas viejas (`EJ-032`).
- **Parte tierna:** uno de los tuyos afinando una guitarra junto al fogón (`EJ-030`; `RES-172`), los que llegan tarde (`EJ-031`), el vecino que te grita desde la ventana de al lado (`EJ-033`).
- **El ítem de "ir a escabiar o no":** `EJ-029`. La esquina, los tuyos y el fernet son la escena; las dos opciones son de la ronda (pasarlo y seguir charlando, o quedarse en la mía) y ninguna dice qué se toma. Es lo que `D-62` punto 2 describe como "sumarse a la ronda, que no obliga a tomar, o quedarse con lo propio".
- **La que canta cambió:** era *Campera puesta, llaves en el bolsillo.* Ahora son tres objetos de la previa: la botella cortada, la guitarra, la yerba. La botella cortada es lo primero que se lee en la primera hoja: es a propósito ("lo primero no puede faltar"), y es un objeto, no una escena de alguien tomando.
- **Dónde pasa (vuelta 7).** Las tres luces pasan afuera (la esquina, el fogón, la plaza). Las tres de orden-caos **no dicen dónde estás**: la ropa de esa noche se elige y las cosas se juntan en algún momento (`EJ-032`, `EJ-034`), y quien grita pregunta cuándo salís desde una ventana (`EJ-033`). Con el sorteo del eje primero, la previa ya no va para atrás la mitad de las noches.

### La ida — *Ventanilla empañada, latas rodando, ruta que se estira.*

- **Parte sucia (vuelta 6):** el olor a chori y a vino en la combi (`EJ-035`; `RES-173`, `RES-178`, `RES-172`), la olla de panchos de la parada de ruta (`EJ-037`; vocabulario del puesto, sin ficha, `RES-173`), la birra que va de mano en mano en el fondo (`EJ-039`; `RES-173`, `RES-178`). **La vuelta 5 había contado «la caravana» y «los micros en fila» como parte sucia y no lo son**: son paisaje de la ida, y con ellos la ida entera no traía nada de la lista de `BR-38`. **Vuelta 7:** la A de `EJ-038` pasa a *Llevo bolsas para los pies*: el barro entra a una opción.
- **Parte tierna:** los míos en la combi (`EJ-035`; `RES-174`, `RES-160`), el pasacalle sobre la ruta y la foto para quien querés (`EJ-036`; `RES-172`), el parlante que pasa de mano en mano (`EJ-039`), los Redondos a todo lo que da en la caravana (`EJ-040`; la banda como paisaje, `D-62` punto 5).
- **Qué no entró:** el dedo (`RES-174`, `RES-189` lo dicen: es el veto de seguridad), las cifras de micros y los nombres de las agencias (los verificadores mandaron sacarlos), el viaje de 43 horas de Mauro (`RES-160`: testimonio, y una persona real).
- **La que canta cambió dos veces.** Era *Ruido de fondo, el camino que se estira.*; la vuelta 5 la dejó en *Ventanilla empañada y la ruta que se estira.* (el vidrio con el aliento de todos) y la vuelta 6 le suma lo que le faltaba: *latas rodando*, el piso de una combi de verdad. Es un objeto, no una escena de alguien tomando, y no nombra la birra. Es la más ancha de las cinco (55 caracteres).

### La vereda — *Pies en el barro y un parlante lejano.*

- **Parte sucia:** el humo del puesto de chori (`EJ-041`; `RES-173`, `RES-178`), el charco de barro frente a la reja (`EJ-045`; `RES-185`: el charco antes de la entrada, leyenda), el frío que pela (`EJ-044`; `RES-184`, `RES-177`), la fila (`EJ-046`; `RES-176`).
- **Parte tierna y de los que no entraron:** los trapos atados a la reja, uno por barrio (`EJ-043`; `RES-154`, `RES-156`, `RES-193`: *sin nombres reales*), la pareja que se tapa con una sola campera bajo la llovizna y el amigo con quien te tapás (`EJ-042`; `RES-191`, solo la forma).
- **Dos precauciones.** *El barro no es de Olavarría:* el enunciado de `EJ-045` dice un charco frente a una reja, sin lugar ni fecha, y **desde la vuelta 7 ya no trae la zapatilla perdida** (la imagen de las crónicas de Olavarría: *cementerio de zapatillas*, `RES-188`). Tampoco usé "cementerio", ni terminal, ni lluvia de crónica. Y *"siempre llueve"* no se dice nunca: `RES-187` es la ficha que protege de eso (el cielo gris de la ida no dice qué cae después).
- **La que canta cambió:** era *Baldosa fría y un parlante lejano.* La baldosa pasa a barro (la vereda de la noche ricotera ya no es baldosa) y el parlante lejano se queda: es lo que llega de adentro para el que no entró.

### Cuando suena — *Golpe en el pecho y todos cantan.*

- **Parte sucia:** el porro que se pasan los tuyos entre tema y tema (`EJ-048`; `RES-179`: lo único del consumo que nombra la crónica de color, según el buscador), el humo y la merca (`EJ-049`; §5), el pogo y el reviente que llegan hasta la calle (`EJ-052`; `RES-158`), el sudor (`EJ-050`; `RES-187`).
- **Parte tierna:** alguien tuyo cantando con los ojos cerrados (`EJ-047`), un padre y su hija grande que cantan a dúo (`EJ-051`; `RES-190`), los abrazos que se cuentan al otro día (`EJ-050`).
- **La que canta cambió:** era *Golpe en el pecho, primer acorde.* El golpe se queda y "primer acorde" se va (era técnico y apuntaba a un tema). Entra "todos cantan": el canto de todos, que `D-62` pide en la escena.

### La vuelta — *Zapatillas embarradas, llave en la puerta.*

- **Parte sucia:** la campera que huele a humo (`EJ-053`; `RES-176`), la mugre en las uñas y la boca seca (`EJ-056`; `RES-176`, `RES-187`), los pies helados de madrugada (`EJ-054`; `RES-184`), el cuerpo hecho pelota (`EJ-055`).
- **Parte tierna:** avisar que llegaste (`EJ-054`), el grupo que sigue despierto (`EJ-055`), la guitarra en la plaza otra vez (`EJ-057`; `RES-172`), la casa en silencio.
- **"Pegar la vuelta":** entra solo en `EJ-058`, en pasado y ya en casa (*Pegaste la vuelta: el parlante sigue prendido en la mochila*). La vuelta sigue sin trayecto: sus seis escenas pasan adentro de la casa (`CNT-30` §2, seguridad).
- **La que canta cambió:** era *Frío en las manos, llave en la puerta.* La llave se queda (cierra el círculo con la casa de la previa) y entran las zapatillas embarradas, el objeto que `D-62` pidió.

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

Diez celdas, diez con al menos una (la vuelta 7 volvió a contarlas sobre el JSON: nada cambió de lugar). **Ninguna guarda lo cuenta todavía** (hueco 1 de `BR-38`): propongo una al hilo principal en `Docs/SUGERENCIAS/CNT-para-hilo-principal-noche-ricotera.md`, con la lista de palabras. **[2026-10-06: ya la cuenta.]** Desde `4dbc8b3`, `banco.test.ts` trae «cada celda momento × eje trae lo sucio en algún enunciado» y «lo sucio no se cumple con la merca», con la lista de la sugerencia (`CONSUMO` sin *seca*, más barro, embarrad\*, mugre, humo y reviente). `REV-20` (`FIND-125`) lo marcó; no hay que escribir ninguna guarda más para el piso.

## 4. El quinto lugar: *el que no toma ni fuma*

`D-62` suma un quinto lugar a la prueba de `BR-36` (nunca fui · sin plata · silla de ruedas · volviendo de noche sin compañía): **¿puede elegir cualquiera de las dos opciones, de verdad y sin sentirse el que no pertenece, alguien que no toma ni fuma —por salud, por los hijos, porque dejó—?** Lo vigila `banco.test.ts` (que lo que se toma o se fuma no separe los polos) y lo lee `REV-20`.

**Cómo lo resolví.**

1. **Lo que se toma o se fuma vive en el enunciado y ninguna opción lo nombra.** Aparece en seis enunciados —`EJ-029` (el fernet), `EJ-031` (la birra tibia y la yerba), `EJ-035` (el vino en el aire de la combi), `EJ-039` (la birra del fondo), `EJ-048` (el porro) y `EJ-049` (la merca, aparte)— y en ninguna de las 60 opciones. Lo comprobé con `Grep` sobre el JSON con la lista de `CONSUMO` del test: ninguna opción cae (vuelta 7, de nuevo).
2. **Lo sucio de un enunciado es paisaje de al lado, o la ronda de los tuyos; nunca la mano de quien juega.** En `EJ-031`, `EJ-035` y `EJ-039` el aire huele a birra o a vino, o la birra va por el fondo, y las opciones son de otra cosa: el que toma y el que no eligen igual. En `EJ-029` y `EJ-048` la ronda pasa entre los tuyos y **las dos opciones son de esa ronda y no del consumo**: pasarla (que no obliga a tomar ni a fumar) y seguir charlando o aplaudiendo, o quedarse con lo suyo (*Me quedo en la mía*, *Miro subir el humo*). Una opción que contestara a la botella con otra bebida (*Se la paso al de al lado*, *Me sirvo*) deja a la otra como "la del que no".
3. **Lo que no se toma entra al banco como cosa de la escena, no como la manera de no tomar.** La yerba (en un enunciado y en la que canta de la previa) y el agua (en una opción de la vuelta, `EJ-056`) están, pero **ninguno es la alternativa a la birra**: no puse una opción "me cebo un mate" frente a otra que bebe, porque eso nombra al que no toma como una manera de ser (y lo marca). El agua, en la vuelta, es lo que le pide la boca seca a quien tomó y a quien no.
4. **Cada ítem, en su `notaInterna`, lleva el veredicto del quinto lugar** con la razón, igual que los otros cuatro.

**Lo que no resolví con reglas y le dejo a `REV-20`:** `EJ-029` A (*Lo paso y sigo charlando*) y `EJ-048` A (*Lo paso y aplaudo*) se refieren con un pronombre a lo que pasa por la ronda (el fernet, el porro). **La guarda `CONSUMO` no ve pronombres** (da 0 de 60), así que ese caso lo mira el ojo. Para quien no toma ni fuma se puede pasar una botella o un porro sin consumirlo, que es lo que `D-62` dice; alguien puede leer la A como "la del que sí". **Y desde la vuelta 7, `EJ-029` B (*Me quedo en la mía*)**: no debe leerse como «mi trago» (la B de quien toma, la A de quien pasa sin tomar). Si `REV-20` la lee así, la salida es sacar el consumo del enunciado y dejar la ronda con la música (la guitarra de `EJ-030`), a costa de que `EJ-029` y `EJ-048` pierdan lo suyo. Sería el cambio de una línea cada una.

## 5. La merca

**Una sola mención, en `EJ-049`:** *Hay humo y merca dando vueltas. Entran los instrumentos.*

- **Por qué ahí y no en otro lado.** `D-62` punto 3 dice "paisaje, nunca elección", y el lugar donde el reviente pesa más es cuando entra el volumen. Las dos opciones (*Grito con el resto* / *Canto para adentro*) son de la voz y de la sala; ninguna toca ni se acerca a la merca, **y desde la vuelta 7 ninguna es una sensación del cuerpo** (la B era *Me retumba en la panza*). **[2026-10-06, `REV-20`, §14: las dos cambiaron. Ahora son *Canto con el resto* / *Sigo la batería*. La A era la entrega total de `BR-36` («a los gritos, con el resto») y la B quedaba como la contención del que no entra al reviente. El enunciado y la merca no se mueven.]**
- **Cómo está dicha (vuelta 7).** En una oración propia, como cosa de alrededor (*Hay humo y merca dando vueltas.*), **seguida solo de la entrada de los instrumentos**: sin «de golpe» (la palabra ya está en la que canta del momento, *Golpe en el pecho*) y sin la pregunta *¿Qué te sale?*. La vuelta 6 la había separado de la reacción del cuerpo, pero la hoja entera seguía armando la lectura de efecto: merca, golpe en el pecho, qué te sale y *me retumba en la panza*, leídos juntos, son lo que la merca le hace al cuerpo de quien juega (`BR-38`, quinto lugar, forma 5), aunque ninguna opción la nombre. Sin adjetivo, sin glamour y sin sermón: no dice quién la usa, ni qué pasa después, ni que sea buena o mala. Se sacó el barro de la oración desde la vuelta 6: *droga + barro + campo + «de golpe»* es la fórmula de la crónica de Olavarría que `INV-172` dejó afuera (`RES-183`: *«los muertos habían consumido drogas y alcohol»*; `RES-188`), y `BR-38` pide que no haya barro puesto al lado de lo que lo evoca.
- **Qué respaldo tiene.** `INV-172` lo dijo claro: *la cocaína no aparece en ninguna crónica de color como escena; está en la policial y en lecturas de fans* (`RES-179`, `RES-181`). **Rótulo: leyenda.** Se usa igual (`D-14`), como el aire de la escena del test y no como un hecho sobre ningún recital real. No lleva ficha porque no afirma nada.
- **No cuenta para lo sucio de `BR-38`**: el piso de la celda adentro × luz lo cumplen el porro y el humo de `EJ-048` y de `EJ-049`, no la merca.
- **Qué descarté.** *Una raya en el baño*, *alguien se manda una*, *el que vende en la puerta* (cada una pone una persona haciendo algo: una escena que las opciones esquivan o contestan, y de las dos sale la merca como elección); *un papel de merca* (glamour de la cosa); y la mención en cualquier opción (`VETOS_DE_LAS_OPCIONES` ya la veta). **Vuelta 7:** llevarla a `EJ-050` (*Mañana te preguntan cómo estuvo: …*) —sus opciones no son del cuerpo—, porque en una lista de lo que vas a contar *Elijo qué voy a contar* se lee como elegir si contás la merca; y a `EJ-048`, donde ya está el porro y *Lo paso* podría leerse como pasar la merca. La palabra elegida es *merca* y no *cocaína* ni *falopa*: es la que usa la gente en la previa; *cocaína* suena a parte policial y *falopa* es la palabra que `RES-180` pone en boca del Indio (y una palabra suya no se usa sin ficha). Ojo con un parecido: *Monona blues (Merca para vender)* está en cuarentena (`RES-181`, `D-13`) y no es evidencia de nada; el enunciado no lo cita ni lo evoca (ninguna canción se nombra).
- **La pregunta que le queda a `REV-20`:** ¿*humo y merca* en una oración propia se lee como paisaje o como guiño? Si se lee como guiño, la salida es sacar el *humo* de esa oración (*Hay merca dando vueltas.*) o cambiar de cosa de alrededor, no sacarla.

## 6. Los treinta ítems

`L` = `luz-oscuridad` (A = `luz`, B = `oscuridad`). `O` = `orden-caos` (A = `orden`, B = `caos`). En el archivo las opciones van siempre en ese orden; el motor las baraja. **Todos dan ✓ en los cinco lugares**, con la razón en su `notaInterna`. "Igual" = la opción es la de `CNT-30` vuelta 4, sin tocar. "V6" y "V7" = lo cambiaron la vuelta 6 (§11) y la vuelta 7 (§12). Las fichas son todas leyenda (§3). **[Corrección 2026-10-06: las de `INV-172` sí; las de `INV-150` son hecho o testimonio, y están rotuladas en §3. ]**

### La previa

| Id | Eje | Enunciado | A | B | Qué cambió | Lo sucio / lo tierno (ficha) |
|---|---|---|---|---|---|---|
| `EJ-029` | L | En la esquina, los tuyos pasan el fernet en una botella cortada. | Lo paso y sigo charlando | Me quedo en la mía | Enunciado y las dos opciones. Era *Alguien tuyo te manda un tema.* / *Le contesto con otro* / *Lo escucho bien fuerte*. **V6: la B era *Subo mi música*** (el parlante cruzaba a luz; con auriculares, aislarse en medio de los tuyos); pasó a *Me quedo en el cordón*. **V7: la B se quedaba con el «quedarse» y perdía el «lo propio» de `D-62`** (sonaba a la que quedó afuera de la ronda, se leía como «el que no toma», y el cordón no es un lugar para quien va en silla de ruedas); ahora *Me quedo en la mía* | fernet y botella cortada · los tuyos (`RES-173`, `RES-178`, `RES-172`) |
| `EJ-030` | L | Uno de los tuyos afina una guitarra junto al fogón. | Me arrimo y canto | Tamborileo en la rodilla | Enunciado y la A. Era *Suena música mientras te preparás.* / *La subo para compartirla* | guitarra y fogón · uno de los tuyos (`RES-172`, `RES-161`) |
| `EJ-031` | L | La plaza huele a birra tibia y a yerba. Faltan los que llegan tarde. | Le escribo a una amiga | Leo los calcos del poste | Enunciado y **V7: la B** (era *Tarareo un tema*: el tarareo estaba en tres opciones y dos salían juntas 1 noche de cada 9). Era *Falta un rato para salir.* | birra tibia y yerba · los que llegan tarde (`RES-173`, `RES-178`, `RES-172`) |
| `EJ-032` | O | Zapatillas viejas, campera y mochila. ¿Cuándo las juntás? | Las dejo juntas desde antes | Las agarro al vuelo | Enunciado. Opciones iguales. Era *Hay cosas para llevar al recital.* **V6: *«una bolsa para el recital»* no se entendía para qué era; queda *mochila*** | zapatillas viejas (el barro sin nombrarlo) (`RES-177`, `RES-185`) |
| `EJ-033` | O | Desde la ventana de al lado, un vecino te grita: ¿cuándo salís? | Le doy el dato justo | Le digo: en un rato | **V7: enunciado.** Era *Alguien te pregunta cuándo salís.*; la V5 lo puso *Desde la carpa de al lado te gritan* (plural contra opciones en singular, y la carpa ponía el acampe en una previa que sigue con ruta larga). Opciones iguales | el vecino que grita (la carpa se fue) (`RES-172`) |
| `EJ-034` | O | La ropa del recital va a terminar con barro. ¿Cómo la elegís? | Sé qué me pongo | Me visto según el humor | **V7: enunciado.** Era *Te vestís para el recital. La ropa va a terminar con barro.* (ponía a quien juega en casa mientras las luces pasan afuera). Opciones iguales | el barro como certeza de la noche (`RES-177`, `RES-185`) |

### La ida

| Id | Eje | Enunciado | A | B | Qué cambió | Lo sucio / lo tierno (ficha) |
|---|---|---|---|---|---|---|
| `EJ-035` | L | Olor a chori y a vino en la combi. El camino es largo. | Hablo con los míos | Tarareo una que me gusta | Enunciado. Opciones iguales. Era *El camino se hace largo. ¿Cómo lo llevás?* **V6: la vuelta 5 decía *En la combi suena un disco de los Redondos*, y con la banda sonando *Tarareo una que me gusta* se leía como una de ese disco** (la banda se muda a `EJ-040`) | combi del barrio · olor a chori y a vino (`RES-174`, `RES-160`, `RES-173`, `RES-178`) |
| `EJ-036` | L | Un pasacalle gigante cuelga sobre la ruta. Sacás una foto. | La mando a quien quiero | Le encuentro un detalle | Enunciado. Opciones iguales. Era *Sacás una foto camino al recital.* | pasacalle sobre la ruta · la foto a quien querés (`RES-172`) |
| `EJ-037` | L | En la parada de ruta, hierven los panchos. Se te viene un tema. | Se lo tarareo a alguien | Lo busco y lo escucho | Enunciado. Opciones iguales. Era *Te acordás de un tema.* **V6: el *pancho frío* en la mano de quien juega daba la plata por hecha; ahora es la olla del puesto** | la olla de panchos de la parada (`RES-174`, `RES-173`) |
| `EJ-038` | O | Los micros hacen fila y el cielo se pone gris. | Llevo bolsas para los pies | Si llueve, llueve | Enunciado. **V7: la A** (era *Llevo algo por si llueve*: con el barro de la noche, la A se leía como la del piloto y la B como la del aguante). Era *Hay nubes en el cielo.* | micros en fila (`RES-160`, `RES-174`, `RES-187`): paisaje, no cuenta como sucio; las bolsas para los pies sí tocan el barro |
| `EJ-039` | O | Te pasan el parlante. En el fondo, una birra va de mano en mano. | Elijo la música con calma | Pongo una sin mirar | Enunciado. Opciones iguales. Era *Vas a escuchar música en el camino.* **V6: la ida de orden-caos no tenía nada sucio; la birra va por el fondo, lejos de la mano de quien juega** | el parlante que pasa · la birra del fondo (`RES-174`, `RES-160`, `RES-173`, `RES-178`) |
| `EJ-040` | O | En la caravana, los Redondos a todo lo que da. Falta un buen tramo. | Lo parto en tramos | Me dejo llevar | Enunciado. Opciones iguales. Era *Falta para llegar al recital.* **V6: acá se mudan los Redondos desde `EJ-035`; ninguna opción toca la música. V7: sale la palabra *volumen* (regla del usuario: nunca cansa el volumen) y el *lo* de *Lo parto en tramos* gana antecedente (§12)** | la caravana · la banda como paisaje (`RES-174`, `RES-189`) |

### La vereda

| Id | Eje | Enunciado | A | B | Qué cambió | Lo sucio / lo tierno (ficha) |
|---|---|---|---|---|---|---|
| `EJ-041` | L | Del puesto de chori sube humo y se oye la prueba de sonido. | Comento cómo me suena | Le busco el ritmo | Enunciado. Opciones iguales. Era *Se oye la prueba de sonido.* | el puesto y el humo del chori (`RES-173`, `RES-178`, `RES-161`) |
| `EJ-042` | L | Cae una llovizna fina y una pareja se tapa con una campera. | Me tapo con un amigo | Miro llover contra el farol | Enunciado. Era *Cae una llovizna fina.* / *Aviso a un amigo: llueve*. **V6: la A era una acción chata y la pareja quedaba de decorado; ahora contesta a la escena** | la pareja de terceros y el amigo (`RES-191`, solo la forma) |
| `EJ-043` | L | En la reja, cada barrio ata su trapo. | Los comento con los míos | Elijo mi favorito | Enunciado (de afiches a trapos). Opciones iguales. **V6: la vuelta 5 decía *Los que no entraron atan trapos en la reja*: dejaba a quien juega del lado de los que entraron y chocaba con `EJ-045` y `EJ-046`**. V7: solo se corrige la nota (decía que el enunciado explicaba el trapo con *bandera* y ya no lo hace) | la reja y los trapos (`RES-154`, `RES-156`, `RES-193`) |
| `EJ-044` | O | Frío que pela en la vereda. Tenés campera y buzo. Después puede dar calor. | Me abrigo en capas | Me la saco al rato | Enunciado. Opciones iguales. **V6: *Tenés la campera* (una sola capa) contra *Me abrigo en capas*** | frío de vereda (`RES-184`, `RES-177`) |
| `EJ-045` | O | Frente a la reja hay un charco de barro y las puertas siguen cerradas. | Traje un cartón | Busco un cartón por ahí | **V7: enunciado y las dos opciones.** Era *Todavía no empieza el recital.* / *Saco el mazo de cartas* / *Armo un barquito de papel*; la V5 lo puso *El barro ya se tragó una zapatilla* (la zapatilla perdida es la imagen de Olavarría, `RES-188`). Ahora las dos opciones son del barro: un cartón sobre el charco, previsto o conseguido | el charco frente a la reja (`RES-185`) |
| `EJ-046` | O | Corre la voz en la fila: el recital empieza más tarde. | Lo tenía previsto | Lo tomo como viene | **V7: enunciado.** Era *Dicen que el recital empieza más tarde.*; la V5 puso *la misa* y con la palabra *Lo tenía previsto* se leía como «ya sé cómo son las misas». La misa se muda a `EJ-052`. Opciones iguales | la fila (`RES-176`) |

### Cuando suena (`adentro`)

| Id | Eje | Enunciado | A | B | Qué cambió | Lo sucio / lo tierno (ficha) |
|---|---|---|---|---|---|---|
| `EJ-047` | L | Empieza una canción lenta. Alguien tuyo la canta con los ojos cerrados. | Escucho cómo la canta | Muevo la cabeza despacio | Enunciado. Opciones iguales. Era *…Alguien tuyo la sabe.* **V7: *Suena* pasa a *Empieza*** (*suena* y *canta* salían dos veces en la hoja) | alguien tuyo con los ojos cerrados (`RES-190`, `RES-191`, solo la forma) |
| `EJ-048` | L | Entre tema y tema, los tuyos se pasan un porro. | Lo paso y aplaudo | Miro subir el humo | Enunciado y las dos opciones. Era *Cambian un instrumento entre tema y tema.* / *Aplaudo con el resto* / *Marco el compás*. **V6: el porro llegaba a la mano de quien juega y las opciones miraban a otro lado; ahora es el modelo de `EJ-029`** | el porro entre los tuyos (`RES-179`) |
| `EJ-049` | L | Hay humo y merca dando vueltas. Entran los instrumentos. | Canto con el resto | Sigo la batería | **REV-20 (2026-10-06): las dos opciones.** Eran *Grito con el resto* / *Canto para adentro*: la A era la entrega total (§14). Enunciado y **V7: la B** (era *Me retumba en la panza*). Era *Entran todos los instrumentos de golpe. ¿Qué te sale?* **V6: la merca en su oración, sin barro y aparte de la pregunta. V7: sin «de golpe» y sin la pregunta, y la B ya no es una sensación del cuerpo** | humo y merca: el reviente (`RES-179`, `RES-181`, §5) |
| `EJ-050` | O | Mañana te preguntan cómo estuvo: el coro, el sudor, los abrazos. | Elijo qué voy a contar | Lo cuento de una | Enunciado. Opciones iguales. Era *Te van a preguntar cómo estuvo el recital.* | el sudor y los abrazos (`RES-187`) |
| `EJ-051` | O | Un padre y su hija grande cantan a dúo. La canción se te pega. | La repito hasta aprenderla | La dejo dar vueltas | Enunciado y la A. Era *Una canción se te queda en la cabeza.* / *Me la grabo cantándola*. **V6: *me la grabo* se leía como grabar a la nena** (pasó a *La repito para no perderla*). **V7: sin chico en la escena** (la nena en los hombros de su viejo salía junto al porro o la merca 2 noches de cada 9) **y *hasta aprenderla*** (*para no perderla* se leía como no perder a la nena o al que se fue) | padre e hija, de terceros (`RES-190`) |
| `EJ-052` | O | La misa no para: el pogo sigue y el reviente llega hasta la calle. | Me ubico y me quedo | Voy cambiando de sitio | Enunciado y las dos opciones. Era *El volumen cansa los oídos.* / *Traje algodón por las dudas* / *Me tapo con los dedos*. **V6: *adelante* y los parlantes sobre el cuerpo de quien juega rompían la enmienda 6, y las dos opciones eran cuidarse el oído. V7: suma *La misa* (se muda desde `EJ-046`; ninguna opción anticipa nada)** | el pogo y el reviente hasta la calle (`RES-158`) |

### La vuelta

| Id | Eje | Enunciado | A | B | Qué cambió | Lo sucio / lo tierno (ficha) |
|---|---|---|---|---|---|---|
| `EJ-053` | L | La campera huele a humo y todavía te dura la noche. | Se lo cuento a alguien | Me dejo la campera puesta | Enunciado y **V7: la B** (era *Me quedo con la noche*: repetía la forma de `EJ-029` B y salían juntas 1 noche de cada 9). Era *Ya en casa, todavía te dura la noche.* | la campera con humo (`RES-176`) |
| `EJ-054` | L | Llegás de madrugada con los pies helados. La casa está en silencio. | Aviso que llegué | Me pongo medias gruesas | Enunciado y **V7: la B** (era *Preparo un té*, de excursión). Era *Llegás y la casa está en silencio.* | los pies helados, la madrugada (`RES-184`) |
| `EJ-055` | L | Tenés el cuerpo hecho pelota y no te da sueño. | Escribo en el grupo | Me doy una ducha | Enunciado y **V7: la B** (era *Dibujo en un papel*, de excursión). Era *Es tarde y no te da sueño.* | el cuerpo hecho pelota |
| `EJ-056` | O | Mugre en las uñas y la boca seca. Se acerca la hora de dormir. | Dejo un vaso de agua | Me levanto si hace falta | Enunciado. Opciones iguales. Era *Se acerca la hora de dormir.* **V6: la boca seca no está en la lista de lo sucio de `BR-38`; entra la mugre** | la mugre en las uñas (`RES-176`, `RES-187`) |
| `EJ-057` | O | Te proponen otra noche de guitarra en la plaza. | Propongo un día | Acepto, con el día abierto | Enunciado. Opciones iguales. Era *Te proponen juntarse a escuchar música otro día.* | la previa otra vez, gratis (`RES-172`) |
| `EJ-058` | O | Pegaste la vuelta: el parlante sigue prendido en la mochila. | Lo limpio y lo guardo | Lo apago nomás | Enunciado. Era *Quedó el parlante prendido en casa.* / *Lo conecto al cargador*. **V6: con `EJ-054` (la casa en silencio) salía la contradicción una noche de cada nueve. V7: la A ya no es el cargador** (de excursión): el parlante que vino con barro y humo se limpia y se guarda | "pegar la vuelta", ya en casa (`RES-174`) |

### Los cruces

Los nueve pares de cada momento, en los dos órdenes, los volví a leer en voz alta tras la vuelta 7 (el motor sortea un ítem de cada eje por momento y los dos órdenes salen). **La vuelta 6 decía haberlos leído en los dos órdenes y no anotaba dos cruces que el verificador de la vuelta 7 encontró** (la previa y *la nena junto al consumo*); acá van los dos y los demás:

- **La previa:** se cerró en la vuelta 7. Las tres luces pasan afuera y ninguna de las tres de orden-caos dice dónde estás (`EJ-033`: un vecino desde una ventana; `EJ-034`: cómo se elige la ropa; `EJ-032`: cuándo se juntan las cosas). Ya no se pasa la botella en la esquina y se viste la hoja siguiente. Queda que `EJ-029`/`EJ-031` (fernet, birra) salen con las tres de orden-caos, que no tienen consumo.
- **La vuelta:** la contradicción de *la casa en silencio* con *el parlante prendido* se cerró en la vuelta 6 (el parlante está en la mochila). Queda un roce chico: `EJ-055` dice *no te da sueño* y `EJ-056` *se acerca la hora de dormir*; no se pisan (la hora se acerca, el sueño no llega). `EJ-055` B (*Me doy una ducha*) con `EJ-058` A (*Lo limpio y lo guardo*) pueden salir juntas y son dos veces *limpiar*, una de cuerpo y una de cosa: es un estribillo de la vuelta, no una contradicción.
- **La ida:** se cerró el cruce de dos músicas (`EJ-035` ya no tiene disco). `EJ-040` (los Redondos a todo lo que da) y `EJ-039` (te pasan el parlante) son los dos de orden-caos y no salen juntos. `EJ-035` B y `EJ-037` A (los dos tarareos) son de la misma celda y tampoco.
- **Cuando suena:** `EJ-047` (una canción lenta) con `EJ-052` (la misa no para, el pogo sigue) es un roce de tono: la canción lenta sigue y el pogo es de otra parte de la sala; es de las que `REV-20` decide si sobran. **El cruce de la nena con el consumo se cerró en la vuelta 7**: `EJ-051` ya no tiene un chico (un padre y su hija grande) y `BR-38` pide que *un chico y lo que se toma o se fuma no compartan escena*. Sale igual con `EJ-048` o `EJ-049`: el padre y su hija cantan a dúo al lado del porro de los tuyos o del humo, y es una escena de adultos.

## 7. Las cuatro maneras

Los **nombres no se tocan** (`D-57` punto 5; `CNT-30` §5): *Mesa larga a las nueve*, *Ronda en cualquier esquina*, *Radio bajita, misma hora*, *Mochila liviana, sin mapa*. Cambian las bajadas, **con la misma forma** (un placer y un costo de `orden-caos` que paga quien juega: *Pero cuando alguien… a vos te toca…*). Cada una gana un objeto ricotero, y **ninguna nombra lo que se toma o se fuma**: la manera es lo que le queda a quien juega, y sería decirle que es "el de la birra" o "el que no".

| Id | Queda | Qué ganó |
|---|---|---|
| `CU-1` | *Hay una hora, un lugar, un chori en la parrilla y gente que te espera: la noche ya sabe adónde va. Pero cuando alguien cambia la hora, a vos te toca rearmar la mesa.* | el chori en la parrilla (la mesa larga con comida) |
| `CU-2` | *Te sumás a lo que aparece —una guitarra, un cantito, otra canción— y la noche toma forma. Pero cuando alguien pregunta adónde siguen, a vos te toca elegir ahí mismo.* | la guitarra y el cantito (de la tribuna, sin bandera) en lugar de la charla. **V7: el mate se fue** (el verificador lo leyó como campamento y ya estaba en la yerba de `EJ-031` y de la que canta de la previa) |
| `CU-3` | *Te cosés la noche a medida, puntada por puntada, con un disco y el puesto de siempre. Pero cuando alguien adelanta la salida, a vos te toca mover lo que venía después.* | el disco y el puesto de siempre. **V6: la vuelta 5 decía *el termo de siempre* y con `CU-2` repetía el mate.** **V7: la vereda de siempre pasa a *el puesto de siempre*** (el mismo puesto de chori cada vez: el costado de lugar de una manera que repite) |
| `CU-4` | *Con las botamangas que ya vieron barro, un cambio te abre otro y cada uno te alegra. Pero cuando alguien quiere saber el rumbo, a vos te toca averiguarlo en el celular.* | las botamangas que ya vieron barro (la mochila liviana que no teme ensuciarse). **V6: la vuelta 5 decía *las zapatillas*, y la zapatilla con barro ya salía en `EJ-032`, `EJ-045` y la que canta de la vuelta** |

- **Largo:** 34, 30, 32 y 32 palabras (techo 36); entre 162 y 168 caracteres **[2026-10-06, `REV-20` papeles: son 165, 165, 167 y 168; el 162 no es de ninguna]** (techo 240 del schema; el techo de las más largas que ya pasaron el taller fue 169). `CU-2` mide 165 (el *un cantito* le suma 3) y `CU-3` y `CU-4`, 167 y 168. Recontadas a mano en la vuelta 7.
- **Sin género:** ninguna dice *solo/sola* ni participio que concuerde con quien juega.
- **Sin eco con las opciones:** comparé cada palabra de más de tres letras de las cuatro bajadas con las 60 opciones. Ninguna se repite (las únicas comunes a las cuatro son las de la forma: *alguien*, *cuando*, *noche*, *toca*). Las dos palabras nuevas de la vuelta 7 (*cantito*, *puesto*) no están en ninguna opción, y las dos que salen (*mate*, *vereda*) tampoco estaban. **Ojo para quien toque una opción:** *barro* está en `CU-4` y *mochila* y *esquina* en los nombres, así que ninguna opción puede decirlos (es por eso que `EJ-054` B no es *Me lavo el barro*).
- **El orgullo:** tapados los nombres, los cuatro placeres son placeres y los cuatro costos son un roce chico que paga quien juega. El barro y las botamangas de `CU-4` son lo que más cerca queda del barro de `D-62` y no hablan de ninguna crónica.
- **Qué quedó corto:** el verificador de la vuelta 7 pidió paisaje sucio *como lugar* en las cuatro. `CU-1` (el chori en la parrilla), `CU-3` (el puesto) y `CU-4` (el barro) lo traen; **`CU-2` no**: no puse humo (la guarda de «apunta al nombre» lo caza por `EJ-048` B, *Miro subir el humo*) ni un segundo barro (en una grilla de cuatro bajadas visibles juntas, dos serían estribillo). Si `REV-20` lo pide, el candidato es cambiar *otra canción* por algo que no sea ni consumo ni palabra de una opción.
- **Tarjetas:** cambiaron las cuatro desde `D-62`, `CU-3` y `CU-4` en la vuelta 6 y `CU-2` y `CU-3` en la vuelta 7: hay que regenerarlas (§10).

## 8. Medición a mano contra `banco.test.ts`

Sobre el JSON ya escrito, tras la vuelta 7. Lo que dice "Grep" lo corrí con expresiones regulares copiadas de las listas del test (con el cuidado de buscar solo dentro del texto de la opción y no en la línea entera, que trae el `polo`).

| # | Prueba | Resultado |
|---|---|---|
| 1 | cinco momentos, en orden, `preguntasPorEje` = 5 | ✓ ids `previa`, `ida`, `vereda`, `adentro`, `vuelta`; 5 por eje |
| 2 | sello ≤ 3 palabras, canta ≤ 8, sin `…` | ✓ sellos intactos; cantas de 7, 8, 8, 7 y 6 palabras (la de la ida, 8: *Ventanilla empañada, latas rodando, ruta que se estira.*; 55 caracteres, techo 80 del schema) |
| 3 | todo ítem `listo` con momento | ✓ 30 de 30 |
| 4 | tres por celda y ≥ 30 | ✓ 10 celdas × 3 |
| 5 | ids sin repetir, `EJ-001`..`EJ-028` `retirado` | ✓ intactos |
| 6 | enunciado ≤ 14 palabras, opción ≤ 5 palabras y ≤ 28 caracteres | ✓ el enunciado más largo mide 14 palabras (`031`, `039`, `044`, `045`, `052`, `056`) y 74 caracteres (`044`, techo 120 del schema); la opción más larga mide 5 palabras y 27 caracteres (`032` A) |
| 7 | nombre ≤ 26 caracteres, bajada ≤ 36 palabras | ✓ (nombres sin tocar; bajadas de 34, 30, 32 y 32 palabras) |
| 8 | cada `CU-n` conserva sus polos | ✓ sin tocar |
| 9 | nombres sin persona | ✓ sin tocar |
| 10 | vetos de la noche en enunciado y opciones | ✓ Grep: nada fuera de los retirados (el único *viaje* es el de `EJ-013`, retirado) |
| 11 | los mismos vetos en sellos, cantas y bajadas | ✓ Grep: nada (ni *cana*, ni *fuego*, ni *indio*) |
| 12 | vetos de las opciones (plata, vehículo, cuerpo, banda, merca) | ✓ Grep: nada fuera de los retirados. *Redondos*, *misa*, *pogo* y *merca* solo están en enunciados |
| 13 | lo que se toma o se fuma nunca separa los polos | ✓ 0 de 60 opciones nombran consumo (la guarda no ve pronombres: `029` A, `029` B y `048` A, §4) |
| 14 | la guarda del consumo sabe ver | ✓ es del test |
| 15 | sin parentesco ni pareja propia en una opción | ✓ Grep: nada; *su hija*, *una pareja* y *los tuyos* están en enunciados |
| 16 | la vuelta sin *a pie*, *caminando*, *camino* | ✓ Grep: nada en los seis ítems de la vuelta (el *camino* de `EJ-035` es de la ida) |
| 17 | ninguna opción delata su eje | ✓ Grep: nada. Ningún enunciado dice *luz*, *oscur\**, *orden\**, *caos* |
| 18 | ninguna opción dice la traducción de su polo | ✓ Grep: ni *gente*, ni *propio*, ni *plan*, ni *sobre*, ni *marcha* |
| 19 | ninguna palabra es la firma de un polo | ✓ recontada a mano (abajo) |
| 20 | la firma sabe ver | ✓ es del test |
| 21 | sin género en primera persona | ✓ Grep: nada en opciones ni en bajadas |
| 22 | los enunciados no cierran todos igual | ✓ tres preguntas, las tres distintas (`032`: ¿cuándo las juntás?, `033`: ¿cuándo salís?, `034`: ¿cómo la elegís?); *¿Qué hacés?* no aparece |
| 23 | las dos opciones no son la misma frase | ✓ (en `045` las dos traen *cartón*, y ninguna contiene a la otra) |
| 24 | ninguna opción apunta al nombre de una manera | ✓ comparé las 60 opciones con las 13 palabras de los nombres, los extras (*rincón, hora, horario, libro*) y las palabras de las cuatro bajadas de la vuelta 7; Grep: nada fuera de los retirados |
| 25 | **el piso de lo sucio por celda** (`BR-38`, hueco 1; **ninguna guarda lo cuenta**) **[2026-10-06: desde `4dbc8b3` la cuenta `banco.test.ts`, §3]** | ✓ 10 de 10 con la lista estricta (§3, "El piso de lo sucio"); sigue en 10 de 10 tras `EJ-049` (la celda adentro × luz-oscuridad la cumplen `EJ-048` y `EJ-049`, y el enunciado de `EJ-049` no cambió) |
| 26 | las siete de `voz.test.ts` sobre los textos nuevos | ✓ ninguna primera palabra en infinitivo (*Leo*, *Busco*, *Traje*, *Canto*, *Llevo*, *Empieza*, *Desde*, *Frente*), ningún anglicismo del glosario, ningún suspensivo, ninguna fórmula de folleto |

**La firma de un polo (19), recontada entera en la vuelta 7.** Las raíces de las 60 opciones, por eje, con la regla del test (sin las palabras vacías, de tres letras o más más `me` y `mi`, cinco letras en las de seis o más). Ninguna raíz está en tres opciones de un polo y en ninguna del de enfrente. Las más repetidas, para que se vea el margen: en luz-oscuridad `paso` ×2 en luz (`029`, `048`), `escri` ×2 en luz, `algui` ×2 en luz, `mios` ×2 en luz, `comen` ×2 en luz, `busco` ×2 en oscuridad, `miro` ×2 en oscuridad; **`quedo` bajó a ×1** (la `053` ya no lo repite); `me` ×3 en luz y ×5 en oscuridad (está de los dos lados). En orden-caos `elijo` ×2 en orden (`039`, `050`), `que` ×2 en orden (**`por` bajó a 0 en orden** con la `038`), `dejo` ×2 y ×2, `rato` ×2 en caos, `me` ×3 y ×4; `carto` está en las dos opciones de `045`. **Cualquier opción nueva que repita una de esas raíces del mismo lado rompe la guarda**: son las ocho de luz-oscuridad y las tres de orden-caos con dos. **[2026-10-06, tras `EJ-049`: `canto` pasa a ×2 en luz (`030` A y `049` A) y ×0 en oscuridad (antes ×1 y ×1), así que entra a esa lista; `sigo` queda ×1 en luz (`029` A) y ×1 en oscuridad (`049` B); `bater` ×1; `adent` y `grito` salen. Nada llega a tres. Una tercera opción de luz con *canto* rompe la guarda.]**

## 9. Lo que descarté, para que no vuelva

- **Una opción que contesta a la botella con otra bebida** (*Se la paso al de al lado*, *Me sirvo*, *Convido de mi botella*): deja a la otra como "la del que no". Los dos ítems donde las opciones tocan la ronda (`EJ-029`, `EJ-048`) las hacen de la ronda, no de lo que se toma.
- **Una opción con mate frente a un enunciado con birra**: el mate pasa a ser "la del que no toma". El mate está en la escena y no es la alternativa a nada.
- **`ronda` y `esquina` en una opción**: son palabras de un nombre (*Ronda en cualquier esquina*) y la guarda las lee. Por eso *sumarse a la ronda*, que usa `D-62`, se dice *Lo paso y sigo charlando* o *Me arrimo y canto*.
- **El porro, el fernet o la birra pasados en una opción con su nombre** (*Le paso el porro al de al lado*): la guarda no lo prohíbe si las dos opciones nombran consumo, pero entonces las dos son de quien consume. Y *el de al lado* es un desconocido (enmienda 7). La ronda es la de *los tuyos* y el objeto va con pronombre.
- **Una raya en el baño, alguien que vende, un papel de merca** (§5).
- **«Caña» y «gorra»**: el test saca tildes y la ñ, así que *caña* (la bebida) cae en el veto de la policía (*cana*), y *gorra* también. Quedan afuera de todo el banco.
- **El control de ruta y el dedo** en la ida (`RES-174`): policía y seguridad. **La conferencia de prensa, las bengalas, los detenidos, la valla** (`RES-176`, `RES-183`): registro 3.
- **El cementerio de zapatillas, la terminal, la lluvia del sábado** (`RES-188`): son de las crónicas vedadas. **Desde la vuelta 7, tampoco la zapatilla que se traga el barro con las puertas cerradas** (`RES-188` la pone con todas las letras en lo que no entra); queda el charco (`RES-185`).
- **Nombres propios** (Mauro, Sebastián y Tiziano, Claudia Canelo, Romina y Rafael, Hugo Andino): ninguna escena lleva un nombre. `RES-175` cayó como testimonio y `RES-190`/`RES-191` son leyenda sin apellido: sirven la forma, no la persona.
- **El 5 de junio** (`RES-192`, `RES-194`): ninguna escena, ni la plaza, ni los banderazos, ni el dolor de padres e hijos. El padre y la hija de `EJ-051` cantan y no se despiden.
- **El "ricotero" en una opción, "la misa" en una opción, "los Redondos" en una opción** (`VETOS_DE_LAS_OPCIONES`: puntúan quién es más de adentro). Y, desde la vuelta 6, **"los Redondos" en un enunciado cuya opción canta o tararea**: quien conoce los temas oye el disco y quien no, no (`EJ-035`). **Y, desde la vuelta 7, "la misa" en un enunciado cuya opción anticipa** (`EJ-046`).
- **`con lo que no te importe ensuciar`** en `EJ-034`: afirmaba la conducta de orden en el enunciado.
- **La botella cortada como escena de alguien que la toma** (*Alguien se sirve de la botella cortada*): una persona haciendo algo con la bebida; la botella en la canta es un objeto.
- **El pogo como acción** (`RES-158`: *meterse*, *saltar*): el pogo suena y nadie elige meterse (`D-62` punto 6). Tampoco *adelante*: pone a quien juega en el campo.
- **(vuelta 6) Contar la caravana y los micros en fila como parte sucia.** Son paisaje de la ida; no están en la lista de `BR-38`.
- **(vuelta 6) El pancho en la mano, el sudor, la boca seca y «hecho pelota» como parte sucia del piso.** Son textura y están; no cuentan para el piso. El piso se cumple con palabras de la lista de `BR-38`.
- **(vuelta 6) *Subo mi música* y *Aviso a un amigo: llueve* como opciones de luz y de oscuridad.** La primera cruza a luz o aísla; la segunda avisa a alguien que no está.
- **(vuelta 6) *Me la grabo*, con una nena cantando en la escena.** Se lee como filmarla.
- **(vuelta 6) Barro en el enunciado de la merca.** Es la fórmula de la crónica de Olavarría.
- **(vuelta 7) *Me quedo en el cordón*.** Es donde uno se sienta (silla de ruedas), se define por no sumarse y suena a la que quedó afuera de la ronda.
- **(vuelta 7) La nena en los hombros de su viejo, junto al porro o la merca.** Un chico y lo que se toma o se fuma no comparten escena (`BR-38`), y la escena es el momento. Sale un padre con su hija grande; la nena queda para otro banco.
- **(vuelta 7) *Para no perderla*.** Se lee como no perder a la nena y, a cuatro meses del 5 de junio, como guardar la canción del que se fue.
- **(vuelta 7) *Me lavo el barro*, *Me saco las zapas embarradas*.** La primera cae en la guarda de «apunta al nombre» (*barro* está en la bajada de `CU-4`); la segunda repetía *embarradas* en la misma hoja que la que canta de la vuelta.
- **(vuelta 7) *Prenderse a un trapo*, *bancar la fila*, *cantar hasta quedarse sin voz*, *quedarse hasta que prendan las luces*, *pasarle la botella al de al lado*.** Ninguna entra a una opción, y la razón está en el §12.
- **(vuelta 7) La merca en `EJ-050` o en `EJ-048`** (§5).

## 10. Para `REV-20` y para el hilo principal

**Lo que le pido a `revisor`, en este orden** (todo lo que ninguna máquina ve):

1. **El quinto lugar, ítem por ítem** (`notaInterna`): ¿alguna opción la elige peor el que no toma ni fuma? Mirá primero `EJ-029` A y B (*Lo paso…*, *Me quedo en la mía*, §4: los pronombres que la guarda no ve), `EJ-048` A (*Lo paso…*) y `EJ-048` B (*Miro subir el humo*: ¿es "la del que no fuma"?).
2. **`EJ-049`, la merca** (§5): ¿paisaje o guiño? ¿*Humo y merca* en una oración propia es seco? ¿Quedó sin lectura de efecto con *Canto para adentro*? **[2026-10-06: esa pregunta se contestó en `REV-20` y la B ya no es esa; §14.]**
3. **La noche, ¿suena ricotera?** Es la pregunta del usuario. Las cinco líneas que cantan y los treinta enunciados, leídos de corrido, sin los títulos. **Mirá en especial las opciones leídas de corrido**, sin los enunciados: la vuelta 7 sacó el té, el dibujo, el mazo, el barquito y el cargador; quedan *Tamborileo en la rodilla* y los gestos del hogar de la vuelta (*medias gruesas*, *una ducha*, *un vaso de agua*): si todavía suenan a un lado de la noche, es una tanda aparte.
4. **Los que no entraron** (`EJ-043`, `EJ-045`, `EJ-046`): ¿se lee como lástima o como la escena? Desde la vuelta 6 `EJ-043` ya no los nombra; desde la 7 `EJ-045` trae el charco y el cartón, no la zapatilla.
5. **La banda en el enunciado** (`EJ-040`, *los Redondos a todo lo que da*; `EJ-052`, *la misa* y *pogo*): ¿alguna pide saber algo? ¿Alguna opción queda "más de adentro" por lo que dice el enunciado? `EJ-046` ya no lleva *la misa*.
6. **La ternura** (`EJ-047`, `EJ-051`, `EJ-042`): ¿suena a homenaje a cuatro meses del 5 de junio? `EJ-047` es la que más se acerca (una canción lenta, alguien con los ojos cerrados). `EJ-051` (un padre y su hija grande que cantan a dúo): ¿se lee como adulta?
7. **El teléfono y la luz con alguien al lado:** cuatro firmes (`031`, `036`, `054`, `055`) y una que puede ser en voz alta (`053`): cinco como máximo, el tope de la enmienda 7 (un tercio de quince). **La vuelta 6 contaba tres y estaba mal** (`054` es un mensaje a una casa en silencio). Con alguien al lado (los pone el enunciado o la opción): `029`, `030`, `035`, `042`, `043`, `047`, `048`; cada momento tiene al menos una luz que se hace sin nadie al lado (`031`, `036`/`037`, `041`, `049`, `053`/`054`/`055`).
8. **Los cruces flojos** (§6, "Los cruces"), sobre todo canción lenta con pogo.
9. **Las repeticiones.** El barro está en `034`, `045` (que además repite el de la que canta de la vereda) y en las cantas de la vereda y la vuelta; el humo en `041`, `049`, `053` y en `048` B; las zapatillas en `032` y la canta de la vuelta; la campera en `042`, `044`, `053` B y `032`; la yerba en `031` y la canta de la previa. Es un estribillo a propósito, no un descuido; si cansa, `REV-20` dice cuál se va.
10. **Lo que no toqué en la vuelta 7 y el verificador nombró** (§12): lo sucio de `EJ-035`, `EJ-039` y `EJ-041` sigue siendo el aire de la escena y no lo que toca la opción.

**Lo que le dejo al hilo principal.** Todo está en `Docs/SUGERENCIAS/CNT-para-hilo-principal-noche-ricotera.md`, con la tabla *Dónde | Hoy | Pasa a*. En una línea: **regenerar las tarjetas** (cambiaron las cuatro bajadas con `D-62`, y `CU-3` y `CU-4` en la vuelta 6, `CU-2` y `CU-3` en la vuelta 7), **una guarda para el piso de lo sucio por celda** (`BR-38`, hueco 1) y, si querés, dos cadenas del sitio (`LUGARES.dosEjes` y la bajada del casete). Nada de eso es de este documento ni bloquea el banco. **[2026-10-06, `REV-20` `FIND-125`: aplicado lo de arriba. Las tarjetas se regeneraron (`a596435`), `LUGARES.dosEjes` y la bajada del casete entraron (`copy.ts`), la guarda del piso de lo sucio entró (`4dbc8b3`) y la del volumen también (`62cd0e1`, con una lista más angosta que la propuesta: frases de queja y no palabras sueltas). Sigue sin escribirse la guarda «ninguna opción nombra consumo». `LUGARES.dosEjes` se vuelve a tocar por `FIND-120` (§14.4).]** Y a `experiencia`, en `CNT-para-experiencia-noche-ricotera.md`: la línea que canta de la ida cambió y es la más ancha, y los enunciados más largos son ahora `044`, `040` y `045`.

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

`tarjetas.test.ts` va a fallar hasta que se regeneren las tarjetas, y no es un defecto del contenido: `huellaDelTaller()` entra con las bajadas, y la vuelta 7 cambió dos más. Hay un riesgo concreto del taller: las bajadas miden hasta 168 caracteres y el taller falla fuerte si una ocupa más de cinco renglones (la más larga que ya pasó fue de 169).

## 11. Vuelta 6: lo que encontró el verificador adversarial (2026-10-05) y qué hice

Un verificador leyó el banco y dio **tests verdes** (126 de 126; `tarjetas.test.ts`, 9 de 10, por las bajadas, ya avisado en §10) y **"suena ricotera: a medias"**: la escena era ricotera y quien la caminaba no. Doce problemas. Nada de lo que pidió contradice `D-62`: no hubo que descartar ninguno por eso. Lo que no hice, y por qué, está dicho. **Es historia: las columnas "Qué hice" de abajo describen el banco de la vuelta 6, y la vuelta 7 (§12) cambió varias de esas opciones.**

| # | Gravedad | Dónde | Qué hice |
|---|---|---|---|
| 1 | alta | La ida entera, `adentro × orden`, `vuelta × orden`: el piso de `BR-38` falla en 4 de 10 celdas con la lista estricta; la que canta de la ida, limpia | **Hecho.** `EJ-035` (olor a chori y a vino), `EJ-039` (la birra por el fondo), `EJ-052` (el reviente), `EJ-056` (la mugre) y la que canta de la ida (*latas rodando*). Diez de diez (§3). El pedido de la guarda por celda va al hilo principal |
| 2 | alta | `031`, `037`, `041`, `048`, `049`, `052`, `053`: lo sucio de adorno; 57 de 60 opciones iguales; opciones "de excursión" | **Hecho a medias, a propósito.** Reescribí donde la escena y las opciones chocaban o no se pertenecían: `048` (modelo de `EJ-029`), `052` (par nuevo: dónde ubicarse), `037` (el pancho sale de la mano), `049` (la merca en su oración). **No toqué `031`, `041` ni `053`**: ahí lo sucio es el aire de un lugar y las opciones contestan a la otra mitad de la escena. **Tampoco toqué** *Preparo un té*, *Dibujo en un papel*, *Saco el mazo de cartas* ni *Lo conecto al cargador*. **Esto lo corrigió la vuelta 7 (§12): el hilo principal dijo que para "las preguntas más ricoteras" no vale "cambiá lo mínimo"** |
| 3 | alta | `EJ-035`: con *un disco de los Redondos*, *Tarareo una que me gusta* pide conocer los temas | **Hecho.** Sin disco ni banda en `035`; *los Redondos* se mudan a `EJ-040`, cuyas opciones no tocan la música. Como el verificador sugirió |
| 4 | alta | `EJ-052`: *adelante* y el volumen sobre quien juega; las dos opciones son del turista | **Hecho.** El pogo y el reviente llegan hasta la calle; el par es dónde ubicarse (*Me ubico y me quedo* / *Voy cambiando de sitio*), sin pedir cuerpo capaz ni meterse en el pogo |
| 5 | media | `EJ-049`: *humo, merca y barro*, la merca junto a la reacción del cuerpo, la fórmula de Olavarría | **Hecho**, como pidió: sin barro, la merca en una oración propia, la pregunta aparte (§5). **La vuelta 7 vio que no alcanzaba** |
| 6 | media | `EJ-029` B: *Subo mi música* tiene dos lecturas y las dos fallan; la guarda no ve pronombres | **Hecho.** B pasa a *Me quedo en el cordón*. **La vuelta 7 la cambió a *Me quedo en la mía*** |
| 7 | media | `EJ-037`: el pancho en la mano da la plata por hecha | **Hecho.** El pancho es de la olla del puesto |
| 8 | media | `EJ-043`: *los que no entraron* en tercera persona, opciones de vidriera, pretérito que choca con `045` y `046` | **Hecho**, con el texto que sugirió: *En la reja, cada barrio ata su trapo.* |
| 9 | media | `EJ-051`: *Me la grabo* se lee como grabar a la nena | **Hecho.** *La repito para no perderla*. **La vuelta 7 la cambió a *hasta aprenderla*** |
| 10 | media | `EJ-042`: la luz es avisar a alguien que no está; 8 de 15 luces son comentar o avisar | **Hecho en `042`** (*Me tapo con un amigo*) y de paso `048` pasa a pasar y aplaudir. Las luces de decir o mandar bajan de 8 a 7 de 15 (`031`, `036`, `041`, `043`, `053`, `054`, `055`); no reabrí el resto: queda dicho para `REV-20` (§10, punto 7) |
| 11 | baja | `CU-2`/`CU-3`: el mate dos veces; fogón de campamento | **Hecho en `CU-3`** (*la vereda de siempre* en lugar del termo). El mate queda en `CU-2` (la vuelta 7 lo sacó). Tarjetas por regenerar |
| 12 | baja | La zapatilla con barro sale cuatro veces | **Hecho en `CU-4`** (*las botamangas*). Quedan `EJ-032`, `EJ-045` (con ficha, `RES-185`) y la que canta de la vuelta. **La vuelta 7 sacó la de `EJ-045`** |
| 13 | baja | `EJ-046`: *la misa* hace que *Lo tenía previsto* suene a veterano | **No lo toqué, y lo dejo anotado.** **La vuelta 7 lo resolvió** (§12): vuelve *el recital* |
| 14 | baja | Cinco cruces y pulidos | **Hechos cuatro.** `054`+`058` (el parlante pasa a la mochila), `035`+`039` (ya sin disco), `044` (campera y buzo), `032` (la bolsa pasa a mochila). **No toqué `EJ-050`** (*Mañana te preguntan cómo estuvo* en *Cuando suena*): mira hacia adelante a propósito y el salto de tiempo es de la hoja entera, no de ese ítem |

**Y lo que cambió de lugar en `notaInterna`:** cada ítem tocado dice qué vuelta lo tocó y por qué; los de luz con teléfono dicen "cuatro firmes de quince" desde la vuelta 7.

## 12. Vuelta 7: la segunda lectura adversarial y el pedido del hilo principal (2026-10-05)

> **[2026-10-06]** Historia. Una cosa de esta vuelta cambió después: las opciones de `EJ-049` que cita (*Grito con el resto* / *Canto para adentro*) pasaron a *Canto con el resto* / *Sigo la batería* por `REV-20` (§14). El resto vale como está escrito.

**El pedido del hilo principal, textual en su sentido:** el problema de *"las 60 opciones siguen siendo las del banco limpio"* es el pedido central del usuario (`D-62`, *"las preguntas más ricoteras"*), y para eso no vale "cambiá lo mínimo": reescribir las opciones que haga falta para que quien camina la noche sea ricotero y no un campamento. Afuera, sacar *Preparo un té*, *Dibujo en un papel*, *Saco el mazo de cartas*, *Armo un barquito de papel* y *Lo conecto al cargador*; adentro, gestos de la noche: sumarse a la ronda, pasar la botella o el porro, bancar la fila, cantar hasta quedarse sin voz, prenderse a un trapo, pegar la vuelta, quedarse hasta que prendan las luces, la vereda, el cordón con lo propio. Todas las guardas de `banco.test.ts` y los cinco lugares siguen valiendo.

**El verificador** dio 126 de 126 verdes y "suena ricotera: en la escena, sí; en quien la camina, a medias" (51 de 60 opciones eran las de `CNT-30`). Quince problemas. Nada de lo que pidió contradice `D-62`.

### Las once opciones que cambian

| Id | Era | Es | Por qué |
|---|---|---|---|
| `EJ-029` B | Me quedo en el cordón | **Me quedo en la mía** | `D-62` punto 2 dice «quedarse con lo propio» y la B perdió el «lo propio»; sonaba a la que quedó afuera; el cordón es donde uno se sienta. **No *con la mía*, que fue la sugerencia del verificador y la primera mano de esta vuelta:** con *una botella cortada* en el enunciado, *la mía* es mi botella (el sustantivo está a la vista y es femenino), y la explicación del propio verificador (*la lata, el mate, la gaseosa*) la vuelve la bebida de quien no toma frente al fernet de la ronda: es la opción «contestarle a la botella con otra bebida» que §9 descartó, la forma 2 del quinto lugar, que la guarda no ve porque ninguna opción nombra consumo. *En la mía* es modismo y no puede ser la botella |
| `EJ-031` B | Tarareo un tema | **Leo los calcos del poste** | El tarareo estaba en tres opciones y dos salían juntas 1 noche de cada 9; un calco en un poste es de plaza de barrio |
| `EJ-038` A | Llevo algo por si llueve | **Llevo bolsas para los pies** | Con el barro de la noche, la A era la del piloto y *Si llueve, llueve* la del aguante (la marca de `BR-38`); ahora las dos son de la noche |
| `EJ-045` A | Saco el mazo de cartas | **Traje un cartón** | De excursión. Un cartón sobre el barro: previsto |
| `EJ-045` B | Armo un barquito de papel | **Busco un cartón por ahí** | De excursión. El mismo cartón, conseguido: la misma suciedad, el mismo orgullo de arreglárselas |
| `EJ-049` B | Me retumba en la panza | **Canto para adentro** | Con la merca en el enunciado, una sensación del cuerpo se leía como el efecto de la merca (`BR-38`, quinto lugar, forma 5); ahora es un hacer, y rioplatense |
| `EJ-051` A | La repito para no perderla | **La repito hasta aprenderla** | *Perderla* se leía como no perder a la nena o al que se fue |
| `EJ-053` B | Me quedo con la noche | **Me dejo la campera puesta** | Repetía la forma de `EJ-029` B (salían juntas 1 noche de cada 9); es físico y propio con el objeto de la escena |
| `EJ-054` B | Preparo un té | **Me pongo medias gruesas** | De excursión. Contesta a los pies helados del enunciado |
| `EJ-055` B | Dibujo en un papel | **Me doy una ducha** | De excursión. El gesto de después de una noche de sudor, humo y barro |
| `EJ-058` A | Lo conecto al cargador | **Lo limpio y lo guardo** | De excursión. El parlante vuelve con barro y humo encima |

**El resultado:** 42 de 60 opciones siguen siendo las de `CNT-30` (eran 51); las 18 distintas traen barro, humo, mugre, la ronda, el cartón sobre el charco, el parlante sucio, la campera con humo. **Más de la mitad del banco de opciones sigue siendo el de `CNT-30`, y es decisión mía**: lo que no está en la lista de excursión (*Hablo con los míos*, *Tarareo una que me gusta*, *Me abrigo en capas*, *Las agarro al vuelo*, *Lo tomo como viene*…) es un gesto físico, barato y sin credencial, que ya pasó cuatro vueltas de lectura. Si `REV-20` lee que todavía no alcanza, la tanda siguiente son `030` B, `041` B, `047` B y `056`/`057`. Los cinco gestos de excursión que el hilo principal nombró ya no están.

### Los otros cambios

| # | Gravedad | Dónde | Qué hice |
|---|---|---|---|
| 1 | alta | `EJ-029` B | **Hecho** (arriba). También `EJ-053` B para que no repita la forma |
| 2 | media | `EJ-051` junto a `EJ-048` / `EJ-049` (la nena y el consumo, `BR-38`) | **Hecho distinto del que sugirió.** Pidió llevar la escena a otro momento. No lo hice: con los 30 ids fijos, mover una escena de momento obliga a reescribir otro ítem de ese momento (cambia lo que miden dos ids), y `D-62` pide *un padre que le pasa la canción a su hija*, no una nena. **Saqué al chico**: *Un padre y su hija grande cantan a dúo.* (la primera mano decía *abrazados*, y un padre y su hija adultos abrazados cantando es la foto de las plazas del 5 de junio: `RES-190` sale de una nota de esa despedida; *a dúo* es de dos que cantan juntos). Sin chico, la regla de `BR-38` no se cruza, y la ternura queda. **Ojo:** `BR-38` dice en la frase siguiente que *el padre y su hija están en la escena de la canción, no en la de la ronda*; si `REV-20` lee que ni un padre y su hija adultos pueden salir en la hoja del porro (`048`) o de la merca (`049`), la salida de verdad es la del verificador (mudar la escena a la vereda, el único momento sin consumo, con su nena en los hombros, y escribir otra de orden-caos para *Cuando suena*) y no entró de entrada porque la vereda trae *Pies en el barro* en la que canta. Lo lee `REV-20` (punto 6 del §10): si *hija grande* no se lee como adulta, la salida es mover la escena |
| 3 | media | `EJ-051` A | **Hecho** (arriba) |
| 4 | media | `EJ-049` y la que canta de Cuando suena | **Hecho** con su opción 2: el enunciado se queda con la merca en su oración y los instrumentos, sin *de golpe* y sin *¿Qué te sale?*; y la B deja de ser una sensación. Sigue siendo la única mención, seca |
| 5 | media | `EJ-045` (la zapatilla perdida de Olavarría) | **Hecho** con el texto que sugirió (*Frente a la reja hay un charco de barro y las puertas siguen cerradas.*) y además las dos opciones (arriba). El barro sale dos veces en la hoja (la que canta de la vereda): queda, porque es la palabra de `BR-38` de esa celda y no hay otra escena con una |
| 6 | media | `EJ-038` | **Hecho** con su ejemplo (*Llevo bolsas para los pies*) |
| 7 | media | `EJ-046` con *la misa* | **Hecho**: vuelve *el recital* y *la misa* se muda a `EJ-052`, donde ninguna opción anticipa nada (su segunda sugerencia) |
| 8 | media | La previa y su cruce con la ida | **Hecho** con su opción 2: ninguna de las seis dice si ya saliste. `EJ-033` pierde la carpa (un vecino desde una ventana, uno solo) y `EJ-034` pasa a *¿Cómo la elegís?*; `EJ-032` no se toca (*¿Cuándo las juntás?* es un hábito) |
| 9 | media | Las 60 opciones; lo sucio de `EJ-035`, `EJ-039` y `EJ-041` | **Hecho a medias, y dicho.** Las once opciones de arriba. **No toqué lo sucio de `035`, `039` y `041`**: para que la opción lo toque habría que nombrar el vino o la birra (que el quinto lugar veta) o inventar una opción sobre el humo del chori que no suena a comprar. Quedan como aire de la escena. Si `REV-20` lo pide, la salida es la misma que en `EJ-029` y `EJ-048`: cambiar el enunciado, no la opción |
| 10 | baja | Las cuatro bajadas | **Hecho en `CU-2` (*cantito*) y en `CU-3` (*el puesto de siempre*)**; `CU-1` y `CU-4` ya traían chori y barro. `CU-2` sigue sin paisaje sucio (§7) |
| 11 | baja | Repeticiones en una hoja o noche | **Hechas** `golpe` (`049`), `suena`/`canta` (`047`, *Empieza*) y el tarareo (`031` B). **No hecha** `barro` en `045` (arriba) |
| 12 | baja | `EJ-033` en plural contra opciones en singular | **Hecho**: *un vecino te grita* |
| 13 | baja | `EJ-043`, `notaInterna` | **Hecho**: la nota dice que pasa por la prueba de tapar la palabra |
| 14 | baja | El teléfono en las luces | **Hecho**: cuatro firmes (`031`, `036`, `054`, `055`) y `053` que puede ser en voz alta; cinco es el tope. **No se suma ninguna luz con teléfono** |
| 15 | baja | `EJ-040` | **Hecho** (por la regla del volumen, abajo): *En la caravana, los Redondos a todo lo que da. Falta un buen tramo.* El *lo* de *Lo parto en tramos* tiene antecedente. La inclinación leve de *Me dejo llevar* con la banda sonando no se toca (cambiar la opción reabre la vuelta 4): queda para `REV-20` |

### Lo que pidió el hilo principal y no entró en una opción, y por qué

Cada una choca con una condición que el mismo pedido dice que sigue valiendo (*las guardas de `banco.test.ts`, los cinco lugares, sin credencial*). Lo dejo dicho para que `REV-20` o el hilo principal decidan si hay que mover la regla, no la opción.

- **Prenderse a un trapo.** *Trapo* es vocabulario del código: `BR-38` lo pone en la columna "Nunca" de las opciones (puntúa quién es de adentro), y quien nunca fue no sabe qué es. Está en el enunciado de `EJ-043` (*En la reja, cada barrio ata su trapo*).
- **Cantar hasta quedarse sin voz, bancar la fila, quedarse hasta que prendan las luces.** Son *la opción que más aguanta lo sucio*, la marca nueva de `BR-38` («se lee como la del que es de verdad»), y su espejo —la que se va— queda como la del turista. *Hasta que prendan las luces* además es adentro del lugar: falla «sin plata» y «los que no entraron». Lo que sí entró en el espíritu: *Grito con el resto* y *Canto para adentro* (`EJ-049`), *Lo paso y sigo charlando* y *Me quedo en la mía* (`EJ-029`).
- **Pasar la botella o el porro «al de al lado».** El de al lado es un desconocido (enmienda 7, y veto 6 de `BR-36`). Se pasa entre *los tuyos* (`EJ-029`, `EJ-048`).
- **Pegar la vuelta, en una opción.** La vuelta no tiene trayecto (seguridad): el verbo entra en el enunciado de `EJ-058` (*Pegaste la vuelta*), en pasado y ya en casa.
- **El cordón con lo propio.** Lo propio entró (*Me quedo en la mía*); el cordón no, porque es donde uno se sienta (silla de ruedas).
- **La vereda.** Está en las cantas (*Pies en el barro y un parlante lejano*) y en cuatro enunciados; en una opción no hay verbo de ubicación que no sea un desplazamiento o un lugar propio de un cuerpo capaz.

### Una regla más del usuario: «nunca cansa el volumen»

> En la noche ricotera la música nunca molesta: ninguna escena ni opción trata el volumen, el ruido o los parlantes como algo que cansa, aturde o hay que tapar.

Es de la misma familia que *"lo primero no puede faltar"* (`D-62`): si la noche es la ricotera de verdad, el reviente de la música es lo que se vino a buscar, no lo que se aguanta. **Cómo lo medí:** recorrí con `Grep` todo el texto que se lee (enunciados, opciones, sellos, líneas que cantan y bajadas) buscando *volumen, ruido, aturd\*, ensordec\*, cansa\*, oído\*, algodón, zumbid\*, tapar, molest\*, estruend\**.

- **Lo único que quedaba era `EJ-040`: «los Redondos a todo volumen».** No era una queja (era alegría), pero la palabra sale del banco entero para que una guarda por palabra no tenga que distinguir. Pasa a *a todo lo que da*, y de paso el *lo* de *Lo parto en tramos* gana su antecedente (*Falta un buen tramo*, la sugerencia del verificador).
- **Lo que ya estaba afuera y no vuelve:** el par del oído de `CNT-30` (*El volumen cansa los oídos* / *Traje algodón por las dudas* / *Me tapo con los dedos*), *los parlantes cansan los oídos* (vuelta 5 de `EJ-052`) y el *zumbido* de `EJ-053`. Las `notaInterna` los nombran solo como historia de lo que se sacó; ningún texto que se lea los trae.
- **Lo que revisé y se queda:** *Cuando suena* y *Golpe en el pecho y todos cantan* (el golpe es del que canta, no del que sufre); *el reviente llega hasta la calle* (`EJ-052`: se oye desde afuera, no molesta); *Lo apago nomás* (`EJ-058`: es un parlante que quedó prendido en la mochila, no el ruido); *La casa está en silencio* (`EJ-054`); *Me tapo con un amigo* (`EJ-042`: es la campera y la llovizna); *Me retumba…* ya no está (`EJ-049` B es ahora *Canto para adentro*).
- **Para la guarda** (la suma el hilo principal): la lista está en `CNT-para-hilo-principal-noche-ricotera.md`, medida contra este banco.

### Segunda mano sobre tres decisiones de esta vuelta

Quedaron tres cosas que la primera mano de la vuelta 7 resolvió con la letra del verificador y que, leídas otra vez, se resolvían mejor distinto. Están en el JSON y en las tablas de arriba:

1. **`EJ-029` B: *Me quedo en la mía*, no *con la mía*.** Con *una botella cortada* a la vista, *la mía* es mi botella. Ver la fila de arriba.
2. **`EJ-051`: *cantan a dúo*, no *cantan abrazados*.** Un padre y su hija adultos abrazados cantando es la foto de las plazas del 5 de junio. Y queda abierta la pregunta de `BR-38` (¿alcanza con que la hija sea adulta?), con su salida dicha en la fila 2.
3. **`EJ-040`: sin *volumen*.** Regla de arriba.

### Lo que pasó en esta vuelta y que el verificador no vio

Cuatro defectos que me encontré al contar a mano y que habría dejado pasar:

1. **`barro` está en `CU-4`** y la guarda de «apunta al nombre de una manera» lee las palabras de las bajadas: la opción que sugería el verificador (*Me lavo el barro de los pies*) cae en el test aunque no tenga cinco palabras. Lo cacé leyendo la guarda, no corriéndola.
2. **Mi primer grep de esta vuelta mezclaba el campo `polo`** (`luz`, `orden`, `caos`) con el texto de la opción y marcaba las 60 como delatoras. Lo rehice buscando solo dentro de `"texto": "…"`; conviene que quien repita la comprobación a mano lo sepa.
3. **`por` pasó de ×1 en orden a 0** con `EJ-038` A (*Llevo bolsas para los pies*, y ya no *por si llueve*); la raíz `quedo` bajó a ×1. Las dos eran de las más cerca del tope.
4. **`EJ-054` B no puede ser *Me saco las zapas embarradas***: repetiría *embarradas* en la misma hoja que *Zapatillas embarradas, llave en la puerta*.

## 13. `T-352`: el texto que oye el lector de pantalla en el plano de dos ejes (2026-10-05, ciclo 19)

**Qué se pidió.** El plano vuelve al resultado, fijo (`D-62` enmiendas 2 y 3, `UX-38`), y es una imagen con su texto (`role="img"`). La cadena la propuso el hilo en `src/lib/dos-ejes/copy.ts` (`RESULTADO.altPlano` y `RESULTADO.lugares`) y era mía confirmarla o cambiarla. **Confirmo la forma y los cuatro lugares; cambio dos cosas.** El banco y `src/data/dos-ejes.json` no se tocan.

**El texto final**, tal como lo oye el lector (la tuya en `CU-2`, arriba a la derecha; la de quien mandó el enlace en `CU-4`):

| Caso | Texto |
|---|---|
| Sin enlace | *Dos ejes en cruz. Arriba, Luz, con la gente. Abajo, Oscuridad, con lo propio. A la izquierda, Orden, con plan. A la derecha, Caos, sobre la marcha. Tu manera, arriba a la derecha: Ronda en cualquier esquina.* |
| Con enlace, otra manera | *…Tu manera, arriba a la derecha: Ronda en cualquier esquina. La de quien te lo mandó, abajo a la derecha: Mochila liviana, sin mapa.* |
| Con enlace, la misma | *…Tu manera, arriba a la derecha: Ronda en cualquier esquina. La de quien te lo mandó es la misma.* |

Treinta y siete palabras sin enlace, cincuenta y una con la manera de otro lugar, cuarenta y seis con la misma. Los cuatro lugares (`arriba a la izquierda`, `arriba a la derecha`, `abajo a la izquierda`, `abajo a la derecha`) quedan como están. Los polos y los nombres siguen saliendo de `EJES`, `POLOS` y el banco: ninguna palabra del texto se repite a mano.

### Lo que cambio, y por qué

1. **Puntos, no punto y coma, entre los cuatro polos.** Cada polo ya trae dos comas adentro (*Arriba, Luz, con la gente*), y con punto y coma entre uno y otro la frase de los polos queda en veintitrés palabras de comas y semicolones. Mi lectura, que no pude oír en un lector (`D-12`): los sintetizadores de los teléfonos tratan el punto y coma como una coma larga, así que *con la gente; abajo* se oye parecido a *con la gente, abajo* y *abajo* parece colgado del polo de arriba. Con punto, cada polo es una oración de cinco a siete palabras con la caída de voz de un cierre, y el oído separa los cuatro sin ayuda. Si en un lector real los semicolones se oyen bien, el cambio sobra, pero no cuesta nada. Es la medida de frase de `voz-ricotera.md` §3.1 y no suma una palabra.
2. **«La tuya» pasa a «Tu manera».** La cadena no tiene dónde apoyar *la tuya*: dice *dos ejes*, *polos* y *lugares*, y *manera* no aparece. En la página lo salva el título de la sección (*Las cuatro maneras*), pero el lector salta de imagen en imagen y la oye suelta. *Tu manera* se entiende sola, usa la palabra que el sitio ya usa (*Las cuatro maneras*) y le da antecedente a lo que sigue: *La de quien te lo mandó* y *es la misma* quedan pegadas a *manera*. Cuesta cero palabras. **El sentido no cambia** y no choca con `BR-37`: *tu manera* es el mismo posesivo que ya dicen *con la tuya primero* (`altGrilla`) y *Con la tuya comparte* (`CONTRASTE`), y ninguna de las formas que la regla veta (*sos X*, *tu verdadero*, *siempre*) está. La ocasión («esta noche») la dice el rótulo, una vez (`BR-37` regla 1), y el lector acaba de oírlo en la hoja.

### Lo que descarté para el lugar de «La tuya»

- **«Te salió, arriba a la derecha: …»** (el verbo de `BR-37`). Pegado al lugar se lee literal, como algo que te brotó en el cuerpo, y deja a la segunda sin un sustantivo al que apoyar *La de quien te lo mandó* (tendría que ser *A quien te lo mandó le salió, …*).
- **«Esta noche, arriba a la derecha: …»** (el sello que ve quien mira). Sin el dibujo, *esta noche* suelto es un adverbio de tiempo y no dice qué hay en ese lugar.
- **«Vos, arriba a la derecha: …»** y **«Estás arriba a la derecha: …»**. Son *sos X* con otra cara, que `BR-37` veta.
- **«La que te salió»**. Se entiende sola y es la más fiel al verbo de `BR-37`; es la alternativa si `revisor` prefiere ese verbo, y también anda. La dejé porque suma dos palabras y no le da a *La de quien te lo mandó* un sustantivo en el que apoyarse.

### Lo que confirmo, y por qué se queda

- **«lugar: nombre.», con el nombre al final.** Dos de los cuatro nombres llevan una coma adentro (*Radio bajita, misma hora* y *Mochila liviana, sin mapa*). En el medio de una frase, con otra coma pegada, serían una lista de tres; al final, el punto los cierra.
- **Las glosas de los polos (*con la gente*, *con lo propio*, *con plan*, *sobre la marcha*).** Sacarlas dejaría a *Oscuridad* sola, que es lo que `CNT-30` §6.1 arregló («Oscuridad se leía triste»), y el criterio 6 de `US-06` pide que quien usa lector «reciba lo que recibe quien ve»: quien ve las lee debajo de cada polo.
- **Solo la tuya y la de quien mandó el enlace, no las cuatro.** El criterio 6 pide «los dos ejes, los cuatro polos y dónde cae la tuya (y la del otro) como lugar». Las otras dos ya las dice la grilla de abajo, con su polo, en el mismo recorrido de lectura. Nombrar las cuatro suma unas veinte palabras a una cadena que el lector dice de un tirón, sin poder saltear por oración, y las pone en un orden fijo (*Mesa larga a las nueve* siempre primera) que es justo la lectura de lista ordenada que el criterio dice que no se arme.
- **«Dos ejes en cruz.»** Dice qué es, seco y sin imagen. *Plano* queda para el dibujo y el código.
- **«quien te lo mandó»**: la misma fórmula que el sello visible, `POSTAL.rotulo` y `CONTRASTE`.

### Contra qué lo medí

| Condición | Resultado |
|---|---|
| `PRD-alcance-v1.md`, criterio 9 condición 6: nada que ordene (*mejor*, *peor*, *primera*, *última*, *más*) | Ninguna de las cinco, en ninguno de los tres casos. *Arriba* y *abajo* dicen un lugar, no una nota |
| Condición 4: ni un dígito en el `aria-label` | Ninguno (*nueve*, de *Mesa larga a las nueve*, es palabra) |
| Registro 3 (`voz-ricotera.md` §5) | Seco; sin imagen, sin suspensivos, sin exclamación, sin chiste |
| `D-17` | Sin anglicismos; el voseo no aplica (no hay botón ni imperativo) |
| `BR-37` | Sin *sos*, *eres*, *tu verdadero* ni *siempre* |
| `D-14` | No afirma nada externo: describe un dibujo |

**No lo corrí** (`D-12`): el texto está medido a mano contra las condiciones de arriba, no oído en un lector. Lo que sí falta es que una máquina lo mire, y hoy ninguna lo hace. **[2026-10-06: ya lo mira `src/lib/dos-ejes/copy.test.ts` (`3b4ae32`), en los 20 casos. Lo único que sigue sin hacer nadie es oírlo en un lector real (VoiceOver o TalkBack).]**

### Un hueco que encontré, y es del hilo principal

`voz.test.ts` **no audita `altPlano`**. Su recolector de funciones (`cadenasDeFunciones`) las llama con un número y con `'X'`, y `altPlano` recibe un objeto: con cualquiera de los dos comodines revienta en `p.tuya.lugar`, el `catch` se la traga y la función queda sin mirar. `lugares` sí se audita (es un arreglo de cadenas). La cadena más larga del resultado, y la única que solo oye quien usa lector, está fuera del barrido: es el mismo hueco que `dos-ejes` ya tuvo una vez (el comentario de `MODULOS` lo cuenta). Propongo la guarda en `Docs/SUGERENCIAS/CNT-para-hilo-principal-texto-del-plano.md`. **[2026-10-06: resuelto. La guarda existe (`copy.test.ts`, seis pruebas sobre los veinte casos) y la sugerencia está marcada aplicada. Ya no es un hueco.]**
