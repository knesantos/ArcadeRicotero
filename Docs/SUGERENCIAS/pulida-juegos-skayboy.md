# Pulida de los juegos — Skayboy y Poligirl (juego 4 de 10)

Propuesta del hilo que construye, para quien audita y para los dueños de cada carpeta. Nada de
esto está decidido: lo que toca una decisión escrita lo dice, con su número.

## Ronda 1 (2026-11-18): la sensación y la portada

### 1. Qué se hizo

**La sensación: el lugar contesta.** Después de cada tic la isla le pregunta a `sentir()`
(`src/lib/skayboy/sensacion.ts`) qué pasó, y lo dibuja en capas de HTML encima del área:

| Hecho | Qué se ve | Dónde |
|---|---|---|
| Aterrizar de un salto | dos motas de polvo que saltan a los costados, y el muñeco baja 1 px un instante | `#chispas`, y el dibujo |
| Caer de más alto que un salto | cuatro motas, 2 px de peso, y el tubo da un golpe seco | `#chispas`, `.recorte--golpe` |
| Despegar | dos motas chicas que raspan el piso | `#chispas` |
| Juntar un favorito | cuatro destellos en la tinta de objetos, con contorno | `#chispas` |
| Una caja que arranca / que apoya al caer | la raspadura atrás / polvo y golpe del tubo | `#chispas`, `.recorte--golpe` |
| Una palanca que cambia | dos virutas para el lado que quedó | `#chispas` |
| Volver a la entrada | **una pasada de rodillo** por el área, sin temblor | `#pasada-area` |
| Empezar un nivel | **telón de nueve líneas** que se retira, y el rótulo cae como sello | `#telon` |
| Ganar | un surtidor de chispas en cada puerta; la tarjeta y el contador caen como sello | `#chispas`, la hoja |

**La vidriera.** Con el menú de entrada abierto y el tubo a la vista (parado), los dos saltan de a
uno, dan unos pasos hacia el otro y vuelven (`vidriera.ts`). Cuatro vueltas de siete segundos, y se
quedan quietos.

**La portada a 430.** El sello de volver ya no roza el borde; el título mide hasta 1,4 rem; la hoja
ocupa la pantalla, así el menú baja hasta el borde de la ventana en vez de cortarse contra el pie;
el botón grande no dibuja anillo de foco si no se llegó con el teclado; y el plano de cada ficha
mide 60 × 36, va enmarcado en papel como el tubo, y sus grises dejaron el alfa.

**Los ruidos.** El interruptor de ruidos del sitio (`efectos.ts`) ahora calla también los tres
efectos de este juego. No se duplicó nada: se consulta `ruidosPrendidos()` antes de `sonar()`.

### 2. Lo que se decidió sobre la marcha, y contra qué

- **Las partículas no van en el canvas.** `motor.test.ts` no deja pintar tinta plana ni armar un
  color en la isla (`T-278`, `CTR-15`), y está bien que no deje. La salida fue la categoría que ya
  existía: capa de HTML encima del área, como el contador (`UX-33 §2.5`). Cuadraditos de 2 a 4
  píxeles nativos, en `--px-clave` y `--px-tesoro`, que saltan de entero en entero.
- **No hay aplastamiento de sprite.** El atlas no se escala (`ADR-08.3`). El "squash" es correr el
  mismo cuadro 1 o 2 px hacia abajo durante 0,1 s: los pies se pierden contra el piso y cede la
  cabeza.
- **Volver a la entrada no tiembla ni estalla.** `UX-29 §3` dice que lo devuelve el lugar con una
  pasada de imprenta; estaba escrito desde el 2026-09-23 y no se había construido. Se construyó eso.
- **La vidriera no es la solución grabada.** La traza no viaja al teléfono (`ADR-09.2`) y sería
  contarle el nivel al que no lo jugó. El guion es el mismo para los doce niveles y **se ensaya
  antes de mostrarse**: si toca algo, se prueba uno más quieto. Hoy: 1 y 2 con pasos; 3 y 6 a 12
  solo saltos; el 4 salta ella sola (él tiene la guitarra arriba); el 5 no tiene vidriera.
- **El telón no espera a nadie.** El nivel nuevo ya está armado debajo y el dedo ya mueve
  (`D-32` límite 3). Es un corte a negro que se destapa en menos de 400 ms.

### 3. Lo que pide una decisión de otro

1. **`D-32` y `UX-32 §2.3` dicen que nada se mueve para llamar la atención**, y que al ganar no hay
   transición. Las chispas de las puertas y el sello de la tarjeta son, estrictamente, eso. Se
   construyeron porque el pedido de la ronda es explícito, y con las barandas de siempre: menos de
   400 ms, cero espera, pixel duro. **Hace falta una enmienda escrita** (`experiencia`, y una `D-`)
   que diga que en el fichín el lugar contesta, o sacarlas.
