# INV-76 — Setlists guardables enteros por licencia: MusicBrainz confirmado, Wikipedia/Wikidata sin contenido, y el resto sin vía

> Pedido del hilo principal, tarea `T-281` del ciclo 16. Responde a la enmienda del
> 2026-09-23 de `D-45` (al final de `Docs/DECISIONES.md`): los setlists completos se
> guardan en `src/data/recitales.json` **solo desde fuentes cuya licencia lo permita** —
> setlist.fm no la tiene (`RES-73`, `Docs/INVESTIGACION/INV-73-recitales-setlistfm.md`).
> De setlist.fm el sitio guarda el conteo citado y un índice con enlaces, nunca las
> listas de temas. Esta ficha barre tres frentes que le tocaban a `investigador`:
> MusicBrainz, Wikipedia/Wikidata, y otras fuentes (archive.org, wikis de fans, sitios
> de recopilación).
>
> **Revisión 2026-09-23:** una verificación cruzada de esta misma ficha encontró que
> `RES-77` describía mal el setlist de ejemplo ("21 temas + 3 encores" y "dos líneas sin
> MBID"). Volví a la fuente pidiendo el campo `setlist` textual y completo (no un
> resumen) y lo conté línea por línea a mano — un primer pedido resumido por el propio
> `WebFetch` dio todavía un tercer número distinto, lo que confirma que el error salía de
> sumarizar en vez de contar el texto crudo. La corrección queda en la tabla de abajo,
> con el detalle línea por línea documentado. El resto de los hallazgos (`RES-76`,
> `RES-78` a `RES-88`) fueron confirmados por la verificación cruzada y no se tocan.
>
> **Consume:** `D-45` (enmienda 2026-09-23), `RES-73` a `RES-75` (`INV-73`, términos de
> setlist.fm y el catálogo de 105/104 temas), `RES-20`.
>
> **Afecta:** `CTR-19` (`T-273`, el schema y la vía de obtención de
> `src/data/recitales.json`), `T-279` (el barrido de ingesta completo).
>
> **Numeración de este archivo:** `RES-76` a `RES-88`, del rango `RES-73`+ que
> `Docs/IDS.md` reserva al ciclo 16 (`RES-73` a `RES-75` ya usados por `INV-73`). **Ojo:**
> el pedido de esta ráfaga de corrección instruía numerar desde `RES-76` para hallazgos
> nuevos, lo que choca con la numeración que esta misma ficha ya reclama — ver "Sin
> resolver".
>
> Fecha de consulta de todo lo que sigue: **2026-09-23**.
>
> **Escrita por `investigador`; pegada por el hilo principal**, porque el rol es de solo
> lectura y no tiene con qué escribir en su propia carpeta.

---


> **Nota del hilo principal al pegar (2026-09-24): no hay colisión de números.** La ficha pregunta por la numeración: `RES-76` a `RES-88` son de este archivo y de nadie más. `Docs/IDS.md` reservó `RES-73`+ para el ciclo 16, `INV-73` tomó `RES-73`..`RES-75`, y `T-281` escribe desde `RES-76` en `INV-76`, que es lo que hizo. El próximo libre es `RES-89`.

## Frente 1 — MusicBrainz: licencia CC0 confirmada, cobertura real de 2 recitales

