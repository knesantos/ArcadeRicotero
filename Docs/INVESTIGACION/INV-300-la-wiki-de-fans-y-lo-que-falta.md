# INV-300 — Una vuelta entera: la wiki de fans, Wikipedia y el memoir, contra lo que el sitio ya tiene

> Pedido del usuario, 2026-10-15: *"Hace una vuelta entera de buscar mas informacion en la wiki para
> la web y juegos. Todo lo que consideres pertinente."* Y enseguida: *"me refiero a la parte tipo wiki
> de nuestro sitio"*. O sea: **material nuevo para la Redondopedia** (hoy 38 artículos, el piso de
> `PRD-redondopedia.md`), y de paso para los juegos.
>
> **Consume:** `RES-04`, `RES-05`, `RES-21` (el memoir), `RES-47`, `RES-73`, `RES-76`..`RES-88`
> (`INV-76`), `D-14`, `D-72`, `CTR-19`.
> **Afecta:** `redondopedia.json` (vía `contenido`), `quiz.json`, `mas-o-menos.json`, "En vivo" y
> "Armá tu recital" (`D-72`), `recitales.json` (`CTR-19`, vía `arquitectura`).
> **Fecha de consulta de todo lo de esta ficha: 2026-10-15.**
> **Lo hizo el hilo principal en el papel de `investigador`**, sin subagentes, porque la PC estaba
> sin memoria libre (678 MB de RAM, paginación en el tope, 41 procesos `claude`). Rango tomado:
> `RES-300`..`RES-337`, libre en `main` y en todas las ramas de `origin` al 2026-10-15. **`RES-317`
> no se usó** (quedó adentro de `RES-316`) y no se reutiliza.

## Cómo se leyó, y cuánto vale cada fuente — leer antes que nada

| Fuente | Cómo se leyó | Licencia | Qué vale acá |
|---|---|---|---|
| **Wiki Redonditos en Fandom** (`redonditos.fandom.com/es`) | Las 329 páginas de artículos enteras, por la API de MediaWiki con `curl` (`api.php`, sin navegador). **El HTTP 402 de `RES-86` era de `WebFetch`, no del sitio**: con `curl` la API contesta 200 | CC-BY-SA (lo dice la propia API en `rightsinfo`; la ayuda de Fandom la da como 3.0) | Conocimiento de fans, armado por relato y por grabaciones piratas. **Rótulo por defecto: leyenda**, salvo que otra fuente lo confirme. Se contradice sola en varios lugares (ver `RES-301`) |
| **Wikipedia en español** | Por la API (`extracts`), siete artículos | CC-BY-SA 4.0 | Mejor citada que la wiki de fans, y gran parte del texto de la wiki de fans es copia de esta. Donde las dos coinciden **no son dos fuentes**: es una |
| **El memoir** (`RES-21`, *Recuerdos que mienten un poco*) | `pdftotext` del PDF que está en esta carpeta | — | Lo que el Indio cuenta en primera persona: **testimonio**, con página. La página que se cita es la del PDF (la impresa va al lado cuando se ve) |
| **Prensa** | `WebSearch`, resúmenes del buscador; **ninguna nota se abrió** | — | Solo para lo de 2023–2026 que la wiki de fans trae y nadie más |

**La regla que se aplicó:** un dato de la wiki de fans que Wikipedia, el memoir o la prensa confirman
sube a **hecho** o **testimonio**. Uno que solo está en la wiki de fans queda en **leyenda**, que en
este sitio es contenido de primera (`D-14`) pero **no va como respuesta correcta de una pregunta**.

**Cómo se regenera todo** (los scripts quedaron en `Docs/INVESTIGACION/INV-300/`):

```
node Docs/INVESTIGACION/INV-300/bajar-wiki.mjs <carpeta>          # titulos.json y paginas.json (~1 MB)
node Docs/INVESTIGACION/INV-300/recitales-wiki.mjs <carpeta>/paginas.json src/data/cancionero.json <carpeta>
node Docs/INVESTIGACION/INV-300/temas-wiki.mjs <carpeta>/paginas.json <carpeta>/temas.txt
```

El volcado no se guardó en el repo a propósito: pesa un mega, cambia todos los días y se baja en
veinte segundos.

---

## Frente A — La wiki de fans como fuente

### RES-300 — La wiki se lee entera, y reabre `RES-86`

- **Rótulo:** hecho.
- **Hallazgo:** al 2026-10-15 la wiki tiene **329 artículos** (1.131 páginas contando las de
  servicio), 625 imágenes y 3 editores activos. Licencia declarada por la API: CC-BY-SA. Todo el texto
  de los artículos se baja por `api.php?action=query&prop=revisions&rvslots=main` en lotes de 50.
- **Qué cambia:** `RES-86` decía *"no se pudo leer el contenido"* y dejaba abierta la pregunta de si
  la lista de conciertos trae temas por show. **Los trae**, y no en la página de la lista sino en una
  página por recital (`RES-301`).
- **URL:** https://redonditos.fandom.com/es/api.php?action=query&meta=siteinfo&siprop=statistics|rightsinfo

### RES-301 — Qué hay adentro, y dónde se contradice

- **Rótulo:** hecho (sobre la wiki, no sobre la banda).
- **Hallazgo:** 122 páginas en la categoría de recitales de los Redondos (**99 con la lista de temas**,
  de 1978-01-07 a 2001-08-04, 19 temas de promedio por noche), 33 de los Fundamentalistas, 12 de Skay
  y los Fakires, y listas de conciertos de los Decoradores. 63 páginas de temas de los Redondos, 14
  de inéditos, 11 de discos, 11 de personas (`RES-318`..`RES-327`), y sueltas: el popurrí, el
  escapulario, *En directo*, Olga Sudorova, la lista de covers.
