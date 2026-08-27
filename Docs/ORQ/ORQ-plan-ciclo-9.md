# ORQ — Plan del ciclo 9: dos juegos que salen de las letras, y el quiz pasa a vidas

> **Escrito por el hilo principal** con `/ciclo`, el 2026-08-25, sobre un pedido del
> usuario con tres partes: *"arma entero el juego de adivinar el tema por las letras y el
> de completar las letras. Ademas me gustaria cambiar el juego de las preguntas de esta
> forma, en vez de una nota sobre 8 que sea con 3 vidas y si erras perdes una vida, a
> medida que vas avanzando cada 10 preguntas aumenta la dificultad"*. Y un dato que cambia
> el tablero: **el sitio ya está desplegado**.
>
> **Ampliado el mismo día con un cuarto pedido**, después de leer el plan: *"agreguemos un
> boton o algo como para dejar un comentario para corregir, igualmente lo tomamos como
> error, es mas como para construir conocimiento entre todos. Esto para estos juegos pero
> se expandira a todo el sitio"*. Es el frente D, y **crece el ciclo a dos tramos**.

## Lo primero, porque si no se dice acá no se dice en ningún lado

**Este ciclo no cierra el "Listo" de la v1, y el usuario lo decidió sabiéndolo.**

Cuando pregunté qué hacía el juego de letras con el de audio, la respuesta fue **"es un
juego nuevo, convive"**. Está bien y es su proyecto, pero tiene una consecuencia aritmética
que conviene tener a la vista antes de empezar y no dentro de dos ciclos:

| Historia | Piso | Hoy | Después del ciclo 9 | Qué sigue faltando |
|---|---|---|---|---|
| `US-01` Quiz | 40 | **40** ✅ | 40, con mecánica nueva | — |
| `US-02` Adiviná el tema *(audio)* | 30 | 0 | **sigue en 0** | ffmpeg y los mp3 — de la mano del usuario |
| `US-03` Completá la letra | 15 | 0 de 1.784 | **≥15** ✅ | — |
| `US-04` Adiviná la tapa | 10 | **10** ✅ | 10 | — |
| `US-05` Redondopedia | 35 | **35** ✅ | 35 | — |
| `US-06` Dos ejes *(fuera de v1)* | — | 28 | 28 | — |
| 🆕 `US-07` Adiviná el tema por la letra | a fijar | 0 | **su piso** | — |

Al terminar el ciclo 9 **la v1 queda a un solo juego de cerrar**, y ese juego es `US-02`, y
lo que le falta no lo puede hacer ningún rol: son los fragmentos de audio.

## Lo que este ciclo destraba de verdad

**El corpus de letras que entró en el ciclo 6 alcanza para dos juegos, no para uno.** Hay
**101 temas con letra** en `src/data/cancionero.json`, y el costo por ítem de un juego que
se juega con versos es **cero**: no hay que recortar nada ni escuchar nada. Es la razón por
la que `US-07` puede nacer y llegar a su piso en el mismo ciclo, algo que `US-02` no puede
hacer desde hace cuatro.

## 🔴 La decisión que abre el frente de `US-03`, escrita antes que sus tareas

`CTR-04` no deja jugar un verso sin **dos fuentes de letra o confirmación de oído contra el
disco**. Medí las dos vías contra el disco, y las dos están cerradas:

- **Dos fuentes: imposible hoy.** Cada tema del cancionero tiene **una sola** fuente
  (cifraclub 78 · lacuerda.net 21 · letras.com 5), y los 149 archivos crudos en
  `TemasRedo/cancionero/data` son **uno por tema**. Solapamiento cero, confirmado en el
  material crudo, no solo en el derivado.
- **De oído:** los 26 huecos `_:__` de `src/data/letra-confirmaciones.json` siguen en blanco
  desde el ciclo 6.

Le planteé al usuario las tres salidas, incluida la advertencia de que ese candado es
**exactamente el que protege lo único que `CLAUDE.md` declara estricto**. Su respuesta,
textual: *"salen con los temas que ya tenemos, si hay que cambiar algo lo veo jugando el
juego"*.

