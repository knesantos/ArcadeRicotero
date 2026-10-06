# Para `arquitectura`: quién pide la sesión de sonido (`D-66`)

> **De:** hilo principal, 2026-10-06. **Consume:** `D-66`, `INV-200` (`RES-200`..`RES-206`),
> `ADR-04.2`. No se tocó nada de `Docs/ARQ/`.

## Qué pasó

Desde `D-66`, "Adiviná el tema" pone `navigator.audioSession.type = 'playback'` en el toque de
"Empezá", **antes** de `Reproductor.despertar()`. Con eso Web Audio deja de salir por la
categoría de los efectos (`AmbientSound`, la que apaga la llave de silencio del iPhone) y sale
por la de la música (`RES-200`, `RES-201`). Lo hace `src/lib/audio/sesion.ts`, una hoja que no
importa nada, llamada desde `src/scripts/partida-tema.ts` y desde el diagnóstico de audio.

## Lo que `ADR-04` no dice y convendría que diga

`ADR-04.2` fija que el contexto es uno solo y que lo piden prestado el reveal y Skayboy. **No
dice nada de la sesión de sonido de la página**, que es otra perilla: la categoría no es del
contexto, es del documento, y la decide lo primero de esta cadena de WebKit (`RES-200`, punto
1): el pedido de la página, después el micrófono, después cualquier `<audio>` audible, y recién
al final Web Audio.

Propuesta para una enmienda de `ADR-04` (el número es tuyo):

1. **La sesión de la música la pide cada juego que la necesita, desde su isla, antes de
   despertar el contexto.** No la pide `contextoDeAudio()`: el contexto es compartido y la
   sesión de la música no se mezcla, así que pedirla ahí le cortaría la música de la persona a
   quien juega a Skayboy y le haría sonar los efectos con la llave puesta.
2. **Hoy la piden "Adiviná el tema" y el diagnóstico, y nadie más.** `sesion.test.ts` falla si
   Skayboy la pide.
3. **El valor es `playback` y solo `playback`.** `ambient` y `transient` son la misma categoría
   que la llave apaga; `play-and-record` pone el teléfono en modo de grabar (`RES-201`, punto 4).
4. **Si algún día alguien suma un `Permissions-Policy`**, que no apague `microphone`: WebKit
   ignora el pedido sin avisar (`RES-202`, punto 3). `sesion.test.ts` lo mira en `vercel.json` y
   `public/_headers`.

Si preferís que viva adentro de `contexto.ts` con un parámetro (`contextoDeAudio({ musica: true
})`, por ejemplo), es tu llamada: el orden que importa —antes de construir o despertar— se
mantiene igual, y el test del orden se ajusta.
