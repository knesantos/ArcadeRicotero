# Pulida de los juegos: "Preguntas ricoteras" (`US-01`)

> Propuesta del constructor de la ronda, para que el hilo principal la convierta en decisión
> (`D-XX`) o la corrija. Es el juego 7 de la pulida. No toca `ESTADO.md`, `Docs/DECISIONES.md` ni
> la carpeta de ningún rol. **No se tocó ninguna pregunta ni ninguna respuesta** (`quiz.json`,
> `vidas.ts`, `ronda.ts` y `recorrido.ts` están como estaban).

## Ronda 1 (2026-11-19): la ficha, la ranura y el contador

### 1. El objeto

La acotación de la portada ya lo decía: *"Se te cae una moneda en la ranura."* El objeto del
juego es **la ficha del fichín**, y la máquina le contesta. Con eso se resolvieron las tres
pantallas:

- **Portada: la chapa de la ranura.** Una chapa atornillada, apenas torcida. A la izquierda la
  ficha (con la FR) apoyada sobre la ranura; a la derecha el contador de créditos, en dos
  ruedas, y las tres vidas —tres fichas— con la línea que nombra. Tocar "Jugá" **mete la
  ficha**: gira de canto, cae por la ranura en saltos, suena el clac y el contador pasa de 00
  a 01. Recién ahí arranca. La ficha grande es un atajo del botón (sin foco y escondida al
  lector, como la plantilla de "Completá la letra"). Un segundo toque mientras cae no espera.
- **Partida: el tablero de la máquina.** Las tres vidas son las mismas fichas; el `Nº` es un
  contador de ruedas que da una vuelta en cada pregunta; a la derecha, "Llevás N"; debajo el
  riel, y en el último renglón la tecla "RUIDOS", la racha ("N al hilo") y "Cerrá la partida".
- **Perder una vida es el momento del error en un fichín**: la ficha se parte en dos, las
  mitades se separan y se caen en saltos, queda el hueco de trazo cortado con su cruz, la
  pantalla da un golpe y suena el golpe (doble si era la última).
- **Resultado**: el `Nº` cuenta hasta donde llegaste, al lado las fichas como quedaron, la
  planilla, y el pie compartido con la tarjeta que asoma.

### 2. Lo que cambia de doctrina y necesita quedar escrito

1. **"Seguí" va adentro de la ficha de la respuesta, no en una barra pegada abajo.** `D-71`
   decía "`SEGUÍ` va pegado abajo, en la zona del pulgar y siempre a la vista". Ahora es la
   gramática de los otros juegos pulidos: cierra la columna de la ficha, y la hoja se corre
   hasta el zócalo para que quede entero a la vista. A 430 × 860 la respuesta entera entra sin
   desplazar; en un teléfono bajo se corre sola. Enmienda a `D-71` y a `UX-01` v2.
2. **La respuesta se cierra en dos tiempos.** Primero, en el mismo toque: las opciones dicen
   cuál era y cuál elegiste, el riel anota el paso, cae el sello grande sobre la pregunta (y se
   parte la ficha si erraste). Después de 880 ms (`--duracion-pasada` + `--duracion-umbral` +
   `--duracion-paso`; cero con movimiento reducido) llega la ficha. **Se adelanta con un toque
   o con Enter o la barra.** No es un temporizador de avance: pasar de pregunta lo sigue
   mandando el dedo (`UX-01` v2, WCAG 2.2.1).
3. **Al llegar la ficha, las dos opciones que no eran ni la tuya ni la buena se van.** Quedan
   la buena (y la tuya, tachada, si erraste). Es lo que hace que la respuesta entre en una
   pantalla. `D-71` decía "las otras dos se apagan".
4. **Los sellos de la pregunta son pestañas que pisan el borde de arriba** (categoría, rótulo de
   leyenda o testimonio, y nivel), como las de un fichero. Salió la cinta gris. La insignia de
   rótulo sigue estando **antes** de responder (`UX-01` v2), y llega al lector con la pregunta.
5. **Las opciones son teclas**: el canto de abajo es más grueso (borde, no sombra) y bajan al
   apretarlas.
