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

---

## Ronda 2 (2026-11-19): la pantalla del fichín, el pase y el peso

### 1. Decisiones del hilo principal, ya aplicadas (para las enmiendas)

- **"Seguí" va adentro de la ficha de la respuesta** (enmienda a `D-71`, que lo pedía pegado
  abajo). Cierra la columna de la ficha y la hoja se corre hasta el zócalo, así queda entero a
  la vista; avanzar lo sigue mandando el dedo, sin temporizador.
- **Al llegar la ficha se van las dos opciones que no eran ni la tuya ni la buena** (enmienda a
  `D-71`, "las otras dos se apagan"). Quedan la buena y, si erraste, la tuya tachada, en una
  columna; es lo que deja entrar la respuesta en una pantalla.
- **La racha va en el renglón de abajo del tablero**, con "Cerrá la partida". En el de arriba,
  con las fichas, el contador, los ruidos y la cuenta, a 320 px desbordaba la hoja.
- **El adelanto del cierre escucha `click` y no `pointerdown`**, también en "Completá la letra"
  (`partida-letra.ts`, `apurar`): una línea.

### 2. Qué se hizo

1. **La portada es una ranura de fichín**: la boca metálica parada, con su labio (dos filetes
   pegados) y dos tornillos; la hendija al medio; y **la ficha de canto, en escorzo, a medio
   meter**, con el canto asomando por detrás. Al lado, el cartel de la chapa: **"← PONÉ LA
   FICHA"** (lo que en un fichín importado dice la chapa, en voz nuestra; `D-17`). Al tocar
   "Jugá" o la ficha, retrocede un pelo y la boca se la traga, en saltos; clac y créditos 01.
2. **La pregunta es la pantalla del fichín.** En el teléfono la partida ocupa el alto de la
   ventana: arriba el tablero, al medio la pantalla —marco de la tinta de la categoría con un
   segundo filete por adentro, la pregunta grande al medio— que crece hasta donde haya, y
   **abajo las cuatro teclas, en la zona del pulgar**. A 430 × 860 la pantalla mide 350 px
   (antes, un recorte de ~110 y media ventana vacía). Un enunciado de más de 120 letras baja un
   cuerpo. En la compu la pantalla mide lo suyo (no hay alto que repartir).
3. **Las teclas llevan la letra en tapa llena** (la tinta del fondo sobre la del texto; verde o
   roja cuando la tecla dice cómo salió). Dos pares nuevos en `contraste.test.ts`.
4. **El sello grande cae entero adentro de la pantalla** y su marca chica queda adentro, abajo
   a la derecha (medido en diez tamaños: siempre adentro).
5. **"RUIDOS" está en la cabecera**, junto a "LLEVÁS N".
6. **El zócalo va pegado debajo de la ficha**, de su ancho y con su filete: "Escuchalo en
   Spotify →" a la izquierda y "Corregí esto" a la derecha (sola, también a la derecha).
7. **El pase es una sola historia**: la ficha se va, **la pantalla se apaga** (se cierra a una
   línea, como un tubo, en saltos), la rueda del contador da la vuelta, la pantalla **prende**
   con la pregunta nueva y recién ahí se apoyan las teclas. Con movimiento reducido, la
   pregunta nueva aparece puesta.
8. **El escalón es un momento, sin pantalla aparte** (`UX-07` sigue en pie): el cartel
   "NIVEL MEDIA" —más grande, con doble filete— cae sobre la pantalla cuando ya prendió, suena
   el sello, el tramo nuevo del riel apoya, y las teclas esperan a que caiga.
9. **El resultado tiene peso**: el desenlace es un sello grande; debajo del `Nº` el contador de
   la máquina vuelve de 01 a 00 (el crédito se gastó: "Jugá de nuevo" es poner otra ficha); y
   **la planilla se llena casilla por casilla**, en el orden en que se jugó.
10. **La tarjeta lleva el marco atornillado de la chapa.**
11. **A 380 px de ancho para abajo, la tapa va chica al lado de la respuesta y el dato debajo a
    todo el ancho**: con la tapa al costado de todo, a 320 la ficha medía 767 px; ahora 593.

### 3. Detalles vivos de la ronda 2

| Detalle | Estado | Cómo | Con movimiento reducido |
|---|---|---|---|
| La boca se traga la ficha | "Jugá" | `animate()` en saltos, recorte de `.ranura-caida` | arranca la partida |
| La pantalla prende | pregunta nueva | `pantalla-prende` (recorte, en saltos) | puesta |
| La pantalla se apaga | "Seguí" | `pantalla-apaga` | no hay apagado |
| El cartel del escalón cae | abre un nivel | `sello-golpe`, con espera | puesto |
| El contador vuelve a 00 | resultado | `rodarContador` | 00 de una |
| La planilla se llena | resultado | `sello-golpe` por casilla, con `--orden` | llena |

