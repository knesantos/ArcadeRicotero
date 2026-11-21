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

---

## Ronda 2 (2026-11-20/21): el signo, la ficha con cuerpo y todo en una pantalla

### 1. Decisiones del hilo principal, ya aplicadas (para las enmiendas)

- **`UX-34` §5 y §6 ("sin movimiento decorativo", "ninguna animación nueva")**: la ficha se da
  vuelta, cae un sello, la ficha ganada vuela a la pila y la pila se cae al errar. Lo que §5
  protegía sigue en pie: **el número real llega de golpe**, impreso en la cara, sin contador que suba.
- **`UX-34` §3.2 (la caja de referencia)**: la referencia y el número escondido son dos fichas
  sobre una mesa; la tuya a la izquierda. El nombre del dato va adentro de la ficha.
- **`D-48` punto 11 ("sin tarjeta-imagen")**: hay tarjeta (`tarjeta-fichas.ts`). Lleva la racha,
  la ficha boca abajo y la pila; ninguna pregunta ni número del pozo.
- **`D-48` punto 7 (la mejor racha)**: además de guardarse, se muestra en la portada y en la
  cabecera, y pasarla es la hazaña. Va en el oro del destaque (`--acento-2`), no en el verde.
- **"Corregí esto" no se hace en esta pulida.** Queda para `arquitectura`: sumar
  `'mas-o-menos'` a `JuegoCorregible` (`CTR-10`, `src/lib/correccion/armar.ts`) y poner el
  zócalo debajo de la ficha de la respuesta, con el dato, su valor y su fuente en lo que se manda.

### 2. Qué se hizo

1. **El signo que compara.** Entre las dos fichas se estampa un recuadro derecho y de borde
   grueso con el símbolo grande (`>` si la tuya es mayor, `<` si es menor) y debajo las palabras
   ("MÁS QUE", "MENOS QUE", "ANTES DE", "DESPUÉS DE", que salen de `PARTIDA.nombreBoton`: no hay
   copy nuevo). Se lee como la cuenta: "7:25 > 6:00". Las fichas se separaron y el número bajó
   un cuerpo para que el signo no lo pise.
2. **La mejor racha no va en verde ni pegada al borde de la mesa.** Es una chapa en la
   cabecera, debajo de la tecla de los ruidos: "MEJOR: 3", tenue y de trazo cortado. Cuando la
   pasás, la chapa pasa al oro con doble filete y desde ahí va diciendo la racha ("MEJOR: 4",
   "MEJOR: 5"); la primera vez, además, cae un sello grande en oro sobre la mesa, que se va con
   la pregunta. En el resultado y en la tarjeta, el doble filete y el sello también van en oro.
3. **El dorso tiene cuerpo.** Trama impresa en el azul de apoyo sobre el celeste (tono sobre
   tono), filete, **la medalla con la FR coronada** (`public/marca/fr-tinta.svg`, de máscara) y
   **el canto estriado** (también en la cara). Salió el rombo con el signo de pregunta. El
   nombre de lo que se pregunta va en una etiqueta de papel pegada: no se lee sobre la trama.
4. **El botón principal.** El par (tinta del fondo sobre la tinta de *Un baión*) da **6,40:1**:
   no es débil, y *Un baión* no tiene un valor más claro medido. Lo que fallaba era que el botón
   y el dorso eran el mismo celeste liso. Ahora el dorso lleva trama y el botón es una tecla:
   filete de la tinta del fondo por adentro y canto en el azul de apoyo. `D-54` no se toca.
5. **La ficha dada vuelta y "Seguí" entran juntas** (`acomodarLaMesa`): la isla mide; si no
   entra, achica las dos fichas lo justo (hasta 104 px de alto), animado; si ni así, la pregunta
   y las teclas salen de la vista (el lector las conserva) y vuelve a medir; si ni así, el
   número se escribe también en la ficha de la respuesta y la hoja se corre hasta "Seguí".
6. **La pregunta, compuesta.** Las teclas van pegadas a la mesa, abajo; las fichas son más
   altas (5 × 6,8); la pregunta queda al medio del aire que haya; en un teléfono alto crecen el
   contador, los cantos de la pila y el cuerpo de la pregunta.
