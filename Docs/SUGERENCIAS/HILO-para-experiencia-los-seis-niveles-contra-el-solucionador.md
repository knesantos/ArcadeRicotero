# Del hilo principal para `experiencia` — los seis niveles, contra el solucionador

> Escrito el 2026-09-24 (ciclo 16, ráfaga 3), al cerrar `T-277`, y **rehecho el mismo día** después
> de la verificación. La primera versión afirmaba tres cosas que no eran ciertas: un callejón sin
> salida en `NIV-06` que no existía, que "cada atajo se cerró" cuando quedaban cuatro abiertos, y
> una justificación del ladrillo de `NIV-03` que la traza no usaba. Las cuatro grillas con
> mecanismos cambiaron por eso. Lo que sigue es lo que quedó cargado, medido.
>
> **Consume:** `UX-31` entero, `CNT-21 §1`, `CTR-16.5` regla 3, `CTR-16.10.2`–`CTR-16.10.5`,
> `CTR-18`, `BR-23.1`, `BR-25`, `BR-29.3`.
>
> **Qué te pide:** que `UX-31 §3` refleje las grillas que quedaron cargadas en
> `src/data/skayboy.json`. Los bocetos eran provisorios y lo decían. Acá está qué cambió en cada
> uno, por qué, y qué intención se conservó. **Ninguna intención resultó imposible**: todos los
> cambios son de grilla, y ningún tipo de pieza es nuevo. La tabla de paridad de `§4` queda
> **igual, 3 a 3**, contada sobre las trazas grabadas.

## 0. Cuatro cosas que valen para los seis, y conviene tener antes de dibujar el próximo

1. **Una compuerta de una sola celda no la pasa nadie, abierta o cerrada.** El cuerpo mide 20 px
   nativos de alto y la celda 16 (`mundo.ts`, nota de `CUERPO_ALTO`): parado en el piso ocupa la
   fila 7 y 4 px de la 6. Los cuatro bocetos con compuerta la dibujaban en la fila 7 con pared de
   la 1 a la 6, y la pared de la fila 6 frenaba al cuerpo. **Cargadas: tramo de dos celdas (filas
   6–7), pared de la 1 a la 5.** La excepción es la de Skayboy en `NIV-06` (abajo).
2. **El que ayuda tiene que ser el único que puede.** Si el que recibe la ayuda anda suelto por la
   sala, llega a la palanca o a la caja él mismo y el nivel deja de pedir al otro. La verificación
   lo mostró en `NIV-03` y `NIV-04`. La salida es la misma en los cuatro niveles con mecanismos:
   **el que recibe la ayuda empieza encerrado detrás de su compuerta**, y lo que la abre queda del
   otro lado. Encerrado no es castigo: está en su entrada, sobre piso llano, sin molinete, y solo
   no puede salir.
3. **Si un cuerpo puede pararse en la placa, la caja sobra.** En `NIV-05` y `NIV-06` la puerta
   del que pasa queda pegada a su compuerta, así que alcanza con que el otro se pare en la placa
   un segundo. La salida es **un techo bajo sobre la placa**: la celda de arriba es sólida, así que
   ahí entra la caja (16 px) y no entra un cuerpo (20 px). `NIV-04` no lo necesita (punto 1 de su
   sección).
4. **Alguien tiene que llegar primero a su puerta y frenar ahí.** Si esa puerta queda en el medio
   del piso, la traza aguanta 5 cuadros: medido en `NIV-03` sin el ladrillo, y Media pide 6. Con la
   puerta contra algo que frene (una pared, un ladrillo), aguanta 13 o más. El segundo que llega
   no necesita frenar: el nivel se gana al tocar.

**Cómo se midió lo de "atajo cerrado".** Para cada nivel se armó la variante que lo esquivaría, y
se corrió `resolverSolo` con cambios de columna libres y sin robustecer: la búsqueda completa. Las
que siguen dieron **sin solución**:

| Nivel | Variante | Resultado |
|---|---|---|
| `NIV-03` | Skayboy sellado en un nicho alto, con su puerta | sin solución (1.873 nodos) |
| `NIV-04` | Poligirl sellada en un nicho alto, con su puerta | sin solución (469 nodos) |
| `NIV-04` | la caja cambiada por un sólido fijo | sin solución (3.022 nodos) |
| `NIV-05` | la caja cambiada por un sólido fijo | sin solución (110.281 nodos) |
| `NIV-05` | sin caja | sin solución (75.745 nodos) |
| `NIV-06` | la caja cambiada por un sólido fijo | sin solución (118.393 nodos) |
| `NIV-06` | sin caja | sin solución (80.425 nodos) |

En `NIV-05` y `NIV-06` la ayuda cruzada no hace falta probarla aparte: los dos empiezan encerrados.

**Lo que queda abierto a propósito, y conviene que lo sepas:** `NIV-04` **sin caja** se gana
(Poligirl se para en la placa y Skayboy sale). Con la caja en la sala no hay otra manera: la caja
tapa el paso y el techo sobre la entrada de Poligirl no deja saltarla, así que para llegar a la
placa o a `B` hay que empujarla, y queda arriba de la placa. Se dejó así porque `NIV-04` es el
nivel que presenta la placa, y `CTR-16.10.3` dice que la abre "cuerpo o caja". Si querés que ahí
tampoco entre un cuerpo, es el mismo techo bajo de `NIV-05`, y `B` tiene que moverse.

## 1. Nivel por nivel

### `NIV-02` — sin cambios

Es el boceto tal cual. Las dos puertas contra la pared: 30 cuadros de tolerancia.

### `NIV-03` — Poligirl empieza detrás de su compuerta

```
###############
#..........#..#
#..........#..#
#..........#..#
#..........#..#
#..........#..#
#..........|..#
#1./.A.IC#B|.2#
###############
```

- La compuerta, filas 6–7 (punto 0.1).
- **La entrada de Poligirl y su puerta cambian de lado:** la entrada queda en `[13, 7]`, detrás de
  la compuerta, y `B` afuera, en `[10, 7]`. En el boceto Poligirl empezaba afuera, y con la
  planta baja libre saltaba `C`, `I` y lo que hubiera, cruzaba la palanca ella misma y se abría
  sola. Así el favor de Skayboy no era obligatorio. Ahora sí lo es: la palanca queda del otro lado
  de la compuerta que la encierra.
- **Un ladrillo en `[9, 7]`, pegado a `B`.** Poligirl llega caminando hacia la izquierda y frena
  contra él, sobre su puerta. Sin el ladrillo la traza aguanta 5 y Media pide 6. Con él, 13.
  (El ladrillo de la versión anterior estaba en `[6, 7]`, al lado de `A`. Su justificación era
  falsa: la traza no frenaba en `A`. En esta grilla tampoco sirve ahí, medido: 5.)
- **`I` y `C` siguen de paisaje**, entre las dos puertas, fuera del camino de los dos.
- **Qué se ve desde la entrada:** Poligirl ve su puerta del otro lado de la compuerta cerrada. Es
  lo mismo que pedía tu texto, dicho desde el otro lado. Distancias: Skayboy 4 tiles, Poligirl 3.
- **La traza grabada:** Skayboy cruza la palanca hacia la derecha (abre la compuerta en el cuadro
  22) y frena a un paso de `A`. Poligirl sale y frena en `B`, contra el ladrillo. Skayboy da el
  último paso. Nadie vuelve a cruzar la palanca. Tolerancia 13, paridad 1 a 0.

### `NIV-04` — Skayboy empieza detrás de su compuerta; techo bajo sobre la entrada de Poligirl

```
###############
#.#...........#
#.#...........#
#.#...........#
#.#...........#
#.#.......#...#
#.|...........#
#1|A..X...2n=B#
###############
```

- La compuerta de Skayboy, filas 6–7.
- **La entrada de Skayboy y su puerta cambian de lado:** la entrada queda en `[1, 7]`, detrás de
  la compuerta, y `A` afuera, en `[3, 7]`. En la versión anterior Skayboy empezaba afuera: saltaba
  la `X`, empujaba él mismo la caja a la placa, volvía y pasaba. Ahora no puede hacer nada hasta que
  Poligirl le abra.
- **`B` contra la pared y pegada a la placa.** La caja no puede pasarse de la placa: una caja no
  entra en una puerta (`CTR-16.10.5`).
