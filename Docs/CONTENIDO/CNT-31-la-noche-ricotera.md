# CNT-31 — La noche ricotera: el banco de "¿Qué tipo de ricotero sos?" con el barro, el chori, la birra, el porro y la familia

- **Rol dueño:** `contenido`
- **Fecha:** 2026-10-04, ciclo 18.
- **Estado:** entrega completa. Reescribe `src/data/dos-ejes.json` (los 30 enunciados, las cinco líneas que cantan y las cuatro bajadas) sobre el banco de `CNT-30` vuelta 4. **Las tablas de `CNT-30` §3, §4 y §5 pasan a ser historia**: este documento describe el banco como queda. De `CNT-30` siguen vigentes las reglas de §2 que `D-59` no toca (el cuerpo capaz, la seguridad, los dos ejes, la sintaxis que no delata el polo) y el §6 (cadenas de pantalla), salvo lo que dice el §10 de acá.
- **Consume:** `D-59` (entera, con su síntesis), `D-57` y sus siete enmiendas (sobre todo la 7: la luz), `BR-17`, `BR-36` y `BR-37`, `CNT-30` (el banco y por qué cada escena es como es), `INV-172` (`RES-172`..`RES-194`), `INV-150` (`RES-154`, `RES-156`, `RES-158`, `RES-160`, `RES-161`), `D-14`, `D-17`, `.claude/rules/voz-ricotera.md`, `.claude/rules/contenido-json.md`, `src/lib/dos-ejes/banco.test.ts` (las 24 pruebas, línea por línea) y `src/lib/voz.test.ts`.
- **Produce:** `src/data/dos-ejes.json` (schema v2 de `CTR-08`, sin claves nuevas): `EJ-029`..`EJ-058` reescritos con el mismo id (sin huecos, tres por celda, todos `listo` con `momento`), las cinco líneas que cantan, las cuatro bajadas, y `EJ-001`..`EJ-028` intactos y `retirado`. **IDs nuevos de este documento: ninguno** (los ítems se reescriben con su id, como permite `Docs/IDS.md` mientras no cambie lo que miden: cada uno sigue midiendo lo mismo en el mismo eje y el mismo momento).
- **No hago acá:** el schema, el motor, la isla, el taller de tarjetas ni `BR-38` (es de `producto`: no existía al escribir esto, así que apliqué la síntesis de `D-59` tal cual y las guardas de `banco.test.ts`; si `BR-38` dice otra cosa, manda `BR-38` y se vuelve acá).
- **Ficha `RES-XX` pendiente:** ninguna. Una escena del test no afirma nada de ningún recital real, así que no lleva ficha (`CTR-08.5` regla 5). Lo que sí hago es **decir de dónde salió cada textura**: casi todo es *leyenda* de `INV-172` (ninguna página se abrió) y la usé como escenario, nunca como dato.
- **No lo corrí** (`D-12`). Medí a mano cada texto contra las 24 pruebas de `banco.test.ts` (§8), contra las siete de `voz.test.ts` y contra el schema, y sobre el JSON ya escrito corrí con `Grep` los vetos por expresión regular (nada cae). El comando que lo corre de verdad está en el §10.

## 1. Qué pidió `D-59`, y cómo lo leí

El usuario pidió que la noche sea la ricotera de verdad: *"barro, sucio, drogas, reviente, y también familia, amigos, amor. Un choripán, un pancho, una birra, un porro, hasta cocaína debe ser parte del recital. La previa, ir un rato antes a escabiar o no."* Lo leí en cuatro frases:

1. **Lo sucio no es un adorno: "lo primero no puede faltar".** Cada uno de los cinco momentos lleva una parte sucia (el aire, la comida, el barro, lo que se toma o se fuma) y una parte tierna (los tuyos, un padre, una pareja, un amigo), en el mismo momento.
2. **Quien juega elige cómo se mueve, no si consume.** Lo sucio va en el **enunciado**, como la escena que ya está puesta. Las opciones son lo que haces vos adentro de esa escena, y **ninguna de las 60 nombra lo que se toma o se fuma**. Es la solución más simple a "lo que se toma o se fuma nunca de un solo lado" (la guarda de `banco.test.ts` da trivialmente) y es la que mejor le sirve al quinto lugar.
3. **La merca es paisaje.** Una mención, en un enunciado, en una lista de tres cosas del aire (§5).
4. **La banda y sus rituales entran a la escena, sus personas no.** Aparecen "los Redondos", "la misa", "el pogo", "los trapos" y "el pasacalle"; no aparece nadie por su nombre ni el escenario con alguien arriba (el Indio murió el 5 de junio de 2026).

Y lo que **no** cambia, aunque la escena sea otra: la noche en cinco momentos, los dos ejes, tres por celda, los cuatro nombres, que ninguna pregunta pida saber de la banda, que ninguna respuesta sea mejor que otra, y las tragedias, el cuerpo capaz y la seguridad afuera.

## 2. Qué cambia respecto de `CNT-30` y qué no

