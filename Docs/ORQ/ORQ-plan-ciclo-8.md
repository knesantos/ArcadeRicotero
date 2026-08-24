# ORQ — Plan del ciclo 8: los números de escuchas, y el test de los dos ejes

> **Escrito por el hilo principal** con `/ciclo`, el 2026-08-24, sobre dos pedidos del
> usuario en la misma frase: *"agregando informacion de cantidad de escuchas de cada tema
> en spotify y youtube para poder rankear temas por mas escuchas y demas, asi conocer los
> populares y los mas oscuros"* y *"que armes el juego de los 2 ejes de redondos, un eje
> luz oscuridad y otro eje orden caos"*.

## Lo primero, porque si no se dice acá no se dice en ningún lado

**Ninguno de los dos frentes acerca el "Listo" de la v1.** Conviene tenerlo a la vista
antes de empezar, no después.

El "Listo" son cuatro juegos con su piso (`D-05`). Después del ciclo 7 el tablero es:

| Historia | Piso | Hoy | Qué falta |
|---|---|---|---|
| `US-01` Quiz | 40 | **40** | ✅ |
| `US-02` Adiviná el tema | 30 | 0 | **los mp3** — ffmpeg y la discografía del usuario |
| `US-03` Completá la letra | 15 | 0 de 1.784 | **quince escuchas** — una persona, veinte minutos |
| `US-04` Adiviná la tapa | 10 | **10** | ✅ |
| `US-05` Redondopedia | 35 | **35** | ✅ |

**Lo que falta de la v1 no lo puede hacer un rol.** Las dos cosas que quedan son de la mano
del usuario, y este ciclo no las toca. Eso está bien —el usuario pidió otra cosa y es su
proyecto— pero queda escrito para que dentro de dos ciclos nadie se pregunte por qué la v1
no cerró.

**Con una excepción, y no es chica.** El frente de las escuchas puede destrabar algo que
quedó abierto en el ciclo 7: `arquitectura` dejó una pregunta para `producto` porque la
cuota de "al menos 8 fáciles" de `US-02` **ya no tiene dónde vivir** — con el buscador, la
etiqueta de dificultad por ítem dejó de existir. Si hay un número de escuchas por tema,
"fácil" pasa a ser medible: *un tema por encima de tal corte*. Es la única parte de este
ciclo que le sirve a la v1, y por eso `T-116` existe.

## 🔴 Actualización del mismo día: Spotify se cayó, YouTube quedó en pie

**Las dos fichas volvieron mientras el plan se escribía, y una de las dos mitades del
pedido no se puede hacer.** El plan de abajo queda como estaba —es lo que se planificó y
sirve leerlo— pero manda esto:

**`RES-51`: la vía de Spotify está cerrada, y no por dificultad técnica.** Tres cosas, en
orden de qué tan definitiva es cada una:

1. **El número de reproducciones nunca existió** en la API pública. Pedido desde 2018 en un
   issue oficial que sigue abierto.
2. Lo que sí existía era `popularity`, un índice 0–100. **Lo removieron en febrero de
   2026** para las apps en Development Mode.
3. La única modalidad que lo conserva, Extended Quota, exige **organización legal
   registrada y 250.000 usuarios activos mensuales**. Un fan site que ven veinte personas
   no califica hoy ni va a calificar.

Y de paso `RES-51` re-verificó `RES-26`: la cláusula que prohíbe los juegos **no distingue**
entre usar contenido y usar metadata, ni entre "el juego usa la API" y "el sitio que lo
aloja la usa". O sea que aunque el dato existiera, habría que decidirlo bajo `D-14`.

**`RES-52`: YouTube sí se puede, y mejor de lo que se esperaba.** Hay canal Topic —el que
arma YouTube desde el distribuidor, no un fan—, el conteo de vistas se lee con 1 unidad de
cuota, y **los términos autorizan explícitamente guardar y mostrar ese número** (Developer
Policies III.E.4), con dos obligaciones: mantenerlo razonablemente fresco y atribuir a
YouTube. Refrescar los 105 temas cuesta 3 unidades sobre una cuota diaria de 10.000.

**Lo que cambia en el frente A:**

- El dato es **uno solo, no dos**. Y `RES-52` es explícito en que las vistas de YouTube y
  las escuchas de Spotify **no son comparables**: aunque hubiera las dos, sumarlas o
  promediarlas sería una invención del sitio.
- **El ranking pasa a ser "según YouTube", no "según lo escuchado"** — dos frases
  distintas, y el sitio solo puede escribir la cierta.
- Aparece una obligación nueva que no estaba en el plan: **el número tiene que poder
  refrescarse**, porque los términos lo piden. Un JSON congelado en agosto y nunca más
  tocado no cumple.
- `T-116` deja de ser "qué promete el sitio" y pasa a ser **"qué promete el sitio ahora que
  la mitad del insumo no existe"**. Es el mismo patrón de `BR-06`, cuando la promesa de
  escuchar el tema entero por Spotify resultó no cumplible y hubo que reescribirla en vez
  de sostenerla.

---

