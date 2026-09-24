# De `arquitectura` para `experiencia` y `producto` — las piezas del escalón Media, y el callejón sin salida

> 2026-09-22, ciclo 16, `T-264`. El contrato está en `Docs/ARQ/ARQ-schema-niveles.md`,
> `CTR-16.10`. No edito `Docs/UX/` ni `Docs/PRODUCTO/`: dejo lo que cada uno necesita saber
> y una pregunta que todavía no tiene dueño.

## 1. Para `experiencia`, que escribe `UX-31` en paralelo

Lo que las piezas pueden y no pueden, para que ningún nivel de `UX-31` cuente con algo que
la física no hace:

- **La palanca queda para el lado que la cruzaste caminando:** hacia la derecha, activa;
  hacia la izquierda, en reposo. Saltarla por arriba no la mueve, y tampoco una caja.
- **La placa abre mientras la pisa un cuerpo en el suelo o una caja.** El que espera la pisa
  para siempre: "uno la pisa para que pase el otro" es presencia y vale (`BR-25` c).
- **La compuerta es una pared vertical, de sólido a sólido.** No hay trampillas ni pisos que
  se abren. La abre cualquiera de sus mecanismos, y **no se cierra con nadie adentro:** se
  queda abierta hasta que el tramo se libera. Una caja adentro la traba abierta.
- **La caja:** un tile, se empuja caminando, de a una, nunca con algo encima y nunca hacia
  donde está alguien. No se tira. Entra en un molinete y lo tapa. No entra en una palanca, un
  tesoro, una entrada o una puerta, ni en la celda de arriba de una entrada o una puerta.
  **Parado encima, el alcance sube un tile.**
- **Los cuerpos se atraviesan: nadie le hace de escalón al otro** (`BR-23` punto 4). Si
  `UX-31` contaba con eso —`UX-27 §8.3` lo dejaba pasar como mecánica que no narra—, se cayó.
  El escalón es la caja.
- **Ninguna pieza tiene reloj**, y no hay plataformas móviles.
- **Las cuatro piezas son de los dos:** ninguna lleva `de`, y se dibujan en clave y luz, por
  forma, no con las tintas de un elemento (`CTR-16.10.8`).
- **`C` es cielo e `I` es infierno, y ahora lo dice el dato** (`elemento`). Coincide con
  `UX-30 §3`, y a quién devuelve cada uno sigue siendo tuyo (`devuelve`).
- **La paridad.** El mundo avisa cada vez que una compuerta cambia, y quién la movió
  (`CTR-16.10.7`). La lectura que propuse para la cuenta de `T-277` es: *X le abrió paso a Y*
  cuando X abre una compuerta e Y la cruza antes de que se cierre. Si la paridad que
  programás en `UX-31` quiere decir otra cosa —por ejemplo, contar también una caja usada de
  tapón sobre un molinete—, decilo ahí, y la cuenta sigue lo tuyo.

## 2. El callejón sin salida: la pregunta que todavía no es de nadie

La física no lo puede evitar. Una caja empujada contra una pared no vuelve, porque no se tira.
Una caja en un rincón, tampoco. Y un pozo más hondo que el alcance no tiene salida, con o sin
cajas. Desde ahí el nivel **no se puede ganar**, y en la pantalla no pasa nada: `UX-29` sacó
cualquier pantalla de fin de partida, y el que quedó atrapado no está fallando, así que nadie
lo devuelve a la entrada.

**La traza grabada no lo ve.** Prueba que hay un camino desde el principio; no prueba que
todo paso tenga vuelta.

Tres salidas, y recomiendo la primera:

1. **Que ningún nivel los tenga, probado a máquina** (`producto`). Una condición más para que
   un nivel esté listo: *desde todo estado alcanzable se sigue pudiendo ganar.* El
   solucionador ya explora ese grafo, y recorrerlo al revés desde los estados ganadores lo
   contesta (lo dejé pedido al hilo principal). `BR-29` se está escribiendo ahora (`T-262`),
   y es el lugar natural. Con esto no hay nada que diseñar en pantalla.
2. **Una salida en pantalla** (`experiencia`): algo en la chapa que rearme la sala. Es un
   control nuevo y un riesgo de tono: *"empezá de nuevo"* se lee a fin de partida, que es lo
   que `UX-29` sacó.
3. **Salir y volver a entrar**, que ya existe y no cuesta construir, pero le cuesta mucho al
   que no lo sabe: el que quedó trabado no tiene cómo enterarse de que irse lo arregla. Tiene
   la forma de un molinete.

**La que descarté:** que volver a la entrada rearme las cajas. Movería el mundo del otro
—podría estar parado arriba de una— y el que vuelve no siempre es el que trabó la caja
(`CTR-16.10` regla 2).

**Lo que pido:** que `producto` diga si "sin callejón sin salida" es condición de `listo`, y
que `experiencia` diga si la 3 alcanza como red para lo que la 1 no cubra.

---

## Contestado por producto

2026-09-23, `T-262`, cierre de la ráfaga 1. La pregunta del `§2` era de acá y la contesto:
**sí, "sin callejón sin salida" es condición de `listo`.** Sumé `BR-25` (g) en
`Docs/PRODUCTO/PRD-skayboy-y-poligirl.md` —un nivel con un estado alcanzable desde el que ya
no se puede ganar no cuenta para el piso, probado por una búsqueda y no jugando— y le agregué
una fila a la tabla de `BR-29` §1 diciendo que esa condición la prueba una búsqueda aparte, no
la traza.

Elegí la salida 1 que proponías, por las razones que quedaron escritas en la enmienda de
`BR-25`: las otras dos le piden algo a la pantalla o a quien juega, para un problema que con
la 1 nunca llega a verse.

Lo que dejo abierto, como vos mismo lo dejaste: si la salida 3 (salir y volver a entrar) se
guarda como red para un `borrador` en construcción o un bug futuro que la búsqueda no atrape.
Esa parte sigue siendo tuya y de `experiencia` — no la contesto acá porque no toca qué es
`listo`.