| # | Hallazgo | URL | Estado |
|---|---|---|---|
| `RES-76` | MusicBrainz tiene eventos de la banda con setlist cargado, pero son solo **2**, no decenas ni cientos. Vía `search` (`/ws/2/event?query=artist:"Patricio Rey y sus Redonditos de Ricota"&fmt=json`) y vía `browse` por MBID de artista (`/ws/2/event?artist=956301d0-4b3c-4ffc-9898-b39305d25112&fmt=json`) coinciden en `event-count: 2`: **1995-12-08** y **1995-12-09**, Costa Chaval, Concordia, Entre Ríos | https://musicbrainz.org/event/168415b3-7053-4b2b-9c0c-57cf13cf9f7f · https://musicbrainz.org/event/aff403c7-63d4-4122-a71b-8ae87e7cd729 | verificado |
| `RES-77` | Ejemplo de setlist completo tal como lo devuelve la API (evento del 9/12/1995: **20 temas de repertorio principal + 5 en tres encores — Encore: 2, Encore 2: 2, Encore 3: 1 — 25 en total**), con MBID de "work" (composición canónica) enlazado a la gran mayoría de los temas, formato wiki-markup `* [MBID\|Título]`. Cita verbatim del campo `setlist` crudo (recuento línea por línea, no resumido): `* [52c99c58-8190-4540-b6cd-8183fcd19696|El pibe de los astilleros]` … `* [63817b18-2af0-468d-95a6-90ea9ad3dd63|Desde el alma] (Vals; played with the crowd)` … `* Es un sentimiento (played with the crowd)` … `# Encore 3 / * [09d69bf6-d2b7-33a9-a7b4-5c87e4a35bb8|Jijiji]`. **Una sola línea sin MBID de work**: "Es un sentimiento (played with the crowd)" — "Desde el alma" sí trae MBID; la anotación "(Vals; played with the crowd)" es un comentario fuera del corchete, no reemplaza el identificador | https://musicbrainz.org/ws/2/event/aff403c7-63d4-4122-a71b-8ae87e7cd729?fmt=json | verificado (corregido 2026-09-23, ver nota abajo) |
| `RES-78` | Licencia: MusicBrainz separa **core data (CC0)** de **datos suplementarios (CC BY-NC-SA 3.0)**. Cita textual: *"The core data of the database is licensed under the CC0, which is effectively placing the data into the Public Domain."* El desglose confirma que Events y su campo `setlist` están adentro de core data: *"Events \| Name, aliases, type, begin and end dates, time, setlist, disambiguation comment, MBID..."*, bajo "Data overview → Core data" | https://musicbrainz.org/doc/About/Data_License · https://musicbrainz.org/doc/MusicBrainz_Database | verificado |
| `RES-79` | Acceso a la API: **sin API key** (*"Currently, no"*), límite duro de **1 pedido/segundo** por aplicación (*"never make more than ONE call per second"*, riesgo de bloqueo de IP si se excede), **User-Agent** identificable obligatorio en el header. Formato: agregar `?fmt=json` a cualquier endpoint `/ws/2/...`. Nota operativa: las páginas HTML normales de musicbrainz.org devolvieron un check de verificación de navegador — usar siempre la API JSON, no scrapear el HTML | https://musicbrainz.org/doc/Development/JSON_Web_Service · https://musicbrainz.org/doc/MusicBrainz_API/Rate_Limiting | verificado |
| `RES-80` | El MBID de la banda, que `RES-73.5` (`INV-73`) había dejado "no verificado del todo" (una sola fuente), queda confirmado por una segunda vía independiente (API `/ws/2/artist?query=...&fmt=json`, score 100): `956301d0-4b3c-4ffc-9898-b39305d25112`. Cierra ese pendiente de `INV-73` | https://musicbrainz.org/ws/2/artist?query=Patricio%20Rey%20y%20sus%20Redonditos%20de%20Ricota&fmt=json | verificado |

> **Nota de corrección (2026-09-23) sobre `RES-77`:** la primera versión de esta ficha
> decía "21 temas + 3 encores" y "dos líneas sin MBID de work" (y esta última afirmación
> ya era internamente inconsistente: solo citaba un ejemplo pese a decir "dos"). Una
> verificación cruzada marcó ambas cosas como distintas de lo que devuelve la API. Volví
> a la fuente pidiendo el campo `setlist` textual completo, sin resumir ni contar por mí
> — y lo conté a mano sobre ese texto crudo. Resultado: **20 líneas en el repertorio
> principal** (de "El pibe de los astilleros" a "Ya nadie va a escuchar tu remera") más
> **2 + 2 + 1 = 5** en tres secciones de encore, **25 en total**; y de esas 25 líneas,
> **24 traen MBID de work y 1 no** ("Es un sentimiento, played with the crowd"). Ojo
> metodológico para quien reuse esta fuente: un primer pedido a `WebFetch` con la
> instrucción de "contar" (en vez de "copiar textual") devolvió un tercer número distinto
> (21+2+2+1=26, dos líneas sin MBID) — el resumen automático de un modelo chico no es
> confiable para conteo exacto; hay que pedir el texto crudo y contar aparte.

