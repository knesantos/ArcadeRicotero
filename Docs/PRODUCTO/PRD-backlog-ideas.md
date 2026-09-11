# PRD — Backlog de ideas: catorce IDs, doce guardadas, una promovida, una nunca abierta

> **Consume:** pedido directo del usuario, 2026-08-22 (las diez ideas y la instrucción
> transversal sobre los clones). `Docs/BRIEF.md` (riesgo 4, "Fuera de alcance"),
> `Docs/DECISIONES.md` `D-05`, `D-06`, `D-08`, `D-09`, `D-14`, `D-17`, `D-19`.
> `RES-20` (`INV-20-fuentes-primarias.md`) para verificar cada título contra los 105 temas.
> `BR-03`, `BR-12` (topes de exposición de letra), `CTR-01.3` (fragmento ≤ 15 s),
> `US-02`, `US-05`, `UX-02`.
>
> **Produce:** `IDEA-01`..`IDEA-14`, `BR-15`, `BR-16`.
>
> **Sumado el 2026-09-11 para `IDEA-14`:** `Docs/INVESTIGACION/INV-60-skayboy-poligirl.md`
> (`RES-60`..`RES-65` más tres mediciones sobre el repo), `D-32`, `D-37`, `D-38`, `D-39`,
> `D-40`, `BR-18`, `public/arte/README.md`, `public/arte/ensayo/README.md`.
>
> **Por qué las reglas arrancan en 15 y no en 13:** este archivo se escribió con `BR-12`
> como último en disco, así que las reglas nacieron `BR-13` y `BR-14`. Antes de cerrar, el
> `git status` mostró que otra sesión estaba escribiendo el ciclo 5 sin commitear, y que
> `T-66` y `T-67` ya tenían esos dos números tomados (uno ya escrito en
> `PRD-redondopedia.md`). Se renumeró acá, que era lo barato: `BR-13`/`BR-14` no tenían
> todavía ninguna cita apuntándoles. La lección quedó anotada en `Docs/IDS.md`.

## Qué es este archivo y qué no

El usuario dijo, textual: *"no hace falta que las hagamos todas, pero sí guardémoslas. No
empieces a desarrollar ninguna."* Esto es eso: las ideas escritas con suficiente detalle
para que dentro de tres meses se entiendan solas, con su ancla ricotera verificada y con lo
que cada una choca contra lo que ya está decidido.

**Lo que cambió el 2026-09-11, y hay que decirlo acá arriba:** `IDEA-14` llegó con la
instrucción opuesta — *"comencemos a desarrollar"*. Se guarda igual y en el mismo formato,
porque empezar sigue pasando por promoverla a `US-XX` (`BR-16`). Lo que sí cambia es que esa
ficha ya no espera información: espera dos dueños y un piso.

**Ninguna de estas ideas es alcance de la v1** — ni las diez del pedido original ni las que
se sumaron después. El alcance sigue siendo el de
`PRD-alcance-v1.md` (`US-01`..`US-04`) más la Redondopedia (`US-05`), y ese alcance **no
está cerrado**: `US-03` no tiene un solo ítem cargado, `US-02` tiene su pool pero **0 de los
8 Fáciles** que pide su piso (`BR-18` apartado g: falta la `YT_API_KEY`) y `US-05` iba 29 de
35 cuando esto se escribió.

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

## Las ideas — las diez del pedido original, y las que llegaron después

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

> ✅ **PROMOVIDA a `US-06` por `T-115` (ciclo 8), 2026-08-24.** El usuario fijó los ejes
> —*"un eje luz oscuridad y otro eje orden caos"*— y confirmó que lo que se ubica en el
> plano es el jugador, no los 105 temas: la única pregunta que esta ficha dejaba abierta
> quedó contestada. Historia, criterios y piso en
> `Docs/PRODUCTO/PRD-alcance-v1.md` (`US-06`, `BR-17`). Esta ficha se queda tal cual estaba
> escrita, como registro de por qué se tomó (`Docs/IDS.md`, un `IDEA-XX` promovido no se
> borra).

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

### IDEA-13 — La extensión a Supabase: separar correcciones, puntajes y jugadores

**Tal cual la dijo el usuario:** *"la idea no es que se vea la correccion primero, sino que
nos llegue a nosotros, luego se podria extender con una base de datos gratis de supabase
para guardar scores y los jugadores y correcciones."*
**Tipo:** no es un juego — es infraestructura de persistencia para tres cosas que hoy son
tres estados distintos: una corrección que hoy sale por mail/portapapeles (`CTR-10`, ciclo
9), un puntaje que hoy vive en `localStorage` de un solo aparato, y un jugador que hoy **no
existe como entidad** en ningún lado del sitio.
**Origen:** `Docs/SUGERENCIAS/HILO-para-producto-supabase-scores-y-correcciones.md`, sobre
pedido directo del usuario, 2026-08-25.

**"Guardar en una base de Supabase" es una frase, pero son tres decisiones con tres pisos
de riesgo distintos.** Separarlas es el trabajo de esta ficha, y va contra la forma en que
está pedida: tratarlas como un solo salto de infraestructura es exactamente lo que hace que
la más difícil de las tres pase colada detrás de la más fácil.

