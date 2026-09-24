# CNT-21 — Los seis nombres de nivel, y lo que la pantalla dice de nuevo

- **Rol dueño:** `contenido`
- **Fecha:** 2026-09-23 (ciclo 16, ráfaga 2).
- **Estado:** propuesta, lista para cablear.
- **Consume:** `.claude/rules/voz-ricotera.md` entero (los tres registros, la regla de las
  dos líneas, el techo de 8 palabras de `§4.1`, los tics vetados de `§7`),
  `Docs/UX/UX-31-los-seis-niveles.md` (qué enseña cada nivel, `§7` — el límite que un nombre
  no puede cruzar, escrito por `experiencia` antes de que este documento existiera),
  `Docs/UX/UX-28-la-pantalla-y-las-dos-puertas.md` `§2.3`–`§2.6` y `§4.1` (la segunda
  enmienda del 2026-09-23, la condición doble de la línea de vertical, las cuatro salidas
  pesadas para el rótulo sin nivel listo), `Docs/CONTENIDO/CNT-18-la-pantalla-del-juego.md`
  (el texto vigente hasta hoy, marcado como enmendado por este documento en su `§2`),
  `Docs/CONTENIDO/CNT-17-pie-de-homenaje.md` y `CNT-19-el-nombre.md` (los nombres completos
  van solo en el pie; el juego de origen no se nombra en ningún lado), `CNT-20-el-tema-que-suena.md`
  (el disco no se nombra en pantalla), `Docs/PRODUCTO/PRD-skayboy-y-poligirl.md` `BR-24`
  (ninguna palabra de muerte ni de vidas), `Docs/DECISIONES.md` `D-38` (las tres barandas:
  ningún texto narra la relación real entre Skay, Poli y el Indio, y el muñeco nunca dice
  "yo") y `D-42` (el pie es obligatorio, no este documento), `src/lib/skayboy/copy.ts` (cómo
  vive hoy `PANTALLA.lineaVertical`), `Docs/ARQ/ARQ-schema-niveles.md` `CTR-16.5` (el campo
  `nombre`: `^$|^\S+( \S+){0,7}$`, `maxLength: 48` — ≤ 8 palabras y ≤ 48 caracteres a la vez).
- **Resuelve:** `T-270`.

## 1. Los seis nombres de nivel

Registro 1 (el que canta): cantan sobre lo que se siente jugar el nivel, no instruyen cómo
se juega (`UX-31 §7`). Ninguno nombra *Gulp!* (`UX-30 §5`, `CNT-19 §1.2`), ninguno dice
Skayboy, Poligirl ni los nombres reales de `CNT-17` (`D-38` baranda 3: nada narra quiénes
son ni la relación real), ninguno nombra cielo ni infierno como par —el ejemplo que `UX-31 §7`
prohíbe explícito— y ninguno lleva una palabra de la lista vetada de `BR-24`. Ninguno es una
cita de letra: son frases propias, en el idioma del cancionero (imagen física, sin explicar),
no un verso existente.

| Nivel | Escalón | Nombre | Palabras | Caracteres |
|---|---|---|---|---|
| `NIV-01` | Fácil | **De a dos, despacito** | 4 | 19 |
| `NIV-02` | Fácil | **Un piso con favoritos** | 4 | 21 |
| `NIV-03` | Media | **Un favor que no se ve** | 6 | 21 |
| `NIV-04` | Media | **Lo que pesa, se queda** | 5 | 21 |
| `NIV-05` | Difícil | **El primer salto es a ciegas** | 6 | 27 |
| `NIV-06` | Difícil | **El salto más largo de todos** | 6 | 27 |

Las seis entran en `pattern: ^$|^\S+( \S+){0,7}$` (tokens separados por un solo espacio, ≤ 8)
y en `maxLength: 48` de `CTR-16.5` — contado a mano arriba, no citado de memoria.

### Por qué cada una, una línea

- **`NIV-01` — De a dos, despacito.** Es todo el tutorial que este juego tiene (`UX-31`,
  "hay dos, y la puerta es doble"): la frase da el ritmo de entrar sin apuro, no el objetivo
  — no dice "las dos puertas se abren juntas" porque eso ya lo dice la bajada del casete
  (`CNT-19 §2`) y repetirlo acá sería nombrar la mecánica dos veces.
- **`NIV-02` — Un piso con favoritos.** El nivel enseña que el terreno no trata igual a los
  dos (`UX-31`, "el terreno tiene bando"); la frase se queda en la sensación de esa
  injusticia chica, sin decir a quién favorece ni con qué elemento — eso lo descubre quien
  juega, como pide `D-09`.
