# Pulida de los juegos: "Adiviná la tapa" (`US-04`)

> Propuesta del constructor de la ronda, para que el hilo principal la convierta en decisión
> (`D-XX`) o la corrija. Es el juego 8 de la pulida. No toca `ESTADO.md`, `Docs/DECISIONES.md` ni
> la carpeta de ningún rol. **No se tocó cuál es la respuesta de ninguna tapa, ninguna
> explicación ni ningún rótulo** (`tapa.json`, `banco.ts` y `ronda.ts` están como estaban).

## Ronda 1 (2026-11-20): la mesa de serigrafía, el zoom que se abre y la soga

### 1. El objeto

La acotación de la portada ya lo decía: *"Tenés tinta fresca pegada en los dedos."* El objeto
es **la mesa de serigrafía**: un bastidor de madera con sus mordazas y sus grampas, la racleta
(el mango de madera y la goma) y la soga donde las hojas se cuelgan a secar.

- **Portada: la mesa con una tinta puesta.** Adentro del bastidor hay una hoja con la primera
  tinta de la tapa de *Último bondi* (el disco que la pantalla viste y ya acredita en el pie).
  "Empezá" **pasa la racleta**: baja y deja la segunda tinta, vuelve y deja la clave, y recién
  ahí arranca. La mesa es un atajo del botón (escondida del lector, como la ficha del quiz). Un
  segundo toque no espera.
- **Partida: el recorte se mira adentro del bastidor.** Al responder, **el zoom se abre**: el
  pedazo que mirabas se achica hasta su lugar real en la tapa y el resto se imprime alrededor,
  con la racleta pasando una vez por tinta, de arriba abajo y de vuelta. Si la tenías: clara,
  media, clave y el fijado de la foto. Si no: la clave sola, que queda como **una prueba de
  imprenta en una tinta**, con el pedazo pegado en su sitio.
- **Al pie del bastidor, las tres tintas de la tirada**: tres casillas, llenas las que se
  usaron y huecas las que no. Es la forma que acompaña a "en una tinta".
- **La cabecera es la soga**: una hoja por tapa de la vuelta, con su broche. Al responder, la
  hoja de la soga recibe su tilde o su cruz; al tocar "Seguí", **la hoja impresa vuela de la
  mesa a la soga y se queda hamacando**.
- **Resultado: la tirada colgada.** La cuenta estampada y la soga entera: las seis hojas en el
  orden en que se jugaron, cada una con su disco; las que tenías, impresas del todo; las que no,
  en una tinta. Después, el pie compartido con la tarjeta que asoma.

### 2. Lo que cambia de doctrina y necesita quedar escrito

1. **El zoom se abre de verdad.** `UX-22` §11 decía que al acertar el recorte quedaba de capa de
   abajo, y que al fallar se iba porque "la clave sola sobre un recorte ampliado serían dos
   versiones desalineadas". Ahora el recorte se achica hasta donde cae en la tapa
   (`src/lib/tapa/recorte.ts`: la tabla de centros de `scripts/generar-tapas.mjs`, repetida para
   el navegador y vigilada por `recorte.test.ts`), así que ya no hay dos versiones: hay un
   pedazo en su lugar. **Al fallar el pedazo se queda, en color, sobre la clave.** La tapa
   de un ítem que no se acertó sigue sin completarse.
   *La mosca y la sopa* se juega con la olla de la contratapa, que no está en la tapa de
   adelante: ahí el pedazo no tiene adónde ir, y la pantalla hace lo de antes.
2. **Las pasadas van de arriba abajo y de vuelta** en este juego (en "Adiviná el tema" siguen
   yendo de costado, de costado y de abajo): es lo que deja que una sola racleta las acompañe.
   Las pasadas esperan un paso (`--duracion-paso`) a que el zoom empiece a abrirse.
3. **La respuesta se cierra en dos tiempos, y el sello cae al final de la tirada.** En el toque:
   las opciones dicen cuál era, la soga anota, el zoom se abre y la racleta pasa (y la mesa da
   un golpe si erraste). Cuando la última tinta apoyó cae el sello sobre la esquina de la hoja
   —como el visto de una prueba—, y un compás después llega la ficha. **Se adelanta con un toque
   o con Enter o la barra** (se escucha `click`). El sello no cae en el toque, como en los otros
   juegos, porque taparía lo que se está imprimiendo, que acá es el premio.
4. **"Seguí" va adentro de la ficha**, y debajo va el zócalo: de qué edición es la imagen (que
   ya se contaba recién al responder) y "Corregí esto". **Este juego no tenía puerta para
   corregir**: ahora la tiene (`juego: 'tapa'`, que `CTR-10` ya admitía).