| Qué guardaría | Con qué choca | Decisión de `producto` |
|---|---|---|
| **Correcciones** | nada | Entra primera, y sin pedir nada nuevo por escrito. Es el destino natural de `CTR-10`: el transporte ya queda **detrás de una interfaz** y el payload **ya viaja sin identidad de la persona** (`T-150`, ciclo 9). Cambiar mail/portapapeles por Supabase es reemplazar el transporte, no abrir un molinete — no hace falta ni una `D-XX` nueva para esta parte. |
| **Puntajes** | *"Fuera de alcance: ranking global"* (`CLAUDE.md`) | No entra tal como está pedida. El brief ya resolvió la mitad barata y la confirmó por omisión: *"Puntajes y rachas en `localStorage`, sin sincronización entre dispositivos."* Lo único que Supabase sumaría por encima de eso es justo lo que sigue Fuera de alcance: sincronizar puntaje entre aparatos o exponer un ranking entre jugadores. Y esa conversación **ya tiene dueño y ya quedó abierta en otro lado**: `D-15` la dejó dicha con su propia advertencia — *"un ranking sin cuentas es difícil y un ranking con cuentas cierra un molinete"*. No la reabro acá: si se quiere retomar, se retoma en `D-15`. |
| **Jugadores** | *"Fuera de alcance: cuentas de usuario"* **y `D-14`, los molinetes** | El choque duro. Se desarrolla abajo — es el único de los tres que no cierra en una fila de tabla. |

#### El choque con `D-14`, nombrado de frente

`D-14` no dice "conviene no tener cuentas": dice que **nada acá se le niega a nadie por no
tener con qué entrar**, y nombra sin cuentas, sin login, sin Premium. Es la decisión que
unificó `D-08`, `D-09` y el "Fuera de alcance" del brief bajo una sola imagen —los
molinetes abiertos— y es lo más parecido que tiene este proyecto a una idea rectora.

Y "Supabase + jugadores" no llega virgen a esta pared: **`D-15` ya la chocó una vez**, en
la misma sesión que decidió el hosting, y dejó escrita la frase que más pesa acá: *"una
cuenta es, literalmente, un molinete — es pedirle algo al jugador para dejarlo entrar, y
es lo único que el principio rector prohíbe por nombre."* `D-15` cerró esa puerta para
**cuentas** en el sentido de login, mail, contraseña, recuperación. Esa parte no se
reabre acá: sigue cerrada.

#### La salida que propone la ficha del hilo principal, evaluada

Un identificador anónimo generado en el propio aparato, sin mail, sin contraseña, sin
recuperación: guarda el historial en ese teléfono y **no le pide nada a nadie para
entrar** — el que llega por un enlace juega igual, exactamente como hoy.

**Mi lectura: eso no es la misma cosa que "una cuenta", y por eso puede tener una
respuesta distinta a la que ya dio `D-15`.** El molinete de `D-14` es un pedido: algo que
el jugador tiene que aportar —credencial, dato, permiso— para poder entrar. Un id que el
aparato genera solo, sin preguntarle nada al jugador, sin bloquear ninguna pantalla si no
existe o si se borra, no le pide nada: es contabilidad interna, no un portón. Bajo esa
lectura, **sí, un jugador puede existir sin cuenta**, siempre que sea exactamente esa
forma y ninguna otra — anónimo, silencioso, opcional, sin dato personal, sin login — y
nunca la variante con mail y contraseña, que sigue cerrada por `D-14`/`D-15` sin
excepción.

**Lo que esta lectura no hace es mover sola el "Fuera de alcance".** `D-14` es una
decisión del usuario tomada con toda la evidencia sobre la mesa, y `D-15` ya escribió en
el mismo tema sin distinguir variantes de "cuenta". Decir que un id anónimo no cuenta
como "cuenta de usuario" a los efectos del Fuera de alcance es un movimiento del mismo
tamaño que el que hizo `D-22` con "alojar los temas completos": saca algo de Fuera de
alcance porque, mirada de cerca, la línea dejó de sostenerse igual para todos los casos.
Y como con `D-22`, **eso lo escribe el usuario con una `D-XX` nueva cuando se tome la
idea, no `producto` adentro de un backlog** (`Docs/IDS.md`: el prefijo `D-` lo asigna la
sesión principal). Lo que dejo hecho acá es la lectura y el filtro: si algún día se
construye un "jugador", entra únicamente por esta puerta angosta, nunca por la de login.

#### Lo que queda por resolver si se toma, y de quién es

1. **La `D-XX` que autorice el id anónimo**, con el texto explícito de que no es "cuenta"
   a los efectos de `D-14` y del Fuera de alcance. Dueño: el usuario / hilo principal.
2. **El costo real de Supabase en el tier gratuito, transversal a las tres.** `D-15` ya
   midió que ese tier **pausa proyectos por inactividad**, y un fan site de poco tráfico
   es justo el caso que se apaga solo. Guardar ahí correcciones, puntajes o jugadores
   hereda ese riesgo por igual. Dueño: `arquitectura`, cuando se tome la primera de las
   tres — no lo resuelvo yo acá.
