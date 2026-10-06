# Para `experiencia`: el aviso de la llave del iPhone casi no sale más (`D-66`)

> **De:** hilo principal, 2026-10-06. **Consume:** `D-66`, `INV-200`, `US-02` criterio 2.
> No se tocó nada de `Docs/UX/`.

## Qué cambió en pantalla

Desde `D-66` el juego le pide al iPhone la sesión de la música y la llave de silencio deja de
apagarlo. El aviso `SIN_SONIDO.llaveIphone` —en la portada de "Adiviná el tema" y primero en el
panel "¿No se escucha?"— **ahora sale solo en los iPhone que no tienen con qué pedirla** (tope
iOS 15, o 16.3 y menos; `RES-205`). En los demás diría algo que ya no es cierto.

No cambió ninguna cadena ni ningún estilo: cambió la condición.

## Lo que quedó viejo en `Docs/UX/`

- **`UX-24`, contingencias:** cuenta +19-24 px de portada en iPhone por el aviso de la llave.
  En casi todos los iPhone ahora no se suma. La cita `partida-tema.ts:176-187` también corrió de
  línea.
- **`UX-22` §4 (el casete que gira):** nombra la llave de silencio como una de las causas de no
  escuchar. Sigue siendo cierto para los iPhone viejos; el carrete que gira sigue sirviendo para
  el volumen bajo y los auriculares que no responden.

## Una pregunta que queda abierta, por si alguna vez vuelve

Quien pone la llave a propósito —en el colectivo, en la oficina— ahora oye el fragmento que
toca. Es lo que el usuario pidió y lo que ya hacía el tema entero de la revelación. Si alguna vez
se quiere devolverle esa elección a la gente, es un interruptor nuevo, y es tuyo.
