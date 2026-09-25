# ARQ — La pantalla completa de Skayboy y Poligirl: un modo de la página, que pide la del sistema donde existe y no depende de ella

> Rol dueño: `arquitectura`. **Produce: `ADR-10`** (`ADR-10.1` … `ADR-10.7`).
>
> **Consume:** **`D-47`** (entera: puntos 1 y 2, consecuencia 2), `D-41` (puntos 1 y 3),
> `D-32` límite 3, `D-14`, `ADR-08` (`ADR-08.2`, `ADR-08.2.1`, `ADR-08.3`, `ADR-08.8`,
> `ADR-08.10`, `ADR-08.11`), `ADR-09.1` (el paso fijo), `CTR-15.6`, `CTR-15.7` (enmendado hoy,
> `baila`), `CTR-16.8` y `CTR-16.11` (el avance guardado, nuevo hoy), `US-09` criterios 1, 6, 7
> y 9 (con las enmiendas de `D-47` que `producto` ya marcó en
> `Docs/PRODUCTO/PRD-skayboy-y-poligirl.md`), `BR-26`, `UX-27 §2`, `UX-28 §2` y `§4`, `UX-32 §5`,
> `ORQ-plan-ciclo-16.md §2.6` (fila `T-298`), `.claude/rules/diseno-marca.md`.
> **Escrito en paralelo con `BR-31` (`T-296`) y `UX-33` (`T-297`), que todavía no existen en
> disco:** lo que es de ellos queda nombrado como suyo, no decidido acá.
>
> **Medido sobre el repo el 2026-09-24** (lecturas de archivo, no fichas `RES-`).
> **Corregido el mismo día por la verificación de `T-298`:** cuatro citas de línea de este
> documento no coincidían con el código (el init del motor, el borrado del tamaño en línea, el
> `touch-action` de las teclas y el rótulo de carga). Los números de ahora son los del árbol
> de trabajo al corregir, con la ráfaga 4 todavía escribiendo en `partida-skayboy.ts`,
> `escena.ts` y `skayboy.css`.
> **Si un número se corre, manda el ancla** que va al lado de cada cita. Se busca como texto
> literal, no como expresión regular: `rg -nF "<ancla>" <archivo>`.
>
> - `node_modules/kaplay/package.json` dice `3001.0.19`, la versión pineada por `ADR-08.6`.
> - En `node_modules/kaplay/dist/kaplay.mjs`, **`setFullscreen()` pide la pantalla completa
>   sobre el canvas** —`function g(f=!0){f?d(e.canvas):C()}`— e `isFullscreen()` solo es
>   verdadero si el elemento en pantalla completa es ese canvas.
> - En el mismo archivo, el motor observa el tamaño del canvas con un `ResizeObserver` y dispara
>   su evento `resize`. **Su manejador no toca nada con esta configuración**:
>   `let t=a.globalOpt.width&&a.globalOpt.height;t&&!a.globalOpt.stretch&&!a.globalOpt.letterbox||(a.canvas.width=…`.
>   Con `width` y `height` fijos, y sin `stretch` ni `letterbox` —que es lo que pasa el init
>   de `partida-skayboy.ts:366-392`, ancla `kaplay({`—, la condición corta antes de
>   redimensionar el buffer.
> - El init del motor escribe en línea el tamaño del canvas y, con `crisp: true`,
>   `image-rendering: pixelated`. La isla borra el tamaño en línea
>   (`partida-skayboy.ts:398-399`, ancla `removeProperty('width')`) para que mande la
>   hoja. El `image-rendering` queda puesto.
> - Llamar a `kaplay()` por segunda vez avisa por consola *"KAPLAY already initialized…"* y
>   hace `quit()` del anterior.
> - Las seis teclas, el canvas, el botón de seguir (`UX-32 §5`), el aviso para el lector de
>   pantalla y el pie de homenaje viven los cinco adentro de `.fichin`
>   (`src/pages/juegos/skayboy-y-poligirl.astro:120-206`, ancla `<div class="fichin">`). Las
>   seis teclas están adentro de `.mando` y ya tienen `touch-action: none` por la regla
>   `.juego-skayboy .mando .tecla` (`skayboy.css:376-378`). Esa regla pisa el
>   `touch-action: manipulation` de la regla base `.juego-skayboy .tecla` (`skayboy.css:348`).
>   El `<meta name="viewport">` no trae `viewport-fit=cover`
>   (`skayboy-y-poligirl.astro:81`, ancla `name="viewport"`).
>
> **Qué NO es:** no es el diseño de la pantalla completa. Dónde van las teclas, cuánta
> transparencia llevan, dónde queda el pie de homenaje, qué dice el botón y qué pasa en vertical
> es de `experiencia` (`UX-33`) y de `contenido` (`CNT-22`). Esto es lo de abajo de esa línea:
> qué hace la página, qué le pide al sistema, qué le pasa al motor y qué se prueba.
>
> **Regla de escritura de `FIND-55`, vigente acá:** toda medida de píxel dice si es _nativa_,
> _CSS_ o _de dispositivo_.