3. **Si "puntajes" se retoma alguna vez, la conversación es `D-15`, no esta ficha.** No la
   duplico.
4. **Piso de ítems y criterios de aceptación**, si esto se promueve a `US-XX`, se fijan al
   promoverse (`BR-16`), no antes.

#### Orden si se toma

No las tres juntas. **(1) Correcciones** — no pide nada nuevo y `CTR-10` ya la deja lista;
es la única parte "gratis" de la frase del usuario. **(2) Jugador anónimo** — solo si
existe la `D-XX` del punto 1. **(3) Puntajes o ranking compartido** — sigue siendo la
conversación de `D-15` y no entra sin que esa conversación se retome.

#### Es backlog, confirmado

*"Luego se podría extender"* es backlog, no v1 ni v2 con fecha. Nada de esto corre en el
ciclo 9: lo que corre ahí es el botón de corrección con mail y portapapeles (`BR-21`,
`CTR-10`), que sigue funcionando igual el día que, si acaso, se cambie el transporte.

---

### IDEA-14 — Skayboy y Poligirl

> **La primera idea que el usuario pidió empezar, no guardar.** Las diez del 2026-08-22
> llegaron con *"no empieces a desarrollar ninguna"*. Esta llegó con *"comencemos a
> desarrollar"*. Eso no saltea `BR-16` — empezar sigue siendo promoverla a `US-XX` con
> criterio y piso —, pero sí cambia de qué lado está la carga de la prueba: lo que falta
> para promoverla ya no es información. El relevamiento que `BR-15` consecuencia 1 manda
> hacer antes está hecho, y es el más grande que tuvo cualquier idea de este archivo:
> `Docs/INVESTIGACION/INV-60-skayboy-poligirl.md`, `RES-60`..`RES-65` más tres mediciones
> sobre el repo.

**Tal cual la dijo el usuario:** *"Agrega a ideas y comencemos a desarrollar un juego que sea
como un fireboy y watergirl que se llame skayboy y poligirl. Comenza la investigacion para
construir el juego."* (2026-09-11).

**Cinco respuestas del mismo día, que cierran lo que el relevamiento dejó abierto.** Van
arriba porque cambian la ficha entera, y ninguna se rediscute acá:

1. **El par elemental es cielo / infierno**, no fuego / agua. El fundamento está medido:
   `agua` aparece **una vez** en los 2913 versos del cancionero, y cielo/infierno es la
   familia más alta del catálogo — dos títulos propios, «El infierno está encantador esta
   noche» y «Yo no me caí del cielo», los dos de *Gulp!*, más «Cruz diablo!» y «Un ángel
   para tu soledad». Y arriba/abajo es la geometría nativa de un plataformas: no obliga a
   distinguir dos tintas de piso de un vistazo en un teléfono.
2. **Se juega de a dos, en un teléfono en horizontal**, cada uno agarrando una punta y
   usando los botones de su lado.
3. **`D-38`** autoriza el nombre y la caricatura de dos personas reales vivas, con tres
   barandas: el personaje nunca dice "yo" ni lleva texto atribuido, el diseño va por
   insignia —sombrero, guitarra— y no por parecido facial, y nada narra la relación real
   entre Skay, Poli y el Indio.
4. **`D-39`** abre para este juego la excepción a `D-37` punto 4: suena entero.
5. **`D-40`** contesta la pregunta que abrían las otras cuatro: se juega de a dos **y además**
   hay un camino para uno solo, con el botón de cambio de personaje — el inactivo queda
   quieto donde lo dejaron. Un acompañante no estaba en la lista de `D-14`, pero tiene la
   misma forma. Es la única de las cinco que **cambia el trabajo** y no solo la respuesta: lo
   que arrastra está más abajo, en el piso y en la lista del final.

**Tipo:** clon vestido (`BR-15`), y el primero que obligó a un chequeo previo que `BR-15` no
había previsto. La consecuencia 1 existe porque el autor de un motor no se conforma con que
se baje el sitio. Acá apareció un segundo reclamante posible con exactamente esa forma: dos
personas vivas de 74 y 75 años (`RES-64.1`, `RES-64.2`, `RES-64.9`) cuyo nombre estaría en el
título. A quien se sintió mal representado, bajar el sitio tampoco le devuelve nada. `D-38`
es lo que resuelve ese chequeo, y por eso la idea sigue.

**Ancla verificada — y la aclaración vale más que el ancla.** Lo anclado es **el elemento**,
no la persona y no el nombre. En los 105 títulos de `RES-20` y en los 2913 versos no hay un
solo título ni un solo verso que asocie a Skay con un elemento ni a Poli con otro: "skay"
aparece dos veces en líneas tipadas letra y las dos son notas del transcriptor sobre cómo
toca la guitarra; "poli" solo vive adentro de "político" y "polizón"; "boy" y "girl" dan
cero. **Quién es inmune a qué es criterio del sitio y se declara como criterio del sitio.**
Una pantalla que diga "Skayboy es inmune a X **porque** Y" inventa el porqué, y eso cae bajo
lo único que `CLAUDE.md` declara estricto. El chiste del nombre es nuestro, a diferencia de
«Toxi-Taxi» (`IDEA-03`), donde se arma solo — con el precedente de que un videojuego ya entró
al vocabulario del catálogo: «Un Pacman en el Savoy», *¡Bang! ¡Bang!… Estás liquidado*
(1989), pista 4.

