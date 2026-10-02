# PRD — Redondopedia: la enciclopedia ricotera navegable

> Rol dueño: `producto`. Consume `D-20` (el mandato, léase primero), `D-05` (los cuatro
> juegos y su orden de corte — este frente no los toca), `D-02` y `D-15` (estático, sin
> backend), `D-09` (los tres criterios no negociables), `D-12` (quien escribe no verifica),
> `D-13` (letras de fans con mitigaciones), `D-14` (la postura: molinetes abiertos, rotulado
> hecho/leyenda/testimonio), `D-19` (cada pantalla viste un disco), `D-04` (tapas reales en
> baja resolución con crédito). Consume además `Docs/CONTENIDO/CNT-04-limite-editorial-muertes.md`
> (sin editarla), `BR-03` (`Docs/PRODUCTO/PRD-alcance-v1.md` — el tope de 2/1/0 versos y el
> máximo de 5 versos simultáneos del juego "completar la letra", que `BR-12` reutiliza) y
> las fichas `RES-02`, `RES-03`, `RES-04`, `RES-05`, `RES-06`, `RES-07`, `RES-08`, `RES-09`,
> `RES-20`, `RES-21`, `RES-22`, `RES-23`, `RES-31`, `RES-33`, `RES-36` como inventario de
> insumo disponible para el primer lote (`D-20`, cláusula 4). `BR-34` y `BR-35` consumen
> además `RES-47`, `RES-04`, `CNT-06` y `.claude/rules/voz-ricotera.md` (los registros 2 y 3).
>
> Produce: `US-05`, `BR-07`..`BR-14`, `BR-34`, `BR-35`.
>
> No fija el schema ni el formato de archivo (`arquitectura`), no diseña la pantalla de
> lectura ni el mecanismo visual del rótulo (`experiencia`), no redacta un solo artículo ni
> relee `CNT-04` por su cuenta (`contenido`). Fija qué es un artículo, cuántos hacen falta
> para no parecer vacía, qué la vuelve navegable de verdad, y qué prioridad tiene contra la
> v1 que ya está en marcha.

## Por qué existe este documento

`D-20` decidió sumar la Redondopedia como quinto frente y dejó tres cosas explícitamente
para `producto`: la historia `US-05`, su estructura, y su piso. El riesgo 4 del brief —
"un motor hermoso con doce preguntas adentro"— aplica acá igual que a los cuatro juegos,
ahora sobre un frente de lectura en vez de un frente de partidas: un buscador y una
plantilla de artículo terminados con tres entradas cargadas no es una enciclopedia, es una
demo. Este documento fija el número que evita eso, y las reglas de negocio que hacen que
"navegar como en Wikipedia" sea algo que se pueda comprobar y no una frase linda.

Una aclaración de alcance que no es mía pero conviene repetir acá: el BRIEF dice "nada de
manual ni de enciclopedia" y eso rige **la voz** (dueño `contenido`, `CNT-02`), no la
estructura que fija este documento. La Redondopedia es enciclopedia en la forma y ricotera
en la voz — la cita completa está en `D-20`, consecuencias.

---

## US-05 — La Redondopedia

Como jugador que llega a este sitio por un juego de dos minutos y se queda con ganas de
saber más — o como alguien que entra directo a leer, sin haber jugado nada — quiero poder
navegar la historia de la banda por enlaces entre artículos, con la leyenda contada como
leyenda y el hecho como hecho, para profundizar en lo que el juego solo asoma, sin que
leer un rato interrumpa ni reemplace la partida de dos minutos.

### Criterio 1 — qué hace que un artículo cuente como completo, no un cascarón

- **Given** un artículo publicado, de cualquiera de los seis tipos de `BR-07`.
- **When** se lo audita contra el piso de campos mínimos de su tipo.
- **Then** ningún campo mínimo está vacío ni en placeholder, el resumen de un párrafo se
  entiende sin haber leído el resto del artículo, y tiene al menos un enlace entrante y
  los enlaces salientes mínimos que fija `BR-09`.

### Criterio 2 — el piso, no el motor, define "lista"

- **Given** la Redondopedia con su plantilla, su navegación y su rotulado funcionando.
- **When** tiene menos artículos publicados que el total de la tabla de piso de abajo (hoy
  38, desde `BR-34`), o los tiene repartidos de otra manera.
- **Then** no se considera lista — mismo criterio que ya rige los cuatro juegos de la v1:
  un sistema terminado con poco contenido adentro no cierra un ciclo.

### Criterio 3 — navegación sin callejones ni islas

- **Given** el conjunto completo de artículos del piso.
- **When** se recorre el grafo de enlaces internos desde la portada de la Redondopedia.
- **Then** se cumple `BR-09` entero: cero huérfanos, cero callejones sin salida (salvo la
  excepción declarada ahí), y cero artículos inalcanzables desde la portada.

### Criterio 4 — el circuito de ida y vuelta con los juegos no pierde la partida

- **Given** un jugador en medio de una partida de cualquiera de los cuatro juegos, en un
  ítem que tiene artículo asociado en la Redondopedia.
- **When** elige "leé más" y entra al artículo.
- **Then** puede volver al juego con un enlace de regreso sin que su partida en curso se
  haya perdido o reiniciado — la Redondopedia no es un agujero sin salida para quien solo
  quería ver una cosa rápido y volver (extiende el espíritu de continuidad de `US-01`
  criterio 2 y `BR-01` al nuevo frente).

### Criterio 5 — la discrepancia entre fuentes no se fuerza a una sola respuesta

- **Given** un dato donde las fuentes ya fichadas discrepan (ej. la fecha de *Gulp!* con
  tres versiones, o si *Lobo suelto, cordero atado* cuenta como uno o dos discos —
  discrepancias vivas en `ESTADO.md`).
- **When** el artículo correspondiente lo trata.
- **Then** puede presentar las versiones en paralelo, cada una con su rótulo y su fuente,
  en vez de elegir una sola como hace por necesidad un multiple choice — a diferencia del
  quiz (`CNT-03` vetó estos casos como pregunta porque una trivia necesita una única
  respuesta correcta), la prosa larga no tiene esa restricción y puede mostrar la
  discrepancia como lo que es.

### Criterio 6 — la Redondopedia no promete sesión de 2-3 minutos

- **Given** un jugador que entra a un artículo largo.
- **When** se le mide contra el criterio de sesión corta que rige el resto del sitio.
- **Then** no aplica: la Redondopedia es explícitamente **otro modo de uso** (`D-20`), sin
  partida que cerrar ni resultado que compartir. Ver la sección "Qué promesa de sesión
  hace" más abajo — no es un vacío, es una decisión con motivo propio.

**Queda fuera de esta historia:** la plantilla visual de artículo y el mecanismo de
"leé más" / "volver a jugar" (dueño `experiencia`); el schema o formato de archivo que
guarda cada artículo, el mecanismo técnico del rótulo granular dentro del cuerpo, y el
script de verificación del grafo de enlaces (dueño `arquitectura` — dependencia señalada
en `Docs/SUGERENCIAS/PRD-para-arquitectura-contrato-redondopedia.md`); qué artículos
concretos se escriben primero y su texto (dueño `contenido`).

---

## BR-07 — Tipos de artículo y campos mínimos

Confirmo los seis tipos que proponía el brief como abiertos, con un ajuste: no agrego un
séptimo tipo para "tapas y arte" — ese contenido vive **dentro** del artículo de `disco`
(la tapa, con crédito a Rocambole y baja resolución por `D-04`) y del artículo de
`persona` de Rocambole mismo, no como entrada propia. Una tapa no es una entidad que se
sostenga sola en una enciclopedia; el disco al que pertenece, sí.

| Tipo | Qué es | Campos mínimos |
|---|---|---|
| `disco` | Un álbum de estudio | Título, año (con discrepancia declarada si la hay), sello, tracklist con autoría por tema (`RES-20`), portada en baja resolución con crédito, un párrafo de ubicación en la cronología, enlace a al menos un `hito` o `persona` |
| `tema` | Una canción | Título, disco de pertenencia (enlace obligatorio), año, autoría real con enlace al artículo `persona` de cada autor (`RES-20` — la mayoría Solari–Beilinson, dos con tercer autor), de qué trata la canción contado con palabras propias, contexto de grabación, la mitología o leyenda asociada rotulada, testimonio del Indio o de Skay sobre el tema si hay ficha que lo respalde — **la cita de verso no es obligatoria** (`BR-14`); **si hay versos disponibles**, hasta 5 citados al servicio del análisis —nunca sueltos— con la fuente (`D-13`: letras.com o bestiarioredondo) y marca de si fueron cruzados contra los 105 temas de `RES-20` y/o confirmados de oído (tope y regla completa en `BR-12`) |
| `persona` | Un integrante de la banda o figura central (Indio, Skay, Poli, Semilla, Rocambole) | Nombre, rol/instrumento, período activo, biografía breve, discos en los que participó (enlaces), hitos relacionados (enlaces), fecha de fallecimiento si aplica, rotulada hecho |
| `hito`/`caso` | Un suceso puntual de la historia real de la banda | Fecha, qué pasó (rotulado por afirmación, no un rótulo único), personas involucradas (enlaces), consecuencia institucional o histórica si existe, fuente |
| `concepto` | Una práctica o rasgo de la cultura ricotera | Nombre del concepto, qué es y cómo se practica, origen o ejemplo histórico (enlace a `hito` o `disco`), fuente |
| `leyenda` | Una historia que circula entre fans, con o sin desmentido | La leyenda tal como se cuenta, **rotulada leyenda sin excepción en su afirmación central**, contraste con el hecho real si existe y está desmentido, de dónde circula si se sabe |

**Por qué estos seis y no una lista más corta o más larga:** cubren exactos los cinco
frentes de contenido que nombra `D-20` (historia, biografías, letras, casos reales,
cultura ricotera) más el tipo que existe porque `D-14` lo exige como ciudadano de primera
y no como nota al margen: la leyenda. Fusionar `leyenda` dentro de `hito` la volvería
invisible dentro de artículos de hecho, que es justo lo que `BR-08` prohíbe.

