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

## Ronda 3 (2026-11-18): el cierre

### 1. Qué se hizo

- **La compu y la tableta tienen el mismo mueble que el teléfono.** Con la cabecera acostada (de
  720 × 500 para arriba) la marquesina va arriba del tubo, con el pixel a la escala del área; el
  `<h1>` queda para el lector y la bajada se va, como en el teléfono. La cabecera es el volver a la
  izquierda y la marca a la derecha: pierde su segundo renglón, y con eso paga el alto de la
  marquesina. El mueble ×4 termina en 757 a 1280 × 800 y a 1366 × 768.
- **El tablero partido.** De costado y con alto, el menú son dos paneles, uno sobre cada columna de
  mando, y **el tubo queda entero a la vista**: a la izquierda el botón de fichín, qué nivel juega y
  las teclas chicas; a la derecha los doce cartuchos de a dos. El mueble no se mueve al tocar Jugá,
  y la vidriera se ve entera. Reemplaza a la ventana al tubo de la ronda 2 (`conVentanaAlTubo()`,
  que se fue con sus dos tests).
- **Ningún menú desplaza**, ni en la entrada ni en pausa, en los diez tamaños medidos. En teléfonos
  bajos y en pausa los cartuchos van de a cuatro, sin nombre (lo dice el renglón del botón). A ×1 de
  costado son tres columnas: el botón, los doce números de a seis y las dos teclas.
- **El final del juego** (`src/lib/skayboy/final.ts`, `#final-juego`): al pasar el último nivel de
  la fila, una capa del lado contrario a las puertas con "Abriste todas las puertas", `12 DE 12 ·
  PASADOS`, **los créditos que suben** —los nombres de los doce niveles y "Hecho por ricoteros, para
  ricoteros."— y dos salidas: "Volvé al primero" y "← Volvé al fichín". La marquesina titila tres
  veces. Sin Compartí: no hay tarjeta (`BR-27`). Reemplaza a la tarjeta de fin de nivel y al
  contador en ese único caso.
- **La placa y la compuerta** tienen su ráfaga en el recorrido.

### 2. La excepción declarada: el botón de fichín es redondo

`diseno-marca.md` veta la pastilla cápsula como chip por defecto. El botón grande de Jugá es un
círculo y **no es una pastilla de interfaz: es un objeto**, el pulsador de un fichín. Tinta plana
del disco, aro de papel del ancho de la chapa, sin sombra ni volumen. Es el único círculo tocable
del sitio y no se copia a otra pantalla. Decisión del hilo principal. Queda escrita al final de
`skayboy.css`; `estilos.test.ts` solo mira `999px`, y el botón usa `50%`, así que el test no la ve.
Si se quiere que la vea, es una línea en la tabla de `diseno-marca.md` y un caso en ese test.

### 3. Lo que pide una decisión de otro

1. **Los créditos duran 7 s** (`--duracion-creditos`, token nuevo en `tokens.css`). Es lo único del
   juego que pasa de los 400 ms de `D-32` límite 1. No frena nada y con movimiento reducido queda
   quieto en el último renglón, pero va en la enmienda.
2. **El texto del final es nuevo** (`FINAL` en `copy.ts`): "Abriste todas las puertas" y "Hecho por
   ricoteros, para ricoteros." Pasa `voz.test.ts`; lo tiene que mirar `contenido`.
3. **La bajada del casete ya no se ve en ninguna pantalla de este juego** (sigue en la descripción
   de la página). En la compu se veía; es de `experiencia`.
4. **`UX-37 §3.3`** describía el menú de costado como una hoja sobre el tubo y las columnas. Ahora
   es el tablero partido. Hay que enmendarla.

### 4. Cómo se verificó

- `npm test`: 2507. `npm run check`: 0 errores. `npm run build`: verde.
- Diez tamaños, con y sin movimiento reducido, en portada, partida y pausa: 430 × 860, 375 × 667,
  390 × 844, 360 × 740, 812 × 375, 568 × 320, 1024 × 768, 1280 × 800, 1366 × 768 y 1440 × 900.
  Ninguno desplaza el menú, y el pie de homenaje queda adentro de la ventana en los diez.
- El recorrido completo a 430, 1280 y 1024 × 768, con y sin movimiento reducido.
- El final se capturó **cambiándole el orden a la fila en el HTML que recibe el navegador** (el
  nivel 1 último): el 12 no se puede pasar con un guion sin su traza. El sitio no se tocó.
- CPU ×4 a 430 contra control: portada 17,5 y 17,5 ms contra 17,7 y 17,5; partida saltando 17,7 y
  17,7 contra 17,8 y 17,6. Ningún cuadro de más de 25 ms.

### 5. Lo flojo

- **El final no se vio en el nivel 12 de verdad**, donde las dos puertas están arriba a la
  derecha y la capa va a la izquierda. Ese lado lo prueba el test, no una captura.
- **Los ruidos siguen sin oírse**: nadie lo jugó con sonido.
- En el tablero partido los cartuchos no llevan nombre, y en la compu hay lugar de sobra abajo de
  los paneles. El nombre de cada nivel solo se lee en el elegido.
- A ×1 de costado no hay vidriera ni marquesina, y los cartuchos son números.
- La tableta parada (768 × 1024) no tiene marquesina: no entra en ninguna de las dos reglas.
- La placa se ve poco en su ráfaga; la reja que suelta virutas, sí.
- Los foquitos de la marquesina no se hicieron.
- No se probó en Safari ni en un teléfono de verdad.

### 6. Top 5 para lo que siga

1. Jugarlo en un teléfono con sonido, de punta a punta, y pasar el 12 de verdad.
2. El nombre de los niveles en el tablero partido de la compu: hay lugar para una columna más ancha.
3. La tarjeta compartible del final (`BR-27`), que es lo que le falta al cierre.
4. La marquesina en la tableta parada y a ×1 de costado.
5. Los foquitos, y un cuarto ruido para el final.

### 7. Lo aprendido de un juego de motor (para "Ponelos en fila" y "Más o menos")

1. **Leé los auditores antes de tocar la isla.** Acá `motor.test.ts` y `escena.test.ts` leen el
   fuente con expresiones regulares: no se puede pintar tinta plana en el canvas ni cambiarle la
   firma a una llamada. La salida fue acomodarse, no tocar el test.
2. **Lo que se siente va en capas de HTML encima del área**, no adentro del motor: partículas,
   telón, golpe, final. Miden en `cqw` de la capa y sirven a cualquier escala.
3. **La lógica de la sensación va en un módulo puro**, que mira el mundo antes y después y devuelve
   hechos. Se prueba en Node y la isla solo dibuja.
4. **Las curvas no se escriben en la hoja**: ni `steps()` ni tiempos sueltos. Los saltos duros van
   en tramos sostenidos de los cuadros clave, con `linear` y un token.
5. **Una tira de seis fotos no alcanza para lo que dura seis cuadros.** `rafaga()` usa la
   filmación del navegador (un cuadro cada 17 ms) y ahí se decidió el peso y el golpe.
6. **Una consulta de contenedor no viste al contenedor.** El filete del menú tuvo que bajar a su
   hoja para poder partirlo en dos paneles.
7. **Medí el menú en diez tamaños con un script, no en dos capturas.** El desplazamiento a 375 × 667
   y a ×1 de costado no se veía a 430 ni a 1280.
8. **Para capturar un estado difícil de alcanzar, cambiá los datos que recibe el navegador**, no
   el sitio: el final se fotografió reordenando la fila en el HTML interceptado.