**Licencia textual (síntesis):** CC0, dominio público efectivo, sin exigencia de
atribución (aunque MusicBrainz la pide como buena práctica, no como condición).
**¿Deja guardar?** Sí. **Recitales con temas que trae:** 2 de 2 eventos cargados
(1995-12-08 y 1995-12-09, Costa Chaval, Concordia). **Cómo escribe los títulos contra
los 105:** no como texto suelto sino con **MBID de "work"** enlazado a la gran mayoría
de los temas (24 de 25 líneas en el evento relevado, `RES-77`) — permite matchear por ID
en vez de por título normalizado en la mayoría de los casos, lo que evita el problema de
variantes de grafía que `RES-75` (`INV-73`) documentó para setlist.fm; la única línea sin
ID ("Es un sentimiento", tocada con el público) va a necesitar matcheo por título como
respaldo. **No se hizo en esta ronda** el cotejo tema por tema de esos MBID contra
`src/data/cancionero.json`; queda para quien construya la ingesta.

---

## Frente 2 — Wikipedia y Wikidata: licencia favorable, cero contenido de setlists

| # | Hallazgo | URL | Estado |
|---|---|---|---|
| `RES-81` | Ni `es.wikipedia.org` ni `en.wikipedia.org` tienen artículo o anexo con el setlist de un recital puntual (Obras 1989, Huracán 93/94, River 2000, Racing 98, Olavarría/Tandil 97): los shows se mencionan como hito narrativo, nunca como lista de temas. El "Anexo:Canciones de Patricio Rey..." es índice alfabético por disco, no por show; no existe "Anexo:Giras" ni "Anexo:Conciertos" para la banda (sí existe ese formato para otras bandas, ej. Queen, AC/DC — confirma que el molde existe en Wikipedia pero no se aplicó acá) | https://es.wikipedia.org/wiki/Los_Redonditos_de_Ricota · https://en.wikipedia.org/wiki/Patricio_Rey_y_sus_Redonditos_de_Ricota · https://es.wikipedia.org/wiki/Anexo:Canciones_de_Patricio_Rey_y_sus_Redonditos_de_Ricota | verificado |
| `RES-82` | El ítem de Wikidata de la banda (Q3136643) no tiene properties de conciertos, giras ni setlists: solo instance-of, fecha de formación, género, miembros e IDs externos (MusicBrainz, Spotify). No hay ítems Q de conciertos puntuales de esta banda con lista de temas | https://www.wikidata.org/wiki/Q3136643 | verificado |
| `RES-83` | Licencias, cita textual. Wikipedia: **CC BY-SA 4.0**, exige atribución — *"provide credit to the original authors... by including a hyperlink... or a list of all authors"* — y copyleft sobre lo modificado. Wikidata: **CC0** — *"All structured data in the main, property and lexeme namespaces is made available under the Creative Commons CC0 License"* — sin exigencia de atribución | https://en.wikipedia.org/wiki/Wikipedia:Reusing_Wikipedia_content · https://www.wikidata.org/wiki/Wikidata:Licensing | verificado |
| `RES-84` | Conclusión directa: **cero** recitales con lista de temas se pueden armar hoy desde Wikipedia o Wikidata para esta banda — ninguno de los dos guarda ese dato (`RES-81`, `RES-82`), así que la licencia favorable (`RES-83`) no tiene contenido sobre el que aplicarse todavía | — | verificado |

**Por fuente:**
- **Wikipedia (ES/EN)** — licencia: CC BY-SA 4.0, exige atribución (`RES-83`). ¿Deja
  guardar? Sí, la licencia lo permite. Recitales con temas: 0 (`RES-81`). Títulos: no
  aplica, sin contenido.
- **Wikidata** — licencia: CC0, sin atribución (`RES-83`). ¿Deja guardar? Sí. Recitales
  con temas: 0 (`RES-82`). Títulos: no aplica.

---

## Frente 3 — Otras fuentes: sin licencia clara, o con contenido inaccesible