| | `CNT-30` (vuelta 4) | `CNT-31` |
|---|---|---|
| El recital | "un recital", sin dueño, sin banda, sin misa, sin pogo | el recital ricotero: Redondos, misa, pogo, trapos, pasacalle, caravana (solo en enunciados, líneas que cantan y bajadas) |
| Lo que se come y se toma | vetado de todo el banco (el test leía *vino*, *birra*…) | en el **enunciado**: fernet, birra, chori, pancho, porro. Nunca en una opción |
| La plata | ni puesto ni micro ni pancho en ninguna parte | el puesto, el micro y la combi **están en la escena**; ninguna opción compra, paga ni tiene entrada (`D-59` punto 4) |
| Los que no entraron | no existían (la noche era "la normal") | `EJ-043` y `EJ-045`/`EJ-046`: la reja, el charco y la fila (`RES-154`, `RES-176`) |
| La merca | vetada | una mención de paisaje en `EJ-049` |
| La familia y el amor | sin parentesco en ningún texto | **en el enunciado y de terceros** (una nena en los hombros de su viejo, una pareja bajo una campera). En una opción, ninguno (enmienda 7, y la guarda) |
| Los cinco lugares | cuatro | **cinco**: suma *el que no toma ni fuma* (§4) |
| Las opciones | 60, afinadas en cuatro vueltas | **57 de 60 iguales** (no tiré lo que costó cuatro vueltas); cambian `EJ-029` (las dos) y `EJ-030` (la A) |
| La luz con teléfono | cinco de quince | **cuatro de quince** (`031`, `036`, `042`, `055`) |

**Por qué casi no toqué las opciones.** `CNT-30` §2 y §4 explican, ítem por ítem, qué sacó cada vuelta (el parentesco, el «mío» del lado de luz, los auriculares, la distracción del que no mira, la excusa del caos, la firma por raíz). `D-59` dijo dónde va lo sucio —en el enunciado— y eso permite que el banco cambie de textura sin reabrir nada de lo que ya estaba cerrado. El riesgo de tocar una opción es el de siempre: **cada palabra nueva entra a una guarda por raíz que nadie corre a mano sin errar** (el `me` de oscuridad ya está tres veces). Con 57 de 60 iguales, lo que medí de nuevo es corto (§8).

## 3. La noche, momento por momento

Cada fila dice qué entró de `INV-172`, con su ficha. **Todo es *leyenda* de prensa sin abrir** (la previa, el puesto, el barro): sirve de escena, no de dato, y ninguna escena lo afirma como cosa que pasó.

### La previa — *Botella cortada, guitarra afinando, olor a yerba.*

- **Parte sucia:** el fernet que pasa en la botella cortada (`EJ-029`; `RES-173`, `RES-178`), la birra tibia en la plaza (`EJ-031`), la ropa que va a terminar con barro (`EJ-034`; `RES-177`, `RES-185`), las zapatillas viejas (`EJ-032`).
- **Parte tierna:** uno de los tuyos afinando una guitarra junto al fogón (`EJ-030`; `RES-172`), los que llegan tarde (`EJ-031`), el vecino de carpa que te grita (`EJ-033`; `RES-172`).
- **El ítem de "ir a escabiar o no":** `EJ-029`. La esquina, los tuyos y el fernet son la escena; las dos opciones son de la ronda (pasarlo y seguir charlando, o subir la música propia) y ninguna dice qué se toma. Es lo que `D-59` punto 2 describe como "sumarse a la ronda, que no obliga a tomar, o quedarse con lo propio".
- **La que canta cambió:** era *Campera puesta, llaves en el bolsillo.* Ahora son tres objetos de la previa: la botella cortada, la guitarra, la yerba. La botella cortada es lo primero que se lee en la primera hoja: es a propósito ("lo primero no puede faltar"), y es un objeto, no una escena de alguien tomando.

### La ida — *Ventanilla empañada y la ruta que se estira.*

- **Parte sucia:** el pancho frío en la parada de ruta (`EJ-037`; el pancho es vocabulario del puesto, `RES-173`: *sin respaldo, entra como palabra*), la caravana que avanza de a poco (`EJ-040`; `RES-174`, `RES-189`), los micros en fila bajo un cielo gris (`EJ-038`; `RES-160`).
- **Parte tierna:** la combi del barrio con un disco de los Redondos de fondo (`EJ-035`; `RES-174`, `RES-160`), el pasacalle sobre la ruta y la foto para quien querés (`EJ-036`; `RES-172`), el parlante que pasa de mano en mano (`EJ-039`).
- **Qué no entró:** el dedo (`RES-174`, `RES-189` lo dicen: es el veto de seguridad), las cifras de micros y los nombres de las agencias (los verificadores mandaron sacarlos), el viaje de 43 horas de Mauro (`RES-160`: testimonio, y una persona real).
- **La que canta cambió:** era *Ruido de fondo, el camino que se estira.* Conserva "el camino que se estira" (lo que ya funcionaba) y le pone la ventanilla empañada: el vidrio con el aliento de todos, física y barata. Sin vehículo con nombre.

### La vereda — *Pies en el barro y un parlante lejano.*