- **`NIV-03` — Un favor que no se ve.** Primera vez que alguien le abre el paso al otro sin
  que se note en el momento — la puerta ajena queda detrás de una compuerta cerrada desde la
  entrada (`UX-31`, "un mecanismo le abre paso al otro"). "No se ve" es literal —la puerta no
  se ve completa— y no nombra la palanca.
- **`NIV-04` — Lo que pesa, se queda.** El nivel junta dos lecciones que `UX-31` cuenta como
  una sola idea: algo tiene que quedarse quieto para sostener un paso, y hay terreno que no
  le perdona a ninguno de los dos. "Lo que pesa" cubre las dos sin nombrar la placa, la caja
  ni el molinete que devuelve a los dos.
- **`NIV-05` — El primer salto es a ciegas.** Primer nivel con un hueco para saltar y los dos
  tipos de mecanismo combinados; ninguna de las dos puertas se ve completa desde la entrada
  (`UX-31`). "A ciegas" es esa sensación, no una instrucción de cuántos tiles saltar.
- **`NIV-06` — El salto más largo de todos.** Mismo aprendizaje que `NIV-05` llevado al borde
  de lo que el motor permite (`ALCANCE_HUECO_TILES`, `UX-31`: "el hueco más largo del piso").
  El nombre escala la misma imagen sin agregar mecanismo nuevo, tal como tampoco lo agrega el
  nivel.

### Verificación a mano contra las siete reglas de `voz.test.ts §8`

No corre sola sobre el dato (`voz.test.ts` no mira `src/data/`, según deja escrito la fila
`T-270` del plan): la audita `revisor` con esta tabla al lado, y el `pattern`/`maxLength` de
`CTR-16.5` los corre `esquemas.test.ts` recién cuando `T-277` cargue los seis nombres.

| Nombre | 1. Anglicismo | 2. Folleto | 3. Infinitivo | 4. ≤ 8 palabras | 6. "la gente" | 7. Suspensivos |
|---|---|---|---|---|---|---|
| De a dos, despacito | ninguno ✓ | ninguna ✓ | no es un verbo ✓ | 4 ✓ | no aplica ✓ | no lleva ✓ |
| Un piso con favoritos | ninguno ✓ | ninguna ✓ | "Un" ✓ | 4 ✓ | no aplica ✓ | no lleva ✓ |
| Un favor que no se ve | ninguno ✓ | ninguna ✓ | "Un" ✓ | 6 ✓ | no aplica ✓ | no lleva ✓ |
| Lo que pesa, se queda | ninguno ✓ | ninguna ✓ | "Lo" ✓ | 5 ✓ | no aplica ✓ | no lleva ✓ |
| El primer salto es a ciegas | ninguno ✓ | ninguna ✓ | "El" ✓ | 6 ✓ | no aplica ✓ | no lleva ✓ |
| El salto más largo de todos | ninguno ✓ | ninguna ✓ | "El" ✓ | 6 ✓ | no aplica ✓ | no lleva ✓ |

## 2. La línea de vertical, reescrita

`UX-28 §4.1` (segunda enmienda, 2026-09-23) cerró algo que `CNT-18 §2` daba por cierto sin
condición: **"el doble" solo es verdad cuando el ancho vertical actual supera 400 px CSS *y*
el alto vertical llega a 720.** Las dos a la vez, no una sola. Y de los cinco tamaños que
`UX-28 §2.5` mide, los dos verticales (375 × 812 y 375 × 667) tienen los dos un ancho de 375
— por debajo de 400 — así que **en ninguno de los tamaños medidos la condición se cumple.**

La frase que `CNT-18` entregó no se toca:

> **`De costado se ve el doble de grande.`**

Sigue siendo registro 3, ocho palabras, sin infinitivo, sin suspensivos — pasa las siete
reglas igual que en `CNT-18 §5`. **Lo que cambia es que deja de ser incondicional.** A partir
de hoy esta línea va siempre condicionada a que se cumplan **las dos** cosas que fija
`UX-28 §4.1`: ancho vertical > 400 px CSS y alto vertical ≥ 720 px CSS. Fuera de esa
condición, **la línea no aparece — silencio, no una frase de repuesto.**

