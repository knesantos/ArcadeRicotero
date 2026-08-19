# INV-22 — De dónde salen las tapas, y una cláusula de Spotify que cambia `ADR-01`

> Cuarta tanda de la sesión paralela, 2026-08-19. Encargo del usuario: conseguir imágenes
> de tapas y de arte de Rocambole para usar en la página, sumando como fuente el Instagram
> **bestiarioredondo** y su Drive.
>
> **Método:** seis vías investigadas en paralelo, cada una con refutación adversarial de sus
> afirmaciones de licencia. 10 agentes, 0 errores, ~900k tokens. Dos afirmaciones se
> cayeron en la verificación y están marcadas.
>
> Consume: `D-04`, `D-07`, `RES-03`, `RES-06`, `RES-09`, `UX-04`.
> **Afecta directamente: `ADR-01`, `BR-06`, `CNT-01`, `US-04`.**
>
> **Numeración:** rango `RES-20`–`RES-29`. Consume `RES-25` y `RES-26`.
>
> ⚠ **Esto no es dictamen legal.** En todo el texto se separa lo que una fuente **dice
> textualmente** de lo que es **interpretación**.

---

## RES-25 — Las seis vías para obtener tapas: ninguna resuelve el derecho

### Matriz de decisión

| Vía | Cobertura | Qué permite (textual) | Resolución | Veredicto |
|---|---|---|---|---|
| **Cover Art Archive / MusicBrainz** | **10/10** | **Nada.** *"All images are copyrighted by their respective copyright owners"* · *"Use the images at your own risk"* | 250 / 500 / 1200 px | **Conducto técnico, NO base de derechos.** El único que no impone contrato adverso |
| **Spotify Web API** | 10/10 | **Prohibido.** Ver `RES-26` | 640 / 300 / 64 px | **No usable** |
| **Wikipedia + Commons** | es 0/10 · en **5/10** · Commons 0/10 | `NonFree`. Textual: *"Any other uses of this image, on Wikipedia or elsewhere, may be copyright infringement"*. Fair use autolimitado a EE.UU. | 316×316 px | **No usable** |
| **Discogs** | 10/10 | "Restricted Data": licencia **personal**, prohíbe uso comercial y transferir a terceros, exige no cachear más de **6 h** | 600 px | **No usable** |
| **Deezer / Apple / Last.fm / Genius / RYM** | varía | Deezer: *"images are not allowed to be stored for legal reasons"*. Apple: promo content *"not for entertainment purposes"*. Last.fm 5.1.8: imágenes **expresamente excluidas** del acuerdo | sobra | **No usables** |
| **Bestiario Redondo** | **0/10 tapas** | **Nada declarado.** Cero licencia, cero contacto, propietario del Drive oculto | 30–50 MB | **No usable** |
| **Canales oficiales de Rocambole** | 0/10 hoy | Ningún término publicado. Solo posturas | — | **Indeterminado** — ver abajo |

### 🔴 La distinción que hace caer todo el razonamiento intuitivo: contenedor ≠ contenido

- **MusicBrainz licencia sus datos como CC0**, y su propia página lo acota textualmente:
  *"The MusicBrainz dataset does not contain cover art. Cover art is provided by the Cover
  Art Archive."* El CC0 cubre el **registro**, no las imágenes.
- **El Cover Art Archive no tiene derechos sobre las tapas.** Las suben usuarios escaneando
  su ejemplar. Nadie declara licencia ni afirma titularidad. El régimen es tolerancia más
  *notice-and-takedown*.
- **Discogs lo dice explícito:** la carga está en el uploader, y la base legal que invoca es
  *fair use* y *First Sale Doctrine* — **dos doctrinas estadounidenses que no existen en
  Argentina** (`RES-03`).
- **Spotify, Deezer y Apple licencian contenido DE los titulares PARA su servicio.** Te dan
  un permiso angosto de mostrar la tapa dentro de una integración con ellos. No te
  transfieren un gramo de derecho sobre la obra subyacente.

**En una línea: nadie puede licenciar lo que no le pertenece.** El autor de las diez tapas
es **Rocambole, vivo**, con derecho de autor y derecho moral vigentes; el catálogo está bajo
**Erks S.A.** (`RES-09`). Ninguna base de datos es parte de esa cadena.

