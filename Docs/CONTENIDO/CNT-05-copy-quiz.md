# CNT-05 — Copy del quiz

- **Fecha:** 2026-08-19
- **Estado:** cerrado (`T-29`). Gate del ciclo 3 — desbloquea `T-39`, `T-41`, `T-42`.
- **Consume:** `Docs/UX/UX-01-flujo-quiz.md`, `Docs/UX/UX-02-tarjeta-resultado.md`, `BR-05`
  (`Docs/PRODUCTO/PRD-alcance-v1.md`), `CNT-02` (guía de tono), `D-14` (molinetes
  abiertos), `RES-04` (fecha de muerte del Indio, 5-jun-2026, para el tiempo verbal),
  `CTR-02.4` (schema de `testimonio`, campo `quien`).
- **No edita** `UX-01` ni `UX-02`: son de `experiencia`. Donde esos documentos ya fijan
  un texto literal (los tres botones de una palabra), acá lo confirmo y le agrego el
  largo máximo que a ellos no les tocaba definir — no lo reemplazo.

> **Parche — `T-30`, ciclo 3.** `T-29` (yo) y `T-30` (`experiencia`) corrieron en
> paralelo sobre la misma pantalla y quedaron dos choques. Corrijo `B4`: la etiqueta de
> testimonio no puede ser texto fijo con "el Indio" adentro porque no todo testimonio es
> del Indio — dos de los cinco testimonios que hoy tiene el banco son de Rocambole
> (`QZ-027`, `QZ-028`), y una etiqueta fija le atribuiría al Indio algo que dijo
> Rocambole. La convierto en plantilla con hueco `{quien}`. Agrego `B5`: el botón que
> reemplaza al auto-avance en los ítems con rótulo, que `UX-01` v2 pide porque un timer
> fijo no le sirve a la vez a un `rotuloLeyenda` de 15 caracteres y a uno de 200. Ninguna
> de las dos estaba en la lista original porque `UX-01` definió esta pantalla mientras yo
> escribía esta pieza. Todo lo demás de la hoja queda igual.

## Nota sobre los largos máximos

Los conté a mano, carácter por carácter, sin herramienta de ejecución (`D-12`). Dejo el
conteo del texto real y un margen sobre eso como tope de implementación. Pido que
`revisor` los recuente con script antes de dar `T-41`/`T-42` por cerradas — es
exactamente el tipo de número que `D-12` ya mostró que un rol sin `Bash` puede errar.

## El hilo de diseño: el molinete abre en la pantalla 0 y sigue abierto en el resultado

`D-14` pide el espíritu "molinetes abiertos" sobre todo en dos lugares. Elegí que sean
un eco literal el uno del otro: la Pantalla 0 nunca reta ("¿cuánto sabés?"), invita
igual sepas lo que sepas; y el tramo bajo de resultado —el que un sitio mal hecho usa
para humillar— cierra el círculo nombrando el molinete otra vez, para que quien sacó
2/8 lea que la puerta seguía abierta todo el tiempo, no que la cerró por no saber.
"Molinete" es palabra de estadio y de subte, no jerga ricotera: se entiende sin haber
escuchado un disco de la banda en tu vida.

---

## A — Pantalla 0 (Entrada, `UX-01`)

**A1. Título fijo (las tres variantes) — `<h1>` de Pantalla 0**
- **Texto:** `Entrá a jugar con los Redondos, sepas lo que sepas.`
- **Largo real:** 51 caracteres · **Largo máximo:** 60.
- Nunca "¿cuánto sabés realmente?": eso es la pantalla que `UX-01` prohíbe. Esta invita,
  no reta — cumple el checklist "ningún dato inventado" y "sin muro" de `CNT-02`.

**A2. Subtítulo variante A (link frío, neutro, sin contador inventado)**
- **Texto:** `Preguntas de historia, discos, letras y mitología ricotera.`
- **Largo real:** 59 · **Largo máximo:** 70.
- Describe, no desafía. Nombra las cuatro categorías de `UX-01` para que un
  desconocido entienda de qué se trata sin necesitar leer nada más.