---

## Piso de ítems — 38 artículos (35 originales + 3 por `BR-34`, que reemplaza el +1 de `BR-13`)

| Tipo | Piso | Insumo ya fichado | Costo dominante |
|---|---|---|---|
| `disco` | 10 | Los 10 discos completos, `RES-02` + `RES-20` | Bajo — datos ya armados, falta prosa de enlace |
| `persona` | 5 | Indio, Skay, Poli, Semilla, Rocambole — `RES-06`, `RES-09`, `RES-22` | Medio — biografía nueva en prosa |
| `hito`/`caso` | 7 | Formación, debut en Obras (89), Huracán 93-94, separación, muerte del Indio, Bulacio, Olavarría — `RES-04`, `RES-05`, `RES-07` | Medio-alto — 2 de los 7 esperan `BR-10` |
| `concepto` | 7 | Misa ricotera, aguante, autogestión, difusión sin TV — `RES-07`; **+3 por `BR-34`, uno por banda:** `los-fundamentalistas`, `skay-y-los-fakires`, `los-decoradores` — `RES-47` | Bajo — fichas ya armadas; el único cuidado es el rotulado de `BR-35` |
| `leyenda` | 3 | "Ji Ji Ji" desmentida, Patricio Rey como persona real — `RES-08`, `RES-22` | Bajo — ya vienen rotuladas |
| `tema` | 6 | Los que ya tienen insumo rico fichado (mitología, autoría, contexto) — `RES-08`, `RES-20`, `RES-22` | Medio sin verso (`BR-14`): prosa de análisis sobre insumo ya fichado, sin esperar transcripción. Sube a Alto solo si se agregan versos citados, por el tope de `BR-12` y el cruce obligatorio de `D-13` |
| **Total** | **38** | | |

**Nota de `BR-34` (2026-10-01):** el piso sube de 35 a **38**. Son los tres artículos de las
bandas de después de la separación, uno por banda, todos `concepto` (fila de arriba). El
36 de `BR-13` queda reemplazado: contaba un solo artículo para las tres. El número no es
una sensación: es el pedido textual del usuario —*"estas bandas ... deben estar en la
redondopedia"*, tres nombres— y una Redondopedia que lo deja afuera no está lista aunque el
motor y los 35 anteriores estén cerrados. Mientras `contenido` no los cargue, el estado
honesto es **35/38**, no "cerrado". La fila `tema` sigue 6/6 y no se toca.

**Nota de `BR-13` (ciclo 5, `T-66`) — histórica, el 36 ya no rige:** el piso subió de 35 a 36 al sumar un artículo
`concepto` nuevo sobre las bandas ricoteras de la posseparación, fichadas en `RES-47`. No
reemplaza ninguno de los cuatro `concepto` originales ni compite con ellos — es contenido
nuevo con insumo ya fichado, mismo criterio que fijó el 35 de partida. El detalle completo
de por qué es `concepto` y no un tipo nuevo está en `BR-13`, más abajo. Esto **no** reabre
el 35/35 que este mismo ciclo cierra vía `BR-14`/`T-68` sobre la fila `tema`: esa fila sigue
6/6, lo que cambia es el número total contra el que se mide "listo" — mismo patrón que usó
`BR-10` al subir `hito` de 6 a 7 sin invalidar nada ya escrito.

**Por qué 35 y no un número más chico o más grande:** el mismo criterio que usé para
40/20/15/10 en `PRD-alcance-v1.md` — ajustar al costo real de producir cada tipo, no a una
sensación. Acá el ajuste extra es que la mayor parte del piso **ya está fichada** por
investigación que se hizo para otra cosa (`D-20`, cláusula 4: el primer lote sale de lo
que ya existe, no de investigación nueva) — con más de cuarenta fichas `RES-` disponibles,
35 artículos es alcanzable sin abrir un solo frente de investigación nuevo. Un número
menor dejaría la Redondopedia con menos artículos que tipos de contenido promete el brief
de `D-20`, que es la vidriera vacía del riesgo 4; un número mayor entra a competir de
recursos con lo que sí falta de la v1 (`D-05`), y eso lo decide `/ciclo`, no yo acá.

**Recomendación de producción, no regla:** conviene que los primeros `tema` que se
escriban sean los mismos que ya tengan ítem cargado en `US-02` o `US-03` una vez que esos
juegos tengan contenido — se reutiliza investigación en vez de duplicarla. No lo hago
regla porque el orden real de carga es decisión de `contenido`/`orquestador`.

---

## BR-08 — Rotulado dentro de la prosa larga

**Aplica a:** `US-05`, todo tipo de artículo. Extiende `D-14` a un formato donde el
rótulo único por ítem que usa el quiz no alcanza.

**Por qué el rótulo único del quiz no sirve acá:** una pregunta afirma una sola cosa y
lleva un solo rótulo. Un artículo mezcla las tres clases en el mismo párrafo, a veces en
la misma oración — "el recital fue en Obras [hecho, `RES-05`] y esa noche se dice que pasó
tal cosa [leyenda, sin fuente]". Un rótulo a nivel de artículo dejaría cualquier leyenda
mezclada adentro pasando por hecho verificado, que es exactamente lo que `D-14` prohíbe.

**Regla:**
1. Toda afirmación verificable dentro del cuerpo (fecha, cifra, cita textual, atribución
   de autoría, relación de causa-efecto) lleva su rótulo —hecho, leyenda o testimonio—
   asociado en el punto exacto del texto donde aparece, no en una nota general al pie o al
   principio del artículo.
2. El mecanismo visual del rótulo (color, ícono, nota al margen, resaltado tipográfico) es
   decisión de `experiencia` y `arquitectura`. Acá se fija el requisito de granularidad,
   no la forma en que se ve.
3. Un artículo puede no tener ninguna afirmación de una de las tres clases — la ficha
   técnica de un disco puede ser 100% hecho. La regla exige rotular lo que hay, no forzar
   que aparezcan las tres casillas en cada artículo.
4. Caso especial, artículo de tipo `leyenda`: su afirmación central nunca lleva el rótulo
   hecho, aunque el artículo entero gire alrededor de ella — es justo la inversión que
   `D-14` prohíbe, y un artículo dedicado a una leyenda es el lugar con más riesgo de
   cometer ese error por descuido de redacción.

**Criterio de aceptación:**
- **Given** un párrafo que mezcla una fecha verificada con un rumor sin fuente.
- **When** se lo audita.
- **Then** la fecha lleva marca de hecho y el rumor lleva marca de leyenda, ambas visibles
  sin que el lector tenga que salir del párrafo ni inferirlo del título del artículo.

---

## BR-09 — Navegación sin artículos huérfanos ("navegar como en Wikipedia", verificable)

**Aplica a:** `US-05` criterio 3.

**Regla:**
1. Todo artículo publicado tiene como mínimo **1 enlace entrante** desde otro artículo
   (nunca 0) y como mínimo **2 enlaces salientes** hacia otros artículos (nunca menos de
   2), salvo la excepción del punto 3.
2. Todo artículo es alcanzable desde la portada de la Redondopedia siguiendo enlaces
   internos, sin necesitar buscador — coherente con `D-02`/`D-15` (sin backend): la
   Redondopedia no depende de un motor de búsqueda para ser navegable, depende de que el
   grafo de enlaces esté bien tejido.
3. **Excepción declarada:** un artículo de tipo `leyenda` cuyo único contraste posible sea
   "no hay hecho fichado que la desmienta todavía" puede tener 1 solo enlace saliente (al
   `hito` o `tema` que la origina) en vez de 2 — no se le exige inventar una segunda salida
   que no existe.

**Verificación (comando a definir por `arquitectura`, a correr por quien tenga `Bash` —
`D-12`):** un recorrido programático sobre el grafo de artículos publicados que reporte
(a) la lista de huérfanos (0 entrantes), (b) la lista de callejones sin salida (menos de 2
salientes, fuera de la excepción del punto 3), y (c) la lista de artículos no alcanzables
desde la portada por búsqueda en anchura (BFS). El piso se considera "listo" cuando las
tres listas están vacías sobre el conjunto completo del piso (38 desde `BR-34`; eran 35 al
escribir esta regla) — no se verifica
artículo por artículo al cargarse uno solo, porque con un piso incompleto es normal que
algo todavía no tenga con qué enlazar.

---

## BR-10 — Bulacio y Olavarría en la Redondopedia

**Aplica a:** el tipo `hito`/`caso` de `BR-07`, y resuelve el pendiente que `D-20` deja
explícito: "el límite editorial sobre Bulacio y Olavarría... deja de ser un borde del quiz
para volverse artículos enteros (`CNT-04` se relee con esa vara)."

**Decisión de alcance (esto sí es mío — qué entra, no cómo se redacta):** los dos casos
entran en el piso como artículos de tipo `hito` **propios**, no solo como contexto de otro
artículo — que era el techo que `CNT-04` le puso a Olavarría dentro del quiz.

**Por qué:** la restricción de `CNT-04` sobre Olavarría nace de un problema específico del
formato multiple choice — *"cuatro opciones y un puntaje aplicados a la muerte de un pibe
de 17 años pueden ser obscenos aunque el dato sea correcto"* es la razón que da `CNT-04`
para Bulacio, y el mismo riesgo es el que le cerró la puerta a Olavarría como pregunta
propia. Ese riesgo puntual —convertir una muerte en la respuesta correcta de un multiple
choice— no existe en prosa continua, donde no hace falta convertir nada en la opción
ganadora. Omitir a Olavarría de una enciclopedia por una restricción que nació para
proteger un formato de trivia sería repetir, en un formato nuevo, la salida que el propio
`CNT-04` identificó como la más cómoda y la descartó para Bulacio.