---

## ADR-10 — La pantalla completa es un modo de la página. La del sistema se pide donde existe, y el juego no depende de ella

- **Fecha:** 2026-09-24 (ciclo 16, ráfaga 5, `T-298`).
- **Estado:** **aceptada para construir** (`T-301`, `T-302`). **Un punto queda como supuesto
  con ficha pedida** (`ADR-10.7`): que las reglas de CSS de `ADR-10.1` alcancen para cortar
  todo gesto del navegador en Safari de iPhone. Si la ficha o el teléfono dicen que no, entra
  la segunda línea que ya está escrita en `ADR-10.7`. La decisión no cambia.
- **Para quién es:** para el hilo principal, que lo construye. Para `experiencia`, que diseña
  encima (`UX-33`). Para `revisor`, que tiene que poder rechazar el modo citando una línea.

### La decisión, en una línea

> **"Pantalla completa" es un estado de la página**: un atributo en `<html>` que la hoja lee
> para fijar el fichín a la ventana, cortar todo gesto del navegador y agrandar el área a la
> escala entera más grande que entra. **Además**, en el mismo toque, se le pide al sistema su
> pantalla completa **sobre el contenedor del fichín, nunca sobre el canvas**, y la orientación
> horizontal, **solo donde las dos cosas existen**. El motor no se entera de nada.

La razón de fondo es `D-47` consecuencia 2. El pedido del usuario no fue la API: fue que *"el
scroll no rompa los controles"*. `US-09` criterio 6, enmendado por `producto`, lo dice igual:
*"lo que importa es el resultado —que el scroll no rompa los controles—, no el mecanismo del
sistema con el que se logra"*. Un diseño que dependa de la API deja el defecto vivo en el
teléfono donde `D-47` dice que la API no existe. Por eso la API es un agregado y no el
cimiento.

---

### ADR-10.1 — El modo: qué cambia en la página

**Un solo interruptor, y un solo lugar que lo lee.** Entrar al modo es poner
**`data-pantalla="completa"`** en `document.documentElement`. Salir es sacarlo. Lo pone y lo
saca **solo la isla** (`partida-skayboy.ts`), con dos funciones, `entrar()` y `salir()`. Toda
regla visual del modo vive en `src/styles/skayboy.css`, **debajo de ese atributo**. Esa hoja ya
la escanean los dos auditores de estética (`ADR-08.8`).

Qué hace la hoja en el modo. Son reglas de comportamiento, no de estética. La estética es de
`UX-33`:

| Dónde | Qué | Para qué |
|---|---|---|
| `html`, `body` | `overflow: hidden` · `overscroll-behavior: none` | Que la página no se desplace ni rebote, y que el gesto de tirar hacia abajo no la recargue en medio de un nivel |
| El contenedor (`.fichin`, o el que `UX-33` nombre) | `position: fixed` · `inset: 0` · `touch-action: none` · `user-select: none` · `-webkit-user-select: none` · `-webkit-touch-callout: none` | Ocupa la ventana entera. **Ningún gesto que arranque adentro es del navegador**: ni desplazar, ni hacer zoom con dos dedos, ni el doble toque, ni la lupa del toque largo |
| El canvas | `width`, `height`, `left` y `top` desde cuatro propiedades CSS que escribe la isla con `encuadre()` (`ADR-10.4`) | El área crece a la escala entera más grande que entra |
| Las teclas | Las **mismas seis** del mueble, recolocadas por la hoja. No hay un segundo juego de botones | Una sola lógica de punteros (`ADR-08.10`). Las teclas ya tienen su captura y su `touch-action: none` |

