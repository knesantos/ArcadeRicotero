# ARQ — La rocola: la cinta deja de ser una cama y pasa a poner temas

> Rol dueño: `arquitectura`. **Produce: `ADR-07` y `CTR-14`.** Fecha: **2026-09-11**.
>
> **Consume** — leído entero para escribir esto, no citado de memoria: `CLAUDE.md`,
> `.claude/rules/diseno-marca.md`, `.claude/rules/voz-ricotera.md`,
> `ORQ-plan-ciclo-14.md` (§1 medido, §2.1, §2.2, §2.4, §6), `ARQ-cama-de-cinta.md`
> (`ADR-04` entero, con sus cinco candados), `ARQ-transito-entre-pantallas.md` (`ADR-03`),
> `INV-24-limites-vercel-audio.md` (`RES-50`, los seis veredictos), `D-14`, `D-22`, `D-23`,
> `D-26`, `D-29`.
>
> **Y el código, que para esta decisión vuelve a ser la fuente más dura que hay:**
> `src/lib/sitio/cinta.ts` (entero), `src/lib/sitio/cinta.test.ts` (`:691`, `:717`, `:932`),
> `src/lib/audio/contexto.ts` (entero), `src/lib/tema/audio.ts` (entero),
> `src/lib/sitio/graves.ts`, `src/lib/tema/catalogo.ts`, `src/scripts/cinta.ts`,
> `src/scripts/partida-tema.ts` (leído, no tocado), `src/layouts/Base.astro`,
> `src/data/adivinar-tema.json`, y el listado entero de `src/pages/`.
>
> **Resuelve:** `T-212`. **No resuelve, y no se mete:** qué se ve y qué se toca cuando la
> rocola pone un tema, que es `UX-26` (`T-216`, `experiencia`); el texto visible, que es de
> `contenido`; y la construcción, que es `T-217` y `T-218` del hilo principal.
>
> **Pedido del usuario que origina esto, textual:** *"que encender la cinta toque uno de los
> temas al azar de los redondos con el filtro vintage, uno de los temas enteros, cuando no
> haya mas que ponga los recortes enteros y cambiando entre tema y tema haga un ruido como
> cambia el vinilo o el cassete medio vintage."*

---

## De dónde sale cada afirmación de este documento

Las mismas tres marcas que usa `ARQ-cama-de-cinta.md`, porque sirven para lo mismo: que
dentro de dos meses se distinga lo medido de lo elegido.

| Marca | Qué significa |
|---|---|
| **medido en el repo** | se verificó leyendo el archivo, con ruta y línea. No hace falta ficha: está en disco |
| **criterio propio del rol** | lo decide `arquitectura` acá. Se puede discutir; no se puede citar como hecho externo |
| **pendiente de ficha** | dato del mundo de afuera. **No lo afirmo**: va a `investigador` como `RES-56`+ |

Y la advertencia que este documento sí necesita y `ADR-04` no necesitaba: **acá adentro hay
obra ajena.** La cama imitaba un aparato con `Math.random()` y por eso `D-14` no tenía por
dónde agarrarla. La rocola reproduce grabaciones de la banda. El encuadre no cambia —`D-14`,
`D-22` y `D-23` ya lo dejaron decidido, y el sitio ya sirve esos mismos archivos— pero **el
argumento de "esta pieza es intocable" se termina acá**, y conviene que quede escrito y no
que se descubra dentro de dos meses.

---

## ADR-07 — La rocola

- **Estado:** **aceptada**, con tres pendientes de ficha que cambiarían un repuesto, no el
  diseño (ver el final).
- **Contexto.** `ADR-04` construyó una cama de aire: once nodos, cero archivos, cero bytes,
  apagada por defecto. Funciona y está probada. El pedido del ciclo 14 le cambia el trabajo:
  el mismo interruptor tiene que **poner un tema**. Eso no es una constante más ni un nodo
  más — afloja candados que se escribieron a propósito, mete megabytes donde había cero, y
  pone a sonar, adentro del sitio, **exactamente los mismos archivos que son la respuesta de
  tres de sus juegos**.
- **Decisión, en una línea:** la cinta pasa a tener **dos modos** —`rocola` y `cama`— que
  **no elige la persona sino la ruta**, con lista blanca y todo lo demás en `cama`; la
  rocola **transmite** un `<audio>` fuera del documento y marcado, lo mete al **mismo
  `AudioContext`** por un `MediaElementAudioSourceNode`, le cuelga una cadena de filtro
  propia de cinco nodos, **deja la cama de `ADR-04` corriendo abajo como siseo**, tapa cada
  empalme con una púa sintetizada, y **no pide un solo byte sin un gesto sobre el
  interruptor**.

### La frase que ordena todo el documento

> **Donde se juega, la cinta no pone temas.** Los 95 recortes son las respuestas de `US-02`;
> los temas enteros son las respuestas de `US-03` y de `US-07`. Una rocola que suene donde
> no debe le marca error al que se sabe el tema, que es el único daño que `CLAUDE.md`
> declara inaceptable.

---

## ADR-07.1 — Los cinco candados de `ADR-04`, uno por uno

`ADR-04` los escribió con nombre y con una instrucción: *"si algún día alguien quiere
aflojar uno, que sepa cuál está aflojando"*. Esto es ese día. Van los cinco, con mi
veredicto, que en dos casos no es el que proponía `ORQ-plan-ciclo-14` §2.1.

### Candado 1 — "Apagada por defecto" · **SE QUEDA, y se endurece**

La primera visita sigue sin oír nada y ahora, además, **sin bajar nada**. `ADR-04` podía
darlo por sentado porque no había archivo que bajar; acá hay que escribirlo:

> **Ningún byte de audio de la rocola se pide sin un gesto sobre el interruptor de la
> cinta.** Ni al cargar, ni al primer toque de la página, ni por preferencia guardada.

Ese es el candado nuevo, y es el que contesta el segundo riesgo del ciclo (`ORQ-plan-ciclo-14`
§6: el peso del lado del que escucha). Ver `ADR-07.8` para lo que implica al navegar.

### Candado 2 — "Cero archivos" · **CAE, y cae exactamente la mitad**

El plan dice "cae entero". **No estoy de acuerdo, y la diferencia importa**, porque lo que
queda en pie es lo que hay que defender mañana:

| Lo que decía el candado 2 | Qué pasa ahora |
|---|---|
| `0 bytes` de red **apagada** | **sigue en pie**, y pasa a ser el candado 1 endurecido |
| `0 bytes` de red **prendida** | **cae**: ~79 KB por recorte, ~4 MB por tema entero (`CTR-14`) |
| **No hay una pieza que alguien tenga que producir** | **sigue en pie**: la rocola **no agrega un solo archivo al repo**. Pone los 95 recortes que ya están en `public/audio/fragmentos/` y los enteros que `D-22` ya decidió alojar |
| No hay worklet, no hay respuesta de impulso, no hay mp3 de atmósfera | **sigue en pie, y es prohibición dura**: la cama y la púa se siguen sintetizando. Ver `ADR-07.10` |

O sea: lo que cae es *"esta pieza no transfiere nada"*. Lo que **no** cae es *"esta pieza no
suma trabajo de producción ni un archivo nuevo al despliegue"*. Un mp3 de siseo para la cama
seguiría estando prohibido mañana, y si algún día alguien lo propone porque "total, la
rocola ya baja megabytes", esta fila es la respuesta.

### Candado 3 — "Muda cuando algo suena" · **SE QUEDA, y se refuerza**

Era el que el plan pedía reforzar y tiene razón. Se refuerza en dos direcciones:

1. **Hacia afuera**: sigue valiendo para todo. Un fragmento de `US-02`, el `<audio controls>`
   del reveal (`partida-tema.ts:888-893`, **medido en el repo**), y cualquier medio que
   agregue un juego futuro **callan la cinta entera** —cama y rocola— sin escribir una
   línea.
