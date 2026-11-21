# Pulida de los juegos, ronda 1: el jugo y el casete vivo

> Propuesta del constructor de la ronda (2026-11-17), para que el hilo principal la convierta en
> decisión (`D-XX`) o la corrija. Empieza por "Adiviná el tema" (`US-02`). No toca `ESTADO.md`,
> `Docs/DECISIONES.md` ni la carpeta de ningún rol.

## 1. Lo que cambia de doctrina y necesita quedar escrito

Cuatro cosas de esta ronda contradicen algo que el repo tenía escrito. Las cuatro salen del
pedido del usuario (*"agregar efectos, animaciones que parezca más profesional manteniendo la
estética y nuestra alma"*, y después *"cuando está andando el tema que giren las ruedas del
cassete, cosas así para que te metas más en el juego"*).

1. **Movimiento atado a un estado, además del feedback.** `tokens.css` (hoja 12) dice que la mosca
   es "lo único vivo del sitio" y `diseno-marca.md` que "el único movimiento decorativo es la
   mosca". Desde esta ronda el casete de "Adiviná el tema" se comporta como un casete mientras
   la cinta corre. Propongo la excepción con este borde: **un objeto de la pantalla puede moverse
   como el objeto real mientras dura el estado que representa (sonando, rebobinando), y queda
   quieto cuando el estado termina.** Nunca un bucle permanente.
2. **El error tiene golpe.** `D-33` deja el acierto como "el único grito del sitio". No se toca:
   el error no festeja ni imprime a color. Pero ahora responde: la regla se sacude en saltos
   duros y la cruz cae como sello en su tramo. Es respuesta, no festejo.
3. **El resultado entra.** `juego.css` decía del afiche "NO SE ANIMA". Las estampitas siguen sin
   imprimirse por pasadas, pero cada renglón de la vuelta ahora **se pega** (llega torcido y
   apoya), y el reloj cuenta hasta el tiempo que hiciste.
4. **La escalera está una sola vez.** La lista de seis renglones ya no dibuja renglones vacíos:
   la escala la lleva la regla, y lo que hiciste con cada escalón se marca en su tramo (✕ erraste,
   – pasaste, ✔ la sacaste). La lista de abajo queda solo con lo gastado. Salieron las clases
   `.intento--libre` y `.intento--actual` (y de `estilos.test.ts`).

## 2. Los detalles vivos que se agregaron (para el registro que pidió el usuario)

Todos en el reproductor de "Adiviná el tema", todos atados a que la cinta corra:

| Detalle | Estado | Cómo | Con movimiento reducido |
|---|---|---|---|
| Los carretes toman velocidad y **frenan con inercia** | sonando → parar | una animación de CSS por carrete; `casete.ts` le cambia `playbackRate` en 6 escalones durante `--duracion-inercia` | no giran; lo dice SONANDO |
| **La cinta se pasa** del carrete izquierdo al derecho | sonando | `--avance` (0 a 1) escala dos círculos | queda en su lugar final |
| La cinta floja entre carretes **se tensa** | sonando | `scaleY` con `--duracion-paso` | cambio directo |
| **El piloto** de la casetera se prende y parpadea | sonando | cuadrado vacío → lleno; parpadeo en dos tiempos | prendido fijo |
| **La aguja tiembla** | sonando | giro de ±1,6° en saltos duros | quieta |
| **El contador** de la casetera avanza | sonando | texto, décima a décima; se tiñe mientras suena | igual (es un dato) |
| **Rebobina** al pasar de tema | tema nuevo | carretes para atrás, la tinta de la regla se recoge, el tramado vuelve | la regla aparece vacía |
| El casete también gira con **el tema entero** (`D-22`) | play del `<audio>` | eventos `play`/`pause`/`ended` | no gira |

Ninguno usa un segundo `requestAnimationFrame`; lo que se anima es `transform` y `opacity`. La
tinta de la regla pasó de animar `width` a `scaleX`, y la aguja de `left` a `translate`.

## 3. Tokens nuevos (solo tiempos, ningún color)

`--duracion-golpe` (260 ms), `--duracion-inercia` (900 ms), `--duracion-cuenta` (600 ms) y
`--duracion-piloto` (1,2 s). Los tres primeros van a cero con movimiento reducido; el piloto es
un bucle y se apaga con `animation: none`. **Falta pasarlos al lienzo (hoja 12)**: el circuito
dice lienzo primero, y esto entró por `tokens.css`. No se agregó ninguna curva: los saltos duros
del golpe se hacen con cuadros clave repetidos, no con `steps()`.

## 4. Lo reutilizable, para los otros nueve juegos

- `src/scripts/jugo.ts`: `golpear(pieza)`, `estampar(pieza)`, `contar(pieza, desde, hasta, formato)`.
- `juego.css`, bloque "El jugo": `.jugo-golpe`, `.jugo-sello`, `.jugo-entra` y `.jugo-pega` (las
  dos últimas con `--orden` para escalonar). La tecla `.primario` ahora deja un filete al apretar.
- `scripts/mirar-juego.mjs`: recorre los estados de un juego y saca capturas y tiras de seis
  cuadros, a dos tamaños, con y sin movimiento reducido. Tiene el recorrido de "Adiviná el tema"
  y uno genérico; cada juego nuevo suma el suyo en `RECORRIDOS`.

## 5. Lo que no hice y propongo

- **El tema entero sigue en el `<audio controls>` del navegador.** Ahora tiene caja y rótulo, pero
  los controles son los de fábrica: es la pieza menos nuestra de la pantalla. Un reproductor
  propio (la misma regla, larga) es trabajo de una ronda, y en este worktree no hay ningún mp3
  entero para probarlo.
- **El borde azul petróleo de las sugerencias** es `--cat-mitologia-apoyo`, el apoyo medido de
  *Lobo suelto*: es un token con sentido, no un resto, y lo dejé. Es el único azul de la pantalla;
  si molesta, la salida es usar el apoyo en algo más de este juego, no sacarlo.
- **El título en gris azulado** de la revelación es la tinta medida de *¡Bang! ¡Bang!* (`RES-37`):
  cada tema se revela en la tinta de su disco. También es token; no lo toqué.
