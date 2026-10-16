# INV-425 — Listas de recitales enteras con licencia abierta: Discogs (CC0) tiene 29 grabaciones; Fandom (CC BY-SA) tiene los huecos

> Pedido: `T-425` de `D-72` (2026-10-15). Más listas enteras para "En vivo" además de las dos de
> Concordia (MusicBrainz, CC0). Prioridad: Huracán 93 y 94, Obras 89, River 2000 y 2001.
> Fecha de consulta de todo lo que sigue: **2026-10-15**.
>
> **Escrita por `investigador`; pegada por el hilo principal**, porque el rol no escribe. El hilo
> principal repitió contra la API de Discogs, con `curl`, los cinco tracklists de Huracán 93/94 y
> River 2000 (`RES-210` a `RES-213`): coinciden renglón por renglón. **El resto no se repitió** y
> viene de una sola pasada de `WebFetch` (que resume con un modelo chico): repasarlo contra la API
> antes de cargarlo.
>
> **Numeración:** `RES-207` a `RES-239`. El próximo libre es **`RES-240`**.
> **Consume:** `D-72`, `CTR-19.8`, `RES-73.1` (setlist.fm no se copia), `INV-76` (`RES-76`..`RES-80`,
> MusicBrainz). **Afecta:** `T-425`, `CTR-19.8` (si entra Discogs como fuente) y `recitales.json`.

## Resumen

1. **MusicBrainz sigue con 2 recitales** con setlist (Concordia, 8 y 9/12/1995). Lo repitió el hilo
   principal por la API el 2026-10-15: `event-count: 2`, y las búsquedas por texto no traen otro.
2. **Discogs** publica sus datos en volcados **CC0** y tiene tracklists enteros de **29 grabaciones
   piratas** de recitales de la banda (casetes, CDr y VHS que cargó la gente). Están Huracán
   19/11/93, 20/11/93 y 14/5/94, y River 2000 (dos CDs). **No están** Obras 1989, Huracán
   diciembre del 94, ni nada de 2001.
3. **La calidad es de transcripción de fan**: todo `Needs Vote`, fuente única, con erratas y con
   discrepancias entre cargas de un mismo show (`RES-214`). Sirve rotulado como lo que es, nunca
   como "la lista oficial de la noche".
4. **Fandom (Redonditos Wiki) NO es CC0**: su licencia por defecto es CC BY-SA 3.0, y tiene página
   de repertorio por recital, incluidos Obras 2/12/1989, Huracán 16-17/12/1994, River 15/4/2000 y
   2001. Es la mejor pista para los huecos y **cambia la frontera de `CTR-19.8`** y el test t8 de
   `src/lib/en-vivo.test.ts`. **No se carga nada de ahí** hasta que se decida.
5. archive.org: ningún recital con CC0/BY/BY-SA ni tracklist. Wikipedia, Commons y otros
   repositorios: nada nuevo respecto de `INV-76`.

## Método y límites

- Sin `curl` para el subagente: todo pasó por `WebFetch`. Los tres tracklists de Huracán y los dos de
  River se pidieron dos veces con prompts distintos y coincidieron; el hilo principal los repitió
  con `curl` a `api.discogs.com/releases/<id>`.
- Los conteos son del investigador, sobre el texto devuelto. Los títulos van **tal cual los da
  Discogs**, errores incluidos. Un renglón con dos temas (`Ji Ji Ji / Perro Dinamita`) cuenta como 1.
- Discogs casi no trae fecha confiable (`year: 0`): la fecha sale de `notes` o del título del
  release y se anota como la da.

## Fuente 1 — Discogs

| # | Hallazgo | URL | Fecha | Estado |
|---|---|---|---|---|
| `RES-207` | Discogs publica sus datos en volcado mensual CC0. Texto textual en data.discogs.com: *"This data is made available under the CC0 No Rights Reserved license:"* (enlaza a creativecommons.org/about/cc0). Los volcados traen Release, Artist, Label y Master en XML. La documentación de la API (leída en un espejo de terceros) dice: *"Our monthly data dumps are available under the the CC0 No Rights Reserved license."* | https://data.discogs.com/ · espejo: https://repo.rock-n-code.com/rock-n-code/discogs-service/blame/tag/v0.6.0/Sources/DiscogsService/openapi.yaml | 2026-10-15 | verificado (data.discogs.com directo; la doc de la API, vía espejo) |
| `RES-208` | **Matiz de licencia.** La doc de la API dice además *"Some Discogs data is made available under the CC0 No Rights Reserved license"* y *"and some is restricted data, as defined in our API Terms of Use"*. Los API Terms (support.discogs.com, art. 360009334593) dieron 403 y no se pudo leer qué es "restricted data". La CC0 expresa es la de los **volcados**; los tracklists se leyeron por `api.discogs.com`, no por volcado. Existe `discogs_20261001_releases.xml.gz`, y estos releases se cargaron en agosto de 2026, así que deberían estar en el volcado: **inferido por fecha, no verificado**. No se bajó el volcado (varios GB; C: justa) | https://data.discogs.com/?prefix=data/2026/ · https://support.discogs.com/hc/en-us/articles/360009334593 (403) | 2026-10-15 | verificado (que hay volcados) / **sin verificar** (que cada release esté en el volcado; qué es "restricted data") |
| `RES-209` | Artista de la banda en Discogs: id 1682260, "Patricio Rey Y Sus Redonditos De Ricota", 75 ítems (12 masters oficiales, 3 apariciones, 3 "TrackAppearance", 57 `UnofficialRelease`). Las piratas son casetes, VHS y CDr cargados por usuarios (aleposecd, HiFiCyborg, sonidos, APRicotera, LeandroArenz, Guillote_Segundo) | https://api.discogs.com/artists/1682260/releases?per_page=100 | 2026-10-15 | verificado (inventario) |