**Lo que NO decido acá, y es de `contenido`:** el tono exacto, el detalle que entra y el
que no, y si la relectura de `CNT-04` necesita un límite distinto para prosa que para
preguntas. `CNT-04` es documento de `contenido` — yo dejo fijado que el hueco en el piso
existe y que alguien tiene que llenarlo con una decisión explícita, no con el silencio que
tenía el quiz sobre Olavarría.

**Contingencia declarada:** si `contenido`, al releer `CNT-04` para este formato, concluye
que Olavarría no puede sostener un artículo propio sin reproducir en prosa el mismo riesgo
que lo mantuvo fuera del quiz, el piso de `hito` baja de 7 a 6 y Olavarría queda como
contexto dentro de "muerte del Indio" o de la cronología de shows en vivo — igual que en
el quiz. Esa conclusión es de `contenido`, no mía; acá solo dejo el valor por defecto y el
número que cambia si no se sostiene.

**El otro pendiente que resuelve esta regla, al menos para este frente:** "muerte del
Indio Solari" entra en el piso de `hito` como artículo propio, con `RES-04` como fuente
rotulada hecho. Es la respuesta, para la Redondopedia, al pendiente abierto en
`ESTADO.md` ("si el sitio menciona en algún lado que el Indio murió, y dónde") — no
resuelve la pregunta para el resto del sitio, que sigue siendo decisión de `contenido`.

---

## BR-11 — Orden de recorte si hay que achicar este frente

**Aplica a:** solo el interior del frente Redondopedia. No compite con la v1 de los cuatro
juegos — esa prioridad la fija `D-20` cláusula 1 y la secuencia exacta la corta `/ciclo`,
no esta regla. Esto es el equivalente, adentro de este frente, de lo que `D-05` hizo entre
los cuatro juegos con "adivinar la tapa cae primero".

**Orden de caída, del primero al que nunca cae del todo:**

1. **`tema` cae primero.** Sigue siendo el tipo más caro —ya no por transcribir la letra
   entera (`BR-12` corrigió ese campo: un artículo `tema` cita versos, no reproduce la
   canción), sino por el cruce obligatorio contra los 105 temas de `RES-20`, la
   confirmación de oído que pide `D-13`, y el trabajo de análisis, contexto y testimonio
   que exige `BR-12` para que cada verso citado esté al servicio de algo. La exposición de
   derechos también bajó con la corrección: el tope de `BR-12` (5 versos por artículo × 6
   artículos, ~30 versos como máximo) queda en el mismo orden que los ~30 versos que ya
   expone el juego (`D-20`, consecuencias), no por encima como suponía la redacción vieja.
2. **`concepto` cae segundo.** Enriquece el contexto cultural pero no es lo que distingue
   al sitio ni lo que sostiene la navegación entre los demás tipos.
3. **`leyenda` se defiende antes que `concepto`,** aunque también antes que `hito` en la
   fila de recorte no entra: es la ventaja competitiva real que `D-20` nombra por nombre
   —*"Wikipedia no puede contar la leyenda como leyenda"*— y es además el tipo más barato
   de los seis: `RES-08` ya la trae rotulada.
4. **`hito` es columna narrativa.** Sin esto no hay "historia completa de la banda", que es
   la primera cosa que pide `D-20`.
5. **`persona` y `disco` nunca caen del todo.** Son el esqueleto mínimo navegable: sin un
   puñado de cada uno no hay ni "quién" ni "qué" para que el resto enlace, y son además los
   más baratos de producir porque `RES-02`/`RES-20`/`RES-06`/`RES-09` ya los dejan casi
   armados.

**Dónde caen los tres artículos de banda (`BR-34`), que son `concepto` pero no se cortan
como los otros cuatro.** El tramo 2 sigue valiendo para los `concepto` culturales (misa,
aguante, autogestión, difusión sin tele): vienen de la lectura que `D-20` hizo del brief. Los
tres de banda son **pedido textual del usuario** (2026-08-21) y caen **después** de esos
cuatro. Si hay que achicar y solo caben dos, se va primero `los-decoradores` (la ficha más
delgada: sin discos propios y con el año de formación sin cerrar, `RES-47`), y quedan
`los-fundamentalistas` y `skay-y-los-fakires`. No es un juicio sobre cuál importa más a la
cultura: es cuál pierde menos enlaces —`los-fundamentalistas` ya la nombran en texto plano
`muerte-del-indio` e `indio-solari`— y cuál tiene menos que decir con lo fichado.

---

## BR-12 — Qué reproduce un artículo de tipo `tema`: versos citados, no letra completa

**Aplica a:** la fila `tema` de `BR-07`. Escrita en el ciclo 4, tarea `T-61`, para corregir
un campo que quedó mal fijado cuando `BR-07` se escribió.

**Qué decía antes, y por qué estaba mal:** la fila `tema` de `BR-07` pedía "letra completa
con la fuente citada". Eso es un campo distinto de citar versos: es reproducir la canción
entera. El propio proyecto ya tenía el límite puesto para el otro lado —`BR-03`
(`Docs/PRODUCTO/PRD-alcance-v1.md`) arma "completar la letra" con 2/1/0 versos de contexto
y un tope explícito de nunca más de **5 versos completos de una misma canción a la vez** en
ninguna pantalla del juego— y `RES-03` fijó el techo legal de cita de obra literaria en
**1000 palabras**, "las partes indispensables", no la obra entera. Nadie había cruzado esos
dos límites contra el campo de `BR-07` hasta que `T-61` (ciclo 4) lo señaló: tal como
estaba redactada, la Redondopedia iba a terminar exponiendo por artículo más letra que la
que el propio juego se prohíbe mostrar en una sola pantalla.

**Regla:**
1. **Tope: hasta 5 versos citados por artículo `tema`, en total y no necesariamente
   consecutivos.** El número no es nuevo: es el mismo techo que `BR-03` ya fija como máximo
   de exposición simultánea del juego (2 versos antes + el verso del hueco + 2 después,
   nivel Fácil). Un artículo de enciclopedia no gana un permiso más generoso que el juego
   para el mismo material — el sitio tiene un solo techo de "cuánta letra de un tema se
   expone en cualquier pantalla", no dos que alguien tenga que recordar por separado.
2. **Cada verso citado tiene que estar al servicio de algo que el artículo dice sobre el
   tema** — ilustrar la mitología asociada, sostener un punto de autoría o de contexto de
   grabación, mostrar por qué se le atribuye una leyenda a esa canción. Un verso pegado sin
   una oración de análisis propia en el mismo párrafo o el siguiente no cuenta para el piso
   de `BR-07` aunque esté dentro del tope numérico: es cita suelta, no artículo de
   enciclopedia.
3. **Lo que sí compone el grueso del artículo** —lo que puede, y tiene que, ocupar la mayor
   parte del texto, sin tope numérico— es:
   - Autoría real, con el nombre exacto de cada autor y enlace a su artículo `persona`
     (`RES-20`).
   - Disco de pertenencia y año, con enlace al artículo `disco`.
   - Contexto de grabación: cuándo, con qué formación, qué se sabe del proceso.
   - La mitología o la leyenda asociada al tema, rotulada como tal (`BR-08`) — nunca como
     hecho.
   - Qué dijo el Indio o Skay sobre el tema, si hay una ficha `RES-XX` que lo registre
     (rótulo testimonio, `BR-08`).
   - Los enlaces a los artículos de `disco` y de cada `persona` autora, que además ya exige
     `BR-09` como mínimo de salientes.
4. **El piso no cambia.** Siguen siendo **6 artículos de tipo `tema`** dentro de los 35 de
   `US-05`. Esta regla corrige un campo de `BR-07` —qué contiene el artículo—, no el número
   de artículos ni la prioridad relativa de `tema` dentro de `BR-11` (que sí se actualizó,
   arriba, porque su argumento citaba el campo viejo).

**Por qué 5 y no otro número:** podría ser más bajo —3, calcado del nivel "Media" de
`BR-03`— o más alto, acercándose a las 1000 palabras de `RES-03`. Elijo el techo del juego
completo, 5, porque es el único que no exige inventar un criterio nuevo: ata la Redondopedia
al límite que el propio proyecto ya defendió y justificó en `BR-03`, y queda *comprobadamente*
lejos del techo legal —5 versos ricoteros rondan las 40-70 palabras según el tema, muy por
debajo de las 1000 de `RES-03`— sin necesidad de acercarse al borde para justificarlo.

**Trazabilidad:** antes decía "letra completa con la fuente citada" (fila `tema` de
`BR-07`, escrita junto con el resto de esa regla al abrir este documento). El cambio lo
pidió el corte del ciclo 4, tarea `T-61` (`Docs/ORQ/ORQ-plan-ciclo-4.md`), contra evidencia
que ya existía en el propio repo antes de esta tarea: `BR-03` (tope de 5 versos del juego
"completar la letra") y `RES-03` (techo legal de 1000 palabras para cita de obra literaria,
"las partes indispensables"). No es un hallazgo nuevo de investigación — es una relectura de
dos documentos que ya estaban escritos antes que `BR-07` y que `BR-07` no había cruzado.

**Criterio de aceptación:**
- **Given** un artículo `tema` publicado.
- **When** se cuenta cuántos versos cita en total y se revisa si cada uno tiene una oración
  de análisis propia que lo sostenga.
- **Then** el total no supera 5, ninguno aparece sin una oración que explique por qué está
  ahí, y el resumen del artículo (criterio 1 de `US-05`) se entiende sin depender de ese
  verso — el verso ilustra el análisis, no lo reemplaza.

**Verificación:** no hay comando propio — es un criterio de conteo y de lectura, no de
estructura de archivo. Si `arquitectura`, al resolver el contrato de la colección
(pendiente en `Docs/SUGERENCIAS/PRD-para-arquitectura-contrato-redondopedia.md`), decide
estructurar las citas como campo propio del artículo, el schema puede hacer cumplir el tope
numérico de forma automática; mientras eso no exista, lo audita `revisor` al revisar el
piso de `tema` contra esta regla y contra `BR-08` (rotulado), con `D-12` rigiendo quién
corre qué.