**Tres cosas que el modo hace además de la hoja:**

1. **Se sueltan todas las teclas al entrar y al salir** (`soltarTodas()`, que ya existe). Una
   tecla que se muda de lugar con un dedo encima no puede quedar apretada: sería un personaje
   que camina solo, y `UX-28 §3` pide que el que espera esté quieto.
2. **El encuadre se recalcula cada vez que el contenedor cambia de tamaño**: al girar el
   teléfono, cuando aparece o se va la barra del navegador, al entrar o salir de la pantalla
   completa del sistema. Se usa un `ResizeObserver` sobre el contenedor, **no** el evento
   `resize` de la ventana. Mide la caja que importa. Y existe en todo navegador donde el
   juego arranca, porque el propio motor lo usa en su init (lectura de arriba).
3. **El mundo no se entera.** Entrar o salir no reinicia el nivel, no pausa nada y no toca el
   reloj. Adentro de un tic, lo que el cambio de modo pueda trabar lo absorbe el tope de tres
   cuadros de `jugarTic()` (`ADR-09.1`).

**El botón para entrar** vive en el mueble, en el HTML estático y **escondido**. La isla lo
muestra en el mismo momento en que esconde el rótulo de carga (`partida-skayboy.ts:447`, ancla
`rotulo-carga`), es
decir, cuando el motor ya dibuja. Sin nivel sembrado —producción hoy— no hay modo, porque no
hay nada que jugar. El texto es de `CNT-22` y el lugar es de `UX-33`.

**El mueble no cambia.** `D-47` punto 1: *"el mueble impreso de `D-41` sigue siendo la pantalla
de entrada; la pantalla completa es la manera de jugar"*. Afuera del modo, la página se
desplaza como siempre. Bloquear el desplazamiento también en el mueble dejaría sin alcance el
pie de imprenta y todo lo que está abajo.

---

### ADR-10.2 — Cómo se pide la pantalla completa del sistema, y qué pasa donde no existe

**En el manejador del toque del botón, y en este orden:**

1. **`entrar()`**: el atributo y `soltarTodas()`. Es lo único que no depende del sistema, y por
   eso va primero. Si todo lo que sigue falla, el modo ya está.
2. **Si el contenedor tiene `requestFullscreen`** (o `webkitRequestFullscreen`), se llama
   **sobre el contenedor** y en el mismo manejador, **sin ningún `await` antes**. Un rechazo
   (promesa rechazada o excepción) **se traga**, y el modo sigue igual.
3. **Si el sistema la dio** (`document.fullscreenElement === contenedor`) **y existe
   `screen.orientation.lock`**, se pide `lock('landscape')` y su rechazo se traga.

Un boceto orientativo. No es para pegar: el contrato es el orden y las condiciones.

```ts
type ConPrefijo = HTMLElement & { webkitRequestFullscreen?: () => void };

function pedirPantallaCompleta(contenedor: ConPrefijo): void {
  entrar(); // 1. el modo, siempre
  const pedir = contenedor.requestFullscreen ?? contenedor.webkitRequestFullscreen;
  if (typeof pedir !== 'function') return; // sin API: queda el modo, y alcanza
  try {
    Promise.resolve(pedir.call(contenedor))
      .then(() => {
        if (document.fullscreenElement === contenedor) {
          screen.orientation?.lock?.('landscape').catch(() => {}); // 3. donde exista
        }
      })
      .catch(() => {}); // 2. rechazada: sigue el modo
  } catch {
    /* sin permiso: sigue el modo */
  }
}
```

