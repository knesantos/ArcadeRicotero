# INV-100 — El legajo de números de la banda, para "Más o menos" (`D-48`)

> Pedido del hilo principal, 2026-09-25: el legajo de números con respuesta verificada
> para el juego nuevo "Más o menos" (`IDEA-11` promovida, `US-10`). El usuario pidió
> explícitamente no quedarse solo en las letras: "cuántos integrantes son, cuántos años
> tocaron... sé creativo".
>
> **Consume:** `D-48`, `RES-02`, `RES-03`, `RES-05`, `RES-06`, `RES-09`, `RES-20`, `RES-21`,
> `RES-47`, `RES-48`, `RES-73` a `RES-92` (setlist.fm y MusicBrainz).
>
> **Afecta:** `CTR-20` (`arquitectura`, el schema de números para "Más o menos"), `CNT-25`
> (`contenido`, que redacta las preguntas a partir de esta tabla — el número de acá **no**
> es la pregunta final, es el hecho verificado detrás de ella), `BR-32`/`BR-33`.
>
> **Numeración de este archivo:** `RES-100` a `RES-105`, del rango `RES-100`–`RES-139`
> reservado en `Docs/IDS.md` para esta ráfaga. Quedan `RES-106`–`RES-139` libres si hace
> falta una ronda más.
>
> **Fuera de alcance, sin excepción (`CNT-04`, `CNT-06`):** ningún número sobre Walter
> Bulacio, Olavarría 2017, la muerte del Indio, heridos o detenidos, ni ninguna edad al
> morir. Donde el hallazgo original los traía pegados a un dato bueno (ej. Huracán 94:
> "80.000 personas por noche", con heridos y detenidos al lado), acá solo entra la primera
> parte.
>
> Fecha de consulta de todo lo nuevo: **2026-09-25**. Lo que viene del repo conserva la
> fecha de consulta original de su ficha.
>
> **Escrita por `investigador`; pegada por el hilo principal**, porque el rol es de solo
> lectura y no tiene con qué escribir en su propia carpeta.

> ## ⚠ Nota del hilo principal al pegar (2026-09-25) — leer antes de usar una fila
>
> Las tablas van tal cual las entregó `investigador`, salvo una línea de "Sin resolver" que
> llegó corrupta y se reescribió con el mismo sentido. Seis cosas que no pueden pasar al
> juego como están:
>
> 1. **`RES-104` dice "¿cuántas veces se tocó?" y el número no es eso.** El propio dato del
>    repo lo aclara (`setlistfm.json`, nota de `RES-90`): es **en cuántos setlists de los que
>    carga la gente en setlist.fm figura el tema**, no cuántas veces lo tocó la banda. Esa
>    familia se deriva de `setlistfm.json` (`D-48` punto 4); las filas N-093 a N-099 y
>    N-103 no se cargan a mano.
> 2. **N-044 depende de la fecha de *Gulp!*, que no está resuelta.** Semilla nació el 3 de
>    julio de 1959: con la fecha del 22 de abril tenía 25, con la del 20 de julio, 26. No
>    entra. (N-042 y N-043 dan lo mismo con cualquiera de las tres fechas.)
> 3. **N-049 es sobre la muerte del Indio.** Queda afuera por `CNT-04`/`CNT-06`.
> 4. **N-050, N-051, N-052 y N-053** son las dos trampas de `RES-20` (9 o 10 discos, 11 o 12
>    temas en *Gulp!*). No entran.
> 5. **N-054 a N-062 y N-072 a N-074 ya están en `RES-20`** y se derivan (`D-48`, `D-13`): no
>    se cargan a mano.
> 6. **N-085 a N-089 (capacidad de estadios) y N-108 a N-110** no son números de la banda:
>    son de un estadio o de una ley. Si `contenido` usa alguno, que la pregunta diga de qué
>    es el número.

---

## RES-100 — La banda en el tiempo