2. **Hacia adentro**: la rocola está exenta de sí misma, porque es la misma pieza. Esa
   exención es el problema del `ADR-07.3` y **se resuelve con una marca explícita, nunca por
   accidente**.

Y el refuerzo que no estaba y es el que de verdad importa: el candado 3 vivía en la capa de
audio y preguntaba *"¿hay algo sonando?"*. Ahora hay una pregunta anterior, que es la de
`ADR-07.2`: ***"¿esta ruta puede oír un tema?"***. La primera protege el oído; la segunda
protege la partida.

### Candado 4 — "No lleva información" · **CAE en su letra, y se conserva en su consecuencia**

El plan dice que cae y es cierto: el que prende una rocola quiere saber qué está sonando, y
eso es una superficie nueva que es de `experiencia` (`UX-26`).

**Pero hay que mirar de qué se estaba sosteniendo ese candado antes de soltarlo**, porque
sostenía algo más que a sí mismo: `ADR-04.8` justifica no leer `prefers-reduced-motion`
diciendo *"apagarla no cuesta información porque no lleva ninguna"*. Si el candado 4 cae sin
más, ese argumento queda colgado.

No queda colgado, y esta es la razón, en una línea: **lo único que la rocola dice es qué está
poniendo ella.** No comunica ningún estado del sitio, ninguna respuesta, ningún progreso,
ningún puntaje. Apagar la cinta sigue sin costar una sola información del sitio — que es lo
que `ADR-04.8` necesitaba. La forma precisa del candado, después de este ADR:

> **Ningún estado del sitio se comunica con la cinta.** La rocola nombra su propia pieza y
> nada más.

### Candado 5 — "Un solo `AudioContext`" · **SE QUEDA, intacto y más necesario que antes**

Con un `<audio>` transmitido entrando al grafo por `createMediaElementSource()`, un segundo
contexto sería peor que antes: no solo no podría callar al otro, además no podría filtrar lo
que el otro reproduce. El único `new` sigue viviendo en `src/lib/audio/contexto.ts`, con la
excepción escrita de `src/scripts/diagnostico-audio.ts` (`ADR-04.2`, **medido en el repo**).

---

## ADR-07.2 — El mapa de rutas mudas, que es lo más importante de este documento

### El criterio, antes de la tabla

Tres preguntas por ruta, en orden. **Criterio propio del rol.**

1. ¿En esta pantalla la persona tiene que **producir una respuesta**?
2. ¿Esa respuesta es un tema, un disco, un año, un verso o una tapa — o sea, algo que la
   rocola puede **dejar oír** o **nombrar en el crédito**?
3. ¿Puede hacerlo **antes** de que la persona la produzca?

Si las tres dan que sí, la ruta no pone temas. Y encima de las tres, una regla más gruesa
que las absorbe y que es la que hay que recordar:

> **Una pantalla de juego no pone temas. Ninguna. Sin excepción, y sin discutir juego por
> juego si su respuesta es soplable.**

La regla gruesa existe porque es la única que no envejece. `dos-ejes` (`US-06`) no tiene
respuesta correcta y `ponelos-en-fila` (`US-08`) no tiene orden correcto —o sea, la pregunta
3 da que no—, y aun así van mudas: en `ponelos-en-fila` uno de los conjuntos son **doce temas
sorteados**, y la rocola nombrando un tema con su disco y su año es literalmente material del
tablero (`ponelos-en-fila.astro:5-26`, **medido en el repo**). Afinar el criterio juego por
juego significa que el octavo juego llegue con una discusión en vez de con una respuesta.

### El mecanismo: lista blanca, y el silencio es el que se hereda

**Dos candados sobre la misma puerta**, que es el patrón que ya funcionó con
`src/lib/sitio/graves.ts` y que `ORQ-plan-ciclo-14` §2.2 pide repetir:

- **Candado A — la lista blanca.** La rocola suena **solo** en las rutas que están escritas
  en `RUTAS_CON_ROCOLA`. Todo lo que no esté, cae a `cama`. **Un juego nuevo nace mudo**, y
  para que ponga temas alguien tiene que venir hasta acá, leer este apartado y agregarlo a
  mano. Es lo contrario de una lista negra, donde el juego nuevo nace sonando y el error se
  descubre jugando.
- **Candado B — el censo.** `rutas-sonoras.ts` exporta además `PAGINAS_DECLARADAS`, la lista
  de archivos de `src/pages/` que fueron clasificados. Una prueba recorre `src/pages/**/*.astro`
  y **falla si aparece una página que nadie clasificó**, y también si desapareció una
  clasificada. O sea: agregar una pantalla sin decidir qué hace la cinta ahí **rompe el
  build**. Ese es el mecanismo que pide el encargo para que un juego de mañana no se olvide
  de agregarse a la lista: no se agrega solo, pero no puede pasar de largo.
- **Candado C, de yapa y gratis** (`ADR-07.9`): la rocola necesita que la página le haya
  sembrado la lista de piezas. Una pantalla que no la siembra no tiene con qué sonar, así
  que **el olvido también cae del lado del silencio**.

### La tabla, una fila por ruta del sitio

Las catorce páginas de `src/pages/` (**medido en el repo**: el listado completo del
directorio). `muda` y `cama` **no son lo mismo** y por eso hay tres veredictos:

| Ruta | Qué es | Qué revelaría la rocola ahí | Veredicto |
|---|---|---|---|
| `/` | El portal | nada: no se responde nada | **rocola** |
| `/quiz/` | Quiz (`US-01`) | hay respuestas correctas que son **un año** (`QZ-001`: *"¿En qué año salió Gulp!?"* → `1985`, `quiz.json:14-22`) y **un disco** (`QZ-002`: *"¿Cómo se llama el disco que la banda editó en 1986?"* → `Oktubre`, `:49-53`). **Medido en el repo**, y `QZ-002` cruza disco con año, que es exactamente lo que muestra un crédito de rocola | **cama** |
| `/juegos/adivinar-el-tema/` | `US-02` | **todo**: los 95 recortes de `public/audio/fragmentos/` **son** las respuestas de este juego | **cama** |
| `/juegos/completar-la-letra/` | `US-03` | **todo**: el tema cantado dice el verso que falta | **cama** |
| `/juegos/adivinar-por-la-letra/` | `US-07` | **todo**: ídem, por el otro lado | **cama** |
| `/juegos/adivinar-la-tapa/` | `US-04` | el crédito nombra el disco, que es la respuesta | **cama** |
| `/juegos/dos-ejes/` | `US-06`, sin respuesta correcta | nada que soplar, pero es pantalla de juego: regla gruesa | **cama** |
| `/juegos/ponelos-en-fila/` | `US-08`, sin orden correcto | uno de los conjuntos son doce temas sorteados: el crédito es material del tablero | **cama** |
| `/letras-y-acordes/` | Índice del cancionero | nada: no se juega | **rocola** |
| `/letras-y-acordes/[slug]/` | La letra de un tema | nada: la letra ya está en la pantalla | **rocola** |
| `/letras-y-acordes/armar-cancionero/` | La herramienta que arma el HTML propio | nada: se elige, no se adivina | **rocola** |
| `/redondopedia/` | Índice | nada | **rocola** |
| `/redondopedia/[slug]/` — los que **no** son graves | Artículo | nada | **rocola** |
| `/redondopedia/muerte-del-indio/` · `/redondopedia/walter-bulacio/` · `/redondopedia/olavarria-2017/` | Los tres graves | — | **muda del todo** |
| `/diagnostico-audio/` | La herramienta que mide el audio | contaminaría la medición, que es lo único que esa página hace | **muda del todo** |