**Donde no existe la del sistema** —`D-47` consecuencia 2 dice que es el caso de iPhone; sin
ficha todavía, ver `ADR-10.7`—, **el modo es todo lo que hay, y es suficiente para lo que se
pidió.** El contenedor ocupa la ventana, la página no se mueve y las teclas quedan donde el
dedo las dejó. La barra del navegador puede seguir a la vista: el encuadre usa el lugar que
quede (`ADR-10.4`) y no se pelea con ella.

**La orientación no se fuerza nunca con un cartel** (`UX-28 §4`, `D-32` límite 3). Donde no hay
`lock`, el modo funciona también en vertical, con el área más chica (`ADR-10.4`, caso 3). Qué
se ve en vertical es de `UX-33`.

**Por qué el contenedor y no el canvas:** la pantalla completa del sistema muestra el
elemento que la pidió **y lo que tiene adentro**. Un canvas no tiene hijos que se vean. Si la
pide el canvas, desaparecen las teclas, el botón de salir y el pie de homenaje: un juego que
se ve y no se puede tocar. Es justo lo que haría `k.setFullscreen()` del motor (lectura de
arriba), y por eso queda prohibido (`ADR-10.6`).

---

### ADR-10.3 — Cómo se sale

Tres puertas, y las tres llegan a la misma función, `salir()`:

| Puerta | Dónde | Detalle |
|---|---|---|
| **El botón de salir** | Adentro del contenedor, siempre a la vista en el modo, con `--toque-min` | Es la única que existe en todos los teléfonos. Texto de `CNT-22` y lugar de `UX-33` |
| **`Escape`** | Teclado | En el modo sin API la escucha la isla. Con la API, el navegador la consume y avisa por `fullscreenchange` (fila de abajo) |
| **El sistema la terminó** | `fullscreenchange` / `webkitfullscreenchange` | El gesto de volver de Android, cambiar de aplicación, `Escape` con la API. **Si el contenedor deja de estar en pantalla completa y el modo había entrado por ella, se sale del modo.** Mientras hay API, el modo sigue a `document.fullscreenElement`, y no hay dos verdades sobre si la pantalla es completa |

**`salir()`**: si el documento está en pantalla completa, llama a `exitFullscreen()` (con el
mismo cuidado de tragarse el rechazo). Suelta la orientación si existe
`screen.orientation.unlock`. Saca el atributo y llama a `soltarTodas()`. **El nivel sigue
donde estaba.** Volver a entrar es un toque.

**Lo que no se hace:** empujar una entrada al historial para que el gesto de volver saque del
modo en vez de irse de la página. Manipular el historial por un modo de pantalla sorprende en
todos los demás casos, y nadie lo pidió.

---

### ADR-10.4 — El motor no se entera: el encuadre, con escala entera en píxeles de dispositivo

**La pregunta real no es "¿escala entera?" sino "¿entera en qué unidad?".** `ADR-08.3` ya lo
había escrito: hay tres unidades, y la que hace que el píxel sea nítido es **`E`, cuántos
píxeles de dispositivo ocupa un píxel nativo**. En el mueble, `E` sale de una `escalaCSS`
entera que reparte `UX-28 §2`. En el modo no hay reparto que proteger, así que se elige `E`
directamente:

```ts
/** ADR-10.4. Todo en px CSS, salvo `escala`, que es E: px de dispositivo por px nativo. */
export interface Encuadre {
  readonly escala: number;    // E, entero, ≥ 1
  readonly ancho: number;     // 240 · E / dpr
  readonly alto: number;      // 144 · E / dpr
  readonly izquierda: number; // redondeado a un px de dispositivo entero, expresado en CSS
  readonly arriba: number;    // ídem
}
export function encuadre(anchoCss: number, altoCss: number, dpr: number): Encuadre;
```

- **`E = max(1, ⌊min(anchoCss·dpr / 240, altoCss·dpr / 144) + 1e-9⌋)`**. El `1e-9` evita que
  un cociente exacto pierda un entero por la coma flotante.
- **`izquierda = round((anchoCss·dpr − 240·E) / 2) / dpr`**, y `arriba` igual con 144. El área
  queda centrada y **arranca en un píxel de dispositivo entero**.
