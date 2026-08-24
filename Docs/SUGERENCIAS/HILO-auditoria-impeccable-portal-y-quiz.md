# Auditoría de detalles del portal y del quiz — skill `impeccable`

**Fecha:** 2026-08-24 · **Lo corrió:** hilo principal · **Alcance:** `src/pages/index.astro`
y `src/pages/quiz.astro` (con lo que arrastran: `Base.astro`, `tokens.css`, `sitio.css`,
`juego.css`, `partida.ts`).

**Herramienta:** `pbakaus/impeccable` v4.1.1, comando `audit` (chequeos técnicos:
accesibilidad, rendimiento, tematización, adaptación a pantalla e integridad de la
implementación). Instalada en `~/.agents/skills/impeccable`, enlazada a Claude Code.

**Cómo se midió.** Nada de esto es a ojo. El detector mecánico de la skill corrió sobre el
código fuente y sobre el HTML construido; el resto se midió en el navegador contra el sitio
servido (`astro preview`, a 320, 375 y 1280 px), leyendo estilos computados, geometría real
y una partida jugada de punta a punta. Los números de abajo son los que devolvió la
pantalla.

**Esto documenta, no arregla.** Es lo que hace el comando `audit`: separa el hallazgo de la
corrección para que cada arreglo se decida aparte.

> ## ⬤ Estado al 2026-08-24, más tarde el mismo día
>
> **Los 4 P1 y los 7 P2 están arreglados y verificados en pantalla.** El detalle de qué se
> tocó, con la medición de antes y después de cada uno, está al final: **"Qué se arregló"**.
> Los P3 siguen abiertos. Un hallazgo se corrigió a la baja después de medirlo mejor (el
> salto de maquetado no existía); está explicado ahí.

---

## Tabla de salud

| # | Dimensión | Puntaje | Hallazgo principal |
|---|-----------|---------|--------------------|
| 1 | Accesibilidad | 2/4 | El auto-avance de 1,2 s y el foco que se cae al `<body>` en cada cambio de pantalla |
| 2 | Rendimiento | 3/4 | Ninguna imagen declara medidas ni `loading`; hay originales de 560 px para huecos de 57 px |
| 3 | Tematización | 3/4 | Sistema de tokens ejemplar, pero falta `color-scheme: dark` y `theme-color` |
| 4 | Adaptación a pantalla | 4/4 | Sin desborde a 320, 375 ni 1280; todo lo tocable pasa los 48 px |
| 5 | Integridad de la implementación | 3/4 | `.primario` vive en cinco alcances de página y por eso sale sin estilo cuando lo crea el JS |
| **Total** | | **15/20** | **Bueno — hay que atacar las dimensiones flojas** |

---

## Veredicto de integridad

**Pasa, y con holgura.** Esta implementación expresa un sistema propio del producto, no un
tema genérico: ni un hex fuera de `tokens.css`, la mezcla `D-19` resuelta con variables por
sección, y —lo más raro de encontrar— tests que fallan el build si vuelve una pastilla de
999 px, una barra lateral de acento o un botón en infinitivo. El detector de `impeccable`,
que busca 64 patrones de interfaz generada por IA, **devuelve limpio sobre el HTML
construido de las dos pantallas**.

Lo que baja la nota a 3 no es el sistema: es la deriva entre el sistema y lo que el
JavaScript crea en tiempo de ejecución. Ese es el primer hallazgo P1.

---

## Resumen

- Puntaje: **15/20** (Bueno)
- Hallazgos: **4 P1 · 7 P2 · 9 P3** · 2 falsos positivos verificados
- Los cuatro que importan:
  1. El botón `SEGUÍ` del quiz sale **sin ningún estilo**: es un botón nativo gris.
  2. El auto-avance de 1,2 s se lleva puesta la explicación en 22 de las 40 preguntas.
  3. El foco se cae al `<body>` en cada cambio de pantalla y no hay región viva.
  4. El link que produce `COMPARTÍ` no tiene tarjeta: ni imagen, ni título, ni ícono.

