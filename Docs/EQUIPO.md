# EQUIPO — RicotaArcade

Arquetipo: **sitio-contenido** — el valor del proyecto está en lo que muestra y en cómo
entretiene, no en lo que guarda. No hay backend, no hay persistencia y no hay usuarios: el
activo real es el banco de contenido, y la app es el vehículo que lo hace jugable.

## Roster

| Rol | Misión | Carpeta | Prefijo | Modelo | Escribe |
|---|---|---|---|---|---|
| `producto` | Decide cuáles son los juegos 3 y 4, el alcance de la v1 y el piso de ítems con que cada juego se considera listo | `Docs/PRODUCTO/` | `US-`, `BR-` | sonnet | sí |
| `arquitectura` | Fija el motor de audio, la vía de integración con Spotify y el schema-contrato que rige el contenido | `Docs/ARQ/` | `ADR-`, `CTR-` | opus | sí |
| `investigador` | Trae los hechos externos con URL y fecha: discografía, cronología, obra de Rocambole, estado de las APIs | `Docs/INVESTIGACION/` | `RES-` | sonnet | no · read-only |
| `contenido` | Redacta el banco de preguntas y sus distractores, fija el tono y escribe la nota de derechos | `Docs/CONTENIDO/` | `CNT-` | sonnet | sí |
| `experiencia` | Diseña los flujos de sesión corta en móvil y el sistema visual de línea rocambolesca | `Docs/UX/` | `UX-` | sonnet | sí |
| `revisor` | Verifica lo entregado contra los criterios declarados y contra el schema, con contexto fresco | `Docs/REVISIONES/` | `FIND-` | sonnet | no · read-only |
| `orquestador` | Corta el trabajo en tareas que cierren enteras en una ráfaga y detecta los huecos entre roles | `Docs/ORQ/` | `T-` | opus | sí |

Los dos roles marcados **read-only** no tocan el disco: devuelven su ficha o su hallazgo
listo para pegar, y lo escribe el hilo principal en la carpeta que les corresponde. Es a
propósito — un rol que analiza y además edita termina arreglando lo que debería reportar.

## Mapa de propiedad

Cada carpeta tiene **un solo** dueño. Nadie escribe fuera de la suya.

```
Docs/PRODUCTO/       -> producto
Docs/ARQ/            -> arquitectura
Docs/INVESTIGACION/  -> investigador   (vía hilo principal)
Docs/CONTENIDO/      -> contenido
Docs/UX/             -> experiencia
Docs/REVISIONES/     -> revisor        (vía hilo principal)
Docs/ORQ/            -> orquestador
src/data/*.json      -> contenido      (el schema que los rige es de arquitectura)

ESTADO.md            -> hilo principal   NINGÚN rol lo escribe
Docs/BRIEF.md        -> hilo principal
Docs/DECISIONES.md   -> hilo principal
Docs/EQUIPO.md       -> hilo principal
Docs/IDS.md          -> hilo principal
CLAUDE.md · README.md -> hilo principal
```

Siete carpetas, siete dueños, cero solapamiento de escritura. La única ruta compartida es
`src/data/`: **`contenido` llena los JSON, `arquitectura` define el schema que los valida.**
Nadie más los toca.

**Los archivos de la raíz y los de `Docs/` sueltos son del hilo principal.** Esto se
agregó el 2026-08-19, después de que en la ráfaga de `/kickoff` tres roles editaran
`ESTADO.md` cada uno por su cuenta. No fue indisciplina: el mapa no decía de quién era, y
`ESTADO.md` es justo el archivo que todos quieren tocar al terminar. El resultado fueron
tres versiones parciales pisándose, cada una correcta sobre su propio rol y desactualizada
sobre los otros seis.

La razón de fondo es que `ESTADO.md` es el **único** archivo que necesita una vista
completa del proyecto, y un rol —por diseño— no la tiene: ve su carpeta y poco más. Un rol
que escribe ahí no puede sino dejarlo sesgado hacia lo suyo. Si terminaste tu entregable y
querés que el tablero lo refleje, **decilo en tu resumen de salida** y el hilo principal
lo consolida.

### Cuando hay más de un hilo principal

La regla de arriba supone **un** hilo principal, y eso dejó de ser cierto el mismo día que
se escribió: con dos sesiones de Claude abiertas sobre el repo, hay dos hilos principales
y los dos tienen derecho a escribir `ESTADO.md`. Pasó: una sesión dejó el encabezado
diciendo "ciclo 1 en curso" cuando la bitácora del mismo archivo ya registraba el ciclo 1
cerrado.

