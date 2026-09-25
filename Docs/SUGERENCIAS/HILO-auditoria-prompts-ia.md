# Auditoría de prompts — agentes, skills, reglas y `CLAUDE.md`

**Fecha:** 2026-09-24 · **Lo corrió:** hilo principal · **Pedido:** *"prompt audit.
Actualiza el repo para que trabaje con las ultimas mejores practicas de ia"*.

**Método:** la guía `prompt-audit` de la skill `claude-api` (inventario, procedencia,
barrido por patrones, informe y diff). El pedido dice "actualizá", así que los hallazgos de
confianza alta y media **están aplicados** en el mismo commit que este archivo; los de
confianza baja quedan acá, sin tocar nada.

## Supuestos

- **Alcance:** todo lo que le llega al modelo como texto en este repo: `CLAUDE.md`, las 4
  reglas de `.claude/rules/`, los 7 agentes de `.claude/agents/` y las 11 skills de
  `.claude/skills/`. `Docs/` y `ESTADO.md` no son prompt: son lo que los prompts mandan a
  leer, y se usaron como fuente de verdad para contrastar.
- **Modelo destino:** el repo no llama a ninguna API de modelos (no hay SDK, ni pedido
  armado a mano, ni definición de herramientas). Lo que corre estos prompts es Claude Code:
  el hilo principal con el modelo de la sesión, `arquitectura` y `orquestador` con el alias
  `opus` y los otros cinco con `sonnet`. Los alias siguen solos a la generación vigente, así
  que el destino es **Claude Opus 5.x y Claude Sonnet 5**. Por eso los grupos de la guía que
  miran el pedido a la API (prefill, `budget_tokens`, `temperature`, `tool_choice`, caché)
  no aplican acá.
- **Otros proveedores:** ninguno. No hay rastro de OpenAI, Gemini ni similares.

## Procedencia

Los 7 agentes y las 11 skills **no se tocaron desde que entraron al repo** (`7d4824e`,
2026-08-19): son los del instanciador, escritos antes del kickoff. Desde entonces se
registraron `D-05` a `D-43`, y varias dieron vuelta cosas que esos prompts afirman como
vigentes. `CLAUDE.md` y las reglas sí se mantuvieron ciclo a ciclo.

El propio proyecto ya describió este modo de falla dos veces. `D-21`: *"una regla que se
incumple en silencio deja de ordenar nada y el próximo rol la va a leer y a obedecer,
construyendo contra el sitio real"*. Y `FIND-35`: tres criterios de aceptación de la v1
*"describían un producto que ya no existe: Spotify y el cerrojo de derechos que `D-22` y
`D-14` retiraron"*. Se arreglaron los PRD; los prompts que leen los roles quedaron igual.

## Resumen

| Grupo de la guía | Hallazgos aplicados | Marcados sin aplicar |
|---|---|---|
| 1a — Lenguaje de presión | 0 | 0 |
| 1b — Andamios que reemplaza la API | no aplica (no hay pedidos a la API) | — |
| 1c — Sobre-especificación (ejemplos, reglas que se contradicen) | 2 | 1 |
| 1d — Fósiles (redacción relativa a una versión vieja) | 2 | 0 |
| 1f — Cotas numéricas de salida | 2 | 0 |
| 2 — Skills y reglas con datos vencidos | 8 | 3 |
| 3 — Descripciones de herramientas | no aplica; las descripciones de agentes se revisaron como texto de ruteo | 0 |
| 4 — Configuración y arquitectura | no aplica | 2 |

Lo que más pesa, en orden:

1. **Los prompts de los roles contradecían las decisiones que el equipo ya había tomado.**
   A `contenido`, `coherencia`, `estado` y `revisor` les decían que la nota de derechos
   bloquea publicar (lo sacó `D-14`). A `arquitectura` le decían que Spotify es la vía al
   tema completo y que `ADR-01` sigue abierta (el sitio sirve mp3 por `D-22`, y `ADR-01`
   cerró en deep link). A `experiencia` le decían que las tapas reales van solo en su juego
   (`D-21` las deja entrar a cualquier pantalla). Los modelos actuales siguen el prompt más
   al pie de la letra que los de antes: un rol que lee eso construye contra el sitio real.
