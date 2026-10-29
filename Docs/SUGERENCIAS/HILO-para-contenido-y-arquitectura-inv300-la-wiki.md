# Para `contenido` y `arquitectura`: lo que trajo `INV-300` para la Redondopedia y los juegos

> Del hilo principal, 2026-10-15. Pedido del usuario: *"Hace una vuelta entera de buscar mas
> informacion en la wiki para la web y juegos"*, y *"me refiero a la parte tipo wiki de nuestro
> sitio"*. La ficha es `Docs/INVESTIGACION/INV-300-la-wiki-de-fans-y-lo-que-falta.md`
> (`RES-300`..`RES-336`). Esto es una propuesta: nadie edita la carpeta ajena.

## Para `contenido`: artículos que hoy no existen y tienen con qué escribirse

Por orden de lo que más falta:

1. **`persona` · Walter Sidotti** (`RES-318`) y **`persona` · Sergio Dawi** (`RES-319`): catorce años en
   la formación más conocida y ninguno de los dos tiene artículo. Dawi tiene Wikipedia propia; Sidotti
   sale casi todo de la wiki de fans, así que va con más leyenda que hecho.
2. **`concepto` · Los temas que no están en los discos** (`RES-328`, `RES-329`): el inventario de
   inéditos, el popurrí, los piratas que los hicieron conocidos. Tres partes tienen testimonio del Indio
   en el memoir (Honolulu, *De estos polvos* en el sobre de *Oktubre*, *Mejor no hablar de ciertas
   cosas*).
3. **`disco` · En directo** (`RES-333`): el único disco en vivo, de 1992.
4. **`persona`** · Willy Crook, Tito Fargo, el Piojo Ábalos, el Conejo Jolivet (`RES-320`..`RES-323`), y
   **`concepto` · Los monologuistas** (Mufercho y Symns, `RES-324`, `RES-325`), con el rock teatral del
   principio.
5. **`hito`** · Pan Caliente 1982 (`RES-312`), Racing 1998 (`RES-310`), River 2000 (`RES-309`),
   Olavarría 1997 y Tandil (`RES-308`), la última noche en Córdoba (`RES-307`). Los tres últimos tienen
   partes que van en registro 3 (`CNT-06`): muertes y heridos con nombre.
6. **Para los que ya existen:** `debut-en-obras` (Carlitos del Sur, `RES-311`), `ji-ji-ji` (Olga
   Sudorova, `RES-332`, y el solo de Dawi o de Skay, `RES-319`), `la-formacion` (La Cofradía,
   Diplodocum, Dulcemembriyo, las noches sin el Indio, `RES-313`, `RES-336`), `oktubre` (Melero,
   `RES-327`, `RES-331`).

**Para el quiz**, la tabla de cierre de `INV-300` tiene ocho preguntas con dos fuentes. Lo que sale
solo de la wiki de fans **no va como respuesta correcta** (`RES-301` explica por qué: se contradice).

## Para `arquitectura`: ¿entran 99 listas de la wiki a `recitales.json`?

`RES-300` y `RES-301`: la wiki de fans tiene 99 recitales con lista, de 1978 a 2001, legibles por API,
con licencia CC-BY-SA. `CTR-19.8` ya prevé el caso: el archivo pasa entero a `cc-by-sa-4.0`. Hoy las
fuentes son MusicBrainz y Discogs, las dos CC0 (`INV-425`), así que se pueden mezclar. Lo que hay que
decidir:

- si se acepta que todo `recitales.json` salga BY-SA (y cómo se atribuye en "En vivo");
- si la wiki entra como fuente de pleno derecho o solo para los huecos que Discogs no cubre;
- cómo se marcan las listas con errores conocidos (`RES-301`).

Los scripts que bajan la wiki y sacan las listas están en `Docs/INVESTIGACION/INV-300/`.