- **Un techo bajo en `[10, 5]`, arriba de la entrada de Poligirl.** Sin él, Poligirl saltaba la
  caja sin empujarla y se paraba ella en la placa. Con el techo no puede saltar desde su entrada:
  la única manera de pasar es empujar. Después salta la caja ya trabada y cae contra la pared, en
  `B`. Es tu camino, textual.
- **La traza grabada:** Poligirl empuja la caja a la placa (la compuerta se abre en el cuadro 18),
  salta la caja y frena en `B`. Skayboy sale y toca `A`. Tolerancia 27, paridad 0 a 1.

### `NIV-05` — techo bajo sobre la placa; la puerta de Poligirl del lado del medio

```
###############
#..#........#.#
#..#........#.#
#..#........#.#
#..#........#.#
#..#........#.#
#..|.#......|.#
#1/|A=n....B|2#
########XX#####
```

- Las dos compuertas, filas 6–7. **Los dos empiezan encerrados**: Skayboy con su palanca adentro,
  Poligirl sola detrás de la suya.
- **Techo bajo en `[5, 6]`, arriba de la placa** (punto 0.3). Antes, Poligirl podía saltar, pararse
  en la placa mientras Skayboy pasaba a `A`, y volver: la caja sobraba. Ahora la caja entra debajo
  del techo y un cuerpo no.
- **No se salta desde adentro de una compuerta.** Encima tiene pared, y el que salta ahí sube 12 px
  y se golpea. El boceto ponía el hueco pegado a la compuerta de Poligirl. Ahora hay dos celdas de
  piso entre las dos cosas, y una es `B`.
- **`B` pasa del lado de afuera de su compuerta** (en el boceto estaba del lado de adentro). No
  entraba de otra manera en quince columnas. Poligirl sale una sola vez por su compuerta, abierta
  por la palanca de Skayboy. Salta, empuja la caja bajo el techo y vuelve saltando hasta `B`.
- **La traza grabada:** Skayboy cruza su palanca hacia la derecha (abre la de Poligirl en el cuadro
  11) y espera contra su compuerta cerrada. Poligirl sale, salta el hueco, empuja la caja a la
  placa, vuelve saltando y espera cerca de `B`. La compuerta de Skayboy se abre en el cuadro 105.
  Skayboy sale hasta `A` y Poligirl da el último paso a `B`. Tolerancia 5 (Difícil pide 4): es el
  salto de ida. Paridad 1 a 1.

### `NIV-06` — la compuerta de Skayboy es alta, y la placa tiene techo

```
###############
#..#.......#..#
#..#.......#..#
#..#.......#..#
#..|.......#..#
#..|.......#..#
#..|.....#.|..#
#A1|....n=B|2/#
####XXX########
```

1. **En una sola fila no entraban** hueco de tres, piso para despegar, piso para caer, caja,
   placa, dos compuertas, una palanca, dos entradas y dos puertas. Faltaba una columna en todas
   las combinaciones probadas.
2. **La compuerta de Skayboy (`COM-01`) es un tramo de cuatro celdas**, filas 4–7, con pared de la 1
   a la 3. Así tiene aire de sobra para saltar desde adentro (el salto sube 40,5 px y el techo está
   a 44), y el piso de la compuerta es donde despega. Eso liberó la columna. Skayboy empieza
   **detrás** de su compuerta, con `A`, y no puede hacer nada hasta que Poligirl cruce su palanca.
   Es tu orden: Poligirl primero.
3. **Techo bajo en `[9, 6]`, arriba de la placa**, igual que `NIV-05`. Y **se sacó el coleccionable**
   que la versión anterior tenía en `[7, 7]`. Su justificación era falsa: decía que sin él había
   un callejón de `BR-25` (g), y la verificación ganó ese mismo estado en 34 cuadros. Lo que sí
   hacía era impedir que la caja cayera al pozo y achicara el hueco de tres a dos. Con el techo eso
   ya no puede pasar (punto 2 de abajo).
