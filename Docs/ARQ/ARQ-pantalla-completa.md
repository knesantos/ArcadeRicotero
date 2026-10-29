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
> **2026-10-04 (`D-61`): enmiendas en el lugar, cada una marcada donde pasó.** `ADR-10.5` suma
> tres capas de HTML adentro del contenedor —el menú (`#menu-juego`), la tarjeta de fin de nivel
> (`#fin-nivel`) y el rótulo de entrada (`#rotulo-nivel`)—, el sello `MENÚ`, y **un segundo
> botón que pide la pantalla completa, el del menú**. `ADR-10.1` (la captura es de la columna y
> no de cada tecla, `D-61` punto 4), `ADR-10.2` (el botón son dos) y `ADR-10.3` (el segundo
> botón no es una cuarta puerta) apuntan ahí, y `ADR-10.7` suma `S7`. Ningún número nuevo: es
> `ADR-10` enmendado. **Consume además:** `D-61`, `D-55`, `D-42` precisión 1, `BR-26` punto 1,
> `US-09` criterio 7, `UX-32 §5`, `ADR-08.2` punto 4, `ADR-08.10`, `ADR-09.1`, el traspaso
> `Docs/SUGERENCIAS/HILO-para-todos-skayboy-menu-y-mando.md` y
> `HILO-para-experiencia-pantalla-completa.md` §5 y §8; y en disco, leídos el 2026-10-04 con el
> código del menú todavía en construcción: `src/lib/skayboy/modo-pantalla.ts` (ancla
> `export function montarPantallaCompleta`, y el campo `boton` de `EntornoDelModo`, que hoy es
> uno solo), la cabecera de `src/lib/skayboy/dedos.ts`, y `src/styles/skayboy.css`, donde
> `touch-action: none` lo lleva cada tecla (ancla `.juego-skayboy .mando .tecla {`) y, en el
> modo, el contenedor. **`UX-37`, `CNT-40` y `BR-40` se escriben en paralelo y no estaban en
> disco:** lo que es de ellos queda nombrado como suyo. Los tres `id` son los que pasó el hilo
> principal: si el código les pone otro nombre, manda la pieza, no el `id`.
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

> **Enmendado el 2026-10-04 por `D-61` punto 4, solo la fila de las teclas.** Decía que *"las
> teclas ya tienen su captura"*. Desde `D-61` el puntero lo captura **la columna** y no cada
> botón, y la tecla apretada es la que queda más cerca del dedo (`src/lib/skayboy/dedos.ts`,
> cabecera). Lo que la fila protege no cambia: una sola lógica de punteros, las mismas seis
> teclas, ningún segundo juego. Lo que cambia es **quién tiene que llevar `touch-action: none`:
> la caja entera de la columna**, no solo cada tecla. Sin franjas muertas, un pulgar que cae
> entre dos teclas también aprieta. Si ahí el navegador todavía puede desplazar, cancela el
> puntero y la tecla se suelta sola, que es el defecto que `ADR-08.10` existe para evitar. En el
> modo ya lo cubre el contenedor (fila de arriba). **En el mueble no, y es condición.**

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

> **Enmendado el 2026-10-04 por `D-61` punto 5: "el botón" son dos.** El pedido puede salir
> también del botón que lleva el menú. Rige todo lo de arriba, para los dos por igual: el
> pedido sale del manejador del toque, **en el mismo gesto y sin ningún `await` antes**, y la
> función que lo hace es una sola. Las condiciones y la prueba están en `ADR-10.5`, subsección
> *"El segundo botón que pide la pantalla"*.

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

