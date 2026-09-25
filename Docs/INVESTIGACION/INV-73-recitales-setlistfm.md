# INV-73 — Los setlists de setlist.fm: licencia y vía, cobertura, y cruce contra el catálogo (105 según `RES-20`, 104 en el archivo vigente)

> Pedido del hilo principal, tarea `T-269` del ciclo 16. Responde a `D-45` (al final de
> `Docs/DECISIONES.md`): *"Fácil" en `US-02` son los 8 temas más tocados en vivo según
> setlist.fm, y los setlists se guardan enteros* en `src/data/recitales.json`. `D-45` quedó
> **aceptada con una condición**: que la ficha de cobertura muestre que alcanza para ordenar
> el primer puñado de temas sin que el azar decida un empate. Incluye también el pedido
> textual del usuario: *"Guardemos los setlist que encuentre también"*.
>
> **Esta versión corrige la anterior tras una verificación cruzada (2026-09-22).** Ver
> "Correcciones de esta ronda" abajo para el detalle de qué cambió y por qué.
>
> **Consume:** `D-45`, `BR-18` apartados (f)/(g), `BR-28`, `D-27`, `CTR-07.7`, `RES-05`,
> `RES-20` (los 105 títulos del catálogo — ver corrección), `RES-51`, `RES-52` (el
> precedente de YouTube: criterio de canónico + atribución), `D-14`.
>
> **Afecta:** `CTR-19` (`T-273`, el schema de `src/data/recitales.json`), `BR-18` apartado
> (h) (`T-274`, la vara de Fáciles), `T-279` (el barrido de ingesta completo, que es trabajo
> aparte de esta ficha exploratoria).
>
> **Numeración de este archivo:** `RES-73` (términos, licencia y vía), `RES-74` (cobertura,
> top y el índice), `RES-75` (títulos contra el catálogo), del rango `RES-73`+ que
> `Docs/IDS.md` reserva al ciclo 16.
>
> Fecha de consulta de todo lo que sigue: **2026-09-22**.
>
> **Escrita por `investigador`; pegada por el hilo principal**, porque el rol es de solo
> lectura y no tiene con qué escribir en su propia carpeta.

---

## Correcciones de esta ronda (verificación cruzada, 2026-09-22)

| Dónde | Decía | Ahora dice | Por qué |
|---|---|---|---|
| `RES-73.4` | "Límite estándar: 2 pedidos/seg y 1.440/día" | **El estándar es 16/seg (8 en ráfaga) y 50.000/día; el 2/seg y 1.440/día es un tier reducido/básico, no el estándar** | La ficha tenía la polaridad invertida. Re-fetch directo del mismo hilo del foro, cita textual abajo |
| `RES-75` | "Divina TV. Führer", puesto 6, 69 reproducciones | **Se sostiene: 69**, confirmado en la página propia de la canción | Un snippet de búsqueda indexado (no la página viva) mostraba 67 — se descarta por desactualizado, no se promedia |
| `RES-75` | "Un tal Brigitte Bardot", puesto 4, 80 reproducciones | **Se sostiene: 80**, confirmado por fetch directo a la fuente primaria | Un snippet separado decía 79 — se descarta como ruido de indexación frente al fetch directo, no se promedia |
| Cruce con `RES-20` | "105 títulos del catálogo" | **El archivo vigente hoy (`src/data/cancionero.json`) tiene 104**, no 105 (`grep -c '"slug"'` y `grep -c '"titulo"'` dan 104 y 104) | Hallazgo nuevo de la verificación cruzada, no se pudo reconciliar en esta pasada — ver "Sin resolver". **No se promedia ni se elige una: quedan las dos versiones**, `RES-20` diciendo 105 y el archivo diciendo 104, hasta que `arquitectura`/`contenido` lo reconcilien |

Lo demás de la ficha original —`RES-73.1`, `RES-73.2`, `RES-73.3`, el total de 256
setlists, el top-25 completo y el orden de los puestos 9 a 13 (re-confirmados
verbatim: 58/57/55/53/52)— **se sostuvo exacto** en la reverificación y no cambia acá.

