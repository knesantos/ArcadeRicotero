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