7. **El resultado entra en una pantalla** (a 430 × 860 "Volvé al fichín" termina en ~740). La
   cifra con la pila, la mejor racha y el sello al lado; "Te cortó acá" es un renglón: las dos
   fichas chicas con su signo y, a la derecha, la pregunta, el número y la fuente.
8. **La compu, a escala**: fichas de 14,5 rem, teclas de 5,2 rem, la pregunta a 1,75 rem.
   **Teclado**: ← y → aprietan la tecla de ese lado; ↑ es "más" o "después" y ↓ es "menos" o
   "antes". La flecha se ve en la tecla solo donde hay puntero fino.
9. **La tirada de la portada**: el dorso se esconde en los mismos ocho saltos que la ficha (ya
   no queda un cuadro a medio transparentar) y la cara lleva impresos los dos signos, + y −.

### 3. Tokens, tests y copy

- **Un token nuevo: `--textura-estria`** (una raya parada cada cuatro; la hermana de pie de
  `--textura-barrido`). Entró por `tokens.css`; **falta en la hoja 07 del lienzo**.
- **Pares de contraste: ninguno nuevo.** El oro sobre el fondo ya estaba ("acento-2 sobre fondo").
- `estilos.test.ts`: cinco estados más en `ESTADOS_MAS_O_MENOS`. Ninguno relajado. Suite: 2511.
- Copy nuevo: `FICHAS.mejorCorta` ("Mejor: N"), para el visto de `contenido`.
- `scripts/mirar-juego.mjs`: el estado de cada paso dice además las clases de la partida
  (apretada, mesa afuera) y el alto de la ficha.

### 4. Lo aprendido

1. **Un signo se lee como cuenta si va derecho, grande y con el borde de las piezas**; torcido
   y chico es un sello más.
2. **El verde es del acierto.** Una marca propia (un récord) va en el oro del destaque.
3. **Si el botón y el objeto comparten tinta, se separan por material**: trama en el objeto,
   filete y canto en el botón, sin tocar el mapa de discos.
4. **Todo en `cqw` de la pieza**: una ficha que se achica entera (letra, filete, canto) deja
   medir y animar un solo número, su alto.

---

## Ronda 3 (2026-11-21): el cierre de la pulida

### 1. Decisión del hilo principal, ya aplicada

- **"Seguí" se queda en la tinta de *Un baión*** (6,40:1, `D-54` intacta): lo que lo separa del
  dorso de la ficha es el material —filete y canto en el botón, trama en el dorso—, no la tinta.

### 2. Qué se hizo

1. **El sello de la hazaña cae en el paño de arriba.** Cuando la respuesta pasa tu mejor racha,
   la mesa le reserva una franja arriba (`mesa--con-hazana`, que entra en lo que mide
   `acomodarLaMesa`) y el sello oro cae ahí: no pisa las fichas, los números ni el signo. A
   los 1,8 s se va y queda **la marca chica, que es la chapa "MEJOR: N" en oro** (se estampa
   de nuevo al irse el sello). Con movimiento reducido el sello se queda hasta la pregunta que sigue.
2. **El cuerpo de la pregunta depende de su largo** (`data-largo`: hasta 46 letras, hasta 84,
   más): la más larga del pozo (118 letras) entra en tres renglones a 430 y no empuja la mesa.
3. **`acomodarLaMesa`, una sola política, siempre en este orden**: entra → achicar las fichas
   hasta 150 px → plegar lo largo de la ficha de la respuesta (explicación a dos renglones y el
   detalle de las palabras, detrás de "Leé más"; la fuente no se pliega) → fichas al mínimo
   (96 px) → sacar de la vista la pregunta y las teclas → escribir el número en el panel.
   **El achique va por `transform`**: el alto se pone de una y cada ficha anima desde donde
   estaba y del tamaño que tenía (`animate()` en la isla, `--duracion-paso`).
4. **La pila tiene cuerpo de ficha**, en la cabecera, la portada, el resultado y la tarjeta:
   cada canto con sus estrías y su línea de apoyo, y arriba de cada montón la cara de la última
   en escorzo. Ya no son tres rayas.