| # | Hallazgo | URL | Estado |
|---|---|---|---|
| `RES-85` | archive.org, colección de grabaciones de fans con tracklist por show (ej. "Estadio Córdoba 2001" CD2, 14 temas, confirmado exacto: Sheriff...Un ángel para tu soledad, subido 2024-09-29 por 'Moreno Musica (Arg)'; "Estadio Centenario Montevideo 2001", 11 temas, **sin re-chequear en la ronda de verificación**): **sin licencia declarada** en la metadata JSON del ítem — ni campo `licenseurl` ni `rights` | https://archive.org/metadata/patricio-rey-y-sus-redonditos-de-ricota-estadio-cordoba-cd2-2001 | verificado (ausencia de licencia) |
| `RES-86` | Wiki Redonditos en Fandom (`redonditos.fandom.com`) tiene una página "Lista de conciertos de Patricio Rey y sus Redonditos de Ricota" con fechas desde 1977-11-26. La licencia **general** de toda wiki Fandom es CC-BY-SA 3.0 Unported por defecto, confirmada en la página de ayuda del sitio — pero **no se pudo leer el contenido de esa página puntual**: `fandom.com` y `wikia.com` devolvieron HTTP 402 en todo intento (página directa, API de MediaWiki, dominio alternativo), así que no se sabe si lista temas por show | https://redonditos.fandom.com/es/wiki/Lista_de_conciertos_de_Patricio_Rey_y_sus_Redonditos_de_Ricota · https://community.fandom.com/wiki/Help:Licensing | licencia general verificada; contenido de la página **sin verificar** (bloqueo de herramienta, HTTP 402) |
| `RES-87` | redondossubtitulados.com declara textualmente **"Todos los derechos reservados"** en el pie del sitio (confirmado: "© Copyright 2011 - 2026 Redondos Subtitulados" seguido de "Todos los derechos reservados"). Trae fecha y lugar de ~18 recitales (1985–2001) con links a YouTube, sin lista de temas confirmada — y aunque la trajera, la licencia lo prohíbe | https://redondossubtitulados.com/patriciorey/ | verificado |
| `RES-88` | rock.com.ar: no se encontró licencia declarada en el sitio, y no se halló contenido propio de recitales o setlists en el barrido hecho a portada y enciclopedia | https://rock.com.ar/ | verificado |

**Por fuente:**
- **archive.org** — licencia: no declarada. ¿Deja guardar? **No** (sin garantía de
  derechos; los TdS de archive.org dejan el uso a riesgo del reusuario). Recitales con
  temas: sí trae tracklists (2 ejemplos relevados, uno confirmado en 14 temas), pero el
  barrido no cubrió toda la colección. Títulos: no cotejados contra los 105 en esta
  ronda.
- **Fandom (Wiki Redonditos)** — licencia: CC-BY-SA 3.0 Unported (general del sitio,
  con atribución). ¿Deja guardar? **No se sabe** — la licencia parece favorable pero el
  contenido de la página puntual no se pudo leer. Recitales con temas: sin verificar.
  Títulos: no aplica, sin acceso.
- **redondossubtitulados.com** — licencia: "Todos los derechos reservados" (textual).
  ¿Deja guardar? **No**. Recitales con temas: ~18, sin lista de temas confirmada.
  Títulos: no aplica.
- **rock.com.ar** — licencia: no declarada. ¿Deja guardar? **No** (de hecho no hay
  contenido que guardar). Recitales con temas: 0. Títulos: no aplica.

---

## La recomendación (`investigador`, no un hallazgo con fuente propia)

