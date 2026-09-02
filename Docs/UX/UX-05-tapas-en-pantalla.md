# UX-05 — Catálogo: qué detalle de qué tapa viste cada pantalla

> Rol dueño: `experiencia`. Resuelve el mandato de `D-21` ("`experiencia` reescribe la
> fila de `UX-04` y escribe `UX-05`, el catálogo de qué detalle de qué tapa viste cada
> sección bajo el mapa de `D-19`"). Aplica las reglas de `UX-04` v3 (las tres formas, el
> piso de legibilidad, el mecanismo de crédito) — **no las redefine**. Consume `D-19` (la
> mezcla), `public/arte/README.md` (el despiece dibujado existente, con el que este
> catálogo tiene que convivir sin pisarlo), `RES-06`/`RES-20`/`RES-22`
> (`Docs/INVESTIGACION/INV-02-banda-cultura-estetica.md` e `INV-20-fuentes-primarias.md`),
> `src/lib/sitio/copy.ts` (los nombres reales de pantalla y el campo `viste` ya asignado a
> cada casete), y las 35 imágenes de `Docs/INVESTIGACION/TapasDiscos/`, todas miradas antes
> de escribir la fila que las cita.

> **v2 — `T-71`, ciclo 5.** Cuatro cambios sobre la v1 que escribió `D-21`/`T-46`.
> **(1)** Confirmo los dos desvíos que reportó el hilo principal al implementar esta hoja
> en el ciclo 4 (`Docs/SUGERENCIAS/HILO-para-experiencia-desvios-de-UX-05.md`): la
> categoría `letras` pasa entera a la trasera de *La mosca y la sopa* (tres filas), y el
> fondo de Oktubre del portal queda anclado en la franja inferior, no detrás de la
> cabecera. **(2)** Sumo el corolario de `UX-04` v4 sobre el velo: en las dos pantallas
> del quiz que todavía no existían cuando escribí la v1 (presentación y resultado), acoto
> dónde llega el fondo velado para que nunca quede detrás de `--marca-rojo` ni de los
> acentos de tramo, que no tienen su par testeado contra el peor caso de la tapa.
> **(3)** Escribo el mecanismo del sello de esquina en detalle —dónde cae, qué tamaño
> tiene, cómo convive con la zona del pulgar de `UX-01`— para que `T-72`..`T-74` lo
> implementen leyendo solo esta sección. **(4)** Dejo anotado, sin resolverlo, que la
> ficha de disco de *La mosca y la sopa* (§7a) muestra el mismo frontal que `RES-44`
> descartó para el resto del disco — no lo toco acá porque el mapeo slug→máster es de
> código/`arquitectura`, pero conviene que alguien lo mire antes de que se lea como un
> descuido en vez de una decisión pendiente.

## Cómo leer esta tabla

- **Forma** es una de las tres de `UX-04`: **detalle recortado** (recorte tratado como
  pegado — borde rasgado, rotación), **fondo velado** (acotado a una tarjeta o una
  franja, nunca a sangre completa, con `--velo-tapa` u opcional `--velo-tapa-titular`
  detrás de texto), o **ficha** (320 px, la tapa entera, sin cambios respecto de lo que
  ya existe en la Redondopedia). Ya no cito 480/640 px por fila: `UX-04` v4 explica por
  qué esos dos números eran un objetivo que ningún máster real alcanza (el rango real de
  hoy es 210–591 px de lado largo) y los bajó a tope de referencia — el número que
  importa mantener es el de peso, 60 KB por fondo, que tampoco roza nadie hoy (máximo
  real: 53 KB).
- **Legibilidad:** todo fondo velado de esta tabla usa **`--velo-tapa` (86 %)**, no
  `--velo-tapa-titular`, porque en las siete pantallas reales de hoy el texto de cuerpo
  convive siempre con algún titular — ninguna pantalla real es solo texto grande. Dejo esto
  anotado porque significa que `--velo-tapa-titular` queda **propuesto y sin un caso de uso
  real todavía**; no es un error, es que ninguna pantalla de hoy lo pide.
