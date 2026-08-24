# PRD — Backlog de ideas: diez títulos guardados, ninguno empezado

> **Consume:** pedido directo del usuario, 2026-08-22 (las diez ideas y la instrucción
> transversal sobre los clones). `Docs/BRIEF.md` (riesgo 4, "Fuera de alcance"),
> `Docs/DECISIONES.md` `D-05`, `D-06`, `D-08`, `D-09`, `D-14`, `D-17`, `D-19`.
> `RES-20` (`INV-20-fuentes-primarias.md`) para verificar cada título contra los 105 temas.
> `BR-03`, `BR-12` (topes de exposición de letra), `CTR-01.3` (fragmento ≤ 15 s),
> `US-02`, `US-05`, `UX-02`.
>
> **Produce:** `IDEA-01`..`IDEA-10`, `BR-15`, `BR-16`.
>
> **Por qué las reglas arrancan en 15 y no en 13:** este archivo se escribió con `BR-12`
> como último en disco, así que las reglas nacieron `BR-13` y `BR-14`. Antes de cerrar, el
> `git status` mostró que otra sesión estaba escribiendo el ciclo 5 sin commitear, y que
> `T-66` y `T-67` ya tenían esos dos números tomados (uno ya escrito en
> `PRD-redondopedia.md`). Se renumeró acá, que era lo barato: `BR-13`/`BR-14` no tenían
> todavía ninguna cita apuntándoles. La lección quedó anotada en `Docs/IDS.md`.

## Qué es este archivo y qué no

El usuario dijo, textual: *"no hace falta que las hagamos todas, pero sí guardémoslas. No
empieces a desarrollar ninguna."* Esto es eso y nada más: las diez ideas escritas con
suficiente detalle para que dentro de tres meses se entiendan solas, con su ancla ricotera
verificada y con lo que cada una choca contra lo que ya está decidido.

**Ninguna de estas diez es alcance de la v1.** El alcance sigue siendo el de
`PRD-alcance-v1.md` (`US-01`..`US-04`) más la Redondopedia (`US-05`), y ese alcance **no
está cerrado**: `US-02` y `US-03` no tienen un solo ítem cargado y `US-05` va 29 de 35.

## Por qué prefijo `IDEA-` y no `US-`

En este proyecto un `US-XX` es un contrato: trae criterio Given/When/Then y piso de ítems,
y los planes de `orquestador` cuentan las `US-` contra el "Listo de la v1". Escribir estas
diez como `US-` obligaría a inventarles criterios y pisos que nadie comprometió — que es
exactamente empezar a desarrollarlas. `IDEA-XX` guarda la idea sin fingir que es un
requisito. El prefijo queda registrado en `Docs/IDS.md`.

---

## BR-15 — Los clones se adoptan vestidos, no se escriben

**Aplica a:** `IDEA-02`, `IDEA-03`, `IDEA-04`, `IDEA-07`, `IDEA-10`, y a cualquier idea
futura cuya mecánica ya exista como género.
**Origen:** instrucción transversal del usuario, 2026-08-22 — *"todo lo que son juegos que
ya existen, mi idea sería buscar un genérico ya hecho y ponerle un skin y música redonda"*.

**Regla:** cuando el mecanismo ya existe como género (Doom, Crazy Taxi, plataformas,
Pacman, Guitar Hero), no se escribe el motor. Se adopta uno genérico ya hecho y se lo viste
con el arte del proyecto y con música redonda.

Tres consecuencias que la regla arrastra, escritas ahora para que no aparezcan de sorpresa
en la primera que se tome:

1. **La licencia del genérico pasa a ser requisito, y es lo único de todo este archivo que
   conviene chequear antes y no después.** Acá no aplica el "si llega un reclamo se baja"
   de `D-14`: quien reclamaría no es el titular de una obra de la banda —cuyo reclamo se
   resuelve bajando el sitio— sino el autor del motor, y bajarlo no le devuelve nada.
   Dueño: `investigador`, una ficha `RES-XX` por motor candidato.
