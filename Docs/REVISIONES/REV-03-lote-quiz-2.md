# REV-03 — Revisión del lote del ciclo 2

> Producida por `revisor` el 2026-08-19, tarea `T-26` del ciclo 2.
> Escrita por el hilo principal: `revisor` es read-only por diseño.
>
> Pieza revisada: `src/data/quiz.json`, ítems **`QZ-016` a `QZ-030`**. Los primeros 15 ya
> se revisaron en `REV-02`.
> Criterios: `CTR-02` rev. 4, `CNT-02`, `CNT-04`, `BR-01`, `D-09`, y el PDF del memoir.
> Rango de IDs: `FIND-12` en adelante.

**Salida mecánica, corrida por el hilo principal (`D-12`) y reconfirmada por `revisor`:**

```
OK 30 items · categoria: discos 10, mitologia 10, historia 10
dificultad: facil 10, media 13, dificil 7 · sin fuente: 0
testimonio: 5 · con esLeyenda true: 0 · sin RES-21: 0 · solo RES-21: 0
quien: ['Indio Solari', 'Rocambole'] · max enunciado: 174/180 · ids unicos: True
```

---

## Veredicto

**No, tal como están.** El hallazgo bloqueante es **puntual —2 ítems de 15— y se arregla
reescribiendo dos campos**, no rehaciendo el lote.

Sobre la pregunta que importaba para el ciclo —**¿el rótulo `testimonio` se volvió un
tilde?**— la respuesta es matizada y vale leerla entera:

**En 3 de los 5 casos está haciendo su trabajo.** `QZ-026`, `QZ-029` y `QZ-030` tienen
atribución correcta, formulación mayormente correcta, y hecho verificable contra el
original. El riesgo número uno del ciclo **no se materializó como se temía**.

**En los otros 2 se volvió otra cosa, y es peor que un tilde vacío:** una **cita textual con
la etiqueta de paráfrasis puesta encima**, exactamente en el punto donde el propio contrato
había avisado que no tenía cómo verlo.

---

## Hallazgos

### `FIND-12` — Transcripción textual disfrazada de paráfrasis · **bloqueante**

- **Criterio incumplido:** `D-09` ("ningún dato falso" — acá, una etiqueta que dice algo
  falso sobre el propio contenido) y la nota "señalada y no decidida" de `CTR-02.7`.
- **Evidencia, verificada con `difflib` contra el PDF:**
  - **`QZ-027`**, en `testimonio.afirmacion` (línea 510) y en `explicacion` (503):
    *"un muñeco de su hija Marilú, con collares, antifaz y chupete"* — **62 caracteres
    idénticos letra por letra** al libro (cap. "Un baión…", p. 233), **sin comillas**.
  - **`QZ-028`**, en `explicacion` (527): dos tramos textuales de una **cita directa de
    Rocambole** en el libro (p. 308) — *"tenía guardado un gato momificado que había
    encontrado en un techo"* y *"jubilados que comían gatos en Plazza Lavalle"*.
- **Por qué es bloqueante y no cosmético:** `contenido` reportó haber parafraseado
  **justamente para no abrir el hueco de `sensibleA`**. En estos dos no lo hizo, y
  `sensibleA` sigue en `[]`. O sea: hay texto ajeno reproducido y **el gate de derechos de
  `D-07` no lo ve**. Rocambole es artista vivo. El hueco que `arquitectura` había señalado
  como hipotético al cerrar `T-16` **se ejerció en la práctica el mismo día**.

### `FIND-13` — `QZ-029` pregunta "qué pasó", no "qué contó" · **importante**

- **Criterio incumplido:** el espíritu de `CTR-02.4` regla 4, y `RES-21`.
- **Evidencia (línea 544):** *"En sus memorias, el Indio contó por qué el sobre interno de
  Oktubre trae impresa una letra que no está en el disco. **¿Qué pasó con esa canción?**"*
- **Por qué:** es **literalmente el contraejemplo que el propio `CTR-02.4` anota** — *"¿Qué
  pasó la noche que el Indio recuerda…? pasa el patrón y sigue estando mal, porque pregunta
  qué pasó."* Un testimonio afirma lo que alguien **contó**, no lo que objetivamente
  ocurrió. El hecho es verdadero y está bien citado, verificado contra el PDF: **el defecto
  es solo de formulación**, y muestra que un patrón regex no puede sustituir el criterio.

### `FIND-14` — Vuelve el patrón de `FIND-11` · **importante**

- **Criterio incumplido:** `BR-01`, y a través suyo "sin muro de entrada" (`D-09`).
- **Evidencia:** cuatro de los seis `facil` nuevos son recuerdo puro de un dato puntual sin
  ningún indicio deducible dentro del enunciado: **`QZ-017`** (306), **`QZ-021`** (382),
  **`QZ-022`** (400) y **`QZ-026`** (472, el único `facil` de testimonio).
- **El contraste está en el mismo lote, y por eso el hallazgo es justo:** `QZ-016` dice
  "institución del **Ejército**" y eso descarta tres de cuatro opciones por lógica;
  `QZ-018` dice "provincia del **norte**" y aísla a Salta. Los dos replican el arreglo que
  funcionó en `QZ-011` y `QZ-012`. **La corrección es posible y en estos cuatro no se
  aplicó.**

---

## Sin hallazgos — lo que se auditó y está bien