- Un **detalle recortado** que **flota** en un margen (aria-hidden, sin overlap con texto —
  el mismo patrón que ya usan `perro.svg`/`mosca.svg` en el portal) **no dispara el test de
  contraste**: esa exención la fija `UX-04` textual ("si el detalle queda detrás o pegado a
  texto... rige el mismo piso de legibilidad"). Lo marco en cada fila.
- **Crédito**, por tipo de pantalla, mecanismo ya fijado por `UX-04` — acá solo se aplica:
  pantallas con `Base.astro` → línea nueva en `footer.pie-sitio`; islas de partida sin
  `Base.astro` (hoy: el quiz) → sello de esquina en `--fuente-rotulada`.
- **"Dónde cae"** es descripción en palabras y fracciones — los píxeles exactos los define
  quien recorta.
- La mezcla de `D-19` que este catálogo aplica: portada=**Oktubre**, historia=**Gulp!**,
  mitología=**Lobo suelto**, letras=**La mosca y la sopa**, discos=**Último bondi**,
  resultado=**Gulp! + el lettering del logo**.

---

## 1. `/` — el portal collage-cassette

El portal no tiene una sola identidad: la cabecera viste Oktubre (la marca del sitio,
`D-19`) y cada casete ya declara su propio disco en `copy.ts` (campo `viste`) desde antes de
esta tarea. Este catálogo aplica ese mapa existente a una pieza fotográfica real por primera
vez — hasta ahora esos casetes solo tenían color de acento (`--cat-*`) y un ícono dibujado.

| Pantalla | Disco (`D-19`) | Archivo master | Qué detalle | Dónde cae | Forma | Por qué |
|---|---|---|---|---|---|---|
| `/` — franja inferior fija (reemplaza `multitud-banderas.png`) | Oktubre | `oktubre-frontal.jpg` | La franja de banderas rojas sobre negro, sin la multitud de caras debajo ni el wordmark arriba | La banda horizontal entre el 42 % y el 63 % de alto: las cinco astas con sus banderas, cortando antes de que empiecen las cabezas | Fondo velado (`--velo-tapa`), anclado en la franja fija de abajo de la portada — nunca detrás de la cabecera | **Corrige un desvío confirmado (`T-71`):** esta fila decía "detrás de `marca-grande` + `bajada`". `marca-grande` se escribe en `--marca-rojo`, y ese rojo da 3,38:1 contra el peor caso del velo — debajo del piso de 4,5:1 que fija esta misma hoja, y no se arregla subiendo el velo (al 92 % sigue en 4,10:1 y ya no se ve la foto). Está verificado como test (`contraste.test.ts`, "D-21: el rojo de marca no se usa como texto sobre tapa velada"). La franja fija de abajo es donde `public/arte/README.md` ya ubicaba a la multitud dibujada — la reemplaza en vez de competir con ella, y la cabecera queda sobre `--fondo` liso, el par que sí está testeado |
| `/` — casete "Preguntas ricoteras" (quiz) | Oktubre | `oktubre-frontal.jpg` | Una sola bandera con su asta, la segunda desde la izquierda | El 20 %–35 % de ancho, 45 %–62 % de alto: un asta aislada, sin las demás ni la multitud | Detalle recortado, flotante junto al rótulo "Viste Oktubre", sin overlap de texto | Recorte más chico y distinto del de la cabecera para no repetir el mismo encuadre dos veces en la misma pantalla; una sola bandera es legible como ícono de sello en un espacio de casete chico |
| `/` — casete "Adiviná el tema" | Lobo suelto | `lobo-suelto-cordero-atado-cd1-frontal.jpg` | Las tiras de papel rasgado atadas al cuello de la figura, sin la cara | La franja del cuello, 55 %–75 % de alto, mitad izquierda de ancho: los "tags" de papel, sin colmillos ni ojos | Detalle recortado, flotante junto al rótulo "Viste Lobo suelto" | Evita la cara (ya cubierta por el dibujado `lobo-lupus.png`, `RES-20`); la textura de papel rasgado es abstracta, de alto contraste, y no "recompone" la tapa |
| `/` — casete "Completá la letra" | La mosca y la sopa | `la-mosca-y-la-sopa-trasera.jpg` | La olla de metal con el cucharón asomando — mismo recorte que ya usa `/juegos/completar-la-letra/` (sección 4) | La esquina superior derecha: 65 %–100 % de ancho, 20 %–55 % de alto | Detalle recortado, flotante junto al rótulo "Viste La mosca y la sopa" | **Corrige un desvío confirmado (`T-71`):** el frontal no es arte de Rocambole — `RES-44` lo audita como rediseño con foto de recital, sin el gato momificado ni los cerdos y peces que `RES-06`/`RES-22` documentan como el arte real. Recortar de ahí le firma a Rocambole un trabajo que no es suyo, la misma familia de error que una respuesta de quiz mal puesta. La trasera sí trae el collage real; uso el mismo recorte (la olla) que ya había elegido para la pantalla del juego, en vez de inventar uno nuevo — coherencia de marca dentro del propio disco |
| `/` — casete "Adiviná la tapa" | Último bondi | `ultimo-bondi-a-finisterre-frontal.jpg` | El motivo metálico grabado tipo circuito | La esquina superior izquierda, 0 %–30 % de ancho y de alto | Detalle recortado, flotante junto al rótulo "Viste Último bondi" | Evita el ojo de buey central con los rostros de la banda — este casete es la puerta al juego que va a usar muchas tapas reales como contenido de juego; su propio ícono de sección no debería adelantar ninguna cara |
| `/` — casete "La Redondopedia" | Gulp! | `gulp-frontal.jpg` | La pincelada blanca y negra sin ningún trazo de la letra verde | La esquina inferior derecha, 65 %–100 % de ancho y de alto, por debajo de la firma manuscrita | Detalle recortado, flotante junto al rótulo "Viste Gulp!" | Textura abstracta de la técnica fichada de Rocambole (rodillo/pincel, `RES-06`); distinto del recorte de Gulp! que usa `resultado` (ver más abajo), para no repetir la misma pieza en dos contextos del sitio |

**Crédito:** el portal usa `Base.astro` → una línea nueva en `footer.pie-sitio`:
*"Arte de tapa: Oktubre, Gulp!, Lobo suelto, La mosca y la sopa y Último bondi — Rocambole
(Ricardo Cohen)"* (los cinco discos que aparecen en esta pantalla, un solo crédito).

---

## 2. `/quiz/` — las cuatro pantallas

El quiz no usa `Base.astro` (es la isla de `partida.ts`): el crédito va en **sello de
esquina**, no en pie de página. Como el sello tiene que reflejar qué disco está en pantalla
en cada momento, su texto cambia junto con `item.categoria` — el contenido del sello lo
especifico acá, la lógica de actualizarlo la implementa el hilo principal.

| Pantalla | Disco (`D-19`) | Archivo master | Qué detalle | Dónde cae | Forma | Por qué |
|---|---|---|---|---|---|---|
| `/quiz/` — presentación (`#portada`) | Oktubre | `oktubre-frontal.jpg` | Un fragmento de la curva de la "O" y el trazo diagonal de la "K" de "OKTUBRE", cortado en ángulo, sin completar ninguna letra | El cuarto superior izquierdo: 0 %–25 % de ancho, 15 %–40 % de alto | Fondo velado (`--velo-tapa`), **desde el título de la pregunta (`h1`) hacia abajo, nunca desde arriba** | **Aviso propio, mismo patrón que el desvío 2 del portal, en una pantalla que el ciclo 4 no llegó a construir:** esta pantalla también tiene su línea `ARCADE RICOTERO` en `--marca-rojo` (`.marca`, ver `quiz.astro`), igual que la cabecera del portal. Si el fondo empezara arriba (como sugiere "cuarto superior izquierdo"), repetiría el mismo choque con el piso de contraste que ya se corrigió una vez. El corte en diagonal sigue evitando que el wordmark se lea completo — seguiría compitiendo con "ARCADE RICOTERO" aunque ya no esté literalmente al lado —, pero el fondo arranca recién en `h1` (color `--texto`, tested) y sigue hacia `subtitulo` (`--texto-tenue`, tested) y el botón JUGÁ (fondo sólido, no translúcido): la cabecera con el enlace "volver" y la línea de marca quedan sobre `--fondo` liso |
| `/quiz/` — pregunta, categoría **historia** | Gulp! | `gulp-trasera.jpg` | La pincelada en forma de montaña, sin texto ni el sello rojo | 10 %–35 % de ancho, 5 %–25 % de alto | Detalle recortado, en la cabecera junto al chip de categoría, sin tocar la zona de opciones (pulgar) | Categoría historia = Gulp! (`D-19`); recorte distinto al de "resultado" (mismo master, otra zona) para que dos momentos del quiz no muestren idéntica imagen |
| `/quiz/` — pregunta, categoría **mitología** | Lobo suelto | `lobo-suelto-cordero-atado-cd1-frontal.jpg` | Las mismas tiras de papel rasgado del casete del portal | Igual que la fila del casete de arriba | Detalle recortado, cabecera, sin tocar opciones | Reutilizar el mismo recorte que el casete de "Adiviná el tema" refuerza la asociación categoría↔disco en vez de fragmentarla — coherencia de marca, no ahorro de trabajo |
| `/quiz/` — pregunta, categoría **letras** | La mosca y la sopa | `la-mosca-y-la-sopa-trasera.jpg` | La misma olla de metal con el cucharón, igual recorte que el casete del portal y que `/juegos/completar-la-letra/` | Igual que la fila del casete de arriba | Detalle recortado, cabecera, sin tocar opciones | **Corrige el mismo desvío confirmado que la fila del casete (`T-71`):** recortaba antes del frontal, que `RES-44` confirmó que no es arte de Rocambole (rediseño con foto de recital). Las tres superficies de esta categoría —casete, esta pregunta, y la pantalla del juego— comparten ahora el mismo recorte real de la trasera, mismo criterio de consistencia que ya usan mitología y discos en esta misma tabla |
| `/quiz/` — pregunta, categoría **discos** | Último bondi | `ultimo-bondi-a-finisterre-frontal.jpg` | El mismo motivo metálico grabado | Igual que la fila del casete de arriba | Detalle recortado, cabecera, sin tocar opciones | Misma razón: consistencia con el casete de "Adiviná la tapa"; ojo — esto es la identidad de la *categoría* discos, no el disco real que pregunta ese ítem puntual, que puede ser cualquiera de los diez (ver "Qué no pude decidir") |
| `/quiz/` — respuesta (panel de feedback, mismo `#partida`) | El mismo que la pregunta que se está respondiendo | — (no agrega archivo nuevo) | — | — | Hereda el mismo detalle que ya está en pantalla | La respuesta no es una pantalla nueva en el DOM (`zonaPartida` se actualiza en el lugar): no tiene sentido cambiar la tapa a mitad de la misma sección. El sello de crédito de esquina persiste sin parpadeo |
| `/quiz/` — resultado (`#resultado`) | Gulp! + el lettering del logo | `gulp-frontal.jpg` (fondo) y `gulp-trasera.jpg` (logo) | Fondo: la pincelada blanca y negra del cuarto inferior derecho (igual que el casete de Redondopedia). Logo: el sello rojo manuscrito **"Gulp."**, solo, sin la lista de temas ni el texto de grabación | Fondo: 65 %–100 % de ancho y de alto del frontal. Logo: el tercio superior de la trasera, entre el texto de grabación y la lista de temas | Fondo velado (`--velo-tapa`), **solo detrás de `.puntaje` (el número grande) y del logo — corta antes de `.tramo`** + detalle recortado del logo, junto al puntaje grande | `D-19` pide explícitamente "Gulp! + el lettering del logo" para resultado y compartir — el sello rojo manuscrito de la contratapa **es literalmente ese lettering**, no una interpretación mía. **Aviso propio (`T-71`):** `.tramo` pinta según el nivel con `--acento`/`--acento-2`/`--acento-3`, y esos tres colores no tienen su par testeado contra el peor caso del velo — cálculo a mano (`D-12`) da `--acento` (naranja, tramo medio) en apenas ~4,48:1, por debajo del piso. Hasta que ese par exista en `contraste.test.ts`, el fondo no llega a `.tramo`, `.comparacion` ni a los botones: quedan sobre `--fondo` liso, donde el puntaje ya deja de estar tapado y el logo de Gulp! sigue siendo lo único que "viste" el resultado |

**Extiende a la tarjeta compartible (`UX-02`):** `D-19` dice "resultado **y compartir**" en
la misma cláusula — la tarjeta que se genera para redes hereda el mismo fondo y el mismo
logo que el resultado en pantalla. El detalle de layout de esa tarjeta es de `UX-02`, no de
este catálogo; dejo la cita para que no se pierda el mandato de `D-19`.

**Crédito:** sello de esquina, texto que cambia con la pantalla — ejemplos: en presentación
y resultado, *"Arte de tapa: Oktubre — Rocambole (Ricardo Cohen)"* y *"Arte de tapa: Gulp! —
Rocambole (Ricardo Cohen)"* respectivamente; en una pregunta de categoría discos, *"Arte de
tapa: Último bondi — Rocambole (Ricardo Cohen)"*.

### El sello de esquina, en detalle — para que `T-72`..`T-74` no vuelvan a preguntar

`UX-04` dice "chico, fijo en una esquina de la pantalla de juego" pero no dice cómo cae
sin chocar con lo que ya hay en pantalla. Esto es lo que faltaba, mirado contra el DOM
real de `partida.ts` (no una pantalla hipotética):

- **Mecanismo, sin `position: absolute` en ningún caso.** El sello se agrega como
  **último hijo del mismo contenedor flex que ya arma cada cabecera**, con
  `margin-left: auto`. Eso lo empuja al extremo derecho de la fila cuando hay lugar, y si
  no lo hay —una pregunta con insignia de rótulo *y* detalle recortado juntos, en una
  pantalla angosta— el propio `flex-wrap: wrap` que `.cabecera` ya declara (`juego.css`)
  lo baja a su propio renglón, siempre alineado a la derecha. Nunca se superpone con
  `.paso`, `.categoria` ni `.insignia`, porque nunca ocupa el mismo espacio que ellos: los
  sigue en el flujo, no se posiciona por encima.
- **Tamaño.** Una sola línea, `--fuente-rotulada` (como pide `UX-04`), tamaño menor que el
  resto de la cabecera —más chico que los 0,8 rem de `.paso`/`.categoria`, del orden de
  0,65 rem— y color `--texto-tenue`, no `--texto`: es la firma, no la información de
  juego, y no tiene que competir con la insignia de rótulo por atención. No es un botón ni
  un chip: no lleva borde de sello de goma ni área de toque (`--toque-min` no aplica —
  nadie lo toca, es una línea de crédito, igual que la del pie del sitio).
- **Dónde cae, pantalla por pantalla:**
  - **Presentación (`#portada`)**, `quiz.astro`: último hijo de
    `header.cabecera-sitio`, que ya es `display: flex; justify-content: space-between` y
    hoy solo tiene el enlace "← Volver al arcade" a la izquierda — el sello ocupa el lado
    derecho de esa misma fila, que está libre.
  - **Pregunta y respuesta (mismo `#partida`)**: último hijo de `.cabecera` (el `div` que
    ya arma `pintarPregunta()` con `.paso` + `.categoria` + `.insignia` si corresponde),
    con el mecanismo de arriba. El detalle recortado que agrega `T-73` va **antes** que el
    sello dentro de ese mismo `div` — el crédito se cuelga del detalle, como ya anota el
    plan del ciclo.
  - **Resultado (`#resultado`)**: acá no hay fila de cabecera — `zonaResultado` empieza
    directo con `.puntaje` (`partida.ts`). El sello va como **primer hijo** que se agrega
    a `zonaResultado`, antes que `.puntaje`: su propia línea, alineada a la derecha,
    `text-align: right`, sin necesitar el truco de `margin-left: auto` porque no comparte
    fila con nada.
- **Convivencia con la zona del pulgar (`UX-01`).** En las tres pantallas el sello cae en
  el **tercio superior** —parte de la cabecera o, en resultado, la línea que abre la
  pantalla— nunca en el tercio inferior donde viven las opciones de respuesta o los
  botones COMPARTIR/JUGAR DE NUEVO. No compite por espacio con ningún elemento tocable:
  la separación entre "zona de información" (arriba) y "zona de acción" (abajo) que ya
  ordena `UX-01` alcanza para que un elemento más arriba nunca invada el área que el
  pulgar necesita alcanzar sin reacomodar la mano.
- **Durante el feedback (acierto/error), no parpadea.** Como ya dice la fila de
  "respuesta" de la tabla de arriba: `zonaPartida` se actualiza en el lugar, no crea una
  pantalla nueva — el sello es el mismo nodo del DOM con el mismo texto hasta que
  `item.categoria` cambie en la próxima pregunta.

---

## 3. `/juegos/adivinar-el-tema/`

Hoy es la pantalla "en la cocina" de `US-02` (`COCINA['adivinar-el-tema']`, usa
`Base.astro`). Viste Lobo suelto (`copy.ts`: `variante: 'mitologia'`, `D-19`).

| Pantalla | Disco | Archivo master | Qué detalle | Dónde cae | Forma | Por qué |
|---|---|---|---|---|---|---|
| `/juegos/adivinar-el-tema/` | Lobo suelto | `lobo-suelto-cordero-atado-cd1-frontal.jpg` | Las mismas tiras de papel rasgado, a mayor escala que el detalle chico del portal | Igual zona que las filas anteriores (franja del cuello, mitad izquierda) | Fondo velado (`--velo-tapa`), detrás de toda la tarjeta `.cocina` | La pantalla es corta (título + un ícono + dos párrafos): un fondo proporcionado a esa tarjeta, no a todo el viewport, es coherente con que esto es una pantalla de "viene pronto", no el juego real |

**Crédito:** `Base.astro` → línea en `footer.pie-sitio`: *"Arte de tapa: Lobo suelto —
Rocambole (Ricardo Cohen)"*.

**Aviso de trazabilidad:** cuando `US-02` deje de ser una pantalla "en la cocina" y se
implemente como isla de partida (como ya es el quiz), lo más probable —siguiendo el patrón
de `UX-04`— es que deje `Base.astro`. Ese día, el crédito de esta fila migra de pie de
página a sello de esquina, y esa migración le corresponde a quien escriba el `UX-XX` propio
del juego 2 (todavía no existe).

---

## 4. `/juegos/completar-la-letra/`

Hoy es la pantalla "en la cocina" de `US-03`. Viste La mosca y la sopa (`copy.ts`:
`variante: 'letras'`, `D-19`).

| Pantalla | Disco | Archivo master | Qué detalle | Dónde cae | Forma | Por qué |
|---|---|---|---|---|---|---|
| `/juegos/completar-la-letra/` | La mosca y la sopa | `la-mosca-y-la-sopa-trasera.jpg` | La olla de metal con el cucharón asomando | La esquina superior derecha: 65 %–100 % de ancho, 20 %–55 % de alto | Fondo velado (`--velo-tapa`), detrás de la tarjeta `.cocina` | Uso la **trasera**, no el logo de la frontal ya usado en el portal/quiz, para variar el material dentro del mismo disco; recorta la olla (el objeto que da nombre al disco: "la sopa") y evita por completo la cara del chico que grita, que es la parte sensible de esa composición |

**Crédito:** `Base.astro` → *"Arte de tapa: La mosca y la sopa — Rocambole (Ricardo
Cohen)"*. Misma nota de trazabilidad que la fila anterior sobre la futura migración a sello
de esquina cuando `US-03` deje de ser cocina.

