# REV-05 — "Adiviná la tapa" (`US-04`), construido entero en el ciclo 4

- **Fecha:** 2026-08-21 · **Rol dueño:** `revisor` · **Tarea:** `T-56`
- **Revisa:** `src/data/tapa.json`, `src/data/_schema/tapa.schema.json`,
  `src/lib/tapa/` (banco, copy, test), `src/scripts/partida-tapa.ts`,
  `src/pages/juegos/adivinar-la-tapa.astro`.
- **Contra:** `US-04` y `BR-04` (`Docs/PRODUCTO/PRD-alcance-v1.md`), `CTR-05`
  (`Docs/ARQ/ARQ-schema-adivinar-tapa.md`), `D-21`, `D-04`, `RES-44`
  (`Docs/INVESTIGACION/INV-44-tapas-coveralia.md`) y `.claude/rules/codigo-juegos.md`.
- **Método:** todo lo que dice "verificado" acá se corrió, no se leyó. `npm test`,
  `npm run build`, `npx tsc --noEmit`, el validador de schema sobre el banco real, y las
  imágenes abiertas una por una.

---

## Lo que se corrió, y qué dio

| Comando | Resultado |
|---|---|
| `npm test` | **77/77**, de las cuales 16 son de `US-04` |
| `npm run build` | **35 páginas**, sin error |
| `npx tsc --noEmit` | limpio |
| Schema (`jsonschema` 4.16.0, draft 2020-12) | `tapa.json` valida contra `tapa.schema.json` |

---

## Hallazgos

### `FIND-17` — La imagen de `TP-010` traía la respuesta escrita encima · **importante** · CORREGIDO

`TP-010` mostraba `la-mosca-y-la-sopa.jpg` con `encuadre: "entera"`. Esa imagen es la
**contratapa**, y el título del disco está impreso y perfectamente legible en ella —arriba,
y otra vez en el lomo—. O sea que la respuesta estaba escrita dentro de la pregunta. El ítem
además estaba rotulado `dificil`, lo que lo volvía el más fácil de los diez.

Criterio incumplido: `US-04` criterio 1 y, de fondo, lo único que este proyecto dejó
estricto — un juego que premia por leer no premia al que sabe.

**Corregido en la misma ráfaga por `contenido`:** `TP-010` pasó a
`archivo: "mosca-olla"`, `encuadre: "detalle"` — el recorte que `T-49` sacó de esa misma
contratapa mostrando la olla con el cucharón, elegido justamente para dejar afuera la lista
de temas y todo texto. La dificultad se mantuvo en `dificil`, ahora con motivo. `edicion`
declara que es un recorte de contratapa.

### `FIND-18` — `CTR-05.4` documenta una ruta que no es la que existe · **importante** · ABIERTO

El contrato compone la ruta del encuadre `detalle` como
`public/tapas/<archivo>-detalle.jpg`. `T-49` los generó en
`public/tapas/detalle/<nombre>.jpg` —subcarpeta, y el nombre no se deriva del slug del
disco—. El código que corre (`rutaImagen()` en `src/lib/tapa/banco.ts`) implementa la ruta
real, y el test *"toda imagen del banco real existe de verdad en `public/`"* lo verifica,
así que **el juego funciona**: lo que está desactualizado es el texto del contrato y el
script de verificación de `CTR-05.9`.

Deja de ser latente desde que `TP-010` usa `detalle`. Dueño: `arquitectura`. Pedido ya
escrito en `Docs/SUGERENCIAS/CNT-para-arquitectura-detalle-en-us04.md`.

### `FIND-19` — El contrato pide precargar el ítem siguiente y no se precarga · **menor** · ABIERTO

`CTR-05.1` fija una ventana de precarga de "el ítem en juego + 1". `partida-tapa.ts` carga
solo la imagen del ítem actual (`loading="eager"`). No rompe nada: es una desviación de
rendimiento, y con imágenes de 16 a 33 KB el costo real es chico. Dueño: quien retome el
código, o `arquitectura` si prefiere relajar el contrato.

