# ESTADO — RicotaArcade

> **Lo único que sobrevive al reinicio de contexto.** Se actualiza al final de cada
> sesión. Si esto y el disco no coinciden, manda el disco: corregí este archivo.
>
> Regla: un estado **nunca baja por inferencia**. Solo el usuario degrada un estado.

**Última actualización:** 2026-08-19
**Ciclo actual:** **3 — CERRADO.** Las 16 tareas `T-28`..`T-43`, más los siete hallazgos
de `REV-04`, corregidos y verificados. **El quiz se juega**: Astro con salida estática,
30 preguntas, cinco reglas como funciones puras con test, cuatro pantallas. 47 tests,
`tsc` limpio, build OK. Repo en **https://github.com/knesantos/ArcadeRicotero**.
Los ciclos 1 y 2 también están cerrados. **Ningún ciclo tiene nada abierto.**

> 🔴 **Y algo peor que faltaba código: no hay repositorio git.** 55 archivos de trabajo de
> dos ciclos completos, sin un solo commit y sin respaldo. Lo encontró `orquestador` al
> planificar. Es `T-28` y va **antes que todo lo demás**.

> 🟢 **LEER PRIMERO — `D-14` reencuadra el proyecto entero.** Lo decidió el usuario el
> 2026-08-19 con toda la evidencia legal sobre la mesa, y **manda sobre cualquier cautela
> que este archivo o cualquier otro haya escrito antes**.
>
> **Es un fan site sin fines de lucro, de poco volumen, hecho para divertirse.** Tres cosas:
> **(1) El riesgo se asume.** Si llega un reclamo, **se da de baja y listo**. El gate de
> publicación de `D-07` **ya no existe**; `CNT-01` pasó de cerrojo a **mapa** de qué se usa.
> Nada espera permiso.
> **(2) El conocimiento popular vale.** No hay mucho oficial **y no debería importarnos** —
> y no es una excusa: `RES-23` verificó que la fuente autorizada de letras no existe ni
> existió, y `RES-21` que el memoir se declara "apenas mi versión". Se dejó de exigir fuente.
> **(3) Abrir los molinetes.** Nada se le niega a nadie por no tener con qué entrar: ni
> cuenta, ni login, ni Premium, ni saber lo suficiente. `D-08`, `D-09` y el "sin cuentas"
> del alcance eran la misma decisión y ahora tienen nombre.
>
> **Lo único estricto que queda**, y no es legal: que **la respuesta correcta sea correcta**
> — si el dato está mal, el juego le marca error al que se sabe el tema. La defensa no es
> verificar: es **rotular bien**, en las tres casillas que el schema ya hace cumplir.

> **Lo que queda para el ciclo 3, en orden de valor.** `letras` es la única categoría en
> cero y ahora tiene fuente (`D-13`): son las 10 que faltan para el piso de 40 de `US-01`.
> `US-02` y `US-03` tienen contrato o insumo pero **ningún ítem cargado**, y `US-04`
> tampoco. Del lado de derechos, las **8 preguntas legales bajaron a 4**: `RES-11` a
> `RES-14` respondieron audio, tapas y cita de versos. **`ADR-01` ya no espera `E-04`:
> `RES-26` lo volvió irrelevante** — ver abajo.

> ✅ **RESUELTO — el bloqueo de alcance por falta de letras se desarmó. No hay que tocar el
> piso de `US-01` ni la definición de "Listo".**
>
> La versión anterior de este aviso decía: `RES-23` descartó letras.com, no hay otra fuente,
> la categoría `letras` no se puede escribir, el piso de 40 no se alcanza por aritmética
> (techo 30/40), y `US-03` queda bloqueado entero. **Esa cadena partía de una premisa que el
> usuario dio por cerrada el 2026-08-19: que hacía falta una fuente autorizada.**
>
> **Decisión del usuario, con la objeción de `RES-23` sobre la mesa:** se usan letras.com y
> **bestiarioredondo** igual. Fundamento: *la banda tiene una mística de pocas cosas
> oficiales*, y la investigación lo respalda — no hay sitio oficial de letras, nunca lo
> hubo, el memoir no las trae (`RES-21`), y la banda se construyó sin multinacional, sin TV
> y sin publicitar recitales (`RES-07`). **Esperar una fuente oficial es esperar algo que la
> banda deliberadamente nunca produjo.**
>
> El riesgo de `RES-23` sigue siendo real y se acepta acotado, con cinco mitigaciones. Dos
> importan de verdad: **cruzar todo contra los 105 temas de `RES-20`** —obligatorio, gratis,
> y mata el único error demostrado de la fuente, las 149 entradas contaminadas con material
> del Indio solista y de Skay— y **confirmar de oído contra el disco**, que es realista
> porque `BR-03` muestra 2/1/0 versos: el piso de `US-03` necesita **~30 versos**, no 15
> letras enteras. Detalle en la sección final de `INV-21-letras-y-fuimos-reyes.md`.
>
> ✅ **Ya está registrado como `D-13`.** El hilo principal le asignó el número, y de paso
> quedó escrita en `Docs/IDS.md` la regla que faltaba: **el prefijo `D-` lo escribe solo la
> sesión principal**; una sesión paralela deja la propuesta sin número y espera. No haberlo
> numerado desde allá fue lo correcto.
>
> **`D-14` fue más lejos que esto:** ya no se trata solo de las letras. El conocimiento
> popular es fuente legítima para todo el proyecto.

> ⚠ **Dos sesiones escriben este archivo.** El encabezado quedó desfasado de su propia
> bitácora porque las dos sesiones lo actualizan y ninguna ve a la otra. **Manda el disco y
> manda la bitácora**, que es acumulativa: si el encabezado dice algo que la bitácora
> contradice, gana la bitácora. `Docs/EQUIPO.md` dice que `ESTADO.md` es del hilo
> principal, pero eso se escribió cuando había un solo hilo principal.

> ⚠ **La sesión paralela de investigación abrió una segunda tanda.** Entregó
> `RES-04`..`RES-09` en `INV-02-banda-cultura-estetica.md` (rango consumido entero) y ahora
> `RES-20`..`RES-22` en `INV-20-fuentes-primarias.md`, porque el usuario consiguió los
> libros. **Esta sesión sigue numerando en `RES-10`..`RES-19`**; `RES-04`..`RES-09` están
> quemados y `RES-20`..`RES-29` son de la otra. Reserva completa en `Docs/IDS.md`.

> 🔴 **Y trajo un dato que nadie tenía: el Indio Solari murió el 5 de junio de 2026**
> (`RES-04`, dos fuentes independientes). Todo el repo se escribió hoy hablando de la banda
> sin saberlo. **No cambia el alcance ni los cuatro juegos.** Deja dos cosas por decidir, en
> `Docs/SUGERENCIAS/INV-para-producto-y-contenido-muerte-indio.md`.