---

## BR-13 — Las bandas ricoteras de la posseparación: bajo qué tipo entran y qué pasa con el piso

> **Enmendada por `BR-34` el 2026-10-01.** Siguen vigentes: la corrección de los tres
> nombres (arriba), el descarte del tipo nuevo `banda`, y el punto 3 entero (la línea de
> "esto no es de Patricio Rey"; `BR-34` §5 lo amplía a todos los juegos). **Ya no rigen el
> punto 1 en lo que decide —un solo `concepto` para las tres y la actividad de Indio y Skay
> como extensión de las biografías— ni el punto 2: el piso no es 36, es 38.** El texto de
> abajo se deja como está, por trazabilidad; para qué ya no alcanza y por qué, ver `BR-34`
> §1.

**Aplica a:** el pedido directo del usuario registrado en
`Docs/SUGERENCIAS/HILO-para-producto-y-contenido-bandas-post-separacion.md`, resuelto con
la ficha que acaba de llegar de `investigador`: `RES-47`
(`Docs/INVESTIGACION/INV-47-bandas-post-separacion.md`).

**Los nombres, corregidos antes de decidir nada — no se le discute al usuario, se le
muestra la ficha:**
1. **Indio Solari y los Fundamentalistas del Aire Acondicionado.** El pedido decía "INDIO
   y los fundamentalistas del aire acondicionado"; al nombre público real le falta
   "Solari" (`RES-47`, sección A).
2. **Skay y los Fakires.** El nombre está bien tal como lo dijo el usuario, pero no la
   historia completa: entre 2007 y 2012 la banda se llamó "Skay y los Seguidores de la
   Diosa Kali", y "Los Fakires" es el nombre definitivo recién desde 2012, con primer
   disco bajo ese nombre en 2013 (`RES-47`, sección B).
3. **Los Decoradores.** El pedido decía "La kermesse redonda". Esa es, según `RES-47`, el
   nombre de su **formato de gira** (feria + música), vigente en paralelo en la prensa
   incluso en 2026 — pero **la banda se llama Los Decoradores** (`RES-47`, sección C).

### 1. El tipo: un artículo `concepto` para el fenómeno, no un tipo nuevo — y tratamiento
distinto puertas adentro para las dos clases que `RES-47` encontró

**Decisión:** las tres bandas entran a la Redondopedia sin agregar un séptimo tipo a
`BR-07`. Pero no van todas al mismo lugar, porque `RES-47` mostró que **no son la misma
clase de cosa**: Indio Solari y Skay Beilinson son, cada uno, la propia figura fundadora
tocando bajo otro nombre; Los Decoradores es un proyecto de músicos de acompañamiento
(Sergio Dawi, Semilla Bucciarelli, Tito Fargo, Hernán Aramberri), sin figura central.

- **La actividad post-separación de Indio y de Skay se cuenta en prosa, como extensión de
  biografía, dentro de los artículos `persona` que ya están en el piso** (`indio-solari`,
  `skay-beilinson`) — no son artículos nuevos, es un campo que esos dos artículos ya
  tenían que llenar para cumplir su propio piso mínimo de `BR-07` ("biografía breve",
  "hitos relacionados"). La actividad de Los Fundamentalistas hasta la muerte del Indio ya
  tiene resuelto su cruce con `RES-04` vía `BR-10`; la de Skay y los Fakires se agrega
  igual, como banda en actividad.
- **Un artículo nuevo de tipo `concepto`** —título de trabajo "Las bandas ricoteras de la
  posseparación" (la palabra final es de `contenido`)— es el punto de encuentro: nombra
  las tres con el nombre correcto de `RES-47`, explica la diferencia de clase que la
  propia ficha marca (banda de un fundador vs. banda de acompañantes), enlaza a
  `indio-solari` y `skay-beilinson` para el detalle biográfico y a `la-separacion` como
  origen del fenómeno. **Los Decoradores se cuenta ahí y en ningún otro lado**, porque no
  hay ningún artículo `persona` existente del que su historia sea biografía.

**Por qué no (a), tipo nuevo `banda`:** el propio pedido del usuario las nombra "parte de
la cultura redonda" — la definición exacta que `BR-07` ya le dio a `concepto` ("una
práctica o rasgo de la cultura ricotera"). Un tipo nuevo le crea trabajo real a
`arquitectura` (tocar el schema) por tres artículos que no tienen ninguna cuarta compañera
a la vista: no hay una lista de bandas ricoteras que siga creciendo, hay tres, ya
identificadas. Es la sobre-ingeniería del riesgo 4 del brief mirada del otro lado del
espejo — no "motor vacío con poco contenido adentro", sino "motor nuevo para contenido que
ya entra en el que existe".

**Por qué no (c) entera, todo adentro de los artículos que ya existen:** acá `RES-47`
cambia el cálculo respecto de lo que decía la nota de `HILO` (escrita antes de tener los
nombres verificados). Para Indio y Skay, (c) es exactamente correcta — son la banda, y por
eso su actividad posterior es biografía de esa persona y no una entidad aparte. Pero
forzar a Los Decoradores adentro de cualquiera de los cuatro artículos `persona` que ya
existen sería inventarle un dueño que no tiene — el mismo error que `CNT-04`/`BR-10`
evitaron del otro lado para Bulacio y Olavarría, no meter un hecho donde no corresponde
solo porque hay un artículo cerca.

**Por qué no dos `concepto` separados** (uno para las bandas de fundadores, otro para las
de acompañantes): duplicaría el piso por una distinción que se explica en dos párrafos
dentro de un mismo artículo sin perder nada, y fragmentaría la navegación de un fenómeno
que el propio usuario nombró como una sola cosa ("bandas ricoteras" en plural, una sola
vez). Proporción, no negligencia (`D-14`): la diferencia de clase se escribe, no se paga
con un artículo extra.

### 2. El piso: sube de 35 a 36, un solo artículo nuevo

El `concepto` nuevo no estaba contado en ninguno de los cuatro que ya sostenían esa fila
en `BR-07` (misa ricotera, aguante, autogestión, difusión sin TV — insumo de `RES-07`). No
reemplaza ninguno ni compite con ellos: es contenido nuevo con insumo ya fichado por
`RES-47`, así que sumarlo no abre un frente de investigación — mismo criterio con que se
fijó el 35 original (`BR-07`, "Por qué 35 y no un número más chico o más grande").

**Piso de `concepto`: 4 → 5. Piso total de `US-05`: 35 → 36.** La extensión biográfica
dentro de `persona` (Indio, Skay) no suma artículos — siguen siendo los mismos 5 de
siempre, con un campo más lleno — así que el resto de la tabla de piso no se mueve.

**Esto no reabre el 35/35 que este mismo ciclo cierra vía `BR-14`/`T-68`.** Los 6 `tema`
que `T-68` carga siguen cerrando esa fila entera, 6/6. Lo que cambia es el número contra
el que se mide "listo" para el conjunto — mismo patrón que ya usó `BR-10` al subir `hito`
de 6 a 7 sin invalidar nada de lo ya escrito.

### 3. La línea que no se negocia: esto no es de Patricio Rey, y no entra a los juegos por la ventana

**Regla, no comentario:** ningún ítem de los cuatro juegos de la v1 (`US-01` quiz, `US-02`
adivinar el tema, `US-03` completar la letra, `US-04` adivinar la tapa o el disco) puede
construirse con material de Indio Solari y los Fundamentalistas del Aire Acondicionado, de
Skay y los Fakires (o sus nombres previos), ni de Los Decoradores, mientras el piso de
esos cuatro juegos siga definido sobre los 105 temas de `RES-20` — que es, hoy, siempre.
Que el artículo de la Redondopedia sí los cuente no cambia esto: un artículo de
enciclopedia y un ítem de trivia no comparten filtro.

**Por qué es regla dura y no una recomendación:** si un tema de Los Fundamentalistas
entra como pregunta de "adivinar el tema", el jugador que se sabe de memoria los 105 temas
reales de Patricio Rey —el que este sitio existe para premiar— puede arriesgar con la
certeza de que eso no es de la banda madre, y el juego se lo marca error igual. Es
exactamente el modo de falla que `D-14` dejó como lo único estricto del proyecto: la
respuesta correcta tiene que ser correcta para el que sabe.

**Si algún día se quiere que sí entren:** es una `BR-XX` nueva y explícita — que abra el
filtro de `US-01`..`US-04` más allá de los 105 de `RES-20`, o que sume una categoría
separada y rotulada como tal —, nunca un efecto colateral de que esta regla haya sumado
artículos a la Redondopedia. `BR-13` no lo decide ni lo insinúa: lo cierra en la dirección
contraria hasta que alguien lo reabra por escrito.

### Criterio de aceptación

- **Given** el artículo `concepto` nuevo y los campos de actividad posterior agregados a
  `indio-solari` y `skay-beilinson`.
- **When** se los audita contra el criterio 1 de `US-05` (piso de campos mínimos) y contra
  `BR-08` (rotulado granular).
- **Then** cada nombre de banda aparece con la forma verificada por `RES-47`, cualquier
  dato marcado "no verificado" o con inconsistencia entre fuentes en esa ficha (el año de
  formación de Los Decoradores, 2015 o 2016; la formación vigente de Skay y los Fakires)
  se rotula como corresponde y no se presenta como hecho cerrado, y ningún ítem de
  `US-01`..`US-04` cita material de estas tres bandas.

**Verificación:** no hay comando propio — es un criterio de tipo, piso y contenido, igual
que `BR-10`/`BR-12`/`BR-14`. Lo audita `revisor` contra esta regla, `BR-08` y `BR-09`
cuando `contenido` cargue el artículo nuevo y los campos agregados.

**Trazabilidad:** responde al pedido registrado en
`Docs/SUGERENCIAS/HILO-para-producto-y-contenido-bandas-post-separacion.md`, con `RES-47`
como ficha de hechos, `BR-07` (los seis tipos y su fundamento), `BR-09` (mínimos de
enlace), `BR-10` (mismo patrón de "el piso sube con número explícito, no en silencio"), y
`D-14`/`D-20` (molinetes abiertos y la Redondopedia cuenta cultura, pero la respuesta
correcta del quiz no se toca).

