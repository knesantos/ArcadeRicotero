# REV-16 — "Más o menos" (`US-10`), verificado contra sus criterios

> Revisado el **2026-09-25** por `revisor`, con contexto fresco y sin haber armado ninguna de
> las piezas. **Pegado en esta ruta por el hilo principal**, como manda el README de esta
> carpeta: `revisor` es read-only. Los hallazgos, las evidencias y los dueños son los del
> revisor, copiados sin cambiar el sentido; la sección "Cierre" del final es del hilo
> principal.
>
> **Qué se verificó:** `D-48`, `INV-93`, `INV-100`, `US-10`/`BR-32`/`BR-33` y la enmienda de
> `BR-18` (b) (`PRD-mas-o-menos.md`), `CTR-20` y sus invariantes `i1`..`i24`, `UX-34`,
> `CNT-25`, el banco `src/data/mas-o-menos.json` (35 datos a mano, 20 palabras), su schema, y
> el código de `src/lib/mas-o-menos/`, la isla, la página, el casete y los censos.

## Lo que pasó

- **`npm test`: 1423 de 1423.** **`npm run check`: 0 errores, 0 avisos** (16 *hints*
  preexistentes). **`npm run build`: 153 páginas.**
- **Las 20 palabras, recontadas a mano** contra `src/data/cancionero.json` con la regla de
  `conteo.ts`: los 20 números coinciden exactamente (`amor` 34, `ojo` 17, `dios` 16,
  `corazón` 14, `diablo` 9, `fuego` 9, `perro` 8, `luz` 8, `nariz` 7, `lengua` 7, `guita` 6,
  `culo` 6, `tormenta` 5, `oro` 5, `gato` 5, `cerebro` 4, `carne` 4, `sangre` 4, `vidrio` 3,
  `lobo` 3). Lo que el jugador encuentra leyendo las letras es lo que muestra el juego.
- **33 de los 35 datos a mano** verificados uno por uno contra su ficha: el número está, la
  pregunta no agrega un hecho que la ficha no dice, no hay otra lectura razonable. Los dos que
  no, abajo.

## Hallazgos

### FIND-80 — ALTA — `MM-01` pregunta algo que `RES-05` no dice

- **Criterio:** `BR-32` punto 1 (el "hecho con ficha" tiene que respaldar exactamente lo que
  la pregunta afirma).
- **Evidencia:** `src/data/mas-o-menos.json`, `MM-01`: *"¿En qué año arrancó la banda,
  tocando por primera vez en La Plata?"* = 1976. `RES-05`
  (`INV-02-banda-cultura-estetica.md`, tabla) dice "1976 | Origen en La Plata" y, en la fila
  siguiente, "26-nov-1977 | Primera presentación oficial" (el Lozanazo, `MM-02`). La ficha
  nunca dice que tocaran en 1976: el que sabe que el Lozanazo fue el primer show marca mal
  por saber de más.
- **Arregla:** `contenido`.

### FIND-81 — ALTA — `MM-23` tiene dos respuestas según el día del año

- **Criterio:** `BR-32` punto 1; `CLAUDE.md` §6.
- **Evidencia:** `MM-23`: *"¿Cuántos años se llevan el Indio Solari y Skay Beilinson?"* = 3.
  `INV-100` `N-039` es una resta de años (1952 − 1949). Por fechas de nacimiento, la
  diferencia de edad es 3 solo entre el 15 de enero y el 17 de marzo de cada año, y 2 el
  resto: un fan que sabe los meses puede contestar distinto.
- **Arregla:** `contenido` (o `investigador`, si se ficha el día).

### FIND-82 — MEDIA — el PRD le atribuye a `RES-20` una discrepancia que no tiene

- **Criterio:** coherencia de papel (la cita de un criterio de aceptación).
- **Evidencia:** `PRD-mas-o-menos.md`, piso B: *"`RES-20` ya mostró, con la fecha de Gulp! y
  la cifra de asistentes de Olavarría…"*. Las discrepancias de `RES-20`
  (`INV-20-fuentes-primarias.md`, "Discrepancias sin promediar") son la fecha de *Gulp!*, sus
  11 o 12 temas y un typo de CMTV. Ninguna es de Olavarría. No afecta al juego.
- **Arregla:** `producto`.

### FIND-83 — MEDIA — dos invariantes de `CTR-20.11` sin test

- **Criterio:** `CTR-20.11` `i1` (los ejemplos del contrato validan) e `i2` (los rojos
  `r1`..`r14`); de paso, `i5` a medias (faltaban "misma familia" y "sujetos distintos").