**A3. Plantilla del desafío, variante B (reemplaza al subtítulo cuando hay `?g=...`)**
- **Texto:** `{n} sacó {p}/{t}. ¿Te la bancás?`
- **Ejemplo resuelto** ("Santi", 7/8): `Santi sacó 7/8. ¿Te la bancás?` — 30 caracteres.
- **Largo máximo:** 55, asumiendo `{n}` de hasta 20 caracteres. El tope real de `{n}` lo
  fija `armarLink`/`leerDesafio` en `desafio.ts` (`T-37`, `arquitectura`); si ese tope
  es otro, este máximo se recalcula — dejo la cuenta abierta, no la invento.
- `{t}` siempre es 8 en esta ronda (`US-01` criterio 1); si el piso de ítems cambia
  alguna vez el tamaño de ronda, este template no cambia, solo el número que entra.

**A4. Botón de arranque (todas las variantes) — ya fijado por `UX-01`, confirmo y agrego largo**
- **Texto:** `JUGÁ` (cita literal de `UX-01`).
- **Largo real:** 4 · **Largo máximo:** 12 (margen por si algún día se reemplaza por una
  variante un poco más larga; hoy no hace falta).

---

## B — Pantallas 1..N (Pregunta, `UX-01`)

**B1. Micro-copy de acierto — 4 variantes, rotan al azar sin repetir dos veces seguidas
dentro de la misma ronda de 8. Acompañan al ícono de festejo, ~1,2 s de auto-avance.**

| Variante | Texto | Largo |
|---|---|---|
| 1 | `¡Ahí la tenés!` | 14 |
| 2 | `¡Sabés, che!` | 12 |
| 3 | `¡Esa la clavaste!` | 17 |
| 4 | `¡Con la gorra bien puesta!` | 26 |

**Largo máximo (las 4):** 32.

**B2. Micro-copy de error, "que no humilla" — 4 variantes, misma rotación. Acompañan al
ícono distinto de error + la opción correcta resaltada, ~1,6 s de auto-avance.**

| Variante | Texto | Largo |
|---|---|---|
| 1 | `Casi. Va la que sigue.` | 22 |
| 2 | `No iba. Ya la vas a acertar.` | 28 |
| 3 | `Ni todo el mundo se la sabe.` | 28 |
| 4 | `Esa quedará para la próxima.` | 28 |

**Largo máximo (las 4):** 40.
- Ninguna nombra "mal", "perdiste" ni compara con la opción correcta — eso ya lo muestra
  el resaltado en verde. El texto solo acompaña, nunca marca.

**B3. Etiqueta que precede al rótulo de un ítem de leyenda**
- **Texto:** `Esto es leyenda:`
- **Largo real:** 16 · **Largo máximo:** 24.