---

## P1 — Mayores

### [P1] El `.primario` que crea el JavaScript sale sin estilo

- **Dónde:** `src/pages/quiz.astro:88` (el bloque `<style>`) contra `src/scripts/partida.ts:144`
- **Categoría:** Integridad de la implementación
- **Medido en pantalla:** el botón `SEGUÍ` renderiza `background: rgb(240, 240, 240)`,
  `color: rgb(0, 0, 0)`, `border: 2px outset`, `border-radius: 0`, `system-ui` de 16 px,
  **59 × 48 px**, pegado al margen izquierdo. El mismo `.primario` del template —el `JUGÁ`
  de la portada— renderiza rojo `#f8360d`, Archivo Black, 20 px, **343 px** de ancho.
- **Por qué pasa:** los `<style>` de un `.astro` tienen alcance por atributo
  (`data-astro-cid-…`). El botón que crea `partida.ts` no lo lleva, así que ninguna regla de
  la página lo alcanza. `juego.css:288` ya documenta este mismo bug **para el botón de
  compartir** y lo resolvió solo para ese caso, con una regla global `.primario.firma`. El
  caso general quedó abierto.
- **Impacto:** aparece en toda pregunta con rótulo —**18 de los 40 ítems** son leyenda o
  testimonio—, y es justo la pantalla donde el sitio muestra lo que promete: el sello de
  procedencia. Un botón gris de sistema sobre fondo de tinta, debajo de un sello punteado de
  157 px. En un sitio con una regla anti-slop escrita, este es el peor detalle visible.
- **Y no es solo el quiz:** el mismo patrón afecta a seis botones más —
  `partida-letra.ts:161,185`, `partida-tapa.ts:122,146`, `partida-dos-ejes.ts:120,147`.
- **Cómo se arregla:** mover `.primario` (y `.secundario`, y `.tenue`) a `juego.css` como
  componente global, y borrar las copias con alcance de las cinco páginas.
- **Comando sugerido:** `$impeccable polish`

### [P1] El auto-avance de 1,2 s se lleva puesta la explicación

- **Dónde:** `src/scripts/partida.ts:150`
- **Categoría:** Accesibilidad · WCAG 2.2.1 Timing Adjustable (**Nivel A**)
- **Medido en pantalla:** con una explicación de 111 caracteres (21 palabras), el panel de
  feedback estuvo visible **1.577 ms** y desapareció solo. Leer 21 palabras en castellano
  lleva unos **6 segundos**.
- **La escala:** los ítems `hecho` son **22 de 40**, y son exactamente los que no tienen
  sello, o sea los que caen en el timer. La explicación mediana del banco tiene **171
  caracteres** y la más larga **379** (la del COMFER y «Criminal Mambo», unas 70 palabras:
  cerca de veinte segundos de lectura). Se muestra 1,2 s si acertaste.
- **Impacto:** el sitio tira el trabajo de `contenido` en más de la mitad de las preguntas, y
  le pega más fuerte a quien lee más despacio. `UX-01` v2 ya resolvió esto para los ítems con
  rótulo —«un timer fijo no puede servir a la vez a un rótulo de 15 caracteres y a uno de
  200»—; el argumento vale igual para la explicación, que es más larga que varios rótulos.
- **Cómo se arregla:** el mismo `SEGUÍ` para todos, o un timer que se cancele con cualquier
  toque, o que arranque recién cuando el panel entró en pantalla. Cualquiera de las tres saca
  la violación de Nivel A.
- **Comando sugerido:** `$impeccable harden`

### [P1] El foco se cae al `<body>` en cada cambio de pantalla

- **Dónde:** `src/scripts/partida.ts:61` (`mostrar`), `:81` (`pintarPregunta`), `:161` (`pintarResultado`)
- **Categoría:** Accesibilidad
- **Medido en pantalla:** `document.activeElement` es `BODY` después de tocar `JUGÁ`, después
  de cada auto-avance, y en la pantalla de resultado. Regiones vivas en toda la página: **0**.