## Próximo paso

**Correr `/ciclo` para el ciclo 4.** El quiz funciona; lo que falta es el resto de la v1.

Tres frentes, y el primero es el que más acerca el "Listo":

1. **Los otros tres juegos no tienen un solo ítem.** `US-02` (adivinar el tema) tiene
   contrato (`CTR-03`) pero necesita que **vos recortes los primeros mp3** — `origen` y
   `fechaCorte` no son inventables. `US-03` (completar la letra) tiene fuente desde `D-13`
   pero le falta el schema `CTR-04`. `US-04` (adivinar la tapa) necesita `CTR-05` y las
   imágenes.
2. **`letras` sigue en 0/10** y son las 10 que faltan para el piso de 40 de `US-01`.
3. **Desplegar.** No hay nada que lo bloquee: `D-14` sacó el gate y `D-15` eligió Vercel
   con salida estática. Conectar el repo y listo.

**Hay un brand system en curso en otra sesión.** Cuando aterrice, reemplaza los valores de
`src/styles/tokens.css` y **no hace falta tocar `src/styles/juego.css`**: ese archivo no
tiene un solo color literal, todo sale de variables. Ojo con una cosa: hay un test que
exige **WCAG AA en 12 pares de color**, así que cualquier paleta nueva tiene que pasarlo.

Lo que sigue después, por orden de valor:

1. **Actuar sobre `REV-01`.** `revisor` encontró que `CNT-01` está **desactualizada
   respecto de investigación que ya existe**: 4 de las 11 preguntas de derechos tienen
   respuesta en `RES-06` y `RES-09`, y la nota las trata como si siguieran en cero
   (`FIND-01` a `FIND-04`). Se arregla leyendo, sin investigar nada. Dueño: `contenido`.
2. ~~**La decisión de alcance de `producto`** sobre el piso de `US-01`.~~ **YA NO HACE
   FALTA.** Partía de que no había fuente de letras; el usuario decidió las fuentes y el
   piso de 40 vuelve a ser alcanzable. Ver el bloque ✅ del encabezado. Lo que sí queda para
   `contenido` es **cargar los versos aplicando el filtro de los 105 temas de `RES-20`**.
3. **⚠ `ADR-01` cambió de eje y conviene mirarlo antes de escribir integración.**
   `RES-26` encontró que la **Spotify Developer Policy III.2 dice textualmente *"Do not
   create a game, including trivia quizzes."*** Verificado en dos fetches independientes.
   Eso **compromete la opción A (embed)** por contrato, no por dificultad técnica, y
   **vuelve irrelevante `E-04`**: aunque la prueba diera que el embed reproduce el tema
   entero sin Premium, seguiría prohibido. **Podés sacar esa prueba de tu lista.**
   La opción B (deep link) probablemente sobrevive —`RES-09` verificó que el catálogo está
   en Spotify oficialmente desde 2017— pero **falta responder una sola pregunta: si un deep
   link simple cuenta como "acceder a la Spotify Platform"**. Esa pregunta reemplaza a
   `E-04`. Propuesta para `arquitectura` y `producto` en
   `Docs/SUGERENCIAS/INV-para-arquitectura-y-producto-spotify-prohibe-juegos.md`.
   La prueba de `E-07` que sí sigue teniendo sentido: abrir un deep link desde el celular
   sin Premium y anotar si suena a demanda o entra en shuffle.

**Cerrado del ciclo 1:** las 14 tareas, `T-01` a `T-14`, más los seis hallazgos de
`REV-01` y los dos de `REV-02`. Nada quedó abierto de ese ciclo.

Si querés avanzar por otro lado en vez de seguir el plan, hay **tres frentes que no se
bloquean entre sí**:

1. **`investigador`** — quedan las dos preguntas de `ADR-01` (`E-04`: qué reproduce el
   embed de Spotify para alguien sin Premium; `E-07`: si un usuario free en Argentina puede
   escuchar un tema a demanda). **Los tracklists ya no están pendientes** (`RES-20`: los
   diez discos, 105 temas), ni las referencias de Rocambole (`RES-06`), y 4 de las 11
   preguntas de derechos quedaron respondidas entera o parcialmente (`RES-06`, `RES-09`).
   **La fuente de letras también quedó decidida** (ver el bloque ✅ del encabezado): ya no
   es un pendiente de investigación sino de carga.
2. **`contenido`** — es, por lejos, el rol con más material sin usar: schema (`CTR-02`),
   tono (`CNT-02`), discografía (`RES-02`), **cronología (`RES-05`), mitología rotulada
   (`RES-08`), tracklists con autoría (`RES-20`)** y las memorias del Indio en PDF
   (`RES-21`). Tres preguntas ya vienen casi servidas: "Ji ji ji" y su leyenda desmentida
   por el autor (`RES-08`), la letra impresa en el sobre de *Oktubre* de un tema que no
   está en el disco (`RES-22`), y los dos únicos temas con un tercer autor (`RES-20`).
   Antes del primer lote tiene que fijar el límite editorial sobre Bulacio y Olavarría
   (`RES-07`) — y ojo que el capítulo 14 del memoir se llama "Walter David Bulacio".
3. **Vos** — dos cosas, las dos cortas:
   - Ya podés recortar audio siguiendo `CTR-01` (`Docs/ARQ/ARQ-fragmento-audio.md`,
     secciones `CTR-01.6` y `CTR-01.7`). **No te saltees guardar el máster en WAV fuera
     del repo:** es lo único que hace barato bajar la duración si la nota de derechos lo
     pide.
   - **Podés desbloquear `ADR-01` vos mismo en cinco minutos.** `E-04` pregunta qué
     reproduce el embed de Spotify para alguien sin Premium, y no aparece en ninguna
     fuente primaria. Como tenés Premium, la prueba es directa: abrí
     `https://open.spotify.com/embed/track/<trackId>` de cualquier tema en una ventana de
     incógnito (sin sesión) y después con tu sesión iniciada, y anotá si suena el tema
     entero o se corta a los 30 segundos. `ADR-01` ya dejó dicho que eso vale como
     **observación fechada del proyecto**, un escalón por debajo de una fuente y rotulada
     como tal.

## Tablero