5. **Al llegar la ficha se van las dos opciones que no eran ni la tuya ni la buena.**
6. **El botón principal es la racleta: papel con el canto de goma.** `D-54` dice que el relleno
   del botón es la tinta del disco de la página, y acá esa tinta es la plata vieja de *Último
   bondi*, que como relleno se leía apagado (lo marcó la auditoría dos veces). `.juego-tapa`
   pone `--tinte-accion: var(--papel)`; la tinta del fondo sobre el papel es un par que ya
   estaba en `contraste.test.ts`. La plata queda en las mordazas y en la goma. **Es una
   excepción a `D-54` y a la mezcla `D-19`, y la tiene que decidir alguien.** "Compartí" sigue
   en su tinta.
7. **Hay ruidos**: la racleta (efecto nuevo en `efectos.ts`, un soplido agudo de 0,2 s), el
   sello, el golpe, el clac de la hoja que se cuelga y la tecla. El interruptor está en la
   portada y en la cabecera.
8. **Hay tarjeta compartible** (`src/scripts/tarjeta-tirada.ts`, pincel propio): la firma, el
   juego, la cuenta, la soga con las hojas de la vuelta y el crédito de las tapas (`D-21`: una
   imagen suelta no tiene pie). No nombra ningún disco. Compartir sigue siendo `compartir.ts`.
9. **La hazaña**: las seis. Doble filete en la cuenta y el sello "¡Tirada entera!".

### 3. Detalles vivos (para el registro)

| Detalle | Estado | Cómo | Con movimiento reducido |
|---|---|---|---|
| La racleta baja y vuelve, y deja dos tintas | "Empezá" | `racleta-ida-y-vuelta`, `pasada` | no pasa: arranca la partida |
| El pedazo se achica hasta su lugar en la tapa | se respondió | `recorte-a-su-lugar` | ya está en su lugar |
| La racleta pasa una vez por tinta | se respondió | `racleta-tirada` (cuatro pasadas) o `racleta-ida-y-vuelta` | la tapa, impresa; la racleta, arriba |
| Las casillas de tinta se llenan con cada pasada | se respondió | `tinta-se-pone` | llenas las que van |
| El sello cae sobre la esquina y deja la marca | terminó la tirada | `.sello-cae`, `.sello-marca` | la marca, de una |
| La hoja vuela de la mesa a la soga | "Seguí" | `volarPieza` (`jugo.ts`) | aparece colgada |
| La hoja recién colgada se hamaca | se colgó; el resultado | `hoja-se-hamaca` | quieta |
| "+1" vuela a "Llevás N", que cuenta y apoya | acierto | `volar`, `contar`, `estampar` | la cuenta cambia de una |
| La cuenta del resultado sube y apoya | resultado | `contar`, `estampar` | la cifra final |

### 4. Piezas nuevas que sirven a los juegos que quedan

- **`volarPieza`** (`jugo.ts`, `.pieza-vuela`): lleva un nodo cualquiera del rectángulo de una
  pieza al de otra, achicándolo. Es `volar`, con una pieza en vez de un texto.
- **El efecto `racleta`** (`efectos.ts`): un roce largo, para cualquier cosa que barra.
- **El recorrido de este juego en `scripts/mirar-juego.mjs`** (`adivinar-la-tapa`): portada, la
  racleta de "Empezá", partida, error, el pase a la soga, acierto, la soga de cerca, un nivel
  difícil, un rótulo si sale, la última ficha, el resultado, la tarjeta, lo compartido, y una
  segunda vuelta sin errar para la hazaña. Dice si "Seguí" queda a la vista y cuánto desborda.

### 5. Tokens, tests y copy

- **Ningún token nuevo.**
- **Tests** (de 2507 a 2511: los cuatro de `recorte.test.ts`). Cambiados a propósito:
  `movimiento.test.ts` suma cinco animaciones (`recorte-a-su-lugar`, `racleta-tirada`,
  `racleta-ida-y-vuelta`, `hoja-se-hamaca`, `tinta-se-pone`, todas apagadas por token);
  `estilos.test.ts` suma dieciocho estados a `ESTADOS_TAPA` y declara la isla nueva
  `tarjeta-tirada.ts`. Ninguno se relajó.
- **El bloque de CSS va antes del de "Ponelos en fila"**, no al final de la hoja: el test de
  `BR-22` lee de `.ponelos {` hasta el final y no admite el verde ni el rojo ahí.