**Y el nombre dejó de explicarse por el par.** "Skayboy y Poligirl" calcaba el par del juego
de origen; con cielo/infierno decidido, el calco se corta. Si el nombre se queda, se queda
porque suena bien, no porque el par lo justifique. Es de `contenido` (`CNT-02`, `D-17`), y lo
puso el usuario: `contenido` propone, el usuario confirma.

**Lo que sí tiene verso propio, y no hubo que forzarlo:** el escenario — «Templo de Momo»
(*Momo Sampler* 2000, pista 1), "Un galpon de luz, es el templo del momo" —, el coleccionable
— «Juguetes perdidos» (*Luzbelito* 1996, pista 11), "Y un par de sienes ardientes / Que son
todo el tesoro" — y la puerta con el guardia adentro, que es justo la figura que `D-14`
invierte: «Queso ruso» (*La mosca y la sopa* 1991, pista 10), "que cuidan por vos las puertas
del nuevo cielo".

#### ¿Esto es `IDEA-04` con otros personajes?

La pregunta hay que hacerla porque el precedente está escrito. Cuando el usuario pidió el
plataformas del bondi, el hilo principal **no abrió** `IDEA-12` — *"Un ID nuevo para la misma
idea es exactamente lo que `Docs/IDS.md` está para evitar"* — y dejó la puerta entornada:
*"Si al usuario le interesaba un segundo plataformas distinto, esto se separa después y ahí
sí toma número propio"* (`HILO-para-producto-idea-04-la-meta-del-bondi.md`).

**Mi lectura: son dos juegos distintos y este toma número propio.** `IDEA-04` es correr y
saltar hacia algo que ya se está yendo — el verbo es *colgarse*, sale de la letra de
«Gualicho», y el nivel lo corta el bondi que arranca. Esto es un puzzle cooperativo donde dos
personajes que no pueden pisar lo mismo se abren paso el uno al otro y llegan juntos a la
puerta (`RES-61.2`). Verbo distinto, control distinto, diseño de nivel distinto, y uno se
juega solo y el otro de a dos.

**Pero comparten el gasto caro, y va escrito acá para que no se pague dos veces:** el motor
2D con licencia (`BR-15` consecuencia 1) y la convención de sprites que hoy no existe. El que
se tome primero paga las dos cosas; el segundo las hereda. De ahí sale una decisión de
alcance que sí es mía: **no se toman los dos en paralelo.** El orden ya está dado —el usuario
pidió este—, así que `IDEA-04` queda enganchada detrás. Lo que la ficha deja dicho para el
día que haya que elegir: el criterio no es cuál idea gusta más, es cuál pone menos cosas
nuevas a la vez. `IDEA-04` pone motor y sprites; esta pone motor, sprites, orientación
horizontal, dos zonas de pulgar, dos personas y sonido de partida.

#### El motor ya no es el bloqueo

`BR-15` consecuencia 1 pedía una ficha por motor candidato **antes**. Está hecha: `RES-62`
trae ocho licencias leídas en el archivo `LICENSE` crudo, y las de riesgo alto releídas por
una segunda vía. El orden que quedó: **Kaplay** 3001.0.19 (MIT, ~65 KB gzip, cero
dependencias), **LittleJS** (MIT, ~46 KB, con ejemplo de plataformas armado) y **Phaser
pineado a 3.90.0** (MIT, ~347 KB, el de comunidad más grande). Afuera, con motivo:
PlayCanvas por peso, melonJS por peso y por dar cinco versiones distintas en cinco fuentes,
Excalibur por física de cuerpo rígido que este juego no necesita, y Matter.js / Planck.js por
no ser motores — son solo física, y adoptarlos obliga a escribir el resto a mano, que es lo
que `BR-15` dice que no se hace. El editor también quedó resuelto: LDtk es MIT de punta a
punta y **Tiled dejó de estar en la lista negra**, porque `RES-63.8` cerró que un mapa no
hereda la GPL del editor.

**Lo que falta no es una ficha: es que alguien nombre un candidato.** Sin candidato no hay
nada más que fichar; con candidato, lo que sigue —isla de Astro con salida estática, `eval()`
contra una CSP, tipos para `npm run check`, código vendorizado adentro del paquete— es de
`arquitectura` y ya está traspasado, junto con el hueco de auditoría que un `<canvas>` y una
hoja de CSS nueva atraviesan sin que nadie se entere.

Y una advertencia que no es de licencia: **no hay clon web adoptable.** Los seis repos que
aparecieron no tienen `LICENSE`, y el único con MIT está escrito en Assembly (`RES-63.1`..
`RES-63.4`). Ningún motor trae la mecánica de dos personajes con elementos excluyentes: se
construye encima de cualquiera, así que tampoco desempata entre ellos.