2. **Lo barato es el motor; lo caro es el skin.** "Ponerle un skin" son sprites, tiles,
   tipografías y sonidos, y este proyecto tiene un sistema de marca con reglas duras
   (`.claude/rules/diseno-marca.md`) que ningún asset genérico cumple. El ahorro real es de
   programación, no de arte. Conviene tenerlo presente al estimar: la parte que parece
   gratis es la mitad chica.
3. **"Música redonda" adentro de un juego no es lo mismo que en los cuatro de la v1.** El
   motor de audio del sitio es fragmento propio + Spotify (`D-06`, `ADR-01`); música de
   fondo sonando en loop durante una partida es otro uso, que ninguna decisión vigente
   cubre. Lo único que entra hoy sin mover nada es un loop armado con fragmento propio
   (`CTR-01.3`, ≤ 15 s). Lo demás lo tiene que resolver `arquitectura`.

---

## BR-16 — Una idea no entra a un ciclo sin pasar antes a `US-XX`

**Aplica a:** todo `IDEA-XX`.

Ninguna `IDEA-XX` es planificable tal como está. Para que `orquestador` pueda cortarle
tareas `T-XX`, la idea tiene que promoverse primero a historia `US-XX` con criterio
Given/When/Then y piso de ítems, como cualquier otra (`producto-metodo`, paso 5). Al
promoverse, la `IDEA-XX` **no se borra**: se marca *promovida a `US-XX`* y se queda donde
está, igual que un ID cancelado (`Docs/IDS.md`).

**Por qué esta regla existe:** el riesgo 4 del brief es "cuatro juegos hermosos con doce
preguntas adentro". Diez ideas guardadas es exactamente el material con el que ese riesgo
se cumple. Guardar es gratis. Empezar, no.

---

## Las diez ideas

### IDEA-01 — Separar los temas en pistas y adivinar

**Tal cual la dijo el usuario:** *"Separar temas en pistas y que adivinen"*.
**Tipo:** original del sitio — no hay genérico que calce, y probablemente ni siquiera sea
un juego nuevo.
**Ancla:** mecánica, no necesita título.

Se separa el fragmento en pistas (bajo, batería, voz, guitarra) y el jugador arriesga el
tema escuchando una sola. Reutiliza casi todo lo de `US-02`: el motor de reveal, `CTR-03`,
el pool de 20 temas y los fragmentos que el usuario ya produce a mano (`D-06`). La
separación se hace una sola vez, fuera del sitio, sobre el mismo fragmento propio de ≤ 15 s
que `CTR-01.3` ya autoriza — no cambia el hosting ni la exposición.

**Lectura de `producto`:** de las diez, la más barata, y la única que **profundiza** en vez
de abrir un quinto frente. Eso la vuelve la menos riesgosa contra el riesgo 4.

> **Actualización 2026-08-22, `D-22`:** con el tema entero alojado, la separación en pistas
> deja de estar atada al fragmento de 15 s — se puede correr sobre el mp3 completo y
> recortar después. Abarata la idea y la vuelve más flexible; no cambia lo que hay que
> decidir abajo.

**A resolver antes de promoverla:**
- ¿Modo nuevo de `US-02` o juego aparte? Mi lectura es modo; decide `producto` con
  `experiencia`.
- Si las pistas reemplazan los pasos del reveal, `BR-02` hay que **reescribirla**, no
  extenderla: la tabla de puntaje está atada a 5 pasos de duración creciente y la
  verificación aritmética de azar depende de eso.

---

### IDEA-02 — Doom bien gore: la masacre del puticlub

**Tal cual la dijo el usuario:** *"Doom bien gore la masacre del puticlub"*.
**Tipo:** clon vestido (`BR-15`).
**Ancla, verificada:** *Masacre en el puticlub* es el tema 1 de **Un baión para el ojo
idiota** (9-may-1988, Del Cielito), dentro de los 105 de `RES-20`. El título existe y es de
la banda.

