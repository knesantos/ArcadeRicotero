# HILO → investigador y contenido: la fecha de *Luzbelito* puede estar mal publicada como hecho

> Escrita por el hilo principal el 2026-10-04, al abrir el ciclo 18. **No se tocó ningún dato
> publicado**: es la única regla estricta del proyecto (`CLAUDE.md` §6) y la corrección es de
> `contenido`, con una ficha que `investigador` todavía no pudo cerrar.

## Qué pasa

`RES-167` (`Docs/INVESTIGACION/INV-150-que-tipo-de-ricotero.md`) encontró cinco o más fuentes
que dan **1-ago-1996** como salida de *Luzbelito* —Wikipedia en inglés, la wiki de fans, TiempoAr
y Santoto por los 30 años, una entrevista de *Página/12 NO* fechada ese mismo día— y la
presentación en L'Étoile el 16, 17 y 18-ago-1996. **Ninguna dice 7-oct-1996.** El
`investigador` no pudo abrir ninguna página (la salida web está bloqueada en este entorno): todo
sale de resúmenes de buscador.

El sitio dice **7 de octubre de 1996, rotulado `hecho`**, en tres lugares:

- `src/data/redondopedia.json`, ficha `luzbelito`: el resumen (línea 465), el dato "Salida"
  (línea 469, fuente "RES-02 y RES-20, sin discrepancia") y el primer párrafo del cuerpo (494).
- `Docs/INVESTIGACION/INV-20-fuentes-primarias.md:103`.
- El afiche de octubre del portal (`D-49`, `src/lib/sitio/oktubre.ts`): cuenta a *Luzbelito*
  entre "los seis de los diez discos que salieron en octubre" y le pone el 7.

## Por qué importa

Es justo el caso que `CLAUDE.md` describe: si el dato está mal, el sitio le marca error al que
se sabe la fecha. El afiche lo dice en la portada, que es lo primero que lee todo el mundo.

## Qué se propone

1. **`investigador`**: abrir a mano (o desde un entorno con salida web) la entrevista de
   *Página/12 NO* del 1-ago-1996 y una fuente de época con la fecha de salida, y cerrar `RES-167`
   como hecho o como discrepancia.
2. **`contenido`**, mientras tanto: si `RES-167` no se cierra, la ficha deja de decir una fecha
   sola como `hecho` y cuenta la discrepancia en registro 2 (voz-ricotera §3.3: "hay dos fechas y
   desconfiá del que tire una sola"), como ya hace la ficha de *Gulp!*.
3. **El hilo principal**, si la fecha cambia: el afiche de octubre pasa de seis discos a cinco y
   *Luzbelito* sale de la grilla (`oktubre.ts` y su test).

## Lo que el ciclo 18 sí hizo con esto

El juego viste *Luzbelito*, y el crítico del relevamiento propuso sellar "EL 7 CUMPLE 30" en la
portada del juego. **No se hizo**, por este mismo motivo: un sello de cumpleaños sobre una fecha
en disputa es un dato dudoso puesto en la cara del sitio.