- `anchoCss` y `altoCss` son la caja que la isla le pase: el contenedor entero, o menos lo
  que `UX-33` reserve si decide que el área no va debajo de las teclas. La función no sabe de
  teclas.
- **Pura**: sin DOM y sin motor. Vive en `src/lib/skayboy/pantalla.ts` y se prueba en Node.

**Los casos, calculados, que son también los del test:**

| # | Ventana (px CSS) @ dpr | `E` | Área (px CSS) | Izquierda · arriba (px CSS) | A `escalaCSS` ×2 entera sería |
|---|---|---|---|---|---|
| 1 | 812 × 375 @ 3 | **7** | 560 × 336 | 126 · 19,67 | 480 × 288 |
| 2 | 844 × 390 @ 3 | **8** | 640 × 384 | 102 · 3 | 480 × 288 |
| 3 | 390 × 844 @ 3 (vertical) | **4** | 320 × 192 | 35 · 326 | — |
| 4 | 915 × 412 @ 2,625 | **7** | 640 × 384 | 137,52 · 14,10 | — (dpr fraccionario) |
| 5 | 1280 × 720 @ 1 (escritorio) | **5** | 1200 × 720 | 40 · 0 | — |
| 6 | 200 × 100 @ 1 | **1** (piso) | 240 × 144 | −20 · −22 | — |

El caso 2 es el que decide: con `escalaCSS` entera el área ocupa el 74 % del alto, y con `E`
entera, el 98 %. **Una "pantalla completa" que deja un cuarto del alto sin usar no es lo que
pidió `D-47`**, y el píxel sale igual de nítido. El caso 6 es el piso declarado: con `E = 1` el
área puede no entrar. Ningún teléfono llega ahí.

**Por qué el motor no se toca, y por qué eso da nítido.** El buffer del canvas queda como lo
armó el init para el mueble: `240·E₀ × 144·E₀`, con `E₀` de `ADR-08.3`. En el modo cambia
**solo la caja CSS**. El navegador lleva el buffer a la caja con `image-rendering: pixelated`
(vecino más cercano), que el motor ya escribe (`crisp: true`, lectura de arriba) y que `D-41`
punto 1 ya manda. **Con `E₀` y `E` enteros, el vecino más cercano le da a cada píxel nativo
exactamente `E` píxeles de dispositivo, se agrande o se achique.** El píxel de dispositivo `j`
toma el color del nativo `⌊(j + ½)/E⌋`, que es `⌊j/E⌋` para `j` entero: no depende de `E₀`.
Para eso hacen falta dos condiciones, y las dos ya se cumplen o las cumple `encuadre()`:

1. **Cada píxel nativo se dibuja como un bloque liso de `E₀ × E₀`**: posiciones enteras en la
   escena (`escena.ts`, *"Todo en píxeles nativos y enteros"*) y `texFilter: 'nearest'`.
2. **La caja arranca en un píxel de dispositivo entero**: `izquierda` y `arriba` redondeados.

Con dpr fraccionario (caso 4) queda el resto de medio píxel que `ADR-08.3` ya aceptó como "el
caso feo". Es estático porque la sala no se desplaza.

**Y el motor, con esta configuración, no hace nada cuando la caja cambia** (lectura de arriba):
su `ResizeObserver` dispara el evento, y el manejador corta sin tocar el buffer. Por eso son
**condición** de esta decisión, y las vigila `motor.test.ts` (`ADR-10.6`):

- **Ni `stretch` ni `letterbox` en el init.** Con cualquiera de los dos, el manejador de
  `resize` redimensiona el buffer a la caja CSS en cada cambio, con un tamaño que no es
  múltiplo de nada.
- **Ni `k.setFullscreen()` ni `k.isFullscreen()`.** La primera pide la pantalla del canvas
  (`ADR-10.2`). La segunda contesta sobre el canvas y daría `false` con el contenedor en
  pantalla completa.

**El costo, dicho:** en el modo, el píxel nítido depende de que el navegador respete
`pixelated` cada vez que `E ≠ E₀`. En el mueble con dpr entero no dependía (buffer y caja
coinciden). Está en la lista de `ADR-10.7`.

---