**Nota sobre el ID de esta regla:** la tarea que la encarga (`T-66`, ciclo 5) pedía el
número `BR-15`. No lo usé: `Docs/IDS.md` y `Docs/PRODUCTO/PRD-backlog-ideas.md` muestran
que `BR-15` y `BR-16` ya fueron consumidos por la sesión del backlog de ideas ese mismo
día, con citas ya escritas apuntándoles (`IDEA-02`, `IDEA-03`, `IDEA-04`, `IDEA-07`,
`IDEA-10` citan `BR-15`; varias ideas citan `BR-16`). El propio `Docs/ORQ/ORQ-plan-ciclo-5.md`
(tabla, fila `T-66`) y el encabezado de este documento (antes de esta edición) ya
reservaban `BR-13` para esta tarea — el número `BR-15` en el encargo de `T-66` es un error
de transcripción, no una reserva real. Uso `BR-13`, que es el que estaba libre y
efectivamente reservado, para no duplicar un ID ya citado en otro archivo (`Docs/IDS.md`:
"no se reutiliza un número").

---

## BR-14 — Un artículo `tema` se sostiene sin citar un verso

**Aplica a:** la fila `tema` de `BR-07` y el campo de versos citados que `BR-12` acota.
Responde la pregunta que `BR-12` dejó abierta al corregir ese campo en el ciclo 4: la cita
queda topeada en 5 versos **cuando existe**, pero ¿hace falta que exista para que el
artículo cierre?

**La pregunta, tal como la trajo el corte del ciclo 5** (`T-67`,
`Docs/ORQ/ORQ-plan-ciclo-5.md`, tabla y §0.1): un artículo `tema` que trae autoría real,
disco y año, contexto de grabación, la mitología o leyenda asociada rotulada, y lo que
dijeron el Indio o Skay sobre el tema si hay testimonio fichado — ¿se sostiene como
artículo de enciclopedia sin citar un solo verso, o queda cojo y conviene esperar el
material?

**Decisión: sí se sostiene, con una condición que lo sostiene de verdad y no de nombre.**

**Por qué:**
1. Lo que distingue a la Redondopedia de Wikipedia (`D-20`, cláusula 3) es poder contar la
   leyenda como leyenda, no citar el texto de la canción — eso último ninguna enciclopedia
   lo necesita para ser enciclopedia. `RES-08` (mitología ya rotulada), `RES-20` (autoría
   por tema, incluido el contexto de grabación de discos enteros como *Lobo suelto,
   cordero atado*) y `RES-22` (testimonio directo, incluida la voz de Rocambole y
   correcciones del propio Indio) son insumo ya fichado y abundante para sostener un
   artículo entero sin abrir un frente de investigación nuevo.
2. `D-14` ya corrió este mismo debate para el proyecto entero y lo resolvió a favor de no
   exigir algo que no hace falta: el conocimiento popular vale, y dejar de exigirlo no es
   negligencia, es proporción. Acá lo que sobra exigir es el verso, no la fuente.
3. Cerrar el piso de `US-05` a 35/35 este ciclo sin dejar 6 artículos esperando un insumo
   que solo entra por la mano del usuario es el mismo criterio que ya pesó en `D-05`: un
   artículo completo con lo que hay vale más que un cascarón esperando el resto.

**Por qué el argumento en contra no alcanza para bloquear, pero sí alcanza para poner una
condición dura:** un artículo sobre una canción donde no aparece una sola línea de la
canción puede leerse como ficha técnica y no como artículo — ese riesgo es real, y por eso
el punto 6 de la lista de abajo no es opcional ni decorativo: es la cláusula que evita la
ficha técnica. Un artículo `tema` sin verso que **sí** cuenta de qué trata la canción, en
prosa propia, hace el mismo trabajo editorial que cualquier reseña o nota de enciclopedia
musical que no puede citar letra — y esas existen, y se leen como artículos, no como
planillas.

**Qué lleva OBLIGATORIAMENTE un artículo `tema` cuando no hay verso citado — 6 campos,
ninguno opcional:**

1. Autoría real, con el nombre exacto de cada autor y enlace al artículo `persona` de cada
   uno (`RES-20` — la mayoría Solari–Beilinson, dos temas con Semilla Bucciarelli como
   tercer autor).
2. Disco de pertenencia y año, con enlace al artículo `disco`.
3. Contexto de grabación: cuándo, con qué formación, qué se sabe del proceso — lo que el
   insumo fichado permita decir. Si para un tema puntual no hay nada más específico que lo
   que ya cuenta el artículo del disco, el artículo lo dice así, sin inventar relleno.
4. La mitología o la leyenda asociada al tema, rotulada como tal (`BR-08`) — nunca como
   hecho. Si no hay ninguna leyenda fichada para ese tema en particular, el artículo no
   inventa una: dice que no la hay y sigue.
5. Lo que dijo el Indio o Skay sobre el tema, si hay una ficha `RES-XX` que lo registre
   (rótulo testimonio, `BR-08`). Si no hay ficha, no se especula en su lugar.
6. De qué trata la canción, contado con palabras propias. Este campo reemplaza a la cita
   como forma de mostrar el contenido del tema sin reproducirlo, y es lo que impide que el
   artículo se lea como ficha técnica: cuenta la canción, no la transcribe.

Los enlaces de los puntos 1 y 2 ya cubren el mínimo de 2 salientes que exige `BR-09`.

**Consecuencia para la selección de los 6:** no cualquiera de los 105 temas de `RES-20`
sirve igual de bien para este primer lote. `contenido` tiene que elegir, de ese universo,
los temas donde el insumo de los puntos 3, 4 y 5 ya está fichado y es rico — el mismo
criterio que ya usé para fijar el piso en 6 (`BR-07`, columna "Insumo ya fichado": `RES-08`,
`RES-20`, `RES-22`). "Ji Ji Ji" es el caso que la propia investigación ya señaló como el
mejor posible (`RES-08`): autoría firme, mitología grande y desmentida, y testimonio
directo del Indio en Rolling Stone 2007 sobre de qué trata el tema — las tres capas (el que
conoce el tema, el que conoce la leyenda, el que sabe que el Indio la desmintió) funcionan
enteras en prosa, sin necesitar un solo verso citado.

**Qué pasa cuando los versos existan, para que esto no quede ambiguo:** se **agregan** a
los artículos ya escritos. No se quedan así para siempre, y agregarlos no abre una versión
nueva (`-v2`) del contenido: sumar hasta 5 versos bajo el tope de `BR-12` no invalida
ninguna decisión tomada acá, la completa. Es una mejora de contenido priorizable por
`contenido`/`orquestador` cuando el insumo llegue — no una obligación del mismo día en que
el primer verso quede transcripto.

**`BR-12` no se deroga.** Sigue rigiendo entera en el momento en que un artículo `tema` sí
cite un verso —desde el lote inicial o agregado después—: el tope de 5 versos por artículo,
la exigencia de que cada verso tenga una oración de análisis propia que lo sostenga, y la
fuente y el cruce contra los 105 temas que pide `D-13`. Lo único que fija `BR-14` es que la
cita deja de ser un campo obligatorio del artículo y pasa a ser un campo condicional: no
está si no hay verso, y cuando aparece, activa el tope de `BR-12` sin excepción.

**Nota de alcance, que no es de esta regla:** que el ciclo 5 no transcriba ningún verso —ni
para `US-03` ni para estos 6 artículos— es una decisión táctica del corte del ciclo, escrita
en `Docs/ORQ/ORQ-plan-ciclo-5.md` §0.1, que trata los versos como material de origen que
entra por la mano del usuario, igual que los recortes de audio de `US-02`. `BR-14` no toca
esa decisión ni la contradice: fija que el artículo se sostiene sin ese material, no cuándo
ni quién lo transcribe.

**Efecto sobre `BR-11` que dejo señalado y no resuelvo acá:** el punto 1 de `BR-11` pone a
`tema` primero en la fila de recorte por ser el tipo más caro, con el cruce de `D-13` y la
confirmación de oído como costo dominante. Esa cuenta asumía que todo `tema` necesita verso.
Con `BR-14`, el costo del `tema` sin verso baja (ver la columna "Costo dominante" del piso,
arriba, ya actualizada) y el argumento de `BR-11` queda parcialmente apoyado en una premisa
que cambió. No reescribo `BR-11` en esta tarea porque no es lo que pide `T-67`; lo señalo
para quien planifique el próximo recorte de este frente.

**Criterio de aceptación:**
- **Given** un artículo `tema` publicado sin ningún verso citado.
- **When** se lo audita contra el criterio 1 de `US-05` (piso de campos mínimos).
- **Then** los 6 campos de arriba están completos y ninguno es un placeholder, y el campo 6
  (de qué trata, en prosa propia) alcanza para que el resumen del artículo se entienda sin
  haber escuchado el tema ni leído un verso — el mismo estándar que ya exige el criterio 1
  de `US-05` para cualquier artículo del piso.

**Verificación:** no hay comando propio, igual que `BR-12` — es un criterio de contenido de
los campos, no de estructura de archivo. Lo audita `revisor` contra esta regla y contra
`BR-08` (rotulado) al revisar el piso de `tema`, con `D-12` rigiendo quién corre qué si
`arquitectura` llega a estructurar estos campos como propiedades del schema.

**Trazabilidad:** pregunta traída por el corte del ciclo 5, tarea `T-67`
(`Docs/ORQ/ORQ-plan-ciclo-5.md`, tabla, fila `T-67`, y su §0.1). Responde contra `BR-12`
(el tope y la regla de análisis, que esta regla no deroga), `D-20` cláusula 3 (la ventaja
competitiva es rotular la leyenda, no citar texto), `D-14` (el conocimiento popular alcanza;
dejar de exigir algo que no hace falta es proporción, no negligencia), y las fichas
`RES-08`, `RES-20` y `RES-22` como evidencia de que el insumo sin verso ya es rico y está
fichado.