**Es su decisión y se toma entera.** Pero se toma *por la puerta*, no por la ventana: la
regla se cambia por escrito, con dueño y con consecuencias anotadas (`D-25`, `T-128`), y no
se saltea en silencio desde el generador. Y como el usuario dijo que lo valida **jugando**,
el juego tiene que darle con qué: `T-145` hace que el panel de respuesta **muestre qué sitio
transcribió ese verso, con su enlace**. Así, cuando se tope con un verso mal, sabe en un
toque dónde está el error y de dónde salió. Eso convierte *"lo veo jugando"* de una
intención en un mecanismo.

**La mitigación barata que sí depende de nosotros** es `T-138`: de 1.784 candidatos, elegir
los 15 de **menor riesgo de transcripción**. No cuesta nada y baja el riesgo más que
cualquier regla.

## 🟡 El hueco que encontré en el pedido del quiz, y que `producto` tiene que cerrar

*"Cada 10 preguntas aumenta la dificultad"* choca con el banco tal como está:

**El banco tiene exactamente 10 fáciles.** Si el primer escalón dura 10 preguntas, **toda
partida muestra el banco entero de fáciles**, siempre, en el mismo lugar. Eso es la
*"vidriera fija"* que `BR-01` punto 3 existe para impedir — y que el ciclo 7 ya tuvo que
arreglar una vez, cuando descubrió que el quiz servía solo fáciles.

Las salidas son de `producto` (`T-129`), no mías. Las tres que veo: el escalón dura menos de
10, o el banco de fáciles crece, o el escalón sortea un subconjunto. **La que no sirve es no
decidirlo.**

## ⚠ Conflicto de código verificado: `ronda.ts` no se toca

`armarRonda` y `contarAciertos` **los comparten los cuatro juegos**: `partida.ts` (quiz),
`partida-tapa.ts`, `partida-letra.ts` y `partida-tema.ts`. Reescribir `ronda.ts` para meter
vidas rompe tres juegos que hoy andan.

**Por eso `T-142` es un archivo nuevo (`src/lib/quiz/vidas.ts`) y es aditivo.** La máquina de
vidas compone sobre los pozos que `ronda.ts` ya sabe armar; no los reemplaza. Cualquier
tarea de este ciclo que proponga editar `ronda.ts` está mal cortada.

---

## El frente D: el botón de corrección

**Es el cuarto pedido y no es un adorno: es la pieza que le faltaba a la decisión `D-25`.**
`US-03` sale con fuente única, y lo que el usuario dijo que iba a hacer con eso fue *"lo veo
jugando el juego"*. `T-145` ya le iba a mostrar de dónde salió el verso. El botón cierra el
círculo: cuando se topa con uno mal, **lo puede arreglar desde ahí**, y no solo él.

### ⚠ El transporte cambió a mitad de la planificación, y el cambio es del usuario

Primero eligió **issue de GitHub prellenado, público, en el repo**. Al rato lo corrigió, y
la corrección es la que manda: *"la idea no es que se vea la correccion primero, sino que
nos llegue a nosotros, luego se podria extender con una base de datos gratis de supabase
para guardar scores y los jugadores y correcciones"*.

**Eso da vuelta el cálculo entero.** El issue público costaba dos cosas —abrir el repo y
exigirle cuenta de GitHub a la gente— y las dos se pagaban por un beneficio: que la
corrección **se viera**. Si lo que importa es que **llegue**, ese beneficio no se cobra y
las dos costas quedan sin contrapartida.

**Entonces el transporte de ahora es el que llega sin pedir nada:** el botón arma el texto
completo —tema, verso, qué dice el sitio, qué debería decir, qué sitio lo transcribió— y lo
manda por mail o lo deja en el portapapeles. Cero infraestructura, cero cuenta, molinete
abierto, y `D-14` intacto. **Y `T-148` queda cancelado: el repo no necesita abrirse.**