| id | Pregunta | Número | Unidad | Fuente | Fecha consulta | Firmeza |
|---|---|---|---|---|---|---|
| N-001 | ¿En qué año arrancó la banda en La Plata? | 1976 | año | `RES-05` | 2026-08-19 | hecho |
| N-002 | ¿En qué año fue el Lozanazo, la primera presentación oficial (ahí nace el nombre)? | 1977 | año | `RES-05` | 2026-08-19 | hecho |
| N-003 | LEYENDA — ¿en qué año circula que se "fundó" la banda, el 28 de diciembre? | 1976 | año | `RES-05` (Wikipedia EN la trata de leyenda urbana) | 2026-08-19 | **leyenda** — no usar como respuesta de una pregunta de hecho |
| N-004 | ¿En qué año hicieron su primera gira al interior, a Salta? | 1978 | año | `RES-05` | 2026-08-19 | hecho |
| N-005 | ¿En qué año Rocambole toma la identidad visual completa de la banda? | 1978 | año | `RES-05` | 2026-08-19 | hecho |
| N-006 | ¿En qué año tocaron en el festival Pan Caliente? | 1982 | año | `RES-05` | 2026-08-19 | hecho |
| N-007 | ¿En qué año se mudó la banda a Buenos Aires? | 1982 | año | `RES-05` | 2026-08-19 | hecho |
| N-008 | ¿En qué año salió *Gulp!*, el primer disco? | 1985 | año | `RES-02`/`RES-20` | 2026-08-19 | hecho (el mes/día tiene 3 versiones sin resolver — ver Sin resolver, pero el año no) |
| N-009 | ¿En qué fecha tuvo *Gulp!* su presentación oficial "en sociedad" (distinta del día que salió a la venta)? | 23 de agosto de 1985 | fecha | Infobae, "40 años de Gulp!" | 2026-09-25 | hecho — cita textual: *"El 23 de agosto de 1985, Gulp! tuvo su presentación en sociedad"* |
| N-010 | ¿En qué año salió *Oktubre*? | 1986 | año | `RES-02`/`RES-20` | 2026-08-19 | hecho |
| N-011 | ¿En qué año tocaron en Cemento con Luca Prodan? | 1987 | año | `RES-05` | 2026-08-19 | hecho |
| N-012 | ¿En qué año dieron su primer show fuera de la Argentina (Montevideo)? | 1989 | año | `RES-05` | 2026-08-19 | hecho |
| N-013 | ¿En qué año debutaron en el estadio Obras? | 1989 | año | `RES-05` | 2026-08-19 | hecho |
| N-014 | ¿Cuántas personas fueron, como mínimo, a Huracán la primera vez (19 y 20 de noviembre de 1993)? | 70.000 | personas (más de) | `RES-05` | 2026-08-19 | hecho |
| N-015 | ¿Cuántas personas por noche fueron a Huracán en diciembre de 1994? | 80.000 | personas por noche | `RES-05` | 2026-08-19 | hecho |
| N-016 | ¿En qué año fue la única conferencia de prensa televisada de toda la historia de la banda, en Tandil? | 1997 | año | `RES-05` | 2026-08-19 | hecho |
| N-017 | ¿Cuántas personas había en el recital de Tandil de 1997? | 21.000 | personas | `RES-05` | 2026-08-19 | hecho |
| N-018 | ¿Cuántas personas fueron al recital de River, en abril de 2000? | 70.000 | personas | `RES-05` | 2026-08-19 | hecho |
| N-019 | ¿En qué año fue el último recital, en el Chateau Carreras de Córdoba? | 2001 | año | `RES-05` | 2026-08-19 | hecho |
| N-020 | ¿Cuántas personas fueron al último recital, según la cifra más citada? | 50.000 (RES-05/Infobae) — otras coberturas dan 40.000 o 45.000 | personas (aprox.) | `RES-05` + Infobae, "4 de agosto de 2001 en Córdoba" | 2026-09-25 | **según fuente** — discrepancia entre coberturas, sin promediar |
| N-021 | ¿En qué año se separó oficialmente la banda? | 2001 | año | `RES-05` | 2026-08-19 | hecho |
| N-022 | ¿Cuántos años pasaron entre el Lozanazo (1977) y la separación oficial (2001)? | 24 | años | derivado de `RES-05` | 2026-08-19 | hecho |
| N-023 | ¿En cuántos países tocó la banda en toda su historia? | 2 (Argentina y Uruguay) | países | El Observador (Uruguay), "sus visitas a Uruguay con los Redondos" | 2026-09-25 | según fuente |
| N-024 | ¿En qué año ganaron el Konex de Platino como mejor banda de rock de la década? | 2005 | año | Fundación Konex, ficha oficial de la banda | 2026-09-25 | hecho |
| N-025 | ¿En qué año habían recibido antes el Diploma al Mérito Konex? | 1995 | año | Fundación Konex | 2026-09-25 | hecho |
| N-026 | ¿En qué año se formó La Cofradía de la Flor Solar, la comunidad platense de la que salió Skay (y donde tocaba con Rocambole)? | 1968 | año | Wikipedia, "La Cofradía de la Flor Solar" | 2026-09-25 | hecho |
| N-027 | ¿Cuántos años pasaron entre la fundación de la Cofradía (1968) y el Lozanazo (1977)? | 9 | años | derivado | 2026-09-25 | hecho |
| N-028 | ¿Cuántos meses estuvo caído el catálogo completo de la banda en las plataformas digitales, entre 2016 y 2017? | 11 | meses | `RES-09` | 2026-08-19 | hecho |
| N-029 | ¿En qué año se subió el catálogo completo y definitivo a streaming, vía The Orchard? | 2017 | año | `RES-09` | 2026-08-19 | hecho |

