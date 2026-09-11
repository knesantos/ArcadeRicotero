# Identificadores trazables — RicotaArcade

> Un requisito sin ID no existe. Un entregable que no cita los IDs de los que depende no
> es trazable, y dentro de dos meses nadie va a saber por qué está ahí.

## Convención

`<PREFIJO>-<número de 2 dígitos>` — ej. `US-01`, `ADR-03`, `RES-07`, `T-14`.
Se numera correlativo por prefijo y **no se reutiliza** un número, ni aunque el ítem se
cancele. Un ID cancelado se marca `[CANCELADO]` y se queda donde está.

### Reserva de rangos cuando hay dos sesiones a la vez

"Correlativo" supone **un solo contador**, y eso deja de ser cierto en cuanto dos sesiones
de Claude trabajan sobre el mismo repo sin verse. Las dos miran el disco, las dos ven que
el último es `RES-03`, y las dos escriben un `RES-04` distinto. El daño no es el archivo
duplicado —eso se ve— sino la cita: una pregunta del quiz que diga "fuente: `RES-04`" queda
ambigua para siempre, y ese prefijo es justo el que sostiene el criterio no negociable
"ningún dato falso".

**Regla: antes de abrir una segunda sesión sobre este repo, reservá el rango por escrito
acá abajo.** Cuesta una línea y es la única defensa, porque una sesión no puede preguntarle
a la otra qué número tomó.

| Rango | Reservado para | Desde | Estado |
|---|---|---|---|
| `RES-04` … `RES-09` | Primera sesión paralela de investigación sobre la banda | 2026-08-19 | **cerrada — rango consumido entero** (`INV-02-banda-cultura-estetica.md`) |
| `RES-10` … `RES-19` | Sesión principal. Primera: `RES-10`, `E-07` de `ADR-01` (`T-13` del ciclo 1) | 2026-08-19 | activa |
| `RES-20` … `RES-29` | **Segunda sesión paralela de investigación, en curso.** Si estás en esa sesión, **tomá de acá**: `RES-10`+ ya está reclamado por la principal | 2026-08-19 | **activa** |
| `RES-30` … `RES-43` | Sesión del sistema de marca (tipografía, lettering y paletas de tapas) | 2026-08-21 | **cerrada — rango consumido entero** (`INV-07-tipografia-lettering-tapas.md`) |
| `RES-44` … `RES-49` | **Ciclo 4.** `RES-44` es la auditoría de edición de las tapas (`T-47`), `RES-45` la fuente de letras (`T-60`) | 2026-08-21 | **activa** |
| `BR-13`, `BR-14` | **Ciclo 5**, tareas `T-66` y `T-67` de `producto`, ambas en `PRD-redondopedia.md` | 2026-08-22 | **activa** |
| `BR-15`, `BR-16` + `IDEA-01` … `IDEA-10` | **Sesión del backlog de ideas** (`PRD-backlog-ideas.md`). Tomó 15 y 16 salteando 13 y 14 porque el ciclo 5 ya los tenía reservados — ver nota abajo | 2026-08-22 | **cerrada — rango consumido entero** |
| `IDEA-11` | **Sesión del 2026-08-23.** Idea del usuario guardada como ficha en `Docs/SUGERENCIAS/HILO-para-producto-idea-11-mayor-o-menor.md`, todavía sin pegar en `PRD-backlog-ideas.md` — la carpeta es de `producto` | 2026-08-23 | **cerrada — pegada en el PRD por `T-100` del ciclo 7** |
| `T-97` … `T-107` · `RES-49`, `RES-50` · `CNT-08` · `REV-06` | **Ciclo 7** (`ORQ-plan-ciclo-7.md`). `RES-49` y `RES-50` salen del rango del ciclo 4, que estaba abierto y las tenía pedidas | 2026-08-24 | **cerrada — `T-103` y `T-105` canceladas, sus números no se reutilizan** |
| — | ⚠ **Hay otra sesión escribiendo este repo el 2026-08-24** y no reservó rango: dejó `Docs/SUGERENCIAS/HILO-para-producto-idea-04-la-meta-del-bondi.md`. No tomó IDs nuevos (reusa `IDEA-04`), así que no chocó — pero es el caso que esta tabla existe para evitar | 2026-08-24 | **abierta** |
| `T-161` … `T-175` · `CTR-11` · `RES-53` · `REV-09` · **`UX-13`, `UX-14`** | **Ciclo 10** (`ORQ-plan-ciclo-10.md`), en una sesión que corre en paralelo a la del ciclo 11 | 2026-09-01 | **activa** |
| `T-176` … `T-194` · `ADR-03`, `ADR-04` · `CNT-13` · `D-32` · `REV-10` · **`UX-20` … `UX-24`** | **Ciclo 11** (`ORQ-plan-ciclo-11.md`), la sesión de inmersión. **Toma `UX-20`+ y no `UX-15`+ a propósito:** el ciclo 10 avanza sobre el contador de `UX-` a su propio ritmo y las dos sesiones no se ven. Un bloque lejano cuesta lo mismo y no se pisa | 2026-09-01 | **activa** |
| `T-195` … `T-210` · `UX-22` · `RES-54` (archivo `INV-54`) · `ADR-05`, `CTR-12` · `CNT-14` · `D-33` · `REV-11`, `FIND-46`+ | **Ciclo 12** (`ORQ-plan-ciclo-12.md`), la imprenta de Rocambole. Sesión única, sobre `ciclo-11/el-sitio-como-lugar`. `UX-22` es el primer número libre del bloque que reservó el ciclo 11 | 2026-09-01 | **cerrada — rango consumido entero.** `T-195`..`T-210` usadas, ninguna cancelada. `REV-11` llegó hasta `FIND-51` |
| `IDEA-14` · `RES-60` … `RES-69` (archivo `INV-60`) · `D-38`, `D-39`, `D-40` | **Sesión de "Skayboy y Poligirl"** (2026-09-11), el juego tipo *Fireboy & Watergirl* que pidió el usuario: guardar la idea y arrancar el relevamiento. Toma `RES-60`+ y **no** `RES-56`+ a propósito: el ciclo 14 llegó primero y ya reservó `RES-56`+ en `ORQ-plan-ciclo-14.md`. Un bloque lejano cuesta lo mismo y no se pisa | 2026-09-11 | **activa** |