- **Evidencia:** ningún archivo usaba `erroresDeInstancia` sobre `mas-o-menos.schema.json`;
  `grep -rn "MM-997\|MM-998\|MP-998\|MP-999\|comoReferencia" src/` no devolvía nada.
- **Arregla:** hilo principal.

### FIND-84 — MEDIA — la caja de referencia de un par de setlist.fm no dice fuente ni fecha

- **Criterio:** la enmienda de `BR-18` (b) acotada a `US-10` (`PRD-mas-o-menos.md`): el
  número de `en-vivo` va "en el revelado **y en la caja de referencia del par**", siempre con
  fuente y fecha en el mismo bloque.
- **Evidencia:** `partida-mas-o-menos.ts`, `cajaDeReferencia()`: nunca agregaba el bloque;
  solo `panelDeRevelado()` lo hacía. `UX-34` §3.2 tampoco lo había diseñado.
- **Arregla:** hilo principal y `experiencia`.

### FIND-85 — BAJA — el título del juego no pasa por el test de "ocho palabras"

- **Criterio:** `CNT-25` §4 (lo pide explícito); `voz-ricotera.md` §8 punto 4.
- **Evidencia:** las listas `grandes` de `src/lib/voz.test.ts` no tenían
  `masOMenos.PANTALLA_0.titulo`. Hoy no rompe nada ("Más o menos" son dos palabras), pero el
  mecanismo que pidió `contenido` no quedó.
- **Arregla:** hilo principal.

### Diferido (no es hallazgo)

- `.masomenos-referencia` usaba `border-radius: var(--radio)`, que la tabla anti-slop reserva
  para lo tocable grande; la caja no se toca.

## Lo que se verificó y está bien

- Nada toca muertes (`CNT-04`, `CNT-06`); las dos trampas de `RES-20` no entran; ningún número
  a mano copia uno derivable (`D-13`).
- El schema del repo es idéntico al bloque normativo de `CTR-20.12`.
- No hay IDs huérfanos ni colisiones; `IDEA-11` quedó marcada promovida.
- El CSS nuevo no usa hex fuera de `tokens.css`, ni barra lateral, ni pastilla 999px, ni
  transición en el número revelado. La insignia de familia es neutra.
- Botones en voseo, `aria-label` con la referencia adentro, foco en *Seguí* al revelar, el
  desplegable es `<details>` nativo.

---

## Cierre (hilo principal, 2026-09-25)

| Hallazgo | Cómo se cerró | Verificado con |
|---|---|---|
| `FIND-80` | `contenido` reformuló `MM-01`: *"¿En qué año fue el origen de la banda en La Plata?"* (`CNT-25` §1'.6) | `pozo.test.ts`, lectura contra `RES-05` |
| `FIND-81` | `contenido` reformuló `MM-23` a una resta de años sin ambigüedad: *"¿Cuántos años hay entre el año en que nació el Indio Solari y el año en que nació Skay Beilinson?"* | lectura contra `N-039` |
| `FIND-82` | `producto` corrigió la cita: las dos trampas reales de *Gulp!* y `N-020` de `INV-100` | lectura de `PRD-mas-o-menos.md` |
| `FIND-83` | `esquemas.test.ts`: `i1` lee los cuatro ejemplos **del documento** (así están "sin tocar una coma"), y `i2` son los 14 rojos con su control en verde. `pozo.test.ts` suma a `i5` misma familia y sujetos distintos. Mutación vista: sacando del schema la regla de medidas reservadas y la de `fuente`, `r2` y `r10` se ponen en rojo | `node --test src/lib/esquemas.test.ts` |
| `FIND-84` | La caja de referencia de un par de setlist.fm dice *"Según setlist.fm, consultado el …"*. **Sin el enlace, a propósito**: la página de estadísticas lista todos los conteos, y un enlace antes de responder regala la respuesta. `producto` lo dejó escrito en la enmienda de `BR-18` (b); el enlace sigue en el revelado. `experiencia` sumó el renglón a `UX-34` §3.2 y §3.3 | la vista previa, a 375 px |
| `FIND-85` | El `h1` y los tres tramos de "Más o menos" entran a la lista de "ocho palabras" de `voz.test.ts` | `node --test src/lib/voz.test.ts` |
| Diferido | `.masomenos-referencia` pasa a esquina de estampa (3px), y `UX-34` §7.2 también | `estilos.test.ts` |

**Después del cierre:** `npm test` 1439/1439, `npm run check` 0/0, build 153, validador `APTA`.