---

## RES-101 — La gente de la banda

| id | Pregunta | Número | Unidad | Fuente | Fecha consulta | Firmeza |
|---|---|---|---|---|---|---|
| N-030 | ¿Cuántos integrantes tuvo la formación estable de la banda (1987–2001)? | 5 | integrantes | `RES-05` / `src/data/redondopedia.json` | 2026-08-19 | hecho |
| N-031 | ¿Cuántos años duró esa formación sin un solo cambio? | 14 | años | derivado de `RES-05`/redondopedia | 2026-08-19 | hecho |
| N-032 | ¿Cuántos músicos rotaban por la banda en sus primeros años, antes de estabilizarse? | 15 (aprox.) | músicos | `RES-05` | 2026-08-19 | según fuente — la propia ficha lo da como "unos 15" |
| N-033 | ¿En qué año nació el Indio Solari? | 1949 | año | CMTV + La Nación (búsqueda cruzada) | 2026-09-25 | hecho |
| N-034 | ¿En qué año nació Skay Beilinson? | 1952 | año | Wikipedia (infobox: 15 de enero de 1952, La Plata) | 2026-09-25 | hecho |
| N-035 | ¿En qué año nació Semilla Bucciarelli, el bajista? | 1959 | año | Wikipedia (infobox: 3 de julio de 1959, Villa María) | 2026-09-25 | hecho |
| N-036 | ¿En qué año nació Sergio Dawi, el saxofonista? | 1955 | año | Wikipedia (infobox: 20 de octubre de 1955, San Telmo) | 2026-09-25 | hecho |
| N-037 | ¿En qué año nació Walter Sidotti, el baterista? | 1961 | año | búsqueda cruzada (efeméride de prensa + red social, sin artículo propio de Wikipedia) | 2026-09-25 | según fuente |
| N-038 | ¿En qué año nació la Negra Poli? | 1950 | año | Wikipedia (infobox: 15 de noviembre de 1950, Buenos Aires) | 2026-09-25 | hecho |
| N-039 | ¿Cuántos años se llevan el Indio y Skay? | 3 | años | derivado (1949 vs. 1952) | 2026-09-25 | hecho |
| N-040 | ¿Cuántos años tenía el Indio la noche del Lozanazo (26-nov-1977)? | 28 | años | derivado | 2026-09-25 | hecho |
| N-041 | ¿Cuántos años tenía Skay esa misma noche? | 25 | años | derivado | 2026-09-25 | hecho |
| N-042 | ¿Cuántos años tenía el Indio cuando salió *Gulp!* (22-abr-1985)? | 36 | años | derivado | 2026-09-25 | hecho |
| N-043 | ¿Cuántos años tenía Skay cuando salió *Gulp!*? | 33 | años | derivado | 2026-09-25 | hecho |
| N-044 | ¿Cuántos años tenía Semilla Bucciarelli cuando salió *Gulp!*? | 25 | años | derivado | 2026-09-25 | hecho — **ver la nota del hilo principal, punto 2: depende de la fecha sin resolver** |
| N-045 | ¿Cuántos años tenía Walter Sidotti cuando entró a la formación estable, en 1987? | 26 | años | derivado | 2026-09-25 | según fuente (por N-037) |
| N-046 | ¿Cuántos años tenía Sergio Dawi cuando se sumó a la banda, para *Un baión para el ojo idiota* (1988)? | 32 | años | derivado | 2026-09-25 | hecho |
| N-047 | ¿En cuántas partes iguales se repartió el nombre de la banda en Erks S.A.? | 3 | partes | `RES-09` | 2026-08-19 | hecho |
| N-048 | ¿En qué año se constituyó Erks S.A., la sociedad dueña del catálogo? | 1992 | año | `RES-09` | 2026-08-19 | hecho |
| N-049 | ¿Cuántos años tenía Rocambole cuando despidió públicamente al Indio, en junio de 2026? | 83 | años | `RES-06` | 2026-08-19 | hecho — **ver la nota del hilo principal, punto 3: fuera por `CNT-04`/`CNT-06`** |