- **Impacto:** quien juega con teclado toca `JUGÁ`, la pantalla cambia entera y el foco vuelve
  al principio del documento: hay que tabular de nuevo desde la cinta de regreso en cada
  pregunta. Quien usa lector de pantalla no se entera de nada — ni del acierto, ni del error,
  ni de la explicación, ni del puntaje final. Las opciones además se `disabled` al responder,
  así que el botón que acabás de apretar se sale del orden de tabulación debajo de tu propio
  dedo.
- **Lo que sí está bien y muestra el camino:** en los ítems con sello, `partida.ts:148` hace
  `seguir.focus()`. Es exactamente el gesto que falta en los otros tres cambios de pantalla.
- **Cómo se arregla:** mover el foco al encabezado de cada pantalla nueva (con
  `tabindex="-1"`), y envolver el panel de feedback en `role="status"` para que se anuncie sin
  robar el foco.
- **Comando sugerido:** `$impeccable harden`

### [P1] El link que produce `COMPARTÍ` no tiene tarjeta

- **Dónde:** `src/pages/quiz.astro:32-37` y `src/layouts/Base.astro:47-53`
- **Categoría:** Integridad de la implementación
- **Medido en pantalla:** `meta[property^=og]` y `meta[name^=twitter]`: **0**.
  `link[rel*=icon]`: **0**. No hay ningún archivo de ícono en `public/`.
- **Impacto:** el bucle entero del juego termina en un botón que manda un link a WhatsApp o a
  Twitter, y ese link llega **pelado**: sin imagen, sin título, sin bajada, y la pestaña del
  navegador muestra el ícono en blanco. Es el único momento en que el sitio sale a la calle, y
  sale sin cara. Material hay de sobra: `public/tapas/detalle/` está lleno de recortes reales y
  la marca ya tiene su calco.
- **Ojo con `D-21`:** una tapa en una tarjeta de Open Graph se ve fuera del sitio, donde el
  crédito por pantalla no la acompaña. Puede convenir una pieza propia —el casete, el perro—
  en vez de una tapa.
- **Comando sugerido:** `$impeccable polish`

---

## P2 — Menores

### [P2] La categoría se imprime como viene del JSON: `MITOLOGIA`, sin tilde

`src/scripts/partida.ts:87` escribe `item.categoria` crudo y `.cabecera` lo pone en
mayúsculas. En pantalla se lee **MITOLOGIA**. La palabra es *mitología*, y la mayúscula en
castellano lleva la tilde. Acá no aplica la deuda de tildes de `diseno-marca.md`: ese rótulo
va en la pila del sistema, que tiene todos los acentos. Falta la tabla slug → etiqueta, que
es justo lo que hace `REDONDOPEDIA.secciones` en `sitio/copy.ts:159`. — `$impeccable clarify`

### [P2] El resultado es un callejón sin salida

La pantalla de resultado tiene `COMPARTÍ` y `JUGÁ DE NUEVO`, y nada más: **ningún camino de
vuelta al arcade**. El comentario de `quiz.astro:41` dice que «el resultado ya tiene sus
propios botones», pero los dos que tiene te dejan adentro del quiz. Quien terminó una partida
no tiene cómo llegar a los otros cuatro juegos sin el botón de atrás del navegador. Y es el
momento de mayor intención de seguir jugando de todo el recorrido. — `$impeccable onboard`

### [P2] La tipografía del resultado es la genérica del sistema

Medido: `2/8` sale a **56 px en `system-ui` peso 800**, y el tramo («Los molinetes siguen
abiertos») a 24 px, también `system-ui`. El único elemento con letra de marca en esa pantalla
es el botón `COMPARTÍ`. `diseno-marca.md` dice que el resultado viste Gulp! más el logo, y que
«lo que rota por sección es el acento **y la letra grande**». El número más grande de la
pantalla es letra de interfaz. — `$impeccable typeset`

### [P2] Jerarquía tipográfica plana en la portada del quiz