### Muda del todo contra cama: por qué esa elección y no la otra

Hay que elegir una y están elegidas las dos, cada una con su motivo. **Criterio propio del
rol:**

- **En los juegos vuelve la cama de `ADR-04`, entera y sin cambios.** No se apaga la cinta:
  se le saca la rocola. Tres razones: (1) la cama **no puede soplar nada**, porque adentro de
  un `Math.random()` filtrado no hay ningún tema; (2) cuesta **cero bytes**, así que no hay
  argumento de peso contra ella; (3) ya está probada callándose sola cuando suena un
  fragmento, con cinco pruebas que lo fijan (`cinta.test.ts:662-775`, **medido en el repo**).
  Apagar la cinta entera en los juegos sería sacarle a la gente algo que ya tenía y que no
  molesta a nadie — molinete al revés.
- **En los tres graves sigue muda del todo**, y esto no lo reabre este ADR: lo decidió una
  revisión adversarial del ciclo 11 y vive en `graves.ts` con dos candados puestos
  (`cinta.ts:194` y `scripts/cinta.ts:126`, **medido en el repo**). Acá se le suma el tercero:
  esas rutas nunca entran a `RUTAS_CON_ROCOLA`.
- **`/diagnostico-audio/` pasa a estar muda por escrito**, y en la práctica ya lo estaba: esa
  página no usa `Base.astro` y no importa `src/scripts/cinta.ts` (**medido en el repo**). Se
  escribe igual, porque es un instrumento de medición y cualquier sonido que el sitio agregue
  ahí es una lectura falsa. Es la única ruta que se agrega a la lista de `graves.ts` sin ser
  grave — y por eso el módulo se llama `rutas-sonoras.ts` y no `graves-v2.ts`.

---

## ADR-07.3 — La trampa del barrido, resuelta por escrito

**El problema, medido:** `cinta.ts` escucha `play`, `playing`, `pause` y `ended` en el
documento, en fase de captura, y mete en un conjunto todo medio que suene
(`cinta.ts:588-654`, **medido en el repo**). Una rocola que ponga temas por un `<audio>` del
documento **se calla a sí misma en el primer segundo**, y peor: el conjunto nunca se vacía,
así que se quedaría muda mientras el tema siga sonando. Tres pruebas fijan ese barrido
(`cinta.test.ts:691`, `:717`, `:932`) y **ninguna de las tres se toca**.

**La decisión: las dos formas juntas, porque una sola falla en silencio.**

### Forma 1 — el elemento vive fuera del documento

`new Audio()`, nunca `append`. El propio repo ya explica por qué alcanza: el `<audio>` de
repuesto del motor *"nunca entra al documento y por eso no lo vería ni un `Analyser` colgado
del grafo **ni un escucha de la página**"* (`cinta.ts:615-618`, **medido en el repo**). Los
eventos de un elemento desconectado no tienen al documento en su camino de propagación, así
que no llegan a la captura; y el barrido de arranque, que es un `querySelectorAll('audio,
video')` sobre el documento (`cinta.ts:643`), tampoco lo encuentra.

### Forma 2 — la marca, para que el día que alguien lo inserte no se rompa en silencio

La forma 1 alcanza **hoy** y es frágil **mañana**: `UX-26` puede querer controles nativos, o
alguien puede insertar el elemento para que el sistema operativo lo muestre en la pantalla
bloqueada, y ese día la rocola se calla sola sin que nadie entienda por qué. Entonces:

```ts
el.dataset.cinta = 'rocola';   // la marca, en el elemento, siempre
```

y `cinta.ts` la respeta en los **dos** lugares donde mira medios, que son dos y hay que tocar
los dos:

1. `medioDelEvento()` / `anotarMedio()`: un medio con `dataset.cinta === 'rocola'` **no entra
   al conjunto** `medios`.
2. El barrido de arranque de `registrarOidos()`: mismo filtro sobre el resultado de
   `querySelectorAll`.

**La marca la pone la rocola y la lee la cinta. No hay una tercera forma** —ni lista de
elementos conocidos, ni comparación por `src`, ni una bandera de módulo—: un elemento se
reconoce por lo que tiene, que es el mismo criterio que ya usa `medioDelEvento()` para no
romperse con elementos de otro documento (`cinta.ts:588-592`, **medido en el repo**).

### Qué prueba lo fija

En `cinta.test.ts` (casos nuevos, no tocan los tres que ya están):

| Caso | Qué cierra |
|---|---|
| Un medio **marcado** que dispara `play` **no** calla la cama | la exención existe |
| Un medio **sin marca** que dispara `play` **sigue** callando la cama | la exención no se comió el candado 3 |
| El barrido de arranque ignora al marcado y sigue viendo al que no lo está | el otro lugar, el que se olvida |

En `rocola.test.ts`: el elemento que crea la rocola **lleva la marca** y **no está conectado
al documento**. Las dos formas, cada una con su assert.

---

## ADR-07.4 — Cómo se sirve el audio: se transmite, no se decodifica

**La decisión:** `HTMLAudioElement` transmitiendo, metido al grafo por
`ctx.createMediaElementSource(el)`. **Nunca `decodeAudioData`.**

### Por qué no el camino que ya existe en el repo

`tema/audio.ts` baja el archivo entero con `fetch`, lo decodifica con `decodeAudioData` y lo
guarda en un `Map` con tope de tres (`audio.ts:201-234`, **medido en el repo**). Es lo
correcto **para un fragmento de diez segundos** y es exactamente lo que no hay que hacer con
un tema de cuatro minutos. Dos números, y son aritmética, no opinión:

| | Fragmento de `US-02` | Tema entero de cuatro minutos |
|---|---|---|
| Decodificado a 48 kHz, `Float32`, estéreo | ~3,8 MB | **~92 MB** (`240 × 48.000 × 4 × 2`) |
| Cuánto hay que bajar antes de oír la primera muestra | 79 KB | **el archivo entero, 3–4 MB** |

92 MB es quince veces el techo entero de audio residente del sitio, que `CTR-01.5` fija en
6,0 MB. Y lo segundo es peor que lo primero: con `decodeAudioData` la rocola tarda en
arrancar lo que tarde la descarga completa, en un teléfono con datos. Transmitiendo, suena
cuando llegó el primer pedazo.

### Por dónde entra al grafo, y las tres reglas de construcción que no son negociables

```
<audio>  fuera del documento · marcado · preload='none' hasta el gesto
   │
fuenteRocola   MediaElementAudioSourceNode   ← se crea UNA sola vez por página
   │
   └── la cadena de ADR-07.5 → volumenRocola → ctx.destination
```

1. **Un elemento por página y un `MediaElementAudioSourceNode` por elemento.** Crear un
   segundo nodo sobre el mismo elemento tira `InvalidStateError`, así que **el elemento se
   reusa cambiando `src`** para todas las piezas de la sesión. Es el mismo patrón que
   `audio.ts` ya usa con `this.repuesto` (`audio.ts:160-167`, **medido en el repo**).
2. **Todo lo que arma el grafo pasa adentro del gesto y antes de cualquier `await`.**
   `contextoDeAudio()` es sincrónico; `despertarSalida()` no. El orden es: crear el contexto,
   armar la cadena, conectar la fuente, poner el `src`, pedir `play()` — y **recién después**
   esperar a `despertarSalida()`. Al revés, el `play()` cae fuera del gesto y en iOS eso no
   vale nada; y además, entre el `play()` y el `connect` el tema saldría **sin filtro** por la
   salida directa.
3. **El repuesto, declarado:** si `createMediaElementSource()` tira, el elemento suena
   **crudo, sin filtro vintage**, con `el.volume` como control de nivel, y la marca lo sigue
   exentando del barrido. Es el mismo criterio que el repuesto del motor: *"mejor el `<audio>`
   impreciso que el silencio"* (`audio.ts:308`, **medido en el repo**). Sin filtro antes que
   sin sonido.