| Ítem | Rol | Estado | Nota |
|---|---|---|---|
| Historias, pisos de ítems y reglas de negocio de los 4 juegos | `producto` | hecho | `US-01`..`US-04`, `BR-01`..`BR-03` en `Docs/PRODUCTO/PRD-alcance-v1.md`. Pisos: **40 / 20 / 15 / 10** |
| `T-01` — `BR-04`: opciones por pregunta | `producto` | hecho | **4 opciones**, mismo número para `US-01` y `US-04`. Fundamento: con 3 el azar sube a 33% y vacía "premiar al que sabe"; con 5 cede "jugable con el pulgar". `CTR-02.5` pasa de valor de trabajo a **confirmado** sin editar `Docs/ARQ/` |
| `ADR-01` — vía de integración con Spotify | `arquitectura` | **en curso** | `Docs/ARQ/ARQ-spotify-integracion.md`, revisión 2. **C y D descartadas con evidencia** (`RES-01`). Quedan A (embed) contra B (deep link), y solo faltan `E-04` y `E-07`. **El fallback ya está cerrado**, así que no frena a nadie |
| `CTR-01` — fragmento de audio | `arquitectura` | hecho | MP3 mono 44,1 kHz 96 kbps, máx **10,0 s — cerrado por `CNT-01`, ya no es valor de trabajo** (`T-09` + `T-10`). Escalera del reveal **0,1 / 0,5 / 2,0 / 5,0 / 10,0 s**; precarga recalculada a **5,3 MB**. Crédito (tema/disco/año) ahora es campo **obligatorio**: publicar audio sin firmar no valida. `BR-02` sobrevive sin cambios |
| `T-02` — `BR-05`: cortes de los tramos de resultado | `producto` | hecho | **30% y 70%**. El corte de abajo se separó a propósito del 25% del azar, para que "medio" no se llene de respuestas tiradas al voleo. Los 9 resultados posibles de una ronda de 8 caen 3 en cada tramo |
| `T-03` — `BR-06`: qué promete la v1 sobre Spotify | `producto` | hecho | `Docs/PRODUCTO/PRD-promesa-spotify.md`. Promete **acceso** al tema, no reproducción íntegra. Redactada para que ningún desenlace de `E-04` ni `E-07` obligue a reescribirla. **El brief ya fue corregido** |
| `T-04` — schema corrible del quiz | `arquitectura` | hecho | `src/data/_schema/quiz.schema.json`. **Verificado por el hilo principal contra 8 casos** (`D-12`): rechaza ítem sin fuente, leyenda sin rótulo, 3 o 5 opciones, fuente con formato inválido, y ninguna opción correcta |
| `CNT-03` — criterios sobre las discrepancias | `contenido` | hecho | `Docs/CONTENIDO/CNT-03-criterios-discografia.md`. Vedó el sello de *Luzbelito* y el conteo pelado de álbumes. **Ojo: `RES-20` resolvió lo de *Luzbelito* después — el veto se puede levantar** |
| `RES-10` — Spotify free a demanda en Argentina | `investigador` | hecho | `Docs/INVESTIGACION/INV-03-spotify-free-argentina.md`. **Sí se puede elegir tema desde sep-2025, pero con cupo diario no divulgado.** Sin confirmación por país ni para el reproductor web |
| `CTR-02` — schema del banco del quiz | `arquitectura` | hecho | `Docs/ARQ/ARQ-schema-quiz.md`. **Desbloquea a `contenido`.** Convierte dos criterios blandos en validaciones de máquina (ver abajo) |
| `ADR-02` — formato del link de resultado compartido | `arquitectura` | hecho | `Docs/ARQ/ARQ-link-resultado-compartido.md`. **Ojo `UX-02`:** la vista previa del tuit no puede llevar el puntaje |
| `CTR-03`..`CTR-05` — schemas de `US-02`, `US-03`, `US-04` | `arquitectura` | pendiente | No se escribieron a medias a propósito. `US-01` es P0 y era lo que desbloqueaba |
| `RES-01` — estado real de las APIs de Spotify | `investigador` | hecho | `Docs/INVESTIGACION/INV-01-fichas-iniciales.md`. `preview_url` restringido desde el 27-nov-2024; el SDK exige Premium |
| `RES-02` — discografía de estudio | `investigador` | hecho | Nueve álbumes con año y sello, cruzados en tres fuentes. **Trae tres discrepancias sin promediar** — leerlas antes de escribir preguntas |
| `RES-03` — marco de derechos en Argentina | `investigador` | hecho | No hay *fair use* en Argentina; el derecho de cita topea en **8 compases** de música y 1000 palabras de texto (Art. 10, Ley 11.723) |
| Referencias visuales de Rocambole | `investigador` | **hecho** | `RES-06` en `Docs/INVESTIGACION/INV-02-banda-cultura-estetica.md`. Técnica, íconos, origen de cada tapa y su postura sobre uso libre. **Levanta el bloqueo de `UX-04`** |
| `RES-04` — muerte del Indio Solari | `investigador` | hecho | **Murió el 5-jun-2026.** Dos fuentes independientes. Nadie lo había registrado. Ver la alerta arriba |
| `RES-05` — cronología verificada de la banda | `investigador` | hecho | Formación, hitos, recitales grandes, último show y separación. **Corrige el "Huracán en el 89" del BRIEF: fue 93 y 94** |
| `RES-07` — cultura ricotera (misa, aguante, autogestión) | `investigador` | hecho | Insumo de tono y de sistema visual. **Trae un límite editorial a decidir**: Bulacio y Olavarría son muertes reales |
| `RES-08` — mitología ricotera rotulada | `investigador` | hecho | "Ji Ji Ji" y su leyenda **desmentida por el propio Indio en 2007**. Insumo directo de la categoría mitología |
| `RES-09` — titularidad de derechos y catálogo en streaming | `investigador` | hecho | **Erks S.A.** (Indio/Skay/Poli, 1992). Catálogo completo en Spotify desde el 28-jul-2017 vía The Orchard. **Le sirve a `ADR-01`** |
| `RES-20` — tracklists de los 10 discos | `investigador` | **hecho** | `Docs/INVESTIGACION/INV-20-fuentes-primarias.md`. **105 temas** con duración y autoría por tema. **Desbloquea `US-02` y `US-03`.** Resuelve el sello de *Luzbelito*; trae 3 discrepancias nuevas sin promediar |
| `RES-21` — el memoir del Indio como fuente | `investigador` | hecho | PDF del usuario en `Docs/INVESTIGACION/`. Mapa de los 27 capítulos. **El propio libro se declara "apenas mi versión", no verdad unívoca** — usarlo como *testimonio rotulado*, tercera categoría además de hecho y leyenda |
| `RES-22` — correcciones a `INV-02` desde fuente primaria | `investigador` | hecho | **Corrige `RES-05`** (Patricio Rey: el personaje es invento, pero Rocambole dijo que existía y vivía en Salta). Confirma `RES-08`. **Sube 3 tapas de "reportado" a testimonio** y cubre el hueco de *Último bondi* |
| `RES-23` — letras.com como fuente de letras | `investigador` | hecho, **con decisión del usuario encima** | `Docs/INVESTIGACION/INV-21-letras-y-fuimos-reyes.md`. La ficha responde la pregunta 9 en negativo: contribución abierta, sin licencia declarada, 149 temas contra los 105 reales. **Pero el usuario decidió usarla igual** (mística de pocas cosas oficiales) con 5 mitigaciones. **No escales esto a bloqueo de alcance sin leer la sección final del archivo** |
| `RES-24` — *Fuimos reyes*: estructura y límite del preview | `investigador` | hecho | El lector web está topeado en **1%**: la sección "Discografía" figura en el índice pero **no carga**. Sí quedó el **mapa completo de los 20 capítulos**. Si el usuario consigue el libro, **abrir primero "Discografía"**: resuelve las tres discrepancias vivas de una |
| `RES-25` — de dónde salen las tapas: 6 vías | `investigador` | hecho | `Docs/INVESTIGACION/INV-22-imagenes-tapas-y-spotify.md`. **Ocho vías descartadas**; solo Cover Art Archive queda como conducto técnico, y **no mejora la posición legal, solo no la empeora**. **bestiarioredondo no tiene tapas** (su unidad es la canción) y no declara licencia. **Ninguna vía resuelve el derecho** |
| ⚠ `RES-26` — Spotify prohíbe los juegos por contrato | `investigador` | **hecho — decisivo** | Developer Policy III.2 textual: *"Do not create a game, including trivia quizzes."* Verificado en dos fetches independientes. **Compromete la opción A de `ADR-01` y anula `E-04`.** Propuesta en `Docs/SUGERENCIAS/INV-para-arquitectura-y-producto-spotify-prohibe-juegos.md` |
| `CNT-01` — nota de derechos | `contenido` | **esbozo, al día** | `Docs/CONTENIDO/CNT-01-nota-derechos.md`. Duración cerrada en 10 s (`T-09`) y los seis hallazgos de `REV-01` incorporados: ya refleja `RES-06` y `RES-09`, y **"obra registrada" bajó de `[x]` a supuesto heredado** (`FIND-05`). **El gate de `D-07` sigue cerrado**: faltan las 8 preguntas legales de fondo, que ninguna ficha responde todavía |
| `CNT-02` — guía de tono | `contenido` | hecho | Regla central: la jerga va en el tono, nunca en la barrera. Cuatro pares bien/mal |
| Primer lote de preguntas del quiz | `contenido` | **hecho** | `src/data/quiz.json`, **15 preguntas** `QZ-001`..`QZ-015` (10 `discos` + 5 `mitologia`). **Validado por el hilo principal: `OK 15 items, sin fuente: 0`**, 6 fáciles / 6 medias / 3 difíciles. Faltan 25 para el piso de `US-01` |
| `REV-01` — revisión de la nota de derechos | `revisor` | hecho | `Docs/REVISIONES/REV-01-nota-derechos.md`. `FIND-01`..`FIND-06`. **Veredicto: el gate sigue cerrado**, pero no porque la nota mienta — porque está desactualizada respecto de `RES-06` y `RES-09` |
| `REV-02` — revisión del lote del quiz | `revisor` | hecho | `Docs/REVISIONES/REV-02-lote-quiz.md`. `FIND-10` (bloqueante) y `FIND-11`. **14 de 15 preguntas bien citadas.** `FIND-10` se resolvió con `RES-20`, que llegó durante la revisión: la respuesta era correcta, faltaba la cita que la hace única |
| Corrección de `FIND-10` y `FIND-11` | `contenido` | hecho | `QZ-005` cita `RES-02` + `RES-20`; `QZ-001` y `QZ-006` pasaron a `media`; `QZ-011` y `QZ-012` sumaron pista real. **Revalidado por el hilo principal: `OK 15 items, sin fuente: 0`**, máximo de enunciado 163/180. Ambos hallazgos cerrados |
| `UX-01`..`UX-04` — flujo del quiz, tarjeta compartible, reveal sin auriculares, sistema visual | `experiencia` | hecho | En `Docs/UX/`. Citan los IDs reales de `producto`, no supuestos |
| Plan del ciclo 1 | `orquestador` | hecho | `Docs/ORQ/ORQ-plan-ciclo-1.md`. 14 tareas, pasada de conflictos escrita, reservas de ID por la sesión paralela |
| Primera revisión de coherencia | `revisor` | pendiente | `T-11` y `T-12` del ciclo 1. Ya hay siete entregables para revisar |
| Reserva de rangos de ID entre sesiones | hilo principal | hecho | `Docs/IDS.md`, sección "Reserva de rangos". **Cierra `T-14` antes de que arranque el ciclo** |