- **Contradicciones internas que se encontraron leyendo** (por eso el rótulo por defecto es leyenda):
  - *Queso ruso*: la página del tema dice que debutó el 22-11-**1992** en Autopista Center; la página
    del recital del 22-11-**1991** la marca como estreno, y la de Montevideo 2001 también.
  - El Piojo Ábalos: *"se oficializó el 08.07.1983 en el Teatro Bambalinas"*, pero la página de ese
    recital es del 08-07-**1984**.
  - Olga Sudorova: *"mencionada por primera vez el 14 de junio de 1986"* y en la línea siguiente
    *"repetida el 16.05.86"*, que es anterior.
  - Willy Crook: la página de Crook y la de Cemento lo hacen salir en **mayo** de 1987; la página de la
    banda (copiada de Wikipedia) dice **noviembre** de 1987.
  - El recital de Diplodocum y La Cofradía en el Teatro Opera de La Plata: 5-11-1969 en la historia de
    la banda, 29-11-1969 en la ficha del tema.
  - Asistencias: River 2000 dice 80.000 (Wikipedia: 70.000), Tandil 1997 dice 25.000 (Wikipedia:
    21.000), Santa Fe 1997 dice 30.000 (Wikipedia: más de 20.000).
- **Para quien use esto:** ninguna fecha o cifra de la wiki de fans va como respuesta de quiz ni de
  "Más o menos" sin la confirmación de otra fuente.

### Cruce con `INV-425` (la sesión de `T-425`, el mismo día)

`INV-425` buscó listas con licencia abierta, encontró 29 en Discogs (CC0) y **no pudo abrir ninguna
página de la wiki de fans**: dejó `RES-235` y `RES-236` "sin verificar" y pidió que alguien con
navegador las leyera. Con el volcado de esta ficha:

- **`RES-235` queda verificada:** las páginas que nombra existen y traen repertorio: Obras 2-12-1989,
  Monumental 15-4-2000 (23 temas) y 16-4-2000 (24), Chateau Carreras 4-8-2001 (27), Centenario
  22-4-2001 (24), Obras 21-12-1990, Atenas 11-5-1990 (21) **y** 12-5-1990 (20).
- **`RES-236` queda verificada:** Huracán 19 y 20-11-1993, 14-5-1994, 16 y 17-12-1994, todas con lista.
- **Las dos fechas en duda de `INV-425`:** la wiki tiene **dos** noches en Atenas (11 y 12-5-1990), así
  que la "12/05/1990" de Discogs y la "11.05.1990" de la wiki pueden ser noches distintas, no un error.
  En Lanús tiene tres páginas (1, 2 y 3-5-1992), con lista solo la del 1; Discogs dice 01-05-92.
- **El riesgo de que la wiki copie a setlist.fm (`RES-73.1`):** ninguna de las 329 páginas cita
  setlist.fm, y 80 citan como registro un audio "AIRE" o de consola. Eso **no prueba** que no se haya
  copiado, pero es lo que la wiki declara: que transcribe grabaciones.
- **La licencia:** la API la da como CC-BY-SA con enlace a `fandom.com/es/licensing-es`. Lo que
  `INV-425` pide, el pie de página leído en un navegador, sigue sin hacerse.

---

## Frente B — En vivo: lo que se puede contar con 99 listas

**Todo este frente es un conteo sobre la muestra de la wiki**, no sobre la historia entera: la banda
tocó muchas más noches que 99. El rótulo honesto es **"en las 99 listas de la wiki de fans"**, y así
tiene que decirlo cualquier pantalla que lo use. Cruzado contra los 105 temas de `RES-20`.

### RES-302 — Lo que más sonó

- **Rótulo:** hecho sobre la muestra.
- **Hallazgo (noches sobre 99):** *Jijiji* 79 · *Vamos las bandas* 69 · *Nueva Roma* 57 · *Ñam fri
  frufi fali fru* 56 · *Nadie es perfecto* 56 · *Mi perro dinamita* 51 · *Divina TV Führer* 49 ·
  *Queso ruso* 48 · *El pibe de los astilleros* 42 · *Aquella solitaria vaca cubana* 37 · *Rock para
  los dientes* 37 · *La parabellum del buen psicópata* 36 · *Fusilados por la cruz roja* 36 · *Un
  ángel para tu soledad* 36 · *Semen-up* 35.
- **Lo que menos:** los temas de *Momo sampler* suenan 3 veces cada uno (las tres noches de 2001) y
  *Pierre, el vitricida* 2.
- **Contraste:** `RES-73` (setlist.fm, 256 listas) es otra muestra; si las dos coinciden en el primer
  puesto, eso sí se puede decir sin miedo.

### RES-303 — Con qué abrían y con qué cerraban

- **Rótulo:** hecho sobre la muestra.
- **Cerraban:** *Jijiji* cierra **43 de las 99** noches; después *Ñam fri frufi fali fru* (10) y
  *Mariposa Pontiac – Rock del país* (8).
- **Abrían:** *Un ángel para tu soledad* (14), *El pibe de los astilleros* (13), *Unos pocos peligros
  sensatos* (11), *Divina TV Führer* (8), *Ya nadie va a escuchar tu remera* (7).
- **Para "Armá tu recital":** es la mejor vara que existe para decirle a la gente que su lista
  "cierra como cerraban los Redondos", siempre con el rótulo de la muestra.

### RES-304 — Dónde sonó cada disco antes de salir

- **Rótulo:** leyenda (es la marca *"(debut)"* que la wiki pone en sus listas; la confirma
  Wikipedia en Racing 1998 y en *Bang! Bang!*).
- **Hallazgo — la costumbre de estrenar en vivo antes del disco:**
  - *Gulp!* (1985): casi todo el 8-7-1984 en el Teatro Bambalinas.
  - *Oktubre* (1986): el 16-5-1986 en Paladium, cinco meses antes del disco.
  - *Un baión* (1988): mayo de 1987, Caras + Caras y Cemento.
  - *¡Bang! ¡Bang!* (1989): durante 1988; Wikipedia lo dice así: canciones que la banda tocaba desde
    mucho antes.
  - *La mosca y la sopa* (1991): cinco temas desde el 11-5-1990 (Estadio Atenas, La Plata) y el resto
    el 22-11-1991 en Autopista Center.
  - *Lobo suelto / Cordero atado* (1993): las dos noches de Huracán, 19 y 20-11-1993.
  - *Luzbelito* (1996): el 7-6-1996 en Go! Disco (Mar del Plata) y el 17-8-1996 en L'etoile (San
    Carlos Centro), antes de que saliera.
  - *Último bondi a Finisterre*: diez temas de una vez, Racing, 18-12-1998.
  - *Momo sampler*: el disco entero, Estadio Centenario de Montevideo, 22-4-2001.