Hallazgo del detector, verificado: `quiz.astro:70`, tamaños de 20 px, 21,6 px y 33,6 px. El
`h1` (21,6 px) y el botón `JUGÁ` (20 px) miden casi lo mismo, así que el botón compite con el
título en vez de obedecerle. — `$impeccable typeset`

### [P2] Falta `color-scheme: dark`

Medido: `getComputedStyle(document.documentElement).colorScheme` da `normal`. El sitio es
tinta sobre negro y el navegador no lo sabe: las barras de scroll, los controles nativos y los
menús salen claros. Es una línea en `tokens.css`, y de paso suaviza el primer P1 mientras se
arregla. — `$impeccable polish`

### [P2] Falta `theme-color`

Sin `<meta name="theme-color">`, la barra del navegador en el celular queda blanca arriba de
una pantalla de tinta. En un sitio declarado móvil primero, se ve en cada carga. — `$impeccable polish`

### [P2] Ninguna imagen declara medidas ni `loading`

Las 14 imágenes del portal salen sin `width`/`height` —salto de maquetado mientras cargan— y
sin `loading="lazy"`, así que las 12 que están abajo del pliegue se bajan igual. — `$impeccable optimize`

---

## P3 — Pulido

- **Originales sobredimensionados.** `lobo-lupus.png` es de 560 × 560 (48 KB) para un hueco de
  57 px; `mosca-olla.jpg` de 354 × 381 para 35 px; `bondi-circuito.jpg` de 305 × 305 para
  36 px. El peso total del portal es chico, así que es pulido, no urgencia. — `$impeccable optimize`
- **Sin `preload` de la titular.** `Oktubre Calco` pesa 2,2 KB y escribe el `h1` más grande del
  sitio con `font-display: swap`: el título parpadea de Arial Black a la calcada en cada carga
  fría. — `$impeccable optimize`
- **`.tenue` duplicada en cinco alcances** (`quiz.astro:82` y las tres pantallas de juego)
  aunque ya existe global en `juego.css:427`. Es el mismo patrón que rompió `.primario`.
- **El quiz baja `sitio.css` entero** (~16 KB con tokens) y usa tres clases: `.con-grano`,
  `.cabecera-sitio` y `.volver`.
- **`aria-label` en un `<p>`** (`quiz.astro:47`): un elemento genérico sin rol no acepta nombre
  accesible, así que ese atributo no hace nada. El texto ya se lee solo.
- **Sin `<noscript>`.** Con JavaScript apagado, la portada del quiz se ve entera y el botón
  `JUGÁ` no hace nada, sin decir por qué. Una línea lo explica, y va en registro 3.
- **Camino muerto de Spotify.** Los 40 ítems del banco tienen `spotify` vacío, pero
  `partida.ts:136` sigue llamando a `botonSpotify` y `juego.css:197` sigue enviando la regla
  `.spotify`. `D-22` movió el tema completo a mp3 propio: esto quedó atrás.
- **`.marca` del quiz en 2,1 rem fijo** mientras la del portal usa `clamp(2.6rem, 13vw, 4rem)`.
  La misma marca, dos comportamientos.
- **El corte global de `prefers-reduced-motion`** (`tokens.css:189`) lleva todo a 0,01 ms. Para
  la mosca está perfecto, pero también apaga la transición de estado de `.opcion` —120 ms de
  borde y fondo—, que es información y no decoración. `impeccable` marca este patrón por
  nombre: reducir movimiento no es lo mismo que borrar la respuesta al toque.
- **Durante la partida no hay `h1`.** La portada lo tiene, pero se oculta al jugar, y las
  pantallas de partida y resultado arrancan en `h2`.

---

## Falsos positivos verificados

- **`side-tab` en `sitio.css:704`** (`.parrafo--testimonio`). El detector marca la barra
  lateral de acento como el tic más reconocible de interfaz generada. Acá es la **excepción
  declarada** de `diseno-marca.md`: sangría de cita editorial, con símbolo y etiqueta además
  del borde, y es el mecanismo visual de `BR-08`. Además no vive ni en el portal ni en el quiz.
  **No tocar.**
