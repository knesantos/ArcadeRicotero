# REV-15 — El ciclo 16, verificado contra sus criterios

> Revisado el **2026-09-24** por `revisor` en `T-280`, con contexto fresco y sin haber armado
> ninguna de las piezas. **Pegado en esta ruta por el hilo principal**, como manda el README
> de esta carpeta: `revisor` es read-only. El agente devolvió el veredicto y los hallazgos
> estructurados pero no el texto de la ficha, así que la redacción de este archivo es del
> hilo principal; **los hallazgos, las evidencias y los dueños son los del revisor, copiados
> sin cambiar el sentido.**
>
> **Qué se verificó:** las tareas `T-261` a `T-285` de `ORQ-plan-ciclo-16.md` (§2, §2.3 y
> §2.4) contra su columna "verifica con"; lo que dejó pendiente `T-252` del ciclo 15; y las
> tres imágenes de `public/sprites/`. **No entran** `T-286`..`T-288` ("Completá la letra"
> también sale del conteo, precisión de `D-46`): se sumaron al plan mientras esta revisión
> corría.

## Lo que pasó

- **`npm test`: 1081 de 1081.** Eran 673 al abrir el ciclo.
- **`npm run check`: 0 errores, 0 avisos.** `tsc --noEmit`: 0.
- **`npm run build`: 152 páginas.**
- **Validador del instanciador: `APTA`, 0 errores, 2 avisos**, los dos esperados que ya
  declara `CLAUDE.md` §7.
- **Auditor de paleta: 0.** Los tres atlas usan solo las 15 `--px-*` de `tokens.css`, con
  alfa binario. Los 30 tests de atlas, sala y contraste, en verde.
- **El barrido de vocabulario retirado de `T-252` sale limpio**: todo lo que devuelve son
  enmiendas rotuladas o citas históricas, ninguna regla viva.
- **Los seis nombres de `CNT-21` pasan las siete reglas de `voz.test.ts`**, revisados a mano
  porque el test no mira el dato.
- **`BR-29` reparte las condiciones de `BR-25` sin celdas vacías**, con la tolerancia en
  cuadros y no en adjetivos.

## Los hallazgos

| ID | Gravedad | Qué | Dueño |
|---|---|---|---|
| `FIND-71` | **ALTA** | **`BR-30` da por cumplido algo que el código no hace.** La fila de `US-02` dice, en presente y marcada como enmendada el 2026-09-24: *"Media/Difícil = tercios sobre los 87 restantes"*. Pero `src/lib/en-vivo.ts:139` (`repartirEnVivo`) sigue poniendo `media` a todo lo que no es Fácil y `dificil` solo a lo que no figura en el conteo: la regla vieja, que el propio `BR-30` (líneas 1600-1610) llama defecto porque *"un reparto 8/82/5 no escalona nada después del octavo ítem"*. `repartirEnTercios()` existe en el mismo archivo (:199) y solo la usa `scripts/generar-por-la-letra.mjs`. Y `CTR-19.14` punto 6 (`ARQ-schema-recitales.md:1241-1243`) todavía lo lista como abierto, con "mientras tanto rige el paso 5". **Los tres documentos no dicen lo mismo sobre qué rige hoy**, y ningún test cubre la distribución nueva | `arquitectura` (el contrato y el paso de `CTR-19.5`), con `producto` confirmando la redacción; el código, el hilo principal |
| `FIND-72` | BAJA | `mundo.ts` implementa dos casos de "el empujón no arranca" que `CTR-16.10.5` no escribe: una caja que anda y decidió apoyar acá, y una caja que es el apoyo de otro arranque del mismo subpaso (`mundo.ts:833-840`, `:874-878`). El código está bien —los agregó la corrección de `T-272` para cerrar un `ALTA`—; lo que falta es el traspaso para que el contrato los diga | hilo principal: traspaso a `arquitectura` |
| `FIND-73` | BAJA | `src/lib/escalonar.ts:61-62` dice que sin opciones *"`US-07` no se entera"*, pero `src/lib/por-la-letra/ronda.ts` llama a `armarRonda()` con `cupoPrimerNivel`: `US-07` usa esa opción desde `T-285` | hilo principal |
| `FIND-74` | BAJA | El traspaso y el reporte de `T-277` dicen que el ladrillo en `[6,7]` de `NIV-03` *"tampoco sirve ahí, medido"*, midiendo con la traza de tres turnos que eligió el solucionador. Con la de dos turnos, en la que Skayboy frena contra el ladrillo, sí sirve. `[9,7]` fue una elección entre dos lugares válidos, no una obligación de la medición | `experiencia` y el hilo principal |
| `FIND-75` | BAJA | El comando (3) de `CTR-09.11` usa `sirveComoVerso()`, y el generador real usa `ventanaValida()` desde `CNT-11` v7. Corrido hoy marca "DESALINEADO" unos 70 de 88 ítems aunque `por-la-letra.json` esté idéntico a `HEAD`. No es de este ciclo, pero sigue sin traspaso | hilo principal: traspaso a `arquitectura` |
| `FIND-76` | BAJA | `CTR-09.11`, enmendado por `T-284`, dice que los casos p0-p7 van junto a `esquemas.test.ts`; están en `src/lib/por-la-letra/banco.test.ts`. Corren y se ponen en rojo bien: lo que no coincide es dónde dice el contrato que están | hilo principal: traspaso a `arquitectura` |
| `FIND-77` | BAJA | Las guardas 5 y 6 del auditor de la isla no cazan dos evasiones obvias: `!import.meta.env.DEV ? … : null` y `new URL(document.URL).searchParams.get('nivel')`. La isla real no usa ninguna; la guarda no las detectaría | hilo principal |