---

## RES-102 — Los discos

| id | Pregunta | Número | Unidad | Fuente | Fecha consulta | Firmeza |
|---|---|---|---|---|---|---|
| N-050 | ¿Cuántos discos de estudio editó la banda? | 9 (contando el doble como uno) / 10 (contando los dos volúmenes por separado) | discos | `RES-02` | 2026-08-19 | hecho, con discrepancia de criterio — **no usar sin fijar antes cuál de las dos cuenta** |
| N-051 | ¿Cuántos temas tiene el cancionero completo de estudio? | 105 (`RES-20`) / 104 en el archivo vigente hoy (falta el instrumental "Sushi") | temas | `RES-20` / `RES-75` | 2026-08-19 / 2026-09-22 | hecho — dos cifras, no es un error, ver nota abajo |
| N-052 | ¿Cuántos temas tiene *Gulp!*, contando el track oculto? | 12 | temas | `RES-20` | 2026-08-19 | hecho |
| N-053 | ¿Cuántos temas tiene *Gulp!* sin contar el track oculto? | 11 | temas | `RES-20` | 2026-08-19 | hecho |
| N-054 | ¿Cuántos temas tiene *Oktubre*? | 9 | temas | `RES-20` | 2026-08-19 | hecho |
| N-055 | ¿Cuántos temas tiene *Un baión para el ojo idiota*? | 8 | temas | `RES-20` | 2026-08-19 | hecho |
| N-056 | ¿Cuántos temas tiene *¡Bang! ¡Bang!… Estás liquidado*? | 9 | temas | `RES-20` | 2026-08-19 | hecho |
| N-057 | ¿Cuántos temas tiene *La mosca y la sopa*? | 10 | temas | `RES-20` | 2026-08-19 | hecho |
| N-058 | ¿Cuántos temas tiene el volumen 1 de *Lobo suelto, cordero atado*? | 13 | temas | `RES-20` | 2026-08-19 | hecho |
| N-059 | ¿Cuántos temas tiene el volumen 2 de *Lobo suelto, cordero atado*? | 12 | temas | `RES-20` | 2026-08-19 | hecho |
| N-060 | ¿Cuántos temas tiene *Luzbelito*? | 11 | temas | `RES-20` | 2026-08-19 | hecho |
| N-061 | ¿Cuántos temas tiene *Último bondi a Finisterre*? | 10 | temas | `RES-20` | 2026-08-19 | hecho |
| N-062 | ¿Cuántos temas tiene *Momo Sampler*? | 11 | temas | `RES-20` | 2026-08-19 | hecho |
| N-063 | ¿Cuántos segundos dura *Gulp!* completo, con el track oculto? | 2.324 (38:44) | segundos | suma derivada de las duraciones de `RES-20` | 2026-09-25 | hecho |
| N-064 | ¿Cuántos segundos dura *Oktubre*? | 2.466 (41:06) | segundos | derivado de `RES-20` | 2026-09-25 | hecho |
| N-065 | ¿Cuántos segundos dura *Un baión para el ojo idiota*? | 2.269 (37:49) | segundos | derivado de `RES-20` | 2026-09-25 | hecho |
| N-066 | ¿Cuántos segundos dura *¡Bang! ¡Bang!… Estás liquidado*? | 1.965 (32:45) | segundos | derivado de `RES-20` | 2026-09-25 | hecho |
| N-067 | ¿Cuántos segundos dura *La mosca y la sopa*? | 2.319 (38:39) | segundos | derivado de `RES-20` | 2026-09-25 | hecho |
| N-068 | ¿Cuántos segundos dura el volumen 1 de *Lobo suelto, cordero atado*? | 2.443 (40:43) | segundos | derivado de `RES-20` | 2026-09-25 | hecho |
| N-069 | ¿Cuántos segundos dura *Luzbelito*, el disco más largo del catálogo con datos completos? | 3.382 (56:22) | segundos | derivado de `RES-20` | 2026-09-25 | hecho |
| N-070 | ¿Cuántos segundos dura *Último bondi a Finisterre*? | 2.658 (44:18) | segundos | derivado de `RES-20` | 2026-09-25 | hecho |
| N-071 | ¿Cuántos segundos dura *Momo Sampler*? | 2.917 (48:37) | segundos | derivado de `RES-20` | 2026-09-25 | hecho |
| N-072 | ¿Cuánto dura el tema más largo de todo el catálogo con duración conocida, "Todo un palo"? | 445 (7:25) | segundos | `RES-20` | 2026-08-19 | hecho |
| N-073 | ¿Cuánto dura el tema numerado más corto del catálogo (sin contar el oculto de *Gulp!*), "Capricho Magyar"? | 58 (0:58) | segundos | `RES-20` | 2026-08-19 | hecho |
| N-074 | ¿Cuánto dura el track oculto de *Gulp!*, "Pianito - Jam"? | 53 (0:53) | segundos | `RES-20` | 2026-08-19 | hecho |
| N-075 | ¿Cuántos temas de todo el catálogo llevan un tercer autor además de Solari–Beilinson? | 2 | temas | `RES-20` (Ella debe estar tan linda, Mi perro dinamita — con Bucciarelli) | 2026-08-19 | hecho |
| N-076 | ¿Cuántos títulos tiene la discografía completa disponible en streaming (incluido el disco en vivo)? | 11 | títulos | `RES-09` | 2026-08-19 | hecho |
| N-077 | ¿En qué año salió el disco en vivo "En directo"? | 1992 | año | Wikipedia, "En directo (álbum...)" — ficha: 14 de diciembre de 1992 | 2026-09-25 | hecho |
| N-078 | ¿Cuántos temas tiene "En directo"? | 12 | temas | Wikipedia (ídem) | 2026-09-25 | hecho |
| N-079 | ¿Cuántos minutos dura "En directo"? | 52 (52:38) | minutos | Wikipedia (ídem) | 2026-09-25 | hecho |
| N-080 | ¿Cuántas copias tuvo la primera tirada de *Gulp!*, hecha a mano una por una? | 7.000 | copias | Infobae, "40 años de Gulp!" — cita: *"las siete mil copias que conformaron la primera tirada"* | 2026-09-25 | hecho |
| N-081 | ¿Cuántas versiones de letras probó Rocambole antes de elegir el diseño de la tapa de *Gulp!*? | 40 (aprox.) | versiones | Infobae — cita: *"probé como cuarenta versiones"* | 2026-09-25 | según fuente |
| N-082 | ¿Cuántos años tenía Willy Crook, el saxofonista invitado, cuando grabó en *Gulp!*? | 18 | años | Infobae — cita: *"Willy Crook, de apenas 18 años"* | 2026-09-25 | hecho |
| N-083 | ¿Cuál es el mayor intervalo entre dos discos de estudio consecutivos? | 3 | años (entre *Lobo suelto*, 1993, y *Luzbelito*, 1996) | derivado de `RES-02`/`RES-20` | 2026-09-25 | hecho |