**A resolver antes de promoverla:**
- **Es la que peor pelea con "móvil primero, dos o tres minutos".** Un FPS con el pulgar y
  en dos minutos es posible, pero es una decisión de diseño, no un detalle: `experiencia`
  tendría que resolver controles táctiles y una partida que cierre sola.
- **"Bien gore" contra el sistema de marca.** El sitio ya tiene una estética resuelta
  —serigrafía, tinta plana, borde grueso (`RES-06`, `D-19`)— y el gore de Doom no es esa.
  No es veto: `diseno-marca.md` dice que cada elemento se resuelve en el idioma del
  proyecto o no se resuelve. Sangre en tinta plana de un solo rojo es idioma del proyecto;
  una textura genérica de sangre no.
- Motor candidato + licencia (`BR-15`, consecuencia 1).

---

### IDEA-03 — Crazy Toxi-Taxi

**Tal cual la dijo el usuario:** *"Crazy toxi taxi"*.
**Tipo:** clon vestido (`BR-15`).
**Ancla, verificada:** *Toxi-Taxi* es el tema 1 de **La mosca y la sopa** (27-oct-1991, Del
Cielito), en los 105 de `RES-20`. El juego de origen es Crazy Taxi; el chiste del nombre se
arma solo.

**Lectura de `producto`:** junto con `IDEA-07`, la que menos pelea con las reglas duras del
proyecto. Crazy Taxi ya es un género de rondas cronometradas cortas —o sea, ya viene con la
sesión de dos o tres minutos adentro— y se juega con un pulgar.

**A resolver antes de promoverla:**
- Qué son los pasajeros. Si la respuesta es "llevar ricoteros al recital", conecta con la
  misa (`RES-04`) y con los molinetes abiertos, y el juego dice algo del proyecto en vez de
  ser un skin encima de otra cosa. Es decisión de `experiencia` + `contenido`.
- Motor candidato + licencia (`BR-15`).

---

### IDEA-04 — Plataformas: Último bondi a Finisterre

**Tal cual la dijo el usuario:** *"Plataformas ultimo bondi a finisterre"*.
**Tipo:** clon vestido (`BR-15`).
**Ancla, verificada:** **Último bondi a Finisterre**, 18-nov-1998, Patricio Rey Discos, 10
temas (`RES-20`). La tapa tiene ficha propia: Rocambole propuso la nave interplanetaria y
convenció al resto (`INV-20`, sección de tapas).

**Lo que ya está hecho:** la paleta de esa tapa está muestreada y vive en `tokens.css` como
los `--cat-*` de "Último bondi" (`RES-37`, `D-19`). El skin arranca con la mitad resuelta,
que es más de lo que puede decir cualquier otra de las cinco.

**A resolver antes de promoverla:**
- Largo de nivel contra la sesión de dos o tres minutos: un plataformas se corta en niveles
  cortos o no entra.
- Controles táctiles.
- Motor 2D candidato + licencia (`BR-15`).

---

### IDEA-05 — Dibujá tu bandera y colgala

**Tal cual la dijo el usuario:** *"Dibuja tu bandera y colgala en un pixel art de la tumba
del indio"*.
**Tipo:** original del sitio.
**Ancla:** la bandera es simbología con respaldo fichado (`RES-06`, capa simbólica) y ya
está adentro del sistema de marca.

**El choque duro, y es de stack, no de derechos:** "colgala" implica que otros la vean, o
sea persistencia compartida, o sea backend — y "sin backend, hosting estático gratuito" es
regla de stack de `CLAUDE.md`, no una preferencia. Hay dos versiones y son juegos distintos:

- **Sin backend, hoy:** se dibuja la bandera, se descarga y se comparte como imagen. Encaja
  con `UX-02` (la tarjeta compartible ya diseñada) y no mueve ninguna decisión.
- **Colectiva, con el paredón que se llena:** necesita decisión de `arquitectura` y una
  `D-XX` del usuario. No la doy por descartada, la dejo nombrada.