## Lo que no encontró, que también es resultado

- **Ningún `ALTA` de código.** El único `ALTA` es de coherencia entre un documento y lo que
  hace el código, no de un comportamiento roto.
- **Nadie escribió en carpeta ajena**, y ningún agente tocó `ESTADO.md` ni `Docs/ORQ/`.
- **Ningún hex fuera de `tokens.css`, ninguna pastilla de 999px, ninguna barra lateral**,
  ningún anglicismo ni infinitivo en botón en lo que se agregó.
- **Ningún script lee setlist.fm**, y ninguna lista de temas de setlist.fm quedó guardada
  (`RES-73.1`).

## Lo que queda sin comando, y quién lo verifica

| Qué | Quién |
|---|---|
| **La partida en el teléfono**: dos personas a la vez (`BR-25` a), afinar la gravedad y la velocidad, y con eso `deDos: true` y los niveles a `listo` | **el usuario** |
| Que ganar un nivel se vea: hoy la sala no tiene dibujo de puerta abierta (`Docs/SUGERENCIAS/HILO-para-experiencia-ganar-no-se-ve-la-puerta-no-tiene-dibujo-abierto.md`) | `experiencia`, y después el hilo principal |

## Veredicto

**El ciclo 16 cierra en estado sólido, con un `ALTA` real (`FIND-71`) y seis `BAJA` de
arrastre**, casi todas traspasos que faltan escribir. La verificación mecánica está entera en
verde. **Nada bloquea salvo `FIND-71`**, y lo que queda del juego en sí es del usuario: jugarlo
en un teléfono.

## Segunda pasada — la ráfaga 4

> Verificada el mismo **2026-09-24**, por el mismo `revisor`, **en el disco y no en lo que
> los roles reportan haber hecho**. Pegado por el hilo principal. Alcance: `FIND-71` a
> `FIND-77` de `REV-15`, y `T-286` a `T-294` de `ORQ-plan-ciclo-16.md` §2.4/§2.5 contra su
> columna "verifica con".

**De los siete hallazgos de `REV-15`: los siete cerrados y verificados en disco.**

