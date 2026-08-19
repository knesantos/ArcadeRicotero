# INV-01 — Fichas iniciales

> Producidas por `investigador` el 2026-08-19, en el ciclo de `/kickoff`.
> Escritas por el hilo principal: `investigador` es read-only por diseño.
>
> Consume: `D-06`, `D-07`, `D-08`. Bloquea: `ADR-01`, `CNT-01`.

---

## RES-01 — Estado real de las APIs de Spotify

**Contexto de la pregunta:** `ADR-01` tiene que elegir vía de reproducción sabiendo que
**el jugador no tiene Premium** (`D-08`). Esta ficha es la evidencia que lo desbloquea.

### (a) `preview_url` de la Web API — no se puede usar

- **Hallazgo:** desde el **27 de noviembre de 2024** Spotify restringió el acceso a
  `preview_url` —junto con `audio-features`, `recommendations` y `related-artists`— para
  aplicaciones **nuevas** registradas ese día o después, y para apps existentes en modo
  desarrollo sin extensión de cuota.
  URL: https://developer.spotify.com/blog/2024-11-27-changes-to-the-web-api
  Consultado: 2026-08-19 · **verificado**
- **Hallazgo:** el campo sigue documentado en la referencia de `Get Track`, pero marcado
  `Nullable, Deprecated`, con la nota de que los clips de preview no pueden ofrecerse
  como servicio o producto independiente.
  URL: https://developer.spotify.com/documentation/web-api/reference/get-track
  Consultado: 2026-08-19 · **verificado**
- **Conclusión para el proyecto:** RicotaArcade sería una app nueva. **No puede apoyarse
  en `preview_url`.** El riesgo 5 del brief queda confirmado, no solo sospechado.

### (b) Web Playback SDK — exige Premium

- **Hallazgo:** la documentación dice que el SDK requiere suscripción Premium, excluyendo
  además los tipos de suscripción solo-móvil.
  URL: https://developer.spotify.com/documentation/web-playback-sdk
  Consultado: 2026-08-19 · **verificado**
- **Conclusión:** confirma `D-08` con fuente primaria. Descartado como vía principal.

### (c) Embed / iframe sin login y sin Premium — parcialmente verificado

- **Hallazgo:** la documentación oficial de troubleshooting confirma que existen
  condiciones bajo las cuales el embed reproduce solo un clip de preview de menos de 30
  segundos (por ejemplo si falta `allow="encrypted-media"` o si se modificó el código).
  No especifica el comportamiento por defecto de un usuario anónimo.
  URL: https://developer.spotify.com/documentation/embeds/tutorials/troubleshooting
  Consultado: 2026-08-19 · **verificado (parcial)**
- **LEYENDA TÉCNICA, con buena base empírica:** el patrón "sin sesión iniciada da preview
  de ~30 s; con sesión Premium en el mismo navegador da el tema completo" circula de forma
  consistente en el foro oficial de la comunidad de desarrolladores, pero **no está
  redactado así en la documentación primaria**.
  URL: https://community.spotify.com/t5/Spotify-for-Developers/Only-showing-preview/td-p/5485141
  Consultado: 2026-08-19 · **rotulado como leyenda técnica, no como hecho**
- **Conclusión para el proyecto:** lo esperable por defecto para nuestro jugador —sin
  Premium— es un **preview corto, no el tema completo**. Ver la alerta de coherencia al
  final de esta ficha.

### (d) Deep link a la app en móvil — es recomendación, no garantía

- **Hallazgo:** Spotify recomienda que, si no se puede detectar la app instalada, los
  links `open.spotify.com` se abran en el navegador del sistema o en un webview. Es un
  patrón de implementación (universal link con fallback), no un comportamiento del sistema
  operativo garantizado por Spotify.
  URL: https://developer.spotify.com/documentation/ios/tutorials/content-linking
  Consultado: 2026-08-19 · **verificado**

### ⚠ Alerta de coherencia que sale de esta ficha

`Docs/BRIEF.md` promete, como requisito transversal de la v1, que al revelar la respuesta
**"se puede escuchar el tema completo vía Spotify"**. La evidencia de (a), (b) y (c) dice
que para un jugador sin Premium eso probablemente **no se cumple dentro del sitio**: el
embed daría un preview corto, no el tema entero.

