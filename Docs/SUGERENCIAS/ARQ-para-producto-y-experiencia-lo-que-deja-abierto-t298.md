# De `arquitectura` para `producto` y `experiencia`: lo que `T-298` deja abierto para `BR-31` y `UX-33`

> 2026-09-24, ciclo 16, ráfaga 5. `T-296` (`BR-31`), `T-297` (`UX-33`) y `T-298` corren en
> paralelo. Cuando escribí, ni `BR-31` ni `UX-33` estaban en disco. Esto es lo que dejé
> **nombrado como suyo** en los contratos, para que no se pierda y para que nadie lo lea como
> decidido. Contratos: `ADR-10` (`Docs/ARQ/ARQ-pantalla-completa.md`), `CTR-16.4` y `CTR-16.11`
> (`ARQ-schema-niveles.md`) y `CTR-15.7` (`ARQ-atlas-de-sprites.md`).

## Para `producto` (`BR-31`)

1. **¿Hay un mínimo de coleccionables por nivel?** El contrato exige solo que haya **la misma
   cantidad de guitarras que de cigarrillos en cada nivel** (`E10`). Cero y cero cumple. Si
   `BR-31` fija un mínimo, entra en la misma prueba. Y si *"la misma cantidad por nivel"* quiere
   decir *"la misma en todos los niveles"*, es otra regla, y también es de ustedes.
2. **¿Cada coleccionable tiene que probarse alcanzable?** Una guitarra adonde Skayboy no llega
   es un defecto que se ve, y hoy nada lo prueba, porque la traza gana sin juntar. Hay tres
   salidas en `CTR-16.4` (final). **Recomiendo que la traza `deUno` grabada gane juntando
   todo**, y dejo dichos sus tres costos. Si es requisito, yo enmiendo `CTR-18`. La fila `T-303`
   dice *"con las trazas regrabadas"*, y eso solo hace falta con esa salida.
3. **¿El avance guarda también los coleccionables?** Hoy no. Si lo piden, la forma ya está
   (`CTR-16.11.4`): el mejor de cada nivel, por personaje, nunca la suma. Sin el pedido, no se
   guarda (`ADR-04.5`).
4. **La fila completa** (`BR-31` punto 1, que `US-09` criterio 1 ya cita): qué se ve al ganar el
   sexto, y qué se juega al volver otro día con los seis pasados. `CTR-16.11` devuelve `null`
   ("no queda ninguno") y no decide nada más.
5. **"Hasta qué nivel llegó" se calcula y no se guarda** (`CTR-16.11.1`): son los niveles
   pasados seguidos desde el primero de la fila. Coincide con el 0 a 6 del criterio 9 mientras
   la fila no cambie, y sigue siendo verdad cuando cambia.

## Para `experiencia` (`UX-33`)

1. **El baile:** de **2 a 8 cuadros**, a **3 a 10 por segundo**, repite, y es igual para los
   dos. **Por defecto, 4 y 6**, si `UX-33` no elige otros (`CTR-15.7`). Además:
   - el pie apoyado en todos los cuadros, sin saltitos, porque la celda está anclada abajo;
   - **nada en la mano** (`UX-27 §8.2`, que `D-47` deja en pie);
   - **con movimiento reducido queda fijo el cuadro 0**, así que el cuadro 0 tiene que leerse
     solo como festejo.

   El espejo y el desfase entre los dos son de ustedes. El desfase es un número de la isla, no
   del atlas.
2. **Todo lo que se ve en el modo tiene que estar adentro del contenedor** que pasa a pantalla
   completa (`ADR-10.5`): el canvas, las seis teclas, el botón de seguir, **el pie de
   homenaje** (`BR-26`, criterio 7), el botón de salir y lo que diga la victoria. En la pantalla
   completa real, lo que queda afuera no se ve.
3. **El interruptor de la cinta vive afuera**, y es otra isla. En pantalla completa real no se
   ve: para apagar el tema hay que salir del modo. Si eso no alcanza, es una pregunta de
   `ADR-07` (el interruptor es uno solo) y me la traen. **No se resuelve moviendo nodos entre
   islas.**
4. **El área en el modo** crece a la escala entera más grande que entra (`encuadre()`,
   `ADR-10.4`): en 844 × 390 CSS queda en 640 × 384. Si quieren que el área no quede debajo de
   las teclas, se le pasa a `encuadre()` una caja más chica y la cuenta se hace sola. Si las
   teclas se superponen, **tapan un pedazo del área**, y `US-09` criterio 6 dice que no pueden
   tapar *"la parte del nivel que hay que mirar para jugar"*. El piso del nivel está abajo, que es
   donde `D-47` pone las flechas.
5. **En vertical el modo también funciona** (caso 3 de `ADR-10.4`: 320 × 192 CSS en 390 × 844),
   porque en iPhone no se puede forzar la orientación. Qué se ve ahí es de ustedes. Sin cartel
   previo (`UX-28 §4`).
6. **Los coleccionables se dibujan en dos tiles, uno por dueño** (`tesoroSkayboy` y
   `tesoroPoligirl`, `CTR-16.4`). La tinta es de ustedes, con dos condiciones: no hay tinta 17, y
   la 16 nace en el lienzo. Si usan tinta de personaje, cada objeto va con la de su dueño.
7. **`CTR-16.10.8` ya dice 15 tintas**, y la fila de la puerta pasó a ser de forma. Cierra
   `UX-para-arquitectura-ctr-16-10-8-todavia-dice-16-tintas.md`. La condición nueva: **la
   compuerta abierta no se puede parecer a la puerta abierta** que dibuja `T-290`.
