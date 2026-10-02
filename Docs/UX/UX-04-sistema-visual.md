# UX-04 — Sistema visual: paleta, tipografía, línea, brief de arte original

> Rol dueño: `experiencia`. Consume `D-04` (estética mixta), `Docs/BRIEF.md`
> (iconografía suelta, no una tapa concreta), y las fichas de `investigador` sobre
> Rocambole: **`RES-06`** (`Docs/INVESTIGACION/INV-02-banda-cultura-estetica.md`) y
> **`RES-22`** (`Docs/INVESTIGACION/INV-20-fuentes-primarias.md`, sube tres tapas de
> "reportado" a testimonio). El bloqueo que esta pieza tenía anotado —sin ninguna ficha
> de referencia sobre Rocambole— está **levantado desde `RES-06`** (2026-08-19); esta
> versión lo incorpora (`T-25`, ciclo 2).

> **v3 — `T-45`, ciclo 4.** `D-21` derogó la fila de esta hoja que limitaba las tapas
> reales al juego "adivinar la tapa" y las prohibía como fondo. Esta versión reescribe
> esa fila y agrega la sección **"Tapas reales en toda la pantalla"**, con las tres
> formas en que una tapa puede aparecer, el piso de legibilidad convertido en número de
> contraste, y el mecanismo de crédito para cuando la tapa es fondo o detalle en vez de
> ficha. Todo lo demás de esta hoja —paleta, tipografía, línea, espaciado, brief de arte
> original— queda igual. Suma a lo que consumo: `Docs/DECISIONES.md` `D-21`, `D-19`
> (la mezcla, la base que no rota), `public/arte/README.md` (el despiece de recortes
> existente) y `src/styles/tokens.css` (los tokens ya nombrados).

> **v4 — `T-71`, ciclo 5.** Dos correcciones, ninguna de fondo. **(1)** Los números de
> píxeles y de peso de "Tapas reales en toda la pantalla" bajan al techo real del
> material: los másters miden 953×953 px (frontales) y 1181×929 px (traseras), y ningún
> recorte del catálogo de `UX-05` llega a los 480/640 px que esta hoja pedía antes de que
> hubiera másters reales contra los cuales medir — el rango real de hoy es **210–591 px**,
> muy por encima del destino real en pantalla (34–96 px). El detalle está en cada punto de
> la sección. **(2)** Nuevo corolario en "El piso de legibilidad": el par testeado hoy
> contra el peor caso del velo es solo `--texto`/`--texto-tenue` — cualquier otro color de
> texto (`--marca-rojo`, los acentos de tramo) no tiene su par y no se pone detrás de un
> fondo velado hasta que lo tenga. `UX-05` v2 aplica esto a dos pantallas del quiz que
> todavía no se habían construido cuando escribí la v3. Suma a lo que consumo:
> `Docs/SUGERENCIAS/HILO-para-experiencia-desvios-de-UX-05.md` (los dos desvíos que
> confirma `UX-05` v2) y `src/lib/contraste.test.ts` (leído entero antes de escribir esta
> versión, no solo citado de memoria).

> **v5 — `T-317`, ciclo 17.** No cambia ninguna regla de esta hoja. Agrega al final la
> sección **"Mapa sección→disco"**, que `D-19` dejó en manos de `experiencia` y que esta hoja
> nunca tuvo escrita: cada hoja de un juego decidió su fila (`UX-06` §5, `UX-23` §4.1,
> `UX-30` §2, `UX-34` §1) y tres dejaron anotado que el mapa maestro de acá no la incluía
> todavía (`UX-06` §8, `UX-23` §11, `UX-34` §10). Queda completo y contra el código del
> 2026-10-02, con la regla nueva de `D-54`: cada página de juego viste el disco de su casete
> (`.juego--*` es el mismo mapa que `.casete--*`). Suma a lo que consumo: `D-54`, `UX-35`
> `§4.1`, `src/lib/sitio/copy.ts` y las variantes de `src/styles/sitio.css`.

**Resuelve:** `D-04` (arte original en lenguaje rocambolesco para la interfaz) y `D-21`
(las tapas reales entran a cualquier pantalla, con piso de legibilidad y crédito
propios).

## Cómo leer este documento

Regla de trazabilidad, motivada por `FIND-05` en otra carpeta (una nota de derechos que
afirmaba "obra registrada" con casilla marcada y sin ninguna ficha detrás — un supuesto
que se volvió hecho por repetición): **toda afirmación sobre la obra o la técnica de
Rocambole cita `RES-06` o `RES-22`. Toda decisión de diseño que no sale de una ficha
—color exacto, tipografía puntual, si las figuras son "deformes"— se marca
explícitamente como criterio propio de `experiencia`.** No hay una tercera categoría.

## Quién es Rocambole, y por qué "en el lenguaje de Rocambole" ahora es una instrucción y no una frase