Cada lista sale de `https://api.discogs.com/releases/<id>`. Todas con `data_quality: Needs Vote`.
Todas son transcripción de usuario de un casete o CD. Estado de cada una: **sin verificar (fuente
única)**, salvo `RES-210` a `RES-213`, repetidas por el hilo principal.

### Las cuatro prioritarias

**`RES-210` — Huracán, 19/11/1993** (release 38052621, "Lobo Suelto Club A. Huracán 19 De Noviembre",
notes "19/11/93"). 21 temas, casete. Ojo: la numeración salta de A9 a A11, no hay A10 (un tema
faltante en la carga o un error de posición).
1 Camila · 2 Mi Perro Dinamita · 3 El Pibe De Los Astilleros · 4 Buenas Noticias · 5 Sorpresa De
Shangai · 6 Shopping Disco-Zen · 7 La Bestia Pop · 8 Un Ángel Para Tu Soledad · 9 Susanita ·
[falta A10] · 10 Espejismo (A11) · 11 Nadie Es Perfecto (A12) · Lado B: 12 Nuestro Amo Juega Al
Esclavo · 13 La Hija Del Fletero · 14 Héroe Del Whisky · 15 Salando Las Heridas · 16 Gran Lady ·
17 Vamos Las Bandas · 18 El Lobo Caído · 19 Un Poco De Amor Francés · 20 Un Tal Brigitte Bardot ·
21 Jijiji. Sin bises marcados.

