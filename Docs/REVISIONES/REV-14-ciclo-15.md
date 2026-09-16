# REV-14 — Las cuatro entregas del ciclo 15, verificadas

> Revisado el **2026-09-16** por `revisor`, con contexto fresco y sin haber armado ninguna de
> las piezas. Pegado en esta ruta por el hilo principal, como manda el README de esta carpeta:
> `revisor` es read-only, devuelve hallazgos y no escribe archivos.
>
> **Qué se verificó:** `US-09` y `BR-23`..`BR-28` (`producto`), `ADR-08` y `CTR-15`..`CTR-17`
> (`arquitectura`), `UX-27`..`UX-30` (`experiencia`) y `ORQ-plan-ciclo-15.md` (`orquestador`),
> contra `BR-16`, `D-12`, `D-38`..`D-42`, `CLAUDE.md` §3, §7 y §8, y los rangos reservados en
> `Docs/IDS.md` del 2026-09-16.
>
> **Método declarado por el revisor:** leyó el criterio antes que la pieza en los cuatro casos
> —`BR-16` antes de `US-09`, las `D-XX` antes de las entregas, los `CTR-` antes de los `UX-`—
> para no contaminarse con la intención de quien escribió. Y corrió las dos verificaciones
> antes de leer nada, para reportar el estado real del árbol y no el que las entregas suponen.
>
> **Once hallazgos, cuatro de severidad ALTA. Todos son de coherencia entre roles; ninguno es
> de calidad interna de una pieza.** Eso es exactamente lo que se espera de cuatro roles que
> escribieron el mismo día sin verse, y es la razón por la que esta revisión existe.
>
> > **Corrección del 2026-09-16, `FIND-67`.** Esta ficha decía "cinco de severidad ALTA" y su
> > propia tabla marca **cuatro** (`FIND-55`, `FIND-56`, `FIND-57`, `FIND-59`). El error venía
> > del reporte del revisor, que contaba `FIND-58` entre las altas y lo tabulaba como MEDIA, y
> > el hilo principal lo copió al pegar sin cruzarlo contra la tabla. Lo levantó el propio
> > revisor en su segunda pasada. Queda anotado y no borrado: **una ficha de revisión que se
> > corrige en silencio no sirve para revisar nada.**

## Lo que pasó

- **`npm test`: 578 pruebas, 0 fallos, exit 0.**
- **Validador del instanciador: APTA, 0 errores, exit 0** (dos avisos — ver `FIND-65`).
- **Propiedad de carpetas: nadie escribió en carpeta ajena.** Los nueve traspasos fueron a
  `Docs/SUGERENCIAS/` con el nombre de rol correcto. `DECISIONES.md` e `IDS.md` los tocó el
  hilo principal, y los tres roles declararon no haber tocado `ESTADO.md`.
- **Rangos de ID: nadie se salió del suyo.** `producto` `US-09`/`BR-23`..`BR-28`,
  `arquitectura` `ADR-08`/`CTR-15`..`CTR-17`, `experiencia` `UX-27`..`UX-30`, `orquestador`
  `T-226`..`T-250` — los veinticinco, ninguno de más.
- **`BR-16` cumplida de verdad:** `US-09` tiene nueve criterios Given/When/Then verificables y
  piso fijado (seis niveles **listos**, 2/2/2, con `BR-25` definiendo qué es "listo"). La
  promoción se sostiene y el ciclo se puede ejecutar.
- **No hay un solo ID citado que no exista en disco.** Los únicos que no existen —`CNT-18`..
  `CNT-20` y `RES-70`— están citados como **salida** de tareas del plan, dentro de rango
  reservado: no son citas huérfanas.
- **Citas verificadas al azar:** `RES-64.3` = Panamá beige (`INV-60`:195) ✔; `RES-37` = Gulp!
  `#DF5744`/`#E6E4BD` (`INV-07`:175, y están en `tokens.css`:70-71) ✔.
- **Sin placeholders** (TODO, TBD, lorem, "pendiente") en las cuatro entregas.
- **El §6 "Qué NO entra" del plan existe, es específico**, y dice con todas las letras que
  `US-09` no queda cumplida al cerrar el ciclo. Eso es lo que hace que esto sea un ciclo y no
  un deseo.

## Los hallazgos

