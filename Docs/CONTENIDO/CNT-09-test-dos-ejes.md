# CNT-09 — El banco del test de dos ejes

- **Fecha:** 2026-08-24. Primera versión en `T-121`, ciclo 8. Rehechura estructural en
  `T-126`. **Ráfaga acotada en `T-127`, sobre una segunda revisión adversarial del banco
  ya rehecho.**
- **Estado T-126 (para referencia histórica):** reescrito entero, sobre el cierre anterior
  de `T-121`. **No fue una corrección de texto: fue una rehechura estructural.** `revisor`
  encontró tres fallas en `T-121`; una segunda pasada, con el encargo explícito de romper
  el banco, encontró que el problema era de fondo — los cuatro cuadrantes hablaban de una
  sola cosa (puntualidad) en vez de dos, el eje `luz-oscuridad` medía cuatro constructos
  distintos según qué ítem te tocara, y el polo `orden` nunca pagaba un costo.
- **Estado `T-127` (esta entrega):** la rehechura de `T-126` valió lo que costó — la
  estructura no se toca. Lo que faltaba, y que esta ráfaga corrige puntual: (1) el eje
  `luz-oscuridad` quedó asimétrico —solo 2 de 10 opciones de `oscuridad` eran algo que
  alguien elige *hacer*, las otras 8 eran variantes de *no hacer* lo que hace `luz`—; (2)
  tres ítems medían un constructo que no era el del eje declarado; (3) cuatro de los cinco
  ítems nuevos de `T-126` (que nadie había revisado todavía) tenían un problema serio cada
  uno; (4) dos de los cuatro nombres de cuadrante tenían un problema de connotación o de
  construcción gramatical; (5) quedaban dos residuos de género. Detalle completo más
  abajo, sección **"`T-127` — ráfaga acotada"**.
- **Gate de** `T-123` (el juego construido) y `T-124` (`revisor`).
- **Consume:** `Docs/PRODUCTO/PRD-alcance-v1.md` (`US-06`, `BR-17`), `Docs/ARQ/ARQ-schema-
  dos-ejes.md` (`CTR-08`), `Docs/UX/UX-06-test-dos-ejes.md` (§5 y §7, presupuestos),
  `.claude/rules/voz-ricotera.md`, `.claude/rules/contenido-json.md`.
- **Produce:** `src/data/dos-ejes.json` — 20 ítems `estado: "listo"` (`EJ-002`, `EJ-004`,
  `EJ-007`, `EJ-008`, `EJ-010`, `EJ-012`..`EJ-015`, `EJ-017`, `EJ-018`, `EJ-020`..`EJ-028`),
  8 ítems `estado: "retirado"` que se quedan en el archivo sin reciclar su número (`EJ-001`,
  `EJ-003`, `EJ-005`, `EJ-006`, `EJ-009`, `EJ-011`, `EJ-016`, `EJ-019`), y 4 cuadrantes
  (`CU-1`..`CU-4`) con tres nombres nuevos (`T-127`) y dos bajadas reescritas.

## Qué es este banco y qué NO es

Sigue en pie de la versión anterior: no hay una sola afirmación sobre la banda en las 20
preguntas, nada necesita ficha `RES-XX` (`CTR-08.5` regla 5), cada pregunta es una escena
chica y cotidiana que cualquiera puede resolver con lo primero que le sale.

---

## `T-127` — ráfaga acotada

No se toca la estructura de `T-126`: los cuatro nombres siguen codificando los dos ejes,
la definición de una línea de `luz-oscuridad` sigue siendo la vara, y `CU-2` sigue sin
tocarse porque estaba bien. Esto es lo que cambió.

### 1. La asimetría que se había mudado de eje

En `luz-oscuridad`, ocho de las diez opciones de `oscuridad` eran variantes de *no hacer*
lo que hace `luz` (esperar, apurar el paso, guardarse algo, quedarse en casa, quedarse
pensando, preferir enterarse después, seguir camino, ponerse los auriculares) contra solo
dos que eran una acción elegida (`EJ-004`, `EJ-008`). Reescribí el lado `oscuridad` de seis
ítems con el molde de `EJ-008` — una acción concreta que alguien elige hacer, no la ausencia
de la acción de `luz`:

| Id | Antes | Ahora |
|---|---|---|
| `EJ-002` | Prendo el celular y espero | Prendo velas y sigo leyendo |
| `EJ-007` | En casa, con algo rico | En pijama, con algo rico |
| `EJ-010` | Me quedo pensando, para mí | Anoto todo en un cuaderno |
| `EJ-021` | Prefiero enterarme después | Preparo mi regalo aparte |
| `EJ-022` | Sigo camino, nadie me ubica | Aprovecho y camino tranquilo |
| `EJ-023` | Me pongo los auriculares | Me pongo música y canto |

Los dos ítems que ya tenían el molde correcto (`EJ-004`, `EJ-008`) no se tocaron. Con este
lote, los diez ítems del eje ofrecen algo que alguien elige hacer en los dos polos, no un
hacer contra un no-hacer.

### 2. Tres ítems que medían otro constructo — retirados, reemplazados

- **`EJ-005`** (la plata tirada): "compro para compartir" contra "me lo guardo para mí" es
  generoso contra amarrete, no compañía contra soledad. Retirado. **`EJ-027`** lo reemplaza:
  encontrar una playa vacía y hermosa, avisar a todos y volver contra volver solo a
  disfrutarla — mismo hallazgo, sin plata de por medio.
- **`EJ-003`** (el perro): "apuro el paso" no es una manera de ser para quien le tiene miedo
  a los perros, es lo único que puede hacer — condición, no temperamento, el mismo defecto
  que ya había sacado a `EJ-006`. Retirado. **`EJ-026`** lo reemplaza: se arma una ronda de
  mate en la plaza, sumarse contra quedarse con el propio libro.
- **`EJ-019`** (elegir peli, eje `orden-caos`): "sigo la charla sin apuro" es conducta de
  `luz` (quedarse con la gente), no de `orden-caos` — cruzaba de eje. Retirado. **`EJ-028`**
  lo reemplaza: se corta la calle de siempre para volver a casa, revisar el mapa y elegir
  contra doblar en la primera — una decisión individual, sin escena de grupo que confunda
  el eje.

### 3. Cuatro de los cinco ítems nuevos de `T-126` — corregidos

Nadie los había revisado todavía.