> **Nota sobre N-051 (105 vs. 104):** no es un error de conteo. `src/data/cancionero.json`
> no trae *Sushi* (instrumental, pista 13 de *Lobo suelto* vol. 1) porque es instrumental y
> no tiene letra que cargar — documentado desde el ciclo 6 y confirmado por un test
> (`src/lib/cancionero/banco.test.ts:23`). El catálogo real sigue siendo 105 (`RES-20`);
> 104 es el archivo de letras, que excluye a propósito el único instrumental.

---

## RES-103 — Los recitales

| id | Pregunta | Número | Unidad | Fuente | Fecha consulta | Firmeza |
|---|---|---|---|---|---|---|
| N-084 | ¿Cuántos recitales tiene indexados setlist.fm de la banda? | 256 | recitales | `RES-74` | 2026-09-22 | hecho (desvío de 1 contra la paginación, sin resolver — ver `RES-74`) |
| N-085 | ¿Cuál es la capacidad del estadio de Huracán (Tomás A. Ducó), donde tocaron dos veces? | 48.314 | personas | Wikipedia, "Estadio Tomás Adolfo Ducó" | 2026-09-25 | hecho — es la capacidad actual/oficiada, no necesariamente la de 1993–94 |
| N-086 | ¿Cuál es la capacidad del estadio Obras para recitales? | 4.700 | personas | Wikipedia (EN), "Estadio Obras Sanitarias" | 2026-09-25 | hecho |
| N-087 | ¿Cuál es la capacidad actual del Estadio Monumental de River? | 85.018 | personas | Wikipedia, "Estadio Monumental (River Plate)" | 2026-09-25 | hecho — cifra vigente, sujeta a la obra de ampliación en curso a la fecha de consulta |
| N-088 | ¿Cuál es la capacidad actual del estadio Kempes (Chateau Carreras) de Córdoba? | 57.000 | personas | Wikipedia (EN), "Estadio Mario Alberto Kempes" | 2026-09-25 | hecho |
| N-089 | ¿Cuál era la capacidad del Kempes cuando se inauguró, en 1978? | 37.851 | personas | Wikipedia (EN) (ídem) | 2026-09-25 | hecho |
| N-090 | ¿Cuántas personas fueron al último recital, en el Chateau Carreras (2001), según la cifra más repetida? | 50.000 (aprox.) — otras notas dan 40.000 o 45.000 | personas | `RES-05` + Infobae | 2026-09-25 | según fuente (mismo dato que N-020, repetido acá por categoría) |
| N-091 | ¿Cuál es la mayor cantidad de noches seguidas que tocaron en el mismo lugar, según la muestra relevada (40 de 256 recitales)? | 3 | noches | `RES-74` (anexo, índice de recitales) — Go! Disco Mar del Plata (tres veces distintas) y King Kong Stadium | 2026-09-22 | hecho, sobre la muestra — puede haber una racha mayor en las 20 páginas del índice todavía sin leer |
| N-092 | ¿Cuántas veces tocaron, aproximadamente, en el boliche Cemento a lo largo de su historia? | 5 (aprox.) | recitales | serargentino.com, "Cemento" | 2026-09-25 | según fuente |