> **Enmendado el 2026-10-04 por `D-61` punto 5.** Si el botón del menú, en el modo, también
> saca de él, **no es una cuarta puerta**: es un segundo botón de la primera, y llega a la misma
> `salir()` (`ADR-10.5`).

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
| **El menú** (`#menu-juego`) *(sumado el 2026-10-04, `D-61` punto 1)* | Abre al entrar y se abre jugando. Afuera, en la pantalla del sistema no habría manera de ver qué niveles hay ni de elegir otro sin salir del modo |
| **El sello `MENÚ`** *(ídem)* | Es la única puerta al menú con la partida en curso. Va en el mueble, como el botón de pantalla completa, y el mueble está adentro |
| **La tarjeta de fin de nivel** (`#fin-nivel`) *(sumado el 2026-10-04, `D-61` punto 3)* | Seguir nombrando el siguiente, repetir, elegir otro. Afuera, ganar en la pantalla del sistema deja solo el toque invisible de `#seguir-juego`, que es el defecto que `D-61` (contexto, punto 3) vino a sacar |
| **El rótulo de entrada** (`#rotulo-nivel`) *(ídem)* | El número y el nombre del nivel, arriba del área. Afuera no se vería justo donde se juega |
| **El botón del menú que pide la pantalla** *(sumado el 2026-10-04, `D-61` punto 5)* | Está adentro por estar en el menú. Sus condiciones, en *"El segundo botón que pide la pantalla"*, abajo |

**Uno que hoy vive afuera, y no se muda por su cuenta:** el interruptor de la cinta (`UX-21`)
es otra isla, que no conoce al juego. En pantalla completa real no se ve, así que para apagar el
tema hay que salir del modo. **Si `UX-33` quiere que se pueda apagar sin salir, eso es una
pregunta de `ADR-07`** (el interruptor es uno solo). No se resuelve moviendo nodos del DOM de
una isla a otra. Va en el traspaso a `experiencia`.

> **Enmendado el 2026-10-04 por `D-61`, en el lugar.** La tabla suma cinco filas, marcadas. La
> regla no cambia: adentro, o no se ve. Pero las piezas nuevas son **las primeras con texto
> encima del área y con botones que tapan algo**, y eso trae condiciones que la regla vieja no
> necesitaba (las cinco de abajo). Y el pedido de pantalla completa sale ahora de dos botones.
> Qué dice cada pieza es de `CNT-40`; dónde va y cómo se ve, de `UX-37`. Acá está lo que no
> puede pasar.

#### Las tres capas de `D-61`: adentro de verdad, y sin tapar lo que no se tapa

1. **Adentro en el árbol y en la pintura.** Las tres son elementos comunes, hijos de `.fichin`,
   que la hoja posiciona. **No se abren con `<dialog>.showModal()` ni con `popover`.** Esos dos
   pintan en la capa superior del documento, fuera del orden de su contenedor, y con la pantalla
   del sistema `.fichin` también está en esa capa. Quién queda arriba depende de quién entró
   primero (`S7`, sin ficha). El caso que lo dispara es justo el nuevo: con el menú abierto, el
   toque en su botón pone `.fichin` en la capa superior **después** del menú, y el menú quedaría
   tapado por su propio contenedor. Un `<dialog>` abierto con `show()` o con el atributo `open`
   es un elemento común, y vale. Lo que se pierde es el `inert` automático del fondo: si hace
   falta, se pone `inert` a mano en los hermanos que el menú tapa, **nunca en un ancestro del
   menú**.
2. **Ninguna de las tres tapa el pie de homenaje.** `BR-26` punto 1 y `US-09` criterio 7 piden
   el pie *"visible sin tocar nada"*, y desde `D-61` lo primero que se ve al entrar es el menú.
   *"Encima del fichín"* (`D-61` punto 1) se lee como encima del área y del mando, no del pie.
   Lo mismo la tarjeta, que va *"abajo"* (`D-61` punto 3): abajo **del área**, no encima de la
   chapa del pie, que en el modo queda pinchada al borde de abajo
   (`HILO-para-experiencia-pantalla-completa.md` §8). Dónde va cada capa es de `UX-37`. **Que
   el pie quede entero a la vista con cualquiera de las tres abierta es condición.**