- **Para el quiz** sirve la forma *"¿en qué recital presentaron X?"* solo donde hay dos fuentes:
  Racing 1998 (Wikipedia) y Huracán 1993 (`huracan-93-94`, ya en la Redondopedia).

### RES-305 — Los temas que no sonaron nunca en la muestra

- **Rótulo:** hecho sobre la muestra; **leyenda** si se dice "nunca".
- **Hallazgo:** seis de los 105 no aparecen en ninguna de las 99 listas: *Pianito – Jam* (oculto en
  *Gulp!*), *Invocación* (instrumental), *Capricho Magyar*, *Soga de Caín*, *¡¿Lobo estás?!* y *San
  Telmo*, cinco de ellos de 1993. Para *¡Lobo! ¿estás?* la wiki dice además que nunca se tocó después
  del disco y que la única versión en vivo conocida es la de 1982, cuando todavía se llamaba
  "No late más" (`RES-330`).

### RES-306 — Las noches más largas

- **Rótulo:** hecho sobre la muestra.
- **Hallazgo:** 27 temas en tres noches: King Kong Stadium (31-10-1992), Patinódromo de Mar del Plata
  (8-3-1997) y **Chateau Carreras, Córdoba (4-8-2001), la última**. Le siguen cinco noches de 26.

### RES-307 — La última noche y la que no fue

- **Rótulo:** hecho la última (Wikipedia y la wiki de fans); **leyenda (sin abrir)** la cita de Poli.
- **Hallazgo:** el último recital fue el **4-8-2001 en el Estadio Chateau Carreras, Córdoba**, ante
  unos 40.000 (Wikipedia). Había otro anunciado para el **8-12-2001 en Santa Fe** (primero pensado
  para el Gigante de Arroyito), con entradas impresas, que se suspendió. La wiki de fans le atribuye a
  Poli, en la revista *La García*, que Patricio Rey creía que no había ánimo para fiestas; la nota no
  se abrió. En noviembre de 2001 la banda anuncia la separación (Wikipedia).
- **Registro 3:** en Córdoba murió un hombre de 31 años al caer de la tribuna (Wikipedia lo nombra). Si
  la Redondopedia lo cuenta, va seco, como Bulacio y Olavarría (`CNT-06`).

### RES-308 — Olavarría 1997: la prohibición, la única conferencia de prensa televisada, y Tandil

- **Rótulo:** hecho (Wikipedia, con cita en el artículo).
- **Hallazgo:** en agosto de 1997 el intendente de Olavarría, Helios Eseverri, prohibió los recitales
  del 16 y 17 de agosto. La banda dio entonces **la única conferencia de prensa televisada en directo
  de su carrera**, para explicar la cancelación y anunciar fecha y lugar nuevos. El recital se hizo el
  **4-10-1997 en Tandil**, sin incidentes, con 21.000 personas y lluvia toda la noche.
- **Por qué importa:** cierra la duda abierta en `REV-22`/`FIND-141` (*"Olavarría o Tandil"*, `RES-05`,
  `N-016`): **son las dos**. La conferencia fue *por* Olavarría, y el recital terminó en Tandil.
  `QZ-064` quedó bien corregido.
- **URL:** https://es.wikipedia.org/wiki/Patricio_Rey_y_sus_Redonditos_de_Ricota (revisión del 2026-08-30)

### RES-309 — River 2000

- **Rótulo:** hecho la fecha y la cifra (Wikipedia); registro 3 el incidente.
- **Hallazgo:** dos noches en el Monumental, 15 y 16-4-2000, **70.000 personas cada noche** según
  Wikipedia (la wiki de fans dice 80.000: no usar), el pico de convocatoria de la banda. La primera
  noche hubo una pelea en el campo con un muerto y siete heridos de arma blanca; la banda paró, volvió
  y terminó con las luces prendidas. El Indio dijo que esa era una de las últimas noches que tocaban.
- **Para el quiz:** "¿en qué estadio fue su recital más grande?" tiene respuesta firme: River.

### RES-310 — Racing 1998, la presentación de *Último bondi*

- **Rótulo:** hecho (Wikipedia); leyenda el ensayo.
- **Hallazgo:** 18 y 19-12-1998 en el estadio de Racing, 50.000 por noche, con el disco nuevo
  estrenado entero y una recepción fría que la prensa de la época registró: la cancha se encendió con
  los clásicos. La filmación de una de las noches se filtró por YouTube en 2010 (Wikipedia dice el 19;
  la wiki de fans tiene un DVD del 18 salido en 2010: contradicción sin resolver). En esas noches el
  Conejo Jolivet vuelve como segunda guitarra (`RES-323`).
- **Leyenda:** la wiki de fans tiene el audio de un ensayo de diciembre de 1998 en Luzbola, el estudio
  del Indio en Parque Leloir, con diez temas del disco.

### RES-311 — El primer Obras y "Carlitos del Sur"

- **Rótulo:** hecho (Wikipedia la cita y la wiki de fans la transcribe del audio).
- **Hallazgo:** en el primer Obras (2-12-1989) el Indio cortó antes de *Un Pacman en el Savoy* para
  insultar desde el escenario a Carlos Polimeni, del diario *Sur*, que había escrito que la banda nunca
  iba a tocar en Obras. La wiki de fans agrega que en diciembre de 1991, en Obras, el Indio le pidió a
  la gente que no comprara un libro sobre la banda en el que participaba Polimeni (leyenda).
- **Para `debut-en-obras`:** es el detalle que le falta al artículo.

### RES-312 — Pan Caliente y los Demos RCA, 1982

