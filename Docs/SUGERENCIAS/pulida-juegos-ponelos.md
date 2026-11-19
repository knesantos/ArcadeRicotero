# Pulida de los juegos: "Ponelos en fila" (`US-08`)

> Propuesta del constructor de la ronda, para que el hilo principal la convierta en decisión
> (`D-XX`) o la corrija. No toca `ESTADO.md`, `Docs/DECISIONES.md` ni la carpeta de ningún rol.

## Ronda 1 (2026-11-19): la pila, la batea y el disco en la mano

### 1. El objeto

La acotación de la portada ya lo nombraba: *"Se te desordenó la pila de discos."* El objeto del
juego es **el disco en su funda**, y el lugar es **la batea de una disquería**. Con eso se
resolvieron las tres pantallas:

- **Portada.** Las diez tapas tiradas una arriba de la otra, cada una torcida a su manera. Caen de
  a una al entrar (`pila-cae`). Es un atajo del botón (`#pila`, sin foco y escondido al lector,
  como la plantilla de "Completá la letra").
- **Qué repartís.** Era una lista de dieciséis tarjetas: 2500 px a 430 de ancho. Ahora mide
  ~1000 px en el teléfono y entra entera en 1280 × 800. Arriba, los que cruzan discos, cada uno
  con un dibujo hecho de lo que trae adentro: los diez discos parados (todos), diez lomos con la
  tinta de cada disco (los discos, que se juegan sin tapas), tres tapas en abanico (las tapas),
  un surco con la púa afuera o adentro (abren, cierran) y las tres primeras tapas de lo que
  salió sorteado (al azar). Abajo, **la batea**: un cajón del ocre de apoyo con su pestaña, y
  los diez discos tapa por tapa con el año.
- **Al tocar "Elegí qué repartir", la pila se reparte**: las tapas de la batea salen de donde
  estaban tiradas en la portada y llegan a su lugar, una atrás de la otra.
- **La partida.** La carta es el disco en la mano: la funda con su tapa (ciega en el conjunto
  sin tapas), el vinilo que asoma, y abajo hasta tres fundas de lo que queda del mazo. Las filas
  son cajones con dos pestañas arriba (el nombre y la cuenta), como los separadores de una batea.

### 2. Lo que cambia de doctrina y necesita quedar escrito

1. **La ficha viaja y apoya.** `UX-23` §4.2 (tics 2 y 6) y el encabezado del bloque en
   `juego.css` decían "nada se anima, ni un `@keyframes`". El pedido de la ronda es lo
   contrario: *"la ficha que llega y se apoya en su fila tiene que tener peso"*. Ahora una copia
   de la funda vuela de la carta a la fila, la pieza apoya torcida y se endereza, la fila baja
   tres píxeles y su cuenta cae como sello. **`BR-22` no se toca**: no hay festejo, ni color, ni
   sonido; es el mismo gesto para cualquier fila. El comentario viejo del bloque quedó
   desactualizado en esa línea de la tabla y hay que corregirlo cuando se decida.
2. **Un detalle vivo atado a un estado.** Mientras suena el recorte, el vinilo sale de la funda
   y gira (33 vueltas por minuto, `--duracion-surco`); cuando se corta, vuelve y queda quieto.
   Es el borde que ya fijó la ronda del casete: se porta como el objeto real mientras dura el
   estado, nunca en bucle permanente. Que suena lo dice además el botón ("Pará").
3. **En "Las diez tapas", la pieza puesta es la tapa sola.** El nombre queda para el lector de
   pantalla (`aria-label`) y lo escribió la carta cuando tocó. Una fila de tapas pasa a verse
   como una fila de tapas; antes era una lista con miniaturas, una por renglón.
4. **En la batea, cada disco se elige por su tapa y su año.** El nombre va en `aria-label` y en
   `title`, y la pantalla siguiente lo escribe grande. Es la apuesta más discutible de la ronda:
   el que no reconoce una tapa no lee el nombre antes de tocar. Si no convence, la salida es dos
   columnas con tapa y nombre (~390 px en vez de ~200).
5. **El mazo va contra el pie de la ventana desde la primera ficha.** Antes quedaba a media
   pantalla y bajaba un escalón con cada ficha, con los botones corriéndose debajo del pulgar.
6. **La hoja se corre sola si la ficha cayó donde no se ve** (detrás del mazo o arriba): es el
   `scrollIntoView({ block: 'nearest' })` de `UX-23` §5.2, que `D-69` había dejado sin uso.

### 3. Detalles vivos (para el registro)

| Detalle | Estado | Cómo | Con movimiento reducido |
|---|---|---|---|
| El vinilo sale de la funda y gira | suena el recorte | `.carta--suena`, `disco-gira` | sale y no gira; lo dice "Pará" |
| La pila del mazo se achica | quedan 3, 2, 1, 0 | `data-resto` en `.mazo-carta` | igual (es un dato) |
| La carta sube de la pila | llega otra ficha | `carta-llega` | aparece puesta |
| La funda viaja a su fila y apoya | ficha repartida | vuelo de la isla (`transform`) y `pieza-apoya` | la pieza aparece puesta |
| La fila acusa el peso y su cuenta cae | ficha repartida | `fila-recibe`, `estampar()` | quietas |
| La pila de la portada cae y se reparte | entrar, empezar | `pila-cae`, vuelo de la isla | ordenada de entrada |
| Las filas se pegan al cerrar | última ficha | `.jugo-pega` con `--orden` | quietas |