Con lo relevado en `T-281`, la única fuente que hoy combina **licencia confirmada
favorable y contenido real de setlist** es **MusicBrainz**: core data CC0 (`RES-78`),
con 2 recitales completos disponibles ahora mismo (`RES-76`, `RES-77`) y una vía de
consulta clara (sin clave, 1 req/seg, User-Agent, `RES-79`). Recomiendo arrancar
`src/data/recitales.json` desde esos 2 eventos, citando **fuente: MusicBrainz** y la
URL del evento por entrada — no porque CC0 lo exija (no exige atribución), sino porque
es la buena práctica que el propio proyecto ya sigue en `CNT-01` (mapa de qué se usa y
de dónde salió) y porque el MBID de "work" que trae la gran mayoría de los temas
(24 de 25 líneas en el evento relevado, `RES-77`) es un ancla más firme que el texto
libre para el cruce contra `src/data/cancionero.json`. **Ojo con la cobertura real:** no
es "todos los temas tienen MBID" — una línea del setlist (un tema tocado "con el
público") no trae identificador y va a necesitar respaldo por título normalizado.

Eso **no cierra** el pedido del usuario de "guardar los setlists que encuentre": 2
recitales sobre los ~256 que indexa setlist.fm (`RES-74`, `INV-73`) es una semilla, no
un reemplazo. Wikipedia y Wikidata tienen licencia igual de favorable pero cero
contenido hoy (`RES-81` a `RES-84`): quedan como fuente a revisar si algún día alguien
carga un anexo de giras. El frente más prometedor sin cerrar es **Fandom** (`RES-86`):
licencia general favorable, contenido probablemente presente (la página existe con
fechas desde 1977), pero bloqueado por un error HTTP 402 en toda esta ronda — no es un
hallazgo de licencia desfavorable, es un bloqueo de herramienta y vale la pena
reintentarlo por otra vía. El resto (archive.org, redondossubtitulados.com,
rock.com.ar) no ofrece una vía limpia: sin licencia declarada o con derechos
reservados explícitos.

---

## Sin resolver

- Por qué MusicBrainz solo tiene 2 de los ~256 recitales que indexa setlist.fm — no se
  determinó si es un import parcial viejo o una carga manual aislada de un usuario.
- Los MBID de "work" de `RES-77` no se cotejaron en esta ronda contra los 105 títulos
  de `src/data/cancionero.json` (`RES-20`) — el informe solo describe el formato y
  confirma que 24 de 25 líneas del ejemplo traen ID.
- `redonditos.fandom.com`: la página "Lista de conciertos..." no se pudo leer en ningún
  intento (HTTP 402 en página directa, API de MediaWiki y dominio alternativo) — no se
  sabe si trae temas por show, aunque la licencia general del sitio es favorable.
- archive.org: no se determinó cuántos shows de la colección completa traen tracklist
  ni con qué cobertura total — solo se relevó a fondo un ejemplo puntual (14 temas,
  confirmado); el segundo ejemplo citado (Estadio Centenario Montevideo, 11 temas)
  quedó sin re-chequear en la ronda de verificación cruzada.
- **Colisión de numeración (hallazgo de proceso de la verificación cruzada):** esta
  ficha reclama `RES-76` a `RES-88` para sus trece hallazgos, pero el pedido de esta
  ráfaga de corrección indicaba numerar hallazgos nuevos "desde `RES-76`" también. Antes
  de pegar esta ficha (y cualquier otra que use ese rango) en `Docs/INVESTIGACION/`, el
  hilo principal tiene que fijar qué numeración prevalece — no lo resuelvo yo porque
  tocar la numeración de una ficha ajena a esta tarea excede lo que `T-281` me pidió.
- Método: las respuestas de las APIs (MusicBrainz) y las páginas de Wikipedia/Wikidata
  se leyeron vía `WebFetch` (que resume con un modelo chico), no con `fetch` crudo de
  JSON/HTML — no hay forma de auditar byte a byte sin `curl`, no disponible en estas
  sesiones. La corrección de `RES-77` en esta misma ronda es evidencia directa del
  riesgo: pedirle a `WebFetch` que "cuente" da un número; pedirle que "copie textual" y
  contar a mano da otro, y solo el segundo se sostuvo contra el texto crudo.

## Siguiente

- **`arquitectura`** (`CTR-19`, `T-273`): puede tratar MusicBrainz como fuente válida y
  confirmada para "guardar setlists enteros" bajo la enmienda de `D-45` — con la
  cobertura real acotada a 2 recitales (`RES-76`) de 25 temas totales en el ejemplo
  citado, 24 con MBID de work y 1 sin (`RES-77`, corregido). No reemplaza el
  conteo/índice citado de setlist.fm (`RES-73` a `RES-75`, `INV-73`), que sigue siendo
  solo citable, no guardable entero.
- **Hilo principal**: resolver la colisión de numeración antes de pegar fichas de esta
  ráfaga y de `T-281` en `Docs/INVESTIGACION/` (ver "Sin resolver").
- **Hilo principal / `investigador`** (próxima ráfaga, si se pide): reintentar el
  acceso a `redonditos.fandom.com` por otra vía (navegador, `curl`) para confirmar si
  su "Lista de conciertos" trae temas por show — es el único frente con licencia
  potencialmente favorable y contenido todavía sin confirmar (`RES-86`).
- **`producto`/`arquitectura`**: decidir si la atribución "fuente: MusicBrainz + URL
  del evento" entra al schema de `recitales.json` como campo obligatorio por entrada,
  dado que mezclar fuentes (MusicBrainz hoy, transcripción manual futura) exige que
  cada recital declare de dónde salió.
