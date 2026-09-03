# UX-23 — Ponelos en fila

> Rol dueño: `experiencia`. Consume `Docs/BRIEF.md` (sesión de 2-3 min, "se entra, se
> juega, se comparte, se cierra"), `Docs/DECISIONES.md` (`D-09` pulgar sin excepción,
> `D-14` molinetes abiertos y "no hay que exigir nada para entrar", `D-17` voseo sin
> infinitivo, `D-19` la mezcla — cada sección viste un disco, `D-21` tapas reales en baja
> resolución con crédito siempre, `D-32` "lo que se mueve es la cámara", `D-33` el grito es
> solo del acierto), `.claude/rules/diseno-marca.md` (la tabla anti-slop completa, el
> circuito lienzo→`tokens.css`, la excepción única de barra lateral), `.claude/rules/
> voz-ricotera.md` (los tres registros, la regla de las dos líneas, lo que audita
> `voz.test.ts`), `Docs/UX/UX-01-flujo-quiz.md` (molde de "sin muro", zona pulgar, símbolos
> en vez de solo color), `Docs/UX/UX-02-tarjeta-resultado.md` (formato de pieza
> compartible, "la imagen tiene que explicarse sola"), `Docs/UX/UX-04-sistema-visual.md`
> (paleta, tipografía, las tres formas de tapa real, el piso de legibilidad), `Docs/UX/
> UX-06-test-dos-ejes.md` (el otro juego sin puntaje: cómo se reemplaza el refuerzo de
> acierto cuando no hay acierto, cómo se evita que una disposición visual se lea como
> ranking), `Docs/UX/UX-22-la-imprenta-de-rocambole.md` (§1 el acierto como único grito y
> su techo de tiempo, §5 el giro de un objeto tocado no es slop, §10 "la tirada como
> afiche" es maquetado estático, no animación), `Docs/CONTENIDO/CNT-13-los-nombres-del-
> lugar.md` (el método de la línea que canta: ocho palabras, imagen física, la prueba de
> los molinetes), `src/styles/tokens.css` (`--toque-min`, `--linea`, `--borde`, `--radio`,
> `--acento-3`/`--acento-4` reservados, `--disco-bang-bang-estas-liquidado-tinta`/`-apoyo`,
> `--duracion-paso`, el bloque de `prefers-reduced-motion`), `src/lib/estilos.test.ts`
> (qué audita a máquina hoy: pastilla cápsula, barra lateral fuera de la única excepción,
> símbolo además de color), `src/lib/tarjeta/plan.ts` (`MAX_FILAS = 6`, por qué no sirve
> tal cual para este juego).
>
> **Nota de fuentes.** `US-08`, `BR-22`, `ADR-06` y `CTR-13` todavía no existen como
> archivo en `Docs/PRODUCTO/` ni en `Docs/ARQ/` al momento de escribir esto — igual que le
> pasó a `contenido` con `UX-20` en `CNT-13`. Trabajo directo del encargo, que es la fuente
> que sí tengo, y cito sus decisiones como ya tomadas y no las vuelvo a discutir: el
> nombre, los slugs, los catorce conjuntos, los cinco nombres de fila/bandeja, el disco de
> sección, el mecanismo tocar-tocar sin arrastre táctil, el formato del reparto en el
> fragmento y la doble pieza de compartir (lámina PNG + link). Lo que agrego acá es
> exclusivamente lo que me toca: el recorrido pantalla por pantalla, el dibujo del
> mecanismo de toque y de teclado, el sistema visual contra la tabla anti-slop, la zona de
> pulgar, y el renglón de `LUGARES`.
>
> **Resuelve:** `US-08` (el recorrido completo del séptimo juego, de la elección del
> conjunto a la lámina compartida) y la mitad de `BR-22` que me toca — que ninguna fila se
> lea como mejor que otra en pantalla, y qué reemplaza al refuerzo de acierto cuando no
> hay acierto (mismo problema que ya resolví en `UX-06`, con una respuesta distinta porque
> acá no hay "resultado" único sino una lámina).

---

## 0. La doctrina heredada, antes de diseñar nada

Este es el segundo juego del sitio sin respuesta correcta — el primero fue el test de los
dos ejes (`UX-06`). Todo lo que aprendí ahí se hereda directo:

- **No hay verde ni rojo en ningún estado del tablero.** `--acento-3` y `--acento-4` son
  acierto/error en el resto del sitio y acá no hay ni una cosa ni la otra — usarlos sería
  mentirle al jugador sobre la naturaleza del juego, el mismo argumento que ya usé en
  `UX-06 §3`.
- **Lo que sostiene la atención no es el refuerzo por movimiento, es la curiosidad por
  ver la lámina terminada.** No hay premio parcial en cada ficha ubicada — cada tap
  responde con un cambio de estado sobrio (§4) y nada más. El "grito" de `D-33` sigue
  reservado para el acierto de otro juego; acá no se imprime nada por pasadas hasta que
  el jugador llega al final (§8).
- **Las cuatro filas son cuatro lugares, no cuatro notas.** Ya viene resuelto por el
  encargo (`CONTRA LA VALLA` / `EN EL MEDIO` / `ATRÁS DE TODO` / `EN LA VEREDA`, sin color
  de tier) y es la misma lógica que el rombo de `UX-06 §4`: cuatro posiciones equivalentes
  alrededor de un mismo evento, no una escalera de mejor a peor.
- **No hay "acierto/error/abandono a mitad de partida" en el sentido de `UX-01`.** Hay un
  equivalente propio: qué pasa cuando la bandeja se vacía (§3.4), qué pasa si se comparte
  con la bandeja todavía llena (§3.5), y qué pasa si se abandona a mitad de camino (§3.6).
  Los tres puntos existen igual — cambia qué significan en un juego sin corrección.

---

## 1. Presupuesto de tiempo

Con `BR-22` fijando que no hay orden canónico ni promedio de la gente, la partida no tiene
un largo fijo como el quiz (siempre 8) — depende de cuántos ítems trae el conjunto elegido
(10, o 8 a 13 para "los temas de un disco"). Cada ítem cuesta **dos toques** (tomar +
soltar), no uno como en el quiz — es el costo real de que acá no hay una opción a marcar
sino un objeto a mover — así que el presupuesto se arma distinto:

| Tramo | Duración estimada |
|---|---|
| Pantalla 0 — elegir qué ordenar (catorce opciones, un tap) | 0:10–0:20 |
| Ubicar cada ítem (2 toques: tomar + soltar, ~2 s cada toque con el desplazamiento de §6) | ~4 s/ítem |
| — conjunto de 10 ítems | 0:40 |
| — conjunto de 13 ítems (el disco más largo) | 0:52 |
| Pantalla de lámina + decisión de compartir | 0:15–0:25 |
| **Total, caso típico (10 ítems)** | **~1:05–1:25** |
| **Total, caso más largo (13 ítems)** | **~1:17–1:37** |

Queda cómodo debajo del techo de 3 minutos incluso en el conjunto más largo, con margen
de sobra para el jugador que se detiene a pensar dónde va cada ítem (a diferencia del
quiz, acá pensar más no cuesta un error, así que el margen real percibido es mayor que el
número de la tabla). No hace falta acotar ningún conjunto para entrar en el presupuesto.

---

## 2. Las tres pantallas

### 2.1 Pantalla 0 — Elegí qué ordenar

Reemplaza a la "Pantalla de entrada" de una sola opción que tienen los otros seis juegos:
acá la entrada **es** la elección, porque hay catorce conjuntos y no uno. Sigue siendo
**una sola pantalla, un solo tap** hasta llegar al tablero — no hay pantalla de
instrucciones intermedia ni confirmación después de elegir.

**Qué se ve:**

- `h1`, registro 1: **"PONELOS EN FILA"** (fijo, `--fuente-rotulada` — ver §5 por qué
  ninguna de las tres fuentes de disco corresponde a esta sección).
- Bajada corta, registro 3, redacción final `contenido`: algo del tipo *"Elegí qué
  ordenar."* — dice el mecanismo sin venderlo, mismo criterio que `UX-01`/`UX-06`.
- **Catorce fichas de conjunto**, en dos grupos, sello de goma (rectángulo de esquina casi
  viva, nunca pastilla cápsula), cada una con el nombre del conjunto y la cuenta de ítems
  chica debajo en `--texto-tenue`:

| Grupo | Fichas | Cuenta |
|---|---|---|
| **Colecciones** (4) | Los diez discos · Las diez tapas · Los que abren cada disco · Los que cierran cada disco | 10 ítems cada una |
| **Disco por disco** (10) | Los temas de {nombre del disco}, una por cada uno de los diez discos | 8 a 13 ítems según el disco |

- La lista **scrollea** — a diferencia de la zona pulgar de un botón único, acá elegir
  entre catorce opciones eslectura, no la acción principal de un tercio de pantalla, así
  que no aplica la regla de "sin scroll para el botón de jugar" de `UX-01`: es el mismo
  criterio que ya usa `UX-06 §4` para el plano de resultado, que sí puede scrollear porque
  es contenido de lectura adicional.

**Qué se toca:** un tap sobre cualquiera de las catorce fichas.

**Adónde lleva:** directo a la Pantalla 1 (el tablero) con la bandeja `SIN UBICAR`
precargada con todos los ítems de ese conjunto, en **orden canónico** — el orden de
`DISCOS` y, dentro de un disco, por número de pista, el mismo orden que fija el
empaquetado del reparto (`ADR-06`). No mezclo ni sorteo el orden inicial: no hay ranking
que sesgar por posición (a diferencia de las opciones del quiz, acá el orden de la
bandeja no favorece a ningún ítem porque ningún ítem "gana" nada), y reusar el mismo
orden que ya define el fragmento evita inventar una segunda fuente de verdad.

### 2.2 Pantalla 1 — El tablero

**Qué se ve, de arriba hacia abajo:**

1. **La bandeja `SIN UBICAR`.** Encabezado con el nombre y el contador ("8 sin ubicar" —
   texto real, no solo un número), seguido de las fichas todavía no tomadas. Cada ficha:
   - Conjuntos de discos/tapas: la ficha de 320 px recortada a un thumbnail chico (ver §5,
     §6 para la medida) + el nombre del disco debajo, en `--fuente` (texto de cuerpo,
     nunca la dibujada — un nombre de disco es texto largo, no un título de casete).
   - Conjuntos de temas (abren/cierran/los de un disco): el número de pista + el título
     del tema. Si el conjunto es "abren"/"cierran" (temas de discos distintos entre sí),
     suma el thumbnail chico de la tapa de ese disco al lado, porque sin esa pista visual
     un jugador que reconoce el tema pero no en qué disco vive tarda más en ubicarlo — si
     el conjunto es "los temas de {un disco}", no hace falta: todo el conjunto es del
     mismo disco y ya está dicho en el título de la Pantalla 0.
2. **Las cuatro filas**, en el orden fijo `CONTRA LA VALLA` / `EN EL MEDIO` / `ATRÁS DE
   TODO` / `EN LA VEREDA`, cada una con su encabezado (nombre + contador de cuántas
   fichas trae) y, debajo, las fichas que ya se ubicaron ahí.
3. Un enlace secundario, chico, siempre presente: **"VER LÁMINA"** — salta a la Pantalla
   2 con el estado actual, complete o no la bandeja. No es el flujo principal (§2.4 explica
   por qué no hace falta tocarlo casi nunca) pero tiene que existir siempre, sin condición,
   porque `D-14` no permite que compartir dependa de terminar.

**Qué se toca:** el mecanismo completo está en §4. Acá solo el resumen: tocar una ficha la
toma; tocar una fila (o la bandeja) la suelta ahí.

### 2.3 Pantalla 2 — La lámina terminada

**Qué se ve:**

- El nombre del conjunto, grande, registro 1 — mismo lugar de jerarquía que el puntaje del
  quiz o el nombre de cuadrante de `UX-06`.
- Las cuatro filas, cada una con sus fichas — mismo trazado visual que el tablero pero
  **sin la bandeja arriba**: si quedó algo sin ubicar, aparece como una quinta franja al
  final, con el mismo rótulo `SIN UBICAR` y el mismo tratamiento neutro que tenía en el
  tablero (nunca un tono de "incompleto" o de alarma — ver §2.5).
- Botón primario, el más grande: **"COMPARTÍ"**.
- Botón secundario, debajo: **"ARMÁ OTRA"** — vuelve a la Pantalla 0, no arranca de nuevo
  el mismo conjunto (a diferencia de "jugá de nuevo" en el quiz, acá "de nuevo" no tiene
  sentido con el mismo conjunto: ya lo ordenaste, no hay nada nuevo que sortear dentro de
  él salvo repetir la misma tarea).

**Esta pantalla es, visualmente, la misma imagen que se exporta como PNG** (mismo
criterio ya fijado en el encargo: "la imagen es el previsualizador"). Lo que ve el jugador
en el sitio y lo que recibe quien abre el link comparten maquetado — no hay una versión
"de sitio" prolija y una versión "para compartir" recortada.

### 2.4 Cuándo termina la partida — la bandeja vacía

**No hace falta un botón de "terminar".** Cuando se suelta la última ficha de `SIN
UBICAR` en alguna fila, la pantalla pasa sola a la Pantalla 2 (mismo `--duracion-paso`,
200 ms, que cualquier cruce de pantalla del sitio — no es una excepción nueva de `UX-22
§1`, es el tránsito genérico de siempre).

**Por qué esto no viola "un tap por decisión relevante".** El último tap del jugador —
soltar la última ficha en una fila— **ya es** la decisión de terminar: no hay una segunda
decisión ("¿confirmás que terminaste?") que agregar después. Un botón de "terminar" acá
sería el mismo defecto que `UX-01` evita al no pedir confirmación de respuesta: un tap
extra sobre algo que el jugador ya decidió con el tap anterior.

**Si el jugador quiere ver la lámina antes de vaciar la bandeja**, usa "VER LÁMINA" (§2.2):
mismo destino, mismo maquetado, la única diferencia es que la quinta franja `SIN UBICAR`
no está vacía.

### 2.5 Compartir con la bandeja todavía llena

`D-14`: nada se le niega al jugador por no terminar. **`COMPARTÍ` funciona siempre**,
tenga la bandeja lo que tenga adentro — incluso si nunca tomó una sola ficha (caso límite:
comparte las cuatro filas vacías y la bandeja entera en `SIN UBICAR`; es un caso raro pero
no se bloquea porque bloquearlo sería el molinete que `D-14` prohíbe por nombre).

**Cómo se ve en la lámina:** la quinta franja `SIN UBICAR`, con el mismo trazado sobrio
que las cuatro filas (mismo borde, misma tipografía, mismo tamaño de ficha) — **nunca**
en un tono de "faltante" o de alarma, porque no hay nada malo en compartir una lámina a
medio armar. Es exactamente la misma decisión que ya tomó `BR-22` sobre las cuatro filas
en general: nada se pinta como peor que otra cosa. Lo único que cambia respecto de las
cuatro filas es el orden en el que aparece — siempre última, después de `EN LA VEREDA` —
porque es lo no decidido, no un quinto lugar del recital.

**Qué dice el reparto codificado.** El fragmento (`ADR-06`) ya soporta esto sin cambios:
el valor `0` por ítem significa "sin ubicar", así que un reparto compartido a medio armar
es un dato válido, no un caso de error — quien abre el link ve exactamente la misma
lámina, con la misma quinta franja si corresponde.

### 2.6 Si abandona a mitad de partida

Igual que `UX-01`/`UX-06`: no hay guardado de sesión. Si el jugador cierra la pestaña con
la bandeja a medio vaciar y vuelve más tarde, arranca de cero en la Pantalla 0 — no hay
"progreso" que valga la pena persistir en una sesión de dos minutos, y agregar
`localStorage` acá sería exactamente el tipo de flujo largo que este rol tiene que marcar
como mal cortado.

---

## 3. El mecanismo de tocar-tocar, dibujado

Sin arrastre en táctil (ya decidido, con el fundamento técnico completo en el encargo:
ningún motor dispara eventos de arrastre con el dedo). Lo que sigue es el dibujo completo
del reemplazo — tocar, tocar — con sus tres estados, sus cinco destinos posibles y el
recorrido de teclado.

### 3.1 Los tres estados de una ficha

| Estado | Cuándo | Cómo se ve |
|---|---|---|
| **Disponible** | En la bandeja o ya ubicada en una fila, nadie la tomó | `--borde` fino (1 px), sin rótulo extra |
| **En la mano** | El jugador la tocó y todavía no la soltó en ningún destino | Borde `--linea` (3 px, la misma alternativa que usa el quiz para marcar la opción tocada) **más** un rótulo de texto real, no un ícono: **"EN LA MANO"**, en `--fuente-rotulada`, chico, pegado a la ficha |
| **Recién ubicada** | El instante en que se soltó en un destino | Vuelve a "Disponible" en su nueva posición — sin animación de entrada, ver §5, tic 6 |

**Solo una ficha en la mano a la vez.** Tocar una ficha distinta mientras ya hay una en la
mano no las suma: la nueva pasa a "en la mano" y la anterior **vuelve exactamente a donde
estaba**, sin moverse — es la misma regla que rige tener una sola mano en la vida real, y
evita inventar un estado "dos fichas en la mano" que después habría que dibujar aparte.

**Tocar la misma ficha que ya está en la mano la suelta sin moverla** — el toggle de
cancelar. Es el equivalente táctil de `Escape` (§3.3).

**Por qué el rótulo es texto y no un color nuevo.** Ya lo pide el encargo, y coincide con
la regla de accesibilidad que rige todo el sitio desde `UX-01`: ningún estado se comunica
solo con color. Acá hay dos señales independientes (grosor de borde + palabra), así que
un jugador que no distingue el cambio sutil de grosor igual lee "EN LA MANO", y viceversa.

### 3.2 Cómo se ve que las cuatro filas son destino, y cómo se saca una ficha de una fila

**El destino no es la fila entera como una sola superficie táctil — son dos zonas
distintas con dos funciones distintas, y las dos existen siempre, tengan o no una ficha
en la mano:**

1. **El encabezado de la fila** (el nombre + el contador, franja de ancho completo, alto
   ≥ `--toque-min` — ver §6) es el botón "soltar acá". Tocarlo con una ficha en la mano la
   mueve a esa fila. Tocarlo sin nada en la mano no mueve nada, pero **no queda mudo**: la
   región viva (§3.4) anuncia *"Elegí primero una ficha para poder soltarla."* — un no-op
   silencioso es peor que un aviso corto, porque el jugador que lo tocó por error no sabe
   si pasó algo o no.
2. **Cada ficha ya ubicada dentro de la fila** es su propio botón, independiente del
   encabezado — tocarla la toma (pasa a "en la mano"), exactamente igual que tocar una
   ficha en la bandeja. **Así se saca una ficha de una fila:** se toca la ficha (queda "en
   la mano", visible con su rótulo, todavía dentro de esa misma fila — no se mueve
   todavía, no hay "levantar", ver §5 tic 2), y después se toca cualquier otro destino:
   otra fila, o el encabezado de la bandeja `SIN UBICAR` (que es un destino legítimo,
   exactamente igual que las cuatro filas — es la vía para devolver algo al montón).

**La bandeja `SIN UBICAR` tiene el mismo encabezado-botón que las cuatro filas.** Es el
quinto destino, no un caso especial: tocar su encabezado con una ficha en la mano la
devuelve ahí. Esto resuelve de raíz "cómo deshago una ubicación" sin inventar un botón de
deshacer aparte.

**Nombres sugeridos para quien construya** (no son mandato, la implementación es del
hilo principal): `.ficha`, `.ficha--en-mano`, `.fila-boton` (el encabezado, botón real),
`.fila-fichas` (el contenedor de las ya ubicadas, no interactivo por sí mismo — el
delegado de eventos distingue si el tap cayó en una `.ficha` hija o en el espacio vacío
del `.fila-boton`).

### 3.3 El recorrido de teclado

| Tecla | Qué hace |
|---|---|
| `Tab` / `Shift+Tab` | Recorre, en orden del documento: el encabezado-botón de `SIN UBICAR` → cada ficha de la bandeja en orden canónico → el encabezado-botón de `CONTRA LA VALLA` → sus fichas ya ubicadas → el encabezado-botón de `EN EL MEDIO` → sus fichas → y así con las otras dos filas. Es tabulación estándar de documento, sin `tabindex` fabricado a mano ni foco en rueda — cada control es un `<button>` real en su lugar natural del DOM |
| `Enter` / `Espacio` sobre una ficha | Toma esa ficha (pasa a "en la mano"); si ya estaba en la mano, la suelta sin moverla (mismo toggle que el tap) |
| `Enter` / `Espacio` sobre un encabezado-botón de fila o de bandeja | Si hay una ficha en la mano, la suelta ahí; si no hay ninguna, no mueve nada y la región viva avisa (mismo aviso del tap, §3.2) |
| `Escape` | Suelta la ficha en la mano **donde estaba antes de tomarla**, sin mover nada — el "me arrepentí" explícito, más rápido que buscar la misma ficha de nuevo con `Tab` |

Nada de esto pide un patrón de teclado nuevo: son botones reales, tabulables por default,
con el mismo `aria-pressed` que ya usa el interruptor de la cinta (`UX-22 §5`) para marcar
"tomada: sí/no" en cada ficha.

### 3.4 Qué anuncia la región viva

Una región `aria-live="polite"` (puede coincidir con el propio rótulo visible "EN LA
MANO" si ese nodo es el que cambia, o vivir aparte, oculta visualmente — decisión de
implementación, no mía) anuncia, en cada uno de los cuatro momentos:

| Momento | Qué dice |
|---|---|
| Se toma una ficha | *"En la mano: {nombre de la ficha}. Elegí una fila."* |
| Se suelta en un destino | *"{nombre de la ficha} va a {nombre de la fila o "sin ubicar"}."* |
| Se suelta sin moverse (toggle o `Escape`) | *"Soltaste {nombre de la ficha} donde estaba."* |
| Se toca un destino sin nada en la mano | *"Elegí primero una ficha para poder soltarla."* |

Redacción final de `contenido` — acá fijo qué información tiene que llevar cada anuncio y
en qué momento dispara, no el texto exacto. Los cuatro caben sin esfuerzo en el techo de
`voz.test.ts` si se escriben en voseo, sin puntos suspensivos (son avisos, registro 3).

---

## 4. El sistema visual, contra la tabla anti-slop

### 4.1 El disco de la sección: ¡Bang! ¡Bang!… Estás liquidado

Ya decidido en el encargo (`bang-bang-estas-liquidado`, tinta `#aeb9b4` ceniza, apoyo
`#927051` ocre, par ya testeado). Se aplica igual que cualquier otra sección con la mezcla
de `D-19`: la tinta ceniza tiñe bordes y texto de marca de esta sección (título "PONELOS
EN FILA", encabezados de fila, contador), el apoyo ocre queda para bordes secundarios y
divisores — **nunca como texto**, mismo criterio que ya fija `tokens.css` para todos los
`-apoyo` ("NO se usa como texto, no entra al test").

**Tipografía.** Ninguna de las tres fuentes fan digitalizadas (`Oktubre Calco`, `Patricio
Rey Fan`, `Lobo Suelto Fan`) corresponde a *¡Bang! ¡Bang!… Estás liquidado* — no existe un
calco derivado de esa tapa. Mismo caso que `Luzbelito` en `UX-06 §5`: todo el texto grande
de esta sección (el `h1`, el nombre del conjunto en la lámina) va en `--fuente-rotulada`
(Archivo Black). Consecuencia igual de directa: no hay ningún carácter con tilde o Ñ que
no pueda escribirse acá, así que "PONELOS EN FILA", los cuatro nombres de fila y "SIN
UBICAR" no chocan con la deuda declarada de `diseno-marca.md`.

**Pendiente que dejo anotado (no lo resuelvo acá, no es mi carpeta):** el mapa
sección→disco vive en `UX-04`, y esta fila todavía no está ahí — mismo bloqueo que ya dejó
`UX-06 §8` para *Luzbelito*. Queda para una ráfaga que toque `UX-04`.

### 4.2 Los seis tics que este juego va a pedir, y su reemplazo

De los siete juegos del sitio, este es el que tiene más superficie para el slop, porque el
género "tier list" **tiene una estética de plantilla tan fuerte como la de una interfaz
por defecto de IA** — la barra de color por fila, la ficha que flota al agarrarla, el
verde-a-rojo, son el estándar de facto de todos los generadores de tier list de la web, y
copiarlos sin traducirlos sería importar el mismo "genérico" que `diseno-marca.md` prohíbe
por nombre, solo que con otro origen.

| # | Tic que pide el cuerpo | Por qué tienta acá específicamente | Reemplazo |
|---|---|---|---|
| 1 | **Barra de acento en el borde izquierdo de cada fila** — el significante estándar de una tier list: una franja de color pegada al borde de cada renglón | Es literalmente el elemento que define el género en TierMaker y en todo clon — quien construya va a buscar ese patrón primero. **Además rompe el build**: `estilos.test.ts` falla ante cualquier `border-left`/`border-inline-start` fuera de `.parrafo--*` | Borde **completo** (los cuatro lados) en la tinta de la sección (§4.1), título del encabezado en esa misma tinta, rotación leve — la alternativa que ya fija la tabla general de `diseno-marca.md` para este mismo tic, aplicada acá |
| 2 | **La ficha que se levanta al agarrarla** — sombra, escala o `translateY` al entrar en estado "tomada", herencia directa del hover que "levanta" una tarjeta | El género entero se construye alrededor de "agarrar y mover" un objeto — es el gesto que más invita a una respuesta de elevación | La ficha **no se mueve de su posición** al pasar a "en la mano" (§3.1): cambia de borde y suma el rótulo de texto. Es la manipulación de un objeto sin que el objeto reclame atención por sí mismo — mismo criterio que ya usa `UX-22 §5` para el giro de la estampa, aplicado al revés: acá ni siquiera hay giro, solo cambio de tinta y de borde |
| 3 | **La rampa rojo→verde** (o cualquier gradiente de "peor" a "mejor" entre filas) — el otro significante estándar del género, heredado de las notas S/A/B/C/D/F | Ya está descartado por `BR-22` a nivel de contenido (no hay fila mejor); falta descartarlo a nivel visual, porque un maquetador podría reintroducirlo "solo con color" sin tocar el copy | Las cinco franjas (cuatro filas + bandeja) comparten **exactamente el mismo tratamiento visual entre sí** — mismo fondo, mismo borde, mismo peso de tipografía. Se distinguen por nombre, posición fija en la pantalla y contador, nunca por tinte. Es el mismo argumento que ya usa `UX-06 §4` para el rombo: cuatro posiciones equivalentes, ninguna "más arriba" en jerarquía de lectura |
| 4 | **La pastilla cápsula** (`border-radius: 999px`) como forma por defecto de una ficha/chip | Es el chip por excelencia de cualquier interfaz de arrastre-y-soltar genérica — hasta el propio auditor de `estilos.test.ts` lo nombra como el primer tic que busca | Sello de goma: esquina casi viva (`--radio`, 4 px), borde fino, mayúsculas rotuladas si el texto es corto (nombre de disco) o `--fuente` si es largo (título de tema) |
| 5 | **La superficie elevada** — cada fila como una tarjeta gris flotando sobre un fondo gris, con sombra difusa para separarla de las demás | Con cinco franjas apiladas en la misma pantalla, la tentación de "separarlas visualmente" con sombra es directa | Cada franja se recorta por su borde grueso completo (tic 1) sobre `--fondo`, como una hoja de papel pegada — no una superficie que flota, un objeto que está apoyado |
| 6 | **La animación de reacomodo** — cuando una ficha entra o sale de una fila, las demás fichas de esa fila se deslizan (`FLIP`/`transform` animado) para cerrar el hueco o hacer lugar | Es el efecto "satisfactorio" clásico de cualquier lista reordenable de la web, y con hasta 13 ítems en pantalla el reacomodo visual es tentador como forma de "confirmar que pasó algo" | El reflujo es **instantáneo**, sin transición: la lista se redibuja en el cuadro siguiente, sin interpolar posición. `D-32` ya lo dice para toda la Redondopedia ("un artículo no se mueve") y acá aplica igual: lo único que se anima en todo el sitio es la mosca y, con techo propio, la estampa de `UX-22`. Un reacomodo de lista no es ninguna de las dos cosas — es una ficha volviéndose visible en su lugar nuevo, y **el "grito" es exclusivo del acierto** (`D-33`), que acá no existe |

Los tics 1 y 4 son, además de un defecto de diseño, un fallo de build: cualquier
`border-left`/`border-inline-start` fuera de `.parrafo--*` o cualquier `999px` en
`juego.css` hace fallar `node --test src/lib/estilos.test.ts` sin que haga falta escribir
un test nuevo — el que ya existe corre sobre toda la hoja, este juego incluido.

---

## 5. La zona de pulgar

### 5.1 Los dos objetivos de toque

- **Cada ficha:** botón de al menos `--toque-min` (48 px) en cada lado, aunque el
  thumbnail visual de adentro (tapa o número de pista) sea más chico — el relleno del
  botón completa la diferencia. Nunca se reduce el objetivo de toque para que "entren más
  fichas por línea": si eso empuja, la ficha pasa a la línea siguiente, no se achica el
  botón.
- **La banda de destino entera:** el encabezado-botón de cada fila (§3.2) ocupa el
  **ancho completo** de la pantalla, con una altura de al menos `--toque-min` — de hecho
  bastante más, porque además de la palabra del nombre lleva el contador y necesita
  respirar como franja separadora entre dos filas. Al ser ancho completo, el jugador no
  necesita apuntar con precisión: cualquier punto de esa franja horizontal sirve como
  destino, que es justo lo que la consigna pide ("la banda de destino entera", no un botón
  chico dentro de la fila).

### 5.2 El problema real: con 13 fichas y 4 filas, el destino casi nunca está a la vista

En 375 px de ancho, una bandeja con hasta 13 fichas más cuatro encabezados de fila no
entra completa en un viewport de 667 px de alto — el jugador toca una ficha en la bandeja
y, la mayoría de las veces, ninguna de las cuatro filas está en pantalla para tocarla de
inmediato.

**La resolución: `scrollIntoView({ block: 'nearest' })`, en los dos sentidos, atado al
corte de movimiento reducido.**

| Momento | A dónde apunta | Por qué `'nearest'` y no `'start'`/`'center'` |
|---|---|---|
| Se toma una ficha (de la bandeja o de una fila) | Al contenedor de las cuatro filas (el primero de ellos, `CONTRA LA VALLA`, alcanza para traer el bloque entero a la vista si el viewport lo permite) | `'nearest'` no mueve nada si el bloque ya está total o parcialmente visible — evita el defecto que ya nombró `UX-22 §1.4`: mover la cámara sin necesidad es peor que no moverla |
| Se suelta una ficha en un destino | Al encabezado-botón de la bandeja `SIN UBICAR` | Mismo argumento: si el jugador ya venía mirando la bandeja (por ejemplo, sacó una ficha de una fila y la volvió a poner en otra fila sin pasar por la bandeja), no hace falta mover nada |

**Por qué es la misma familia de excepción que `UX-22 §1.4`, no una nueva.** Ahí ya quedó
ratificado que la cámara puede moverse sola cuando el motivo es "que el premio o el
control siguiente entren en pantalla", con la condición de que nunca tape al control
principal. Acá el argumento es idéntico, aplicado a un objeto que no es un premio sino el
propio tablero: sin el salto, el jugador tendría que scrollear a mano después de cada uno
de los hasta 26 toques de una partida (13 ítems × 2), que es exactamente el tipo de
fricción repetida que una sesión de 2-3 minutos no puede pagar.

**El corte de movimiento reducido, exacto:**

```
comportamiento = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
```

Con `reduce`, el salto es instantáneo (`'auto'`, sin interpolación) — la posición cambia
pero no hay animación de scroll que percibir. Sin `reduce`, es `'smooth'`. **Nunca
`'smooth'` fijo**, que es justo la instrucción del encargo: un `scrollIntoView` con
`behavior: 'smooth'` sin condición ignoraría a quien pidió menos movimiento en el sistema
operativo, el mismo agujero que ya corrige `--duracion-paso: 0ms` para las transiciones de
pantalla en `tokens.css`.

**Qué NO hace este mecanismo.** No apunta a la ficha individual recién tomada ni a la
fila individual recién tocada con `'start'` — eso forzaría siempre un salto, incluso
cuando no hace falta, y en una pantalla angosta correría el riesgo de tapar el propio
encabezado-botón que el jugador necesita tocar después (el error que `UX-22 §1.4` v3 ya
cometió una vez con `'start'` y corrigió a `'end'`/`'nearest'` en su v4). `'nearest'`
sobre el **contenedor**, no sobre el ítem puntual, es la lectura correcta acá.

---

## 6. El renglón de `LUGARES`

### 6.1 Evaluación de la propuesta del hilo principal

**"Te pesa la valla en las costillas."** — 7 palabras, segunda persona, imagen física
(cuerpo: costillas; objeto: valla), sin repetir el `h1` ("Ponelos en fila"), sin jerga
forzada, sin puntos suspensivos. Pasa la prueba de los molinetes: tapando el renglón,
queda el `h1` ("PONELOS EN FILA", que ya es un imperativo directo sobre qué hacer) más el
botón — alcanza para saber qué tocar sin leer esta línea.

**Un matiz que vale la pena marcar antes de aprobarla tal cual.** La palabra "valla" no es
un sustantivo cualquiera acá: es, letra por letra, el nombre de una de las cuatro filas
(`CONTRA LA VALLA`). `BR-22` construye todo el juego sobre que ninguna de las cuatro filas
sea protagonista de otra — es la misma razón por la que se descartó la rampa
rojo→verde (§4.2, tic 3) y por la que el rombo de `UX-06` no pone ningún cuadrante "más
arriba". Un renglón de bienvenida que nombra literalmente una de las cuatro filas, antes
de que el jugador vea las otras tres, corre el riesgo de plantar esa fila como "la
protagonista" del juego — no rompe ninguna regla mecánica (`BR-22` prohíbe puntaje y orden
canónico, no prohíbe que el copy mencione un lugar), pero sí es una tensión de tono con el
principio que sostiene a las otras tres reglas anti-jerarquía de este mismo documento. No
es un rechazo — es la reserva que dejo antes de las alternativas.

