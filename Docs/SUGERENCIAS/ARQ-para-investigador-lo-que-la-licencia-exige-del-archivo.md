# De `arquitectura` para `investigador`: qué le exige una licencia abierta al archivo de recitales

> 2026-09-23, ciclo 16, `T-273`. Es el pedido de ficha de `CTR-19.8`
> (`Docs/ARQ/ARQ-schema-recitales.md`). Los números `RES-` los ponés vos, del rango `RES-76`+
> que `Docs/IDS.md` reservó para el ciclo 16.
>
> **Si `T-281` ya contesta esto, no hace falta otra ficha**: alcanza con que `INV-76` lo diga,
> y yo leo ahí. Lo escribo aparte porque `T-281` pregunta **qué licencia tiene cada fuente**, y
> esto pregunta **qué exige esa licencia de un archivo que junta varias**. Son dos preguntas
> distintas.
>
> **No frena nada.** `CTR-19.8` tiene una tabla diseñada para la lectura más estricta, marcada
> como *supuesto*. Si la ficha dice menos, se afloja la tabla y la forma del archivo no cambia.

## Para qué es

`src/data/recitales.json` junta setlists de varias fuentes abiertas: un recital por entrada, con
su fuente y la licencia de esa fuente. El sitio hace dos cosas con ese material: le agrega a
cada tema el slug del catálogo, o una marca de "fuera de catálogo", y lo guarda en un JSON
público en el repo. Hoy ninguna pantalla lo muestra. El contrato ya supone que el archivo sale
entero bajo **una** licencia (`CTR-19.8`, regla 1). Lo que no puedo escribir de memoria es si
eso hace falta, si alcanza, y qué más exige.

## Las preguntas, en orden de lo que más mueve el contrato

1. **¿Junta y adapta, o solo junta?** Si en un mismo archivo hay recitales tomados de una fuente
   CC BY-SA y de otras con otra licencia, y a cada tema se le agregó el slug, ¿el archivo entero
   queda alcanzado por el "compartir igual"? ¿O se puede declarar una licencia por recital? La
   regla 1 hoy supone lo primero. Si es lo segundo, la licencia pasa al nivel del recital en
   `CTR-19` v2.
2. **¿Qué licencias pueden convivir en una salida CC BY-SA 4.0?** Lo que necesito confirmar es
   si entran CC0, dominio público, CC BY (cualquier versión) y CC BY-SA 3.0. Y, al revés, si una
   fuente con cláusula no comercial (NC o NC-SA) puede ir en el mismo archivo que una BY-SA.
   La tabla supone que no. Cita el texto de la licencia o la página de compatibilidad de
   Creative Commons, no un resumen.
3. **¿Qué exige la atribución, pieza por pieza?** Qué datos hay que dar de cada fuente (autor,
   título, aviso de licencia, enlace), si hay que **decir qué se cambió**, y si alcanza con que
   esos datos viajen **dentro del archivo** (hoy: `nombre`, `sitio`, `licencia.textual`,
   `licencia.url`, `atribucion` por fuente, `url` por recital y un campo `cambios` a nivel
   archivo). De acá sale `RNF-CTR-19-B`, lo mínimo que tiene que mostrar una pantalla el día
   que exista.
4. **MusicBrainz.** `RES-25` registró que *"MusicBrainz licencia sus datos como CC0"*, pero
   para el registro en general. Lo que necesito saber es **en qué parte de su licenciamiento
   caen los setlists de los eventos**: si en la parte CC0 o en otra con otra licencia. Con la
   URL de la página que lo diga.
5. **Wikipedia (o la edición que traiga setlists).** Bajo qué licencia está el texto y las
   tablas de un artículo, y **cómo pide ser atribuida** una tabla sacada de un artículo: enlace
   al artículo, al historial, a los autores.
6. **Si la fuente dice algo sobre la lista en sí.** Algunas fuentes pueden decir que una lista
   de títulos con fecha y lugar es un dato que no protegen, y otras pueden reclamarlo igual.
   Sirve lo que diga **cada fuente de sí misma**, textual. No te pido un dictamen general.

## Lo que no hace falta fichar

- **Los términos de setlist.fm.** `RES-73` los cerró: de ahí el sitio cita un número y guarda
  un índice de enlaces, y el schema de la pieza 2 rechaza cualquier URL de setlist.fm.
- **Si el conteo citado se puede usar.** Lo decidió el usuario en la enmienda de `D-45`.
- **Cuántos recitales trae cada fuente.** Es de `T-281`, y lo recuenta `T-279` con el comando
  (2) de `CTR-19.13`.