### El costo para el que escucha, que es parte de la decisión y no una nota al pie

`RES-50` cerró el lado del servidor: 180 MB no mueven la aguja contra los 100 GB/mes de
Vercel Hobby, y el audio no tiene cupo propio. **Eso no dice nada del teléfono.** Del lado
del que escucha:

- **Apagada: 0 bytes.** El elemento nace con `preload='none'` y sin `src`. Candado 1.
- **Un gesto sobre el interruptor, y recién ahí el primer byte.** Nunca desde el rearme de
  página (`ADR-07.8`).
- **Una pieza por vez. La rocola no precarga la siguiente.** Bajar el próximo tema mientras
  suena el actual duplicaría el gasto de alguien que apaga a los treinta segundos.
- **Hoy, el caso normal es el barato:** con 0 temas enteros, cada pieza son ~79 KB. La caída
  a recortes no es un consuelo, es el caso que va a correr.
- **Y cuando haya enteros, la rocola pasa a ser lo más caro que el sitio le pide a la red**,
  de lejos: media hora son ~8 temas ≈ 32 MB, contra los 120 KB que cuesta una partida entera
  de `US-02`. Por eso no se prende sola y por eso no precarga. Todo en `CTR-14`.
- **Si el navegador declara ahorro de datos**, la rocola pone recortes en vez de temas
  enteros, aunque haya enteros. **No afirmo que ese dato exista ni dónde**: es
  **pendiente de ficha** (`RES-57`). Si no existe, no se adivina nada y la regla no corre.

---

## ADR-07.5 — El filtro vintage: una cadena propia arriba, y la cama de `ADR-04` abajo

La pregunta del encargo era: reusar la cadena de `ADR-04` como inserto, o una cadena propia.
**La respuesta es que son dos cosas distintas y hacen falta las dos**, y verlo así ahorra
escribir dos veces los mismos números.

- **El siseo NO se sintetiza de nuevo: es la cama de `ADR-04`, corriendo abajo, sin tocarle
  una constante.** Siseo, piso, arrastre, bamboleo y flutter ya suenan a cinta girando; eso
  es precisamente lo que tiene que haber abajo de un tema para que suene salido de un casete.
  Cero números nuevos, cero nodos nuevos, y el silencio entre pieza y pieza deja de ser
  silencio y pasa a ser cinta corriendo — que es lo que hace que la púa tenga sobre qué caer.
- **La cadena de `ADR-04` NO se puede insertar sobre el tema**, y conviene decir por qué para
  que nadie lo intente: es un modelador de **ruido**. Un `lowpass` a 1400 Hz sobre una canción
  no suena a cinta, suena a una almohada encima del parlante. Y el bamboleo de la cama entra
  a `playbackRate` de un `AudioBufferSourceNode` (`cinta.ts:371-372`), parámetro que un
  `MediaElementAudioSourceNode` **no tiene**.
- **Entonces la cadena del tema es propia, y son cinco nodos.** *Criterio propio del rol: los
  valores están elegidos para afinarse de oído. Lo que no es afinable son los techos.*

```
fuenteRocola      MediaElementAudioSourceNode
   │
cuerpo            BiquadFilter 'highpass'  90 Hz · Q 0,7     el parlante chico del aparato
   │
brillo            BiquadFilter 'lowpass'   7500 Hz · Q 0,5   la cinta no llega arriba
   │
arrastreCinta     DelayNode  retardo 0,004 s
   │   ▲
   │   └── profundidadBamboleoRocola GainNode 0,0006 ← bamboleoRocola OscillatorNode 'sine' 0,7 Hz
   │                                   (entra a arrastreCinta.delayTime: el bamboleo del que gira)
volumenRocola     GainNode 0        ← el ÚNICO que se rampa
   │
ctx.destination
```

**El nodo que hace el truco es el `DelayNode`, y es la única forma que hay acá.** Un retardo
de pocos milisegundos, modulado lento, corre la altura del tema igual que una cinta que
arrastra: la desviación es `profundidad × 2π × frecuencia`, o sea `0,0006 × 2π × 0,7 ≈
0,26 %`. Es el orden de un casete gastado. Y la aritmética deja el techo escrito solo: un
semitono es 5,9 %, así que pasarse de `0,0015` (0,66 %) no da "aparato viejo", da "tema
desafinado", que es un chiste y no una atmósfera — el mismo criterio que `ADR-04.1` usa para
el flutter.

### Las constantes nuevas, con nombre, para que ninguna quede suelta

Viven al principio de `src/lib/sitio/rocola.ts`. Ningún número de audio se escribe dos veces
en este repo, y las de `ADR-04.1` **se importan, no se copian**.

| Constante | Valor | Qué pasa si se mueve |
|---|---|---|
| `GANANCIA_ROCOLA` | `0.9` | el nivel del tema. **Techo duro `1`**: arriba satura la suma con la cama |
| `CUERPO_HZ` | `90` · `Q_CUERPO` `0.7` | saca el sub que el parlante del teléfono no da igual |
| `BRILLO_HZ` | `7500` · `Q_BRILLO` `0.5` | arriba de ~12000 no se oye el efecto; abajo de ~4000 el tema suena tapado, no viejo |
| `BAMBOLEO_ROCOLA_HZ` | `0.7` | más rápido que el de la cama a propósito: acá se mide contra una nota afinada |
| `RETARDO_BASE_SEG` | `0.004` | **tiene que ser mayor que la profundidad**, o el retardo se va a negativo y el nodo se queja |
| `PROFUNDIDAD_BAMBOLEO_ROCOLA` | `0.0006` | 0,26 %. **No pasa de `0.0015`** — ver la aritmética de arriba |
| `SUBIDA_ROCOLA_SEG` | `0.6` | entra con la púa encima, así que no hace falta que sea lenta |
| `BAJADA_ROCOLA_SEG` | `0.15` | lo que tarda en irse antes de pausar. **No es `BAJADA_SEG`**: 20 ms sobre música es un corte, no una bajada |
| `DESCANSO_SEG` | `0.8` | lo que hay entre pieza y pieza antes de la púa. No es silencio: abajo sigue la cama |
| `FALLAS_SEGUIDAS` | `3` | tres piezas que no bajan y la rocola se rinde a `cama`. Ver `ADR-07.6` |

---

## ADR-07.6 — La fuente, el orden, y qué quiere decir "cuando no hay más"

### Lo que hay hoy, medido

**95 recortes** en `src/data/adivinar-tema.json` (95 apariciones de `"slug"`) y **0 temas
enteros** (`"entero": true` aparece **cero** veces). `public/audio/temas/` **no existe**
(`ORQ-plan-ciclo-14` §1). O sea: **el caso normal al arrancar es el de la caída.** Todo lo de
abajo tiene que funcionar con la fuente 1 vacía, porque así es como se va a estrenar.

### La vuelta es de temas, no de archivos

Esta es la decisión que evita el defecto que nadie ve hasta que pasa: si la vuelta fuera de
archivos, un tema con entero **y** con recorte saldría dos veces por vuelta, una entera y
otra en diez segundos. **Criterio propio del rol:**

> **Cada tema sale una vez por vuelta, y de cada tema suena la mejor pieza que tenga:
> el entero si existe, el recorte si no.**

Y adentro de la vuelta, el orden que pide el pedido textual:

1. **Primero los temas que tienen entero**, sorteados entre ellos.
2. **Después los que solo tienen recorte**, sorteados entre ellos.