### 6.2 Dos alternativas, sin nombrar ninguna fila puntual

| Propuesta | Palabras | Imagen | Por qué |
|---|---|---|---|
| **A — "Te arrastran los pies en la cola."** | 7 | Cuerpo (pies) + escena física de hacer fila (cola, sinónimo de "fila" para no repetir el `h1`) | Ancla la imagen al acto mismo de ordenar/esperar turno — el concepto central del juego — sin citar el nombre de ninguna de las cuatro filas específicas. Es la lectura más literal de "ponelos en fila" trasladada al cuerpo del jugador |
| **B — "Se te clava un codo en la espalda."** | 8 | Cuerpo (codo, espalda) — el apretujón de un recital lleno | Mantiene el mismo registro físico y un poco áspero que "Te pesa la valla…" (la ternura metida adentro de lo feo que pide `voz-ricotera.md` 4.4: el codo ajeno molesta, pero es el precio de estar cerca del escenario), sin anclarse a un lugar puntual — cualquiera de las cuatro filas puede sentir "un codo ajeno", no solo la de adelante |

**Mi lectura:** cualquiera de las tres —la del hilo principal o mis dos alternativas—
cumple el técho de ocho palabras y la prueba de los molinetes; la diferencia entre ellas
es exclusivamente el matiz de §6.1. Dejo la elección a `contenido`, que es quien redacta
la novena fila de `CNT-13` — esto es una propuesta de `experiencia`, no una redacción
final: nada de lo mecánico de este documento depende de cuál se elija.