- **Rótulo:** hecho (Wikipedia, y coincide la wiki de fans).
- **Hallazgo:** el 2-1-1982, en la cancha de Excursionistas, el festival de la revista *Pan Caliente*
  ante unas cinco mil personas: **la única vez que el Indio aceptó tocar de día en un festival**, y la
  noche en que la banda se hizo conocida. En abril de ese año grabaron los **Demos RCA** (lado A en
  estudio, lado B en vivo de Pan Caliente), con *Nene nena*, *Un tal Brigitte Bardot*, *Mariposa
  Pontiac*, *Superlógico* (coros de las Bay Biscuits: Fabiana Cantilo, Isabel de Sebastián, Diana
  Nylon y Viviana Tellas) y *Pura suerte*. RCA no los fichó, y las FM pasaban el demo igual.

### RES-313 — Las noches sin el Indio

- **Rótulo:** hecho GEBA y Parque Lezama (Wikipedia); leyenda el Margarita Xirgu (solo la wiki de fans).
- **Hallazgo:** Wikipedia cuenta dos, y las dos por lo mismo: la banda votó tocar de día en un
  festival, el Indio votó en contra y no fue. El **21-9-1982 en GEBA, con Luca Prodan cantando** y
  Roberto Pettinato en saxo. Y el 23-10-1983 en Parque Lezama, en el "Encuentro por la Vida", con Skay
  en la voz y Rodolfo Gorosito en segunda guitarra. La wiki de fans suma una tercera, el 22-12-1979 en el
  Margarita Xirgu, cuando el Indio vivía en Valeria del Mar; Wikipedia nombra ese recital pero no dice
  que faltara.
- **Para el quiz:** "¿quién reemplazó al Indio en un recital de 1982?" Luca Prodan: dos fuentes.

### RES-314 — Cemento, 23-5-1987

- **Rótulo:** hecho Luca (Wikipedia); leyenda lo demás (wiki de fans).
- **Hallazgo:** durante *Criminal Mambo* Luca Prodan se subió al escenario y cantó pasajes en un
  inglés oscuro, después de unas líneas del Indio en italiano (Wikipedia). La wiki de fans agrega que
  esa noche el Indio recitó *"soldaditos bravos muchachitos"*, frase que volvería 26 años después en el
  título *Pajaritos, bravos muchachitos* (2013), y que fue la primera vez que la banda llenó Cemento.
  Luca murió el 22-12-1987; la wiki dice que el show de Cemento del 26-12 se le dedicó.

### RES-315 — Estadio Atenas, 12-5-1990: el gas

- **Rótulo:** leyenda (sin abrir el audio): lo transcribe la wiki de fans.
- **Hallazgo:** la policía tiró gas pimienta dentro del estadio cerrado, hubo una estampida y el show
  se cortó. La banda volvió con una zapada, Skay tocando con un pañuelo en la cara, y el Indio le habló
  a la gente: que no alimentaran lo que se les venía encima, que estaban solos, que se cuidaran.
- **Registro 3** si la Redondopedia lo usa: es represión contada por una fuente de fans.

### RES-316 — Datos sueltos de la gira, para la Redondopedia

- **Rótulo:** leyenda (wiki de fans), salvo donde se dice.
- 1989 fue el año con más recitales (la wiki: 16 páginas de ese año).
- King Kong Stadium, 1992: se anunciaron diez noches, "una comunión de 10 encuentros", y por el estado
  del lugar recién inaugurado se hicieron las últimas tres.
- El último recital en una discoteca: L'etoile, San Carlos Centro (Santa Fe), 18-8-1996. Wikipedia
  confirma que L'etoile tenía capacidad para 3.000 personas y se llenó.
- Santa Fe por primera vez: 28-12-1996, estadio 15 de Abril. La noche del 13-12-1997, en el estadio
  de Colón, el campo se inundó el día anterior y el escenario hubo que anclarlo (Wikipedia: más de
  20.000 personas con malas condiciones climáticas).
- Villa María, 23-5-1998: incidentes en la previa, el Indio salió a hablarle a la gente antes de tocar
  (Wikipedia cita la frase: que esos quilombos aceleraban el fin de la banda). **Registro 3**: Wikipedia
  registra la muerte de un joven de 22 años que cayó de un tren.
- Patinódromo de Mar del Plata, 19 y 20-6-1999: más de 400 detenidos y tres autos quemados en la
  previa según la wiki; Wikipedia lo cuenta como uno de los episodios más graves. **Registro 3**.

---

## Frente C — La gente que falta en la Redondopedia

La Redondopedia tiene cinco `persona` (Indio, Skay, Poli, Semilla, Rocambole). **Walter Sidotti y
Sergio Dawi, que tocaron catorce años en la formación más conocida, no tienen artículo.** Tampoco los
de los dos primeros discos.

### RES-318 — Walter Sidotti

- **Rótulo:** hecho el período (Wikipedia: batería 1987–2001); leyenda lo demás (Wikipedia en español
  **no tiene artículo propio**, todo sale de la wiki de fans).
- **Hallazgo:** nació el 4-1-1961. Llegó a la banda por recomendación de Willy Crook, con quien tocaba
  en La Favorita, tras una audición con otros bateristas; primer show el 15-5-1987 en Caras + Caras.
  Después de 2001: La Favorita, España (2003–2005), Heroicos Sobrevivientes, The Comando Pickless, Los
  Decoradores (2016–2018). En 2013 grabó con Semilla y Dawi *La pajarita pechiblanca* en *Pajaritos,
  bravos muchachitos* del Indio, y en 2014 tocaron con él en Gualeguaychú (`RES-322` lo repite).
- **Dato de estudio:** en el sobre de *¡Bang! ¡Bang!* la banda lo llama "caballito valiente,
  triturador de tambores enojados" (la wiki transcribe el sobre).

### RES-319 — Sergio Dawi

- **Rótulo:** hecho (Wikipedia, artículo propio, revisión del 2026-10-05).
- **Hallazgo:** nació el 20-10-1955 en San Telmo. Hijo del director de cine Enrique Dawi y de María
  Teresa Corral, que tenía el sello La Cornamusa, donde trabajó de cadete. Nueve años en España. En
  1985 armó con Damián Nisenson el dúo escénico **Dosaxos2**; tocaron en la noche inaugural del
  Parakultural (1986), y ahí lo vieron Skay y Poli. Saxofonista de 1987 a 2001. Después: Dawi y los
  Estrellados, SemiDawi con Semilla, y desde 2016 Los Decoradores, conocidos desde 2018 como Kermesse
  Redonda (`los-decoradores`).