**Sacar la imagen de Discogs, de Spotify o del CAA no lava nada.** La posición legal de
RicotaArcade es idéntica a la que tendría escaneando un vinilo propio.

> **Regla de redacción para todo el proyecto:** cualquier texto que diga o insinúe *"las
> tapas están licenciadas / son libres porque vienen de X"* **sería falso**. Ese es el peor
> resultado posible de esta investigación.

### Las dos afirmaciones que se cayeron en la refutación

Marcadas para que no vuelvan a circular:

1. **CAÍDA — el `life-span` de MusicBrainz.** El MBID
   `956301d0-4b3c-4ffc-9898-b39305d25112` se confirmó, pero MusicBrainz da fin de la banda
   el **2002-11-02**, que contradice la cronología documentada de `RES-05`: último show 4 de
   agosto de 2001, disolución anunciada en noviembre de 2001.
   **Regla operativa: usar el MBID como identificador, nunca el `life-span` como hecho.**
   Si entra al banco sin rotular, es el "Huracán 89" otra vez.
2. **CAÍDA — "los 10 discos tienen tapa en el CAA" como vía de obtención.** Los HTTP 200 se
   sostienen, pero la afirmación induce cuatro errores. El grave:
   **💎 la tapa de *Oktubre* que devuelve el CAA sale de un CD de 1993, `country=US`, 9
   pistas — no del LP argentino de 1986.** Para un juego de adivinar la tapa eso es cargar
   la tapa equivocada. Además: `approved:true` significa "la comunidad de MusicBrainz aprobó
   la edición", **no** "los derechos están despejados"; el 200 es reversible (existe flag
   `darkened` y canal de takedown); y **"Naranja"/"Gris" desambigua por color, no por
   volumen**, con mapeo contraintuitivo — por tracklist, **Gris = Lobo suelto**,
   **Naranja = Cordero atado**.

### Sobre bestiarioredondo — no es lo que esperábamos

- **No tiene tapas. Ninguna.** **La unidad de esa obra es la canción, no el disco:** hay una
  pieza por tema, no una por álbum. Para `US-04` **no aporta absolutamente nada**.
- Los ~50 archivos listables sin sesión van de "¡Lobo! ¿Estás?" a "Mi Genio Amor" (A–M);
  la colección real es mayor. Los destacados de Instagram sí llevan nombre de álbum y son
  siete: faltan *Un baión*, *Último bondi* y *Momo Sampler*.
- **No declara absolutamente nada sobre derechos.** Se buscaron explícitamente las palabras
  licencia, permiso, créditos, Creative Commons, contacto, IA — **ninguna aparece**. Es un
  negativo verificado, no un "no encontré".
- **El propietario del Drive figura literalmente como "Se ocultó el propietario".** No hay
  nombre, ni razón social, ni mail. **Sin contacto no hay forma de pedir permiso**, que es
  lo único que volvería utilizable el material.
- **Que se pueda descargar no es una licencia.** La carpeta se llama "Originales Alta
  Calidad" y tiene botón "Descargar todo": eso es funcionalidad estándar de Drive.
- **El rótulo "Originales" no se sostiene como declaración de autoría.** La carpeta contiene
  al menos una obra de un tercero identificado (*CUENTOS DE RICOTA*, © 2020 Daniel Motta) y
  dos piezas acreditadas a otro ("Dieguito de ricota").
- **Y ese PDF de terceros usa la tapa de *Luzbelito* como portada, con una línea de crédito
  y sin licencia.** O sea: la postura de derechos del entorno es laxa. Que ellos reutilicen
  así **no habilita a RicotaArcade a hacer lo mismo**.
- **🔴 No se vio ni una sola imagen.** La conclusión "obra original de ilustrador" sale de
  evidencia estructural, no de inspección visual. **No se pudo descartar generación por
  IA**: cuenta anónima, ~50 piezas de 30–50 MB producidas entre febrero y agosto de 2026,
  sin autor ni proceso documentado. **Nadie debería dar esto por cerrado hasta que un humano
  abra tres o cuatro archivos y los mire.**

### La vía del permiso directo a Rocambole: escribir sí, planificar sobre eso no

- **El sitio web oficial está caído.** Hay **cuatro cuentas de Instagram** que se declaran
  oficiales, **ninguna verificada**, y dos Gmail distintos.