---

## BR-34 — Las bandas de después de la separación: tres artículos `concepto`, un tipo que ya existe, piso 38

**Aplica a:** el pedido del usuario del 2026-08-21
(`Docs/SUGERENCIAS/HILO-para-producto-y-contenido-bandas-post-separacion.md`), que volvió a
pedir el 2026-10-01; `US-05` criterio 2; `BR-07` (fila `concepto`), `BR-09`, `BR-11`.
**Enmienda `BR-13`.** Qué afirman los tres artículos y con qué rótulo es `BR-35`.

**Por qué hay un `BR-34` si `BR-13` ya había decidido.** `BR-13` se escribió el 2026-08-22
(`T-66`) y nadie lo tomó: `T-69`, la tarea que cargaba los artículos, no corrió;
`ESTADO.md` y el plan del ciclo 16 siguen listando el pedido como esperando, y
`src/data/redondopedia.json` no tiene ni un artículo de banda. Es lo que obligó al usuario a
pedirlo de nuevo. Releída contra el repo de hoy, `BR-13` acierta en lo grande (no hay tipo
nuevo; los juegos no tocan este material) y se queda corta en lo que `contenido` necesita
para escribir: junta tres bandas con tres niveles de verificación en una sola ficha, reparte
los datos que caducan entre dos biografías y un concepto, y no dice cómo encuentra la gente
a "La Kermesse Redonda". Cambio eso y nada más.

### 1. La decisión

Tres artículos, los tres de tipo **`concepto`**, sin tocar código ni schema:

| Slug | Título | Qué es (`RES-47`) |
|---|---|---|
| `los-fundamentalistas` | Indio Solari y los Fundamentalistas del Aire Acondicionado | Banda propia de uno de los dos fundadores; desde 2004, cinco discos |
| `skay-y-los-fakires` | Skay y los Fakires | Banda propia del otro fundador; tres etapas de nombre desde 2002, ocho discos (uno compilado) |
| `los-decoradores` | Los Decoradores (La Kermesse Redonda) | Proyecto de músicos de acompañamiento de los Redondos, sin figura central y sin discos propios hallados |

No hay un cuarto artículo que las reúna: ese lugar es `la-separacion` (§3). Los slugs quedan
fijados acá para que los criterios de abajo se puedan verificar; si `contenido` encuentra un
choque real, se cambian en esta tabla y no en silencio.

**Por qué tres y no uno (lo que decía `BR-13`).**
1. **Es la unidad con la que la gente busca.** No hay buscador (`BR-09`, `D-02`/`D-15`): el
   único índice es la portada, que lista el título entero y los primeros 150 caracteres del
   resumen (`src/pages/redondopedia/index.astro`). Un artículo con tres bandas no puede
   llevar tres nombres en el título; tres artículos sí.
2. **Tres niveles de verificación no se mezclan en un párrafo.** `RES-47` deja a los
   Fundamentalistas todo verificado, a los Fakires con la formación sin cerrar y a los
   Decoradores con un año en disputa. En una sola pieza los rótulos de `BR-08` se cruzan
   oración a oración, que es el riesgo 3 del brief. En tres, cada duda queda en su casa.
3. **Los datos que caducan tienen un solo dueño.** Estado, formación vigente, próxima fecha:
   con `BR-13` habrían vivido dentro de `indio-solari` y `skay-beilinson`, que son
   biografías, y habría que corregirlas cada vez que la banda cambie.
4. **El enlace tiene adónde ir.** Hoy "Los Fundamentalistas" es texto plano en
   `muerte-del-indio` e `indio-solari`. Un enlace que lleva a la banda vale más que uno que
   lleva a un resumen de tres.
5. **Se corta en una ráfaga** (riesgo 1). Cada artículo cierra entero con su enlace
   entrante (§3) y deja `npm test` en verde: la tarea se puede soltar después de cualquiera.

El costo contra `BR-13`: dos artículos cortos más, con insumo ya fichado y sin investigación
nueva. Es proporción (`D-14`).

**Por qué `concepto` y no un tipo `banda` — pesado, no obedecido.** Medí el costo en el repo
de hoy. No existe schema formal de la Redondopedia (`src/data/_schema/` no tiene uno; el
contrato sigue siendo la "v0" de `src/lib/redondopedia.ts`), así que "tocar el schema" son
cuatro lugares: `TipoArticulo`, `TIPO_A_CATEGORIA` y `ORDEN_PORTADA` en
`src/lib/redondopedia.ts`, `REDONDOPEDIA.secciones` en `src/lib/sitio/copy.ts` y `TIPOS` en
`redondopedia.test.ts`. Es menos de lo que parecía, no es cero, y falla en silencio: un tipo
que falta en `ORDEN_PORTADA` no se lista en la portada (`porTipo` lo descarta) y el test de
`BR-09` no se entera. Lo que compraría `banda` es un `h2` propio y otra etiqueta sobre el
título; la plantilla, la ficha de `datos` y el rotulado por afirmación son los mismos para
cualquier tipo. Y el `h2` de `concepto` ya se llama **"La cultura ricotera"**, que es casi la
frase del usuario (*"son parte de la cultura redonda"*). Son tres, sin una cuarta a la vista.
**No es claramente mejor, así que `concepto`:** se publica sin esperar a nadie.

El defecto de esa elección, dicho: `BR-07` define `concepto` como "práctica o rasgo", y una
banda es una cosa, no una práctica; y la plantilla imprime el tipo crudo sobre el título
(`.articulo-tipo`), así que "concepto" va a aparecer encima de "Skay y los Fakires". Lo
primero lo resuelve el mínimo propio de §4 (no se fuerza "cómo se practica"). Lo segundo es
menor y no bloquea. **Se reabre a `banda` si** (i) aparece un cuarto artículo de la misma
clase, o (ii) `experiencia` decide que la etiqueta cruda no se banca y prefiere un tipo antes
que una etiqueta legible por slug en la plantilla.

**Descartados.** Tipo `banda` (arriba). Un solo `concepto` del fenómeno (`BR-13` §1; razones
1 a 5). Todo adentro de `persona` (Los Decoradores no tiene dueño, y duplica el dato que
caduca). Tipo `persona` para las bandas: sus campos (rol, instrumento, biografía) no
describen a un grupo. Un cuarto artículo "puerta": `RES-47` no ficha "bandas ricoteras"
como categoría —es el nombre que usó el usuario—, y `la-separacion` ya hace ese trabajo sin
pagar otro artículo.

### 2. El nombre, para que quien busca por el nombre que circula igual la encuentre

Los nombres se escriben como los fijó `RES-47`: *Indio Solari y los Fundamentalistas del Aire
Acondicionado* (con "Solari"), *Skay y los Fakires*, *Los Decoradores*. "La Kermesse Redonda"
es el caso difícil: es el nombre que circula y el que buena parte de la prensa todavía usa,
pero **no es la razón social**. Es el formato de gira (feria y música) y el nombre con el que
el grupo empezó a presentarse en 2018.

- **El título lleva los dos:** *Los Decoradores (La Kermesse Redonda)*. La portada no recorta
  los títulos, así que el buscador del navegador la encuentra por cualquiera de los dos.
- **El resumen dice los dos en sus primeros 150 caracteres**, que es lo que la portada
  muestra, y dice cuál es cuál sin corregir a nadie: el nombre de la banda y el nombre del
  formato.
- **`la-separacion` los nombra a los dos** en su segmento nuevo (§3), y `semilla-bucciarelli`
  también.
- Una ruta `/redondopedia/la-kermesse-redonda/` que redirija sería un lujo y es código: no la
  pido. Si `arquitectura` la ve gratis, es bienvenida.

En `skay-y-los-fakires` los nombres anteriores (*Skay y los Seguidores de la Diosa Kali*,
2007–2012) van en el cuerpo y en `datos`, no en el título: el vigente desde 2012 es el que
la gente busca.

### 3. Cómo se enlazan

Todo en `cuerpo` o en `veaTambien`: un `[[slug|texto]]` dentro del `valor` de un dato se
imprime como texto crudo y no cuenta como enlace.

| Desde | Hacia | Qué cambia en el artículo existente |
|---|---|---|
| `la-separacion` | los tres | **Un segmento nuevo, la puerta:** nombra las tres con su nombre verificado, una línea cada una, y dice la diferencia de clase (dos bandas de los fundadores, un proyecto de acompañantes). `hecho`, `RES-47` |
| `indio-solari` | `los-fundamentalistas` | El texto plano "Los Fundamentalistas del Aire Acondicionado" del último segmento pasa a ser enlace. Como mucho una oración nueva: banda propia desde 2004 |
| `skay-beilinson` | `skay-y-los-fakires` | Un segmento corto, dos oraciones como máximo, y el enlace |
| `muerte-del-indio` | `los-fundamentalistas` | **Solo** se envuelve en enlace el nombre que ya está en el cuerpo. Ni una palabra más: es de tono grave (`SLUGS_GRAVES`) y no se reescribe por un enlace |
| `semilla-bucciarelli` | `los-decoradores` | Una oración y el enlace. `hecho`, `RES-47` |

Salientes de los nuevos, además del mínimo de `BR-09`: `los-fundamentalistas` →
`indio-solari`, `la-separacion`, `muerte-del-indio`, `los-decoradores` (Aramberri toca en las
dos); `skay-y-los-fakires` → `skay-beilinson`, `la-separacion`, `los-fundamentalistas`;
`los-decoradores` → `semilla-bucciarelli`, `la-separacion`, `los-fundamentalistas`, `gulp` y
`oktubre` (Tito Fargo tocó en los dos primeros discos, `RES-47`).

**Cada dato vive en un solo artículo.** Discos, formaciones y estado, en el de la banda; la
persona enlaza y no los repite. Corregir una fecha es corregir un lugar.