**El destino final ya lo dijo el usuario y es Supabase**, con correcciones, puntajes y
jugadores. Por eso `CTR-10` (`T-150`) define el payload con el **transporte intercambiable**:
cuando exista la base, se cambia por dónde sale y **no se toca el botón ni el contrato**. La
propuesta de alcance para ese salto está escrita en
`Docs/SUGERENCIAS/HILO-para-producto-supabase-scores-y-correcciones.md`, y **no es menor**:
puntajes y jugadores son *ranking global* y *cuentas de usuario*, las dos en Fuera de alcance
y las dos rozando los molinetes.

### 🟢 Lo que medí del repo, que ya no bloquea pero conviene tener escrito

**El repo `knesantos/ArcadeRicotero` es privado** (`gh repo view` → `PRIVATE`, con issues
habilitados). Con el repo privado, quien no sea colaborador **no ve un login: ve un 404** —
o sea que la vía del issue no era solo cara, hoy directamente no funcionaba para nadie de
afuera.

**Y si algún día se abre igual, no agrega exposición nueva.** El `.gitignore` ya excluye
`*.pdf`, `*.epub`, `*.wav` y `*.mp3` con el motivo escrito —*"subir una obra entera a un
repositorio publico es otra cosa"*—, así que el memoir del Indio **no está versionado**. Lo
que sí está son 71 imágenes de tapas y el corpus de letras, y **las dos cosas ya las publica
el sitio desplegado**. Queda medido para cuando haga falta.

### Lo que hace que esto no sea un botón suelto

El usuario dijo que **se expande a todo el sitio**. Así que se construye como componente
compartido y contrato desde el día uno (`CTR-10`, `T-153`), no como un agregado del juego de
letras. Y `CTR-10` define el payload **con el transporte intercambiable**: si mañana el
issue se cambia por otra cosa, no se toca el botón.

Encaja además con algo que el proyecto ya decidió por otro lado: `voz-ricotera.md` 3.3 dice
que el sitio **declara la duda en voz alta**, y `D-14` que una leyenda rotulada es contenido
de primera. Esto es ese mismo principio, pero que lo puede tocar la gente.

**Ojo con el texto**, y es de `contenido` (`T-151`): un botón de corrección es el imán
perfecto del folleto vetado — *"¡Ayudanos a mejorar!"*, *"nuestra comunidad"*. Va en
**registro 3**: dice qué hace y se calla. Y la palabra es **la gente**.

---

## Las tareas

