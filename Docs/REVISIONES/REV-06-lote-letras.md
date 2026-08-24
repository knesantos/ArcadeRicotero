# REV-06 — Revisión del lote de `letras` (`QZ-031`..`QZ-040`)

> Tarea `T-106` del ciclo 7, 2026-08-24.
>
> Pieza revisada: `src/data/quiz.json`, ítems `QZ-031` a `QZ-040` — el lote que cierra el
> piso de 40 de `US-01`.
>
> **Este archivo lo escribió el hilo principal, y no es un trámite de secretaría.** Se
> corrieron **dos revisiones independientes** sobre el mismo lote y **no coincidieron**. La
> ficha de `revisor` está entera más abajo, tal como la entregó. Arriba está la
> adjudicación, con lo que el hilo principal verificó por su cuenta antes de decidir a
> quién darle la razón.

---

## Por qué hubo dos revisiones

El plan del ciclo declaró **el riesgo número uno del ciclo, y era este lote**: ocho de las
diez son de nivel `dificil` por aritmética del piso, y una pregunta difícil mal hecha no es
difícil — es una pregunta con un distractor que también se puede defender.

Con ese riesgo escrito de antemano, una sola pasada era poco. Se corrieron dos, con encargos
distintos:

| | Encargo | Resultado |
|---|---|---|
| **`revisor`** | Verificar contra los criterios declarados (`CTR-02`, `BR-04`, `CNT-02`, el criterio "sin verso", los vetos) | **Ningún hallazgo bloqueante.** Tres de higiene: `FIND-22`, `FIND-23`, `FIND-24` |
| **Pasada adversarial** | **Intentar romperlas.** Asumir que hay defectos y buscarlos, ítem por ítem, contra la fuente primaria | **Seis defectos concretos**, dos de ellos en el texto que el jugador lee |

## La adjudicación: la pasada adversarial tenía razón

El hilo principal verificó las seis contra las fichas y contra el archivo, una por una.
**Las seis son reales.** No es que `revisor` se haya equivocado en lo que miró: verificó
bien lo que se le pidió verificar —los distractores contra `RES-20`, los dos testimonios
contra el PDF palabra por palabra, la aritmética del piso, los vetos— y todo eso estaba
bien. **Lo que no encontró es lo que estaba afuera del ítem.**

Y ahí está lo que este archivo tiene para enseñar, que vale más que los seis defectos:

> **Cuatro de los seis defectos no se ven mirando el ítem.** Se ven mirando el ítem
> **contra otra cosa**: contra otro ítem del banco, contra una fecha de otro disco, contra
> lo que el propio sitio ya publica, contra lo que la ficha citada *no* dice.
>
> Es el mismo patrón que ya había mordido dos veces en este proyecto y está escrito en el
> código: *"no lo agarró nadie — ni `contenido`, ni el schema, ni las tres revisiones —
> porque en el JSON cada ítem se lee correcto por separado; el patrón solo existe en el
> conjunto"* (`ronda.ts`, sobre las respuestas correctas que caían siempre primeras).
>
> **Verificar ítem por ítem es necesario y no alcanza.** Un encargo que dice "verificá" y
> uno que dice "rompé" no encuentran lo mismo, y el segundo cuesta lo mismo que el primero.

### Los seis, verificados

| # | Ítem | Qué está mal | Cómo se verificó |
|---|---|---|---|
| 1 | `QZ-035` | La explicación llama al COMFER *"el organismo de censura de la dictadura"*. Era el ente federal de radiodifusión y siguió existiendo en democracia hasta 2009 — y *Gulp!* es de **1985**, en democracia. `RES-48` fecha **la carta** en la dictadura; el ítem le pasó el atributo del papel al organismo. Y dice *"nunca hubo censura real"* donde `RES-48` dice "nunca hubo **una** censura real", sobre ese tema: sin el artículo queda una afirmación falsa sobre la dictadura, en registro 3 | Lectura de `RES-48` contra el texto del ítem |
| 2 | `QZ-026` → `QZ-033` | La explicación de `QZ-026` **contiene la respuesta de `QZ-033`**. Y `QZ-026` es `facil` y `QZ-033` es `media`, así que con el orden de `BR-01` **siempre sale antes** | Lectura de los dos ítems en el archivo |
| 3 | `QZ-040` | El enunciado afirma que la pista oculta figura *"sin aparecer en el arte original del disco"*. **Ninguna ficha lo dice**: `RES-20` dice solo "(track oculto)" y el memoir no menciona el tema | `grep` de "arte original" sobre `Docs/INVESTIGACION/` y `src/data/` — cero coincidencias sobre *Gulp!* |
| 4 | `QZ-036` | El enunciado dice que coescribió «Criminal Mambo» tras tocarlo de improviso **en 1987**. El tema salió en *Gulp!*, **1985**. La cadena causal es imposible. Y `rotuloLeyenda` dice *"rumor sin fundamento"* cuando lo falso es la **coautoría**: el episodio tiene núcleo real en el memoir | `RES-20` (año de *Gulp!*) contra el enunciado |
| 5 | `QZ-032` | La explicación abre con *"El álbum doble de 1993"* — toma partido en el eje que `CNT-03` dejó vedado. Y cierra con *"según la ficha de discografía"*, que rompe la cuarta pared (es `FIND-23`) | Lectura, y `grep`: es el único de los 40 que cita una ficha en la explicación |
| 6 | `QZ-031` | El distractor *«Poli» Castro* está **hecho plausible por el propio sitio**: el artículo `mi-perro-dinamita` de la Redondopedia publica, rotulado `testimonio`, que el tema nació de un verso de Poli. El jugador que leyó el sitio tiene un motivo publicado para elegir mal, y el ítem no usa `opciones[].nota`, que el schema admite para exactamente esto | Lectura de `src/data/redondopedia.json` |