- **`.casete-accion` de 36 a 39 px de alto.** Parece un objetivo táctil por debajo del mínimo,
  pero es una etiqueta adentro de un enlace de 346 × 210 px: el objetivo es el casete entero.
  **No es un defecto** — de hecho es la decisión correcta para el pulgar.

---

## Patrones de fondo

1. **Componentes definidos en el alcance de la página en vez de la hoja global.** `.primario`,
   `.secundario` y `.tenue` están declarados en cinco páginas. Mientras el HTML lo escribe el
   template no se nota; en el momento en que una isla crea el elemento, el estilo no llega. Ya
   rompió siete botones en cuatro juegos y va a romper el próximo. `juego.css` tiene el arreglo
   puntual (`.primario.firma`) y el diagnóstico escrito desde hace un ciclo: falta aplicar el
   general.
2. **El teclado y el lector de pantalla no están en el circuito de verificación.** El contraste
   tiene test, los estilos tienen test, la voz tiene test — y son buenísimos. El foco y el
   anuncio no tienen nada, y ahí es donde aparecen los tres hallazgos de accesibilidad. Es la
   misma lógica de los molinetes abiertos, aplicada a quien no ve la pantalla.
3. **Lo que sale del sitio no recibió el mismo cuidado que lo que está adentro.** Adentro:
   tokens medidos de las tapas reales, fuentes calcadas, grano de serigrafía. Afuera: link
   pelado, pestaña sin ícono, barra del navegador blanca.

---

## Lo que está muy bien

- **Ni un hex fuera de `tokens.css`**, y un test que lo hace cumplir.
- **Contraste medido en vivo en el portal:** los 24 pares de texto van de **4,67:1**
  (`--cat-letras` en el sello de acción) a **14,94:1** (etiqueta de papel). AA en todos.
- **Ningún estado se comunica solo con color:** ✔ y ✕ en las opciones, ◆ y ❝ en los rótulos,
  borde punteado en el sello.
- **Cero desborde horizontal** a 320, 375 y 1280 px, y todo lo tocable por encima de 48 px.
- **3,9 KB transferidos** en el portal, sin framework. Las cinco fuentes suman 38 KB.
- **224 tests pasan**, incluidos los de voz y los anti-slop.
- **El detector de 64 patrones de slop devuelve limpio** sobre el HTML construido de las dos
  pantallas. Eso no es común.

---

## Orden sugerido

1. **[P1] `$impeccable polish`** — subir `.primario`, `.secundario` y `.tenue` a `juego.css` y
   borrar las copias con alcance. Arregla los siete botones de una y cierra el patrón 1.
2. **[P1] `$impeccable harden`** — foco por pantalla, `role="status"` en el feedback, y sacar
   el timer fijo (WCAG 2.2.1).
3. **[P1] `$impeccable polish`** — Open Graph, ícono y `theme-color`, para que el link que
   manda `COMPARTÍ` llegue con cara.
4. **[P2] `$impeccable typeset`** — la letra grande del resultado, y separar el `h1` del botón
   en la portada del quiz.
5. **[P2] `$impeccable clarify`** — la tabla de etiquetas de categoría (MITOLOGÍA con tilde).
6. **[P2] `$impeccable onboard`** — la salida del resultado hacia el arcade.
7. **[P3] `$impeccable optimize`** — medidas y `loading` en las imágenes, `preload` de la
   titular, recorte de los originales sobredimensionados.

Se pueden pedir de a uno, todos juntos, o en el orden que se quiera. Volver a correr
`$impeccable audit` después de los arreglos para ver moverse el puntaje.

---

## Cómo repetir esta auditoría

```bash
npx skills add pbakaus/impeccable@impeccable -g -y
```

```bash
node ~/.agents/skills/impeccable/scripts/detect.mjs --json dist/index.html dist/quiz/index.html
```