- **`EJ-021`** (fiesta sorpresa): la opción B decía "Prefiero enterarme después" de algo de
  lo que el enunciado ya avisaba que te habías enterado — contradicción, se elegía por
  descarte. Reescribí el enunciado para que la escena sea *antes* del hecho ("arman una
  sorpresa... y te suman al grupo") y la opción de `oscuridad` pasó a ser una acción propia
  ("preparo mi regalo aparte").
- **`EJ-022`** (sin batería): conservaba "nadie me ubica", la frase que hundió a `EJ-009`
  — el id se había retirado pero el problema no. Ahora dice "aprovecho y camino tranquilo":
  un plan propio, no un alivio por la desconexión.
- **`EJ-024`** (reunión importante): "reviso todo y llego tarde" le colgaba a `orden` el
  fracaso emblemático de `caos` (llegar tarde), y ninguna de las dos opciones se decía con
  orgullo. Ahora `orden` paga un costo propio: "reviso todo mil veces".
- **`EJ-025`** (la carrera): "cuando puedo" es disponibilidad, no carácter — para quien
  trabaja doble turno es la descripción de su vida, no una elección. Ahora dice "cuando
  tengo ganas", y el costo de `orden` quedó escrito en la opción misma ("aunque llueva"),
  no solo en este documento.

### 4. Tres de una palabra

- **`EJ-023`** (bondi): el enunciado ponía a alguien ya sentado al lado y la opción decía
  "charlo con quien se sienta" — dos tiempos de la misma escena. El enunciado ahora queda
  en el momento en que alguien se sienta.
- **`EJ-015`** (cambio de plan): "insisto con el plan original" traía costo, pero leído en
  voz alta deja al ordenado como el que le arruina el plan a todos. Ahora dice "sigo con lo
  que armé" — mismo costo (fricción con el cambio), sin la imposición sobre el resto.
- **`EJ-020`** (mandado): "compro lo que veo" cuando *te mandaron a comprar cosas puntuales*
  seguía leyéndose como no haber hecho el mandado. Ahora dice "compro todo sobre la
  marcha" — una manera de resolver el mandado, no de esquivarlo.

### 5. Dos nombres de cuadrante

- **`CU-4`** pasó de **"Tormenta sin agenda"** a **"Eclipse repentino"**: una tormenta es
  algo que le pasa a los demás; un eclipse oscurece de golpe y sin aviso, que es la imagen
  exacta de `oscuridad` + `caos`, sin desastre.
- **`CU-3`** pasó de **"Marea de horario"** a **"Luna llena"**: "marea" es, antes que nada,
  el presente de *marear*, y "Marea de horario" no es una construcción que exista en
  castellano. La luna llena ocurre con calendario (`orden`) y es nocturna (`oscuridad`),
  sin el riesgo de leerse como un verbo.
- **`CU-1`** pasó de **"Amanecer puntual"** a **"Estrella fija"**: un amanecer siempre es
  puntual, así que "puntual" no agregaba nada. Una estrella fija es luminosa (`luz`) y
  constante en su lugar (`orden`), sin la redundancia.
- Reescribí las bajadas de `CU-3` y `CU-4` de paso, para sacarles el vocabulario de terapia
  ("procesás", "tu espacio propio") que señaló la revisión, y para que dejen de solaparse
  entre sí: `CU-3` ahora se apoya en el horario ("cumplís solo", "antes de que alguien
  pregunte"); `CU-4` se apoya en lo repentino ("te agarra", "sin agenda y sin avisar").
- **La fila completa, para leer de un tirón:** Estrella fija · Cometa suelto · Luna llena ·
  Eclipse repentino. Cuatro fenómenos del cielo, ninguno un desastre, ninguno un verbo.

### 6. Dos residuos de género

`EJ-002` decía "la puerta del vecino" — pasó a "aviso a los vecinos" (además de resolver el
punto 1 de arriba). `EJ-021` decía "una sorpresa para un amigo" — pasó a "para alguien".

### La trampa aritmética, resuelta

Con `EJ-003`, `EJ-005` y `EJ-019` retirados y `EJ-026`, `EJ-027` y `EJ-028` cargados en la
misma entrega, el banco sigue en 10 + 10 sobre `estado: "listo"`, y ahora los diez ítems de
cada eje miden lo mismo, no cuatro de diez.

---

## La definición nueva del eje `luz-oscuridad`, en una línea

> **`luz` es la reacción que se abre hacia el otro — buscás compañía, contacto, lo
> compartís; `oscuridad` es la reacción que te guardás para vos — elegís estar con vos
> mismo, tu ritmo, tu silencio.**

Los diez ítems de abajo se leen contra esta única frase. Es, en la nomenclatura de la
tarea, el constructo de **extraversión/apertura** (uno de los cuatro que estaban
mezclados). Por qué este y no los otros tres:

- **Es el único que ya "ganaba" en el banco viejo sin que nadie lo forzara.** `EJ-007`
  (cumpleaños: mesa larga contra solo con algo rico) y `EJ-008` (tarde libre: llamo a
  alguien contra cierro la puerta) ya eran, con la redacción de `T-121`, preguntas de
  compañía-contra-soledad — y son justo los dos ítems que ninguna de las dos revisiones
  tocó. Elegir este constructo es reconocer lo que ya estaba funcionando, no imponer algo
  nuevo.
- **Optimismo/superstición** (viejos `EJ-001`, `EJ-005`, `EJ-006`) se cae solo: una
  creencia no es un temperamento, y `EJ-006` lo probaba (la opción de "mal augurio" no
  existe para quien no cree en la superstición).
- **Control/vigilancia** (viejos `EJ-009`, `EJ-010`) se cae por el motivo que marcó la
  tarea: for muchas personas mirar para atrás de noche no es una elección de carácter, es
  una condición.
- **Atracción por lo intenso** (viejos `EJ-002`, `EJ-004`) queda absorbido *adentro* de la
  definición elegida, no como eje propio: alguien que sale a mirar los rayos en vez de
  quedarse en la cama está, además de buscando intensidad, **eligiendo vivirlo solo** — y
  esa es la lectura que uso en `EJ-004`.

**Consecuencia práctica:** los diez ítems del eje ahora prueban la misma cosa. Un jugador
que en una partida contesta "compañía" cuatro de cinco veces cae en `luz` sin importar
*cuáles* cinco de los diez le tocaron — porque las diez miden exactamente lo mismo. Es lo
que el banco viejo no podía garantizar.

---

## Los diez ítems de `luz-oscuridad`, uno por uno

**Esta tabla documenta `T-126`.** Seis de estas filas se corrigieron de nuevo en `T-127`
(sección de arriba) — la fila queda como estaba para no perder el historial, pero el texto
vigente en `src/data/dos-ejes.json` es el de la sección `T-127`, no el de acá.

| Id | Qué pasó | Defecto que arregla |
|---|---|---|
| `EJ-001` | **Retirado.** Salir de un recital: las opciones no eran alternativas del mismo eje (una es ánimo, la otra es estado del cuerpo) y la lectura estaba invertida — salir hecho pomada certifica que estuviste hasta el final, no lo contrario. | El defecto más grave del lote: rompía la premisa de que las dos opciones son polos opuestos de una sola cosa. |
| `EJ-002` | **Reescrito entero, misma escena.** El corte de luz ya no se resuelve con "prendo una vela" / "ando a oscuras": ahora es "golpeo la puerta del vecino" (busca compañía) contra "prendo el celular y espero" (se queda con lo suyo). | Antes el ítem era el eje escrito con sus propias palabras (vela/oscuras). Ahora mide compañía-contra-soledad como los otros nueve, no el color literal de la escena. |
| `EJ-003` | **Una línea.** Saqué "lo miro fijo" (mirar fijo a un perro es intimidarlo, no reserva) y lo cambié por "apuro el paso y sigo". De paso saqué el "sigo solo" que hablaba en masculino. | Fija la asimetría de tono (una opción agresiva, la otra no) y el género. |
| `EJ-004` | **Una línea, con reencuadre.** La opción de `luz` pasó de "me tapo y sigo durmiendo" (no pasaba nada) a "busco compañía y me quedo" — ahora es una acción, y encaja en la definición nueva del eje (buscar a alguien contra vivirlo en soledad, mirando los rayos). | Le da acción a la opción de luz y la alinea con el constructo elegido en vez del descartado ("atracción por lo intenso" suelto). |
| `EJ-005` | **Reescrito entero.** Salió la moneda-con-suerte (superstición) y entró "encontrás plata: comprás algo para compartir" contra "te lo guardás para vos". | Sacaba una creencia mágica del medio y la reemplaza por compañía-contra-soledad, sin premiar la opción "racional" que no existía en el eje. |
| `EJ-006` | **Retirado.** El gato negro medía superstición, no temperamento: la respuesta real de quien no cree en augurios vive adentro de la opción "buena", no como opción propia. | Ninguna opción está disponible para todo el mundo — el vicio central de un test de identidad. |
| `EJ-007` | **Una línea.** Cambié "Solo, con algo rico" por "En casa, con algo rico" — mismo sentido (bajo perfil, sin gente), sin la marca de género. El resto queda intacto: es de los mejores del lote viejo. | Solo el barrido de género — la estructura ya estaba bien. |
| `EJ-008` | **Sin cambios.** Ya media compañía-contra-soledad con acciones concretas y sin género. | Ninguno: es uno de los dos ítems que confirmaron cuál era el constructo correcto. |
| `EJ-009` | **Retirado.** "Alivio, nadie me ubica" es la frase más compartible de las cuarenta contra "me pongo nervioso", la única opción hecha de una emoción incómoda — la B ganaba sin competir. | Las dos opciones tienen que poder decirse con el mismo orgullo (`CNT-09` viejo ya tenía ese criterio; acá se aplicó de verdad). |
| `EJ-010` | **Reescrito entero, otra escena.** Salió "volver caminando solo de noche, mirar atrás" — no es un temperamento, es una condición real para buena parte de la gente. Entró el insomnio: "te desvela algo, ¿escribís a alguien o te lo guardás?". Mantiene el tono nocturno sin la carga de seguridad personal. | Saca una pregunta que, para una parte del público, no tenía elección que hacer — y de paso saca los tres marcas de género que traía. |

**Los tres retiros** (`EJ-001`, `EJ-006`, `EJ-009`) se reemplazan por `EJ-021`, `EJ-022` y
`EJ-023` — ver más abajo.

---

## Los diez ítems de `orden-caos`, uno por uno

**Esta tabla también documenta `T-126`** — `EJ-015`, `EJ-019` y `EJ-020` cambiaron de
nuevo en `T-127` (`EJ-019` se retiró); ver la sección `T-127` de arriba para el estado
vigente.

El defecto de fondo, y cómo se corrige en conjunto: **de los diez ítems viejos, ninguna
opción de `orden` mostraba un costo**, mientras que cuatro de `caos` confesaban una falla
(ropa amontonada, planta seca, bolso a las corridas, lista perdida). Retiré uno de esos
cuatro (`EJ-016`), reescribí otro para sacarle el peso moral (`EJ-018`), reformulé un
tercero para no arrancar ya parado en el mundo del ordenado (`EJ-020`), y en los dos ítems
nuevos metí a propósito un costo real del lado de `orden` ("reviso todo y llego tarde",
"sigo un plan" contra la libertad de "salgo cuando puedo") — así el eje deja de leerse
como competencia-contra-descuido y pasa a ser dos maneras, cada una con su precio.

| Id | Qué pasó | Defecto que arregla |
|---|---|---|
| `EJ-011` | **Retirado.** "Te enterás de un recital, ¿revisás o salís ya?" — el ítem viejo lo defendía por tener "más sabor ricotero". Ese sabor es justo el problema: agregarle banda a una pregunta de temperamento la convierte en la credencial del fan de verdad, la línea que `BR-17` no deja cruzar. | Pertenencia disfrazada de temperamento. |
| `EJ-012` | **Sin cambios.** Señalado como limpio en las dos revisiones. | Ninguno. |
| `EJ-013` | **Una línea.** Saqué "corriendo" de la opción de caos ("la noche antes, corriendo" → "la noche antes, nomás") — era la palabra con la que el ordenado describe al otro, no una descripción neutral. | Saca el juicio de valor escondido en el adverbio. |
| `EJ-014` | **Sin cambios.** Limpio. | Ninguno. |
| `EJ-015` | **Reescrito entero, otra escena.** "¿Qué hacés el sábado que viene?" no era una escena, era el eje preguntado de frente. Ahora: "alguien te cambia el plan de golpe, ya armado" — `orden` responde "insisto con el plan original" (con costo: fricción, roce con el otro) y `caos` "me subo al cambio nuevo". | Reemplaza una pregunta directa por una escena, y le suma a `orden` su primer costo real del lote. |
| `EJ-016` | **Retirado.** Guardar la ropa, prolijo contra desprolijo literal — la opción de caos ("toda junta en el cajón") no describía una manera de guardar, describía no haberlo hecho: es el estado de fracaso de la tarea del enunciado, no una forma alternativa de hacerla. | El polo `caos` como incompetencia en vez de estilo. |
| `EJ-017` | **Sin cambios.** Señalado como el mejor del banco en la revisión anterior. | Ninguno. |
| `EJ-018` | **Reescrito, misma escena.** La planta seguía siendo el regalo, pero "la riego cuando me acuerdo" implicaba que se puede morir — le ponía peso moral a un solo lado. Ahora `caos` es "la riego según el momento": sigue siendo la opción sin horario fijo, pero no insinúa que la planta corre riesgo. | Saca la consecuencia trágica de un lado del eje. |
| `EJ-019` | **Una línea, con reencuadre.** Estaba en primera persona del plural ("votamos", "discutimos" — el grupo, no el jugador). Pasé el enunciado y las opciones a primera persona singular ("¿vos qué hacés?", "propongo y cierro rápido" / "sigo la charla sin apuro"). | El sujeto de la respuesta pasa a ser el jugador, no la barra. |
| `EJ-020` | **Reescrito, misma idea de fondo.** El enunciado arrancaba "perdiste la lista del súper" — una premisa que ya asume que el jugador hace listas, y deja al de caos sin nada que perder porque nunca tuvo lista. Ahora arranca neutral: "te mandan a comprar unas cosas, ¿cómo vas?". | La premisa deja de empezar adentro del mundo de uno solo de los dos polos. |

**Los dos retiros** (`EJ-011`, `EJ-016`) se reemplazan por `EJ-024` y `EJ-025`.

---

## Los ítems nuevos — cinco de `T-126`, tres de `T-127`

La última columna describe el texto **vigente hoy** (después de `T-127`), no el que entró
en `T-126` — los cinco primeros ya se habían corregido una vez, ver la sección `T-127` más
arriba para el detalle de qué cambió y por qué.

| Id | Eje | Reemplaza a | Por qué esta escena y no otra |
|---|---|---|---|
| `EJ-021` | luz-oscuridad | `EJ-006` (gato negro) | Arman una sorpresa para alguien y te suman al grupo: sumarse a armarla (compañía) contra preparar el regalo aparte (una acción propia, elegida) — sin creencia mágica de por medio y sin la contradicción de "enterarte después" de algo que el enunciado ya contaba. |
| `EJ-022` | luz-oscuridad | `EJ-009` (señal cortada) | Se queda sin batería lejos de casa: correr a buscar dónde cargar contra aprovechar y caminar tranquilo — dos acciones competentes y disfrutables, sin la frase "nadie me ubica" que había hundido a `EJ-009`. |
| `EJ-023` | luz-oscuridad | `EJ-001` (salida del recital) | Alguien se sienta al lado en el bondi: charlar contra ponerse música y cantar. Escena diurna, sin banda adentro, y la opción de `oscuridad` es una actividad propia, no solo aislarse. |
| `EJ-024` | orden-caos | `EJ-016` (guardar la ropa) | Prepararse para una reunión importante: revisar todo mil veces (el costo de `orden` es propio, no el fracaso de `caos`) contra salir como uno está. |
| `EJ-025` | orden-caos | `EJ-011` (recital esta noche) | Entrenar para una carrera: seguir el plan aunque llueva (el costo queda en el texto) contra correr cuando se tienen ganas (carácter, no disponibilidad) — mismo territorio que el ítem retirado, sin recital ni banda. |
| `EJ-026` | luz-oscuridad | `EJ-003` (el perro) | Se arma una ronda de mate en la plaza: sumarse contra quedarse con el propio libro — compañía activa contra soledad elegida con una actividad, sin la condición externa (miedo a los perros) que rompía `EJ-003`. |
| `EJ-027` | luz-oscuridad | `EJ-005` (la plata tirada) | Encontrar una playa vacía y hermosa: avisar a todos y volver contra volver solo a disfrutarla — mismo hallazgo que `EJ-005`, sin la lectura de generoso-contra-amarrete. |
| `EJ-028` | orden-caos | `EJ-019` (elegir peli) | Cortan la calle de siempre para volver a casa: revisar el mapa y elegir contra doblar en la primera — una decisión individual, sin la escena de grupo que hacía que `EJ-019` cruzara al eje `luz-oscuridad`. |

---

## El barrido de género — los seis marcas, resueltas

La tarea contó seis marcas de masculino genérico en `EJ-003`, `EJ-007`, `EJ-009` y
`EJ-010`. Las de `EJ-009` y `EJ-010` desaparecieron con el ítem (retirado uno, reescrito
el otro con escena nueva). Las de `EJ-003` ("sigo solo") y `EJ-007` ("Solo, con algo
rico") se resolvieron con el cambio de una palabra cada una, documentado en las tablas de
arriba. Repasé los 20 ítems finales (los 15 que siguen del lote viejo más los 5 nuevos) y
ninguna opción ni enunciado obliga al jugador a hablar como varón.

**`T-127` encontró dos más**, en ítems que `T-126` no había tocado por este motivo:
`EJ-002` ("la puerta del vecino") y `EJ-021` ("una sorpresa para un amigo") — los dos se
corrigieron a la vez que se resolvía el defecto de fondo de cada uno, sección `T-127` §1
y §3. Con esto no queda ningún residuo de género en las veintiocho filas del archivo,
`estado: "listo"` o `"retirado"`.

---

## Los cuatro cuadrantes — reescritos enteros

Los cuatro se rehacen, no se retocan. El defecto de conjunto que señaló la tarea era el
más grave de todo el lote: las cuatro bajadas viejas hablaban de **llegar e irse de un
lugar** — se diferenciaban solo por puntualidad, un solo eje, y la coordenada
`luz-oscuridad` casi no aparecía en el texto que la gente comparte.

**El criterio nuevo para las cuatro imágenes:** dejar el registro de "cargo" (`Guardián de
la llama`) y el de ave con lectura futbolera (`Cuervo`), y unificar los cuatro nombres
bajo un mismo campo semántico — **fenómenos naturales y del cielo** — que ya usaban bien
`Cometa suelto` y `Tormenta sin agenda`. Ningún nombre describe un rol ni una devoción;
los cuatro describen algo que pasa, no algo que se es para otros.

| Id | Eje 1 | Eje 2 | Nombre `T-121` | Nombre `T-126` | Nombre vigente (`T-127`) | Qué defecto arregla |
|---|---|---|---|---|---|---|
| `CU-1` | luz | orden | Guardián de la llama | Amanecer puntual | **Estrella fija** | `T-126` sacó la devoción y el elogio. `T-127` sacó la redundancia: un amanecer siempre es puntual, así que "puntual" no agregaba nada. Una estrella fija es luminosa (luz) y constante en su lugar (orden). |
| `CU-2` | luz | caos | Cometa suelto | Cometa suelto | **Cometa suelto** (sin cambios desde `T-126`) | La bajada de `T-126` ya no menciona un lugar ni una hora: sin planes, pero si se cruza con alguien se queda charlando horas — ahí están los dos ejes, no uno. Ninguna revisión encontró nada que tocar. |
| `CU-3` | oscuridad | orden | Cuervo puntual | Marea de horario | **Luna llena** | `T-126` sacó la lectura de hincha de San Lorenzo. `T-127` sacó "marea": es, antes que nada, el presente de *marear*, y "Marea de horario" no es una construcción que exista en castellano. La luna llena ocurre con calendario (orden) y es nocturna (oscuridad), sin el riesgo de leerse como un verbo. |
| `CU-4` | oscuridad | caos | Tormenta sin agenda | Tormenta sin agenda | **Eclipse repentino** | `T-126` corrigió la bajada (vivía puertas adentro, no "se nota cuando entrás"). `T-127` cambió el nombre: una tormenta es algo que le pasa a los demás; un eclipse oscurece de golpe y sin aviso — la imagen exacta de oscuridad + caos, sin desastre. |

**Prueba de la fila, hecha de nuevo en `T-127`:** leídos los cuatro nombres vigentes en
línea — estrella fija, cometa suelto, luna llena, eclipse repentino — son cuatro fenómenos
del mismo campo semántico (el cielo), ninguno es un cargo ni una virtud, ninguno describe
al otro como un paso peor, ninguno es ambiguo con un verbo de uso corriente (el motivo por
el que salió "marea"), y ninguno es tautológico (el motivo por el que salió "puntual").
Ninguno usa una palabra de la lista negra del schema.

**Prueba de los dos ejes, ítem por ítem:** las cuatro bajadas vigentes nombran, cada una,
algo de `orden`/`caos` (necesitar horario, no armar planes, cumplir un horario solo, algo
que agarra sin agenda) **y** algo de `luz`/`oscuridad` (contarlo, quedarse charlando,
resolverlo en silencio, guardárselo y masticarlo solo) — ninguna se queda solo en la
puntualidad, que era el defecto que hacía que "la mitad del test no se viera en lo que el
test devuelve". `T-127` de paso sacó de las bajadas de `CU-3` y `CU-4` el vocabulario de
terapia ("procesás", "tu espacio propio") que no es registro 2 — nadie lo dice en una
previa (`.claude/rules/voz-ricotera.md`).

**De paso, sobre el molde del ejemplo del contrato:** `CTR-08.4` usa "El que llega
temprano" con una bajada sobre el horario del lugar — el molde que se me había pegado en
`Guardián de la llama`. Los cuatro nombres nuevos no describen una hora de llegada.

---

## Los ids no se reciclan

`EJ-001`, `EJ-006`, `EJ-009`, `EJ-011` y `EJ-016` se retiraron en `T-126`. `T-127` sumó
tres más — `EJ-003`, `EJ-005` y `EJ-019` — por medir un constructo que no era el del eje
declarado (sección `T-127` §2). Los ocho quedan en `src/data/dos-ejes.json` con
`estado: "retirado"` y una `notaInterna` que dice por qué (campo que nunca se renderiza,
`CTR-08.3`). Ningún número viejo se reutiliza. Los ocho reemplazos entran como
`EJ-021`..`EJ-028`, siguiendo la numeración correlativa de `CTR-08.10` — `EJ-021`..`EJ-025`
en `T-126`, `EJ-026`..`EJ-028` en `T-127`. El piso de `US-06` (20 preguntas, 10 por eje) se
cuenta sobre `estado: "listo"` y sigue dando 10 + 10 en las dos entregas — cada retiro
entró con su reemplazo en la misma entrega, no después.

## Qué se mantiene de la nota anterior

- El criterio del método (cada par tiene que poder decirse en voz alta, en una previa, sin
  sonar a excusa ni a alarde) sigue siendo la vara para los ítems que no se tocaron. Es el
  mismo criterio que en `T-127` hizo caer a `EJ-024`/`EJ-025` originales: "reviso todo y
  llego tarde" y "cuando puedo" no se dicen con el mismo orgullo que su opuesto.
- La decisión de no usar la muerte del Indio como escena de este banco sigue en pie, con
  el mismo argumento: es registro 3 entero, y un test de dos botones es, por diseño,
  registro 1/2 liviano.
- Sigo dejando la duda a la vista en vez de esconderla: si alguno de los cuatro nombres
  vigentes —`Estrella fija`, `Cometa suelto`, `Luna llena`, `Eclipse repentino`— todavía
  le suena a alguien como jerarquía o como rol antes que como fenómeno, es el primer lugar
  por donde volvería a mirar.

---

## Presupuestos verificados (`UX-06` §7)

| Pieza | Presupuesto | Cumplido |
|---|---|---|
| Enunciado de cada pregunta | ≤ 14 palabras | Máximo real: 13 (`EJ-015`) |
| Cada opción | ≤ 5 palabras / ≤ 28 caracteres | Máximo real: 28 (`EJ-022` oscuridad, en el límite) |
| Nombre de cuadrante | ≤ 26 caracteres | Máximo real: 17 (`CU-4`, "Eclipse repentino") |
| Descripción de cuadrante | ≤ 36 palabras | Máximo real: 22 (`CU-3`) |

Recontado a mano en `T-127` sobre los 20 ítems `estado: "listo"` vigentes (no sobre los
retirados). Conteo hecho a mano, carácter por carácter, sin herramienta de ejecución
(`D-12`): pido que `revisor` lo recuente con script, igual que en el lote anterior.

## Verificación

No puedo correr nada (`D-12`). Quedan para el hilo principal o `revisor`, tal cual los
deja `CTR-08.9`:

```bash
# (1) El banco contra el contrato: un solo eje por item, dos polos opuestos, ningun
#     campo de mas, preguntasPorEje impar.
node --test src/lib/esquemas.test.ts

# (2) Las invariantes de conjunto: piso de 20 (10+10) sobre estado "listo", cuadrantes
#     cubiertos, empate imposible y los cuatro cuadrantes alcanzables. Comando completo
#     en CTR-08.9, Docs/ARQ/ARQ-schema-dos-ejes.md. Los 8 items "retirado" no cuentan
#     para el piso — confirmar que el comando los filtra y que el total sigue dando 10+10.
node -e "..." # ver el bloque exacto en CTR-08.9
```

Pido además que `revisor` relea específicamente los cuatro cuadrantes y los diez ítems de
`luz-oscuridad` contra la definición de una línea que abre este documento — es el criterio
nuevo contra el que hay que leer todo lo demás. Y que confirme, con el molde de `EJ-008`
en la mano, que las seis opciones de `oscuridad` reescritas en `T-127` (§1 de la sección
`T-127`) son de verdad una acción que alguien elige, no una variante más prolija de "no
hacer lo que hace `luz`".

---

## Nota para `producto`, no para mí — el banco no tiene ni un rastro de la banda

Esto no lo resuelvo yo: lo dejo escrito para que `producto` lo mire de frente.

Con `EJ-011` retirado en `T-126` (era el último ítem con "sabor ricotero" — un recital) no
queda una sola mención a la banda en las veinte preguntas vigentes: hay plantas, muebles,
súper, asados, viajes, reuniones, una playa, una plaza con mate, una calle cortada. Es
exactamente lo que piden `US-06` y `CTR-08.5` regla 5 — el banco no afirma nada sobre la
banda, así que no necesita ninguna ficha `RES-XX` — y la decisión de sacar el sabor
ricotero de `EJ-011` fue correcta: agregarle banda a una pregunta de temperamento la
convertía en credencial de fan, la línea que `BR-17` no deja cruzar.

Pero la consecuencia es esta: hoy lo único ricotero de este juego es el título de la
sección, la paleta de `Luzbelito` (`UX-06` §5) y los cuatro nombres de cuadrante. Las
veinte escenas — cortes de luz, cumpleaños, plantas, mudanzas de plan, una plaza con mate,
una playa — podrían vivir en cualquier test de personalidad de cualquier sitio. No es un
defecto de este banco contra su propio criterio: es una tensión entre "molinete abierto, sin conocimiento
previo" (`US-06`) y "esto es un sitio sobre esta banda", y no me corresponde a mí decidir
si eso está bien así o si el juego necesita, en algún lugar que no sea el contenido de las
preguntas, algo más que lo recuerde.