**⚠ Hay que chequear un hecho antes de escribir una línea de esto:** el fondo dice "la tumba
del Indio". No lo doy por cierto ni por falso: pido ficha a `investigador` y, sobre todo,
**pregunta al usuario**, porque si lo que tenía en la cabeza era otra cosa —un mural, un
santuario de fans, el paredón de un recital— cambia la pieza entera y no solo el telón de
fondo. Acá no rige la regla estricta de veracidad (no es respuesta de quiz), pero sí `D-14`:
si es leyenda, entra rotulada como leyenda.

---

### IDEA-06 — Zoológico de los personajes

**Tal cual la dijo el usuario:** *"Zoologico de los personajes (lobo suelto, cordero atado,
gran lady, el gordo pier, el negro atila)"*.
**Tipo:** original del sitio.

**Anclas, verificadas una por una contra los 105 de `RES-20`:**

| Personaje | Dónde aparece | Estado |
|---|---|---|
| lobo suelto / cordero atado | **Lobo suelto, cordero atado** vol. 1 y 2, 4-oct-1993. Además *El lobo caído* (vol. 1, tema 12) y *¡¿Lobo estás?!* (vol. 2, tema 9) | ✔ verificado |
| Gran Lady | *Gran Lady*, vol. 1, tema 10 | ✔ verificado |
| el negro Atila | *Rock para el negro Atila*, vol. 1, tema 2 | ✔ verificado |
| el gordo Pier | **no existe con ese nombre en los 105.** Lo más cercano es *Pierre, el vitricida*, **Gulp!** (1985), tema 4 | ⚠ **preguntar al usuario** |

**Lectura de `producto`, y va contra la forma en que está pedida:** esto probablemente **no
sea un juego**. La Redondopedia (`US-05`) ya tiene cinco tipos de artículo —`disco`,
`persona`, `hito`, `concepto`, `leyenda`— y ninguna casilla para un personaje que vive
adentro de una canción. Un tipo `personaje` reutiliza `BR-07`..`BR-12`, el motor de
artículos, los enlaces `[[slug]]` y el rótulo de leyenda que ya funciona. Sale una fracción
de lo que sale un juego nuevo y el contenido es del mismo tipo que el que ya se está
escribiendo.

**A resolver antes de promoverla:** sumar un tipo mueve el piso de `US-05` (35, hoy 29 —
`ORQ-plan-ciclo-4.md`). Ese número lo fija `producto` cuando se tome la idea, no antes.

---

### IDEA-07 — Un Pacman en el Savoy

**Tal cual la dijo el usuario:** *"Un pacman en el savoy"*.
**Tipo:** clon vestido (`BR-15`).
**Ancla, verificada:** *Un Pacman en el Savoy* es el tema 4 de **¡Bang! ¡Bang!… Estás
liquidado** (7-oct-1989, Del Cielito), en los 105 de `RES-20`. El título ya trae el juego
adentro: no hay que forzar nada.

**Lectura de `producto`:** el más barato de los cinco clones. Pacman es el género con más
implementaciones genéricas disponibles, el laberinto es una grilla, la partida dura lo que
tiene que durar y el control son cuatro direcciones, que es lo único que un pulgar hace
bien. Si algún día se toma uno solo de los cinco para probar `BR-15` de punta a punta, este
es el que menos arriesga.

**A resolver antes de promoverla:** motor candidato + licencia (`BR-15`); qué son los
fantasmas y qué es el laberinto, en el idioma del proyecto.

---

### IDEA-08 — Letras y acordes

**Tal cual la dijo el usuario:** *"Letras y acordes"*.
**Tipo:** original del sitio, y **no es un juego**: es una sección de consulta.