---

## RES-73 — Términos de uso, licencia de la API, y la vía que no choca con `D-45`

| # | Hallazgo | URL | Estado |
|---|---|---|---|
| `RES-73.1` | El sitio otorga solo una **licencia limitada para *ver*** el contenido, sin fines comerciales; prohíbe expresamente reproducirlo, modificarlo, enmarcarlo o distribuirlo, y prohíbe bots/scrapers para bajarlo (única excepción: buscadores públicos indexando) | https://www.setlist.fm/help/terms | verificado |
| `RES-73.2` | `robots.txt` bloquea explícitamente herramientas de bajado masivo (wget, HTTrack, WebZIP, Xenu, Teleport, etc.) y pide velocidad baja | https://www.setlist.fm/robots.txt | verificado |
| `RES-73.3` | **El choque real con `D-45`:** el TdS de la **API** prohíbe retener sus datos más allá de un *"cache de corto plazo"* y exige llamarla y mostrar el dato *"de inmediato"* — lo opuesto de "guardar los setlists enteros para siempre" en un JSON versionado. Esta cláusula rige **si se usa la API**; si el dato se transcribe a mano desde las páginas públicas, esta cláusula puntual no aplica, pero sigue rigiendo `RES-73.1` (no reproducir el Contenido, no usar bots) | https://www.setlist.fm/help/terms | verificado |
| `RES-73.4` **(corregido)** | La API es gratis para uso no comercial con clave (se pide desde la cuenta, registro gratuito). El foro oficial distingue dos tiers: **estándar, "max. 16.0/second and max. 50000/DAY"** (con ráfaga de hasta 8 pedidos concurrentes), y un **tier reducido/básico con "1440/day limit"** y hasta 2 pedidos/seg — el 1.440/día **no** es el límite estándar, es el del tier más restringido. Dato de fuente secundaria (foro, no doc formal), **confianza media** | https://api.setlist.fm/docs/1.0/index.html (no lista límites — remite al foro) · https://www.setlist.fm/forum/setlistfm/setlistfm-api/error-429-13d67dd5 | verificado (polaridad corregida; número de fuente secundaria) |
| `RES-73.5` | El MBID de la banda en MusicBrainz (`956301d0-4b3c-4ffc-9898-b39305d25112`) no se pudo re-confirmar con un segundo pedido directo (MusicBrainz devolvió verificación de navegador) | https://musicbrainz.org/artist/956301d0-4b3c-4ffc-9898-b39305d25112 | **no verificado del todo** — una sola fuente |
| `RES-73.6` | Hay decenas de recitales de la banda ya cargados en setlist.fm, confirmando cobertura real para consultar (ver `RES-74`) | https://www.setlist.fm/setlists/patricio-rey-y-sus-redonditos-de-ricota-bd615a2.html | verificado |

**Vía recomendada (criterio de `investigador`, no un hallazgo con fuente propia):** transcripción manual de fecha/lugar/temas desde las páginas públicas, con URL y fecha de consulta por entrada — no reproduce HTML ni diseño, no usa bots, y es la que mejor calza con `D-14`/`RES-23` (sin fuente oficial y se usa igual, rotulada). La API sirve como apoyo de *consulta* puntual (respetando el límite del tier que corresponda a la clave usada, `RES-73.4`, y la atribución que exige el TdS), no como fuente para archivar en bruto — eso sí chocaría con `RES-73.3`. Scraping automatizado por fuera de la API está prohibido sin ambigüedad (`RES-73.1`, `RES-73.2`) y no se recomienda bajo ninguna forma. **La decisión final de vía es de `arquitectura`/hilo principal** (`CTR-19`, `T-273`), no mía.

---

## RES-74 — Cobertura, el top más tocado, y el índice de recitales