- **Parte sucia:** el humo del puesto de chori (`EJ-041`; `RES-173`, `RES-178`), el barro que ya se tragó una zapatilla (`EJ-045`; `RES-185`: Gualeguaychú 2014, leyenda), el frío que pela (`EJ-044`; `RES-184`, `RES-177`), la fila (`EJ-046`; `RES-176`).
- **Parte tierna y de los que no entraron:** los trapos atados a la reja por los que no entraron, uno por barrio (`EJ-043`; `RES-154`, `RES-156`, `RES-193`: *sin nombres reales*), la pareja que se tapa con una sola campera bajo la llovizna (`EJ-042`; `RES-191`, solo la forma).
- **Dos precauciones.** *El barro es de Gualeguaychú y no de Olavarría:* el enunciado no dice cuál, pero no usé "cementerio", ni terminal, ni lluvia de crónica (`RES-188` es un veto con fuente). Y *"siempre llueve"* no se dice nunca: `RES-187` es la ficha que protege de eso (el cielo gris de la ida no dice qué cae después).
- **La que canta cambió:** era *Baldosa fría y un parlante lejano.* La baldosa pasa a barro (la vereda de la noche ricotera ya no es baldosa) y el parlante lejano se queda: es lo que llega de adentro para el que no entró.

### Cuando suena — *Golpe en el pecho y todos cantan.*

- **Parte sucia:** el porro que gira de mano en mano (`EJ-048`; `RES-179`: lo único del consumo que nombra la crónica de color, según el buscador), el humo, la merca y el barro (`EJ-049`; §5), el pogo adelante y los parlantes que cansan el oído (`EJ-052`; `RES-158`), el sudor (`EJ-050`; `RES-187`).
- **Parte tierna:** alguien tuyo cantando con los ojos cerrados (`EJ-047`), una nena que canta en los hombros de su viejo (`EJ-051`; `RES-190`), los abrazos que se cuentan al otro día (`EJ-050`).
- **La que canta cambió:** era *Golpe en el pecho, primer acorde.* El golpe se queda y "primer acorde" se va (era técnico y apuntaba a un tema). Entra "todos cantan": el canto de todos, que `D-59` pide en la escena.

### La vuelta — *Zapatillas embarradas, llave en la puerta.*

- **Parte sucia:** la campera que huele a humo (`EJ-053`; `RES-176`), los pies helados de madrugada (`EJ-054`; `RES-184`), el cuerpo hecho pelota (`EJ-055`), la boca seca (`EJ-056`).
- **Parte tierna:** avisar que llegaste (`EJ-054`), el grupo que sigue despierto (`EJ-055`), la guitarra en la plaza otra vez (`EJ-057`; `RES-172`), la casa en silencio.
- **"Pegar la vuelta":** entra solo en `EJ-058`, en pasado y ya en casa (*Pegaste la vuelta: el parlante quedó prendido en casa*). La vuelta sigue sin trayecto: sus seis escenas pasan adentro de la casa (`CNT-30` §2, seguridad).
- **La que canta cambió:** era *Frío en las manos, llave en la puerta.* La llave se queda (cierra el círculo con la casa de la previa) y entran las zapatillas embarradas, el objeto que `D-59` pidió.

## 4. El quinto lugar: *el que no toma ni fuma*

`D-59` suma un quinto lugar a la prueba de `BR-36` (nunca fui · sin plata · silla de ruedas · volviendo de noche sin compañía): **¿puede elegir cualquiera de las dos opciones, de verdad y sin sentirse el que no pertenece, alguien que no toma ni fuma —por salud, por los hijos, porque dejó—?** Lo vigila `banco.test.ts` (que lo que se toma o se fuma no separe los polos) y lo lee `REV-20`.

**Cómo lo resolví.**

1. **Lo que se toma o se fuma vive en el enunciado y nunca en una opción.** Aparece en cuatro enunciados —`EJ-029` (el fernet), `EJ-031` (la birra tibia y la yerba), `EJ-048` (el porro) y `EJ-049` (la merca)— y en ninguna de las 60 opciones. Lo comprobé con `Grep` sobre el JSON con la lista de `CONSUMO` del test: ninguna opción cae.
2. **Lo sucio de un enunciado es paisaje de al lado, no una pregunta que las opciones esquiven.** En `EJ-031` el aire huele a birra y las opciones son escribirle a una amiga o tararear: el que toma y el que no eligen igual. En `EJ-048` el porro gira y las dos opciones miran a otro lado (aplaudir, marcar el compás). Una opción que contestara a la botella ("Se la paso al de al lado") deja a la otra como "la del que no": por eso el único ítem donde las opciones tocan la ronda (`EJ-029`) las hace **de la ronda y no del consumo**: pasarla, que no obliga a tomar, o poner la música propia.
3. **Lo que no se toma entra al banco como cosa de la escena, no como la manera de no tomar.** El mate (en una bajada), la yerba (en un enunciado), el agua y el té (en opciones de la vuelta) están, pero **ninguno es la alternativa a la birra**: no puse una opción "me cebo un mate" frente a otra que bebe, porque eso nombra al que no toma como una manera de ser (y lo marca). La yerba entra como olor de la plaza; el agua, en la vuelta, como lo que le pide la boca seca a quien tomó y a quien no.
4. **Cada ítem, en su `notaInterna`, lleva el veredicto del quinto lugar** con la razón, igual que los otros cuatro.

**Lo que no resolví con reglas y le dejo a `REV-20`:** `EJ-029` A (*Lo paso y sigo charlando*) pide tocar la botella para pasarla. Para quien no toma se puede pasar una botella sin tomar, pero alguien puede leerla como "la del que toma". Si `REV-20` la lee así, la salida es sacar el consumo del enunciado y dejar la ronda con la música (la guitarra de `EJ-030`), a costa de que `EJ-029` pierda el fernet.