---

## RES-104 — Los temas en vivo

> **Ver la nota del hilo principal, punto 1:** estos números son setlists de setlist.fm
> donde figura el tema, no veces que se tocó.

| id | Pregunta | Número | Unidad | Fuente | Fecha consulta | Firmeza |
|---|---|---|---|---|---|---|
| N-093 | ¿Cuántas veces se tocó "Jijiji" en vivo, el tema más tocado de toda la historia de la banda? | 101 | veces | `RES-89`/`RES-90` | 2026-09-24 | hecho |
| N-094 | ¿Cuántas veces se tocó "Ñam fri fruli fali fru", el segundo más tocado? | 93 | veces | `RES-89`/`RES-90` | 2026-09-24 | hecho |
| N-095 | ¿Cuántas veces se tocó "Vamos las bandas", el tercero? | 90 | veces | `RES-89`/`RES-90` | 2026-09-24 | hecho |
| N-096 | ¿Cuántas veces se tocó "Nueva Roma" en vivo? | 61 | veces | `RES-74`/`RES-89` | 2026-09-22 | hecho |
| N-097 | ¿Cuántas veces se tocó "Mi perro dinamita" en vivo? | 58 | veces | `RES-74` | 2026-09-22 | hecho |
| N-098 | ¿Cuántas veces se tocó "La bestia pop" en vivo? | 57 | veces | `RES-74` | 2026-09-22 | hecho |
| N-099 | ¿Cuántas veces se tocó "Divina TV. Führer" en vivo? | 69 | veces | `RES-75` (reverificado contra el snippet viejo de 67) | 2026-09-22 | hecho |
| N-100 | ¿Cuántos títulos distintos tocó la banda en vivo en toda su historia, según el conteo completo de setlist.fm? | 198 | títulos | `RES-89`/`RES-90` (147 con ranking numerado + 51 en la cola de una sola vez) | 2026-09-24 | hecho, con reserva de método (ver `RES-89.5`: no hay contador-resumen en la página para confirmar el total exacto) |
| N-101 | ¿Cuántos de esos títulos tienen ranking numerado propio (se tocaron 2 veces o más, o son el primero de los empatados en 1)? | 147 | títulos | `RES-89` | 2026-09-24 | hecho |
| N-102 | ¿Cuántos títulos quedaron empatados en una sola reproducción, en la cola alfabética? | 51 | títulos | `RES-89`/`RES-90` | 2026-09-24 | hecho |
| N-103 | ¿Cuántas veces se tocó "Un tal Brigitte Bardot", el tema más tocado que no pertenece a ningún disco de estudio (es una demo de RCA de 1982)? | 80 | veces | `RES-75` | 2026-09-22 | hecho |

