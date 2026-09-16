# Del hilo principal para `experiencia` y `arquitectura` — la hoja de sprites no se recorta a máquina

> Medido el **2026-09-16** sobre `public/arte/skayboy_poligirl.png`, con `sharp` leyendo el
> raw. No es opinión: son los números que devolvió la imagen. Va acá porque toca a los dos —
> la convención del pixel es de `experiencia` (`D-41`, `UX-04`) y el contrato del atlas es de
> `arquitectura` (`CTR-15`).

## Lo medido

| Qué | Cuánto |
|---|---|
| Lienzo | **1299 × 725** |
| Canales | RGBA, pero **el alfa está lleno**: el fondo es píxel opaco, no transparencia |
| Color de fondo | `rgb(22, 114, 119)` — verde azulado, uniforme |
| Bandas horizontales | 4: dos de personajes (y 23–370 y y 426–690) y dos de rótulos (y 373–407 y y 692–717) |

## El problema, y es el que importa

**Los rótulos y sus flechas tocan los sprites, así que el recorte automático los pega en un
solo bloque.**

- **Banda del personaje masculino (y 23–370): una sola pieza de 1072 px.** Los seis sprites,
  la guitarra y las dos cabezas de perfil salen fundidos en un blob, porque las cajas
  *"Sombrero Fedora"* y *"Lentes de Sol"* y sus flechas puentean de uno al otro.
- **Banda del personaje femenino (y 426–690): seis piezas** — 145, 142, **355**, 125, 166 y
  147 px —, pero esa de 355 px son dos sprites pegados por la caja *"Pelo Negro y Flequillo"*.

**Se intentó enmascarar los rótulos y no alcanza.** Se probó excluir el relleno crema de las
cajas (`min > 190` y `max − min < 28`, que separa limpio la caja del tono de piel: la caja da
`236,235,205` y la piel `228,173,120`). La segmentación **no mejoró en absoluto**: las bandas
quedaron idénticas. Las que puentean no son las cajas, son **las flechas**, que son oscuras y
caen dentro del rango de la tinta del dibujo.

## Las tres salidas, y la primera es la barata

1. **Que el usuario reexporte la hoja sin anotaciones** — sin cajas, sin flechas, sin títulos,
   idealmente con los sprites separados por fondo limpio. Es una acción de su lado y deja el
   recorte automático andando. **Es la que recomiendo**, y conviene pedirla antes de gastar
   trabajo en las otras dos.
2. **Recortar a mano**, anotando las cajas una por una en el contrato. Funciona, no depende de
   nadie, y deja catorce números escritos que hay que mantener si la hoja cambia.
3. **Pedir la hoja ya en grilla**, con celdas del mismo tamaño. Es lo que un atlas quiere de
   verdad y lo que `CTR-15` va a terminar pidiendo igual; si se va a rehacer, que se rehaga
   así.

## Dos cosas más que el recorte va a necesitar sí o sí

- **El alfa hay que fabricarlo.** Hoy no existe: el fondo es un color. Quitar `rgb(22,114,119)`
  por umbral es directo, pero **ojo con los bordes**: si el dibujo tiene antialias contra ese
  verde, van a quedar halos, y un halo en un sprite de pixel art se ve a la legua. Si la hoja
  se reexporta, pedir **fondo transparente de origen** resuelve esto de arriba.
- **Lo que la hoja no trae, y `D-40` y `D-42` necesitan:** no hay animación de muerte, no hay
  ciclo de caminata de varios cuadros (una sola pose de correr por personaje), no hay pose de
  empujar, y **no hay un estado visual para el personaje en pausa** — que es justo lo que el
  modo de uno solo necesita para que se vea quién está esperando.