---

## 5. `/juegos/adivinar-la-tapa/`

Hoy es la pantalla "en la cocina" de `US-04`. Viste Último bondi (`copy.ts`: `variante:
'discos'`, `D-19`). **Distinción importante, ya anotada por `UX-04`:** esta identidad de
sección (Último bondi) es la del casete/placeholder, no la del juego jugable — una vez
construido, `US-04` va a mostrar fragmentos de **cualquiera** de los diez discos como
contenido de cada ronda, bajo la única condición estricta de `D-21` (la edición tiene que
estar confirmada). Esta fila cataloga solo la pantalla de hoy.

| Pantalla | Disco | Archivo master | Qué detalle | Dónde cae | Forma | Por qué |
|---|---|---|---|---|---|---|
| `/juegos/adivinar-la-tapa/` | Último bondi | `ultimo-bondi-a-finisterre-trasera.jpg` | Engranajes y tubos metálicos | La esquina superior derecha, evitando la placa de pergamino con la lista de temas y el triángulo rojo de la esquina opuesta | Fondo velado (`--velo-tapa`), detrás de la tarjeta `.cocina` | Uso la trasera (no el frontal ya usado en portal/quiz) para variar el material; los engranajes son textura pura, sin rostros ni texto legible — ideal de fondo, y no adelanta ninguna de las tapas que el futuro juego va a usar como respuesta |

