# Pulida de los juegos, juego 2: «¿Qué tipo de ricotero sos?»

> Propuesta del constructor de las rondas (2026-11-18), para que el hilo principal la convierta
> en decisión o la corrija. Juego: `US-06`. Sigue a las tres `pulida-juegos-*.md` de «Adiviná el
> tema». No toca `ESTADO.md`, `Docs/DECISIONES.md` ni la carpeta de ningún rol.

## Ronda 3: el cierre

### Lo que necesita decisión

1. **«Compartí» volvió arriba del pliegue.** El orden del resultado es: el lugar que amanece, la
   ficha, la tarjeta que asoma, «Compartí», «Empezá otra noche», el plano y la grilla. El plano
   bajó de nuevo; lo que cae a la vista es el **sello de tus dos polos en la ficha**, después
   del nombre. El recuadro de tu manera sigue cayendo en el plano cuando se lo llega a ver.
2. **El nombre del momento está escrito una sola vez.** El sello grande cae sobre el cielo, se
   queda un par de segundos y se va; lo que queda es el sello chico de la hoja, que ahora se
   estampa cuando la hoja entra. En el cielo queda la tira de papel con la línea que canta.
3. **Guiños: cinco tipos, todos en el yeso de la luna** (figura, perro, bici, trapo, ventana)
   para que no se confundan con la gente (cuero) ni con sus trapos (llama). Siguen respondiendo
   al lado tocado y no al polo. **Para `contenido`, sin hacer:** si se quiere que el guiño
   responda a *lo que dice* la opción, hacen falta 40 guiños escritos (uno por opción de las 20
   hojas listas), con los dos de cada hoja del mismo peso para que ninguno delate el eje.
4. **La vuelta tiene un solo detalle**: queda una ventana prendida en la casa del medio, que a
   los tres segundos de llegar titila una vez y se apaga. Pasa una vez; con movimiento reducido
   ya está apagada.
5. **El interruptor de ruidos de «Adiviná el tema» no tiene defecto.** En el teléfono las dos
   puertas chicas de la cabina se esconden a propósito mientras el buscador tiene el foco
   (`.partida--tecleando`). El recorrido del script ahora suelta el foco antes de tocarlo.
6. **Defecto de la ronda 2, arreglado**: la hoja que seguía a cada pase de momento quedaba
   tapada por la anterior hasta la hoja siguiente (la clase `--entra` le ganaba a la de irse y
   la animación no terminaba nunca). Lo encontró la medición de cuadros, no una captura.

### Rendimiento (CPU ×4, 430 × 860 a 2×, dos tandas con control en cada una)

| Qué | Media | p95 | Peor cuadro |
|---|---|---|---|
| Control: portada quieta | 16,7 ms | 16,8 | 16,9 |
| La previa quieta (fuego) | 16,7 | 16,8 | 16,8 |
| La caminata previa → ida | 17,0 y 16,7 | 16,8 | 33,2 y 16,8 |
| La ida quieta (postes, micro) | 16,7 | 16,8 | 16,8 |
| La caminata vereda → cuando suena | 17,0 y 16,7 | 16,8 | 33,4 y 16,8 |
| Cuando suena quieta (pogo, haces) | 16,7 | 16,8 | 16,8 |

Ningún cuadro pasó de 34 ms; lo peor fue un cuadro perdido en una caminata de cada tanda 1.
**No partí la tira.** Las cuatro pasadas pesan 109 + 255 + 21 + 7 KB en disco y unos 5,7 MB
cada una ya abiertas (4750 × 300). Ojo con lo que mide esto: el freno es de CPU, no de la
placa de video, y el navegador no tenía ventana; no reemplaza a un teléfono de verdad.

### Lo que sigue sin probar

Los ruidos (nadie los oyó), el modo incrustado en X, el teclado durante el pase, y un teléfono
de verdad.

## Ronda 2: la mano de la tapa

### Lo que necesita decisión

1. **El lugar es una serigrafía de cuatro pasadas con las tintas de *Luzbelito*.** La sombra
   en el mármol, la tinta en el mármol claro (corrida dos píxeles: el registro), el cuero para
   la gente y los trapos, y la llama para lo prendido. El cielo es el papel marmolado de la
   tapa (`libro-marmol.jpg`) bajo `--velo-tapa-titular`. El canto irregular, el rayado y la
   falta de tinta van **impresos en las máscaras** (`npm run generar-noche-dos-ejes`, webp);
   en vivo no hay filtros.
