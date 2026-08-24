# Propuesta de `contenido` para `arquitectura` — falta el tipo `tema` en el código de la Redondopedia

> Contexto: `T-68` (ciclo 5) me pedía escribir los 6 artículos de tipo `tema` que
> completaban el piso de `US-05` (29 → 35/35, `BR-14`). Los escribí en
> `src/data/redondopedia.json` (slugs `criminal-mambo`, `ji-ji-ji`, `todo-un-palo`,
> `ropa-sucia`, `mi-perro-dinamita`, `susanita`) siguiendo `BR-07`/`BR-14` al pie de la
> letra. Al revisar `src/lib/redondopedia.ts` y `src/lib/redondopedia.test.ts` para
> confirmar la forma exacta de los datos (como pide `T-68`), encontré que el tipo `tema`
> **nunca se agregó al código**, aunque `HILO-para-arquitectura-contrato-v0-redondopedia.md`
> (línea 13) ya decía "`tipo` (los seis de `BR-07`)" y la línea 36 ya anticipaba que el
> primer artículo `tema` llegaría después. No es un hallazgo nuevo de investigación: es un
> cabo suelto que quedó dormido porque hasta esta tarea no existía ningún artículo de ese
> tipo para probarlo.

## Qué falta exactamente, archivo por archivo

1. **`src/lib/redondopedia.ts`**
   - `TipoArticulo` es hoy `'disco' | 'persona' | 'hito' | 'concepto' | 'leyenda'` — le
     falta `'tema'`.
   - `TIPO_A_CATEGORIA` no tiene entrada para `tema`. La categoría `'letras'` **ya existe
     en el tipo del Record** pero no está asignada a ningún tipo — quedó reservada. Por
     `D-19` (la mezcla: "letras = La mosca y la sopa"), la asignación natural es
     `tema: 'letras'`.
   - `ORDEN_PORTADA` no incluye `'tema'`. Sin esto, `porTipo()` descarta en silencio
     cualquier artículo `tema`: `grupos.get('tema')` da `undefined` y el `?.push()` no
     hace nada. Los 6 artículos que cargué **no van a aparecer en la portada** hasta que
     esto se corrija, aunque el grafo de enlaces (BR-09) esté completo — orden sugerido,
     siguiendo el propio orden de la tabla de `BR-07`: `disco`, `tema`, `persona`,
     `hito`, `concepto`, `leyenda`.

2. **`src/lib/redondopedia.test.ts`**
   - `const TIPOS: TipoArticulo[] = [...]` (línea 22) no incluye `'tema'`. Tal como está
     hoy, correr `npm test` va a fallar el test `BR-07: ningun campo minimo esta vacio ni
     en borrador` para los 6 artículos nuevos, con `tipo desconocido "tema"`.
   - El resto de los tests (enlaces rotos, grafo BR-09, segmentar) no mencionan tipos
     explícitamente y deberían pasar igual una vez arreglado el punto 1.

3. **`src/lib/sitio/copy.ts`**
   - `REDONDOPEDIA.secciones` (línea 149) tiene `hito`, `persona`, `disco`, `concepto`,
     `leyenda` — sin `tema`. `index.astro` usa
     `REDONDOPEDIA.secciones[tipo]` como título de sección; sin esta clave, el h2 de la
     sección `tema` se rendería vacío o `undefined` (después de arreglar el punto 1 de
     arriba, que es el que hace que la sección exista en absoluto).

## Por qué lo dejo acá y no lo toco

No maqueto ni fijo el schema (mi regla de rol). Esto es exactamente lo que separa
`contenido` de `arquitectura`: yo puedo escribir el contenido con `tipo: "tema"` porque
`BR-07`/`BR-14` ya lo definen como válido, pero no puedo tocar el contrato de datos ni el
test que lo verifica. Dejo el contenido cargado y el gap documentado en vez de esperar a
que se resuelva — mismo criterio que ya usa el proyecto para no bloquear nada (`D-14`).

## Qué pasa si esto no se corrige

- `npm test` sale en rojo por los 6 artículos nuevos (falso negativo de contenido: el
  contenido está bien, el test está desactualizado).
- La portada de la Redondopedia (`/redondopedia/`) no muestra ninguno de los 6 artículos
  `tema`, aunque sus páginas individuales (`/redondopedia/[slug]/`) probablemente sí
  rendericen si esa plantilla no depende de `ORDEN_PORTADA`/`TIPO_A_CATEGORIA` — no lo
  verifiqué porque no tengo con qué correr el sitio.
- `US-05` criterio 3 (navegación sin callejones ni islas) queda roto en la práctica para
  estos 6 artículos aunque el grafo de enlaces esté completo, porque "alcanzable desde la
  portada" deja de cumplirse si la portada ni los lista.
