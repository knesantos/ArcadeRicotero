# Del hilo principal para `experiencia` y `contenido`: la Redondopedia de noche (`D-75`)

> 2026-10-17. Rama `diseno/redondopedia-inmersiva`. La decisión entera, con el porqué, está en
> `Docs/DECISIONES.md`, `D-75`. Esto es lo que les queda a cada uno, sin tocar sus carpetas.

## Para `experiencia` (`T-451`, y `T-450` con el lienzo)

1. **Escribir `UX-39`**, reservado para ustedes en `Docs/IDS.md`: el lugar de la Redondopedia (la
   tapa velada que sube detrás del título y se pierde antes del cuerpo), los tres hilos del pie y la
   portada nueva. El código está en `src/layouts/Base.astro` (prop `lugar`),
   `src/components/TarjetaArticulo.astro`, `src/pages/redondopedia/index.astro` y `[slug].astro`, y en
   los bloques de `sitio.css` marcados con `D-75`.
2. **Enmendar la fila "Redondopedia — un artículo" de `UX-20` §2.** Decía *"Nada de movimiento nuevo"*
   y una capa (el grano) más el detalle flotante. Ahora son dos capas (grano y el lugar), con la deriva
   de §1.4 atada a la salida de la ventana, y el detalle flotante ya no existe. La fila de los tres
   graves no cambia. Tampoco cambia §3.
3. **Mirar dos cosas que se decidieron a ojo** y que son de ustedes:
   - el orden de la portada: oreja, clave, puertas, saltos, índice;
   - que lo ya leído se apague en el índice (`:visited`). Es un mapa de lo que falta y no un estado de
     juego, pero comunica con color solo.
4. **El lienzo (`T-450`).** Pegar la Redondopedia nueva, en la hoja 09 o en una propia. Llegaron primero
   a `tokens.css` `--alto-lugar`, `--aire-lugar`, `--ancho-lugar` y `--textura-rodillo-canto` (la
   racleta de siempre, de canto), como ya pasó con la mesa (`T-319`). No hay ningún hex nuevo.

## Para `contenido` (`T-452`)

1. **Leer los ganchos.** Cada tarjeta muestra el arranque del resumen, cortado en palabra a 110 o 130
   caracteres (`ganchoDe` en `src/lib/redondopedia.ts`). Los resúmenes de los discos arrancan con la
   fecha y el sello, y el gancho queda seco. Si quieren que tiren más, alcanza con reescribir la primera
   frase del resumen: no hay ningún texto aparte que mantener.
2. **Leer la ronda de "Pará la oreja".** Son once arranques de párrafos `leyenda` que **se cuentan**: el
   filtro busca *circula, corre, cuentan, versión, rumor, historia, se repite* (`seCuenta`). Quedó afuera
   la nómina de los Fakires, que es leyenda pero no es rumor. Los graves no prestan ninguno. Si alguna no
   funciona fuera de su artículo, por ejemplo "La quinta, la más repetida de todas…", la salida es
   reescribir el arranque de ese párrafo, no sumar una excepción en el código.
3. **"Los fans" en la prosa** (`voz-ricotera.md` §3.8): *"Cuentan los fans…"* en el Indio y en la leyenda
   de *Ji Ji Ji*, y *"los fans se pasaron de mano en mano"*. Ahora la oreja saca esos párrafos de su
   artículo y los pone en la portada. "Un blog de fans" y "una mesa de fans" están bien: ahí no se
   nombra a la gente.
4. **Las voces.** La tarjeta dice "lo contó Indio Solari" y "lo contaron Indio Solari y Alfredo Rosso"
   con el nombre que va antes de la coma o del paréntesis en `quien`. Si algún `quien` empieza con otra
   cosa que un nombre, la tarjeta lo va a mostrar tal cual.

## Para el que pruebe en un teléfono de verdad (`T-453`)

La deriva del lugar usa `animation-timeline: view()`. Donde no está, la tapa se queda quieta y no pasa
nada más. Desde 46rem hay además una máscara sobre otra: la caja de afuera gasta los costados y la de
adentro el borde de abajo. Las dos cosas hay que mirarlas en Safari de iPhone y de iPad.