Fuente: página del artista y `/stats/` en setlist.fm.
https://www.setlist.fm/setlists/patricio-rey-y-sus-redonditos-de-ricota-bd615a2.html ·
https://www.setlist.fm/stats/patricio-rey-y-sus-redonditos-de-ricota-bd615a2.html —
consultado 2026-09-22 — **verificado, con una salvedad de método** (ver abajo). Re-fetch
de esta ronda: total y top-15 **exactos, sin cambios**.

- **Total cargado:** 256 setlists (1977–2001) según la página de stats — re-confirmado
  exacto en esta ronda. La paginación (26 páginas × ~10, la última con 5) suma 255 —
  **desvío de 1, sin resolver**.
- **Cuántos setlists traen al menos un tema:** no se pudo contar sobre los 256 (solo se
  leyeron 6 de 26 páginas). Sobre una **muestra verificada de 50** (páginas 1 a 5): **46
  traen al menos un tema y 4 figuran "No setlist"**. Extrapolar esa proporción (92%) a los
  256 sería una estimación, no un conteo — no se hace acá. **No se pudo reverificar en
  esta ronda** (no se recorrió de nuevo la muestra); sigue como estimación sobre lectura
  parcial, tal como la marcaba la versión anterior.
- **El top más tocado** (top-25 de la página de stats, re-confirmado verbatim vía fetch
  directo en esta ronda, incluidos los puestos 9 a 13): Jijiji 101 · Ñam fri fruli fali fru
  93 · Vamos las bandas 90 · Un tal Brigitte Bardot 80 · Nadie es perfecto 71 · Divina TV.
  Führer 69 · Nene nena 68 · Nueva Roma 61 · Mi perro dinamita 58 · La bestia pop 57 ·
  Aquella solitaria vaca cubana 55 · La parabellum del buen psicópata 53 · Unos pocos
  peligros sensatos 52 · Ya nadie va a escuchar tu remera 50 · Queso ruso 49 · Rock para
  los dientes 49 · Ella debe estar tan linda 47 · Barbazul vs. el amor letal 46 · Roto y
  mal parado 45 · El pibe de los astilleros 44 · Maldición, va a ser un día hermoso 44 ·
  Mariposa Pontiac 43 · Masacre en el puticlub 41 · Música para pastillas 41 · Semen Up 41.
- **Salvedad de método, importante:** esas columnas de conteo (temas por setlist en las
  páginas leídas) salieron de un **modelo chico resumiendo HTML** (`WebFetch`), no de HTML
  crudo parseado, y por eso el total 255/256 sigue sin cerrar. El top-25 sí se re-confirmó
  esta ronda con dos fetches independientes que coinciden dígito por dígito, así que ese
  bloque específico tiene más respaldo que el resto de las columnas resumidas.
- **El índice de recitales** (40 entradas completas, con fecha, lugar, ciudad, cantidad de
  temas y URL, de las páginas 1, 3, 4 y 5) se guarda tal cual lo devolvió el investigador,
  **aparte, en el anexo de esta ficha** — no se transcribe entero acá. Quedan **20 de 26
  páginas sin leer** (~200 recitales sin indexar todavía); ese barrido completo es trabajo
  de `T-279`, no de esta ficha exploratoria.

---

## RES-75 — Los títulos de setlist.fm contra el catálogo local

Método: cruce de 6 setlists completos (1985–2000, una época distinta cada uno) más la
página de stats, contra los títulos de `RES-20`. Consultado 2026-09-22 — **verificado
como muestra dirigida, no como barrido completo**.

- **Corrección de esta ronda — cuántos títulos tiene el catálogo:** `RES-20` y la ficha
  original citan "105 títulos". `grep -c '"slug"'` y `grep -c '"titulo"'` sobre
  `src/data/cancionero.json` (tal como está hoy) dan **104**, no 105. **Quedan las dos
  cifras sin promediar**: `RES-20` dice 105, el archivo vigente hoy dice 104. No pude
  determinar en esta pasada si es un tema dado de baja después de `RES-20`, un duplicado,
  o un error de conteo en `RES-20` — queda para `arquitectura`/`contenido` (ver "Sin
  resolver" y "Siguiente"). **No cambia el resultado del filtrado del top-8** (ver más
  abajo): los mismos dos temas quedan afuera del catálogo sea cual sea la cifra exacta.