### ADR-10.5 — Todo lo que se ve en el modo vive adentro del contenedor

Consecuencia directa de `ADR-10.2`: con la pantalla del sistema, **lo que no está adentro del
contenedor no se ve**. No es una preferencia de diseño, es la regla del mecanismo. Adentro
tienen que estar:

| Pieza | Por qué |
|---|---|
| El canvas | Es el juego |
| Las seis teclas | Es la mitad del juego |
| El botón de seguir (`UX-32 §5`) y lo que `UX-33` sume a la victoria | `US-09` criterio 1: un toque para el nivel siguiente |
| **El pie de homenaje** | `BR-26`, `US-09` criterio 7: *"sin tocar nada"*. Si queda afuera, en pantalla completa real no está |
| El botón de salir | `ADR-10.3` |
| El aviso para el lector de pantalla (`#aviso-juego`) | Ya está adentro (`.gabinete`). Que siga ahí |

**Uno que hoy vive afuera, y no se muda por su cuenta:** el interruptor de la cinta (`UX-21`)
es otra isla, que no conoce al juego. En pantalla completa real no se ve, así que para apagar el
tema hay que salir del modo. **Si `UX-33` quiere que se pueda apagar sin salir, eso es una
pregunta de `ADR-07`** (el interruptor es uno solo). No se resuelve moviendo nodos del DOM de
una isla a otra. Va en el traspaso a `experiencia`.

---

### ADR-10.6 — Módulos, límites y pruebas

| Módulo | Qué hace | Qué **no** puede |
|---|---|---|
| `src/lib/skayboy/pantalla.ts` (nuevo) | `encuadre()`, pura | tocar el DOM, importar el motor, leer `window` |
| `src/scripts/partida-skayboy.ts` | `entrar()`, `salir()`, el pedido de `ADR-10.2`, las tres puertas de `ADR-10.3`, el `ResizeObserver` y las cuatro propiedades CSS | pedir la pantalla completa sobre el canvas; llamar a `setFullscreen` o `isFullscreen` del motor; pasar `stretch` o `letterbox` al init; esperar (`await`) antes del `requestFullscreen` |
| `src/styles/skayboy.css` | Las reglas de `ADR-10.1`, solo debajo de `[data-pantalla="completa"]` | un hex (`diseno-marca.md`); una animación que no esté en `movimiento.test.ts` |

**Las pruebas, cada una con su rojo a mano** (las escribe el hilo principal):

| Archivo | Verde | Rojo que se tiene que ver |
|---|---|---|
| `pantalla.test.ts` (nuevo) | Los seis casos de `ADR-10.4`. Y, en una grilla de ventanas y dpr 1, 2, 2,625 y 3: `240·E ≤ anchoCss·dpr` y `144·E ≤ altoCss·dpr` salvo en el piso, y `izquierda·dpr` y `arriba·dpr` enteros (con tolerancia de coma flotante, `1e-9`) | Cambiar `floor` por `round`: el caso 1 da `E = 8`, 1152 px de dispositivo de alto en una ventana de 1125, y el test lo nombra |
| `motor.test.ts` (se suman casos) | La isla no contiene `setFullscreen(` ni `isFullscreen(`. El init de `kaplay(` no trae `stretch` ni `letterbox`. Ningún `requestFullscreen` sobre el canvas (`#juego` / `canvas.`) | Cada una agregada a mano sobre una copia del fuente, como los casos que ya tiene |
| `estilos.test.ts` | Ya escanea `skayboy.css`. Si el hilo principal quiere, suma que el bloque del modo trae `touch-action: none` en el contenedor | Borrarla |

**El peso:** `pantalla.ts` y las dos funciones de la isla son decenas de líneas. El margen de
`ADR-08.10` (23,2 KB gzip hasta el techo de 90) no se entera. **Ningún paquete nuevo**: una
librería de pantalla completa sería el segundo paquete de cliente (`ADR-08.6`, `ADR-08.7`)
para veinte líneas.

---

### ADR-10.7 — Lo que se apoya en hechos sin ficha, y qué pasa si alguno falla

