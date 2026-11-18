# Pulida de los juegos, ronda 2: el casete objeto, el sonido de interfaz y el tema entero

> Propuesta del constructor de la ronda (2026-11-18), para que el hilo principal la convierta en
> decisión o la corrija. Sigue a `pulida-juegos-jugo-y-casete.md` (ronda 1). Juego: "Adiviná el
> tema" (`US-02`).

## 1. Lo que necesita decisión

1. **El sitio ahora hace ruido de interfaz.** Hasta acá los únicos sonidos eran la música y los
   efectos de "Skayboy y Poligirl" (`CTR-17`). `src/lib/audio/efectos.ts` suma cinco, todos
   sintetizados (ningún archivo): `tic`, `tecla`, `clac`, `golpe` y `sello`. Las reglas que
   propongo dejar escritas:
   - **Nunca encima de un fragmento que se está adivinando.** La isla no llama a ningún efecto
     mientras la cinta suena.
   - Usan el contexto de audio del sitio y solo si ya está despierto: antes de "Empezá" no
     suena nada.
   - Bajos: ganancia 0,16 contra 1 de la música, y ninguno dura más de 0,25 s
     (`efectos.test.ts` lo vigila).
2. **No existe una "llave de silencio" del sitio.** Lo que hay es la llave física del iPhone
   (`D-66`, `sesion.ts`): el juego pide la sesión de la música para que esa llave no lo apague.
   Los efectos salen por el mismo contexto, así que siguen la suerte de la música. **Si se
   quiere que la gente pueda apagar los ruidos de interfaz, hace falta un control nuevo**
   (un interruptor en la partida, guardado en `localStorage`). No lo hice: es una decisión de
   producto y de `experiencia`.
3. **El audio espera al golpe.** Después de un error, el fragmento nuevo arranca 380 ms más
   tarde (`--pausa-error`), para que el ruido del error no lo tape. Antes arrancaba en el acto.
   Lo mismo al acertar, con el sello. Con el repuesto de `<audio>` (sin Web Audio) no hay espera
   ni ruido, porque ahí el sonido tiene que salir adentro del toque.
4. **No hay clac al arrancar la cinta en plena partida**, aunque el pedido lo nombraba: el primer
   escalón dura una décima de segundo y un ruido pegado adelante lo tapa. `codigo-juegos.md` pide
   que el reveal responda "al milisegundo". El clac suena al parar a mano, al terminar de
   rebobinar, al arrancar en la portada y en el reproductor del tema entero.
5. **El tiempo del resultado dejó el rojo de *Gulp!*.** Era `--cat-historia` (no `--acento-4`),
   pero al lado de las cruces del resumen se leía como error. Pasó a `--texto`. *Gulp!* sigue en
   el botón de compartir. Toca `D-19` ("resultado = Gulp! + logo") y lo comparte "Sacalo por la
   letra".
6. **"Empezá" tarda un sub-paso (380 ms)** en cambiar de pantalla: es lo que dura el gesto del
   casete de la portada. Con movimiento reducido es inmediato.

## 2. Detalles vivos de esta ronda

| Detalle | Estado | Con movimiento reducido |
|---|---|---|
| El casete es un objeto: carcasa en tinta plana, etiqueta y ventana de papel, cinta oscura | siempre | igual |
| Los rollos de cinta cambian de radio (`scale`), recortados contra la ventana | sonando, tema entero | quedan en su lugar |
| La cinta corre por la boca, entre los rodillos | tecla apretada | quieta |
| El cabezal sube a tocar la cinta | tecla apretada | cambio directo |
| Contador mecánico de tres ruedas, sobre la etiqueta | sonando | cambia sin rodar |
| La etiqueta del casete se tiñe con el disco del tema | revelado | igual |
| La tecla "Escuchá" queda hundida mientras suena | sonando | igual |
| El casete de la portada arranca al tocar "Empezá" y el de la partida frena | paso de pantalla | sin gesto |
| El sello rojo del error cae sobre el tramo gastado, con marco rojo en la regla | error | no aparece; queda la cruz |
| El sello de la vuelta ("2 de 4") cae en el resultado, con su sonido | resultado | ya apoyado |
| La tarjeta compartible asoma arriba de "Compartí" | resultado | igual |

## 3. El tema entero (`D-22`)

Reproductor propio: una tecla, la cinta con aguja y el tiempo. La cinta es un
`<input type="range">` vestido, así que el teclado y el lector de pantalla vienen del
navegador. El motor es un `<audio>` sin controles y con `preload="none"`. **No quedó el
`<audio controls>` como respaldo**: la página es una isla y sin JavaScript no hay juego. Si el
archivo no carga, la caja dice "No cargó" y la tecla se apaga.

Probado con `--entero` de `scripts/mirar-juego.mjs`, que sirve el fragmento de diez segundos
como si fuera el tema. **No está probado con un mp3 entero de verdad ni en un teléfono.**

## 4. Tokens nuevos

`--pausa-error` (380 ms, información: el corte no lo toca) y `--duracion-golpe` pasó de 260 a
400 ms. Siguen sin pasar por el lienzo (hoja 12), igual que los de la ronda 1.
