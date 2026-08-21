# PRD — Redondopedia: la enciclopedia ricotera navegable

> Rol dueño: `producto`. Consume `D-20` (el mandato, léase primero), `D-05` (los cuatro
> juegos y su orden de corte — este frente no los toca), `D-02` y `D-15` (estático, sin
> backend), `D-09` (los tres criterios no negociables), `D-12` (quien escribe no verifica),
> `D-13` (letras de fans con mitigaciones), `D-14` (la postura: molinetes abiertos, rotulado
> hecho/leyenda/testimonio), `D-19` (cada pantalla viste un disco), `D-04` (tapas reales en
> baja resolución con crédito). Consume además `Docs/CONTENIDO/CNT-04-limite-editorial-muertes.md`
> (sin editarla) y las fichas `RES-02`, `RES-04`, `RES-05`, `RES-06`, `RES-07`, `RES-08`,
> `RES-09`, `RES-20`, `RES-21`, `RES-22`, `RES-23`, `RES-31`, `RES-33`, `RES-36` como
> inventario de insumo disponible para el primer lote (`D-20`, cláusula 4).
>
> Produce: `US-05`, `BR-07`..`BR-11`.
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
- **When** tiene menos de 35 artículos publicados repartidos según la tabla de piso de
  abajo.
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
| `tema` | Una canción | Título, disco de pertenencia (enlace obligatorio), año, autoría real (`RES-20` — la mayoría Solari–Beilinson, dos con tercer autor), letra completa con la fuente citada (`D-13`: letras.com o bestiarioredondo) y una marca de si fue cruzada contra los 105 temas de `RES-20` y/o confirmada de oído, notas de contexto si hay leyenda asociada |
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

## Piso de ítems — 35 artículos

| Tipo | Piso | Insumo ya fichado | Costo dominante |
|---|---|---|---|
| `disco` | 10 | Los 10 discos completos, `RES-02` + `RES-20` | Bajo — datos ya armados, falta prosa de enlace |
| `persona` | 5 | Indio, Skay, Poli, Semilla, Rocambole — `RES-06`, `RES-09`, `RES-22` | Medio — biografía nueva en prosa |
| `hito`/`caso` | 7 | Formación, debut en Obras (89), Huracán 93-94, separación, muerte del Indio, Bulacio, Olavarría — `RES-04`, `RES-05`, `RES-07` | Medio-alto — 2 de los 7 esperan `BR-10` |
| `concepto` | 4 | Misa ricotera, aguante, autogestión, difusión sin TV — `RES-07` | Bajo |
| `leyenda` | 3 | "Ji Ji Ji" desmentida, Patricio Rey como persona real — `RES-08`, `RES-22` | Bajo — ya vienen rotuladas |
| `tema` | 6 | Los que ya tienen insumo rico fichado (mitología, autoría, contexto) — `RES-08`, `RES-20`, `RES-22` | Alto — letra completa, cruce obligatorio de `D-13` |
| **Total** | **35** | | |

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
tres listas están vacías sobre el conjunto completo de los 35 artículos — no se verifica
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

1. **`tema` (letras completas) cae primero.** Es el tipo más caro —transcripción completa
   más el cruce obligatorio contra los 105 temas de `RES-20`— y el de mayor exposición: más
   versos expuestos que los ~30 que necesita el juego (`D-20`, consecuencias).
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
  artículos de Bulacio y Olavarría, y escribir el primer lote de 35 bajo `CNT-02` (tono) y
  `D-13` (fuente y mitigaciones para las letras de `tema`).
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
- **El orden real de qué se escribe primero de los 35.** Dueño: `contenido` /
  `orquestador`, con la recomendación de reutilizar insumo de `US-02`/`US-03` cuando
  exista.
- **La secuencia entre este frente y lo que falta de la v1.** No la fijo acá a propósito
  — `D-20` cláusula 1 dice que no compite con el "Listo" de los cuatro juegos, y `/ciclo`
  corta el orden real.
