# REV-02 — Revisión del primer lote del quiz

> Producida por `revisor` el 2026-08-19, tarea `T-12` del ciclo 1.
> Escrita por el hilo principal: `revisor` es read-only por diseño.
>
> Pieza revisada: `src/data/quiz.json`, ítems `QZ-001` a `QZ-015`.
> Criterios: `CTR-02`, `CNT-02`, `CNT-03`, `BR-01`, `D-09`, `RES-02`, `RES-08`.
> Rango de IDs: `FIND-10` en adelante. `FIND-01`..`FIND-09` los consumió `REV-01`.

---

## Veredicto

**No tal como estaban.** 14 de las 15 preguntas están bien citadas, con respuesta única y
verificable. `QZ-005` era un hallazgo bloqueante real: su respuesta correcta no era única
dada la evidencia disponible **en el momento de la revisión**.

Ver la nota de resolución de `FIND-10` más abajo: llegó evidencia nueva que cambia el
desenlace.

---

## Hallazgos

### `FIND-10` — `QZ-005` dependía de un dato que `CNT-03` vetó · **bloqueante** · ✅ resuelto

- **Criterio incumplido:** `CNT-03` §1 y `D-09` ("ningún dato falso").
- **Evidencia:** `QZ-005` pregunta cuál fue el primer disco editado bajo el sello propio
  Patricio Rey Discos, marca correcta *Último bondi a Finisterre* (1998) y usa *Luzbelito*
  (1996) como distractor.
- **Por qué incumplía:** `RES-02` deja **sin resolver** el sello de *Luzbelito* — Wikipedia
  ES y Discogs dicen Del Cielito, Wikipedia EN dice Patricio Rey Discos. Si la fuente
  minoritaria fuera la correcta, *Luzbelito* sería el primero bajo sello propio y la
  respuesta marcada dejaría de ser única. `CNT-03` §1 vedaba explícitamente cualquier
  opción que dependiera de ese dato, y este distractor depende de él para ser falso.

> **Nota de resolución — hilo principal, 2026-08-19.** El hallazgo era **correcto con la
> evidencia que `revisor` tenía**, y aun así la pregunta se salva. Mientras corría esta
> revisión, la sesión paralela entregó **`RES-20`**
> (`Docs/INVESTIGACION/INV-20-fuentes-primarias.md`), que **resuelve la discrepancia**: el
> artículo específico del disco da **Del Cielito Records**, cuarta fuente independiente
> que lo dice contra la Wikipedia en inglés. *Luzbelito* no salió por sello propio, así
> que **la respuesta de `QZ-005` es correcta y es única**.
>
> Lo que estaba mal, entonces, no era el dato sino **la cita**: `QZ-005` se apoyaba solo en
> `RES-02`, que por sí sola no hace única a la respuesta. Es la misma distinción entre
> formato y pertinencia que el contrato asentó hoy, pero **al revés**: acá el hecho es
> verdadero y la evidencia citada se queda corta. **Arreglo: agregar `RES-20` a `fuentes`.**
> El veto de `CNT-03` §1 sobre el sello de *Luzbelito* también queda levantado.

### `FIND-11` — Cuatro preguntas etiquetadas `facil` no lo son · **importante**

- **Criterio incumplido:** `BR-01` y, a través suyo, el criterio no negociable "sin muro de
  entrada" (`D-09`).
- **Evidencia:** `QZ-001` (año de *Gulp!*), `QZ-006` (año de *Momo Sampler*), `QZ-011`
  (ciudad de la leyenda de "Ji Ji Ji") y `QZ-012` (zona de la mansión del Indio) piden
  fechas exactas o detalles puntuales **sin ningún indicio utilizable dentro del
  enunciado**.
- **El contraste está en la propia casa:** el ejemplo "BIEN" de `CNT-02` sí da una pista
  aprovechable ("el que después siguió su carrera solo"). Y `QZ-002` y `QZ-007` dan una
  pista relativa —"un año después de…"— que **solo sirve si ya sabés el año de
  referencia**, así que tampoco resuelve el problema.
- **Por qué importa:** `BR-01` exige que el primer ítem de toda partida sea `facil`
  justamente para no expulsar a quien no sabe nada. Si el sorteo pone una de estas cuatro
  primero, el recién llegado choca contra una fecha exacta sin nada de dónde agarrarse.
- **No bloquea el juego** —el criterio 2 de `US-01` garantiza que la partida nunca se
  corta— pero **vacía el propósito declarado de la etiqueta**.

---

## Sin hallazgos — lo que se auditó y está bien

- **Pertinencia de las citas, en los otros 14 ítems.** Se abrieron `RES-02` y `RES-08`
  completas. Cada dato de `discos` —año, sello, orden cronológico, doble álbum— está en la
  tabla de `RES-02`; cada dato de `mitologia` —leyenda, desmentida, cita textual— está en
  `RES-08`, **con el mismo rótulo que usa la ficha**. Ningún ítem afirma tracklist, autoría
  de letra, ni ningún dato que las fichas citadas no sostengan.
- **`CNT-03` §2, el conteo 9/10, en `QZ-010`.** Usa textualmente la convención propuesta
  ("contando cada volumen… como aparte"). Verificado a mano: con esa convención el total es
  10 sin ambigüedad y ninguna otra opción es defendible.
- **`CNT-03` §3, *Momo Sampler*.** `QZ-006` solo afirma año y posición cronológica, que
  `CNT-03` habilita. No toca la "pureza" de material, que estaba vedada.
- **Los cinco rótulos de leyenda.** Describen con precisión qué es leyenda y qué la
  desmiente: **no son decorativos**. El diseño de `QZ-011` y `QZ-015` —la leyenda y su
  desmentida por el propio Indio— sigue el pedido explícito de `RES-08`.
- **Límites editoriales, cumplidos.** Ningún ítem menciona a Bulacio, ni Olavarría, ni la
  muerte del Indio. **Todo el tiempo verbal referido a él está en pasado** (*vivía*, *se
  decía*, *circuló*, *vinculaba*): nada sugiere que esté vivo.
- **Tono `CNT-02`.** Ningún enunciado exige un guiño interno para entenderse. Borrando la
  jerga, las preguntas siguen siendo claras — que es exactamente la regla.
- **Mecánico, re-confirmado con `Bash`:** `jsonschema.validate` pasa, IDs únicos, fichas
  citadas (`RES-02`, `RES-08`) existen, `US-01` existe.

## Señal de salud, que también es un resultado

`contenido` **descartó a conciencia** historia y letras por falta de ficha, en vez de
escribir de memoria y rellenar el piso. Y en `CNT-03` dejó por escrito una **regla general
reutilizable** en lugar de resolver caso por caso. Esa es la disciplina que el proyecto
pide, y conviene que conste tanto como los defectos.

---

## Qué sigue

- **`contenido`** — agregar `RES-20` a las fuentes de `QZ-005` y levantar el veto de
  `CNT-03` §1 dejando registro de por qué existió. Y resolver `FIND-11`: dar pista real o
  reetiquetar a `media`, cuidando que queden suficientes `facil` para `BR-01`.
- **`orquestador`** — `FIND-10` **no** bloquea el cierre del ciclo: se resolvió con
  evidencia, no con una excepción.