*(Todo este bloque, `RES-06`.)* Rocambole es **Ricardo Cohen** (12-may-1943), formado en
serigrafía y egresado de Bellas Artes de la UNLP; hizo **toda** la identidad visual de la
banda desde 1978 —tapas, afiches, escenografías, videos— y ganó el **premio ACE al mejor
diseño de portada por *Luzbelito***. Trabaja de forma **artesanal: rodillo, serigrafía,
aerografía, grabado, collage e ilustración**; desde 1996 suma **arte digital y
animación**. Su lenguaje mezcla **anarquismo, iconografía revolucionaria y raíz
popular**, y concibe cada tapa como **objeto artístico, declaración política y pieza
pensada para la reproducción masiva** — no como decoración de lo que ya existe.

La frase que ordena el criterio entero, textual: ***"yo no ilustraba la poesía o la
música, sino que era una parte integrante del mensaje"*** (`RES-06`). Consecuencia
directa para quien produzca el arte de este sitio: una pieza nueva no ilustra la
pantalla en la que vive — el ícono de acierto, el motivo del reveal, el personaje de
portada tienen que poder leerse como parte del mensaje de esa pantalla (qué se festeja,
qué se revela, qué tono tiene el sitio), no como un adorno pegado encima después. Es la
frase que le da una instrucción ejecutable a "en el lenguaje de Rocambole", que hasta
esta ficha era solo una descripción de estilo.

## Regla que ordena todo lo demás

Dos materiales que **siguen sin mezclarse dentro de la misma pieza** — un ícono no es
mitad dibujo mitad recorte de foto — pero que ya no están separados por pantalla desde
`D-21`:

| Material | Dónde aparece | Cómo |
|---|---|---|
| Arte original rocambolesco | Toda la interfaz: portada, quiz, botones, íconos, tarjeta de resultado, reveal de audio | Libre, sin límite de resolución ni crédito obligatorio (es obra nueva) |
| Tapas reales | **Cualquier pantalla del sitio**, en tres formas — detalle recortado, fondo velado, ficha (`D-21`) | Baja resolución siempre; crédito a **Rocambole (Ricardo Cohen)** obligatorio en las tres formas, con mecanismo propio según la forma; legibilidad AA no negociable cuando hay texto encima. Detalle completo en la sección siguiente |

## Tapas reales en toda la pantalla (`D-21`)

`D-04` decía "tapas reales solo en el juego que las necesita, nunca como fondo
decorativo de otra pantalla". El usuario derogó esa restricción en `D-21` y pidió
explícitamente lo contrario: *"integrar las tapas reales a la página, utilizar los jpg
reales. Recortarlos y usar detalles o usarlos de fondo."* Lo que sigue es la fila nueva,
completa, y reemplaza a la vieja en todo lo que este documento manda.

Lo que **no** cambió: la baja resolución y el crédito siguen siendo de `D-04`, y siguen
sin negociarse. Lo que cambió es únicamente el "dónde".

### Las tres formas

**1. Detalle recortado.** Un pedazo de la tapa real (foto, no dibujo), tratado como
recorte pegado: borde rasgado o borde grueso de serigrafía, rotación leve — el mismo
tratamiento que ya usa `public/arte/README.md` para sus piezas dibujadas, aplicado ahora
a un recorte fotográfico de verdad. **El número que manda es el techo del máster, no un
objetivo elegido a priori** (corrección de `T-71`, ciclo 5, sobre la versión anterior de
este párrafo). Los másters reales miden **953×953 px** (frontales) y **1181×929 px**
(traseras) — el generador no agranda nunca (agrandar una foto la hace papilla) y avisa
por consola si un recorte pedido no entra. Con ese material, el catálogo de hoy
(`UX-05`) recorta entre **591 px** (el caso más generoso) y **210 px** (el más ajustado:
la bandera suelta de Oktubre del casete del portal) de lado largo — nunca los 480 px que
esta hoja pedía cuando todavía no había másters reales contra los cuales medir. No es un
problema: el destino real en pantalla es mucho más chico que cualquiera de esos dos
números —**34 px** en un casete, **96 px** en una ficha de artículo—, así que hasta el
recorte más ajustado sobra con margen. Los 480 px quedan como tope de referencia para si
algún día hace falta un recorte más generoso, no como una meta que el material de hoy
tenga que alcanzar. Nunca un rectángulo liso pegado tal cual — eso es la condición 3 de
`D-21`, ver "Qué sigue prohibido" más abajo.
Si el detalle queda detrás o pegado a texto (no solo flotando en un margen, como ya
hacen `perro.png` o `mosca.png`), rige el mismo piso de legibilidad que el fondo velado:
no es una forma exenta del contraste, es la misma regla aplicada donde haga falta.

**Importante, para no confundir con lo que ya existe:** las piezas de
`public/arte/README.md` (`mosca.png`, `perro.png`, `multitud-banderas.png`, etc.) son
**arte original redibujado** en el lenguaje de Rocambole — la mitad de arriba de la
tabla, sin crédito obligatorio porque son obra nueva. El "detalle recortado" de `D-21`
es otra cosa: un recorte fotográfico literal del jpg real de `Docs/INVESTIGACION/
TapasDiscos/`. Se ve parecido en el resultado final (mismo borde rasgado, misma
rotación) pero es material distinto y **el detalle recortado sí lleva crédito
obligatorio**, siempre, porque es la obra real y no una interpretación.

