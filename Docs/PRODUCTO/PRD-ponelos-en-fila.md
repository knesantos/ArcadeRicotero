# PRD — Ponelos en fila: el séptimo juego, sin resultado correcto

> **Consume:** `Docs/BRIEF.md` ("Listo de la v1", riesgo 4: "cuatro juegos hermosos con
> doce preguntas adentro" — leído acá también al revés, ver "Piso de ítems"). `Docs/
> DECISIONES.md` `D-05` (cuatro juegos confirmados, no se redefinen solos), `D-09`/`D-14`
> (molinetes abiertos, jugable con el pulgar), `D-13` (una sola fuente de los 105 temas,
> nunca una segunda lista copiada), `D-19` (la mezcla: cada sección viste la paleta real
> de un disco), `D-21` (tapas reales a toda la página, con crédito), `D-33` (el acierto es
> el único grito del sitio). `Docs/PRODUCTO/PRD-alcance-v1.md` — `BR-01` (escalonamiento),
> `BR-04` (opciones de múltiple choice), `BR-05` (tramos bajo/medio/alto), y `US-06`/
> `BR-17` como precedente directo de "juego nuevo que entra fuera del contrato de cuatro,
> con la misma restricción de 'ningún resultado mejor que otro'". `Docs/PRODUCTO/PRD-
> adivinar-por-la-letra.md` (`US-07`) como segundo precedente de esa misma vía de entrada.
> `.claude/rules/diseno-marca.md` (barra lateral y pastilla vetadas, `--acento-3`/
> `--acento-4` reservados). `.claude/rules/voz-ricotera.md` (registro 1, títulos ≤ 8
> palabras, voseo). `src/lib/letra/temas.ts` (`leerTemas()`, `TemaDelDisco`), `src/lib/
> letra/discos.ts` (`DISCOS`, los diez slugs), `src/lib/cancionero/banco.ts` (`FICHAS`),
> `src/lib/tema/catalogo.ts` (el patrón de derivar en build y validar contra `RES-20`, que
> esta historia reusa entero), `src/lib/tarjeta/plan.ts` (`MAX_FILAS = 6`, por qué esta
> historia no puede reusar ese módulo tal cual). El encargo del hilo principal, que ya
> cerró el diseño completo del juego con investigación propia — este documento no
> re-discute esas decisiones, las traza (sección siguiente).
>
> **Produce:** `US-08`, `BR-22`.
>
> **IDs reservados y no tomados por esta sesión** (`Docs/IDS.md`): `ADR-06`, `CTR-13`
> (`arquitectura`), `UX-23` (`experiencia`). `D-36` lo escribe el hilo principal.

## Qué es este archivo y qué no

Fija la historia de usuario y la regla de negocio del séptimo juego del sitio —octavo
frente si se cuenta la Redondopedia—: repartir un conjunto conocido de la banda en
cuatro filas que nombran lugares de un recital, sin que ninguna fila sea la correcta. No
fijo acá el schema JSON del reparto ni el motor de arrastre (`CTR-13`/`ADR-06`,
`arquitectura`), no diseño la pantalla ni el mecanismo táctil (`UX-23`, `experiencia`), y
no redacto el copy de casete, filas ni instrucciones (`contenido`). Lo que sí hago: fijo
el piso de contenido con su verificación, la regla de que acá no hay acierto, qué queda
afuera de la v1 y por qué, y dejo trazado —con fundamento y alternativas descartadas—
todo lo que el hilo principal ya decidió sobre este juego, para que quede como parte de
la historia y no como una nota suelta en un chat.

---

## Lo ya decidido por el hilo principal — trazado, no re-discutido

### Qué es el juego, y de qué género viene

El jugador reparte un conjunto de cosas de la banda —los diez discos, las diez tapas, los
temas de un disco— en cuatro filas, y se lleva la lista armada como imagen y como
dirección para compartir. Es el género "tier list", adoptado del estándar de la web
(TierMaker) en su estructura —filas horizontales, ítems que se mueven entre ellas— y
traducido al idioma del sitio en todo lo demás: nombres, colores, mecánica de puntaje
(ninguno) y forma de compartir.

### El nombre

**"Ponelos en fila."** Slug de página `/juegos/ponelos-en-fila/`, slug de link `ponelos`.
Voseo imperativo (`D-17`), dos palabras de verbo más "en fila" — dentro del techo de 8
palabras de `voz-ricotera.md` 4.1 con margen de sobra, y describe la mecánica sin
nombrarla como juego de preguntas (evita que se lea como un octavo "adiviná algo").

### Las cuatro filas: lugares de un recital, no notas de boletín

`CONTRA LA VALLA` · `EN EL MEDIO` · `ATRÁS DE TODO` · `EN LA VEREDA`. La bandeja de lo no
ubicado se rotula `SIN UBICAR`.

**Alternativa descartada, y por qué:** S/A/B/C/D/F, el estándar de TierMaker. Dos
problemas, no uno solo: son notas anglosajonas (contra `D-17`, sin anglicismos en lo que
se lee), y "F de fail" reintroduce el rojo=error que esta historia entera existe para
sacar del juego — una fila llamada "fail" es un veredicto, no un lugar. Los cuatro
lugares de recital no tienen ese problema: son formas reales de ir a ver a la banda, y
ningún ricotero real coincide en cuál es "la mejor" — esa discusión sin resolver es la
prueba de que no hay jerarquía, el mismo argumento que sostiene `BR-17` para los
cuadrantes de `US-06`.

### Las filas no llevan color de tier

`--acento-3` (verde, acierto) y `--acento-4` (rojo, error) están reservados por
`diseno-marca.md` para el resto del sitio. Una rampa rojo→verde en las cuatro filas le
diría, sin una palabra, al que ya jugó el quiz que la fila de arriba está bien. Se
distinguen por nombre (sello de goma), posición y contador — nunca por color de estado.
Se suma acá, como parte de esta historia y no solo del diseño: `estilos.test.ts` ya
rompe el build ante un `border-left` fuera de `.parrafo--*` (la barra de acento lateral,
el significante del género tier-list) y ante `999px` — los dos tics que este juego, por
su propio género, más tentaría reintroducir.

### El disco de la sección (mezcla `D-19`)

**¡Bang! ¡Bang!… Estás liquidado** (`bang-bang-estas-liquidado`), tinta `#aeb9b4` ceniza,
par ya testeado en `contraste.test.ts`. Era uno de los tres discos libres de la mezcla.

**Alternativas descartadas:** *Cordero atado*, porque su tinta es el mismo hex que Lobo
suelto (`RES-37` las midió juntas) y el juego se leería visualmente como una variante de
"Adiviná el tema"; *Un baión*, porque su celeste choca con `--rotulo-testimonio`, que no
rota nunca entre secciones. Variante de casete nueva: `bang`.

### La interacción: tocar la ficha, tocar la fila — nunca arrastre obligatorio

Sin arrastre en táctil, y documentado acá como condición de aceptación (criterio 4 de
`US-08`) y no solo como detalle de implementación, porque protege exactamente el mismo
principio que ya protege `BR-04` cuando descarta 5 opciones por el pulgar: el arrastre
HTML5 (`draggable`/`dragstart`/`drop`) tiene la API presente en iOS Safari 15+ y Chrome
Android 96+ pero **ningún motor dispara esos eventos con el dedo** — piden mouse,
trackpad, S Pen o DeX. "Arrastre en celular" no es una simplificación de alcance, es un
motor aparte a escribir a mano con Pointer Events, y aun escribiéndolo hay que construir
la vía sin arrastre igual (WCAG 2.5.7, `D-09` "jugable con el pulgar", `D-14` molinetes:
un juego que solo se juega arrastrando es un molinete nuevo con forma de gesto). El
arrastre nativo queda **solo como agregado** para quien tiene mouse, llamando a la misma
función que el tap-tap.

### Compartir: la lámina y la dirección, con reparto explícito

1. **La lámina PNG** (canvas, 1080×1350), molde de `lib/tarjeta/plan.ts` pero **módulo
   propio**: ese módulo tiene `MAX_FILAS = 6` fijo y `planificar()` tira `RangeError` por
   diseño si se le pide más — protección correcta para la tarjeta de setlist de `US-02`/
   `US-07`, que no aplica acá porque esta pieza no dibuja una fila por ítem, dibuja cuatro
   filas fijas con ítems adentro. **El crédito de `D-21` va impreso adentro de la
   imagen**: una lámina con las diez tapas de Rocambole saliendo a Twitter sin crédito es
   exactamente el caso que `D-33` dejó abierto.
2. **La dirección**, con el reparto codificado **en el fragmento** (`#`), nunca en la
   query — el fragmento no viaja al servidor ni entra en ningún registro:
   `https://<sitio>/juegos/ponelos-en-fila/#o=1.<conjunto>.<carga>`
   - `<conjunto>` fija el orden canónico de referencia (que no viaja): los ítems se
     enumeran siempre en el orden de `DISCOS` y, dentro de un disco, por número de pista.
   - `<carga>` son 3 bits por ítem (0 = sin ubicar, 1 a 4 = las cuatro filas), LSB
     primero, base64url sin relleno. 10 ítems = 6 caracteres, 13 ítems = 7 caracteres.
   - **No se comprime**: el ahorro de `CompressionStream` no cubre su propia cabecera
     sobre datos casi aleatorios de este tamaño.
   - **Consecuencia aceptada:** el previsualizador de WhatsApp/Telegram/X no lee nada
     después del `#`, así que la tarjeta del enlace sale genérica. No es un defecto: **la
     imagen es el previsualizador.**
   - Cuarta forma de `ADR-02`, llamada `reparto`, en `ADR-06` — las tres formas de `ADR-02`
     v2 (`marcador`, `recorrido`, `identidad`) no tienen dónde poner esto.

---

## US-08 — Ponelos en fila (repartir un conjunto conocido, sin resultado correcto)

**Prioridad: no forma parte del "Listo" de la v1.**

`D-05` confirmó en `/kickoff` que la v1 cierra con **cuatro** juegos: quiz, adivinar el
tema, completar la letra, adivinar la tapa. Esa decisión no la reabro yo porque apareció
una séptima idea buena — es el mismo argumento, palabra por palabra, que ya usé para
dejar a `US-06` y a `US-07` fuera de ese contrato. `US-08` entra al sitio del mismo modo
que ya entraron `US-05` (Redondopedia), `US-06` (los dos ejes) y `US-07` (sacalo por la
letra): **construible y publicable sin esperar a nada, pero contado aparte de los cuatro
que definen si la v1 está "lista".**

Como jugador que tiene opinión propia sobre la banda, quiero repartir un conjunto
conocido —los diez discos, las diez tapas, o los temas de un disco— en cuatro lugares de
un recital, para dejar mi orden sin que el sitio me diga si acerté, y llevármelo armado
para mostrarlo.

### Criterio 1 — caso feliz (arma y comparte)

- **Given** un jugador entra a "Ponelos en fila" y elige uno de los conjuntos ordenables
  (piso de esta historia, más abajo).
- **When** toca una ficha de la bandeja `SIN UBICAR` y después toca una de las cuatro
  filas —o la propia bandeja, para sacarla de una fila—, las veces que quiera, en
  cualquier orden.
- **Then** la ficha se mueve a la fila tocada y el jugador puede tocar "compartir" en
  cualquier momento para obtener la lámina PNG y la dirección con su reparto codificado
  (`BR-22` fija que ninguna de las dos piezas lleva puntaje, marca de acierto ni
  comparación contra un orden ajeno).

### Criterio 2 — caso borde (no hay piso de completitud: el molinete)

- **Given** un jugador dejó ítems en `SIN UBICAR` sin asignarlos a ninguna de las cuatro
  filas.
- **When** toca compartir.
- **Then** el sitio arma igual la lámina y la dirección — nunca exige vaciar la bandeja
  para habilitar el botón. Exigir que todo esté ubicado antes de poder cerrar la partida
  sería un molinete nuevo (`D-14`): el jugador que no tiene opinión formada sobre dónde
  va un ítem puntual tiene que poder cerrar igual, dejándolo en `SIN UBICAR` como una
  posición válida más, no como un error a corregir antes de que el sitio lo deje salir.

### Criterio 3 — caso borde (el conjunto se elige, no se inventa)

- **Given** un jugador entra al juego.
- **When** elige qué va a ordenar.
- **Then** puede elegir entre los 14 conjuntos fijados por el piso de esta historia —
  nunca un conjunto libre que el jugador arme a mano, ni uno derivado de una fuente
  externa al repo. Si el jugador pudiera elegir qué entra a un conjunto, la lista misma
  pasaría a ser una afirmación discutible sobre la banda ("estos son los temas
  importantes de este disco"), exactamente el problema que `BR-22` existe para cerrar:
  acá se ordena algo que ya existe tal cual (los diez discos existen, las diez tapas
  existen, el tracklist de un disco existe), nunca una selección nueva.

### Criterio 4 — caso borde (sin arrastre obligatorio: jugable con el pulgar)

- **Given** un jugador juega desde un celular, sin mouse ni trackpad.
- **When** quiere mover una ficha a una fila.
- **Then** puede hacerlo tocando la ficha y después la fila, sin necesitar sostener un
  gesto de arrastre — condición no negociable de "jugable con el pulgar" (`D-09`) y de
  molinetes abiertos (`D-14`), documentada acá como criterio de aceptación y no solo como
  decisión de implementación, porque un motor que solo respondiera a arrastre dejaría
  afuera a cualquiera que juegue con el dedo, que es la mayoría de la sesión que este
  sitio existe para servir (brief, "móvil primero"). El arrastre nativo queda disponible
  como agregado para quien tiene mouse, llamando a la misma función.

### Piso de ítems: 14 conjuntos ordenables — el techo entero, no un piso más bajo

Los 14, todos derivables en build de datos que el repo ya tiene, sin un JSON de banco
nuevo:

1. **Los diez discos** (`DISCOS`, `letra/discos.ts`) — 10 ítems.
2. **Las diez tapas** — mismos diez discos, ficha visual en vez de título (las jpg ya
   bajadas por `D-21`) — 10 ítems.
3. **Los diez temas que abren cada disco** — `leerTemas()` filtrado por `pista === 1`,
   uno por disco — 10 ítems.
4. **Los diez que cierran cada disco** — `leerTemas()` filtrado por la pista más alta de
   cada disco — 10 ítems.
5. a 14. **Los temas de cada uno de los diez discos**, un conjunto por disco —
   `leerTemas()` filtrado por `disco` — entre 8 y 13 ítems cada uno, según el tracklist
   real del disco.

**Por qué se cuenta en conjuntos y no en fichas — y por qué un piso por ítem sería falso
acá.** En los otros seis juegos del sitio, cada ítem del banco es una unidad de curación
que le cuesta algo a `contenido`: redactar una pregunta, etiquetar una dificultad,
transcribir una letra, curar un distractor, o —del lado del usuario— producir un
fragmento de audio. El piso de esos juegos existe justamente para forzar que ese trabajo
manual, unitario, se haga en cantidad suficiente antes de llamar "listo" a un juego (el
riesgo 4 del brief: "cuatro juegos hermosos con doce preguntas adentro"). Acá ese costo
**no existe**: ningún conjunto de "Ponelos en fila" pasa por la mano de nadie — los 14 se
derivan enteros, en build, de datos que ya están en el repo (`leerTemas()` sobre
`RES-20`, `FICHAS` de `cancionero/banco.ts`, las tapas de `D-21`), con el mismo patrón
que ya usa `catalogo.ts` para validar el manifiesto de audio contra los 105 temas. Contar
"fichas" (por ejemplo, sumar los ~113 ítems que reparten los 14 conjuntos) mediría un
trabajo que a nadie le costó producir uno por uno. Y fijar un piso más bajo que 14 —por
ejemplo, "con que anden 8 conjuntos alcanza"— dejaría afuera contenido que ya está listo
y no cuesta nada sumar: es el riesgo 4 leído al revés. No sería un motor vacío con pocos
ítems; sería un motor con ítems gratis guardados en el cajón sin usar, mientras la
historia se declara "lista" con menos. Por eso el piso es el techo entero: **los 14, ni
uno menos.**

**Cómo se verifica a máquina.** Un test de contrato (dueño `arquitectura`, sobre
`CTR-13`) que, para cada uno de los 14 ids, confirme:

- **(a) deriva sin lanzar** — nada de `RangeError` ni de choques de slug, mismo patrón
  que ya usa `indexarFragmentos()` en `catalogo.ts` para el manifiesto de audio;
- **(b) la cantidad es la esperada, medida de forma independiente** — 10 para discos,
  tapas, aperturas y cierres; entre 8 y 13 para cada uno de los diez conjuntos por disco,
  y la suma de esos diez conjuntos coincide con los 105 temas de `RES-20`;
- **(c) sin ítems repetidos** dentro de un mismo conjunto.

El día que ese test pasa en los 14, el piso de esta historia está cumplido. Si alguno de
los 14 falla, "Ponelos en fila" no cierra su ciclo aunque los otros 13 anden — el mismo
criterio de "ningún juego cierra por debajo de su piso" que usa la tabla resumen de
`PRD-alcance-v1.md` para los cuatro de la v1.

**Queda fuera de esta historia:** el schema exacto del reparto y el punto extendido de
`ADR-02` (`CTR-13`/`ADR-06`, `arquitectura`); la pantalla, el selector de conjunto y el
motor táctil (`UX-23`, `experiencia`); el copy exacto de casete, nombres de fila (ya
fijados, ver arriba) y textos de la lámina (`contenido`); el generador que arma los 14
conjuntos desde `leerTemas()`/`FICHAS`.

---

## BR-22 — "Ponelos en fila" no tiene resultado correcto

**Aplica a:** `US-08`.

### Qué prohíbe exactamente

1. **Ningún ítem, fila o partida entera lleva puntaje, nota, ni marca de acierto o
   error.** No hay nada que contar: ni "aciertos", ni "%", ni tramos.
2. **No existe un orden canónico del sitio** contra el que se compare la fila del
   jugador. Ningún archivo de datos define "el orden correcto" de un conjunto ordenable
   —ni siquiera como referencia interna que no se muestre—: si existiera, la mecánica de
   compararse contra él sería trivial de agregar después, y esta regla existe justamente
   para que esa puerta no quede entreabierta.
3. **No hay promedio ni agregación de las filas de otros jugadores.** No se junta, no se
   muestra, no se simula. El sitio no tiene backend para juntarlas (`D-14`, sin cuentas ni
   ranking global), y esta regla cierra además la puerta a inventar un promedio de
   mentira con datos de otro lado.
4. **La única fila contra la que se puede comparar la propia es una que el jugador mismo
   cargó**, recibida por una dirección que otra persona le mandó — nunca una fila que el
   jugador no eligió cargar.
5. **Ninguna fila lleva color de la rampa de acierto/error** (`--acento-3`/`--acento-4`,
   ya fijado por el hilo principal, sección anterior). Y acá esta regla agrega algo que
   el diseño solo no cubre: **tampoco puede llevar el tratamiento sonoro o de movimiento
   que `D-33` reservó exclusivamente para el acierto del resto del sitio.** Si "Ponelos
   en fila" reusara ese festejo al terminar de compartir, estaría gritando "acierto" con
   otro lenguaje sensorial en vez del color — el mismo problema que motivó sacar el
   verde, entrando por la puerta de atrás.
6. **Ningún copy de cierre jerarquiza las filas entre sí.** Nada de "llenaste más la de
   arriba", nada de tono de reproche sobre una fila vacía, y el conteo por fila —si se
   muestra— no se presenta como si fuera una nota.

### Consecuencia en pantalla

La pantalla de cierre de "Ponelos en fila" muestra la fila armada y el botón de
compartir, sin los símbolos ✔/✕ reservados de acierto y error, sin la palabra "puntos" ni
"acertaste", sin el festejo sonoro o de movimiento de `D-33`, y sin ningún texto que
afirme que una fila quedó mejor que otra.

### El riesgo de que la fila de arriba se lea como "acierto", aunque no tenga verde

Sacarle el color no alcanza solo, y conviene decirlo de frente en vez de darlo por
resuelto. En un sitio donde "arriba" ya es el lugar del acierto en los otros seis juegos
—la ficha correcta se revela arriba, el símbolo de acertar queda arriba de la fila—, un
jugador entrenado por esos seis juegos puede leer `CONTRA LA VALLA` como "la fila
ganadora" solo por estar primera en la lista, sin que un solo hex se lo diga. Esta regla
no lo resuelve con maquetado —eso es `UX-23`— pero dos cosas la sostienen desde el lado
de `producto`:

- **El nombre de las filas ya elude la jerarquía de nota** (motivo por el que se
  descartó S/A/B/C/D/F, sección anterior): "contra la valla" y "en la vereda" son dos
  maneras reales de ir a un recital, no un lugar mejor y uno peor — cualquier ricotero
  real discute cuál prefiere, y esa discusión sin resolver es la misma prueba que
  sostiene a `BR-17` para los cuatro cuadrantes de `US-06`.
- **El copy de cierre (punto 6 de arriba) tiene prohibido reforzar con texto** la lectura
  de jerarquía, que es el único canal que controla `producto`/`contenido` directamente.

Si aun con las dos cosas el orden espacial se sigue leyendo como ranking, es un problema
de maquetado que le corresponde resolver a `experiencia` — no lo decido yo acá, pero
dejo la señal escrita en `Docs/SUGERENCIAS/PRD-para-experiencia-orden-de-filas-ponelos.md`
para que no se pierda entre los criterios de esta historia.

### Cómo se prueba que se cumple

- **A máquina:** (1) el CSS de esta isla no usa `--acento-3` ni `--acento-4` — extensión
  del mismo chequeo que ya corre `estilos.test.ts` para la barra lateral y la pastilla;
  (2) el payload que arma la forma `reparto` de `ADR-06`/`CTR-13` no tiene ningún campo de
  puntaje, nota o comparación — lo verifica el test de contrato de `arquitectura` leyendo
  el schema; (3) el copy visible de este juego no usa palabras del rótulo de acierto/error
  del glosario de `voz.test.ts` (`acertaste`, `correcto`, `ganaste esta`, y equivalentes).
- **A ojo, con esta regla como vara:** `revisor` audita que el festejo de `D-33` (sonido,
  movimiento) no se dispare al cerrar una partida de "Ponelos en fila", y que ningún copy
  de cierre jerarquice una fila sobre otra — es exactamente la clase de desvío que no se
  detecta leyendo el schema, solo jugando la pantalla.

---

## Qué NO entra a la v1, y por qué

### No entra: los 105 temas como un solo conjunto ordenable

Rompe la sesión de dos o tres minutos del brief. Aunque la interacción sea tap-tap sin
arrastre (criterio 4), ordenar 105 fichas a mano no cierra en un rato corto — es
exactamente el eje contrario del filtro que este documento debía aplicar sobre las dos
propuestas abiertas del brief: "que cierren enteros en una sesión corta". Los 14
conjuntos del piso tienen techo de 13 ítems, casi un orden de magnitud menos, y eso no es
casualidad: es la condición de entrada.

### No entra: "los más escuchados"

`src/data/popularidad.json` tiene los 105 temas en `"estado": "sin-video"` — cero
mediciones reales, porque falta la clave de YouTube (`YT_API_KEY`, deuda declarada desde
el ciclo 8; ver `catalogo().medidos`, hoy 0). Y aunque la clave llegara mañana, `BR-18`
prohíbe mezclar fuentes de popularidad (YouTube sí, Spotify no, nunca mezclados) y
prohíbe afirmar algo que no se puede medir con una sola fuente consistente. Un conjunto
ordenable de "los más escuchados" necesita una medida real para que el jugador tenga
algo objetivo con qué ordenar, más allá de su gusto — fabricar esa medida hoy (por
ejemplo, ordenando alfabéticamente o por año y llamándolo "popularidad") sería
exactamente el dato falso que `D-14`/`D-09` no permiten. Cuando `BR-18` (f) tenga
mediciones reales para los 105 temas, esta salida queda abierta como conjunto 15 —no
antes.

### No entra: un ranking de tapas

La investigación no encontró **ningún** ranking de tapas publicado — ninguna ficha
`RES-XX` lo respalda. Generar uno desde adentro del sitio, aunque sea agregando las
filas que arman los propios jugadores, es exactamente lo que `BR-22` prohíbe: convertiría
"Ponelos en fila" en la fuente de un orden canónico que el juego entero existe para
negar. Si algún día apareciera un ranking publicado con fuente (`RES-XX`), sería
contenido de la Redondopedia, no un conjunto ordenable de este juego — ordenar algo que
ya tiene un orden "correcto" afuera convierte al jugador en el que acierta o no, y eso es
otro juego, no este.

---

## `BR-01`, `BR-04`, `BR-05`: no aplican a `US-08`, y por qué

- **`BR-01` (escalonamiento de dificultad) no aplica.** Exige etiquetar Fácil/Media/
  Difícil y garantizar que el primer ítem de una partida sea Fácil — pero acá no hay
  dificultad que escalonar: no hay una respuesta correcta contra la que un ítem pueda ser
  "más difícil de acertar" que otro (`BR-22`). Es el mismo argumento, con la misma
  redacción, que ya dejó a `US-06` afuera de `BR-01`: ubicar un tema en una fila no es
  una prueba de conocimiento, es una preferencia, y una preferencia no tiene nivel.
- **`BR-04` (4 opciones de múltiple choice) no aplica.** No hay opciones que contar ni
  distractores que curar: el jugador no elige entre alternativas, mueve fichas que ya
  conoce (los diez discos, las diez tapas, el tracklist de un disco) a una fila. Es el
  mismo motivo por el que `BR-04` dejó de aplicar a `US-02` desde que ese juego pasó a
  responder por buscador: sin opciones no hay azar que controlar.
- **`BR-05` (tramos bajo/medio/alto sobre % de aciertos) no aplica.** Exige una noción de
  acierto sobre la que calcular un porcentaje, y `BR-22` prohíbe exactamente eso en este
  juego — es un caso más estricto todavía que `US-06`: `BR-17` ya dejó a `US-06` fuera de
  `BR-05` por no tener aciertos que contar, y "Ponelos en fila" hereda esa misma
  condición sin matices, porque acá ni siquiera hay preguntas con dos opciones — hay un
  reparto libre.

---

## `D-05` no se toca

El "Listo" de la v1 sigue siendo cuatro juegos: quiz, adivinar el tema, completar la
letra, adivinar la tapa. "Ponelos en fila" es el séptimo título del sitio —después de la
Redondopedia (`US-05`), el test de los dos ejes (`US-06`) y "Sacalo por la letra"
(`US-07`)—, construible y publicable sin esperar a nada, pero fuera del contrato que
define si la v1 está "lista". No soy yo quien reabre el número de `D-05` porque apareció
una séptima idea buena, exactamente como no lo reabrí para `US-06` ni para `US-07`.

---

## PENDIENTE

- **Enlace desde `PRD-alcance-v1.md`.** No toqué ese archivo en esta tarea (fuera de
  alcance explícito de este encargo). Cuando `producto` vuelva a tocarlo, agregar una
  mención a `US-08`/`BR-22` en la lista de frentes fuera del contrato de cuatro, junto a
  `US-06` y `US-07`.
- **Decidí no proponer tocar la tabla "Piso de ítems — resumen" de ese archivo.** Esa
  tabla dice, en su propio texto, que es "la de los cuatro juegos que `D-05` fijó como
  Listo de la v1" — `US-06` y `US-07` quedan deliberadamente afuera de ella, y `US-08`
  hereda la misma condición. No es una omisión a corregir con una `SUGERENCIA`: es
  coherencia con lo que ese documento ya afirma sobre sí mismo.
- **Escribí una propuesta a `experiencia`** sobre el riesgo de que el orden espacial de
  las cuatro filas se lea como ranking aunque no lleve color: `Docs/SUGERENCIAS/PRD-
  para-experiencia-orden-de-filas-ponelos.md`.
- No fijé el schema del reparto ni la forma `reparto` de `ADR-02` (`CTR-13`/`ADR-06`,
  `arquitectura`, ya con IDs reservados); ni la pantalla, el selector de conjunto o el
  motor táctil (`UX-23`, `experiencia`); ni el copy exacto de casete y lámina
  (`contenido`).