Estados posibles: `pendiente` · `en curso` · `bloqueado` · `hecho` · `cancelado`

## Bloqueos abiertos

- **`ADR-01` espera evidencia, no trabajo.** Solo `E-04` y `E-07`; `E-02`, `E-03` y `E-08`
  quedaron **anuladas** (no pendientes) al descartarse la opción C. No frena construir: el
  fallback está cerrado y `US-02` criterio 3 queda cubierto igual.
  **`E-07` es ahora la pregunta que más pesa:** con C y D descartadas, el deep link es el
  único camino que queda al tema completo, así que si un usuario free en Argentina no
  puede reproducir a demanda, **ninguna vía cumple la promesa del brief**.
- **`CNT-01` no puede pasar de esbozo a cerrable** hasta que `investigador` responda las
  11 preguntas de `Docs/SUGERENCIAS/CNT-para-investigador-derechos.md`. **Esto es lo que
  bloquea publicar** (`D-07`). No bloquea nada más.
- **`CTR-01.3` tiene un número abierto:** la duración máxima del fragmento, 15 s como
  valor de trabajo, la confirma la nota de derechos. Dato nuevo de `RES-03`: el techo del
  derecho de cita musical son 8 compases, que a 120 BPM en 4/4 son unos 16 s — el valor
  técnico y el límite legal quedaron cerca por caminos independientes.
- ~~**`UX-04` no tiene referencias reales de Rocambole fichadas.**~~ **LEVANTADO** por
  `RES-06`: técnica (rodillo, serigrafía, aerografía, grabado, collage), origen de cada
  tapa, y la frase que ordena el criterio — *"yo no ilustraba la poesía o la música, sino
  que era una parte integrante del mensaje"*. `experiencia` puede cerrar el brief de arte.
- ~~**No hay tracklists por disco.**~~ **LEVANTADO** por `RES-20`
  (`Docs/INVESTIGACION/INV-20-fuentes-primarias.md`): **los diez discos, 105 temas**, con
  duraciones y autoría por tema. `US-02` (piso 20) y `US-03` (piso 15) tienen de sobra.
