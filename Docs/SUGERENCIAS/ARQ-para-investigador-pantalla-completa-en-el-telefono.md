# De `arquitectura` para `investigador`: la pantalla completa y los gestos del navegador en el teléfono

> 2026-09-24, ciclo 16, ráfaga 5, `T-298`. Pedido de ficha para `ADR-10`
> (`Docs/ARQ/ARQ-pantalla-completa.md`, sección `ADR-10.7`). **No asigno número de `RES-`**:
> `T-282` está escribiendo desde `RES-89`, y el rango lo asigna el hilo principal en
> `Docs/IDS.md`.

## Por qué lo pido y qué no bloquea

`D-47` pidió pantalla completa porque, en el teléfono del usuario, **el scroll horizontal
rompía los controles**. `ADR-10` está escrita para no depender de ninguna API: el modo es de la
página, y la pantalla completa del sistema se pide por detección, solo donde existe. **Nada de
esto frena `T-301`.** Lo que la ficha decide es otra cosa: si hace falta la segunda línea de
`ADR-10.7` (S3), y si el píxel nítido del modo se sostiene en los dos teléfonos que importan
(S4).

**Los dos navegadores que importan:** Safari de iPhone (iOS actual) y Chrome de Android. Firefox
de Android y Samsung Internet suman, pero no son la prioridad.

## Las preguntas, en orden de lo que cuesta equivocarse

1. **(S3, la importante) ¿Qué corta de verdad los gestos del navegador en una página de juego
   táctil?** Hay que saberlo para cada una de estas propiedades, y si hace falta además un
   `touchmove` **no pasivo** con `preventDefault()`, que es la segunda línea que ya dejé
   escrita:
   - `touch-action: none` en un elemento que ocupa la ventana: ¿Safari de iPhone lo respeta
     para desplazar, para el zoom con dos dedos y para el doble toque?
   - `overscroll-behavior: none` en `html` y `body`: ¿desde qué versión lo respeta Safari de
     iPhone? ¿Corta el tirar-para-recargar de Chrome de Android?
   - `overflow: hidden` en `html` y `body` con el contenedor en `position: fixed`: ¿Safari de
     iPhone igual desplaza la página de abajo o hace rebotar la ventana?
2. **(S4) `image-rendering: pixelated` en un `<canvas>`**, cuando la caja CSS no coincide con el
   buffer: ¿los dos navegadores escalan por vecino más cercano? ¿Hay algún caso conocido en que
   Safari lo ignore, por ejemplo con WebGL o con el canvas compuesto por la GPU?
3. **(S1) `Element.requestFullscreen()` en Safari de iPhone**, para un elemento que no es
   `<video>`: ¿existe, con o sin el prefijo `webkit`? ¿Cambió en alguna versión reciente? ¿Y en
   iPad? `D-47` consecuencia 2 lo afirma sin ficha: *"Safari solo la da para video"*.
4. **(S2) `screen.orientation.lock('landscape')`**: ¿en qué navegadores existe? ¿Exige estar en
   pantalla completa? ¿Cómo falla donde no se puede: rechaza la promesa, tira, o no existe el
   método?
5. **(S5) La activación del usuario para `requestFullscreen`**: ¿vale un `click`, un
   `pointerup` o un `pointerdown`? ¿Se pierde si hay un `await` antes de llamarla?
6. **(S6) La muesca**: sin `viewport-fit=cover` en el `<meta name="viewport">`, ¿Safari de
   iPhone en horizontal deja la página afuera de la muesca, sin que haga falta
   `env(safe-area-inset-*)`?
7. **(Para documentar una descartada, no bloquea)** ¿Un sitio agregado a la pantalla de inicio
   de iPhone con un manifiesto `display: fullscreen` o `standalone` se ve sin barras? Lo descarté
   porque le pide a la persona instalar algo (es un molinete), y conviene que el motivo no se
   apoye en un supuesto técnico falso.

## Qué fuentes sirven

Los datos de compatibilidad de MDN (`browser-compat-data`), las notas de versión de WebKit y
Safari, y las especificaciones (Fullscreen API, CSS Overscroll, Pointer Events,
`image-rendering`), cada una con URL y fecha. **Un "se sabe" de un foro no alcanza para S3**:
si no hay fuente firme, que la ficha diga que no hay. En ese caso la prueba es el teléfono del
usuario (`ADR-10`, *"Cómo se verifica"*), y la segunda línea entra por las dudas.

## Qué hago con la respuesta

- Si S3 dice que la hoja no alcanza en alguno de los dos navegadores, `ADR-10.7` pasa la segunda
  línea de "si hace falta" a "va".
- Si S4 dice que `pixelated` no se respeta, `ADR-10.4` toma la salida escrita en sus
  descartadas: rehacer el motor al entrar, con su costo.
- Si S1, S2, S5 o S6 dicen otra cosa, se corrige la frase, y el diseño no cambia, porque todo va
  por detección.
