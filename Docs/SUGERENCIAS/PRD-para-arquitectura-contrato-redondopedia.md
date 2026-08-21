# Propuesta de `producto` para `arquitectura` — contrato de la Redondopedia

> No edito `Docs/ARQ/`. Dejo acá lo que `US-05` y `BR-07`..`BR-09`
> (`Docs/PRODUCTO/PRD-redondopedia.md`) necesitan de un contrato nuevo, para que
> `arquitectura` lo resuelva con su criterio de stack — yo no fijo formato de archivo ni
> schema.

## Contexto

`D-20` ya asigna a `arquitectura` "un contrato nuevo (colección Markdown, frontmatter con
rótulo y fuentes, convención de enlaces internos)". Esta propuesta agrega dos requisitos
concretos que salieron de escribir `US-05` y que conviene tener antes de diseñar el
schema, no después.

## Lo que necesito que el contrato soporte

1. **Rótulo por afirmación dentro del cuerpo, no un campo único a nivel de artículo.** El
   schema del quiz (`CTR-02`) rotula el ítem entero con una casilla. Un artículo de la
   Redondopedia mezcla hecho, leyenda y testimonio en el mismo párrafo (`BR-08`), así que
   un solo campo `rotulo` en el frontmatter no alcanza — hace falta algo dentro del cuerpo
   mismo (una sintaxis Markdown extendida, un componente inline, lo que arquitectura
   decida) que marque el rótulo en el punto exacto del texto.
2. **Un chequeo automatizable del grafo de enlaces internos**, que reporte tres listas
   sobre el conjunto de artículos publicados (`BR-09`): huérfanos (0 enlaces entrantes),
   callejones sin salida (menos de 2 salientes, con la excepción de `leyenda` declarada en
   `BR-09` punto 3), y no alcanzables desde la portada por recorrido en anchura. No lo
   puedo correr yo (`D-12`) — lo dejo especificado para que lo corra quien tenga `Bash`.

## Lo que no pido

No pido una tecnología concreta (no elijo entre frontmatter YAML, MDX, un campo JSON
paralelo, ni ninguna otra alternativa) — eso es criterio de `arquitectura`, coherente con
`D-02`/`D-15` (estático, sin backend).
