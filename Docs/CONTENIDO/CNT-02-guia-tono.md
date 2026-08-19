# CNT-02 — Guía de tono

- **Fecha:** 2026-08-19
- **Estado:** aceptada como criterio de estilo — se ajusta con uso, no bloquea nada.
- **Consume:** `Docs/BRIEF.md` (sección "Idioma y tono" y criterio no negociable "sin muro
  de entrada"), `.claude/skills/contenido-metodo/SKILL.md`.

## La tensión que sostiene esta guía

El brief pide dos cosas a la vez: tono de club (jerga, guiños, humor ricotero) **y** que el
que recién llega no quede afuera en su primera partida. No son incompatibles si se respeta
una regla simple:

> **La jerga va en el tono. Nunca va en la barrera.**
>
> Un guiño interno puede estar en cómo está escrita la pregunta. Lo que nunca puede pasar
> es que **entender la pregunta** dependa de agarrar el guiño. El fan de toda la vida se
> ríe un poco más; el que llegó por Twitter contesta igual.

Corolario práctico: si al sacar cada palabra en jerga la pregunta sigue siendo clara y
respondible, la jerga está bien puesta. Si sacarla deja un agujero — la pregunta ya no se
entiende, o las opciones dejan de tener sentido — esa jerga era una barrera disfrazada de
tono.

## Nota sobre los ejemplos de este documento

Los datos de los ejemplos de abajo son **ilustrativos de tono**, no preguntas listas para
cargar. Ninguno se sube a `src/data/` sin su ficha `RES-XX` correspondiente, según
`.claude/rules/contenido-json.md`. Donde el ejemplo necesita una letra o una fecha exacta,
uso `[placeholder]` a propósito.

---

## Ejemplo 1 — Historia, nivel fácil

**BIEN**

> ¿Cómo le dicen los fans al cantante de los Redondos, el que después siguió su carrera
> solo?
> A) El Indio · B) El Flaco · C) El Mono · D) El Negro

Por qué funciona: da el apodo como pregunta (no lo da por sabido), y agrega el dato "el
que después siguió solo" como pista extra para quien no ubica el apodo pero sí sabe que la
banda se separó. El que no sabe nada igual puede leer las cuatro opciones y jugar.

**MAL**

> ¿Cuál es el sobrenombre del vocalista redondo que, once you know, you know?
> A) El Indio · B) El Flaco · C) El Mono · D) El Negro

Por qué falla: la frase en inglés no suma humor, marca membresía — funciona como un
"si no la entendés, no sos de acá" antes de que arranque el juego. No da ninguna pista
extra, solo cierra la puerta.

---

## Ejemplo 2 — Discos, nivel difícil

**BIEN**

> Este tema apareció por primera vez en un disco de mediados de los 80, antes de que la
> banda tocara en los estadios grandes. ¿En cuál?
> A) [Disco A] · B) [Disco B] · C) [Disco C] · D) [Disco D]

Por qué funciona: es difícil de verdad — solo lo contesta quien conoce la discografía — pero
la pregunta se entiende igual sin saber la respuesta. El recién llegado puede arriesgar una
opción por descarte y sentir que jugó, no que lo dejaron afuera.

**MAL**

> ¿En qué gira lo tocaron, la de antes de que se pusiera bueno todo?
> A) [Disco A] · B) [Disco B] · C) [Disco C] · D) [Disco D]

Por qué falla: "la de antes de que se pusiera bueno todo" es un apodo interno de una gira
que en ningún lugar del sitio se explica. No es difícil, es indescifrable — ni siquiera
alguien que estudió la discografía por fuera del sitio necesariamente reconoce ese apodo.
Una pregunta difícil de verdad reta el conocimiento; esta reta adivinar una referencia sin
glosario.

---

## Ejemplo 3 — Mitología, leyenda rotulada

**BIEN**

> Cuentan los fans que pasó algo particular en un recital de [año]. Nadie lo confirmó
> nunca del todo, pero la historia circula hace años. ¿Cuál es la versión más repetida?
> A) [opción] · B) [opción] · C) [opción] · D) [opción]
>
> *(Explicación post-respuesta: esto es leyenda ricotera, no está confirmado con fuente —
> se cuenta porque circula, no porque sea un hecho verificado.)*

Por qué funciona: "cuentan los fans", "nadie lo confirmó del todo" avisan desde el
enunciado que es mitología, no historia. Cumple el criterio no negociable de "ningún dato
falso" porque nunca se presenta como hecho.

**MAL**

> En el recital de [año] pasó [tal cosa]. ¿Qué banda tocó esa noche antes que los Redondos?

Por qué falla: no hay ninguna marca de que "[tal cosa]" sea leyenda. Se afirma como un
hecho llano. Aunque la anécdota sea real de boca en boca, presentarla sin rótulo viola
directamente el criterio no negociable de veracidad del brief — el jugador se la lleva
como historia confirmada.

---

## Ejemplo 4 — Completar la letra, escalando dificultad

La regla exacta de cuánto texto se muestra por nivel la fija `producto` (`BR-XX`,
pendiente); esto muestra el criterio de tono, no la regla numérica.

**Fácil — con contexto**

> "[Un par de versos de contexto que arman el clima de la canción]... y ahora el verso que
> falta: _____"
> A) [opción con onda] · B) [opción con onda] · C) [distractor plausible] · D) [distractor
> plausible]

**Difícil — verso pelado**

> "_____" (así, sin nada más alrededor)
> A) [opción] · B) [opción] · C) [opción] · D) [opción]

Por qué funciona el par: la dificultad sube sacando andamiaje, no sacando claridad en la
consigna — la mecánica en sí misma (menos letra, no otro tema) ya es la escalada. Ningún
nivel deja de explicar qué hay que hacer.

**MAL, en cualquier nivel**

> Completá: "_____ (la [apodo de un verso muy citado que el sitio nunca explicó antes])"

Por qué falla: si el sitio nunca presentó ese apodo en ningún lugar accesible, no es una
pregunta difícil — es una pregunta que exige haber estado en un grupo de Facebook
específico antes de abrir el juego. La dificultad tiene que poder vencerse por saber más
del tema, no por pertenecer a un círculo previo al sitio.

---

## Checklist rápido al escribir una pregunta

- [ ] Si borro toda la jerga de la consigna, ¿sigue siendo clara? Si no, reescribir.
- [ ] ¿El guiño suma humor o solo separa a los que saben de los que no? Si solo separa,
  afuera.
- [ ] ¿Los distractores también tienen onda, o hay uno soso al lado de tres con voz propia?
  Un distractor sin gracia delata la respuesta antes de tiempo.
- [ ] Si es leyenda, ¿el enunciado o la explicación post-respuesta lo dice explícitamente?
- [ ] ¿Un desconocido que llegó por un link de Twitter puede leer esto y jugar, aunque
  pierda?
