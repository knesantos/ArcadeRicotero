# REV-18 — "La mesa y la carátula" (`D-54`), verificado contra sus criterios

> Revisado el **2026-10-02** por `revisor`, con contexto fresco y sin haber armado ninguna de
> las piezas. **Pegado en esta ruta por el hilo principal**: `revisor` no tiene herramientas de
> escritura. El texto de la revisión es el suyo, sin cambios; el cierre del final es del hilo
> principal.
>
> **Qué se verificó:** `D-54` y los diez puntos del encargo de `T-318`: `diseno-marca.md` (hex,
> medidas, anti-slop, circuito), `voz-ricotera.md` y `D-17`, la regla de salidas en partida
> (`D-54` punto 2, `UX-35` §3.4), `D-21` condición 1, accesibilidad de la carátula, islas,
> nombre de tránsito `marca`, tests nuevos, Skayboy (cortes y pantalla completa) y regresiones
> del teléfono. Como `T-317` aterrizó mientras revisaba, también miré en `UX-35` los números del
> checklist (§7) que el plan me asigna.
>
> **Sobre la base:** `git diff main` NO es el diff del ciclo. El `main` local (`90f2386`) está
> detrás de `HEAD` (`039bebd`) y da 122 archivos de ciclos anteriores. Lo revisado es el árbol de
> trabajo contra `HEAD`, **todo sin commitear**: 22 archivos modificados y 7 sin seguimiento
> (`Caratula.astro`, `caratula.ts`, `caratula.test.ts`, `UX-35`, el plan, el traspaso y la hoja
> 15). El código no cambió entre mi primera lectura y la última.

## Lo que pasó

- **`npm test`: 1400 de 1400.**
- **`npm run check`: 0 errores, 0 avisos, 13 hints.** Son las dos clases de siempre (`set:html`
  en un script con atributo y `platform` deprecado). Ninguno es de esta entrega.
- **Islas:** `git diff HEAD --stat -- src/scripts` vacío y `git status` sin entradas en
  `src/scripts/`. La carátula no tiene un solo `id`. Ninguna isla hace consultas anchas: sus
  `querySelector` son por clase puntual o por `id`.
- **En el navegador:** Chrome 154 sin cabeza, manejado por CDP. Dos servidores `astro dev`: el
  árbol de trabajo (puerto 4399) y una copia de `HEAD` sacada con `git archive` **fuera del
  repo** (puerto 4398), para comparar el teléfono de antes contra el de ahora. Medí: los ocho
  juegos a 375×667, 320×568 y 390×844 (teléfono); el portal a 375, 320, 414, 600, 768, 1023,
  1024, 1280 y 1440; los ocho juegos a 1440×900 antes y después de tocar "Jugá"; Skayboy en 18
  tamaños y en pantalla completa; la lista de la carátula a 1366×768, 1280×720, 1024×768,
  1280×600 y 1100×640; y el orden de tabulación con eventos de teclado reales.
- **Limitación:** una sola máquina y una sola fuente de sistema. El corte de renglones de la
  bajada de Skayboy depende de la fuente (ver `FIND-99`).

## Hallazgos

| ID | Sev. | Qué | Criterio |
|---|---|---|---|
| `FIND-99` | MEDIA | Skayboy: el sello de pantalla completa tapa la última línea de la bajada en la cabecera acostada | `UX-33` §1.2; `D-54` punto 7 |
| `FIND-100` | MEDIA | "Adiviná la tapa": la carátula deja a la vista, en toda la partida, la pieza de Último bondi, que es la respuesta de `TP-006` | `D-35` excepción 3; `D-37` punto 2 |
| `FIND-101` | MEDIA | Desde 64 rem el botón de "Adiviná el tema" deja de ir pegado al pie y en un portátil queda bajo el pliegue | `UX-01:255`; `UX-35` §7.8 |
| `FIND-102` | MEDIA | La lista de la carátula tiene renglones de 28 px y se ofrece también con puntero táctil | `diseno-marca.md` (`--toque-min`) |
| `FIND-103` | BAJA | "Ponelos en fila": `#eleccion` deja a la vista los once enlaces después de tocar "Empezá" | `D-54` punto 2 |
| `FIND-104` | BAJA | La carátula con la lista abierta no entra en una ventana de 768; el comentario del CSS dice que sí | comentario de `juego.css`; `UX-35` §7.3 |
| `FIND-105` | BAJA | La carátula va primera en el documento: once paradas de tabulación antes del juego | `UX-35` §6.2 |
| `FIND-106` | BAJA | Una sexta medida de marca vive en `juego.css`, no en `tokens.css` | `diseno-marca.md` |
| `FIND-107` | BAJA | Tres controles de `caratula.test.ts` prueban menos de lo que dicen | el propio test |
| `FIND-108` | BAJA | `CARATULA.lista` dice "Los otros casetes" y la lista trae también el de la página | `voz-ricotera.md` §5 |
| `FIND-109` | BAJA | Comentarios y textos de referencia que ya no dicen la verdad | `CLAUDE.md` §8 |
| `FIND-110` | BAJA | `UX-35` §7: el método de medición de varios ítems no da el número que cita | `UX-35` §7.1, §7.2 |