| ID | Estado | Evidencia |
|---|---|---|
| `FIND-71` | ✅ cerrado | `src/lib/en-vivo.ts:150` (`repartirEnVivo`, paso 5) ya no pone `media` a todo lo que no es Fácil: llama a `repartirEnTercios(resto, conteo)`. `catalogo.test.ts` espera `{facil:8, media:8, dificil:14}` y pasa. `en-vivo.test.ts` t16 (tercios sintéticos, empate en la frontera, "nunca un Fácil de más") y t17 (pozo real, 8/56/31) pasan — 62/62 en el archivo. `CTR-19.5`, `CTR-19.13` y `CTR-19.14` en `ARQ-schema-recitales.md` dicen lo mismo que el código; ya no queda el punto 6 como abierto |
| `FIND-72` | ✅ cerrado | `CTR-16.10.5` en `ARQ-schema-niveles.md` suma los puntos 5, 6 y 7 de "el empujón no arranca" (la caja que decide apoyarse y la que es apoyo de otro arranque), con cita a `mundo.ts` y `FIND-72` |
| `FIND-73` | ✅ cerrado | `src/lib/escalonar.ts:65-66`: el comentario ya dice que `US-02` y `US-07` la llaman con `cupoPrimerNivel`, y remite a `FIND-73` |
| `FIND-74` | ✅ cerrado | `Docs/UX/UX-31-los-seis-niveles.md` §"NIV-03" y §9 responden el traspaso de `T-277`: `[9,7]` fue elección entre dos lugares válidos, no obligación de la medición del ladrillo en `[6,7]` |
| `FIND-75` | ✅ cerrado | `CTR-09.11` comando (3) en `ARQ-schema-adivinar-por-la-letra.md` ahora importa `filtro.ts` en vez de reimplementar `sirveComoVerso()`. Corrí el comando tal cual está en el archivo: `OK: los 88 items se rearman igual desde el cancionero (filtro v7, el banco dice v7)` |
| `FIND-76` | ✅ cerrado | El contrato dice ahora "Están en `src/lib/por-la-letra/banco.test.ts`, y ahí se quedan" (con el motivo), en vez de prometer que van junto a `esquemas.test.ts` |
| `FIND-77` | ✅ cerrado | `motor.test.ts` reglas 5 y 6 (líneas ~376-388) ya cazan alias de `fetch`/`loadSprite`, `document.URL`/`documentURI`/`baseURI`/`navigation`/`getEntriesByType`/`searchParams` fuera de `import.meta.env.DEV ?`, y la condición negada (`!import.meta.env.DEV ?`). 92/92 tests del archivo en verde, con los casos rojos declarados en el propio código |

**De las nueve tareas (`T-286`..`T-294`): las nueve cumplen su columna "verifica con".**

- `T-286` (`producto`): `PRD-alcance-v1.md:1580` marca la fila de `US-03` en `BR-30` "del
  conteo", y `§"BR-03: el contexto sigue al nivel"` está agregada — ✔.
- `T-287` (`arquitectura`): corrí el comando de `ajv` del propio contrato
  (`ARQ-schema-completar-letra.md`) sobre `src/data/letra.json` — los 10 casos c0-c9 dan lo
  esperado, incluida la línea final `"los 10 casos dan lo esperado"` — ✔.
- `T-288` (hilo principal): `npm test` 1161/1161. `letra.json` en disco: 1404 ítems, 19
  `listo` (11 Fácil / 4 Media / 4 Difícil), igual a lo reportado — ✔.
- `T-289` (`experiencia`): `UX-32-ganar-se-ve.md` cita `UX-27`, `BR-23`, `BR-24` y responde
  el traspaso de la puerta — ✔.
- `T-290` (hilo principal): auditor de paleta ahora sobre **4** PNG (0 en regla, sumó
  `sala.v2`), `sala.test.ts` trae el test "la puerta abierta es la cerrada sin la hoja… y
  adentro del marco no queda nada" (11/11 en verde), `escena.test.ts` 52/52. **No pude
  verificar la "captura en el navegador"**: no tengo herramienta de navegador en esta
  sesión; solo verifiqué código, tests y el PNG estático con `Read`.