No es un detalle de implementación: toca la definición de "Listo" de la v1. Las salidas
posibles son reformular la promesa (por ejemplo, "se puede saltar al tema completo en
Spotify", vía deep link, que sí es honesto), o aceptar el preview dentro del sitio, o
declarar que la escucha completa depende de que el jugador tenga su propia sesión. La
decisión es de `producto` con la vía técnica de `arquitectura` (`ADR-01`).

---

## RES-02 — Discografía de estudio de Patricio Rey y sus Redonditos de Ricota

**Método:** cruzado entre Wikipedia en español, Wikipedia en inglés y Discogs.
Consultado: 2026-08-19 · **verificado**

| Álbum | Año | Sello |
|---|---|---|
| Gulp! | 1985 | Wormo |
| Oktubre | 1986 | Wormo / Del Cielito (edición conjunta) |
| Un baión para el ojo idiota | 1988 | Wormo (reedición en CD 1991 en Del Cielito, catálogo Discogs SW 1015) |
| ¡Bang! ¡Bang!... Estás liquidado | 1989 | Del Cielito |
| La mosca y la sopa | 1991 | Del Cielito |
| Lobo suelto, cordero atado (vol. 1 y vol. 2) | 1993 | Del Cielito (álbum doble, ambos volúmenes el mismo día) |
| Luzbelito | 1996 | Ver discrepancia |
| Último bondi a Finisterre | 1998 | Patricio Rey Discos |
| Momo Sampler | 2000 | Patricio Rey Discos |

### Discrepancias — sin promediar, para que `contenido` decida

1. **Sello de Luzbelito (1996).** Wikipedia en español y Discogs dicen Del Cielito;
   Wikipedia en inglés dice Patricio Rey Discos. **No resuelto.** Dos de tres fuentes
   especializadas dan Del Cielito. *No usar como pregunta de quiz hasta resolverlo.*
2. **Conteo total: 9 o 10 álbumes.** Depende de si *Lobo suelto, cordero atado* se cuenta
   como un álbum doble o como dos. Hay fuentes agregadoras que dicen "10 álbumes" pero
   listan 9 títulos. *Una pregunta de quiz del tipo "¿cuántos discos de estudio editaron?"
   es una trampa: tiene dos respuestas defendibles.*
3. **Fecha de Lobo suelto, cordero atado.** Un agregador de búsqueda la dio como 1994,
   contra 1993 en Wikipedia (ambas), Discogs y sitios especializados. Tratado como **error
   del agregador**, no como discrepancia real entre fuentes.
4. **Naturaleza de Momo Sampler.** Discutible si es álbum de estudio "puro" o incluye
   recopilación y reelaboraciones. Nota para `contenido`, no discrepancia factual.

---

## RES-03 — Marco de derechos para un fan site sin fines de lucro (Argentina)

> Esta ficha trae **lo que las fuentes dicen**. No es asesoramiento legal, y donde termina
> la evidencia está marcado explícitamente.

### Términos de servicio de YouTube

- **Hallazgo:** los términos prohíben explícitamente descargar contenido, salvo
  autorización expresa de YouTube o mediante una función que el propio servicio habilite.
  URL: https://www.youtube.com/static?template=terms
  Consultado: 2026-08-19 · **verificado**
- **Consecuencia directa sobre `D-06`:** el fundamento con el que se tomó esa decisión
  —"no hay restricciones fuertes sobre obras de fans"— **queda contradicho por la fuente
  primaria** en lo que respecta al acto de descargar. Es la posición del usuario, no un
  hecho. La decisión sigue siendo suya y sigue en pie; lo que cambia es que ahora hay
  evidencia fechada en contra de su premisa, y está registrada.

### Derecho de cita en Argentina — no existe el *fair use*

- **Hallazgo:** Argentina **no** tiene la doctrina de *fair use* estadounidense. Tiene el
  **derecho de cita** del Art. 10 de la Ley 11.723: hasta **1000 palabras** de obra
  literaria o científica, u **8 compases** de obra musical, con fin didáctico o
  científico, y solo "las partes indispensables".
  URL: https://servicios.infoleg.gob.ar/infolegInternet/anexos/40000-44999/42755/texact.htm
  Consultado: 2026-08-19 · **verificado — fuente primaria**
- **Hallazgo:** para retratos e imágenes, el Art. 31 permite la publicación con fines
  científicos, educativos, culturales o de interés público; el Art. 35 lo amplía hasta 20
  años después de la muerte del retratado.
  URL: https://www.derechodeautor.org.ar/recursos/abc-sobre-derechos-de-autor/definiciones-basicas/limitaciones-y-excepciones-al-derecho-de-autor/
  Consultado: 2026-08-19 · **verificado — fuente secundaria especializada, no
  gubernamental**

### Dónde termina la evidencia y empieza la interpretación

Ninguna fuente consultada dice que un fan site sin fines de lucro esté cubierto por el
Art. 10 al usar tapas de Rocambole, fragmentos de audio bajados de YouTube, o letras
—completas o parciales— fuera del límite de compases y palabras. Es **zona gris**: no se
encontró ley ni jurisprudencia que la resuelva.

Cualquier afirmación del tipo "esto es legal porque somos fans y no lucramos" es
**interpretación, no hallazgo**. Esta ficha no la respalda ni la desmiente.

### Los dos números que sí son accionables hoy

Son los datos más útiles de esta ficha porque son cuantitativos y caen directo sobre
decisiones abiertas:

- **8 compases** es el techo del derecho de cita musical. Le da a `CTR-01` de
  `arquitectura` un criterio con fuente para la duración máxima del fragmento, en vez de
  un número elegido a ojo.
- **1000 palabras** es el techo para obra literaria, muy por encima de lo que
  "completar la letra" necesita mostrar. La regla `BR-03` de `producto` (2/1/0 versos de
  contexto) queda cómodamente por debajo.

---

## Sin resolver en esta ronda

- Si **Rocambole** tiene alguna licencia o postura pública conocida sobre el uso de su
  obra por parte de fans. No estaba en el pedido; sería la ficha más valiosa para el juego
  4, que es justo el primero en caer si hay que recortar (`D-05`).
- **Jurisprudencia argentina sobre fan sites musicales.** No se encontró ningún caso.
  Puede no existir, o no ser indexable por búsqueda web estándar.
- Las **11 preguntas** que `contenido` dejó en
  `Docs/SUGERENCIAS/CNT-para-investigador-derechos.md`, que llegaron después de que esta
  ronda arrancara.