## 5. La merca

**Una sola mención, en `EJ-049`:** *Entre humo, merca y barro, entran los instrumentos de golpe. ¿Qué te sale?*

- **Por qué ahí y no en otro lado.** `D-59` punto 3 dice "paisaje, nunca elección", y el lugar donde el reviente pesa más es cuando entra el volumen. Las dos opciones (*Grito con el resto* / *Me retumba en la panza*) son del cuerpo y de la sala; ninguna toca ni se acerca a la merca.
- **Cómo está dicha.** En una lista de tres cosas del aire, seca, sin adjetivo, sin verbo propio y sin persona: no dice quién la usa, ni qué pasa después, ni que sea buena o mala. Es la misma forma que el humo y el barro. Es lo que `D-59` pide ("sin glamour ni sermón") y lo que la voz del sitio permite (registro 2 contado seco; sin épica, sin psicodelia).
- **Qué respaldo tiene.** `INV-172` lo dijo claro: *la cocaína no aparece en ninguna crónica de color como escena; está en la policial y en lecturas de fans* (`RES-179`, `RES-181`). **Rótulo: leyenda.** Se usa igual (`D-14`), como el aire de la escena del test y no como un hecho sobre ningún recital real. No lleva ficha porque no afirma nada.
- **Qué descarté.** *Una raya en el baño*, *alguien se manda una*, *el que vende en la puerta* (cada una pone una persona haciendo algo: una escena que las opciones esquivan o contestan, y de las dos sale la merca como elección); *un papel de merca* (glamour de la cosa); y la mención en cualquier opción (`VETOS_DE_LAS_OPCIONES` ya la veta). La palabra elegida es *merca* y no *cocaína* ni *falopa*: es la que usa la gente en la previa; *cocaína* suena a parte policial y *falopa* es la palabra que `RES-180` pone en boca del Indio (y una palabra suya no se usa sin ficha). Ojo con un parecido: *Monona blues (Merca para vender)* está en cuarentena (`RES-181`, `D-13`) y no es evidencia de nada; el enunciado no lo cita ni lo evoca (ninguna canción se nombra).
- **La pregunta que le queda a `REV-20`:** ¿una lista de tres con la merca en el medio se lee como paisaje o como guiño? Si se lee como guiño, la salida es sacarla del medio de la lista (*Entre humo, barro y merca*) o cambiar de lista, no sacarla.

## 6. Los treinta ítems

`L` = `luz-oscuridad` (A = `luz`, B = `oscuridad`). `O` = `orden-caos` (A = `orden`, B = `caos`). En el archivo las opciones van siempre en ese orden; el motor las baraja. **Todos dan ✓ en los cinco lugares**, con la razón en su `notaInterna`. "Igual" = la opción es la de `CNT-30` vuelta 4, sin tocar. Las fichas son todas leyenda (§3).

### La previa

| Id | Eje | Enunciado | A | B | Qué cambió | Lo sucio / lo tierno (ficha) |
|---|---|---|---|---|---|---|
| `EJ-029` | L | En la esquina, los tuyos pasan el fernet en una botella cortada. | Lo paso y sigo charlando | Subo mi música | Enunciado y las dos opciones. Era *Alguien tuyo te manda un tema.* / *Le contesto con otro* / *Lo escucho bien fuerte*: pasa de luz con teléfono a luz sin teléfono | fernet y botella cortada · los tuyos (`RES-173`, `RES-178`, `RES-172`) |
| `EJ-030` | L | Uno de los tuyos afina una guitarra junto al fogón. | Me arrimo y canto | Tamborileo en la rodilla | Enunciado y la A. Era *Suena música mientras te preparás.* / *La subo para compartirla* | guitarra y fogón · uno de los tuyos (`RES-172`, `RES-161`) |
| `EJ-031` | L | La plaza huele a birra tibia y a yerba. Faltan los que llegan tarde. | Le escribo a una amiga | Tarareo un tema | Enunciado. Opciones iguales. Era *Falta un rato para salir.* | birra tibia y yerba · los que llegan tarde (`RES-173`, `RES-178`, `RES-172`) |
| `EJ-032` | O | Zapatillas viejas, campera y una bolsa para el recital. ¿Cuándo las juntás? | Las dejo juntas desde antes | Las agarro al vuelo | Enunciado. Opciones iguales. Era *Hay cosas para llevar al recital.* | zapatillas viejas (el barro sin nombrarlo) (`RES-177`, `RES-185`) |
| `EJ-033` | O | Desde la carpa de al lado te gritan: ¿cuándo salís? | Le doy el dato justo | Le digo: en un rato | Enunciado. Opciones iguales. Era *Alguien te pregunta cuándo salís.* | la carpa del acampe · el vecino que grita (`RES-172`) |
| `EJ-034` | O | Te vestís para el recital. La ropa va a terminar con barro. | Sé qué me pongo | Me visto según el humor | Enunciado. Opciones iguales | el barro como certeza de la noche (`RES-177`, `RES-185`) |

### La ida

