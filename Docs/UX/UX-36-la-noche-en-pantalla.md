# UX-36 — La noche en pantalla: el libro de *Luzbelito*, de la tapa a la última hoja

> Rol dueño: `experiencia`. Ciclo 18, `D-57`. Primera versión 2026-10-04.
>
> **Reemplaza `UX-06` §2 a §7** (la entrada, la pregunta, el resultado, el disco, la tarjeta y
> los presupuestos). Lo que `UX-06` resolvía y sigue en pie —por qué este es el juego con menos
> muro, y por qué viste *Luzbelito*— se retoma acá sin repetirse. Las enmiendas, en voz alta y con
> fecha, están en `UX-06`, `UX-20` §2, `UX-22` §12.6 y `UX-05`.
>
> **Estado respecto del código.** El hilo principal armó una primera pasada con las propuestas
> del panel (`juego.css`, bloque `.ejes-*`; `Tapa.astro`, `Amigo.astro`; `partida-dos-ejes.ts`;
> `generar-dos-ejes.mjs`). Esta hoja es la vara: donde lo construido difiere, `§10` lo lista, fila
> por fila, para que lo aplique. Yo no corrí nada (`D-12`).
>
> **Consume:** `D-57` (entera), `D-58`, `US-06` con su enmienda de 2026-10-04 (criterios 1 a 8),
> `BR-17`, `BR-36`, `BR-37`, `CTR-08` v2 (`Docs/ARQ/ARQ-schema-dos-ejes.md`), `CNT-30` (el §6 es
> la versión que vale de las cadenas), `INV-150`, `UX-06`, `UX-04`, `UX-05`, `UX-20` §1–§3,
> `UX-22` §12, `UX-35` (la mesa y la carátula), `D-14`, `D-17`, `D-19`, `D-21`, `D-33`, `D-51`,
> `D-53`, `D-54`, `D-55`, `D-56`, `.claude/rules/diseno-marca.md`,
> `.claude/rules/voz-ricotera.md`, `src/styles/tokens.css`, el bloque `.ejes-*` de `juego.css`,
> `src/lib/dos-ejes/{copy,arte,partida,taller}.ts`, `scripts/generar-dos-ejes.mjs`, las capturas
> del antes (`capturas/antes/`) y las maquetas del panel (`libro/m-*.png`, `ident/t3-hoja.png`,
> `ident/og3-hoja.png`).
>
> **Resuelve:** la parte de pantalla de `US-06`: criterios 1, 3, 4 (4a, 4b, 4c), 5, 6 y 8, y la
> accesibilidad de `D-57` punto 13. **No resuelve:** los textos (`contenido`, `CNT-30`, `CNT-29`),
> el schema y el motor (`arquitectura`), el CSS y la isla (hilo principal).
>
> **Cómo leer los números.** Tres clases, como en `UX-35`: **leído** (sale de una captura, de una
> maqueta o de un comentario del código, y lo cito), **cuenta** (lo derivé yo de tokens y reglas,
> sin correr nada) y **por medir** (va al checklist de `§12`). Los píxeles de pantalla son a
> 375 × 667 salvo que diga otra cosa.

---

## 0. Lo que había, y la idea

### 0.1 Lo que estaba, leído en las capturas del 2026-10-04 (sobre `bc27cd4`)

| Qué | Cómo estaba |
|---|---|
| La portada | El título en cuero con su eco, un renglón con "una vela", el subtítulo ("Elegís y listo.") y el botón. Ningún motivo: en el teléfono el único rastro de *Luzbelito* era el color; en la mesa, el medallón de la carátula |
| La pregunta | Texto sobre la tinta, "1 de 10" tenue y dos rectángulos de borde `--borde` (~1,5:1 contra el fondo, cuenta). Ningún estado de elegida: el toque avanzaba en el mismo tick |
| El resultado | "Diste con esto", el nombre, un rombo gris con un punto, la bajada y tres botones; "Volvé al arcade" subrayado y a la izquierda |
| El rombo | Etiquetas de punta a 9,5 px; las dos caras de luz siempre arriba |
| La captura | Sin marca ni título: una captura del resultado no decía qué test era |

### 0.2 La idea

**El juego es un libro.** La portada es su tapa, cerrada; cada pregunta, una hoja; el resultado, la
última. Todo el arte sale de **un solo objeto**: el libro de tapas de cartón con lomo de cuero que
fue *Luzbelito* (`RES-168`). Lo demás es papel y tinta del sistema —papel, sello de goma, cinta,
canto de sombras duras— y se pega, no se estampa. Ninguna pieza es de una manera: las cuatro se
ven con el mismo libro (`D-57` punto 8).

No hay brief de arte original nuevo: la pieza es un recorte real (`D-21`), y lo que se dibuja es
CSS. Si el usuario quiere después una ilustración propia, es otra decisión y esta hoja no la
espera.

### 0.3 Las pantallas y las historias

| Pantalla | Historia y criterio | Sección |
|---|---|---|
| Portada: la tapa cerrada | `US-06` c1, `BR-36` | `§3` |
| Portada con desafío (postal y enlace viejo) | `US-06` c4b | `§3.3`, `§7` |
| La hoja de la pregunta | `US-06` c1, c5, c8 | `§4` |
| La última hoja: el resultado | `US-06` c2, c3, `BR-37` regla 1 | `§5` |
| La grilla de las cuatro maneras y el contraste | `US-06` c3, c4c | `§5.3`, `§5.4` |
| Otra noche | `US-06` c6, `BR-37` regla 2 | `§4.3`, `§5.2` |
| La tarjeta y la vista previa | `US-06` c4a | `§6` |

### 0.4 Qué hace esta hoja con `UX-06`

| `UX-06` | Qué pasa |
|---|---|
| `§0` | Se mantiene, salvo una frase: ya no es cierto que el juego no lleve tapas reales (`§2`) |
| `§1` presupuesto de tiempo | Se mantiene y se revalida en `§1` |
| `§2` Pantalla 0 | **Reemplazada** por `§3` |
| `§3` la pregunta | **Reemplazada** por `§4` (la confirmación "~700 ms" pasa a 600 ms: `D-57` punto 12) |
| `§4` el resultado y el rombo | **Reemplazada** por `§5`: el rombo se va, entra la grilla |
| `§5` el disco que viste | La elección de *Luzbelito* sigue; "sin tapas reales, sin crédito, una capa" **no** (`§2`) |
| `§6` la tarjeta | **Reemplazada** por `§6` |
| `§7` los presupuestos | **Reemplazada** por `§9` |
| `§8` bloqueos, `§9` verificación | Resueltos por `CTR-08` v2 y por `§12` |

### 0.5 Lo que no se mueve

1. **Ningún número, salvo el folio.** "3 de 10" es orientación, no medición (`BR-37` regla 2). Ni
   puntaje, ni conteo por eje, ni "cuánta gente tiene la tuya" (`D-56`).
2. **Igual peso, siempre.** Las dos opciones, las cuatro celdas de la grilla y las cuatro tarjetas
   salen con el mismo tamaño, el mismo borde, la misma estructura.
3. **No hay acierto ni error, y por eso no hay grito** (`D-33`). El resultado no se estampa, no
   festeja, no se anima.
4. **Los molinetes van abiertos.** Cero campos, cero cuentas, un toque entre la portada y la
   primera hoja (`D-09`, `D-14`).
5. **Sin velas y sin el verso de «Juguetes perdidos»** en nada nuevo (`D-57` punto 9).
6. **Sin imprenta ni estampa** (`UX-22` §12.6, enmendado hoy): lo pegado queda quieto.
7. **Una sola pieza de arte, sin óvalo, sin figura y sin la palabra LUZBELITO** (`RES-168`).
8. **El `h1` es el de los ocho juegos** (`D-54`, `.pantalla > h1`): una sola forma, sin reescribirla.
9. **Ningún hex fuera de `tokens.css`**, y todo par de texto con su par en `contraste.test.ts`.

---

## 1. Tiempo, y la primera pantalla

### 1.1 Cuánto dura (cuenta; supuesto no medido, del mismo orden que `UX-06` §1)

| Tramo | Duración |
|---|---|
| Portada: leer el subtítulo y tocar | 0:05–0:10 |
| Diez hojas: leer enunciado y dos opciones (4–7 s), tocar (~1 s), pausa de 0,6 s | ≈ 0:55–1:25 |
| Resultado: nombre, bajada, compartir | 0:20–0:30 |
| **Una noche** | **≈ 1:20–2:05** |
| Otra noche (sin portada) | ≈ 1:15–1:55 |

**Lo marco, porque el rol lo exige:** el caso lento roza los dos minutos. No se corta más: diez
hojas son la forma de `BR-17` regla 3 (cinco por eje, impar) y ya son dos frases cortas por hoja.
Lo que sí hace que la noche esté bien cortada es que **cierra sola en el resultado**: no hay una
segunda tanda, ni un "seguí", ni un contador de noches (`BR-37`). Quien juega tres noches seguidas
hace tres sesiones, cada una con su fin, y decide él. `producto` pidió que `experiencia` validara
esto y avisara si dura más (`US-06`, "por qué tres"): por cuenta, no dura más. **Por medir** con
gente real.

### 1.2 Cuánto entra sin desplazar (cuenta)

| Pantalla | Qué tiene que entrar | A 375 × 667 | Holgura |
|---|---|---|---|
| Portada | El botón "Empezá la noche" | Borde de abajo ≈ **576** | 91 px |
| Postal (portada con desafío) | El botón "Empezá tu noche" | Borde de abajo ≈ **637** en el peor caso (nombre de dos renglones y línea de dos) | 30 px |
| Hoja de la pregunta | La hoja entera y la cinta | La hoja termina ≈ **377** | 290 px |
| Resultado | "Compartí" y "Empezá otra noche" | Terminan ≈ **531** y **601** en el peor caso (nombre de tres renglones, línea de dos, bajada de cuatro) | 66 px |

El desglose de cada cuenta está en su sección (`§3.4`, `§4.1`, `§5.6`). **Dos reglas de prioridad**
si la medición real contradice la cuenta:

- En la portada y en la postal, **lo que se achica es la tapa** (su relleno de arriba y de abajo),
  nunca el botón ni el subtítulo, que es donde está el molinete dicho en voz alta.
- En el resultado, "Compartí" entra siempre (a 375 × 667 y a 360 × 640); "Empezá otra noche"
  entra a 375 × 667. Lo que se achica es el aire de la hoja, no la bajada.

---

## 2. El libro: las piezas, el papel y las reglas de uso

### 2.1 Qué es y qué no es

*Luzbelito* salió como un libro de tapas de cartón con lomo de cuero y el disco adentro de un sobre
(`RES-168`). El juego usa **el libro y nada más**:

- **Sí:** el mármol verde, el lomo de cuero del borde izquierdo y el esquinero de cuero de la
  esquina de arriba a la derecha (el frente trae también el de abajo).
- **No:** el óvalo con la figura (parte de una foto de una persona esclavizada: se trata en
  registro 3 y nunca es pieza ni mascota), la palabra LUZBELITO (un recorte con el título sería la
  tapa con otro nombre: `UX-20` §2 ya advertía que estampar un resultado con una tapa sugiere que
  hay que reconocerla), ninguna vela y ningún verso.

`arte.ts` ya guarda el rectángulo prohibido del óvalo y del título, y el taller se niega a
recortar una caja que los toque (`sePisan`). Esta hoja no mueve esa guarda.