---

## 7. Qué NO se hace

**Nada de estampa por pasadas al terminar la partida.** `UX-22` construye un mecanismo
entero —tinta clara, tinta media, tinta clave, el fijado de la foto— pero ese mecanismo
tiene un dueño exacto: **es el grito del acierto**, con un techo de tiempo propio que
`D-33` reserva exclusivamente para el momento en que el sitio confirma que el jugador
adivinó algo. Acá no hay nada que adivinar y no hay acierto que confirmar (`BR-22`), así
que no hay ninguna ocasión legítima para disparar ese mecanismo — usarlo igual sería
pedirle prestado el "premio" de otro juego a uno que no tiene premio, lo mismo que
`UX-06 §3` ya descartó para el test de los dos ejes cuando dijo que ni siquiera "las dos
en verde" tiene sentido si las dos opciones son igual de válidas.

**Lo legítimo, en cambio, es que la lámina llegue ya impresa.** La transición de la
Pantalla 1 a la Pantalla 2 (§2.4) es el mismo cruce de `--duracion-paso` (200 ms) que
cualquier otro cambio de pantalla del sitio — nada se anima adentro de la lámina misma. Es
el mismo criterio que ya fija `UX-22 §10` para "la tirada como afiche": *"no se anima: es
un layout estático"*. La lámina no se construye delante del jugador, existe entera desde
el primer cuadro — como una hoja que ya salió de la imprenta antes de que el jugador la
mire, no una que se está imprimiendo mientras la mira.