**Crédito:** `Base.astro` → *"Arte de tapa: Último bondi — Rocambole (Ricardo Cohen)"*.
Cuando `US-04` deje de ser cocina, el crédito real del juego jugable **no lo resuelve esta
fila**: cada ronda va a mostrar un disco distinto y necesita su propio mecanismo (línea o
sello que nombre el disco de esa ronda específica) — queda para el `UX-XX` propio del
juego 4, todavía sin escribir.

> **Ese `UX-XX` ya está escrito: es `UX-13` (2026-09-01, `T-171`).** `US-04` dejó de ser
> cocina y pasó a ser un juego de **zoom** —ninguna tapa se muestra entera—, porque ocho de
> las diez imprimen su título en la cara frontal y el juego se ganaba leyendo.
> `Docs/UX/UX-13-zoom-de-tapas.md` cataloga los diez encuadres, uno por uno.
>
> **Esta fila no cambia:** sigue describiendo el fondo velado de la pantalla, que es otra
> cosa que la imagen que juega.

---

## 6. `/redondopedia/` — la portada

Usa `Base.astro`. Es el casete "La Redondopedia" del portal llevado a página completa; viste
Gulp! (`copy.ts`: `CASETE_REDONDOPEDIA.viste`, `D-19`: historia=Gulp!) como identidad general
de entrada, aunque adentro cada artículo cambie de color según su tipo
(`TIPO_A_CATEGORIA`).