- **Leyenda que vale contar:** el Indio le atribuye a Dawi el fraseo de saxo que Skay pasó a la
  guitarra y se volvió el solo de *Jijiji*; Skay lo niega y cuenta que el tema salió en un balcón
  recordando a Hendrix (Wikipedia recoge las dos versiones).
- **URL:** https://es.wikipedia.org/wiki/Sergio_Dawi

### RES-320 — Willy Crook

- **Rótulo:** hecho (Wikipedia, revisión del 2026-09-14).
- **Hallazgo:** Eduardo Guillermo Crook, nacido en Villa Gesell el 28-8-1965, **murió el 27-6-2021**
  tras un ACV. Saxo en *Gulp!* y *Oktubre*; dejó la banda en 1987 (mayo o noviembre: `RES-301`) para
  la última gira de Los Abuelos de la Nada. Después, referente del funk local con los Funky Torinos,
  telonero de James Brown y David Bowie. **Su última vez con los Redondos fue el 19-6-1999 en el
  Patinódromo de Mar del Plata**, como invitado.
- **Leyenda (wiki de fans):** entró con 18 años, tras la salida de Gonzalo Palacios; antes, Luca le
  había ofrecido el saxo de Sumo para molestar a Pettinato.
- **URL:** https://es.wikipedia.org/wiki/Willy_Crook

### RES-321 — Juan "Piojo" Ábalos

- **Rótulo:** leyenda (solo wiki de fans; Wikipedia no tiene artículo).
- **Hallazgo:** baterista de 1983/84 a fines de 1986, en *Gulp!* y *Oktubre*. En 1978 le habían
  ofrecido el puesto y no le convenció; después lo contó como un error. Se fue por no llegar a un
  acuerdo económico por los discos. En noviembre de 2021 tuvo un ACV y Los Decoradores organizaron una
  colecta.

### RES-322 — Tito Fargo (Héctor D'Aviero)

- **Rótulo:** hecho el ingreso (Wikipedia: venía de la Hurlingham Reggae Band); leyenda lo demás.
- **Hallazgo:** segunda guitarra de 1984 a 1987, en *Gulp!* y *Oktubre*. Según la wiki de fans
  compuso con el Indio tres de los inéditos más queridos, *Mi genio amor*, *Rodando* y *El regreso de
  Mao* (`RES-328`), y que quedaran fuera de los discos fue una de las razones de su salida. En 2016
  invitó, con el Piojo, a armar Los Decoradores. Productor de *Todo es tan inflamable* de No Te Va
  Gustar.

### RES-323 — Gabriel "Conejo" Jolivet

- **Rótulo:** hecho (Wikipedia: artículo "Gabriel Jolivet", y el de la banda).
- **Hallazgo:** guitarrista de la primera formación (1978), con Pappo's Blues y Dulces 16 después.
  Invitado como segunda guitarra en Huracán 1993–94, y **en 1998 entra como miembro estable** junto con
  Hernán Aramberri (Wikipedia). La wiki de fans dice que se fue después de Racing por una disputa
  económica. Nació en República Dominicana.

### RES-324 — Sergio "Mufercho" Martínez

- **Rótulo:** hecho (prensa: *La Capital*, *Rolling Stone*, rock.com.ar; ninguna abierta).
- **Hallazgo:** **el primer monologuista** de los shows: abría los recitales con poesías y monólogos
  hasta que lo reemplazó Enrique Symns. Murió en La Plata en septiembre de 2023, a los 74 años. También
  le decían el Payaso Martínez y Vito Nervio. Él mismo reclamó en *Fuimos Reyes* haber inventado el
  nombre de la banda.
- **Leyenda (wiki de fans):** se disfrazaba de momia y lo cargaban hasta el escenario con música
  tenebrosa; la wiki lista los títulos de nueve monólogos, de 1978 a 1985.
- **URL:** https://es.rollingstone.com/arg-murio-el-mufercho-primer-monologuista-de-los-redondos

### RES-325 — Enrique Symns

- **Rótulo:** hecho (Wikipedia, revisión del 2026-10-15).
- **Hallazgo:** periodista y escritor (Lanús, 22-12-1945 – Buenos Aires, **16-3-2023**), fundador de
  la revista *Cerdos & Peces* (1983). Monologuista de los Redondos en los ochenta, el último resto del
  rock teatral. *Héroe del whisky* está dedicado a él (Wikipedia). El Indio contó en *Rolling Stone*
  (2005) que el pasaje al recital de rock puro se dio la noche en que la gente se le puso agresiva a
  Symns porque quería rock.
- **URL:** https://es.wikipedia.org/wiki/Enrique_Symns

### RES-326 — Sergio Poli, el violín

- **Rótulo:** leyenda (wiki de fans).
- **Hallazgo:** violinista platense (1961), de la orquesta del Teatro Argentino. Toca en *Espejismo* y
  *Un ángel para tu soledad* (*Lobo suelto*), y figura en *Scaramanzia*. Recordado por Huracán 1993 y
  1994.

### RES-327 — Los que tocaron sin ser la banda

- **Rótulo:** hecho donde lo dice Wikipedia, leyenda donde solo lo dice la wiki de fans.
- **Lito Vitale**: operador y teclados de *Gulp!*, grabado en MIA (Wikipedia); vuelve en el piano de
  *Blues de la artillería*.
- **Daniel Melero**: teclados en *Oktubre*. El Indio cuenta que lo llamaron para modernizar el sonido y
  no terminó de funcionar: quedaron unas campanas, unos ruidos, unas explosiones (memoir, PDF p. 230 /
  impresa 206). Las alarmas del final de *Jijiji* son de su teclado (memoir, PDF p. 237).