Ningún punto de abajo se escribió como hecho. Están pedidos a `investigador` en
`Docs/SUGERENCIAS/ARQ-para-investigador-pantalla-completa-en-el-telefono.md`. **La prueba que
manda sobre todos es la partida del usuario en el teléfono**, que es la que encontró el
defecto (`D-47`).

| # | Supuesto | Si la ficha o el teléfono dicen que no |
|---|---|---|
| S1 | En Safari de iPhone no hay `requestFullscreen` para un elemento que no sea video (`D-47` consecuencia 2, **sin ficha**) | Nada cambia: el pedido se hace por detección. Si existe, se usa |
| S2 | `screen.orientation.lock` solo resuelve con pantalla completa del sistema, y rechaza donde no está | Nada cambia: se pide solo en ese caso y el rechazo se traga |
| S3 | **`touch-action: none` en el contenedor, `overflow: hidden` y `overscroll-behavior: none` en `html` y `body` alcanzan para que ningún gesto desplace, haga zoom, rebote o recargue**, en Safari de iPhone y en Chrome de Android | **Segunda línea, ya decidida y que no se construye antes de saberlo:** mientras dure el modo, un `touchmove` **no pasivo** en el contenedor con `preventDefault()`, que se registra en `entrar()` y se saca en `salir()`. No toca `touchstart`, así que los toques de las teclas siguen llegando. Entra si la ficha o el teléfono lo piden, no antes: es código que, si la hoja alcanza, no cambia ningún resultado |
| S4 | `image-rendering: pixelated` sobre un canvas se respeta como vecino más cercano en los dos navegadores | La salida es la alternativa 6 de abajo: rehacer el motor al entrar al modo, con `E₀ = E`. Cuesta lo que ahí se dice. Hasta verlo borroso en un teléfono, no se paga |
| S5 | `requestFullscreen` necesita el gesto de la persona y tiene que llamarse dentro del manejador | Nada cambia: ya se llama ahí |
| S6 | Sin `viewport-fit=cover`, Safari de iPhone no pone la página debajo de la muesca en horizontal | Si alguna vez se agrega `cover`, las teclas tienen que respetar `env(safe-area-inset-*)`. **Esta decisión no lo agrega** |

---

### Alternativas descartadas

| Descartada | Por qué, puntual |
|---|---|
| **Solo la API de pantalla completa**, sin modo propio | Donde no existe o la niegan, el defecto que trajo el teléfono sigue entero. Y `US-09` criterio 6 pide el resultado, no el mecanismo |
| **`k.setFullscreen()` del motor** | Pide la pantalla sobre el canvas (leído en disco). Las teclas, el botón de salir y el pie de homenaje dejan de verse |
| **Dibujar las teclas adentro del canvas** con la entrada táctil del motor | Pierde el `aria-label`, el foco de teclado y la lógica de punteros ya probada (`ADR-08.10`). Sería una segunda vía de entrada. Y cualquier rótulo adentro del canvas rompe `ADR-08.2` punto 4 |
| **`escalaCSS` entera también en el modo** (`ADR-08.3` sin tocar) | En el teléfono más común el área se queda en 480 × 288 px CSS, el 74 % del alto (caso 2). La nitidez la da `E` entera, no `escalaCSS` |
| **Escala libre** (`object-fit: contain` o el `stretch` del motor) | El píxel deja de ser cuadrado y parejo: barro (`CTR-15.2`, `D-41` punto 1). Con `stretch`, además, el motor rehace el buffer en cada cambio |
| **Rehacer el motor al entrar y al salir**, para que el buffer coincida con la caja | `kaplay()` de nuevo hace `quit()` del anterior (leído en disco), crea **otro** `AudioContext` que hay que cerrar al nacer (la excepción de `ADR-08.2.1`, pagada otra vez por cada entrada) y recarga los atlas. Queda solo como la salida de S4 |
| **Buffer de tamaño nativo (240 × 144) desde el init**, con todo el agrandado por CSS | Es lo más liviano en memoria de la placa de video, pero haría que **también el mueble** dependa de `pixelated`, que hoy con dpr entero no depende. Cambia `ADR-08.3` sin que nadie lo haya pedido |
| **Una página aparte** para jugar a pantalla completa | Navegar sale de la pantalla completa del sistema y recarga el motor. Pasar al nivel siguiente obligaría a otra navegación. Y `D-47` deja el mueble como la entrada, no como otra ruta |
| **Entrar al modo con el primer toque de una tecla de juego** | La API pide un gesto, y ese toque lo sería. Pero la tecla se mudaría de lugar debajo del dedo que la está apretando, en el mismo instante. Entrar es un botón propio |
| **App instalada** (manifiesto con `display: fullscreen` y "Agregar a inicio") | Le pide a la persona instalar algo para jugar bien: es un molinete (`CLAUDE.md`, *"nada que le pida algo al jugador para entrar"*). Y un manifiesto es del sitio entero, no de un juego. Si algún día se quiere, es otra decisión |
| **Un cartel de "girá el teléfono"** | `UX-28 §4` y `D-32` límite 3 ya lo descartaron |
| **Bloquear el desplazamiento siempre**, también en el mueble | Encierra a la persona: lo de abajo del mueble queda sin alcance. El modo es donde se bloquea |
| **Una librería de pantalla completa** de npm | Segundo paquete de cliente (`ADR-08.6`, `ADR-08.7`) para veinte líneas |