### 2.2 Las piezas

| Pieza | Archivo | Caja en el máster (x, y, ancho × alto) | Salida | Techo | Dónde |
|---|---|---|---|---|---|
| `marmol` (**nueva**) | `libro-marmol.jpg` | 125, 700, 540 × 253 | 540 × 253 | ≤ 30 KB | El fondo de la tapa de la portada |
| `lomo` (**nueva**) | `libro-lomo.jpg` | 0, 0, 100 × 953 | 40 × 380 | ≤ 30 KB | El lomo de la tapa de la portada |
| `esquinero` | `libro-esquinero.png` | 730, 0, 223 × 256 | 112 × 128 | ≤ 30 KB | La esquina de la tapa, la de la última hoja, la de la tarjeta y la de la vista previa |
| `franja` | `libro-franja.jpg` | 0, 700, 953 × 253 | 760 × 202 | ≤ 30 KB | **Solo el taller**: el libro que asoma bajo la hoja de la tarjeta y de la vista previa. Ninguna página la carga |
| `canto` | — | — | — | — | **Se retira de `PIEZAS`.** Ningún lugar lo usa: la pantalla pinta el canto de las hojas con sombras (`§4.4`) y la tarjeta usa la franja |

**Por qué dos piezas nuevas y no la franja sola.** La franja mide 3,76 : 1. A 343 px de ancho son
91 px de alto: no alcanza para una etiqueta con el índice de los cinco momentos, y estirarla a un
alto mayor con `cover` engorda el lomo (a 206 px de alto el lomo pasaría de 39 a 89 px, un cuarto
del ancho). Con tres capas el lomo, el mármol y el esquinero se acomodan a cualquier alto. Es lo que
ya hacía la maqueta aprobada (`m-tapa.png`).

**Chequeo contra lo prohibido** (cuenta, con la caja del óvalo `370, 260, 285 × 430` y la del
título `330, 100, 390 × 130`): el mármol empieza en `y = 700` y el óvalo termina en `690`; el lomo
termina en `x = 100` y el óvalo y el título empiezan en `330`; el esquinero empieza en `x = 730` y
el título termina en `720`. Ninguna se pisa. **El mármol termina en `x = 665`**, 15 px antes del
vértice de abajo del esquinero (`680`): una caja más ancha trae un triángulo de cuero sin mirar.

**Peso.** La portada baja `marmol` + `lomo` + `esquinero`: ≤ 90 KB entre las tres (el techo que
`ARQ` ya fijó para las tres piezas del libro). Las hojas de pregunta no bajan ninguna imagen; el
resultado reusa el esquinero, ya en caché.

### 2.3 El papel y la tinta: qué objeto es cada cosa

| Objeto | Papel y tinta | Borde | Sombra | Giro | Letra |
|---|---|---|---|---|---|
| **Hoja** (pregunta y última) | `--fondo` sobre `--papel`, **lisa** | 2 px `--fondo`, esquina 3 px | La pregunta: el canto (`§4.4`). La última: dura de 5 px en `--borde` | La pregunta: 0°. La última: −0,5° | — |
| **Etiqueta del índice** (sobre la tapa) | `--fondo` sobre `--papel`, **rayada** a 1,6 em | sin borde: el papel es el borde | dura de 3 px en `--borde` | +0,7° | `--fuente` |
| **Etiqueta del amigo** (sobre la tapa) | ídem | 2 px **punteado** `--fondo` | ídem | −0,7° | `--fuente` y rotulada |
| **Opción** | `--fondo` sobre `--papel`, lisa | 2 px `--fondo` (4 px la elegida) | dura de 3 px en `--fondo` (ninguna la elegida) | ∓0,4°, en espejo | `--fuente` 1,05 rem |
| **Sello del momento** | `--fondo` | 2 px `--fondo`, esquina 3 px | — | −1,5° | rotulada 0,8 rem |
| **Sello de los polos** | `currentColor` | 2 px, esquina 3 px | — | −1,5° | rotulada 0,75 rem |
| **Cinta de regreso** ("Volvé a la anterior", "← Volvé al arcade") | `.volver` del sitio | — | 2 px del papel | −1,6° | rotulada 0,8 rem |
| **Cinta adhesiva** (el trozo translúcido sobre una etiqueta) | `--papel` al 30 % | — | — | −4° | sin letra |

**Por qué la hoja va lisa y las etiquetas rayadas.** Unos renglones que no coinciden con las
líneas de texto cruzan la letra y le restan lectura; la hoja tiene un enunciado de hasta tres
renglones y dos opciones encima. En una etiqueta chica, con `line-height: 1.6` igual al paso del
rayado, el renglón queda bajo cada línea. El par que se lee es siempre `--fondo` sobre `--papel`;
las rayas no entran en la cuenta y por eso no se prueban.

### 2.4 Las medidas, en tokens (ninguno nuevo)

| Qué | Valor | Token |
|---|---|---|
| Toque mínimo | 48 px | `--toque-min`. La opción mide `calc(var(--toque-min) + var(--espacio-1))` = 56 px |
| Aire entre elementos | 8 / 16 / 24 / 40 px | `--espacio-1` a `--espacio-4` |
| Línea gruesa | 3 px | `--linea` (el borde "tuya" de la grilla y el de la tapa) |
| Hoja en el teléfono | 34 rem | `--ancho-hoja` |
| Hoja en la mesa (≥ 64 rem) | 38 rem | `--ancho-tablero` |
| Confirmación del toque | 120 ms | `--duracion-toque` |
| La pausa entre elegir y la hoja siguiente | 600 ms | `--pausa-eleccion` (ya está en `tokens.css`, con su comentario) |
| El sello entra | 200 ms | `--duracion-paso`, con `--curva-cinta` |
| Colores | los de la mezcla | `--papel`, `--papel-tenue`, `--papel-borde`, `--fondo`, `--borde`, `--texto`, `--texto-tenue`, `--disco-luzbelito-tinta`/`-apoyo` por `.disco--luzbelito` y `.juego--luzbelito` |

**No hace falta ningún token nuevo.** El único que `D-57` suma es `--pausa-eleccion`. Lo demás
—los ángulos, el canto de ocho sombras, el lomo con `aspect-ratio`— son medidas de una pieza y viven
en su regla, como el −0,6° del frente de la carátula (`UX-35` §3.3). Si un día se repiten en otra
pantalla, se promueven.

**Tres cortes de ancho**, que se suman a los de `UX-35` §1.2 y no los cambian:

| Corte | Qué cambia |
|---|---|
| **22 rem** (352 px) | Por debajo, la grilla de las cuatro maneras pasa a una columna (`§5.3`) |
| **46 rem** | Los rótulos de renglón de la grilla pasan al margen izquierdo (`§5.3`) |
| **64 rem** | La mesa: las dos opciones lado a lado (`§4.7`), el título y el nombre crecen (`§3.5`, `§5.7`) |

### 2.5 `D-21`, condición por condición

| Condición | Cómo se cumple acá |
|---|---|
| Baja resolución | Las que carga la página miden ≤ 540 px de lado largo (el mármol, 540; en la mesa se ve a ~1,13×, cuenta); la franja del taller, 760, y en la tarjeta queda a ~1× del máster (0,8 al achicarla y 1,27 al ponerla) |
| Crédito | El pie del sitio (`PieImprenta`), una línea: *Arte de tapa: Luzbelito — Rocambole (Ricardo Cohen)*, **una sola vez** aunque haya tapa, esquinero y carátula: es un disco. En la tarjeta, la línea de `TARJETA.credito`. En la vista previa, en el `alt` (`§6`) |
| Borde propio del proyecto | Borde grueso de `--linea` en `--apoyo-disco`, sombra dura de 5 px, giro de −0,8°. Nunca un rectángulo liso |
| Legibilidad con texto encima | **Ningún texto va sobre la foto.** Lo que se lee va sobre una etiqueta de papel, y ese par ya existe. Por eso no hay velo ni par nuevo en `contraste.test.ts` |
| Forma | Detalle recortado y pegado (`UX-04`, forma 1). **No es fondo velado** |

**`UX-20` §1.2 (dos capas de fondo, máximo).** La página sigue con una: el grano. La tapa no es una
capa de fondo: es un detalle pegado en el flujo.

### 2.6 Qué disco viste cada cosa

| Elemento | Viste |
|---|---|
| `h1` y el eco de segunda tinta | El cuero (`--disco-luzbelito-tinta`), con el topo detrás (`--tinta-registro`): lo hace `.pantalla > h1` con `.juego--luzbelito`, sin tocar |
| "Empezá la noche", "Empezá tu noche" | El cuero con el canto topo (`--tinte-accion`, `--canto-accion`): `.primario` de siempre |
| "Compartí" | *Gulp!* (`.primario.firma.con-tilde`), como en los ocho (`D-19`) |
| Tapa, hojas, etiquetas, tarjeta | Papel y tinta; el verde y el cuero son los de la foto |
| Acierto y error | **No existen** en este juego |

### 2.7 La voz: qué registro va en cada lugar

Los textos son de `contenido`; esta tabla reparte los registros de `voz-ricotera.md` §5.

| Elemento | Registro | Cadena |
|---|---|---|
| `h1` | 1, ≤ 8 palabras | `PANTALLA_0.titulo` |
| El renglón del lugar | 1 | `LUGARES.dosEjes` |
| Rótulo de la etiqueta del índice | 3 | `PANTALLA_0.indiceRotulo` |
| Los cinco sellos de momento | 3 | `banco.momentos[].nombre` |
| La línea que canta de cada momento | 1 | `banco.momentos[].canta` |
| El folio | 3 | `PARTIDA.folio` |
| Enunciado y opciones | la escena | el ítem |
| Rótulo del resultado, sello de polos, línea que nombra | 3 | `RESULTADO.rotulo`, `selloDePolos`, `lineaQueNombra` |
| **El nombre de la manera** | 1, excepción declarada: nombre de cosa, **sin persona** (`D-57` punto 5) | `cuadrante.nombre` |
| La bajada | 2 | `cuadrante.bajada` |
| El contraste al volver | 3 | `CONTRASTE` (`CNT-29`) |
| Botones y cintas | 3, voseo | `D-17` |

**La regla de las dos líneas, pantalla por pantalla.** *Tapá la que canta: ¿se sabe qué es y qué
tocar?*

| Pantalla | Nombra | Canta | Tapada la que canta |
|---|---|---|---|
| Portada | El subtítulo | El renglón del lugar | Queda el título, la tapa con sus cinco hojas, el subtítulo y el botón: se sabe |
| Hoja | El sello del momento y el enunciado | La línea del momento | Queda la escena y dos opciones: se sabe |
| Resultado | El sello de polos y la línea que nombra | El nombre | Queda "Esta noche te salió", los dos polos en palabras y la bajada: se sabe |
| Postal | La etiqueta del amigo (rótulo y línea que nombra) | El título | Queda qué le salió al otro, qué quiere decir y el botón: se sabe |

---

## 3. La portada: la tapa cerrada (`US-06` c1, c4b; `BR-36`)

### 3.1 De arriba abajo

