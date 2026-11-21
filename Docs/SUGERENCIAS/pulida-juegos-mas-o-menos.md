# Pulida de los juegos: "Más o menos" (`US-10`)

> Propuesta del constructor de la ronda, para que el hilo principal la convierta en decisión
> (`D-XX`) o la corrija. Es el juego 9 de la pulida. No toca `ESTADO.md`, `Docs/DECISIONES.md` ni
> la carpeta de ningún rol. **No se tocó ningún número, ninguna fuente ni cuál es la respuesta**:
> `lib/mas-o-menos/partida.ts`, `referencia.ts`, `datos.ts`, `formato.ts`, `pozo-del-sitio.ts` y
> los datos están como estaban. La isla sigue pidiéndole al motor el paso y la respuesta.

## Ronda 1 (2026-11-20): las fichas, la mesa y la pila

### 1. El objeto

La acotación de la portada ya lo decía: *"Tenés una ficha boca abajo en la mano."* El objeto es
**la ficha**: una pieza con su canto, de papel por la cara y del celeste de *Un baión* por el
dorso, con un rombo y un signo de pregunta. (La ficha de "Preguntas ricoteras" es una moneda;
esta es una pieza de mesa: mismo nombre, otro material.)

- **Portada: la ficha en la mano.** Boca abajo, torcida, al lado de la bajada. "Jugá" **la
  tira**: salta, da una vuelta entera en el aire (dorso, canto, cara, canto, dorso) y cae; ahí
  arranca. La ficha es un atajo del botón (sin foco y escondida al lector). Si el aparato tiene
  una mejor racha guardada, debajo de la bajada está la pila que dejaste y la línea que la dice.
- **Partida: la mesa.** Un paño de doble filete con dos fichas: **la tuya, boca abajo** (con el
  nombre de lo que se pregunta, si lo tiene) y **la que está a la vista** (la referencia, con su
  número grande y su unidad). La familia va de pestaña pisando el borde, y a la derecha, tu
  mejor racha. Abajo, en la zona del pulgar, las dos teclas.
- **Responder es darla vuelta.** La ficha se levanta, se afina hasta el canto y se abre del otro
  lado con el número ya impreso. Cuando apoya, las teclas dicen cuál era, cae el sello sobre el
  paño y entre las dos fichas queda estampada **la palabra que las compara** (MÁS, MENOS, ANTES,
  DESPUÉS): la mesa se lee de corrido, "50 setlists · MENOS · 130 setlists".
- **La racha es la pila.** En la cabecera, un contador de ruedas y la pila de las fichas
  ganadas, un canto por acierto en montones de cinco. Al tocar "Seguí", **la ficha que ganaste
  vuela de la mesa a la pila** y cae de canto, con su clac.
- **La primera que errás tira la pila.** Cae la cruz, la partida da un golpe (doble) y los
  cantos se desparraman y caen. La cabecera queda de trazo cortado; el contador sigue diciendo
  hasta dónde llegaste.
- **Resultado.** La racha grande y, al lado, la pila que **se arma ficha por ficha mientras la
  cifra sube**; debajo, lo que te cortó (la pregunta, las dos fichas como quedaron y la fuente),
  y el pie compartido con la tarjeta que asoma.

### 2. Lo que cambia de doctrina y necesita quedar escrito