El detector necesita `htmlparser2`, `css-select`, `css-tree` y `domutils` instalados en el
directorio de la skill; sin ellos avisa `DEGRADED` y cae a coincidencia por expresiones
regulares, que **no** evalúa variables CSS, ni selectores, ni contraste computado — y lo dice
él mismo. Sin esas cuatro dependencias, un resultado limpio es un subconteo, no un
certificado.

---

# Qué se arregló

**2026-08-24, misma jornada.** Los cuatro P1 y los siete P2. Todo medido en el navegador
contra el sitio servido, antes y después. Los P3 quedan abiertos.

## Los P1

### 1. El `.primario` sin estilo → componente global

`.primario` pasó a `juego.css` como componente, y el color lo pone cada pantalla con
`--tinte-accion`, que es una variable y **se hereda por el árbol del DOM** — que es
justamente lo que el alcance por atributo de Astro no hace.

| | Antes | Ahora |
|---|---|---|
| `SEGUÍ` (quiz) | `rgb(240,240,240)`, `2px outset`, radio 0, system-ui 16 px, **59 × 48** | `#f8360d`, sin borde, radio 4, Archivo Black 20 px, **343 × 60** |

Alcanzó a más de lo previsto: `#empezar` de dos ejes y los botones de completar la letra
**tampoco tenían regla** —esas páginas nunca declararon `.primario`—, así que también
salían como botón nativo. Ahora los siete se pintan de una sola regla. De paso se le sacó
`primario` a `.ejes-opcion` en `partida-dos-ejes.ts`: esa clase se pinta entera sola, y
arrastrar el botón principal le metía la rotulada y un margen que peleaba con el `gap` de
la columna. Verificado: las dos opciones de dos ejes siguen idénticas entre sí, con su
hueco de 16 px.

También se le sacó el `font-weight: 700`: Archivo Black ya viene negra y pedirle 700 la
engorda sintética.

### 2. El temporizador → `SEGUÍ` para todos

Se fue el `setTimeout`. Toda pregunta espera el dedo.

| | Antes | Ahora |
|---|---|---|
| Ítem `hecho`, explicación de 175 caracteres | el panel duraba **1.577 ms** y se iba solo | sigue en pantalla a los **3.000 ms**, con su botón |

Sale con esto la violación de WCAG 2.2.1 (Nivel A), y sobre todo se lee la explicación de
los 22 ítems que antes la perdían.

### 3. El foco y el anuncio

- `enfocar()` lleva el foco al encabezado de cada pantalla nueva con `tabindex="-1"`.
  Verificado: al tocar `JUGÁ` el foco queda en `H2.enunciado` (antes, `BODY`); al terminar,
  en `H2.tramo` (antes, `BODY`).
- El enunciado lleva `aria-describedby` a la cabecera, así el paso, la categoría y **la
  insignia de rótulo** llegan con la pregunta. Importa: `UX-01` v2 pide que se sepa que se
  pregunta "qué se cuenta" y no "qué pasó" **antes** de responder.
- El panel de feedback es `role="status"` y se inserta vacío a propósito: una región viva
  que ya existe se anuncia con mucha más confiabilidad que una recién nacida con todo el
  texto adentro. El botón quedó **afuera** del panel, para que el anuncio sea el resultado
  y la explicación, y no "SEGUÍ, botón" mezclado.
- El resultado: `aria-describedby="puntaje bajada-tramo"` en el encabezado.

Regiones vivas en la página: **0 → 1**.

### 4. La tarjeta al compartir

- `components/Cabeza.astro`: Open Graph completo, tarjeta de Twitter, ícono, `theme-color`.
  **En las 148 páginas**, no solo en las dos auditadas — adiviná el tema también comparte.
- `public/tarjeta.png` (1200 × 630), `public/icono-180.png` y `public/favicon.svg` los
  genera `npm run generar-marca-social`, **leyendo los colores de `tokens.css`**: un PNG con
  el rojo copiado a ojo sería la misma verdad duplicada que la regla de marca evita.