3. **La tarjeta se pinta arriba del toque invisible.** `#seguir-juego` sigue cubriendo el área
   (`D-61` punto 3, `UX-32 §5`), y la tarjeta se le apoya encima. Un toque va a un solo
   elemento, el de más arriba: si fuera `#seguir-juego`, tocar el botón de repetir llevaría al
   nivel siguiente. **Cada botón de la tarjeta es el elemento más alto en su propio centro.** Y la
   tarjeta es tocable en el mismo cuadro en que se gana, como ya lo es `#seguir-juego` (`D-32`
   límite 3). En ese mismo cuadro se escribe el avance (`CTR-16.11.1`, *"Cuándo se escribe"*).
4. **El rótulo de entrada no toma toques** (`D-61` punto 3): `pointer-events: none`. De
   costado, en el modo, las teclas van encima del área (`ADR-10.1`). Un rótulo que se quedara
   con un toque sería una tecla muerta durante dos segundos, justo al arrancar el nivel.
5. **El menú pausa; el modo no.** Con la partida en curso, abrir el menú la pone en pausa
   (`D-61` punto 1). **El reloj del mundo no junta lo que duró el menú**: al cerrarlo, el primer
   tic recibe un cuadro, no la pausa entera. Lo más simple es no llamar a `jugarTic()` mientras
   está abierto; el tope de tres cuadros de `ADR-09.1` no está para esto. **Abrir y cerrar el
   menú sueltan todas las teclas** (`soltarTodas()`), por la razón de `ADR-10.1` punto 1: un
   dedo que quedó apretando debajo del menú sería un personaje que arranca caminando solo al
   volver. `ADR-10.1` punto 3 sigue entero: el modo no pausa ni reanuda nada. La pausa es del
   menú, y la levanta el menú.

#### El segundo botón que pide la pantalla (`D-61` punto 5)

1. **Una sola función, dos botones.** Los dos van al mismo par `entrar()` / `salir()` que arma
   `montarPantallaCompleta()` en `modo-pantalla.ts`. El pedido al sistema está escrito una sola
   vez: **`requestFullscreen` aparece en un solo archivo fuente**. Un pedido copiado en el menú
   serían dos lugares donde se puede colar un `await`.
2. **En el mismo gesto, sin `await`.** El pedido sale del manejador del toque del botón del
   menú, sincrónico: ni `await`, ni `.then`, ni `setTimeout`, ni `requestAnimationFrame`, ni una
   microtarea antes. Lo que el manejador haga antes del pedido también es sincrónico. Es `S5`:
   el sistema da la pantalla solo adentro del gesto. Afuera la niega, el rechazo se traga
   (`ADR-10.2`) y la persona se queda en el modo sin la pantalla del sistema, sin saber por qué.
3. **Una sola verdad para los dos sellos.** Los dos muestran el mismo estado —el atributo de
   `<html>` y, con API, `fullscreenElement` (`ADR-10.3`)— y cambian juntos, también cuando el
   que sale es el sistema (`fullscreenchange`). Qué dice cada uno es de `CNT-40`.
4. **Aparece cuando aparece el otro.** Nace escondido en el HTML y la isla lo muestra cuando el
   motor ya dibuja, con la regla de `ADR-10.1`. Sin nivel sembrado no hay modo: ni en el mueble
   ni en el menú.
5. **Si en el modo también saca, va a `salir()`** (`ADR-10.3`, enmendado hoy). No hay una
   cuarta puerta.

**Cómo se prueba, cada una con su rojo** (las escribe el hilo principal):