| `T-XX` | Rol | Qué | Archivos | Verifica con | `[P]` |
|---|---|---|---|---|---|
| `T-128` | ✅ **hecho** | **`D-25`**: el candado de `CTR-04` se abre — `US-03` sale con fuente única declarada, y el usuario valida jugando. Deja escritas las consecuencias y qué la revierte | `Docs/DECISIONES.md` | `D-25` existe y nombra la mitigación que reemplaza a la confirmación de oído | `[P]` |
| `T-129` | ✅ **hecho** | **`BR-19`**: la partida de vidas. 3 vidas · escalón cada 10 · se queda en difícil · victoria al agotar el banco. **Y cierra el hueco de los 10 fáciles exactos** | `Docs/PRODUCTO/PRD-alcance-v1.md` | `BR-19` dice qué de `BR-01` y `BR-05` queda en pie y qué reemplaza | `[P]` |
| `T-130` | ✅ **hecho** | **`US-07` + `BR-20`**: el juego nuevo, su piso y la escalera de versos. Corpus disponible: 101 temas | `Docs/PRODUCTO/PRD-adivinar-por-la-letra.md` *(nuevo)* | `US-07` tiene piso, criterios de aceptación y prioridad | `[P]` |
| `T-131` | ✅ **hecho** | **`CTR-04` v2**: la tercera vía de confirmación que habilita `D-25`, con el campo que declara la fuente por ítem | `Docs/ARQ/ARQ-schema-completar-letra.md` | el schema acepta `listo` por la vía nueva y **sigue rechazando** un ítem sin fuente declarada | tras `T-128` |
| `T-132` | ✅ **hecho** | **`ADR-02` v2**: qué se comparte cuando no hay puntaje sobre 8. **Salda de paso la deuda de `dos-ejes`**, que tampoco tiene puntaje | `Docs/ARQ/ARQ-link-resultado-compartido.md` | el formato cubre quiz-por-vidas y `US-06`, y la vista previa sigue sin filtrar el resultado | tras `T-129` |
| `T-133` | ✅ **hecho** | **`CTR-09`**: schema del banco de `US-07` | `Docs/ARQ/ARQ-schema-adivinar-por-la-letra.md` *(nuevo)* | corre en `src/lib/esquemas.test.ts` | tras `T-130` |
| `T-134` | ✅ **hecho** | **`UX-07`**: las 3 vidas y el cambio de escalón en pantalla. Sin emoji, y ningún estado comunicado solo por color | `Docs/UX/UX-07-quiz-por-vidas.md` *(nuevo)* | `npm test` (contraste) y la tabla de `diseno-marca.md` | tras `T-129` |
| `T-135` | ✅ **hecho** | **`UX-08`**: la pantalla de `US-07` y qué disco la viste según la mezcla `D-19` | `Docs/UX/UX-08-adivinar-por-la-letra.md` *(nuevo)* | el disco elegido no pisa el de otra sección; pares de color en el test | tras `T-130` |
| `T-136` | ✅ **hecho** | **`CNT-10`**: el copy del resultado por vidas — registro 1 el encabezado, registro 3 el número | `Docs/CONTENIDO/CNT-10-copy-quiz-vidas.md` *(nuevo)* | `node --test src/lib/voz.test.ts` | tras `T-129` |
| `T-137` | ✅ **hecho** | **`CNT-11`**: la regla de elección de versos de `US-07`. **El verso revelado no puede contener el título** — si no, el juego se gana solo | `Docs/CONTENIDO/CNT-11-versos-de-us07.md` *(nuevo)* | la regla es verificable a máquina por `T-139` | tras `T-130` |
| `T-138` | ✅ **hecho** | Eligió los **15+ versos de menor riesgo de transcripción** para `US-03`, con el criterio escrito | `src/data/letra-confirmaciones.json` | ≥15 elegidos, cada uno con su tema dentro de los 105 de `RES-20` | tras `T-131` |
| `T-139` | ✅ **hecho** | Generador del banco de `US-07` desde el cancionero → JSON de datos. **Aplica `CNT-11` como filtro corrible** | `scripts/generar-por-la-letra.mjs`, `src/data/por-la-letra.json` *(nuevos)* | el JSON valida contra `CTR-09` y ningún ítem filtra el título | tras `T-133`, `T-137` |
| `T-140` | ✅ **hecho** | La escalera de versos de `US-07`, reusando `buscador.ts` y `catalogo.ts` de `src/lib/tema/` | `src/lib/por-la-letra/` *(nuevo)* | `node --test src/lib/por-la-letra/*.test.ts` | tras `T-133` |
| `T-141` | ✅ **hecho** | La página y la isla de `US-07` | `src/pages/juegos/adivinar-por-la-letra.astro`, `src/scripts/partida-por-la-letra.ts` | jugada entera a 375×812; `npm run build` | tras `T-139`, `T-140`, `T-135` |
| `T-142` | ✅ **hecho** | **`src/lib/quiz/vidas.ts`**: la máquina de escalones y vidas. **Aditivo — no toca `ronda.ts`** | `src/lib/quiz/vidas.ts`, `vidas.test.ts` *(nuevos)* | `npm test`, y los otros tres juegos siguen pasando | tras `T-129` |
| `T-143` | ✅ **hecho** | La isla del quiz pasa a vidas: se va el "N de 8", entran las tres vidas y el escalón. **Arrastra `FIND-28`, ver abajo** | `src/scripts/partida.ts`, `src/pages/quiz.astro`, `src/lib/quiz/copy.ts` | partida jugada hasta perder las 3 vidas, hasta agotar el banco y retirándose a mitad | tras `T-142`, `T-134`, `T-136`, `T-132` |
| `T-144` | ✅ **hecho** | `generar-letra` promueve por la vía nueva → **≥15 ítems `listo`** en `US-03` | `scripts/generar-letra.mjs`, `src/data/letra.json` | `npm run generar-letra` y el conteo de `listo` ≥ 15 | tras `T-131`, `T-138` |
| `T-145` | ✅ **hecho** | `completar-la-letra` sale de la cocina. **El panel muestra qué sitio transcribió el verso, con enlace** — es el mecanismo de *"lo veo jugando"* | `src/pages/juegos/completar-la-letra.astro`, `src/scripts/partida-letra.ts` | partida entera a 375×812; la fuente se ve en cada ítem | tras `T-144` |
| `T-146` | `revisor` | **`REV-08`**: los tres frentes contra sus criterios declarados | `Docs/REVISIONES/REV-08-ciclo-9.md` *(nuevo)* | hallazgos `FIND-28`+ con evidencia y criterio incumplido | tras `T-141`, `T-143`, `T-145` |
| `T-147` | hilo principal | `ESTADO.md` al día. **Y arregla "Próximo paso" y el Tablero, cuatro ciclos atrasados** | `ESTADO.md` | la sección dice el ciclo 9, y el Tablero los pisos 40/30/15/10 | último |