---

## RES-105 — Otros números con gracia

| id | Pregunta | Número | Unidad | Fuente | Fecha consulta | Firmeza |
|---|---|---|---|---|---|---|
| N-104 | ¿Cuántos capítulos tiene el libro de memorias del Indio, *Recuerdos que mienten un poco*? | 27 | capítulos (más el prefacio) | `RES-21` | 2026-08-19 | hecho |
| N-105 | ¿Cuántas páginas tiene ese libro? | 863 | páginas | Wikipedia, "Recuerdos que mienten un poco" | 2026-09-25 | hecho |
| N-106 | ¿Cuántos ejemplares lleva vendidos el libro? | 50.000 | ejemplares | Wikipedia (ídem) | 2026-09-25 | hecho |
| N-107 | ¿En qué edición va el libro? | 5.ª | edición | Wikipedia (ídem) | 2026-09-25 | hecho |
| N-108 | ¿Cuántos compases de una canción se pueden citar sin permiso, según la ley argentina de derecho de autor? | 8 | compases | `RES-03` (Ley 11.723, Art. 10) | 2026-08-19 | hecho |
| N-109 | ¿Cuántas palabras de una obra literaria se pueden citar sin permiso, según la misma ley? | 1.000 | palabras | `RES-03` | 2026-08-19 | hecho |
| N-110 | ¿En qué año está prevista la renovación de la marca de la banda ante el INPI? | 2030 | año | `RES-09` | 2026-08-19 | hecho |
| N-111 | ¿Cuántos discos de estudio editó, en total, La Cofradía de la Flor Solar (la comunidad de la que salió Skay)? | 5 | discos | Wikipedia, "La Cofradía de la Flor Solar" | 2026-09-25 | hecho |