#### El choque principal: el arte, y un hueco de propiedad

Lo caro nunca fue el motor (`BR-15` consecuencia 2), y acá el costo no es una cantidad: es
una **incompatibilidad declarada por escrito**. `public/arte/README.md`, que es donde vive el
contrato del arte, manda *"PNG con fondo transparente, borde tipo tijera (irregular, con
grano — nunca vector liso)"*, y un sprite legible a 32 px pide lo contrario: a ese tamaño el
borde rasgado es ruido. Las 13 piezas que hay hoy son recortes de collage de 400-800 px:
**cero sprites**. La cuenta de 42 piezas para un solo nivel jugable que trae el dossier es
una cuenta con criterio, no una medición — y el problema es anterior a la cantidad.

**Y de los siete roles, ninguno es dueño del diseño de niveles ni de la producción de
sprites.** Eso no lo cierro yo: o `experiencia` declara la convención nueva y la agrega a ese
README (`UX-04` es suyo y el README es donde el contrato se escribe), o el hilo principal le
pone dueño en `Docs/EQUIPO.md`, que es donde se justifica un rol. Mientras el formato
declarado y el que el género necesita se contradigan por escrito, cualquier piso de niveles
que yo fije es un número sin nadie que lo produzca.

Del mismo README sale una prohibición que en un juego de dos personajes es lo primero a lo
que va a ir la mano: **el par lobo/cordero no se usa como código de acierto/error.** No se
negocia acá.

#### Lo que `D-39` cuesta, dicho una vez