- `T-291` (`arquitectura`): `rg -c "T-291"` da 13/2/10/3 en `ARQ-schema-recitales.md` /
  `ARQ-schema-niveles.md` / `ARQ-schema-adivinar-por-la-letra.md` /
  `ARQ-schema-adivinar-tema.md`, igual a lo que promete el traspaso — ✔. La segunda vuelta
  de `T-291` (corrección de la nota `MEDIA` sobre Consecuencias y "Qué NO decide", y del
  conteo `BAJA` 12→13) también está en disco — ✔.
- `T-292` (hilo principal): `npm test` en verde; el comentario de `en-vivo.ts:1-16` ya
  nombra `US-03` con su cita a `D-46`/`T-288` y dice "tres lugares" en la línea 210,
  resolviendo los dos `BAJA` que había dejado abiertos — ✔.
- `T-293` (hilo principal): `motor.test.ts` reglas 5/6 (ver `FIND-77`) — ✔. Los dos `BAJA`
  que deja pendientes el propio reporte son opcionales, no bloquean.
- `T-294` (`experiencia`): `UX-31-los-seis-niveles.md` §"NIV-03" y §9 — ✔ (mismo archivo
  que `FIND-74`).

**Lo que no encontré:** ningún hallazgo `ALTA` ni `MEDIA` nuevo. Ningún placeholder (el
`TODO`/`XXX` que devolvió el barrido son la palabra española "todo" y un diagrama ASCII en
`UX-31`, no restos de relleno). Ninguna cita a un ID que no exista (`D-44`..`D-47`,
`BR-30`, `BR-31`, `CTR-04.14`, `CTR-19.16` están escritos en sus documentos). Nadie
escribió en `ESTADO.md` ni `Docs/ORQ/` desde estas tareas.

**Verificaciones corridas:**
- `npm test`: **1161 de 1161**, 0 fallos.
- `npm run check`: **0 errores, 0 avisos** (15 *hints* de Astro sobre `is:inline`, que ya
  existían y no son del alcance de esta ráfaga).
- `npm run build`: **152 páginas**, sin error.
- `node --experimental-strip-types scripts/auditar-paleta-pixel.mjs`: **"Auditados 4 PNG
  contra 15 tintas --px-\* en tokens.css: todo en regla."**
- Validador del instanciador: **APTA, 0 errores, 2 avisos** (los dos esperados por
  `CLAUDE.md` §7).

**Límite declarado de esta pasada:** no tengo herramienta de navegador disponible en esta
sesión, así que la "captura en el navegador" que pide `T-290` en su columna "verifica con"
quedó verificada solo por código y tests, no por una captura real. Si eso importa para
cerrar `T-290` del todo, falta ese paso — se lo puede correr el usuario o el hilo principal
con `npm run dev` y los pasos que ya deja escritos el reporte de `T-290`.

## Veredicto

**La ráfaga 4 cierra limpia.** Los siete hallazgos de `REV-15` (`FIND-71`..`FIND-77`) están
cerrados en disco, no solo reportados como cerrados, y las nueve tareas (`T-286`..`T-294`)
cumplen su columna "verifica con" del plan. No hay hallazgo nuevo que abrir. Lo único que
queda sin verificar por esta pasada es la captura en el navegador de `T-290`, por límite de
herramientas de esta sesión — no por falla de lo entregado.
## Tercera pasada — la ráfaga 5 (D-47)

> Verificada el **2026-09-24** por `revisor`, en el disco y no en lo que los reportes de `T-300`
> a `T-303` dicen haber hecho. Alcance: `D-47` punto por punto, `BR-31`, `UX-33`, `CTR-16.4`,
> `CTR-16.11`, `CTR-15.7`, `CTR-15.8`, `ADR-10`, `CNT-22`, y `T-296`..`T-303` de
> `ORQ-plan-ciclo-16.md` §2.6 contra su columna "verifica con". Numeración desde `FIND-78`
> (`FIND-77` fue el último usado, `REV-15`).

**Verificaciones corridas:**
- `npm test`: **1329 de 1329**, 0 fallos (incluye 117/117 en los archivos propios de la ráfaga:
  `niveles.test.ts`, `esquemas.test.ts`, `avance.test.ts`, `atlas.test.ts`, `sala.test.ts`,
  `pantalla.test.ts`, `modo-pantalla.test.ts`).