**El choque es interno y no legal, así que conviene leerlo con cuidado.** `D-14` ya decidió
que los derechos no bloquean nada y que si llega un reclamo se baja, o sea que esto **se
puede hacer**. Pero `BR-03` fija un tope de 5 versos por ítem en `US-03` y `BR-12` fija que
un artículo de tipo `tema` cita versos y no reproduce la letra completa. Una sección de
letras completas no extiende esos topes: los **deroga**. Si se toma esta idea, `BR-12` y
`BR-03` se revisan por escrito y con número, no se ignoran en silencio — que es la
diferencia entre cambiar de opinión y perder el hilo.

**A resolver antes de promoverla:**
- **Los acordes son otro objeto que las letras.** No salen de `RES-20`, no están en ninguna
  ficha, y no hay fuente relevada. Necesita `RES-XX` propia de `investigador`.
- Depende de que exista el texto de las letras, que hoy sigue como bloqueo abierto en
  `ESTADO.md`: la fuente acordada es el arte de los discos, cruzado contra los 105.

---

### IDEA-09 — Test: qué tipo de ricotero sos

**Tal cual la dijo el usuario:** *"Test que tipo de ricotero sos tipico 2 ejes"*.
**Tipo:** original del sitio; el formato de dos ejes es el genérico (la brújula de toda la
vida), pero el motor es tan chico que no aplica `BR-15`.

**Lectura de `producto`: de las diez, la candidata más fuerte para un frente próximo, y lo
digo con razones y no con entusiasmo.** Es texto puro —el contenido más barato del banco,
igual que el quiz—, sin audio, sin imagen con derechos y sin motor nuevo. Y devuelve **una
identidad, no un puntaje**, que es exactamente lo que la gente comparte: engancha directo
con `UX-02` (tarjeta compartible), que ya está diseñada y construida.

**A resolver antes de promoverla, y es lo único difícil que tiene:** cuáles son los dos
ejes. No lo fija `producto` solo — es contenido y es tono (`CNT-02`, `D-17`). Y hay una
restricción que no se negocia: **ningún resultado del test puede ser mejor que otro.** Si un
eje termina midiendo "cuánto sabés", el test deja de ser un test de identidad y pasa a ser
una clasificación de quién es más ricotero, que es la definición exacta de cerrar el
molinete (`D-14`). Los ejes tienen que separar **maneras** de ser ricotero, no niveles.

---

### IDEA-10 — Guitar Hero ricotero

**Tal cual la dijo el usuario:** *"Guitar hero"*.
**Tipo:** clon vestido (`BR-15`).

> ✅ **DESBLOQUEADA el mismo día, por `D-22`.** Cuando se escribió esta ficha, era la única
> de las diez con un bloqueo estructural. Horas después el usuario decidió alojar los temas
> enteros en mp3, que era exactamente la salida 1 de las tres de abajo. **Sigue sin
> empezar** y sigue necesitando promoverse a `US-XX` (`BR-16`) como cualquier otra; lo que
> cambió es que ahora se puede.

**Cuál era el bloqueo, y por qué no era de derechos.** Un juego de ritmo necesita el tema
entero sonando y sincronizado con la partitura. El alcance del brief decía que alojar los
temas completos estaba fuera; el motor de audio era fragmento propio + Spotify; y Spotify no
le da control de reproducción sincronizada a un usuario sin Premium — exigir Premium choca
de frente con los molinetes (`D-08`, `D-09`, `D-14`). Ninguna de las dos mitades del motor
servía.

Las tres salidas que estaban planteadas, con la que se tomó marcada:

1. ✅ **Alojar audio completo** — la que eligió el usuario (`D-22`). Movía "Fuera de alcance"
   del brief, que era la línea más estable del proyecto; se movió igual, y por un motivo que
   esta ficha no había visto: no era una concesión, era que la línea contradecía a `D-14`.
2. **Jugarlo sobre un fragmento propio de ≤ 15 s** (`CTR-01.3`) — era lo único que entraba
   sin mover nada. Queda como variante posible, no como necesidad.
3. **Una versión instrumental propia, regrabada** — descartada de hecho: no es el tema.