El usuario eligió que el juego suene entero sabiendo el costo, y el costo se escribe igual.
`D-37` punto 4 y `ADR-07.2` dicen que una pantalla de juego no pone temas, *"sin excepción, y
sin discutir juego por juego si su respuesta es soplable"* — y esa frase está escrita así
porque `dos-ejes` ya pidió la excepción por el mismo argumento ("no tiene respuesta que
soplar") y se le puso cama igual. Abrir la excepción acá **reabre la discusión caso por caso
que `D-37` existe para cerrar**, y el que la abre paga la próxima vez que alguien la pida.
Queda anotado, no es un reclamo: `D-39` es la decisión del usuario y manda.

Lo que `D-39` **no** cubre: los efectos de sonido — salto, muerte, moneda, puerta. Un efecto
no es un tema, no es la cama y no es un fragmento de `CTR-01.3`, y no hay una sola línea en
el repo que diga si puede sonar ni de dónde sale. Dueño: `arquitectura`, ya traspasado.

#### Lo que arrastra jugar de a dos — y de a uno

El usuario eligió conservar el corazón cooperativo contra la recomendación del relevamiento
(un pulgar alternando personaje, que es como lo resuelve la versión móvil oficial del juego
de origen, `RES-65.1`). **`D-40` no desarmó esa elección: le puso la segunda puerta al lado.**
El de a dos en horizontal sigue siendo el juego; lo que el relevamiento recomendaba deja de
ser la alternativa descartada y pasa a ser el otro camino del mismo juego. Lo que eso
arrastra va sin maquillar:

- **Cada nivel se resuelve de las dos maneras, y eso prohíbe un puzzle por construcción**
  (`D-40` consecuencia 1). El salto sincronizado, la plataforma que solo aguanta si los dos
  saltan juntos: afuera, salvo que tengan una segunda solución para el que juega solo. Es
  restricción de diseño y no preferencia, y va escrita antes de que se dibuje el primer nivel
  porque después sale carísima.
- **Cuál de los dos modos se ofrece primero no lo fijo yo** (`D-40` consecuencia 3, y punto 11
  de la lista del final). El que llega solo no puede tener que elegir un modo para empezar:
  elegir un modo es una pantalla previa y `D-32` límite 3 no la deja. De `experiencia`.
- **No hay precedente del esquema en este género.** "Dos personas, un teléfono" existe y se
  publica, pero los títulos encontrados son minijuegos de duelo o carrera, no plataformeros
  de salto y física fina (`RES-65.8`). Lo que sí hay es el precedente del esquema en sí:
  *Galaxus*, *"cada jugador agarra una punta del teléfono y usa los botones de su lado"*
  (`RES-65.10`).
- **El sitio no fija orientación.** El viewport de `Base.astro` no bloquea el horizontal, o
  sea que nada hay que romper — pero tampoco hay nada escrito que lo sostenga, y el cálculo
  que decía que dos mandos no entran solo se hizo en vertical.
- **Dos zonas de pulgar, cada una con `--toque-min` ≥ 48 px, sin tapar el nivel.** El piso
  del proyecto coincide con el estándar (48×48 dp, `RES-65.6`), así que el problema no es el
  número: es el reparto de una pantalla de ~812×375 entre dos personas y un nivel. De
  `experiencia` (`UX-04`, `UX-07`).
- **No toca "sin backend", y conviene decirlo para que nadie lo levante como bloqueo:** son
  dos personas en un aparato, no dos aparatos. El multijugador entre teléfonos sí estaría
  afuera, y quedó descartado con fundamento doble (`RES-65.9`).

#### El riesgo 4 del brief está corriendo, y este sería el juego número ocho

Hoy hay siete rutas de juego en el sitio: `/quiz/` más las seis de `src/pages/juegos/`. Y
`US-02` sigue con **0 de los 8 ítems Fáciles** que pide su piso (`BR-01`, `BR-18` apartado
f). El motivo está declarado y no es desidia —el mecanismo está construido y verificado, lo
que falta es la `YT_API_KEY`, que no la puede traer ningún rol (`BR-18` apartado g)—, y por
eso el "Listo" de la v1 no se frenó. Explica por qué no está bloqueado; no cambia lo que se
ve desde afuera, que es un juego de la v1 sin su escalón fácil.

Abrir el octavo frente con el segundo así es, literal, el riesgo 4 del brief: cuatro juegos
hermosos con doce preguntas adentro. **`BR-16` está escrita exactamente por eso.** No es un
veto —el usuario pidió este juego y pidió empezarlo—: es la condición. Se promueve con piso y
con dueño del arte, o se queda guardada como las demás.

#### Mi lectura: por dónde empezar, y no es el motor

El dossier cierra recomendando un personaje quieto y un tile, dibujados a mano, puestos en el
cascarón que ya existe, sin motor y sin física, para contestar si esa pantalla se ve como
este sitio. **Lo compro, y con una razón de producto, no de oficio:** es la única de todas
las preguntas abiertas que después no se puede desdecir. El motor se cambia, la paleta se
cambia, el piso se cambia; que el juego se vea como cualquier plataformas de plantilla no lo
arregla ninguna de esas tres cosas, y lo veta `diseno-marca.md` sin necesidad de discutirlo.

Y hoy es mejor experimento que ayer: con el par decidido, ese tile no es un tile genérico —
es borde de cielo o piso de infierno, y se dibuja en serio.

**La condición es `BR-16`:** ese experimento no promueve la idea ni empieza el juego, y no
habilita a escribir la página, la isla ni el copy. Es una pieza de arte adentro de un
cascarón. Lo que desbloquea si sale bien no es el motor: es la convención de sprites del
README, que es el bloqueo real. Lo que **no** contesta, y conviene que esté escrito antes de
que alguien lo use como prueba de que el juego cierra: cuánto dura un nivel, si entra en una
sesión de dos o tres minutos, y si el esquema de dos manos funciona en la mano.

> **Se hizo en la misma ráfaga, y contestó que sí.** Vive en `public/arte/ensayo/` con su
> propio `README.md`: las dos figuras quietas y la pantalla de 812×375 armada, sin motor y
> sin física. Un sprite se puede dibujar en el idioma de este sitio — el borde sale de
> desplazar el contorno, no de dejarlo liso. Y dejó tres hallazgos que nadie había pedido,
> **dos de los cuales caen justo sobre el punto 1 de la lista de abajo**: `sharp` no puede
> rasterizarlo, porque librsvg no implementa `feDisplacementMap`, así que rasterizar necesita
> un navegador o la máquina del usuario, como los recortes de `D-06`; y sobre el piso claro
> la figura casi desaparece, porque la tinta marfil está calibrada para fondo oscuro y
> `contraste.test.ts` no puede cazar un fondo que es superficie dibujada. El tercero es de
> paridad y lo lee el punto 5. No los repito acá: están en ese README.

#### El piso, si se promoviera — lectura de `producto`, no número fijado

`BR-16` dice que el piso se fija al promover, así que esto es lectura. **Seis niveles,
repartidos 2 / 2 / 2.** De dónde sale, porque un número sin fundamento es lo que este archivo
viene evitando:

- **Un nivel no se consume como un ítem.** En el quiz, ver dos veces la misma pregunta es un
  defecto; en un plataformas, repetir el nivel hasta pasarlo **es** el juego. Por eso el piso
  puede estar muy por debajo de los 40 / 30 / 15 / 10 de la v1 sin que el juego quede vacío:
  lo que sostiene la sesión no es el banco, es el reintento.
- **Pero el escalonamiento no se negocia** (`BR-01`, criterio no negociable del brief). Un
  escalón necesita más de un nivel o es un muro. Tres escalones de a dos es el mínimo con el
  que "nunca un muro en la primera pantalla" se puede verificar mirando el juego.
- **Los dos primeros enseñan jugando.** El juego de origen enseña con cuatro niveles de
  tutorial; acá `D-32` límite 3 no deja poner una pantalla previa y los molinetes abiertos
  exigen que el que llega por un enlace juegue igual. Así que el primero no se puede perder y
  el segundo introduce la puerta doble, que es el corazón: los dos parados al mismo tiempo.
- **El costo marginal se desploma después del primero.** Las 42 piezas de la cuenta con
  criterio incluyen personajes, mandos, tileset, casete y fondo; el nivel dos paga diseño de
  nivel, no arte nuevo, salvo que sume un mecanismo. Seis se puede cerrar. Los 32 del
  *Forest Temple* de 2009 son un producto comercial, no una vara.
- **El que llega solo juega, y ya no es una condición: es `D-40`.** El efecto quedó más chico
  de lo que esta lectura temía. **El piso no sube; sube el trabajo por nivel.** Siguen siendo
  seis, 2/2/2, pero cada uno se verifica dos veces —dos personas moviéndose a la vez y una
  sola alternando— y ninguno puede exigir simultaneidad sin tener una segunda solución para
  el que juega solo. Seis niveles que valen por doce en diseño, no doce niveles.

**Lo que el piso no promete:** que el juego cierre en dos o tres minutos. Eso lo decide la
duración de un nivel para alguien que no juega plataformas, y el dossier la dejó sin cerrar
con dos versiones que no se promedian. Se mide, no se cita.

#### A resolver antes de promoverla

1. **Quién dibuja los niveles y los sprites, y bajo qué convención.** Es el bloqueo real. El
   ensayo del 2026-09-11 no lo cierra, pero le dejó dos condiciones a la convención que se
   escriba: con qué se rasteriza, ya que `sharp` no puede, y qué contorno lleva la figura
   sobre terreno claro (`public/arte/ensayo/README.md`). Dueño: `experiencia` para la
   convención en `public/arte/README.md` (`UX-04`); el hilo principal si hace falta dueño
   nuevo en `Docs/EQUIPO.md`.
2. **Nombrar el motor**, con el orden de `RES-62` ya servido. Dueño: `arquitectura`.
3. **La orientación horizontal y las dos zonas de pulgar** sin tapar el nivel — y la misma
   pantalla tiene que servirle a un par de pulgares solo (`D-40`). Dueño: `experiencia`.
4. **Los efectos de sonido**, que `D-39` no cubre. Dueño: `arquitectura`.
5. **La paridad de Poligirl. Sería una `BR-` nueva y todavía no le pongo número.** Su texto:
   *el peso, la pantalla y la agencia de los dos personajes son iguales; que sean distintos
   es la mecánica, que uno valga menos es el defecto*. Por qué existe: el sitio ya publica
   sobre `la-negra-poli`, **rotulado `hecho`**, que fue *"no una colaboradora ni una
   acompañante: un pilar, con el mismo rango que la voz y la guitarra"*. Si el juego le da el
   rol de apoyo, el sitio se contradice a sí mismo sobre una persona viva. Dueño: `producto`
   al promover.
6. **Qué es el fracaso. Otra `BR-` sin número:** *el fracaso no se narra como la muerte de
   Skay ni de Poli*. Un plataformas mata al avatar cada treinta segundos; `D-38` baranda (c)
   prohíbe narrar la vida real de los dos; y el sitio reserva registro 3 para las tres
   muertes que publica. Nadie preguntó todavía qué registro rige la muerte repetida del
   muñeco de alguien que está vivo, ni si conviene que el fracaso sea otra cosa que muerte.
   Dueño: `producto` con `contenido`; qué se ve, `experiencia`.
7. **El nombre, ahora que el par no lo justifica.** Dueño: `contenido` (`CNT-02`, `D-17`),
   confirma el usuario. Y una restricción que sale del relevamiento y afecta a lo que se
   publica: **el nombre del juego de origen no se escribe en ningún lado** — ni en texto
   visible, ni en metadata, ni en comentarios del código (`RES-60`).
8. **Qué se comparte al terminar.** `src/lib/tarjeta/` existe y todos los juegos terminan en
   una tarjeta; ningún frente preguntó qué comparte un plataformas, y menos uno que se juega
   de a dos: si la tarjeta la firma una persona o dos. Dueño: `experiencia` con `producto`.
9. **Cuánto dura un nivel**, medido y no citado. Es lo que decide si entra en la sesión
   corta. Dueño: `experiencia`.
10. **Piso de niveles y criterio Given/When/Then.** Dueño: `producto` al promover (`BR-16`).
    Con `D-40` adentro, el criterio se escribe dos veces por nivel: se pasa de a dos y se
    pasa solo, o el nivel no está.
11. **Cuál de los dos modos se ofrece primero**, ahora que `D-40` fijó que hay dos. El que
    llega solo no puede tener que elegir un modo antes de jugar: elegir un modo es una
    pantalla previa y `D-32` límite 3 no la deja. Dueño: `experiencia`.

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
| `IDEA-09` | Test de 2 ejes | original | `UX-02` | ✅ **promovida a `US-06`** (`T-115`, ciclo 8) |
| `IDEA-10` | Guitar Hero | clon vestido | el mp3 entero (`D-22`) | ~~bloqueo de audio~~ **levantado por `D-22`**; ahora falta la partitura |
| `IDEA-11` | Mayor o menor con palabras del cancionero | original (género conocido, motor mínimo) | `cancionero.json` (104 temas), `UX-02` | el conteo es respuesta correcta — corpus limpiado por `T-103`, falta reconfirmar |
| `IDEA-13` | Supabase: correcciones, puntajes, jugadores | infraestructura (no es juego) | `CTR-10` (transporte detrás de interfaz) | correcciones no choca; puntajes remite a `D-15`; jugadores choca con `D-14`/Fuera de alcance — entra solo como id anónimo, nunca como cuenta |
| `IDEA-14` | Skayboy y Poligirl: dos personajes, una puerta, cielo e infierno | clon vestido | el molde de página y el cascarón, `tokens.css`, `src/lib/tarjeta/`, las ocho licencias ya leídas (`RES-62`) y el ensayo de arte hecho (`public/arte/ensayo/`) | el arte: el formato que manda `public/arte/README.md` y el que pide un sprite son incompatibles por escrito, y **ningún rol es dueño de los niveles ni de los sprites**. Motor desbloqueado (`RES-62`), personas reales autorizadas (`D-38`), suena (`D-39`), y se juega solo o de a dos (`D-40`) — lo que duplica la verificación de cada nivel, no el piso |

## Preguntas abiertas al usuario

Ninguna frena nada — las ideas quedan guardadas igual. Son las cosas que no puedo contestar
yo sin inventar:

1. **`IDEA-06`: "el gordo Pier".** No figura con ese nombre en los 105 temas de `RES-20`.
   ¿Es *Pierre, el vitricida* (Gulp!, 1985)? ¿Es otro personaje que no viene de un título de
   tema? ¿O es apodo de alguien real?
2. **`IDEA-05`: "la tumba del Indio".** ¿Qué es exactamente ese fondo? Y la otra mitad de la
   idea: ¿la bandera se comparte como imagen (entra hoy) o se cuelga en un paredón que todos
   ven (necesita backend, contra el stack)?
3. ~~**`IDEA-10`: Guitar Hero.** Cuál de las tres salidas de arriba, si alguna.~~
   **CONTESTADA el 2026-08-22:** el usuario eligió la salida 1 — alojar los temas enteros en
   mp3 (`D-22`). En su lugar queda otra, más chica: de dónde sale la partitura.
4. ~~**`IDEA-14`: ¿el que llega solo juega?** Las cuatro preguntas grandes de este juego
   quedaron contestadas el 2026-09-11 y no se reabren — el par es cielo/infierno, se juega de
   a dos en horizontal, `D-38` autoriza a las dos personas y `D-39` lo deja sonar. La que se
   abre es otra, y nace de la segunda: **si el juego pide una segunda persona para poder
   jugarse, el que llega solo por un enlace no juega**, y `D-14` nombra por su nombre lo que
   no se le pide a nadie para entrar — cuenta, login, Premium, saber lo suficiente. Un
   acompañante no está en esa lista, pero tiene la misma forma. Dos salidas, y no las elijo
   yo: **(a)** el juego tiene además un camino para uno solo —que es exactamente el botón de
   cambio de personaje que usa la versión móvil oficial del juego de origen (`RES-65.1`), así
   que existe y está documentado—, o **(b)** es un juego declaradamente de a dos y el sitio
   lo dice de frente antes de entrar, en registro 3, como dice cuánto dura un fragmento.
   Ninguna de las dos rompe nada; la segunda sube el piso de niveles, la primera lo duplica
   en diseño.~~
   **CONTESTADA el mismo día, 2026-09-11:** el usuario eligió la salida **(a)** — el juego
   tiene las dos puertas, y la de uno solo es el botón de cambio de personaje (`D-40`).
   Avisar que hay un molinete no lo abre. Lo que arrastra está metido en la ficha: cada nivel
   se resuelve de las dos maneras, el piso de seis 2/2/2 no sube pero se verifica dos veces,
   y queda una pregunta nueva, más chica, para `experiencia` — cuál de los dos modos se
   ofrece primero, sin pantalla previa (punto 11 de `IDEA-14`).

## PENDIENTE

- Ninguna idea tiene piso de ítems, y es a propósito: el piso se fija al promover a
  `US-XX` (`BR-16`), no antes. La única con lectura escrita de cuál sería es `IDEA-14`
  (seis niveles, 2/2/2 — y desde `D-40`, cada uno verificado dos veces), y es lectura, no
  compromiso.
- ~~Licencia de cada motor genérico candidato: ficha `RES-XX` de `investigador`, una por
  motor, cuando se tome la primera de las cinco (`BR-15`, consecuencia 1).~~ **Hecho el
  2026-09-11 para todas:** `RES-62` trae ocho licencias leídas en el archivo `LICENSE` crudo,
  y sirve igual a `IDEA-02`, `IDEA-03`, `IDEA-04` y `IDEA-07`. Lo que falta es nombrar un
  candidato, no fichar otro.
- Música de fondo en loop dentro de una partida: `D-39` la habilitó **solo para `IDEA-14`**.
  Para los otros cuatro clones sigue sin decisión que la cubra, y ahora con el agravante de
  que `D-37` punto 4 la prohíbe por nombre. Dueño: `arquitectura` para el cómo, el usuario
  para el permiso. Y en ningún caso están cubiertos los efectos de sonido, que no son un
  tema, ni la cama, ni un fragmento de `CTR-01.3`.