| Pantalla | Disco | Archivo master | Qué detalle | Dónde cae | Forma | Por qué |
|---|---|---|---|---|---|---|
| `/redondopedia/` | Gulp! | `gulp-frontal.jpg` | La pincelada blanca y negra sin la letra verde (mismo recorte que el casete del portal) | La esquina inferior derecha, 65 %–100 % de ancho y de alto | Fondo velado (`--velo-tapa`), detrás de la cabecera (título + bajada + explicación de rótulos), no detrás del índice de artículos | El índice de artículos es una lista larga y crece con cada `T-XX` que agregue contenido — un fondo fijo detrás de una lista que se extiende sin límite es justo el caso que `UX-04` evita al acotar el fondo velado a una tarjeta o franja, con un tope de peso (60 KB) por imagen; la cabecera es de tamaño fijo y acotado |

**Crédito:** `Base.astro` → *"Arte de tapa: Gulp! — Rocambole (Ricardo Cohen)"*.

---

## 7. `/redondopedia/<slug>/` — la ficha de artículo

Acá hay que distinguir dos casos, porque ya se comportan distinto en el código
(`src/pages/redondopedia/[slug].astro`).

### 7a. Ficha de **disco** (`articulo.tipo === 'disco'`)

**Ya implementado, sin cambios (`UX-04`: "Ficha... sigue como está").** Cada uno de los diez
artículos de disco muestra **su propia tapa entera**, en baja, como **ficha** — no un
detalle ni un fondo de otro disco. Los diez casos:

| Slug | Archivo master (frontal) |
|---|---|
| `gulp` | `gulp-frontal.jpg` |
| `oktubre` | `oktubre-frontal.jpg` |
| `un-baion-para-el-ojo-idiota` | `un-baion-para-el-ojo-idiota-frontal.jpg` |
| `bang-bang-estas-liquidado` | `bang-bang-estas-liquidado-frontal.jpg` |
| `la-mosca-y-la-sopa` | `la-mosca-y-la-sopa-frontal.jpg` |
| `lobo-suelto` | `lobo-suelto-cordero-atado-cd1-frontal.jpg` |
| `cordero-atado` | `lobo-suelto-cordero-atado-cd2-frontal.jpg` |
| `luzbelito` | `luzbelito-frontal.jpg` |
| `ultimo-bondi-a-finisterre` | `ultimo-bondi-a-finisterre-frontal.jpg` |
| `momo-sampler` | `momo-sampler-frontal.jpg` |

**Aviso para quien mapee slug → máster en `generar-tapas.mjs`:** los dos últimos discos del
álbum doble **no** siguen el patrón `<slug>-frontal.jpg`. `lobo-suelto` sale de un archivo
llamado `lobo-suelto-cordero-atado-cd1-frontal.jpg` y `cordero-atado` de
`lobo-suelto-cordero-atado-cd2-frontal.jpg` — sin esta tabla, alguien podría buscar
`lobo-suelto-frontal.jpg` y no encontrarlo.

