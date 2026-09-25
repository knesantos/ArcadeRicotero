# Hilo principal → `arquitectura`: `ADR-10` construido, y tres cosas que conviene escribir

**Fecha:** 2026-09-24 · **Ciclo 16, ráfaga 5, `T-301`** · Escrito por el hilo principal, que
construyó `ADR-10` y no es dueño de `Docs/ARQ/`.

## 1. `encuadre()` lleva un cuarto argumento opcional, `origen`

La firma de `ADR-10.4` es `encuadre(anchoCss, altoCss, dpr)`. La construida es
`encuadre(anchoCss, altoCss, dpr, origen = { x: 0, y: 0 })`, y con el origen en cero da la
fórmula de la decisión tal cual (lo prueba `pantalla.test.ts`). **Por qué existe:** la caja que
pide `UX-33 §1.3` descuenta el bisel de 4 px CSS de cada lado, así que no arranca en el borde
de la ventana. Redondear el centrado y sumar el origen después deja el área en medio píxel de
dispositivo a dpr 2,625 (4 × 2,625 = 10,5). El origen se suma **antes** de redondear, y la
esquina final cae entera. Hay un test que lo ve en rojo si se suma después.

La caja la arma otra función pura, `cajaDelArea(ancho, alto, { bisel, pie, mando })`, con lo
que `UX-33` reserva: el pie abajo, el bisel en los cuatro lados y, **parado**, el mando.

## 2. El caso 2 de la tabla da ×7 y no ×8 en el teléfono

`ADR-10.4` calcula sin reserva. Con la reserva de `UX-33 §1.7` (el pie, 24 px CSS) y el bisel,
844 × 390 @ 3 da `E = 7` (560 × 336 px CSS, 86 % del alto), no `E = 8`. La función pura cumple
la tabla entera (los seis casos son el test); lo que cambia es la caja que le pasa la isla.
Si se quiere el ×8, el pie tiene que ir encima de la banda de clave y no debajo del área, y
eso es de `experiencia` (traspaso aparte).

## 3. `motor.test.ts`: `MEDIDAS` creció, y el auditor nuevo

- El auditor del dibujo trata como tinta cualquier `--x` que la isla nombre. Ahora la isla
  nombra seis medidas más (`--bisel`, `--tecla-aire` y las cuatro `--encuadre-*`), y se
  sumaron a `MEDIDAS`. El caso rojo de una tinta del sitio leída para pintar sigue cayendo.
- El auditor de `ADR-10.6` busca la función que contiene el `requestFullscreen` **por
  llaves**, no la última `function` escrita antes: un `type` con `webkitRequestFullscreen`
  escrito debajo de `async function arrancar` hacía caer a la isla de verdad por `async`.
- Además de las prohibiciones de `ADR-10.6`, vigila tres presencias: que exista el pedido,
  que se escuche `fullscreenchange` y `Escape`, y que haya un `ResizeObserver`.

## 4. Lo que no se construyó, a propósito

- La segunda línea de S3 (`touchmove` no pasivo): `ADR-10.7` dice que entra si la ficha o el
  teléfono lo piden. Todavía no hay ni una cosa ni la otra.
- Un cambio de `devicePixelRatio` sin cambio de tamaño (el zoom del escritorio, pasar la
  ventana a otro monitor) no dispara el `ResizeObserver`, y el encuadre queda con el dpr
  viejo hasta el próximo cambio de tamaño. En un teléfono no pasa. Si importa, es un
  `matchMedia('(resolution: …dppx)')` más.

## 5. El modo se mudó a un módulo propio, para poder probarlo por conducta (vuelta de la revisión)

`ADR-10.6` pone `entrar()`, `salir()`, el pedido, las tres puertas y el `ResizeObserver` **en
la isla**. Ahora viven en `src/lib/skayboy/modo-pantalla.ts`, y la isla solo le pasa lo de
verdad (`montarPantallaCompleta({ documento, ventana, orientacion, Observador, fichin, boton,
soltarTodas })`). Es un desvío de la tabla, y el motivo es la prueba:

- La revisión mutó la isla de ocho maneras que el auditor de texto de `motor.test.ts` dejaba
  pasar en verde: el manejador del botón como flecha `async` con un `await` adelante, el
  pedido escrito como flecha `async`, el contenedor sacado de `document.querySelector('canvas')`
  en otra línea, el pedido sobre `.recorte`, el `lock` sin `.catch`, la puerta de
  `fullscreenchange` vaciada, un `Escape` que no sale y el `ResizeObserver` sin `observe`.
- Un auditor de texto mira cómo se escribió. Para mirar qué pasa hace falta correrlo, y la
  isla no se puede importar en Node (arranca el motor al cargarse). El módulo nuevo **no lee
  ningún global**: todo le llega en `EntornoDelModo`. `modo-pantalla.test.ts` lo juega con un
  DOM de utilería: el pedido tiene que haber salido cuando vuelve el manejador del clic, solo
  sobre `.fichin`, con cada rechazo atajado (se cuentan los `unhandledRejection`), y cada
  puerta tiene que sacar de verdad.
- Las ocho mutaciones de la revisión, más un `setTimeout` antes del pedido y el
  desplazamiento sin devolver, se corrieron sobre una copia del módulo: **las diez caen**.

Las prohibiciones de `ADR-10.6` siguen enteras. `motor.test.ts` las lee ahora sobre la isla y
el módulo **juntos**: separar el archivo no puede sacar nada de la vista. Y se sumó una regla
más dura que la del auditor viejo: **en el módulo del modo no hay ni un `async` ni un `await`**,
en ningún lado, flechas incluidas.

El módulo respeta lo que la tabla le prohíbe a `pantalla.ts` por otra vía: no importa el motor
y no lee `window`; la ventana le llega de afuera. Si `arquitectura` quiere que la tabla lo
nombre, es una fila más en `ADR-10.6`.

## 6. `MEDIDAS` de `motor.test.ts` quedó con seis nombres de más

Las medidas del encuadre (`--bisel`, `--tecla-aire`, las cuatro `--encuadre-*`) ya no las
nombra la isla sino el módulo. Siguen en `MEDIDAS` porque no hacen daño: la lista es la de lo
que la isla puede nombrar sin que sea una tinta.