| Id | Eje | Enunciado | A | B | Qué cambió | Lo sucio / lo tierno (ficha) |
|---|---|---|---|---|---|---|
| `EJ-035` | L | En la combi suena un disco de los Redondos. El camino es largo. | Hablo con los míos | Tarareo una que me gusta | Enunciado. Opciones iguales. Era *El camino se hace largo. ¿Cómo lo llevás?* | combi del barrio · la banda como paisaje (`RES-174`, `RES-160`) |
| `EJ-036` | L | Un pasacalle gigante cuelga sobre la ruta. Sacás una foto. | La mando a quien quiero | Le encuentro un detalle | Enunciado. Opciones iguales. Era *Sacás una foto camino al recital.* | pasacalle sobre la ruta · la foto a quien querés (`RES-172`) |
| `EJ-037` | L | En la parada de ruta, un pancho frío. Se te viene un tema. | Se lo tarareo a alguien | Lo busco y lo escucho | Enunciado. Opciones iguales. Era *Te acordás de un tema.* | pancho frío y parada de ruta (`RES-174`, `RES-173`) |
| `EJ-038` | O | Los micros hacen fila y el cielo se pone gris. | Llevo algo por si llueve | Si llueve, llueve | Enunciado. Opciones iguales. Era *Hay nubes en el cielo.* | micros en fila (`RES-160`, `RES-174`, `RES-187`) |
| `EJ-039` | O | Te pasan el parlante y la ruta sigue. | Elijo la música con calma | Pongo una sin mirar | Enunciado. Opciones iguales. Era *Vas a escuchar música en el camino.* | el parlante que pasa (`RES-174`, `RES-160`) |
| `EJ-040` | O | La caravana avanza de a poco. Falta para llegar. | Lo parto en tramos | Me dejo llevar | Enunciado. Opciones iguales. Era *Falta para llegar al recital.* | la caravana (`RES-174`, `RES-189`) |

### La vereda

| Id | Eje | Enunciado | A | B | Qué cambió | Lo sucio / lo tierno (ficha) |
|---|---|---|---|---|---|---|
| `EJ-041` | L | Del puesto de chori sube humo y se oye la prueba de sonido. | Comento cómo me suena | Le busco el ritmo | Enunciado. Opciones iguales. Era *Se oye la prueba de sonido.* | el puesto y el humo del chori (`RES-173`, `RES-178`, `RES-161`) |
| `EJ-042` | L | Cae una llovizna fina y una pareja se tapa con una campera. | Aviso a un amigo: llueve | Miro llover contra el farol | Enunciado. Opciones iguales. Era *Cae una llovizna fina.* | la pareja de terceros (`RES-191`, solo la forma) |
| `EJ-043` | L | Los que no entraron atan trapos en la reja, uno por barrio. | Los comento con los míos | Elijo mi favorito | Enunciado (de afiches a trapos). Opciones iguales | los que no entraron · los trapos (`RES-154`, `RES-156`, `RES-193`) |
| `EJ-044` | O | Frío que pela en la vereda. Tenés la campera y después puede dar calor. | Me abrigo en capas | Me la saco al rato | Enunciado. Opciones iguales | frío de vereda (`RES-184`, `RES-177`) |
| `EJ-045` | O | El barro ya se tragó una zapatilla y las puertas siguen cerradas. | Saco el mazo de cartas | Armo un barquito de papel | Enunciado. Opciones iguales. Era *Todavía no empieza el recital.* | el charco y la zapatilla (`RES-185`) |
| `EJ-046` | O | Corre la voz en la fila: la misa empieza más tarde. | Lo tenía previsto | Lo tomo como viene | Enunciado. Opciones iguales. Era *Dicen que el recital empieza más tarde.* | la fila · "la misa" como paisaje (`RES-176`) |

### Cuando suena (`adentro`)

| Id | Eje | Enunciado | A | B | Qué cambió | Lo sucio / lo tierno (ficha) |
|---|---|---|---|---|---|---|
| `EJ-047` | L | Suena una canción lenta. Alguien tuyo la canta con los ojos cerrados. | Escucho cómo la canta | Muevo la cabeza despacio | Enunciado. Opciones iguales. Era *…Alguien tuyo la sabe.* | alguien tuyo con los ojos cerrados (`RES-190`, `RES-191`, solo la forma) |
| `EJ-048` | L | Entre tema y tema, un porro gira de mano en mano. | Aplaudo con el resto | Marco el compás | Enunciado. Opciones iguales. Era *Cambian un instrumento entre tema y tema.* | el porro que gira (`RES-179`) |
| `EJ-049` | L | Entre humo, merca y barro, entran los instrumentos de golpe. ¿Qué te sale? | Grito con el resto | Me retumba en la panza | Enunciado. Opciones iguales. Era *Entran todos los instrumentos de golpe.* | humo, merca y barro: el reviente (`RES-179`, `RES-181`, §5) |
| `EJ-050` | O | Mañana te preguntan cómo estuvo: el coro, el sudor, los abrazos. | Elijo qué voy a contar | Lo cuento de una | Enunciado. Opciones iguales. Era *Te van a preguntar cómo estuvo el recital.* | el sudor y los abrazos (`RES-187`) |
| `EJ-051` | O | En los hombros de su viejo, una nena canta. La canción se te pega. | Me la grabo cantándola | La dejo dar vueltas | Enunciado. Opciones iguales. Era *Una canción se te queda en la cabeza.* | padre e hija, de terceros (`RES-190`) |
| `EJ-052` | O | Adelante hay pogo y los parlantes cansan los oídos. | Traje algodón por las dudas | Me tapo con los dedos | Enunciado. Opciones iguales. Era *El volumen cansa los oídos.* | el pogo adelante (`RES-158`) |