- `npm run check`: **0 errores, 0 avisos** (15 *hints* de Astro `is:inline`, preexistentes).
- `npm run build`: **152 páginas**, sin error.
- `node --experimental-strip-types scripts/auditar-paleta-pixel.mjs`: **"Auditados 7 PNG contra
  15 tintas --px-\* en tokens.css: todo en regla."**
- Validador del instanciador: **APTA, 0 errores, 2 avisos** (los dos esperados por `CLAUDE.md` §7).
- Leídos con la herramienta de imágenes los PNG publicados (`skayboy.v2`, `poligirl.v2`,
  `sala.v3`) vía su header PNG y su fuente `.txt`; el baile y los dos coleccionables se
  verificaron leyendo la grilla ASCII, que es la fuente de verdad que imprime el PNG.

### D-47, punto por punto

1. **Pantalla completa con controles superpuestos, medio transparentes, disposición del
   horizontal, sin scroll.** `ADR-10` está construido según su propio contrato: `pantalla.ts`
   (`encuadre()`, `cajaDelArea()`) es puro y pasa sus 6+ casos; `modo-pantalla.ts` no tiene un
   solo `async`/`await` (verificado: `esperasEn()` da `[]`); las tres puertas de salida existen;
   `skayboy.css` usa `--mando-relleno`/`--sello-relleno` con `color-mix(..., transparent)` para
   el relleno y `border: var(--anillo) solid var(--papel)` + `box-shadow: inset ... var(--fondo)`
   para el doble anillo opaco — exactamente el mecanismo de `UX-33 §1.4`, sobre el par
   `--papel`/`--fondo` que ya cubre `contraste.test.ts`. `.pantalla-completa` nace
   `display: none` y solo pasa a `block` en los media queries de horizontal (`UX-33 §1.9`).
   **Pero hay un hueco real, confirmado por mutación** (ver `FIND-78`).
2. **Los seis niveles en fila, avance guardado.** `src/data/skayboy.json` trae `NIV-01`..`NIV-06`.
   `avance.ts` implementa las siete funciones de `CTR-16.11.3`; `escena.ts` usa
   `siguienteDeLaFila()` y `esElUltimo()`; la isla llama `cargarAvance()` al arrancar y
   `guardarPasado()` en el cuadro en que `marcarVictoria()` es verdadero (no al tocar "seguí"),
   tal cual pide `CTR-16.11.1`. Cubierto por `avance.test.ts`, en el `npm test` general.
3. **Victoria bailada, cada uno el suyo, sin gestos de pareja.** Leídas las grillas ASCII de
   `baila 0..3` en `skayboy.txt` y `poligirl.txt`: son dos coreografías completamente distintas
   (molino de guitarrista vs. twist), ningún cuadro comparte pose, ninguno toca al otro, ninguno
   se desplaza de la celda. Los dos JSON publicados (`skayboy.v2.json`, `poligirl.v2.json`)
   declaran `baila: {fila:5, cuadros:4, porSegundo:8, repite:true}` idénticos entre sí — paridad
   de cuadros cumplida (`BR-23` punto 2, `CTR-15.7`). `atlas.test.ts` lo prueba y pasa.
4. **Guitarras para Skay, cigarrillos para Poli, misma cantidad por nivel.** Medido en
   `src/data/skayboy.json`: `NIV-01` 1/1, `NIV-02` 1/1, `NIV-03` 2/2, `NIV-04` 2/2, `NIV-05` 2/2,
   `NIV-06` 2/2 — total 10 y 10, paridad exacta en los seis. El schema está en
   `contratoVersion: 3`, con `"g"` → `{"tipo":"tesoro","para":["skayboy"]}` y `"-"` →
   `{"tipo":"tesoro","para":["poligirl"]}`, tal cual `CTR-16.4`. La sala dibuja una masa curva
   para la guitarra y una línea fina en diagonal para el cigarrillo (`UX-33 §3.1`/`§3.3`),
   verificado en `sala.txt`. `niveles.test.ts` trae los casos E9/E10 (incluido el `🔴 E10` al
   revés que pidió una revisión anterior) y pasan.