- La tienda vende obra física (serigrafías 70×50 firmadas). **No hay repositorio digital ni
  área de prensa.** Comprar una serigrafía no otorga ningún derecho de reproducción digital.
- **Cero precedentes públicos** de licencia otorgada a un tercero o fan site.

**Evaluación honesta: escribir es barato y vale la pena; planificar la v1 asumiendo
respuesta, no.** Tres problemas de fondo: (a) sin cuenta verificada no hay forma de
confirmar que quien conteste tenga facultades para licenciar — un "dale" por DM no cierra
una nota de derechos; (b) **no está verificado si Rocambole conserva la titularidad del arte
de tapa o si fue cedida al grupo o a Erks S.A.**; si está cedida, su permiso no alcanza;
(c) plazo indefinido.

Si se escribe, pedir **por escrito y explícito**: reproducción en baja resolución de las diez
tapas dentro de un juego web sin fines de lucro y sin publicidad, con crédito. Y dejar
constancia de que **la interfaz NO usa obra de Rocambole sino arte original** (`D-04`) — eso
es un argumento a favor, no una cortesía.

### Recomendación

1. **Descartar en firme:** Spotify, Wikipedia/Commons, Discogs, Deezer, Apple, Last.fm,
   Genius, RYM y Bestiario Redondo. Ocho vías cerradas.
2. **Conducto técnico, si el gate de derechos alguna vez se abre: Cover Art Archive.**
   No mejora la posición legal; simplemente no la empeora. **Copia local, no hotlink** —
   varias URLs vuelven en `http://` (mixed content), todo responde 307 cross-host, y si
   bajan la imagen el juego se rompe solo.
3. **Tamaño: 250 px.** Disponible para los diez, coherente con "baja resolución" del brief.
   La resolución nunca fue el cuello de botella.
4. **🔴 Esta ficha NO habilita el juego de tapas.** La base legal tiene que salir de la nota
   de derechos, apoyada en el Art. 10 de la Ley 11.723. Esa pregunta **no está resuelta ni a
   favor ni en contra**, y el orden de corte del brief ya pone a `US-04` como el primero que
   se cae.
5. **Aprovechable de lo descartado:** las 5 imágenes de 316 px de en.wikipedia sirven como
   **referencia visual interna** —para saber cuál es cada tapa— sin publicarlas. Y **Commons
   sí tiene fotos de la banda con licencia libre declarada**: la más sólida,
   `Skay Beilinson en Resistencia, Chaco, 2023.jpg`, 4624×3472, **CC BY-SA 4.0**, obra propia
   con autor identificado. Material legítimo, que no toca el problema de las tapas.

---

## ⚠ RES-26 — Spotify prohíbe explícitamente los juegos y los quizzes de trivia

**Apareció investigando imágenes y no es sobre imágenes. Es el hallazgo más importante de
toda la sesión, y cae directo sobre `ADR-01` y `BR-06`.**

### El texto

- **Hallazgo:** la **Spotify Developer Policy**, sección **III, cláusula 2**, dice
  textualmente: **"Do not create a game, including trivia quizzes."**
  URL: https://developer.spotify.com/policy
  Consultado: 2026-08-19 · **verificado — obtenido en dos fetches independientes de la
  página oficial más una tercera confirmación por búsqueda**

No hay interpretación posible del texto en sí: es una prohibición explícita y literal.
**RicotaArcade es cuatro juegos, y `US-01` es literalmente un quiz de trivia.**

### Y hay una segunda capa, independiente de la primera

Las **Design / Branding Guidelines** dicen, textualmente:

- *"Artwork must be kept in its original form. Don't animate or distort it in any way. This
  includes applying overlays and blurring."*
- *"Don't crop the artwork in any way."*
- *"Don't overlay images or text on top of the artwork."*

URL: https://developer.spotify.com/documentation/design · Consultado: 2026-08-19 ·
**verificado**

**Interpretación, marcada como tal:** el juego "adivinar la tapa" con reveal progresivo es,
mecánicamente, ocultar y revelar una imagen de a poco. Eso es aplicar overlay, recortar o
desenfocar — las tres prohibidas por nombre. **Aunque la cláusula de juegos no existiera, la
mecánica central de `US-04` chocaría con las reglas de display.**

### Lo que esto le hace a `ADR-01`