- **La inmensa mayoría de los títulos coincide textualmente o con variación trivial**
  (mayúscula/minúscula). Las diferencias reales: tildes (`Fanfarría`/`Fanfarria` — y ojo,
  puede ser al revés en "frufi"/"fruli", conviene que `contenido` recoteje contra el
  vinilo), abreviatura (`vs.` por `versus`), guion/espaciado (`Semen Up` vs `Semen-Up`),
  puntuación de apertura española inconsistente (`¡Cruz diablo!` con y sin el `¡` inicial),
  y un caso de un track compuesto del catálogo partido en dos entradas consecutivas
  (`Mariposa Pontiac` / `Rock del país`, visto en un show de 1985, sin confirmar si es
  sistemático).
- **Hallazgo crítico para `D-45`, re-confirmado esta ronda:** hay títulos que setlist.fm
  registra como tocados y que **no pertenecen al catálogo local**, clasificados en 4
  clases: *inédito* (nunca en los 10 discos de estudio — acá caen dos del propio top-25 de
  `RES-74`: **"Un tal Brigitte Bardot" (demo RCA 1982, puesto 4, 80 veces — conteo
  reverificado y sostenido) y "Nene nena" (demo RCA 1982, puesto 7, 68 veces)**, además de
  piezas pre-*Gulp!* sueltas y temas que solo salieron en discos *en vivo*),
  *cover/colaboración* (con Enrique Symns, con Vivi Tellas, un Beatles tocado de cinta),
  *intro/cinta* (grabaciones antes de que entre la banda) y *cántico de cancha*
  (participación del público, no canción).
- **"Divina TV. Führer" (puesto 6, 69 reproducciones), reverificado esta ronda:** título y
  conteo exactos en la página propia de la canción, coinciden letra por letra con
  `src/data/cancionero.json` (disco *Oktubre*). Un snippet de búsqueda indexado (no la
  página viva) mostraba 67 — se descarta por desactualizado, no se promedia contra el 69
  de la fuente primaria.
- Dos temas del catálogo circularon en vivo bajo sobrenombre de época por autocensura
  (`Rock para el negro Atila` como "Camila", `El arte del buen comer` como "Pituca") — el
  slug de catálogo es el mismo, cambia solo el nombre efímero del show.
- **Regla propuesta para la ingesta (`T-279`, no decidida por mí):** normalizar ambos
  lados (minúsculas, sin tildes, sin `¡¿`, `vs.`→`versus`) y correr el mismo slugify de
  `cancionero.json`; lo que no resuelva a slug se cubre con un mapa de alias fichado. Todo
  título que no resuelva a ningún slug del catálogo **se guarda igual dentro del recital
  completo** (`D-45`), con un campo `clase` y sin `slugCatalogo` — no entra al conteo de
  "Fácil" ni a ningún juego.

**Los tres informes no se contradicen entre sí.** `RES-74` y `RES-75` confirman el mismo
dato desde ángulos distintos: "Ñam fri fruli fali fru" aparece con la misma grafía en el
top-25 (`RES-74`) y en la lista de variantes (`RES-75`), y "Barbazul vs. el amor letal"
igual en las dos.

---

## El cruce que decide la condición de `D-45`

**¿Alcanza la cobertura para ordenar los 8 primeros sin que decida el azar? Sí, se
sostiene tras la reverificación, con la misma salvedad operativa de antes y una cifra de
catálogo que quedó abierta (105 vs. 104, ver corrección arriba).**