**Lo que queda por resolver ahora que el audio existe:** de dónde sale la partitura (las
notas que caen). No hay ninguna ficha en el repo que la traiga y no se deriva del mp3 sin
trabajo — es el insumo caro de este juego, del mismo modo que el fragmento lo es para
`US-02`. Sin resolver eso, `D-22` desbloquea la mitad del problema, no el problema.

---

### IDEA-11 — Mayor o menor: qué palabra se dice más

**Tal cual la dijo el usuario:** *"que arrancas con una palabra y cuantas veces se dice en
toda la discografia y tenes que ir adivinando si la otra palabra que te muestran se dijo
mas o menos veces y asi ir sumando"*.
**Tipo:** género conocido —el mayor o menor de toda la vida—, pero **no aplica `BR-15`**:
el motor son dos botones y un contador, igual que en `IDEA-09`. Lo caro no es el juego, es
el dato.
**Ancla:** el cancionero del sitio. 104 temas cargados (`CTR-06`, `src/data/cancionero.json`)
sobre los 105 de `RES-20`.

Se abre con una palabra y su número a la vista. Aparece una segunda palabra sin número y
dos botones — **Más** / **Menos**. Si acierta, la segunda pasa al lugar de la primera con
su número ya revelado, entra una tercera, y así. Un error corta la racha. El puntaje es el
largo de la racha.

**Lo que esta idea tiene y ninguna de las diez anteriores tenía:** el insumo ya está en el
repo. El ciclo 6 metió las 104 letras — no hace falta ficha nueva de `investigador`, ni
audio, ni imagen con derechos, ni motor genérico con licencia (`BR-15`, consecuencia 1).
Junto con `IDEA-09`, de las dos más baratas del backlog. Encaja sin mover nada con móvil y
sesión corta (dos botones grandes, la partida termina sola al primer error), con los
molinetes abiertos (`D-14`) — es el juego con la barrera de conocimiento más baja del
catálogo, más baja que el quiz —, con `BR-03`/`BR-12` (muestra palabras sueltas y números,
no versos: no los roza) y con la tarjeta compartible (`UX-02`, la racha es un número).

**El choque, y es uno solo: el número es una respuesta correcta.** `CLAUDE.md` dejó una sola
cosa estricta y no es de derechos: que la respuesta correcta sea correcta, porque si está
mal el juego le marca error justo al que se sabe el tema. Acá la respuesta correcta es un
conteo, y medido el 2026-08-23 sobre `src/data/cancionero.json` el corpus **no estaba
limpio**: contando en crudo todas las líneas tipadas `t: "letra"`, la palabra más "cantada"
de los Redondos daba `riff`, 306 veces, y la segunda `guitarra`, 156 — anotación de cifra
que viajaba adentro de líneas tipadas como letra (cifraclub aportó 88 de los 104 temas).
Filtrando a ojo lo que parecía anotación se caían 1.070 líneas y quedaban 2.858 de letra —
al menos una línea sucia en 80 de los 104 temas—, y quedaba basura arriba igual (`criminal`
39 veces en un solo tema, `negrita` 25). Con ese corpus, el juego se equivocaba en la
palabra más frecuente de todas.

> **Saldado en este mismo ciclo, no sigue abierto.** `T-103` del ciclo 7 (hilo principal)
> retipa las 625 líneas de anotación que estaban tipadas como letra en
> `src/data/cancionero.json`. Al promover esta idea, el conteo **se reconfirma sobre el
> cancionero ya limpio** — no se repite la medición de arriba, que quedó vieja el día que
> se escribió. Lo que sigue en pie sin importar cuán limpio quede el corpus: el rótulo de
> qué regla de conteo se usó (registro 3, de qué corpus salió, cuántos temas entraron), que
> es lo que vuelve auditable un número que de otro modo es solo una afirmación.

**A resolver antes de promoverla:**
1. Reconfirmar el conteo sobre el cancionero post-`T-103`. Dueño: `producto` con
   `arquitectura` para la regla de conteo (¿*corazón* cuenta *corazones*? ¿el estribillo
   repetido cuenta cada vez o una sola? ¿los temas sin letra figuran como cero o no
   figuran?). Una regla no declarada la paga el que sabe, que siente que le hicieron trampa.
