# CNT-10 — Copy del quiz por vidas

- **Fecha:** 2026-08-25
- **Estado:** listo para `T-143` (hilo principal, `src/lib/quiz/copy.ts`).
- **Consume:** `Docs/PRODUCTO/PRD-alcance-v1.md` — `BR-19` apartados 1 (vidas), 3 (qué pasa
  al agotar niveles/banco), 6 (qué datos muestra el resultado) y 7 (retirada voluntaria);
  `US-01` criterios 1, 2, 4, 5, 6; `CNT-05` (copy previo del quiz, del que esta pieza
  **no** deroga nada — ver "Qué de `CNT-05` sigue en pie" al final); `.claude/rules/voz-
  ricotera.md` completa.
- **No edita** `CNT-05` ni `src/lib/quiz/copy.ts`: eso es de `T-143`. Esta pieza escribe el
  texto; el hilo principal lo transcribe a código, igual que hizo con `CNT-05`.
- **No decide** el criterio de comparación de `ADR-02` (`T-132`, en paralelo). Escribo la
  redacción de las tres ramas posibles (superó / no alcanzó / empate); qué hace que un
  resultado caiga en una rama u otra es de `arquitectura`.

## Por qué el motivo de esta pieza no es solo "traducir BR-19 a texto"

`BR-19` cambia la aritmética del quiz — nota sobre 8 pasa a tres desenlaces— pero el
riesgo real de esta pieza es uno solo, señalado por el propio `T-136`: **el que pierde
las tres vidas rápido es, en la mayoría de los casos, el que llegó sin saber nada — y ese
es exactamente el jugador que `D-14` manda a dejar pasar.** Todo lo que sigue está escrito
con esa idea como límite: áspero cuando el hecho lo es (perdiste, se acabó), nunca
expulsivo (nunca "no sabés nada", nunca un signo de exclamación en la derrota, nunca un
diminutivo hueco tipo "seguí intentando").

---

## E — Los tres encabezados (registro 1: el que canta)