Los valores del top-25 (`RES-74`), re-confirmados dígito por dígito con un segundo fetch
independiente en esta ronda, están claramente separados: 101, 93, 90, 80, 71, 69, 68, 61 —
**no hay empate en el puesto 8** (Nueva Roma, 61) contra el puesto 9 (Mi perro dinamita,
58; diferencia de 3). Numéricamente, nada ahí depende de una moneda al aire.

Pero **el top-8 crudo de setlist.fm y los "8 Fáciles" de `US-02` no son la misma lista
todavía**, porque `RES-75` muestra que 2 de esos 8 puestos (`Un tal Brigitte Bardot`,
puesto 4, 80 — conteo sostenido; `Nene nena`, puesto 7, 68) son temas **inéditos, fuera
del catálogo local** — no tienen `slugCatalogo` y no pueden ser respuesta de ningún juego.
Esto **no depende de si el catálogo tiene 104 o 105 títulos**: ninguna de las dos cifras
incluye demos de RCA de 1982, así que el filtrado da el mismo resultado con cualquiera de
las dos. Si "Fácil" tiene que salir del catálogo (como exige `US-02`), la lista filtrada
sería: Jijiji, Ñam fri fruli fali fru, Vamos las bandas, Nadie es perfecto, Divina TV.
Führer, Nueva Roma, Mi perro dinamita, La bestia pop — bajando hasta el puesto 10 para
completar 8. Tampoco ahí hay empate en el borde (57 contra 55 del puesto 11). Esta lista
filtrada es una **lectura derivada de este informe, no un hallazgo con fuente propia**: la
decisión de si "Fácil" se arma así, y la fijación de la regla de filtrado, le toca a
`arquitectura`/`producto` (`CTR-19` en `T-273`, `BR-18` apartado (h) en `T-274`).

**Aviso de trazabilidad:** el texto de `D-45` en `Docs/DECISIONES.md` cita *"`RES-73`"*
como la ficha que debía mostrar la cobertura. En la numeración que asignó esta tarea, la
cobertura quedó en **`RES-74`**, no en `RES-73` (que acá cubre términos y licencia). Vale
que quien actualice o cite `D-45` corrija esa referencia.

---


> **Nota del hilo principal al pegar (2026-09-23): el 104 contra 105 no es una discrepancia.** El que falta en `src/data/cancionero.json` es *Sushi* (`lobo-suelto`, pista 13), que es **instrumental** y por eso no tiene letra que cargar. Está documentado desde el ciclo 6 (`ORQ-plan-ciclo-6.md:28`) y lo exige un test: `src/lib/cancionero/banco.test.ts:23`, *"entraron 104 de los 105 temas, y el que falta es el instrumental Sushi"*. `src/data/popularidad.json` y `adivinar-tema.json` sí lo traen. El catálogo sigue siendo el de `RES-20`: 105. Se deja la fila de abajo como estaba, porque es lo que `investigador` vio, y esta nota dice por qué no hay que resolver nada.

## Sin resolver

- El desvío de 1 entre el total declarado (256) y la paginación (255).
- Si las columnas "temas por show" (no el top-25, que sí se reverificó) son exactas —
  vienen de un modelo chico resumiendo HTML, no de HTML crudo (`RES-74`).
- El MBID de MusicBrainz, confirmado por una sola fuente (`RES-73.5`).
- Si el corte de "Mariposa Pontiac / Rock del país" en dos entradas es sistemático o un
  caso aislado de 1985 (`RES-75`).
- 20 de las 26 páginas de listado (~200 recitales) sin leer — cobertura real del catálogo
  completo, tarea de `T-279`.
- **Nuevo en esta ronda: `RES-20` dice 105 títulos de catálogo, `src/data/cancionero.json`
  vigente hoy tiene 104.** No determiné la causa (baja posterior, duplicado, error de
  conteo). No cambia la conclusión del filtrado del top-8, pero la cifra "105" que se
  sigue citando en varios documentos no coincide con el archivo de hoy.
- El límite exacto de la API (`RES-73.4`) sigue siendo de fuente secundaria (foro, no
  documentación formal) — confianza media, aunque la polaridad ya está corregida.