2. **Cuatro agentes y cinco skills mandaban a los roles a escribir `ESTADO.md`**, que
   `Docs/EQUIPO.md` declara del hilo principal, con el motivo escrito: en el kickoff tres
   roles lo pisaron. El mismo agente decía, dos párrafos antes, que escribe "solo" en su
   carpeta.
3. **`revisor` y `coherencia` tenían un tope de líneas para reportar.** Sonnet 5, que es
   lo que corre `revisor`, cumple ese tipo de techo al pie de la letra: encuentra el
   hallazgo y no lo reporta si no entra. Para un rol cuyo trabajo es no dejar pasar nada,
   ese techo le recorta la cobertura.

## Hallazgos aplicados

Las líneas son las de `HEAD` antes del cambio. Cada fila es un grupo de cambios dentro del
commit, y se puede revertir por separado.

### Confianza alta — verificado contra el repo

| # | Dónde | Qué decía | Patrón | Por qué ya no sirve | Acción |
|---|---|---|---|---|---|
| 1 | `agents/arquitectura.md:45`, `experiencia.md:46`, `orquestador.md:44`, `producto.md:46`; `skills/{arquitectura,contenido,experiencia,orquestador,producto}-metodo/SKILL.md` (entregable) | "Actualizo `ESTADO.md` con lo que quedó hecho y el próximo paso" / "Al terminar, actualizá `ESTADO.md`" | 2 — dato vencido; dos reglas que se contradicen | `Docs/EQUIPO.md:37`: "`ESTADO.md` → hilo principal, NINGÚN rol lo escribe", con el incidente del kickoff como motivo. El agente obedece la línea de su propio prompt | Reescrito: el rol no toca `ESTADO.md`; lo que el tablero tiene que mostrar va en su reporte |
| 2 | `agents/contenido.md:3,13-14`; `skills/contenido-metodo:3,15`; `coherencia:37-38`; `estado:19`; `revisor-metodo:28-30`; `ciclo:20-21,39-40`; `kickoff:22,65` | "esa nota **bloquea la publicación** hasta que exista" / "sin ella, nada se publica" / "La nota de derechos incompleta **sí** es un hueco" | 2 — dato vencido | `D-14` reemplazó el cerrojo de `D-07`: la nota es un mapa. `coherencia` iba a reportar como bloqueante algo que el proyecto declaró no bloqueante | Reescrito. En `coherencia` y `revisor-metodo`, el lugar lo ocupa lo único que `D-14` deja estricto: la respuesta correcta y el rótulo que no miente |
| 3 | `agents/arquitectura.md:3,9-13,22-23,29-31`; `skills/arquitectura-metodo:3,15-16,24-25`; `agents/investigador.md:14-15,29`; `skills/experiencia-metodo:22`; `producto-metodo:27`; `kickoff:40,50-51`; `CLAUDE.md:52` | "Spotify para el tema completo… `ADR-01` y sigue abierta" / "el botón de escuchar el tema completo vía Spotify" | 2 — dato vencido | `D-22`: el sitio sirve el tema en mp3. `ARQ-spotify-integracion.md:15`: `ADR-01` **aceptada**, opción B, deep link | Reescrito: mp3 (`D-22`, `D-23`), Spotify como enlace opcional (`ADR-01`, opción B). Los ejemplos de "hecho externo" pasan a licencias y límites de hosting, que es lo que `arquitectura` le pidió a `investigador` de verdad (`ADR-08`, `RES-50`) |
| 4 | `agents/experiencia.md:3,12-16`; `skills/experiencia-metodo:9-10,15,28-31,39` | "paleta psicodélica saturada… reserva las tapas reales… solo para el juego que las necesita" / criterio "Ninguna pantalla usa una tapa real fuera del juego que específicamente la necesita" | 2 — dato vencido | `D-19` (cada sección viste la paleta real de un disco) y `D-21` (tapas en cualquier pantalla: detalle, fondo velado, ficha). El criterio viejo hacía que `experiencia` marcara como defecto lo que el usuario pidió | Reescrito, apuntando a `.claude/rules/diseno-marca.md` en vez de repetir el sistema, para que no vuelva a vencerse. El criterio nuevo son las condiciones de `D-21` |
| 5 | `agents/producto.md:11-14`; `skills/producto-metodo:22-23`; `kickoff:21,48-49` | "El brief… deja dos como propuesta abierta… vos los confirmás o los cambiás" | 2 — dato vencido | `D-05` los confirmó el 2026-08-19; hoy hay además Redondopedia, `US-07` y más juegos en `Docs/PRODUCTO/` | Reescrito: los cuatro están confirmados, los pisos viven en `PRD-alcance-v1.md`, lo nuevo pasa por el mismo filtro y por `PRD-backlog-ideas.md` |
| 6 | `agents/revisor.md:42`; `skills/revisor-metodo:58-59`; `skills/coherencia:43` | "Formato de reporte (máximo 30 líneas)" / "en máximo 10 líneas: los hallazgos" / "Máximo 25 líneas" | 1f — cota numérica de salida | Sonnet 5 sigue estos techos al pie de la letra y deja afuera hallazgos que sí encontró. La guía de migración de Sonnet 5 lo documenta para arneses de revisión | Reescrito: van todos los hallazgos, con severidad; el filtro lo hace quien lee. Se agregó `DIFERIDOS` a la plantilla de `revisor`: su skill ya mandaba a "diferido" y la plantilla no tenía dónde ponerlo |
| 7 | `agents/revisor.md:37` | "linters, `python3 scripts/*.py` de verificación" | 2 — dato vencido | No hay un solo `.py` en `scripts/`. Los JSON se validan con `npm test` (`src/lib/esquemas.test.ts`, ajv) | Reescrito con los comandos reales |
| 8 | `CLAUDE.md:14-35` | El "Listo" con 40/20/15/10 y "vía Spotify", seguido de tres avisos que lo corrigen | 1d — redacción relativa a una versión vieja; 2 — historia en vez de regla | El modelo lee primero un dato falso y después la corrección. El aviso 2 ya caducó (`PRD-promesa-spotify.md:64-77`: `D-22` le sacó el piso a `BR-06`) y "límites de Vercel, todavía sin ficha" es falso (`RES-50`, en `INV-24`). La historia ya vive en `D-22`, `D-24`, `RES-05` y `T-99` | Reescrito en presente. Los pisos se nombran por archivo y no por número, que es lo que el aviso 3 ya pedía |
| 9 | `skills/investigador-metodo:21-22` | Reformular "¿es cierto que tocaron en Huracán en el 89?" como "¿qué fecha y qué fuente confirman el recital de Huracán del 89?" | 1c — ejemplo | El ejemplo le enseña a `investigador` a meter la premisa falsa adentro de la pregunta, y es justo el dato que `RES-05` refutó. Los ejemplos son lo que más se imita de un prompt | Reescrito: "¿en qué años tocaron en Huracán, y qué fuente lo fecha?" |