| ID | Qué | Criterio incumplido | Evidencia | Sev. |
|---|---|---|---|---|
| `FIND-55` | **Dos geometrías vigentes para la misma área.** `ARQ-motor-de-juego.md`:148 y `ARQ-atlas-de-sprites.md`:104 dicen **416×192 · 26×12 tiles · celda 32×48 nativos**; `UX-27`:89-91 y `UX-29`:157 dicen **240×144 · 15×9 · celda 16×24 (32×48 CSS)**. Los dos escriben "32×48" queriendo decir cosas distintas | `CTR-16.5` (`grilla` = `alto` renglones de `ancho`) y `D-41` punto 1 | los cuatro archivos | **ALTA** |
| `FIND-56` | **Dos carpetas para el atlas.** `CTR-15.5` manda `public/sprites/` y argumenta que **no** puede ir en `public/arte/` (`ARQ-atlas-de-sprites.md`:147,165); `UX-27`:227,258 manda `public/arte/pixel/` | `D-41` punto 4 (los dos idiomas no se mezclan en la misma pieza) | los dos archivos | **ALTA** |
| `FIND-57` | **El fracaso suena en un contrato y es mudo en el otro.** `CTR-17.1` declara efecto **muerte** "al tocar terreno letal" (`ARQ-efectos-de-sonido.md`:62,118) y :183 dice "la muerte se ve además de oírse"; `UX-29`:145 veta el sonido de derrota y :203 remata "si algo suena, está mal" | `BR-24` puntos 1 y 5; `D-42` precisión 2, que declaró esto bloqueante | los dos archivos | **ALTA** |
| `FIND-58` | **`CTR-16` dice dos veces quién se lastima, y una no es computable.** `inmuneA: ["cielo"]/["infierno"]` (`ARQ-schema-niveles.md`:106-107) nombra terrenos que ninguna `leyenda` ni enum del contrato declara; la leyenda lo dice por `tipo:"letal"` + `mata` (:136-138), vocabulario que `UX-29` §7.2 ya retiró ("ninguno de los dos mata a nadie"). **Lo encontró el revisor: ningún rol lo vio** | `CTR-16.4`, la regla de coherencia del propio contrato | `ARQ-schema-niveles.md` | MEDIA |
| `FIND-59` | **La puerta del nivel 1: una o dos.** `US-09` criterio 4 y la tabla de escalones dan al nivel 1 **una sola puerta**; `CTR-16.5` exige "una puerta **por personaje**" y sentencia que "un nivel que se gana con uno solo en la puerta es otro juego". No pueden ser ciertos los dos | `CTR-16.5` reglas 1 y 2 | `PRD-skayboy-y-poligirl.md`:126-135,241 · `ARQ-schema-niveles.md`:196-202 | **ALTA** |
| `FIND-60` | **Dos topes de paleta.** `ARQ-atlas-de-sprites.md`:135 dice "32 tintas **por atlas**" (tres atlas = 96); `UX-27`:126 dice "16 colores" cerrados para toda el área. El auditor de `T-243` no se puede escribir contra los dos. **También lo encontró el revisor** | `CTR-15.4` contra `UX-27` §4 | los dos archivos | MEDIA |
| `FIND-61` | **El plan le da a `revisor` una tarea que escribe.** `T-226` lista `package.json`, `package-lock.json` y `src/scripts/humo-motor.ts` con `npm i -E kaplay@3001.0.19`. Y `T-249` pide una partida física de a dos, que no la corre ningún rol: es del usuario | `CLAUDE.md` §3 y el límite declarado del rol (read-only, no arregla: reporta) | `ORQ-plan-ciclo-15.md`:156,181 | MEDIA |
| `FIND-62` | **16 de 25 tareas no dejan comando corrible:** `T-227`..`T-237`, `T-240`, `T-241`, `T-243`, `T-248`, `T-249`. Cuatro se cierran barato — `T-232` pide pasar "**a mano** las siete reglas de `voz.test.ts`" cuando ese test corre solo; `T-241` y `T-243` son tareas de test sin `npm test`; `T-248` es verificable jugando | `CLAUDE.md` §8 y `D-12` | `ORQ-plan-ciclo-15.md` | MEDIA |
| `FIND-63` | **`D-40` pierde el botón de cambio sin enmienda con número.** `D-40` dice textual "con el botón de cambio de personaje" (`DECISIONES.md`:2098); `UX-28`:31-42 lo elimina y lo argumenta bien, pero sin ficha. Consecuencia dura: `CTR-17.1` declara el efecto **cambio** "al alternar personaje" fundado en "lo pide `D-40`" y **queda sin disparador** | `D-42` consecuencia 1: un `D-XX` no se contradice en silencio, se enmienda con número | `UX-28` · `ARQ-efectos-de-sonido.md`:64 | MEDIA |
| `FIND-64` | **`package-lock.json` modificado sin dueño:** `version` 0.1.0 → 1.0.0, sincronizando con un `package.json` que ya decía 1.0.0. Es ruido de npm sobre un árbol sin commitear con las cuatro entregas adentro | ningún rol lo declara en su entrega | `git diff package-lock.json` | BAJA |
| `FIND-65` | **El validador ya no sale con un aviso, sale con dos:** "CLAUDE.md tiene 177 líneas; se acerca al tope de 200" además del de los siete agentes | `CLAUDE.md` §7 dice "APTA con **un aviso esperado**" | salida del validador, 2026-09-16 | BAJA |