### Frente D — el botón de corrección (`T-148`..`T-154`)

| `T-XX` | Rol | Qué | Archivos | Verifica con | `[P]` |
|---|---|---|---|---|---|
| `T-148` | — | ~~Poner el repo en público~~ **[CANCELADO]** el mismo día: el usuario aclaró que la corrección tiene que **llegarnos**, no verse, así que abrir el repo perdió su motivo. El número no se reutiliza (`Docs/IDS.md`) | — | — | — |
| `T-149` | ✅ **hecho** | **`BR-21`**: qué es una corrección y qué promete el sitio. **Y qué pasa con el que no tiene cuenta de GitHub** — o `D-14` queda cerrado | `Docs/PRODUCTO/PRD-correcciones.md` *(nuevo)* | `BR-21` resuelve el molinete de frente, no lo omite | `[P]` |
| `T-150` | ✅ **hecho** | **`CTR-10`**: el contrato de una corrección. Campos, tope de largo, y **que el payload no lleve nada de la persona**. **El transporte va detrás de una interfaz** para que el salto a Supabase no toque el botón | `Docs/ARQ/ARQ-correccion.md` *(nuevo)* | un caso real viaja entero por mail y por portapapeles; cambiar de transporte no toca el componente | tras `T-149` |
| `T-151` | ✅ **hecho** | **`CNT-12`**: el texto del botón y del panel. **Registro 3** — rótulo, no folleto. Y **"la gente"** | `Docs/CONTENIDO/CNT-12-copy-correcciones.md` *(nuevo)* | `node --test src/lib/voz.test.ts` | tras `T-149` |
| `T-152` | ✅ **hecho** | **`UX-09`**: dónde vive el botón en cada juego, ≥48 px, sin emoji, y que no compita con `SEGUÍ` | `Docs/UX/UX-09-boton-correccion.md` *(nuevo)* | contraste y toque mínimo en `npm test` | tras `T-149` |
| `T-153` | hilo principal | ⚠ **Antes de empezar hace falta una casilla.** `BR-21` promete que el mensaje "sale dirigido a la casilla del proyecto" y **el repo no tiene ninguna**. Poner el mail personal del usuario en un `mailto:` de un sitio público es entregárselo a los raspadores de spam: la casilla la decide él | — | existe una dirección que el sitio pueda publicar | `[P]` |
| `T-153` | hilo principal | **El componente compartido** y sus dos salidas (mail y portapapeles) — pensado para todo el sitio desde el día uno, no para un juego | `src/components/Correccion.astro`, `src/lib/correccion/` *(nuevos)* | el texto llega entero y legible por las dos salidas, sin cuenta de nada | tras `T-150`, `T-151`, `T-152` |
| `T-154` | hilo principal | Engancharlo en `US-03`, `US-07` y el quiz | las tres islas de juego | el botón aparece en los tres y manda el ítem que se estaba jugando | tras `T-153`, `T-141`, `T-143`, `T-145` |
| `T-155` | ✅ **hecho** | **`IDEA-13`**: registrar la extensión a Supabase (correcciones + puntajes + jugadores) y **rulear el choque con Fuera de alcance** — puntajes y jugadores son *ranking global* y *cuentas de usuario* | `Docs/PRODUCTO/PRD-backlog-ideas.md` | `IDEA-13` existe y dice qué de Fuera de alcance habría que mover, y qué le hace a los molinetes | `[P]` |

