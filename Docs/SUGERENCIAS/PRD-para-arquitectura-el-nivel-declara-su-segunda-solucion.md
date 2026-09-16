# De `producto` para `arquitectura` — que el nivel declare su segunda solución, y la pieza compartible

> **Consume:** `US-09`, `BR-25` (cuándo un nivel está listo), `BR-27` (qué se comparte) —
> `Docs/PRODUCTO/PRD-skayboy-y-poligirl.md`. `D-40`, `D-41`. `RES-61.2`, `RES-62`
> (`INV-60`). `src/lib/tarjeta/plan.ts`.
>
> No fijo el schema ni el motor: los dos son tuyos (`ADR-08`, `CTR-15`+). Esto es lo que
> `US-09` necesita que el contrato pueda sostener.

## 1. El pedido concreto: el nivel declara su camino de uno solo

`D-40` obliga a que cada nivel se resuelva de las dos maneras y `BR-25` (b) lo convierte en
condición del piso: **un nivel sin su segunda solución escrita al lado no cuenta**, aunque
alguien lo haya pasado.

Eso es lo único de `BR-25` que una máquina puede mirar: si el dato del nivel tiene un campo
obligatorio con el camino de uno solo, un test falla cuando alguien agrega un nivel sin él.
Es barato y ataja el defecto más caro de este juego — descubrir con seis niveles dibujados
que dos exigen dos pares de manos.

**La distinción que conviene que el contrato pueda expresar**, porque es la que separa un
nivel válido de uno prohibido por `D-40`:

> **Simultaneidad de presencia: permitida.** Los dos parados en su puerta al mismo tiempo
> (`RES-61.2`) lo cumple el que juega solo sin hacer nada: el primero espera quieto.
>
> **Simultaneidad de entrada: prohibida.** Saltar los dos a la vez, una plataforma que solo
> aguanta si los dos la pisan en el mismo segundo. Una sola persona no puede.

Si el schema puede marcar qué mecanismos son de presencia y cuáles de entrada, la
prohibición deja de depender de que alguien se acuerde.

## 2. `BR-25` (d): quieto **y a salvo**

"El inactivo queda quieto donde lo dejaron" esconde una trampa que no vio ninguna ficha: si
queda sobre una plataforma que se mueve, sobre algo que lo mata, o en un lugar del que no
se vuelve, el nivel no es resoluble solo aunque en teoría lo sea. Si eso se puede chequear
sobre el dato del nivel en vez de jugando, mejor; si no, queda como fila de planilla.

## 3. La pieza compartible: qué le prohíbe `BR-27` al payload

Mismo movimiento que hizo `BR-22` con `US-08`, y por el mismo motivo: lo que no está en el
payload no se puede mostrar después por descuido.

- **No hay puntaje, ni rango por letra A/B/C/D, ni comparación contra otro jugador.** El
  rango del juego de origen exige un umbral de tiempo que `RES-61.8` dejó verificado como
  **sin fuente**, y un cronómetro castiga estructuralmente al que juega solo — que es el
  camino que `D-40` abrió.
- **Lo que sí viaja:** hasta qué nivel llegó sobre los seis, y de qué manera jugó (solo o de
  a dos). Nada más.
- **No viaja identidad de nadie.** `BR-27` punto 4: la tarjeta no firma. `D-15` y `D-14`
  cerraron la puerta de las cuentas y pedir un nombre para salir es igual de cerrado que
  pedirlo para entrar.
- **El pie de homenaje va impreso adentro de la imagen** (`BR-26`, `D-42`): la imagen viaja
  sola por Twitter, sin el sitio alrededor.

**Dato al costado para decidir si se reusa `src/lib/tarjeta/plan.ts` o va módulo propio:**
ese módulo tiene `MAX_FILAS = 6` fijo —los seis niveles del piso entran justo— y su campo
`hero` ya es deliberadamente agnóstico ("no `tiempo`"), así que un `hero` que sea el nivel
alcanzado no lo viola. `US-08` necesitó módulo propio por una razón parecida y no fue un
drama. Lo decidís vos con `experiencia`.

## 4. Dos cosas que `US-09` da por tuyas y no toco

- **Los efectos de sonido**, que `D-39` explícitamente no cubre: salto, puerta, moneda,
  fracaso. `BR-24` punto 5 agrega una condición de producto: el fracaso **no** puede tomar
  prestado el tratamiento sonoro que `D-33` reservó para el acierto.
- **El motor**, con el orden de `RES-62` ya servido (Kaplay, LittleJS, Phaser pineado a
  3.90.0) y las advertencias del dossier: `islas.test.ts` pierde su premisa con un paquete
  de `node_modules` del lado del cliente, y `npm run check` es `astro check && tsc
  --noEmit`.