**El crédito, igual que en cualquier otra pantalla con tapas reales (`D-21`).** Cuando el
conjunto elegido incluye tapas o discos, la lámina lleva el crédito a Rocambole (Ricardo
Cohen) por las dos vías que ya fija el resto del sitio: **en pantalla**, mientras se juega
y se mira el resultado dentro del sitio, con el mecanismo de "isla de partida sin
`Base.astro`" que ya define `UX-04` (sello de esquina, `--fuente-rotulada`); **y adentro
del PNG exportado**, porque una lámina con hasta diez tapas de Rocambole viajando a
Twitter sin firma es exactamente el caso que `D-21` no permite. Cuando el conjunto es "los
temas de un disco" y ya se identifica una sola tapa (§2.1), no hace falta listar diez
nombres — un crédito de un solo disco alcanza. Cuando el conjunto son las diez tapas o los
diez discos, el crédito no necesita repetir los diez nombres uno por uno (ya están
escritos en la propia lámina, en cada ficha): una sola línea nombrando al autor, sin la
lista completa de discos, evita el mismo exceso que `UX-01` ya evitó al no mostrar los
cuatro subcampos de un testimonio. El patrón de texto exacto lo define `contenido`, sobre
el molde que ya existe en `PORTAL.creditoTapas`/`UX-22 §2.5`.

