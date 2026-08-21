# Propuesta del hilo principal para `arquitectura` — el contrato v0 de la Redondopedia ya corre; formalizarlo

> Contexto: `Docs/SUGERENCIAS/PRD-para-arquitectura-contrato-redondopedia.md` te pedía el
> contrato de la colección de artículos (`US-05`, `BR-07`..`BR-09`). El usuario pidió la
> primera versión navegable en la sesión 2026-08-21, así que el hilo principal construyó
> una **versión v0 de trabajo** para no frenar (mismo criterio que `CTR-02.5` en su
> momento: valor de trabajo, confirmable o corregible por el rol dueño). Nada de esto te
> quita la decisión: si cambiás el contrato, el código tiene un solo lugar que tocar.

## Lo que existe hoy

- **Forma de la colección:** `src/data/redondopedia.json` — un JSON con `articulos[]`,
  no Markdown con frontmatter. Cada artículo: `slug`, `tipo` (los seis de `BR-07`),
  `titulo`, `resumen`, `datos[]` (ficha corta), `cuerpo[]` y `veaTambien[]`.
- **El rótulo por afirmación de `BR-08`** está resuelto en la forma misma: `cuerpo` no es
  un bloque de texto sino una **lista de segmentos**, y cada segmento lleva
  `rotulo` (`hecho`/`leyenda`/`testimonio`), `fuente` (ficha `RES-XX`; puede ser null solo
  en leyenda) y `quien` (solo testimonio). No hay manera de escribir prosa sin rotularla.
- **Enlaces internos:** `[[slug|texto visible]]` dentro del texto de un segmento.
  Parser en `src/lib/redondopedia.ts` (`segmentar`).
- **El chequeo del grafo de `BR-09`** corre como test de nodo en
  `src/lib/redondopedia.test.ts` (`npm test`): huérfanos, callejones (con la excepción
  declarada para `leyenda`), enlaces rotos, y además hace corrible parte de `BR-07`
  (campos mínimos) y `BR-08` (hecho sin ficha RES no valida). `D-12` queda cumplido: lo
  corre cualquiera con `Bash`.

## Lo que te queda a vos

1. **Confirmar o reemplazar el formato.** El PRD sugería "colección Markdown con
   frontmatter"; elegí JSON porque el rótulo por segmento pedía estructura y el banco del
   quiz ya sentó ese precedente. Si preferís MDX/Markdown, `src/lib/redondopedia.ts` y
   las dos páginas de `src/pages/redondopedia/` son los únicos consumidores.
2. **Escribir el `CTR-XX`** que fije: schema JSON corrible (hoy la validación vive en el
   test, no en un `.schema.json` como `CTR-02`), convención de slugs, y el techo de citas
   textuales si un `tema` llega a llevar versos (`RES-03`/`RES-11`).
3. **El tipo `tema` no tiene ningún artículo cargado** a propósito: letra completa +
   filtro de los 105 (`D-13`) es el tipo más caro y el primero en la fila de recorte
   (`BR-11`). El contrato puede fijarle campos antes de que se cargue el primero.