### La vuelta

| Id | Eje | Enunciado | A | B | Qué cambió | Lo sucio / lo tierno (ficha) |
|---|---|---|---|---|---|---|
| `EJ-053` | L | La campera huele a humo y todavía te dura la noche. | Se lo cuento a alguien | Me quedo con la noche | Enunciado. Opciones iguales. Era *Ya en casa, todavía te dura la noche.* | la campera con humo (`RES-176`) |
| `EJ-054` | L | Llegás de madrugada con los pies helados. La casa está en silencio. | Aviso que llegué | Preparo un té | Enunciado. Opciones iguales. Era *Llegás y la casa está en silencio.* | los pies helados, la madrugada (`RES-184`) |
| `EJ-055` | L | Tenés el cuerpo hecho pelota y no te da sueño. | Escribo en el grupo | Dibujo en un papel | Enunciado. Opciones iguales. Era *Es tarde y no te da sueño.* | el cuerpo hecho pelota |
| `EJ-056` | O | Tenés la boca seca y se acerca la hora de dormir. | Dejo un vaso de agua | Me levanto si hace falta | Enunciado. Opciones iguales. Era *Se acerca la hora de dormir.* | la boca seca (`RES-187`) |
| `EJ-057` | O | Te proponen otra noche de guitarra en la plaza. | Propongo un día | Acepto, con el día abierto | Enunciado. Opciones iguales. Era *Te proponen juntarse a escuchar música otro día.* | la previa otra vez, gratis (`RES-172`) |
| `EJ-058` | O | Pegaste la vuelta: el parlante quedó prendido en casa. | Lo conecto al cargador | Lo apago nomás | Enunciado. Opciones iguales. Era *Quedó el parlante prendido en casa.* | "pegar la vuelta", ya en casa (`RES-174`) |

### Los cruces

Los nueve pares de cada momento, en los dos órdenes, los volví a leer en voz alta (el motor sortea un ítem de cada eje por momento y los dos órdenes salen). Dos que conviene que `REV-20` mire:

- **La ida:** `EJ-035` (suena un disco de los Redondos) y `EJ-039` (te pasan el parlante): son dos músicas en la misma combi. Se leen como "terminó el disco, ahora te toca a vos", y ninguna opción nombra un tema, pero es el cruce más flojo del banco.
- **La vuelta:** `EJ-054` (la casa en silencio) y `EJ-058` (el parlante quedó prendido): conviven si el parlante está prendido sin sonar (la luz fija). No es contradicción, pero se nota.

## 7. Las cuatro maneras

Los **nombres no se tocan** (`D-57` punto 5; `CNT-30` §5): *Mesa larga a las nueve*, *Ronda en cualquier esquina*, *Radio bajita, misma hora*, *Mochila liviana, sin mapa*. Cambian las bajadas, **con la misma forma** (un placer y un costo de `orden-caos` que paga quien juega: *Pero cuando alguien… a vos te toca…*). Cada una gana un objeto ricotera, y **ninguna nombra lo que se toma o se fuma**: la manera es lo que le queda a quien juega, y sería decirle que es "el de la birra" o "el que no".

| Id | Era | Queda | Qué ganó |
|---|---|---|---|
| `CU-1` | *Hay una hora, un lugar y gente que te espera: la noche empieza sabiendo adónde va. Pero cuando alguien cambia la hora, a vos te toca rearmar la mesa.* | *Hay una hora, un lugar, un chori en la parrilla y gente que te espera: la noche ya sabe adónde va. Pero cuando alguien cambia la hora, a vos te toca rearmar la mesa.* | el chori en la parrilla (la mesa larga con comida) |
| `CU-2` | *…una charla, un mate, otra canción…* | *Te sumás a lo que aparece —una guitarra, un mate, otra canción— y la noche toma forma. Pero cuando alguien pregunta adónde siguen, a vos te toca elegir ahí mismo.* | la guitarra en lugar de la charla (el mate ya estaba) |
| `CU-3` | *Te cosés la noche a medida, puntada por puntada, con el hilo de una canción. …* | *Te cosés la noche a medida, puntada por puntada, con un disco y el termo de siempre. Pero cuando alguien adelanta la salida, a vos te toca mover lo que venía después.* | el disco y el termo (la radio y el mate propios) |
| `CU-4` | *Con las manos libres, un cambio te abre otro y cada uno te alegra. …* | *Con las zapatillas que ya vieron barro, un cambio te abre otro y cada uno te alegra. Pero cuando alguien quiere saber el rumbo, a vos te toca averiguarlo en el celular.* | las zapatillas que ya vieron barro (la mochila liviana que no teme ensuciarse) |