### Hallazgos

| ID | Gravedad | Qué | Evidencia | Dueño |
|---|---|---|---|---|
| `FIND-78` | **MEDIA** | **ADR-10.2/ADR-10.6 ("nunca se pide la pantalla completa sobre el canvas") no está verificado contra la isla real, solo contra el texto de `modo-pantalla.ts`.** El `fichin` que `escucharPantallaCompleta()` le pasa a `montarPantallaCompleta()` sale de `document.querySelector<HTMLElement>('.fichin')` en `partida-skayboy.ts:556`, y esa línea no la mira ningún test. Mutación confirmada: cambié esa cadena a `'canvas'` (de modo que `requestFullscreen()` se termine pidiendo sobre el `<canvas>` real, el caso que `ADR-10.2` prohíbe con nombre — "las teclas, el botón de salir y el pie de homenaje dejan de verse") y corrí `motor.test.ts` + `modo-pantalla.test.ts` + `estilos.test.ts`: **169/169 en verde**, sin un solo rojo. Restauré el archivo original después (mismo md5 que antes de mutar). El auditor de texto (`problemasDePantallaCompleta()`) solo mira la sentencia que contiene `requestFullscreen`, que en el código real siempre dice `fichin`/`contenedor` — nunca la línea, separada, que decide qué elemento del DOM *es* `fichin`. Es el mismo hallazgo que el propio reporte de `T-301` deja pendiente (su MEDIA), y lo confirmo de forma independiente sobre el árbol actual, no sobre lo reportado. | `hilo principal`: agregar una regla en `motor.test.ts` (o un helper puro) que ate el selector real de `fichin` a `.fichin`, con sus casos rojo con `'canvas'`, `'#juego'` y `'.recorte'` — tal como el propio `T-301` ya lo dejó escrito como arreglo sugerido |
| `FIND-79` | BAJA | `.contador-etiqueta` (`src/styles/skayboy.css:272`) sigue con `justify-content: center` y no `safe center` (o alineado a un costado). Por `UX-33 §2.5` el número junto a cada personaje tiene que ser legible dentro de la caja fija de `ETIQUETA_DEL_CONTADOR` (96×16 nativos). Confirmado en disco que la regla no cambió desde que `T-302` reportó esto como pendiente: con `font-size` por encima de ~10,3 px CSS (p. ej. `5cqw` en vez de `3.75cqw`, o el mínimo de fuente que algunos navegadores fuerzan), el texto centrado se recorta por las dos puntas en vez de quedar legible de un lado. No bloquea con la configuración por defecto del sitio. | `hilo principal`: `justify-content: safe center` (o alinear a un costado) y fijar el `font-size` exacto en el auditor de la hoja con la medida del navegador anotada, como ya lo dejó escrito `T-302` |

### Lo que no encontré

- **Ningún dato falso, ningún placeholder, ningún ID huérfano.** `D-44`..`D-47`, `BR-31`,
  `CTR-16.4`, `CTR-16.11`, `CTR-15.7`, `CTR-15.8`, `ADR-10`, `CNT-22` están escritos y son
  consistentes entre sí en los puntos que crucé.
- **Ningún hallazgo nuevo de código** más allá de los dos de arriba: los cuatro reportes
  (`T-300`..`T-303`) describen con precisión lo que arreglaron y lo que dejaron pendiente, y
  mis propias mediciones (byte a byte en los PNG, conteo de caracteres en el dato, mutación del
  selector, lectura de las grillas del baile) coinciden con lo que cada uno reportó.
- **Ninguna mención de "los fans"/"los usuarios", ningún anglicismo, ningún botón en
  infinitivo, ningún hex fuera de `tokens.css`, ninguna pastilla de 999px** en lo agregado por
  esta ráfaga — cubierto por `voz.test.ts` y `estilos.test.ts`, en el `npm test` general.