## Frente A — cuántas veces se escuchó cada tema

### El problema que hay que resolver antes de escribir una línea

Un número de escuchas no es un hecho estable: **es una medición con fecha**. El sitio es
estático y no tiene backend, así que el número se pide una vez, se guarda en un JSON y se
queda ahí envejeciendo. Eso es perfectamente honesto **si el rótulo lo dice** — y es
exactamente el mecanismo de `D-14`: el rótulo tiene que decir la verdad sobre lo que hay
adentro. "El más escuchado" y "el más escuchado según Spotify el 24 de agosto de 2026" no
son la misma frase, y el sitio solo puede decir la que sea cierta.

Hay dos cosas más que las fichas tienen que responder antes de que esto se pueda construir,
y las dos pueden cambiar el frente entero:

- **Puede que el número de reproducciones no exista para pedirlo.** Hay una diferencia
  grande entre un contador de escuchas y un índice de popularidad relativo. Si solo hay lo
  segundo, el sitio puede decir "más popular" pero no "más escuchado", y el pedido del
  usuario se cumple igual con otra frase. Lo responde `RES-51`.
- **En YouTube un tema no es un video, son muchos.** El vivo, el lyric video, la subida de
  fans, el audio con la tapa fija. Un conteo de vistas no dice nada si no se dice de qué
  video es. Lo responde `RES-52`.

### ⚠ Y una colisión que ya está fichada desde el ciclo 3

`RES-26` verificó que la **Spotify Developer Policy III.2** dice textualmente *"Do not
create a game, including trivia quizzes."* Este sitio **es** un sitio de juegos. Usar la API
de Spotify para alimentarlo cae de lleno en el terreno que esa cláusula apunta.

**No frena el ciclo, y por una razón escrita:** `D-14` fijó que el riesgo se asume y que si
llega un reclamo se da de baja. Pero la decisión es del usuario, no mía, así que `RES-51`
trae la cita textual y `T-116` la pone sobre la mesa antes de que se escriba el script.

## Frente B — el test de los dos ejes

**El usuario eligió, y la elección saca del medio el único problema serio que la idea
tenía.** Se le preguntó qué se ubica en el plano —el jugador o los temas— y eligió **el
jugador**: el test de identidad de `IDEA-09`, tal como estaba escrita.

La otra opción era linda y era cara: una coordenada por tema es **una afirmación sobre la
obra**, y habría que defender cada una. Ubicar al jugador no afirma nada, así que este
frente no roza la regla estricta del proyecto.

**Los ejes ya pasan la prueba que `producto` había puesto.** Su lectura de `IDEA-09` decía
que lo único difícil era elegirlos, con una restricción dura: *ningún resultado puede ser
mejor que otro* — si un eje termina midiendo cuánto sabés, el test deja de ser identidad y
pasa a ser una clasificación de quién es más ricotero, que es cerrar el molinete. **Ni la
luz le gana a la oscuridad ni el orden al caos.** Los ejes del usuario separan maneras, no
niveles.

## Las tareas

| T | rol | qué | archivos | verifica con | [P] |
|---|---|---|---|---|---|
| `T-113` | `investigador` | `RES-51`: qué expone Spotify de verdad, y la colisión de III.2 | `Docs/INVESTIGACION/INV-25-escuchas-spotify.md` | la ficha responde las 6 preguntas con URL y fecha | [P] · **corriendo** |
| `T-114` | `investigador` | `RES-52`: vistas de YouTube y cuál es "el" video de un tema | `Docs/INVESTIGACION/INV-26-reproducciones-youtube.md` | ídem, 6 preguntas | [P] · **corriendo** |
| `T-115` | `producto` | Promover `IDEA-09` a `US-06`: ejes, piso, criterios | `Docs/PRODUCTO/PRD-alcance-v1.md`, `PRD-backlog-ideas.md` | `US-06` existe con criterios y piso | [P] · **corriendo** |
| `T-116` | `producto` | Qué promete el sitio con esos números, y la cuota de fáciles de `US-02` | `Docs/PRODUCTO/PRD-alcance-v1.md` | la promesa está escrita y `US-02` deja de tener una cuota sin medir | ← `T-113`, `T-114` |
| `T-117` | `arquitectura` | `CTR-07`: contrato del dataset de popularidad | `Docs/ARQ/ARQ-schema-popularidad.md` | el contrato fija campos, fecha de medición y dónde ocurre la llamada | ← `T-113`, `T-114` |
| `T-118` | hilo | Script de ingesta, JSON y tests | `scripts/ingerir-popularidad.mjs`, `src/data/popularidad.json`, `src/data/_schema/` | `node --test` + el JSON valida contra su schema | ← `T-117` |
| `T-119` | hilo | El orden entra al sitio: dónde se ve y con qué rótulo | `src/pages/letras-y-acordes/`, `src/lib/` | `npm run build` + la fecha de medición visible | ← `T-118` |
| `T-120` | `arquitectura` | `CTR-08`: schema del banco del test de dos ejes | `Docs/ARQ/ARQ-schema-dos-ejes.md` | el contrato existe y `T-121` valida contra él | ← `T-115` |
| `T-121` | `contenido` | `CNT-09`: el banco de preguntas y los cuatro cuadrantes | `src/data/dos-ejes.json`, `Docs/CONTENIDO/CNT-09-*.md` | piso de `US-06` cumplido · los 4 cuadrantes alcanzables | ← `T-115`, `T-120` |
| `T-122` | `experiencia` | `UX-06`: la pantalla del test y del resultado en móvil | `Docs/UX/UX-06-*.md` | el flujo entra en 2–3 min y cae en la tarjeta de `UX-02` | ← `T-115` |
| `T-123` | hilo | El juego construido | `src/pages/juegos/dos-ejes.astro`, `src/scripts/`, `src/lib/` | `npm run build` + una partida entera en el navegador | ← `T-120`..`T-122` |
| `T-124` | `revisor` | `REV-07`: revisar el banco del test | `Docs/REVISIONES/REV-07-*.md` | hallazgos `FIND-XX` con evidencia | ← `T-121` |
| `T-125` | hilo | Verificación entera, hallazgos corregidos y commit | — | `npm test`, `npm run check`, `npm run build` | ← todas |