### Confianza media

| # | Dónde | Qué decía | Patrón | Por qué ya no sirve | Acción |
|---|---|---|---|---|---|
| 10 | Los otros 5 agentes ("máximo 30 líneas"), `skills/*-metodo` ("máximo 10 líneas"), `estado:33`, `ciclo:44`, `kickoff:89` | Techos de 30, 10, 15, 20 filas y 20 líneas | 1f — cota numérica de salida | Agente y skill del mismo rol se contradecían (30 contra 10). `investigador` tenía que dar "la ficha completa" en 10 líneas. `ciclo` topeaba la tabla en 20 filas, y el plan del ciclo 15 tiene 28 filas de tareas | Reescrito: para qué sirve el reporte y quién lo lee, sin número. **Se conserva** "Máximo 20 preguntas" de `kickoff`: cuida el tiempo del usuario, no el largo de la salida |
| 11 | `CLAUDE.md:126-129,137-141` | "revisado por `D-22`… sigue siendo… ya no Spotify. `ADR-01` cambió de pregunta" / "sigue existiendo, pero cambió de función: **ya no es un gate**" | 1d — redacción relativa | La regla se lee como diferencia contra una versión que el modelo nunca vio. Además `ADR-01` no "cambió de pregunta": es la de Spotify y está cerrada | Reescrito en presente, con el motivo. Queda una línea que dice que `D-14` reemplazó a `D-07`: hay documentos viejos del repo que todavía hablan del cerrojo, y el modelo los va a leer |
| 12 | `rules/voz-ricotera.md:24` | "Murió el 5 de junio de 2026 (`RES-04`). Hace once semanas." | 2 — dato atado a una fecha | Hoy son dieciséis semanas, y el número va a seguir corriendo. La fecha sola dice lo mismo sin vencerse | Borrado "Hace once semanas." |
| 13 | `skills/contenido-metodo:29-31`; `agents/contenido.md:19-20` | "Si el hecho es una leyenda rotulada como tal **en su ficha**…" | 1c — dos reglas que se contradicen | `rules/contenido-json.md`: "La leyenda entra sin fuente… **No la mandes a fichar**". Y faltaba la casilla `testimonio`. La regla de los JSON se carga solo al tocar `src/data/`, así que en un `CNT-` ganaba la versión vieja | Reescrito el paso 4 con las tres casillas y el único filtro duro. En el agente se agregó una línea: lo que circula entre fans entra como leyenda, sin ficha |
| 14 | `skills/kickoff/SKILL.md` entero | "Marcá todo lo que figure bajo 'Supuestos sin confirmar'", "Incluí siempre: … juegos 3 y 4…", siete preguntas por rol | 2 — contenido atado a un momento | `Docs/BRIEF.md` ya no tiene esa sección (ahora son "confirmados", "corregidos" y `PENDIENTE`), y las siete preguntas están contestadas por `D-05`..`D-14` y `ADR-01`. La skill dice que se usa "cada vez que el objetivo cambie de forma": en esa corrida iba a volver a preguntar lo decidido | Reescrito en general: resolver los `PENDIENTE` y lo que el cambio vuelve a abrir, y una pregunta por rol solo si su carpeta tiene algo que depende del usuario |