`ADR-01` quedó entre **A (embed)** y **B (deep link)**. Esta ficha las separa:

- **Opción A (embed) queda gravemente comprometida.** El embed es un producto de la Spotify
  Platform y cae bajo la Developer Policy. Un sitio de juegos que lo usa está haciendo
  exactamente lo que III.2 prohíbe.
- **Opción B (deep link) probablemente sobrevive, pero no está verificado.** Un link
  `open.spotify.com/track/...` es una URL pública que abre la app o el sitio de Spotify;
  **discutiblemente no es "usar la Spotify Platform"**. `RES-09` ya mostraba que el catálogo
  está publicado oficialmente ahí desde el 28-jul-2017, así que el destino es real.
- **El contra:** los Developer Terms dicen *"If you use or otherwise access the Spotify
  Platform, you will be deemed to have accepted the Developer Agreement"*. **Interpretación
  del investigador, no verificada:** que eso alcance también a oEmbed y a pegarle a
  `i.scdn.co` sin registrar app. Sobre el deep link simple no hay pronunciamiento.

**Esto no rompe el proyecto.** `ADR-01` ya tiene el fallback cerrado, y `BR-06` fue redactada
—según el tablero— para prometer **acceso** al tema y no reproducción íntegra. Lo que hace
esta ficha es **inclinar `ADR-01` hacia B con un argumento nuevo y fuerte**, y advertir que
la opción A no era solo técnicamente floja: era contractualmente prohibida.

### Lo que NO está verificado, y hay que decirlo

- **Si la prohibición tiene excepción escrita para uso sin fines de lucro, educativo o de
  fan site.** No se encontró ninguna, **pero no se leyó la Policy cláusula por cláusula**.
  Ausencia de evidencia no es evidencia de ausencia.
- **Si un deep link simple cuenta como "acceder a la Spotify Platform".** Es la pregunta que
  decide si la opción B sobrevive. Sin responder.
- Los hilos del foro oficial donde personal de Spotify aclara el alcance de la prohibición
  **devolvieron HTTP 403**. Hay sustancia por búsqueda, **no cita textual de un moderador**.
- La **numeración** de las cláusulas de los Developer Terms viene del resumidor, no de
  lectura carácter por carácter. **El texto está verificado; la numeración habría que
  confirmarla** antes de citarla formalmente en la nota de derechos.

### Y una advertencia que vale para todo el equipo

Spotify **no es una fuente de licencia**. Licencia contenido *de* los titulares *para su*
servicio. Si alguien lee esto como "usamos la API y listo", está mal leído: no transfiere
ningún derecho sobre la obra de Rocambole ni sobre lo que administre Erks S.A.

---

## Sin resolver

**Bloqueantes de la decisión:**

1. **La pregunta jurídica de fondo:** si mostrar tapas en baja resolución con crédito y sin
   fines de lucro encuadra en el Art. 10 de la Ley 11.723. **Ninguna de las seis vías la
   responde y ninguna la va a responder.** Se cierra con dictamen de un abogado argentino de
   propiedad intelectual, o con permiso escrito del titular.
2. **Quién es el titular del arte de tapa** — Rocambole contra cesión a Erks S.A. / Del
   Cielito / Wormo. Determina a quién pedirle permiso. No hay fuente pública.
3. **Si alterar la obra** (recorte, desenfoque, reveal progresivo) toca el **derecho moral**
   del autor vivo.
4. **Si la prohibición de juegos de Spotify admite excepción**, y si el deep link simple cae
   o no bajo la Developer Policy.

**Bloqueantes de carga, si el gate alguna vez se abre:**

5. Mapeo Naranja/Gris → Cordero atado / Lobo suelto: resuelto por tracklist, **falta
   confirmar visualmente**.
6. **Verificación visual humana de las 10 tapas contra la edición original argentina.**
   El caso *Oktubre* ya se sabe que falla.
7. Dimensiones reales en píxeles: en la vía CAA solo se midieron bytes y códigos HTTP.

**De menor peso:** los Términos de Uso completos de Internet Archive no se pudieron leer
(JS-only, tampoco por Wayback); no hay forma de consultar si alguna vez hubo reclamo o
takedown de estas tapas; y la identidad y autoría real detrás de Bestiario Redondo, incluida
la hipótesis de IA, sigue abierta.