5. **Tres cierres distintos en el resultado.** *Cero*: cifra tenue, torcida y de trazo
   cortado, lugar de la pila vacío, y la hoja da un golpe. *El de siempre*: cifra en la tinta
   del disco con filete entero, que apoya como sello. *La hazaña*: cifra, doble filete y sello
   en oro, dos golpes de sello, y la línea "Tu mejor racha" no se repite (la dice el sello).
6. **Limpieza**: salió la transición de alto y `mesa--midiendo`; las medidas de la pila son dos
   variables (`--canto-pila`, `--ancho-pila`) en vez de reglas repetidas por tamaño.
7. **El recorrido juega con el teclado en la compu** (← → por el lado, ↑ ↓ por lo que dice):
   cuatro o cinco respuestas por pasada, todas llegaron a la ficha de la respuesta.

### 3. Tests y copy

- `estilos.test.ts`: seis estados más y uno menos (`mesa--midiendo`). Ninguno relajado.
  Suite entera, al final: **2511 de 2511**; `check` 0 errores; `build` verde.
- Copy nuevo: `FICHAS.leerMas` ("Leé más"), para el visto de `contenido`.

### 4. Lo medido (sitio construido)

- **Diez tamaños con el peor dato, acierto y error**: no desborda en ninguno; "Jugá" entra en
  los diez (320 × 568: 548 de 568); "Seguí" a la vista en los veinte casos; **la mesa entera
  entra con "Seguí" en 19 de 20** (ronda 2: 14 de 20). El que falta es el error a 320 × 568:
  la mesa queda a la vista (de 22 a 155 px) pero la cabecera se corre, y el número se escribe
  también en el panel.
- **Rendimiento** (CPU ×4, 430 × 860 a ×2, dos tandas, control 16,7 ms sin cuadros sobre 34).
  Acierto: media 18,1–18,2, peor 100–117, **2 cuadros sobre 34 ms** (ronda 2: 9–12, peor
  300–333). "Jugá": peor 117. Pase: peor 67–100. Error: peor 83–100. Llegar al resultado:
  peor 117–133. La máquina estaba más libre que en la ronda 2: la baja del acierto es del
  cambio a `transform`; la de los demás, en parte, del día.

### 5. Lo que queda abierto

- A 320 × 568 con el peor dato y error, la partida mide unos píxeles más que la ventana.
- La política pliega antes de bajar del alto legible: en un teléfono alto con dato largo
  aparece "Leé más" aunque sobraría con fichas un poco más chicas. Es el orden pedido.
- El sello de la hazaña dura 1,8 s fijo; quien toca "Seguí" antes se lo lleva puesto.
- Sin probar con dedo, con lector de pantalla ni con oídos; `?incrustado` sin mirar.
- `--textura-estria` falta en la hoja 07 del lienzo. `UX-34`, `PRD-mas-o-menos.md` y `D-48`
  describen la pantalla de antes. "Corregí esto" sigue anotado para `arquitectura`.

### 6. Lo aprendido (para el juego que queda)

1. **Si la respuesta es un dato escondido, el momento es darlo vuelta, y lo demás espera**:
   las teclas dicen cuál era recién cuando la pieza apoya.
2. **Una relación entre dos piezas se dibuja entre ellas**, derecha, grande y con su borde;
   un sello torcido al costado es decoración.
3. **El verde es del acierto y el rojo del error**: una marca propia va en el oro.
4. **Lo que cae "encima" necesita lugar reservado antes de medir**: si no, tapa el premio.
5. **Un achique se pone de una y se anima con `transform`**: animar el alto fueron 9–12
   cuadros largos; así, 2.
6. **Una política de ajuste es una lista ordenada escrita en el código**, no ramas que
   dependen del tamaño: es lo que hace comparables los diez tamaños.
7. **Todo en `cqw` de la pieza y las medidas repetidas en variables**: la pieza se achica
   entera y cada tamaño cambia un número.
8. **Buscar el nombre de la clase en toda la hoja, también más abajo** (`.pila`, `.mano`).