2. **Tokens**: `--noche-sombra`, `-tinta`, `-cuero`, `-llama`, `-luna` son **alias** de colores
   ya medidos sobre esa tapa para el bestiario (`--bestia-lechuza-*`, `--bestia-pontiac-yeso`),
   más dos pesos. Ningún hex nuevo. Salieron los siete `--peso-noche-*` de la ronda 1. Falta
   decidir si el juego puede tomar tintas con nombre de bestia o si se renombran, y pasarlas
   por el lienzo.
3. **La multitud de *Oktubre* salió.** La gente es dibujo propio (tres filas, brazos, trapos en
   caña; la cola de la vereda). No hace falta crédito nuevo. `noche.test.ts` falla si vuelve.
4. **El lugar responde al toque, no a lo elegido.** Con cada hoja contestada cae algo chico en
   la escena (alguien que se suma, un trapo en su caña), **a la izquierda si se tocó la opción
   de arriba y a la derecha si la de abajo**. Como el orden de las opciones se sortea, el lado
   no dice nada del polo: la isla guarda el lado y nunca el polo (`BR-17`, y lo vigila
   `noche.test.ts`). Es lo más lejos que llegué sin texto nuevo ni datos nuevos en el banco.
   Si se quiere que responda al *contenido* de la opción, hace falta que `contenido` escriba un
   guiño por opción (40) cuidando que los dos de cada hoja pesen lo mismo.
5. **El plano subió**: va pegado a la última hoja, arriba de «Compartí» (`UX-38` §3.1 lo ponía
   después de los botones y `UX-36` dejaba «Compartí» como lo primero bajo la hoja). A 430 × 860
   el plano entra entero y el sello de tu manera cae a la vista; **«Compartí» quedó bajo el
   pliegue**. Es el costo de la decisión.
6. **El lugar se muda al resultado y amanece**: queda de franja arriba de la última hoja, parado
   donde terminó la noche y con los guiños que dejaste.
7. **El pase de momento dura más**: 600 ms de pausa, y después hoja que se va (380), tira que
   camina (900), cartel que cae (300) y hoja que entra (380). Cuatro veces por noche. Mientras
   tanto no se puede elegir ni volver. Con movimiento reducido es inmediato.
8. **La línea que canta va en una tira de papel bajo el sello del momento**, en el medio del
   cielo. El sello del cielo ya no se va: es el cartel del lugar. El nombre del momento queda
   escrito dos veces (cartel y sello de la hoja); el del cartel va sin voz para el lector.
9. **«Bajá la tarjeta»** dejó el punteado y la tinta apagada: borde entero y `--texto`.

### Detalles vivos que se sumaron

| Detalle | Estado | Con movimiento reducido |
|---|---|---|
| Tres ondas en la boca del parlante, de a una | la vereda | las tres prendidas, quietas |
| Un guiño cae en la escena, del lado tocado | elegir | aparece ya puesto |
| El cartel del momento cae: primero el sello, después la tira | llegar a un momento | ya puesto |
| La hoja nueva entra desde abajo al final del pase | pase de momento | cambio directo |
| La luna baja, las estrellas se apagan y salen dos franjas de alba | resultado | ya amanecido |

### Lo que sigue sin probar

Los ruidos (nadie los oyó), el modo incrustado en X con el lugar nuevo, el teclado durante el
pase ordenado, y un teléfono de verdad: las máscaras de la tira miden 4750 × 300 y son cuatro.

## Ronda 1 (commit `c04d9c2`): lo que quedó decidido o abierto

- La marca que se corre en el plano mientras jugás **no va** (aprobado por el hilo principal:
  `BR-17`, `D-62`).
- El juego hace ruido (`tecla`, `sello`, `clac`) con el interruptor de «Adiviná el tema»; las dos
  cadenas están copiadas en `dos-ejes/copy.ts` y las tiene que confirmar `contenido`.
- «Empezá la noche» cambió de forma y no de color (sigue en el cuero, `D-19`).
- La hoja bajó del medio al pie de la pantalla en el teléfono.
- Cuatro tiempos de bucle nuevos (`--duracion-llama`, `-ruta`, `-pogo`, `-haz`) sin pasar por el
  lienzo.
- `mirar-juego.mjs` presenta las ventanas de menos de 768 px como teléfono (`--sin-dedo` lo apaga).
- El botón de la portada ya caía bajo el pliegue antes de la ronda 1 a 320 × 568, y en la postal
  a 360 × 640 y 375 × 667. Sigue así.