**Decisión — no agrego detalle ni fondo nuevo en esta pantalla.** Aunque la identidad
"discos = Último bondi" (`D-19`) también aplica al color de acento de esta página
(`articulo--discos`), no agrego un recorte de Último bondi acá: la página **ya muestra la
tapa real y completa del disco que trata**, que es la señal de identidad más fuerte posible.
Superponer un segundo disco distinto (Último bondi) como fondo confundiría cuál tapa es la
del artículo. Los diez ya tienen, además, su sticker dibujado del despiece existente
(`STICKER_DISCO` en `arte.ts`) — salvo tres, ver la sección de discos al final.

### 7b. Ficha de **hito** o **persona** (`TIPO_A_CATEGORIA` → historia → Gulp!)

| Pantalla | Disco | Archivo master | Qué detalle | Dónde cae | Forma | Por qué |
|---|---|---|---|---|---|---|
| `/redondopedia/<slug>/` (tipo `hito` o `persona`) | Gulp! | `gulp-frontal.jpg` | La misma pincelada blanca y negra del casete/portada de Redondopedia | Esquina inferior derecha, 65 %–100 % | Detalle recortado, flotante junto al título y la etiqueta de tipo, nunca detrás del cuerpo rotulado | El cuerpo de estos artículos es prosa larga con segmentos rotulados (`BR-08`) — meter un fondo detrás de eso es exactamente lo que `UX-04` advierte que no escala (peso + legibilidad en scroll largo); un detalle chico junto al título no compite con nada |

### 7c. Ficha de **concepto** o **leyenda** (`TIPO_A_CATEGORIA` → mitología → Lobo suelto)

| Pantalla | Disco | Archivo master | Qué detalle | Dónde cae | Forma | Por qué |
|---|---|---|---|---|---|---|
| `/redondopedia/<slug>/` (tipo `concepto` o `leyenda`) | Lobo suelto | `lobo-suelto-cordero-atado-cd1-frontal.jpg` | Las mismas tiras de papel rasgado del resto del catálogo | Franja del cuello, mitad izquierda | Detalle recortado, flotante junto al título, nunca detrás del cuerpo | Misma razón que 7b: prosa larga, detalle chico y no invasivo |

**Aviso de tono, criterio propio sin ficha detrás:** tres artículos de tipo `hito` tratan
temas graves — `muerte-del-indio`, `walter-bulacio`, `olavarria-2017`. Mi sugerencia es que
el detalle decorativo de 7b **se omita** en esos tres slugs puntuales, aunque la regla
general de la fila lo habilite — es una llamada de tono, no de legibilidad, y la dejo
marcada para que `contenido` (dueño de `CNT-04`, el límite editorial sobre estos casos) la
confirme o la descarte.

**Crédito, en ambos casos (7b y 7c):** `Base.astro` → línea en `footer.pie-sitio` con el
disco correspondiente a esa página puntual (no los cinco del portal — acá es una sola
tapa por artículo).

---

## Los diez discos, uno por uno: dónde aparece cada uno

| Disco | Dónde aparece hoy (según este catálogo) |
|---|---|
| **Oktubre** | `/` (franja inferior fija + detalle casete quiz), `/quiz/` presentación (fondo), su propia ficha |
| **Gulp!** | `/` (detalle casete Redondopedia), `/redondopedia/` (fondo), artículos hito/persona (detalle), `/quiz/` pregunta-respuesta categoría historia (detalle) y resultado/compartir (fondo + logo), su propia ficha |
| **Lobo suelto** | `/` (detalle casete tema), `/quiz/` pregunta-respuesta categoría mitología (detalle), `/juegos/adivinar-el-tema/` (fondo), artículos concepto/leyenda (detalle), su propia ficha |
| **La mosca y la sopa** | `/` (detalle casete letra), `/quiz/` pregunta-respuesta categoría letras (detalle), `/juegos/completar-la-letra/` (fondo), su propia ficha |
| **Último bondi a Finisterre** | `/` (detalle casete tapa), `/quiz/` pregunta-respuesta categoría discos (detalle), `/juegos/adivinar-la-tapa/` (fondo), su propia ficha |
| **Un baión para el ojo idiota** | Solo su propia ficha (con sticker dibujado `muneco-antifaz.png`, ya existente) |
| **¡Bang! ¡Bang!... Estás liquidado** | Solo su propia ficha — **sin sticker dibujado tampoco** (ver más abajo) |
| **Cordero atado** | Solo su propia ficha (con sticker dibujado `cordero-rulo.png`, ya existente) |
| **Luzbelito** | Solo su propia ficha (con sticker dibujado `luzbelito-vela.png`, ya existente) |
| **Momo Sampler** | Solo su propia ficha (con sticker dibujado `banda-superheroes.png`, ya existente) |