- **Largo:** 34, 31, 33 y 32 palabras (techo 36); entre 162 y 167 caracteres (techo 180 del encargo, 240 del schema; el techo de las más largas que ya pasaron el taller fue 169).
- **Sin género:** ninguna dice *solo/sola* ni participio que concuerde con quien juega.
- **Sin eco con las opciones:** comparé cada palabra de más de tres letras de las cuatro bajadas con las 60 opciones. Ninguna se repite (las únicas comunes a las cuatro son las de la forma: *alguien*, *cuando*, *noche*, *toca*).
- **El orgullo:** tapados los nombres, los cuatro placeres son placeres y los cuatro costos son un roce chico que paga quien juega. El barro y las zapatillas de `CU-4` son lo que más cerca queda del barro de `D-59` y no hablan de ninguna crónica.

## 8. Medición a mano contra `banco.test.ts`

Sobre el JSON ya escrito. Lo que dice "Grep" lo corrí con expresiones regulares copiadas de las listas del test.

| # | Prueba | Resultado |
|---|---|---|
| 1 | cinco momentos, en orden, `preguntasPorEje` = 5 | ✓ ids `previa`, `ida`, `vereda`, `adentro`, `vuelta`; 5 por eje |
| 2 | sello ≤ 3 palabras, canta ≤ 8, sin `…` | ✓ sellos intactos; cantas de 7, 8, 8, 7 y 6 palabras |
| 3 | todo ítem `listo` con momento | ✓ 30 de 30 |
| 4 | tres por celda y ≥ 30 | ✓ 10 celdas × 3 |
| 5 | ids sin repetir, `EJ-001`..`EJ-028` `retirado` | ✓ intactos |
| 6 | enunciado ≤ 14 palabras, opción ≤ 5 palabras y ≤ 28 caracteres | ✓ el enunciado más largo mide 14 palabras (`031`, `044`, `051`) y 74 caracteres; la opción más larga mide 5 palabras y 27 caracteres (`032`, `042`, `052`) |
| 7 | nombre ≤ 26 caracteres, bajada ≤ 36 palabras | ✓ |
| 8 | cada `CU-n` conserva sus polos | ✓ sin tocar |
| 9 | nombres sin persona | ✓ sin tocar |
| 10 | vetos de la noche en enunciado y opciones | ✓ Grep: nada |
| 11 | los mismos vetos en sellos, cantas y bajadas | ✓ Grep: nada (ni *cana*, ni *fuego*, ni *indio*) |
| 12 | vetos de las opciones (plata, vehículo, cuerpo, banda, merca) | ✓ Grep: nada. *Redondos*, *misa*, *pogo* y *merca* solo están en enunciados |
| 13 | lo que se toma o se fuma nunca separa los polos | ✓ 0 de 60 opciones nombran consumo |
| 14 | la guarda del consumo sabe ver | ✓ es del test |
| 15 | sin parentesco ni pareja propia en una opción | ✓ Grep: nada; *su viejo* y *una pareja* están en enunciados y son de terceros |
| 16 | la vuelta sin *a pie*, *caminando*, *camino* | ✓ Grep: nada en los seis ítems de la vuelta |
| 17 | ninguna opción delata su eje | ✓ Grep: nada. Ningún enunciado dice *luz*, *oscur\**, *orden\**, *caos* |
| 18 | ninguna opción dice la traducción de su polo | ✓ Grep: ni *gente*, ni *propio*, ni *plan*, ni *sobre*, ni *marcha* |
| 19 | ninguna palabra es la firma de un polo | ✓ a mano (abajo) |
| 20 | la firma sabe ver | ✓ es del test |
| 21 | sin género en primera persona | ✓ Grep: nada en opciones ni en bajadas |
| 22 | los enunciados no cierran todos igual | ✓ tres preguntas, las tres distintas (`032`: ¿cuándo las juntás?, `033`: ¿cuándo salís?, `049`: ¿qué te sale?); *¿Qué hacés?* no aparece |
| 23 | las dos opciones no son la misma frase | ✓ |
| 24 | ninguna opción apunta al nombre de una manera | ✓ comparé las 60 opciones con las 13 palabras de los nombres, los extras (*rincón, hora, horario, libro*) y las palabras de las cuatro bajadas nuevas; Grep: nada en los ítems nuevos |

**La firma de un polo (19), solo lo que cambió.** Las otras 57 opciones son las de `CNT-30` vuelta 4, que pasaron la prueba entera (121 de 121). Las tres nuevas son `029` A *Lo paso y sigo charlando* (`paso`, `sigo`, `charl`), `029` B *Subo mi música* (`subo`, `mi`, `music`) y `030` A *Me arrimo y canto* (`me`, `arrim`, `canto`). Las raíces `paso`, `sigo`, `charl`, `subo`, `music`, `arrim` y `canto` no aparecen en ninguna otra opción del eje. Lo que sí se mueve: **`me` pasa a dos en luz** (`030`, `041`) y sigue en tres en oscuridad (`035`, `049`, `053`), que es lo que lo deja pasar; **`mi` pasa a dos en oscuridad** (`029`, `043`) y cero en luz (`mios` es otra raíz). Ningún polo tiene una raíz en tres opciones con cero enfrente.

## 9. Lo que descarté, para que no vuelva