- **Hernán Aramberri**: programación de samplers desde *Lobo suelto*, miembro estable en 1998
  (Wikipedia), sonidista en vivo desde octubre de 1992 (wiki de fans).
- **Gustavo Gauvry**, **Mario Breuer**: los técnicos de *Bang!* y de *La mosca*, *Lobo suelto* y
  *Luzbelito* (sobres transcritos por la wiki).
- **El Soldado** (Rodolfo Luis González): plomo, después músico; aparece en el memoir en la anécdota
  de *Pierre, el vitricida* (`RES-331`).
- **Las Blacanblus** (Deborah Dixon, Mona Fraiman): coros en Huracán. **Las Bay Biscuits**: coros en
  los Demos RCA y en *Gulp!* (`RES-312`).

### RES-337 — Semilla Bucciarelli estuvo en el bajo desde 1982, no desde 1987

- **Rótulo:** hecho (Wikipedia, lista de miembros estables: "Semilla Bucciarelli – bajo (1982-2001)";
  coincide la wiki de fans).
- **Hallazgo:** Semilla entra en 1982, en lugar de Daniel "Pepe" Fenton, y toca en todos los discos de
  estudio, de *Gulp!* (1985) a *Momo sampler* (2000). Lo que empieza en 1987 es la formación de cinco
  que duró hasta el final, con Sidotti y Dawi (`RES-318`, `RES-319`). La wiki de fans agrega, como
  leyenda: nació el 3-7-1959 en Villa María (Córdoba); lo acercó a Skay el trabajo con Ricardo Soulé
  en 1980; después de la separación se dedicó a la pintura, y antes había hecho arte para *Cordero
  atado*.
- **Para `contenido`:** el artículo `semilla-bucciarelli` dice *"fue el bajo de la formación estable
  [...] desde 1987"*. Leído rápido, dice que entró en 1987, y tocó en *Gulp!* y en *Oktubre*.
- **URL:** https://es.wikipedia.org/wiki/Patricio_Rey_y_sus_Redonditos_de_Ricota (sección "Miembros
  estables")

---

## Frente D — Los temas que no están en los discos

El cancionero del sitio son los 105 de los discos de estudio (`RES-20`). La banda tuvo **otra
discografía, la que circuló en casetes piratas**, y es de lo más querido por la gente que sabe. No
tiene un solo artículo en la Redondopedia.

### RES-328 — El inventario de inéditos

- **Rótulo:** leyenda (wiki de fans), salvo donde se dice.
- **Honolulu**: un blues del Indio de antes de que existiera la banda. **Testimonio**: el Indio lo
  cuenta como parte del "caldo prebiótico" platense, cuando todavía no eran los Redondos (memoir, PDF
  p. 118 / impresa 108). Pepe Fenton, en *Fuimos Reyes*, la da como la primera canción que tuvieron
  lista. Volvió una vez, en Go! Disco, 12-8-1994.
- **Mi genio amor**, **Rodando**, **El regreso de Mao**: las tres con Tito Fargo (`RES-322`), de
  1984–85. *Mi genio amor* es el inédito más conocido; en el memoir la presenta como "la favorita de muchos"
  **Marcelo Figueras, el que pregunta**, no el Indio (PDF p. 279: es la entrada de la pregunta, como
  "Después viene Pierre el vitricida" en la p. 211). Corregido el 2026-10-16. Se la dedicó a Walter Bulacio en octubre de 1991 (wiki: registro 3).
- **De estos polvos, futuros lodos**: **testimonio**: la letra figura en el sobre interno de *Oktubre*
  pero la canción no está en el disco; la sacaron cuando el sobre ya estaba impreso (memoir, PDF
  p. 237 / impresa 212).
- **Nene nena**: de los Demos RCA (`RES-312`), tocada de 1982 a los noventa; Semilla la metió en la
  lista de Gualeguaychú 2014.
- **Un tal Brigitte Bardot**, **Pura suerte**: también en los Demos RCA (Wikipedia).
- **El gordo tramposo**, **Nene, no comprendo tus ambiciones**, **Soy un perdido eléctrico** ("El
  hombre eléctrico"), **Cua-cua amén**, **Roxana porcellana**, **Crazy jazz**, **Kazachok** (un solo
  registro, 1985), **¡Oh mami!** ("A toda velocidad", 1979; la wiki sugiere que de ahí sale *Vamos las
  bandas*).
- **El popurrí**: lo que tocaban enganchado a mitad o al final de los shows de 1985–86 (*El gordo
  tramposo*, *El Hidromedusa*, *El Super Sport*, *Honolulu*, *Imperialismo espacial*, *Un tal Brigitte
  Bardot*). **Testimonio** de los nombres: el Indio menciona *Imperialismo espacial*, *El
  Hidromedusa* y *El super sport* (este último, de Basilio, otro guitarrista) en el mismo pasaje que
  *Honolulu* (memoir, PDF p. 118).
- **Quema el celo** y **Rock de las abejas**: **hecho** (prensa, *Forbes Argentina*, *Tiempo
  Argentino*, sin abrir): el Indio los publicó en su canal en septiembre de 2021, grabados en las
  sesiones de *Luzbelito* y dejados afuera. Se tocaban en vivo desde los ochenta.
- **Reina Momo (La Tomatita)**: leyenda: según la wiki, iba a estar en *Momo sampler*, la mezcla no
  convenció, circuló en internet desde 2009–2010, y en 2021 se subió masterizada al canal del Indio. **La
  prensa no la encontró**: no usar como hecho.
- **Blues del noticiero**: **hecho**: el único inédito de *En directo* (Wikipedia, `RES-333`).
- **Las mañanitas del Rey David**: una improvisación de menos de cuarenta segundos en Gimnasia de La
  Plata, 24-6-1989, para calmar a la gente que cantaba contra la policía (wiki de fans).

### RES-329 — *Mejor no hablar de ciertas cosas* era una letra del Indio

- **Rótulo:** **testimonio** (memoir, PDF p. 262).
- **Hallazgo:** el Indio cuenta que Luca Prodan se llevó la letra de lo de Poli sin pedirla, que no le
  molestó, y que la versión de Sumo le parece mejor que la que hacían él y Skay. Sumo la grabó en
  *Divididos por la felicidad* (1985). La wiki de fans agrega que los Redondos la usaban en las
  pruebas de sonido.