**Cada artículo entra con su enlace entrante en la misma tanda.** Si entra uno solo,
`npm test` tiene que seguir en verde (`BR-09`: cero huérfanos); el enlace de `la-separacion`
o de la persona va junto, no después.

### 4. El mínimo de cada artículo (reemplaza, para estos tres, la fila `concepto` de `BR-07`)

Seis campos, ninguno en placeholder:

1. **Título con el nombre verificado** (§2) y **resumen** que se entiende sin leer el resto
   (criterio 1 de `US-05`).
2. **Qué es**: la clase de banda y su vínculo con Patricio Rey, en una o dos oraciones del
   cuerpo. "Banda propia de uno de los dos fundadores", o "proyecto de músicos de
   acompañamiento". `hecho`, `RES-47`.
3. **Quiénes**: los integrantes, con el rótulo que `BR-35` §1 fija para cada caso.
4. **Discos**, como líneas de `datos` con su año (§5 explica por qué no son artículos). Para
   `los-decoradores`, la frase "no se encontraron discos propios": `RES-47` dice "no
   encontrado", no "confirmado que no existe".
5. **Estado**, con fecha de consulta (`BR-35` §2).
6. **Enlaces** de §3, con una oración que ate el artículo a `la-separacion`.

Y dos específicos. `skay-y-los-fakires` cuenta las **tres etapas de nombre** con sus años y
agrupa los discos por etapa. `los-decoradores` cuenta **los dos nombres** (§2) y el año de
formación según `BR-35` §1.

### 5. Lo que no entra, y por qué es regla

- **Los discos de estas bandas no son artículos `disco`.** No es una preferencia:
  `discosDeOktubre()` (`src/lib/sitio/oktubre.ts`) cuenta como total **todo** artículo de
  tipo `disco`, y el afiche de octubre (`D-49`, hoy en el portal) dice *"De los diez discos,
  seis salieron en octubre"*. Un disco de los Fundamentalistas cargado como `disco` lo
  vuelve "de los 15" y le marca error al que se sabe cuántos hizo Patricio Rey. El piso
  `disco = 10` son los de la banda madre.
- **Ni tracklists, ni versos, ni artículos `tema`** de estas bandas. Los 105 temas de
  `RES-20` son el universo de `tema`.
- **Ningún ítem de ningún juego sale de este material.** Es la regla de `BR-13` §3, que decía
  `US-01`..`US-04` porque eran los juegos que había; rige **para todos**, incluido `US-10`
  ("Más o menos"). Hay un enganche vivo que lo vuelve urgente: `ESTADO.md` deja
  `RES-106`..`RES-139` libres "por si se quiere una segunda ronda de números (las tres
  bandas de después de la separación, `RES-47`)". **Esa ronda necesita una `BR-XX` nueva y
  explícita antes de investigar nada**; no es un efecto colateral de que estos artículos
  existan.
- **Una leyenda inventada.** `RES-47` no trae ninguna; el artículo no la fabrica para
  parecer completo (`BR-14`, punto 4).

### 6. Criterio de aceptación

- **Given** los tres artículos cargados, con sus enlaces entrantes.
- **When** se corre `npm test` y el script de abajo.
- **Then** `npm test` sale verde (grafo de `BR-09`: cero huérfanos y cero callejones; `hecho`
  con ficha `RES-` de `BR-08`); el script imprime `ok` en las cinco filas de enlaces de §3
  (siete aristas), `total 38`, `concepto 7`, `disco 10`, y para cada slug el tipo y el
  título de §1; y los primeros 150 caracteres del resumen de `los-decoradores` contienen
  "Decoradores" y "Kermesse".
- **Y** el diff de `muerte-del-indio` es solo el envoltorio de enlace sobre el nombre que ya
  estaba.

```
node --input-type=module -e "import {readFileSync as L} from 'node:fs'; const A=JSON.parse(L('src/data/redondopedia.json','utf8')).articulos; const P=Object.fromEntries(A.map(a=>[a.slug,a])); const cita=(d,h)=>JSON.stringify(P[d]?.cuerpo??[]).includes('[['+h+'|'); for (const [d,h] of [['la-separacion','los-fundamentalistas'],['la-separacion','skay-y-los-fakires'],['la-separacion','los-decoradores'],['indio-solari','los-fundamentalistas'],['skay-beilinson','skay-y-los-fakires'],['muerte-del-indio','los-fundamentalistas'],['semilla-bucciarelli','los-decoradores']]) console.log(cita(d,h)?'ok   ':'FALTA', d, '->', h); console.log('total', A.length, '| concepto', A.filter(a=>a.tipo==='concepto').length, '| disco', A.filter(a=>a.tipo==='disco').length); for (const s of ['los-fundamentalistas','skay-y-los-fakires','los-decoradores']) console.log(s, '|', P[s]?.tipo, '|', P[s]?.titulo, '|', (P[s]?.resumen??'').slice(0,150))"
```

**Verificación:** el script no lo corrí —`producto` no tiene `Bash` (`D-12`)—; lo corre
`revisor`, `orquestador` o el hilo principal. Si el hilo principal prefiere que lo cuide la
máquina, son tres `assert` en `redondopedia.test.ts` (los tres slugs existen y son
`concepto`; las siete aristas; `disco` sigue en 10). Esa edición es suya, no mía.

**Trazabilidad:** pedido del usuario del 2026-08-21 y del 2026-10-01; `RES-47`; `BR-07`,
`BR-09`, `BR-11`; `BR-13` (enmendada); riesgos 1, 3 y 4 del brief; `D-14`, `D-20`, `D-49`.

### Lo que queda para otros roles (no lo decido)

- `experiencia`: si `los-fundamentalistas` entra a `SLUGS_GRAVES`
  (`src/lib/sitio/graves.ts`), que apaga el recorte de tapa y la capitular. Mi lectura: no;
  es una banda viva y solo un segmento es grave (`BR-35` §3). La pantalla es suya. Y la
  etiqueta cruda "concepto" sobre el título (§1).
- `arquitectura`: el contrato formal de la Redondopedia sigue debido. Si llega, el enum de
  tipos debería quedar en un solo lugar y no en cuatro.

---

## BR-35 — Qué dicen los tres artículos de banda, con qué rótulo, y cómo se trata la muerte del Indio

**Aplica a:** `los-fundamentalistas`, `skay-y-los-fakires` y `los-decoradores` (`BR-34`).
Extiende `BR-08` a los casos que `RES-47` deja abiertos. La muerte del Indio dentro del
artículo de los Fundamentalistas cae bajo `CNT-04` (tono sobrio), `CNT-06` (la vara para
prosa) y el registro 3 de `.claude/rules/voz-ricotera.md` (§5 y §6).

### 1. Qué rótulo lleva cada clase de dato

| Dato | Rótulo y tratamiento |
|---|---|
| Nombres, años de formación y de cada etapa de nombre, discos con su año, los integrantes que `RES-47` marca **verificado** | `hecho`, `RES-47` |
| Año de formación de `los-decoradores`: 2016 (Wikipedia, ellitoral) contra 2015 (ciudad.com.ar, "cumple 10 años") | Las **dos versiones en paralelo**, cada una con su fuente (criterio 5 de `US-05`). No se promedia ni se elige. Que "Kermesse Redonda" se adoptó en 2018 sí es `hecho` |
| Integrantes de `skay-y-los-fakires`, la nómina de 2012 y la vigente: `RES-47` los marca **no verificados**, con dos notas que se contradicen y una que ya erró un año | **No entran como `hecho`.** El artículo dice lo único firme —que es la banda de Skay— y dice que la nómina no está cerrada en las fuentes. Si quiere nombrar a alguien, `leyenda` con el texto "una nota de prensa dice..., sin confirmar" (precedente: el segundo segmento de `muerte-del-indio`) |
| "Los Fakires ya existía en 1997" (una sola nota, sin corroborar) | **No entra.** `RES-47` lo marca probable error; no circula entre fans, es el desliz de una fuente |
| Las inferencias que `RES-47` rotula "mía": que la banda del Indio "sigue en actividad como homenaje" y que él "ya participaba solo virtualmente" | **No entran como `hecho`.** Son de `investigador` y no están fichadas |
| La frase de la cobertura de 2026 sobre mantener viva "la llama" | **No se le atribuye a la banda.** `RES-47`: dato cultural, no verificado como cita suya |
| Lo que se cuenta entre fans sobre estas bandas | `RES-47` no trae nada. El artículo no inventa una leyenda; si le parece que falta, lo dice (`BR-14`, punto 4) |

### 2. Estado y vigencia

- **El campo "Estado" es obligatorio y lleva fecha:** *"En actividad al 22 de agosto de 2026
  (`RES-47`)"*, nunca "sigue en actividad" a secas. Es un dato que caduca y quien lee tiene
  que ver hasta cuándo vale.
- **Lo anunciado no ocurrió.** El show de los Fundamentalistas en Tucumán para el 10 de
  octubre de 2026 es una fecha reportada; al 2026-10-01 es futura. Entra como "anunciado" o
  no entra, y nadie lo escribe en pasado sin ficha nueva. Vale para cualquier fecha posterior
  al 22 de agosto.
- **"No se encontró anuncio de disolución" es lo que se sabe**, y así se dice. No se
  convierte en "no se disolvió".
- Si `contenido` quiere cerrar lo abierto (2015 o 2016, la nómina de Skay, lo posterior al 10
  de octubre), pide ficha nueva a `investigador`. **Nada de eso bloquea la entrada:** se
  publica con la duda declarada, que es la regla de `D-14`.

### 3. La muerte del Indio dentro de `los-fundamentalistas`

1. **Registro 3 en los segmentos que tocan la muerte y el homenaje:** seco, sin imagen, sin
   chiste, sin jerga, sin suspensivos, sin guiño (`voz-ricotera` §5). El resto del artículo
   —la formación, los discos, la historia de la banda— va en registro 2. Las dos voces
   conviven en el mismo artículo y se nota dónde cambia una por otra.