1. **Hay movimiento, y `UX-34` §5 decía que no.** Lo que §5 protegía de fondo se mantiene: **el
   número real llega de golpe** (`RES-98`). Está impreso en la cara de la ficha y aparece entero
   cuando la ficha pasa el canto; no hay contador que suba hasta él. Lo que se suma es el giro,
   el sello, el vuelo a la pila y la pila que cae. Enmienda a `UX-34` §5 y §6 ("ninguna
   animación nueva").
2. **Cuál era la tecla buena se dice cuando la ficha apoya, no en el toque** (380 ms después;
   cero con movimiento reducido). En el toque, la tecla tocada queda hundida con el filete de la
   tinta del texto. Si las teclas hablaran antes, darla vuelta no revelaría nada.
3. **La respuesta se cierra en dos tiempos**, como en los otros juegos: primero la vuelta, las
   teclas y el sello; a los 880 ms llega la ficha de la respuesta. Se adelanta con un toque o
   con Enter o la barra (se escucha `click`). Avanzar lo sigue mandando el dedo (`UX-34` §3.3).
4. **El número real ya no se repite grande en el panel**: lo lleva la ficha. En el panel queda
   escrito para el lector de pantalla, y **a la vista en ventanas bajas** (hasta 44 rem de
   alto), donde la hoja se corre hasta "Seguí" y la mesa puede quedar arriba de la ventana.
5. **La tuya va a la izquierda y la referencia a la derecha.** Es el orden en que se dice
   ("la mía es *más que* aquella") y el del nombre accesible de las teclas ("Más que 12 años").
   El *Higher Lower Game* las pone al revés (lo conocido primero).
6. **El nombre del dato va adentro de la ficha**, arriba del número («Jijiji»), también en el
   dorso de la tuya. La caja de referencia (`.masomenos-referencia`, `.masomenos-valor`) salió.
7. **La línea de setlist.fm de la referencia** (`RNF-CTR-19-A`) sigue estando antes de
   responder, sin enlace: va debajo de la mesa.
8. **La cabecera no dice "Llevás N" ni "N al hilo"**: en este juego serían el mismo número que
   la racha. Hay un contador ("RACHA" y dos ruedas; tres desde cien) y la pila.
9. **La hazaña es pasar tu mejor racha del aparato.** En la partida, la pestaña "Tu mejor
   racha: N" de la mesa se cambia por un sello verde cuando la pasás (una vez, con su ruido); en
   el resultado, doble filete en la cifra y el sello "¡Tu mejor racha!"; en la tarjeta, el sello.
   Sin mejor racha guardada (primera partida) no hay hazaña.
10. **Hay ruidos**: tecla al tirar la ficha, al responder y al pasar; sello o golpe doble cuando
    la ficha apoya; clac cuando la ficha cae en la pila y mientras la pila del resultado se arma.
    El interruptor está en la portada y en la cabecera. Ningún efecto nuevo en `efectos.ts`.
11. **Hay tarjeta compartible** (`src/scripts/tarjeta-fichas.ts`, pincel propio). `D-48` punto 11
    decía "sin tarjeta-imagen en esta versión". Lleva la firma, el juego, la racha grande en el
    celeste, una ficha boca abajo, la pila, la línea que canta, la mejor racha y la dirección.
    **No lleva ninguna pregunta ni ningún número del pozo.** Compartir pasó a `compartir.ts`.
12. **El resultado ya no repite "Ahí se cortó la racha"**: bajo "Te cortó acá" van la pregunta,
    la mesa chica con las dos fichas dadas vuelta y la cruz, el número escrito y la fuente.

### 3. Detalles vivos (para el registro)

| Detalle | Estado | Cómo | Con movimiento reducido |
|---|---|---|---|
| La ficha salta y da una vuelta en el aire | "Jugá" | `animate()` en la isla, ocho saltos | arranca la partida |
| Las dos fichas se reparten | pregunta nueva | `.jugo-pega` con `--orden` | puestas |
| Tu ficha se despega un pelo | el dedo en una tecla | `:has(.opcion:active)` | igual (es respuesta al toque) |
| La ficha se da vuelta por el canto | se respondió | `ficha-voltea`, `ficha-dorso-se-va` | dada vuelta |
| El sello cae en el paño y deja la marca en tu ficha | la ficha apoyó | `.sello-cae`, `.sello-marca` | la marca, de una |
| La palabra que compara se estampa | llega la ficha de la respuesta | `sello-golpe` | puesta |
| "+1" vuela al contador, que da la vuelta | acierto | `volar`, `rodarContador`, `estampar` | la cifra cambia de una |
| La ficha ganada vuela a la pila y cae de canto | "Seguí" | `volarPieza`, `ficha-apila` | el canto aparece |
| La pila se viene abajo | error | `animate()` en la isla, doce saltos | vacía, cabecera de trazo cortado |
| La pila se arma y la cifra sube con ella | resultado | reloj de la isla, `ficha-apila`, `estampar` | entera, la cifra en su valor |

### 4. Tokens, tests y copy

- **Ningún token nuevo.** La trama del paño es `--textura-barrido` de máscara sobre la tinta
  del disco al 13 %; nada se lee sobre ella (las fichas y la palabra del medio son opacas).
- **Pares de contraste: ninguno nuevo.** Cara: `--fondo` sobre `--papel`. Dorso: `--fondo`
  sobre la tinta de *Un baión*. El azul de apoyo va solo de borde.
- **Tests** (2511, sin cambio de cantidad). Cambiados a propósito: `movimiento.test.ts` suma
  tres animaciones (`ficha-voltea` y `ficha-dorso-se-va` por `--duracion-umbral`, `ficha-apila`
  por `--duracion-sello`); `estilos.test.ts` suma veintiún estados a `ESTADOS_MAS_O_MENOS` y
  declara la isla nueva `tarjeta-fichas.ts`. Ninguno se relajó.
- **El bloque de CSS va después del de "Más o menos" y antes del de "Adiviná la tapa"**, o sea
  antes de `.ponelos {`: el test de `BR-22` lee de ahí al final y no admite `--acento-3` ni
  `--acento-4`. En el bloque nuevo esos dos tokens aparecen solo en las dos reglas que tiñen el
  borde de la tecla buena y de la elegida.
- **Copy nuevo en `mas-o-menos/copy.ts`** (`FICHAS`), para el visto de `contenido`; lo audita
  `voz.test.ts`: "Racha", "+1", "Mirá cómo te fue", los tres de los ruidos, "¡Tu mejor racha!",
  "Ficha boca abajo." (lector) y "N fichas ganadas" (lector).
- **Dos nombres chocaban** con "Ponelos en fila" (`.pila`, `.mano`), que está más abajo en la
  hoja y pisaba: acá son `.apilada` y `.en-mano`.

### 5. `scripts/mirar-juego.mjs`

Recorrido `mas-o-menos`: portada (con mejor racha 3 guardada), la ficha que se tira, pregunta,
acierto (con "más" o "menos", lo que salga: lo dice el nombre de la foto), el pase a la pila, la
vuelta de la ficha de cerca y lenta, seis seguidas (en la cuarta se pasa la mejor racha), el
error con la pila que cae, el resultado, la tarjeta tal cual se comparte, lo compartido y una
vuelta errando la primera. En cada paso dice dónde quedan las teclas, la mesa y "Seguí" y
cuánto desborda. **`--peor`** le cambia al navegador el pozo (enunciado, nombre y explicación más
largos, números de cinco cifras con unidad, el detalle de las palabras en todos) y mide lo justo
en los tamaños que se le pasen.

### 6. Lo que pide una decisión de otro

- **La puerta "Corregí esto" no está**: `JuegoCorregible` (`CTR-10`) no admite `mas-o-menos`. Es
  el juego donde un número mal le marca error al que sabe; conviene sumarlo (`arquitectura`).
- **`UX-34`, `PRD-mas-o-menos.md` y `D-48`** describen la pantalla de antes; el lienzo no tiene
  esta. Enmiendas: §5 (movimiento), punto 11 (tarjeta), §3.2 (caja de referencia).
- **El sello "¡Tu mejor racha!"** y la pila de la portada son convenciones que nadie pidió.

### 7. Lo aprendido

1. **Si la respuesta es un número escondido, el momento es darlo vuelta, y las teclas esperan.**
   Marcar la tecla buena en el toque le saca todo a la revelación.
2. **Antes de nombrar una clase corta, buscarla en toda la hoja, también más abajo**: `.pila` y
   `.mano` eran de otro juego y, por venir después, ganaban.
3. **Una palabra entre dos piezas explica más que un panel**: "MENOS" entre las dos fichas hizo
   innecesario repetir el número.
4. **El sello del cierre cae donde no tapa el premio**: al medio tapaba los dos números; va en
   el paño de abajo.