6. **"Escuchalo en Spotify" es un enlace del sitio**: letra chica y tenue, subrayado fino y la
   flecha de las salidas, en el zócalo de la ficha, al lado de "Corregí esto". `ADR-01` y
   `spotify.ts` no cambiaron (sigue siendo un `<a>` y nada más); cambió la regla `.spotify`.
7. **La racha de la cabecera es "N al hilo" desde dos seguidas**, como en los otros juegos. Las
   rachas redondas de `CNT-41` ("TRES AL HILO", "CINCO…", "DIEZ…") siguen cayendo como segundo
   sello en la ficha (la clase pasó de `.racha` a `.racha-grito`: `.racha` es la de todos).
8. **El resultado muestra las fichas al lado del `Nº` en la derrota y en la retirada**, no en
   la victoria (`BR-19` apartado 6.4: ahí no son un dato). La victoria sin perder ninguna lleva
   la hazaña: doble filete y el sello "¡Sin perder una!".
9. **Hay ruidos**, los de `efectos.ts`: tecla al meter la ficha y al pasar, clac cuando entra,
   sello al acertar, golpe al errar. El interruptor está en la portada y en el tablero.
10. **Hay tarjeta compartible** (`src/scripts/tarjeta-fichin.ts`, pincel propio): la firma, el
    juego, el desenlace estampado, el `Nº` grande, las fichas como quedaron, la planilla por
    escalón y la dirección. No lleva ninguna pregunta ni dato de la persona. Compartir pasó a
    `compartir.ts` (la escalera de siempre), con la planilla en el texto como antes.

### 3. Detalles vivos (para el registro)

| Detalle | Estado | Cómo | Con movimiento reducido |
|---|---|---|---|
| La ficha gira de canto y cae por la ranura | "Jugá" | `animate()` en la isla, en saltos | no cae: arranca la partida |
| La rueda del contador da la vuelta | créditos 00→01; cada pregunta nueva | `rodarContador`, `cifra-rueda` | la cifra nueva aparece puesta |
| Las tres fichas caen en el tablero | arranca la partida | `.vida--llega` (`sello-golpe`) | puestas |
| La ficha se parte y las mitades se caen | se perdió una vida | `.vida-mitad`, `ficha-rompe-*` | no se arman: queda el hueco con la cruz |
| La pantalla da un golpe | error | `golpear(#partida)` | quieta |
| El sello grande cae sobre la pregunta y deja la marca | se respondió | `.sello-cae`, `.sello-marca` | la marca y la ficha, de una |
| El paso del riel apoya | se respondió | `.jugo-sello` | puesto |
| "+1" vuela a "Llevás N", que cuenta y apoya | acierto | `volar`, `contar`, `estampar` | la cuenta cambia de una |
| La racha se estampa | dos o más seguidas | `estampar` | puesta |
| El `Nº` del resultado cuenta | resultado | `contar` | la cifra final |

### 4. Piezas nuevas que sirven a los juegos que quedan

- **El contador de ruedas** (`armarContador`, `rodarContador` en `jugo.ts`; `.contador` en
  `juego.css`): no nombra a este juego. Sirve para cualquier cifra que suba de a poco.
- **El recorrido de este juego en `scripts/mirar-juego.mjs`** (`quiz` o `preguntas-ricoteras`):
  portada, meter la ficha, error, pase, acierto, racha, la ficha que se rompe, la última ficha,
  derrota, tarjeta, una partida entera sin errar (pregunta con rótulo, escalón, sin tapa, con
  Spotify, victoria) y la retirada. Avisa si "Seguí" no avanza y cuánto desborda la hoja.

### 5. Tokens, tests y copy

- **Ningún token nuevo.**
- **Tests cambiados a propósito:** `movimiento.test.ts` suma tres animaciones (`cifra-rueda`,
  `ficha-rompe-izq`, `ficha-rompe-der`, apagadas por token); `estilos.test.ts` declara la isla
  nueva `tarjeta-fichin.ts` y suma siete estados a `ESTADOS` del quiz. Ninguno se relajó.