| Dónde | Verde | Rojo que se tiene que ver |
|---|---|---|
| `modo-pantalla.test.ts` | Con el DOM de utilería, un toque en **cada uno** de los dos botones deja llamado `requestFullscreen` sobre `.fichin` **antes de que vuelva el `dispatchEvent`** | Envolver el manejador del botón del menú en una función `async` con un `await` antes del pedido: al volver el `dispatchEvent`, el pedido todavía no salió |
| `modo-pantalla.test.ts` | Si el del menú también saca: con el modo adentro, su toque llama a `exitFullscreen()`, saca el atributo y el otro sello cambia también | Un manejador propio del menú que saque el atributo sin pasar por `salir()` |
| El auditor que mira la isla y `modo-pantalla.ts` (`ADR-10.6`) | `requestFullscreen` en un solo archivo fuente, fuera de las pruebas | Copiar el pedido a la isla o a `menu.ts` |
| `estilos.test.ts`, si el hilo quiere | `#rotulo-nivel` con `pointer-events: none` | Borrarlo |
| El navegador, con la pantalla del sistema | Las tres capas se ven. Con cada una abierta, el borde de abajo del pie queda adentro de la ventana. `document.elementFromPoint` en el centro de cada botón de la tarjeta devuelve ese botón | — Lo anota quien lo mire (`D-12`) |

**Descartadas en esta enmienda:**

| Descartada | Por qué, puntual |
|---|---|
| **Las capas afuera de `.fichin`, mudadas adentro al entrar al modo** | Cada pieza tendría dos lugares donde vivir, y el foco del que juega con teclado se pierde en cada mudanza. Adentro siempre no cuesta nada |
| **`<dialog>.showModal()` o `popover` para el menú** | Pintan en la capa superior, y el botón del propio menú lo taparía al pedir la pantalla (condición 1, `S7`) |
| **El menú o el rótulo dibujados en el canvas** | `ADR-08.2` punto 4, y se pierden el `aria-label` y el foco. `D-61` punto 1 ya lo deja afuera |
| **Un segundo pedido de pantalla escrito en el menú** | Dos copias del único código que no puede esperar nada. La que no tenga prueba de conducta es la que se rompe |
| **Pausar la partida al entrar al modo, para que el menú y el modo se parezcan** | Cambia `ADR-10.1` punto 3 sin que nadie lo pida: quien entra a pantalla completa de costado en medio de un salto quiere seguir saltando |

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
| S7 *(sumado el 2026-10-04, `D-61`)* | Un `<dialog>` abierto con `showModal()` y un `popover` pintan en la capa superior del documento, fuera del orden de su contenedor; con la pantalla del sistema sobre `.fichin`, quién queda arriba depende del orden en que entraron a esa capa | Nada cambia: la condición 1 de `ADR-10.5` no los usa, y con elementos comunes la regla vale sea cual sea la respuesta. **Por eso no se pide ficha** |

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

# La enmienda del 2026-10-04 (D-61):
rg -n "^> \*\*Enmendado el 2026-10-04" Docs/ARQ/ARQ-pantalla-completa.md   # cuatro: ADR-10.1, 10.2, 10.3 y 10.5
rg -n "^#### " Docs/ARQ/ARQ-pantalla-completa.md                     # dos subsecciones, las dos en ADR-10.5
rg -l "requestFullscreen" src --glob "!*.test.ts"                    # una sola: src/lib/skayboy/modo-pantalla.ts
rg -n "showModal|popover" src/pages/juegos/skayboy-y-poligirl.astro src/scripts/partida-skayboy.ts src/lib/skayboy   # vacío
node --test src/lib/skayboy/modo-pantalla.test.ts
```

**Y la que manda:** el usuario, en su teléfono, en el modo, treinta segundos de juego
corriendo el pulgar fuera de las teclas y apoyando la palma. La página no se mueve, no hace
zoom y no se recarga. Las teclas no se sueltan solas. Se sale y se vuelve a entrar con un
toque cada vez, y el nivel sigue donde estaba. En un Android y en un iPhone. Es `US-09`
criterio 6 enmendado, y lo anota quien lo vea (`D-12`).