### Y un séptimo, que salió del sexto y es peor

Persiguiendo el distractor de `QZ-031` apareció un defecto en **contenido ya publicado**:

> **El artículo `mi-perro-dinamita` de la Redondopedia atribuye a `RES-22` algo que
> `RES-22` no dice.** El párrafo está rotulado `testimonio` y cita `RES-22 (INV-20); RES-48
> (INV-48)`. En `INV-20`, lo único que hay sobre ese tema es que **el Indio no quería
> editarlo**; del verso de Poli no hay una palabra. El error nace en `RES-48`, que escribió
> *"ya en `RES-22`, vía el memoir"*, y el artículo lo heredó.
>
> Verificado con `grep -i "perro dinamita\|Poli"` sobre `INV-20-fuentes-primarias.md`.
>
> **Por qué importa más que los otros seis:** un `testimonio` es la casilla que promete *lo
> contó alguien con nombre y apellido, y está la ficha*. Si la ficha no lo dice, el rótulo
> miente sobre lo que hay adentro — que es lo único que `D-14` y `CLAUDE.md` declaran como
> estricto. Y una de las dos "fuentes independientes" que el artículo se jacta de cruzar no
> existe, así que el cruce tampoco.
>
> Queda como **`T-110`**, fuera del lote y con dueño propio.

## El defecto que apareció al costado, y era el más caro de todos

No es del lote, pero se encontró revisándolo y **le cambia el sentido a todo el ciclo**:

> **Hasta hoy, ninguna de estas diez preguntas se jugaba nunca.** `armarRonda` llenaba la
> ronda tomando del pozo más fácil hasta completar el largo. Con 10 fáciles en el banco y
> una ronda de 8, **toda partida era ocho fáciles**. Simulando 300 rondas contra el banco
> real: **2.400 preguntas servidas, las 2.400 fáciles.** Las 15 medias y las 15 difíciles no
> salían jamás, y la categoría `letras` entera era inalcanzable.
>
> El banco tenía 40 preguntas y el jugador veía 10.
>
> Cumplía `BR-01` al pie de la letra —arranca fácil, la dificultad nunca baja— y traicionaba
> las tres razones por las que `BR-01` existe.
>
> **Arreglado en `T-109`**, con la mezcla derivada del piso que `producto` ya había
> declarado (10/15/15 sobre 40 → 2/3/3 en una ronda de 8) y cinco tests nuevos. Verificado:
> 500 rondas dan 2 fáciles, 3 medias y 3 difíciles cada una, cero violaciones de `BR-01`, y
> las cuatro categorías salen parejas. "Adivinar la tapa", que comparte la función, pasa de
> rondas de 6 a 2/2/2.

## Veredicto

**El piso de 40 de `US-01` está cumplido y la aritmética cierra exacta** — 40 ítems, 10 por
categoría, 10 fáciles / 15 medias / 15 difíciles, verificado a máquina y ahora guardado por
`src/lib/pisos.test.ts`, que falla el build si se rompe.

**Ninguna de las diez tiene la respuesta mal.** Los seis defectos están en el texto que
rodea a la respuesta —explicaciones, rótulos, un enunciado con una fecha imposible, una
cláusula inventada— y en cómo un ítem convive con los otros 39.

**Dos de los seis sí bloqueaban**, contra lo que dijo `revisor`: `QZ-035`, porque publica
una afirmación falsa sobre la dictadura en registro 3, y la fuga `QZ-026`→`QZ-033`, porque
regala una respuesta. Los otros cuatro son de una línea cada uno.

Corregidos por `contenido` en **`T-108`**.

---

# Anexo — la ficha de `revisor`, tal como la entregó

> Lo que sigue es la entrega de `T-106` sin editar. Se conserva entera porque el trabajo que
> hizo es correcto y sirve: es la verificación ítem por ítem contra los criterios, incluida
> la comprobación de los dos testimonios contra el PDF del memoir, que nadie más hizo. Lo
> que le faltó fue mirar el lote contra el resto del banco.

## Verificación mecánica, corrida y no asumida

```
$ node --test src/**/*.test.ts
✔ quiz.json valida contra su schema
... (51 tests, 51 pass, 0 fail)

$ python3 (conteo sobre src/data/quiz.json)
total items: 40 | listo: 40
categoria: {'discos': 10, 'mitologia': 10, 'historia': 10, 'letras': 10}
dificultad: {'media': 15, 'dificil': 15, 'facil': 10}
sin fuente (esLeyenda false, fuentes vacía): 0
ids únicos: True
```

