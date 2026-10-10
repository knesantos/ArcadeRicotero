# Hilo principal → `experiencia`, `arquitectura`, `producto` y `contenido` — lo que `D-69` dejó atrás en sus documentos

- **De:** el hilo principal, al cerrar `D-69` (2026-10-10, rama `ponelos/filas-propias`).
- **Para:** cada rol, en su carpeta. Esto no edita nada ajeno: dice qué quedó desactualizado y qué
  propongo poner.
- **Por qué está acá:** `D-69` cambió "Ponelos en fila" a pedido del usuario (repartir de a una, filas
  propias, los 105 temas, suena al tocarte la ficha). El código y los tests ya lo dicen. Cuatro documentos
  de rol siguen describiendo el juego de antes.

## `experiencia` — `UX-23`

- **§3 (el mecanismo de tocar-tocar)** y **§5.2 (el destino casi nunca está a la vista)**: el gesto
  principal ahora es el mazo pegado abajo, con la carta y un botón por fila. "Tocás una ficha, tocás una
  fila" quedó para las fichas ya puestas, que se toman para moverlas. El `scrollIntoView` de §5.2 se fue:
  ya no hace falta, porque el destino está siempre bajo el pulgar.
- **§2.1 (pantalla 0)**: "Todos los temas" va primero, con las diez tapas en tira, y arriba de todo puede
  aparecer "Te quedó a medias".
- **§3.4 (la región viva)**: la línea `.mano` vive dentro del mazo. Avisos nuevos: saltear, mezclar,
  deshacer, sumar, sacar y renombrar una fila.
- **Propuesta:** una `UX-23` v2 que dibuje el mazo y la edición de filas, y que revise a ojo las tres
  zonas táctiles nuevas: botones de fila de 48 px, acciones de la carta y filtros por disco.

## `arquitectura` — `ADR-06` y `CTR-13`

- **`ADR-06` regla 1** decía "ningún campo es texto". Desde la versión 2 del empaquetado entra uno: los
  nombres de las filas (`f=`), con lista blanca (`limpiarNombreFila`) al entrar y al salir y pintados con
  `textContent`. La versión 1 se sigue escribiendo cuando las filas son las de siempre. **Propuesta:**
  `ADR-06.6`, la versión 2, con el porqué de una versión nueva en lugar de un campo opcional (un lector de
  la 1 abriría la lista mal rotulada sin avisar).
- **`CTR-13`**: el conjunto `todos` (los 105 en el orden canónico, `formato: 'titulo'`, el pie es el disco)
  y el campo `conAudio` del catálogo, con los slugs que tienen recorte. Sale del mismo manifiesto que
  "Adiviná el tema" y se verifica con `indexarFragmentos`.

## `producto` — `PRD-ponelos-en-fila.md`

- **El tope de dieciséis fichas** por conjunto (el test "ningún conjunto es tan grande…") lo sacó el
  usuario: *"la gracia de los tierlist así es que sean muchísimas cosas las que estás poniendo en orden,
  así que más está bien"*. El techo que queda es el del link, 120.
- **El piso de `US-08`** sigue en 14 en `pisos.test.ts`, y hoy hay 15 conjuntos con `todos`. Si `producto`
  quiere subirlo, es su número.
- **`BR-22` no cambia**, y conviene que lo diga: el sonido al tocar una ficha es la banda, no un festejo.
  No suena nada al ubicar ni al terminar.

## `contenido` — el texto nuevo de `src/lib/ponelos/copy.ts`

- Entraron unas treinta cadenas (`PARTIDA.laQueSigue` … `PARTIDA.volvisteASiempre`, `ELECCION.retomar`,
  `CONJUNTOS.todos`). Todas pasan `voz.test.ts`. Pido una pasada de oído sobre las que cantan
  ("Los ciento cinco, cada uno con su disco.") y sobre los sellos de registro 3 ("LA QUE SIGUE", "LA ESTÁS
  MOVIENDO", "SIN NADA EN EL MAZO", "TE QUEDÓ A MEDIAS").
- Los nombres de fila que escribe el jugador **no pasan por `voz.test.ts` y no tienen por qué**: son suyos.
  Las cuatro de siempre (`D-52`) siguen auditadas.
