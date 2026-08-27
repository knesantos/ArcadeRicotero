# UX-08 — Sacalo por la letra: la pantalla y el disco que la viste

> Rol dueño: `experiencia`. Consume `Docs/PRODUCTO/PRD-adivinar-por-la-letra.md` (`US-07`
> entero, `BR-20` entero), `Docs/DECISIONES.md` `D-19` (la mezcla) y `D-21` (tapas reales
> en cualquier pantalla), `Docs/UX/UX-04-sistema-visual.md` (paleta, tipografía, brief de
> arte, mecanismo de crédito), `Docs/UX/UX-01-flujo-quiz.md` y `UX-07-quiz-por-vidas.md`
> (idioma de accesibilidad ya fijado), `.claude/rules/diseno-marca.md` y
> `.claude/rules/voz-ricotera.md`. Código leído para no rediseñar lo que ya existe:
> `src/pages/juegos/adivinar-el-tema.astro`, `src/scripts/partida-tema.ts`,
> `src/lib/tema/buscador.ts`, `src/lib/tema/escalera.ts`, `src/lib/sitio/arte.ts`,
> `src/styles/tokens.css`, `src/lib/contraste.test.ts`. `T-135`, ciclo 9.

**Resuelve:** `US-07` completo (criterios 1, 2 y 4) y `BR-20` en la parte que le toca a
esta hoja — "cómo se ve", no la mecánica en sí, que ya fijó `producto`. Deja fuera el
schema (`CTR-09`, `arquitectura`), la regla de qué verso abre la escalera (`CNT-11`,
`contenido`) y el copy exacto (`contenido`).

---

## 0. La pregunta que ordena todo lo demás: es hermano de audio, no de hueco

`US-07` comparte con `US-02` ("Adiviná el tema") el catálogo de 105 títulos, el
mecanismo de respuesta (`buscador.ts`) y la escala de puntos (100/80/60/40). Con
`US-03` ("Completá la letra") comparte apenas el dominio de contenido — los dos leen
`cancionero.json` — pero no comparte ni mecánica ni componente de código. Esa distinción
gobierna las dos decisiones grandes de esta hoja (la 1 y la 2) y por eso la dejo escrita
antes que nada.

### Qué se comparte con "Adiviná el tema" (textual, sin reinventar)

| Pieza | Se comparte igual | Fuente |
|---|---|---|
| El buscador con autocompletado entero: tildes, subsecuencia, resaltado, lista que abre para arriba | Sí, sin cambios de comportamiento | `src/lib/tema/buscador.ts` |
| La mecánica de escalera: errar o pasar abre el escalón siguiente, un intento por escalón | Sí, con 4 pasos en vez de 6 (`BR-20`) | `src/lib/tema/escalera.ts` (patrón), `BR-20` |
| Los símbolos de estado: `✕` fallado, `·` pasado, `✔` acierto | Sí, mismos símbolos, mismo significado | `UX-01`, ya testeados |
| La escala de puntos 100/80/60/40 | Sí, literal (`BR-20` lo dice explícito: "no es casualidad") | `BR-20` |
| El link a la letra completa en el panel de revelación | Sí, mismo mecanismo (`tema.letra` → `/letras-y-acordes/<slug>/`) | ya cableado en `partida-tema.ts` |
| El botón único que cambia de nombre (Pasar ⇄ Arriesgar) | Sí | `partida-tema.ts` |
| Estructura del resultado final: puntaje grande, "X de Y", resumen por ítem, `COMPARTÍ`/`JUGÁ DE NUEVO`/volver | Sí, adaptado a 6 ítems por vuelta en vez de 4 | `pintarResultado()` |

### Qué difiere, y por qué cada diferencia existe