## Qué hay que hacer con esto, y de quién es

- **`arquitectura`:** `FIND-55`, `FIND-56`, `FIND-57`, `FIND-58`, `FIND-60`. El plan ya tiene
  `T-228`, `T-230` y `T-236` para tres de ellos — **pero `FIND-58` y `FIND-60` no tiene tarea
  ninguna**, y los encontró el revisor. O se suman a `T-230` o se abre una.
- **`producto` con `arquitectura`:** `FIND-59`, la puerta del nivel 1 (`T-231`).
- **`orquestador`:** `FIND-61` y `FIND-62` — reasignar `T-226` y `T-249`, y cerrar los cuatro
  comandos baratos.
- **Hilo principal:** `FIND-63` (la enmienda de `D-40` lleva número, y el prefijo `D-` lo
  asigna la sesión principal), `FIND-64` (guardar el árbol) y `FIND-65` (`CLAUDE.md` §7).

> **La advertencia con la que el revisor cierra, y conviene no olvidarla:** cuatro de los
> cinco hallazgos ALTA ya tienen tarea en el plan, **pero siguen abiertos en disco**. La tarea
> existe; el choque no se resolvió. Un choque declarado no es un choque resuelto.

---

## Segunda pasada — qué de todo eso quedó cerrado de verdad

> Verificado el mismo **2026-09-16**, por el mismo `revisor`, **en el disco y no en lo que los
> roles dicen haber hecho**. Pegado por el hilo principal.
>
> `arquitectura` corrigió sus tres contratos, `producto` decidió la puerta y `orquestador`
> arregló el plan. El desempate lo había fijado el hilo principal antes de mandarlos, para que
> no se arreglara dos veces y distinto: **lo que el jugador ve y oye lo fija `experiencia`;
> dónde viven los archivos y qué forma tienen lo fija `arquitectura`.**

**De los once: siete cerrados y verificados, uno cerrado mal, uno cerrado a medias, dos
abiertos con dueño. Y cinco nuevos.**

| ID | Estado | Evidencia |
|---|---|---|
| `FIND-55` | ✅ **cerrado** | Geometría única en disco: **240×144 nativos · 15×9 tiles de 16 · celda 16×24 nativos (32×48 CSS a ×2)** en `ARQ-motor`:170-173, `ARQ-atlas`:180 y `CTR-15.3`, igual que `UX-27`:89 y `UX-28`:172. Los 416/26×12 solo sobreviven dentro de enmiendas rotuladas. Caja de colisión 10×20 y figura 14×22 coinciden de los dos lados; la RAM recalculada (0,12 MB contra techo de 0,5) cuadra en los dos documentos |
| `FIND-56` | 🔴 **abierto de un lado** | `UX-27`:227 y :258 siguen mandando `public/arte/pixel/` contra `public/sprites/` de `CTR-15.5`. Tiene tarea (`T-229`) y comando. **Sigue ALTA hasta que se corrija** |
| `FIND-57` | ✅ **cerrado** | `CTR-17.1` queda con tres efectos (salto, tesoro, puerta); el de muerte sale con enmienda rotulada, "la muerte se ve" ya no existe, y no queda vocabulario letal vivo. Efecto lateral declarado: la puerta baja a registro grave, porque con muerte afuera compartía "medio" con el salto y los dos pueden sonar en el mismo segundo |
| `FIND-58` | ✅ **cerrado** | `inmuneA` desapareció; quién es devuelto se declara **una sola vez**, en la leyenda, con `tipo: "molinete"` + `devuelve` — vocabulario de `UX-29` §7.2, no "letal"/"mata". Y lo que el schema **no puede** expresar quedó escrito como tal: JSON Schema no cuenta propiedades por contenido, así que "exactamente un molinete por personaje" va como caso propio en `esquemas.test.ts`, con tarea (`T-251`) |
| `FIND-59` | 🔴 **CERRADO MAL** | El fondo se decidió —`US-09` criterio 4 da al nivel 1 **las dos entradas y las dos puertas**, a favor del contrato— pero `ARQ-schema-niveles.md`:279-287 **sigue con el bloque "`FIND-59` sigue abierto… no lo cierro yo"**, y el plan ya marca `T-231` cerrada. Quien abra el contrato lee un choque que no existe y una tarea que espera respuesta. **ALTA, porque es el archivo que se lee antes de escribir el primer nivel.** Lo arregla `arquitectura` con una tijera |
| `FIND-60` | ✅ **cerrado** | `CTR-15.4` baja a **16 tintas para toda el área** y el auditor de `T-243` se escribe contra ese número. De yapa: el JSON del atlas declara nombres de token `--px-*` y no hexadecimales, para que el hex siga viviendo solo en `tokens.css` |
| `FIND-61` | 🟡 **cerrado a medias** | `T-226` pasó al hilo principal y `T-249` al usuario. Residuo en `FIND-66` |
| `FIND-62` | ✅ **cerrado** | Los cuatro baratos tienen comando, tres quedaron diferidos con tarea nombrada, y el resto entró a una tabla con quién lo mira y dónde se asienta. **No queda criterio sin dueño — aunque nueve siguen sin máquina que los corra**, y eso está dicho en vez de escondido |
| `FIND-63` | ✅ **cerrado** | `D-43` existe con sus tres consecuencias, y el efecto "cambio" salió de `CTR-17.1`/`17.3` citándola bien. Las 30 citas de `D-43` en `Docs/` dicen lo mismo que la ficha |
| `FIND-64` | 🟡 **cerrado después** | El árbol seguía sin commitear con el ciclo entero adentro. Guardado por el hilo principal al cerrar la ráfaga |
| `FIND-65` | ✅ **cerrado** | `CLAUDE.md`:154 dice "dos avisos esperados" y los nombra; el validador devuelve exactamente esos dos |