- **Copy nuevo en `tapa/copy.ts`** (`IMPRENTA`), para el visto de `contenido`; lo audita
  `voz.test.ts`: "Llevás N", "+1", "N al hilo", "Mirá cómo te fue", los tres de los ruidos,
  "Pasá la racleta" (el cartel de la mesa), "La tirada", "¡Tirada entera!", lo que lee el lector
  de la soga y el crédito de la tarjeta. La salida del resultado dice "← Volvé al fichín" en la
  cinta de siempre.
- La página perdió su copia de `.primario` (pisaba, por el alcance de Astro, lo que el juego le
  pone al botón); el botón es el de `juego.css`.

### 6. Lo medido

- **Rendimiento** (CPU ×4, 430 × 860 a ×2, contra el sitio construido, dos tandas, control en
  cada una: portada, pregunta y resultado quietos a 16,7 ms de media y p95 16,8–16,9). "Empezá"
  (la racleta y armar la partida): media 19–25, peor cuadro 183–400. Error con la ficha: media
  19–24, peor 183–283 (el del toque). Acierto, la tirada entera con la ficha: media 17,4–17,7,
  peor 100. El pase con la hoja que vuela: media 17,5–19,4, peor 83–134. Llegar al resultado:
  media 21, un cuadro de 367–383, que es dibujar la tarjeta con sus seis tapas.
- **Peso**: ninguna imagen nueva. Cada tapa pide su recorte (19–60 KB), y mientras se piensa
  llegan sus tres pasadas, su ficha (25–60 KB en total) y el recorte de la que sigue. La portada
  suma las tres pasadas de *Último bondi* (26 KB).
- **Tamaños mirados**: 320 × 568, 375 × 667, 430 × 860 y 1280 × 800 (con y sin movimiento
  reducido los dos últimos). La hoja no desborda de costado en ningún estado. A 320 × 568 la
  portada pone la mesa al lado de la bajada y "Empezá" queda arriba del pliegue, y la pregunta
  con sus cuatro teclas entra en la ventana. "Seguí" quedó a la vista al llegar la ficha en
  todos los casos del recorrido. **No están mirados los otros seis tamaños ni los datos peores.**

### 7. Lo que queda flojo

- **A 375 × 667 "Empezá" no lo volví a mirar después de la regla de ventana baja** (la subí de
  40 a 46 rem de alto justo por ese tamaño): está escrito, no visto.
- **La ficha larga saca la tapa de la ventana.** Con explicación larga y rótulo, a 430 × 860 la
  hoja se corre hasta "Seguí" y la tapa recién impresa queda cortada arriba.
- **En la partida sobra aire** entre el crédito y la pregunta a 430 × 860 (unos 100 px): la tapa
  no se agranda de 320 px a propósito (`UX-22` §11), y el aire quedó sin dueño.
- **La compu no cambió de escala**: la mesa mide lo mismo que en el teléfono y la columna queda
  angosta; con la ficha a la vista, la opción que queda ocupa media columna.
- **El bastidor es esquemático**: madera plana, grampas de trazo cortado. No tiene malla, ni
  manchas de tinta, ni la hoja "sale" de la mesa en la portada (la partida aparece de una).
- **El sello del cierre llega tarde a propósito** (1,2 s en el acierto): quien no adelanta espera.
- **La tarjeta** es correcta y sobria; con una sola autoría larga el crédito se achica mucho.
- **El pedazo sobre la clave, al errar, es un cuadrado de color de borde vivo**: se lee, pero no
  tiene forma de recorte pegado.
- El recorrido no fuerza qué tapas salen: la leyenda puede no aparecer en una pasada (lo avisa).
- No se probó con dedo, teclado ni lector de pantalla de verdad, ni el modo `?incrustado`, ni
  el sonido de la racleta con oídos (está escrito y pasa su test de duración y nivel).
- `UX-13` y `UX-22` §11 describen la pantalla de antes; el lienzo no tiene esta.

### 8. Lo aprendido para los juegos que quedan

1. **Si el juego esconde algo, la animación es mostrar dónde estaba.** El zoom que vuelve a su
   lugar explica la respuesta sin una palabra, y necesitó un dato (dónde cae el recorte) que ya
   existía en el generador.
2. **Un test que lee "de acá al final de la hoja" manda dónde va el CSS nuevo.** Antes de
   agregar al final de `juego.css`, buscar quién corta la hoja con `indexOf`.
3. **`String.replace` con un texto que trae `$$` lo rompe** (se come un signo): los parches de
   archivos con `pagina.$$(` van con una función de reemplazo.
4. **El vuelo se mide después de mover la hoja**: `scrollTo` primero, los rectángulos después.
5. **`backwards` en un sello no esconde la pieza**: si algo tiene que aparecer recién en su
   turno, el primer cuadro tiene que decirlo (acá, la casilla hueca).