---

## Sin resolver

- **La fecha exacta de *Gulp!*** sigue con tres versiones (22-abr, 20-jul, "agosto" de
  1985 — `RES-20`). El año (1985) es firme y es lo único que usé acá; no metan el día
  como respuesta de "más o menos" hasta que alguien lo cierre.
- **9 o 10 discos de estudio (N-050) y 105 o 104 temas (N-051):** ninguna de las dos es un
  error, son dos criterios de conteo válidos y documentados. `contenido` tiene que elegir
  uno para el juego y quedarse con ese, no mezclarlos entre preguntas.
- **N-020/N-090 (asistentes al último recital):** rango 40.000–50.000 según la cobertura.
  No encontré una fuente que zanje el número; si `contenido` necesita un valor único para
  "más o menos", que sea consciente de que cualquiera que elija tiene prensa en contra.
  *(Esta línea llegó corrupta en la entrega; la reescribió el hilo principal con el mismo
  sentido.)*
- **N-037 (nacimiento de Walter Sidotti):** es el único de los seis integrantes sin
  artículo propio de Wikipedia. Sale de una efeméride de radio y un posteo de Facebook que
  coinciden en la fecha, pero no es el nivel de fuente de los otros cinco.
- **N-091 (racha de noches seguidas):** el "3" sale de una muestra de 40 recitales sobre
  256 totales (`RES-74`). Si alguna vez se lee el índice completo (`T-279`, pendiente),
  podría aparecer una racha más larga.
- **Capacidad de los estadios en el año que tocó la banda, no hoy:** Huracán, River y el
  Kempes tuvieron reformas después de los 90 (el caso más claro es el Kempes, que pasó de
  37.851 en 1978 a 57.000 hoy). Lo que hay en N-085/087/088 es la capacidad vigente hoy, y
  puede no coincidir con la de entonces (además, esos recitales fueron con campo abierto,
  lo que explica que "80.000 personas" en Huracán supere la capacidad "oficial" de hoy).
- **N-100 (198 títulos tocados en vivo):** `RES-89.5` ya había dejado esto abierto — no hay
  un contador-resumen en la página de setlist.fm que confirme que 198 es el total exacto,
  aunque el método de conteo (147 numerados + 51 de cola confirmada) tiene confianza alta.
- **Track por track del volumen 2 de *Lobo suelto, cordero atado*:** faltan casi todas las
  duraciones (`RES-20` solo trae "Etiqueta negra", 5:38). Los cálculos de disco más
  largo/corto y de duración total de la discografía (N-063 a N-074) excluyen ese disco por
  completo — si alguna vez aparecen esas duraciones, hay que revisar si cambia algo.
- **Cantidad total de temas de la demo de RCA de 1982** (donde salieron "Un tal Brigitte
  Bardot" y "Nene nena"): no encontré el tracklist completo, solo 4 títulos sueltos
  mencionados en distintas fuentes. No entró al legajo por eso.

## Siguiente

- **`arquitectura`** (`CTR-20`): el schema de "Más o menos" necesita un campo de firmeza
  (`hecho` / `según fuente`) — la leyenda no llega nunca al juego como respuesta.
- **`contenido`** (`CNT-25`): 111 números en 6 categorías con magnitudes muy distintas (de
  2 países a 85.018 personas). Ojo con dos cosas al redactar: (1) los rótulos `según fuente`
  no son candidatos a respuesta sin decir de dónde sale el número en la pregunta misma; (2)
  `N-050` y `N-051` son trampa.
- **Si hace falta más volumen:** quedan `RES-106` a `RES-139` libres en el rango reservado —
  una segunda ronda podría ir a buscar números de las tres bandas post-separación
  (`RES-47`), que no se tocaron en esta pasada.
