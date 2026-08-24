# Para `arquitectura` — lo que `D-22` te deja en la mesa

> Lo deja el hilo principal. No edito `Docs/ARQ/`. Consume: `D-22` (nueva), `D-06`, `D-14`,
> `ADR-01`, `CTR-01.3`, `CTR-03`, `RES-15`, `RES-20`, `US-02`, `BR-06`.

El usuario decidió el 2026-08-22, textual: *"Vamos a alojar temas enteros en .mp3 seguro."*
Quedó como `D-22` y ya salió de **Fuera de alcance** en `Docs/BRIEF.md` y en `CLAUDE.md`.
Esto no te pide una decisión nueva: te avisa que **`ADR-01` cambió de pregunta**.

## Lo que se cayó

- **`E-07` dejó de importar.** `ESTADO.md` lo tenía como "la pregunta que más pesa" —si un
  usuario free en Argentina puede reproducir a demanda en Spotify, porque de eso dependía
  que alguna vía cumpliera la promesa del brief. Ya no depende: el tema completo lo sirve el
  sitio. Lo mismo `E-04` sobre el embed.
- **Spotify baja de vía a extra.** No digo que se saque —no cuesta nada y suma para el que
  tiene cuenta—, digo que deja de sostener nada. Si se queda o no es pregunta abierta de
  `D-22` y la contesta el usuario; la promesa al jugador la reescribe `producto` (dejé el
  aviso en `BR-06`, que quedó describiendo un sitio que ya no existe).

## Lo que te queda, en orden de cuánto pesa

1. **Dónde viven los archivos.** El proyecto está en GitHub y Vercel construye desde ahí.
   Meter cientos de MB de mp3 al repo versionado es decisión de infraestructura. Es pregunta
   abierta de `D-22` para el usuario, pero la recomendación técnica es tuya.
2. **Cuánto pesa, que ya está calculado y no hace falta que lo repitas.** Contra las
   duraciones de `RES-20` —94 de los 105 temas las traen, suman 385 min— el catálogo son
   **~7,2 horas**: ~300 MB a 96 kbps, ~400 MB a 128, ~600 MB a 192, ~1 GB a 320.
3. **El bitrate es la palanca.** El usuario dijo mp3 y mp3 queda; el bitrate no lo fijó
   nadie. Si el peso resulta la restricción que manda, ahí está el margen.
4. **`CTR-01.3` hay que releerlo.** El tope de 15 s del fragmento venía del techo de cita de
   `RES-03` (8 compases ≈ 16 s). Como postura de derechos quedó sin sentido —`D-14` ya asumió
   el riesgo y `D-22` sirve el tema entero—, pero puede seguir valiendo como parámetro
   técnico del reveal. Decidí cuál de las dos cosas es y dejalo escrito.
5. **`D-06` podría casi desaparecer, y eso es trabajo que le sacás al usuario.** Hoy él
   recorta a mano cada fragmento. Si los pasos del reveal de `US-02` se derivan del mp3
   entero —offset en Web Audio, o rangos de byte— el recorte manual deja de hacer falta.
   Vale la pena que lo confirmes o lo descartes explícitamente: es la consecuencia de `D-22`
   que más horas ahorra.

## Lo único que conviene chequear antes y no después

**Los límites de Vercel para este volumen no están fichados.** `RES-15` ya verificó que en
Hobby **no hay cargo posible** —al agotarse un cupo el recurso se frena, no se factura—, así
que el riesgo no es una factura sorpresa: es que el sitio deje de servir el audio, o que el
repo se vuelva impracticable. Eso necesita `RES-XX` de `investigador`, que es el único rol
con web. Si querés, pedila con la pregunta ya redactada.