**Orden de autoridad dentro de `ESTADO.md`, de mayor a menor:**

1. **El disco.** Lo que existe en las carpetas manda sobre lo que el tablero diga.
2. **La bitácora.** Es **acumulativa y por fecha**: cada sesión agrega filas y nadie
   necesita borrar las de otro. Por eso sobrevive a la concurrencia.
3. **El tablero y el encabezado.** Son **vistas resumidas** y se reescriben enteras, así
   que son lo que se pisa. Si contradicen a la bitácora, están viejos.

De ahí la regla práctica: **agregá a la bitácora, reconciliá el tablero.** Nunca borres una
fila de bitácora que no escribiste vos — puede ser de la otra sesión y ser la única
constancia de algo que pasó.

Si un rol necesita algo de otra carpeta: `Docs/SUGERENCIAS/<PREFIJO>-para-<OTRO>-<tema>.md`.
El dueño decide si lo incorpora. Nunca se edita la carpeta ajena.

## Quién escribe el código de la aplicación

**El hilo principal.** No es una preferencia: es la única opción que funciona, y se hizo
evidente recién en el ciclo 3, cuando alguien preguntó dónde estaba el código y la respuesta
fue que no había.

El razonamiento es el mismo de `D-12`. Los cuatro roles que escriben —`arquitectura`,
`contenido`, `experiencia`, `producto`— **no tienen herramienta de ejecución**. No se puede
construir software sin correrlo: sin instalar dependencias, sin levantar un dev server, sin
ver si compila. Un rol que escribe Astro a ciegas y no puede ni ejecutar `npm run build`
produce código que nadie verificó, que es exactamente lo que `D-12` prohíbe.

```
src/data/*.json      -> contenido        (el schema es de arquitectura)
src/data/_schema/    -> arquitectura
src/ (todo lo demás) -> hilo principal   <- código de la aplicación
package.json, astro.config, etc.  -> hilo principal
```

**Qué aporta cada rol al código sin escribirlo:**

- `arquitectura` define los contratos (`CTR-XX`) y las decisiones técnicas (`ADR-XX`). El
  código los implementa; no los reinventa.
- `experiencia` define los flujos y el sistema visual (`UX-XX`). El código los ejecuta.
- `producto` define qué tiene que hacer (`US-XX`, `BR-XX`) y cuándo está listo.
- `revisor` **sí puede verificar**: tiene `Bash`, así que corre el build, los tests y el
  validador contra lo construido.

Si algún día el código crece hasta necesitar un rol propio, el tope de roles obliga a sacar
otro — y la conversación se da en la tabla de "Cambios al roster", no de hecho.

### Y el pixel del área de juego, también (`D-44`)

**Desde el 2026-09-22, los sprites y los tiles del área de juego los dibuja el hilo
principal, como código.** Lo decidió el usuario (`D-44`) cuando el ciclo 15 midió que la
hoja que había traído no estaba sobre grilla y que ninguno de los siete roles produce arte.

No es un rol nuevo y no toca el tope, por la misma razón por la que el hilo principal
escribe el código: **un cuadro de pixel acá es una grilla de texto** donde cada caracter
nombra una tinta `--px-*` de `tokens.css`, y un script la imprime a PNG. Sin correr ese
script, sin el auditor de paleta y sin mirar el resultado no se puede dibujar — y los
cuatro roles que escriben no corren nada (`D-12`).

**Lo que no hace el hilo principal: aprobarse solo.** Nada entra al atlas sin una hoja de
contacto que el usuario vio. `experiencia` sigue siendo dueña de la convención (`UX-27`) y
de qué se dibuja; el hilo principal dibuja contra esa convención, igual que escribe código
contra los contratos de `arquitectura`.

## Quién puede correr comandos

**Solo `orquestador` y `revisor` tienen `Bash`.** Los cuatro roles que producen artefactos
—`arquitectura`, `contenido`, `experiencia`, `producto`— **no pueden ejecutar nada**, y eso
es a propósito (`D-12`): el que fabrica no se autocertifica.

La consecuencia práctica, que en el ciclo 1 costó dos tareas aprender: **una tarea cuyo
criterio de verificación sea un comando no la cierra sola el rol productor.** El productor
deja el comando exacto escrito en su entrega; lo corre `revisor` si hay tarea de revisión,
o el hilo principal si no la hay. Recién ahí la tarea está cerrada.