De paso, al reescribir la descripción de `experiencia` (hallazgo 4) salió el `:` que hacía
que su frontmatter no fuera YAML estricto. Claude Code igual lo leía, pero un parser más
estricto no.

## Lo que se revisó y queda como está

- **Los alias `model: opus` / `model: sonnet`.** No hay ningún ID de modelo fijo: los alias
  siguen solos a la generación vigente.
- **Las herramientas y `disallowedTools` de cada rol.** Son estructurales (`D-01`, `D-12`).
- **Las descripciones como texto de ruteo**, incluido el "Usar inmediatamente" de
  `revisor`: la urgencia calibrada en un disparador está bien, y `D-12` rutea la
  verificación a ese rol a propósito.
- **Las plantillas de reporte** (ARCHIVOS / DECISIONES / BLOQUEOS / SIGUIENTE). Fijan la
  forma de algo que el hilo principal consolida, y esa forma importa.
- **El bloque "Transversales"** de las skills. "Nada de relleno. Si una sección no aporta
  una decisión, se borra" es la calibración que la guía recomienda contra los entregables
  largos de Opus 5.
- **Las tablas de prohibiciones de `voz-ricotera.md` y `diseno-marca.md`.** Tienen
  procedencia (un corpus medido y un pedido del usuario) y test a máquina (`voz.test.ts`,
  `estilos.test.ts`). La lista de patrones con nombre es justamente la forma que funciona
  para dirigir el diseño en Opus 5.5.