Con eso, *"tema entero primero; cuando no hay más, recorte entero"* es literal: cuando se
acaban los enteros, lo que sigue son recortes. Hoy el primer tramo está vacío y la vuelta son
los 95 recortes sorteados, que es exactamente lo que el pedido describe.

### "Cuando no hay más", sin ambigüedad

La rocola pide la próxima pieza así, y no hay otra lectura posible:

| Paso | Qué pregunta | Qué hace |
|---|---|---|
| 1 | ¿Queda algún tema **con entero** que no haya salido en esta vuelta? | suena el entero |
| 2 | Si no: ¿queda algún tema **con recorte** que no haya salido en esta vuelta? | suena el recorte, **entero**: los ~10 s completos, no la escalera de `D-26` |
| 3 | Si tampoco: **la vuelta se agotó** | se arma una vuelta nueva con todo, y se sortea de nuevo |

**Al rearmar la vuelta, el último tema que sonó no puede quedar primero.** Sin esa línea, el
empalme entre vueltas es el único lugar donde se puede oír el mismo tema dos veces seguidas,
y es justo el que se nota.

**La vuelta no se guarda.** Vive en memoria, muere con la página, y no escribe una clave
nueva en `localStorage`: `ADR-04.5` dice *"no se guarda nada más"* y sigue valiendo. Lo que
se pierde es la protección contra repetir un tema después de navegar, y eso es una chance
sobre 95. Lo que se gana es no guardar qué escuchó la gente, que es algo que este sitio no
hace (`D-10`).

### Una pieza que no baja

`error` en el elemento, o `ended` sin haber sonado: esa pieza queda marcada como gastada para
esta vuelta y se pasa a la siguiente, **sin reintentar el mismo archivo**. A las
`FALLAS_SEGUIDAS` (3), la rocola se rinde y la cinta cae a `cama` — que sigue sonando y no
cuesta bytes. Rendirse a la cama, y no apagarse, es la forma de que un teléfono que perdió la
red no termine en silencio.

---

## ADR-07.7 — La púa: el ruido de cambio, sintetizado

Es lo que el pedido llama *"un ruido como cambia el vinilo o el cassete"*. La construcción es
`T-218` y no es mía; **el contrato sí**.

### Dónde suena, y por qué eso la vuelve funcional en vez de decorativa

**Suena al arrancar cada pieza, incluida la primera**, y el `play()` se pide **junto con
ella**, no después. El motivo no es de gusto: un `<audio>` que recién recibió su `src` tarda
en dar la primera muestra —es el defecto que `audio.ts:370-381` ya documenta para el
repuesto, **medido en el repo**—, y ese hueco sonaría a que el sitio se rompió. **La púa tapa
la latencia de arranque del stream.** Si el tema tarda más que `PUA_SEG`, queda la cama abajo
y se aguanta.

Y hay que decirlo explícitamente porque `ADR-04.1` lo prohibía: **la púa es la única excepción
escrita a "ningún evento sonoro puntual"**. La prohibición sigue entera para los eventos de
**interfaz** —clic, acierto, error, cambio de pantalla— y la púa no es uno: no la dispara un
dedo, la dispara el aparato cambiando de pieza. Ese es el límite, y está escrito para que no
se estire.

### El contrato del módulo `src/lib/sitio/pua.ts`

Módulo **hoja**: no importa nada, ni siquiera `contexto.ts`. Recibe el contexto y el nodo
adonde tiene que ir. Así `T-218` queda paralela a `T-217` y `D-29` se cumple por
construcción.

```ts
/** Las constantes de ADR-07.7. Acá una vez, en ningún otro lado. */
export const PUA_SEG = 0.5;

/**
 * Suena la púa: el golpe del mecanismo, el barrido hasta apoyar, y el surco vacío.
 * Programa todo en el reloj del contexto y devuelve el instante en que termina.
 * No conecta a `destination`: va al nodo que le pasen, para que se calle con todo lo demás.
 */
export function pua(ctx: AudioContext, destino: AudioNode, cuando?: number): number;

/** Suelta el buffer de ruido del módulo. Solo para las pruebas. */
export function reiniciarPuaParaPruebas(): void;
```

| Constante | Valor | Qué es |
|---|---|---|
| `PUA_SEG` | `0.5` | el gesto entero: golpe + barrido + surco |
| `GOLPE_SEG` | `0.015` | el clac del mecanismo al trabar |
| `GOLPE_HZ` | `2200` · `Q_GOLPE` `1.2` | bandpass: plástico y madera, no metal |
| `BARRIDO_DESDE_HZ` | `5000` | la púa deslizando, arriba |
| `BARRIDO_HASTA_HZ` | `400` | dónde apoya |
| `BARRIDO_SEG` | `0.18` | lo que tarda en bajar. Más y suena a efecto de dibujo animado |
| `SURCO_SEG` | `0.3` | el surco vacío antes del tema |
| `CHASQUIDOS` | `3` | el polvo, impulsos de 1–2 ms sorteados adentro del surco. Más de tres y es una parodia |
| `GANANCIA_PUA` | `0.18` | **techo duro `0.3`**. Se afina de oído contra `GANANCIA_ROCOLA` |
| `LARGO_RUIDO_PUA_SEG` | `0.5` | el buffer propio del módulo: ~96 KB a 48 kHz, generado una vez por página |

**Prohibido adentro de `pua.ts`**, y es la lista de `ADR-04.1` sin descuento: `ConvolverNode`,
`AudioWorkletNode`, `ScriptProcessorNode`, cualquier archivo, cualquier `setTimeout` —se
programa en el reloj del audio y se frena con `stop(t)`, como hace `desarmar()` en
`cinta.ts:423-452`— y cualquier importación.

---

## ADR-07.8 — Qué pasa al navegar

**El tema se corta. No sigue sonando.** No es una preferencia: `ADR-03` eligió tránsito
**entre documentos**, el documento viejo se descarta entero y el `<audio>` se va con él. Para
que sobreviviera haría falta un enrutador de cliente, que es exactamente lo que `ADR-03`
descartó después de pesarlo contra seis islas y un motor de audio. **No se reabre `ADR-03`
por la rocola**, y el corolario de `ADR-03` §4.1 vale igual acá: lo que se corta al navegar,
se corta.

Lo que sí decido, porque es la consecuencia cara:

> **El rearme de página (`ADR-04.4`) prende la cama, nunca la rocola.**

`rearmarCinta()` arma un escucha de un solo uso sobre el primer toque de la página
(`cinta.ts:787-800`, **medido en el repo**). Eso está bien para una pieza que cuesta cero
bytes y está mal para una que cuesta 4 MB: alguien que prendió la cinta una vez y después
recorre ocho pantallas se llevaría **32 MB que no pidió en ninguna de las ocho**, sin
enterarse. Encima, un tema al azar cortado a los cuarenta segundos y reemplazado por otro
tema al azar en cada toque no es poner un tema: es un defecto con música.

Entonces: la preferencia guardada sigue significando lo mismo que hoy para la cama —se rearma
sola, 0 bytes— y **la rocola sube solo desde un toque sobre el interruptor**. Es el candado 1
endurecido, visto desde el otro lado.

**Lo que esto le deja a `experiencia`, y es de `UX-26` decidirlo:** en una ruta de rocola,
después de navegar, la cinta puede estar sonando en modo cama mientras el interruptor tiene
que poder ofrecer "poné un tema". Eso es una posición más del control, y la hoja es suya.
Dejé la propuesta en `Docs/SUGERENCIAS/ARQ-para-experiencia-la-rocola.md`.

### Y la otra preferencia, la de atención, que acá se invierte

`ADR-04.8` manda callar la cama con la página escondida: *"un sitio que sigue siseando en el
bolsillo es el peor final posible de esta pieza"*. **Para la rocola decido lo contrario, y es
un desvío declarado de `ADR-04.8`:**