2. **La muerte se cuenta una sola vez en el sitio, y es en `muerte-del-indio`.** Este
   artículo dice la fecha (5 de junio de 2026, `hecho`, `RES-04`), enlaza, y no repite las
   circunstancias: ni la causa ni el lugar, que ese artículo ya rotuló como versiones de
   prensa sin verificar.
3. **Qué sí dice, como `hecho` con `RES-47`:** el show que la banda tenía programado para el 6
   de junio de 2026 en Comodoro Rivadavia se hizo, se transmitió en vivo y se convirtió en
   homenaje. La última aparición del Indio por video ya está en `muerte-del-indio`
   (`RES-04`): se enlaza, no se copia.
4. **La cita de la banda** (*"no va a ser el concierto que habíamos pensado..."*, nota de
   MDZ) **no puede ir como `testimonio`**: `testimonio` es lo que contó alguien con nombre y
   apellido (`D-14`; `voz-ricotera` §1) y la ficha no dice quién lo dijo. Si entra, entra
   textual y como `hecho` de que la banda lo dijo, con su fuente. Que entre o no lo decide
   `contenido`; con la fecha y el homenaje alcanza.
5. **Lo que el artículo no hace:** ninguna frase en nombre del Indio ni de la banda fuera de
   cita (el sitio no habla por ellos, `voz-ricotera` §1); no narra la emoción de nadie
   —"lágrimas, abrazos y ovación" es el título de una nota, no un dato—; ningún lenguaje de
   cierre (la vara de Olavarría en `CNT-06`: ni "despedida perfecta" ni "el telón"); no
   especula con lo que la banda hace ahora ni la presenta como continuidad del Indio.
6. **Olavarría no se cuenta acá.** Si hace falta nombrarlo, un enlace a `olavarria-2017` y
   nada más.
7. **Ni `skay-y-los-fakires` ni `los-decoradores` cuentan la muerte del Indio.** `RES-47` no
   los cruza con `RES-04`.

### 4. Criterio de aceptación

- **Given** los tres artículos cargados.
- **When** `revisor` los lee contra `RES-47`, `RES-04`, `BR-08` y esta regla.
- **Then**:
  - cada nombre aparece como en `BR-34` §1 y §2, y el resumen de `los-decoradores` dice cuál
    es el de la banda y cuál el del formato;
  - los dos años de `los-decoradores` están, cada uno con su fuente, y "1997" no aparece en
    ninguno de los tres;
  - ninguna lista de integrantes de `skay-y-los-fakires` va rotulada `hecho`, y el texto
    dice que la nómina no está cerrada;
  - cada artículo tiene "Estado" con fecha de consulta, y el 10 de octubre de 2026, si
    aparece, está como anunciado;
  - en `los-fundamentalistas`, los segmentos de la muerte y el homenaje cumplen los siete
    puntos de §3; en particular, ninguno es `testimonio`, ninguno trae jerga, suspensivos ni
    adjetivo de emoción, y ninguno repite causa ni lugar de la muerte.

**Verificación:** `npm test` cubre la forma (`hecho` con ficha `RES-`, `testimonio` con
`quien`). Lo demás es lectura de `revisor`, como `BR-10` y `BR-12`; no hay comando para el
tono.

**Trazabilidad:** `RES-47`, `RES-04`; `BR-08`, `BR-10`, `BR-14`; `CNT-04`, `CNT-06`;
`voz-ricotera` §1, §5, §6; `D-14`; riesgo 3 del brief (el peligro no es usar lo dudoso, es
no decir que lo es) y criterio no negociable 1.

---

## Qué promesa de sesión hace la Redondopedia (y cuál no)

**No promete cierre en 2-3 minutos.** Es explícitamente **otro modo de uso** que el de
partida corta (`D-20`, consecuencias) — no hay resultado que compartir ni ronda que
terminar, así que medirla contra el pacing de `US-01`..`US-04` no tiene sentido.

**Lo que sí promete:**
- **Se entra y se sale en cualquier momento sin perder nada.** No hay partida que cerrar
  acá, así que no existe el riesgo de "dejarla a mitad" que sí existe en un juego.
- **El resumen de cada artículo (campo mínimo de `BR-07`) se sostiene solo**, para el que
  entra, lee un párrafo en la espera de un colectivo, y se va sin haber terminado nada.
- **De los tres criterios no negociables de `D-09`, dos aplican tal cual y uno no aplica.**
  "Sin muro de entrada" aplica entero: leer la Redondopedia no pide cuenta, login ni saber
  lo suficiente. "Ningún dato falso" aplica vía `BR-08`. "Jugable con el pulgar" no aplica
  literalmente —no hay mecánica que tocar—, pero sí su equivalente de lectura: legible con
  el pulgar, misma zona de alcance y mismo contraste AA que rige el resto del sitio
  (dueño `experiencia`, extiende `UX-01`).

---

## Fuera de alcance explícito

- **Edición por visitantes.** `D-20` lo deja para el futuro por nombre (cláusula 5). No es
  un olvido de esta historia, es una decisión ya tomada por otro documento.
- **Cuentas de usuario y login para editar o comentar.** Choca de frente con "abrir los
  molinetes" (`D-14`) — una cuenta de editor es un molinete igual que una de jugador.
- **Comentarios o cualquier superficie de interacción social.** No estaba en el brief
  original y `D-20` no lo agrega.
- **Buscador con backend.** Contradice `D-02`/`D-15` (sin backend, salida estática). Un
  buscador puramente estático del lado del cliente (sin servidor) no está decidido ni
  descartado por este documento — si alguien lo quiere para un ciclo futuro, es propuesta
  nueva de `experiencia`/`arquitectura`, no una consecuencia de `US-05`.
- **Cuándo arranca la vía de contribución de la gente.** `D-20` ya fijó que, cuando se
  discuta, arranca en esa decisión y con dos restricciones puestas: sin backend y sin
  cuentas — la vía natural es el repo público en GitHub o un buzón de sugerencias, nunca
  un login. Repetirlo acá sería reescribir algo que ya está escrito.

---

## Dependencias con otros roles

- **`arquitectura`** debe el contrato de la colección de artículos (formato de archivo,
  convención de slugs y enlaces internos, y sobre todo: el schema tiene que soportar
  rótulo **por afirmación dentro del cuerpo** y no un campo único como el del quiz —
  `BR-08` lo exige). También debe el script que verifica `BR-09` (huérfanos, callejones,
  alcanzabilidad desde portada) para que alguien con `Bash` lo corra (`D-12`). Propuesta
  concreta dejada en
  `Docs/SUGERENCIAS/PRD-para-arquitectura-contrato-redondopedia.md`.
- **`experiencia`** debe el patrón de navegación móvil de lectura larga (ya asignado por
  `D-20`), el mecanismo visual del rótulo granular de `BR-08`, y el mecanismo de "leé más"
  / "volver a jugar" que exige `US-05` criterio 4, todo dentro de la mezcla de discos de
  `D-19` (portada, historia, mitología, letras, discos ya tienen disco asignado en la
  hoja 05 del sistema de marca — la Redondopedia hereda ese mapa, no necesita uno nuevo).
- **`contenido`** debe relacer `CNT-04` con la vara de `BR-10` antes de escribir los
  artículos de Bulacio y Olavarría, y escribir el primer lote de 38 bajo `CNT-02` (tono) y
  `D-13` (fuente y mitigaciones para las letras de `tema`, cuando haya). Para los 6 `tema`:
  `BR-14` fija que no hacen falta versos y qué campos son obligatorios en su lugar; `BR-12`
  sigue rigiendo el tope y el criterio de análisis para cuando sí se cite alguno. Para las
  bandas de después de la separación: tres artículos `concepto` con el nombre correcto de
  `RES-47` y los cinco cambios de enlace en artículos existentes (`BR-34` §1 a §4), con el
  rotulado y el tratamiento de la muerte del Indio de `BR-35`. El orden en que se escriben,
  como el resto del lote, es de `contenido`/`orquestador`; recomiendo `los-fundamentalistas`
  primero (es el que ya tiene dos enlaces esperándolo en texto plano) y entrar cada artículo
  con su enlace entrante en la misma tanda.
- **`investigador`** no tiene pendiente nuevo para el primer lote (`D-20` cláusula 4: sale
  de lo que ya existe). Si al escribir aparece un hueco de hecho puntual para una
  biografía o un hito, es ficha `RES-XX` nueva, a pedido de `contenido`.

## PENDIENTE

- **El schema/formato de archivo de cada artículo.** Dueño: `arquitectura`. Propuesta en
  `Docs/SUGERENCIAS/PRD-para-arquitectura-contrato-redondopedia.md`.
- **El mecanismo visual del rótulo granular en prosa** (`BR-08`) y el patrón de
  navegación móvil de lectura larga. Dueño: `experiencia`.
- **La relectura de `CNT-04` para Bulacio y Olavarría en prosa** (`BR-10`), de la que
  depende si el piso de `hito` queda en 7 o baja a 6. Dueño: `contenido`.
- **El orden real de qué se escribe primero de los 38.** Dueño: `contenido` /
  `orquestador`, con la recomendación de reutilizar insumo de `US-02`/`US-03` cuando
  exista.
- **Los tres artículos de banda, los cinco cambios de enlace y las tres líneas de test
  opcionales** (`BR-34`, `BR-35`). Dueños: `contenido` escribe; el hilo principal sube los
  `assert` si los quiere. Es lo único que separa a la Redondopedia de 38/38 (hoy 35/38).
- **Si `los-fundamentalistas` es de tono grave para la pantalla y qué hacer con la etiqueta
  "concepto" sobre el título** (`BR-34`, "Lo que queda para otros roles"). Dueño:
  `experiencia`. No bloquea.
- **La secuencia entre este frente y lo que falta de la v1.** No la fijo acá a propósito
  — `D-20` cláusula 1 dice que no compite con el "Listo" de los cuatro juegos, y `/ciclo`
  corta el orden real.
