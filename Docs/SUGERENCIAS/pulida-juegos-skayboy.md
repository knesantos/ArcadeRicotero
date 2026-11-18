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