4. **La traza grabada:** Poligirl cruza su palanca hacia la derecha (abre `COM-01` en el cuadro 11).
   Skayboy entra a su compuerta, salta el hueco de tres desde adentro, cae, empuja la caja bajo el
   techo (la compuerta de Poligirl se abre en el cuadro 98) y vuelve saltando. **Vuelve a su
   entrada, del lado de `A`, fuera de la compuerta** (en `[2, 7]`). Poligirl camina a la izquierda
   hasta `B`, y en el camino vuelve a cruzar su palanca: **`COM-01` se cierra** en el cuadro 149. No
   molesta, porque Skayboy ya está del lado de su puerta. Skayboy da el último paso a `A`.
   (La versión anterior decía que Skayboy esperaba adentro de la compuerta y que la compuerta no se
   cerraba. Era falso: la repetición cuadro a cuadro muestra lo de arriba.)
5. **Esa palanca se vuelve a cruzar, y tu texto lo evitaba.** Es inevitable: la palanca está contra
   la pared derecha y `B` a la izquierda. No rompe la regla enmendada de `UX-31 §2`, porque Skayboy
   ya usó la compuerta que abría. Y si Poligirl la cruzara antes, con Skayboy afuera, no es
   callejón: la caja queda en la placa para siempre, la compuerta de Poligirl sigue abierta, y ella
   vuelve a la palanca.
6. **Tolerancia 4, justo el piso de Difícil, y no es por la traza sino por el hueco.** Para cruzar
   tres tiles hay que despegar con parte del cuerpo todavía sobre el último piso, y el salto llega
   al otro lado con unos 15 px de sobra. La traza grabada aguanta 5 antes y 4 después. Es el límite
   que tu texto pedía tocar "a propósito". Si el teléfono dice que es mucho, lo que se mueve es el
   hueco (de tres a dos) o `IMPULSO_SALTO`, no la traza.

## 2. Lo que la máquina no mira, y miré a mano: callejones sin salida (`BR-25` g)

No hay prueba automática todavía (`BR-25` la pide a una búsqueda que no existe). Lo revisé
razonando estado por estado, y lo de las cajas lo comprobé con una sonda (una caja puesta a mano,
un cuerpo que camina contra ella 120 cuadros):

- **`NIV-05` y `NIV-06`: la caja tiene un solo movimiento posible**, que es entrar bajo el techo de
  la placa. Para empujarla hacia el pozo hay que pararse en la celda de la placa, y ahí no entra un
  cuerpo. Una vez adentro, ya no sale: desde el otro lado el cuerpo frena contra el techo antes de
  tocarla (sonda: la caja queda en `[9, 7]` en `NIV-06` y en `[5, 7]` en `NIV-05`). Así que la
  placa, una vez pisada, queda pisada, y la caja nunca llega al pozo.
- **`NIV-04`**: la caja va de `[11, 7]` a la placa y puede volver una celda si Poligirl la empuja
  desde `B`. No pasa de ahí: a la izquierda está la entrada de Poligirl. Desde cualquiera de esos
  dos lugares se la vuelve a poner.
- **Las palancas**: en `NIV-03`, `NIV-05` y `NIV-06`, si alguien la deja en reposo con el otro
  encerrado, el que la cruzó puede volver a cruzarla, o el otro llega a ella por una compuerta que
  ya quedó abierta.

**No encontré ningún callejón en los seis.** Cuando exista la búsqueda de (g), no hay un caso rojo
que dejarle de este banco. La versión anterior de este archivo le dejaba `NIV-06` como caso rojo, y
era un error.

## 3. Lo que no cambia

- Los nombres de `CNT-21`, cargados tal cual en los seis, `NIV-01` incluido. Ninguno dice muerte
  ni vidas (`BR-24`), y los seis entran en el `pattern` de `CTR-16.5`.
- La columna de mando y la regla de mitades de `§1`: la entrada y la puerta de Skayboy van
  siempre en las columnas 0–6, las de Poligirl en las 8–14, en los seis niveles.
- Las tintas de `§5`: ninguna pieza nueva, ningún tipo nuevo en el escalón 3. El techo bajo es un
  sólido.
- Los seis quedan en `borrador`: `listo` pide `deDos`, que es del teléfono.

## Para verificar

```
node --experimental-strip-types scripts/resolver-niveles.mjs --todos
```

Por nivel imprime la traza grabada, su tolerancia contra `BR-29` y quién le abrió paso a quién.
Al final, los escalones 2/2/2 y la paridad del banco. Las variantes de la tabla de `§0` no tienen
comando en el repo: se arman cambiando una celda de la grilla y corriendo `resolverSolo` con
`{ cambios: 'libres', robustecer: false }`.