> **La rocola sigue sonando con la pantalla apagada o con la pestaña atrás. La cama no.**

El motivo, en una línea: `visibilityState` dice que la persona **dejó de mirar**, no que dejó
de escuchar. Para una cama que imita el lugar donde estás, dejar de mirar es dejar de estar.
Para un tema que pusiste con el dedo, no — y un reproductor que se corta cuando se bloquea el
teléfono es el defecto clásico del audio en la web. La preferencia 3 de `ADR-04.8` sigue
mandando igual: si el sistema se lleva el contexto (una llamada, Siri), **no se pelea**.

En el código eso quiere decir que `debeCallarse()` se parte en dos preguntas, una por modo.
El resto de las razones —un medio ajeno sonando, la salida tomada, el contexto fuera de
`running`— valen para los dos.

---

## ADR-07.9 — Los módulos, y el contrato revisado de la cinta

### Los tres archivos nuevos, y qué puede importar cada uno

| Archivo | Qué es | Qué importa |
|---|---|---|
| `src/lib/sitio/rutas-sonoras.ts` | El mapa de `ADR-07.2`: `ModoCinta`, `modoEnRuta()`, `RUTAS_CON_ROCOLA`, `PAGINAS_DECLARADAS` | solo `./graves.ts`, que no importa nada. **Una sola verdad sobre los tres graves** |
| `src/lib/sitio/pua.ts` | `ADR-07.7` | **nada**. Módulo hoja |
| `src/lib/sitio/rocola.ts` | El motor: la vuelta, la cadena de filtro, el elemento, la caída | `../audio/contexto.ts`, `./rutas-sonoras.ts`, `./pua.ts` |

**Ninguno importa un `node:*` por ningún camino** (`D-29`), y ninguno importa
`src/data/*.json`: la lista de piezas **llega como argumento** (abajo). `src/lib/islas.test.ts`
lo verifica recorriendo el grafo desde `src/scripts/`.

### De dónde saca la rocola la lista de piezas, sin bajar nada y sin perder el gesto

**El problema:** elegir el slug hay que hacerlo **sincrónicamente**, adentro del gesto, antes
del `play()`. Un `import()` dinámico resuelve rápido pero resuelve **después**, y del otro
lado del `await` ya no estamos adentro del gesto. Y meter el JSON como importación estática
de `cinta.ts` lo mandaría a las seis pantallas de juego, donde la rocola no suena nunca.

**La decisión:** la lista la imprime la página **en build**, y solo donde puede sonar.
`Base.astro` ya sabe la ruta cuando construye, así que imprime un
`<script type="application/json">` con `{slug, titulo, entero}` de cada tema **únicamente si
`modoEnRuta(...) === 'rocola'`**. La isla lo lee al montar —es texto que ya está en el
documento, no hay pedido de red— y llama a `sembrarRocola(piezas)`. Con eso:

- **cero bytes extra** en las pantallas de juego y en los graves: ahí el `<script>` no se
  imprime;
- **cero `await`** entre el dedo y el `play()`;
- **el candado C**: una pantalla que no sembró no tiene con qué sonar y cae a `cama`;
- y es el mismo patrón que el sitio ya usa para los bancos de los juegos —*"el banco se
  resuelve en build, al navegador llega JSON ya filtrado"* (`adivinar-la-tapa.astro:9-10`,
  **medido en el repo**).

### El contrato: delta sobre `ADR-04.6`

Lo que `cinta.ts` **agrega**. Todo lo demás de `ADR-04.6` queda igual, incluidos los cuatro
estados: `apagada | sonando | callada | bloqueada` **no cambian**, porque describen el sonido
y no el modo.

```ts
/** El apagado de emergencia de la rocola, aparte del de la cama. Literal, para grepear. */
export const ROCOLA_HABILITADA = true;

/** Qué puede hacer la cinta acá. Lo decide la ruta, nunca la persona. */
export type ModoCinta = 'rocola' | 'cama';

/** Qué está haciendo ahora mismo. Barato: no crea nada. */
export function modoDeLaCinta(): ModoCinta;

/** Qué tema está sonando, o `null`. Es el candado 4 caído, y lo pinta `UX-26`. */
export function piezaSonando(): Pieza | null;

/** Prender. Sin `modo`, el que permita la ruta. `rearmarCinta()` llama siempre con 'cama'. */
export function prenderCinta(modo?: ModoCinta): Promise<EstadoCinta>;

/** Pasar a la que sigue. Solo desde un gesto: mueve bytes. */
export function proximaPieza(): void;
```

Y en `rocola.ts`:

```ts
export interface Pieza { readonly slug: string; readonly titulo: string; readonly entero: boolean; }

/** La lista que imprimió la página. No baja nada, no suena nada, no crea un nodo. */
export function sembrarRocola(piezas: readonly Pieza[]): void;
/** Arranca. SOLO desde adentro de un gesto, y solo si `modoEnRuta` lo permite. */
export function prenderRocola(ctx: AudioContext, salida: AudioNode): boolean;
export function apagarRocola(): void;
export function reiniciarRocolaParaPruebas(): void;
```

**`prenderRocola()` vuelve a mirar la ruta por su cuenta**, aunque `cinta.ts` ya la haya
mirado. Son los dos candados sobre la misma puerta del patrón de `graves.ts`: el primero lo
pone la isla, el segundo el módulo, *"la toque quien la toque y desde donde la toque"*
(`cinta.ts:185-194`, **medido en el repo**).

---

## CTR-14 — El presupuesto de la rocola

`CTR-01.5` fija 6,0 MB de audio residente y `ADR-04.9` le sumó la cama. La rocola suma estas
líneas, y **no sube el techo del sitio**, por una razón que vale la pena escribir: **la
rocola y el motor de fragmentos nunca conviven en la misma ruta.** Donde suena la rocola no
hay `Reproductor`; donde hay `Reproductor` la cinta está en modo cama. La rocola **reemplaza**
al motor en el presupuesto, no se le apila.

| Concepto | Cuenta | Total |
|---|---|---|
| **Red, cinta apagada** | siempre | **0 bytes** |
| **Red, por recorte** | 7,5 MB / 95 archivos (`ORQ-plan-ciclo-14` §1, **medido**) | **~79 KB** |
| **Red, por tema entero** | ~4 MB a 128 kbps (`D-23`) | **≤ 4 MB. Techo de contrato** |
| **Red, media hora de rocola con enteros** | ~8 temas | **~32 MB** |
| **Red, media hora de rocola con recortes (hoy)** | ~180 piezas de 10 s | **~14 MB** |
| **RAM, el buffer de la púa** | `0,5 × 48.000 × 4` | **≈ 0,10 MB** |
| **RAM, la cama** | `ADR-04.9` | **≤ 0,77 MB** |
| **RAM, el tema** | lo administra el navegador, que transmite | **no se decodifica: 0 en nuestra cuenta** |
| **Nodos vivos con la rocola puesta** | 11 de la cama + 5 del inserto + 1 fuente | 17 |
| **Precarga de la próxima pieza** | — | **prohibida** |

**Lo que este contrato no fija:** el bitrate de los temas enteros, que sigue siendo de
`ADR-01` y de `D-22`. Lo que `CTR-14` le pone es el techo que ese bitrate tiene que respetar:
**4 MB por tema**. A 128 kbps, un tema de cuatro minutos entra justo; a 192 no entra.

---

## ADR-07.10 — Qué queda prohibido, en una lista para revisar

1. **Que la rocola suene en una ruta que no está en `RUTAS_CON_ROCOLA`.** Es el punto 1 y
   todos los demás vienen después.