### Frente E — escritorio y recortes reales (`T-156`..`T-160`)

Dos pedidos del usuario del 2026-08-25, ya empezados en parte.

**El de escritorio, textual:** *"que este ciclo haga una pulida para la pagina desktop, si
bien esto es mobile first debe ser igual de jugable y navegable desde desktop"*. Eligió tres
frentes de cuatro: **que no quede una columna angosta**, **tipografía y toque calibrados para
el pulgar**, y **las pantallas largas** (Redondopedia y letras). Dejó afuera el recorrido por
teclado.

**El de los recortes, textual:** *"la idea es que en un futuro todos esos iconos sean
recortes reales de algun detalle de los discos"*. No es una tarea: es una dirección, y por eso
`T-160` la escribe como regla en vez de cambiar un ícono.

| `T-XX` | Rol | Qué | Archivos | Verifica con | `[P]` |
|---|---|---|---|---|---|
| `T-156` | ✅ **hecho** | El lobo pasa a recorte real: `lobo-recortado.png` (320 px, 45 KB, con alfa) reemplaza a `lobo-lupus.png` en el casete de "Adiviná el tema" y en la ficha de *Lobo suelto* | `src/lib/sitio/arte.ts`, `public/arte/` | `npm test` 224/224 y build de 148 páginas — **corrido** | — |
| `T-157` | ✅ **hecho** | **`UX-10`**: el ancho de escritorio. Hoy el sitio está cortado a 375 px y nadie miró qué hace a 1280. Anchos máximos, grilla de casetes y aire | `Docs/UX/UX-10-escritorio.md` *(nuevo)* | sin columna angosta perdida al medio a 1280 y 1600 px | `[P]` |
| `T-158` | ✅ **hecho (en `UX-10`)** | **`UX-11`**: la medida de línea de las pantallas largas — Redondopedia y fichas de tema con acordes. Son las que peor aguantan que el ancho se estire | `Docs/UX/UX-11-lectura-larga.md` *(nuevo)* | ninguna línea de prosa pasa de ~75 caracteres a 1280 px | tras `T-157` |
| `T-159` | ✅ **hecho** | Aplicar `UX-10` y `UX-11` en CSS, **y revisar que los objetivos táctiles de 48 px y las escalas de texto no queden desproporcionados en escritorio** | `src/styles/sitio.css`, `juego.css` | los cinco juegos y la Redondopedia a 375 / 768 / 1280 / 1600 px, sin desborde | tras `T-157`, `T-158` |
| `T-160` | ✅ **hecho** | **`UX-12`**: la regla de que **todo ícono de repuesto termina siendo un recorte real de un detalle de disco**, con el orden de reemplazo. Quedan `casete.svg`, `perro.svg` y `banderas.svg` | `Docs/UX/UX-12-iconos-recortes-reales.md` *(nuevo)*, `public/arte/README.md` | la regla nombra los tres SVG que faltan y de qué disco sale cada uno | `[P]` |