| Pieza | Acá | Por qué no puede ser igual |
|---|---|---|
| **Qué se revela** | El verso **es** el contenido: tapa toda la pantalla, crece de 1 a 8 líneas | En el juego de audio, el contenido (sonido) no se ve — hace falta una barra que **represente** cuánto vas a escuchar. Acá el verso mismo hace ese trabajo: no hay nada que dibujar aparte de él |
| **La "barra de progreso"** | No existe. Los versos acumulados **son** la barra | Dibujar una barra de segundos al lado de un texto que ya muestra su propio crecimiento sería mostrar el mismo dato dos veces |
| **El botón de escuchar / reproductor** | No existe | No hay audio en este juego (`US-07` es explícitamente el juego "sin oído", por letra) |
| **Qué pasa al gastar un intento** | El texto crece solo, sin tocar nada más | El hermano de audio exige un segundo tap ("Escuchar") para oír el fragmento nuevo; acá el verso nuevo ya está en pantalla apenas se gasta el intento — un tap menos por escalón |
| **Cómo se ven los intentos ya gastados** | Chips compactos tipo sello (ver sección 3) | El hermano dibuja seis renglones completos vacíos desde el arranque para mostrar "la altura de la escalera antes de gastarla". Acá esa altura ya la muestra el propio bloque de versos (ver sección 2) — repetirla en renglones largos es el gasto de espacio que esta hoja tiene que evitar |
| **Layout de la pantalla de partida** | App-shell de tres franjas con la del medio scrolleable (sección 2) | Es la respuesta directa al problema de espacio que plantea el paso 4 (8 líneas de verso) — el hermano de audio nunca crece de tamaño entre pasos, así que nunca lo necesitó |
| **El link a la letra completa** | Siempre presente, en los dos desenlaces | En el juego de audio es opcional porque no todos los temas tienen letra transcripta. Acá el banco entero *sale* de `cancionero.json`: todo ítem tiene letra por construcción |
| **Selector de disco en la portada** | No hay | El hermano de audio lo tiene porque el jugador puede querer practicar oído sobre un disco puntual. Acá no hay ninguna señal de que el pool deba filtrarse por disco — mismo criterio que ya usa "Completá la letra", que tampoco lo tiene |
| **El disco que viste la pantalla** | Momo Sampler, no Lobo suelto ni La mosca y la sopa | Sección 1, entera |

---

## 1. Qué disco la viste

### El problema, tal como lo plantea la tarea

`D-19` reparte cuatro discos entre cuatro categorías fijas: historia→*Gulp!*,
discos→*Último bondi*, letras→*La mosca y la sopa*, mitología→*Lobo suelto*. Los cuatro
ya están tomados por una pantalla del sitio: Redondopedia, Adiviná la tapa, Completá la
letra, Adiviná el tema, en ese orden. `US-07` es contenido-de-letra por definición —
versos— pero `letras` ya tiene dueño.

### Las dos opciones obvias, y por qué las descarto las dos

**Opción A — reusar `letras` (*La mosca y la sopa*), porque el contenido es letra.**
La descarto. Sería vestir "Sacalo por la letra" y "Completá la letra" con el mismo
fondo, el mismo color de acento, el mismo disco. El propio `US-07` explica por qué el
nombre del juego se eligió distinto de "Adiviná el tema" a propósito: *"un nombre
calcado los mezclaría en la cabeza de quien los ve listados uno al lado del otro"*. Ese
argumento pesa exactamente igual sobre la piel visual: dos casetes con el mismo disco,
uno al lado del otro en el portal, se leen como el mismo juego con dos nombres — el
problema que el nombre nuevo existe para evitar, reabierto por la puerta del color.

**Opción B — reusar `mitologia` (*Lobo suelto*), porque es el verdadero hermano
mecánico.** También la descarto, por el mismo argumento espejado: `US-07` y `US-02`
comparten catálogo, buscador y escala de puntos — son, mecánicamente, más gemelos entre
sí que `US-07` y `US-03`. Pero justamente por eso vestirlos igual duplica el riesgo de
confusión en el lugar donde más cuesta: dos juegos casi idénticos en la superficie
(mismo buscador, mismos puntos, nombres que empiezan distinto pero se parecen) que
además comparten fondo, color y disco de portada. La distinción que ya hace el nombre
tiene que sostenerse también en la piel.

### La elección: Momo Sampler