2. **`D-86` decidió que el plano no marca dónde arranca cada uno.** Con el plano más grande se lee
   mejor la sala, pero sigue sin gente. Dos puntos —uno por muñeco— lo harían un mapa. Es de
   `experiencia`.
3. **`CTR-17` fija tres efectos y dice que la vuelta y la compuerta no suenan.** El empuje, la
   palanca y el aterrizaje hoy se ven y no se oyen. Un cuarto y un quinto efecto son de
   `arquitectura`.
4. **Esta pantalla no tiene botón para prender o apagar los ruidos**; respeta lo elegido en otro
   juego. Dónde va el botón en un mueble que mide cada píxel (`UX-33 §1.2`) es de `experiencia`.
5. **De costado y en la compu el menú tapa el tubo** (`UX-37 §3.3`), así que la vidriera no se ve y
   la isla ni la arma. Para que haya vidriera ahí habría que dejarle una ventana al tubo.

### 4. Cómo se verificó

- `npm test`: 2500 (eran 2481; los 19 nuevos están en `src/lib/skayboy/sensacion.test.ts`).
  `movimiento.test.ts` cambió a propósito: cuatro entradas nuevas en `ANIMACIONES`. Ningún otro
  test se tocó: la isla se acomodó a los auditores de `escena.test.ts` y `motor.test.ts`.
- `npm run check`: 0 errores. `npm run build`: verde.
- `node scripts/mirar-juego.mjs skayboy-y-poligirl <salida>` tiene recorrido propio: juega el nivel
  1 entero, la vuelta en el 2, la caja en el 10, la palanca en el 8 y la pantalla completa. Las
  tiras de juego se sacan **recortadas al tubo y agrandadas** (`sobre: '.recorte'`).
- Tiempo entre cuadros con CPU ×4, a 430 × 860, contra el control de la misma tanda (la misma
  página con movimiento reducido): portada 17,5 ms contra 17,6; partida saltando sin parar 17,8 y
  19,0 contra 17,7 y 17,8, con 1 y 3 cuadros de más de 25 ms en siete segundos.

### 5. Lo flojo

- El peso de 1 px **no se llegó a ver en ninguna tira**: dura seis cuadros y las capturas caen cada
  150 ms. Lo prueba el test, no el ojo.
- El golpe del tubo tampoco se vio: en el recorrido nadie cae de más alto que un salto.
- El polvo se ve, pero es chico a ×1 (3 px CSS).
- La raspadura de la caja sale del lado del que empuja y el muñeco la tapa a medias.
- La segunda tanda de la partida midió 1,2 ms más que su control. Puede ser ruido; no se repitió.
- El menú a 430 sigue desplazando por dentro: doce fichas no entran.
- No se probó en un teléfono de verdad, ni en Safari.

### 6. Para la próxima ronda

1. Mirar el peso y el golpe en una ráfaga de cuadros seguidos (captura por `screencast`), y decidir
   si se quedan.
2. La portada de costado y en la compu: una ventana al tubo para que la vidriera se vea.
3. El mueble como mueble: marquesina con el título arriba del tubo a 430, en vez del renglón suelto.
4. La compuerta que se abre y la placa que se pisa todavía no contestan; y la raspadura de la caja,
   del lado correcto.
5. El menú a 430 sin desplazar: tres fichas por renglón, o el número sobre el plano.

## Ronda 2 (2026-11-18): el mueble

### 1. Qué se hizo

- **La marquesina** (`src/lib/skayboy/marquesina.ts`): el título en pixel, 5 × 7 por letra, dibujado
  como código (`D-44`) y armado en el build. Franja de la clave en el frente del mueble, arriba del
  tubo. Nace apagada (`--px-skay-3`) y se prende **una vez**, palabra por palabra, con un parpadeo,
  al rojo de *Gulp!* (`--px-infierno`). Solo parado: ahí reemplaza al renglón del título (el `<h1>`
  queda para el lector de pantalla), la marca sube al renglón del volver y el volver tiene aire.
- **El detalle vivo: el fichín se prende.** Cuando el motor ya dibuja, el tubo abre desde la línea
  del medio en cuatro saltos (`tubo-prende`) y después enciende la marquesina. Hasta entonces el
  canvas está apagado: ya no se ven pasar la barra de carga del motor ni el área sin sala.
- **El menú es el tablero del mueble**: filete de papel como la chapa, en vez del recuadro rojo.
  Parado: botón de fichín redondo para Jugá, las dos teclas chicas al lado, y los doce niveles como
  cartuchos de a tres (el número sellado sobre la etiqueta, el lomo estriado). A 430 × 860 y a
  390 × 844 entra sin desplazar.
- **La ventana al tubo** (`conVentanaAlTubo()`, `menu.ts`): de costado y con alto, el menú ocupa el
  58 % de arriba y deja ver el piso de la sala, así que la vidriera se ve en la tableta y en la
  compu. Los cartuchos van de a seis cuando hay ancho.