> **🟡 Lo que `T-156` dejó abierto, y es de `experiencia`.** El usuario pidió que el lobo
> nuevo fuera **también** al casete de la Redondopedia, que hoy usa `perro.svg`. Al ir a
> hacerlo apareció que **ese casete es `variante: 'historia'`, que por `D-19` viste *Gulp!***,
> y el lobo es de *Lobo suelto*. Ponerlo ahí deja una tarjeta con el recorte de un disco y el
> bicho de otro — justo lo que la mezcla existe para evitar. Además el perro **no es
> decoración**: es un personaje fichado de *Un baión* (`RES-06`, `RES-22`) con una regla
> propia en `public/arte/README.md`. Se hizo la mitad sin conflicto y **esta mitad la decide
> `experiencia` en `T-160`**, que es la dueña del mapa sección→disco.

**`[P]` al arrancar:** `T-128`, `T-129`, `T-130` y `T-149`. Archivos distintos, sin
dependencias. `T-129`/`T-130`/`T-149` son tres PRD separados a propósito para que `producto`
pueda correr las tres sin pisarse. `T-155` es de `producto` y toca un cuarto archivo, así
que también entra en paralelo. Después, cada fila dice de qué depende.

> ### 🔴 `FIND-28` — un defecto vivo que encontró `T-132`, reproducido en el sitio corriendo
>
> `leerDesafio()` devuelve el campo `g` (qué juego) y **el quiz nunca lo mira**
> (`src/scripts/partida.ts:44`). Abrir `/quiz/?g=tapa&p=10&t=10&n=Fulano` pinta el
> subtítulo **"Fulano sacó 10/10. ¿Te la bancás?"** — el desafío de otro juego, con un
> puntaje imposible en una ronda de 8. Verificado en el navegador el 2026-08-25, no
> deducido del código.
>
> **Está en producción**, porque el sitio ya está desplegado. No es grave —no hay dato de
> nadie en juego, el nombre ya pasa por `limpiarNombre` y se pinta con `textContent`— pero
> es una pantalla que afirma algo falso, y eso en este proyecto se paga caro.
>
> Lo arregla `T-143` con la forma que eligió `arquitectura`: `leerDesafio(query,
> juegoPropio)` con el segundo parámetro **obligatorio**, para que la clase entera de bug
> sea imposible en vez de improbable. Es el mismo criterio con el que `ronda.ts` resolvió
> lo de la opción correcta siempre primera: arreglarlo una vez y para siempre, en lugar de
> pedirle a cada sitio de llamada que se acuerde.

## ✅ Tramos A y B cerrados — los seis juegos se juegan

Al 2026-08-27: `npm test` **264/264**, `npm run check` limpio, build de **149 páginas**.
**Los cinco pisos de la v1 están cumplidos**, y `US-07` nació y llegó al suyo en el mismo
ciclo. Queda el frente E (escritorio, `T-157`..`T-160`), `T-146` (`REV-08`) y `T-147`.

## ✅ Tramo A cerrado el 2026-08-25

Las diez tareas del tramo A están hechas y verificadas: `npm test` **251/251** (eran 224),
`npm run check` 0 errores, build de **148 páginas**, y el quiz por vidas jugado entero en el
navegador — derrota, retirada, y el aviso de escalón en la pregunta 11.

**Queda el tramo B entero**, más `T-146` (`REV-08`) y `T-147` (`ESTADO.md`).

## ⚠ El ciclo son 31 tareas vivas: va en dos tramos

El 8 fueron quince. Veintisiete no entra en una ráfaga y fingir que sí es cómo se dejan
ciclos a medio cerrar. El corte natural:

| Tramo | Tareas | Por qué van juntas |
|---|---|---|
| **A** | `T-128`..`T-130`, `T-132`, `T-134`, `T-136`, `T-142`, `T-143` + `T-149`, `T-155` | **El quiz por vidas, entero**, más las decisiones que abren el resto. Es el frente más independiente y el único que toca algo que la gente ya está jugando |
| **B** | todo el resto | Los dos juegos de letras, el botón, y la pulida de escritorio |

`T-146` (`REV-08`) y `T-147` (`ESTADO.md`) cierran el tramo B.

## Qué quedó afuera, y por qué