- **`rules/codigo-juegos.md` y `rules/contenido-json.md`.** Están al día. La línea de
  Spotify coincide con `ADR-01` B y sus `RQ-B2`/`RQ-B4` en `src/scripts/spotify.ts`.
- **Lenguaje de presión:** no hay. Las negritas del repo llevan el motivo al lado.
- **Los pasos numerados de las skills `-metodo`.** Son convenciones de la casa (dónde se
  escribe, qué ID, en qué formato), es decir contexto que el modelo no tiene de otro lado. No
  es una coreografía para algo que el modelo ya sabe hacer.

## Marcados, sin aplicar (confianza baja)

| # | Dónde | Qué | Por qué no se tocó |
|---|---|---|---|
| F1 | `skills/*` | El esqueleto `<objetivo>` / `<contexto>` / `<procedimiento>` | Solo lo data el estilo. Funciona |
| F2 | `<validacion>` de las skills `-metodo` | "a vos mismo en frío", "Releé la historia como si fueras `revisor`" | En Opus 5 pedir que se revise a sí mismo puede dar sobreverificación, pero estas líneas son el criterio de calidad del proyecto, y solo `arquitectura` y `orquestador` corren en `opus`. Si esos dos se ponen a re-chequear de más, empezar por acá |
| F3 | `rules/diseno-marca.md`, tabla anti-slop | Faltan tres estilos por defecto documentados de Opus 5.5: palabra en itálica como acento dentro de un título, numeración de sección "01 / 02 / 03", rótulos en monoespaciada como adorno | Sumarlos solo si aparecen en una pantalla nueva. **No** sumar "fondo crema": `--papel` (`#ede4ce`) lo es a propósito. Y la monoespaciada del cancionero es funcional, porque alinea acordes |
| F4 | `agents/orquestador.md:40` | "Corro la lógica de `/coherencia`" | La skill tiene `disable-model-invocation: true`, así que el agente tiene que leerla. Se podría poner la ruta (`.claude/skills/coherencia/SKILL.md`) |
| F5 | `rules/voz-ricotera.md`, `rules/diseno-marca.md` | Se cargan en toda sesión, sin `paths:` (~21 KB entre las dos) | Acotarlas a `src/**` ahorra contexto en las sesiones que no tocan pantalla, pero es una decisión de quien las escribió |
| F6 | `CLAUDE.md:154` (ahora `:139`) | "el largo de este archivo, que se acerca al tope de 200 líneas" | El archivo bajó de 177 a 162 líneas. No sé si el validador sigue avisando, y acá no se pudo correr (ver abajo) |

## Verificación

- **Corrido:** un barrido con `grep` sobre `.claude/` y `CLAUDE.md` buscando lo vencido
  ("bloquea la publicación", "máximo N líneas", "Actualizo `ESTADO.md`", `python3
  scripts`, `preview_url`, "Supuestos sin confirmar", "once semanas"): cero restos. Las tres
  menciones de Spotify que quedan son correctas: el enlace opcional, la regla de
  `codigo-juegos.md` y un ejemplo de API de terceros en `investigador-metodo`. El
  frontmatter de los 18 archivos de agentes y skills parsea como YAML.
- **No hizo falta correr:** `npm test`. Ningún test lee estos archivos; solo los nombran en
  comentarios (`estilos.test.ts`, `movimiento.test.ts`, `voz.test.ts`).
- **No se pudo correr:** el validador de instancia (`D-11`). Vive en
  `../InstanciadorProyectos/`, que no está en este contenedor. **Correlo al retomar** en la
  máquina que tiene la carpeta hermana.
- **Prueba de comportamiento, pendiente.** La guía pide tratar cada borrado como una
  hipótesis. La prueba más barata es la próxima tarea real: delegarle algo a `revisor` y a
  `contenido`, y mirar tres cosas. Que ninguno toque `ESTADO.md`. Que `revisor` traiga
  todos los hallazgos con severidad. Y que `contenido` cargue una leyenda sin mandarla a
  fichar.