## Siguiente

- **`arquitectura`** (`T-273`, `CTR-19`): define el schema de `recitales.json` con el
  campo `clase` para lo fuera de catálogo, y la vía de obtención (recomendación:
  transcripción manual + API como consulta respetando el tier real de la clave,
  `RES-73.4` corregido) — el choque de retención de la API con "guardar enteros" es suyo
  para resolver.
- **`arquitectura`/`contenido`**: reconciliar 105 (`RES-20`) contra 104
  (`src/data/cancionero.json` hoy) antes de fijar `CTR-19` — no bloquea el filtrado del
  top-8, pero la cifra citada en la documentación no coincide con el archivo vigente.
- **`producto`** (`T-274`, `BR-18` (h)): decide si "Fácil" filtra por catálogo antes de
  tomar el top-8 (la lectura derivada de esta ficha) o si usa otro criterio, y si el
  usuario avala bajar hasta el puesto 10.
- **Hilo principal**: corregir en `D-45` la cita a `RES-73` por `RES-74` si se mantiene la
  numeración de esta ficha.

---

## Anexo — el índice de recitales leído en esta ronda (`RES-74`)

> **Es un índice, no los setlists.** Fecha, lugar, ciudad, cuántos temas trae cada uno según el resumen de la página, y el enlace a la página de setlist.fm. **Las listas de temas no se copian acá**: `RES-73.1` solo da licencia para *ver*. Son las 40 filas de las páginas 1, 3, 4 y 5 del listado del artista; las otras 20 páginas quedaron sin leer. Consultado: 2026-09-22.

