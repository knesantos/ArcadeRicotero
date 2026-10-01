# CNT-26 — Las puertas que faltaban

- **Rol dueño:** `contenido`
- **Fecha:** 2026-10-01
- **Estado:** entrega completa. Cierra el pedido del hilo principal del 2026-10-01 (integrar lo
  que estaba terminado y escondido). **Reabre `CNT-13`** y lo cierra de nuevo (apartado 8 de
  ese documento).
- **Consume:** `CLAUDE.md`, `.claude/rules/voz-ricotera.md` (§3.3, §3.4, §4.1, §4.2, §4.3, §4.6,
  §5, §8), `CNT-13` (el método de los renglones), `CNT-19` (el casete de Skayboy), `CNT-25`
  (los modelos de `desafio` y `paraCompartir` de "Más o menos"), `CNT-09` (los cuatro
  cuadrantes), `UX-06` (§2 la entrada, §3 qué no se muestra, §5 el disco, §6 la comparación),
  `PRD-alcance-v1.md` (`US-06`, `BR-17`, `BR-01`), `src/lib/desafio.ts` (`ADR-02`),
  `src/lib/voz.test.ts`, `src/pages/index.astro` (`primeraOracion`), `src/lib/sitio/copy.ts`,
  los `copy.ts` de `tema`, `tapa`, `letra`, `dos-ejes`, `skayboy`, `por-la-letra`, `mas-o-menos` y
  `quiz`, las cuatro islas que leen el desafío (`partida-tema|tapa|letra|dos-ejes.ts`) y
  `src/data/dos-ejes.json`.
- **Resuelve:** la puerta de `dos-ejes` (`Docs/SUGERENCIAS/CNT-para-hilo-principal-puerta-dos-ejes.md`),
  el compartir de tres juegos, el desafío de "Adiviná el tema" y el casete de Skayboy.

## 0. Qué encontré al llegar, y cómo se lee esta nota

El hilo principal ya había pegado una **versión provisional** de casi todo, marcada con
`CNT-26` en los comentarios, para poder cablear las islas sin esperar. Las cuatro islas ya
leen el desafío y dos ya mandan el texto. **Esta nota es la versión que vale.** Cada fila de la
tabla del §5 dice si **confirma** o **cambia** lo que hay hoy en el código, y los apartados 1 a
4 dicen por qué.

Tres cosas que no estaban a la vista y pesan en las decisiones:

1. **El portal imprime solo la primera oración de cada bajada** (`primeraOracion()` en
   `index.astro`, `UX-25` §2.4). Lo que el que llega lee de un casete es título, esa oración y el
   sello de acción. Lo que viene después de ese primer punto existe en `copy.ts` y no se ve.