- **Sigue abierto, y ahora con las dos vías fáciles descartadas: el texto de las letras
  para `US-03`.** El PDF del memoir no sirve (cita versos sueltos dentro de la
  conversación), y **`RES-23` descartó letras.com**: es de contribución abierta, sin
  licencia declarada — o sea, exactamente la "fuente de fans sin respaldo" que `contenido`
  pidió evitar en su pregunta 9. Además lista **149 temas contra los 105 reales**, mezclando
  material del Indio solista y de Skay. **La fuente correcta es el arte de los discos**, y
  el volumen es chico: `BR-03` muestra 2/1/0 versos, así que el piso de `US-03` necesita
  del orden de 30 versos, no 15 letras enteras. Techo legal sin cambios (`RES-03`).
- **Filtro obligatorio para `US-02` y `US-03`:** todo tema que entre tiene que estar en los
  **105 de `RES-20`**. Si no está, no es de Patricio Rey.

## Decisiones pendientes

- **La promesa del brief "escuchar el tema completo vía Spotify" probablemente no se
  cumpla** para un jugador sin Premium. Sale de `RES-01` y `ADR-01` la escaló. Es decisión
  de **`producto`**, no de `arquitectura`: o se reformula la promesa (por ejemplo "saltar
  al tema en Spotify"), o se acepta un preview dentro del sitio, o se declara que depende
  de la sesión del jugador. **Toca la definición de "Listo" de la v1.**
- Vía primaria de `ADR-01`: A (embed) contra B (deep link). Dueños: `investigador` trae
  `E-04` y `E-07`, `arquitectura` decide.
- **Cantidad de opciones por pregunta.** `CTR-02` usa 4 como valor de trabajo (2×2 apto
  para el pulgar). Dueño: `producto`, con una `BR-XX`. **Cerralo antes del primer lote**,
  o hay que rehacer preguntas.
- Cortes de puntaje de los tres tramos de resultado del quiz, que `UX-01` y `UX-02` usan
  para elegir el arte. Dueño: `producto`.
- ✅ **Resuelto por `RES-20`: el sello de *Luzbelito* es Del Cielito Records** — cuarta
  fuente coincidente, contra Wikipedia en inglés. `contenido` puede usarlo.
- ⚠ **Sigue abierto y ahora con más evidencia en contra: cómo contar *Lobo suelto, cordero
  atado*.** Wikipedia en español le da **un artículo a cada volumen** y a la vez los llama
  álbum doble. **Sigue siendo trampa.** Se suma una tercera: **la fecha de *Gulp!* tiene
  tres versiones** (22-abr / 20-jul / agosto de 1985). El año sí es firme.
- Redacción original de esta decisión (queda por trazabilidad):
  Cómo contar *Lobo suelto, cordero atado* (¿9 o 10 discos?) y qué sello lleva *Luzbelito*.
  Las dos discrepancias de `RES-02`. Dueño: `contenido`. **No usar ninguna de las dos como
  pregunta de quiz hasta resolverlas** — son trampas con dos respuestas defendibles.
- Cierre de la nota de derechos antes de publicar. Dueño: `contenido` + vos.
- **Límite editorial sobre las dos muertes.** Walter Bulacio (1991) y Olavarría (2017) son
  hitos centrales de la historia de la banda y a la vez muertes de personas con nombre
  (`RES-07`). La categoría "historia" del quiz va a chocar con esto. Dueño: `contenido`.
  **Decidilo antes del primer lote**, no después de tener cuarenta preguntas escritas.
- **Si el sitio menciona en algún lado que el Indio murió, y dónde.** Sale de `RES-04`.
  Dueño: `contenido`, con `producto` si toca la definición de "Listo" (probablemente no).
- **Qué se hace con "Huracán en el 89".** `Docs/BRIEF.md` y `CLAUDE.md` lo usan como
  ejemplo del fan que sabe, pero en 1989 no hubo Huracán: fue 1993 y 1994 (`RES-05`). Como
  frase retórica no rompe nada; el riesgo es que alguien la convierta en pregunta. Dueño:
  vos, porque son archivos de raíz.

## Bitácora

| Fecha | Qué pasó |
|---|---|
| 2026-08-19 | Proyecto instanciado. Roster de 7 roles, ampliación justificada en `Docs/EQUIPO.md`. |
| 2026-08-19 | `/kickoff`: entrevista de 16 preguntas. `Docs/BRIEF.md` reescrito entero, `D-05`..`D-10` registradas. Confirmados los 4 juegos y el tono; **corregidos** tres supuestos: el usuario no tiene material de audio propio (`D-06`), sí hay difusión por Twitter (`D-10`), y el gate de derechos se partió en construir contra publicar (`D-07`). |
| 2026-08-19 | `producto` fijó `US-01`..`US-04`, `BR-01`..`BR-03` y los pisos 40/20/15/10. |
| 2026-08-19 | `experiencia` entregó `UX-01`..`UX-04`. La tarjeta compartible pasó a pieza de primera clase por `D-10`. |
| 2026-08-19 | `contenido` entregó `CNT-01` (nota de derechos, esbozo) y `CNT-02` (guía de tono), y dejó 11 preguntas para `investigador`. |
| 2026-08-19 | `arquitectura` entregó `ADR-01` (propuesta, con el fallback ya cerrado), `CTR-01`, `CTR-02` y `ADR-02`. |
| 2026-08-19 | `investigador` entregó `RES-01`..`RES-03`. **Dos hallazgos pesados:** `preview_url` está restringido para apps nuevas desde el 27-nov-2024, y los términos de YouTube prohíben descargar, lo que **contradice la premisa con que se tomó `D-06`**. Registrado como actualización de `D-06`; la decisión sigue siendo del usuario y sigue en pie. |
| 2026-08-19 | `ADR-01` revisión 2: incorporó `RES-01` y **descartó las opciones C y D con evidencia**. Quedan embed contra deep link, faltando solo `E-04` y `E-07`. |
| 2026-08-19 | `CLAUDE.md` mandaba correr `scripts/validar_instancia.py`, que no existe en este repo. Corregido a la ruta real del instanciador y registrado como `D-11`. Validación: **APTA**, 0 errores, 1 aviso esperado (7 roles). |
| 2026-08-19 | Chequeo de coherencia de IDs: **sin referencias colgadas**. Los únicos IDs citados y no definidos son los ejemplos de `Docs/IDS.md` y `CTR-03`, que es referencia hacia adelante marcada pendiente. |
| 2026-08-19 | `/ciclo`: `orquestador` cortó el **ciclo 1** en 14 tareas (`Docs/ORQ/ORQ-plan-ciclo-1.md`), con la pasada de conflictos escrita y no mental. Meta del ciclo: 15 de las 40 preguntas del piso de `US-01`. Encontró de paso un hueco de propiedad: **`src/data/_schema/` no tiene dueño declarado**, y sin ese archivo la validación del banco no es corrible — resuelto como `T-04`. |
| 2026-08-19 | Arrancó una **segunda sesión en paralelo** sobre hechos de la banda. Se reservaron rangos de ID en `Docs/IDS.md` para que dos sesiones que no se ven no escriban el mismo número: `RES-04`..`RES-09` para la sesión paralela, `RES-10`+ para esta. Cierra `T-14` antes de que el ciclo arranque. |
| 2026-08-19 | **`T-01` cerrada.** `BR-04`: 4 opciones por pregunta, igual para `US-01` y `US-04`. Era el gate interno del ciclo: destrabó `T-04`, `T-06`, `T-07`, `T-08` y `T-12`. `CTR-02.5` queda confirmado sin tocar `Docs/ARQ/`. |
| 2026-08-19 | **Sesión paralela de investigación cerrada.** Barrido amplio sobre la banda pedido por el usuario: `RES-04`..`RES-09` en `Docs/INVESTIGACION/INV-02-banda-cultura-estetica.md`. Consumió su rango entero sin excederlo. **El hallazgo grande: el Indio Solari murió el 5-jun-2026** y ningún documento del repo lo registraba — alerta y decisiones en `Docs/SUGERENCIAS/INV-para-producto-y-contenido-muerte-indio.md`. De paso: **levantó el bloqueo de `UX-04`** (`RES-06`), respondió 4 de las 11 preguntas de derechos de `contenido`, y encontró que **el catálogo está en Spotify oficialmente desde el 28-jul-2017**, lo que refuerza el deep link en `ADR-01`. Corrigió además el ejemplo "Huracán en el 89" del BRIEF: fue 1993 y 1994. |
| 2026-08-19 | **Segunda tanda de la sesión de investigación: fuentes primarias.** El usuario consiguió los libros y puso *Recuerdos que mienten un poco* en PDF dentro de `Docs/INVESTIGACION/`. Salieron `RES-20`..`RES-22` en `INV-20-fuentes-primarias.md`. **`RES-20` levanta el bloqueo más grande: los tracklists de los diez discos, 105 temas con duración y autoría** — `US-02` y `US-03` ya tienen de dónde sacar ítems, y de paso queda respondida la pregunta 8 de `contenido` (la autoría es Solari–Beilinson salvo dos temas que suman a Bucciarelli). **`RES-22` corrige `RES-05`:** yo había escrito que Patricio Rey nunca existió como persona; el memoir muestra que Rocambole declaró lo contrario y que el Indio no lo desmiente. Se resolvió además el sello de *Luzbelito* (Del Cielito, cuarta fuente). |
| 2026-08-19 | **Ciclo 1 cerrado: las 14 tareas.** `BR-04`/`BR-05`/`BR-06` de `producto`; `CTR-01` con la duración cerrada en 10 s y la escalera recalculada, `CTR-02`, `ADR-02` y el schema corrible de `arquitectura`; `CNT-01` sección A, `CNT-03` y **las primeras 15 preguntas** de `contenido`; `RES-10` de `investigador`; y las dos primeras revisiones del proyecto. Banco validado: `OK 15 items, sin fuente: 0`. |
| 2026-08-19 | **Las dos revisiones encontraron cosas reales, que es el punto.** `REV-01`: la nota de derechos no miente, pero está desactualizada respecto de fichas que ya llegaron (`FIND-01`..`FIND-04`), y afirmaba con casilla marcada que Rocambole tiene "obra registrada" sin ninguna ficha que lo respalde (`FIND-05`) — corregido también en su origen, `D-04`. `REV-02`: `QZ-005` era bloqueante porque su respuesta no era única con la evidencia de entonces (`FIND-10`); **`RES-20` llegó durante la revisión y la resolvió**, así que se arregló agregando la cita, no borrando la pregunta. |
| 2026-08-19 | **`D-12`, la lección estructural del ciclo.** Cuatro de los siete roles no tienen herramienta de ejecución, así que no pueden correr las verificaciones que sus propias tareas exigen. Se decidió **no darles `Bash`** —el que fabrica no se autocertifica— sino **rutear** la verificación al hilo principal o a `revisor`. La evidencia que cerró la discusión llegó el mismo día: `contenido` reforzó dos enunciados, los validó a mano, reportó que estaban bien, y **habían quedado en 242 y 277 caracteres contra un tope de 180**, rompiendo el schema. Corregidos a 155 y 163. |
| 2026-08-19 | Tercera confirmación de que la reserva de rangos funciona: las dos revisiones respetaron `FIND-01`..`FIND-09` y `FIND-10`+ sin colisionar, igual que las fichas `RES-` entre las tres sesiones. |
| 2026-08-19 | **Tercera tanda de investigación: `RES-23` y `RES-24`** en `INV-21-letras-y-fuimos-reyes.md`. Las dos dan resultado negativo o parcial, y el motivo es de la fuente. **`RES-23` descarta letras.com** como fuente de letras: es de contribución abierta y sin licencia declarada —la "fuente de fans sin respaldo" que `contenido` pidió evitar— y además lista **149 temas contra los 105 reales**, mezclando material del Indio solista y de Skay. La pregunta 9 queda **respondida en negativo** y la casilla de letras de `CNT-01` sigue abierta. **`RES-24`**: el lector web de *Fuimos reyes* está topeado en **1%** y la sección "Discografía" figura en el índice pero no carga; no se buscó otra vía porque el libro está a la venta. Sí quedó el **mapa de los 20 capítulos**, que dice dónde mirar cuando el libro esté: el cap. 8 puede cerrar la fecha de *Gulp!*, el 4 lo de Patricio Rey, y la sección "Discografía" del final las tres discrepancias vivas de una sola vez. |
| 2026-08-19 | `/ciclo`: plan del **ciclo 2** en `Docs/ORQ/ORQ-plan-ciclo-2.md`, 13 tareas `T-15`..`T-27`. Dos gates en vez de uno: el limite editorial sobre muertes reales (`T-15`) y la categoria **testimonio** en el schema (`T-16`), que corren en paralelo. Meta: llegar a **30 preguntas**, no a 40. |
| 2026-08-19 | **Hallazgo de alcance: el piso de `US-01` ya no se puede cerrar.** Sin fuente de letras (`RES-23`), y con un piso definido como 10 por categoria sobre 40, el techo real es **30/40** por aritmetica. Decision para `producto`: sostener la cuota, bajar el piso, o esperar la fuente. Toca la definicion de "Listo" de la v1, y bloquea `US-03` entero. |
| 2026-08-19 | Segunda leccion de concurrencia, ahora entre **sesiones** y no entre roles: el encabezado de este archivo quedo diciendo "ciclo 1 en curso" cuando su propia bitacora ya registraba el cierre. Se fijo en `Docs/EQUIPO.md` el orden de autoridad — **disco > bitacora > tablero** — y la regla de agregar a la bitacora y reconciliar el tablero, nunca borrar una fila ajena. |
| 2026-08-19 | **El usuario revirtió la conclusión práctica de `RES-23`, y eso desarmó un bloqueo de alcance.** Con la objeción sobre la mesa decidió usar letras.com y **bestiarioredondo** igual, porque *la banda tiene una mística de pocas cosas oficiales* — fundamento que la investigación respalda: no hay sitio oficial de letras, nunca lo hubo, el memoir no las trae (`RES-21`), y la banda se construyó sin multinacional, sin TV y sin publicitar recitales (`RES-07`). **Consecuencia: el aviso de "el piso de `US-01` no se alcanza por aritmética, techo 30/40" quedó sin premisa y se retiró.** No hay que tocar el piso ni la definición de "Listo". El riesgo de verso mal transcripto se acepta acotado con 5 mitigaciones; las dos que importan son cruzar todo contra los 105 temas de `RES-20` (obligatorio, gratis, mata las 149 entradas contaminadas) y confirmar de oído los ~30 versos que `BR-03` realmente necesita. **Falta el `D-XX`**: no lo numeré desde la sesión paralela porque no hay reserva del prefijo `D-`; propuesta en `Docs/SUGERENCIAS/INV-para-hilo-principal-decision-fuentes-letras.md`. |
| 2026-08-19 | **Ciclo 2, doce de trece tareas cerradas.** Los dos gates primero, como pedia el plan: `CNT-04` (`T-15`) fijo el limite editorial sobre muertes reales antes de escribir una sola pregunta de historia, y la categoria **`testimonio`** (`T-16`..`T-18`) entro al schema de forma **aditiva y verificada**: los 25 items previos validan sin tocarlos, y el schema rechaza las ocho formas de llenarla mal que probe. Banco: **30 preguntas**, `discos` 10/10, `mitologia` 10/10, `historia` 10/10, **10 faciles** que cumplen `BR-01`. |
| 2026-08-19 | **Cuatro fichas legales nuevas, `RES-11` a `RES-14`** (`INV-04`, `INV-05`), y dos corrigen cosas que el proyecto daba por buenas. **`RES-11`: el derecho de cita del Art. 10 cubre la obra, no el fonograma** — el Art. 5 bis le da al fonograma derecho aparte, con otro titular y 70 anios, y el proyecto recorta el master. Los "8 compases" regulan otra cosa. **`RES-13`: la baja resolucion no tiene efecto juridico verificado** (la ley dice "en cualquier forma", sin excepcion por calidad), y la declaracion publica de Rocambole no es licencia: el Art. 53 exige formalidad registral. **`FIND-05` tenia razon.** |
| 2026-08-19 | **Dos defectos encontrados por el equipo, no por el hilo principal.** `arquitectura` calculo que `BR-02` x `BR-04` le daba **70 puntos esperados a quien no reconoce nada**, con piso 40, y volvia inalcanzables el paso 5 y la rama de 0 — lo escalo en vez de decidirlo. `producto` lo arreglo con **intento unico por item**: baja a 25 esperados, piso 0, y las dos ramas vuelven a ocurrir. Y `arquitectura` senialo que **`sensibleA` no tiene valor para texto de libro**, asi que una cita del memoir es invisible para el gate de `D-07`: pedido abierto a `contenido`. |
| 2026-08-19 | **Corrida de investigación sobre imágenes de tapas: `RES-25` y `RES-26`** en `INV-22-imagenes-tapas-y-spotify.md`. Seis vías en paralelo con refutación adversarial; 10 agentes, 0 errores. **`RES-25`: ocho vías descartadas.** Solo Cover Art Archive sobrevive como conducto técnico, y **no mejora la posición legal, solo no la empeora** (*"use the images at your own risk"*). La distinción que ordena todo: **contenedor ≠ contenido** — ninguna base de datos puede licenciar arte que no le pertenece, así que sacar la tapa de Discogs o de Spotify **no lava nada**. **bestiarioredondo no aporta tapas**: su unidad es la canción, no el disco, no declara licencia, el propietario del Drive está oculto y **no se pudo descartar generación por IA**. Dos refutaciones útiles: el `life-span` de MusicBrainz contradice `RES-05`, y **la tapa de *Oktubre* del CAA sale de un CD de 1993 en EE.UU., no del LP argentino de 1986**. **`RES-26` es el hallazgo grande y no es sobre imágenes:** la Spotify Developer Policy III.2 dice textualmente *"Do not create a game, including trivia quizzes."* **Compromete la opción A (embed) de `ADR-01` y vuelve irrelevante `E-04`** —aunque la prueba diera bien, seguiría prohibido—; la opción B (deep link) probablemente sobrevive pero no está verificado. Propuesta para `arquitectura` y `producto` en `Docs/SUGERENCIAS/`. |
| 2026-08-19 | **Ciclo 2 cerrado: las 13 tareas, mas los tres hallazgos de `REV-03`.** El bloqueante (`FIND-12`) era transcripcion textual del memoir con etiqueta de parafrasis encima, en `QZ-027` y `QZ-028` — `revisor` lo cazo comparando contra el PDF. Corregido y **reverificado por el hilo principal contra las 194.131 palabras del libro**: el tramo calcado mas largo bajo de **62 a 41 caracteres**, ninguno llega a 9 palabras, y los que quedan son el titulo de una cancion, una marca y una frase generica. Banco final: **30 preguntas**, tres categorias en 10/10, 10 faciles. |
| 2026-08-19 | **`ADR-01` revision 3 — el eje de la decision cambio y no era tecnico.** `RES-26` (sesion paralela, encontrado **de casualidad** buscando imagenes de tapas) trajo la Spotify Developer Policy III.2: *"Do not create a game, including trivia quizzes."* `arquitectura` **descarto la opcion A (embed) por contrato**, anulo `E-04`, `E-05`, `E-06` y `E-10` — el usuario puede tachar la prueba de incognito de su lista — y degrado `E-07` a no bloqueante corrigiendo su propia frase de la revision 2. Queda `E-13`: si un deep link simple cuenta como acceder a la Spotify Platform. **Las Design Guidelines NO aplican a `US-04`**: rigen arte que venga de Spotify, y `D-04` fija otro origen. |
| 2026-08-19 | Autocritica que vale guardar, de `arquitectura`: su tabla de criterio de cierre —escrita **antes** de la evidencia, y que funciono dos veces— no fallo en ninguna fila. Fallo en algo que una tabla no puede cubrir: **solo elige entre las opciones enumeradas, y no protege de que una opcion sea retirada por un eje que nadie habia considerado.** |
| 2026-08-19 | **`D-14` reencuadra el proyecto entero, por decision del usuario y con toda la evidencia legal sobre la mesa.** Tres cosas: **(1)** el riesgo se asume — fan site sin fines de lucro, poco publico, **si llega un reclamo se da de baja y listo**; el gate de publicacion de `D-07` deja de existir y `CNT-01` pasa de cerrojo a **mapa**. **(2)** el conocimiento popular es contenido legitimo: **no hay mucho oficial y no deberia importarnos**, y eso no es una excusa sino un hallazgo (`RES-23`, `RES-21`). **(3)** **abrir los molinetes** — nada se le niega a nadie por no tener con que entrar: ni cuenta, ni login, ni Premium, ni saber lo suficiente. `D-08`, `D-09` y el "sin cuentas" del alcance resultaron ser la misma decision y ahora tienen nombre. |
| 2026-08-19 | Lo unico que `D-14` **no** relaja: que la respuesta correcta de una pregunta sea correcta — no por lo legal, sino porque si el dato esta mal **el juego le marca error al que se sabe el tema**. La defensa deja de ser "verificar todo" y pasa a ser **rotular bien**: hecho, leyenda o testimonio. El sistema de tres casillas que el schema ya hace cumplir resulto ser exactamente el mecanismo que esta postura necesitaba — **se construyo para dejar entrar el relato, no para filtrarlo.** Actualizados `CLAUDE.md`, `Docs/BRIEF.md` y `.claude/rules/contenido-json.md`. |
| 2026-08-19 | `/ciclo`: plan del **ciclo 3** en `Docs/ORQ/ORQ-plan-ciclo-3.md`, 16 tareas `T-28`..`T-43`. **El ciclo es construir el quiz.** Despues de dos ciclos estaba todo especificado —30 preguntas validadas, `CTR-02`, `CTR-03`, `UX-01`, `UX-02`, `UX-04`, seis reglas `BR-`— y **no habia una sola linea de codigo**. `D-14` saco el ultimo motivo para esperar. Se formalizo ademas en `Docs/EQUIPO.md` quien escribe el codigo: **el hilo principal**, por la misma razon de `D-12` — los cuatro roles que escriben no pueden ejecutar nada, y no se construye software sin correrlo. |
| 2026-08-19 | **Hallazgo al planificar: el repo no estaba bajo git.** 55 archivos de dos ciclos completos, sin un solo commit ni respaldo. Es `T-28` y va antes que todo. |
| 2026-08-19 | Tres huecos mas que encontro `orquestador` leyendo contra el encuadre nuevo: **`CNT-01` sigue redactada como cerrojo** y contradice al BRIEF (`T-32`); **`UX-01` no dice donde se ve el rotulo** de leyenda o testimonio, asi que 15 de los 30 items llegarian a pantalla con cara de hecho verificado — la ultima milla de todo el sistema de rotulado (`T-30`); y **ocho cadenas de copy** que `UX-01` y `UX-02` delegaron a `contenido` y nadie escribio (`T-29`). |
| 2026-08-19 | **Ciclo 3 cerrado: las 16 tareas `T-28`..`T-43`, mas los siete hallazgos de `REV-04`.** El proyecto paso de cero lineas de codigo a **un quiz jugable**: Astro con salida estatica, cinco reglas de negocio como funciones puras con test, cuatro pantallas, y el repo en **github.com/knesantos/ArcadeRicotero**. 47 tests, `tsc` limpio, build OK. |
| 2026-08-19 | **El defecto que solo aparecio jugando: en 25 de los 30 items la respuesta correcta era la primera opcion.** Tocando siempre arriba se sacaba **83%** sin saber nada — mucho peor que lo que discutio `BR-04`, que eligio 4 opciones en vez de 3 para bajar el azar de 33% a 25%. No lo agarro nadie porque en el JSON cada item se lee bien por separado: el patron solo existe en el conjunto. Arreglado barajando al servir; medido en el navegador, ahora rinde 28%. Y `revisor` encontro despues que **`CTR-02.3` ya lo exigia por escrito** desde el ciclo 1: no fue un parche, fue implementar un requisito que nadie habia ejecutado. |
| 2026-08-19 | **`REV-04`, primera revision de codigo. El riesgo del ciclo no se materializo donde se temia.** `BR-01`, `BR-04`, `BR-05`, `ADR-01` y `ADR-02` coinciden con los documentos numero por numero. Se materializo en tres puntos que **pasaban en apariencia**: el test de contraste medía tokens que la pantalla nunca usaba (`FIND-15`, bloqueante — el juego corria sin senal de acierto, error ni rotulo), el payload mandaba mas de `testimonio` de lo aprobado (`FIND-16`), y una cadena de `CNT-05` se reemplazo por texto inventado (`FIND-17`). Los siete cerrados y verificados. |
| 2026-08-19 | Nota de proceso: **`tsc --noEmit` no se estaba corriendo.** El hilo principal reporto `T-34` como verificada habiendo corrido solo `node --test`. Cuando se corrio (`FIND-19`), encontro que el arreglo de `FIND-16` estaba incompleto — el tipo seguia prometiendo campos que ya no se mandaban. **El comando que no se corria era el que iba a atrapar el arreglo a medias del otro hallazgo.** |
| 2026-08-19 | `D-15`: hosting en **Vercel con salida estatica pura**. El usuario tiene Vercel Pro y Supabase Pro pagas, y aun asi el sitio se disena para el tier gratuito — si la suscripcion desaparece, sigue en linea sin cambiar una linea. **Supabase queda disponible y sin usar**: contradice "sin backend" (`D-02`), su tier gratuito pausa proyectos por inactividad, y sobre todo **una cuenta de usuario es literalmente un molinete**, que es lo unico que `D-14` prohibe por nombre. |
| 2026-08-19 | **`RES-15` (`INV-06`): como asegurar costo cero en Vercel, verificado contra la documentacion oficial.** Corrige una intuicion razonable del usuario: **no alcanza con no activar Speed Insights ni Analytics**, porque lo que decide es **el scope**. En Hobby no hay cargo posible —al agotar un cupo el recurso se frena, no se factura—; en un equipo Pro se cobra el excedente de transferencia y edge requests aunque no se toque ningun add-on. Contraintuitivo: **el tope de gasto (Spend Management) solo existe en Pro**, en Hobby no existe porque no hace falta. **Accion pendiente del usuario:** verificar en Settings -> General a que scope pertenece el proyecto. |