Si un rol productor te dice que "validó a mano", eso **no** cumple la regla de `CLAUDE.md`
de no dar nada por terminado sin una verificación corrible. No es culpa suya: no tiene con
qué. Corré el comando vos.

## La regla que sostiene el roster: una sola puerta a la web

`investigador` es el **único rol con `WebSearch` y `WebFetch`**. Ni `contenido` ni
`arquitectura` salen a buscar por su cuenta, aunque el catálogo de roles se los permitiría.

No es una restricción decorativa: es lo que evita que `contenido` e `investigador` colisionen
en el ruteo y, sobre todo, es lo que hace que haya **un solo responsable de que un dato sea
falso**. Cuando una pregunta del quiz afirma algo, ese algo entró por una ficha `RES-XX` con
URL y fecha, o entró rotulado como leyenda. No hay tercera vía y no hay a quién más
reclamarle.

Costo aceptado: `arquitectura` no puede verificar sola el estado de la API de Spotify —
depende de una ficha de `investigador`. Con dedicación en ráfagas esa serialización es
barata, y a cambio ningún ADR se escribe de memoria.

## Justificación del roster ampliado

Este roster tiene siete roles y el tope del instanciador es seis. La justificación es que el
usuario pidió explícitamente investigación profunda como requisito del producto, no como
adorno, y separar `investigador` de `contenido` convierte ese pedido en una garantía
estructural: un rol trae hechos fechados y no redacta, otro redacta y no puede buscar, porque
no tiene las herramientas. Fusionados, el mismo agente que necesita una pregunta difícil es
el que decide si el dato que la sostiene está verificado, y ese conflicto de interés es
exactamente el riesgo número cuatro del brief. El costo real de pasar de seis a siete es
ruteo: cada `description` adicional compite por la atención del router. Se paga con
vocabularios disjuntos por rol y con la regla de la puerta única a la web, que hace que los
dos roles más parecidos del roster no compartan ni herramientas ni sustantivos. Si después
de tres ciclos `investigador` no se invoca al menos una vez por ciclo, se fusiona de vuelta
en `contenido` y el roster baja a seis sin ceremonia.

## Roles descartados

| Rol | Por qué no entró |
|---|---|
| `datos` | El proyecto es estático: sin persistencia, sin migraciones, sin consultas. Su entregable útil acá es un schema, y un schema que es la interfaz entre quien llena el JSON y quien lo consume es un contrato — ya tiene dueño en `arquitectura`. Entra si el banco supera unos 500 ítems con relaciones cruzadas. |
| `pruebas` | En la v1 la verificación real es validar los JSON contra el schema, y eso lo corre `revisor` con `Bash`. Entra cuando el motor de audio se estabilice y haya regresiones que cuidar. |
| `seguridad` | Sin login, sin backend y sin datos de usuario no hay superficie que proteger. El riesgo de derechos es legal, no de seguridad, y su dueño es `contenido`. |
| `operaciones` | Hosting estático con deploy por push. Cabe en diez líneas del `CLAUDE.md`, no en un rol. |
| `analitica` | Sin backend ni cuentas no hay qué instrumentar, y el brief no declara ninguna hipótesis que medir. |
| `difusion` | La v1 es construir, no lanzar. Es el candidato número uno a sumar en la v2, cuando haya algo jugable que mostrar. |

## Cómo cambiar el equipo

- **Agregar un rol** exige responder en una línea: *¿qué produce que ningún otro produce?*
  Si no hay respuesta, no entra. Escribí la respuesta acá abajo.
- **Sacar un rol** que lleva un ciclo sin producir nada: hacelo sin culpa. Un agente que
  no se usa igual compite por atención en el ruteo.
- Tope: 6 roles. Este proyecto va a 7 con la justificación escrita más arriba, que es la
  escotilla que la regla contempla. Agregar un octavo exige sacar uno.

### Cambios al roster

| Fecha | Cambio | Justificación |
|---|---|---|
| 2026-08-19 | Roster inicial de 6 | Generado por el instanciador: arquetipo `sitio-contenido` más `arquitectura` por la decisión de audio y Spotify |
| 2026-08-19 | Entra `investigador` (7 roles) | Pedido explícito del usuario. Separa traer el hecho de redactar la pregunta; ver justificación del roster ampliado |