> **El caso que esta tabla existe para evitar pasó igual, el 2026-09-01, y quedó anotado
> porque es la mejor evidencia que tiene esta sección.** Las dos sesiones planificaron su
> ciclo el mismo día leyendo el mismo disco: las dos vieron que el último documento de
> `experiencia` era `UX-12`, y **las dos escribieron un `UX-13` distinto** — el zoom de
> tapas del ciclo 10 y "el sitio como lugar" del ciclo 11. Se detectó porque la sesión del
> ciclo 11 miró `git status` antes de dar nada por cerrado, no porque nadie avisara. La del
> ciclo 11 se corrió a `UX-20`+; la del 10 se queda con `UX-13` y `UX-14`, que ya estaban
> escritos. **Reservar el rango cuesta una línea; descubrirlo después cuesta renombrar
> archivos y arreglar citas.**

### Los nombres de archivo son otro contador compartido

Mismo problema, un nivel más arriba, y ya mordió: el plan del ciclo 1 le asignó a una tarea
el archivo `INV-02`, que la sesión paralela ya había tomado.

**Regla: el número del archivo `INV-` espeja el rango de fichas que contiene.** Así el
nombre delata de qué sesión vino y las dos pueden escribir en `Docs/INVESTIGACION/` sin
mirarse.

| Archivo | Fichas | Sesión |
|---|---|---|
| `INV-01`, `INV-02`, `INV-03` | `RES-01`..`RES-10` | histórico, anterior a esta regla |
| `INV-04`, `INV-05` | `RES-11`..`RES-14` | principal |
| `INV-20`, `INV-21`, `INV-22` | `RES-20`..`RES-29` | segunda paralela |
| `INV-06`, `INV-07` | `RES-15`, `RES-19`, `RES-30`..`RES-43` | sesión del sistema de marca |
| `INV-44`, `INV-45` | `RES-44`..`RES-49` | ciclo 4 |

Los tres primeros no se renombran: hay citas apuntándoles y renombrar rompe más de lo que
ordena. De `INV-04` en adelante vale la regla.

### El prefijo `D-` también necesita reserva

`Docs/DECISIONES.md` es archivo de raíz y **cualquier sesión puede querer escribir en él**.
Pasó el 2026-08-19: la sesión paralela tenía que registrar una decisión del usuario, vio que
`D-12` era el último, y **no asignó `D-13` a propósito** — porque la principal podía estar
tomando el mismo número en ese momento. Dejó la propuesta en `Docs/SUGERENCIAS/` y esperó.
Fue lo correcto.

**Regla: el prefijo `D-` lo escribe únicamente la sesión principal.** Una sesión paralela
que necesite registrar una decisión deja la propuesta en `Docs/SUGERENCIAS/` con el
fundamento y las alternativas ya redactadas, y **sin número**. La principal le asigna el ID.
Es más barato que partir el rango, porque las decisiones son pocas y casi siempre las toma
el usuario en la sesión donde está mirando.