2. Una lista **negra** de rutas mudas en vez de una lista blanca.
3. `decodeAudioData` sobre un tema entero. Nunca, por ningún motivo.
4. Precargar la próxima pieza mientras suena la actual.
5. Pedir un byte de audio sin un gesto sobre el interruptor — incluido el rearme de página.
6. Un segundo `MediaElementAudioSourceNode` sobre el mismo elemento, o un segundo elemento.
7. Un `AudioContext` fuera de `contexto.ts` (excepción única: `diagnostico-audio.ts`).
8. Un archivo nuevo para la cama o para la púa: mp3, worklet, respuesta de impulso. Cero.
9. Guardar en `localStorage` qué temas sonaron, o cualquier clave nueva.
10. Que la rocola toque `src/scripts/partida-tema.ts`, o que un juego le avise algo. La capa
    de audio ya sabe lo que necesita saber.
11. Un número de audio escrito fuera de las tablas de `ADR-04.1`, `ADR-07.5` y `ADR-07.7`.
12. Encuestar: `setInterval`, `requestAnimationFrame` o un `Analyser` para saber qué pasa.
    Todo cuelga de eventos del elemento (`ended`, `error`) y del reloj del audio.

---

## Alternativas descartadas

| Alternativa | Por qué no |
|---|---|
| **Decodificar el tema a `AudioBuffer`, como hace el motor de fragmentos** | ~92 MB de RAM por tema de cuatro minutos, quince veces el techo entero de `CTR-01.5`, y no suena una muestra hasta que bajó el archivo completo. Es la forma correcta para diez segundos y la peor posible para cuatro minutos |
| **Una lista negra: la rocola suena en todos lados menos en los juegos** | El octavo juego nace sonando y el error se descubre jugando. Con lista blanca nace mudo y el error se descubre leyendo. La asimetría del daño es toda: un juego que no pone música es una pena, un juego que sopla la respuesta rompe lo único que el sitio promete |
| **Afinar la mudez juego por juego, dejando sonar a `dos-ejes` y `ponelos-en-fila`** | Los dos son pantallas de juego y uno reparte doce temas sorteados. Y sobre todo: la regla fina obliga a rediscutir cada juego nuevo, y una regla que hay que rediscutir es una regla que alguien va a resolver mal con apuro |
| **Mudez decidida por la pantalla del juego, avisándole a la cinta** | Es lo que `ADR-04.3` ya descartó, y por el mismo motivo: cada juego nuevo tendría que acordarse de avisar. Acá la ruta se mira sola, en la capa de audio, en tres lugares |
| **Callar la cinta entera en las pantallas de juego, en vez de volver a la cama** | Le saca a la gente algo que ya tenía, que no cuesta bytes y que no puede soplar nada. Molinete al revés |
| **Insertar la cadena de `ADR-04` sobre el tema** | Es un modelador de ruido: un `lowpass` a 1400 Hz sobre una canción es una almohada encima del parlante, y su bamboleo entra a un `playbackRate` que el nodo de un `<audio>` no tiene |
| **Sintetizar un siseo nuevo para acompañar al tema** | Ya existe y está probado: es la cama. Sintetizar el segundo sería escribir los mismos números dos veces, que es lo que este repo prohíbe |
| **Un `WaveShaperNode` para la saturación de cinta** | Sin `oversample` agrega aliasing, con `oversample` cuesta CPU en un teléfono, y el efecto que de verdad hace "viejo" acá es la banda recortada, no la distorsión. Queda como afinación posible, no como parte del diseño |
| **Que la rocola siga sonando al navegar** | Exige un enrutador de cliente, o sea reabrir `ADR-03`, que se decidió pesando seis islas y un motor de audio contra un cruce de medio segundo. No se reabre por esto |
| **Rearmar la rocola con el primer toque de cada página, como se rearma la cama** | 4 MB por pantalla sin que nadie los pida, y un tema al azar cortado a los cuarenta segundos en cada toque. Es un defecto con música |
| **Precargar el próximo tema para que el empalme sea perfecto** | Duplica el gasto de quien apaga a los treinta segundos. El empalme lo tapa la púa, que cuesta cero bytes |
| **Guardar la vuelta en `localStorage` para no repetir al cambiar de pantalla** | Una clave nueva y un registro de qué escuchó la gente, a cambio de una chance sobre 95. `ADR-04.5` dice "no se guarda nada más" y sigue teniendo razón |
| **Un segundo interruptor, uno para la cama y otro para la rocola** | Dos controles para una sola cosa que hace ruido. El interruptor es uno; el modo lo decide la ruta y la posición la decide `UX-26` |
| **Sortear el fragmento con la escalera de `D-26` en vez del recorte entero** | El pedido dice "recortes enteros" y tiene razón: la escalera es el juego, y afuera del juego es un archivo que se corta solo |
| **Un `<audio controls>` nativo, insertado en el documento** | Se calla a sí mismo contra el barrido de `ADR-04.3` salvo por la marca, no se le puede meter el filtro sin `createMediaElementSource` igual, y la forma del control es de `UX-26`, no del navegador |

---

## Consecuencias

**Lo que se vuelve fácil:**

- El sitio suena a lo que es. La pieza más cara de producir —el audio— ya estaba en disco y
  se usaba en un solo juego.
- **El mapa de rutas queda escrito y auditado a máquina.** Hoy no existía ninguna lista de
  "dónde puede sonar qué": había dos candados sobre los tres graves y nada más. Después de
  esto, cada pantalla del sitio tiene un veredicto y agregar una sin veredicto rompe el build.
- La cama gana un trabajo nuevo sin cambiar una constante: deja de ser solo atmósfera y pasa
  a ser el siseo abajo del tema y el relleno entre pieza y pieza.
- El día que aparezca el primer tema entero (`T-219`), la rocola lo pone **sin tocar una
  línea**: la fuente 1 deja de estar vacía y el orden ya está escrito.

**Lo que se paga:**

- **Cae el candado 2 y con él el argumento de que esta pieza era intocable.** De acá en más,
  la cinta transfiere. La defensa queda en el candado 1 endurecido y en `CTR-14`, que son más
  frágiles que "cero bytes siempre" porque dependen de que alguien los respete.
- **Se toca `cinta.ts`, que tiene 989 líneas de pruebas encima** (`cinta.test.ts`, **medido en
  el repo**). El alcance del cambio es chico y está escrito: la marca en dos lugares del
  barrido, el modo, y partir `debeCallarse()`. Los tres casos de `:691`, `:717` y `:932` **no
  se tocan y tienen que seguir verdes**.
- **Si los temas enteros terminan viviendo fuera del origen del sitio** —R2, GitHub Releases
  o archive.org, las tres vías que `RES-50` §6 dejó sobre la mesa—, `createMediaElementSource()`
  necesita que ese origen mande `Access-Control-Allow-Origin` o el filtro vintage se apaga. Es
  una restricción nueva que `ADR-01` tiene que tener en cuenta al elegir dónde viven los
  archivos, y antes de este ADR no existía.
- **Con recortes, la púa suena cada diez segundos.** Es el caso que hay que escuchar antes de
  dar esto por bueno, y es el que va a correr el día del estreno. Si cansa, el número a mover
  es `DESCANSO_SEG`, no la púa.
- **Nada de esto se audita del todo a máquina.** Que el filtro suene a casete y no a
  almohada lo decide un oído. Las pruebas fijan el mapa, la exención y el orden; el timbre se
  afina moviendo seis constantes.

---

## Lo que no decido yo

- **Qué se ve y qué se toca cuando la rocola pone un tema**: `UX-26` (`T-216`, `experiencia`).
  Le dejé el candado 4 caído, los dos modos, el asunto del interruptor después de navegar y el
  control de "poné otro" en `Docs/SUGERENCIAS/ARQ-para-experiencia-la-rocola.md`.