Los tres comparten una sola imagen —**la vida como luz que se prende o se apaga**— para
que el jugador que ve los tres desenlaces en distintas partidas reconozca el mismo idioma
del sitio. Ninguno explica el mecanismo (no dicen "perdiste", "ganaste" ni "te
retiraste": ese trabajo lo hace el rótulo de la sección `N`, no el encabezado). Ninguno
lleva signo de exclamación —"el único que grita es el acierto"— ni puntos suspensivos.

**E1. Derrota** (se quedó sin las tres vidas)
> **Se te apagaron las tres vidas.**

6 palabras · segunda persona · imagen física (una luz/vela que se apaga, no un
veredicto). Es áspero —el hecho es que se acabó— pero no llama ignorante a nadie: no dice
"no sabías", dice qué pasó con las vidas, que es lo único que decidió el desenlace. Es la
pieza que más pesa de esta piedra: pensé "Te quedaste sin vidas" (correcto pero seco de
más, cero calidez) y "Casi las tenías" (mentira si perdió en la pregunta 3) antes de
llegar a esta — descarté las dos por las razones dichas.

**E2. Victoria** (agotó el banco de {total} sin perder ninguna)
> **Llegaste con las tres vidas prendidas.**

6 palabras · segunda persona · misma imagen que `E1`, en espejo. A propósito **no** dice
"ganaste", "sos el mejor" ni nada de épica de tribuna (nada de "campeón", "vieja
guardia" en este lote — ese registro ya lo usa `CNT-05` C3 para otro tramo y no hace
falta repetirlo). El logro se cuenta por el estado de las vidas, no por un adjetivo.

**E3. Retirada** (cerró la partida por su cuenta)
> **Te vas con las vidas que te quedan.**

8 palabras (el máximo permitido) · segunda persona · misma imagen, en su forma parcial:
ni apagadas del todo ni las tres prendidas — las que le quedan, sin más. "Te vas" y no
"abandonás" ni "te rendís": es una salida, no una fuga. Funciona igual con 1, 2 o 3 vidas
en pie porque no cuantifica — el número exacto lo dice el rótulo de la sección `N`.

---

## N — Cómo se dice el número (registro 3: el que rotula)

Seco, en pares etiqueta:valor, sin imagen y sin humor — es el que garantiza que el
encabezado de arriba se pueda creer. Cubre los cuatro datos de `BR-19` apartado 6.
`{total}` es el tamaño del banco cargado (hoy 40): no lo hardcodeo porque `BR-19` apartado
2 ya avisa que puede cambiar si `contenido` suma Fáciles por encima del piso, y esta pieza
no debería quedar mal si eso pasa. `{Nivel}` usa las etiquetas ya fijadas por `BR-01`/`BR-
19` — **Fácil**, **Media**, **Difícil** — sin inventar sinónimos.

**N1. Desenlace (rótulo corto, tres valores fijos, van en mayúscula como `LEYENDA`/
`TESTIMONIO`):**
- `DERROTA` · `VICTORIA` · `RETIRADA`

Son sustantivos y no verbos a propósito (no "PERDISTE"/"GANASTE"): son el mismo trío de
palabras que ya usa `BR-19` para nombrar los tres desenlaces, así que el rótulo en
pantalla dice lo mismo que dice el documento que lo definió — sin traducir el concepto
dos veces.

**N2. Hasta dónde llegó:**
> `Pregunta {n} de {total} · nivel {Nivel}`

**N3. Cuánto acertó:**
> `{aciertos} de {respondidas} acertadas`

**N4. Vidas restantes — solo aparece en el desenlace de retirada** (en victoria siempre
quedó al menos 1, en derrota siempre 0 — `BR-19` apartado 6, punto 4, ya lo dice: el dato
"no aplica" a los otros dos, así que no se muestra ahí, no se muestra en "0" ni en "3"
donde no aporta nada):
> `Vidas al cerrar: {vidas} de 3`

---

## R — El botón de retirada

> **Cerrá la partida**

Imperativo voseado (`D-17`), 3 palabras, sin infinitivo, sin exclamación, sin puntos
suspensivos. Es la pieza que más pensé, porque tiene tres restricciones que tironean
entre sí: tiene que **decir sin ambigüedad que termina la partida** (la más difícil de
las tres, según el pedido), **no sonar a derrota** y **no competir con `SEGUÍ`**.

**Por qué "cerrá la partida" y no otra cosa, con lo que descarté:**
- `Salir` / `Salir de la partida` — infinitivo, lo veta `D-17` sin excepción, y además
  "salir" en el campo semántico de un juego lee a fuga, justo lo que hay que evitar.
- `Rendite` — imperativo correcto, pero "rendirse" es exactamente la palabra de la
  derrota. Retirarse no es perder (`US-01` criterio 6, `BR-19` apartado 6 punto 1: "de
  los tres solo la derrota se presenta como algo que salió mal") y el botón no puede
  contradecir esa regla.
- `Dejalo acá` — tenía el tono correcto (ni derrota ni fuga) pero es ambiguo sobre **qué**
  se cierra: en una pantalla con dos acciones posibles (`SEGUÍ` a la próxima pregunta,
  esta a cerrar todo) la ambigüedad es exactamente el riesgo que el pedido de `T-136`
  marca como el más difícil del lote. Lo prioricé por sobre sonar más "cantado".
- **"Cerrá la partida"** nombra el objeto completo ("la partida", no "la pregunta") así
  que no hay forma de confundirlo con avanzar una sola pregunta, es neutro (cerrar un
  libro, cerrar una puerta — ninguna connotación de fuga ni de fracaso) y usa una raíz de
  verbo completamente distinta a "seguir", así que ni siquiera de lejos se leen como la
  misma familia de acción.

Nota para quien lo ubique en pantalla (`UX-07`, `T-134`, no esta pieza): tres palabras
contra la una de `SEGUÍ` ya los separa visualmente; no hace falta que este documento
opine de tamaño ni de posición.

---

## V — Qué se dice al perder una vida (no la última)

**Decisión: nada nuevo.** El micro-copy de una respuesta incorrecta ya existe y sigue
sirviendo tal cual — `CNT-05` B2 (`ERRORES` en `copy.ts`: *"Casi. Va la que sigue."*, *"No
iba. Ya la vas a acertar."*, *"Ni todo el mundo se la sabe."*, *"Esa queda para la
próxima."*): ninguna de las cuatro nombra "mal" ni "perdiste", y las cuatro siguen siendo
ciertas responda uno mal en la vida 1, la 2 o la 3. Agregar una frase aparte del tipo
"Perdiste una vida" tendría dos problemas: sería redundante con el marcador visual de
vidas que ya existe (`UX-07`, `T-134` — sin comunicar el estado solo por color, así que
ya tiene una forma no-verbal de mostrarlo) y sumaría dureza justo en el momento en que
`T-136` pide lo contrario. La única vida que sí necesita algo distinto es la tercera, y
eso no es un micro-copy nuevo: es el desenlace de derrota completo (`E1`+`N1`..`N3`), que
aparece recién después de `SEGUÍ`, como ya fija `BR-19` apartado 1 y `US-01` criterio 2.

---

## L — Qué se dice al cambiar de escalón

A diferencia de `V`, acá sí hace falta algo: el jugador se merece saber que el juego
acaba de ponerse más difícil — es el mismo principio de "declarar la duda en voz alta"
(`voz-ricotera.md` 3.3) aplicado a declarar un cambio de estado en voz alta. Va en
registro 3 (rótulo corto, no una frase que "canta"), mismo formato que `N1`:

- **Al entrar en el pozo Media:** `NIVEL MEDIA`
- **Al entrar en el pozo Difícil:** `NIVEL DIFÍCIL`

No hay rótulo para el pozo Fácil: es donde arranca toda partida, no es un cambio de
nada. Dos palabras, mayúscula, sin puntuación — aparece una sola vez, en el ítem que abre
el escalón nuevo, no se repite en cada pregunta de ese tramo.

---

## S — El texto para compartir (tres variantes, una por desenlace)

Mismo espíritu que `CNT-05` D1 (*"Saqué {p}/{t} en el arcade ricotero..."*), adaptado a
que ya no hay una nota sobre un total fijo. Las tres invitan a jugar sin pedir cuenta de
nada (`D-14`) y ninguna dice "perdí" en el sentido de fracaso — dicen hasta dónde se llegó,
que es un dato, no una condena.

**S1. Victoria:**
> `Agoté las {total} preguntas del arcade ricotero sin perder una vida. ¿Vos cuántas aguantás?`

**S2. Derrota:**
> `Las tres vidas se me apagaron en la pregunta {n} del arcade ricotero. ¿Vos hasta dónde llegás?`

**S3. Retirada:**
> `Llegué hasta la pregunta {n} del arcade ricotero, con {v} vidas en pie. ¿Vos hasta dónde llegás?`

Las tres cierran con la misma pregunta invitando a jugar (*"¿Vos cuántas aguantás?"* /
*"¿Vos hasta dónde llegás?"*), igual que hacía `CNT-05` D1 con *"¿Vos cuánto sacás?"* — es
el gesto que convierte un resultado personal en una invitación, no una alardeada.

---

## C — La comparación cuando se llega por un desafío

**Lo que no resuelvo:** qué hace que el resultado de uno cuente como mejor que el del
otro con tres desenlaces y sin nota sobre un total fijo — eso es `ADR-02` (`T-132`).
Puede terminar comparando el desenlace en sí (victoria > retirada > derrota), o la
pregunta alcanzada, o una combinación. Lo que dejo son las tres ramas de texto para
cuando `arquitectura` resuelva a cuál de las tres cae cada partida — mismo mecanismo que
ya usaba `comparacion()` en `CNT-05` D2, con `puntaje/total` reemplazado por
`pregunta alcanzada`/`aciertos`:

**C1. Superó al que lo desafió:**
> `Vos: llegaste a la pregunta {n} ({aciertos}/{respondidas} acertadas) — le ganaste a {quien}, que llegó a la {suN}.`

**C2. No lo alcanzó:**
> `Vos: llegaste a la pregunta {n} ({aciertos}/{respondidas} acertadas) — todavía no alcanzás a {quien}, que llegó a la {suN}. Dale una más.`

**C3. Empate:**
> `Vos: llegaste a la pregunta {n} ({aciertos}/{respondidas} acertadas) — empate con {quien}. Van a tener que desempatar.`

Igual que `CNT-05` D2, "no lo alcanzó" no dice "perdiste": invita a otra vuelta.

---

## Qué de `CNT-05` sigue en pie, y qué queda pendiente (no de esta pieza)

- **B1, B3, B4, B5** (micro-copy de acierto, etiquetas de leyenda/testimonio, botón
  `SEGUÍ`) **no cambian**: nada de `BR-19` los toca, ninguno depende de "sobre 8".
- **B2** sigue entero — ver sección `V` arriba.
- **A — Pantalla 0** (`CNT-05` A1/A2/A4) sigue entera: el título y subtítulo de entrada no
  hablan de puntaje.
- ⚠ **A3 (la plantilla del desafío en pantalla 0, *"{n} sacó {p}/{t}. ¿Te la bancás?"*)
  queda desactualizada** por la misma razón que `D1`/`D2`: ya no hay `{p}/{t}` sobre un
  total fijo. **No la reescribo acá** porque `T-136` no la pidió y no quiero tocar una
  pantalla (la de entrada) que no está en el alcance de esta tarea sin que quede claro
  que es un cambio deliberado y no un olvido — queda anotada en el reporte de esta pieza
  como pendiente de una `T-XX` futura, mismo dueño (`contenido`).
- **C — Tramos `bajo/medio/alto` (`BR-05`) y sus títulos/bajadas** ya no aplican a `US-01`
  (`BR-19` apartado 5 los retira de acá) pero **siguen vigentes tal cual para `US-04`**,
  que los hereda. No los toco ni los borro: siguen siendo contenido válido, solo que para
  otro juego.

---

## Verificación

Todas las cadenas fijas de este documento (`E1`-`E3`, `N1`, `L1`-`L2`, `R1`) son literales
y auditables tal cual. Las de `N2`-`N4`, `S1`-`S3` y `C1`-`C3` son plantillas: quien las
transcriba en `copy.ts` (`T-143`) debe correr la auditoría sobre un caso resuelto (con
números reales sustituidos en los huecos), no sobre el template con `{llaves}` literales.

```
node --test src/lib/voz.test.ts
```

Lo corre quien tenga con qué (`D-12`) — `contenido` no tiene `Bash`.

## Tabla resumen

| ID | Qué es | Texto / plantilla | Registro |
|---|---|---|---|
| E1 | Encabezado derrota | `Se te apagaron las tres vidas.` | 1 (canta) |
| E2 | Encabezado victoria | `Llegaste con las tres vidas prendidas.` | 1 (canta) |
| E3 | Encabezado retirada | `Te vas con las vidas que te quedan.` | 1 (canta) |
| N1 | Rótulo de desenlace | `DERROTA` / `VICTORIA` / `RETIRADA` | 3 (rotula) |
| N2 | Hasta dónde llegó | `Pregunta {n} de {total} · nivel {Nivel}` | 3 |
| N3 | Cuánto acertó | `{aciertos} de {respondidas} acertadas` | 3 |
| N4 | Vidas al retirarse (solo retirada) | `Vidas al cerrar: {vidas} de 3` | 3 |
| R1 | Botón de retirada | `Cerrá la partida` | 1 (botón) |
| V1 | Pérdida de vida (no la última) | *(nada nuevo — reusa `CNT-05` B2)* | — |
| L1 | Aviso de escalón Media | `NIVEL MEDIA` | 3 |
| L2 | Aviso de escalón Difícil | `NIVEL DIFÍCIL` | 3 |
| S1 | Compartir victoria | `Agoté las {total} preguntas del arcade ricotero sin perder una vida. ¿Vos cuántas aguantás?` | 2/3 |
| S2 | Compartir derrota | `Las tres vidas se me apagaron en la pregunta {n} del arcade ricotero. ¿Vos hasta dónde llegás?` | 2/3 |
| S3 | Compartir retirada | `Llegué hasta la pregunta {n} del arcade ricotero, con {v} vidas en pie. ¿Vos hasta dónde llegás?` | 2/3 |
| C1 | Comparación — superó | `Vos: llegaste a la pregunta {n} ({aciertos}/{respondidas} acertadas) — le ganaste a {quien}, que llegó a la {suN}.` | 2/3 |
| C2 | Comparación — no alcanzó | `Vos: llegaste a la pregunta {n} ({aciertos}/{respondidas} acertadas) — todavía no alcanzás a {quien}, que llegó a la {suN}. Dale una más.` | 2/3 |
| C3 | Comparación — empate | `Vos: llegaste a la pregunta {n} ({aciertos}/{respondidas} acertadas) — empate con {quien}. Van a tener que desempatar.` | 2/3 |