| # | Elemento | Medida |
|---|---|---|
| 1 | Cinta "← Al arcade" (`.volver`) | 48 px |
| 2 | La marca, `.marca` | En el teléfono; en la mesa se muda a la carátula (`UX-35` §3.3) |
| 3 | **`h1`** (el de los ocho, `.pantalla > h1`) | 26,4 px, dos renglones; **hijo directo de `#inicio`**. **No va dentro de la etiqueta** |
| 4 | El renglón del lugar, `.donde-estas` | Un renglón; **se va en la postal** (`§3.3`) |
| 5 | **La tapa del libro**, `figure.ejes-tapa` | `§3.2` |
| 6 | El subtítulo, `--texto-tenue` | ≤ 3 renglones |
| 7 | El botón, `.primario` | 100 % de ancho, margen de arriba `--espacio-3` |

El `h1` queda **fuera** de la etiqueta por una razón de sistema y no de gusto: `.pantalla > h1` es el
único título de los ocho y `estilos.test.ts` prohíbe que una página lo reescriba. Si el título viviera
adentro de la etiqueta, sería otro `h1` en otro papel, que es la deriva que `UX-35` §4.2 cerró.

### 3.2 La tapa y su etiqueta

La tapa es **un bloque de tres capas** que se acomoda al alto de la etiqueta:

| Capa | Qué es | Cómo |
|---|---|---|
| Fondo | `marmol` | `background-size: cover`, centrado un poco a la izquierda (≈ 35 %) |
| Lomo | `lomo` | Caja absoluta a todo el alto en el borde izquierdo, con `aspect-ratio: 1 / 6` (ancho derivado del alto: ≈ 22 px con la tapa de 130, ≈ 34 con la de 206). El lomo real mide el 11,5 % del frente; acá es más fino a propósito, como en la maqueta |
| Esquinero | `esquinero` | Arriba a la derecha, **4 × 4,6 rem** (64 × 74 px) en el teléfono; **5 × 5,75 rem** en la mesa |

**La caja.** Borde de `--linea` en `--apoyo-disco`, sombra dura de 5 px en `--borde`, giro de
−0,8°. **Su alto es el de la etiqueta más 28 px arriba y 24 abajo** (en la mesa, 36 y 28): no hay un
alto fijo, así que sirve igual para el índice y para el desafío. A 375 px, con el índice, la tapa mide
≈ 130 px (cuenta: 28 + 78 + 24).

**La etiqueta** (`figcaption`). Papel rayado a 1,6 em, giro de +0,7°, sombra dura de 3 px, con un
trozo de cinta adhesiva arriba. Va **pegada** a la tapa, 8 px a la derecha del lomo y 12 px del borde
derecho, a 28 px del borde de arriba: asoma el lomo a la izquierda, el esquinero arriba a la derecha
(la etiqueta le pisa un poco la punta, y es collage) y mármol abajo.

- **Rótulo** (`PANTALLA_0.indiceRotulo`): rotulada 0,75 rem, `--papel-tenue`.
- **El índice:** una lista ordenada `ol` con los cinco sellos en el orden de la noche, en línea, a
  1 rem y `line-height: 1.6`. **Sin números a la vista**: la cantidad ya la dice el subtítulo, y un
  índice numerado se lee como un conteo. Entre un ítem y el siguiente, un punto medio **con texto
  alternativo vacío** (`content: '·' / ''`), así el lector de pantalla no lo lee como "punto medio".