- **Una opción que contesta a la botella** (*Se la paso al de al lado*, *Me sirvo*, *Convido de mi botella*): deja a la otra como "la del que no". El único ítem donde las opciones tocan la ronda (`EJ-029`) las hace de la ronda, no de lo que se toma.
- **Una opción con mate frente a un enunciado con birra**: el mate pasa a ser "la del que no toma". El mate está en la escena y en `CU-2`; no es la alternativa a nada.
- **`ronda` y `esquina` en una opción**: son palabras de un nombre (*Ronda en cualquier esquina*) y la guarda las lee. Por eso *sumarse a la ronda*, que usa `D-59`, se dice *Lo paso y sigo charlando* o *Me arrimo y canto*.
- **El porro, el fernet o la birra pasados en una opción** (*Le paso el porro al de al lado*): la guarda no lo prohíbe si las dos opciones nombran consumo, pero entonces las dos son de quien consume. Preferí lo que pide el encargo: opciones que el que no toma puede elegir.
- **Una raya en el baño, alguien que vende, un papel de merca** (§5).
- **«Caña» y «gorra»**: el test saca tildes y la ñ, así que *caña* (la bebida) cae en el veto de la policía (*cana*), y *gorra* también. Quedan afuera de todo el banco.
- **El control de ruta y el dedo** en la ida (`RES-174`): policía y seguridad. **La conferencia de prensa, las bengalas, los detenidos, la valla** (`RES-176`, `RES-183`): registro 3.
- **El cementerio de zapatillas, la terminal, la lluvia del sábado** (`RES-188`): son de las crónicas vedadas; la zapatilla que se traga el charco es de `RES-185`.
- **Nombres propios** (Mauro, Sebastián y Tiziano, Claudia Canelo, Romina y Rafael, Hugo Andino): ninguna escena lleva un nombre. `RES-175` cayó como testimonio y `RES-190`/`RES-191` son leyenda sin apellido: sirven la forma, no la persona.
- **El 5 de junio** (`RES-192`, `RES-194`): ninguna escena, ni la plaza, ni los banderazos, ni el dolor de padres e hijos. La nena de `EJ-051` canta y no se despide.
- **El "ricotero" en una opción, "la misa" en una opción, "los Redondos" en una opción** (`VETOS_DE_LAS_OPCIONES`: puntúan quién es más de adentro).
- **`con lo que no te importe ensuciar`** en `EJ-034`: afirmaba la conducta de orden en el enunciado.
- **La botella cortada como escena de alguien que la toma** (*Alguien se sirve de la botella cortada*): una persona haciendo algo con la bebida; la botella en la canta es un objeto.
- **El pogo como acción** (`RES-158`: *meterse*, *saltar*): el pogo suena adelante y nadie elige meterse (`D-59` punto 6).

## 10. Para `REV-20` y para el hilo principal

**Lo que le pido a `revisor`, en este orden** (todo lo que ninguna máquina ve):

1. **El quinto lugar, ítem por ítem** (`notaInterna`): ¿alguna opción la elige peor el que no toma ni fuma? Mirá primero `EJ-029` A (§4) y `EJ-048` (el porro gira y las dos miran a otro lado).
2. **`EJ-049`, la merca** (§5): ¿paisaje o guiño? ¿La lista de tres es seca?
3. **La noche, ¿suena ricotera?** Es la pregunta del usuario. Las cinco líneas que cantan y los treinta enunciados, leídos de corrido, sin los títulos.
4. **Los que no entraron** (`EJ-043`, `EJ-045`, `EJ-046`): ¿se lee como lástima o como la escena?
5. **La banda en el enunciado** (`EJ-035`, *un disco de los Redondos*; `EJ-046`, *la misa*; `EJ-052`, *pogo*): ¿alguna pide saber algo? ¿Alguna opción queda "más de adentro" por lo que dice el enunciado?
6. **La ternura** (`EJ-047`, `EJ-051`, `EJ-042`): ¿suena a homenaje a cuatro meses del 5 de junio? `EJ-047` es la que más se acerca (una canción lenta, alguien con los ojos cerrados).
7. **El teléfono:** cuatro firmes (`031`, `036`, `042`, `055`) y tres que se pueden hacer por mensaje (`041`, `053`, `054`): siete como máximo, igual que antes. Tope de la enmienda 7: un tercio, cinco de quince.
8. **Los dos cruces flojos** (§6, "Los cruces").
9. **Las repeticiones.** El barro está en `034`, `045` y `049` y en la canta de la vereda, y en `CU-4`; el humo en `041`, `049` y `053`; las zapatillas en `032`, `045`, la canta de la vuelta y `CU-4`. Es un estribillo a propósito, no un descuido; si cansa, `REV-20` dice cuál se va.

**Lo que le dejo al hilo principal.** Todo está en `Docs/SUGERENCIAS/CNT-para-hilo-principal-noche-ricotera.md`, con la tabla *Dónde | Hoy | Pasa a*. En una línea: **regenerar las tarjetas** (cambiaron las cuatro bajadas) y, si querés, dos cadenas del sitio (`LUGARES.dosEjes` y la bajada del casete). Nada de eso es de este documento ni bloquea el banco.

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

`tarjetas.test.ts` va a fallar hasta que se regeneren las tarjetas, y no es un defecto del contenido: `huellaDelTaller()` entra con las bajadas, y esta vuelta cambió las cuatro. Hay un riesgo concreto del taller: las bajadas miden hasta 167 caracteres y el taller falla fuerte si una ocupa más de cinco renglones (las de antes llegaban a 160, y la más larga que ya pasó fue de 169).