---

## 8. Checklist — primera pantalla sin muro

- [ ] Cero campos de texto, cero login, cero permiso pedido antes de llegar al tablero.
- [ ] Un solo tap entre "elegir un conjunto" (Pantalla 0) y "ver la bandeja lista para
      jugar" (Pantalla 1) — sin pantalla de instrucciones intermedia.
- [ ] `COMPARTÍ` funciona con la bandeja en cualquier estado, completa o no (§2.5).
- [ ] Nada de scroll para encontrar el botón "COMPARTÍ" en la Pantalla 2 (entra en el
      tercio de pulgar, igual que cualquier otra pantalla de resultado del sitio).
- [ ] Ningún dato inventado en la Pantalla 0 (sin contador falso de "tanta gente ya armó
      esta lista hoy").

## 9. Checklist — accesibilidad

- [ ] Ningún estado (disponible / en la mano) se comunica solo con color — siempre borde
      + texto (§3.1).
- [ ] Cada ficha y cada encabezado-botón de fila/bandeja son `<button>` reales, tabulables
      por default, con `aria-pressed` en la ficha (§3.3).
- [ ] `Tab`, `Enter`/`Espacio` y `Escape` cubren el mecanismo completo sin necesitar el
      dedo (§3.3).
- [ ] La región viva anuncia los cuatro momentos de §3.4 — nunca un no-op silencioso.
- [ ] Objetivo de toque `--toque-min` (48 px) en cada ficha; ancho completo × altura
      `--toque-min` en cada encabezado-botón de fila/bandeja (§5.1).
- [ ] `scrollIntoView` corre en `'auto'` bajo `prefers-reduced-motion: reduce`, nunca
      `'smooth'` fijo (§5.2).
- [ ] Ninguna fila lleva tinte de tier (rojo/verde/rampa) — se distinguen por nombre,
      posición y contador únicamente (§4.2, tic 3).

---

## 10. Presupuestos para `contenido`

| Pieza | Presupuesto | De dónde sale |
|---|---|---|
| Bajada de Pantalla 0 | ≤ 8 palabras, registro 3 | `voz-ricotera.md` |
| Nombre corto de cada una de las catorce fichas de conjunto | Ya fijados por el encargo ("Los diez discos", etc.) — `contenido` redacta el matiz final si hace falta | — |
| Contador de la bandeja / de cada fila (ej. "8 sin ubicar") | Texto real, no solo el número | §3.1 |
| Los cuatro anuncios de la región viva | Registro 3, seco, voseo | §3.4 |
| Botones: `COMPARTÍ`, `ARMÁ OTRA`, `VER LÁMINA` | Voseo, sin infinitivo, sin puntos suspensivos | `D-17`, `voz.test.ts` |
| Copy de desafío / tweet prefil | primera frase ≤ 8 palabras + link | mismo molde de `UX-02`/`UX-06 §6` |
| Renglón de `LUGARES` (novena fila de `CNT-13`) | ≤ 8 palabras, registro 1, imagen física | §6 — tres candidatas evaluadas, elección final de `contenido` |
| Línea de crédito de tapas en la lámina | Patrón de `PORTAL.creditoTapas`, sin listar diez nombres si el conjunto ya los muestra en cada ficha | §7 |

## 11. Bloqueos que dejo anotados

- **El mapa sección→disco de `UX-04` no incluye todavía esta fila** (§4.1) — mismo
  bloqueo que ya dejó `UX-06 §8` para *Luzbelito*, queda para una ráfaga que toque `UX-04`.
- **El renglón de `LUGARES` queda con tres candidatas y sin ganadora** — la elección final
  es de `contenido`, con la reserva de §6.1 anotada para que no se pierda.
- **El texto exacto de las catorce fichas de conjunto, los cuatro anuncios de región viva
  y el patrón de crédito con conjunto simplificado** son de `contenido`, con los
  presupuestos de §10.
- **La forma exacta del identificador `<conjunto>` en el fragmento** (`ADR-06`) es de
  `arquitectura` — acá solo asumo que existe uno por cada una de las catorce fichas de
  Pantalla 0 y que el orden canónico que usa para encodear es el mismo que uso para el
  orden inicial de la bandeja (§2.1).
- **La verificación de `estilos.test.ts` contra los tics 1 y 4 de §4.2** ya corre sobre
  cualquier hoja nueva sin que haga falta escribir un test adicional — lo dejo anotado
  para que quien construya sepa que no necesita pedir una regla nueva, ya está cubierto.