2. Empates: la convención del género es que cuentan como acierto; que se fije y se diga
   **antes**, no después.
3. El pool de palabras — curaduría de qué palabra se reconoce y qué par tiene gracia.
   Dueño: `contenido`. El piso de ítems se fija al promover (`BR-16`), no antes.
4. Cuánto se revela al acertar: el número no toca nada, el verso donde aparece la palabra
   sí toca `BR-03`/`BR-12` y ahí hace falta tope.

---

## Resumen

| ID | Idea | Tipo | Reutiliza | Choque principal |
|---|---|---|---|---|
| `IDEA-01` | Pistas separadas | original (modo de `US-02`) | motor de `US-02`, `CTR-03`, los 20 fragmentos | reescribir `BR-02` |
| `IDEA-02` | Doom / puticlub | clon vestido | — | móvil y pulgar; el gore contra la marca |
| `IDEA-03` | Crazy Toxi-Taxi | clon vestido | — | motor + licencia |
| `IDEA-04` | Plataformas / Finisterre | clon vestido | paleta de la tapa en `tokens.css` | largo de nivel; motor + licencia |
| `IDEA-05` | Bandera colgada | original | `UX-02` | "colgala" pide backend; hay que chequear el fondo |
| `IDEA-06` | Zoológico | original (¿tipo nuevo de `US-05`?) | `BR-07`..`BR-12`, motor de artículos | mueve el piso de `US-05` |
| `IDEA-07` | Pacman en el Savoy | clon vestido | — | motor + licencia (el más barato de los cinco) |
| `IDEA-08` | Letras y acordes | original (no es juego) | — | deroga `BR-03`/`BR-12`; acordes sin fuente |
| `IDEA-09` | Test de 2 ejes | original | `UX-02` | elegir ejes que no midan nivel |
| `IDEA-10` | Guitar Hero | clon vestido | el mp3 entero (`D-22`) | ~~bloqueo de audio~~ **levantado por `D-22`**; ahora falta la partitura |
| `IDEA-11` | Mayor o menor con palabras del cancionero | original (género conocido, motor mínimo) | `cancionero.json` (104 temas), `UX-02` | el conteo es respuesta correcta — corpus limpiado por `T-103`, falta reconfirmar |

## Preguntas abiertas al usuario

Ninguna frena nada — las diez quedan guardadas igual. Son las tres cosas que no puedo
contestar yo sin inventar:

1. **`IDEA-06`: "el gordo Pier".** No figura con ese nombre en los 105 temas de `RES-20`.
   ¿Es *Pierre, el vitricida* (Gulp!, 1985)? ¿Es otro personaje que no viene de un título de
   tema? ¿O es apodo de alguien real?
2. **`IDEA-05`: "la tumba del Indio".** ¿Qué es exactamente ese fondo? Y la otra mitad de la
   idea: ¿la bandera se comparte como imagen (entra hoy) o se cuelga en un paredón que todos
   ven (necesita backend, contra el stack)?
3. ~~**`IDEA-10`: Guitar Hero.** Cuál de las tres salidas de arriba, si alguna.~~
   **CONTESTADA el 2026-08-22:** el usuario eligió la salida 1 — alojar los temas enteros en
   mp3 (`D-22`). En su lugar queda otra, más chica: de dónde sale la partitura.

## PENDIENTE

- Ninguna de las diez tiene piso de ítems, y es a propósito: el piso se fija al promover a
  `US-XX` (`BR-16`), no antes.
- Licencia de cada motor genérico candidato: ficha `RES-XX` de `investigador`, una por
  motor, cuando se tome la primera de las cinco (`BR-15`, consecuencia 1).
- Música de fondo en loop dentro de una partida: no hay decisión que lo cubra. Dueño:
  `arquitectura`, cuando se tome cualquiera de los cinco clones.