- La tarjeta no lleva texto, y es una decisión: las letras del sitio son fuentes
  autoalojadas y no hay con qué rasterizarlas; escribir el título con la tipografía que haya
  instalada es exactamente lo que la regla anti-slop veta. Las palabras las pone `og:title`.
- `astro.config.mjs` declara `site` porque un `og:image` relativo no lo levanta ningún
  previsualizador. **Está puesto en `https://arcade-ricotero.vercel.app` por el nombre de
  proyecto que usa `BAJAR-EL-SITIO.md`; si el dominio es otro, se cambia ahí y en ningún
  otro lado.**

## Los P2

| Hallazgo | Qué se hizo | Verificación |
|---|---|---|
| `MITOLOGIA` sin tilde | tabla `CATEGORIAS` en `quiz/copy.ts`; la clase sigue llevando el identificador y lo que se lee sale de la tabla | en pantalla dice `Mitología` |
| El resultado sin salida | cinta `← AL ARCADE` al pie del resultado, la misma de la portada | enlace a `/`, 143 × 52 px |
| Tipografía del resultado | `.puntaje` y `.tramo` a `--fuente-rotulada`, peso 400 | 56 px y 24 px en Archivo Black (antes, `system-ui` 800) |
| Jerarquía plana en la portada | `h1` a 1,75 rem y `.marca` a `clamp(2.4rem, 11vw, 3.5rem)` | escala 20 / 28 / 38–56; saltos de 1,40 y 1,37. El detector, limpio |
| `color-scheme` | `dark` en `:root`, más `::selection` con la tinta de la marca | `colorScheme: "dark"` |
| `theme-color` | en `Cabeza.astro` | `#14100e`, leído del token por `lib/sitio/tokens.ts` |
| Imágenes sin medidas ni `loading` | `loading="lazy"` y `decoding="async"` en las 12 de abajo del pliegue; `width`/`height` en todas, **medidas del archivo en build** (`medidas()` en `arte.ts`) | ver la corrección de abajo |

### Una corrección: el salto de maquetado no existía

El hallazgo decía "salto de maquetado mientras cargan". **Lo medí después y es falso: el CLS
del portal es 0**, y ya lo era antes. Las dos imágenes del casete tienen ancho y alto fijos
por CSS, y las otras dos están fuera de flujo (`fixed` y `absolute`). Lo que sí faltaba, y
se hizo, es el `loading="lazy"`.

Las medidas se declaran igual, y no por trámite: `medidas()` las lee del archivo porque el
navegador usa esos dos números **solo para sacar la proporción**, y como acá el recorte real
reemplaza al dibujo cuando aparece, la proporción puede cambiar sin que nadie toque el
marcado. Un número copiado a mano estiraría el dibujo. Verificado: la caja del recorte de
portada da 1,284 y el archivo 1,281.

## Lo que quedó abierto

- **Los nueve P3.**
- **Un P2 nuevo, en otra pantalla:** al pasar el detector por las cuatro páginas de juego
  apareció la misma jerarquía plana en `adivinar-la-tapa.astro` (20 / 24 / 33,6 px). No es
  nuevo, es que la primera pasada solo miró el portal y el quiz.
- **Los `.primario` con alcance de `adivinar-el-tema` y `adivinar-la-tapa`.** No molestan
  —ganan por especificidad y sus botones se ven igual que antes— pero son la duplicación que
  causó todo esto. Limpieza pendiente.

## Verificación

```bash
npm run build && npm test && npm run check
```

148 páginas · **224 tests en verde** · 0 errores y 0 advertencias de tipos.

```bash
node ~/.agents/skills/impeccable/scripts/detect.mjs --json dist/index.html dist/quiz/index.html
```

Devuelve `[]`. Sobre el código fuente queda un solo hallazgo, el de `adivinar-la-tapa` de
arriba, más el falso positivo ya documentado de `.parrafo--testimonio`.

Medido en el navegador, al cierre: portal sin desborde a 320, 375 y 1280 px; **24 pares de
texto, el peor en 4,67:1**, ninguno por debajo de AA; ningún objetivo táctil por debajo de
48 px; CLS 0.