**Por qué silencio y no una segunda línea para el resto de los tamaños.** Lo pesé y descarto
escribir una segunda frase para el caso "girar no cambia nada". `UX-28 §4.1` ya deja los dos
caminos abiertos y dice, textual, que "no prometer nada no es mentir": esta línea existe para
decir **qué se gana** girando el teléfono (`UX-28 §4`, "una línea... que dice qué se gana
girando"), no para avisar que no se gana nada — eso no es una ganancia que informar, es la
ausencia de una, y el registro 3 que rige acá (`voz-ricotera.md §5`) dice qué hay y se calla;
no inventa algo que decir cuando no hay nada. Escribir "de costado se ve igual" al lado de una
placa pensada para anunciar una ganancia sería, además, la clase de relleno que
`voz-ricotera.md §7` ya vetó ("no es solo X, es Y" con otra ropa): una frase que existe para
llenar el hueco, no porque haga falta. Con silencio, la placa de la chapa simplemente no
aparece para la mayoría de los teléfonos — que es exactamente lo que le pasa hoy al pie de
homenaje cuando no hace falta mostrar nada más: no todo elemento de la pantalla tiene que
estar siempre ocupado.

**Lo que esto le deja a quien cablea (`T-271`), sin que yo escriba una línea de CSS:** el
campo sigue siendo el mismo, `PANTALLA.lineaVertical` en `src/lib/skayboy/copy.ts`, con el
mismo valor — **no hay una cadena nueva que copiar.** Lo que hay que agregar es la condición
que `UX-28 §4.1` ya dejó escrita en su propio texto: `.chapa-linea` se esconde salvo que se
cumplan `min-width: 401px` y `min-height: 720px` a la vez, en el reparto apilado de `§2.4`.
Ese es un cambio de CSS, no de texto — y por eso lo hace `T-271`, no esta nota.

**Destino:** `src/lib/skayboy/copy.ts`, `PANTALLA.lineaVertical` — sin cambios en el valor.
`src/styles/skayboy.css`, la condición de `.chapa-linea` — nueva, de `T-271`.

## 3. `UX-28 §2.6`: no hace falta texto nuevo

`UX-28 §2.6` resuelve "qué ve el que entra sin ningún nivel listo" moviendo **dónde vive** el
rótulo —afuera del mueble, adentro de `.encabezado-juego`, arriba de todo o dentro de la
columna del mueble según la franja (`§2.3`/`§2.4`)— y dice, en su propio texto, que el rótulo
"ya vive en `.encabezado-juego`... eso nunca fue el problema". La cadena que se lee ahí sigue
siendo la de `CNT-18 §3`:

> **`Acá va el juego.`**

Nada de `§2.6` le pide otra palabra a este rótulo: el problema que resolvió esa sección era de
maquetado (dónde entra sin empujar las teclas fuera de la pantalla), no de contenido. Por eso
este documento no agrega una cadena nueva acá — solo lo deja dicho para que quede registrado
que se revisó, y no que se lo pasó por alto.

## 4. Qué no tiene comando y se mira a ojo

- **Que ninguno de los seis nombres explique la mecánica** (`UX-31 §7`): lo audita `revisor`
  con la tabla de `§1` y su columna "Por qué" al lado.
- **Que el `pattern`/`maxLength` de `CTR-16.5` los acepte de verdad**: lo corre
  `esquemas.test.ts` recién cuando `T-277` los cargue en `src/data/skayboy.json`. Contados a
  mano en `§1` mientras tanto.
- **Que la condición de `.chapa-linea` quede exactamente `min-width: 401px` y
  `min-height: 720px` a la vez** (no una sola): lo mira quien revise el CSS de `T-271` contra
  `UX-28 §4.1`, no esta nota.

## Bloqueos

Ninguno. No hace falta ficha `RES-XX`: los seis nombres son decisión de tono, no un hecho
verificable sobre la banda, y la condición de la línea de vertical ya la fijó `experiencia`
en `UX-28 §4.1` — acá solo se hereda y se documenta el texto que queda.

## Siguiente

- `T-277` (hilo principal) necesita los seis nombres de `§1` para cargar el campo `nombre` de
  `NIV-01`..`NIV-06` en `src/data/skayboy.json`.
- `T-271` (hilo principal) necesita `§2`: no hay cadena nueva para `copy.ts` —
  `PANTALLA.lineaVertical` queda igual—, pero sí necesita la condición de `.chapa-linea`
  (`min-width: 401px` y `min-height: 720px` a la vez, `UX-28 §4.1`) para que la placa no
  mienta en los cinco tamaños de `UX-28 §2.5`.