- **Con el índice, a 375 px** entra en dos renglones ("La previa · La ida · La vereda" / "Adentro · La
  vuelta"); en la mesa, en uno.
- `figure` con `figcaption`: la imagen es decorativa (`alt=""`) y la figura se nombra por la etiqueta.

**La pieza no es una respuesta ni una mascota:** es un objeto del juego —el libro— y por eso se ve
igual en la portada, en la postal y en la última hoja.

### 3.3 Con desafío: la manera del amigo pegada como etiqueta (`US-06` c4b)

Quien llega por una postal ve **la misma tapa**, con otra etiqueta: la del amigo reemplaza al índice.
Es una etiqueta de papel rayado, **con borde punteado** (el punteado es "del otro" en todo el juego:
también en la grilla) y giro de −0,7°. Lleva, de arriba abajo:

1. el rótulo (`POSTAL.rotulo`, "A quien te lo mandó le salió"), rotulada 0,75 rem, `--papel-tenue`;
2. el **nombre de la manera**, rotulada 1,6 rem, `line-height: 1.15`, dos renglones como mucho
   (≤ 26 caracteres: a 261 px de ancho útil entra en dos);
3. el sello de los polos (`LUZ · ORDEN`);
4. la línea que nombra, 1 rem en negrita ("Con la gente, con plan.").

**Sin la bajada**, a propósito: con ella el botón cae bajo el pliegue, y quien llega por un enlace
tiene que poder empezar sin buscar nada. La bajada entera la lee al terminar, en la grilla.

**Tres reglas del flujo con desafío:**

- **El subtítulo no se pisa nunca.** Es donde está dicho "no hace falta saber nada ni haber ido", y es
  la tranquilidad que más necesita quien llega por el enlace de otro (`CNT-26` §2.3, `CNT-30` §6.3).
  El desafío es una etiqueta propia y no reemplaza ningún texto. Con esto contesto la pregunta que
  `CNT-30` dejó abierta: **el desafío va en su propia línea, y el subtítulo se queda como está**.
- **En la postal, el renglón del lugar se va.** La etiqueta del amigo ya pone la escena, y el alto
  se necesita para el botón (`§3.4`). El título y el subtítulo siguen siendo la pareja que nombra y
  canta.
- **El enlace viejo (`?g=dos-ejes&r=CU-n`) lleva a la postal.** Propuesta de flujo, para el hilo
  principal y `arquitectura` (`ADR-02`): la isla, al ver un `r` válido en la dirección, hace
  `location.replace()` a `/juegos/dos-ejes/cu-n/`. Es una sola pantalla con desafío y no dos
  implementaciones, y `PANTALLA_0.desafio` deja de existir. Si se prefiere no redirigir, la isla
  **inserta** la misma etiqueta en el lugar del índice y esconde el renglón del lugar; **no pisa el
  subtítulo**. El id inválido (`r=CU-9`) se ignora: portada normal, sin error.

El botón dice **"Empezá tu noche"** en la postal y **"Empezá la noche"** en la portada normal
(`POSTAL.boton`, `PANTALLA_0.boton`).

### 3.4 El alto, a 375 × 667 (cuenta)

| Tramo | Alto | Acumulado |
|---|---|---|
| Relleno de `main` | 16 | 16 |
| Cinta "← Al arcade" | 48 | 64 |
| La marca (24 + dos renglones de 65 + 16) | 105 | 169 |
| `h1` (dos renglones de 55 + 8) | 63 | 232 |
| El renglón del lugar (24 + 16) | 40 | 272 |
| **La tapa con el índice** (130) y 16 de margen | 146 | 418 |
| El subtítulo (tres renglones) | 72 | 490 |
| El botón (24 de margen + 62) | 86 | **576** |

**Con desafío** (la postal): sin el renglón del lugar (−40) y con la tapa de ≈ 231 px (28 + la
etiqueta del amigo de ≈ 179 + 24, con el nombre de dos renglones y la línea que nombra de dos: el
caso de `CU-3` y `CU-4`), el botón termina en ≈ **637**. Holgura de 30 px. Si la medición da más, se
achica el relleno de la tapa (28 → 20, 24 → 16) antes que cualquier otra cosa.

**Por medir:** que a 360 × 640 el botón quede a la vista. La cuenta dice que no en la postal; se
acepta (`UX-01` pide "nada de scroll para encontrar el botón" como meta, y a 375 × 667 se cumple),
y el botón no se vuelve a pegar al pie: `UX-35` §4.6 ya decidió que las portadas llevan el arranque
en el flujo.

### 3.5 En la mesa (≥ 64 rem)

La carátula con la lista a la izquierda, como en los otros siete (`UX-35` §3). La hoja de 38 rem:

- `h1` a 2,6 rem, dos renglones (el global, sin tocar).
- La tapa a **todo el ancho de la hoja** (608 px): lomo de ≈ 26 px, esquinero de 5 × 5,75 rem, etiqueta
  con el índice **en un renglón**. La tapa mide ≈ 134 px (36 + 70 + 28). Con desafío, la etiqueta del
  amigo con el nombre en un renglón, ≈ 134 px de etiqueta y la tapa de ≈ 198.
- **Por medir:** el mármol se ve a ~1,13×. Si se ve blando, la tapa pasa a `max-width: 32rem`
  alineada a la derecha (0,95×).
- Cuenta del botón a 1366 × 657: ≈ 500 (24 de relleno, la cinta de 48, el `h1` de dos renglones, el
  renglón del lugar, la tapa de 134, el subtítulo en dos renglones y el botón). La lista de la
  carátula se queda a la izquierda con el casete marcado: ya lo resuelve `UX-35`.

### 3.6 Qué se toca y adónde lleva

Un toque en "Empezá la noche" → hoja 1, sin pantalla de instrucciones: **la hoja 1 es su propio
tutorial**. Nada más es tocable salvo "← Al arcade" y, en la mesa, la lista de la carátula.

---

## 4. La hoja de la pregunta (`US-06` c1, c5, c8)

### 4.1 Anatomía, de arriba abajo

| # | Elemento | Registro y letra | Cuerpo | Color | Medida |
|---|---|---|---|---|---|
| 1 | **Cabecera**: el sello del momento a la izquierda, el folio a la derecha | Rotulada | 0,8 rem | `--fondo` / `--papel-tenue` | Sello: 2 px, giro −1,5°; folio: "3 de 10". Debajo, una **regla de 1 px** en `--papel-borde`, como el encabezado de una página de libro |
| 2 | **La línea que canta** del momento | `--fuente`, cursiva | 1 rem | `--papel-tenue` | ≤ 2 renglones |
| 3 | **El enunciado**, `h2` | `--fuente` | 1,3 rem (20,8 px) | `--fondo` | `line-height: 1.3`, `text-wrap: balance`; ≤ 3 renglones en el teléfono y ≤ 2 en la mesa |
| 4 | **Las dos opciones**, `role="group"` | `--fuente` | 1,05 rem | `--fondo` sobre `--papel` | `§4.2` |
| 5 | **El canto** de las hojas que faltan | — | — | `--papel-borde`, `--fondo`, `--borde` | `§4.4` |
| 6 | **"Volvé a la anterior"**, cinta chica, **debajo de la hoja** | Rotulada | 0,8 rem | `--fondo` sobre `--papel` 88 % | `§4.6` |

**Relleno de la hoja:** 16 px arriba y a los lados, 24 abajo en el teléfono; `--espacio-3` por todos
lados en la mesa. **Margen derecho de la hoja: `--espacio-1`**, para que el canto (17 px a la derecha)
no se pierda contra el borde.

**La hoja va recta** (0°): es la página del libro y el único objeto grande del juego que no se
tuerce. Lo torcido es lo que se pega encima: el sello, las opciones, la cinta. Una hoja torcida con
ocho sombras escalonadas mostraría los cantos desalineados.

**Cuenta a 375 px** (con el enunciado en tres renglones): 40 + 16 + 28 (cabecera) + 32 (la línea que
canta) + 81 (enunciado) + 24 + 128 (dos opciones y su aire) + 24 = 373, más el borde: **≈ 377**.
Los botones están en el tercio de arriba a la mitad de la pantalla, no en el de abajo. Es lo que
hacen los otros siete juegos (`otra-quiz-1.png`, `otra-masomenos-1.png`): la serie es consistente y
no la rompo acá. Lo que sí hago es que el toque sea grande (56 px) y que **ninguna opción de la hoja 1
caiga donde estaba "Empezá"** (`§4.3`).

### 4.2 Las dos opciones: igual peso, por construcción

Una opción que se viera distinta sería "la respuesta" (`UX-06` §3). Cada una de estas es medible:

| Propiedad | Las dos opciones |
|---|---|
| Papel, borde, letra y cuerpo | Idénticos |
| Alto | **El mismo**: en la mesa, en grilla con filas de igual alto; en el teléfono, ambas con `min-height: 56 px` y, si una pasa a dos renglones, la otra no se estira (quedan apiladas) |
| Giro | −0,4° la primera, +0,4° la segunda: espejo, mismo módulo |
| Sombra | La misma, dura de 3 px |
| Orden | El que sortea el motor: en cada hoja puede salir primero cualquier polo (`CTR-08.3`) |
| Número de tecla | Un sello chico de 1 y 2 **solo con mouse** (`(hover: hover) and (pointer: fine)`); la tecla 1 es la de arriba o la de la izquierda, la que se ve primero |

**Lado a lado en la mesa (≥ 64 rem), arriba y abajo en el teléfono.** Arriba y abajo ordenan y
"arriba" se lee como "primero"; izquierda y derecha, mucho menos. En el teléfono no hay lugar
para dos columnas de 28 caracteres a 16,8 px (cuenta: 235 px de texto contra ≈ 105 de columna útil),
así que el orden sorteado es lo que impide el sesgo. En la mesa, cada columna mide ≈ 272 px y una
opción de 28 caracteres puede pasar a dos renglones; **las dos filas miden lo mismo** porque la
grilla estira.

**El borde de papel con tinta (≈ 15:1 contra el papel, cuenta) reemplaza al borde `--borde`
(~1,5:1)**: la frontera de lo tocable deja de ser un hilo.

### 4.3 El toque

`US-06` criterio 8: un toque, una respuesta. La línea de tiempo de cada hoja:

| Tiempo | Qué pasa |
|---|---|
| **0 ms** | La opción tocada pasa a **elegida**: borde de 4 px, hundida 3 px (`translate: 3px 3px`, sombra en 0), `aria-pressed="true"`, en `--duracion-toque` (120 ms). Las dos opciones pasan a `aria-disabled="true"`: **inertes, pero sin apagarse**. La otra queda **exactamente como estaba** |
| **0 a 600 ms** | La pausa (`--pausa-eleccion`). Nada se mueve. Todo toque y toda tecla se ignora, también "Volvé a la anterior" |
| **600 ms** | Se reemplaza la hoja: la siguiente, el canto nuevo, el foco al `h2` y la región viva |

**La pausa no es movimiento, es espera.** No se va a cero con movimiento reducido: es lo que tapa el
doble toque (`D-57` punto 12). Por eso no es `--duracion-paso`.

**Tres cambios de forma, ninguno de color:** el borde pasa de 2 a 4 px (`--linea` más 1: un escalón
más grueso que la línea del sistema), la opción se hunde, la sombra se apaga. Y `aria-pressed`. **Nunca ✔**: ese símbolo es el del acierto y acá no hay acierto
(`D-33`).

**`aria-disabled` y no `disabled`.** Con `disabled`, el botón tocado pierde el foco y el lector de
pantalla no oye que "quedó apretado"; con `aria-disabled="true"` el foco se queda y se anuncia
"apretado" (`aria-pressed`). El navegador pinta gris un `disabled` si nadie le dice otra cosa, y gris
se leería como "esta no": con `aria-disabled` no hay estilo del navegador que sacar. Se estila con
el selector de atributo, **sin clase nueva** (`estilos.test.ts` exige regla para toda clase de estado).

**La que se había elegido, al volver a una hoja** (`.ejes-opcion--antes`): **la misma forma que la
elegida** (borde de 4 px, hundida, `aria-pressed="true"`), pero **sin inercia**. Un toque en la otra
la reemplaza; un toque en la misma la confirma. En los dos casos hay pausa y avance. Son dos clases,
un aspecto (así las dos cuentan en `ESTADOS_EJES`).

**Una tecla sostenida no contesta la siguiente.** La isla ignora los `keydown` con `repeat`: sin eso,
mantener apretado el 1 pasa los 600 ms y responde la hoja que acaba de llegar.

**La primera hoja no pone nada tocable donde estaba "Empezá".** "Empezá la noche" ocupa ≈ 514–576
y "Empezá otra noche" ≈ 539–601 (cuenta); las opciones de la hoja 1 están entre ≈ 221 y 349. La
cinta "Volvé a la anterior" no existe en la hoja 1. Es el mismo defecto que la pausa tapa en el
resto de la partida (un doble toque que cae sobre la hoja nueva), y acá se cierra por construcción.

### 4.4 El canto de las hojas que faltan

Cada hoja lleva debajo y a la derecha una pila de sombras duras, **papel y tinta alternados**
(`--papel-borde`, `--fondo`), que remata en `--borde`. Es objeto y no número: se afina hasta la última.

| Folio | Hojas que faltan | `data-quedan` | Escalones de papel | Sombra más lejana |
|---|---|---|---|---|
| 1 a 3 | 9 a 7 | 4 | 4 | 17 px |
| 4 y 5 | 6 y 5 | 3 | 3 | 13 px |
| 6 y 7 | 4 y 3 | 2 | 2 | 9 px |
| 8 y 9 | 2 y 1 | 1 | 1 | 5 px |
| 10 | 0 | 0 | ninguno: una sombra plana de 4 px en `--borde` | 4 px |

Se arma con `box-shadow` y se rige por un atributo (`data-quedan`), no por una clase. Nadie cuenta
escalones; el folio dice el número. Si alguien lo lee como una barra de avance, está bien: es avance,
no puntaje.

### 4.5 El sello del momento entra: el único movimiento

- **Cuándo.** Solo cuando **cambia el momento** respecto de la hoja anterior: cinco veces por noche
  (y cuando se vuelve a una hoja de otro momento). En la segunda hoja del mismo momento el sello ya
  está puesto y no vuelve a entrar: re-estampar el mismo sello en cada hoja sería ruido.
- **Cómo.** Una sola animación de `--duracion-paso` (200 ms) con `--curva-cinta`: el sello llega
  desde arriba y a la izquierda, torcido de más, y se asienta (`from { translate: -4px -6px; rotate:
  -5deg }`; las propiedades individuales se suman al `transform: rotate(-1.5deg)` del sello, así que
  el reposo no se toca). **No toca la opacidad**, no escala, no rebota: es un sello que se apoya.
- **Con movimiento reducido**, `--duracion-paso` va a 0 ms y el sello aparece ya apoyado. No hace
  falta otra regla: es el corte por familia de token de `UX-20` §5. `movimiento.test.ts` lo cuenta como
  animación atada a token.
- La animación se engancha con **una clase de estado** (`.ejes-momento--entra`) que la isla pone solo
  cuando el momento cambió; entra a `ESTADOS_EJES`.
- **Nada más se anima:** ni la hoja, ni el canto, ni la elegida (que usa `--duracion-toque`), ni el
  resultado. Los rótulos (`UX-20` §3) no llevan entrada propia, y el sello del momento no es uno de
  ellos: la lista de `UX-20` §3.1 es cerrada y no lo nombra.

### 4.6 "Volvé a la anterior"

- **Qué es.** La cinta de regreso del sitio (`.volver`), en su versión chica: rotulada de 0,8 rem,
  papel al 88 %, giro de −1,6°, **48 px de alto** (el piso de toque). Va **debajo de la hoja**, a la
  izquierda, con 24 px de margen (el canto ocupa los primeros 17).
- **Desde la hoja 2.** En la hoja 1 no existe: no hay a dónde volver y un botón apagado ahí es ruido.
- **No es una salida** (`D-54`): vuelve una hoja y no abandona la partida; por eso está permitida en
  plena partida y "← Al arcade" no.
- **Qué hace.** Vuelve a la hoja anterior, saca la respuesta guardada, muestra la opción que se había
  elegido marcada (`§4.3`). **La respuesta nueva reemplaza a la vieja: ningún camino deja un eje con
  más o menos de cinco** (`US-06` c8, `BR-17` regla 3).
- **Sin `pushState`:** inflaría las vistas de `D-56`. El botón de volver del navegador sale de la
  página, como en todo el sitio.
- **Con teclado:** Retroceso. Solo con una hoja a la vista, sin modificadores, y sin pausa en curso.
- **Por qué cinta y no un enlace subrayado:** el subrayado "suelto y a la izquierda" era uno de los
  defectos del antes (`§0.1`). La cinta es el idioma del sitio para "volver".

### 4.7 En la mesa (≥ 64 rem)

- La hoja de **38 rem** (608 px), con la carátula a la izquierda y **sin la lista**
  (`#pregunta` es una de las cuatro zonas de juego de `UX-35` §3.4).
- **Las dos opciones lado a lado**, de igual alto.
- **La letra de juego no crece** (`UX-35` §4.4): el enunciado queda en 20,8 px y las opciones en
  16,8 px. Crece el `h1` de la portada.
- La leyenda de las teclas ("Teclas 1 y 2 para elegir. Retroceso vuelve.", `--texto-tenue`, 0,85 rem)
  va a la derecha de la cinta, **solo con mouse**.

### 4.8 Qué pasa al acertar, al fallar y al irse

- **Acertar y fallar no existen.** Ninguna hoja es verde ni roja, no hay ✔ ni ✕, y la otra opción no se
  atenúa. La curiosidad por el resultado es lo que sostiene la atención (`UX-06` §3).
- **Abandonar** a mitad: no hay guardado. Al volver, portada. No hay progreso que valga persistir en
  una sesión de dos minutos (`BR-37` regla 3: ni `localStorage`).
- **Si el motor no puede armar la noche** (una celda vacía: el banco que valida el test no lo permite):
  la portada dice **una línea seca** en registro 3 y el botón sigue ahí. La cadena es nueva y es de
  `contenido`. Hoy, sin esa línea, "Empezá" no haría nada, que es un molinete.

---

## 5. El resultado: la última hoja (`US-06` c2, c3, c4c, c6)

### 5.1 La hoja, de arriba abajo

La última hoja es **papel liso**, giro de −0,5°, sombra dura de 5 px en `--borde` (sin canto: no
faltan hojas), con el **esquinero** pegado en su esquina de arriba a la derecha (4 rem en el teléfono,
5 en la mesa; `alt=""`, `pointer-events: none`).

| # | Elemento | Letra | Cuerpo | Color |
|---|---|---|---|---|
| 1 | **La marca chica** (dos renglones), con 4,5 rem de margen derecho para esquivar el esquinero | "ARCADE RICOTERO" en la **calcada** (`--fuente-titular`); debajo, el nombre del test en rotulada | 1,15 rem / 0,75 rem | **`--fondo`** / `--papel-tenue` |
| 2 | **El rótulo** "Esta noche te salió" | Rotulada, `letter-spacing: 0.14em` | 0,8 rem | `--papel-tenue` |
| 3 | **El nombre**, `h2` | Rotulada, peso normal, sin eco | 2,1 rem (33,6 px); 2,6 rem en la mesa | `--fondo` |
| 4 | **El sello de los polos** ("LUZ · ORDEN") | Rotulada | 0,75 rem | `--fondo` |
| 5 | **La línea que nombra** ("Con la gente, con plan.") | `--fuente`, negrita | 1 rem | `--fondo` |
| 6 | **La bajada** | `--fuente` | 1,02 rem, `line-height: 1.45` | `--fondo` |

- **La marca chica va en tinta y no en rojo.** El rojo de la marca sobre el papel da ≈ **3,0 : 1**
  (cuenta: 3,005): pasa solo como letra grande y solo por 0,005, y ese par no está en
  `contraste.test.ts`. Pasarlo con otra tinta de papel lo rompería en silencio. La marca en `--fondo`
  sobre `--papel` usa el par que ya existe y se lee como un sello de la imprenta. **Sin
  `view-transition-name`**: la marca de tránsito es una sola (`UX-35` §3.3) y esta línea no es esa.
- **Para qué está arriba:** en el teléfono la portada se fue, y sin esto una captura del resultado no
  decía de dónde era ni qué test.
- **El nombre es lo más grande de la pantalla**, más que el botón (`UX-06` §4 sigue valiendo). 2,1 rem
  porque 33,6 px en Archivo Black pasa a dos o tres renglones con un nombre de 26 caracteres (cuenta:
  ≈ 19 px por carácter), y una hoja con la mitad vacía por abajo no es lo que se busca. **Se acepta
  el tercer renglón.**
- **No lleva eco ni registro corrido** (`UX-22` §8): ese eco es del `h1`. El nombre va quieto.
- **Sin número, sin "ganaste", sin festejo, sin animación** (`D-33`).
- **El rótulo dice "esta noche"** (`BR-37` regla 1): nada de "sos", "eres" ni "siempre".

### 5.2 Las acciones

| Botón | Qué es | Notas |
|---|---|---|
| **Compartí** | `.primario.firma.con-tilde`, *Gulp!*, el más grande de la pantalla | `§6.1` dice qué viaja. La salida del compartir (`Se copió el enlace.`, el campo a mano) aparece debajo, con `aria-live="polite"` |
| **Empezá otra noche** | `.secundario` | Arranca la hoja 1 sin pasar por la portada ni pedir nada (`US-06` c6). Foco al `h2` de la hoja 1 y `scrollTo(0)`. El resultado nuevo **reemplaza** al anterior: sin historial ni comparación |

**Los dos entran sin desplazar** a 375 × 667 (`§5.6`). Una captura del resultado, además, sale con la
hoja, la marca y el botón: eso es lo que el que ve la captura necesita.

### 5.3 La grilla de dos por dos, relativa (`US-06` c3)

**Qué dice.** Las cuatro maneras, en papel, **la tuya primero**: arriba a la izquierda. Al lado, la que
comparte tu polo de luz–oscuridad; abajo, la que comparte tu polo de orden–caos; en diagonal, la
opuesta. Para cada persona "primero" es la suya, así que **ninguna manera queda fija por encima de
otra**: el rombo de antes dejaba las dos de luz siempre arriba.

**Cómo es.** Texto HTML, no un SVG. Una `ul` de cuatro celdas (`aria-label` "Las cuatro maneras, con
la tuya primero.") sobre dos renglones de rótulos y dos columnas de rótulos.

| Parte | Medida |
|---|---|
| **Título** | `h3` "Las cuatro maneras", rotulada 1,1 rem, `--texto`; margen de arriba `--espacio-4` |
| **La que canta** | "Cuatro puertas a la misma noche." (`CNT-30`), `--texto-tenue` |
| **Rótulos de columna** (los polos de orden–caos, **tu polo primero**) | En el margen de arriba, sobre cada columna: "Orden · con plan", "Caos · sobre la marcha". Rotulada de **0,75 rem** (era 0,68), `--texto-tenue`, `aria-hidden` |
| **Rótulos de renglón** (los polos de luz–oscuridad, tu polo primero) | **< 46 rem:** una regla punteada de `--borde` con el rótulo encima de cada par. **≥ 46 rem:** en el **margen izquierdo**, una columna de 5 rem, con la grilla `5rem 1fr 1fr`; el encabezado de columnas lleva el mismo margen izquierdo. `aria-hidden` |
| **Las celdas** | Borde de 2 px en `--borde`, esquina de 3 px, **sobre `--fondo`**: no una "superficie elevada" |
| **El nombre** | Rotulada 0,95 rem |
| **Cada celda abre su bajada** con `<details>` | El `summary` mide **≥ 72 px** (`--toque-min` + 24) y es tocable entero. Al abrir, la celda muestra la línea que nombra (negrita) y la bajada (0,9 rem). El indicador "+" / "−" va arriba a la derecha, con texto alternativo vacío, y deja 1,6 rem de relleno a la derecha del nombre |
| **Foco** | `.ejes-manera summary:focus-visible` con el aro de siempre (`var(--linea) solid var(--acento-2)`, `outline-offset: 2px`): el global `:where(a, button):focus-visible` no alcanza a `summary` |
| **Una columna** | **< 22 rem (352 px)**: las cuatro celdas apiladas, en el orden relativo (la tuya, la que comparte luz–oscuridad, la que comparte orden–caos, la opuesta). A 360 px el ancho útil del nombre es de ≈ 116 px: entra "Radio bajita," y no más |

**La tuya y la del amigo se marcan con dos canales, nunca solo color:**

| Celda | Borde | Sello |
|---|---|---|
| **La tuya** | `--linea` (3 px) sólido en `--tinta-disco` (el cuero) | "ESTA NOCHE" |
| **La de quien te mandó el enlace** | **punteado** | "QUIEN TE LO MANDÓ" |
| Si es la misma | grueso y punteado | los dos sellos |

El sello de la grilla es de **0,75 rem** (era 0,62: ≈ 10 px) y va como `inline-block` con
`max-width: 100%`, `line-height: 1.15`, `text-wrap: balance`: "QUIEN TE LO MANDÓ" (17 caracteres,
≈ 143 px) no cabe en un renglón dentro de una celda de 116 px y **tiene que partirse adentro de su
rectángulo**, como un sello de dos renglones, y no con el borde cortado.

**Por qué rótulos de polo y no de manera.** Dicen qué tienen en común dos celdas, no quién es quién:
traducen las puntas que antes nadie traducía ("Oscuridad" se leía triste) y no ordenan.

**Las cuatro celdas pesan igual:** mismo borde, mismo relleno, mismo cuerpo de nombre, mismo alto
cuando están cerradas. Abrir una agranda el renglón entero (la vecina se estira, con el mismo marco).

### 5.4 El contraste al volver (`US-06` c4c, `CNT-29`)

Una línea neutra, en registro 3, `--texto`, 0,95 rem. **Va entre los botones y la grilla**, como
segunda línea del bloque de la grilla, y no entre la hoja y los botones. Por tres razones:

1. Entre la hoja y los botones empuja "Empezá otra noche" bajo el pliegue en el caso con desafío
   (cuenta: +72 px, el botón terminaría en ≈ 673 de 667).
2. Es **el pie de la grilla**: habla de lo que la grilla muestra (la celda tuya y la punteada). Pegada
   a la evidencia se entiende mejor.
3. La hoja es de quien juega. Lo que dice del otro es un segundo plano.

Es simétrica (`relacion(a, b) === relacion(b, a)`) y nunca gana ni pierde. El texto exacto es de
`CNT-29`; la isla elige la frase con `relacion()`.

### 5.5 "Bajá la tarjeta" y "← Volvé al arcade"

- **"Bajá la tarjeta"**: un `<a download>` debajo de la grilla, **48 px de alto**, a todo el ancho, borde
  de 2 px **punteado** en `--borde`, `--texto-tenue`, rotulada 0,8 rem. Nada de enlace subrayado. Es la
  tercera acción (después de Compartí y Empezá otra noche) y está al final porque la gente que no
  puede compartir archivos tiene el enlace y el campo "Copiá esto y mandalo" (`D-14`: nadie se queda
  sin poder mandarla).
- **"← Volvé al arcade"**: la cinta `.volver` en `.salida-resultado`, centrada, con `--espacio-3` de
  margen de arriba. Reemplaza al enlace subrayado a la izquierda del antes.

### 5.6 El alto, a 375 × 667 (cuenta; el peor caso: nombre de tres renglones, línea de dos, bajada de cuatro)

| Tramo | Alto | Acumulado |
|---|---|---|
| `main` (16) + margen de la hoja (16) + borde (2) + relleno (16) | 50 | 50 |
| La marca chica (36) + 12 | 48 | 98 |
| El rótulo (18) + 4 | 22 | 120 |
| El nombre, tres renglones de 36 | 109 | 229 |
| 8 + el sello de polos (26) + 8 | 42 | 271 |
| La línea que nombra, dos renglones, + 8 | 56 | 327 |
| La bajada, cuatro renglones | 94 | 421 |
| Relleno (24) + borde (2) | 26 | 447 |
| Margen de las acciones (24) y **Compartí** (60) | 84 | **531** |
| 8 y **Empezá otra noche** (62) | 70 | **601** |

Holgura de 66 px. **A 360 × 640** el mismo caso suma un renglón más al nombre (más angosto) y uno a la
bajada, y **Compartí** termina ≈ 556: entra. **Por medir** las dos ventanas.

### 5.7 En la mesa (≥ 64 rem): una columna

**Una sola columna de 38 rem, sin dos paños.** Lo evalué y no conviene:

- Una hoja a 38 rem tiene el nombre a 2,6 rem en dos renglones y los dos botones **entran** a
  1366 × 657 (cuenta: Compartí termina en ≈ 481 y Empezá otra noche en ≈ 551), con el título de la
  grilla ya a la vista (empieza en ≈ 591) como invitación a bajar.
- Los dos paños (hoja a la izquierda, grilla a la derecha, a `--ancho-tablero-amplio`) dejan la hoja en
  ≈ 433 px: el nombre pasa a tres renglones y la grilla a celdas de 183 px. Y sumaría una hoja de otro
  ancho al final de una partida que corrió a 38 rem.
- `UX-35` §4.5 da dos paños a "Ponelos en fila" porque ahí **el mouse viaja** entre bandeja y filas. Acá
  no viaja nada: se lee de arriba abajo.
- `UX-35` §6.6 dejó escrito que, si el usuario quiere llenar más, el candidato es "una segunda columna
  con algo que mostrar". **Esta grilla es ese candidato.** Queda anotado en `§11`; no se hace sin pedido.

Lo que sí cambia en la mesa: el nombre a **2,6 rem** (es el título de la pantalla: crece con el `h1`,
no es letra de juego), la grilla a **5 rem de margen izquierdo y celdas de ≈ 256 px**, el esquinero a
5 rem. La lista de la carátula **vuelve** en el resultado (`UX-35` §3.4) y "Compartí" sigue siendo la
pieza de más peso.

### 5.8 Lo que el resultado no tiene

Ningún número, ningún puntaje, ningún "más", ningún grado dentro de la manera, ningún punto en el
plano, ninguna frase que defina a la persona ("sos X"), ninguna comparación con una noche anterior,
ninguna animación. `Resultado` son tres strings y el tipo no deja pasar otra cosa (`CTR-08.6`).

---

## 6. Compartir: la tarjeta y la vista previa (`US-06` c4a)

### 6.1 Qué viaja y cómo falla

Al tocar **Compartí**: la **tarjeta de imagen de su manera**, el texto (`RESULTADO.paraCompartir`) y
el enlace a la **postal** de esa manera (`/juegos/dos-ejes/cu-n/`). Ningún número, ningún dato de la
persona.

La tarjeta se baja **al pintar el resultado**, no al tocar, así `navigator.share({ files })` sale en
el mismo gesto (Safari pierde el gesto con un `await` antes).

| Situación | Qué pasa |
|---|---|
| Hoja de compartir del sistema | Se abre con tarjeta, texto y enlace |
| La persona cancela | Nada. Ni error ni aviso |
| El aparato no comparte archivos | Comparte el texto y el enlace sin imagen. "Bajá la tarjeta" sigue siendo un enlace normal |
| No hay `navigator.share` | Copia `texto + enlace` y dice "Se copió el enlace." (`aria-live`) |
| Tampoco hay portapapeles | Queda el campo "Copiá esto y mandalo", con el texto seleccionable |
| La tarjeta no se pudo bajar (sin red) | Comparte sin imagen; el resultado no se rompe |

**Por medir en un teléfono real:** algunos destinos descartan el campo `url` cuando hay archivo. Si
se confirma, el enlace va también adentro de `text` en esa rama. Es una nota para el hilo principal; no
la doy por hecho.

### 6.2 La tarjeta, 1080 × 1350 (`public/tarjetas/dos-ejes/cu-n.png`, ≤ 160 KB)

El lienzo y el margen: `--fondo` con grano; **margen de 72 px** por los cuatro lados (6,7 %: los
recortes a 4 : 5 y las barras de las aplicaciones no tocan nada importante).

**La composición**, de arriba abajo (y de la hoja, relativa a su borde de arriba, `hy = 230`):

| Elemento | Letra | Cuerpo | Interlínea | Posición | Color |
|---|---|---|---|---|---|
| **"ARCADE RICOTERO"**, sobre el fondo | Calcada | 62 | — | baseline 126 | `--marca-rojo` (par con `--fondo` ya testeado) |
| El nombre del juego | Rotulada, `letter-spacing: 2` | 30 | — | baseline 178 | `--texto-tenue` |
| **La hoja**, papel con borde de 6 px en `--fondo`, giro −0,8°, sombra dura de 14 px (negro al 55 %) | — | — | — | x 72, y 230, ancho 936 | `--papel` |
| "ME SALIÓ" | Rotulada, `letter-spacing: 4` | **34** (era 28) | — | +88 | `--papel-tenue` |
| **El nombre** | Rotulada | **80** (era 84) | 88 | primer baseline +176; **≤ 3 renglones** | `--fondo` |
| **El sello de polos** | Rotulada, `letter-spacing: 3` | **30** (era 26), alto = 2,1 × cuerpo | — | 40 bajo el último baseline | `--fondo` |
| **La línea que nombra** | Sans, negrita | **40** (era 42) | 48 | 54 bajo el sello; **se parte en dos renglones si no entra** | `--fondo` |
| **La bajada** | Sans | **34** (era 38) | 48 | 58 bajo la línea; **≤ 5 renglones** | `--fondo` |
| Relleno de abajo de la hoja | — | — | — | 48 | — |
| **El esquinero** de la hoja, **150 × 171** | — | — | — | esquina de arriba a la derecha, pegado | — |
| **La cinta**, 150 × 42, −4° | — | — | — | arriba al centro | `--papel` al 62 % |
| **El libro** (`franja`) | — | — | — | **detrás** de la hoja y torcido 1,6°, **con el borde de abajo fijo en y = 1150** | — |
| **Crédito** | Sans | **26** | — | baseline 1190 | `--texto-tenue` |
| **El enlace del sitio** | Sans | 26 | — | baseline 1224 | `--texto-tenue` |
| **"¿Y A VOS CUÁL TE SALE?"** | Rotulada, `letter-spacing: 2` | **44** (era 36) | — | baseline **1278** (era 1320: fuera de la zona segura) | `--texto` |

**Reglas de la hoja.**

- **El ancho de texto** es `936 − 56 − 56 = 824` px; **el nombre usa 674** (queda lugar para el
  esquinero de 150 px en los primeros renglones).
- **Las cuatro hojas miden lo mismo.** El taller calcula el alto de cada una y **toma el mayor de las
  cuatro** (tope **860**, piso 740). Es el requisito de `US-06` c4a ("las cuatro tarjetas pesan
  igual"): cuatro hojas de cuatro alturas dejarían una "más completa". El libro baja con ella, así
  asoma siempre la misma tira.
- **La cuenta** (cuerpos de arriba, sans a ≈ 0,56 em): las combinaciones reales —`CU-2`, con el
  nombre de tres renglones y una bajada de cinco (≈ 167 caracteres a 43 por renglón), y `CU-4`, con el
  nombre de tres y la línea de dos— dan una hoja de **≈ 817 px**. El peor caso teórico, los tres máximos
  juntos, da 865: cinco por encima del tope de 860. Ahí **el taller falla** y se achica el texto, no la
  hoja.
- **El libro asoma ≥ 60 px** bajo la hoja más alta (cuenta: hoja hasta y = 1090, libro hasta 1150).
- **El crédito va en la tarjeta** porque es un archivo que se guarda y se reenvía: dice qué se usó y de
  dónde (`TARJETA.credito`). Sin día ni mes de *Luzbelito* (`RES-167`); el año 1996 no está en duda.

**Lo que no muestra:** el plano, la grilla, ninguna pregunta ni opción, el óvalo, la figura, el título
LUZBELITO, ninguna vela, ningún verso, ningún número.

**A escala de teléfono** (la tarjeta a ≈ 360 px de ancho, un tercio): el nombre queda en ≈ 27 px, la
línea que nombra en ≈ 13, la bajada en ≈ 11 y el crédito en ≈ 9: **el crédito es letra chica, a
propósito**; todo lo que se tiene que leer en la miniatura es el nombre y "ME SALIÓ". Cuerpo mínimo
de lo que no es crédito ni enlace: **30 px**.

### 6.3 La vista previa de cada postal, 1200 × 630 (`og-cu-n.png`, ≤ 120 KB)

Se ve en un chat o en una red a 300–500 px de ancho (cuenta: 0,25–0,42): ahí lo único que se lee es el
nombre y la marca. **La jerarquía es esa.**

| Elemento | Letra | Cuerpo | Posición |
|---|---|---|---|
| **La marca**, **sobre una franja oscura de arriba** | Calcada | 48 | x 100, baseline 70, en `--marca-rojo` sobre `--fondo` |
| **La hoja** (papel, borde de 6 px, giro −0,6°) | — | — | x 48, y 100, ancho 1104, **alto 440** |
| "ME SALIÓ" | Rotulada | 26 | +62 |
| **El nombre** | Rotulada | **76**; **≤ 2 renglones** | primer baseline +150, interlínea 84 |
| El sello de polos | Rotulada | 26 | 30 bajo el último baseline |
| **La línea que nombra** | Sans, negrita | 34 | **debajo del sello** (baseline ≈ +372) |
| **El esquinero** | — | — | 118 × 135, esquina de arriba a la derecha |
| **El libro** (`franja`) | — | — | de ancho 1160, **con el borde de abajo fijo en y = 630**, detrás de la hoja: asoma ≈ 90 px |

- **La marca va en la franja oscura y no en la hoja.** El rojo sobre el papel da ≈ 3,0 : 1 (`§5.1`).
  Sobre `--fondo` es el par ya testeado.
- **El nombre a 76 px en dos renglones como mucho.** Si el nombre da tres, el taller baja el cuerpo a
  66; si con 66 siguen siendo tres, **falla**. Mide con las métricas reales de la fuente (`fontkitten`).
- **La línea que nombra va debajo del sello, no a su derecha.** El sello más ancho, "OSCURIDAD ·
  ORDEN", mide ≈ 405 px con cuerpo 26 y la línea que nombra, puesta a un desplazamiento fijo de 330 px,
  **lo pisa**: es un defecto de la primera pasada (`§10`).
- **Zona segura:** todo lo que se lee queda a ≥ 36 px de los bordes (los recortes de 2 : 1 pierden 15 de
  alto por lado).
- **El `alt`** lleva el crédito: `TARJETA.alt(nombre, linea)`.

### 6.4 La vista previa de la portada (`og-dos-ejes.png`, ≤ 120 KB)

Igual que `§6.3` salvo el contenido de la hoja: el **título** ("¿Qué tipo de ricotero sos?") a 78 px en
dos renglones y **los cuatro nombres** a 30 px o más, en dos columnas (x = `tx` y `tx + 520`), **todos
del mismo cuerpo, sin ninguno primero ni más grande**.

- **El orden es el alfabético, no el de los ids.** El de los ids (`CU-1`, `CU-2`, `CU-3`, `CU-4`) pone
  las dos de luz arriba y las dos de oscuridad abajo: la jerarquía que el rombo viejo tenía y que
  `D-57` punto 7 vino a sacar. En orden alfabético (`localeCompare`), cada fila queda con una de luz y
  una de oscuridad.
- La primera pasada los ordenaba por id (`cuadrantesDelBanco()`): es un defecto, `§10`.

### 6.5 Las guardas del taller (para `tarjetas.test.ts` o el propio taller)

1. Ninguna línea sale del papel: `ancho(línea) ≤ ancho útil` con las métricas de la fuente.
2. El nombre: ≤ 3 renglones en la tarjeta; ≤ 2 en la vista previa (después de bajar a 66).
3. La hoja de la tarjeta ≤ 860 y la de la vista ≤ 440; **las cuatro iguales**.
4. Los cuatro nombres de `og-dos-ejes` en orden alfabético.
5. Ningún recorte toca el óvalo ni el título (ya está: `sePisan`).
6. Los pesos: 160 KB (tarjeta), 120 KB (vistas), 30 KB (cada pieza).
7. Todo texto sale de `copy.ts` y del banco; nada escrito a mano en el taller.
8. **`VERSION_DEL_DIBUJO` sube a 2**: la composición cambió (cuerpos, márgenes, libro, marca).

---

## 7. Las postales (`US-06` c4b)

`/juegos/dos-ejes/cu-1/` a `cu-4/` (`ADR-02` enmendado): la **misma noche** que `/juegos/dos-ejes/`
con el desafío puesto. La ruta lleva el id y nunca el nombre: si un nombre cambia, ningún enlace se rompe.

| Parte | Qué lleva |
|---|---|
| `og:title` | "Me salió «{nombre}»" (4 a 7 palabras) |
| `og:description` | `{línea que nombra} ¿Qué tipo de ricotero sos vos? Una noche de recital, sin saber nada.` |
| `og:image` | `og-cu-n.png`, 1200 × 630, con `og:image:alt` que lleva el crédito |
| **La portada** | Cinta, marca, `h1`, **la tapa con la etiqueta del amigo** (`§3.3`), el subtítulo y **"Empezá tu noche"**. Sin el renglón del lugar |
| **Al terminar** | El resultado de siempre, con la línea de contraste sobre la grilla (`§5.4`) y la celda del amigo punteada |

- **La preview dice qué le salió al otro** (la persona que comparte habla en primera: "Me salió"); **la
  página le habla a quien llega** ("A quien te lo mandó le salió"). El cambio de persona es correcto.
- **Qué es X, antes de jugar:** el nombre y los dos polos en palabras. Es lo que le faltaba a quien leía
  "A alguien le salió «Luna llena»".
- **Un toque** arranca la noche, con el desafío puesto. No salta la hoja 1.
- Las cuatro postales son **idénticas en estructura**; solo cambia lo que dice la etiqueta. Misma
  tapa, mismo tamaño de nombre, mismo alto.
- **Sin nombre de persona, sin foto, sin dato:** no hay backend.

---

## 8. Accesibilidad

### 8.1 Foco

| Cuándo | A dónde va |
|---|---|
| Al arrancar la noche y al tocar "Empezá otra noche" | Al `h2` de la hoja 1 |
| Cada hoja nueva | Al `h2` del enunciado (`tabindex="-1"`) |
| Al volver a una hoja | Al `h2` |
| Al pintar el resultado | Al `h2` del nombre |

- **El foco visible del `h2`**: con `:focus-visible` (solo cuando la navegación es por teclado), un
  contorno punteado de 2 px en `--fondo` a 4 px de la letra: dice dónde cayó el foco sin parecer un
  control. El `h2` no es interactivo, así que no lleva el aro amarillo de los botones. Con mouse o toque
  no se ve.
- **El orden de tabulación** sigue el visual: hoja → opción 1 → opción 2 → "Volvé a la anterior"; en el
  resultado, "Compartí" → "Empezá otra noche" → las cuatro celdas → "Bajá la tarjeta" → "← Volvé al arcade"
  → la lista de la carátula en la mesa (que es el último hijo de `main`, `UX-35` §6.2).
- **El foco no se pierde durante la pausa** (`aria-disabled` en vez de `disabled`, `§4.3`).

### 8.2 Grupo y región viva

- **`role="group"`** en las dos opciones, con `aria-labelledby` apuntando al `h2`: el lector dice la
  pregunta y después la opción.
- **Una sola región viva, persistente.** `<p id="ejes-anuncio" class="solo-lector" role="status">`
  (`aria-live="polite"`, `aria-atomic="true"`) en el **HTML estático de la página**, **afuera de las
  secciones que la isla vacía y rellena**. Una región viva que se crea junto con su texto no se anuncia de
  forma fiable: tiene que existir antes de que el texto cambie.
- **Qué dice:** `PARTIDA.anuncio` ("La previa. Pregunta 3 de 10."), **sin repetir el enunciado**, que lo
  lee el foco en el `h2`. Se actualiza **una vez por hoja**, con el texto distinto cada vez.
- **Al resultado, la región calla:** el foco en el nombre ya lo dice.
- Dos canales —foco y región viva— sin repetir texto es lo que pide `D-57` punto 13.

### 8.3 Teclas

| Tecla | Qué hace | Cuándo |
|---|---|---|
| **1**, **2** | Elige la opción de arriba / de la izquierda, o la otra | Con la hoja a la vista y sin pausa |
| **Retroceso** | "Volvé a la anterior" | Desde la hoja 2, sin pausa |
| **Enter**, **Espacio** | Lo de siempre sobre el control con foco | — |

Sin modificadores (`Ctrl`, `Meta`, `Alt`). **Ignora `keydown` con `repeat`.** Retroceso hace
`preventDefault`. Los dígitos podrían chocar con la navegación por encabezados de un lector de
pantalla en modo de lectura (el lector intercepta la tecla antes de que llegue a la página, así que
en principio no pasa): **por medir** con NVDA y JAWS (`§12.6`). **La leyenda solo con mouse**
(`(hover: hover) and (pointer: fine)`), y el sello de la tecla en cada opción también (`D-53`, `D-55`).

### 8.4 Lo demás

| Tema | Regla |
|---|---|
| **Ningún estado solo con color** | La elegida cambia de borde, de hundido y de sombra (más `aria-pressed`); la tuya y la del amigo, de borde (grueso, punteado) y de sello |
| **Contraste** | Todos los pares son `--fondo` / `--papel`, `--papel-tenue` / `--papel`, `--texto` y `--texto-tenue` sobre `--fondo`, `--fondo` sobre el cuero y sobre *Gulp!*: ya están en `contraste.test.ts`. **Ningún par nuevo** |
| **Borde de lo tocable** | Las opciones tienen borde de tinta sobre papel (≈ 15:1); el `summary` de la grilla lleva el "+" en `--texto-tenue` (≈ 7:1) |
| **Tamaño mínimo de letra** | **12 px** para todo lo que se lee (0,75 rem). Los 9,5 px del rombo y los 10 px de los sellos de la primera pasada se suben |
| **Zona pulgar** | Opciones de 56 px, separadas por 16; la cinta de volver a 48, lejos de las opciones (≥ 50 px) |
| **Doble toque** | `touch-action: manipulation` en las opciones y botones; la pausa y la inercia hacen el resto |
| **Movimiento reducido** | Se va a cero el sello (`--duracion-paso`); la pausa y los 120 ms del toque **se quedan** (`UX-20` §5) |
| **Zoom y texto grande** | Sin desplazamiento horizontal a 320 px y a 200 %; ningún texto en alto fijo; el nombre admite cuatro renglones sin romper la hoja |
| **Imágenes** | La tapa, el esquinero y el lomo son decorativos (`alt=""`); la tarjeta tiene `alt` en la vista previa y es un archivo con nombre (`cu-3-dos-ejes.png`) |
| **Lector de pantalla** | Los rótulos de la grilla (columnas y renglones) son `aria-hidden`: cada celda ya dice sus dos polos en palabras. La lista de la grilla lleva su `aria-label` |
| **Sin muro** | `§12.2` |

---

## 9. Presupuestos para `contenido` (reemplaza `UX-06` §7)

| Pieza | Presupuesto | De dónde sale |
|---|---|---|
| Título de la portada | ≤ 8 palabras | `voz-ricotera.md` §4.1 |
| Renglón del lugar | ≤ 8 palabras, 1 renglón (≤ 40 caracteres) | `.donde-estas`: 40 ch |
| Subtítulo | ≤ 2 frases, ≤ 24 palabras, ≤ 3 renglones a 375 px; **dice "no hace falta saber nada ni haber ido"** | `§1.2`, `UX-06` §0 |
| Rótulo del índice | ≤ 5 palabras | rótulo de etiqueta de 0,75 rem |
| **Sello de momento** | ≤ 3 palabras, **≤ 12 caracteres** | cabecera de la hoja: sello + folio ("10 de 10") caben en una línea |
| **La línea que canta** del momento | ≤ 8 palabras, ≤ 2 renglones | `voz-ricotera.md` §4.1; sin suspensivos |
| Enunciado | ≤ 14 palabras (≤ 80 caracteres: tres renglones a 375 px) | `UX-06` §7 |
| Opción | ≤ 5 palabras, **≤ 28 caracteres** | un renglón en el teléfono (cuenta: 235 px de 267) |
| **Nombre de la manera** | **≤ 26 caracteres**; ≤ 3 renglones en la hoja, ≤ 3 en la tarjeta, ≤ 2 en la vista previa | `UX-06` §7; `§6` |
| **Línea que nombra** | ≤ 36 caracteres ("Por cuenta propia, sobre la marcha." mide 35) | `§6.2`: una línea de la tarjeta a 40 px, o dos |
| Bajada | ≤ 36 palabras, **≤ 180 caracteres** | tarjeta: cinco renglones de ≈ 43 |
| Rótulo "Esta noche te salió" | 1 renglón | `§5.1` |
| Rótulo de la etiqueta del amigo | 1 renglón (≤ 30 caracteres) | `§3.3` |
| Línea de contraste | 1–3 renglones, R3, neutra y simétrica | `CNT-29`, `§5.4` |
| Botones | voseo imperativo, ≤ 3 palabras | `D-17` |
| Cadena nueva: "no se pudo armar la noche" | 1 renglón, R3, seca | `§4.8` |

---

## 10. Lo construido hoy contra esta hoja

Lo que leí en el código del 2026-10-04 y difiere de lo que fija esta hoja. Va por orden de peso; lo
aplica el hilo principal. **Nada de esto está medido ni corrido por mí.**

| # | Dónde | Hoy | Debe ser |
|---|---|---|---|
| 1 | `arte.ts`, `Tapa.astro`, `juego.css` | La tapa es una sola `<img>` de la `franja` (≈ 91 px a 343) y la etiqueta la pisa 1,6 rem | Tres capas (`marmol`, `lomo`, `esquinero`) y un alto que sale de la etiqueta (`§3.2`). `PIEZAS` suma `marmol` y `lomo` y **retira `canto`** |
| 2 | `Amigo.astro`, `[cu].astro` | Un `aside` suelto, con el renglón del lugar | La etiqueta del amigo **sobre la misma tapa**, borde punteado, **sin el renglón del lugar** (`§3.3`) |
| 3 | `partida-dos-ejes.ts` | Pisa `#subtitulo` con `PANTALLA_0.desafio` en el enlace viejo | Redirige a la postal, o inserta la etiqueta; **no pisa el subtítulo** (`§3.3`) |
| 4 | `partida-dos-ejes.ts` | `disabled` en las dos opciones durante la pausa | `aria-disabled="true"`; `aria-pressed` en la elegida; ignorar `keydown` con `repeat` (`§4.3`) |
| 5 | `partida-dos-ejes.ts` | `<p role="status">` creado **adentro** de cada hoja, con su texto | Una región viva persistente en el HTML de la página, fuera de las secciones (`§8.2`) |
| 6 | `.ejes-opcion--antes` | Solo borde de 4 px | La misma forma que la elegida: hundida y sin sombra, sin inercia (`§4.3`) |
| 7 | `.ejes-hoja` | Papel **rayado** | Papel **liso**; el rayado queda en las etiquetas (`§2.3`). Margen derecho de `--espacio-1`; regla fina de 1 px bajo la cabecera |
| 8 | `.ejes-anterior` | Botón transparente de borde punteado | La cinta `.volver` chica de 48 px (`§4.6`) |
| 9 | `.ejes-momento` | Sin animación | `.ejes-momento--entra` con `--duracion-paso`, solo cuando cambia el momento; suma a `ESTADOS_EJES` (`§4.5`) |
| 10 | `.ejes-marca` | Un renglón de 0,7 rem (11,2 px) | Dos renglones: la calcada a 1,15 rem en `--fondo` y el nombre del test a 0,75 rem (`§5.1`) |
| 11 | `pintarResultado()` | La línea de contraste **entre la hoja y los botones** | **Entre los botones y la grilla** (`§5.4`) |
| 12 | `.ejes-grilla-polo`, `.ejes-grilla-renglon`, `.ejes-manera-sello` | 0,68 rem y 0,62 rem; sello en línea | **≥ 0,75 rem**; sello `inline-block` de varios renglones; rótulos de renglón en el margen izquierdo desde 46 rem; una columna bajo 22 rem (`§5.3`) |
| 13 | `.ejes-manera summary` | Sin foco propio; el "+" sin texto alternativo | `summary:focus-visible` con el aro del sitio; `content: '+' / ''` (`§5.3`) |
| 14 | `.ejes-bajar` | Enlace subrayado | Botón punteado de 48 px (`§5.5`) |
| 15 | `.ejes-enunciado:focus` | Sin estilo propio (el global no alcanza a un `h2`) | Contorno punteado `:focus-visible` (`§8.1`) |
| 16 | `generar-dos-ejes.mjs` — tarjeta | Hoja fija de 740 px: con un nombre de tres renglones y una bajada de cinco, **el texto sale del papel** (cuenta: la última línea cae ≈ 60 px abajo). La línea que nombra no se parte: `Por cuenta propia, sobre la marcha.` mide ≈ 955 px contra 824 de papel. Cuerpos de 26 a 28 px en el sello, "ME SALIÓ" y la pregunta | Hoja del alto de la mayor de las cuatro (tope 860); línea que nombra en dos renglones; los cuerpos de `§6.2`; pregunta a 44 px y a y = 1278; libro con el borde de abajo fijo |
| 17 | `generar-dos-ejes.mjs` — vista previa | Marca en `--marca-rojo` **sobre el papel** (≈ 3,0 : 1); la línea que nombra a +330 px, que **pisa** el sello `OSCURIDAD · …`; `og-dos-ejes` con los nombres en el orden de los ids | Marca en una franja oscura; línea debajo del sello; orden alfabético (`§6.3`, `§6.4`) |
| 18 | `taller.ts` | `VERSION_DEL_DIBUJO = 1` | **2** |
| 19 | `copy.ts` | `indiceRotulo` "Adentro del libro"; polos en mayúscula y `por tu cuenta`; `lasCuatroCanta` "Cuatro sillas…" | Lo que dice `CNT-30` §6.2 (es de `contenido`: acá solo marco que afecta el largo de la línea que nombra y el rótulo de la tapa) |
| 20 | `LUGARES.dosEjes` (`sitio/copy.ts`) | "Una vela te alumbra media cara." | "Hay un lugar libre en el micro." (`CNT-30` §6.4); el renglón **se queda** en la portada normal, **se va** en la postal |
| 21 | Carátula del casete A2 y pie | El medallón del óvalo y la vela | **No se toca en este ciclo** (`D-57` punto 9); queda anotado en `§11` |

**Lo que ya está bien y se conserva:** la pausa leída del token (`pausa()`); el foco al `h2` (`enfocar`);
`role="group"`; el `h1` fuera de la etiqueta; el canto con `data-quedan`; los estados sin clase nueva
para la grilla (`--tuya`, `--suya`); el bloque `.ejes-*` en `juego.css` y no en el `<style>` de la página
(el alcance de Astro no llega a lo que crea la isla); `disposicion()` y `relacion()` tal cual; la
tarjeta que se baja al pintar el resultado.

---

## 11. Lo que no me cierra, y lo que queda abierto

1. **El medallón sigue en pantalla, y es la pieza que `D-57` dice no usar.** El casete A2 y su carátula
   (`D-51`, `D-54`) muestran el óvalo con el busto y la vela, y el pie del sitio lleva la vela. En la
   mesa conviven con el libro nuevo en la misma pantalla. `D-57` punto 9 los deja explícitamente fuera
   de este ciclo, y `RES-168` pide tratar esa figura "en registro 3 y nunca como pieza ni mascota".
   Propuesta para el usuario: cambiar la pieza del casete A2 por la tira del libro (`franja` o
   `marmol` + `lomo` + `esquinero`) y dejar la vela solo en la carátula del pie. Toca `copy.ts` del sitio
   (`JUEGOS`), el portal (`UX-25`) y la carátula (`UX-35`): **es de otro ciclo y no la hago.**
2. **Dos paños en la mesa** (`§5.7`): descartado por ahora, con la cuenta. Es el candidato de `UX-35`
   §6.6 si el usuario quiere llenar más la pantalla.
3. **El caso lento roza los dos minutos** (`§1.1`). Se mide con gente. Si pasa, no se corta una pregunta:
   se baja `--pausa-eleccion` a 500 ms **solo** si se mide que 600 ms estorban, y nunca por debajo de lo
   que tapa el doble toque.
4. **La grilla en una columna bajo 352 px** (`§5.3`) pierde la lectura de "dos por dos" en los teléfonos
   más angostos. Es lo que cabe; el orden relativo se conserva.
5. **Un `h1` oculto durante la partida.** En `#pregunta` y `#resultado` no hay `h1` a la vista (está en
   `#inicio`, oculto): la estructura de encabezados arranca en `h2`. Es igual en los otros juegos y no lo
   cambio acá.
6. **El año de *Luzbelito*.** El crédito dice "1996" y no el día (`RES-167`). Si `investigador` cierra la
   fecha, solo cambia `TARJETA.credito` y se vuelve a correr el taller.
7. **La fecha y el aniversario no entran** a ninguna pantalla (`D-57`, alternativas descartadas).
8. **`ESTADOS_EJES`** suma `.ejes-momento--entra`; el censo de `estilos.test.ts` lo exige.

---

## 12. Checklist (lo corre quien implemente o `revisor`, `D-12`)

### 12.0 Comandos

```
rg -n "^# UX-36" Docs/UX/
node --test src/lib/contraste.test.ts
node --test src/lib/estilos.test.ts
node --test src/lib/voz.test.ts
node --test src/lib/movimiento.test.ts
node --test src/lib/dos-ejes/partida.test.ts src/lib/dos-ejes/banco.test.ts src/lib/dos-ejes/tarjetas.test.ts
npm run generar-dos-ejes
npm test
```

- [ ] `npm test` en verde; el número lo da la corrida (la línea de base era 1405/1405).
- [ ] `tarjetas.test.ts`: la huella coincide **después de** subir `VERSION_DEL_DIBUJO` y volver a correr el taller.
- [ ] `contraste.test.ts`: **sin pares nuevos**. Si aparece uno, está mal puesto (`§8.4`).

### 12.1 Las pantallas, a 375 × 667

- [ ] Portada: el borde de abajo de "Empezá la noche" ≤ **576 + 20** (`getBoundingClientRect().bottom`).
- [ ] Postal: el de "Empezá tu noche" ≤ **637 + 20**; si no, se achica el relleno de la tapa.
- [ ] `document.querySelectorAll('.pantalla > h1').length` = 1 por pantalla, y **no** adentro de `figcaption`.
- [ ] La tapa mide el alto de la etiqueta + 28 + 24 (`offsetHeight`, no `getBoundingClientRect`: está torcida).
- [ ] El lomo y el esquinero se ven; el mármol asoma arriba y abajo de la etiqueta.
- [ ] Hoja: termina ≈ 377; ninguna opción de la hoja 1 cae entre y = 514 y 601 (donde estaban "Empezá la noche" y "Empezá otra noche").
- [ ] Las dos opciones: mismo `offsetHeight` en la mesa; mismo ancho; `min-height` ≥ 56.
- [ ] Resultado: "Compartí" y "Empezá otra noche" terminan ≤ **601 + 20**; a 360 × 640, "Compartí" ≤ 640.
- [ ] La grilla: cuatro celdas; la primera es la tuya; a 360 px dos columnas sin texto cortado; a 351 px, una.
- [ ] Sin desplazamiento horizontal a 320, 360 y 375: `scrollWidth <= innerWidth`.

### 12.2 Primera pantalla sin muro

- [ ] Cero campos y cero permisos entre el enlace y la hoja 1; **un solo toque**.
- [ ] El subtítulo dice que no hace falta saber nada ni haber ido, **también en la postal**.
- [ ] Nada pide plata, cuenta, haber ido ni conocimiento de la banda.
- [ ] La hoja 1 es la escena de la previa: cualquiera la contesta.
- [ ] Un enlace con `r=CU-9` abre la portada normal, sin error.

### 12.3 El toque y la noche

- [ ] **Doble toque:** dos toques seguidos en una opción registran **uno**; la hoja siguiente no se contesta. Repetir con toques en la otra opción y en el lugar donde va a aparecer la siguiente.
- [ ] Durante los 600 ms: la otra opción **no se apaga**; "Volvé a la anterior" no responde; ninguna tecla responde.
- [ ] `getComputedStyle(document.documentElement).getPropertyValue('--pausa-eleccion')` da `600ms`, y **con movimiento reducido sigue dando `600ms`**.
- [ ] Una tecla 1 sostenida no contesta la hoja siguiente.
- [ ] Volver con "Volvé a la anterior" y elegir la otra opción: **cinco respuestas por eje** al final, siempre.
- [ ] El sello entra solo cuando cambia el momento (cinco veces por noche), dura 200 ms y no toca la opacidad. Con movimiento reducido aparece puesto.
- [ ] "Empezá otra noche": hoja 1 sin portada; en las noches 1, 2 y 3 de la visita **ninguna escena se repite** (`BR-37`).
- [ ] Ningún estado es verde ni rojo; ningún ✔ ni ✕.
- [ ] `rg -n "localStorage|sessionStorage|document\.cookie" src/scripts/partida-dos-ejes.ts` devuelve **una sola línea**: el comentario.

### 12.4 Accesibilidad

- [ ] El foco cae en el `h2` en cada hoja y en el resultado (`document.activeElement.tagName`).
- [ ] `role="group"` con `aria-labelledby` en las dos opciones.
- [ ] La región viva existe **antes** de la primera hoja y dice el momento y el folio, una vez por hoja.
- [ ] La elegida conserva el foco y anuncia "apretado" (`aria-pressed`).
- [ ] Teclado: 1, 2, Retroceso; orden de tabulación del `§8.1`; el aro visible en `summary` y en cada cinta.
- [ ] Contorno punteado en el `h2` solo con `:focus-visible`.
- [ ] Con NVDA o JAWS en modo de lectura, 1 y 2 no se quedan sin hacer lo suyo (encabezados) ni dejan de elegir con el foco en la hoja.
- [ ] Texto ≥ 12 px en todo lo que se lee (`getComputedStyle(...).fontSize`).
- [ ] El "+" del `summary` y el punto medio del índice no se leen como "más" ni "punto medio".

### 12.5 Las piezas, la tarjeta y las postales

- [ ] `libro-marmol.jpg`, `libro-lomo.jpg`, `libro-esquinero.png` ≤ 30 KB c/u; `libro-canto.jpg` ya no está en `PIEZAS` ni en `public/arte/dos-ejes/`.
- [ ] Ningún recorte toca el óvalo ni el título (`sePisan` en `generar-dos-ejes.mjs`).
- [ ] `cu-1.png` a `cu-4.png`: 1080 × 1350, ≤ 160 KB; **las cuatro hojas del mismo alto**; ninguna línea sale del papel; la última línea de la bajada entra con el nombre de tres renglones (`CU-2`, `CU-4`).
- [ ] `og-cu-1.png` a `og-cu-4.png`: 1200 × 630, ≤ 120 KB; la marca en la franja oscura; el sello y la línea que nombra **sin pisarse**, en las cuatro (mirar `CU-3` y `CU-4`, las de "OSCURIDAD").
- [ ] `og-dos-ejes.png`: los cuatro nombres en orden alfabético.
- [ ] Las cuatro postales: mismo alto de la portada, mismo cuerpo de nombre; `og:title` "Me salió «…»"; `og:image` con su `alt`.
- [ ] El pie acredita *Luzbelito* **una sola vez** por pantalla.
- [ ] Ninguna pantalla ni tarjeta muestra una vela, el óvalo, la figura, la palabra LUZBELITO ni el verso.

### 12.6 En un teléfono real (lo que ninguna máquina ve)

- [ ] Una noche entera, con cronómetro, de alguien que nunca vio el juego: ¿cierra en dos minutos?
- [ ] Compartí con archivo en iOS y en Android: ¿llega el enlace? (`§6.1`)
- [ ] La grilla, la tapa y la hoja a la intemperie (brillo alto): ¿se lee el sello? ¿se distingue el canto?
- [ ] ¿Alguna de las cuatro maneras se lee más pobre o más triste (`CNT-30` §9)? Es de `REV-19`, pero esta pantalla es donde se nota.