- **Para el quiz:** pregunta firme y de las que premian al que sabe.

### RES-330 — Los nombres de antes

- **Rótulo:** hecho donde lo dice Wikipedia; leyenda lo demás (wiki de fans).
- *Rock para los dientes* se llamaba **"El snifa"** (Wikipedia).
- *Rock para el negro Atila* era **"Camila"** y existía desde 1982 (wiki; el memoir no la nombra así).
- *¡Lobo! ¿estás?* era **"No late más"** (1982).
- *Nuestro amo juega al esclavo* era **"La marcha"** o "La marchita", y *¡Bang! ¡Bang!* pudo llamarse
  **"Olor a tigre"**, por un verso de ese tema.
- *Ya nadie va a escuchar tu remera* también se conoce como **"Efímero"**.
- *Fusilados por la cruz roja*, como **"Serrucho"**.
- *Esa estrella era mi lujo* iba a ser "Una estrella era mi lujo" (manuscrito expuesto en la Biblioteca
  Nacional en 2015, según la wiki).
- **Para un juego:** "¿Cómo se llamaba antes?" es una mecánica de opción múltiple que no existe en el
  sitio; tres de los nombres tienen fuente firme (El snifa) o se pueden reforzar.

### RES-331 — Lo que se oye en los discos y casi nadie sabe

- **Rótulo:** testimonio donde está el memoir; leyenda lo demás.
- **Testimonio (memoir):** las bombas de *Fuegos de octubre* y las alarmas de *Jijiji* son del teclado
  de Melero (PDF p. 230 y 237). El puente de *La bestia pop* es la melodía de *Lawrence de Arabia*, y
  fue idea de Skay (memoir, PDF p. 209). *Pierre, el vitricida* sale de una noche en La Esquina
  del Sol con la sala inundada, el Soldado sacando una zapatilla eléctrica del agua (PDF p. 211 / impresa
  190); la wiki agrega que el Gordo Pierre, Simón Bayona, siempre negó la historia.
- **Leyenda (wiki de fans):**
  - Al final de *Juguetes perdidos*, después del fundido, suena al revés la introducción de *Ella
    baila con todos*. La voz femenina de *Invocación* también está al revés.
  - *Tarea fina* no estaba en el vinilo ni en el casete de *La mosca y la sopa*: entró de bonus en el
    CD, con la armónica de Luis "Mississippi" Robinson.
  - *Esa estrella era mi lujo* es el único tema hecho casi entero en el estudio, cuando faltaban temas
    para el disco.
  - *Ropa sucia* fue la primera base que grabaron para *¡Bang! ¡Bang!*. "Vivir solo cuesta la vida"
    tendría un eco en el tango *Traicionera*.
  - *Divina TV Führer* juega con el jingle de las pilas Eveready y con *1984* de Orwell.
  - *Ella debe estar tan linda* y *Mi perro dinamita* son los únicos dos temas que acreditan a Semilla
    como autor.
  - *Morta punto com* tiene samples de The Vampires Sound Incorporation y de Chemical Brothers, y su
    "Negro Chu Berri" es Chuck Berry.

### RES-332 — Olga Sudorova

- **Rótulo:** **testimonio** lo central (memoir, PDF p. 237); leyenda la interpretación.
- **Hallazgo:** los versos sobre Olga Sudorova y el vodka de Chernobyl figuran en el sobre interno de
  *Oktubre* pero no se oyen en el disco: eran lo que cantaban en vivo sobre la melodía del cierre de
  *Jijiji*. Abril de 1986 es Chernóbil, y el disco es de octubre de ese año. La wiki de fans dice que el
  nombre suena a chiste improvisado (Olga + sudor + -ova).
- **Para la Redondopedia:** completa el artículo `ji-ji-ji` y es mucho más lindo que la leyenda que ya
  está desmentida en `la-leyenda-de-ji-ji-ji`.

### RES-333 — *En directo*, el disco que falta

- **Rótulo:** hecho (Wikipedia).
- **Hallazgo:** el único álbum en vivo de la banda, de **1992**: "el pirata oficial". Junta fragmentos
  del Teatro de Verano de Montevideo (8-12-1989) y de Obras (29-12-1991); fue el primero masterizado
  en Estados Unidos, salió con dos tapas distintas y trae el inédito *Blues del noticiero*. *Rolling
  Stone* lo puso séptimo entre los mejores discos en vivo del rock argentino (Wikipedia).
- **Para la Redondopedia:** sería el `disco` número 11. La Redondopedia hoy tiene los diez de estudio.

### RES-334 — El escapulario, los covers, Hermética

- **Rótulo:** leyenda (wiki de fans).
- **El escapulario de Momo:** un medallón de metal con una cara gritando, diseñado por Rocambole, que
  venía con el CD de *Momo sampler* (2000) y se podía sacar.
- **Covers** de otros (la wiki tiene una lista con referencias): Hermética, Cabezones y Abel Pintos
  hicieron *Vencedores vencidos*; Los Palmeras, *La bestia pop*; Calamaro, *Superlógico*; Tan Biónica,
  *Queso ruso*; La Vela Puerca, *Gualicho*.
- **Hermética:** en Obras, 21-12-1990, el Indio tocó con una musculosa de Hermética y les agradeció el
  cover de *Vencedores vencidos* antes de *Ropa sucia*.

### RES-335 — Lo de 2026 que trae la wiki

- **Rótulo:** hecho el primero (prensa: *Perfil*, *Tiempo Argentino*, sin abrir); **sin confirmar** el
  resto.
- **Buscando a Patricio Rey** (documental en desarrollo): en 1985 unos estudiantes de cine iban a filmar
  un video de *Criminal Mambo* que no se terminó, y la banda los invitó a filmar el Paladium del
  28-12-1985. Las cintas Súper 8 se perdieron y aparecieron cuarenta años después en el altillo de una
  casa de San Miguel; restauradas en 4K. Realizadores según *Perfil*: Mariano Mucci, Aníbal Girbal y
  Augusto Giménez Zapiola. Sin fecha de estreno.