**B4. Etiqueta que precede al rótulo de un ítem de testimonio — plantilla con hueco
`{quien}` (corregida en el parche de arriba; ya no es texto fijo con "el Indio")**
- **Plantilla:** `Lo contó {quien}:`
- **Cómo se resuelve el hueco:** `{quien}` se reemplaza, tal cual, por el valor cargado
  en `testimonio.quien` del ítem — sin agregar artículo ("el"/"la") ni recortar el
  nombre. `testimonio.quien` ya guarda el nombre propio completo (`quiz.json`: "Indio
  Solari" en tres ítems, "Rocambole" en `QZ-027` y `QZ-028`), así que la plantilla no
  necesita saber quién es: solo interpola. Sirve igual para un nombre corto que para uno
  largo porque no hay texto fijo pegado al nombre que dependa de su longitud — la
  plantilla no trunca ni ajusta espacios.
- **Ejemplos resueltos con los datos de hoy:**
  - `testimonio.quien = "Indio Solari"` → `Lo contó Indio Solari:` — 22 caracteres.
  - `testimonio.quien = "Rocambole"` → `Lo contó Rocambole:` — 19 caracteres.
- **Largo de la parte fija de la plantilla** ("Lo contó " + ":"): 10 caracteres.
  **Largo máximo de `{quien}`:** 60, el `maxLength` que ya fija el schema para
  `testimonio.quien` (`CTR-02.4`), no un tope que invente yo. **Largo máximo total
  resuelto:** 70 (10 fijos + 60 del hueco), aunque ningún caso real de hoy se acerca a
  ese techo.
- Tiempo verbal a propósito: **pretérito** ("contó"), sin cambios respecto de la versión
  anterior — sigue valiendo para los dos testigos, vivo o no. El Indio murió el
  5-jun-2026 (`RES-04`); "cuenta" en presente sonaría a que sigue narrando hoy. Para
  Rocambole (artista vivo) "contó" también es correcto porque no describe si sigue
  narrando ahora: cita algo que ya dijo, en el memoir o en una entrevista puntual — el
  pretérito no afirma que haya dejado de hablar, solo fecha la cita.
- Dónde aparece en pantalla (después de responder, junto a `testimonio.obra`) y por qué
  ahí y no antes de responder: `UX-01` v2, sección "El rótulo de leyenda y de
  testimonio".

**B5. Botón que reemplaza al auto-avance en los ítems con rótulo — cadena nueva, pedida
por `UX-01` v2 / `T-30`**
- **Texto:** `SEGUÍ`
- **Largo real:** 5 · **Largo máximo:** 12 (mismo margen que `A4`/"JUGÁ": una sola
  palabra, imperativo en vos, sin variantes).
- **Cuándo aparece:** solo en ítems con rótulo (leyenda o testimonio), después de que se
  pintan las opciones y se muestra la tarjeta de revelación (`B3` o `B4` resuelto). En
  los ítems sin rótulo no cambia nada: sigue el auto-avance de `B1`/`B2`.
- **Por qué esta palabra y no otra.** Mismo registro que "JUGÁ": imperativo corto en
  segunda persona del voseo rioplatense (no "seguir", no "continuar"), consistente con
  el resto de los botones de acción de una palabra de esta pieza. No es un texto que
  necesite explicar nada — el jugador ya leyó la tarjeta, el botón solo confirma que
  terminó de leer y quiere la próxima pregunta.
- Un solo tap, mismo gesto que responder una opción — no agrega un tipo de interacción
  nuevo a la pantalla.

---

## C — Pantalla final (Resultado, `UX-01` + `BR-05`)

Cada tramo lleva **título** (obligatorio, es lo que `T-41` busca en `dist/`) y una
**bajada** corta (recomendada, no bloqueante: si no entra en el layout, el título solo
ya cumple la verificación, pero la bajada es la que realmente cumple "dar ganas de
jugar de nuevo" que pide la tarea, sobre todo en el tramo bajo).

**C1. Tramo bajo — 0% ≤ x < 30% (`BR-05`) — el más importante de los tres**
- **Título:** `Los molinetes siguen abiertos` — 29 caracteres · máximo 40.
- **Bajada:** `Jugá las veces que quieras — acá no hay examen que aprobar.` — 59 · máximo 70.
- Nada de "flojo", "mal", "no sabés": el mensaje es que la puerta nunca se cerró.

**C2. Tramo medio — 30% ≤ x < 70%**
- **Título:** `Ya la vas agarrando` — 19 caracteres · máximo 30.
- **Bajada:** `Ya sabés más de lo que pensabas. Seguí así.` — 43 · máximo 55.

**C3. Tramo alto — 70% ≤ x ≤ 100%**
- **Título:** `Sos de la vieja guardia` — 23 caracteres · máximo 35.
- **Bajada:** `Te la sabés de memoria. Grande, campeón.` — 40 · máximo 50.

**C4. Botón primario — ya fijado por `UX-01`, confirmo y agrego largo**
- **Texto:** `COMPARTIR` — 9 caracteres · máximo 16.

**C5. Botón secundario — ya fijado por `UX-01`, confirmo y agrego largo**
- **Texto:** `JUGAR DE NUEVO` — 14 caracteres · máximo 20.

---

## D — Compartir (`UX-02`)

**D1. Texto del tuit prefil (Web Share API / respaldo de copiar, `T-42`)**
- **Texto:** `Saqué {p}/{t} en el arcade ricotero. ¿Vos cuánto sacás?`
- **Ejemplo resuelto** (7/8): `Saqué 7/8 en el arcade ricotero. ¿Vos cuánto sacás?` — 51.
- **Largo máximo:** 60. `{p}`/`{t}` son siempre un dígito (ronda de 8), así que el
  template no crece. Sumado al link de `armarLink()` (< 100 caracteres por `ADR-02`),
  el total queda cómodo debajo de cualquier límite de plataforma.

**D2. Mensaje de comparación del desafiado (pantalla de resultado, solo si llegó por
variante B) — 3 variantes según el resultado**

| Caso | Texto | Largo real | Largo máximo* |
|---|---|---|---|
| Ganó | `Vos: {p}/{t} — le ganaste a {n} ({op}/{ot}).` | 37 | 65 |
| No alcanzó | `Vos: {p}/{t} — todavía no alcanzás a {n} ({op}/{ot}). Dale una más.` | 60 | 90 |
| Empate | `Vos: {p}/{t} — empate con {n}. Van a tener que desempatar.` | 57 | 85 |

*Largo real medido con `{n}` = "Fulano" (6 caracteres); el máximo asume `{n}` de hasta
20 caracteres, misma salvedad que `A3`.
- "No alcanzó" no dice "perdiste": invita a otra vuelta, mismo espíritu que `C1`.

---

## Fuera de esta pieza, a propósito

- **El copy dentro de la imagen 1200×630 de `UX-02`** ("Copy corto de desafío" en la
  sección "Qué muestra"). El plan del ciclo (`§5` de `ORQ-plan-ciclo-3.md`) saca la
  generación de esa imagen de este ciclo porque necesita arte que no existe — escribir
  el texto ahora es escribirlo sin saber dónde entra. Cuando haya arte, se retoma.
- No toqué el enunciado, las opciones ni la `explicacion` de ningún ítem del banco:
  esa es tarea de `letras`/`T-20`/`T-21` de otros ciclos, no de esta pieza de copy de UI.

## Tabla resumen (para quien implemente `T-39`/`T-41`/`T-42`)

| ID | Pantalla | Elemento | Variantes | Largo máximo |
|---|---|---|---|---|
| A1 | Pantalla 0 | Título | 1 | 60 |
| A2 | Pantalla 0 | Subtítulo variante A | 1 | 70 |
| A3 | Pantalla 0 | Plantilla desafío variante B | 1 (template) | 55 |
| A4 | Pantalla 0 | Botón arranque | 1 | 12 |
| B1 | Pregunta | Micro-copy acierto | 4 | 32 |
| B2 | Pregunta | Micro-copy error | 4 | 40 |
| B3 | Pregunta | Etiqueta leyenda | 1 | 24 |
| B4 | Pregunta | Etiqueta testimonio | 1 (template `{quien}`) | 70 (10 fijos + 60 del hueco) |
| B5 | Pregunta | Botón "SEGUÍ" (ítems con rótulo) | 1 | 12 |
| C1 | Resultado | Título + bajada tramo bajo | 1+1 | 40 / 70 |
| C2 | Resultado | Título + bajada tramo medio | 1+1 | 30 / 55 |
| C3 | Resultado | Título + bajada tramo alto | 1+1 | 35 / 50 |
| C4 | Resultado | Botón COMPARTIR | 1 | 16 |
| C5 | Resultado | Botón JUGAR DE NUEVO | 1 | 20 |
| D1 | Compartir | Tuit prefil | 1 (template) | 60 |
| D2 | Compartir | Mensaje de comparación | 3 (template) | 65 / 90 / 85 |