**`RES-211` — Huracán, 20/11/1993** (release 38054871, "Cordero Atado Club A. Huracán 20 De
Noviembre", notes "20/11/93"). 20 temas, casete.
Lado A: 1 Nadie Es Perfecto · 2 Vamos Las Bandas · 3 El Arte Del Buen Comer · 4 Botija Rapado ·
5 ¡Es Hora De Levantarse Querido! (¿Dormiste Bien?) · 6 Barbazul Versus El Amor Letal · 7 Etiqueta
Negra · 8 Ladrón De Mi Cerebro · 9 Todo Un Palo · Lado B: 10 Lavi-Rap · 11 Un Pacman En El Savoy ·
12 Perdiendo El Tiempo · 13 Ñam Fri Fruli Fali Fru · 14 Queso Ruso · 15 Caña Seca Y Un Membrillo ·
16 Yo Caníbal · 17 Unas Pocos Peligros Sensatos [sic, así figura] · 18 El Pibe De Los Astilleros ·
19 El Sniffer · 20 Jijiji.
Corroboración parcial, sin verificar: la lista de conciertos del Fandom (vía resultado de búsqueda,
`RES-236`) trae 19.11.1993 y 20.11.1993 en el Estadio Tomás Adolfo Ducó.

**`RES-212` — Huracán, 14/5/1994** (release 38054952, "C.A Huracán 14-5-94"). 21 temas, casete.
Lado A: 1 Rock Para El Negro Atila · 2 Ñam Fri Fruli Fali Fru · 3 Un Ángel Para Tu Soledad ·
4 Superlógico · 5 Buenas Noticias · 6 Esa Estrella Era Mi Lujo · 7 Gran Lady · 8 Caña Seca Y Un
Membrillo · 9 El Lobo Caído · 10 Ladrón De Mi Cerebro · 11 Fusilados Por La Cruz Roja · Lado B:
12 Lavi-Rap · 13 Yo Caníbal · 14 Etiqueta Negra · 15 Botija Rapado · 16 Mariposa Pontiac - Rock Del
País · 17 Queso Ruso · 18 El Arte Del Buen Comer · 19 Nadie Es Perfecto · 20 Susanita · 21 Vamos Las
Bandas. Sin bises marcados, y no termina con Jijiji.

**`RES-213` — River Plate 2000** (releases 18962038 y 18962362, "Estadio River Plate Parte 1" y
"Parte 2", CDr unofficial, subidos 2021-05-31 por "sonidos"). Las notas dicen que es el recital del
domingo **16 de abril de 2000**, sonido directo de la consola (por una sola fuente; el Fandom tiene
página para el **15**.04.2000). 26 temas (13 + 13).
Parte 1: 1 Intro . Un Ángel Para Tu Soledad [sic] · 2 Queso Ruso · 3 Alien Duce · 4 Pogo · 5 Drogocop ·
6 Las Increíbles Andanzas Del Capitán Buscapina En Cybersiberia · 7 Motorpsico · 8 Buenas Noticias ·
9 El Pibe De Los Astilleros · 10 Ladrón De Mi Cerebro · 11 Mi Perro Dinamita · 12 Ñam Fri Fru Fri ·
13 Caña Seca Y Un Membrillo.
Parte 2: 1 La Hija Del Fletro [sic] · 2 El Árbol Del Gran Bonete · 3 Estás Frito Angelito · 4 Nuestro
Amo Juega Al Esclavo · 5 Juguetes Perdidos · 6 Blues De La Artillería · 7 Vamos Las Bandas · 8 Esto
Es To To Todo Amigos · 9 Scaramanzia · 10 Nueva Roma · 11 Preso En Mi Ciudad · 12 Ya Nadie Va A
Escuchar Tu Remera · 13 Ji Ji Ji. Sin bises marcados. Falta, por ejemplo, "Tarea fina", que según
una página de canción del Fandom se tocó en River 2000 (sin leer): la lista parece recortada del CDr
o es de otra noche.

**`RES-214` — Alerta de calidad sobre todo lo de Discogs.** (a) Concordia 9/12/1995: Discogs
(release 38068023, 20 temas) contra MusicBrainz (CC0, ya cargado: 25 líneas, con "Desde el alma" y
"Es un sentimiento"): la de Discogs es un subconjunto. (b) Mar del Plata 13/8/94: dos releases de
usuarios distintos dan 20 temas cada uno con contenido distinto (`RES-225`). (c) Lanús: Discogs dice
01-05-92; el Fandom, 03.05.1992. (d) Atenas: Discogs "12/05/1990"; el Fandom, 11.05.1990. (e) River
2000: 16 contra 15 de abril. (f) Huracán 19/11 con A10 faltante. **Conclusión para quien cargue:**
son transcripciones de casetes, pueden estar incompletas, con fecha dudosa y títulos con erratas.
Estado: discrepancias, verificado; cuál es el dato correcto, sin verificar.

### El resto de Discogs (misma salvedad: `Needs Vote`, fuente única, una sola pasada)

**`RES-215` — Obras, 24/8/1990** (38004375, notes "Obras 24-8-90"; el release no trae año), 19 temas:
1 Mi Perro Dinamita · 2 El Infierno Está Encantador Esta Noche · 3 Maldición Va A Ser Un Día Hermoso ·
4 Ropa Sucia · 5 Masacre En El Puticlub · 6 Nueva Roma · 7 La Parabellum Del Buen Psicópata · 8 Ñam
Fri Fruli Fali Fru · 9 Un Pacman En El Savoy · 10 Semen Up · 11 Vamos Las Bandas · 12 La Bestia Pop ·
13 Nuestro Amo Juega Al Esclavo · 14 Fusilados Por La Cruz Roja · 15 Camila · 16 TV Führer · 17 Héroe
Del Whisky · 18 El Sniffer · 19 Nadie Es Perfecto.

**`RES-216` — Obras, 21/12/1990** (38004522, notes "Obras 21-12-90"), 21 temas:
1 Unos Pocos Peligros Sensatos · 2 Vamos Las Bandas · 3 Fusilados Por La Cruz Roja · 4 Un Pacman En
El Savoy · 5 Un Poco De Amor Francés · 6 Nene Nena · 7 Nuestro Amo Juega Al Esclavo · 8 Maldición Va
A Ser Un Día Hermoso · 9 Blues Del Noticiero · 10 Mariposa Pontiac (Rock Del País) · 11 Mi Perro
Dinamita · 12 Criminal Mambo · 13 Toxi Taxi · 14 Camila · 15 Esa Estrella Era Mi Lujo · 16 De Estos
Polvos Futuros Lodos · 17 Masacre En El Puticlub · 18 Patricio Super Show · 19 Nueva Roma · 20 TV
Führer · 21 Ropa Sucia.

**`RES-217` — Obras, 19/4/1991** (38013195 "Parte 1" + 38021430 "Parte 2"), 25 temas (15 + 10).
Parte 1: 1 Nuestro Amo Juega Al Esclavo · 2 Divina TV Führer · 3 Semen Up · 4 Nene Nena · 5 Barbazul
Versus El Amor Letal · 6 Mi Genio Amor · 7 Ya Nadie Va A Escuchar Tu Remera · 8 Roxana Porchelana ·
9 Aquella Solitaria Vaca Cubana · 10 Es Un Sentimiento · 11 Ropa Sucia · 12 Mi Perro Dinamita · 13 El
Blues De La Libertad · 14 Motor Psico · 15 Héroe Del Whisky.
Parte 2: 1 Noticias De Ayer · 2 Pura Suerte · 3 Un Tal Brigitte Bardot · 4 Todo Preso Es Político ·
5 Todo Un Palo · 6 Vencedores Vencidos · 7 Masacre En El Puticlub · 8 Jijiji · 9 Nadie Es Perfecto ·
10 Un Pacman En El Savoy.

**`RES-218` — Obras, 28/12/1991** (38030388, notes "Obras 28.12.91"), 20 temas:
1 Mi Perro Dinamita · 2 Barbazul Versus El Amor Letal · 3 Un Poco De Amor Francés · 4 Fusilados Por
La Cruz Roja · 5 Toxi-Taxi · 6 Salando Las Heridas · 7 Héroe Del Whisky · 8 Tarea Fina · 9 Vencedores
Vencidos · 10 Semen-Up · 11 La Parabellum Del Buen Psicópata · 12 Nueva Roma · 13 El Blues De La
Libertad · 14 Queso Ruso · 15 Blues De La Artillería · 16 Divina TV Führer · 17 Nadie Es Perfecto ·
18 Aquella Solitaria Vaca Cubana · 19 Todo Un Palo · 20 Vamos Las Bandas.

**`RES-219` — Skylab, 7/7/1989** (17164714, año 1989, submitters HiFiCyborg y APRicotera), 24 temas.
La nota dice "Track B1: Rock Para Los dientes appears as El sniffer in original tracklist".
1 Himno Nacional Argentino · 2 Ya Nadie Va A Escuchar Tu Remera · 3 El Regreso de Mao · 4 Música
Para Pastillas · 5 Un Pacman En El Savoy · 6 La Parabellum Del Buen Psicópata · 7 Nadie Es Perfecto ·
8 Vamos Las Bandas · 9 Masacre En El Puticlub · 10 Vencedores Vencidos · 11 Patricio Super Show ·
12 Maldición Va A Ser Un Día Hermoso / Blues Del Noticiero [un renglón, dos temas] · 13 Nuestro Amo
Juega Al Esclavo · 14 Rock Para Los Dientes · 15 Ropa Sucia · 16 Héroe Del Whisky · 17 Barbazul Vs El
Amor Letal · 18 Semen-up · 19 Todo Preso Es Político · 20 Unos Pocos Peligros Sensatos · 21 Aquella
Solitaria Vaca Cubana · 22 Nene Nena · 23 Jijiji · 24 Ñam Fri Frufi Fali Fru.

**`RES-220` — Pinar de Rocha, 28/7/1989** (37996197, notes "En Vivo Pinar De Rocha 28-7-89"), 13 temas:
1 Nene Nena · 2 Roto Y Mal Parado · 3 Aquella Solitaria Vaca Cubana · 4 Música Para Pastillas · 5 Ella
Debe Estar Tan Linda · 6 Jijiji · 7 Barbazul Versus El Amor Letal · 8 Yo No Me Caí Del Cielo · 9 Blues
Del Noticiero · 10 Masacre En El Puticlub · 11 Nadie Es Perfecto · 12 Criminal Mambo · 13 Ya Nadie Va A
Escuchar Tu Remera.

**`RES-221` — Teatro Atenas, La Plata, "12/05/1990"** (30862161, CD, submitter Guillote_Segundo, sin
notes), 15 renglones: 1 Divina TV Führer · 2 Vamos las Bandas · 3 Roto y Mal Parado · 4 Mi Perro
Dinamita · 5 Susanita - Indio Enojado - Susanita · 6 Fusilados por la Curz Roja [sic] · 7 Héroe del
Whisky · 8 Nuestro Amo Juega al Esclavo · 9 El Ferry · 10 Madición va a ser un Día Hermoso - Blues del
Noticiero [sic] · 11 Nueva Roma · 12 Ropa Sucia · 13 Rock para los Dientes · 14 Música para Pastillas ·
15 Mariposa Pontiac - Rock and Roll del País - El Gordo Tramposo - Un tal B.B. (varios temas en un
renglón).

**`RES-222` — Lanús, "01-05-92"** (38046690), 21 temas: 1 El Pibe De Los Astilleros · 2 Un Pacman En
El Savoy · 3 Un Poco De Amor Francés · 4 Fusilados Por La Cruz Roja · 5 La Parabellum Del Buen
Psicópata · 6 Mi Perro Dinamita · 7 Todo Un Palo · 8 Música Para Pastillas · 9 Queso Ruso · 10
Semen-Up · 11 Toxi-Taxi · 12 Tarea Fina · 13 El Blues De La Artillería · 14 Nueva Roma · 15 Salando
Las Heridas · 16 Ella Debe Estar Tan Linda · 17 Masacre En El Puticlub · 18 Vamos Las Bandas · 19
Barbazul Versus El Amor Letal · 20 Nadie Es Perfecto · 21 Maldición Va A Ser Un Día Hermoso. (Fandom:
03.05.1992 en el Microestadio Antonio Rotili; discrepancia de fecha.)

**`RES-223` — Centro Municipal de Exposiciones, 2/10/1992** (38046786), 26 temas: 1 Fuegos De Octubre ·
2 Vamos Las Bandas · 3 Un Poco De Amor Francés · 4 El Pibe De Los Astilleros · 5 Salando Las Heridas ·
6 Nadie Es Perfecto · 7 Maldición Va A Ser Un Día Hermoso · 8 Blues Del Noticiero · 9 Motor Psico ·
10 Todo Preso Es Político · 11 Camila · 12 Queso Ruso · 13 Nueva Roma · 14 La Bestia Pop · 15 Ñam Fri
Fruli Fali Fru · 16 El Arte Del Buen Comer · 17 Toxi-Taxi · 18 TV Führer · 19 Todo Es Efímero · 20 Mi
Perro Dinamita · 21 Un Sentimiento · 22 Barbazul Versus El Amor Letal · 23 Un Tal Brigitte Bardot ·
24 Un Pacman En El Savoy · 25 Jijiji · 26 Nene Nena.

**`RES-224` — Rosario, Sociedad Rural, 10/12/1993** (21128329, notes "Recorded at Sociedad Rural,
Rosario, Santa Fe, Dec 10, 1993", HiFiCyborg), 20 renglones: 1 Camila · 2 Vamos Las Bandas · 3 Pituca ·
4 Botija Rapado · 5 Angel De La Soledad · 6 Salando Las Heridas · 7 Lobo Caido · 8 Ñam Fri Frufi Fali
Fru · 9 Ladron De Mi Cerebro · 10 Queso Ruso · 11 Caña Seca Y Un Membrillo · 12 La Bestia Pop · 13 Yo
Canibal · 14 Etiqueta Negra · 15 Perdiendo El Tiempo · 16 Susanita · 17 Nueva Roma · 18 Buenas
Noticias · 19 Gran Lady · 20 Ji Ji Ji / Perro Dinamita [un renglón, dos temas].

**`RES-225` — Mar del Plata, 13/8/1994, dos versiones distintas.** (a) release 38063124 "Mar Del Plata
13-8-94" (aleposecd), 20 temas: 1 Un Ángel Para Tu Soledad · 2 Mi Perro Dinamita · 3 El Arte Del Buen
Comer · 4 Buenas Noticias · 5 Nueva Roma · 6 Roxana Porchelana · 7 De Estos Polvos, Futuros Lodos ·
8 Botija Rapado · 9 Queso Ruso · 10 Lavi-Rap · 11 Fusilados Por La Cruz Roja · 12 Cuá Cuá Amén · 13
Camila · 14 Ladrón De Mi Cerebro · 15 Canción Para Naufragios · 16 Rock De Las Abejas · 17 Caña Seca Y
Un Membrillo · 18 Nadie Es Perfecto · 19 El Lobo Caído · 20 Jijiji. (b) release 21032017 "Dance Hall
Go! Sábado 13 de agosto 22 hs." (HiFiCyborg, notes "Recorded at Dance Hall Go!, Ciudad de Mar del
Plata, Aug 13, 1994"), 20 temas: 1 Un Angel Para Tu Soledad · 2 Mi Perro Dinamita · 3 El Arte Del
Buen Comer · 4 Buenas Noticias · 5 Nueva Roma · 6 Roxana Porchelana · 7 De Estos Polvos, Futuros
Lodos · 8 Botija Rapado · 9 Queso Ruso · 10 Lavi Rap · 11 Fusilados Por la Cruz Roja · 12 Cuá Cuá
Amén · 13 Canción Para Naufragios · 14 Rock de Las Abejas · 15 Caña Seca y Un Membrillo · 16 Nadie Es
Perfecto · 17 El Lobo Caído · 18 Susanita · 19 Ñam fi frufi fali fru · 20 Ji Ji Ji. La (a) tiene
Camila y Ladrón de mi cerebro y no tiene Susanita ni Ñam; la (b), al revés. **Ninguna de las dos es
"la" lista de la noche.**

**`RES-226` — Mar del Plata, Go! Disco, 13/10/1995** (38067258 "1" + 38067378 "2", aleposecd; sin notes
más que el título), 22 temas (13 + 9). Parte 1: 1 Un Ángel Para Tu Soledad · 2 Nadie Es Perfecto · 3
Un Pacman En El Savoy · 4 El Arte Del Buen Comer · 5 Nueva Roma · 6 Etiqueta Negra · 7 Aquella
Solitaria Vaca Cubana · 8 El Lobo Caído · 9 El Pibe De Los Astilleros · 10 Héroe Del Whisky · 11
Fusilados Por La Cruz Roja · 12 Un Poco De Amor Francés · 13 Buenas Noticias. Parte 2: 1 La Parabellum
Del Buen Psicópata · 2 Barbazul Versus El Amor Letal · 3 Ñam Fri Fruli Fali Fru · 4 Jijiji · 5 Susanita
· 6 Rock Para El Negro Atila · 7 Mi Perro Dinamita · 8 Vamos Las Bandas · 9 Fusilado Por La Cruz Roja
(repetido con el 11 de la Parte 1: error de carga o tema repetido, sin saber).

**`RES-227` — Costa Chaval, Concordia, 9 de diciembre** (38068023, sin año; el 1995 es por
coincidencia con MusicBrainz, no por Discogs). 20 temas, **subconjunto de la lista de MusicBrainz**
(`RES-214`): redundante, no se carga. 1 El Pibe De Los Astilleros · 2 Nadie Es Perfecto · 3 Un Ángel
Para Tu Soledad · 4 Nuestro Amo Juega Al Esclavo · 5 La Parabellum Del Buen Psicópata · 6 El Lobo Caído
· 7 Vamos Las Bandas · 8 Queso Ruso · 9 Ladrón De Mi Cerebro · 10 Fusilados Por La Cruz Roja · 11 Rock
Para El Negro Atila · 12 Caña Seca Y Un Membrillo · 13 Shopping Disco-Zen · 14 Yo Canibal · 15 Aquella
Solitaria Vaca Cubana · 16 Ya Nadie Va A Escuchar Tu Remera · 17 El Arte Del Buen Comer · 18 Divina TV
Führer · 19 Un Tal Brigitte Bardot · 20 Jijiji.

**`RES-228` — Letoile, San Carlos, Santa Fe, "19 y 20 de Agosto"** (38063286; sin año ni noche). **Dato
dudoso.** 21 temas: 1 El Pibe De Los Astilleros · 2 Un Ángel Para Tu Soledad · 3 Semen-Up · 4 Nadie Es
Perfecto · 5 El Arte Del Buen Comer · 6 Nueva Roma · 7 Shopping Disco-Zen · 8 El Lobo Caído · 9 Ladrón
De Mi Cerebro · 10 Fusilado Por La Cruz Roja · 11 Camila · 12 Caña Seca Y Un Membrillo · 13 Buenas
Noticias · 14 Barbazul Versus El Amor Letal · 15 Yo Caníbal · 16 Vamos Las Bandas · 17 Queso Ruso · 18
Mi Perro Dinamita · 19 Ñam Fri Fruli Fali Fru · 20 Un Poco De Amor Francés · 21 Jijiji.

**`RES-229` — Villa María, Córdoba, 14/6/1997** (21142174, HiFiCyborg), 12 temas, probablemente parcial:
1 Nuestro Amo Juega Al Esclavo · 2 El Pibe De Los Astilleros · 3 La Dicha No Es Una Cosa Alegre · 4
Cruz Diablo · 5 Rock Yugular · 6 Shopping Disco Zen · 7 Queso Ruso · 8 Blues De La Libertad · 9
Mariposa Pontiac / Rock Del País · 10 Nene Nena · 11 Ella Baila Con Todos · 12 Fanfarria Del Cabrío.

**`RES-230` — Tandil, "Octubre 1997"** (38095899, CD, aleposecd; sin día), 17 temas, con "Intro" en la
posición 11 tal como figura: 1 El Pibe De Los Astilleros · 2 La Dicha No Es Una Cosa Alegre · 3 Cruz
Diablo! · 4 Shopping Disco-Zen · 5 Rock Yugular · 6 Queso Ruso · 7 Esa Estrella Era Mi Lujo · 8 Mariposa
Pontiac - Rock Del País · 9 Un Ángel Para Tu Soledad · 10 Ñam Fri Fruli Fali Fru · 11 Intro · 12
Fanfarria Del Cabrío · 13 Luzbelito Y Las Sirenas · 14 Juguetes Perdidos · 15 Nueva Roma · 16 Vamos
Las Bandas · 17 Jijiji.

**`RES-231` — Estadio Colón, Santa Fe, 13/12/1997** (21097780, HiFiCyborg, 2 casetes), 22 temas.
Casete 1: 1 El Pibe De Los Astilleros · 2 Angel Para Tu Soledad · 3 Nuotatori Professionisti · 4 La
Dicha No Es Una Cosa Alegre · 5 Nene Nena · 6 Ella Baila Con Todos · 7 Rock Para Los Dientes · 8 Todo
Un Palo · 9 Vencedores Vencidos · 10 Motorpsico · 11 Cruz Diablo! · 12 Parabellum Del Buen Psicopata.
Casete 2: 13 Nuestro Amo Juega Al Esclavo · 14 Esa Estrella Era MI Lujo · 15 Nadie Es Perfecto · 16
Vamos Las Bandas · 17 El Lobo Caido · 18 Un Poco De Amor Francés · 19 Juguetes Perdidos · 20 MI Perro
Dinamita · 21 Mariposa Pontiac / Rock Del Pais · 22 Ji Ji Ji.

**`RES-232` — Shows chicos y anteriores.** (a) Cemento, 23/5/1987 (37970997), 15 temas: 1 Divina TV
Führer · 2 Vencedores Vencidos · 3 Roto Y Mal Parado · 4 La Parabellum Del Buen Psicópata · 5 La Vaca
Cubana · 6 Noticias De Ayer · 7 Cua Cua Amén · 8 Un Tal Brigitte Bardot · 9 Ella Debe Estar Tan Linda ·
10 El Hombre Eléctrico · 11 Ñam Fri Frufi Fali Fru · 12 Criminal Mambo · 13 Masacre En El Puticlub · 14
Vamos Las Bandas · 15 Todo Preso Es Político. (El release 38420742 "Cemento 23 de Mayo de 1987" lista
UN solo tema: no sirve.) (b) Cemento, septiembre 1988 (37996125), 12 temas: 1 Todo Es Efímero · 2 Ella
Debe Estar Tan Linda · 3 Masacre En El Puticlub · 4 Nene Nena · 5 Vencedores Vencidos · 6 Roto Y Mal
Parado · 7 Vamos Las Bandas · 8 El Sniffer · 9 Maldición Va A Ser Un Día Hermoso · 10 Blues Del
Noticiero · 11 Noticias De Ayer · 12 La Bestia Pop. (c) Teatro Podestá, La Plata, 3/8/1988 (38095839),
14 temas: 1 Nene · 2 Masacre En El Puticlub · 3 Vencedores Vencidos · 4 Nadie Es Perfecto · 5 Roto Y
Mal Parado · 6 Yo No Me Caí Del Cielo · 7 Aquella Solitaria Vaca Cubana · 8 Rock Para Los Dientes · 9
La Parabellum Del Buen Psicópata · 10 Noticias De Ayer · 11 Todo Preso Es Político · 12 Vamos Las
Bandas · 13 Jijiji · 14 Ñam Fri Fruli Fali Fru. (d) Garage, La Plata, 8/12/1988 (21031747), 19 temas:
1 ÑAm Fri Fuli Fali Fru · 2 Nene Nena · 3 Vaca Cubana · 4 Divina Tv Fürher · 5 Musica Para Pastillas ·
6 Parabellum (Beat) · 7 Ella Debe Estar Tan Linda · 8 Ji Ji Ji · 9 Maldicion, Va A Aser Un Dia Hermoso
/ Blues Del Noticiero [un renglón, dos temas] · 10 Ropa Sucia · 11 El Sniffer · 12 Que Mal Celo · 13
Vencedores Vencidos · 14 Puticlub · 15 Nadie Es Perfecto · 16 Todo Preso Es Politico · 17 Vamos Las
Bandas · 18 Todo un palo · 19 Yo no me caí del cielo. (e) Teatro San Martín, Mar del Plata, 10/8/1991
(38021565), 19 temas: 1 Semen Up · 2 Unos Pocos Peligros Sensatos · 3 Un Pacman En El Savoy · 4
Aquella Solitaria Vaca Cubana · 5 Mi Perro Dinamita · 6 Toxi-Taxi · 7 Todo Un Palo · 8 Maldición Va A
Ser Un Día Hermoso · 9 Fusilado Por La Cruz Roja · 10 Rock Para Los Dientes · 11 Blues De La Libertad ·
12 Criminal Mambo · 13 Héroe Del Whisky · 14 Ella Debe Estar Tan Linda · 15 Motor Psico · 16 Nadie Es
Perfecto · 17 Vencedores Vencidos · 18 Vamos Las Bandas · 19 Ñam Fri Fruli Gali Fru.

**`RES-233` — EXCLUIDO, no es un show de Redondos.** El release 17373664 "Velódromo Municipal de
Montevideo, Uruguay (Live)" figura bajo el artista de la banda pero el repertorio es de la etapa
solista de Solari (los Redondos se separaron en 2001), año 2005. Juicio del investigador por los
títulos; ningún campo del release lo dice. No usar como setlist de la banda.

**`RES-234` — Lo que NO está en Discogs** (sobre los 75 ítems del artista): Obras 2/12/1989 y cualquier
Obras de 1989 (hay Skylab y Pinar de Rocha, ambos 1989), Huracán 16 y 17/12/1994, River 2001 o
cualquier show de 2001, Vélez, Ferro, Racing 98, Olavarría 97. De las piratas en VHS (Obras 91, Cemento
87, MdP 10-8-91, Balcarce 17-8-91) no se comprobó si tienen tracklist. Quedaron sin abrir 18 releases
(37970412, 37970181, 37942473, 37934181, 37978677, 37978755, 17163982, 21032749, 21033286, 21043630,
21033580, 38068707, 38077170, 38079906, 38088018, 38088126, 38030295 —HTTP 429—, 9410841). Las
búsquedas por texto en `database/search` no sumaron releases nuevos. Estado: verificado (ausencias
entre los ítems del artista).

## Fuente 2 — Fandom (Redonditos Wiki): **NO es CC0**

| # | Hallazgo | URL | Fecha | Estado |
|---|---|---|---|---|
| `RES-235` | El wiki "Redonditos Wiki" en Fandom tiene una página por recital con repertorio. Aparecieron en búsquedas: 02.12.1989 Estadio Obras Sanitarias, 15.04.2000 Estadio Monumental ("23 songs across two sets", show interrumpido por incidentes), 04.08.2001 Estadio Chateau Carreras (Córdoba), 22.04.2001 Estadio Centenario de Montevideo, 21.12.1990 Obras, 11.05.1990 Atenas, 13.12.1997 Santa Fe, 18.12.1998 Avellaneda, 03.05.1992 Lanús, 13.08.1994 Go! Disco. **Todo lo entre comillas es el resumen del buscador, no la página.** Ninguna página se pudo abrir (HTTP 402 del `WebFetch`; el hilo principal probó con `curl` y dio 403). Licencia: Fandom dice que, salvo excepción, el texto de sus wikis es **CC BY-SA 3.0 Unported** (cita del buscador sobre fandom.com/Licensing; esa página dio 402). **El pie de esta wiki puntual no se vio** y algunas wikis usan variantes NC. Si es CC BY-SA, cambia la frontera de `CTR-19.8` (atribución + copyleft) y hay que decidirlo antes de cargar | https://redonditos.fandom.com/es/wiki/02.12.1989_Estadio_Obras_Sanitarias,_Capital_Federal · https://redonditos.fandom.com/es/wiki/15.04.2000_Estadio_Monumental,_Capital_Federal · https://redonditos.fandom.com/es/wiki/04.08.2001_Estadio_Chateau_Carreras,_C%C3%B3rdoba · https://redonditos.fandom.com/es/wiki/22.04.2001_Estadio_Centenario_de_Montevideo,_Uruguay · https://www.fandom.com/Licensing | 2026-10-15 | existencia de páginas: verificado; contenido y licencia de la wiki: **sin verificar** |
| `RES-236` | Lista de conciertos del Fandom, según el resumen del buscador: Huracán 19.11.1993, 20.11.1993, 14.05.1994, 16.12.1994 y 17.12.1994, más pruebas de sonido de 1993 y 1994. Coincide con las fechas de Discogs (`RES-210` a `RES-212`) | https://redonditos.fandom.com/es/wiki/Lista_de_conciertos_de_Patricio_Rey_y_sus_Redonditos_de_Ricota | 2026-10-15 | sin verificar (resumen de buscador) |

**Aviso de riesgo:** el contenido del Fandom puede estar copiado de setlist.fm (`RES-73.1`). Antes de
aprovecharlo hay que cotejar quién lo escribió.

## Otras fuentes

| # | Hallazgo | URL | Fecha | Estado |
|---|---|---|---|---|
| `RES-237` | archive.org: ningún ítem de recital con CC0, CC BY o CC BY-SA. De 230 ítems de audio, los 48 con `licenseurl` y "redonditos" son: marca de dominio público (`publicdomain/mark/1.0`, puesta por quien subió: no es una licencia) en discos de estudio y en "Palacio Peñarol 22 de Julio de 1989" y "Chateau Carrera 4 de Agosto del 2001" (un `.rar` cada uno, sin tracklist en la metadata); CC BY-NC-ND en Oktubre y algunos programas de radio. Dos ítems CC BY-SA 4.0 no son setlists. Cualquier ND/NC: no apto. Los 230 no se revisaron uno por uno | https://archive.org/metadata/chateau-carrera-4-de-agosto-del-2001 · https://archive.org/metadata/palacio-penarol-22-de-julio-de-1989 | 2026-10-15 | verificado (ausencia con setlist) |
| `RES-238` | Wikipedia ES (búsqueda "Redonditos Huracán 1993 repertorio") devolvió dos artículos sin relación. Commons ("Redonditos Ricota recital"), una sola foto de Solari. Sin vía nueva respecto de `INV-76` | https://es.wikipedia.org/w/api.php · https://commons.wikimedia.org/w/api.php | 2026-10-15 | verificado |
| `RES-239` | Otros repositorios (Open Data argentino, Wikibooks, bases de conciertos CC): ninguno aparece. Solo notas de prensa con listas parciales y sin licencia abierta (Tiempo Argentino cita algunos temas de Huracán dic 94). No se citan | https://www.tiempoar.com.ar/ta_article/subieron-a-youtube-un-video-de-alta-calidad-de-los-shows-de-los-redondos-en-huracan/ | 2026-10-15 | verificado (ausencia) |

## Sin resolver

- **Huracán 16 y 17/12/1994, Obras 2/12/1989, River 2001**: no hay lista abierta legible. Las dos
  primeras y la de Obras tienen página en el Fandom, que no se pudo abrir.
- **Licencia real de redonditos.fandom.com** (pie de página y Terms): alguien con navegador tiene que
  copiar el texto del pie de una página de recital.
- **Discogs**: si los releases de `RES-210` a `RES-232` están en el volcado `discogs_20261001_releases.xml.gz`
  y qué son los "restricted data" de los API Terms (403). Verificar con el volcado o con los términos en
  un navegador antes de citar CC0 para estos registros puntuales.
- **Fechas**: River 2000 (15 o 16/4), Lanús (1 o 3/5/92), Atenas (11 o 12/5/90).
- **Cruce con los 105 de `cancionero.json`**: no se hizo. Hay variantes como "Perro Dinamita", "Unas Pocos
  Peligros Sensatos", "Nene", "Fusilado/Fusilados", "Ñam Fri Fru Fri". Lo hace `resolverTema()` del
  script de ingesta.

## Siguiente

- **`arquitectura` (`CTR-19`, frontera de `CTR-19.8`):** decidir si Discogs entra como fuente CC0 de
  `recitales.json` con estado "transcripción de fan, sin votar" y atribución de cortesía (id del release
  y usuario). Hoy el script de ingesta solo sabe MusicBrainz. Decidir también qué pasa con el Fandom si
  aparece.
- **`contenido`:** cada lista de Discogs sirve como "se tocó esa noche" solo rotulada como transcripción de
  fan de un casete; nunca como respuesta única a "¿qué tema abrió?" ni "¿cuántos tocaron?" (`RES-214`).
- **Hilo principal:** abrir con navegador las páginas del Fandom de `RES-235` y `RES-236`, copiar el pie
  de licencia, y recién entonces decidir.