`letras` cierra en `dificil: 8` (`QZ-031,032,034,035,036,037,038,039`) + `media: 2`
(`QZ-033,040`), tal como declara `CNT-08`. El piso `10/15/15` de `US-01` cierra en `40/40`.

## El trabajo por ítem

- **`QZ-031`** (autoría, `dificil`) — `RES-20` es explícito: única excepción junto con «Ella
  debe estar tan linda». Distractores (Sidotti, Dawi, «Poli» Castro) son nombres reales del
  entorno de la banda pero ninguno figura como autor.
- **`QZ-032`** (personaje, `dificil`) — confirmado literal en `RES-20`. No toca el veto de
  conteo 9/10 (pregunta por personajes, no por cantidad de discos).
- **`QZ-033`** (personaje/testimonio, `media`) — verificado **contra el PDF**, coincide
  palabra por palabra con `afirmacion` y `explicacion`. `quien: Indio Solari` correcto.
- **`QZ-034`** (título, `dificil`) — únicos dos títulos "Todo…" en *Un baión…*: confirmado
  en `RES-20` (track 4 y 8, duración 7:25 exacta).
- **`QZ-035`** (documentado, `dificil`) — `RES-48` lo da como "HECHO, verificable en el
  objeto físico". Sin ambigüedad con los distractores.
- **`QZ-036`** (leyenda, `dificil`) — `RES-48`: *"LEYENDA desmentida por la propia fuente"*.
  Casilla `esLeyenda: true` bien elegida.
- **`QZ-037`** (documentado/testimonio, `dificil`) — verificado **contra el PDF**. No
  reproduce el verso que el libro sí transcribe: cumple el criterio "sin verso" a propósito.
- **`QZ-038`** (documentado, `dificil`) — `RES-48` lo marca "verificado, leído completo".
  Ver `FIND-24`.
- **`QZ-039`** (título, `dificil`) — confirmado literal en `RES-20`.
- **`QZ-040`** (título, `media`) — «Pianito - Jam» confirmado en `RES-20` (track 12, "track
  oculto").

**Sobre la `ubicacion` reutilizada** (`QZ-033` con `QZ-030`/`QZ-026`; `QZ-037` con
`QZ-029`): verificado contra el PDF que **son oraciones distintas del mismo párrafo**, no un
atajo. `CNT-08` tenía razón en avisarlo.

## Hallazgos de `revisor`

### `FIND-22` — `sensibleA: ["letra"]` en bloque, sin que ninguno use material de letra · no bloqueante

- **Criterio:** `CTR-02.4` regla 2 y `CNT-01` sección C, que define `letra` como citas
  parciales de versos.
- **Evidencia:** los 30 ítems previos usan `sensibleA: []`, incluidos 5 testimonios sobre
  tapas y videoclips; los 10 nuevos usan `["letra"]` sin excepción, y ninguno reproduce un
  verso. Parece regla por categoría, no evaluación por ítem.
- **Por qué importa:** un filtro por `sensibleA: letra` hoy devuelve 10 ítems que no citan
  ninguna letra. El mapa de `CNT-01` deja de ser preciso.

### `FIND-23` — `QZ-032` cita "según la ficha de discografía" · no bloqueante

- **Criterio:** `voz-ricotera.md` registro 2 y `CNT-02`.
- **Evidencia:** único caso en las 40 (`grep` confirmado). Para el jugador, "la ficha de
  discografía" no significa nada.
- **Ya pasó antes:** mismo patrón que `FIND-20` de `REV-04`, corregido en su momento. El
  defecto volvió, en otro ítem.

### `FIND-24` — `QZ-038` encaja débil en "el mundo de las letras" · no bloqueante

- **Criterio:** el criterio de `T-102` en el plan del ciclo.
- **Evidencia:** es sobre un recital solista de Skay en 2023, veinte años después de la
  separación. El título es el vehículo de la anécdota, no su contenido.
- **No es un dato falso.** Es encaje de categoría, y la decisión es de `producto`.

## Lo que `revisor` auditó y pasó

- Ningún distractor defendible como respuesta alternativa, verificado contra `RES-20`,
  `RES-48` y el PDF.
- Los dos testimonios coinciden palabra por palabra con el original. Sin transcripción
  calcada disfrazada de paráfrasis (n-gramas contra el memoir completo: el tramo más largo
  es 42 caracteres / 8 palabras, bajo el umbral que motivó `FIND-12` en `REV-03`).
- Ninguno cita un verso.
- Ninguno toca los vetos de `CNT-03` (conteo 9/10, fecha de *Gulp!*).
- Tono sin folleto, sin anglicismos de `D-17`, sin épica de tribuna, sin "los fans".
- `estado: "listo"`, `us: ["US-01"]` e IDs únicos en los diez.

## Veredicto de `revisor`

*"El lote cierra el piso de 40 de `US-01`. No hay ningún hallazgo bloqueante."*

**Corregido por el hilo principal:** dos de los seis defectos de la pasada adversarial sí
bloqueaban. Ver la adjudicación arriba.