Los diez aparecen en al menos una pantalla, como exige la tarea. Los cinco que no entran en
el mapa de `D-19` (Un baión, ¡Bang! ¡Bang!, Cordero atado, Luzbelito, Momo Sampler) llegan
únicamente vía su ficha propia, porque ese es el único punto del sitio donde tienen una
sección dedicada — no hay hoy una pantalla de "todos los discos" ni un cruce narrativo que
los use como acento de fondo. Si esa pantalla apareciera (un futuro índice de discos, una
línea de tiempo), ahí es donde estos cinco ganarían su primera fila de detalle/fondo.

**Caso aparte, `¡Bang! ¡Bang!... Estás liquidado`:** es el único de los diez sin ningún
acento hoy, ni siquiera dibujado — no está en `STICKER_DISCO` de `arte.ts` ni en ninguna de
las dos listas de `public/arte/README.md`. No lo resuelvo acá (ese despiece es del hilo
principal, no mío), pero lo dejo escrito para que no se pierda: su ficha en la Redondopedia
es, hoy, la única de las diez sin decoración propia además de la tapa.

---

## Qué NO pude decidir, y quién lo decide

- **Los recortes exactos en píxeles.** Di fracciones y descripciones ("la esquina inferior
  derecha, 65 %–100 %"); el recorte real en píxeles lo hace quien produzca los derivados con
  `scripts/generar-tapas.mjs` extendido (`T-45` ya lo dejó pendiente, en ese orden: diseño →
  `tokens.css` → test).
- **Si el detalle decorativo se omite en los tres artículos de tono grave** (sección 7c) —
  dejo la sugerencia, la confirma `contenido` (dueño de `CNT-04`).
- **El sticker faltante de ¡Bang! ¡Bang!... Estás liquidado** — no es mi carpeta
  (`public/arte/README.md`), lo dejo señalado, no resuelto.
- **El `UX-XX` propio del juego 4 jugable** (qué tapa exacta usa cada ronda, en qué forma,
  cómo se acredita ronda por ronda) — esta fila solo cubre la pantalla "en la cocina" de
  hoy; el juego real necesita su propio documento, todavía sin escribir.
- **La migración de crédito de pie a sello** cuando `US-02`, `US-03` y `US-04` dejen de usar
  `Base.astro` (si siguen el patrón del quiz) — la anoto como aviso en cada fila que
  corresponde, pero la ejecuta quien escriba esas islas.
- **Si `--velo-tapa-titular` (75 %) llega a usarse alguna vez** — hoy ninguna pantalla real
  calza (todas mezclan texto de cuerpo); queda como token vivo pero sin caso de uso en este
  catálogo.
- **La ficha de disco de *La mosca y la sopa* (§7a) muestra `la-mosca-y-la-sopa-frontal.jpg`
  entero, el mismo archivo que `RES-44` descarta para el resto del disco por no ser arte de
  Rocambole.** No lo cambio acá: el mapeo slug→máster de `generar-tapas.mjs` es código, y
  qué imagen ilustra el artículo del disco toca también el texto de `contenido` sobre esa
  tapa — no es una fila que yo pueda mover sola sin pisar esas dos carpetas. Lo dejo escrito
  para que no se lea como un descuido: es el mismo problema que el desvío 1, en una
  superficie que el hilo principal no tocó esta vez.
- **Los tres pares de `.tramo` (`--acento`, `--acento-2`, `--acento-3`) contra el peor caso
  del velo no están en `contraste.test.ts` todavía.** El cálculo a mano de `UX-04` v4 dice
  que `--acento-2` y `--acento-3` sobran y que `--acento` da ~4,48:1 — por debajo del piso,
  aunque por un margen chico como para no pedir que se corra el test antes de confiar en el
  número. Mientras no estén, la fila de `/quiz/` — resultado corta el fondo velado antes de
  llegar a `.tramo`; si algún día se agregan esos pares y pasan, esa restricción se puede
  levantar, pero es una decisión de quien corra el test, no mía.

---

## Trazabilidad

Este documento no deroga ni reescribe `UX-04`: aplica sus tres formas, su piso de
legibilidad y su mecanismo de crédito a las siete superficies reales del sitio de hoy. Cuando
una pantalla nueva se agregue (un juego que deja de ser cocina, un índice de discos futuro),
este catálogo suma una fila — no cambia las que ya existen, salvo que el propio `UX-04`
cambie primero.

**Ciclo 5, `T-71`:** dos filas de esta versión corrigen desvíos que confirmó el hilo
principal al implementar la v1 (`letras` a la trasera de *La mosca y la sopa*; el fondo de
Oktubre a la franja inferior), y dos más se adelantan a un desvío del mismo tipo antes de
que `T-72` lo construya (la marca-rojo de la presentación, los acentos de tramo del
resultado). Ninguna cambia una decisión de fondo: todas aplican, contra pantallas reales,
reglas que `UX-04` ya tenía escritas.