Ninguna de las diez tapas medidas por `RES-37` está tomada todavía como identidad de
sección — la mezcla de `D-19` solo reparte cuatro de las diez, las otras seis solo
aparecen hoy como fichas propias de disco en la Redondopedia. Elijo **Momo Sampler**
(`--disco-momo-sampler-tinta` / `-apoyo`, ya medidos en `RES-37` y ya con su par
`"Momo Sampler sobre fondo"` corriendo en `src/lib/contraste.test.ts`, línea 76). No
pide ningún par de color nuevo.

**Por qué este y no otro de los seis libres — criterio propio, sin ficha detrás**, igual
que la paleta y la tipografía del brief general de `UX-04`: *sampler* es, literalmente,
un aparato que arma algo entero a partir de fragmentos sueltos — es la misma operación
que hace el jugador de `US-07`: le dan versos sueltos y arma el tema completo en la
cabeza. Ninguna ficha de `investigador` respalda esta lectura del título del disco (ni
`RES-06` ni `RES-20` entran en por qué se llama así); la marco como asociación de
palabra, no como hecho, y no cito ningún `RES-XX` para sostenerla porque no lo hay.

La tapa (`public/tapas/momo-sampler.jpg`, ya en el repo) es un medallón redondo con una
cara grabada, tipo sello o moneda, sobre fondo negro, con el título escrito en espejo
sobre una franja vertical al margen izquierdo. El medallón redondo se presta bien al
"detalle recortado" de `D-21` (silueta cerrada, sin fondo negro alrededor) y a la
brief de arte original (ver más abajo).