### 4. Tests y copy

- `movimiento.test.ts`: dos animaciones más (`pantalla-prende`, `pantalla-apaga`, por
  `--duracion-umbral`). `contraste.test.ts`: dos pares más (`fondo` sobre `texto`, la letra de
  la tecla; `fondo` sobre `acento-2`, la FR de la ficha). Ninguno se relajó.
- Copy nuevo: `FICHIN.ponela` ("Poné la ficha"), para el visto de `contenido`.

### 5. Diez tamaños, con los datos peores

Guion fuera del repo (`q-tamanos.mjs`, en la carpeta temporal): le cambia al navegador el
banco para que **todas** las preguntas lleven el enunciado, las cuatro opciones y la
explicación más largos de lo publicado, con rótulo de leyenda, tapa y enlace. En 320 × 568,
360 × 640, 375 × 667, 390 × 844, 412 × 915, 430 × 860, 768 × 1024, 1024 × 768, 1280 × 800 y
1440 × 900: la hoja no desborda de costado en ningún estado; "Jugá" queda arriba del pliegue
(a 320 × 568 termina en 526 de 568; a 375 × 667, en 647 de 667); la pregunta con sus cuatro
teclas entra en la ventana (a 320 × 568 termina en 558); el sello cae adentro de la pantalla y
la marca queda adentro; "Seguí" queda a la vista al llegar la ficha.

### 6. Lo que queda flojo

- **La ficha en escorzo se lee, pero es un óvalo plano**: le falta el canto estriado.
- A 375 × 667 "Jugá" termina a 20 px del pliegue: entra, justo.
- **En la compu la partida no cambió de escala**: la pantalla mide ~160 px y sobra ventana.
- Con el peor dato a 320 la ficha de la respuesta mide 593 px: hay que desplazar para leerla
  entera (la hoja se corre sola hasta "Seguí").
- El apagado de la pantalla dura 230 ms antes de que entre la nueva: se nota en la ráfaga, y
  jugando rápido puede sentirse como una espera.
- No se probó con dedo, teclado ni lector de pantalla de verdad, ni `?incrustado`.

---

## Ronda 3 (2026-11-19): el vidrio, las teclas de la máquina y los dos finales

### 1. Qué se hizo

1. **La pantalla tiene vidrio.** Por afuera, el marco de la chapa en la tinta de la categoría;
   arriba, en el marco, **la inscripción de la máquina** (la categoría, derecha y sin sello; el
   rótulo de leyenda o testimonio conserva su caja y su tinta); adentro, **el canto del tubo**,
   de esquinas redondeadas, con **una trama de barrido impresa** (`--textura-barrido`, token
   nuevo, usada de máscara sobre la tinta al 16 %: una trama, no un degradado); y al pie del
   vidrio, **la línea de estado** con el nivel ("FÁCIL · 1/14"). El enunciado va arriba, a un
   tercio. El sello del cierre cae en la mitad de abajo y su marca queda en la esquina.
   **No puse la tapa ni el dato debajo del enunciado**: la tapa, antes de contestar, es la
   respuesta de varias preguntas ("¿en qué disco salió?"). Debajo queda el vidrio.
2. **"Cerrá la partida" es una tecla de la cabecera**, al lado de "RUIDOS", arriba a la derecha
   (sigue lejos del pulgar, `BR-19` apartado 7, y con su confirmación en dos pasos). La racha y
   "LLEVÁS N" pasaron al renglón del riel, a su derecha. El tablero quedó en dos renglones.
3. **La ficha de la portada tiene el canto estriado y no tapa la boca**: la chapa es más grande
   que la ficha, la hendija asoma arriba y abajo. El cartel dice "PONÉ LA FICHA", sin flecha.
4. **El apagado dura 120 ms** (`--duracion-toque`): la pantalla llega a la línea en un toque y
   la nueva prende enseguida.
5. **La compu, a escala**: la pantalla mide de 15 a 23 rem (44 % del alto de la ventana), el
   enunciado va a 2 rem, las teclas son un 2 × 2 de 5,2 rem con la letra más grande, y la chapa
   de la portada crece un 30 %.
6. **Dos finales distintos.** *Derrota*: al perder la última ficha, **las tres, partidas,
   llueven del tablero y cruzan la pantalla** hasta el pie (en saltos, las mueve la isla); en
   el resultado la hoja da un golpe cuando la cifra termina de contar y el contador de créditos
   vuelve a 00. *Victoria*: las fichas que te quedaron **caen de a una, grandes, cada una con
   su clac**, y el crédito **queda en 01**: la máquina te lo deja. La retirada es la derrota
   sin el golpe.