---

### Consecuencias

1. **`ADR-08.3` queda enmendado para el modo** (marcado en `ARQ-motor-de-juego.md`). En el
   mueble no cambia nada. En el modo, la escala entera es `E` en píxeles de dispositivo,
   `escalaCSS` puede ser fraccionaria, y **el área crece con la pantalla**. `ADR-08.11` punto 5
   queda precisado en el mismo sentido.
2. **Pasar de nivel no navega ni recarga** (`CTR-16.11`, `D-47` punto 2): una navegación saca de
   la pantalla completa del sistema. La fila entera vive en la isla, con el mismo motor y los
   mismos atlas.
3. **El juego gana su primer estado global de página** (el atributo en `<html>`). Lo escribe una
   sola función de ida y una de vuelta, y la hoja es la única que lo lee.
4. **`UX-33` diseña adentro de estos límites**: el contenedor es uno, el área se centra con
   `encuadre()` (o con la caja que `UX-33` le pase), las teclas son las mismas seis, y todo lo
   que se ve va adentro. Lo que decida sobre transparencia, vertical y lugar del pie no pasa
   por acá.
5. **El movimiento reducido no se entera del modo**: el modo no agrega ningún movimiento. El que
   sí agrega `D-47` es el baile, y su regla está en `CTR-15.7` (enmendado hoy).

---

### Cómo se verifica

`arquitectura` no corre comandos (`D-12`). Los corre `revisor`, `orquestador` o el hilo
principal.

```bash
# El documento: las siete secciones y los anclajes de la lectura en disco.
rg -n "^### ADR-10\.[1-7]" Docs/ARQ/ARQ-pantalla-completa.md        # siete líneas
rg -n "setFullscreen|stretch|letterbox|pixelated|ResizeObserver" Docs/ARQ/ARQ-pantalla-completa.md

# La lectura del motor, repetible (tiene que devolver una línea cada una):
rg -o "function g\(f=!0\)\{f\?d\(e\.canvas\):C\(\)\}" node_modules/kaplay/dist/kaplay.mjs
rg -o "t&&!a\.globalOpt\.stretch&&!a\.globalOpt\.letterbox\|\|" node_modules/kaplay/dist/kaplay.mjs

# Cuando exista el código (T-301):
node --test src/lib/skayboy/pantalla.test.ts
node --test src/lib/skayboy/motor.test.ts
```

**Y la que manda:** el usuario, en su teléfono, en el modo, treinta segundos de juego
corriendo el pulgar fuera de las teclas y apoyando la palma. La página no se mueve, no hace
zoom y no se recarga. Las teclas no se sueltan solas. Se sale y se vuelve a entrar con un
toque cada vez, y el nivel sigue donde estaba. En un Android y en un iPhone. Es `US-09`
criterio 6 enmendado, y lo anota quien lo vea (`D-12`).
