# Para `investigador`: fichar lacuerda.net, la tercera fuente de letras

> De: hilo principal · Fecha: 2026-08-24 · Consume: `CTR-04`, `D-13`, `D-14`, `RES-23`
> (letras.com), `RES-49` (cifraclub), `src/data/cancionero.json`.
> **Es un pedido acotado y con el molde ya hecho**: es la misma ficha que `RES-49`, sobre
> otro sitio. Hay **21 temas con letra** esperándola para poder entrar al juego de `US-03`.

## Qué pasó

El usuario rehizo el cancionero el 2026-08-24 y el scraper cambió de fuentes. El reparto
de hoy, medido sobre los 104 temas que entraron:

| Fuente | Temas con letra | Ficha |
|---|---|---|
| cifraclub.com | 77 | `RES-49` (`INV-23`) — escrita en el ciclo 7 |
| lacuerda.net | **21** | **ninguna** |
| letras.com | 3 | `RES-23` (`INV-21`) |

`CTR-04` obliga a que cada ítem declare `fuenteLetra` como una lista de fichas `RES-XX`, y
el generador del banco ahora **deja afuera lo que no tiene ficha** y lo dice al correr:

```
sin ficha:      21 temas afuera {"lacuerda.net":21}
```

No se les inventó una ficha ni se estiró `RES-49` para cubrirlas: es el mismo problema de
rótulo que `D-14` dejó como lo único estricto.

## Las tres preguntas, las mismas que respondieron `RES-23` y `RES-49`

1. **Qué es lacuerda.net** y qué tan confiable es su transcripción de la **letra** (no de
   los acordes: de la letra). ¿Es colaborativa? ¿Hay moderación? ¿Declara licencia?
2. **¿Arrastra el error de mezclar catálogos** —material del Indio solista y de Skay
   colado entre el de la banda— que `RES-23` demostró para letras.com y `RES-49` midió
   para cifraclub? El dato está en el repo y lo podés cruzar solo:
   `src/data/cancionero-cuarentena.json` tiene los 45 apartados con su sitio de origen.
3. **¿Hay atribución de quién transcribió?** En cifraclub la hay y `RES-49` concluyó que
   igual no alcanza para el rótulo `testimonio`. Conviene decir si acá pasa lo mismo.

## Dos cosas que ya se saben de esta fuente y conviene que la ficha registre

- **Cifra en notación latina** (`DO RE MI FA SOL LA SI`), no anglosajona. Las otras dos
  usan `A`…`G`. La ingesta ya lo normaliza (`src/lib/cancionero/notacion.ts`), pero es un
  rasgo de la fuente y describe qué clase de sitio es.
- **Trajo cinco temas que ninguna otra fuente tenía con letra**: `divina-tv-fuhrer`,
  `etiqueta-negra`, `fuegos-de-octubre`, `san-telmo` y `scaramanzia` pasaron de
  "solo tablatura" a tener letra. No es una fuente de relleno.

## Cerrá con la misma línea con que cerró `RES-49`

Una recomendación explícita: **si `CTR-04` puede citar la ficha nueva como `fuenteLetra`
para los 21 temas de lacuerda.net, o no.** El generador tiene el mapa en una constante
(`FICHA_POR_SITIO`, en `scripts/generar-letra.mjs`): cuando la ficha exista, es una línea
y una corrida.

**Numeración:** `RES-51` está libre. `RES-49` y `RES-50` se consumieron en el ciclo 7.

## Ojo con esto, que es aparte

Aun con la ficha, **ningún ítem pasa a `listo` automáticamente**: `CTR-04` pide además dos
fuentes de letra o una confirmación de oído, y eso lo decide una persona. La ficha
desbloquea el material, no la partida.