Aplica al mismo problema con cualquier prefijo. En el ciclo 1 se reservaron además
`BR-04`/`BR-05`/`BR-06` entre tres tareas de `producto`, y `FIND-01`..`FIND-09` contra
`FIND-10`+ entre las dos revisiones. El detalle vive en
`Docs/ORQ/ORQ-plan-ciclo-1.md`, secciones 0.2 y 0.3.

**Y el 2026-08-22 la colisión de `BR-` pasó de verdad, esta vez con final feliz.** La sesión
del backlog de ideas leyó el disco, vio `BR-12` como último, y escribió `BR-13` y `BR-14`.
Al ir a cerrar chequeó `git status` y encontró que otra sesión estaba escribiendo el ciclo 5
en el mismo momento: `T-66` y `T-67` ya tenían esos dos números reservados, uno de ellos ya
escrito en `PRD-redondopedia.md`. Renumeró lo suyo a `BR-15`/`BR-16` antes de terminar.

Dos cosas que deja esa mordida, y valen más que la anécdota:
1. **Mirar el disco no alcanza: hay que mirar `git status`.** El trabajo de la otra sesión
   puede estar sin commitear y por lo tanto invisible para cualquier búsqueda de IDs que
   solo mire el árbol de trabajo de un archivo por vez.
2. **Reservar antes es más barato que renumerar después.** Acá salió gratis porque los
   `BR-13`/`BR-14` recién nacidos no tenían todavía ninguna cita apuntándoles. Un día más y
   habría habido tareas y revisiones citándolos.

Cuando una sesión termina, **su rango no se libera**: los números consumidos quedan
consumidos y los libres del rango se dan por quemados. Es más barato saltear seis números
que arriesgar una cita ambigua.

Los nombres de archivo llevan su propio prefijo de carpeta (`PRD-`, `ARQ-`, `INV-`,
`CNT-`, `UX-`, `REV-`, `ORQ-`), que **no es lo mismo** que el prefijo de los IDs que
contienen. Un archivo `Docs/PRODUCTO/PRD-quiz-juego1.md` puede contener varias historias
`US-XX` y reglas `BR-XX` adentro.

## Prefijos en uso

| Prefijo archivo | Prefijo ID | Qué identifica | Rol dueño | Dónde vive |
|---|---|---|---|---|
| `PRD-` | `US-` | Historia de usuario con criterio Given/When/Then | `producto` | `Docs/PRODUCTO/` |
| `PRD-` | `BR-` | Regla de negocio (ej. cómo puntúa el reveal de audio) | `producto` | `Docs/PRODUCTO/` |
| `PRD-` | `IDEA-` | Idea guardada sin compromiso: sin criterio Given/When/Then y sin piso de ítems | `producto` | `Docs/PRODUCTO/PRD-backlog-ideas.md` |
| `ARQ-` | `ADR-` | Decisión de arquitectura, con alternativas descartadas | `arquitectura` | `Docs/ARQ/` |
| `ARQ-` | `CTR-` | Contrato o schema (ej. el JSON de un juego) | `arquitectura` | `Docs/ARQ/` |
| `INV-` | `RES-` | Ficha de hallazgo con URL y fecha, o leyenda rotulada | `investigador` | `Docs/INVESTIGACION/` |
| `CNT-` | `CNT-` | Pieza de contenido: pregunta, distractor, nota de derechos | `contenido` | `Docs/CONTENIDO/` |
| `UX-` | `UX-` | Flujo, pantalla o pieza de sistema visual | `experiencia` | `Docs/UX/` |
| `REV-` | `FIND-` | Hallazgo de revisión, con criterio incumplido y evidencia | `revisor` | `Docs/REVISIONES/` |
| `ORQ-` | `T-` | Tarea ejecutable de un ciclo, con dueño y verificación | `orquestador` | `Docs/ORQ/` |

## Reglas

- Todo entregable arranca listando los IDs que consume.
- Toda tarea `T-XX` traza a al menos un requisito (`US-XX`, `BR-XX`) o a un hallazgo
  (`FIND-XX`). Una tarea sin origen es trabajo que nadie pidió.
- **Un `IDEA-XX` no es un requisito y no traza tareas.** Es una idea guardada a pedido del
  usuario, sin criterio de aceptación y sin piso de ítems, y por eso `orquestador` no puede
  cortarle un `T-XX`. Para entrar a un ciclo se promueve antes a `US-XX` (`BR-16`); al
  promoverse, el `IDEA-XX` no se borra: se marca *promovida a `US-XX`* y se queda donde
  está, igual que un ID cancelado.
- Todo hallazgo `FIND-XX` cita el ID del criterio que se incumple.
- Toda pregunta del banco de `contenido` que afirme un dato verificable cita la ficha
  `RES-XX` que lo respalda, o lleva la marca explícita de leyenda.
- Al cerrar un ciclo, verificá con `/coherencia` que no haya IDs citados que no existan.
