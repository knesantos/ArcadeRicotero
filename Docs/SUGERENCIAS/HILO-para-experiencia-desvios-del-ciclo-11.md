# HILO → `experiencia` — Los desvíos de `UX-20` y `UX-21` del ciclo 11, construidos y declarados

- **Fecha:** 2026-09-01
- **De:** hilo principal, construyendo `T-177`, `T-185`, `T-188` y `T-191` del ciclo 11
- **Para:** `experiencia`, dueño de `UX-20-el-sitio-como-lugar.md` y de
  `UX-21-el-interruptor-de-cinta.md`
- **Consume:** `UX-20` §4 y §5, `UX-21` §7, `ADR-03` §6.2, `Docs/ORQ/ORQ-plan-ciclo-11.md`

Las dos hojas se siguieron al pie. Estos son los tres lugares donde el código tuvo que
decidir algo que la hoja no decía, o donde no pudo cumplir lo que la hoja pedía. Los tres
están **construidos y andando**: esto no pide permiso, pide ratificación o corrección.

---

## 1. Apareció un token que `UX-20` §4 no cataloga: `--escalon-umbral`

**Qué pasó.** El catálogo de `§4` nombra `--duracion-umbral` como *"cada sub-paso del
asentamiento de la portada"*, y eso alcanza para cuánto dura cada sub-paso. Pero el umbral
son **tres** sub-pasos escalonados —el grano, la figura, la marca— y la separación entre
uno y el siguiente no tenía nombre. Sin token, los dos retrasos quedaban escritos a mano en
`sitio.css`, que es exactamente lo que `§4` existe para impedir.

**Qué se hizo.** Un token nuevo, `--escalon-umbral: 70ms`, y los tres sub-pasos arrancan en
`0`, `var(--escalon-umbral)` y `calc(var(--escalon-umbral) * 2)`. Bajo
`prefers-reduced-motion` vale `0ms`, como el resto de la familia.

**Lo que hay que mirar, y es una pregunta de diseño, no de código:** el umbral entero dura
`380 + 140 = 520 ms` de punta a punta. Ningún sub-paso pasa los 400 ms que fija `§1.1`, así
que la letra se cumple. Si el espíritu era *"el umbral entero no pasa de 400"*, esto lo
incumple y hay que bajar el escalón o acortar los sub-pasos. **La hoja no lo dice y por eso
lo pregunto en vez de decidirlo.**

---

## 2. El fundido del paso no tiene token propio, y una revisión lo marcó

**Qué pasó.** El paso entre pantallas se resuelve con dos animaciones sobre las pseudo del
tránsito: la pantalla que se va baja opacidad y brillo, la que llega hace lo inverso. La
duración sale de `--duracion-paso` y la curva de `--curva-cinta`, así que **ningún número
quedó suelto**. Pero la revisión adversarial de `UX-20` señaló, con razón, que `§5` nombra
el *crossfade* al describir qué se apaga y `§4` no cataloga ningún token para él.

**Lo que se construyó, para que se pueda juzgar:** la opacidad no es un token porque no es
un valor de marca — es el mecanismo del cruce, y va de 1 a 0. Lo que sí es de marca, y sí
tiene token, es **cuánto se hunde la tinta** (`--hondura-transito: 0.82`).

**La pregunta para vos:** ¿el fundido cruzado es parte de la doctrina o el paso tendría que
ser solo hundida sin cambio de opacidad? Un cruce sin opacidad, entre dos pantallas de
fondo casi idéntico, se vería como un parpadeo de brillo. Con opacidad se ve como una
pantalla que reemplaza a la otra. **Elegí una y lo dejo escrito en la hoja.**

---

## 3. `UX-21` §7 no se pudo cumplir en las seis pantallas de juego

**Qué pide la hoja.** Que el interruptor de la cinta siga visible mientras se juega: *"la
cama se calla, el interruptor se queda"*.

**Por qué no se pudo.** En las seis pantallas de juego la cabecera —`.cabecera-sitio`, donde
`§1` manda poner el interruptor— vive **adentro de `#portada`**, y la isla de la partida
esconde esa sección entera al empezar. El interruptor se va con ella y vuelve al terminar.
No es una decisión: es dónde está el marcado.

**Lo que sí se cumplió:** vive en el mismo renglón, en el mismo lugar, en todas las
pantallas donde ese renglón está a la vista, y en la portada —que no tenía cabecera— la
isla le arma una fila propia, alineada a la derecha, como pide `§1`.

**Las dos salidas, y ninguna es mía:**

1. **Mover la cabecera afuera de `#portada` en las seis pantallas.** Es el arreglo
   correcto y es maquetado de seis juegos: no entra en `T-191` y merece su propia tarea.
2. **Aceptarlo como está.** Durante una partida con audio la cama está callada igual, así
   que lo que se pierde es poder apagarla sin volver a la portada. Con el juego sonando
   encima, es discutible cuánto se pierde.

Mientras tanto está anotado en el propio archivo (`src/scripts/cinta.ts`, comentario de
cabecera, punto 3) para que el que lo lea no crea que es un olvido.

---

---

## 4. Tres precisiones que `REV-10` pidió que te llegaran por escrito

Ninguna es un defecto: son lugares donde la hoja dice una cosa y el código hace otra
parecida, y la revisión quiere que quede claro cuál manda.

1. **`§1.4` dice "8 % del ancho de la capa" y el código traslada 8 % del alto.** Una capa de
   fondo se corre verticalmente al desplazar, así que el eje del texto no es el que se usa.
   El número es el mismo y el efecto es el que la hoja describe; lo que hay que decidir es si
   la redacción decía "ancho" por descuido o si el criterio era otro.
2. **La deriva la lleva una sola capa, no todas.** El plan decía "dos capas de fondo... y
   solo traslación". Se construyó solo sobre la franja fija del portal: correr una capa
   adentro de una caja acotada —la cabecera de la Redondopedia, el `main` de un juego—
   **descubre su borde de abajo**, y además una capa que se mueve adentro de algo que no se
   desplaza no es profundidad, es un elemento moviéndose. El motivo está escrito en
   `sitio.css`, junto a la regla.
3. **El techo de 400 ms: ¿por sub-paso o por umbral entero?** Es la misma pregunta del punto
   1 de este documento, y `REV-10` la volvió a marcar. Hoy el umbral entero dura 520 ms
   repartidos en tres sub-pasos de 380. La letra de `§1.1` se cumple; el espíritu, no lo sé.
4. **La fila del cancionero de `§2` promete una segunda capa que todavía no existe.** Dice
   que reusa `tapa-fondo--mosca-olla`; el cancionero hoy tiene solo el grano. O la fila lleva
   la misma anotación de diferido que ya tienen otras dos, o alguien construye el fondo.

---

## Y una cosa que la hoja pidió y salió mejor de lo que pedía

`UX-21` §2 decidió que el símbolo se resolviera **con tipografía y borde, sin archivo
nuevo**, para no romper el candado de "cero peso" de `ADR-04`. Se cumplió: el interruptor
son tres siluetas de texto (`▷`, `▶`, `❚❚`), un borde que cambia de trazo y cuatro palabras.
**Cero bytes de imagen, cero producción de arte, y el estado se lee en blanco y negro.**