- **Sin confirmar, no usar:** la "Estación Patricio Rey" de YouTube (desde el 28-9-2026), un simple de
  Skay *Rebelión en la jaula* (7-10-2026) y *Super-Dios vs. El Águila Guerrera* como último simple del
  Indio (la wiki lo fecha el 14-6-2026, nueve días después de su muerte, `RES-04`: si es así, salió
  póstumo). La búsqueda no encontró nada de los tres.
- **URL:** https://www.perfil.com/noticias/cultura/estuvieron-perdidas-durante-40-anos-la-increible-historia-de-las-cintas-ineditas-de-los-redondos-que-aparecieron-en-un-altillo-a42.phtml

### RES-336 — Antes de los Redondos: La Cofradía y Diplodocum

- **Rótulo:** hecho (Wikipedia, artículo de la banda); leyenda el simple.
- **Hallazgo:** Skay y Rocambole venían de **La Cofradía de la Flor Solar**, comunidad de artesanos
  platenses y banda psicodélica (1968–1971), revelación del primer B.A. Rock (1970), con un disco en
  1971. Al mismo tiempo Skay tocaba el bajo en **Diplodocum Red & Brown**, que hacía versiones en
  inglés. En un recital de las dos bandas en el Teatro Opera de La Plata (noviembre de 1969) Skay
  conoció a Poli. El Indio había empezado como letrista y dibujante de **Dulcemembriyo**, con Federico
  Moura y Daniel Sbarra, que después fueron Virus.
- **Leyenda (wiki de fans):** el simple de Diplodocum de 1969, *Blues del hombre de la cara azul /
  Blind Sex*, con Guillermo Beilinson en la voz.

---

## Qué le sirve a cada parte del sitio

| Dónde | Qué | Fichas |
|---|---|---|
| **Redondopedia, `persona` nuevas** | Walter Sidotti, Sergio Dawi, Willy Crook, Tito Fargo, el Piojo Ábalos, el Conejo Jolivet, Mufercho, Enrique Symns. Los dos primeros son los que más faltan | `RES-318`..`RES-325` |
| **Redondopedia, `disco` nuevo** | *En directo* (1992) | `RES-333` |
| **Redondopedia, `concepto` nuevo** | "Los temas que no están en los discos": inéditos, popurrí, piratas. Y "Los monologuistas" (Mufercho, Symns, el rock teatral) | `RES-328`, `RES-324`, `RES-325` |
| **Redondopedia, `hito` nuevos** | Pan Caliente 1982 · Racing 1998 · River 2000 · Olavarría 1997 y Tandil · la última noche, Córdoba 2001 (las tres últimas, con partes en registro 3) | `RES-312`, `RES-310`, `RES-309`, `RES-308`, `RES-307` |
| **Redondopedia, `leyenda` nueva** | Olga Sudorova (es testimonio el centro, leyenda el nombre) | `RES-332` |
| **Redondopedia, artículos que existen** | `debut-en-obras` (Carlitos del Sur), `ji-ji-ji` (Sudorova, el solo de Dawi o de Skay), `la-formacion` (Cofradía, Diplodocum, Dulcemembriyo, noches sin el Indio), `oktubre` (Melero, *De estos polvos*), `los-decoradores` (quiénes son) | varias |
| **Quiz, preguntas con dos fuentes** | Quién cantó en lugar del Indio en GEBA 1982 · de quién era la letra de *Mejor no hablar de ciertas cosas* · dónde fue el recital más grande · por qué terminaron en Tandil en 1997 · cómo se llamaba antes *Rock para los dientes* · qué disco presentaron en Racing 1998 · cuál fue el único disco en vivo · qué tema cierra el sobre de *Oktubre* sin estar en el disco | `RES-313`, `RES-329`, `RES-309`, `RES-308`, `RES-330`, `RES-310`, `RES-333`, `RES-328` |
| **Más o menos** | Solo cifras con dos fuentes o rotuladas como muestra: 70.000 en River, 50.000 en Racing, 21.000 en Tandil; "en cuántas de las 99 listas sonó X" | `RES-302`, `RES-309`, `RES-310`, `RES-308` |
| **"En vivo" y "Armá tu recital"** | Qué abría y qué cerraba, lo que más sonó, dónde se estrenó cada disco | `RES-302`..`RES-306` |
| **`recitales.json`** | 99 listas enteras con licencia CC-BY-SA. **Es una decisión de `arquitectura` y del usuario**, ver abajo | `RES-300`, `RES-301` |

## Lo que queda abierto, y para quién

1. **`arquitectura` y el usuario: ¿entran las 99 listas a "En vivo"?** `CTR-19.8` ya prevé una fuente
   `cc-by-sa` 3.0 dentro de un archivo `cc-by-sa-4.0`, con la consecuencia escrita en
   `ARQ-schema-recitales.md`: **todo `recitales.json` pasa a BY-SA 4.0**. Las fuentes de hoy son
   MusicBrainz y, desde `INV-425`, Discogs: las dos CC0, así que no hay mezcla imposible. Es la mitad
   de `T-425` que `INV-425` dejó como "pista para los huecos": son 99 noches contra las 29 de Discogs. Las listas de la wiki tienen errores
   (`RES-301`): conviene rotular la fuente y no la lista como verdad.
2. **`contenido`:** los artículos de la tabla de arriba. Los de registro 3 (River, Córdoba, Villa
   María, Atenas 1990) siguen `CNT-06`.
3. **`investigador`, la próxima vuelta:** abrir las notas de prensa que acá solo se vieron por el
   buscador (Mufercho, *Buscando a Patricio Rey*, los inéditos de 2021), y la nota de *La García* con la
   frase de Poli sobre Santa Fe 2001. Resolver `RES-301` (Willy Crook mayo o noviembre de 1987) con
   *Fuimos Reyes* o con el memoir.
4. **Nada de esto toca los 105 temas** ni el cancionero: los inéditos no tienen letra fichada ni
   audio en el sitio, y no se les busca.
