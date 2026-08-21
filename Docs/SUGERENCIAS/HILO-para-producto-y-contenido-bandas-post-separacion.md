# Del hilo principal para `producto` y `contenido` — las bandas ricoteras de después de la separación

- **Fecha:** 2026-08-21
- **Origen:** el usuario, textual: *"hay que agregar a la cultura que luego de la
  separacion nacieron 'bandas ricoteras': La kermesse redonda, 'INDIO y los
  fundamentalistas del aire acondicionado' y 'skay y los fakires'. Estas bandas son parte
  de la cultura redonda y deben estar en la redondopedia"*.
- **Estado: pedido registrado, sin ejecutar.** No es del ciclo 4 (foco: tapas y `US-04`).
  Entra a la Redondopedia — eso lo dijo el usuario y no está en discusión —, pero **falta
  decidir bajo qué tipo y con qué piso**, y falta la ficha que verifique los nombres.

## Lo primero: los nombres van como los dijo el usuario, y nadie los verificó

Los tres nombres de arriba están transcriptos tal cual. **El hilo principal no salió a la
web ni corrigió ninguno** — la web tiene una sola puerta y es `investigador` (`CLAUDE.md`).
Lo que una ficha `RES-XX` tiene que fijar antes de que se escriba un artículo:

- El **nombre exacto y completo** de cada una, con fecha de formación y estado actual.
- **Qué es cada una**, porque probablemente no sean todas lo mismo: una banda propia de un
  integrante de los Redondos no es la misma clase de cosa que una banda de otra gente que
  toca lo ricotero. El artículo cambia según cuál sea.
- Si alguna de las tres **no es lo que parece**, se dice y se ajusta, no se fuerza. Es el
  mismo criterio con que `RES-22` corrigió a `RES-05` sin discutirle al usuario.

Hasta que exista esa ficha, esto es **un pedido con tres nombres**, no contenido citable.

## Dónde encaja en el PRD que ya existe

`BR-07` fijó **seis tipos** de artículo (`disco`, `tema`, `persona`, `hito`/`caso`,
`concepto`, `leyenda`) y **ninguno es `banda`**. Decide `producto`; los caminos que veo:

- **(a) Tipo nuevo `banda`.** Lo más directo si van a ser varias y con ficha propia
  (integrantes, discos, período). Obliga a tocar `BR-07` y el schema.
- **(b) Un `concepto`**: "las bandas ricoteras después de la separación", con enlaces a los
  `persona` de Indio y Skay. Es el camino barato y encaja con el pedido textual del
  usuario, que las nombra **como parte de la cultura**, que es justo lo que el tipo
  `concepto` cubre.
- **(c) Adentro de los artículos que ya existen** (`la-separacion`, `indio-solari`,
  `skay-beilinson`), sin entrada propia. Es el criterio con que `BR-07` dejó las tapas
  adentro de `disco`: *"una tapa no es una entidad que se sostenga sola"*. Acá me parece
  el más flojo — una banda con discos propios sí se sostiene sola —, pero la decisión no
  es mía.

**Y toca el piso.** El piso de `US-05` es 35 artículos con un reparto por tipo. Si estas
bandas suman artículos, o el piso sube o algo se corre; `BR-11` ya tiene escrito el orden
de recorte. Que lo diga `producto` de una, para que `contenido` no escriba contra un
número que después cambia.

## La trampa, y es la parte importante de esta nota

**El material de estas bandas no es de Patricio Rey.** El filtro de los **105 temas de
`RES-20`** existe exactamente por esto: las fuentes de fans mezclan material solista del
Indio y de Skay con el de la banda, y `ESTADO.md` lo dice sin vueltas — *"Si no está, no
es de Patricio Rey"*.

La línea que hay que escribir antes de cargar nada:

- Un **artículo** de la Redondopedia sobre estas bandas es contenido de primera. La
  Redondopedia cuenta la cultura, y esto es cultura.
- Un **ítem de juego** con material de estas bandas **no entra** a `US-01`..`US-04`
  mientras el piso de esos juegos siga definido sobre los 105. Un tema de Los
  Fundamentalistas en "adivinar el tema" le marca error al que se sabe de verdad cuál es
  cuál — que es lo único que el proyecto dejó estricto (`CLAUDE.md`, "qué NO hacer").
- Si `producto` quiere que sí entren, es una decisión escrita con su `BR-XX`, no un
  efecto colateral de haber sumado artículos.

## Lo demás que hay que respetar cuando se escriban

- **`BR-09`**: sin huérfanos ni callejones. Cada artículo nuevo enlaza y es enlazado — los
  candidatos naturales ya están cargados: `la-separacion`, `indio-solari`,
  `skay-beilinson`, `muerte-del-indio`. Hay test que lo verifica (`npm test`).
- **`BR-08`**: rótulo por afirmación. Fechas y formaciones, hecho con fuente; lo que se
  cuenta entre fans sobre estas bandas, leyenda rotulada. `D-14` no cambia acá.
- **Orden real:** ficha `RES-XX` → decisión de `producto` (tipo + piso) → escribe
  `contenido`. Los IDs los asigna la sesión que lo tome, respetando `Docs/IDS.md`.