## La pasada de conflictos, escrita y no mental

- **`T-113` y `T-114` son los dos de `investigador`** y escriben archivos distintos
  (`INV-25`, `INV-26`). Paralelas.
- **`T-115` toca `PRD-alcance-v1.md`, y `T-116` también.** **No son paralelas**, aunque los
  dos sean de `producto` y aunque `T-116` no dependa lógicamente de `T-115`: es el mismo
  archivo, y en el ciclo 7 dos tareas paralelas de dos roles ya se pisaron un número.
  `T-116` arranca cuando `T-115` cierra.
- **`T-121` es de `contenido` y depende de dos cosas**: del piso que fija `T-115` y del
  schema de `T-120`. Sin las dos, escribe preguntas que después hay que rehacer.
- **`T-124` llega después de `T-121` por definición**: revisar es verificar lo entregado,
  con contexto fresco y sin haber armado la pieza.
- **Los dos frentes no se tocan entre sí.** `T-116`..`T-119` y `T-120`..`T-124` corren en
  paralelo sin compartir un archivo, salvo `PRD-alcance-v1.md` entre `T-115` y `T-116`.

## Lo que el ciclo 7 enseñó, y este ciclo adopta

**Una revisión que verifica y una revisión que intenta romper no encuentran lo mismo.** En
el ciclo 7 se corrieron las dos sobre el mismo lote de diez preguntas: `revisor` no
encontró nada bloqueante, y una pasada adversarial encontró seis defectos, dos de ellos
bloqueantes. Ninguno de los seis era visible mirando el ítem solo — se veían mirando el
ítem **contra otra cosa**: contra otro ítem del banco, contra una fecha de otro disco,
contra lo que el propio sitio ya publica, contra lo que la ficha citada *no* dice. Está
escrito en `REV-06`.

**Así que `T-124` no es una tarea, son dos pasadas**, y la segunda tiene el encargo de
refutar. Cuesta lo mismo que la primera.

## Qué queda afuera, y por qué

- **Las coordenadas de los 105 temas en el plano.** El usuario eligió el test de identidad;
  el mapa de temas queda sin hacer. Si algún día se retoma, el problema a resolver es de
  dónde sale cada coordenada y con qué rótulo — no es de código.
- **Los mp3 de `US-02` y las quince escuchas de `US-03`.** Siguen esperando al usuario.
- **Fichar lacuerda.net** (`Docs/SUGERENCIAS/HILO-para-investigador-fichar-lacuerda.md`).
  Son 21 temas afuera del banco de letras. No entra acá porque `investigador` ya tiene dos
  fichas en este ciclo y una tercera lo desborda; queda primera para el ciclo 9.
- **Los tres hallazgos abiertos de `REV-06`** (`FIND-22`..`FIND-24`) y la cita falsa de
  `RES-48`. Prolijos y no bloqueantes.

## El riesgo del ciclo

**Que el frente de las escuchas se construya sobre un número que no significa lo que el
sitio dice que significa.** Es el riesgo real y es de rótulo, no de código: si la API
devuelve un índice relativo y el sitio escribe "el más escuchado", eso es un dato dudoso
puesto como si fuera un hecho — la misma falla que `CLAUDE.md` declara como lo único
estricto, vista desde otro ángulo.

Por eso las dos fichas cierran con **la frase exacta que el sitio podría escribir al lado
del número sin mentir**, y por eso `T-116` existe antes que `T-118`: primero se decide qué
se promete, después se escribe el script.

**El segundo riesgo, y es del otro frente:** que el test de dos ejes termine midiendo
cuánto sabe el jugador. `producto` ya lo dejó escrito como la única restricción dura de
`IDEA-09`, y es fácil de romper sin darse cuenta — alcanza con que una pregunta tenga una
respuesta que sea *la correcta*. En un test de identidad no hay respuestas correctas. Si
`revisor` encuentra una, es bloqueante.