- **El polvo**: ráfaga de cuatro motas (dos de 4 px, dos de 2) que se abren 8 px; seis en un golpe
  fuerte.
- **La caja raspa adelante**, del lado libre. **La placa** y **la compuerta** contestan: la placa
  suelta dos motas; la reja, polvo en el umbral al cerrar y virutas que caen al abrir.
- **Los ruidos**: lo que pesa (caja que apoya, caída de más de un salto) suena con `golpe`; la
  palanca, con `clac`; la caja que arranca y la placa, con `tecla`. Son los de `efectos.ts`, detrás
  del interruptor. El aterrizaje común no suena. La vidriera no suena nunca.
- **La tecla de los ruidos** está en el tablero del menú (`armarInterruptorDeRuidos()`).

### 2. Las dos enmiendas que escribe el hilo principal

- **A `D-32` y `UX-32 §2.3`:** en el fichín el lugar contesta. Al ganar, las dos puertas sueltan
  chispas y la tarjeta y el contador caen como sello; durante la partida, el polvo, el golpe del
  tubo, la pasada y el telón. Con los límites de siempre: menos de 400 ms, pixel duro en tintas
  `--px-*`, cero espera, atado a un hecho, y nada con movimiento reducido.
- **A `CTR-17`:** además de los tres efectos propios, la partida usa tres de síntesis del sitio
  (`golpe`, `clac`, `tecla`) para lo que pesa, la palanca, y la caja y la placa. Pasan por el
  interruptor de ruidos, igual que los tres propios desde la ronda 1. La compuerta y la vuelta
  siguen calladas (`CTR-16.10.7`, `UX-29 §5`); el aterrizaje suena solo desde `CAIDA_FUERTE`.

### 3. Lo que se miró cuadro por cuadro

`mirar-juego.mjs` tiene ahora `rafaga()`: la filmación del navegador (`Page.startScreencast`), un
cuadro cada ~17 ms, pegada en grilla.

- **El peso y el golpe del tubo se quedan.** En la ráfaga del golpe fuerte (subir al escalón del
  nivel 10 y tirarse) el tubo baja tres cuadros y vuelve, y el muñeco se ve más bajo en esos mismos
  cuadros. Se lee como un golpe seco, no como un temblor.
- **El polvo a ×1 se ve**: en la ráfaga sin agrandar son motas que se abren durante unos doce
  cuadros. Sigue siendo chico; es lo que da un pixel nativo a ×1.
- **El encendido** se ve entero: línea, franja, sala, y después la marquesina.

### 4. Cómo se verificó

- `npm test`: 2507 (eran 2500). `npm run check`: 0 errores. `npm run build`: verde.
- Siete tamaños medidos con el menú abierto: 375 × 667, 390 × 844, 360 × 740, 812 × 375, 568 × 320,
  1024 × 768 y 1440 × 900. Sin desplazar: 390 × 844, 1024 × 768 y 1440 × 900 (y 430 × 860).
- CPU ×4 a 430, contra el control de la misma tanda: portada 17,7 y 17,8 ms contra 17,8 y 17,5;
  partida saltando 17,8 y 17,8 contra 17,8 y 17,6.

### 5. Lo flojo

- **La placa y la compuerta no se vieron**: en el recorrido la caja llega a la placa antes de que
  arranque la ráfaga. Las prueba el test.
- **Los ruidos nuevos no se oyeron**: el navegador de las capturas va mudo. Hay que jugarlo.
- En pausa a 430 el menú vuelve a desplazar un renglón ("Empezá el nivel de nuevo" suma una fila).
- A 375 × 667 y 360 × 740 el menú desplaza (147 y 74 px): doce cartuchos no entran en esa zona.
- A ×1 de costado (812 × 375, 568 × 320) el menú sigue tapando el tubo y desplaza 41 px; ya
  desplazaba 39 antes. Ahí no hay ventana, ni vidriera, ni marquesina.
- A ×2 de costado (tableta chica, 288 de alto de tubo) tampoco hay ventana: el menú no entra en el 58 %.
- La marquesina no existe de costado ni en la compu: el título sigue en la cabecera de imprenta.
- El botón redondo es nuevo en el sitio. No es una pastilla, pero es el primer círculo tocable.

### 6. Para la próxima ronda

1. Jugarlo con sonido en un teléfono y ajustar los tres ruidos nuevos (nivel y cuál).
2. El menú en pausa y en teléfonos bajos, sin desplazar: los cartuchos sin nombre de a cuatro, o
   el nombre solo en el elegido.
3. ×1 de costado: la ventana al tubo y los doce niveles en esa franja de 152.
4. La marquesina en la compu y de costado, con el mueble entero como marco.
5. La placa y la compuerta en ráfaga propia, y el nivel completado del último nivel (hoy vuelve
   al primero sin nada propio).