**Verificación del criterio del `ORQ` ("el disco elegido no pisa el de otra
sección")**: confirmado contra `src/lib/sitio/arte.ts` (mapa `DISCO_DE`) y contra los
tres archivos `.astro` de juego (`adivinar-el-tema`, `adivinar-la-tapa`,
`completar-la-letra`) — Momo Sampler no aparece hoy en ningún `fondoTapa()`,
`detalleTapa()` ni ficha de categoría. Solo existe como artículo propio de disco en la
Redondopedia (`STICKER_DISCO['momo-sampler']`), y ese uso no choca: es el mismo patrón
ya vigente con Lobo suelto, que es a la vez ficha de disco en la Redondopedia **y**
identidad de "Adiviná el tema" — un disco puede tener las dos funciones a la vez sin
confundirse, porque son pantallas distintas con propósitos distintos.

### Lo que esto no es

No es una quinta "categoría" en el sentido de `D-19` — esa mezcla sigue siendo,
estrictamente, las cuatro de siempre (historia/discos/letras/mitología) más la marca.
`US-07` no necesita una categoría nueva: necesita un disco de identidad, igual que
cualquier ficha de disco de la Redondopedia ya tiene la suya entre los diez medidos por
`RES-37`. Trato el color de este juego exactamente así — `--disco-momo-sampler-tinta`
y `-apoyo` aplicados directo, sin forzarlo a la unión cerrada `'marca' | 'historia' |
'discos' | 'letras' | 'mitologia'` que hoy tipa `Casete['variante']` en
`src/lib/sitio/copy.ts`. Si quien construya el casete del portal (`T-141`) prefiere
ampliar ese tipo en vez de salir de él, es una decisión de código que no me toca a mí;
dejo dicho el disco y el porqué, no la forma del tipo.

### El brief de arte que esto pide

| Pieza | Qué transmite | Técnica | Dónde se usa |
|---|---|---|---|
| Ícono de portada, arte original (repuesto dibujado, ver `public/arte/README.md`) | Una cara redonda, grabada, mirando de frente — "te reconozco por poco", el mismo gesto que le pide el juego al jugador | Silueta cerrada, línea gruesa tipo grabado/serigrafía (`RES-06`), nunca vector liso | Casete del portal, sustituyendo el `arte: '/arte/casete.svg'` genérico. Nombre sugerido: `mascara-momo.svg`, con reemplazo real `mascara-momo.png` cuando exista el recorte, siguiendo el mismo patrón de `RECORTE_REAL` que ya usa `lobo.svg`→`lobo-recortado.png` |
| Detalle recortado (`D-21`, foto real) | El medallón de la tapa, recortado en silueta cerrada, borde rasgado, rotación leve | Recorte fotográfico del máster, no dibujo | Fondo de la pantalla de juego (`tapa-fondo--momo-medallon`) y detalle de artículo si algún día la Redondopedia lo necesita fuera de su propia ficha |
| Fondo velado (`D-21`) | Mismo medallón, más alejado, detrás del velo `--velo-tapa` | Recorte fotográfico, mismo archivo base que el detalle o un encuadre más amplio | `<div class="tapa-fondo tapa-fondo--momo-medallon">` en las tres secciones de la isla (portada/partida/resultado), igual que hacen hoy `lobo-tiras` y `mosca-olla` |

Nombres de derivado propuestos: **`momo-medallon`** para `detalle/momo-medallon.jpg` y
`fondo/momo-medallon.jpg`. Mientras no existan, `detalleTapa()`/`fondoTapa()` devuelven
`null` y la pantalla no muestra nada — el mismo comportamiento con el que ya conviven
hoy todas las piezas pendientes del collage (`arte.ts`, comentario de cabecera). No es
un bloqueo para jugar, es un bloqueo para que se vea vestida.

---

## 2. La pantalla de partida: cómo entran 8 versos, el buscador y los botones sin perder el pulgar

### El problema en números, no en intuición

En el paso 4 hay 8 versos acumulados. Por `.claude/rules/voz-ricotera.md` (4.1), un
verso mediano tiene 5 palabras y el 90% no pasa de 8 — a una columna de ~319px de ancho
útil (375px de viewport, menos el padding del `body` y el de la tarjeta de versos),
la mayoría de los versos entra en un renglón; algunos, los más largos, envuelven a dos.
Cálculo a mano con el peor caso razonable —6 versos de un renglón, 2 de dos—: 10
renglones × 24px de interlineado ≈ 240px, más el borde y el relleno de la tarjeta
(~40px) ≈ **280px** solo para el bloque de versos en el paso más cargado.

El resto de la pantalla de partida no es gratis: cabecera (~48px), chips de intentos ya
gastados en su peor caso —tres, llegando al último escalón— (~80px), y el buscador con
su botón (input + botón borrar 48px, ayuda ~27px, botón arriesgar/pasar 48px, más aire
entre los tres ≈ **147px**). Sumado al padding del `body` (~32px), el "resto fijo" pesa
**~307px**. Contra un iPhone SE (375×667, ~600px de alto visible descontando la barra
del navegador), quedan **~293px** para el bloque de versos — más ajustado que los 280px
que pide el peor caso, pero sin margen de sobra. En cualquier pantalla más alta que un
SE (la gran mayoría del parque hoy) sobra aire de verdad.

**Conclusión: no alcanza con "que fluya y se scrollee la página entera".** Si el bloque
de versos empuja a todo lo demás hacia abajo en un documento que crece, en el paso 4 el
buscador puede terminar debajo del borde visible al entrar a la pantalla — exactamente
lo que esta tarea pide evitar. Es un problema que el hermano de audio nunca tuvo: su
contenido (una barra + un botón de escuchar) mide lo mismo en el paso 1 que en el 6.

### La solución: tres franjas, y una sola que scrollea

La pantalla de partida se arma como un bloque de alto fijo (`100svh`, la variante de
`vh` que descuenta la barra del navegador móvil — la unidad correcta acá porque esta
franja se ancla al viewport real, no al documento), dividido en tres franjas verticales:

1. **Arriba, alto fijo — la cabecera.** "Tema 2/6" a la izquierda (mismo patrón que
   `.paso` del hermano), intentos que quedan a la derecha (mismo patrón que
   `.restantes`, con el mismo tratamiento de urgencia en el último: `--acento-2` y
   negrita cuando queda uno solo). No hay chip de dificultad ni de categoría acá — igual
   que el hermano de audio, que tampoco lo muestra: `BR-01` gobierna qué tema sale
   primero, no cómo se ve cada pregunta.
2. **En el medio, lo único que crece y lo único que scrollea — la hoja de versos.**
   `flex: 1 1 auto; min-height: 0; overflow-y: auto` dentro de la columna. Ocupa todo lo
   que sobra entre la cabecera y el buscador, y si el contenido no entra (paso 4, en un
   celular chico, o un verso más largo que el promedio) se scrollea **solo ahí adentro**
   — nunca la pantalla entera. Es una red de seguridad para el peor caso, no el
   comportamiento esperado: con el cálculo de arriba, en la mayoría de las pantallas y
   la mayoría de los versos, entra entero y sin scroll.
3. **Abajo, alto fijo, zona pulgar — el buscador y su botón.** El mismo componente
   entero del hermano (input, botón de borrar, ayuda, botón Pasar/Arriesgar), sin
   ningún cambio de comportamiento. Al estar en la franja de alto fijo de un layout que
   suma exactamente `100svh`, queda **siempre** en el mismo lugar de la pantalla, tenga
   el tema en curso 1 verso o 8. No hace falta `position: sticky` ni `position: fixed`
   por separado: alcanza con que sea la última franja de una columna flex cuya altura
   total es la del viewport.

Entre la franja 1 y la 2 van los chips de intentos gastados (ver sección 3) — son
parte de la franja fija de arriba, no de la que scrollea, porque son datos de estado,
no contenido creciente.

### Qué pasa al gastar un intento

Ni el reproductor ni la barra del hermano existen acá. Gastar un intento (arriesgar mal,
o pasar) hace tres cosas en el mismo instante, sin transición más allá del cambio de
color simple que ya usa el resto del sitio (`border-color 120ms`, sin rebote ni glow):

1. Se agrega un chip nuevo a la fila de intentos gastados (sección 3).
2. Los versos nuevos del escalón siguiente aparecen en la hoja — sin tap adicional, sin
   esperar nada: a diferencia del audio, que necesita que alguien vuelva a tocar
   "Escuchar", el texto ya está ahí apenas se gasta el intento.
3. El foco vuelve a la caja de búsqueda, vacía, lista para el intento siguiente — mismo
   patrón que ya usa `elegirSugerencia()` en el hermano para no obligar a buscar el
   siguiente control con la vista.

Si la hoja de versos venía scrolleada (paso 4, celular chico), el verso nuevo que se
agrega al final puede quedar fuera de la vista sin que el jugador lo note. Por eso, cada
vez que se agregan versos nuevos, la hoja hace scroll automático hasta el final del
bloque — no hasta el tope de la pantalla, que ya está fija y no se mueve.

---

## 3. Los intentos gastados: chips, no renglones

El hermano dibuja seis renglones completos (`.intentos`, `.intento`) desde el arranque,
vacíos, para mostrar la altura de la escalera antes de gastarla. Acá esa función ya la
cumple la propia hoja de versos: ver 1 verso solo ya dice "estás en el primer escalón de
cuatro" sin necesitar una lista aparte. Repetir la información en cuatro renglones
completos —dos de ellos casi siempre vacíos, porque `US-07` tiene cuatro escalones, no
seis— es el gasto de espacio que la sección 2 no se puede permitir.

En su lugar, **chips de sello** (el reemplazo ya vigente contra la pastilla cápsula,
`.claude/rules/diseno-marca.md`): rectángulo de esquina casi viva, borde fino, apenas
torcido, uno por cada intento **ya gastado** — nunca se predibujan los que faltan. Se
acomodan en una fila con `flex-wrap`, debajo de la cabecera:

- **Arriesgó y falló:** símbolo `✕` (mismo que ya usa `.intento--fallado`), tinta
  `--acento-4`, con el título que arriesgó, acortado si hace falta.
- **Pasó:** símbolo `·` (mismo que `.intento--pasado`), tinta `--texto-tenue`, con la
  palabra corta que fije `contenido` (ej. "pasaste").

Ningún estado se distingue solo por color: los dos llevan también un símbolo distinto,
igual que ya exige el checklist de `UX-01` para acierto/error. En el paso 1 (cero
intentos gastados) la fila no existe — ni siquiera vacía: no hay nada que mostrar
todavía, y su ausencia no resta información porque el paso mismo ("1/4" en la cabecera)
ya la da.

---

## 4. La tipografía y el tratamiento del verso

Texto largo → `--fuente`, nunca `--fuente-titular` ni `--fuente-rotulada` (`UX-01`,
regla que no se negocia para nada que se lea de corrido). Tamaño 1.05rem, interlineado
1.5 — un poco más grande que el cuerpo default del sitio, porque acá el verso es la
pieza central de la pantalla, no una nota al pie.

**Cómo se distingue de la interfaz alrededor, sin usar la sangría de cita.** La tarea
avisa, con razón, que `.parrafo--leyenda`/`.parrafo--testimonio` son una excepción
declarada y con dueño (`BR-08`, prosa editorial de la Redondopedia) — no una textura
libre para reusar. La resuelvo con el reemplazo que ya fija `diseno-marca.md` para
"superficie elevada": **la hoja entera es un recorte pegado**, borde completo (las
cuatro caras, nunca solo la izquierda — esa es justo la barra lateral que la regla
antislop vetó primero) en `--disco-momo-sampler-apoyo`, fondo `--fondo-elevado` (el par
ya testeado "texto sobre fondo elevado"), rotación leve (uno o dos grados, como
cualquier recorte del collage) y esquina de estampa (`border-radius: 3px`, no la
burbuja pareja que también vetó esa regla).

Adentro, **cada verso ocupa su propio renglón** — no se arma como un párrafo corrido.
Es fiel a cómo está el dato (un verso por línea en `cancionero.json`) y además refuerza
visualmente el conteo de la escalera: ver dos líneas en vez de una ya dice "subiste de
escalón" antes de leer la cabecera. Un fino filete inferior en `--borde` separa cada
renglón del siguiente — mismo recurso que ya usa `.intento` para "papel con renglones",
reaplicado acá a versos en lugar de intentos.

**Descarté un símbolo de comilla (`❝`) al pie o a la cabeza del bloque.** Ese símbolo ya
tiene un significado fijado en el sitio: marca testimonio fichado (`UX-01`). Ponerlo acá
para decir simplemente "esto es una cita" mezclaría dos señales distintas — un verso de
letra no es un testimonio con nombre y ficha, y usar el mismo signo para las dos cosas le
resta valor al que ya existe. La hoja se distingue por su forma (recorte con borde
completo) y por dónde vive en la pantalla, no por un ícono nuevo.

---

## 5. El casete del portal

Título ya fijado por `US-07`: **"Sacalo por la letra"** — es la línea que **nombra**
(registro 3, según la regla de las dos líneas de `voz-ricotera.md`: en un casete, nombra
el título). Lo que dejo acá es la bajada, que **canta** (registro 1): imagen física,
segunda persona o imperativo, primera frase de ≤ 8 palabras (la audita
`src/lib/voz.test.ts`), sin explicar la mecánica que el título ya nombró.

**Propuesta:**

> *"Con un renglón te la podés jugar. Si no te sale, hay más letra: hasta ocho versos y
> se acaba el crédito."*

Primera frase: *"Con un renglón te la podés jugar"* — siete palabras. Imagen física
(`voz-ricotera.md` 4.3): un renglón (objeto concreto, una línea escrita), no una
abstracción como "reconocimiento" o "memoria". Segunda frase sigue el mismo criterio con
otra imagen concreta —"se acaba el crédito"— jugando con la idea de quedarse sin más
intentos, sin nombrar la palabra "intento" ni "puntos". La palabra final del copy es de
`contenido`; esto es una propuesta con la estructura ya resuelta (qué línea nombra, qué
línea canta, qué imagen usa cada una), no un texto cerrado.

**Arte del casete:** ver brief de la sección 1 — ícono nuevo (`mascara-momo`,
repuesto dibujado hasta que exista el recorte real), reemplazando el `/arte/casete.svg`
genérico que usaría por defecto.

---

## 6. El panel por ítem: acertó, no la sacó, y el link a la letra

Reusa la estructura entera de `pintarRevelacion()` del hermano — micro-copy corto,
título grande con el nombre del tema, ficha de disco y año, sin cambios de layout. Dos
diferencias, las dos ya explicadas en la sección 0 pero repetidas acá porque es donde
importan:

- **No hay reproductor de audio ni "escuchar el tema entero".** El equivalente de
  "premio adicional" en este juego es leer la letra completa, no escucharla.
- **El link a `/letras-y-acordes/<slug>/` está siempre**, en los dos desenlaces —
  acertó o no la sacó. En el hermano es condicional porque no todos los temas tienen
  letra transcripta; acá todos la tienen, porque el banco entero sale de ese corpus
  (`cancionero.json`, `PRD-adivinar-por-la-letra.md`). No decido mostrar el resto de la
  letra inline en el panel: `BR-20` ya explica por qué el juego corta en 8 versos y no
  más ("no hay motivo para regalar más letra de la que hace falta para identificar el
  tema") — ese mismo criterio se sostiene en el momento de la revelación. El link
  **ofrece** seguir leyendo; no lo fuerza.

**Si acertó en el paso N:** micro-copy con signo de exclamación permitido (es el único
lugar del sitio donde el "!" no está vetado — `voz-ricotera.md` §7: "solo grita el
acierto, que es un grito de verdad"), símbolo `✔`, puntos ganados y en qué paso, más el
link a la letra.

**Si agotó los cuatro intentos:** micro-copy sin exclamación, símbolo `✕`, el nombre del
tema revelado, sin puntos que mostrar, más el mismo link a la letra — acá es, si acaso,
el momento en que más tiene sentido: el jugador que no la sacó es quien más quiere leer
la canción entera para entender qué se le escapó.

Botón único de cierre (`SEGUÍ` / el texto que corresponda en el último ítem de la
vuelta), mismo mecanismo que el hermano: un tap, foco puesto ahí, sin auto-avance por
temporizador.

---

## 7. El resultado final de la vuelta

Una vuelta son **6 temas** (`US-07` criterio 1). Reusa `pintarResultado()` del hermano
sin cambios de fondo: puntaje grande, "X de 600" (`puntajeMaximo` generalizado a 6
ítems en vez de 4), resumen ordenado con `✔`/`✕` + título + paso en que se acertó (o
"—" si no se sacó), `COMPARTÍ` primario, `JUGÁ DE NUEVO` secundario, `← Volver al
arcade`. Ninguna pregunta ni ningún verso del banco se expone en el resumen ni en el
link compartido — mismo límite que ya fija `UX-02` para toda tarjeta de resultado del
sitio, sin excepción nueva acá.

El formato del link de desafío es de `arquitectura` (`ADR-02`); esta hoja solo deja
dicho qué datos tiene que poder representar: juego (`letra` o el identificador que se
elija, distinto de `tema`), puntaje, total.

---

## 8. La pantalla 0 — entrada

Mismo layout que "Completá la letra", no el de "Adiviná el tema": un solo botón
(`Empezá`), sin selector de disco. No hay ninguna razón para filtrar por disco en este
juego —el pool entero (mínimo 60 temas) es parejo en mecánica— y agregar un selector que
nadie pidió sería la clase de paso extra que esta tarea existe para evitar.

**Estado sin banco todavía** (mientras `T-139` no corrió o el filtro de `CNT-11`
descarta más de la cuenta): mismo patrón que ya usa "Completá la letra" en su estado
`SIN_BANCO` — título, por qué no hay banco todavía, y un link a `/letras-y-acordes/`
como salida honesta en vez de un botón que no lleva a ningún lado.

Checklist de "sin muro", igual que en toda pantalla 0 del sitio:

- [ ] Cero campos de texto y cero permisos antes de la primera pregunta.
- [ ] Un solo tap entre caer en el sitio y ver el primer verso.
- [ ] Nada de scroll para encontrar el botón de arrancar: entra en el viewport inicial.
- [ ] Ningún dato inventado en el subtítulo (sin contadores falsos).

---

## Checklist — accesibilidad

- [ ] Cada intento gastado se distingue por símbolo (`✕`/`·`) además de color, nunca
      solo por tinte.
- [ ] El buscador conserva `role="combobox"`, `aria-expanded`, `aria-controls` y el
      recorrido con flechas del hermano — no se reduce nada al reusarlo.
- [ ] La hoja de versos, aunque scrollee internamente, sigue siendo navegable con
      teclado y lector de pantalla (no es una imagen ni un `<canvas>`, es texto real).
- [ ] `--toque-min` (48×48 px) en el botón Pasar/Arriesgar y en el botón de borrar,
      igual que en el hermano.
- [ ] Contraste AA en la hoja de versos: `--texto` sobre `--fondo-elevado`, par ya
      testeado; ningún verso se pinta con `--disco-momo-sampler-tinta` como color de
      texto sobre el fondo velado (esa combinación no está testeada — la tinta del
      disco va solo en borde y símbolos, nunca en el cuerpo del verso).
- [ ] Ninguna transición nueva de esta hoja (chip nuevo, verso que aparece, scroll al
      final de la hoja) usa un efecto vetado por `diseno-marca.md` (glow, rebote, blur).

## Pares de color: ninguno nuevo

| Uso | Token | Par ya testeado |
|---|---|---|
| Identidad de sección (fondo velado, borde de la hoja, símbolo del casete) | `--disco-momo-sampler-apoyo` | No es texto — mismo criterio que el resto de los `-apoyo`, no entra al test |
| Título/acento puntual si hiciera falta texto en la tinta del disco | `--disco-momo-sampler-tinta` | `"Momo Sampler sobre fondo"`, ya en `src/lib/contraste.test.ts` |
| Texto de la hoja de versos | `--texto` sobre `--fondo-elevado` | `"texto sobre fondo elevado"`, ya testeado (mismo par que usa `UX-07` para el aviso de escalón) |
| Chip de intento fallado | `--acento-4` | `"error sobre fondo"` |
| Chip de intento pasado | `--texto-tenue` | `"texto tenue sobre fondo"` |
| Intentos restantes, último aviso | `--acento-2` | `"acento-2 sobre fondo"` |

No pido agregar ningún par nuevo a `contraste.test.ts`. El único token que esta hoja
suma al vocabulario visual del sitio (`--disco-momo-sampler-*`) ya estaba en
`tokens.css` desde antes, midiendo la ficha de disco de la Redondopedia — no es un color
nuevo, es un uso nuevo de un color que ya existía y ya estaba testeado.

---

## Bloqueos que dejo anotados

- **El texto exacto** de la bajada del casete, el micro-copy de acierto/fallo, la
  palabra corta de "pasaste" en el chip, y el copy de la pantalla sin banco es de
  `contenido` — todavía sin `CNT-XX` asignado para este juego puntual (el único
  existente hoy, `CNT-11`, es la regla de selección de versos, no el copy de pantalla).
- **El recorte real y los derivados de Momo Sampler** (`mascara-momo.svg`/`.png`,
  `detalle/momo-medallon.jpg`, `fondo/momo-medallon.jpg`) no existen todavía. No bloquea
  jugar: `arte.ts` ya tolera esa ausencia devolviendo `null` y la pantalla simplemente
  no muestra nada hasta que alguien los genere — mismo criterio que el resto del
  collage.
- **Si el tipo `Casete['variante']` se amplía o no** para el casete de este juego es una
  decisión de código de quien construya `T-141`; dejo dicho el disco, no la forma del
  tipo (sección 1).
- **El formato exacto del link de desafío** (qué string identifica a este juego, ej.
  `'letra'`) es de `arquitectura` (`ADR-02`) — dejo dicho qué datos tiene que poder
  cargar, no el formato en sí.