7. **La planilla se imprime renglón por renglón** (el barrido de las pasadas, uno por escalón).
   El sello por casilla de la ronda 2 salió: ver "Lo medido".
8. **Reglas muertas y comentarios viejos** (verificado con grep que nadie más las usa): salieron
   `.vidas`, `.vidas-rotulo`, `.vida`, `.vida--viva` y `.vida--ida` de la base (las fichas
   viven bajo `.juego-quiz`), `.tablero .vidas`, `.tablero .vidas-rotulo`, la cinta gris
   (`.ficha-pregunta::before`), las cinco reglas de `.tablero-pie`, la flecha del cartel y la
   pestaña del nivel. El bloque de `D-71` avisa arriba que es la base y que manda lo de abajo.

### 2. Lo que pide el visto de otro

- **Texto sobre trama.** El enunciado se lee sobre el vidrio, que lleva la trama de barrido.
  La regla de las rondas anteriores era "lo que se lee va sobre papel o sobre el fondo, nunca
  sobre la textura". Acá la trama es una línea de 1,5 px cada 4, de la tinta de la categoría
  al 16 % sobre `--fondo`: el par medido casi no se mueve, pero **no está medido como par
  aparte**. Si `experiencia` no lo acepta, se saca la trama de atrás del texto cambiando el
  `inset` de `.ficha-pregunta::after`.
- **El crédito que queda en 01 al ganar** es una convención de fichín que nadie pidió.
- `--textura-barrido` falta en el lienzo (hoja 07).

### 3. Lo medido

- **Diez tamaños con los datos peores**, después de los cambios de esta ronda: en los diez la
  hoja no desborda, el sello cae adentro, la marca queda adentro, la pregunta con sus cuatro
  teclas entra en la ventana (a 320 × 568 termina en 559 de 568) y "Seguí" queda a la vista.
  "Jugá": 526 de 568, 526 de 640, 647 de 667, 656 de 844, 666 de 915, 673 de 860, 710 de 1024,
  580 de 768, 580 de 800 y 580 de 900.
- **Rendimiento** (CPU ×4, 430 × 860 a ×2, contra el sitio construido, dos tandas limpias con
  control 16,7 ms y ningún cuadro sobre 34). Pantalla quieta, con el vidrio: 16,7 / 16,8, igual
  que el control. **El pase** (apaga, rueda, prende): media 16,9–18,6, peor cuadro 33–117.
  Acierto: peor 83–117. Error: un cuadro de 317–417 (el del toque). Meter la ficha y arrancar:
  un cuadro de 383–433. **Llegar al resultado, con un sello por casilla: un cuadro de 617–633;
  sin esa animación, 200** (una tanda). Por eso la planilla pasó a un barrido por renglón; **no
  volví a medir después de ese cambio**.
- **Ojo con esos números**: el cuadro del toque en el error y en el arranque dio 133–150 en la
  ronda 1, medido contra `astro dev`; acá, contra el sitio construido, 317–433. Quise aislar
  qué lo sube (el vidrio, el alto repartido, el prendido, las fichas) apagando cada cosa, y la
  máquina estaba tan cargada que las tandas de prueba dieron de 300 a 1400 ms sin patrón. **No
  quedó aislado.** Lo único que se separó limpio es que el vidrio no es: sin la trama, el
  cuadro es el mismo.

### 4. Lo aprendido (para los juegos que quedan)

1. **Si la bajada nombra un objeto, las vidas, el número y el gesto de empezar son ese
   objeto**: acá la ficha es la vida, el crédito y el botón.
2. **El lugar del juego puede ser el recuadro de la pregunta**: repartir el alto de la ventana
   (pantalla arriba, teclas en la zona del pulgar) vale más que cualquier adorno.
3. **Adelantar un cierre se escucha con `click`, no con `pointerdown`**: si la hoja se corre,
   el `click` del mismo toque cae en otro lado.
4. **Con el teléfono emulado, una hoja que desborda achica la página y los toques del guion
   caen corridos**: si un botón "no anda" en el recorrido, primero medir `scrollWidth`.
5. **Una capa con `z-index` negativo se pinta encima del relleno de su propio padre** cuando el
   padre arma contexto (por `translate` o `rotate`): la pieza de varias capas no lleva relleno.
6. **Muchas animaciones chicas con espera cuestan más que una grande**: un sello por casilla
   fue un cuadro de 600 ms; un barrido por renglón, no.
7. **`steps()`, `fill=` en una textura y una clase sin regla rompen tests**: los saltos se
   escriben como cuadros repetidos, la textura va sin color, y toda clase que crea la isla
   necesita su regla.
8. **Medir rendimiento con la máquina libre y contra lo mismo cada vez** (siempre `dev` o
   siempre construido): si no, las rondas no se comparan.