| Fecha | Lugar | Ciudad | Temas | Página |
|---|---|---|---|---|
| 2001-08-04 | Estadio Chateau Carreras | Córdoba | 13 | https://www.setlist.fm/setlist/patricio-rey-y-sus-redonditos-de-ricota/2001/estadio-chateau-carreras-cordoba-argentina-7bd65eb4.html |
| 2001-04-23 | Estadio Centenario | Montevideo | 13 | https://www.setlist.fm/setlist/patricio-rey-y-sus-redonditos-de-ricota/2001/estadio-centenario-montevideo-uruguay-4bd04f72.html |
| 2001-04-22 | Estadio Centenario | Montevideo | 13 | https://www.setlist.fm/setlist/patricio-rey-y-sus-redonditos-de-ricota/2001/estadio-centenario-montevideo-uruguay-5bd04f7c.html |
| 2000-04-16 | Estadio River Plate | Buenos Aires | 13 | https://www.setlist.fm/setlist/patricio-rey-y-sus-redonditos-de-ricota/2000/estadio-river-plate-buenos-aires-argentina-23d00c43.html |
| 2000-04-15 | Estadio River Plate | Buenos Aires | 13 | https://www.setlist.fm/setlist/patricio-rey-y-sus-redonditos-de-ricota/2000/estadio-river-plate-buenos-aires-argentina-4bd54bd6.html |
| 1999-06-20 | Patinódromo Municipal | Mar del Plata | 13 | https://www.setlist.fm/setlist/patricio-rey-y-sus-redonditos-de-ricota/1999/patinodromo-municipal-mar-del-plata-argentina-5bc71738.html |
| 1999-06-19 | Patinódromo Municipal | Mar del Plata | 13 | https://www.setlist.fm/setlist/patricio-rey-y-sus-redonditos-de-ricota/1999/patinodromo-municipal-mar-del-plata-argentina-33d3b0ad.html |
| 1998-12-19 | Estadio Racing Club | Avellaneda | 13 | https://www.setlist.fm/setlist/patricio-rey-y-sus-redonditos-de-ricota/1998/estadio-racing-club-avellaneda-argentina-73f75639.html |
| 1998-12-18 | Estadio Racing Club | Avellaneda | 13 | https://www.setlist.fm/setlist/patricio-rey-y-sus-redonditos-de-ricota/1998/estadio-racing-club-avellaneda-argentina-3bd00c40.html |
| 1998-05-23 | Anfiteatro Villa María | Villa María | 13 | https://www.setlist.fm/setlist/patricio-rey-y-sus-redonditos-de-ricota/1998/anfiteatro-villa-maria-villa-maria-argentina-bdc955e.html |
| 1996-06-09 | Go! Disco | Mar del Plata | 13 | https://www.setlist.fm/setlist/patricio-rey-y-sus-redonditos-de-ricota/1996/go-disco-mar-del-plata-argentina-3e6a1fb.html |
| 1996-06-08 | Go! Disco | Mar del Plata | 13 | https://www.setlist.fm/setlist/patricio-rey-y-sus-redonditos-de-ricota/1996/go-disco-mar-del-plata-argentina-73e6a699.html |
| 1996-06-07 | Go! Disco | Mar del Plata | 13 | https://www.setlist.fm/setlist/patricio-rey-y-sus-redonditos-de-ricota/1996/go-disco-mar-del-plata-argentina-7be6a6a4.html |
| 1995-12-09 | Costa Chaval | Concordia | 13 | https://www.setlist.fm/setlist/patricio-rey-y-sus-redonditos-de-ricota/1995/costa-chaval-concordia-argentina-63e6a6a7.html |
| 1995-12-08 | Costa Chaval | Concordia | 13 | https://www.setlist.fm/setlist/patricio-rey-y-sus-redonditos-de-ricota/1995/costa-chaval-concordia-argentina-13e6a101.html |
| 1995-10-15 | Go! Disco | Mar del Plata | 13 | https://www.setlist.fm/setlist/patricio-rey-y-sus-redonditos-de-ricota/1995/go-disco-mar-del-plata-argentina-4bc463d6.html |
| 1995-10-14 | Go! Disco | Mar del Plata | 13 | https://www.setlist.fm/setlist/patricio-rey-y-sus-redonditos-de-ricota/1995/go-disco-mar-del-plata-argentina-7bc8ae28.html |
| 1995-10-13 | Go! Disco | Mar del Plata | 13 | https://www.setlist.fm/setlist/patricio-rey-y-sus-redonditos-de-ricota/1995/go-disco-mar-del-plata-argentina-53c8af95.html |
| 1995-08-20 | Letoile Disco | San Carlos Centro | 13 | https://www.setlist.fm/setlist/patricio-rey-y-sus-redonditos-de-ricota/1995/letoile-disco-san-carlos-centro-argentina-6be6a6a2.html |
| 1995-08-19 | Letoile Disco | San Carlos Centro | 13 | https://www.setlist.fm/setlist/patricio-rey-y-sus-redonditos-de-ricota/1995/letoile-disco-san-carlos-centro-argentina-73e6a6ad.html |
| 1994-12-17 | Estadio Huracán | Buenos Aires | 13 | https://www.setlist.fm/setlist/patricio-rey-y-sus-redonditos-de-ricota/1994/estadio-huracan-buenos-aires-argentina-3c4f963.html |
| 1994-12-16 | Estadio Huracán | Buenos Aires | 13 | https://www.setlist.fm/setlist/patricio-rey-y-sus-redonditos-de-ricota/1994/estadio-huracan-buenos-aires-argentina-63e6a6db.html |
| 1994-08-14 | Go! Disco | Mar del Plata | 13 | https://www.setlist.fm/setlist/patricio-rey-y-sus-redonditos-de-ricota/1994/go-disco-mar-del-plata-argentina-be6a10a.html |
| 1994-08-13 | Go! Disco | Mar del Plata | 13 | https://www.setlist.fm/setlist/patricio-rey-y-sus-redonditos-de-ricota/1994/go-disco-mar-del-plata-argentina-53c8af4d.html |
| 1994-08-12 | Go! Disco | Mar del Plata | 13 | https://www.setlist.fm/setlist/patricio-rey-y-sus-redonditos-de-ricota/1994/go-disco-mar-del-plata-argentina-73e6a6e1.html |
| 1994-05-14 | Estadio Huracán | Buenos Aires | 13 | https://www.setlist.fm/setlist/patricio-rey-y-sus-redonditos-de-ricota/1994/estadio-huracan-buenos-aires-argentina-33fd4445.html |
| 1993-12-10 | Sociedad Rural | Rosario | 13 | https://www.setlist.fm/setlist/patricio-rey-y-sus-redonditos-de-ricota/1993/sociedad-rural-rosario-argentina-3bcce8a8.html |
| 1993-11-20 | Estadio Huracán | Buenos Aires | 13 | https://www.setlist.fm/setlist/patricio-rey-y-sus-redonditos-de-ricota/1993/estadio-huracan-buenos-aires-argentina-2bc7143a.html |
| 1993-11-19 | Estadio Huracán | Buenos Aires | 13 | https://www.setlist.fm/setlist/patricio-rey-y-sus-redonditos-de-ricota/1993/estadio-huracan-buenos-aires-argentina-2bd25062.html |
| 1992-11-01 | King Kong Stadium | Buenos Aires | 13 | https://www.setlist.fm/setlist/patricio-rey-y-sus-redonditos-de-ricota/1992/king-kong-stadium-buenos-aires-argentina-7be6a6f8.html |
| 1992-10-31 | King Kong Stadium | Buenos Aires | 13 | https://www.setlist.fm/setlist/patricio-rey-y-sus-redonditos-de-ricota/1992/king-kong-stadium-buenos-aires-argentina-63e6a6fb.html |
| 1992-10-30 | King Kong Stadium | Buenos Aires | 13 | https://www.setlist.fm/setlist/patricio-rey-y-sus-redonditos-de-ricota/1992/king-kong-stadium-buenos-aires-argentina-6be6a60a.html |
| 1992-10-03 | Centro Municipal de Exposiciones | Buenos Aires | 13 | https://www.setlist.fm/setlist/patricio-rey-y-sus-redonditos-de-ricota/1992/centro-municipal-de-exposiciones-buenos-aires-argentina-6be6a612.html |
| 1992-10-02 | Centro Municipal de Exposiciones | Buenos Aires | 13 | https://www.setlist.fm/setlist/patricio-rey-y-sus-redonditos-de-ricota/1992/centro-municipal-de-exposiciones-buenos-aires-argentina-1bccd96c.html |
| 1992-09-26 | Flop Discotheque | Villa María | 3 | https://www.setlist.fm/setlist/patricio-rey-y-sus-redonditos-de-ricota/1992/flop-discotheque-villa-maria-argentina-be6a11e.html |
| 1992-09-19 | Estadio Cubierto Newell's Old Boys | Rosario | 0 | https://www.setlist.fm/setlist/patricio-rey-y-sus-redonditos-de-ricota/1992/estadio-cubierto-newells-old-boys-rosario-argentina-1be6a118.html |
| 1992-08-08 | Teatro San Martín | Mar del Plata | 0 | https://www.setlist.fm/setlist/patricio-rey-y-sus-redonditos-de-ricota/1992/teatro-san-martin-mar-del-plata-argentina-bcde582.html |
| 1992-08-07 | Teatro San Martín | Mar del Plata | 13 | https://www.setlist.fm/setlist/patricio-rey-y-sus-redonditos-de-ricota/1992/teatro-san-martin-mar-del-plata-argentina-6be6a61e.html |
| 1992-07-19 | Microestadio Racing Club | Avellaneda | 0 | https://www.setlist.fm/setlist/patricio-rey-y-sus-redonditos-de-ricota/1992/microestadio-racing-club-avellaneda-argentina-1be6a124.html |
| 1992-07-18 | Microestadio Racing Club | Avellaneda | 13 | https://www.setlist.fm/setlist/patricio-rey-y-sus-redonditos-de-ricota/1992/microestadio-racing-club-avellaneda-argentina-6bceba52.html |
