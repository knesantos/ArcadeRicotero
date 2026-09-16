# De `experiencia` para `arquitectura` — las seis condiciones del área de juego

> 2026-09-16, ciclo 15. No es una tarea ni un contrato: es lo que mis hojas dan por
> garantizado y que el motor tiene que cumplir. Si algo de acá no se puede, avisame antes de
> que se dibuje un nivel, porque tres de las seis cambian el dibujo.
>
> **Consume:** `D-41`, `D-39`, `D-40`, `D-32`, `UX-27`, `UX-28`, `UX-29`, `UX-30`,
> `RES-62` (los tres motores candidatos con licencia leída).

---

## 1. El escalado es entero o no es

`UX-27 §2.1`. El motor tiene que poder pintar la escena a **escala entera exacta** —×1, ×2,
×3, ×4— y con el suavizado apagado. En un `<canvas>` eso es `imageSmoothingEnabled = false`
más un tamaño de buffer que sea el lógico y no el de la pantalla; en DOM es
`image-rendering: pixelated`.

**Lo que rompe esto y hay que evitar por nombre:** que el motor ajuste el canvas a
`devicePixelRatio` con un factor fraccionario. Un teléfono con dpr 2,75 y un motor que
"escala a la pantalla" convierte la grilla en papilla, y no se nota en una captura: se nota
en el teléfono.

**El área no crece con la pantalla** (`UX-28 §2`). Si no entra ×2, entra ×1; nunca ×1,7.

---

## 2. El área tiene tamaño fijo y vive adentro de un recorte

480 × 288 px CSS a ×2, con un marco de imprenta alrededor (`UX-27 §1`). **No es un canvas a
sangre** y no se pide pantalla completa. Si el motor elegido asume que se adueña del
viewport, ese es un punto de descarte.

Y una consecuencia para el HTML: **nada del HUD vive adentro del canvas**. Reloj, teclas,
rótulos y pie son DOM de la imprenta, no píxeles dibujados por el motor.

---

## 3. Seis entradas táctiles simultáneas, sin gesto

`UX-28 §2.1`: dos columnas de tres teclas. En el peor caso hay **cuatro dedos apoyados a la
vez** (dos personas, dirección y salto cada una), así que el manejo de toque tiene que ser
multitáctil de verdad: `touchstart`/`touchend` por identificador, no un `click` por tecla.

- **Nada de deslizar, doble toque, mantener para cargar ni zona muerta.** El criterio 2 del
  brief dice "nada de precisión fina" y un gesto es precisión fina con otro nombre.
- **Un dedo que se desliza fuera de la tecla la suelta.** Si no, el personaje sigue corriendo
  solo y el que juega no entiende por qué.
- **Ningún toque sobre el área hace nada.** El área se mira, no se toca. Eso además evita que
  el dedo tape el nivel.

---

## 4. Quieto es no estar tocando, y no hay modo que guardar

`UX-28 §1`: **no existe un modo de uno y un modo de dos.** Cada columna maneja siempre al
mismo personaje; el que no tiene un dedo encima se queda parado. No hace falta estado
guardado, ni preferencia, ni botón de cambio, ni pantalla previa.

**Lo que sí hace falta del motor:** que un personaje sin entrada quede **completamente
inerte y a salvo** — sin inercia residual, sin resbalar, sin caerse de la plataforma donde
lo dejaron. Si el motor tiene fricción baja por defecto, se sube.

---

## 5. El movimiento del dedo no se apaga nunca; el de la sala sí

`D-32` consecuencia 1 ya lo dejó escrito para todo el sitio: `prefers-reduced-motion` **opera
por familia de token — se apaga la cámara, nunca el dedo**. Acá:

| Se apaga con movimiento reducido | No se apaga jamás |
|---|---|
| Parpadeo del terreno, llama, brillo del coleccionable | El personaje moviéndose porque alguien apretó |
| Cualquier deriva de fondo | La pasada de reimpresión al fallar (es información: te devolvieron) |
| El giro de un carrete, si lo hubiera | La respuesta de la tecla |

**Y el hueco que `INV-60` ya midió:** no hay un solo `matchMedia('prefers-reduced-motion')`
en JS de cliente en todo el repo, y `movimiento.test.ts` mira CSS. Un bucle de
`requestAnimationFrame` **ni se audita ni se apaga**. Es tuyo decidir cómo se cubre; yo solo
declaro que la tabla de arriba tiene que poder cumplirse.

---

## 6. El sonido, con lo que ya está decidido

`D-39` habilitó el tema entero para este juego, con tres condiciones que no son mías y no
las toco: se transmite y no se decodifica, la ruta entra al censo de `rutas-sonoras.ts`, y el
disco no se nombra en pantalla. Lo que agrego desde la pantalla:

- **El tema no arranca solo.** Hace falta un gesto, y el gesto es el primer toque en una
  tecla. Nadie abre un enlace y le empieza a sonar música.
- **Se puede apagar sin salir del juego**, y el control vive afuera del área, en el marco.
- **Los efectos —salto, puerta, coleccionable— son tuyos** (`D-39` consecuencia 2, ya
  traspasada). Lo único que fijo yo es que **el fracaso no suena** (`UX-29 §6`): ni golpe, ni
  quejido, ni música de derrota. Es la pieza donde el silencio es la decisión, no la falta
  de material.

---

## 7. Lo que no te pido, para que no lo cargues

- **No hace falta física de cuerpo rígido.** Es plataformas de tiles: cajas alineadas a
  grilla y colisión por eje. `RES-62` ya descartó Excalibur por exactamente esto.
- **No hace falta cámara.** El nivel entra entero en una pantalla y no hay scroll
  (`UX-29 §7.1`: el nivel es una sala cerrada, sin vacío por donde caerse).
- **No hace falta guardar nada más que lo que el sitio ya guarda.** Sin cuentas, sin
  sincronización, `localStorage` y nada más.