### `FIND-20` — `TP-002` mezclaba un hecho con una afirmación reportada · **menor** · CORREGIDO

El ítem afirmaba en una sola oración, sin rótulo, que el alfabeto de *Oktubre* fue "en
homenaje a la Revolución Rusa". El alfabeto inventado con la B espejada está verificado
(`RES-31`); el homenaje figura en `INV-02` como *reportado, consistente en varias fuentes*,
que no es lo mismo. Iba sin matiz y como parte del hecho.

**Corregido:** `contenido` le puso rótulo de `leyenda` a esa afirmación, con el texto que
dice de dónde sale y qué le falta, y sumó `RES-06` a las fuentes. Es exactamente lo que
`D-14` pide: la leyenda entra, rotulada.

### `FIND-21` — La atribución de *Lobo suelto* y *Cordero atado* es más ancha que el enum · **menor** · ABIERTO

`TP-007` y `TP-008` declaran `credito.autor: "Rocambole (Ricardo Cohen)"` porque es el único
valor que el enum de `CTR-05.4` admite. Pero `RES-40`/`RES-36` dan el crédito de tapa de los
dos volúmenes como conjunto —*"Visiones: Rocambole, Semilla y Meroyuela"*— y `RES-44` anota
que el arte del frontal de *Cordero atado* es de Semilla Bucciarelli.

No es un dato falso (Rocambole es uno de los tres, y `RES-06` sostiene que hizo todas las
portadas desde 1978), pero es más angosto que lo que se sabe. Los dos ítems llevan
`notaInterna` marcándolo. Se cierra cuando `arquitectura` amplíe el campo para créditos
compartidos. Dueño: `arquitectura`, después `contenido`.

---

## Lo que se verificó y está bien

- **El piso de `US-04` está cumplido:** 10 ítems en `estado: "listo"`, contados por script.
  Reparto de dificultad 3 fáciles / 3 media / 4 difícil, sobre diez discos distintos.
- **`BR-04`:** las diez preguntas tienen exactamente cuatro opciones, una sola correcta y
  sin textos repetidos. Verificado sobre el banco, no a ojo.
- **`D-21`, lo único estricto:** ninguna imagen `listo` quedó en `auditoria: "no
  determinable"`. Nueve son *"coincide con la original, sin marcador que lo pruebe"* y una
  es *"reedicion confirmada"*, que el contrato admite porque declara su edición.
- **El crédito a Rocambole llega a la pantalla en cada pregunta**, en el pie de la imagen, y
  el banco no carga si un ítem no lo trae. Confirmado también en el HTML generado.
- **No se filtra nada al navegador:** el `alt` de la imagen no nombra el disco, y ni
  `notaInterna` ni las notas de distractor aparecen en el HTML del build. Es el precedente
  de `FIND-16` del quiz, y esta vez se cuidó de entrada.
- **El par *Lobo suelto* / *Cordero atado*** —que `CTR-05.3` marcaba como riesgo de moneda al
  aire— resultó bien distinguible: una es blanco y negro y la otra azul sobre naranja.
  Abiertas las dos imágenes para comprobarlo.
- **Zona del pulgar:** los botones de opción heredan `min-height: var(--toque-min)`.
- **`.claude/rules/codigo-juegos.md`:** isla única, cero datos escritos en el componente
  (todo sale de `tapa.json`), sin backend.
- **Trazabilidad:** las ocho fichas `RES-` que cita el banco existen; los IDs `TP-001` a
  `TP-010` son correlativos, sin huecos ni repetidos.

---

## Veredicto

**`US-04` está listo.** Los dos hallazgos que tocaban lo que el jugador ve —la respuesta
visible en la imagen y el hecho sin rotular— se corrigieron y se volvió a correr todo. Los
tres que quedan abiertos son de contrato y de atribución: ninguno cambia lo que pasa en
pantalla, y los tres tienen dueño.