- **El texto visible**: de `contenido` y `experiencia`, bajo `voz-ricotera.md`. Lo único que
  fijo acá es que el crédito de lo que suena es **registro 3** —dice qué hay adentro y se
  calla—, igual que el aviso de `bloqueada` de `ADR-04.4`.
- **El bitrate y dónde viven los temas enteros**: `ADR-01`, que sigue abierta. `CTR-14` le
  pone el techo de 4 MB por tema y la restricción de CORS; lo demás es de ese ADR.
- **La construcción**: `T-217` y `T-218`, hilo principal. La verificación la corre él o
  `revisor` (`D-12`).

---

## Pendientes de ficha — para `investigador`, del rango libre (`RES-56`+)

Ninguna frena esta decisión. Las tres cambiarían un repuesto o confirmarían una elección ya
tomada. Pedido dejado en `Docs/SUGERENCIAS/ARQ-para-investigador-rocola.md`.

1. **`RES-56` — ¿`createMediaElementSource()` sobre un `<audio>` reproduce con sonido en
   Safari de iOS actual?** Hay antecedentes conocidos de silencio con ese nodo en iOS. El
   diseño tiene repuesto declarado (`ADR-07.4`: sin filtro antes que sin sonido), pero el
   repuesto solo salta si el constructor **tira**; si devuelve un nodo mudo, no hay forma de
   detectarlo y la ficha es lo único que puede avisar.
2. **`RES-57` — ¿Existe una señal de "ahorro de datos" expuesta a la web, en qué navegadores
   móviles, y qué reporta?** Si existe, la rocola cae a recortes aunque haya enteros. Hoy no
   afirmo que exista y la regla no corre.
3. **`RES-58` — ¿Un `HTMLMediaElement.play()` disparado después de un `await` corto sigue
   contando como gesto en Safari de iOS?** El diseño está hecho para que la respuesta no
   importe —el `play()` va antes de todo `await`, `ADR-07.4` regla 2—, igual que `ADR-04.2`
   hizo con la cantidad de contextos. Sirve para saber si la regla 2 se puede relajar algún
   día o si hay que defenderla con una prueba.

---

## Cómo se verifica

**Lo que se puede correr hoy, antes de que exista una línea de `rocola.ts`.** Es la línea de
base y tiene que dar exactamente dos resultados, en `contexto.ts` y en `diagnostico-audio.ts`:

```bash
grep -rn "new AudioContext\|webkitAudioContext\|new Ctor()" src/lib src/scripts
# y el que este ADR agrega, que después de T-217 no puede nombrar ningún archivo
# fuera de src/lib/sitio/rocola.ts:
grep -rn "createMediaElementSource\|decodeAudioData" src/lib src/scripts
```

`decodeAudioData` tiene que seguir apareciendo **solo** en `src/lib/tema/audio.ts:206`
(**medido en el repo**). Si aparece en `rocola.ts`, la regla más dura de este documento se
rompió.

**Los tests:**

```bash
node --test src/lib/sitio/rutas-sonoras.test.ts   # nuevo, T-217: el mapa y el censo
node --test src/lib/sitio/rocola.test.ts          # nuevo, T-217
node --test src/lib/sitio/pua.test.ts             # nuevo, T-218
node --test src/lib/sitio/cinta.test.ts           # los casos de :691, :717 y :932 SIN tocar
node --test src/lib/tema/audio.test.ts            # no se le toca un assert
node --test src/lib/islas.test.ts                 # D-29: ni rocola ni pua arrastran node:*
npm test && npm run check && npm run build
```

**Los casos que esos archivos nuevos tienen que cubrir.** Cada uno cierra un apartado; sin
ellos, el apartado es una opinión:

| # | Caso | Cierra |
|---|---|---|
| 1 | `modoEnRuta()` devuelve `cama` para las **ocho** rutas de juego y de quiz, una por una | `ADR-07.2` |
| 2 | `modoEnRuta()` devuelve `muda` para los tres graves y para `/diagnostico-audio/` | `ADR-07.2` |
| 3 | **El censo**: toda página de `src/pages/**/*.astro` está en `PAGINAS_DECLARADAS`, y toda declarada existe | `ADR-07.2` |
| 4 | Una ruta inventada que no está en la lista blanca cae a `cama` | `ADR-07.2` |
| 5 | **La que tiene que fallar si alguien se equivoca**: `prenderRocola()` en una ruta de juego devuelve `false`, **no crea un nodo y no pide un byte** | `ADR-07.2` |
| 6 | El elemento de la rocola lleva `dataset.cinta === 'rocola'` y **no** está conectado al documento | `ADR-07.3` |
| 7 | Un medio **marcado** que dispara `play` no calla la cama; uno **sin marca**, sí | `ADR-07.3` |
| 8 | El barrido de arranque de `registrarOidos()` ignora al marcado | `ADR-07.3` |
| 9 | La rocola no llama a `decodeAudioData` ni una vez, y crea **un** `MediaElementAudioSourceNode` en toda la sesión | `ADR-07.4` |
| 10 | Con `createMediaElementSource` que tira: el elemento suena igual, sin cadena de filtro | `ADR-07.4` |
| 11 | Con 0 enteros y 95 recortes, las 95 primeras piezas son **95 temas distintos** | `ADR-07.6` |
| 12 | Con enteros sembrados, **todos los enteros salen antes** que el primer recorte | `ADR-07.6` |
| 13 | Agotada la vuelta, la vuelta nueva **no arranca con el último tema que sonó** | `ADR-07.6` |
| 14 | Un tema con entero **y** con recorte sale **una sola vez** por vuelta | `ADR-07.6` |
| 15 | Tres `error` seguidos dejan la cinta en `cama`, sonando, y sin reintentar el mismo archivo | `ADR-07.6` |
| 16 | `pua()` no conecta a `ctx.destination`, no arma un `setTimeout` y devuelve un instante mayor que `cuando` | `ADR-07.7` |
| 17 | Con `document.hidden`: la rocola **sigue**, la cama se calla | `ADR-07.8` |
| 18 | `rearmarCinta()` prende en modo `cama` **incluso en una ruta de rocola**, y no pide un byte | `ADR-07.8` |
| 19 | Con `ROCOLA_HABILITADA = false`: `modoDeLaCinta()` es `cama` en todas las rutas y la cama sigue funcionando igual | `ADR-07.9` |
| 20 | Sin `sembrarRocola()`, `prenderRocola()` devuelve `false` (candado C) | `ADR-07.9` |

**Lo que ninguna máquina puede verificar, y lo corre una persona en un teléfono de verdad**
(`D-12`: no soy yo):

1. Prender la cinta en el portal: **tiene que sonar a casete, no a un tema con un filtro
   puesto encima**. Si suena tapado, el número es `BRILLO_HZ`; si suena limpio, es
   `PROFUNDIDAD_BAMBOLEO_ROCOLA`.
2. Escuchar **tres empalmes seguidos** con recortes. Es el caso del estreno y el que más
   puede cansar: la púa cada diez segundos. Si cansa, `DESCANSO_SEG`.
3. Entrar a "Adiviná el tema" con la cinta prendida en el portal: **no puede sonar un solo
   tema en esa pantalla**, y el escalón de 0,1 s tiene que sonar exactamente igual que con la
   cinta apagada.
4. Lo mismo, ruta por ruta, con las catorce de la tabla de `ADR-07.2`. Es lo que `T-225` mira
   a mano en vez de confiar en el test, y es el riesgo número uno del ciclo.
5. Bloquear el teléfono con un tema sonando: **el tema sigue**. Volver: sigue igual, no
   arrancó de nuevo.
6. Con datos móviles y la cinta apagada, recorrer cuatro pantallas: **cero pedidos de audio**
   en la pestaña de red. Ese es el candado 1 endurecido, y es el único que protege a quien
   tiene datos contados.
