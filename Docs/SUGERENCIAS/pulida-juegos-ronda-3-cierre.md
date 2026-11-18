# Pulida de los juegos, ronda 3: el cierre de "Adiviná el tema"

> Propuesta del constructor de la ronda (2026-11-18). Sigue a
> `pulida-juegos-jugo-y-casete.md` (ronda 1) y `pulida-juegos-ronda-2-sonido-y-entero.md`
> (ronda 2). Las decisiones del hilo principal de esta ronda (interruptor de ruidos, sin `tic`,
> las esperas de 380 ms, el tiempo en `--texto`) ya están aplicadas.

## 1. Lo que cambió y conviene dejar escrito

1. **Los ruidos de interfaz tienen interruptor.** Vive en `src/lib/audio/efectos.ts`
   (`ruidosPrendidos`, `ponerRuidos`), arranca prendido y se recuerda en `localStorage`
   (`fichin:ruidos`), envuelto en `try/catch`. Apaga solo los efectos. El botón lo arma
   `armarInterruptorDeRuidos()` de `src/scripts/jugo.ts`, y el texto lo pone cada juego.
2. **"Empezá" ya no espera.** En la ronda 2 la pantalla cambiaba 380 ms después del toque. Ahora
   cambia en el acto y lo que dura 380 ms es el viaje del casete de la portada a su lugar.
3. **Con el tema entero a mano, la cabina revelada es la del tema** (`D-22`): el mismo casete, la
   regla en largo y la tecla. **El fragmento de diez segundos ya no se puede volver a oír ahí**:
   el tema lo contiene. Sin archivo entero, queda el fragmento como antes.
4. **Hay un segundo grito.** `D-33` deja el acierto como el único grito del sitio. Sacarlo con la
   primera décima ahora dice "¡Con una décima!" en vez de "¡La sacaste!": es el mismo acierto, más
   grande. Necesita el visto de `contenido` (el texto) y queda dentro de `voz-ricotera.md` §7
   ("solo grita el acierto").
5. **La racha** se anota con un sello en la cabecera: "2 al hilo". Texto de `contenido` también.
6. **El buscador cambió de piel para los dos juegos de sacar temas**: campo de papel, cruz
   adentro, sugerencias como fichas. Los pares de color son los ya testeados (tinta del fondo y
   tinta apagada sobre papel), pero `contraste.test.ts` no nombra estos usos nuevos.
7. **La franja de "Volvé al fichín" no era del sitio.** El grano de la pantalla es una capa fija
   (`body::after`); en una captura de la hoja entera el navegador la pinta solo sobre la primera
   ventana (860 px), y lo que queda abajo sale sin grano. `scripts/mirar-juego.mjs` ahora estira
   esa capa a la hoja para las fotos enteras.

## 2. Detalles vivos de esta ronda

| Detalle | Estado | Con movimiento reducido |
|---|---|---|
| El casete de la portada viaja a su lugar en la partida | "Empezá" | no viaja |
| La etiqueta del casete de la portada toma la tinta del disco elegido | elegir un disco | igual, sin el gesto |
| El casete expulsa (salta y vuelve) | acierto | quieto |
| Lo que sumaste vuela del sello a la cuenta de la cabecera, que sube al llegar | acierto | la cuenta cambia de una |
| El casete se sacude con el error | error | quieto |
| La ficha elegida se pega en el campo, con su cinta | elegir sugerencia | ya pegada |
| La rueda de las décimas salta; las otras dos ruedan | sonando | cambian sin rodar |

## 3. Lo que sigue sin probar

Ningún sonido fue escuchado por nadie. El tema entero se probó con un fragmento de diez
segundos servido en su lugar, sin saltos (el servidor de prueba no acepta rangos). El teclado
abierto y el modo incrustado en X no se miraron con el orden nuevo de la cabina.