### 4. Tokens y tests

- **Token nuevo:** `--duracion-surco: 1.8s` (solo tiempo). Entró por `tokens.css`; falta pasarlo a
  la hoja 12 del lienzo.
- **Tests cambiados a propósito:** `movimiento.test.ts` suma cinco animaciones a `ANIMACIONES`
  (`pila-cae`, `carta-llega`, `pieza-apoya`, `fila-recibe` por token; `disco-gira` por regla) y
  `estilos.test.ts` suma siete estados a `ESTADOS_PONELOS`. Ninguno se relajó.
- **Copy nuevo** (`ponelos/copy.ts`, lo audita `voz.test.ts`): `ELECCION.batea` ("Disco por
  disco") y `ELECCION.discoDeLaBatea` (el nombre accesible de cada tapa). Son de `contenido`.

### 5. Lo que pide una decisión de otro

- **El botón primario "gris verdoso apagado"** es la ceniza medida de *¡Bang! ¡Bang!*
  (`RES-37`), el disco que viste el juego por `D-19`, con su par en `contraste.test.ts`. No lo
  toqué: cambiarlo es cambiar el disco de la sección, que es de `experiencia`. Con la pila de
  tapas arriba ya no es lo único que hay en la pantalla.
- **Ruidos de interfaz.** `D-69` dice "lo único que suena es la banda", y además este juego usa
  `<audio>` y nunca despierta el contexto de Web Audio, así que `efectos.ts` acá no suena. Un
  golpe sordo de cartón al apoyar la ficha quedaría bien, pero pisa el recorte que arranca en
  ese mismo toque. No lo hice.
- **`UX-23` y `PRD-ponelos-en-fila.md`** siguen describiendo la lista de catorce fichas de texto.

### 6. Auditoría de lo que no se rehízo (cierre y lámina)

- **El cierre no es un momento.** Con la última ficha, el mazo queda como una caja que dice
  "SIN NADA EN EL MAZO · Quedan 0 de 10 · No queda ninguna sin ubicar", aparece "Así te quedó la
  fila" abajo de todo y siguen cuatro botones apilados. La lámina no se ve hasta tocar
  "Compartí", y en la compu ni así: baja como archivo.
- **La lámina** (1080 de ancho) es prolija y se lee, pero habla otro idioma que la pantalla: sin
  pestañas, tapas derechas, renglones separados por una raya. Con filas de tapas queda mucho
  aire a la derecha.
- **Los cuatro botones de abajo** ("Compartí", "Desarmala", "Armá otra", "Volvé al fichín")
  están desde la primera ficha, del mismo peso, y no usan `.pie-resultado`.
- **Las herramientas** ocupan dos renglones (110 px) arriba del tablero en el teléfono.
- **Con muchas fichas de texto** (los ciento cinco), las filas son listas largas de sellos: se
  juega, pero no se parece a una batea.

### 7. Lo medido

- **Rendimiento** (CPU ×4, 430 × 860 a ×2, dos tandas, control en cada una: 16,7 ms). Quieto,
  con el disco girando y con sesenta fichas puestas de los ciento cinco: 16,7 ms de media, ningún
  cuadro sobre 34. Repartir una ficha deja **un** cuadro largo de 67 a 117 ms, que es rehacer el
  tablero entero: da lo mismo con movimiento reducido (sin vuelo ni giro), así que no es de esta
  ronda. La pila que se reparte deja un cuadro de 117 a 150 ms, que es armar la elección.
- **Diez tamaños** (320 × 568 a 1440 × 900): nada desborda de costado y nada tocable baja de
  48 px. "Qué repartís" mide de 1130 a 1210 px en el teléfono (con el pie) y entra entera desde
  768. En 320 × 568 la pila empujaba el botón abajo del pliegue: ahí se achica.
- **El mazo ocupa mucho**: 350 px de 860, 383 de 667 y 401 de 568. Venía así de `D-69`; la
  funda sumó doce.

### 8. Lo aprendido para los juegos que quedan

1. **Un tablero que se rehace entero también puede animar**: se mide el origen antes de
   repintar, y después una copia suelta vuela hasta la pieza nueva, que espera escondida.
2. **Si lo de abajo se mueve con cada jugada, antes de animar hay que fijarlo.** La ráfaga
   mostró que el "peso" se lo comía el mazo bajando 40 px en el mismo cuadro.
3. **La pose de reposo va en `rotate` y `translate`, no en `transform`**: así los cuadros clave
   solo dicen de dónde viene la pieza.
4. **`navigator.share` existe en el navegador de las capturas y se queda esperando**: el
   recorrido lo borra para poder mirar la lámina.
5. **Un clic "de verdad" del guion desplaza la hoja** si el blanco está pegado abajo; para las
   fotos se toca con `element.click()`.