**2. Fondo velado.** La tapa detrás del contenido — nunca a sangre completa (ver "Qué
sigue prohibido"): un recorte acotado a una tarjeta o una franja, no al viewport entero,
con el mismo tratamiento de borde que el resto del proyecto y un velo que garantiza que
el texto de encima se siga leyendo. **El mismo techo real que el punto 1** (`T-71`,
ciclo 5): con másters de 953×953 / 1181×929 px, el catálogo de hoy tampoco llega a los
640 px que esta hoja pedía — comparte el mismo rango real de **210–591 px** del punto
anterior, porque son las mismas dos formas compitiendo por el mismo material. 640 px
queda como tope de referencia, no como objetivo: nada del sitio de hoy lo necesita, y el
velo además tapa buena parte de la definición de cualquier imagen que haya debajo.
**Tope de 60 KB por imagen** (JPEG, calidad orientativa 65–70 a ajustar por quien la
genere para no pasar el tope) — este número sí sigue siendo el que importa no cruzar,
aunque tampoco lo roza nadie hoy: el archivo más pesado del catálogo pesa **53 KB**. No
bajo el tope porque es margen, no aspiración — pero si algún derivado futuro se acerca a
60 KB es señal de revisar ese recorte puntual, no de que el número esté mal puesto. Es
un número bajo a propósito: `D-15` midió el sitio actual en **11 KB comprimidos por
visita, tres archivos completos** — una sola imagen de fondo ya pesa varias veces esa
página entera, así que 60 KB es una concesión grande, no un número libre. Si una
pantalla usa dos tapas de fondo a la vez (caso raro, por ejemplo un enlace entre un
juego y la ficha de ese disco), cada imagen respeta el tope por separado. El comando
`node scripts/generar-tapas.mjs` ya imprime ancho y KB por archivo generado; extenderlo
para producir también el derivado de fondo (y el de detalle) hereda gratis esa misma
verificación — la corre el hilo principal, no yo (`D-12`).

**3. Ficha.** La tapa entera en baja, como ya está en la Redondopedia hoy: **320 px del
lado largo**, sin cambios — es el uso que menos agrega, porque ya existe y ya cumple
`D-04`.

### El piso de legibilidad, como número

Texto sobre tapa velada **pasa WCAG AA o no va.** Dos umbrales, los que fija el propio
estándar:

- **Texto normal: contraste mínimo 4,5:1.**
- **Texto grande** (≥ 24 px regular, o ≥ 18,66 px en negrita — el corte estándar de
  WCAG, no uno mío): **contraste mínimo 3:1.**

El velo **no es una opacidad elegida a ojo en cada pantalla** — es un token de
`tokens.css`, con su par en `contraste.test.ts`, igual que cualquier otro color del
sistema. Propuesta de familia `--velo-tapa-*`, reutilizando la tinta que ya existe
(`--fondo`) en vez de sumar un hex nuevo — coherente con que `tokens.css` es "el único
lugar del repo donde puede vivir un hex" y con que la base no rota (`D-19`):

| Token | Qué es | Alfa mínimo | Uso |
|---|---|---|---|
| `--velo-tapa` | `--fondo` con transparencia | **86 %** | Default: cualquier texto de cuerpo (enunciados, párrafos, pie) sobre tapa de fondo |
| `--velo-tapa-titular` | `--fondo` con transparencia | **75 %** | Solo cuando lo único que hay encima es texto grande en `--fuente-titular`/`--fuente-rotulada` — nunca para texto de cuerpo |

**Es un color plano con alfa, una sola capa — no dos.** Lo descarté a propósito: un velo
en dos capas (por ejemplo, un degradado) da un contraste distinto en cada punto de la
imagen, y eso no se puede resumir en un número que un test corra una sola vez. Un color
plano sí, porque se puede acotar por el **peor caso**: aunque la tapa tenga un píxel
blanco puro debajo (el caso menos favorable posible, más claro que cualquier tapa real
completa), el 86 % de alfa todavía deja el resultado por debajo del techo de luminancia
que exige 4,5:1 contra `--texto` (#f4efe2). La cuenta, para que quien la implemente no
tenga que rehacerla: con `--fondo` de luminancia ≈0,0055 y `--texto` de luminancia
≈0,865, el peor caso (fondo = blanco puro, luminancia 1) da contraste 4,5:1 en alfa
≈0,852 — dejo 86 % con margen. Para el 3:1 de texto grande el mismo cálculo da alfa
≈0,749 — dejo 75 % con margen. Es un cálculo a mano, no una corrida (`D-12`); el comando
que lo cierra es `node --test src/lib/contraste.test.ts`, y lo corre quien lo implemente.

**El par que se testea es "tinta sobre tapa velada", no "tinta sobre una tapa real
puntual".** No se puede testear cada jpg —son 35 imágenes y cualquiera nueva rompería
el test en silencio—, así que el par que entra a `contraste.test.ts` es el **peor caso
matemático**: `--velo-tapa` (o `--velo-tapa-titular`) compuesto sobre blanco puro, contra
`--texto`. Si ese par pasa, cualquier tapa real —que nunca es un plano blanco liso—
pasa también, porque ninguna va a ser más clara que el peor caso que ya se testeó. La
tinta que se usa siempre es `--texto` (el claro sobre fondo oscuro que ya define la
base): la base no rota (`D-19`), así que no hace falta un segundo color de tinta para
tapas de sección — sería otro par a mantener por ningún beneficio real.

**Corolario (`T-71`, ciclo 5): el par testeado es `--texto`/`--texto-tenue`, no
"cualquier tinta del sistema".** Al aplicar esta regla a pantallas reales que todavía no
existían cuando escribí la versión anterior (`UX-05` v2: la presentación y el resultado
del quiz), aparecieron dos colores que conviven con un fondo velado sin tener su par
testeado contra el peor caso: `--marca-rojo` (ya prohibido explícitamente más abajo, con
test propio) y los tres acentos que pinta el tramo de resultado (`--acento`, `--acento-2`,
`--acento-3`). Cálculo a mano, no corrida (`D-12`), con los valores reales de
`tokens.css`: `--acento-2` (oro, tramo bajo) y `--acento-3` (verde, tramo alto) dan de
sobra; **`--acento` (naranja, tramo medio) da apenas ~4,48:1 contra el peor caso — por
debajo del piso de 4,5:1, aunque el margen es tan chico que conviene confirmarlo con el
test antes de confiar en el número.** Mientras ese par no esté en `contraste.test.ts`, la
regla de `experiencia` es no arriesgarlo: **un fondo velado no se extiende detrás de
texto que no sea `--texto`/`--texto-tenue`**, aunque eso signifique que cubra menos
pantalla de la que cubriría a sangre completa. `UX-05` v2 acota dónde llega el fondo en
las dos pantallas reales que lo necesitan, siguiendo esta misma regla.

**Circuito, para que quede explícito:** estos dos alfas son criterio propio de
`experiencia` (igual que la paleta y la tipografía de más abajo, sin ficha detrás),
calculados contra tokens que ya existen. El circuito real de `.claude/rules/
diseno-marca.md` pide reflejarlos primero en el lienzo (hoja 05) y de ahí a
`tokens.css` — dejo la propuesta acá para que quien actualice el lienzo no arranque de
cero, no para saltear ese circuito.

### El mecanismo de crédito, cuando la tapa es fondo o detalle

La ficha ya resuelve su crédito: la imagen entera va con una línea de texto visible al
lado, como hoy en la Redondopedia — **eso no cambia**. El problema nuevo es el fondo y
el detalle: no tienen un margen al lado para poner una firma, y una pantalla puede
llegar a usar dos tapas distintas a la vez.

**Regla, por tipo de pantalla — para que un desarrollador la implemente sin volver a
preguntar:**

- **Pantallas que usan `src/layouts/Base.astro`** (portal, Redondopedia, pantallas de
  "cocina" — todo lo que no es la isla de una partida): el crédito va en el **pie del
  sitio que ya existe** (`footer.pie-sitio`). Cuando la pantalla usa una tapa como fondo
  o detalle, el pie suma **una línea más**, generada a partir de qué tapas se usaron en
  *esa* pantalla — no una firma por imagen. Patrón de texto: *"Arte de tapa: {Disco} —
  Rocambole (Ricardo Cohen)"*; si hay dos tapas en la misma pantalla, se unen en la
  misma línea (*"Arte de tapa: {Disco A} y {Disco B} — Rocambole (Ricardo Cohen)"*) — el
  crédito es a la persona, no por archivo, así que su nombre aparece **una sola vez**
  aunque haya varias tapas.
- **Islas de partida sin `Base.astro`** (el quiz ya funciona así, y previsiblemente los
  otros tres juegos): no hay pie de página real durante la partida, y agregar uno rompe
  el presupuesto de pantalla que defiende `UX-01` (todo en el tercio de pulgar, sin
  scroll). Ahí el crédito va como **sello de esquina**: chico, fijo en una esquina de la
  pantalla de juego, mismo patrón de texto, tipografía `--fuente-rotulada` (no compite
  con el enunciado ni con las opciones). Es la combinación que pide el enunciado de la
  tarea: pie de página donde hay pie de página, sello donde no lo hay — nunca las dos
  cosas en la misma pantalla, y nunca ausente en ninguna.
- **Ficha (tapa entera):** sigue como está, crédito visible junto a la imagen. No
  necesita ni pie ni sello nuevos.

### Qué sigue prohibido, y por qué

- **La imagen a sangre completa con velo oscuro y texto blanco al medio.** Es
  exactamente el tic genérico que ya veta `.claude/rules/diseno-marca.md` — la interfaz
  por defecto de cualquier plantilla, con o sin foto real debajo. Usar una tapa real
  **no habilita** a resolverla como la resolvería cualquier plantilla: sigue rigiendo
  "la pieza se recorta por borde grueso y cinta, como recorte pegado", no la foto a
  sangre completa.
- **El máster sin reducir llegando al sitio.** `D-04` puso "baja resolución" como piso
  no negociable, y sigue siéndolo: un máster de varios miles de píxeles multiplica el
  peso de carga (contra el mobile-first de sesiones de 2-3 min) y publica la copia de
  mayor fidelidad posible de la obra del artista, que es lo opuesto de lo que la baja
  resolución existe para lograr.
- **El esclavo encadenado de *Oktubre*, mientras siga "reportado, no verificado"
  (`RES-06`).** No está confirmado si esa figura integraba el arte original del vinilo
  del 86 o si llegó recién con la reedición en CD. `public/arte/README.md` ya lo prohíbe
  para la versión dibujada; `D-21` no abre una puerta nueva acá — si algo, un recorte
  fotográfico literal de esa figura puntual está *más* expuesto que una versión
  redibujada, no menos, así que la prohibición se mantiene con el mismo peso.
- **Una tapa real reemplazando al personaje suelto de portada.** El perro y la mosca son
  motivos sueltos, no una escena citando una tapa puntual — la regla del kickoff sigue
  viva. `D-21` habilita fondo, detalle y ficha; no habilita que la composición entera de
  una tapa pase a ser el ícono central de la portada.
- **Un recorte rectangular liso, sin borde propio del proyecto, pegado tal cual.** Es la
  condición 3 de `D-21` en otras palabras: la forma sigue siendo la del proyecto (borde
  rasgado, serigrafía, rotación) — un rectángulo derecho sin tratamiento es el mismo
  olor genérico, solo que con material real en vez de un stock cualquiera.
- **Usar una tapa cuya edición no esté confirmada como respuesta correcta del juego
  "adivinar la tapa".** Esto no lo defino yo acá en detalle —el flujo del juego 4 todavía
  no tiene su propio `UX-XX`— pero lo repito porque `D-21` lo deja como lo único
  estricto del cambio: si el archivo es un CD yanqui del 93 y la respuesta dice LP
  argentino del 86, el juego le marca error al que se sabe el disco (`RES-25` ya cazó
  ese caso con *Oktubre*). No es cautela legal, es la misma regla de `D-14` sobre
  respuestas correctas.

### Trazabilidad: qué decía esta regla antes, y por qué

La fila que esta versión reemplaza decía, textual: *"Tapas reales | Solo el juego
'adivinar la tapa o el disco' | Baja resolución, con crédito visible que nombra a
Rocambole (Ricardo Cohen), nunca como fondo decorativo de otra pantalla."*

**`D-21` la derogó.** La derogó el usuario directamente, no un hallazgo de
`investigador` ni un cambio de ficha.

**Por qué esa restricción sobrevivió al encuadre que la justificaba.** Nació bajo
`D-04`, en un momento en el que `D-07` todavía existía: el gate que separaba "construir"
de "publicar" y que frenaba todo lo que tocara derechos hasta cerrar una nota legal. La
cautela de "nunca como fondo" era una cautela de publicación, escrita cuando publicar
todavía dependía de resolver ese gate. `D-14` sacó ese cerrojo —fan site sin fines de
lucro, riesgo asumido, si llega un reclamo se baja— y reencuadró el proyecto entero,
pero la frase de `UX-04` quedó escrita como estaba: nadie la revisó porque nada la
obligó a revisarse hasta que el usuario la chocó de frente al pedir tapas de fondo en el
kickoff del ciclo 4. Es el mismo patrón que ya describió `D-21` en su propio texto: una
regla de diseño puede sobrevivir, en silencio, al motivo que la hizo necesaria.

## Paleta — criterio propio, sin ficha que fije colores

Ni `RES-06` ni `RES-22` describen una paleta de color ni la identidad cromática de
Rocambole. Lo que sigue es **decisión de `experiencia`**, heredada de la descripción
general de `D-04`/BRIEF ("paleta psicodélica saturada"), **no una referencia
verificada sobre su obra**.

Psicodélica saturada, no pastel. Base oscura para que los acentos exploten en contraste,
no una paleta clara con toques de color.

| Uso | Color (descripción, no hex — el hex final lo fija quien produce el arte) |
|---|---|
| Fondo base | Oscuro, casi negro con matiz cálido (no negro puro de pantalla apagada) |
| Acento 1 | Magenta saturado |
| Acento 2 | Verde ácido |
| Acento 3 | Naranja quemado |
| Acento 4 | Azul eléctrico |
| Estado acierto | Verde ácido (mismo acento 2, no un verde distinto) |
| Estado error | Un rojo saturado, único color reservado para error — no se reusa en nada más |

Nota de accesibilidad (ya en el checklist de `UX-01`): saturado no exime de contraste
alto entre texto y fondo.

## Tipografía — criterio propio, sin ficha sobre lettering

`RES-06` no ficha ninguna referencia sobre tipografía o rotulado de Rocambole — ningún
hallazgo describe cómo titula o rotula sus piezas. Lo que sigue sigue siendo **decisión
de `experiencia`**, coherente con lo artesanal de su técnica (eso sí confirmado,
`RES-06`) pero no una referencia tipográfica verificada.

Dos familias, nunca mezcladas dentro del mismo bloque de texto:

- **Dibujada / rotulada a mano**, con textura de trazo grueso tipo fanzine o serigrafía:
  para títulos, nombres de botón corto ("JUGÁ", "COMPARTIR") y el puntaje grande de la
  tarjeta de resultado. Nunca para texto largo — se vuelve ilegible en pantalla chica.
- **Sans legible de sistema**: para el enunciado de las preguntas, las opciones de
  respuesta y cualquier texto de más de una línea.

## Línea y tratamiento

- **Contorno grueso, tipo grabado o serigrafía** — confirmado por ficha: son dos de las
  técnicas reales de Rocambole (`RES-06`: "rodillo y serigrafía; también aerografía,
  grabado, collage e ilustración"). Nunca línea fina de ilustración vectorial genérica.
- **Instrucción ejecutable para quien produce en digital:** emular la textura de
  rodillo/serigrafía/grabado (grano, imperfección de borde) en vez de vector limpio.
  `RES-06` fichó que el propio Rocambole suma arte digital desde 1996, así que producir
  en digital no traiciona la referencia — producir en vector liso sí.
- **Collage como técnica de fondo** — confirmado por ficha: el collage es una de sus
  técnicas reales, no una interpretación libre de la descripción del BRIEF (`RES-06`).
  Texturas superpuestas, recortes — y desde `D-21` el collage puede incluir una foto
  real de tapa (detalle recortado o fondo velado, ver esa sección más arriba), siempre
  con su crédito y su velo de legibilidad. Antes de `D-21` esto se leía "nunca una foto
  real de por medio salvo la tapa del juego 4"; esa frase queda derogada.
- **Figuras deformes, orgánicas, nunca geometría perfecta ni íconos de librería
  estándar — criterio propio, no confirmado por ficha.** Ni `RES-06` ni `RES-22`
  describen la figura de Rocambole como "deforme"; venía de la descripción general del
  BRIEF, sin verificación en ese momento. La mantengo porque no contradice nada de lo
  fichado (línea artesanal, iconografía popular), pero la marco para que no se lea como
  más verificada de lo que es.
- **Capa simbólica — agregado por `RES-06`, no estaba en la versión anterior:**
  anarquismo, iconografía revolucionaria y raíz popular. No es solo tratamiento de
  línea, es contenido. Habilita motivos como banderas, tipografía de panfleto, símbolos
  de protesta genéricos y elementos de cultura popular — sueltos, sin citar una escena
  puntual (ver debajo).
- **Personajes y símbolos sueltos, no una escena citando una tapa puntual** — así lo
  pidió el usuario en el kickoff: menos citable, más libre, y de paso menos expuesto al
  riesgo de derechos que ya es el riesgo número uno del proyecto. Sigue vigente sin
  cambios.
  - **Motivo suelto ya fichado y disponible: el perro.** `RES-06` cita a Rocambole
    explicando la tapa de *Un baión para el ojo idiota* y agregando que "en toda la
    mitología solariana hay un perro"; `RES-22` lo confirma de forma independiente,
    llamándolo "una constante de la literatura solariana". Es un motivo transversal que
    el propio autor describe como recurrente en toda su obra, no un elemento exclusivo
    de esa tapa — candidato razonable para el set de íconos o el personaje de portada.
    **Cuidado al usarlo:** un perro suelto cumple la regla del kickoff; reproducir la
    composición específica de esa tapa (perro + televisor + el muñeco con antifaz) no
    la cumple, porque eso sí sería citar una escena puntual.
  - **Motivo que NO se usa como referencia todavía, y por qué:** el esclavo encadenado
    de *Oktubre* —la imagen más icónica de todo el universo ricotero— sigue en
    **"reportado, no verificado"** en `RES-06`: no está confirmado si integraba el arte
    original del vinilo o si llegó recién con la reedición en CD. Hasta que eso se
    cierre con una fuente mejor, no lo uso como referencia puntual de un ícono nuevo —
    sería construir el brief sobre un dato que la propia ficha pide no publicar todavía.

## Fuera del brief, con nombre y ficha — para que nadie lo use por error

- **El documental "Rocambole en el camino" (abril de 2026) y el libro "Rocambole: Arte,
  Diseño y Contracultura" (2026)** (`RES-06`) son **contexto actual, no obra de los
  80**. No son referencia estética para esta pieza: la interfaz busca el lenguaje de las
  tapas y afiches originales, no el material promocional o retrospectivo de 2026.
- **La postura pública de Rocambole sobre el uso de su obra.** `RES-06` cita
  textualmente: *"siempre me encantó la reproductibilidad del arte, que todos puedan
  tener acceso a mi obra"*. Es **contexto, no permiso** — la propia ficha lo dice: una
  declaración favorable no prueba titularidad ni autoriza un uso puntual, y parte de lo
  que dice sobre no creer en la propiedad intelectual está además marcado como
  "reportado, sin cita textual localizada", no verificado. La cito acá solo porque
  explica por qué "figuras sueltas, no citas de tapa" ya era una postura conservadora
  antes de que existiera esta ficha, y para que ninguna lectura futura de este documento
  la use como luz verde. La decisión legal sobre qué se puede usar es de `contenido`
  (nota de derechos, gate `D-07`), no de `experiencia`.

## Espaciado (para el pulgar)

- Zona pulgar: el 25–30% inferior de la pantalla reservado para la acción principal de
  cada pantalla (botón de jugar, de responder, de compartir).
- Objetivo de toque mínimo: 44×44 px.
- Separación mínima entre botones adyacentes para evitar toques accidentales con una
  sola mano sosteniendo el celular.

Sin cambios respecto a la versión anterior: es criterio de `experiencia` sobre ergonomía
móvil y no depende de ninguna ficha sobre Rocambole.

## Brief de arte original (para que el usuario decida cómo se produce)

| Pieza | Qué transmite | Dónde se usa |
|---|---|---|
| Personaje/ícono suelto de portada | Bienvenida, "esto es under y es para vos" — candidato: el perro (`RES-06`, `RES-22`), usado suelto, no en la composición de *Un baión* | `UX-01`, Pantalla 0 |
| Set de 4 íconos de categoría (historia, discos, letras, mitología) | Distinción rápida sin leer, un color por categoría | `UX-01`, pantallas de pregunta |
| Ícono de acierto (festejo) | Recompensa breve, sin texto largo | `UX-01`, feedback de acierto |
| Ícono de error (sin humillar) | Corrección sin bajón | `UX-01`, feedback de error |
| Tres variantes de "tramo de resultado" (bajo/medio/alto) | Jerarquía de logro | `UX-01` resultado, `UX-02` tarjeta |
| Motivo ecualizador/surco de vinilo | Progreso del reveal de audio, con o sin sonido | `UX-03` |

Técnica sugerida para toda la tabla, ahora con respaldo de ficha (`RES-06`): rodillo,
serigrafía, aerografía, grabado o collage si se produce a mano; textura equivalente si
se produce en digital. Nunca vector liso ni ícono de librería estándar. Y, por la frase
guía de más arriba: cada pieza responde primero "¿de qué pantalla es esto parte
integrante?" antes de resolverse como dibujo.

## Qué cambió en esta versión, y contra qué ficha

Trazabilidad de la pasada de `T-25`, para que quede visible qué era intuición y qué pasó
a ser hecho fichado:

| Afirmación original de `UX-04` | Qué dijo la ficha | Resultado |
|---|---|---|
| "Contorno grueso, tipo grabado o serigrafía" | `RES-06` confirma serigrafía y grabado como técnicas reales de Rocambole | **Confirmado** — ahora citado |
| "Collage como técnica de fondo" | `RES-06` confirma collage como técnica real | **Confirmado** — ahora citado |
| "Figuras deformes, orgánicas" | Ninguna ficha lo describe así | **Sin confirmar** — marcado como criterio propio |
| "Tipografía dibujada a mano" | Ninguna ficha describe su lettering | **Sin confirmar** — marcado como criterio propio |
| Paleta psicodélica saturada, colores puntuales | Ninguna ficha describe su paleta | **Sin confirmar** — marcado como criterio propio |
| "Personajes y símbolos sueltos, no una escena citando una tapa puntual" | No estaba en tensión con ninguna ficha; `RES-06`/`RES-22` agregan un motivo transversal (el perro) que cumple la regla sin citar tapa | **Reforzado**, con un candidato concreto |
| — no existía — | `RES-06`: técnica artesanal completa, la frase guía, la capa simbólica (anarquismo/iconografía revolucionaria/raíz popular), el documental marcado como no-referencia | **Agregado** |
| — no existía — | `RES-22`: sube tres tapas a testimonio; no cambia el estado del ícono del esclavo, que sigue reportado | **Agregado** — sin efecto directo en el brief de interfaz, es insumo del juego 4, no de esta pieza |

### Ciclo 4, `T-45` — la fila de tapas reales, derogada por decisión directa

Distinto de la tabla de arriba: acá no hay ficha que suba o baje un dato de estado. Es
una decisión del usuario (`D-21`) que deroga una restricción de diseño que esta misma
hoja había escrito bajo un encuadre —el gate de derechos de `D-07`— que ya no existe
desde `D-14`. El detalle completo, con la fila vieja citada textual y el motivo de por
qué sobrevivió al encuadre que la justificaba, está en "Tapas reales en toda la
pantalla" más arriba, no acá: esa tabla es específicamente para tensión con una ficha,
y esto no lo es.

### Ciclo 5, `T-71` — no una derogación, una corrección de números y un corolario

Distinto también de las dos entradas de arriba: acá no cambia ningún criterio, cambian
dos cosas que se pusieron a prueba contra material real. **(1)** Los números de 480 px
y 640 px se escribieron sin másters a mano para medirlos; con los másters reales
(953×953 / 1181×929 px) ningún recorte del catálogo los alcanza nunca, así que dejaron
de ser objetivo y pasaron a ser tope de referencia — el detalle está en la sección
"Tapas reales en toda la pantalla". **(2)** El corolario sobre qué colores están
testeados contra el velo no corrige nada de esta hoja: es un hallazgo nuevo, encontrado
al escribir `UX-05` v2 para dos pantallas que el ciclo 4 no llegó a construir. Las dos
correcciones las trae `Docs/SUGERENCIAS/HILO-para-experiencia-desvios-de-UX-05.md` (el
reporte del hilo principal) más la lectura directa de `src/lib/contraste.test.ts` y de
`tokens.css`.

## Estado de las referencias — reemplaza la sección de bloqueos anterior

- **Bloqueo levantado.** La versión anterior de este documento no tenía ninguna ficha de
  `investigador` sobre Rocambole y lo decía explícitamente. Ya no es el caso: `RES-06` y
  `RES-22` cubren técnica, iconografía, origen de tapas y postura pública.
- **Lo que sigue sin ficha, a propósito:** color exacto, tipografía puntual, y si sus
  figuras son "deformes" en el sentido que usa este documento. No es un hueco de
  investigación pendiente — es una decisión de diseño que le corresponde a quien
  produce el arte (`D-04`), y quedó marcada arriba como criterio propio en cada caso,
  nunca mezclada con lo que sí está fichado.
- **Lo que no me corresponde decidir:** si usar la identidad visual de Rocambole
  necesita autorización más allá de lo que este brief ya hace por decisión propia
  (figuras sueltas, sin citar tapa; tapas reales siempre en baja resolución y con
  crédito, ahora en cualquier pantalla por `D-21`). Esa pregunta ya no depende de un
  gate previo a publicar —`D-14` sacó el cerrojo de `D-07`—, pero sigue sin ser mía: el
  mapa de qué se usa y de dónde salió lo sostiene `contenido` (`CNT-01`), y el riesgo lo
  asume el usuario bajo `D-14` (si llega un reclamo, se baja).

## Mapa sección→disco (`D-19`, completo el 2026-10-02 por `T-317`)

`D-19` fijó el principio y la primera asignación (portada, historia, mitología, letras,
discos, resultado) y dejó el mapa en manos de `experiencia`. Esta hoja no tenía la tabla y
tenía que tenerla; queda acá, contra `copy.ts` (`variante` de cada casete) y `sitio.css` (las
reglas `.casete--*` y `.juego--*`).

| Lugar | Disco | Variante | De dónde sale la fila |
|---|---|---|---|
| Portada y marca; A1, Preguntas ricoteras | *Oktubre* | `marca` | `D-19` |
| Historia: B2, La Redondopedia | *Gulp!* | `historia` | `D-19` |
| A9, Skayboy y Poligirl | *Gulp!* | `historia` (en el portal) | Herencia del contenido: sus dos temas son de ese disco (`UX-30` §2) |
| Mitología: A3, Adiviná el tema | *Lobo suelto* | `mitologia` | `D-19` |
| Letras: A5, Completá la letra; B1, Letras y acordes | *La mosca y la sopa* | `letras` | `D-19` |
| Discos: A7, Adiviná la tapa | *Último bondi a Finisterre* | `discos` | `D-19` |
| A4, Sacalo por la letra | *Momo Sampler* | `momo` | `UX-08` |
| A6, Ponelos en fila | *¡Bang! ¡Bang!… Estás liquidado* | `bang` | `UX-23` §4.1 |
| A2, ¿Qué tipo de ricotero sos? | *Luzbelito* | `luzbelito` | `UX-06` §5 |
| A8, Más o menos | *Un baión para el ojo idiota* | `baion` | `UX-34` §1 |
| Resultado y "Compartí" | *Gulp!* + el logo | no rota (`.primario.firma`) | `D-19` |

**Las reglas que lo ordenan:**

1. **El casete y su juego visten el mismo disco** (`D-54`, ciclo 17). `.juego--*` y
   `.casete--*` están escritos en la misma regla: lo que se toca en la puerta y lo que se abre
   no pueden vestir dos discos distintos, y la página toma su `juego--<variante>` del mismo
   dato del que sale el casete (`caratula.test.ts`). Qué viste en cada hoja el título y el
   botón de cada uno, en `UX-35` `§4.1`.
2. **Un disco puede vestir más de un lugar cuando el lugar lo hereda del contenido, no de un
   reparto libre** (`UX-30` §2). El mapa no es un reparto de diez lugares; es una
   consecuencia. Quedarse sin disco libre no es un problema; vestir un disco que el
   contenido no nombra, sí.
3. **La marca no rota.** Es de *Oktubre* en todas las pantallas: el apoyo de cada disco es para
   el título del juego, no para la firma del sitio.
4. ***Cordero atado* no es un disco libre**: es el volumen II de la edición doble de *Lobo
   suelto* y comparte su tinta exacta (`RES-37` los midió juntos).
5. **Skayboy no usa `.juego--*`**: su página no tiene carátula (`UX-35` `§5.1`) y el mueble
   trae su propia tinta.

**Una contradicción entre hojas, para que nadie la repita.** `UX-30` §2 dice que *Un baión
para el ojo idiota* "tinta hoy la sección del cancionero y un pie"; el cancionero está en
`letras` (*La mosca y la sopa*) y *Un baión* viste *Más o menos* desde `UX-34` §1, que es
posterior. Manda el código y la fila de arriba.