2. **Las cuatro islas pisan `#subtitulo` con la línea del desafío.** En "Adiviná la tapa" y en
   dos ejes el subtítulo que se pisa **es** el que tranquiliza ("Arranca fácil…", "no de cuánto
   sabés"). Por eso esas dos líneas de desafío llevan la tranquilidad adentro: no dependen de
   cómo se cablee.
3. **Todo desafío es lo que cuenta el amigo, no un hecho** (`ADR-02`, `desafio.ts`: cualquiera
   edita la URL). La primera oración de cada uno lo dice así (*"dice que…"*, *"Te desafiaron
   con…"*, *"le salió…"*) y es registro 3: seca, dice qué se afirma y se calla. La que sigue canta
   (o, en dos ejes, nombra: ver §2.3).

## 1. La puerta de `dos-ejes`

### 1.1 `LUGARES.dosEjes` — cambia

> **`Una vela te alumbra media cara.`** (6 palabras)

Se queda la vela, que es la del recorte (`/arte/luzbelito-vela.png`) y la de *Luzbelito*. Cambia el
marco. Lo provisional (*"Tenés una vela prendida en la mano."*) repite la parte del cuerpo y la
estructura de `masOMenos` (*"Tenés una ficha boca abajo en la mano."*), y sería el quinto renglón
que arranca con "Tenés" (ya lo hacen tapa, cancionero, redondopedia y masOMenos). El pedido era
no repetir imagen.

Los diez renglones que había usan: puerta y cintas, moneda y ranura, aguja y surco, papel y
bolsillo, diente y sonrisa, tinta y dedos, guitarra y piernas, archivo y piso, pila de discos,
ficha y mano. Una vela que alumbra media cara no está en ninguno.

El método de `CNT-13` §2, punto por punto:

- **≤ 8 palabras:** 6. **Segunda persona:** `te`. **Imagen física y barata:** una vela, una cara.
- **No repite palabra del título** (*qué, tipo, ricotero, sos*), ni del subtítulo (*preguntas,
  cómo, sabés, elegís*), ni de la bajada del casete (*examen, vos, puntaje, banda*).
- **No explica.** No dice test, ni diez, ni cuadrante.
- **Sin jerga forzada, sin suspensivos, sin intruso** (la decisión de `CNT-13` §2 se mantiene).
- **Propio de este juego, y es lo que más cuidé:** no inclina. No dice *luz*, *oscuridad*, *orden* ni
  *caos*, ni nombra uno de los cuatro cuadrantes, y media cara alumbrada es mitad y mitad:
  ninguna punta sale con signo de más antes de la primera pregunta (`BR-17`).

**Descartes.**

- *"Se te apaga la vela sin avisar."* El apagón es una pérdida: le pone signo malo al polo
  oscuridad antes de que el jugador conteste nada (`BR-17`). Y "sin avisar" es textual la bajada de
  `CU-4`, *Eclipse repentino* (*"…sin agenda y sin avisar"*).
- *"Tenés una vela y ningún espejo."* El espejo es la imagen de fábrica de cualquier test de
  personalidad: la que aparece en todos los sitios. Es la corrida anti-slop aplicada al texto.
- *"Te mirás las manos como si fueran de otro."* Buena, y mide 9 palabras.

**La prueba (`CNT-13` §5).** Tapado el renglón queda el `h1` *¿Qué tipo de ricotero sos?*, el
subtítulo y el botón *Empezá*. El que llegó por un enlace sabe qué es y qué tocar. Pasa. Es
atmósfera pura, como los otros diez.

### 1.2 La bajada del casete — cambia

> **`Nadie te toma examen. Diez preguntas sobre vos, sin puntaje y sin saber nada de la banda.`**

Lo provisional era *"No hace falta saber nada de la banda. Diez preguntas de cómo sos, sin
puntaje: te dice de qué lado del rombo caés."* Tiene dos defectos:

1. **La primera oración mide exactamente 8 palabras y es registro 3.** Pasa `voz.test.ts` por una
   palabra, pero es justo la única línea del casete que el portal imprime, y informa en vez de
   cantar: gasta el techo entero para decir una negación. Los demás casetes cantan ahí.
2. **Nombra el "rombo"**, que es el plano de la pantalla de resultado (`UX-06` §4). Para quien
   todavía no jugó, la palabra no tiene referente. Es el tipo de palabra que cierra un molinete.

La nueva abre en cuatro palabras y carga las dos cosas que el encargo pide dejar claras. *Nadie te
toma examen* dice que no hay puntaje y que no hace falta saber nada, con la voz de acá: segunda
persona (`te`), rioplatense (*tomar examen* es de aula argentina) y rodea en vez de definir
(`voz-ricotera.md` §3.2). La segunda oración **nombra** y es literal: diez preguntas, sobre vos,
sin puntaje, sin saber nada de la banda.

**La prueba de las dos líneas.** Tapada *"Nadie te toma examen."* queda el título
*¿Qué tipo de ricotero sos?* y el sello *EMPEZÁ*: el que llegó sin idea sabe que es una pregunta
sobre uno mismo y qué botón tocar. Pasa. Y la línea que canta suma el molinete sin ser la única
que lo sostiene: la pantalla del juego lo repite en el subtítulo (*"no de cuánto sabés"*) y,
cuando se llega por un desafío, en la línea del §2.3.

**Una admisión.** Es la línea del conjunto con menos imagen: *examen* es lo único con cuerpo de
objeto, y registro 1 pide una imagen física. Lo acepto a conciencia porque en este casete la
primera oración es **toda** la tranquilidad que se imprime, y tiene que decirla de frente.

**Descartes.** *"Entrá con las manos vacías."*: mejor imagen, pero abre con "Entrá", que es el
arranque de `PORTAL.bajada` en la misma pantalla (el mismo descarte que `CNT-13` §4 le hizo al
portal), y no dice que no hay puntaje. *"No hace falta saber nada."*: es la provisional, achicada;
informa, no canta.

### 1.3 La acción — confirma `EMPEZÁ`

`UX-06` §2 lo fija a propósito: un verbo distinto de `JUGÁ` para que el que ya conoce el sitio note
que esto no es una ronda con puntaje. Es además el mismo verbo del botón de la página
(`PANTALLA_0.boton: 'Empezá'`). Hay que decirlo sin inflarlo: como señal es débil. La señal real
es la primera oración de arriba, y el sello solo no la reemplaza.

**Ojo visual, que no puedo medir:** `EMPEZÁ` tiene 6 letras y los otros sellos 4 (`JUGÁ`, `ARMÁ`,
`TOCÁ`) o 3 (`LEÉ`). Es el más largo del portal. Si no entra en el sello, se ajusta el sello. No
se vuelve a `JUGÁ`, que borra la señal que pide `UX-06`.

## 2. Compartir en los tres juegos que no tenían

**El molde** es el de `por-la-letra` y `mas-o-menos`: el texto que acompaña al enlace va en primera
persona, nombra el sitio en minúscula (*"en el arcade ricotero"*) y cierra con una pregunta al
amigo. Cada juego usa **el verbo de su propio nombre**: *sacar* es de los dos de oído y de letra
suelta, *adivinar* es de la tapa, *completar* es de la letra, *salirte algo* es del test.

**El desafío**, la línea que lee el que llega, tiene dos oraciones: la primera dice lo que **dice**
el amigo (registro 3) y la segunda canta (registro 1), con cierre propio. Los tres juegos que ya
tenían desafío usan tres cierres distintos: el quiz *"¿Te la bancás?"*, "Sacalo por la letra"
*"Fijate vos."*, "Más o menos" *"¿La superás?"*. **Lo provisional copiaba "Fijate vos." en las tres
pantallas nuevas** (tapa, letra, tema): cuatro juegos con la misma muletilla es una plantilla, no
una voz. Y decía *"sacó 6 de 6"* sin la cosa que se sacó. Con lo de esta nota, los seis juegos con
puntaje cierran distinto.

### 2.1 "Adiviná la tapa"

- **`PANTALLA_0.desafio`** — cambia. Con nombre: `${nombre} dice que adivinó ${aciertos} de
  ${total} tapas. Arranca fácil: a ver cuántas te salen.` Sin nombre: `Te desafiaron con ${aciertos}
  de ${total} tapas. Arranca fácil: a ver cuántas te salen.`
  - Lleva la cosa (*tapas*) y **lleva "Arranca fácil"**, porque el subtítulo que se pisa decía
    *"Arranca fácil y se pone bravo"*. Un desafío de "6 de 6" que borra la única línea que dice que
    se empieza por lo fácil le muestra un muro al que llegó sin idea. No es una promesa nueva: es la
    de la propia página, y está respaldada y testeada (`BR-01`; `tapa/banco.test.ts` tiene el caso
    "BR-01: la ronda de US-04 abre facil y no baja de dificultad").
- **`RESULTADO.paraCompartir`** — cambia. `Adiviné ${aciertos} de ${total} tapas en el arcade
  ricotero. ¿Vos cuántas adivinás?` El provisional decía *Saqué… sacás*: en la tapa nada se saca (la
  página dice *"¡La tenías!"* y el título *"Adiviná"*).
- **`RESULTADO.compartir`**, **`copiado`** y **`aManoTitulo`** — confirman (§2.4).

### 2.2 "Completá la letra"

- **`PANTALLA_0.desafio`** — cambia. Con nombre: `${nombre} dice que completó ${aciertos} de
  ${total} versos. ¿Te los sabés?` Sin nombre: `Te desafiaron con ${aciertos} de ${total} versos.
  ¿Te los sabés?` El cierre es una pregunta distinta de la del texto compartido: el texto pregunta
  *cuántos completás*, la página pregunta *si te los sabés*. Cuando el amigo manda las dos, el que
  recibe no lee la misma pregunta dos veces.
- **`RESULTADO.paraCompartir`** — confirma el provisional. `Completé ${aciertos} de ${total} versos
  en el arcade ricotero. ¿Vos cuántos completás?`
- **`compartir`**, **`copiado`**, **`aManoTitulo`** — confirman.

### 2.3 "¿Qué tipo de ricotero sos?" — se nombra el cuadrante del amigo

- **`PANTALLA_0.desafio`** — cambia (suma la tranquilidad). Con nombre: `A ${nombre} le salió
  «${cuadrante}». ¿Y a vos? Diez preguntas de cómo sos, no de cuánto sabés.` Sin nombre: `A alguien le
  salió «${cuadrante}». ¿Y a vos? Diez preguntas de cómo sos, no de cuánto sabés.`
- **`RESULTADO.paraCompartir`** — confirma. `Me salió «${cuadrante}» en el arcade ricotero. ¿Y a vos
  qué te sale?`

**La decisión: sí se nombra, y esto es lo que pesé.** Tres razones y un costo.

1. `UX-06` §2 (variante B) lo diseñó así y dejó la redacción final a `contenido`: no hay motivo para
   contradecir al dueño del flujo si no hay un daño real que mostrar.
2. **Lo que se comparte es la identidad** (`BR-17` criterio 4). El nombre es el gancho: *"Luna llena"*
   da curiosidad por los otros tres; la alternativa sin nombre (*"Alguien ya contestó."*) no da nada.
3. **No hay nada que superar.** El nombre no es un número ni un lugar en una escala. Y la oración
   es **idéntica para los cuatro cuadrantes**: la misma frase neutra, que es el criterio de `UX-06` §6
   para que ningún resultado se lea como el premio. No hay un verbo de ganar, superar ni igualar en
   toda la línea.

**El costo, a la vista.** Quien lee el nombre del amigo puede querer parecérsele, o distinguirse, y
contestar torcido. Lo acota que ninguno de los cuatro nombres dice qué polo es cuál (los
insinúan: *fija*, *suelto*, *repentino*, y nada más) y que el eje de cada pregunta sigue oculto
(`UX-06` §3). Si en el uso real `revisor` ve el sesgo, la salida es una sola cadena: `${nombre} ya
contestó.` con nombre y `Alguien ya contestó.` sin él, y el resto igual.

**Por qué la línea trae la tercera oración.** La isla pisa `#subtitulo`, y en este juego el
subtítulo es la tranquilidad. Dejar solo *"A Fulano le salió «X». ¿Y a vos?"* le saca *"no de cuánto
sabés"* al juego que más lo necesita, justo en la pantalla de quien llegó por el enlace de un
amigo. La tercera oración es la primera del subtítulo de siempre (`PANTALLA_0.subtitulo`), sin
retocar. La segunda del subtítulo (*"Elegís y listo."*) queda afuera de esta línea: ya cumple sin
ella y así no pasa de tres oraciones cortas.

**Lo que `paraCompartir` no hace:** no dice un número (`BR-17`), no dice *Soy*, que afirmaría una
identidad como etiqueta; dice *Me salió*, que es lo que se dice de un resultado. Y no lleva el
nombre del test: el que recibe el mensaje lo ve en la pantalla del enlace.

**Sobre el enlace.** La identidad viaja en `r` y es el `id` del cuadrante (`CU-1`…`CU-4`), que pasa
la regla `^[A-Za-z0-9-]{1,12}$` de `desafio.ts`. Ya está cableado así en `partida-dos-ejes.ts`.

### 2.4 `compartir`, `copiado`, `aManoTitulo` — los mismos

`Compartí` / `Se copió el enlace.` / `Copiá esto y mandalo`: los mismos de "Más o menos" y de
"Sacalo por la letra", que ya eran idénticos entre sí. Tres juegos más con el mismo botón y el mismo
aviso es lo correcto: el gesto es el mismo. (`dos-ejes/copy.ts` ya tenía `compartir: 'Compartí'`
suelto, sin usar, antes de hoy.)

## 3. El desafío que "Adiviná el tema" no lee — cambia

`PANTALLA_0.desafio(puntos, maximo, nombre?)`. Con nombre: `${nombre} dice que sacó ${puntos} de
${maximo} puntos. ¿Te da el oído?` Sin nombre: `Te desafiaron con ${puntos} de ${maximo} puntos.
¿Te da el oído?`

- **Lleva `puntos`.** `p` es el puntaje y `t` es `puntajeMaximo(temas)`, que es 100 por tema
  (`tema/escalera.ts`): el amigo ve algo como *"160 de 400"*. Sin la unidad, el 400 es
  incomprensible. Y es la misma unidad que el texto que mandó el amigo (`RESULTADO.puntos`:
  *"160 de 400 puntos"*), así que la página no cambia de idioma entre el mensaje y el enlace.
- **El cierre es del oído.** *"¿Te da el oído?"* es el cuerpo (4.3), rodea en vez de preguntar *si
  sabés*, y es propio de este juego. *Te da* es la familia de *te da el cuero* o *te da la cabeza*:
  capacidad, dicha en rioplatense. No está en la lista de jerga forzada de la regla 3.4.
- **Descartado: `¿La superás?`.** Es el cierre de "Más o menos" y le calza solo a una racha.

La mecánica del juego ya la explica la tabla `premios` de la portada ("Cuánto vale cada paso"), que
se queda a la vista cuando la línea del desafío pisa el subtítulo, así que acá no hace falta
tranquilizar.

## 4. El casete de "Skayboy y Poligirl" — confirma `JUGÁ`, y la bajada pasa

- **Acción: `JUGÁ`.** El sello es el verbo plano. La primera oración del casete (*"Agarrás tu lado del
  teléfono."*) ya es un gesto que no dice que hay un juego, así que el sello tiene que decirlo sin
  rodeos: dos cosas oblicuas seguidas serían un molinete. Descarté `AGARRÁ` (repite el verbo de la
  oración de arriba) y `SALTÁ` (es una tecla del juego, `TECLAS.salto`, y en un sello se lee como
  *"saltá esto"*).
- **La primera oración pasa la regla del portal:** *"Agarrás tu lado del teléfono."* son **5
  palabras** (límite 8) y es la que el portal imprime. No hace falta cortar nada. La bajada sigue
  siendo la de `CNT-19`, sin tocar una letra.
- **Una cosa que sí vi:** la página de Skayboy no tiene renglón de "dónde estás parado" (no usa
  `LUGARES`). Ver §6, punto 5.

## 5. Tabla final: cadenas listas para pegar

`R1`, `R2`, `R3` son los tres registros de `voz-ricotera.md` §5. "o. 1", "o. 2" y "o. 3" son la
primera, la segunda y la tercera oración de la cadena.

| # | Archivo y clave (con la firma) | Texto exacto | Frente a lo provisional | Registro y prueba de las dos líneas |
|---|---|---|---|---|
| 1 | `sitio/copy.ts` · `LUGARES.dosEjes` | `Una vela te alumbra media cara.` | **cambia** (marco repetido con `masOMenos`) | R1, 6 palabras, `te`, vela y cara, no explica. Tapado: quedan `h1`, subtítulo y *Empezá*; alcanza. |
| 2 | `sitio/copy.ts` · `JUEGOS[¿Qué tipo de ricotero sos?].baja` | `Nadie te toma examen. Diez preguntas sobre vos, sin puntaje y sin saber nada de la banda.` | **cambia** (o. 1 era R3 y de 8 palabras; nombraba el "rombo") | o. 1 R1, 4 palabras, `te`, carga el molinete; o. 2 R3, literal. Tapada la o. 1: quedan título y *EMPEZÁ*; alcanza. |
| 3 | `sitio/copy.ts` · `JUEGOS[¿Qué tipo de ricotero sos?].accion` | `EMPEZÁ` | **confirma** | R3, un verbo en voseo. Es el mismo verbo que el botón de la página (`UX-06` §2). |
| 4 | `sitio/copy.ts` · `JUEGOS[Skayboy y Poligirl].accion` | `JUGÁ` | **confirma** (la bajada de `CNT-19` no se toca; o. 1 = 5 palabras) | R3, un verbo plano. Tapada la o. 1 (*Agarrás tu lado del teléfono.*): quedan título y sello; alcanza. |
| 5 | `tapa/copy.ts` · `PANTALLA_0.desafio(aciertos: number, total: number, nombre?: string)` | con nombre: `${nombre} dice que adivinó ${aciertos} de ${total} tapas. Arranca fácil: a ver cuántas te salen.`<br>sin nombre: `Te desafiaron con ${aciertos} de ${total} tapas. Arranca fácil: a ver cuántas te salen.` | **cambia** (la cosa que se adivinó, "Arranca fácil", cierre propio) | o. 1 R3 (lo que dice el otro, `ADR-02`); o. 2 R1 y repite lo que la página ya promete. Tapada la o. 2: quedan *Adiviná la tapa*, *Empezá* y el número del amigo; alcanza. |
| 6 | `tapa/copy.ts` · `RESULTADO.paraCompartir(aciertos: number, total: number)` | `Adiviné ${aciertos} de ${total} tapas en el arcade ricotero. ¿Vos cuántas adivinás?` | **cambia** (`Saqué…sacás` → verbo del juego) | R1 en primera persona, fuera del sitio: nombra dónde (*en el arcade ricotero*) y canta la pregunta. Sin la pregunta igual dice quién, qué y dónde. |
| 7 | `letra/copy.ts` · `PANTALLA_0.desafio(aciertos: number, total: number, nombre?: string)` | con nombre: `${nombre} dice que completó ${aciertos} de ${total} versos. ¿Te los sabés?`<br>sin nombre: `Te desafiaron con ${aciertos} de ${total} versos. ¿Te los sabés?` | **cambia** (la cosa, cierre propio) | o. 1 R3; o. 2 R1, 3 palabras. Tapada la o. 2: quedan *Completá la letra*, *Empezá* y el número del amigo; alcanza. |
| 8 | `letra/copy.ts` · `RESULTADO.paraCompartir(aciertos: number, total: number)` | `Completé ${aciertos} de ${total} versos en el arcade ricotero. ¿Vos cuántos completás?` | **confirma** | Igual que la fila 6. |
| 9 | `dos-ejes/copy.ts` · `PANTALLA_0.desafio(cuadrante: string, nombre?: string)` | con nombre: `A ${nombre} le salió «${cuadrante}». ¿Y a vos? Diez preguntas de cómo sos, no de cuánto sabés.`<br>sin nombre: `A alguien le salió «${cuadrante}». ¿Y a vos? Diez preguntas de cómo sos, no de cuánto sabés.` | **cambia** (suma la tranquilidad que la isla le pisa al subtítulo) | o. 1 R3, o. 2 R1, o. 3 R3 (la del subtítulo, sin tocar). Acá canta el `h1` (*¿Qué tipo de ricotero sos?*). Tapada la o. 2: queda el `h1` y *Empezá*; alcanza. Sin verbo de ganar ni superar (`BR-17`). |
| 10 | `dos-ejes/copy.ts` · `RESULTADO.paraCompartir(cuadrante: string)` | `Me salió «${cuadrante}» en el arcade ricotero. ¿Y a vos qué te sale?` | **confirma** | R1, primera persona, sin número (`BR-17`). Igual para los cuatro cuadrantes. |
| 11 | `tema/copy.ts` · `PANTALLA_0.desafio(puntos: number, maximo: number, nombre?: string)` | con nombre: `${nombre} dice que sacó ${puntos} de ${maximo} puntos. ¿Te da el oído?`<br>sin nombre: `Te desafiaron con ${puntos} de ${maximo} puntos. ¿Te da el oído?` | **cambia** (la unidad, cierre propio) | o. 1 R3 con la misma unidad del texto que mandó el amigo; o. 2 R1 con el cuerpo. Tapada la o. 2: quedan *Adiviná el tema*, la tabla *Cuánto vale cada paso* y *Empezá*; alcanza. |
| 12 | `tapa/copy.ts`, `letra/copy.ts`, `dos-ejes/copy.ts` · `RESULTADO.compartir` | `Compartí` | **confirma** | R3, un verbo en voseo (`D-17`). |
| 13 | las mismas tres · `RESULTADO.copiado` | `Se copió el enlace.` | **confirma** (igual a "Más o menos" y "Sacalo por la letra") | R3, dice qué pasó y se calla. |
| 14 | las mismas tres · `RESULTADO.aManoTitulo` | `Copiá esto y mandalo` | **confirma** (ídem) | R3, voseo. |

**Contado contra `voz.test.ts` a mano** (no lo corrí, ver §7): anglicismos, fórmulas de folleto,
*los fans* o *los usuarios*, infinitivo en la primera palabra de un botón, suspensivos en un corto,
título ≤ 8 palabras y primera oración de casete ≤ 8 palabras. Las 14 filas pasan. Las funciones del
copy las recorre el test con comodines `1` y `'X'` y no se rompen con ninguno.

## 6. Lo que le dejo anotado al hilo principal

1. **El `LUGARES.dosEjes` no es el noveno, es el undécimo.** `CNT-13` escribió ocho; `ponelos` y
   `masOMenos` sumaron dos, y hoy hay diez. La sugerencia de septiembre decía "noveno" porque la
   escribí cuando había ocho. El comentario de `LUGARES` en `sitio/copy.ts` (*"le escribió el
   noveno"*) y su docstring (*"los ocho"*) están desactualizados.
2. **`voz.test.ts` no mide `LUGARES` contra las ocho palabras.** Los renglones pasan por las reglas
   que miran todo lo visible (anglicismos, folleto, gente, infinitivo en la primera palabra), pero
   el largo es una lista explícita (`grandes`) y `LUGARES` no está. Lo dije mal en `CNT-13` §6 ("van
   a caer solos"): era cierto para esas cuatro y falso para el largo. Propuesta de una línea: sumar
   a `grandes` las entradas de `sitio.LUGARES`, con el mismo formato `[nombre, texto]` que ya usa la
   lista. Es código de ustedes y el encargo me deja escribir solo acá, así que no dejé la propuesta
   en `Docs/SUGERENCIAS/`.
3. **`D-51` figura citada en `sitio/copy.ts` y todavía no existe en `Docs/DECISIONES.md`**
   (la última es `D-50`). No la cito como fundamento en esta nota.
4. **`Docs/SUGERENCIAS/CNT-para-hilo-principal-puerta-dos-ejes.md` queda resuelta.** Se puede
   retirar o marcar como cumplida; no la toqué porque no es mi carpeta.
5. **Skayboy tiene puerta y no tiene renglón de lugar.** Su página no usa `LUGARES` y no tiene
   `donde-estas`. Por el criterio de `CNT-13` §1 (*un lugar con puerta lleva su nombre*), le
   correspondería uno. No lo escribí: el encargo no lo pide y su pantalla es el mueble de dos
   mandos, donde un renglón puede no tener lugar. Si lo querés, es `CNT-27`.
6. **La comparación al volver (`UX-06` §6) sigue sin copy.** Las islas leen el desafío para pintar la
   línea de entrada, pero el resultado de dos ejes no compara con el del amigo. No estaba en el
   encargo. Si la querés, va en la misma `CNT-27`, con el mismo cuidado de la frase igual para
   los cuatro cuadrantes.

## 7. Cómo se verifica

No tengo con qué correrlo (`D-12`); lo corre el hilo principal, `revisor` u `orquestador`:

```
node --test src/lib/voz.test.ts
rg -n "Fijate vos" src/lib
node --experimental-strip-types -e "import('./src/lib/sitio/copy.ts').then(m => console.log(Object.entries(m.LUGARES).map(([k, v]) => k + ': ' + v.split(/\s+/).length)))"
```

1. `voz.test.ts` tiene que seguir en verde. Cubre las cadenas sueltas y las de las funciones
   (con comodines), y el largo de la primera oración de la bajada del casete nuevo, que entra por
   `JUEGOS`.
2. `Fijate vos` tiene que aparecer **una sola vez**, en `por-la-letra/copy.ts`, que es el modelo.
3. El tercer comando imprime las palabras de cada renglón de `LUGARES` (ninguno puede pasar de 8;
   `dosEjes` da 6). Hace falta porque ese largo no lo audita ninguna máquina (§6, punto 2). Si
   tu versión de Node ya corre `.ts` sin bandera, se la podés sacar.

A ojo, que no tiene comando: que los cierres de los seis juegos con puntaje suenen distintos en la
boca (*¿Te la bancás?*, *Fijate vos.*, *¿La superás?*, *Arranca fácil: a ver cuántas te salen.*,
*¿Te los sabés?*, *¿Te da el oído?*), y que `EMPEZÁ` entre en el sello (§1.3).

## 8. Bloqueos y pendientes

- **Ninguna ficha `RES-XX` pendiente.** Los únicos hechos que afirma esta nota son del propio
  juego: diez preguntas (`preguntasPorEje: 5` por dos ejes en `dos-ejes.json`), sin puntaje
  (`US-06`), y *"arranca fácil"* en la tapa (`BR-01`, testeado). Todo lo demás es tono.
- **Pendiente del hilo principal:** pegar la tabla del §5 (las filas 1, 2, 5, 6, 7, 9 y 11
  cambian algo del provisional) y corregir lo del §6 que sea suyo.