- **No verifiqué con el dedo en un teléfono real** (ni Android ni iPhone): esa prueba, que es la
  que `ADR-10` marca como la que manda, sigue siendo del usuario (`D-47` consecuencia 3, y ya lo
  dice `ADR-10` "cómo se verifica"). Tampoco abrí un navegador: todo lo de arriba es código,
  tests y lectura de archivos.
- **Los BAJA que cada tarea dejó pendientes por su cuenta** (el commit conjunto de `T-300`, el
  redondeo del "rodeo de 80 cuadros" de `T-303`, la ampliación del regex de `T-302` punto 2) no
  son hallazgos nuevos: los reportes los describen bien y no cambian ningún veredicto, así que
  no les pongo `FIND` propio — quedan donde cada tarea los dejó.

### Veredicto

**La ráfaga 5 cumple `D-47` en el disco, con un hueco real de verificación (`FIND-78`, MEDIA)
y un defecto visual de borde (`FIND-79`, BAJA), ninguno de los dos nuevo: los dos ya estaban
autorreportados por las tareas que los dejaron, y esta pasada los confirma de forma
independiente en vez de darlos por buenos.** Los cuatro criterios centrales de `D-47` —pantalla
completa sin romper el scroll, seis niveles en fila con avance guardado, victoria donde cada
uno baila lo suyo sin gesto de pareja, y guitarras/cigarrillos parejos por nivel— están
construidos, probados y coinciden con lo medido en disco. Nada bloquea el cierre de la ráfaga;
`FIND-78` sí merece una tarea antes de dar por cerrado `ADR-10.6` como "verificado por
máquina", porque hoy no lo está para el caso que más importa (que la isla real pida la
pantalla completa sobre el contenedor y no sobre el canvas).

### Cierre de `FIND-78` y `FIND-79` (hilo principal, 2026-09-24)

> Pegado por el hilo principal, que es el dueño de los dos. No es una pasada del `revisor`:
> es lo que se hizo con lo que la pasada dejó abierto, con su evidencia.

- **`FIND-78` — cerrado.** `src/lib/skayboy/motor.test.ts` suma `problemasDelMontaje()`, que lee
  la isla real: el `fichin` que recibe `montarPantallaCompleta(` tiene que salir de
  `document.querySelector('.fichin')` (atajo, clave con otro nombre o consulta en línea), el
  montaje tiene que ser uno solo, y la función que lo contiene tiene que llamarse al nivel del
  módulo. Diez rojos sobre un fuente de referencia (`'canvas'`, `'#juego'`, `'.recorte'`, la
  consulta del canvas en línea, `fichin: canvas`, sin `fichin`, sin llamada, la llamada escondida
  en otra función, sin montaje, dos montajes). **Y los rojos sobre la isla de verdad**, mutada en
  el lugar y restaurada byte a byte: cambiar el selector de `partida-skayboy.ts:556` a `'canvas'`,
  `'#juego'` o `'.recorte'`, o borrar `escucharPantallaCompleta();` de la línea 570, hace caer el
  test en los cuatro casos.
- **`FIND-79` — cerrado.** `.contador-etiqueta` pasa a `justify-content: safe center`: si el
  texto no entra, se corta de un lado y el número, que va primero, se sigue leyendo.
- **Visto en el navegador** (dev, 844×390): la pantalla completa sin scroll (la página mide lo que
  la ventana), el área a ×2, las seis teclas y el pie de homenaje adentro; ganar `NIV-01` jugando
  con las teclas muestra los dos bailando en su lugar, «1 guitarra» y «1 cigarrillo», el aviso
  «Las dos puertas, abiertas.», guarda `{"pasados":["NIV-01"]}` en `arcade.skayboy.avance`, y el
  toque lleva a `NIV-02` sin salir del modo; el botón y `Escape` sacan del modo. El panel del
  navegador estaba oculto y no daba cuadros, así que el juego se corrió en un marco con los
  cuadros a reloj: la lógica es la misma, el ritmo no se midió.
- `npm test` **1341/1341**, `tsc` 0, `npm run check` 0/0.