### Los cinco nuevos

| ID | Qué | Sev. | Dueño |
|---|---|---|---|
| `FIND-66` | **La otra mitad de `FIND-61`:** `T-250` le da a `revisor` el archivo `REV-14-ciclo-15.md`, `T-249` dice "lo asienta `revisor`", y la tabla lo repite cinco veces. `Docs/REVISIONES/README.md` dice que `revisor` es read-only y que **las fichas las pega el hilo principal** — el mismo criterio con el que se sacó `T-226` | MEDIA | `orquestador` |
| `FIND-67` | Esta ficha decía "cinco ALTA" y su tabla marca cuatro. **Lo levantó el propio revisor sobre su propio reporte.** Corregido arriba | BAJA | hilo principal ✅ |
| `FIND-68` | **El tope de paleta es uno, el alcance no.** `UX-27`:128 dice "16 **por escena**" y `CTR-15.4` dice "una sola para toda el área". "Por escena" deja vivo que el nivel 2 declare otras 16, y el auditor de `T-243`, que resuelve nombres contra `tokens.css`, no notaría la diferencia | BAJA | `experiencia` |
| `FIND-69` | **Residuo de `FIND-56` fuera del barrido:** `Docs/SUGERENCIAS/UX-para-hilo-principal-readme-del-pixel.md` manda `public/arte/pixel/` en tres lugares, **y ese es el texto que `T-237` va a pegar en `public/arte/README.md`**. El `rg` de `T-252` no mira `Docs/SUGERENCIAS/`, así que el barrido no lo iba a cazar | MEDIA | quien ejecute `T-237` |
| `FIND-70` | **La ambigüedad que causó `FIND-55` sobrevive en un renglón:** `UX-28` §2 declara "todo en píxeles CSS" y su diagrama dice "15 × 9 tiles de 16", cuando el tile mide 16 nativos y 32 CSS. Es la única mención de geometría del barrido que no aclara su unidad | BAJA | `experiencia` |

### Lo que el revisor decidió **no** levantar, y conviene que esté escrito

`D-40` sigue diciendo *"con el botón de cambio de personaje"* en su lugar, sin marca. No es
hallazgo: `D-42` consecuencia 1 pide **enmienda con número**, y `D-43` lo es — igual que
`D-42` enmendó a `D-38` sin tocarle el texto. Sin criterio escrito que exija la marca en el
lugar, es decisión del hilo principal y no incumplimiento de nadie.

### Las dos verificaciones, corridas hoy

- **`npm test`: 578 pruebas, 0 fallos, exit 0.**
- **Validador: APTA, 0 errores, 2 avisos, exit 0** — y los dos avisos son ahora exactamente
  los que `CLAUDE.md` §7 declara.
- **Propiedad y rangos:** nadie escribió en carpeta ajena; los IDs entraron en rango
  (`T-226`..`T-253` sobre el `T-260` que se amplió el mismo día); `ESTADO.md` siguió sin tocar
  hasta que lo actualizó el hilo principal al cerrar.