- **Los fragmentos de audio de `US-02`.** Sigue en 0/30 y sigue necesitando ffmpeg. Nada de
  este ciclo lo toca. **Es lo único que separa al proyecto del "Listo" de la v1.**
- **La clave de YouTube.** Los 105 temas siguen en `sin-video`. No lo pidió el usuario y no
  bloquea ninguna tarea de acá.
- **Los 21 temas de lacuerda.net.** Siguen fuera del banco de letras por falta de ficha. Con
  80 temas y 1.784 candidatos, `US-03` llega a su piso de sobra sin ellos. La deuda sigue
  escrita donde estaba.
- **Los nueve P3 de la auditoría impeccable** y los `.primario` con alcance que sobreviven en
  `adivinar-el-tema` y `adivinar-la-tapa`. Trabajo real, pero no es lo que se pidió.
- **`RES-48` y su cita falsa**, y los tres hallazgos abiertos de `REV-06`.

## El riesgo del ciclo

**Es el corpus, y es uno solo para los dos juegos nuevos.**

`US-03` y `US-07` salen los dos de las mismas transcripciones de fuente única. Pero **no
corren el mismo riesgo**, y la diferencia es la que ordena todo este plan:

- En **`US-03`** el jugador escribe la palabra que falta. Si la transcripción está mal, **el
  juego le marca error justo al que se sabe el tema** — el daño exacto que `CLAUDE.md`
  declara como lo único estricto del proyecto.
- En **`US-07`** el jugador ve versos y adivina **cuál es el tema**. Una palabra mal
  transcripta no cambia de qué tema se trata. La exposición es de otro orden.

Por eso `US-07` puede salir con fuente única sin discusión, y `US-03` sale con una decisión
escrita encima (`D-25`), los versos más seguros que haya (`T-138`) y la fuente a la vista del
jugador (`T-145`).

**El segundo riesgo es de tamaño.** Veinte tareas es el ciclo más grande hasta ahora — el 8
fueron quince. Si hay que cortarlo, **se corta por frente y en este orden**: el quiz de vidas
(`T-129`, `T-132`, `T-134`, `T-136`, `T-142`, `T-143`) es el más independiente y el que menos
depende de decisiones abiertas; `US-07` es el que más valor nuevo trae; `US-03` es el que
carga la decisión delicada y el que conviene hacer con la cabeza fresca.

**Y uno que el despliegue trajo de arriba:** el sitio ya está publicado, así que **cada
cambio de este ciclo sale a la calle**. El quiz que hoy juega la gente pasa a vidas en
`T-143`; si sale mal, sale mal en vivo. `T-146` no es un trámite de cierre.

**El riesgo del frente D ya no es el molinete: es el silencio.** Un canal que sale por mail
o portapapeles llega, pero **no deja ver cuántos lo usaron ni si alguien contestó**. Mientras
el destino sea una casilla, la corrección de la gente termina en una bandeja que hay que
mirar a mano — y si nadie la mira, el botón miente. Eso es exactamente lo que Supabase viene
a arreglar (`T-155`, `IDEA-13`), y hasta que exista, **`BR-21` tiene que decir qué promete el
sitio cuando alguien corrige algo**. Prometer menos y cumplirlo es mejor que prometer una
conversación que no hay quién sostenga.

## Rangos

Consume `T-128`..`T-160` (`T-148` **[CANCELADO]**, `T-156` **hecho**), `D-25`, `US-07`, `BR-19`, `BR-20`, `BR-21`, `CTR-09`, `CTR-10`,
`UX-07`, `UX-08`, `UX-09`, `UX-10`, `UX-11`, `UX-12`, `CNT-10`, `CNT-11`, `CNT-12`, `REV-08`, `FIND-28`+, `IDEA-13`.
Quedan libres: `T-161`+, `D-26`+, `RES-53`+, `US-08`+, `BR-22`+, `CTR-11`+, `UX-10`+,
`CNT-13`+, `REV-09`+, `IDEA-14`+, `UX-13`+.