### FIND-99 — MEDIA — Skayboy: el sello de pantalla completa tapa la última línea de la bajada en la cabecera acostada

- **Criterio:** `UX-33` §1.2, líneas 117-124 ("la cabecera no pierde una letra… primero el área,
  después la cabecera, recién al final el sello puede perder su propio aire"). También el
  comentario de `skayboy.css:893-901`, que dice que la estampa no tapa la última línea de la
  bajada. Y `D-54` punto 7: "la bajada entra entera".
- **Evidencia (código):** `skayboy.css:848-851` pone `.fichin { margin-block: var(--espacio-2) 0 }`,
  o sea 16 px entre cabecera y mueble. `skayboy.css:903` y `:908` hacen que el sello asome 22 px
  sobre el mueble (`--sello-arriba: 22px`, `bottom: calc(100% - var(--chapa))`). Entran 6 px en
  la banda de la cabecera, en el borde derecho del mueble, que es justo donde la acostada pone la
  bajada (`.tenue { flex: 1 1 20rem }`, `:842`). El comentario de 893-901 se escribió para la
  cabecera apilada, con 24 px de margen.
- **Evidencia (medida):** comparé cada línea de la bajada (`Range.getClientRects()` sobre
  `.encabezado-juego .tenue`) contra el rectángulo del sello, de `gabinete.top − 22` a
  `gabinete.top + 4`.
  - **Solapa en:** 1024×640, 1024×700, 1000×640 / 700 / 768 / 800, 980×768 / 800, y 720 de ancho
    con alto de 520 a 768.
  - **No solapa en:** 1024×768, 1280×720, 1366×768, 1440×900, 812×600, 980×620.
  - **Captura a 1024×640:** "PANTALLA NORMAL" cubre "por" de "…una por vez.".
  - **Captura a 720×600:** igual.
- **Ojo:** el punto exacto depende de la fuente del sistema. La causa estructural (6 px de
  intrusión sobre el lado donde va la bajada) no depende de ella.
- **Verificar:** abrir `/juegos/skayboy-y-poligirl/` a 1024×640 y 720×600, y mirar la esquina de
  arriba a la derecha del mueble.
- **Arregla:** hilo principal, en `skayboy.css`. Opciones: reservar el ancho del sello en el
  borde derecho de `.tenue`; subir el `margin-block` del `.fichin` acostado a ≥ 24 px (cuidado
  con los 14 y 10 px de margen de los cortes de ×3 y ×4); o colgar el sello debajo del mueble
  como ya hace el ×2 apretado. `experiencia` ajusta la cifra de `UX-35` §5.4 si cambia un corte.

### FIND-100 — MEDIA — "Adiviná la tapa": la carátula deja a la vista, en toda la partida, la pieza de Último bondi, que es la respuesta de `TP-006`

- **Criterio:** `D-35` excepción 3 (`DECISIONES.md:1724-1727`): "el motivo de Último bondi es la
  respuesta correcta de `TP-006` y distractor en `TP-003` y `TP-009`. Una silueta de ese disco al
  pie del tablero le sopla la respuesta al que está jugando". Por eso `adivinar-la-tapa.astro:70`
  lleva `sinPasada`. También `D-37` punto 2 (no nombrar el disco, porque soplaría una respuesta
  de "Adiviná la tapa") y `CLAUDE.md` §6.
- **Evidencia:** `caratulaDe('/juegos/adivinar-la-tapa/')` trae `/arte/bondi-interplanetario.png`
  (el ojo de buey, pieza de Último bondi). `juego.css:3353-3355` sólo esconde `.caratula-lista`
  con `#partida` a la vista. La pieza (`.caratula-frente`) queda. Medido en el navegador a
  1440×900 tras tocar "Jugá": `.caratula` con `display:flex`, el ojo de buey a 152 px al lado del
  tablero. En el teléfono no hay fuga: la calcomanía se va con la portada.
- **Matiz:** ya había una foto velada del bondi detrás de la hoja (`tapa-fondo--bondi-engranajes`).
  Lo nuevo es una pieza sin velo, nítida y fija durante todo el juego, justo lo que `sinPasada`
  evita.
- **Verificar:** abrir `/juegos/adivinar-la-tapa/` a 1440×900, tocar "Jugá" y mirar la columna
  izquierda.
- **Arregla:** hilo principal, con una decisión de `experiencia`. Sólo `.juego--discos` es esta
  página: esconder `.caratula-frente` (o la pieza) con `#partida` a la vista en esa variante.
  Alternativa: escribir la excepción en `D-54` si se decide aceptarla.

### FIND-101 — MEDIA — Desde 64 rem el botón de "Adiviná el tema" deja de ir pegado al pie y en un portátil queda bajo el pliegue

- **Criterio:** `UX-01:255` ("Nada de scroll para encontrar el botón de jugar: entra en el
  viewport inicial"). `UX-35` §7.8 ("el botón principal de la portada de los ocho a la vista sin
  desplazar a 1366×768 de ventana") y §6.4. `D-54` no lo cuenta.
- **Evidencia:** `juego.css:3366` pone `body > main:has(> .caratula) .arranque { position: static;
  background: transparent }`. Posición del botón "Empezá" de `/juegos/adivinar-el-tema/`, antes
  (`HEAD`) y ahora:

  | Ventana | `HEAD` (sticky) | Ahora (static) |
  |---|---|---|
  | 1366×657 | 581–644 | **613–676, 19 px bajo el pliegue** |
  | 1280×600 | 524–587 | **613–676, 76 px bajo el pliegue** |
  | 1440×900 | visible | visible |

  Las otras siete portadas terminan en y ≤ 476 a 1280×600 y entran. A 1366×768 entra el botón de
  los ocho (el más bajo termina en 676).
- **Alcance:** una ventana de portátil de 768 de pantalla mide ~650 con las barras del navegador.
  Es una regresión respecto de antes del ciclo.
- **Verificar:** `getBoundingClientRect().bottom` de `#jugar` contra `innerHeight`, a 1366×657.
- **Arregla:** hilo principal. `UX-35` §6.4 sugiere volver a pegar el botón con una franja del
  alto del botón y no de toda la hoja, o bajar lo que lo empuja.

### FIND-102 — MEDIA — La lista de la carátula tiene renglones de 28 px y se ofrece también con puntero táctil

- **Criterio:** `diseno-marca.md`, reglas duras: "La base no rota nunca… zona pulgar
  (`--toque-min` ≥ 48 px)". `UX-10` §3.1: el ancho de ventana no dice que haya mouse. Ya lo
  señala `UX-35` §6.1.
- **Evidencia:** `juego.css:3317-3328` define `.caratula-tema` con `padding: 3px 8px; font-size:
  0.88rem; line-height: 1.3; border: 2px`. Medido: **28,3 px** de alto en los once renglones. El
  comentario de `:3315` dice "con mouse no hace falta el pulgar de 48 px", pero la regla corre
  desde `min-width: 64rem` sin mirar `pointer`. La única condición de capacidad (`:3386`) gobierna
  sólo el hover.
- **Arregla:** hilo principal. Con `(pointer: coarse)`, `min-height: var(--toque-min)` por
  renglón. Alternativa de `UX-35`: dejar la lista sólo con `(pointer: fine)`.

### FIND-103 — BAJA — "Ponelos en fila": la pantalla de elección (`#eleccion`) deja a la vista los once enlaces después de tocar "Empezá"

- **Criterio:** `D-54` punto 2 y la regla del `Caratula.astro` ("no agrega salidas a la
  partida"). El comentario de `juego.css:3351` afirma que las tres zonas (`#partida`, `#pregunta`,
  `#tablero`) cubren "los ocho tableros".
- **Evidencia:** `partida-ponelos.ts:109` alterna `inicio` / `eleccion` / `tablero`.
  `juego.css:3353` sólo nombra `#tablero`. Medido a 1440×900 en `/juegos/ponelos-en-fila/`: tras
  "Empezá" se ve `eleccion` y `.caratula-lista` queda en `display:block` (28,3 px × 11 enlaces).
  Tras elegir el conjunto, `#tablero` esconde la lista. En los otros siete se esconde bien.
  Ninguna isla muestra dos secciones a la vez.
- **Valoración:** no es "plena partida" en sentido estricto; es un paso del arranque. Pero ya
  tocó "Empezá", y `caratula.test.ts:158-161` lo deja pasar con `ids.some(...)`. Sube a MEDIA si
  se lee "partida" como "desde que tocó Empezá".
- **Arregla:** hilo principal. Sumar `#eleccion` al selector de `juego.css:3353` (y
  `.pantalla:first-of-type` ya la cubre en el teléfono). El test debería exigir que toda sección
  que no sea la primera ni `resultado` esté en `ZONAS`.

### FIND-104 — BAJA — La carátula con la lista abierta no entra en una ventana de 768 y en la portada no se pega; el comentario del CSS dice que sí entra

- **Criterio:** comentario de `juego.css:3230-3232` ("deja la carátula entera dentro de una
  ventana de 768 px de alto con la lista abierta"). `UX-35` §7.3 ("menor que el alto de la
  ventana menos 48").
- **Evidencia:** a 1366×768 en `/juegos/dos-ejes/`, `.caratula` va de y=40 a y=830: **790 px**, y
  la ventana mide 768. El último enlace termina en 830 (quiz 814, tema 809, letra y más-o-menos
  793). Contra los 720 que pide §7.3, no cumple. La pega no engancha en la portada: tras
  `scrollTo(0,120)` el `top` fue −80 y no 24, porque la carátula mide lo mismo que `main`. En
  partida sí engancha (24 px, medido en tema 1366×657 y ponelos 1440×700).
- **Matiz a `UX-35` §6.1:** los renglones del lado B **no** quedan inalcanzables. Con la página
  desplazada al fondo el último enlace queda en y=575. Se llega por scroll de página, no por
  scroll propio.
- **Arregla:** hilo principal, si quiere cumplir lo que escribió (`max-height` más
  `overflow:auto` en la columna), o corregir el comentario y §7.3.

### FIND-105 — BAJA — La carátula va primera en el documento: once paradas de tabulación antes del juego

- **Criterio:** `UX-35` §6.2 y §7.3 ("Por medir: el orden de tabulación"). No hay criterio de
  teclado más viejo; lo escribe la propia hoja del ciclo.
- **Evidencia:** `caratula.test.ts:127` exige "primer hijo de `main`". Medido a 1440×900 en
  `/juegos/adivinar-el-tema/` con `Tab` real: la primera parada es "Preguntas ricoteras" de la
  lista. "← AL ARCADE" es la parada 12 y "Empezá" la 24 (índice 23 de los enfocables). El foco es
  visible: `outline: solid 3px` en `--acento-2`, con 2 px de separación.
- **Arregla:** hilo principal, como propone `UX-35` §6.2: carátula como **último** hijo de `main`
  y cambiar la aserción a "hija directa de `main`". Nada del CSS mira el orden: la grilla es
  explícita y los selectores son por hijo directo. `UX-35` pide además confirmar que ninguna isla
  dependa del orden; mi lectura de `src/scripts/` no encuentra ninguna.

### FIND-106 — BAJA — Una sexta medida de marca vive en `juego.css`, no en `tokens.css`, y no está entre las cinco de `D-54`

- **Criterio:** `diseno-marca.md`: `tokens.css` es "el único archivo del repo donde puede
  vivir… una medida de marca". `D-54`, consecuencias: "Cinco medidas de marca nuevas".
- **Evidencia:** `juego.css:4367` pone `.ponelos { --ancho-tablero: 52rem; }` desde 64 rem. Es un
  ancho de la misma familia que las cinco (`--ancho-hoja`, `--ancho-tablero`, …). La hoja 15 y
  `UX-35` §4.5 lo mencionan en prosa, pero no es un token.
- **Medido para `UX-35` §7.5 ("por medir" a 1100×800):** la hoja mide 705 px, en una columna, sin
  desborde horizontal; en la captura no se ve rota. A 1440 son dos paños: hoja 832, bandeja 288.
- **Arregla:** hilo principal. Nombrarlo en `tokens.css` (`--ancho-tablero-ancho` o similar) y
  sumarlo a la lista de `D-54`.

### FIND-107 — BAJA — Tres controles de `caratula.test.ts` prueban menos de lo que dicen

- **Criterio:** el encabezado del propio test ("el portal y la página no pueden contar dos cosas
  distintas… cada caso tiene su rojo"). Pregunta 8 del encargo.
- **Evidencia:**
  - **Disco (`:39-43`):** compara `caratulaDe(c.href).disco` con
    `discoDeRecorte(arteDeCasete(c.arte))`, que es **la misma función** que usa la implementación
    (`caratula.ts:96`). Pasa con `null === null`. El único chequeo de "no nulo" es para el lobo
    (`:85`). Lo verifiqué a mano: los ocho son no nulos (Oktubre, Luzbelito, Lobo suelto, Momo
    Sampler, La mosca y la sopa, ¡Bang! ¡Bang!…, Último bondi, Un baión), pero ningún test lo
    sostiene.
  - **Número de pista:** se calcula dos veces. `caratula.ts:91` usa `A${i+1}` sobre `JUEGOS`;
    `index.astro:136` usa `${l===0?'A':'B'}${i+1}` sobre `lado.casetes`. El test compara contra
    `JUEGOS`, no contra el portal. `renglones()` (`caratula.ts:71-74`) numera **después** de
    filtrar por `href`, y `pista` numera sin filtrar. Coinciden hoy sólo porque los once tienen
    `href`.
  - **Zonas (`:145-163`):** usa `ids.some(...)`. No exige que todas las secciones de juego estén
    cubiertas (`FIND-103`).
- **Arregla:** hilo principal. `assert.ok(caratula.disco)` para cada juego; exportar una sola
  función de pista que usen los dos lados; cambiar `some` por "todas menos la primera y
  `resultado`".

### FIND-108 — BAJA — `CARATULA.lista` dice "Los otros casetes" y la lista trae también el de la página

- **Criterio:** `voz-ricotera.md` §5, registro 3: dice qué hay y se calla. `UX-35` §6.5 ya lo
  marca.
- **Evidencia:** `copy.ts` (`CARATULA.lista: 'Los otros casetes'`) es el `aria-label` del `nav`.
  El `nav` trae los once, con el actual marcado `aria-current="page"`. El lector de pantalla
  anuncia "otros" y después nombra el que está abierto.
- **Arregla:** `contenido` (la cadena es suya): "Los casetes" o "Los casetes del arcade".
  `voz.test.ts` ya audita el módulo.

### FIND-109 — BAJA — Comentarios y textos de referencia que ya no dicen la verdad

- **Criterio:** `CLAUDE.md` §8 (no dejar documentación desactualizada); `D-54` "cambia el
  teléfono en tres cosas".
- **Evidencia:**
  1. `juego.css:2978-2983`: "Un juego no viste ningún disco… el eco cae al borde del papel".
     Ahora el eco del `h1` toma el apoyo del disco, vía `--tinta-registro` de `.juego--*` en
     `sitio.css`. Medido en el teléfono, color del eco del título, antes → ahora:

     | Juego | Antes | Ahora |
     |---|---|---|
     | Adiviná el tema | `rgb(59,48,42)` | `rgb(11,119,146)` |
     | Completá la letra | `rgb(59,48,42)` | `rgb(17,75,88)` |
     | Ponelos en fila | `rgb(59,48,42)` | `rgb(146,112,81)` |
     | Más o menos | `rgb(59,48,42)` | `rgb(69,126,177)` |
     | Adiviná la tapa | `rgb(59,48,42)` | `rgb(116,114,110)` |
     | ¿Qué tipo de ricotero sos? | `rgb(59,48,42)` | `rgb(105,99,92)` |
     | Preguntas ricoteras, Sacalo por la letra | igual | igual |

     Es un cambio visible en el teléfono que `D-54` no lista. Tampoco lista que el título de
     Skayboy pierde la negrita (sí está en el plan, `T-315`).
  2. `caratula.ts:47`: dice que el actual se marca con "`aria-current`, borde y peso", pero el CSS
     no pone `font-weight`: la "letra plena" es `--texto` contra `--texto-tenue`.
  3. `juego.css:3230-3232`: el 768 (`FIND-104`).
  4. `tokens.css:295` cita la "hoja 15 del lienzo" en presente; no está publicada (`T-319`).
  5. `index.astro:89-103`: el JSDoc de `primeraOracion` quedó huérfano arriba del comentario que
     dice que la función se mudó.
  6. `juego.css:2931-2937` y `sitio.css:529-534`: "tres formas de la marca… nunca conviven" y "la
     firma de la cabecera de cada juego". Hay una cuarta (`.caratula-marca`) y `ADR-03` §6.3 no la
     nombra. La invariante vale hoy (ver "Sin hallazgos"), pero no hay test.
  7. `diseno-marca.md` dice "Once hojas" y el lienzo ya va por la 14, con la 15 pendiente.
- **Arregla:** hilo principal (1, 2, 3, 4, 5, 6 y 7); `arquitectura` si quiere nombrar la cuarta
  portadora en `ADR-03` §6.3.

### FIND-110 — BAJA — `UX-35` §7: el método de medición de varios ítems no da el número que cita

- **Criterio:** el propio checklist de `UX-35` §7.1 y §7.2 ("`getBoundingClientRect().width` da
  44"; "pieza de 64 px / 84 px").
- **Evidencia:** `.casete-arte` lleva `rotate(-4deg)`.
  - Carátula en el teléfono: `getBoundingClientRect().width` da **46,96**; `offsetWidth` da 44.
  - Pieza grande en el escritorio: 180,9 contra 168 (recorte) por `offsetWidth`.
  - Pieza del portal: 89 contra 84 a 80 rem, y 68 contra 64 a 64 rem.
  Quien corra el checklist al pie de la letra ve un rojo falso.
- **Arregla:** `experiencia`: `offsetWidth`, o decir "sin contar la rotación".

## Sin hallazgos (lo que se verificó y está bien)

- **Hex y medidas (criterio 1).** Ningún hex, `rgb()` ni `hsl()` en las líneas agregadas de CSS,
  componentes ni páginas. Las cinco medidas están en `tokens.css`; el 52 rem es `FIND-106`.
  `estilos.test.ts` verde.
- **Anti-slop.** Sin pastilla 999px, sin barra lateral, sin blur ni backdrop. Las sombras son
  duras (`0 4px 0`, `0 1px 0`, `registro` sin difuminado). El único degradado es el
  `repeating-linear-gradient` del papel rayado de la etiqueta, el mismo idioma del casete. Los
  hover cambian tinta o borde y sólo bajo `(hover: hover) and (pointer: fine)`. `.primario:active`
  se hunde: es respuesta al toque, no hover que infla. El actual de la lista no es sólo color:
  borde que aparece, letra plena, rotación leve y `aria-current`. El texto largo va en `--fuente`.
- **Voz (criterio 2).** Las cadenas nuevas son tres: "Carátula de …", "Lado A · pista N" y "Los
  otros casetes" (ver `FIND-108`). Registro 3, sin anglicismos, sin suspensivos, sin botones
  nuevos. `voz.test.ts` las cubre por el módulo `sitio`. La marca "ARCADE RICOTERO" es la firma y
  va `aria-hidden` en la carátula.
- **Lista fuera de la partida (criterio 3).** Medido tras tocar "Jugá", a 1440×900:
  `.caratula-lista` en `display:none` con `#partida` (quiz, tema, por-la-letra,
  completar-la-letra, tapa, más-o-menos), `#pregunta` (dos ejes) y `#tablero` (ponelos). Vuelve en
  el resultado (diseño). En el teléfono la lista es `none` siempre y la calcomanía se va con la
  portada, en los ocho. Salvedad: `#eleccion` de ponelos (`FIND-103`). `mas-o-menos` tiene un
  `div#pregunta` adentro de `#partida`: no es hijo directo, pero `#partida` ya cubre la sección.
- **`D-21` condición 1 (criterio 4).** El disco que acredita cada página es el de su pieza. Lo
  corrí con `caratulaDe()`: A1 Oktubre (`/tapas/oktubre.jpg`), A2 Luzbelito, A3 Lobo suelto, A4
  Momo Sampler, A5 La mosca y la sopa (detalle), A6 ¡Bang! ¡Bang!…, A7 Último bondi, A8 Un baión
  (detalle). Coincide con el `disco` del `PieImprenta` de cada página, y `tapasConCaratula` no
  duplica. Oktubre acredita la tapa entera, no la figura encadenada, así que `D-35` excepción 4 no
  se toca. Skayboy no pide carátula ni cambia su crédito.
- **Accesibilidad (criterio 5), salvo lo ya dicho.** `aria-current="page"` en el tema actual.
  Pista larga visualmente escondida y corta `aria-hidden`; marca `aria-hidden`; pieza `alt=""` y
  `aria-hidden`. Foco visible: probado con `Tab` real, `outline` sólido de 3 px. Contraste: los
  pares de la carátula ya estaban testeados. Etiqueta `--fondo` sobre `--papel` 14,94:1;
  `--papel-tenue` sobre `--papel` 5,39:1; `--texto-tenue` sobre `--fondo` 8,38:1; número del
  actual en la tinta del disco sobre `--fondo` de 4,67 (`cat-letras`) a 13,29 (Momo). Títulos
  sobre tapa velada, peor caso del velo: Lobo suelto 5,19, Último bondi 3,79, La mosca 3,18, todos
  ≥ 3:1 de texto grande. Es justo (3,18 con 3 de piso) pero cumple. Los 5 botones nuevos también.
- **Islas (criterio 6).** Sin cambios, sin `id` en la carátula, sin consultas anchas.
- **`marca` único a la vista (criterio 7).** Contados con `getComputedStyle`: exactamente **un**
  elemento con `view-transition-name: marca` visible en los ocho juegos a 1440 (la
  `.caratula-marca`, con la `.marca` de la hoja en `display:none`) y a 375 (la `.marca` de la
  hoja); el portal a 1440 y 1024 tiene sólo `.marca-grande`. Las ocho páginas ponen `.marca` como
  hija directa de la primera `.pantalla`, que es lo que apaga la regla de `juego.css`. Sigue
  habiendo tres nombres de tránsito. No hay test que impida que una página futura envuelva su
  `.marca` (ver Diferidos).
- **Skayboy (criterio 9), salvo `FIND-99`.** Los cortes nuevos usan `min-`/`max-` con el +0,02 /
  −0,02 de la nota del archivo (`500.02px`, `799.98px`); 620 y 760 son pisos sin techo
  complementario, así que no abren rendija. **Pantalla completa:** con `data-pantalla="completa"`
  a 1440×900, `.fichin` queda `fixed` de 0 a 900 y de 0 a 1440. El `margin-block` nuevo pierde
  contra `[data-pantalla='completa'] .juego-skayboy .fichin { margin: 0 }` (especificidad 0,3,0
  contra 0,2,0). La cabecera queda tapada por el mueble, como antes. No choca. **Escala y
  teclas:**

  | Ventana | Escala | Teclas fuera |
  |---|---|---|
  | 1024×640, 1280×720 | ×3 | 0 |
  | 1366×768, 1440×900, 1920×1080 | ×4 | 0 |
  | 812×600, 1024×600 | ×2 | 0 |
  | 768×1024, 979×800 | cabecera apilada | 0 |
  | 980×620 | ×3 | 0 |
  | 979×620 | ×2 | 0 |
  | 1220×760 | ×4 | 0 |
  | 1219×760 | ×3 | 0 |
  | 1280×800 | ×4 | 0 |

  Holgura del mueble: 50 px bajo el piso de ×3 y 68 px bajo el de ×4, más que los 14 y 10 de la
  cuenta de `UX-35` §5.4. A 720×501 hay 2 teclas fuera, igual que en `HEAD` (no es regresión).
  Los cortes ≤ 500 de alto no cambiaron.
- **Teléfono (criterio 10).** **Portal** a 375×812, 320×568, 414×896 y 600×900: posiciones,
  alturas y `scrollHeight` **idénticos** a `HEAD`. **Portadas de juego** a 375×667, 320×568 y
  390×844: sin desborde horizontal; la calcomanía (x 281–359 a 375) no toca "← AL ARCADE"
  (x 15–159); botones entre −39 y +12 px respecto de `HEAD`. **Quiz:** el título pasa de 1 a 2
  renglones a 375 y el botón baja 11 px. Es el título único de `D-54`. **Reglas que alcanzan
  < 46 rem, todas declaradas salvo lo de `FIND-109`:** `.primario` (canto y hundirse),
  `.pantalla > h1`, `.juego--*`, la calcomanía y `.marca { --tinta-registro }`. Todo el resto va
  tras `@media (min-width: 46rem)` o más.
- **Cierre de `T-271` y números de `UX-35`.** Coinciden con lo medido: portal de 1216 px a 1440
  con tres columnas y bajada entera desde 80 rem; carátula de 304 px y hoja de 608 (832 en
  ponelos); título de 26,4 px a 375 y 41,6 px desde 64 rem; ningún título pasa de dos renglones
  (quiz y dos ejes son los de dos); tres columnas a 1280 y 1024, y A9 centrado a 768. `UX-35` §3.4
  ya reconoce que `UX-01` no dice literalmente "sin salidas".
- **Sacalo por la letra.** A 1440×900 el hueco entre los versos y el buscador pasó de ~400 a
  **32 px**; en el teléfono el buscador sigue anclado al pie.

## Evaluación de `D-54` sobre el circuito del lienzo

**Está bien declarado.** Dice qué quedó al revés (las medidas entraron a `tokens.css` antes que
al diseño), por qué (pegar la hoja 15 exige republicar el lienzo entero, 2,5 MB, y eso lo decide
el usuario), deja la hoja escrita en `Docs/SUGERENCIAS/` con instrucciones de pegado, y los pares
nuevos entraron a `contraste.test.ts` (paso 3 del circuito).

Dos precisiones, sin ser incumplimiento:

- La lista de pendientes dice sólo "medidas de marca". También nacieron fuera del lienzo
  decisiones de tinta: el botón por disco en tres juegos, el título por disco, el canto
  (`--canto-accion`, incluido el mix al 45 % del "Compartí") y el eco del título. La hoja 15 sí
  dibuja botón y título; `D-54` debería nombrarlos.
- `tokens.css:295` y `diseno-marca.md` hablan de la hoja 15 y de "once hojas" como si ya
  estuvieran (`FIND-109`).

## Diferidos (no rompen un criterio escrito)

- **`D-54` cita a `UX-01` por "no admite salidas en plena partida"**, y `UX-01` no lo dice con
  esas palabras (`UX-35` §3.4 lo reconoce). La fuente escrita real es el comentario de
  `quiz.astro` y `UX-35` §3.4 / §7.8. Conviene una nota en `D-54`.
- **Dependencia de `:has()`** para esconder la lista en partida y armar la mesa (Chrome < 105,
  Firefox < 121): sin él la lista queda visible. El repo ya usa `:has()` en muchos lados.
- **`<aside>` adentro de `<main>`:** las herramientas de accesibilidad lo marcan como
  complementario no superior.
- **La marca "Arcade Ricotero" sale del árbol de accesibilidad** de las páginas de juego desde
  64 rem (la de la hoja en `display:none`, la de la carátula `aria-hidden`). El título del
  documento la conserva.
- **No hay test** de "una sola `marca` visible", ni de que cada `variante` de `copy.ts` tenga su
  `.juego--<v>` (está en dos archivos, `sitio.css` y `juego.css`), ni de que `.caratula-marca`
  quede fuera de las zonas prohibidas. `.juego--historia` no la usa ninguna página.
- **`translate` individual** (el hundirse del botón) no existe en Chrome < 104: degrada a sólo el
  cambio de canto.
- **`ESTADO.md`** no menciona el ciclo 17 (para el cierre).
- **Corte de renglones de Skayboy medido en una sola fuente:** conviene repetirlo con otra fuente
  de sistema (`FIND-99`).

## Cierre — hilo principal, 2026-10-02

El usuario pidió *"aplicá todo y cerrá el ciclo"*. Cada hallazgo, con lo que se hizo y cómo se
volvió a medir (Chrome sin cabeza por CDP sobre `astro dev`, el mismo método de arriba):

| ID | Estado | Qué se hizo | Medido después |
|---|---|---|---|
| `FIND-99` | **cerrado** | El `.fichin` de la cabecera acostada pasa de 16 a 24 px de aire arriba (`skayboy.css`): el sello asoma 22 | ver la tabla de Skayboy del cierre, abajo |
| `FIND-100` | **cerrado** | La carátula de "Adiviná la tapa" lleva `piezaSopla`: en partida esconde la pieza y deja la etiqueta. Test en `caratula.test.ts`, rojo visto. Anotado en `D-54` | `.caratula-arte` en `display:none` con `#partida` a la vista |
| `FIND-101` | **cerrado** | La mesa pasa a `--espacio-3` de aire arriba y el título de la hoja a `--espacio-1`. El arranque sigue suelto | "Empezá" termina en **652** a 1366×657 (era 676) |
| `FIND-102` | **cerrado** | Con `(pointer: coarse)` desde 64 rem, `min-height: var(--toque-min)` por renglón | **51 px** por renglón a 1024×768 táctil |
| `FIND-103` | **cerrado** | `#eleccion` entra a las zonas que esconden la lista; el test exige todas las secciones de juego, no alguna. Rojo visto | — |
| `FIND-104` | **cerrado** | `.caratula` con `max-height` de la ventana y desplazamiento propio; la pieza baja a 8,5 rem. Comentario corregido | a 1366×768 mide **720** (contenido 772, se desplaza por dentro) |
| `FIND-105` | **cerrado** | La carátula es el **último** hijo de `main` en las ocho páginas; el test lo exige | primera parada de `Tab`: "← AL ARCADE"; segunda: "JUGÁ" |
| `FIND-106` | **cerrado** | `--ancho-tablero-amplio: 52rem` en `tokens.css`, aplicado desde 80 rem con los dos paños. `D-54` dice seis medidas | la hoja de "Ponelos" mide 608 a 1100×800 |
| `FIND-107` | **cerrado** | `assert.ok(disco)` por juego; `pistaDe()` única, usada por el portal y la carátula, con test que lo exige; zonas con "todas". Rojo visto en los nuevos | — |
| `FIND-108` | **cerrado** | "Los casetes". La cadena la había escrito el hilo principal en este ciclo; `contenido` puede revisarla | — |
| `FIND-109` | **cerrado** | Los siete: eco del título (comentario y `D-54`), "letra plena", el 768, la hoja 15 en `tokens.css`, el JSDoc del portal, las cuatro formas de la marca (`juego.css`, `sitio.css`) y la lista de hojas de `diseno-marca.md`. `ADR-03` §6.3 queda para `arquitectura`, opcional | — |
| `FIND-110` | **pasado a `experiencia`** | Pedido junto con marcar como aplicadas las discrepancias de `UX-35` §6 | — |

Los diferidos quedan como están. Del primero se hizo la nota: `D-54` ya no le atribuye a `UX-01`
la frase "sin salidas"; cita el criterio de la portada de cada juego.