- **`CNT-04` se cumple al pie de la letra.** `QZ-024` y `QZ-025` siguen las salidas (b) y
  (c) en tono sobrio, **sin convertir la edad ni la causa de muerte en la respuesta**. El
  capítulo 14 del memoir no aparece en ningún ítem, ni Olavarría como objeto de pregunta.
  La regla se escribió antes de las preguntas y se respetó: el gate funcionó.
- **La distinción leyenda / testimonio se aplicó bien en el caso de borde.** `QZ-018` a
  `QZ-020` (Patricio Rey y Salta) quedaron como `esLeyenda: true` **sin** objeto
  `testimonio`, que es exactamente lo que `CTR-02.4` prescribe: *"el libro reporta un
  rumor… es leyenda aunque esté impreso"*. Distinguir eso es sutil y se distinguió.
- **`quien` separa correctamente al Indio de Rocambole**, verificado contra el PDF:
  `QZ-027` y `QZ-028` **sí** son testimonio de Rocambole, no del Indio.
- **La `ubicacion` compartida entre `QZ-026` y `QZ-030` no es un tilde repetido:** se
  verificó en el PDF que los dos hechos —la tapa de superhéroes y la nave inspirada en una
  caja de Chivas Regal— salen del mismo pasaje real.
- **Pertinencia de las citas de `historia`**, verificada línea por línea contra `RES-05`,
  `RES-07` y `RES-09`: ningún dato de `QZ-021` a `QZ-025` excede lo que su ficha sostiene.

## Una afirmación que no se pudo corroborar

`contenido` reportó haber **descartado dos pasajes candidatos** por falta de ubicación
fichada. No hay registro de eso en `ESTADO.md` ni en `Docs/CONTENIDO/`. **No es un hallazgo
en contra** —probablemente pasó— pero tampoco se puede acreditar como señal de salud. Vale
como aprendizaje de proceso: **lo que se descarta a conciencia conviene dejarlo escrito**,
porque si no, el criterio se pierde y el próximo lo vuelve a evaluar de cero.

---

## Cierre de los tres hallazgos — verificado por el hilo principal, 2026-08-19

`contenido` corrigió los tres el mismo día. La verificación la corrió el hilo principal
(`D-12`), incluido el chequeo contra el PDF que `contenido` **pidió explícitamente** porque
no tiene `difflib` ni puede leer el libro. Ese pedido fue lo correcto y conviene que conste.

**Schema:** `OK 30 items`, `sin fuente: 0`, `testimonio: 5`, `facil: 10`, enunciado máximo
174/180. Sigue cumpliendo `BR-01`.

**`FIND-12` — cerrado.** Se comparó el texto de los cinco testimonios contra las **194.131
palabras** del PDF, buscando secuencias idénticas de 8 palabras o más (n-gramas, porque
`SequenceMatcher` sobre 863 páginas no termina). Resultado:

| Ítem | Campo | Tramo calcado más largo |
|---|---|---|
| `QZ-026` | explicación y afirmación | 8 palabras · 37 car · *"por primera vez la imagen de la banda"* |
| `QZ-027` | explicación | 8 palabras · 38 car · *"la idiotez y ahí apareció un muñeco de"* |
| `QZ-029` | explicación | 8 palabras · 41 car · *"la letra de «De estos polvos futuros lodos»"* |
| `QZ-030` | una opción | 8 palabras · 38 car · *"una caja de whisky Chivas Regal con su"* |

**Ninguna llega a 9 palabras**, y la más larga son 41 caracteres contra los **62** que
motivaron el hallazgo. Tres de las cuatro son prácticamente inevitables: una contiene el
**título de la canción**, otra la **marca del whisky** —que es el hecho mismo— y otra es
una construcción genérica del español. La cuarta, la de `QZ-027`, es la más narrativa de
las cuatro y quedó en el límite de lo aceptable.

**Sobre `QZ-030`:** `contenido` pidió por su cuenta que se revisara esa frase, porque se
repetía idéntica entre dos campos y le pareció demasiado específica. Tenía razón en
sospechar; el chequeo la dio por debajo del umbral.

**`FIND-13` — cerrado.** `QZ-029` pregunta ahora *"¿Qué contó el Indio en sus memorias sobre
esa canción?"*, siguiendo la regla 4 de `CTR-02.4`.

**`FIND-14` — cerrado, y mejor de lo pedido.** Los cuatro se resolvieron **con pista real**,
sin reetiquetar ninguno: `QZ-017` acota a "cambió su aspecto"; `QZ-021` a "años
consecutivos"; `QZ-022` por género, único nombre femenino entre las opciones; `QZ-026` por
orden, "el anteúltimo disco de estudio" —y a este se le sumó `RES-02` a `fuentes`, porque la
pista introduce un dato cronológico que esa ficha respalda—. Los **10 fáciles se mantienen**.
`contenido` descartó reetiquetar porque habría bajado a 9, por debajo del mínimo de `BR-01`.

## Qué sigue

- **`arquitectura`** — `FIND-12` reabrió lo que `CTR-02.7` había señalado y diferido. La
  corrección evitó el problema **parafraseando**, no declarando, así que el hueco sigue
  abierto para el próximo que cite textual. Si hace falta un valor `libro` en `sensibleA`,
  la decisión de si hace falta es de `contenido` vía `CNT-01` — pedido en
  `Docs/SUGERENCIAS/ORQ-para-contenido-sensiblea-texto-libro.md`.