- **Copy nuevo en `quiz/copy.ts`**, para el visto de `contenido` (lo audita `voz.test.ts`):
  `FICHIN` ("Créditos", "Llevás N", "+1", "N al hilo", "Mirá cómo te fue", los tres de los
  ruidos, "Volvé al fichín", "¡Sin perder una!") y `COMPARTIR.aManoTitulo`. **Dos textos
  cambiaron de caja**: "COMPARTÍ" → "Compartí" y "JUGÁ DE NUEVO" → "Jugá de nuevo" (el pie
  compartido va sin versales forzadas). La cinta del resultado dice "← Volvé al fichín".

### 6. Un defecto encontrado, que también está en otro juego

Adelantar el cierre escuchando `pointerdown` es peligroso cuando la ficha corre la hoja: el
`click` de ese mismo toque cae después sobre lo que haya quedado bajo el dedo. Acá se escucha
`click`. **"Completá la letra" escucha `pointerdown`** (`partida-letra.ts`, `apurar`): ahí la
pared no se corre al llegar la ficha salvo en teléfonos bajos, pero conviene mirarlo.

### 7. Lo aprendido para los juegos que quedan

1. **Si la bajada nombra un objeto, las vidas, el número y el botón son ese objeto.** Acá la
   ficha es a la vez la vida, el crédito y el gesto de empezar.
2. **Una cifra que cambia de a uno pide ruedas, no una cuenta.** `contar` sirve para llegar a
   un total; `rodarContador`, para el paso de a uno.
3. **Con el teléfono emulado, una hoja que desborda de costado achica la página y los toques
   del guion caen corridos.** Si "Seguí" no avanza en el recorrido, antes de buscar un defecto
   de eventos hay que medir `scrollWidth`. (Acá era la racha en el renglón de las fichas, a 320.)
4. **`steps()` no pasa `movimiento.test.ts` en una hoja**: los saltos se escriben como cuadros
   repetidos (`0%, 24%`), con `linear`.
5. **`.racha` ya era de todos**: la del quiz, definida antes en la hoja, quedaba pisada a medias.
   Antes de sumar una clase corta, buscarla en toda la hoja.

### 8. Lo medido

- **Rendimiento** (CPU ×4, 430 × 860 a ×2, dos tandas contra `astro dev`, control en cada una:
  16,7 ms, ningún cuadro sobre 34). Pregunta quieta: 16,7. Meter la ficha y arrancar: un cuadro
  de 133–150 ms (armar la partida). Error con la ficha que se parte: un cuadro de 133–150 (el
  del toque) y el resto a 16,7. Pase con la rueda: peor 33–50. Acierto con sello y "+1": peor
  33–50. Llegar al resultado: un cuadro de 267–283, que es dibujar la tarjeta.
- **Tamaños mirados**: 320 × 568, 430 × 860 y 1280 × 800. En los tres la hoja no desborda de
  costado en ningún estado del recorrido (lo mide el guion). A 320 × 568 "Jugá" queda arriba
  del pliegue (la chapa se aprieta con `max-height: 40rem`). Faltan los otros siete tamaños.

### 9. Lo que queda flojo

- **La partida sigue teniendo media pantalla vacía** a 430 × 860 antes de contestar: el tablero
  y la ficha son de fichín, pero la pregunta y las cuatro teclas son un recorte y cuatro cajas.
- **A 320 la ficha de la respuesta es larga** (la tapa le saca ancho al texto): hay que
  desplazar hasta "Seguí"; la hoja se corre sola.
- **En la compu, con una sola opción a la vista** después de acertar, queda en media columna.
- **La chapa de la portada** tiene aire a la izquierda en la compu y la ranura es esquemática.
- **La tarjeta** es correcta y sobria: con pocas preguntas respondidas queda mucho fondo.
- No se probó con dedo, teclado ni lector de pantalla de verdad, ni el modo `?incrustado`.
- `UX-01`, `UX-07` y `D-71` describen la pantalla de antes; el lienzo no tiene esta.
